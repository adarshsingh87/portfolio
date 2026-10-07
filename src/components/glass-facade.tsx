import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import {
  FETCHED,
  brightnessScale,
  buildFloors,
  dateFor,
} from '../lib/contributions'

// The homepage hero. Every window is one day of GitHub contributions since
// October 2019. Each floor is a year, newest at the top. The whole building
// sits behind frosted glass, and a clear lens brings single days into focus.

const FLOORS = buildFloors().reverse()
const SCALE = brightnessScale(FLOORS)
const PEAK = Math.max(...FLOORS.flatMap((f) => f.days.map((d) => d ?? 0)))
const SLAB = 10 // px between floors, mirrored by --slab in styles.css

const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

// 32-step amber ramp, from a dim ember to an almost white lamp.
const RAMP = Array.from({ length: 32 }, (_, i) => {
  const t = i / 31
  const r = Math.round(150 + 105 * Math.min(1, t * 1.4))
  const g = Math.round(84 + 150 * t)
  const b = Math.round(38 + 150 * t * t)
  const a = (0.42 + 0.58 * t).toFixed(3)
  return `rgba(${r},${g},${b},${a})`
})

const UNLIT = 'rgba(150, 172, 214, 0.075)'
const FUTURE = 'rgba(150, 172, 214, 0.05)'
const SLAB_LINE = 'rgba(176, 196, 232, 0.12)'

type Geometry = {
  w: number
  h: number
  colW: number
  rowH: number
  floorH: number
}

function measure(w: number, h: number): Geometry {
  const floorH = (h - SLAB * (FLOORS.length - 1)) / FLOORS.length
  return { w, h, floorH, colW: w / 53, rowH: floorH / 7 }
}

function cellCenter(g: Geometry, floor: number, index: number) {
  const col = Math.floor(index / 7)
  const row = index % 7
  return {
    x: (col + 0.5) * g.colW,
    y: floor * (g.floorH + SLAB) + (row + 0.5) * g.rowH,
  }
}

function hitTest(g: Geometry, x: number, y: number) {
  const pitch = g.floorH + SLAB
  const floor = Math.min(FLOORS.length - 1, Math.max(0, Math.floor(y / pitch)))
  const within = Math.min(g.floorH - 0.01, Math.max(0, y - floor * pitch))
  const row = Math.floor(within / g.rowH)
  const col = Math.min(52, Math.max(0, Math.floor(x / g.colW)))
  return { floor, index: col * 7 + row }
}

const fetchedTs = Date.parse(`${FETCHED}T00:00:00Z`)

function isFuture(floor: number, index: number) {
  return dateFor(FLOORS[floor].year, index).getTime() > fetchedTs
}

// The lens starts on the busiest day in the record: mid-building, and a
// better first thing to read than today's count.
function parkCell() {
  let best = { floor: 0, index: 0, value: -1 }
  FLOORS.forEach((f, floor) =>
    f.days.forEach((value, index) => {
      if (value !== null && value > best.value) best = { floor, index, value }
    }),
  )
  return { floor: best.floor, index: best.index }
}

const PARK = parkCell()

function describe(floor: number, index: number) {
  const f = FLOORS[floor]
  const value = f.days[index]
  const date = DATE_FMT.format(dateFor(f.year, index))
  if (value === null) {
    return isFuture(floor, index)
      ? `${date}, not yet`
      : `${date}, before GitHub`
  }
  if (value === 0) return `${date}, a quiet day`
  if (value === PEAK) return `${date}, ${value} contributions, the busiest day`
  return `${date}, ${value} contribution${value === 1 ? '' : 's'}`
}

function draw(canvas: HTMLCanvasElement, g: Geometry, dpr: number) {
  canvas.width = Math.round(g.w * dpr)
  canvas.height = Math.round(g.h * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, g.w, g.h)

  const gx = Math.max(0.75, g.colW * 0.2)
  const gy = Math.max(0.75, g.rowH * 0.22)
  const ww = g.colW - gx
  const wh = g.rowH - gy
  const logScale = Math.log1p(SCALE)

  FLOORS.forEach((floor, fi) => {
    const top = fi * (g.floorH + SLAB)
    for (let i = 0; i < floor.days.length; i++) {
      const v = floor.days[i]
      const x = Math.floor(i / 7) * g.colW + gx / 2
      const y = top + (i % 7) * g.rowH + gy / 2
      if (v === null) {
        if (!isFuture(fi, i)) continue
        ctx.fillStyle = FUTURE
      } else if (v === 0) {
        ctx.fillStyle = UNLIT
      } else {
        const t = Math.min(1, Math.log1p(v) / logScale)
        ctx.fillStyle = RAMP[Math.round(t * 31)]
      }
      ctx.fillRect(x, y, ww, wh)
    }
    if (fi < FLOORS.length - 1) {
      ctx.fillStyle = SLAB_LINE
      ctx.fillRect(0, top + g.floorH + SLAB / 2, g.w, 1)
    }
  })
}

