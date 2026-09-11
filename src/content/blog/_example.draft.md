---
title: "Example: how a post looks"
description: "Draft template showing frontmatter and Markdown features. Not published."
date: "2026-01-01"
slug: "example-draft"
tags: ["template"]
draft: "true"
---

This file is a draft (`draft: "true"`) so it never appears on `/blog`. Copy it to start a real post.

## Headings work

Paragraphs, **bold**, *italic*, and [links](https://adarshsingh87.com) all render.

- Lists
- Like this
- And numbered ones too

> Blockquotes for asides worth keeping.

```ts
import { getAllPosts } from '../lib/blog'

// posts appear automatically
const posts = await getAllPosts()
```

| Column | Use |
| --- | --- |
| Title | Card + SEO |
| Date | Sorting |

Delete this file when the first real post ships, or keep it as a reference.
