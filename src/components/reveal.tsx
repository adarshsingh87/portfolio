import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Stagger delay in ms. */
  delay?: number
  className?: string
}

/**
 * Subtle scroll-reveal wrapper. Content remains visible in the server render;
 * the client adds a pending class only when an observer is available, so
 * reduced-motion and no-script readers never get hidden content.
 */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('is-visible')
      return
    }
    el.classList.add('reveal-ready')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style: CSSProperties | undefined =
    delay > 0 ? { transitionDelay: `${delay}ms` } : undefined

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  )
}
