# Adarsh Singh — Portfolio (adarshsingh87.com)

Hands-on CTO portfolio. TanStack Start + Tailwind v4, deployed on Cloudflare Workers (static + SSR).

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (client + Cloudflare worker)
npm run deploy   # build + wrangler deploy
```

## Routes

| Route | What |
| --- | --- |
| `/` | Production homepage |
| `/work` | Full work archive, OSS first |
| `/blog` | Blog index — local Markdown posts + external posts (title listed, links out) |
| `/blog/$slug` | Markdown post renderer (headings, lists, code, tables, quotes) |

## Design

Single dark-minimal homepage. No variants, no preview routes.

## Icons (SVGL)

Brand SVGs are vendored in `public/icons/` from [SVGL](https://svgl.app/)
([repo](https://github.com/pheralb/svgl)). Dark variants used throughout.
See `public/icons/ATTRIBUTION.md` for the source file map.

- `src/components/icons.tsx` — `TechIcon`, `TechStackLine`, social icons, `MailIcon`
- Stack section, project stack lines, hero/contact socials, and footer use them
- Arch Linux + Hyprland come from [Simple Icons](https://simpleicons.org/) (no SVGL entry), recolored `#e4e4e7` for the dark theme
- `OpenCode` has no icon entry and renders text-only

## Content model

- `src/data/site.ts` — domain, email, socials, nav
- `src/data/projects.ts` — typed projects, OSS-first order
- `src/data/skills.ts` — skill groups + principles
- `src/data/experience.ts` — CTO-focus experience, education
- `src/content/blog/*.md` — Markdown posts with frontmatter
- `src/data/writing.ts` — `EXTERNAL_POSTS`: posts published elsewhere, listed on `/blog` by title and opened externally

No content is hardcoded in UI components. Add a project by appending to `PROJECTS`.

## Blog

See `BLOG_GUIDE.md`. One file per post, frontmatter + Markdown, rebuild to publish.

## Deploy

See `DEPLOY.md`. Cloudflare Workers via `@cloudflare/vite-plugin` + `wrangler.jsonc`. Custom domain `adarshsingh87.com` is attached in the Cloudflare dashboard.

## Grilling decisions (locked)

- Audience: balanced (clients, peers, execs) → email CTA
- Brand: 50/50 CTO + hands-on engineer
- Visuals: all five dark minimal, no terminal, glass + dark-neu included
- Order: OSS/tooling first
- Metrics allowed: millions of customers, 3Cr+/day reconciled, 50-60% setup savings
- Contact: email only (`me@adarshsingh87.com`), no form
- Blog: live with local Markdown posts + external-post links (was "comming soon" placeholder)
- Experience: CTO focus, no invented dates
- Photo: none, monogram `A` / `AS`
- Socials: GitHub + LinkedIn + X (`adarshsingh87`), project URLs added when shared
