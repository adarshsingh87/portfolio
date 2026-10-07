import { useEffect, useRef } from 'react'
import type { CSSProperties, ElementType } from 'react'

// Display type drawn as three coloured light signals over a white core.
// In register the signals sum to white and disappear into the letters.
// Out of register, they show up as fringes. Headings arrive out of register
// and settle as they scroll in (pure CSS); the hero also leans with the
// pointer and settles when it stops.

type Props = {
  text: string | string[]
  as?: ElementType
  id?: string
  className?: string
  hero?: boolean
  style?: CSSProperties
}

export function Registered({
  text,
  as: Tag = 'span',
  id,
  className,
  hero = false,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const lines = Array.isArray(text) ? text : [text]

  useEffect(() => {
    if (hero && ref.current) return leanWithPointer(ref.current)
  }, [hero])

  const content = lines.map((line) => (
    <span key={line} className="reg-line">
      {line}
    </span>
  ))

  return (
    <Tag
      id={id}
      ref={ref}
      style={style}
      className={className ? `reg ${className}` : 'reg'}
      data-hero={hero || undefined}
    >
      <span className="reg-core">{content}</span>
      <span className="reg-layer reg-a" aria-hidden="true">
        {content}
      </span>
      <span className="reg-layer reg-b" aria-hidden="true">
        {content}
      </span>
      <span className="reg-layer reg-c" aria-hidden="true">
        {content}
      </span>
    </Tag>
  )
}

// A damped spring chases the pointer's velocity. While the pointer moves,
// the signals lag and lead; once it stops, they settle back into register.
function leanWithPointer(el: HTMLElement) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (!fine.matches || calm.matches) return

  let x = 0
  let y = 0
  let vx = 0
  let vy = 0
  let tx = 0
  let ty = 0
  let lastX = 0
  let lastY = 0
  let lastT = 0
  let raf = 0
  let prev = 0

  const STIFFNESS = 170
  const DAMPING = 11
  const GAIN = 0.00006
  const LIMIT = 0.1

  const clamp = (n: number) => Math.max(-LIMIT, Math.min(LIMIT, n))

  const onMove = (event: PointerEvent) => {
    const now = performance.now()
    const dt = Math.max(8, now - lastT)
    if (lastT !== 0) {
      tx = clamp(((event.clientX - lastX) / dt) * GAIN * 1000)
      ty = clamp(((event.clientY - lastY) / dt) * GAIN * 1000)
    }
    lastX = event.clientX
    lastY = event.clientY
    lastT = now
    if (!raf) {
      prev = now
      raf = requestAnimationFrame(tick)
    }
  }

  const tick = (now: number) => {
    const dt = Math.min(0.034, (now - prev) / 1000)
    prev = now
    // The target decays so a stopped pointer pulls the signals home.
    tx *= 0.9
    ty *= 0.9
    vx += ((tx - x) * STIFFNESS - vx * DAMPING) * dt
    vy += ((ty - y) * STIFFNESS - vy * DAMPING) * dt
    x += vx * dt
    y += vy * dt
    el.style.setProperty('--vx', x.toFixed(4))
    el.style.setProperty('--vy', y.toFixed(4))
    const resting =
      Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) < 0.0008
    if (resting) {
      raf = 0
      el.style.setProperty('--vx', '0')
      el.style.setProperty('--vy', '0')
      return
    }
    raf = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    window.removeEventListener('pointermove', onMove)
    cancelAnimationFrame(raf)
  }
}
