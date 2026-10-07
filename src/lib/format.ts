const LONG = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const SHORT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatDate(iso: string, style: 'long' | 'short' = 'long') {
  const ts = Date.parse(`${iso}T00:00:00Z`)
  if (Number.isNaN(ts)) return iso
  return (style === 'long' ? LONG : SHORT).format(ts)
}
