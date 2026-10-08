// The three lights behind the page, moved by hand. Positions are CSS
// variables on each light, so the browser still composites everything.

const SELECTORS = ['.a', '.b', '.c']
const UNLOCK_KEY = 'all-three-agree'

function atmo() {
  return document.querySelector<HTMLElement>('.atmo')
}

function lights() {
  const root = atmo()
  if (!root) return []
  return SELECTORS.flatMap((s) => {
    const el = root.querySelector<HTMLElement>(`:scope > ${s}`)
    return el ? [el] : []
  })
}

export type Point = { x: number; y: number }

export function centers(): Point[] {
  return lights().map((el) => {
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  })
}

function offsetOf(el: HTMLElement): Point {
  return {
    x: parseFloat(el.style.getPropertyValue('--gx')) || 0,
    y: parseFloat(el.style.getPropertyValue('--gy')) || 0,
  }
}

export function nearestLight(x: number, y: number) {
  const els = lights()
  const cs = centers()
  let best = 0
  let bestD = Infinity
  cs.forEach((c, i) => {
    const d = Math.hypot(c.x - x, c.y - y)
    if (d < bestD) {
      bestD = d
      best = i
    }
  })
  const el = els[best] as HTMLElement | undefined
  return el ? { el, start: offsetOf(el) } : null
}

export function moveLight(
  el: HTMLElement,
  start: Point,
  dx: number,
  dy: number,
) {
  el.style.setProperty('--gx', `${start.x + dx}px`)
  el.style.setProperty('--gy', `${start.y + dy}px`)
}

// All three centres inside a small circle: the signals agree.
export function agree() {
  const cs = centers()
  if (cs.length < 3) return false
  const cx = cs.reduce((n, c) => n + c.x, 0) / cs.length
  const cy = cs.reduce((n, c) => n + c.y, 0) / cs.length
  const radius = 0.16 * Math.min(window.innerWidth, window.innerHeight)
  return cs.every((c) => Math.hypot(c.x - cx, c.y - cy) < radius)
}

export function bloom() {
  const root = atmo()
  if (!root) return
  root.removeAttribute('data-bloom')
  // Restart the animation if it is already running.
  void root.offsetWidth
  root.dataset.bloom = 'true'
  window.setTimeout(() => root.removeAttribute('data-bloom'), 2300)
}

function settle(run: () => void) {
  const root = atmo()
  if (!root) return
  root.dataset.settle = 'true'
  run()
  window.setTimeout(() => root.removeAttribute('data-settle'), 1300)
}

export function resetLights() {
  settle(() =>
    lights().forEach((el) => {
      el.style.removeProperty('--gx')
      el.style.removeProperty('--gy')
    }),
  )
}

// Slide all three lights onto the middle of the screen, then bloom.
export function reconcileLights() {
  const els = lights()
  const cs = centers()
  const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  settle(() =>
    els.forEach((el, i) => {
      const now = offsetOf(el)
      moveLight(el, now, target.x - cs[i].x, target.y - cs[i].y)
    }),
  )
  window.setTimeout(bloom, 700)
}

export function unlockAgreement() {
  try {
    localStorage.setItem(UNLOCK_KEY, '1')
  } catch {
    // Private mode: the unlock lasts until the page reloads.
    unlockedInMemory = true
  }
}

let unlockedInMemory = false

export function agreementUnlocked() {
  if (unlockedInMemory) return true
  try {
    return localStorage.getItem(UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}
