import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { NAV, SITE } from '../data/site'

export function Masthead() {
  return (
    <header className="masthead" data-masthead>
      <Link to="/" className="masthead-name">
        {SITE.name}
      </Link>
      <nav className="masthead-nav" aria-label="Primary">
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
      </nav>
    </header>
  )
}

// The dock takes over from the masthead once it scrolls away. It carries the
// same links plus the name of whatever you are looking at, and a thin
// progress line driven by a CSS scroll timeline.
export function Dock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [visible, setVisible] = useState(false)
  const [context, setContext] = useState('')

  useEffect(() => {
    const masthead = document.querySelector('[data-masthead]')
    if (!masthead) return
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(!entry.isIntersecting),
    )
    observer.observe(masthead)
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
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
  }, [pathname])

  return (
    <nav
      className="dock"
      aria-label="Shortcuts"
      data-visible={visible}
      inert={!visible}
    >
      <Link to="/" className="dock-home" aria-label="Home">
        <span aria-hidden="true">AS</span>
      </Link>
      <span className="dock-context" data-empty={context === ''}>
        {context}
      </span>
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
      <span className="dock-progress" aria-hidden="true" />
    </nav>
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
    <footer className="footer" id="contact">
      <div className="footer-contact">
        <h2 className="footer-title">
          If your product depends on a system that has to hold up, write to me.
        </h2>
        <p className="footer-email">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <button type="button" className="chip-button" onClick={copy}>
            <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
          </button>
        </p>
      </div>
      <div className="footer-base">
        <ul className="footer-links">
          <li>
            <a href={SITE.github} rel="me noopener noreferrer" target="_blank">
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
            <a href={SITE.twitter} rel="me noopener noreferrer" target="_blank">
              X
            </a>
          </li>
          <li>
            <a href={SITE.companyUrl} rel="noopener noreferrer" target="_blank">
              SmokeTrees Digital
            </a>
          </li>
        </ul>
        <p className="footer-fine">
          Press <kbd>/</kbd> for a console.
        </p>
      </div>
    </footer>
  )
}
