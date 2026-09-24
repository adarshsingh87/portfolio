import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { SiteFooter, SiteNav } from './site'

type CauseId = 'unbuilt' | 'renamed' | 'future-feature' | 'user-confidence'

type Cause = {
  id: CauseId
  label: string
  body: string
}

type Evidence = {
  label: string
  detail: string
  cause: CauseId
  x: number
  y: number
}

type RouteThread = {
  x1: number
  y1: number
  x2: number
  y2: number
  cause: CauseId
  kind: 'core' | 'evidence' | 'cross'
}

const CAUSES: Cause[] = [
  {
    id: 'unbuilt',
    label: 'unbuilt',
    body: 'The page was a good idea in a meeting. It never became a route.',
  },
  {
    id: 'renamed',
    label: 'renamed',
    body: 'The URL changed quietly while the old link kept its dignity.',
  },
  {
    id: 'future-feature',
    label: 'future feature',
    body: 'This page is still somewhere in the roadmap, waiting for a better name.',
  },
  {
    id: 'user-confidence',
    label: 'user confidence',
    body: 'The URL was entered with conviction and absolutely no evidence.',
  },
]

const EVIDENCE: Evidence[] = [
  {
    label: 'meeting notes',
    detail: 'idea / 04.12',
    cause: 'unbuilt',
    x: 50,
    y: 8,
  },
  {
    label: 'browser history',
    detail: 'stale link / 03',
    cause: 'user-confidence',
    x: 15,
    y: 50,
  },
  {
    label: 'deployment log',
    detail: 'no route / 09:14',
    cause: 'renamed',
    x: 85,
    y: 50,
  },
  {
    label: 'url parser',
    detail: '404 / unresolved',
    cause: 'future-feature',
    x: 50,
    y: 92,
  },
]

const THREADS: RouteThread[] = [
  { x1: 50, y1: 50, x2: 20, y2: 22, cause: 'unbuilt', kind: 'core' },
  { x1: 50, y1: 50, x2: 80, y2: 22, cause: 'renamed', kind: 'core' },
  { x1: 50, y1: 50, x2: 80, y2: 78, cause: 'future-feature', kind: 'core' },
  { x1: 50, y1: 50, x2: 20, y2: 78, cause: 'user-confidence', kind: 'core' },
  { x1: 20, y1: 22, x2: 50, y2: 8, cause: 'unbuilt', kind: 'evidence' },
  { x1: 80, y1: 22, x2: 85, y2: 50, cause: 'renamed', kind: 'evidence' },
  { x1: 80, y1: 78, x2: 50, y2: 92, cause: 'future-feature', kind: 'evidence' },
  {
    x1: 20,
    y1: 78,
    x2: 15,
    y2: 50,
    cause: 'user-confidence',
    kind: 'evidence',
  },
  { x1: 50, y1: 8, x2: 15, y2: 50, cause: 'unbuilt', kind: 'cross' },
  { x1: 85, y1: 50, x2: 50, y2: 92, cause: 'renamed', kind: 'cross' },
  { x1: 50, y1: 92, x2: 15, y2: 50, cause: 'future-feature', kind: 'cross' },
  { x1: 15, y1: 50, x2: 50, y2: 8, cause: 'user-confidence', kind: 'cross' },
]

export function NotFoundPage() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const [phase, setPhase] = useState<'diagnosing' | 'board'>('diagnosing')
  const [selectedCause, setSelectedCause] = useState<CauseId>(CAUSES[0].id)

  useEffect(() => {
    setPhase('diagnosing')
    const timer = window.setTimeout(() => setPhase('board'), 1500)
    return () => window.clearTimeout(timer)
  }, [pathname])

  const cause = CAUSES.find((item) => item.id === selectedCause) ?? CAUSES[0]

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
              <span>cause unresolved / 12 threads</span>
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
              <svg
                className="route-threads"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {THREADS.map((thread, index) => (
                  <line
                    key={`${thread.cause}-${thread.kind}-${index}`}
                    className={`route-thread route-thread-${thread.kind} ${selectedCause === thread.cause ? 'route-thread-active' : ''}`}
                    x1={thread.x1}
                    y1={thread.y1}
                    x2={thread.x2}
                    y2={thread.y2}
                  />
                ))}
              </svg>
              <div className="route-node route-node-primary">
                <span>404</span>
                <strong>missing route</strong>
              </div>
              {CAUSES.map((item, index) => (
                <button
                  type="button"
                  className={`route-node route-node-cause route-node-cause-${index + 1} ${selectedCause === item.id ? 'route-node-selected' : ''}`}
                  key={item.id}
                  onClick={() => setSelectedCause(item.id)}
                  aria-pressed={selectedCause === item.id}
                >
                  <span>0{index + 1}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
              {EVIDENCE.map((item) => (
                <button
                  type="button"
                  className={`route-node route-node-evidence ${selectedCause === item.cause ? 'route-node-selected' : ''}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  key={item.label}
                  onClick={() => setSelectedCause(item.cause)}
                  aria-pressed={selectedCause === item.cause}
                >
                  <span>evidence / {item.detail}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
              <div className="route-board-legend" aria-hidden="true">
                <span>
                  <i className="route-legend-core" /> primary cause
                </span>
                <span>
                  <i className="route-legend-evidence" /> supporting evidence
                </span>
                <span>
                  <i className="route-legend-cross" /> speculative link
                </span>
              </div>
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
