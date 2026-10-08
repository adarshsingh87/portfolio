// The visit, recorded as a trace. Nothing here is staged: every span comes
// from the browser's own performance entries or from the router.
// The transaction id lives in sessionStorage, so it follows you across
// pages the way smoke-context keeps a request id across awaits.

import type { AnyRouter } from '@tanstack/react-router'

export type SpanKind = 'document' | 'paint' | 'route' | 'resource'

export type Span = {
  id: number
  kind: SpanKind
  label: string
  start: number
  end: number
}

const TXN_KEY = 'txn'
const MAX_RESOURCES = 40

let spans: Span[] = []
let nextId = 1
let started = false
let txn = ''
const listeners = new Set<() => void>()

function emit() {
  spans = [...spans].sort((a, b) => a.start - b.start)
  listeners.forEach((fn) => fn())
}

function add(kind: SpanKind, label: string, start: number, end: number) {
  spans.push({ id: nextId++, kind, label, start, end: Math.max(end, start) })
  emit()
}

export function getTxn() {
  if (txn) return txn
  try {
    const saved = sessionStorage.getItem(TXN_KEY)
    if (saved) {
      txn = saved
      return txn
    }
  } catch {
    // Storage blocked: the id lasts for this page only.
  }
  txn = Array.from(crypto.getRandomValues(new Uint8Array(2)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')
  try {
    sessionStorage.setItem(TXN_KEY, txn)
  } catch {
    // See above.
  }
  return txn
}

export function subscribeTrace(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getSpans() {
  return spans
}

function fileName(url: string) {
  try {
    const path = new URL(url).pathname
    return path.split('/').pop() || path
  } catch {
    return url
  }
}

export function startTrace(router: AnyRouter) {
  if (started) return
  started = true
  getTxn()

  const observe = (type: string, onEntry: (e: PerformanceEntry) => void) => {
    try {
      const po = new PerformanceObserver((list) =>
        list.getEntries().forEach(onEntry),
      )
      po.observe({ type, buffered: true })
    } catch {
      // Entry type not supported in this browser.
    }
  }

  observe('navigation', (e) => {
    const nav = e as PerformanceNavigationTiming
    add(
      'document',
      `GET ${location.pathname}`,
      nav.requestStart,
      nav.responseEnd,
    )
    if (nav.domContentLoadedEventEnd > 0) {
      add(
        'document',
        'DOM ready',
        nav.responseEnd,
        nav.domContentLoadedEventEnd,
      )
    }
  })

  observe('paint', (e) => add('paint', e.name, e.startTime, e.startTime))

  let lcp: Span | undefined
  observe('largest-contentful-paint', (e) => {
    if (lcp) spans = spans.filter((s) => s !== lcp)
    lcp = {
      id: nextId++,
      kind: 'paint',
      label: 'largest-contentful-paint',
      start: e.startTime,
      end: e.startTime,
    }
    spans.push(lcp)
    emit()
  })

  let resources = 0
  observe('resource', (e) => {
    if (resources >= MAX_RESOURCES) return
    resources++
    add('resource', fileName(e.name), e.startTime, e.startTime + e.duration)
  })

  let began = 0
  let target = ''
  router.subscribe('onBeforeNavigate', (event) => {
    began = performance.now()
    target = event.toLocation.pathname
  })
  router.subscribe('onResolved', () => {
    if (!began) return
    add('route', `GET ${target}`, began, performance.now())
    began = 0
  })
}

export function formatTrace() {
  const lines = [
    `txn ${getTxn()}  ${location.host}  ${new Date().toISOString()}`,
    '',
    ...spans.map((s) => {
      const ms = Math.round(s.end - s.start)
      return `+${String(Math.round(s.start)).padStart(6)}ms  ${s.kind.padEnd(8)}  ${s.label}${ms > 0 ? `  ${ms}ms` : ''}`
    }),
  ]
  return lines.join('\n')
}
