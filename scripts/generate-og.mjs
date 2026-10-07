// Draws the site's share images from the contribution snapshot, so the
// preview card is the same building as the homepage hero.
//   public/og.png            homepage and work pages
//   public/blog-preview.png  the writing index

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(
  readFileSync(join(root, 'src/data/contributions.json'), 'utf8'),
)

const DAY = 86_400_000
const counts = data.counts.split(',').map((c) => parseInt(c, 36))
const start = Date.parse(`${data.start}T00:00:00Z`)
const fetched = Date.parse(`${data.fetched}T00:00:00Z`)
const years = data.years.map((y) => y.year).reverse()
const SANS = 'Helvetica Neue, Helvetica, Arial, sans-serif'

function countAt(ts) {
  const i = Math.round((ts - start) / DAY)
  return i >= 0 && i < counts.length ? counts[i] : null
}

const lit = counts.filter((c) => c > 0).sort((a, b) => a - b)
const scale = Math.log1p(lit[Math.floor(lit.length * 0.97)] ?? 1)

function windowColour(v) {
  const t = Math.min(1, Math.log1p(v) / scale)
  const r = Math.round(150 + 105 * Math.min(1, t * 1.4))
  const g = Math.round(84 + 150 * t)
  const b = Math.round(38 + 150 * t * t)
  return { fill: `rgb(${r},${g},${b})`, opacity: (0.42 + 0.58 * t).toFixed(2) }
}

function facade(x0, y0, w, h, slab) {
  const floorH = (h - slab * (years.length - 1)) / years.length
  const colW = w / 53
  const rowH = floorH / 7
  const out = []
  years.forEach((year, fi) => {
    const jan1 = Date.UTC(year, 0, 1)
    const monday = jan1 - ((new Date(jan1).getUTCDay() + 6) % 7) * DAY
    for (let i = 0; i < 371; i++) {
      const ts = monday + i * DAY
      if (new Date(ts).getUTCFullYear() !== year) continue
      const v = ts > fetched ? null : countAt(ts)
      const x = x0 + Math.floor(i / 7) * colW + colW * 0.1
      const y = y0 + fi * (floorH + slab) + (i % 7) * rowH + rowH * 0.11
      const cw = (colW * 0.8).toFixed(2)
      const ch = (rowH * 0.78).toFixed(2)
      if (v === null || v === 0) {
        out.push(
          `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw}" height="${ch}" fill="rgb(150,172,214)" opacity="${v === null ? 0.05 : 0.08}"/>`,
        )
      } else {
        const c = windowColour(v)
        out.push(
          `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw}" height="${ch}" fill="${c.fill}" opacity="${c.opacity}"/>`,
        )
      }
    }
  })
  return out.join('')
}

function card({ title, lines, foot }) {
  const fx = 560
  const fy = 70
  const fw = 600
  const fh = 490
  const windows = facade(fx, fy, fw, fh, 8)
  // A lens over the busiest floor, matching the hero.
  const lx = fx + fw * 0.82
  const ly = fy + fh * 0.4
  const titleMarkup = lines
    .map(
      (line, i) =>
        `<text x="72" y="${300 + i * 74}" font-family="${SANS}" font-size="68" font-weight="300" letter-spacing="-2.5" fill="#e6ebf2">${line}</text>`,
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <title>${title}</title>
  <defs>
    <filter id="frost" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur stdDeviation="9"/>
    </filter>
    <clipPath id="lens"><circle cx="${lx}" cy="${ly}" r="78"/></clipPath>
    <linearGradient id="fog" x1="0" x2="1">
      <stop offset="0" stop-color="#0d1524" stop-opacity="1"/>
      <stop offset="0.45" stop-color="#0d1524" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.9" cy="0.05" r="0.8">
      <stop offset="0" stop-color="#ffaa50" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#ffaa50" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0d1524"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g filter="url(#frost)">${windows}</g>
  <g clip-path="url(#lens)"><rect x="${lx - 80}" y="${ly - 80}" width="160" height="160" fill="#0d1524"/>${windows}</g>
  <circle cx="${lx}" cy="${ly}" r="78" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>
  <rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="url(#fog)"/>
  <rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="6" fill="none" stroke="#dee9ff" stroke-opacity="0.14"/>
  <text x="72" y="112" font-family="${SANS}" font-size="26" font-weight="600" fill="#e6ebf2">Adarsh Singh</text>
  ${titleMarkup}
  <text x="72" y="560" font-family="${SANS}" font-size="22" fill="#a6b2c5">${foot}</text>
</svg>`
}

await Promise.all([
  sharp(
    Buffer.from(
      card({
        title: 'Most of what we build happens behind glass.',
        lines: ['Most of what', 'we build happens', 'behind glass.'],
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
        lines: ['Notes on the', 'systems behind', 'the glass.'],
        foot: 'Writing, adarshsingh87.com/blog',
      }),
    ),
  )
    .png({ compressionLevel: 9 })
    .toFile(join(root, 'public/blog-preview.png')),
])

console.log('og: public/og.png, public/blog-preview.png')
