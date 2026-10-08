// `commit` in the console replays every week of the record as a timelapse.
// The chart may not be on screen yet (the console works on every page), so
// a request waits here until the chart mounts and takes it.

const EVENT = 'record:replay'

let pending = false

export function requestReplay() {
  pending = true
  window.dispatchEvent(new CustomEvent(EVENT))
}

// True once per request: whoever takes it plays it.
export function takeReplay() {
  const was = pending
  pending = false
  return was
}

export function onReplay(fn: () => void) {
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}
