import { mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = join(root, 'src/content/blog')
const previewDir = join(root, 'public/blog')
const indexPreviewPath = join(root, 'public/blog-preview.png')
const indexPreviewSourcePath = join(root, 'public/blog-preview.svg')

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
const MD_EXT_RE = /\.md$/
const WIDE_CHARS = new Set(['M', 'W', 'm', 'w'])
const NARROW_CHARS = new Set([..."ijlI.,:;'!`|"])
const FONT_SIZES = [78, 70, 62, 56, 50, 44, 38, 32]
const TITLE_MAX_WIDTH = 1000

function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return {}
  const [, frontmatter] = match
  const data = {}
  for (const line of frontmatter.split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
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

function parseTags(value = '') {
  return value
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function estimateTextWidth(value, fontSize) {
  let units = 0
  for (const character of value) {
    if (/\s/.test(character)) units += 0.3
    else if (WIDE_CHARS.has(character)) units += 0.88
    else if (NARROW_CHARS.has(character)) units += 0.3
    else if (/[A-Z0-9]/.test(character)) units += 0.66
    else units += 0.56
  }
  return units * fontSize
}

function wrapTitle(title, fontSize) {
  const words = title.split(/\s+/)
  const lines = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && estimateTextWidth(candidate, fontSize) > TITLE_MAX_WIDTH) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)

  return lines
}

function fitTitle(title) {
  for (const fontSize of FONT_SIZES) {
    const lines = wrapTitle(title, fontSize)
    if (lines.length === 4) {
      return { fontSize: 52, lines: wrapTitle(title, 52) }
    }
    if (lines.length < 4) return { fontSize, lines }
  }

  const fontSize = FONT_SIZES.at(-1)
  return { fontSize, lines: wrapTitle(title, fontSize) }
}

function getBlogPosts() {
  return readdirSync(blogDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = readFileSync(join(blogDir, file), 'utf8')
      const data = parseFrontmatter(raw)
      return {
        title: data.title,
        slug: data.slug || file.replace(MD_EXT_RE, ''),
        date: data.date || '',
        tags: parseTags(data.tags),
      }
    })
    .filter((post) => post.title && post.slug)
    .toSorted((a, b) => a.slug.localeCompare(b.slug))
}

function createPostPreview({ title, date, tags }) {
  const { fontSize, lines } = fitTitle(title)
  const lineHeight = fontSize * 1.08
  const firstLineY = 340 - ((lines.length - 1) * lineHeight) / 2
  const titleMarkup = lines
    .map(
      (line, index) =>
        `<text x="80" y="${firstLineY + index * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="-2" fill="#f0eee8">${escapeXml(line)}</text>`,
    )
    .join('')
  const tagText = tags.length
    ? `TAGS / ${tags.join(' · ').toUpperCase()}`
    : 'FIELD NOTE / ADARSH SINGH'
  const safeTitle = escapeXml(title)
  const safeTagText = escapeXml(tagText)
  const safeDate = escapeXml(date)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">${safeTitle}</title>
  <desc id="description">Preview image for ${safeTitle}</desc>
  <rect width="1200" height="630" fill="#0e0f0d"/>
  <path d="M80 70h108M80 70v108M1120 560h-108M1120 560V452" fill="none" stroke="#d6ff3f" stroke-width="8"/>
  <text x="112" y="142" font-family="monospace" font-size="22" font-weight="700" letter-spacing="3" fill="#d6ff3f">FIELD NOTE / ADARSH SINGH</text>
  ${titleMarkup}
  <line x1="80" y1="478" x2="1120" y2="478" stroke="#33352f" stroke-width="2"/>
  <text x="80" y="526" font-family="monospace" font-size="18" letter-spacing="1" fill="#a7a99f">${safeTagText}</text>
  <text x="1000" y="526" text-anchor="end" font-family="monospace" font-size="18" font-weight="700" letter-spacing="1" fill="#d6ff3f">${safeDate}</text>
</svg>`
}

async function writePng(svg, outputPath) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outputPath)
}

mkdirSync(previewDir, { recursive: true })

const posts = getBlogPosts()
const expectedFiles = new Set(posts.map((post) => `${post.slug}.png`))

for (const file of readdirSync(previewDir)) {
  if (file.endsWith('.png') && !expectedFiles.has(file)) {
    rmSync(join(previewDir, file))
  }
}

await writePng(readFileSync(indexPreviewSourcePath, 'utf8'), indexPreviewPath)
await Promise.all(
  posts.map((post) =>
    writePng(createPostPreview(post), join(previewDir, `${post.slug}.png`)),
  ),
)

console.log(`blog previews: ${posts.length} post(s) -> public/blog`)
