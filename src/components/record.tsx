import { useState } from 'react'
import type { PointerEvent } from 'react'
import { RECORD } from '../data/record'
import { WEEKS } from '../lib/contributions'

// Every week since October 2019 as one bar. Pick a year to read what the
// bars were about. Heights use a square root so the early years stay visible
// next to the later ones.

const W = 1000
const H = 280
const PEAK = Math.max(...WEEKS.map((w) => w.total))
const STEP = W / WEEKS.length
const FMT = new Intl.NumberFormat('en-IN')
const DAY = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const YEAR_SPANS = RECORD.map(({ year }) => {
  const weeks = WEEKS.filter((w) => w.year === year)
  return {
    year,
    from: weeks[0].index,
    to: weeks[weeks.length - 1].index + 1,
  }
})

export function Record() {
  const [active, setActive] = useState(2023)
  const [hover, setHover] = useState<number | null>(null)
  const at = Math.max(
    0,
    RECORD.findIndex((r) => r.year === active),
  )
  const current = RECORD[at]
  const week = hover === null ? null : WEEKS[hover]
  const prev = at > 0 ? RECORD[at - 1] : undefined
  const next = at < RECORD.length - 1 ? RECORD[at + 1] : undefined

  // The chart answers wherever the pointer is over it, not only over a bar,
  // so the thin early weeks are as easy to read as the tall ones.
  function onMove(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    const fraction = (event.clientX - box.left) / box.width
    const index = Math.min(
      WEEKS.length - 1,
      Math.max(0, Math.floor(fraction * WEEKS.length)),
    )
    setHover(index)
    setActive(WEEKS[index].year)
  }

  return (
    <div className="record-viz">
      <div
        className="record-plot"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
        onPointerCancel={() => setHover(null)}
      >
        <svg
          className="record-chart"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`GitHub contributions per week since October 2019, ${FMT.format(
            RECORD.reduce((n, y) => n + y.total, 0),
          )} in all. Four thousand a year since 2023, up from under eight hundred.`}
        >
          {WEEKS.map((w) => {
            const h = Math.max(2, Math.sqrt(w.total / PEAK) * (H - 8))
            return (
              <rect
                key={w.index}
                x={w.index * STEP + STEP * 0.18}
                y={H - h}
                width={STEP * 0.64}
                height={h}
                data-active={w.year === active}
                data-hover={w.index === hover || undefined}
              />
            )
          })}
        </svg>
        {week ? (
          <div
            className="record-tip"
            aria-hidden="true"
            data-flip={week.index > WEEKS.length * 0.7 || undefined}
            style={{ left: `${((week.index + 0.5) / WEEKS.length) * 100}%` }}
          >
            <p>
              <strong>{FMT.format(week.total)}</strong>{' '}
              {week.total === 1 ? 'contribution' : 'contributions'}, week of{' '}
              {DAY.format(week.start)}
            </p>
          </div>
        ) : null}
      </div>

      <div className="record-years" role="group" aria-label="Choose a year">
        {YEAR_SPANS.map(({ year, from, to }) => (
          <button
            key={year}
            type="button"
            aria-pressed={year === active}
            aria-label={String(year)}
            style={{
              left: `${(from / WEEKS.length) * 100}%`,
              width: `${((to - from) / WEEKS.length) * 100}%`,
            }}
            onClick={() => setActive(year)}
            onPointerEnter={() => setActive(year)}
            onFocus={() => setActive(year)}
          >
            <span>{year}</span>
          </button>
        ))}
      </div>

      <div className="record-read" aria-live="polite">
        <p className="record-read-year">{current.year}</p>
        <p className="record-read-total">
          {FMT.format(current.total)}
          <span> contributions</span>
        </p>
        <p className="record-read-note">{current.note}</p>
        <div className="record-step">
          <button
            type="button"
            className="chip-button"
            disabled={!prev}
            onClick={() => prev && setActive(prev.year)}
          >
            {prev ? `Back to ${prev.year}` : 'Earliest'}
          </button>
          <button
            type="button"
            className="chip-button"
            disabled={!next}
            onClick={() => next && setActive(next.year)}
          >
            {next ? `On to ${next.year}` : 'Latest'}
          </button>
        </div>
      </div>
    </div>
  )
}
