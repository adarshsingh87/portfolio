import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useLocation } from '@tanstack/react-router'
import { SITE } from '../data/site'

type ConsoleLineKind = 'system' | 'command' | 'response'
type ConsoleLine = { id: number; kind: ConsoleLineKind; text: string }
type ConsoleCommand = (value: string) => void

const VISIT_KEY = 'adarsh-portfolio-visits'
const CONSOLE_COMMANDS = [
  'help',
  'status',
  'coffee',
  'parallel',
  'chaos',
  'memory',
  'forget',
  'where am i',
  '404',
  'clear',
  'close',
]
const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]
const INITIAL_LINES: ConsoleLine[] = [
  { id: 1, kind: 'system', text: 'system console / press / to open this' },
  { id: 2, kind: 'system', text: 'type help for available commands' },
]

function titleForPath(pathname: string) {
  if (pathname === '/') return `${SITE.name}, CTO at ${SITE.company}`
  if (pathname === '/work') return `Selected work — ${SITE.name}`
  if (pathname === '/blog' || pathname === '/blog/') {
    return `Notes — ${SITE.name}`
  }
  if (pathname.startsWith('/blog/')) {
    if (typeof document !== 'undefined' && document.title) return document.title
    return `A note — ${SITE.name}`
  }
  return 'Route not found — the system is investigating'
}

