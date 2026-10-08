export type ToastInput = {
  text: string
  // Colours shown as small dots beside the text.
  swatches?: string[]
  action?: { label: string; run: () => void }
}

const EVENT = 'toast:show'

export function toast(input: ToastInput) {
  window.dispatchEvent(new CustomEvent<ToastInput>(EVENT, { detail: input }))
}

export function onToast(fn: (input: ToastInput) => void) {
  const handler = (event: Event) =>
    fn((event as CustomEvent<ToastInput>).detail)
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}
