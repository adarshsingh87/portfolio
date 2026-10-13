// Draws the site's share images.
//   public/og.png            homepage and work index
//   public/blog-preview.png  the writing index
//   public/work/<slug>.png   one per case study

import { mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { LIGHTS, SANS, mark, registered } from './card-parts.mjs'
// Node strips the types, so the case studies come straight from the source.
import { CASES } from '../src/data/work.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function card({ title, lines, foot }) {
  const type = lines
    .map((text, i) =>
      registered({
        x: 72,
        y: 290 + i * 118,
        size: 112,
        text,
        weight: 280,
        spacing: -5,
      }),
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${title}">
  <title>${title}</title>
  ${LIGHTS}
  ${mark(72, 62, 44)}
  <text x="132" y="93" font-family="${SANS}" font-size="26" font-weight="600" fill="#f4f3ef">Adarsh Singh</text>
  ${type}
  <text x="72" y="566" font-family="${SANS}" font-size="24" fill="#959ba9">${foot}</text>
</svg>`
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Greedy wrap by character count. Close enough for one short sentence.
function wrap(text, max) {
  const lines = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (line && next.length > max) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function caseCard(project) {
  const title = escapeXml(project.title)
  const line = wrap(project.line, 58)
    .map(
      (text, i) =>
        `<text x="72" y="${392 + i * 44}" font-family="${SANS}" font-size="32" fill="#c9ccd4">${escapeXml(text)}</text>`,
    )
    .join('')
  const code = project.visibility === 'open' ? 'Open source' : 'Private'
  const foot = escapeXml(
    `${project.period}. ${project.stack.slice(0, 4).join(', ')}. ${code}.`,
  )
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${title}">
  <title>${title}</title>
  ${LIGHTS}
  ${mark(72, 62, 44)}
  <text x="132" y="93" font-family="${SANS}" font-size="26" font-weight="600" fill="#f4f3ef">Adarsh Singh</text>
  <text x="1128" y="93" text-anchor="end" font-family="${SANS}" font-size="24" fill="#959ba9">Case study</text>
  ${registered({ x: 72, y: 300, size: 104, text: title, weight: 280, spacing: -4 })}
  ${line}
  <text x="72" y="566" font-family="${SANS}" font-size="24" fill="#959ba9">${foot}</text>
</svg>`
}

const workDir = join(root, 'public/work')
mkdirSync(workDir, { recursive: true })
const expected = new Set(CASES.map((c) => `${c.slug}.png`))
for (const file of readdirSync(workDir)) {
  if (file.endsWith('.png') && !expected.has(file)) rmSync(join(workDir, file))
}

await Promise.all([
  ...CASES.map((project) =>
    sharp(Buffer.from(caseCard(project)))
      .png({ compressionLevel: 9 })
      .toFile(join(workDir, `${project.slug}.png`)),
  ),
  sharp(
    Buffer.from(
      card({
        title: 'Making every system agree.',
        lines: ['Making every', 'system agree.'],
        foot: 'CTO, SmokeTrees Digital. adarshsingh87.com',
      }),
    ),
  )
    .png({ compressionLevel: 9 })
    .toFile(join(root, 'public/og.png')),
  sharp(
    Buffer.from(
      card({
        title: 'Writing by Adarsh Singh',
        lines: ['Notes on the', 'systems beneath.'],
        foot: 'Writing, adarshsingh87.com/blog',
      }),
    ),
  )
    .png({ compressionLevel: 9 })
    .toFile(join(root, 'public/blog-preview.png')),
])

console.log(
  `og: public/og.png, public/blog-preview.png, ${CASES.length} case studies -> public/work`,
)
