// Main script.js - Fixed version with working close button
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const menuButton = document.querySelector('.menu-button');
    const closeButton = document.querySelector('.close-button');
    const overlayMenu = document.getElementById('overlay-menu');
    const navLinks = document.querySelectorAll('.overlay-content a');

    console.log('Menu button:', menuButton);
    console.log('Close button:', closeButton);
    console.log('Overlay menu:', overlayMenu);

    // Menu button opens overlay
    if (menuButton) {
        menuButton.addEventListener('click', function(e) {
            console.log('Menu button clicked');
            e.preventDefault();
            e.stopPropagation();
            if (overlayMenu) {
                overlayMenu.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            }
        });
    }

    // Close button closes overlay
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            console.log('Close button clicked');
            e.preventDefault();
            e.stopPropagation();
            if (overlayMenu) {
                overlayMenu.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    } else {
        console.error('Close button not found');
    }

    // Nav links close overlay when clicked
    if (navLinks.length && overlayMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Nav link clicked');
                overlayMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (overlayMenu && overlayMenu.classList.contains('active')) {
            // Check if click is outside the menu content
            if (!e.target.closest('.overlay-content') && 
                !e.target.closest('.menu-button') && 
                !e.target.closest('.close-button')) {
                console.log('Clicked outside menu');
                overlayMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Prevent clicks inside overlay content from closing the menu
    const overlayContent = document.querySelector('.overlay-content');
    if (overlayContent) {
        overlayContent.addEventListener('click', function(e) {
            // Only stop propagation if it's not a link
            if (!e.target.closest('a')) {
                e.stopPropagation();
            }
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggle && themeIcon) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }

    // Apply saved theme on page load
    window.addEventListener('load', () => {
        const savedTheme = localStorage.getItem('theme');
        
        if (themeIcon) {
            // Default to dark theme if no theme is saved
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                document.body.classList.remove('light-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or no targetId
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 70; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-right a[href^="#"]');
    
    function highlightNavItem() {
        if (!sections.length || !navItems.length) return;
        
        const scrollPosition = window.scrollY + 100; // Offset for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavItem);
    highlightNavItem(); // Run once on page load
});