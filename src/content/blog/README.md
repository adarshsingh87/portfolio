# Blog content

Posts are Markdown files in this folder. The blog index reads every `*.md` file at build time.

## The 60-second workflow

1. Copy `_example.draft.md` to a new file, e.g. `smoke-context-notes.md`.
2. Fill in frontmatter and write Markdown.
3. Run `pnpm build` (or push and let Cloudflare build).
4. The post appears at `/blog` and `/blog/your-slug` automatically.
   The build also generates a 1200×630 post preview from its title, date, and
   tags, then refreshes `public/sitemap.xml` and the Notes section of
   `public/llms.txt`. No manual SEO or image edits are needed
   (`pnpm generate:previews` and `pnpm generate:seo` run those steps on
   their own).

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

## Where posts appear

Published posts show on `/blog`, and the three newest also appear in the
Writing section of the homepage.
