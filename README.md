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
| `/` | Production homepage (V3 Editorial Minimal, refined) |
| `/work` | Full work archive, OSS first |
| `/blog` | Blog index — currently a "comming soon" placeholder until the first `.md` lands |
| `/blog/$slug` | Markdown post renderer (headings, lists, code, tables, quotes) |
| `/designs` | Comparison of all five variants + recommendation |
| `/designs/v1` … `/designs/v5` | Five working dark-minimal variants, same content |

## The five variants (all dark minimal, per grilling)

- **V1 Midnight Glass** — dark glassmorphism, aurora bg, blur panels
- **V2 Soft Press Dark** — neumorphism adapted to dark mode, extruded/inset physics
- **V3 Editorial Minimal** — production pick. Type-led, hairlines, no cards
- **V4 Hairline Grid** — product-grid precision, hairline cells, small caps
- **V5 Ink Serif** — warm-black serif, centered, quiet luxury

See `DESIGN_COMPARISON.md` for strengths, weaknesses, and why V3 won.

## Icons (SVGL)

Brand SVGs are vendored in `public/icons/` from [SVGL](https://svgl.app/)
([repo](https://github.com/pheralb/svgl)). Dark variants used throughout.
See `public/icons/ATTRIBUTION.md` for the source file map.

- `src/components/icons.tsx` — `TechIcon`, `TechStackLine`, social icons, `MailIcon`
- Stack section, project stack lines, hero/contact socials, and footer use them
- `Arch + Hyprland` and `OpenCode` have no SVGL entry and render text-only

## Content model

- `src/data/site.ts` — domain, email, socials, nav
- `src/data/projects.ts` — typed projects, OSS-first order
- `src/data/skills.ts` — skill groups + principles
- `src/data/experience.ts` — CTO-focus experience, education
- `src/content/blog/*.md` — Markdown posts with frontmatter

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
- Blog: "comming soon" placeholder, infra live
- Experience: CTO focus, no invented dates
- Photo: none, monogram `A` / `AS`
- Socials: GitHub + LinkedIn + X (`adarshsingh87`), project URLs added when shared
