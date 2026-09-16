const TECH_ICONS: Record<string, string> = {
  react: '/icons/react.svg',
  'next.js': '/icons/nextjs.svg',
  'tailwind css': '/icons/tailwind.svg',
  'react native': '/icons/react.svg',
  flutter: '/icons/flutter.svg',
  go: '/icons/go.svg',
  typescript: '/icons/typescript.svg',
  javascript: '/icons/javascript.svg',
  express: '/icons/express.svg',
  hono: '/icons/hono.svg',
  flask: '/icons/flask.svg',
  fastapi: '/icons/fastapi.svg',
  langchain: '/icons/langchain.svg',
  kubernetes: '/icons/kubernetes.svg',
  k8s: '/icons/kubernetes.svg',
  elasticsearch: '/icons/elasticsearch.svg',
  'elastic search': '/icons/elasticsearch.svg',
  postgresql: '/icons/postgresql.svg',
  psql: '/icons/postgresql.svg',
  mysql: '/icons/mysql.svg',
  mongodb: '/icons/mongodb.svg',
  mongo: '/icons/mongodb.svg',
  aws: '/icons/aws.svg',
  azure: '/icons/azure.svg',
  vercel: '/icons/vercel.svg',
  cloudflare: '/icons/cloudflare.svg',
  tanstack: '/icons/tanstack.svg',
  neovim: '/icons/neovim.svg',
  'arch linux': '/icons/archlinux.svg',
  arch: '/icons/archlinux.svg',
  hyprland: '/icons/hyprland.svg',
  nodejs: '/icons/nodejs.svg',
  'node.js': '/icons/nodejs.svg',
  python: '/icons/python.svg',
  github: '/icons/github.svg',
  linkedin: '/icons/linkedin.svg',
  x: '/icons/x.svg',
}

type TechIconLookup = { src: string | undefined; key: string }

// Cache repeated lookups (js-cache-function-results): stack badges repeat
// the same names dozens of times per page. Finite key space, safe to hold.
const techIconLookupCache = new Map<string, TechIconLookup>()

function lookupTechIcon(name: string): TechIconLookup {
  const cached = techIconLookupCache.get(name)
  if (cached) return cached
  const key = name.trim().toLowerCase()
  const result: TechIconLookup = { src: TECH_ICONS[key], key }
  techIconLookupCache.set(name, result)
  return result
}

export function techIconSrc(name: string): string | undefined {
  return lookupTechIcon(name).src
}

// Per-icon optical scaling. Most marks are roughly square; tall marks like
// the MongoDB leaf fill the full box height and look oversized, so they
// render slightly smaller to match the visual weight of the rest.
const ICON_SCALE: Record<string, number> = {
  mongodb: 0.75,
  mongo: 0.75,
}

export function TechIcon({ name, size = 18 }: { name: string; size?: number }) {
  const { src, key } = lookupTechIcon(name)
  if (!src) return null
  const s = Math.round(size * (ICON_SCALE[key] ?? 1))
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={s}
      height={s}
      loading="lazy"
      decoding="async"
      className="inline-block shrink-0"
    />
  )
}

export function TechStackLine({ items, size = 14 }: { items: string[]; size?: number }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      {items.map((item, i) => (
        <span key={item} className="inline-flex items-center gap-1">
          {i > 0 ? <span aria-hidden="true" className="mr-1 opacity-50">·</span> : null}
          <TechIcon name={item} size={size} />
          {item}
        </span>
      ))}
    </span>
  )
}

function BrandImg({ src, size }: { src: string; size: number }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className="inline-block shrink-0"
    />
  )
}

export function GitHubIcon({ size = 18 }: { size?: number }) {
  return <BrandImg src="/icons/github.svg" size={size} />
}

export function LinkedInIcon({ size = 18 }: { size?: number }) {
  return <BrandImg src="/icons/linkedin.svg" size={size} />
}

export function XIcon({ size = 18 }: { size?: number }) {
  return <BrandImg src="/icons/x.svg" size={size} />
}

export function MailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

export function SocialLinks({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <>
      <a
        href="https://github.com/adarshsingh87"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Adarsh Singh on GitHub"
        title="GitHub"
        className={`inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-zinc-300 transition-colors hover:border-white/30 hover:text-white ${className}`}
      >
        <GitHubIcon size={size} />
      </a>
      <a
        href="https://www.linkedin.com/in/adarshsingh87/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Adarsh Singh on LinkedIn"
        title="LinkedIn"
        className={`inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-zinc-300 transition-colors hover:border-white/30 hover:text-white ${className}`}
      >
        <LinkedInIcon size={size} />
      </a>
      <a
        href="https://x.com/adarshsingh87"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Adarsh Singh on X (Twitter)"
        title="X / Twitter"
        className={`inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-zinc-300 transition-colors hover:border-white/30 hover:text-white ${className}`}
      >
        <XIcon size={size} />
      </a>
    </>
  )
}
