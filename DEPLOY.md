# Deploy — Cloudflare + adarshsingh87.com

## Stack

- TanStack Start (SSR) on Cloudflare Workers via `@cloudflare/vite-plugin`
- Config: `wrangler.jsonc` (`name: adarsh-portfolio`, `nodejs_compat`)
- Static SEO: `public/robots.txt`, `public/sitemap.xml`, `public/favicon.svg`, `public/og.svg`

## First deploy

```bash
npx wrangler login
npm run deploy   # vite build + wrangler deploy
```

## Attach the domain

1. Cloudflare dashboard → Workers & Pages → `adarsh-portfolio` → Settings → Domains & Routes → Add → `adarshsingh87.com` (and `www`, redirecting to apex).
2. DNS: if the zone is on Cloudflare, records are created automatically. Otherwise add the CNAME shown by the dashboard.
3. HTTPS: automatic. HSTS optional in the zone SSL settings.

## Updates

Push a commit and redeploy, or wire `wrangler deploy` into CI:

```bash
npm ci
npm run build
npx wrangler deploy
```

Set `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` as CI secrets.

## Checks before going live

- `npm run build` passes, `npx tsc --noEmit` passes
- `/`, `/work`, `/blog`, `/designs`, `/designs/v1`…`v5` all return 200
- `https://adarshsingh87.com/sitemap.xml` and `/robots.txt` resolve
- OG image at `/og.svg` unfurls in a link preview debugger
- Email links use `mailto:me@adarshsingh87.com` (no form backend by design)

## Notes

- No environment variables required. No database, no CMS, no form backend.
- Blog posts deploy with the site. No cache purge needed beyond a fresh deploy.
- If the client bundle ever feels heavy, the first cut is removing `@tanstack/react-devtools` from production deps (build plugin already strips its code).
