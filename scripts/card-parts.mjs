// Pieces shared by the share-image generators. The site is built from three
// light signals that sum to white when they agree, so the images are too.

export const SANS = 'Helvetica Neue, Helvetica, Arial, sans-serif'

export const INK = '#07080b'

// Three soft lights behind everything, as on the site.
export const LIGHTS = `
  <defs>
    <radialGradient id="la" cx="0" cy="0" r="0.9"><stop offset="0" stop-color="rgb(255,59,48)" stop-opacity="0.26"/><stop offset="1" stop-color="rgb(255,59,48)" stop-opacity="0"/></radialGradient>
    <radialGradient id="lb" cx="1" cy="0.1" r="0.8"><stop offset="0" stop-color="rgb(0,255,122)" stop-opacity="0.16"/><stop offset="1" stop-color="rgb(0,255,122)" stop-opacity="0"/></radialGradient>
    <radialGradient id="lc" cx="0.3" cy="1.1" r="0.9"><stop offset="0" stop-color="rgb(58,91,255)" stop-opacity="0.34"/><stop offset="1" stop-color="rgb(58,91,255)" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#la)"/>
  <rect width="1200" height="630" fill="url(#lb)"/>
  <rect width="1200" height="630" fill="url(#lc)"/>`

// The mark: three circles whose overlap is white.
export function mark(x, y, size = 40) {
  const r = size * 0.265
  const cx = x + size / 2
  const cy = y + size / 2
  const c = (dx, dy, fill) =>
    `<circle cx="${cx + dx * size}" cy="${cy + dy * size}" r="${r}" fill="${fill}" style="mix-blend-mode:screen"/>`
  return `<g style="isolation:isolate">${c(-0.11, -0.12, 'rgb(255,59,48)')}${c(0.11, -0.12, 'rgb(0,255,122)')}${c(0, 0.13, 'rgb(58,91,255)')}<circle cx="${cx}" cy="${cy + 0.01 * size}" r="${r * 0.42}" fill="#fff"/></g>`
}

// A line of display type drawn slightly out of register: red and blue
// copies behind a white core.
export function registered({ x, y, size, text, weight = 300, spacing = -2 }) {
  const attrs = `font-family="${SANS}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}"`
  // Fringes stay thin on small type so it remains readable.
  const off = size > 80 ? Math.round(size * 0.035) : 1.5
  return `<text x="${x - off}" y="${y - off * 0.4}" ${attrs} fill="rgb(255,59,48)" opacity="0.9">${text}</text>
  <text x="${x + off}" y="${y + off * 0.5}" ${attrs} fill="rgb(58,91,255)" opacity="0.9">${text}</text>
  <text x="${x}" y="${y}" ${attrs} fill="#ffffff">${text}</text>`
}
