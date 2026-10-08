import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { RECORD, RECORD_TOTAL } from '../data/record'
import { countAt, FETCHED } from '../lib/contributions'
import { SITE } from '../data/site'
import { toggleTrace } from '../lib/console-bus'
import { agreementUnlocked, reconcileLights, resetLights } from '../lib/lights'
import { requestReplay } from '../lib/replay'
import { currentHour, phaseFor, previewHour } from '../lib/time-light'
import { pickWallpaper, restoreSignals } from '../lib/wallpaper-flow'

// A small hidden console. It opens with "/", with ":" (vim style), or by
// pulling the logo apart, and loads only then.

type Line = { id: number; kind: 'in' | 'out'; text: string }

const COMMANDS = [
  'help',
  'whoami',
  'today',
  'date',
  'record',
  'commit',
  'work',
  'writing',
  'wallpaper',
  'lights',
  'trace',
  'print',
  'mail',
  'coffee',
  'clear',
  'exit',
]

// The same command again inside this window is a retry, and retries are
// dropped. Every webhook handler we write works this way.
const IDEMPOTENCY_MS = 10_000

const HOUR_RE = /^(\d{1,2})(?::(\d{2}))?$/

function clock(hour: number) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export default function Console({
  initial = '',
  onClose,
}: {
  initial?: string
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([
    {
      id: 0,
      kind: 'out',
      text: initial.startsWith(':')
        ? 'Normal mode. :help lists commands, :q closes.'
        : 'Type help for commands. Esc closes.',
    },
  ])
  const [value, setValue] = useState(initial)
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const nextId = useRef(1)
  const seen = useRef(new Map<string, number>())
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [lines])

  const print = (...texts: string[]) =>
    setLines((l) => [
      ...l,
      ...texts.map((text) => ({
        id: nextId.current++,
        kind: 'out' as const,
        text,
      })),
    ])

  function run(raw: string) {
    const typed = raw.trim().toLowerCase()
    if (!typed) return
    history.current.unshift(typed)
    cursor.current = -1
    setLines((l) => [...l, { id: nextId.current++, kind: 'in', text: typed }])

    // Vim habits: ":q" closes, ":help" helps, ":anything" runs "anything".
    const vim = typed.startsWith(':')
    const cmd = vim ? typed.slice(1).trim() : typed
    if (vim && ['q', 'q!', 'wq', 'x', 'qa'].includes(cmd)) {
      onClose()
      return
    }

    const now = Date.now()
    const last = seen.current.get(cmd)
    if (last !== undefined && now - last < IDEMPOTENCY_MS && cmd !== 'clear') {
      print('duplicate, dropped.')
      return
    }
    seen.current.set(cmd, now)

    const [name = '', ...args] = cmd.split(/\s+/)
    const arg = args.join(' ')

    switch (name) {
      case 'help':
        print(
          [...COMMANDS, ...(agreementUnlocked() ? ['reconcile'] : [])].join(
            '  ',
          ),
        )
        if (vim) print('Also j, k, gg and G outside the console. :q closes.')
        break
      case 'whoami':
        print(
          `${SITE.name}. CTO at ${SITE.company}. Builds backends with his team, mostly in private.`,
        )
        break
      case 'today': {
        const n = countAt(Date.parse(`${FETCHED}T00:00:00Z`)) ?? 0
        print(
          `${FETCHED}: ${n} contribution${n === 1 ? '' : 's'}. The data was last refreshed that day.`,
        )
        break
      }
      case 'date': {
        if (arg === 'reset' || arg === 'now') {
          previewHour(null)
          print(`Back to your clock: ${clock(currentHour())}.`)
          break
        }
        if (arg) {
          const match = HOUR_RE.exec(arg)
          const hour = match
            ? Number(match[1]) + Number(match[2] || '0') / 60
            : NaN
          if (!(hour >= 0 && hour < 24)) {
            print('date takes a time like 06:30, or reset.')
            break
          }
          previewHour(hour)
          print(`${clock(hour)}, ${phaseFor(hour)}. Look behind the page.`)
          break
        }
        const hour = currentHour()
        print(
          `${new Date().toString().replace(/ \(.*\)$/, '')}`,
          `It is ${phaseFor(hour)} where you are, and the light already knows.`,
        )
        break
      }
      case 'record':
        print(
          ...RECORD.map((y) => `${y.year}  ${String(y.total).padStart(5)}`),
          `total ${RECORD_TOTAL.toLocaleString('en-IN')}`,
          'commit replays it.',
        )
        break
      case 'commit':
      case 'git':
        onClose()
        requestReplay()
        if (window.location.pathname !== '/') void navigate({ to: '/' })
        break
      case 'migrate':
        print('Refused. A person writes those.')
        break
      case 'work':
        onClose()
        void navigate({ to: '/work' })
        break
      case 'writing':
        onClose()
        void navigate({ to: '/blog' })
        break
      case 'wallpaper':
        if (arg === 'reset') {
          restoreSignals()
          break
        }
        print('Pick an image, or drop one anywhere on the page.')
        pickWallpaper()
        break
      case 'lights':
        if (arg === 'reset') {
          resetLights()
          print('The lights go home.')
        } else {
          print(
            'Hold the empty background, then drag. lights reset puts them back.',
          )
        }
        break
      case 'reconcile':
        if (!agreementUnlocked()) {
          print(`${cmd}: not found. Try help.`)
          break
        }
        onClose()
        reconcileLights()
        break
      case 'trace':
        if (arg === 'off') toggleTrace(false)
        else toggleTrace(true)
        print(
          arg === 'off' ? 'Trace hidden.' : 'Tracing this visit. T toggles it.',
        )
        break
      case 'print':
        onClose()
        // Let the console leave before the dialog freezes the page.
        window.setTimeout(() => window.print(), 50)
        break
      case 'mail':
        window.location.href = `mailto:${SITE.email}`
        break
      case 'coffee':
        print('Brewing. The build is still faster.')
        break
      case 'clear':
        setLines([])
        break
      case 'exit':
      case 'close':
      case 'q':
        onClose()
        break
      default:
        print(`${cmd}: not found. Try help.`)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    run(value)
    setValue('')
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    const h = history.current
    if (h.length === 0) return
    cursor.current =
      event.key === 'ArrowUp'
        ? Math.min(h.length - 1, cursor.current + 1)
        : Math.max(-1, cursor.current - 1)
    setValue(cursor.current === -1 ? '' : h[cursor.current])
  }

  return (
    <div className="console" role="dialog" aria-label="Console">
      <div className="console-lines" aria-live="polite">
        {lines.map((line) => (
          <p key={line.id} data-kind={line.kind}>
            {line.kind === 'in' ? <span aria-hidden="true">› </span> : null}
            {line.text}
          </p>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={onSubmit}>
        <label htmlFor="console-input" className="sr-only">
          Command
        </label>
        <span aria-hidden="true">›</span>
        <input
          id="console-input"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  )
}
