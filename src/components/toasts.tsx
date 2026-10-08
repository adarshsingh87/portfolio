import { useEffect, useRef, useState } from 'react'
import { onToast } from '../lib/toast'
import type { ToastInput } from '../lib/toast'

type Shown = ToastInput & { id: number }

// One small message at a time, announced politely. A new one replaces the
// old one, so nothing stacks up.
export function Toasts() {
  const [shown, setShown] = useState<Shown | null>(null)
  const id = useRef(0)
  const timer = useRef(0)

  useEffect(
    () =>
      onToast((input) => {
        window.clearTimeout(timer.current)
        setShown({ ...input, id: ++id.current })
        timer.current = window.setTimeout(
          () => setShown(null),
          input.action ? 7000 : 4500,
        )
      }),
    [],
  )

  return (
    <div className="toasts" role="status" aria-live="polite">
      {shown ? (
        <div className="toast" key={shown.id}>
          {shown.swatches ? (
            <span className="toast-swatches" aria-hidden="true">
              {shown.swatches.map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </span>
          ) : null}
          <span>{shown.text}</span>
          {shown.action ? (
            <button
              type="button"
              onClick={() => {
                shown.action?.run()
                setShown(null)
              }}
            >
              {shown.action.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