export function EasterEggs() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>(INITIAL_LINES)
  const [command, setCommand] = useState('')
  const [chaos, setChaos] = useState(false)
  const [alternate, setAlternate] = useState(false)
  const [warp, setWarp] = useState(false)
  const [visitCount, setVisitCount] = useState(0)
  const consoleInputRef = useRef<HTMLInputElement>(null)
  const consoleEndRef = useRef<HTMLDivElement>(null)
  const lineIdRef = useRef(INITIAL_LINES.length)
  const warpTimerRef = useRef<number | null>(null)

  const appendLines = (lines: Omit<ConsoleLine, 'id'>[]) => {
    setConsoleLines((current) => [
      ...current,
      ...lines.map((line) => {
        lineIdRef.current += 1
        return { ...line, id: lineIdRef.current }
      }),
    ])
  }

  const runCommand: ConsoleCommand = (value) => {
    const normalized = value.trim().toLowerCase()
    if (!normalized) return

    appendLines([{ kind: 'command', text: `> ${value.trim()}` }])
    setCommand('')

    if (normalized === 'help') {
      appendLines([
        { kind: 'response', text: CONSOLE_COMMANDS.join(' · ') },
        {
          kind: 'response',
          text: 'parallel = alternate reality · chaos = unstable mode',
        },
      ])
      return
    }

    if (normalized === 'status') {
      appendLines([
        { kind: 'response', text: 'systems: nominal' },
        {
          kind: 'response',
          text: `route: ${pathname} · mode: ${chaos ? 'chaotic' : 'stable'}`,
        },
        { kind: 'response', text: 'portfolio: emotionally overengineered' },
      ])
      return
    }

    if (normalized === 'coffee') {
      appendLines([
        { kind: 'response', text: 'brewing coffee…' },
        { kind: 'response', text: 'deployment status: still human' },
      ])
      return
    }

    if (normalized === 'parallel') {
      setAlternate((current) => !current)
      appendLines([
        {
          kind: 'response',
          text: alternate
            ? 'returning to the primary timeline'
            : 'entering a parallel but suspiciously similar timeline',
        },
      ])
      return
    }

    if (normalized === 'chaos') {
      setChaos((current) => !current)
      appendLines([
        {
          kind: 'response',
          text: chaos
            ? 'stability restored, reluctantly'
            : 'chaos mode enabled / please do not feed the interfaces',
        },
      ])
      return
    }

    if (normalized === 'memory') {
      appendLines([
        {
          kind: 'response',
          text: `local memory: ${visitCount || 'loading'} visit${visitCount === 1 ? '' : 's'}`,
        },
        {
          kind: 'response',
          text: 'nothing leaves this browser / probably',
        },
      ])
      return
    }

    if (normalized === 'forget') {
      try {
        window.localStorage.removeItem(VISIT_KEY)
      } catch {}
      setVisitCount(0)
      appendLines([
        { kind: 'response', text: 'local memory cleared / see you next time' },
      ])
      return
    }

    if (normalized === 'where am i') {
      appendLines([
        { kind: 'response', text: `you are at ${pathname}` },
        { kind: 'response', text: 'the coordinates are technically valid' },
      ])
      return
    }

    if (normalized === '404') {
      appendLines([
        {
          kind: 'response',
          text: 'routing through /somewhere-that-does-not-exist',
        },
      ])
      window.setTimeout(() => {
        window.location.href = '/somewhere-that-does-not-exist'
      }, 300)
      return
    }

    if (normalized === 'clear') {
      setConsoleLines([])
      return
    }

    if (normalized === 'close') {
      setConsoleOpen(false)
      return
    }

    appendLines([
      {
        kind: 'response',
        text: `unknown command: ${normalized}. the router has feelings.`,
      },
    ])
  }

  useEffect(() => {
    try {
      const previousVisits = Number(
        window.localStorage.getItem(VISIT_KEY) ?? '0',
      )
      const nextVisits = Number.isFinite(previousVisits)
        ? previousVisits + 1
        : 1
      window.localStorage.setItem(VISIT_KEY, String(nextVisits))
      setVisitCount(nextVisits)
    } catch {
      setVisitCount(1)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('chaos-mode', chaos)
    return () => document.body.classList.remove('chaos-mode')
  }, [chaos])

  useEffect(() => {
    document.body.classList.toggle('alternate-reality', alternate)
    return () => document.body.classList.remove('alternate-reality')
  }, [alternate])

  useEffect(() => {
    document.body.classList.toggle('warp-mode', warp)
    return () => document.body.classList.remove('warp-mode')
  }, [warp])

  useEffect(() => {
    if (!consoleOpen) return
    consoleInputRef.current?.focus()
    consoleEndRef.current?.scrollIntoView({ block: 'nearest' })
  }, [consoleOpen, consoleLines])

  useEffect(() => {
    const baseTitle = titleForPath(pathname)
    let restoreTimer: number | null = null

    const updateTitle = (title: string) => {
      document.title = title
    }

    const onVisibilityChange = () => {
      if (restoreTimer !== null) window.clearTimeout(restoreTimer)
      if (document.hidden) {
        updateTitle('The system is still here.')
        return
      }
      updateTitle('You came back. Respect.')
      restoreTimer = window.setTimeout(() => {
        updateTitle(baseTitle)
      }, 1800)
    }

    updateTitle(baseTitle)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (restoreTimer !== null) window.clearTimeout(restoreTimer)
    }
  }, [pathname])

  useEffect(() => {
    let sequenceProgress = 0

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const isTyping =
        target instanceof HTMLElement &&
        (target.matches('input, textarea, select') || target.isContentEditable)
      if (isTyping) return

      const modifier = event.ctrlKey || event.metaKey
      if (modifier && event.shiftKey && event.key.toLowerCase() === 'c') {
        event.preventDefault()
        setChaos((current) => !current)
        return
      }

      if (modifier && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault()
        setAlternate((current) => !current)
        return
      }

      if (event.key === '/') {
        event.preventDefault()
        setConsoleOpen(true)
        return
      }

      if (event.key === 'Escape') {
        setConsoleOpen(false)
        return
      }

      const expectedKey = KONAMI_SEQUENCE[sequenceProgress]
      if (
        event.key === expectedKey ||
        event.key.toLowerCase() === expectedKey
      ) {
        sequenceProgress += 1
        if (sequenceProgress === KONAMI_SEQUENCE.length) {
          sequenceProgress = 0
          setWarp(true)
          if (warpTimerRef.current !== null) {
            window.clearTimeout(warpTimerRef.current)
          }
          warpTimerRef.current = window.setTimeout(() => setWarp(false), 7000)
        }
      } else {
        sequenceProgress = event.key === KONAMI_SEQUENCE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (warpTimerRef.current !== null) {
        window.clearTimeout(warpTimerRef.current)
      }
    }
  }, [])

  const onConsoleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    const currentIndex = consoleLines.length - 1
    const commandIndex = consoleLines.reduce(
      (lastIndex, line, index) => (line.kind === 'command' ? index : lastIndex),
      -1,
    )
    if (commandIndex < 0) return
    const commands = consoleLines
      .filter((line) => line.kind === 'command')
      .map((line) => line.text.replace(/^>\s*/, ''))
    const currentCommand = commands.at(-1)
    const currentCommandIndex = commands.indexOf(currentCommand ?? '')
    if (event.key === 'ArrowUp') {
      setCommand(commands[Math.max(0, currentCommandIndex - 1)] ?? '')
      return
    }
    setCommand(
      commands[
        Math.min(
          commands.length - 1,
          currentCommandIndex + (currentIndex < 0 ? 0 : 1),
        )
      ] ?? '',
    )
  }

  const onConsoleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runCommand(command)
  }

  return (
    <>
      <div className="egg-mode-banners" aria-live="polite">
        {chaos ? (
          <div className="egg-mode-banner egg-mode-banner-chaos">
            operating mode: uncontrolled but operational
          </div>
        ) : null}
        {alternate ? (
          <div className="egg-mode-banner egg-mode-banner-parallel">
            parallel reality / stable / do not question the CSS
          </div>
        ) : null}
        {warp ? (
          <div className="egg-mode-banner egg-mode-banner-warp">
            you have left the main framework
          </div>
        ) : null}
      </div>

      {visitCount > 1 ? (
        <span className="memory-echo">
          local memory / {String(visitCount).padStart(2, '0')}
        </span>
      ) : null}

      <div
        className={`egg-console ${consoleOpen ? 'egg-console-open' : ''}`}
        aria-hidden={!consoleOpen}
      >
        <div className="egg-console-bar">
          <span>system console / hidden channel</span>
          <button
            type="button"
            onClick={() => setConsoleOpen(false)}
            aria-label="Close system console"
          >
            close ×
          </button>
        </div>
        <div className="egg-console-output" role="log" aria-live="polite">
          {consoleLines.map((line) => (
            <div
              className={`egg-console-line egg-console-line-${line.kind}`}
              key={line.id}
            >
              {line.text}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
        <form className="egg-console-form" onSubmit={onConsoleSubmit}>
          <label htmlFor="egg-console-input" className="sr-only">
            System console command
          </label>
          <span aria-hidden="true">&gt;</span>
          <input
            ref={consoleInputRef}
            id="egg-console-input"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={onConsoleKeyDown}
            placeholder="type a command"
            autoComplete="off"
            spellCheck={false}
            tabIndex={consoleOpen ? 0 : -1}
          />
          <button type="submit" tabIndex={consoleOpen ? 0 : -1}>
            run
          </button>
        </form>
      </div>
    </>
  )
}
