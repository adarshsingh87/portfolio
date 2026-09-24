import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { NAV, SITE } from '../data/site'
import { GitHubIcon, LinkedInIcon, XIcon } from './icons'

const navItems = NAV.filter((item) => item.label !== 'Contact')

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen)
    return () => document.body.classList.remove('menu-is-open')
  }, [menuOpen])

  return (
    <header className="site-nav site-chrome">
      <div className="nav-shell">
        <Link
          to="/"
          className="brand-lockup"
          aria-label="Adarsh Singh home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark" aria-hidden="true">
            AS
          </span>
          <span className="brand-name">{SITE.name}</span>
          <span className="brand-index">/ 87</span>
        </Link>

        <nav className="primary-nav" aria-label="Primary">
          {navItems.slice(0, 3).map((item) =>
            item.href === '/blog' ? (
              <Link key={item.label} className="nav-link" to={item.href}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} className="nav-link" href={item.href}>
                {item.label}
              </a>
            ),
          )}
          <a className="nav-link nav-about-link" href="/#about">
            About
          </a>
          <a className="nav-contact" href={`mailto:${SITE.email}`}>
            Email <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          <i aria-hidden="true">
            <b />
            <b />
          </i>
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`mobile-nav ${menuOpen ? 'mobile-nav-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-nav-inner">
          <p className="mobile-nav-kicker">
            Adarsh Singh / CTO at SmokeTrees Digital
          </p>
          <nav aria-label="Mobile primary">
            {NAV.map((item, index) =>
              item.href === '/blog' ? (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <p className="mobile-nav-foot">Systems / product / delivery / team</p>
        </div>
      </div>
    </header>
  )
}

function LocalClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date()),
      )
    update()
    const timer = window.setInterval(update, 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return <time dateTime="Asia/Kolkata">{time || '—:—'} IST</time>
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-identity">
          <p className="footer-name">{SITE.name}</p>
          <p className="footer-copy">
            CTO at{' '}
            <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">
              {SITE.company}
            </a>{' '}
            · {SITE.location}
          </p>
        </div>
        <p className="footer-signal">
          <span>Signal</span>
          <i /> <LocalClock />
        </p>
        <nav aria-label="Footer" className="footer-nav">
          <Link to="/blog">Blog</Link>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon size={14} /> GitHub
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon size={14} /> LinkedIn
          </a>
          <a href={SITE.twitter} target="_blank" rel="noopener noreferrer">
            <XIcon size={13} /> X
          </a>
          <a href={`mailto:${SITE.email}`}>Email</a>
        </nav>
      </div>
    </footer>
  )
}

export function SectionHead(props: {
  index: string
  title: string
  note?: string
}) {
  return (
    <div className="section-head">
      <h2>
        <span>{props.index}</span>
        {props.title}
      </h2>
      {props.note ? <p>{props.note}</p> : null}
    </div>
  )
}