export function GlassFacade() {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sharpRef = useRef<HTMLCanvasElement>(null)
  const frostRef = useRef<HTMLCanvasElement>(null)
  const captionRef = useRef<HTMLSpanElement>(null)
  const [announcement, setAnnouncement] = useState('')

  // Transient pointer and lens state lives in a ref: it changes every frame
  // and nothing in React needs to re-render for it.
  const lens = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    raf: 0,
    last: 0,
    floor: -1,
    index: -1,
    g: null as Geometry | null,
    reduced: false,
    cursor: PARK,
  })

  useEffect(() => {
    const stage = stageRef.current
    const sharp = sharpRef.current
    const frost = frostRef.current
    const root = rootRef.current
    if (!stage || !sharp || !frost || !root) return
    const s = lens.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    s.reduced = motion.matches

    const render = () => {
      const rect = stage.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      s.g = measure(rect.width, rect.height)
      draw(sharp, s.g, dpr)
      // The frosted layer is a low-resolution copy: cheaper to blur, and the
      // blur hides the resolution loss anyway.
      frost.width = Math.round(rect.width / 2)
      frost.height = Math.round(rect.height / 2)
      frost.getContext('2d')?.drawImage(sharp, 0, 0, frost.width, frost.height)
      const { floor, index } = s.cursor
      const c = cellCenter(s.g, floor, index)
      s.tx = c.x
      s.ty = c.y
      // A resize changes the geometry under the lens, so snap rather than
      // animate across the building.
      s.x = c.x
      s.y = c.y
      apply()
      root.dataset.lit = 'true'
    }

    const observer = new ResizeObserver(render)
    observer.observe(stage)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(s.raf)
    }
    // apply() and render() only touch refs, so the effect runs once.
  }, [])

  function apply() {
    const s = lens.current
    const root = rootRef.current
    if (!s.g || !root) return
    root.style.setProperty('--lx', `${s.x.toFixed(1)}px`)
    root.style.setProperty('--ly', `${s.y.toFixed(1)}px`)
    // Keep the caption inside the building near its edges.
    const side = s.x > s.g.w - 130 ? 'end' : s.x < 130 ? 'start' : ''
    if (root.dataset.side !== side) {
      if (side) root.dataset.side = side
      else delete root.dataset.side
    }
    root.toggleAttribute('data-below', s.y > s.g.h - 120)
    const { floor, index } = hitTest(s.g, s.x, s.y)
    if (floor !== s.floor || index !== s.index) {
      s.floor = floor
      s.index = index
      if (captionRef.current)
        captionRef.current.textContent = describe(floor, index)
      root
        .querySelector('.facade-years [data-active]')
        ?.removeAttribute('data-active')
      root
        .querySelector(`.facade-years [data-floor="${floor}"]`)
        ?.setAttribute('data-active', '')
    }
  }

  function tick(time: number) {
    const s = lens.current
    const dt = s.last ? Math.min(64, time - s.last) : 16
    s.last = time
    const k = s.reduced ? 1 : 1 - Math.exp(-dt / 65)
    s.x += (s.tx - s.x) * k
    s.y += (s.ty - s.y) * k
    apply()
    if (Math.abs(s.tx - s.x) > 0.2 || Math.abs(s.ty - s.y) > 0.2) {
      s.raf = requestAnimationFrame(tick)
    } else {
      s.raf = 0
      s.last = 0
    }
  }

  function aim(x: number, y: number) {
    const s = lens.current
    s.tx = x
    s.ty = y
    if (!s.raf) s.raf = requestAnimationFrame(tick)
  }

  function aimAtCell(floor: number, index: number) {
    const s = lens.current
    if (!s.g) return
    s.cursor = { floor, index }
    const c = cellCenter(s.g, floor, index)
    aim(c.x, c.y)
  }

  function onPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' && event.buttons === 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    aim(event.clientX - rect.left, event.clientY - rect.top)
  }

  function onLeave() {
    const { floor, index } = lens.current.cursor
    aimAtCell(floor, index)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const s = lens.current
    let { floor, index } = s.cursor
    switch (event.key) {
      case 'ArrowLeft':
        index -= 1
        break
      case 'ArrowRight':
        index += 1
        break
      case 'ArrowUp':
        floor -= 1
        break
      case 'ArrowDown':
        floor += 1
        break
      case 'Home': {
        floor = PARK.floor
        index = PARK.index
        break
      }
      default:
        return
    }
    event.preventDefault()
    const max = FLOORS[0].days.length - 1
    if (index < 0 && floor < FLOORS.length - 1) {
      floor += 1
      index = max
    } else if (index > max && floor > 0) {
      floor -= 1
      index = 0
    }
    floor = Math.min(FLOORS.length - 1, Math.max(0, floor))
    index = Math.min(max, Math.max(0, index))
    aimAtCell(floor, index)
    setAnnouncement(describe(floor, index))
  }

  return (
    <div className="facade" ref={rootRef}>
      <ol className="facade-years" aria-hidden="true">
        {FLOORS.map((f, i) => (
          <li key={f.year} data-floor={i}>
            {f.year}
          </li>
        ))}
      </ol>
      <div
        className="facade-stage"
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="contribution calendar"
        aria-label="Every GitHub contribution since October 2019, one window per day and one floor per year. Use the arrow keys to move between days."
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={onLeave}
        onKeyDown={onKeyDown}
      >
        <canvas className="facade-frost" ref={frostRef} aria-hidden="true" />
        <canvas className="facade-sharp" ref={sharpRef} aria-hidden="true" />
        <div className="facade-glass" aria-hidden="true" />
        <div className="facade-lens" aria-hidden="true">
          <span className="facade-caption" ref={captionRef} />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
