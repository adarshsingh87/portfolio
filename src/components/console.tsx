import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { RECORD, RECORD_TOTAL } from '../data/record'
import { countAt, FETCHED } from '../lib/contributions'
import { SITE } from '../data/site'

// A small hidden console, loaded only when someone presses "/".

type Line = { id: number; kind: 'in' | 'out'; text: string }

const COMMANDS = [
  'help',
  'whoami',
  'today',
  'record',
  'work',
  'writing',
  'mail',
  'coffee',
  'clear',
  'exit',
]

export default function Console({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: 'out', text: 'Type help for commands. Esc closes.' },
  ])
  const [value, setValue] = useState('')
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const nextId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
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
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    history.current.unshift(cmd)
    cursor.current = -1
    setLines((l) => [...l, { id: nextId.current++, kind: 'in', text: cmd }])

    switch (cmd) {
      case 'help':
        print(COMMANDS.join('  '))
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
      case 'record':
        print(
          ...RECORD.map((y) => `${y.year}  ${String(y.total).padStart(5)}`),
          `total ${RECORD_TOTAL.toLocaleString('en-IN')}`,
        )
        break
      case 'work':
        onClose()
        void navigate({ to: '/work' })
        break
      case 'writing':
        onClose()
        void navigate({ to: '/blog' })
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
