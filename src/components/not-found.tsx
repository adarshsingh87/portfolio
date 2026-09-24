import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { SiteFooter, SiteNav } from './site'

type CauseId = 'unbuilt' | 'renamed' | 'future-feature' | 'user-confidence'
type EvidenceId =
  'meeting-notes' | 'browser-history' | 'deployment-log' | 'url-parser'
type NodeId = '404' | CauseId | EvidenceId

type Point = {
  x: number
  y: number
}

type Cause = {
  id: CauseId
  label: string
  body: string
}

type Evidence = {
  id: EvidenceId
  label: string
  detail: string
  cause: CauseId
  x: number
  y: number
}

type RouteThread = {
  from: NodeId
  to: NodeId
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
    id: 'meeting-notes',
    label: 'meeting notes',
    detail: 'idea / 04.12',
    cause: 'unbuilt',
    x: 50,
    y: 8,
  },
  {
    id: 'browser-history',
    label: 'browser history',
    detail: 'stale link / 03',
    cause: 'user-confidence',
    x: 15,
    y: 50,
  },
  {
    id: 'deployment-log',
    label: 'deployment log',
    detail: 'no route / 09:14',
    cause: 'renamed',
    x: 85,
    y: 50,
  },
  {
    id: 'url-parser',
    label: 'url parser',
    detail: '404 / unresolved',
    cause: 'future-feature',
    x: 50,
    y: 92,
  },
]

const INITIAL_NODE_POSITIONS: Record<NodeId, Point> = {
  '404': { x: 50, y: 50 },
  unbuilt: { x: 20, y: 22 },
  renamed: { x: 80, y: 22 },
  'future-feature': { x: 80, y: 78 },
  'user-confidence': { x: 20, y: 78 },
  'meeting-notes': { x: EVIDENCE[0].x, y: EVIDENCE[0].y },
  'browser-history': { x: EVIDENCE[1].x, y: EVIDENCE[1].y },
  'deployment-log': { x: EVIDENCE[2].x, y: EVIDENCE[2].y },
  'url-parser': { x: EVIDENCE[3].x, y: EVIDENCE[3].y },
}

const THREADS: RouteThread[] = [
  { from: '404', to: 'unbuilt', cause: 'unbuilt', kind: 'core' },
  { from: '404', to: 'renamed', cause: 'renamed', kind: 'core' },
  {
    from: '404',
    to: 'future-feature',
    cause: 'future-feature',
    kind: 'core',
  },
  {
    from: '404',
    to: 'user-confidence',
    cause: 'user-confidence',
    kind: 'core',
  },
  {
    from: 'unbuilt',
    to: 'meeting-notes',
    cause: 'unbuilt',
    kind: 'evidence',
  },
  {
    from: 'renamed',
    to: 'deployment-log',
    cause: 'renamed',
    kind: 'evidence',
  },
  {
    from: 'future-feature',
    to: 'url-parser',
    cause: 'future-feature',
    kind: 'evidence',
  },
  {
    from: 'user-confidence',
    to: 'browser-history',
    cause: 'user-confidence',
    kind: 'evidence',
  },
  {
    from: 'meeting-notes',
    to: 'browser-history',
    cause: 'unbuilt',
    kind: 'cross',
  },
  {
    from: 'deployment-log',
    to: 'url-parser',
    cause: 'renamed',
    kind: 'cross',
  },
  {
    from: 'url-parser',
    to: 'browser-history',
    cause: 'future-feature',
    kind: 'cross',
  },
  {
    from: 'browser-history',
    to: 'meeting-notes',
    cause: 'user-confidence',
    kind: 'cross',
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function NotFoundPage() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const mapRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: NodeId; pointerId: number } | null>(null)
  const [phase, setPhase] = useState<'diagnosing' | 'board'>('diagnosing')
  const [selectedCause, setSelectedCause] = useState<CauseId>(CAUSES[0].id)
  const [positions, setPositions] = useState(INITIAL_NODE_POSITIONS)
  const [dragging, setDragging] = useState<NodeId | null>(null)

  useEffect(() => {
    setPhase('diagnosing')
    const timer = window.setTimeout(() => setPhase('board'), 1500)
    return () => window.clearTimeout(timer)
  }, [pathname])

  const cause = CAUSES.find((item) => item.id === selectedCause) ?? CAUSES[0]

  const getNodeStyle = (id: NodeId) => {
    const position = positions[id]
    return {
      left: `${position.x}%`,
      top: `${position.y}%`,
    }
  }

  const onNodePointerDown = (
    event: ReactPointerEvent<HTMLElement>,
    id: NodeId,
  ) => {
    if (event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { id, pointerId: event.pointerId }
    setDragging(id)
  }

  const onMapPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const map = mapRef.current
    if (!drag || !map || event.pointerId !== drag.pointerId) return
    const bounds = map.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) return
    setPositions((current) => ({
      ...current,
      [drag.id]: {
        x: clamp(((event.clientX - bounds.left) / bounds.width) * 100, 4, 96),
        y: clamp(((event.clientY - bounds.top) / bounds.height) * 100, 4, 96),
      },
    }))
  }

  const onMapPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragging(null)
  }

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
              ref={mapRef}
              className="route-board-map"
              role="group"
              aria-label="A conspiracy board explaining the missing route. Drag the boxes to rearrange the investigation."
              onPointerMove={onMapPointerMove}
              onPointerUp={onMapPointerUp}
              onPointerCancel={onMapPointerUp}
            >
              <svg
                className="route-threads"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {THREADS.map((thread, index) => {
                  const from = positions[thread.from]
                  const to = positions[thread.to]
                  return (
                    <line
                      key={`${thread.cause}-${thread.kind}-${index}`}
                      className={`route-thread route-thread-${thread.kind} ${selectedCause === thread.cause ? 'route-thread-active' : ''}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                    />
                  )
                })}
              </svg>
              <button
                type="button"
                className={`route-node route-node-primary ${dragging === '404' ? 'route-node-dragging' : ''}`}
                style={getNodeStyle('404')}
                onPointerDown={(event) => onNodePointerDown(event, '404')}
                aria-label="404, missing route. Drag to reposition."
              >
                <span>404</span>
                <strong>missing route</strong>
              </button>
              {CAUSES.map((item, index) => (
                <button
                  type="button"
                  className={`route-node route-node-cause route-node-cause-${index + 1} ${selectedCause === item.id ? 'route-node-selected' : ''} ${dragging === item.id ? 'route-node-dragging' : ''}`}
                  style={getNodeStyle(item.id)}
                  key={item.id}
                  onClick={() => setSelectedCause(item.id)}
                  onPointerDown={(event) => onNodePointerDown(event, item.id)}
                  aria-pressed={selectedCause === item.id}
                  aria-label={`${item.label}. Drag to reposition.`}
                >
                  <span>0{index + 1}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
              {EVIDENCE.map((item) => (
                <button
                  type="button"
                  className={`route-node route-node-evidence ${selectedCause === item.cause ? 'route-node-selected' : ''} ${dragging === item.id ? 'route-node-dragging' : ''}`}
                  style={getNodeStyle(item.id)}
                  key={item.id}
                  onClick={() => setSelectedCause(item.cause)}
                  onPointerDown={(event) => onNodePointerDown(event, item.id)}
                  aria-pressed={selectedCause === item.cause}
                  aria-label={`${item.label}. Drag to reposition.`}
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
