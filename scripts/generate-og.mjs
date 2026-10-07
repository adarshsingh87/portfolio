// Draws the site's share images.
//   public/og.png            homepage and work pages
//   public/blog-preview.png  the writing index

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { LIGHTS, SANS, mark, registered } from './card-parts.mjs'

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

await Promise.all([
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

console.log('og: public/og.png, public/blog-preview.png')
