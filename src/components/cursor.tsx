import { useEffect, useRef } from 'react'

export function CursorField() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let pointerX = -100
    let pointerY = -100
    let ringX = -100
    let ringY = -100
    let frame = 0

    document.body.classList.add('cursor-ready')

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      dot.classList.add('is-visible')
      ring.classList.add('is-visible')
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const interactive = target.closest('a, button, [data-cursor]')
      document.body.classList.toggle('cursor-hover', Boolean(interactive))
    }

    const onPointerOut = (event: PointerEvent) => {
      const target = event.relatedTarget
      if (
        !(target instanceof Element) ||
        !target.closest('a, button, [data-cursor]')
      ) {
        document.body.classList.remove('cursor-hover')
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
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
