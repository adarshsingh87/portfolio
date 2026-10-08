import { useEffect, useState } from 'react'
import { SITE } from '../data/site'
import { CASES } from '../data/work'
import { RECORD, RECORD_TOTAL } from '../data/record'

// What Ctrl+P prints instead of the page: one sheet, set like a press
// proof, with crop marks, registration targets and a colour bar of the
// three signals. Hidden on screen.

const FMT = new Intl.NumberFormat('en-IN')
const PEAK = Math.max(...RECORD.map((y) => y.total))

// The three signals, then each pair, then all three: what a press checks.
// Each swatch screens its signals over black, the same way the lights add
// up on screen.
const BAR: string[][] = [
  ['a'],
  ['b'],
  ['c'],
  ['a', 'b'],
  ['b', 'c'],
  ['c', 'a'],
  ['a', 'b', 'c'],
  [],
]

function Target({ at }: { at: string }) {
  return (
    <svg className={`proof-target proof-target-${at}`} viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="6" />
      <circle cx="10" cy="10" r="3" />
      <path d="M10 0v20M0 10h20" />
    </svg>
  )
}

function ColourBar({ at }: { at: string }) {
  return (
    <span className={`proof-bar proof-bar-${at}`}>
      {BAR.map((layers) => (
        <i key={layers.join('') || 'none'}>
          {layers.map((sig) => (
            <b key={sig} style={{ background: `var(--sig-${sig})` }} />
          ))}
        </i>
      ))}
    </span>
  )
}

export function PrintSheet() {
  const [printed, setPrinted] = useState('')

  useEffect(() => {
    const stamp = () => setPrinted(new Date().toISOString().slice(0, 10))
    stamp()
    window.addEventListener('beforeprint', stamp)
    return () => window.removeEventListener('beforeprint', stamp)
  }, [])

  return (
    <div className="proof" aria-hidden="true">
      <span className="proof-crop proof-crop-tl" />
      <span className="proof-crop proof-crop-tr" />
      <span className="proof-crop proof-crop-bl" />
      <span className="proof-crop proof-crop-br" />
      <Target at="t" />
      <Target at="r" />
      <Target at="b" />
      <Target at="l" />
      <ColourBar at="tl" />
      <ColourBar at="br" />

      <div className="proof-trim">
        <header className="proof-head">
          <svg className="proof-mark" viewBox="0 0 32 32">
            <circle cx="12.5" cy="12" r="8.5" fill="var(--sig-a)" />
            <circle cx="19.5" cy="12" r="8.5" fill="var(--sig-b)" />
            <circle cx="16" cy="19" r="8.5" fill="var(--sig-c)" />
          </svg>
          <div>
            <p className="proof-name">{SITE.name}</p>
            <p className="proof-role">
              CTO at {SITE.company}. {SITE.education}.
            </p>
          </div>
        </header>

        <p className="proof-title">Making every system agree.</p>
        <p className="proof-lede">{SITE.description}</p>

        <ol className="proof-cases">
          {CASES.map((c) => (
            <li key={c.slug}>
              <p className="proof-case-title">
                {c.title} <span>{c.period}</span>
              </p>
              <p>{c.line}</p>
            </li>
          ))}
        </ol>

        <div className="proof-record">
          <p className="proof-label">
            {FMT.format(RECORD_TOTAL)} GitHub contributions since 2019
          </p>
          <ol>
            {RECORD.map((y) => (
              <li key={y.year}>
                <i
                  style={{ height: `${Math.max(4, (y.total / PEAK) * 80)}%` }}
                />
                <span>{y.year}</span>
              </li>
            ))}
          </ol>
        </div>

        <footer className="proof-foot">
          <p>{SITE.email}</p>
          <p>{SITE.domain.replace('https://', '')}</p>
          <p>github.com/{SITE.githubHandle}</p>
        </footer>
      </div>

      <p className="proof-slug">
        {SITE.domain.replace('https://', '')} · proof 1 of 1
        {printed ? ` · ${printed}` : ''}
      </p>
    </div>
  )
}
