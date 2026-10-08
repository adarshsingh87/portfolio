// The console, the toasts and the trace panel are opened from several places
// (a key, a drag on the logo, a console command), so they listen for window
// events instead of sharing state.

const OPEN = 'console:open'

export function openConsole(prefill = '') {
  window.dispatchEvent(new CustomEvent<string>(OPEN, { detail: prefill }))
}

export function onOpenConsole(fn: (prefill: string) => void) {
  const handler = (event: Event) => fn((event as CustomEvent<string>).detail)
  window.addEventListener(OPEN, handler)
  return () => window.removeEventListener(OPEN, handler)
}

const TRACE = 'trace:toggle'

// true or false sets it; undefined flips it.
export function toggleTrace(on?: boolean) {
  window.dispatchEvent(
    new CustomEvent<boolean | undefined>(TRACE, { detail: on }),
  )
}

export function onToggleTrace(fn: (on: boolean | undefined) => void) {
  const handler = (event: Event) =>
    fn((event as CustomEvent<boolean | undefined>).detail)
  window.addEventListener(TRACE, handler)
  return () => window.removeEventListener(TRACE, handler)
}
