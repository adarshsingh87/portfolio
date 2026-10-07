import contributions from '../data/contributions.json'

const DAY_MS = 86_400_000

function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

const counts = contributions.counts.split(',').map((c) => parseInt(c, 36))
const start = parseDate(contributions.start)

export const FETCHED = contributions.fetched

export function countAt(ts: number): number | null {
  const i = Math.round((ts - start) / DAY_MS)
  return i >= 0 && i < counts.length ? counts[i] : null
}

export type Week = {
  index: number
  year: number
  total: number
  // First day of the week, as a UTC timestamp.
  start: number
}

// Seven-day buckets from the first day in the record. A week belongs to the
// year its first day falls in.
export const WEEKS: Week[] = Array.from(
  { length: Math.ceil(counts.length / 7) },
  (_, index) => {
    const from = index * 7
    const total = counts.slice(from, from + 7).reduce((a, b) => a + b, 0)
    return {
      index,
      year: new Date(start + from * DAY_MS).getUTCFullYear(),
      total,
      start: start + from * DAY_MS,
    }
  },
)
