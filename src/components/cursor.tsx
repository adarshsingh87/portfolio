import { useEffect, useRef } from 'react'

export function CursorField() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    let pointerX = -100
    let pointerY = -100
    let ringX = -100
    let ringY = -100
    let frame = 0
    let lastTrailAt = 0
    const trails: HTMLSpanElement[] = []

    document.body.classList.add('cursor-ready')

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      dot.classList.add('is-visible')
      ring.classList.add('is-visible')

      if (event.timeStamp - lastTrailAt < 90) return
      lastTrailAt = event.timeStamp
      const trail = document.createElement('span')
      trail.className = 'cursor-trail'
      trail.setAttribute('aria-hidden', 'true')
      trail.style.left = `${event.clientX}px`
      trail.style.top = `${event.clientY}px`
      document.body.appendChild(trail)
      trails.push(trail)
      window.setTimeout(() => {
        trail.remove()
        const index = trails.indexOf(trail)
        if (index >= 0) trails.splice(index, 1)
      }, 850)
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const interactive = target.closest('a, button, [data-cursor]')
      if (!interactive) return
      const cursorTarget = interactive as HTMLElement
      const href =
        interactive instanceof HTMLAnchorElement ? interactive.href : ''
      label.textContent =
        cursorTarget.dataset.cursor || (href.startsWith('http') ? 'Open' : '')
      document.body.classList.toggle('cursor-hover', Boolean(label.textContent))
    }

    const onPointerOut = (event: PointerEvent) => {
      const target = event.relatedTarget
      if (
        !(target instanceof Element) ||
        !target.closest('a, button, [data-cursor]')
      ) {
        document.body.classList.remove('cursor-hover')
        label.textContent = ''
      }
    }

    const render = () => {
      ringX += (pointerX - ringX) * 0.16
      ringY += (pointerY - ringY) * 0.16
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      frame = window.requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    frame = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      document.body.classList.remove('cursor-ready', 'cursor-hover')
      trails.forEach((trail) => trail.remove())
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
