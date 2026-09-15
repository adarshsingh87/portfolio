import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BLOG_DIR = join(root, 'src/content/blog')
const WRITING_TS = join(root, 'src/data/writing.ts')
const SITEMAP_PATH = join(root, 'public/sitemap.xml')
const LLMS_PATH = join(root, 'public/llms.txt')
const SITE = 'https://adarshsingh87.com'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) return {}
  const [, fm] = match
  const data = {}
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
  return data
}

function getInternalPosts() {
  let files = []
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }
  const posts = []
  for (const file of files) {
    const raw = readFileSync(join(BLOG_DIR, file), 'utf8')
    const data = parseFrontmatter(raw)
    if (data.draft === 'true') continue
    if (!data.title) continue
    const slug = data.slug ?? file.replace(/\.md$/, '')
    if (!slug) continue
    posts.push({
      title: data.title,
      description: data.description ?? '',
      date: data.date ?? '',
      slug,
    })
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

function getExternalPosts() {
  try {
    let src = readFileSync(WRITING_TS, 'utf8')
    // Strip line + block comments so the documented example entry is ignored.
    src = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    // Only look inside the EXTERNAL_POSTS array literal.
    const arrMatch = src.match(/EXTERNAL_POSTS[^=]*=\s*\[([\s\S]*?)\]/)
    const body = arrMatch ? arrMatch[1] : ''
    if (!body.trim()) return []
    const posts = []
    // Match each { ... } block with title/date/url inside EXTERNAL_POSTS
    const blockRe =
      /\{[^}]*title:\s*['"]([^'"]+)['"][^}]*?description:\s*['"]([^'"]*)['"][^}]*?date:\s*['"]([^'"]+)['"][^}]*?url:\s*['"]([^'"]+)['"][^}]*?\}/gs
    for (const m of body.matchAll(blockRe)) {
      posts.push({
        title: m[1],
        description: m[2] ?? '',
        date: m[3] ?? '',
        url: m[4],
      })
    }
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch {
    return []
  }
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSitemap(posts) {
  const urls = [
    { loc: `${SITE}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE}/work`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE}/blog`, changefreq: 'weekly', priority: '0.7' },
    ...posts.map((p) => ({
      loc: `${SITE}/blog/${p.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: p.date || undefined,
    })),
  ]
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]
  for (const u of urls) {
    let tag = `  <url><loc>${escapeXml(u.loc)}</loc>`
    if (u.lastmod) tag += `<lastmod>${escapeXml(u.lastmod)}</lastmod>`
    tag += `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
    lines.push(tag)
  }
  lines.push('</urlset>')
  return lines.join('\n') + '\n'
}

function buildNotesLines(internal, external) {
  const lines = []
  for (const p of internal) {
    const desc = p.description ? `: ${p.description}` : ''
    lines.push(`- [${p.title}](${SITE}/blog/${p.slug})${desc}`)
  }
  for (const p of external) {
    const desc = p.description ? `: ${p.description}` : ''
    lines.push(`- [${p.title}](${p.url})${desc}`)
  }
  return lines
}

function updateLlmsTxt(internal, external) {
  const notesLines = buildNotesLines(internal, external)
  const notesBody =
    notesLines.length > 0 ? notesLines.join('\n') : '- No posts published yet.'
  let existing = ''
  try {
    existing = readFileSync(LLMS_PATH, 'utf8')
  } catch {
    existing = ''
  }
  const header = '## Notes (blog)'
  const idx = existing.indexOf(header)
  if (idx === -1) {
    // Append a Notes section if missing.
    const sep = existing.endsWith('\n') ? '' : '\n'
    return `${existing}${sep}\n${header}\n\n${notesBody}\n`
  }
  const afterHeader = idx + header.length
  // Find the next "## " section after the Notes header.
  const nextSection = existing.indexOf('\n## ', afterHeader)
  const before = existing.slice(0, afterHeader).trimEnd()
  const after = nextSection === -1 ? '' : existing.slice(nextSection)
  return `${before}\n\n${notesBody}\n${after.replace(/^\n+/, '\n')}`
}

// Run
const internal = getInternalPosts()
const external = getExternalPosts()

writeFileSync(SITEMAP_PATH, buildSitemap(internal))
writeFileSync(LLMS_PATH, updateLlmsTxt(internal, external))

console.log(
  `seo: ${internal.length} internal post(s), ${external.length} external post(s) -> sitemap.xml, llms.txt`,
)
