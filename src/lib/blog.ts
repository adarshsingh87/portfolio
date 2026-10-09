import { EXTERNAL_POSTS } from '../data/writing'

import type { BlogEntry, BlogPost } from './blog-shared'

export type { BlogEntry, BlogPost } from './blog-shared'

// Hoisted (js-hoist-regexp): shared instances, no per-call recreation.
// Non-global on purpose — global RegExp carries mutable lastIndex state.
const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
const LEADING_BRACKET_RE = /^\[/
const TRAILING_BRACKET_RE = /\]$/
const LEADING_QUOTE_RE = /^["']/
const TRAILING_QUOTE_RE = /["']$/
const MD_EXT_RE = /\.md$/
const WS_RE = /\s+/
// External links inside post bodies open in a new tab.
const EXTERNAL_ANCHOR_RE = /<a(?![^>]*\btarget=)(?=[^>]*\bhref="https?:\/\/)/g

// Minimal frontmatter parser. No dependency, Cloudflare-safe.
export function parseFrontmatter(raw: string): {
  data: Record<string, string>
  body: string
} {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return { data: {}, body: raw }
  const [, fm, body] = match
  const data: Record<string, string> = {}
  for (const line of fm.split('\n')) {
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
  return { data, body }
}

function parseList(value: string | undefined): string[] {
  if (!value) return []
  const v = value.trim()
  if (v.startsWith('[')) {
    return v
      .replace(LEADING_BRACKET_RE, '')
      .replace(TRAILING_BRACKET_RE, '')
      .split(',')
      .map((s) =>
        s.trim().replace(LEADING_QUOTE_RE, '').replace(TRAILING_QUOTE_RE, ''),
      )
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
    const { data, body } = parseFrontmatter(raw)
    const slug =
      data.slug || path.split('/').pop()?.replace(MD_EXT_RE, '') || 'untitled'
    const draft = data.draft === 'true'
    if (draft && !includeDrafts) continue
    if (!data.title) continue
    const words = body.split(WS_RE).length
    metas.push({
      title: data.title,
      description: data.description || '',
      date: data.date || '',
      slug,
      tags: parseList(data.tags),
      draft,
      body,
      readingMinutes: Math.max(1, Math.round(words / 200)),
    })
  }
  return [...metas].sort((a, b) => (a.date < b.date ? 1 : -1))
}

async function render(meta: PostMeta): Promise<BlogPost> {
  const [{ Marked }, { getHighlighter, CODE_THEME }] = await Promise.all([
    import('marked'),
    import('./highlight'),
  ])
  const highlighter = await getHighlighter()
  const languages = highlighter.getLoadedLanguages()
  const marked = new Marked({
    renderer: {
      // A fence with no language, or one we do not bundle, falls back to
      // marked's plain <pre><code> by returning false.
      code({ text, lang }) {
        const name = lang?.split(WS_RE)[0]
        if (!name || !languages.includes(name)) return false
        return highlighter.codeToHtml(text, { lang: name, theme: CODE_THEME })
      },
    },
  })
  const html = String(marked.parse(meta.body)).replace(
    EXTERNAL_ANCHOR_RE,
    '<a target="_blank" rel="noopener noreferrer"',
  )
  return {
    title: meta.title,
    description: meta.description,
    date: meta.date,
    slug: meta.slug,
    tags: meta.tags,
    draft: meta.draft,
    html,
    readingMinutes: meta.readingMinutes,
  }
}

// Renders Markdown for the one post being read, not the whole archive.
export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const meta = readAllMeta(true).find((p) => p.slug === slug)
  return meta ? render(meta) : undefined
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
