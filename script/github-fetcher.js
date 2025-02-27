// github-fetcher.js
class GitHubFetcher {
    constructor(options = {}) {
      this.username = options.username || '';
      this.repoLimit = options.repoLimit || 6;
      this.excludeRepos = options.excludeRepos || [];
      this.includeRepos = options.includeRepos || [];
      this.targetElement = options.targetElement || '#projects-container';
      this.token = options.token || null; // GitHub Personal Access Token (optional)
      this.cacheTime = options.cacheTime || 3600000; // Default: 1 hour in milliseconds
    }
  
    /**
     * Initialize the fetcher and load projects
     */
    async init() {
      try {
        const cachedData = this.getCachedData();
        if (cachedData) {
          this.renderProjects(cachedData);
          // Refresh in background if cache is older than half the cache time
          const cacheAge = Date.now() - cachedData.timestamp;
          if (cacheAge > this.cacheTime / 2) {
            this.fetchAndRenderProjects(true);
          }
        } else {
          await this.fetchAndRenderProjects();
        }
      } catch (error) {
        console.error('GitHub Fetcher initialization error:', error);
      }
    }
  
    /**
     * Get cached repository data
     */
    getCachedData() {
      const cachedData = localStorage.getItem('github-repos-cache');
      if (!cachedData) return null;
      
      try {
        const parsedData = JSON.parse(cachedData);
        const isExpired = Date.now() - parsedData.timestamp > this.cacheTime;
        return isExpired ? null : parsedData;
      } catch (e) {
        return null;
      }
    }
  
    /**
     * Cache repository data
     */
    cacheData(data) {
      const cacheObject = {
        repos: data,
        timestamp: Date.now()
      };
      localStorage.setItem('github-repos-cache', JSON.stringify(cacheObject));
    }
  
    /**
     * Fetch repositories from GitHub API
     */
    async fetchRepos() {
      const headers = {
        'Accept': 'application/vnd.github.v3+json'
      };
      
      if (this.token) {
        headers['Authorization'] = `token ${this.token}`;
      }
  
      let url = `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`;
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      let repos = await response.json();
      
      // Filter repos
      if (this.includeRepos.length > 0) {
        repos = repos.filter(repo => this.includeRepos.includes(repo.name));
      } else {
        repos = repos.filter(repo => !repo.fork && !this.excludeRepos.includes(repo.name));
        
        // Sort by stars and limit
        repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        repos = repos.slice(0, this.repoLimit);
      }
      
      return repos;
    }
  
    /**
     * Fetch README content for a repository
     */
    async fetchReadme(repo) {
      try {
        const headers = {
          'Accept': 'application/vnd.github.v3.html+json'
        };
        
        if (this.token) {
          headers['Authorization'] = `token ${this.token}`;
        }
        
        const response = await fetch(`https://api.github.com/repos/${this.username}/${repo.name}/readme`, { headers });
        
        if (!response.ok) {
          return null;
        }
        
        return await response.text();
      } catch (error) {
        console.warn(`Could not fetch README for ${repo.name}:`, error);
        return null;
      }
    }
  
    /**
     * Fetch metadata.json file from .github directory if it exists
     */
    async fetchMetadata(repo) {
      try {
        const headers = {
          'Accept': 'application/vnd.github.v3.raw'
        };
        
        if (this.token) {
          headers['Authorization'] = `token ${this.token}`;
        }
        
        const response = await fetch(`https://api.github.com/repos/${this.username}/${repo.name}/contents/.github/metadata.json`, { headers });
        
        if (!response.ok) {
          return null;
        }
        
        return await response.json();
      } catch (error) {
        // Metadata file is optional, so just return null if not found
        return null;
      }
    }
  
    /**
     * Find first image in README content
     */
    extractImageFromReadme(readmeHtml) {
      if (!readmeHtml) return null;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = readmeHtml;
      
      const firstImage = tempDiv.querySelector('img');
      console.log(firstImage)
      return firstImage ? firstImage.src : null;
    }
  
