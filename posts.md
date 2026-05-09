---
layout: page
title: all posts
permalink: /posts/
---

<h2 id="articles">All Articles</h2>

<ul>
  {%- for post in site.posts -%}
  <li class="post-item">
    {%- if post.image -%}
    <a href="{{ post.url | relative_url }}" class="post-thumb-link">
      <img src="{{ post.image }}" alt="" class="post-thumb" />
    </a>
    {%- endif -%}
    <div class="post-meta">
      {%- assign date_format = "%Y-%m-%d" -%}
      [ {{ post.date | date: date_format }} ] <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
    </div>
  </li>
  {%- endfor -%}
</ul>
