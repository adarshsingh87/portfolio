import { usePlayback } from '../../lib/use-playback'

// One ONDC search, drawn as a sequence diagram. Replies come back as separate
// callbacks from each seller: one on time, one twice, one too late.

const LANES = [
  { id: 'buyer', label: 'Our buyer app', x: 64 },
  { id: 'gateway', label: 'Gateway', x: 208 },
  { id: 'a', label: 'Seller A', x: 352 },
  { id: 'b', label: 'Seller B', x: 496 },
  { id: 'c', label: 'Seller C', x: 640 },
] as const

type LaneId = (typeof LANES)[number]['id']

type Message = {
  from: LaneId
  to: LaneId
  label: string
  y: number
  tone?: 'ok' | 'dup' | 'late'
}

const X = Object.fromEntries(LANES.map((l) => [l.id, l.x])) as Record<
  LaneId,
  number
>

// Each step reveals one or more messages and one log line.
const STEPS: { messages: Message[]; log: string; tone?: Message['tone'] }[] = [
  {
    messages: [{ from: 'buyer', to: 'gateway', label: 'search', y: 92 }],
    log: '+0.00s  → search          txn 7f3a',
  },
  {
    messages: [
      { from: 'gateway', to: 'a', label: 'search', y: 128 },
      { from: 'gateway', to: 'b', label: '', y: 128 },
      { from: 'gateway', to: 'c', label: '', y: 128 },
    ],
    log: '+0.06s  gateway fans out to 3 sellers',
  },
  {
    messages: [
      { from: 'b', to: 'buyer', label: 'on_search', y: 184, tone: 'ok' },
    ],
    log: '+0.48s  ← on_search  seller B  stored',
    tone: 'ok',
  },
  {
    messages: [
      { from: 'a', to: 'buyer', label: 'on_search', y: 232, tone: 'ok' },
    ],
    log: '+1.19s  ← on_search  seller A  stored',
    tone: 'ok',
  },
  {
    messages: [
      {
        from: 'b',
        to: 'buyer',
        label: 'on_search, again',
        y: 280,
        tone: 'dup',
      },
    ],
    log: '+1.86s  ← on_search  seller B  duplicate, dropped',
    tone: 'dup',
  },
  {
    messages: [
      { from: 'c', to: 'buyer', label: 'on_search', y: 344, tone: 'late' },
    ],
    log: '+9.32s  ← on_search  seller C  late, raw payload logged',
    tone: 'late',
  },
]

const H = 380

export function ProtocolArtifact() {
  const { ref, step, replay, done } = usePlayback(STEPS.length, 950)

  return (
    <div className="protocol" ref={ref}>
      <div className="protocol-scroll">
        <svg
          className="protocol-diagram"
          viewBox={`0 0 704 ${H}`}
          role="img"
          aria-labelledby="protocol-title protocol-desc"
        >
          <title id="protocol-title">One ONDC search, step by step</title>
          <desc id="protocol-desc">
            Our buyer app sends a search through the gateway, which forwards it
            to three sellers. Seller B replies first. Seller A replies next.
            Seller B replies a second time and the duplicate is dropped. Seller
            C replies after the timeout and its payload is logged.
          </desc>
          {LANES.map((lane) => (
            <g key={lane.id}>
              <text
                className="protocol-lane"
                x={lane.x}
                y={28}
                textAnchor="middle"
              >
                {lane.label}
              </text>
              <line
                className="protocol-life"
                x1={lane.x}
                x2={lane.x}
                y1={44}
                y2={H - 8}
              />
            </g>
          ))}
          <line
            className="protocol-timeout"
            x1={24}
            x2={680}
            y1={312}
            y2={312}
          />
          <text
            className="protocol-timeout-label"
            x={680}
            y={306}
            textAnchor="end"
          >
            timeout
          </text>
          {STEPS.map((s, i) =>
            s.messages.map((m) => (
              <Arrow key={`${i}-${m.to}`} message={m} shown={step > i} />
            )),
          )}
        </svg>
      </div>

      <div className="protocol-log" aria-hidden="true">
        {STEPS.map((s, i) => (
          <p key={s.log} data-shown={step > i} data-tone={s.tone}>
            {s.log}
          </p>
        ))}
      </div>

      <button
        type="button"
        className="chip-button"
        onClick={replay}
        disabled={!done}
      >
        Replay the search
      </button>
    </div>
  )
}

function Arrow({ message, shown }: { message: Message; shown: boolean }) {
  const x1 = X[message.from]
  const x2 = X[message.to]
  const dir = x2 > x1 ? 1 : -1
  const start = x1 + dir * 6
  const end = x2 - dir * 8
  const mid = (x1 + x2) / 2
  const length = Math.abs(end - start)
  return (
    <g
      className="protocol-msg"
      data-shown={shown}
      data-tone={message.tone}
      style={{ '--len': length } as React.CSSProperties}
    >
      <line x1={start} x2={end} y1={message.y} y2={message.y} />
      <path
        d={`M${end} ${message.y} l${-dir * 7} -4 v8 z`}
        className="protocol-head"
      />
      {message.label ? (
        <text x={mid} y={message.y - 8} textAnchor="middle">
          {message.label}
        </text>
      ) : null}
    </g>
  )
}