    /**
     * Extract a short description from README
     */
    extractDescriptionFromReadme(readmeHtml) {
      if (!readmeHtml) return null;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = readmeHtml;
      
      // Try to find the first paragraph after a heading that's not just a link
      const paragraphs = tempDiv.querySelectorAll('p');
      for (const p of paragraphs) {
        // Skip paragraphs that only contain images
        if (p.querySelector('img') && p.textContent.trim() === '') continue;
        
        const text = p.textContent.trim();
        if (text.length > 10) { // Ensure it's a real paragraph with content
          return text.length > 180 ? text.substring(0, 177) + '...' : text;
        }
      }
      
      return null;
    }
  
    /**
     * Fetch all repository data including README and metadata
     */
    async fetchAndRenderProjects(background = false) {
      try {
        const repos = await this.fetchRepos();
        
        // Fetch additional data for each repo
        const repoPromises = repos.map(async (repo) => {
          // Fetch README and metadata in parallel
          const [readmeHtml, metadata] = await Promise.all([
            this.fetchReadme(repo),
            this.fetchMetadata(repo)
          ]);
          
          // Extract image and description from README if needed
          const imageUrl = metadata?.image || this.extractImageFromReadme(readmeHtml);
          const description = metadata?.description || repo.description || this.extractDescriptionFromReadme(readmeHtml);
          
          // Convert topics to tags
          const tags = repo.topics || [];
          
          // Combine all data
          return {
            name: repo.name,
            displayName: metadata?.name || repo.name.replace(/-/g, ' '),
            description,
            url: repo.html_url,
            homepage: repo.homepage,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: tags,
            imageUrl,
            readmeHtml,
            updatedAt: repo.updated_at,
            createdAt: repo.created_at
          };
        });
        
        const enrichedRepos = await Promise.all(repoPromises);
        
        // Cache the enriched repo data
        this.cacheData(enrichedRepos);
        
        // Only render immediately if not a background refresh
        if (!background) {
          this.renderProjects({ repos: enrichedRepos, timestamp: Date.now() });
        }
        
        return enrichedRepos;
      } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        return [];
      }
    }
  
    /**
     * Render projects to the target element
     */
    renderProjects(data) {
      const container = document.querySelector(this.targetElement);
      if (!container) {
        console.error(`Target element "${this.targetElement}" not found`);
        return;
      }
      
      // Clear existing content
      container.innerHTML = '';
      
      // Add projects
      data.repos.forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Format date
        const updatedDate = new Date(repo.updatedAt);
        const formattedDate = `${updatedDate.toLocaleString('default', { month: 'short' })} ${updatedDate.getFullYear()}`;
        
        // Create image or placeholder
        const imageHtml = repo.imageUrl 
          ? `<div class="project-image"><img src="${repo.imageUrl}" alt="${repo.displayName}" /></div>`
          : `<div class="project-image project-image-placeholder"><span>${repo.displayName.charAt(0)}</span></div>`;
        
        projectCard.innerHTML = `
          <a href="${repo.url}" target="_blank" rel="noopener">
            ${imageHtml}
            <div class="project-content">
              <h3>${repo.displayName}</h3>
              <p>${repo.description || ''}</p>
              <div class="project-meta">
                <span class="date">Updated: ${formattedDate}</span>
                <div class="tags">
                  ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                  ${repo.topics.slice(0, 2).map(topic => `<span class="tag">${topic}</span>`).join('')}
                </div>
              </div>
              <div class="project-stats">
                <span><i class="fas fa-star"></i> ${repo.stars}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks}</span>
              </div>
            </div>
          </a>
        `;
        
        container.appendChild(projectCard);
      });
    }
  }
  
 // Example usage:
   const gitHubFetcher = new GitHubFetcher({
     username: 'mannpatel0',
     repoLimit: 6,
     targetElement: '#projects-container'
  });
   gitHubFetcher.init();
