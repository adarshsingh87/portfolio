import { RECORD } from '../data/record'
import { buildFloors } from '../lib/contributions'

// The hero's building again, one floor per row: each strip is a year of
// weekly totals, so the jump in 2023 is visible before you read a number.

const FLOORS = new Map(buildFloors().map((f) => [f.year, f]))

function weeklyTotals(year: number) {
  const floor = FLOORS.get(year)
  if (!floor) return []
  const weeks: (number | null)[] = []
  for (let w = 0; w < floor.weeks; w++) {
    const days = floor.days.slice(w * 7, w * 7 + 7)
    const known = days.filter((d): d is number => d !== null)
    weeks.push(known.length === 0 ? null : known.reduce((a, b) => a + b, 0))
  }
  return weeks
}

const STRIPS = RECORD.map((r) => ({ ...r, weeks: weeklyTotals(r.year) }))
const NEWEST_FIRST = [...STRIPS].reverse()
const PEAK = Math.max(
  1,
  ...STRIPS.flatMap((s) => s.weeks.filter((w): w is number => w !== null)),
)
const NUMBER = new Intl.NumberFormat('en-IN')

export function Record() {
  return (
    <ol className="record-list" reversed>
      {NEWEST_FIRST.map((y) => (
        <li key={y.year}>
          <span className="record-year">{y.year}</span>
          <svg
            className="record-strip"
            viewBox="0 0 530 28"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {y.weeks.map((w, i) => {
              if (w === null) return null
              // Square root keeps quiet weeks visible without flattening
              // the difference between 2021 and 2024.
              const t = Math.sqrt(w / PEAK)
              const h = w === 0 ? 2 : 3 + 25 * t
              return (
                <rect
                  key={i}
                  x={i * 10 + 1}
                  y={28 - h}
                  width={8}
                  height={h}
                  rx={1}
                  data-lit={w > 0}
                  style={
                    w > 0
                      ? { opacity: (0.35 + 0.65 * t).toFixed(2) }
                      : undefined
                  }
                />
              )
            })}
          </svg>
          <span className="record-total">
            {NUMBER.format(y.total)}
            <span className="sr-only"> contributions</span>
          </span>
          <p className="record-note">{y.note}</p>
        </li>
      ))}
    </ol>
  )
}
