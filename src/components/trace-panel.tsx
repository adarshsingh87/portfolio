import { useEffect, useState, useSyncExternalStore } from 'react'
import { formatTrace, getSpans, getTxn, subscribeTrace } from '../lib/trace'
import type { Span } from '../lib/trace'

// This visit as a waterfall, the way a tracing tool would draw a request.
// Loaded only when someone presses T or runs `trace`.

const NONE: Span[] = []

export default function TracePanel({ onClose }: { onClose: () => void }) {
  const spans = useSyncExternalStore(subscribeTrace, getSpans, () => NONE)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(t)
  }, [copied])

  const end = Math.max(1, ...spans.map((s) => s.end))
  const ms = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formatTrace())
      setCopied(true)
    } catch {
      // Clipboard blocked. The panel is still readable.
    }
  }

  return (
    <aside className="trace" aria-label="Trace of this visit">
      <header className="trace-head">
        <p>
          <span className="trace-txn">txn {getTxn()}</span>
          <span>
            {spans.length} spans, {ms.format(end)} ms
          </span>
        </p>
        <div>
          <button type="button" onClick={copy}>
            <span aria-live="polite">{copied ? 'Copied' : 'Copy trace'}</span>
          </button>
          <button type="button" onClick={onClose} aria-label="Close trace">
            ×
          </button>
        </div>
      </header>
      <ol className="trace-rows">
        {spans.map((s) => {
          const left = (s.start / end) * 100
          const width = ((s.end - s.start) / end) * 100
          const took = s.end - s.start
          return (
            <li key={s.id} data-kind={s.kind}>
              <span className="trace-label" title={s.label}>
                {s.label}
              </span>
              <span className="trace-lane" aria-hidden="true">
                <i
                  style={{ left: `${left}%`, width: `${width}%` }}
                  data-instant={took < 1 || undefined}
                />
              </span>
              <span className="trace-ms">
                {took < 1 ? `@${ms.format(s.start)}` : ms.format(took)}
              </span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
