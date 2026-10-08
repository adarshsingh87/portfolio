import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { RECORD } from '../data/record'
import { WEEKS } from '../lib/contributions'
import { onReplay, takeReplay } from '../lib/replay'

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

// Contributions so far in a week's own year, counting that week.
const RUNNING = (() => {
  let year = 0
  let sum = 0
  return WEEKS.map((w) => {
    if (w.year !== year) {
      year = w.year
      sum = 0
    }
    sum += w.total
    return sum
  })
})()

// The replay takes about a second per year.
const WEEK_MS = 24

export function Record() {
  const [active, setActive] = useState(2023)
  const [hover, setHover] = useState<number | null>(null)
  // Where the replay has got to, in weeks. Null when it is not playing.
  const [play, setPlay] = useState<number | null>(null)
  // Counts replay requests. Zero means none is running. Kept in state, not
  // in the effect, so a re-run effect picks the replay up again.
  const [run, setRun] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (takeReplay()) setRun((r) => r + 1)
    return onReplay(() => {
      takeReplay()
      setRun((r) => r + 1)
    })
  }, [])

  useEffect(() => {
    if (run === 0) {
      setPlay(null)
      return
    }
    let raf = 0
    let timer = 0
    const finish = () => {
      setRun(0)
      setActive(WEEKS[WEEKS.length - 1].year)
    }

    setHover(null)
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rootRef.current?.scrollIntoView({
      block: 'center',
      behavior: calm ? 'auto' : 'smooth',
    })

    if (calm) {
      // Reduced motion: one still frame per year instead of a sweep.
      let y = 0
      setPlay(YEAR_SPANS[0].to - 1)
      timer = window.setInterval(() => {
        y++
        if (y >= YEAR_SPANS.length) finish()
        else setPlay(YEAR_SPANS[y].to - 1)
      }, 900)
    } else {
      setPlay(0)
      let t0 = 0
      const tick = (now: number) => {
        // Give the scroll a moment to land before the first bar grows.
        if (!t0) t0 = now + 500
        const at = Math.max(0, (now - t0) / WEEK_MS)
        if (at >= WEEKS.length) {
          finish()
          return
        }
        setPlay(at)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(timer)
    }
  }, [run])

  const stop = () => setRun(0)

  const playing = play !== null
  const head = playing ? Math.floor(play) : null
  const shown = head === null ? active : WEEKS[head].year
  const at = Math.max(
    0,
    RECORD.findIndex((r) => r.year === shown),
  )
  const current = RECORD[at]
  const marker = head ?? hover
  const week = marker === null ? null : WEEKS[marker]
  const prev = at > 0 ? RECORD[at - 1] : undefined
  const next = at < RECORD.length - 1 ? RECORD[at + 1] : undefined

  // The chart answers wherever the pointer is over it, not only over a bar,
  // so the thin early weeks are as easy to read as the tall ones.
  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (playing) {
      if (event.type !== 'pointerdown') return
      // A tap on the chart stops the replay and hands it back.
      stop()
    }
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
    <div
      className="record-viz"
      ref={rootRef}
      data-playing={playing || undefined}
    >
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
            const grown =
              head === null || w.index < head
                ? 1
                : w.index === head
                  ? (play as number) - head
                  : 0
            const h =
              grown === 0
                ? 0
                : Math.max(2, Math.sqrt(w.total / PEAK) * (H - 8) * grown)
            return (
              <rect
                key={w.index}
                x={w.index * STEP + STEP * 0.18}
                y={H - h}
                width={STEP * 0.64}
                height={h}
                data-active={w.year === shown}
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
            aria-pressed={year === shown}
            aria-label={String(year)}
            style={{
              left: `${(from / WEEKS.length) * 100}%`,
              width: `${((to - from) / WEEKS.length) * 100}%`,
            }}
            onClick={() => {
              stop()
              setActive(year)
            }}
            onPointerEnter={() => setActive(year)}
            onFocus={() => setActive(year)}
          >
            <span>{year}</span>
          </button>
        ))}
      </div>

      {/* Quiet while the replay runs, or it would read out every frame. */}
      <div className="record-read" aria-live={playing ? 'off' : 'polite'}>
        <p className="record-read-year">{current.year}</p>
        <p className="record-read-total">
          {FMT.format(head === null ? current.total : RUNNING[head])}
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
