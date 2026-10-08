// The light follows the visitor's clock. There is no control for it: the
// balance of the three signals simply shifts from ember at dawn, through
// near-white at noon, to azure at night.

type Mix = [number, number, number]

// Hour of day, then a multiplier for ember, mint and azure.
const KEYFRAMES: [number, Mix][] = [
  [0, [0.55, 0.7, 1.5]],
  [5, [0.7, 0.7, 1.35]],
  [6.5, [1.5, 0.9, 0.6]],
  [8.5, [1.3, 1.1, 0.8]],
  [12, [1.15, 1.2, 1.15]],
  [16, [1.1, 1.1, 1.05]],
  [18, [1.55, 0.6, 1]],
  [20, [1, 0.65, 1.45]],
  [24, [0.55, 0.7, 1.5]],
]

const PHASES: [number, string][] = [
  [5, 'night'],
  [8, 'dawn'],
  [11, 'morning'],
  [15, 'noon'],
  [17.5, 'afternoon'],
  [20, 'dusk'],
  [24, 'night'],
]

function hourOf(date: Date) {
  return date.getHours() + date.getMinutes() / 60
}

export function mixFor(hour: number): Mix {
  for (let i = 1; i < KEYFRAMES.length; i++) {
    const [h1, m1] = KEYFRAMES[i]
    if (hour <= h1) {
      const [h0, m0] = KEYFRAMES[i - 1]
      const t = (hour - h0) / (h1 - h0)
      return m0.map((v, k) => v + (m1[k] - v) * t) as Mix
    }
  }
  return KEYFRAMES[0][1]
}

export function phaseFor(hour: number) {
  return PHASES.find(([end]) => hour < end)?.[1] ?? 'night'
}

function apply(hour: number) {
  const root = document.documentElement
  const [a, b, c] = mixFor(hour)
  root.style.setProperty('--tod-a', a.toFixed(3))
  root.style.setProperty('--tod-b', b.toFixed(3))
  root.style.setProperty('--tod-c', c.toFixed(3))
}

let previewing: number | null = null

// `date 06:30` in the console tries another time of day.
export function previewHour(hour: number | null) {
  previewing = hour
  apply(hour ?? hourOf(new Date()))
}

export function currentHour() {
  return previewing ?? hourOf(new Date())
}

export function startTimeLight() {
  apply(currentHour())
  const timer = window.setInterval(() => apply(currentHour()), 5 * 60_000)
  return () => window.clearInterval(timer)
}
