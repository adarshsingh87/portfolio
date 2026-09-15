export type BlogFrontmatter = {
  title: string
  description: string
  date: string
  slug: string
  tags: string[]
  draft?: boolean
}

export type BlogPost = BlogFrontmatter & {
  html: string
  readingMinutes: number
}

export type { ExternalPost } from '../data/writing'
import { EXTERNAL_POSTS } from '../data/writing'

export type BlogEntry =
  | {
      kind: 'internal'
      slug: string
      title: string
      description: string
      date: string
      tags: string[]
      readingMinutes: number
    }
  | {
      kind: 'external'
      title: string
      description: string
      date: string
      url: string
      source: string
    }

// Minimal frontmatter parser. No dependency, Cloudflare-safe.
export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }
  const [, fm, body] = match
  const data: Record<string, string> = {}
  for (const line of (fm ?? '').split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key) data[key] = value
  }
  return { data, body: body ?? '' }
}

function parseList(value: string | undefined): string[] {
  if (!value) return []
  const v = value.trim()
  if (v.startsWith('[')) {
    return v
      .replace(/^\[/, '')
      .replace(/\]$/, '')
      .split(',')
      .map((s) => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

// Vite-bundled markdown sources. Files live in src/content/blog/*.md
const modules = import.meta.glob<string>('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

type PostMeta = {
  title: string
  description: string
  date: string
  slug: string
  tags: string[]
  draft: boolean
  body: string
  readingMinutes: number
}

// Frontmatter only — no Markdown rendering, so index pages stay light.
function readAllMeta(includeDrafts = false): PostMeta[] {
  const metas: PostMeta[] = []
  for (const [path, raw] of Object.entries(modules)) {
    const { data, body } = parseFrontmatter(raw as string)
    const slug =
      data.slug ?? path.split('/').pop()?.replace(/\.md$/, '') ?? 'untitled'
    const draft = data.draft === 'true'
    if (draft && !includeDrafts) continue
    if (!data.title) continue
    const words = body.split(/\s+/).length
    metas.push({
      title: data.title,
      description: data.description ?? '',
      date: data.date ?? '',
      slug,
      tags: parseList(data.tags),
      draft,
      body: body ?? '',
      readingMinutes: Math.max(1, Math.round(words / 200)),
    })
  }
  return metas.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getAllPosts(includeDrafts = false): Promise<BlogPost[]> {
  const { marked } = await import('marked')
  const posts: BlogPost[] = []
  for (const meta of readAllMeta(includeDrafts)) {
    const html = String(marked.parse(meta.body))
    const words = meta.body.split(/\s+/).length
    posts.push({
      title: meta.title,
      description: meta.description,
      date: meta.date,
      slug: meta.slug,
      tags: meta.tags,
      draft: meta.draft,
      html,
      readingMinutes: Math.max(1, Math.round(words / 200)),
    })
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts(true)
  return posts.find((p) => p.slug === slug)
}

// Merged feed for index pages: local Markdown posts plus external posts
// (title listed locally, click goes to the external URL). Sorted newest
// first. Sync and light — no Markdown rendering, so it is safe to load
// from any route including the homepage.
export function getAllEntries(): BlogEntry[] {
  const internal: BlogEntry[] = readAllMeta(false).map((m) => ({
    kind: 'internal' as const,
    slug: m.slug,
    title: m.title,
    description: m.description,
    date: m.date,
    tags: m.tags,
    readingMinutes: m.readingMinutes,
  }))
  const external: BlogEntry[] = EXTERNAL_POSTS.map((e) => ({
    kind: 'external' as const,
    title: e.title,
    description: e.description,
    date: e.date,
    url: e.url,
    source: e.source,
  }))
  return [...internal, ...external].sort((a, b) => (a.date < b.date ? 1 : -1))
}
