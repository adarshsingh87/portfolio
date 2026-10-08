// Wallpaper mode. Drop an image and the three signals are rebuilt from its
// dominant colours, the way a Hyprland desktop takes its palette from the
// wallpaper. Only the three colours are kept, never the image.

const KEY = 'signals'
const NAMES = ['--sig-a', '--sig-b', '--sig-c'] as const
const BINS = 12

export type Signals = [string, string, string]

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255)) as [
    number,
    number,
    number,
  ]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255
  const gg = g / 255
  const bb = b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return [0, 0, l]
  const s = d / (1 - Math.abs(2 * l - 1))
  let h: number
  if (max === rr) h = ((gg - bb) / d) % 6
  else if (max === gg) h = (bb - rr) / d + 2
  else h = (rr - gg) / d + 4
  return [(h * 60 + 360) % 360, s, l]
}

function hueDistance(a: number, b: number) {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

function css([r, g, b]: [number, number, number]) {
  return `rgb(${r} ${g} ${b})`
}

// Pixels vote for the hue they sit in. Grey, near-black, and near-white
// pixels do not vote, and mid-brightness, saturated ones count most.
export function paletteFromPixels(data: Uint8ClampedArray): Signals | null {
  const bins = Array.from({ length: BINS }, () => ({
    weight: 0,
    x: 0,
    y: 0,
    sat: 0,
  }))
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2])
    if (s < 0.18 || l < 0.12 || l > 0.94) continue
    const w = s * (1 - Math.abs(l - 0.5) * 1.4)
    const bin = bins[Math.floor(h / (360 / BINS)) % BINS]
    bin.weight += w
    bin.x += Math.cos((h * Math.PI) / 180) * w
    bin.y += Math.sin((h * Math.PI) / 180) * w
    bin.sat += s * w
  }

  const ranked = bins
    .map((b) => ({
      ...b,
      hue: ((Math.atan2(b.y, b.x) * 180) / Math.PI + 360) % 360,
    }))
    .filter((b) => b.weight > 0)
    .sort((a, b) => b.weight - a.weight)
  if (ranked.length === 0) return null

  // The three strongest hues that sit well apart from each other.
  const chosen: { hue: number; sat: number }[] = []
  for (const bin of ranked) {
    if (chosen.every((c) => hueDistance(c.hue, bin.hue) >= 50)) {
      chosen.push({ hue: bin.hue, sat: bin.sat / bin.weight })
    }
    if (chosen.length === 3) break
  }
  // A one-colour wallpaper still gets three signals: a triad around it.
  while (chosen.length < 3) {
    chosen.push({
      hue: (chosen[0].hue + 120 * chosen.length) % 360,
      sat: chosen[0].sat,
    })
  }

  // Bright enough to glow on a dark page, whatever the source looked like.
  return chosen.map(({ hue, sat }) =>
    css(hslToRgb(hue, Math.min(1, Math.max(0.72, sat)), 0.58)),
  ) as Signals
}

export async function paletteFromFile(file: File): Promise<Signals | null> {
  const bitmap = await createImageBitmap(file)
  const size = 56
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(bitmap, 0, 0, size, size)
  bitmap.close()
  return paletteFromPixels(ctx.getImageData(0, 0, size, size).data)
}

export function applySignals(signals: Signals) {
  const root = document.documentElement
  NAMES.forEach((name, i) => root.style.setProperty(name, signals[i]))
  try {
    localStorage.setItem(KEY, JSON.stringify(signals))
  } catch {
    // Private mode: the palette lasts until the page reloads.
  }
}

export function resetSignals() {
  const root = document.documentElement
  NAMES.forEach((name) => root.style.removeProperty(name))
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing was saved.
  }
}

export function currentSignals(): Signals {
  const style = getComputedStyle(document.documentElement)
  return NAMES.map((n) => style.getPropertyValue(n).trim()) as Signals
}

// Runs in <head> before first paint, so a saved palette never flashes the
// default one. Kept as a string because it is inlined into the document.
export const RESTORE_SCRIPT = `try{var s=JSON.parse(localStorage.getItem('${KEY}')||'null');if(s&&s.length===3){var r=document.documentElement.style;r.setProperty('--sig-a',s[0]);r.setProperty('--sig-b',s[1]);r.setProperty('--sig-c',s[2])}}catch(e){}`
