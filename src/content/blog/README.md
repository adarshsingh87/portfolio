# Blog content

Posts are Markdown files in this folder. The blog index reads every `*.md` file at build time.

## The 60-second workflow

1. Copy `_example.draft.md` to a new file, e.g. `smoke-context-notes.md`.
2. Fill in frontmatter and write Markdown.
3. Run `npm run build` (or push and let Cloudflare build).
4. The post appears at `/blog` and `/blog/your-slug` automatically.
   The build also regenerates `public/sitemap.xml` and the Notes section of
   `public/llms.txt` from your frontmatter, so no manual SEO edits are needed
   (`npm run generate:seo` runs the same step on its own).

## Frontmatter

```md
---
title: 'Your title'
description: 'One or two sentences for cards and SEO.'
date: '2026-09-20'
slug: 'your-slug'
tags: ['go', 'postgres']
draft: 'false'
---
```

Rules:

- `slug` must be unique and URL-safe.
- `draft: "true"` hides the post from `/blog` but keeps it renderable if you know the URL logic later. Default loader excludes drafts.
- `date` uses `YYYY-MM-DD` so sorting stays correct.

## Supported Markdown

Headings, paragraphs, lists, links, inline code, fenced code blocks, blockquotes, tables, images. Code blocks render in a dark panel with horizontal scroll. No extra setup needed.

## Current state

Per grilling decision: the blog shows a "comming soon" placeholder until the first real post lands. The infra is live, just add a file.
