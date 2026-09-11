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
  postgresql: '/icons/postgresql.svg',
  psql: '/icons/postgresql.svg',
  aws: '/icons/aws.svg',
  azure: '/icons/azure.svg',
  vercel: '/icons/vercel.svg',
  cloudflare: '/icons/cloudflare.svg',
  tanstack: '/icons/tanstack.svg',
  neovim: '/icons/neovim.svg',
  nodejs: '/icons/nodejs.svg',
  'node.js': '/icons/nodejs.svg',
  python: '/icons/python.svg',
  github: '/icons/github.svg',
  linkedin: '/icons/linkedin.svg',
  x: '/icons/x.svg',
}

export function techIconSrc(name: string): string | undefined {
  return TECH_ICONS[name.trim().toLowerCase()]
}

export function TechIcon({ name, size = 18 }: { name: string; size?: number }) {
  const src = techIconSrc(name)
  if (!src) return null
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
        aria-label="Adarsh Singh on GitHub"
        title="GitHub"
        className={`inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-zinc-300 transition-colors hover:border-white/30 hover:text-white ${className}`}
      >
        <GitHubIcon size={size} />
      </a>
      <a
        href="https://www.linkedin.com/in/adarshsingh87/"
        aria-label="Adarsh Singh on LinkedIn"
        title="LinkedIn"
        className={`inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-zinc-300 transition-colors hover:border-white/30 hover:text-white ${className}`}
      >
        <LinkedInIcon size={size} />
      </a>
      <a
        href="https://x.com/adarshsingh87"
        aria-label="Adarsh Singh on X (Twitter)"
        title="X / Twitter"
        className={`inline-flex items-center justify-center rounded-full border border-white/15 p-2 text-zinc-300 transition-colors hover:border-white/30 hover:text-white ${className}`}
      >
        <XIcon size={size} />
      </a>
    </>
  )
}
