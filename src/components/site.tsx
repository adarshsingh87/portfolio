import { Link } from '@tanstack/react-router'
import { SITE } from '../data/site'
import { GitHubIcon, LinkedInIcon, XIcon } from './icons'

export function SiteNav() {
  return (
    <header className="site-nav site-chrome">
      <div className="nav-shell">
        <Link to="/" className="brand-lockup" aria-label="Adarsh Singh home">
          <span className="brand-mark" aria-hidden="true">
            AS
          </span>
          <span className="brand-name">
            {SITE.name}
            <span className="brand-role">CTO / builder</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="primary-nav">
          <a className="nav-link" href="/#work">
            Work
          </a>
          <a className="nav-link" href="/#experience">
            Experience
          </a>
          <a className="nav-link" href="/#stack">
            Stack
          </a>
          <Link className="nav-link" to="/blog">
            Notes
          </Link>
          <a className="nav-cta" href={`mailto:${SITE.email}`}>
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div>
          <p className="footer-name">{SITE.name}</p>
          <p className="footer-copy">
            CTO at{' '}
            <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">
              {SITE.company}
            </a>{' '}
            · {SITE.location}
          </p>
        </div>
        <p className="footer-note">Architecture / delivery / operations</p>
        <nav aria-label="Footer" className="footer-nav">
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
    <div className="mb-8 flex items-baseline justify-between gap-6">
      <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-tight text-ink sm:text-2xl">
        <span className="font-mono text-xs font-medium text-signal">
          {props.index}
        </span>
        {props.title}
      </h2>
      {props.note ? (
        <p className="hidden max-w-xs text-right text-[13px] leading-relaxed text-fog sm:block">
          {props.note}
        </p>
      ) : null}
    </div>
  )
}
