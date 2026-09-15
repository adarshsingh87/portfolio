# Blog guide — Markdown, no CMS

## Add a post (60 seconds)

1. Create `src/content/blog/my-slug.md`.
2. Paste this frontmatter and write below it:

```md
---
title: "What ONDC taught me about strict specs"
description: "Buyer and seller gift-card flows, and where the edge cases actually live."
date: "2026-09-20"
slug: "ondc-strict-specs"
tags: ["ondc", "integrations"]
draft: "false"
---
```

3. Run `npm run dev` to preview at `/blog` and `/blog/ondc-strict-specs`.
4. Run `npm run build` (or push; Cloudflare builds on deploy).

## External posts (published elsewhere)

To list a post you wrote for SmokeTrees or anywhere else — title shown on
`/blog` and the homepage preview, click opens the external URL in a new tab:

1. Open `src/data/writing.ts`.
2. Append to `EXTERNAL_POSTS`:

```ts
{
  title: 'What I actually do as a CTO',
  description: 'A week of calendars, code reviews, and client calls.',
  date: '2026-08-02',
  url: 'https://smoketrees.in/blog/cto-week',
  source: 'smoketrees.in',
},
```

3. Rebuild. No local page is created for it — there is nothing at `/blog/<slug>` for external entries, by design.

## Rules

- One file per post, extension `.md`, any filename. The `slug` field sets the URL.
- `date` format is `YYYY-MM-DD`. Index sorts newest first.
- `draft: "true"` hides the post from `/blog`. Use it for work in progress.
- `tags` is a comma list: `tags: ["go", "postgres"]`.
- Images: put files in `public/blog/` and reference `/blog/name.png`.

## What renders

Headings, paragraphs, bold/italic, links, unordered + ordered lists, inline code, fenced code blocks (dark panel, horizontal scroll), blockquotes, tables. See `src/content/blog/_example.draft.md` (draft, never published) for a live template.

## Current state

Live. Local posts render at `/blog/<slug>`; external entries from
`src/data/writing.ts` link out. The "comming soon" card only shows when both
lists are empty. The loader (`src/lib/blog.ts`), index route
(`src/routes/blog/index.tsx`), and post route (`src/routes/blog/$slug.tsx`)
were verified with a temporary test post, and again with the first two real
posts.
