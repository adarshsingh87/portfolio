import { useEffect, useRef, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { NAV, SITE } from '../data/site'
import { Registered } from './registered'
import { defaultAtmosphere } from '../lib/atmosphere'

// Three overlapping signals. Where they agree, the mark is white.
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <circle cx="12.5" cy="12" r="8.5" fill="rgb(255 59 48)" />
      <circle cx="19.5" cy="12" r="8.5" fill="rgb(0 255 122)" />
      <circle cx="16" cy="19" r="8.5" fill="rgb(58 91 255)" />
    </svg>
  )
}

// Runs `setup` once the page is mounted and again after every client
// navigation has finished rendering. Navigations render inside a view
// transition, so reading the DOM when the URL changes would still find the
// previous page. `setup` may return a cleanup.
function usePageReady(setup: (pathname: string) => void | (() => void)) {
  const router = useRouter()
  const latest = useRef(setup)
  latest.current = setup

  useEffect(() => {
    let cleanup: void | (() => void)
    let frame = 0
    const run = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        cleanup?.()
        cleanup = latest.current(window.location.pathname)
      })
    }
    run()
    const unsubscribe = router.subscribe('onResolved', run)
    return () => {
      unsubscribe()
      cancelAnimationFrame(frame)
      cleanup?.()
    }
  }, [router])
}

// The page decides what the light looks like. Whichever [data-atmo] block
// crosses the middle of the viewport sets it on <html>, and the CSS does
// the rest. The pointer nudges the lights a little on devices that have one.
export function Atmosphere() {
  const ref = useRef<HTMLDivElement>(null)

  usePageReady((pathname) => {
    const root = document.documentElement
    root.dataset.atmo = defaultAtmosphere(pathname)
    const blocks = document.querySelectorAll<HTMLElement>('[data-atmo]')
    if (blocks.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            root.dataset.atmo = (entry.target as HTMLElement).dataset.atmo
          }
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    blocks.forEach((b) => observer.observe(b))
    return () => observer.disconnect()
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || calm.matches) return

    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let raf = 0

    const tick = () => {
      x += (tx - x) * 0.05
      y += (ty - y) * 0.05
      el.style.setProperty('--px', x.toFixed(3))
      el.style.setProperty('--py', y.toFixed(3))
      raf =
        Math.abs(tx - x) + Math.abs(ty - y) > 0.002
          ? requestAnimationFrame(tick)
          : 0
    }
    const onMove = (event: PointerEvent) => {
      tx = (event.clientX / window.innerWidth) * 2 - 1
      ty = (event.clientY / window.innerHeight) * 2 - 1
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="atmo" ref={ref} aria-hidden="true">
      <i className="a" />
      <i className="b" />
      <i className="c" />
    </div>
  )
}

export function Nav() {
  const [context, setContext] = useState('')

  usePageReady(() => {
    setContext('')
    const chapters = document.querySelectorAll<HTMLElement>('[data-chapter]')
    if (chapters.length === 0) return
    // A band across the middle of the viewport: whichever chapter crosses it
    // is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const name = (entry.target as HTMLElement).dataset.chapter ?? ''
          if (entry.isIntersecting) setContext(name)
          else setContext((current) => (current === name ? '' : current))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    chapters.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  })

  return (
    <header className="nav">
      <Link to="/" className="nav-mark" aria-label={`${SITE.name}, home`}>
        <Mark />
        <span>{SITE.name}</span>
      </Link>
      <p className="nav-context" data-empty={context === ''} aria-hidden="true">
        <span key={context}>{context}</span>
      </p>
      <nav className="nav-links" aria-label="Primary">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{ 'aria-current': 'page' }}
          >
            {item.label}
          </Link>
        ))}
        <a href="#contact">Contact</a>
        <span className="nav-progress" aria-hidden="true" />
      </nav>
    </header>
  )
}

// Fine pointers only. A thin lens settles around links and buttons, so the
// target feels held. The native cursor is left alone.
export function Halo() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || calm.matches) return

    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let raf = 0

    const tick = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      raf =
        Math.abs(tx - x) + Math.abs(ty - y) > 0.3
          ? requestAnimationFrame(tick)
          : 0
    }

    const onMove = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onOver = (event: PointerEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(
              'a[href], button:not(:disabled), [data-cursor]',
            )
          : null
      if (target) {
        el.dataset.on = 'true'
        el.dataset.label = target.dataset.cursor ?? ''
      } else {
        delete el.dataset.on
        el.dataset.label = ''
      }
    }

    const onLeave = () => {
      delete el.dataset.on
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="halo" ref={ref} aria-hidden="true">
      <span />
    </div>
  )
}

export function SiteFooter() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
    } catch {
      window.location.href = `mailto:${SITE.email}`
    }
  }

  return (
    <footer className="footer" id="contact" data-atmo="end">
      <div className="wrap">
        <p className="footer-lede">
          If your product depends on a system that has to hold up,
        </p>
        <Registered as="h2" className="footer-title" text={['Write to me.']} />
        <p className="footer-email">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <button type="button" className="chip-button" onClick={copy}>
            <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
          </button>
        </p>
        <div className="footer-base">
          <ul className="footer-links">
            <li>
              <a
                href={SITE.github}
                rel="me noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={SITE.linkedin}
                rel="me noopener noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={SITE.twitter}
                rel="me noopener noreferrer"
                target="_blank"
              >
                X
              </a>
            </li>
            <li>
              <a
                href={SITE.companyUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                SmokeTrees Digital
              </a>
            </li>
          </ul>
          <p className="footer-fine">
            Press <kbd>/</kbd> for a console.
          </p>
        </div>
      </div>
    </footer>
  )
}
