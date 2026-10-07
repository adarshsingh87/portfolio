import { mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { LIGHTS, SANS, mark, registered } from './card-parts.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = join(root, 'src/content/blog')
const previewDir = join(root, 'public/blog')

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
const MD_EXT_RE = /\.md$/
const WIDE_CHARS = new Set(['M', 'W', 'm', 'w'])
const NARROW_CHARS = new Set([..."ijlI.,:;'!`|"])
const contributions = JSON.parse(
  readFileSync(join(root, 'src/data/contributions.json'), 'utf8'),
)
const COUNTS = contributions.counts.split(',').map((c) => parseInt(c, 36))
const COUNTS_START = Date.parse(`${contributions.start}T00:00:00Z`)
const DAY = 86_400_000

// Weekly contribution totals for the 53 weeks up to a date.
function weeksBefore(iso) {
  const end = Date.parse(`${iso}T00:00:00Z`)
  const weeks = []
  for (let w = 52; w >= 0; w--) {
    let sum = 0
    for (let d = 0; d < 7; d++) {
      const i = Math.round((end - (w * 7 + d) * DAY - COUNTS_START) / DAY)
      if (i >= 0 && i < COUNTS.length) sum += COUNTS[i]
    }
    weeks.push(sum)
  }
  return weeks
}

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
    .map((line, index) =>
      registered({
        x: 80,
        y: firstLineY + index * lineHeight,
        size: fontSize,
        text: escapeXml(line),
        weight: 300,
        spacing: -1.5,
      }),
    )
    .join('')
  const tagText = tags.length ? tags.join(', ') : 'Writing'
  const safeTitle = escapeXml(title)
  const safeTagText = escapeXml(tagText)
  const safeDate = escapeXml(date)
  const sans = SANS

  // The site's three lights, with the author's real activity for the year
  // before the post as a row of bars along the bottom.
  const weeks = Number.isNaN(Date.parse(`${date}T00:00:00Z`))
    ? []
    : weeksBefore(date)
  const peak = Math.max(1, ...weeks)
  const windows = weeks
    .map((v, i) => {
      const x = (80 + i * 19.6).toFixed(1)
      const t = Math.sqrt(v / peak)
      const h = v === 0 ? 2 : 3 + 22 * t
      return `<rect x="${x}" y="${(580 - h).toFixed(1)}" width="15" height="${h.toFixed(1)}" rx="1" fill="#ffffff" opacity="${v ? (0.25 + 0.6 * t).toFixed(2) : 0.1}"/>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">${safeTitle}</title>
  <desc id="description">Preview image for ${safeTitle}</desc>
  ${LIGHTS}
  ${mark(80, 70, 40)}
  <text x="136" y="100" font-family="${sans}" font-size="24" font-weight="600" fill="#f4f3ef">Adarsh Singh</text>
  <text x="1120" y="112" text-anchor="end" font-family="${sans}" font-size="22" fill="#959ba9">${safeDate}</text>
  ${titleMarkup}
  <text x="80" y="526" font-family="${sans}" font-size="20" fill="#959ba9">${safeTagText}</text>
  ${windows}
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

await Promise.all(
  posts.map((post) =>
    writePng(createPostPreview(post), join(previewDir, `${post.slug}.png`)),
  ),
)

console.log(`blog previews: ${posts.length} post(s) -> public/blog`)
