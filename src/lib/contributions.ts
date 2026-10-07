import contributions from '../data/contributions.json'

export type Floor = {
  year: number
  // Index 0 is the Monday of the first week shown for that year.
  // null marks days outside the record (before the account, or in the future).
  days: (number | null)[]
  weeks: number
}

const DAY_MS = 86_400_000

function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

// Monday-first weekday index for a UTC timestamp.
function weekday(ts: number) {
  return (new Date(ts).getUTCDay() + 6) % 7
}

const counts = contributions.counts.split(',').map((c) => parseInt(c, 36))
const start = parseDate(contributions.start)

export const FETCHED = contributions.fetched

export function countAt(ts: number): number | null {
  const i = Math.round((ts - start) / DAY_MS)
  return i >= 0 && i < counts.length ? counts[i] : null
}

// Each calendar year becomes one floor: 53 Monday-aligned week columns.
export function buildFloors(): Floor[] {
  const floors: Floor[] = []
  for (const { year } of contributions.years) {
    const jan1 = Date.UTC(year, 0, 1)
    const firstMonday = jan1 - weekday(jan1) * DAY_MS
    const days: (number | null)[] = []
    for (let w = 0; w < 53; w++) {
      for (let d = 0; d < 7; d++) {
        const ts = firstMonday + (w * 7 + d) * DAY_MS
        const inYear = new Date(ts).getUTCFullYear() === year
        days.push(inYear ? countAt(ts) : null)
      }
    }
    floors.push({ year, days, weeks: 53 })
  }
  return floors
}

export function dateFor(year: number, index: number) {
  const jan1 = Date.UTC(year, 0, 1)
  const firstMonday = jan1 - weekday(jan1) * DAY_MS
  return new Date(firstMonday + index * DAY_MS)
}

// A high percentile rather than the max, so one 111-commit day does not
// dim every other window.
export function brightnessScale(floors: Floor[]) {
  const values = floors
    .flatMap((f) => f.days)
    .filter((v): v is number => v !== null && v > 0)
    .sort((a, b) => a - b)
  return values[Math.floor(values.length * 0.97)] ?? 1
}
