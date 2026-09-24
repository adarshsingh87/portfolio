import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { SiteFooter, SiteNav } from './site'

const CAUSES = [
  {
    label: 'unbuilt',
    body: 'The page was a good idea in a meeting. It never became a route.',
  },
  {
    label: 'renamed',
    body: 'The URL changed quietly while the old link kept its dignity.',
  },
  {
    label: 'future feature',
    body: 'This page is still somewhere in the roadmap, waiting for a better name.',
  },
  {
    label: 'user confidence',
    body: 'The URL was entered with conviction and absolutely no evidence.',
  },
]

export function NotFoundPage() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const [phase, setPhase] = useState<'diagnosing' | 'board'>('diagnosing')
  const [selectedCause, setSelectedCause] = useState(CAUSES[0].label)

  useEffect(() => {
    setPhase('diagnosing')
    const timer = window.setTimeout(() => setPhase('board'), 1500)
    return () => window.clearTimeout(timer)
  }, [pathname])

  const cause = CAUSES.find((item) => item.label === selectedCause) ?? CAUSES[0]

  return (
    <div className="not-found-page">
      <SiteNav />
      <main id="main" className="not-found-main">
        {phase === 'diagnosing' ? (
          <section
            className="route-diagnostic"
            aria-labelledby="route-diagnostic-title"
          >
            <span className="section-index">route diagnostic / running</span>
            <h1 id="route-diagnostic-title">
              Trying to route through {pathname}
            </h1>
            <p>Result: the router has feelings.</p>
            <div className="route-diagnostic-log" aria-hidden="true">
              <span>resolving intent</span>
              <span>checking confidence</span>
              <span>consulting the roadmap</span>
            </div>
          </section>
        ) : (
          <section className="route-board" aria-labelledby="route-board-title">
            <div className="route-board-head">
              <span>route incident / 404</span>
              <span>cause unresolved</span>
            </div>
            <div className="route-board-intro">
              <span className="section-index">
                the requested page has entered an unknown state
              </span>
              <h1 id="route-board-title">
                There is no page here. There is, however, a story.
              </h1>
              <p>
                The URL was received, inspected, and gently released back into
                the ecosystem.
              </p>
            </div>
            <div
              className="route-board-map"
              role="group"
              aria-label="A conspiracy board explaining the missing route"
            >
              <span
                className="route-string route-string-one"
                aria-hidden="true"
              />
              <span
                className="route-string route-string-two"
                aria-hidden="true"
              />
              <span
                className="route-string route-string-three"
                aria-hidden="true"
              />
              <span
                className="route-string route-string-four"
                aria-hidden="true"
              />
              <div className="route-node route-node-primary">
                <span>404</span>
                <strong>missing route</strong>
              </div>
              {CAUSES.map((item, index) => (
                <button
                  type="button"
                  className={`route-node route-node-cause route-node-cause-${index + 1} ${selectedCause === item.label ? 'route-node-selected' : ''}`}
                  key={item.label}
                  onClick={() => setSelectedCause(item.label)}
                  aria-pressed={selectedCause === item.label}
                >
                  <span>0{index + 1}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
            </div>
            <div className="route-board-readout">
              <span>current theory</span>
              <strong>{cause.label}</strong>
              <p>{cause.body}</p>
              <Link className="button button-primary" to="/">
                Return to known reality <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
