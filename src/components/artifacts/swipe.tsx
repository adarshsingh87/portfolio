import { useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

// A toy model of Fomofy's feed: every swipe nudges attribute weights, and the
// next card is whichever remaining piece now scores highest. The real feed
// weighs far more signals; this shows the idea.

type Fabric = 'linen' | 'denim' | 'silk' | 'cotton' | 'knit'

type Item = {
  id: number
  name: string
  colour: string
  family: string
  fabric: Fabric
  fit: string
  occasion: string
  tint: [string, string]
}

const ITEMS: Item[] = [
  {
    id: 1,
    name: 'Linen shirt',
    colour: 'Sand',
    family: 'Earth',
    fabric: 'linen',
    fit: 'Relaxed',
    occasion: 'Brunch',
    tint: ['#c9b38f', '#a88f6a'],
  },
  {
    id: 2,
    name: 'Slip dress',
    colour: 'Emerald',
    family: 'Jewel',
    fabric: 'silk',
    fit: 'Tailored',
    occasion: 'Night out',
    tint: ['#1f7a5a', '#0f4a38'],
  },
  {
    id: 3,
    name: 'Wide-leg jeans',
    colour: 'Indigo',
    family: 'Blue',
    fabric: 'denim',
    fit: 'Relaxed',
    occasion: 'Weekend',
    tint: ['#3a4f7a', '#24345a'],
  },
  {
    id: 4,
    name: 'Cable cardigan',
    colour: 'Oat',
    family: 'Earth',
    fabric: 'knit',
    fit: 'Oversized',
    occasion: 'Weekend',
    tint: ['#d8c9a8', '#b8a67f'],
  },
  {
    id: 5,
    name: 'Kurta set',
    colour: 'Rani pink',
    family: 'Jewel',
    fabric: 'silk',
    fit: 'Tailored',
    occasion: 'Wedding',
    tint: ['#c2306b', '#8a1d4b'],
  },
  {
    id: 6,
    name: 'Camp collar shirt',
    colour: 'Rust',
    family: 'Earth',
    fabric: 'cotton',
    fit: 'Relaxed',
    occasion: 'Brunch',
    tint: ['#b5552b', '#8a3c1c'],
  },
  {
    id: 7,
    name: 'Trench coat',
    colour: 'Black',
    family: 'Monochrome',
    fabric: 'cotton',
    fit: 'Tailored',
    occasion: 'Office',
    tint: ['#2b2d33', '#16171b'],
  },
  {
    id: 8,
    name: 'Linen trousers',
    colour: 'Olive',
    family: 'Earth',
    fabric: 'linen',
    fit: 'Relaxed',
    occasion: 'Office',
    tint: ['#7d7a4a', '#5a5733'],
  },
  {
    id: 9,
    name: 'Denim jacket',
    colour: 'Washed blue',
    family: 'Blue',
    fabric: 'denim',
    fit: 'Oversized',
    occasion: 'Weekend',
    tint: ['#6f8fb5', '#4c6a91'],
  },
  {
    id: 10,
    name: 'Silk shirt',
    colour: 'Ivory',
    family: 'Monochrome',
    fabric: 'silk',
    fit: 'Relaxed',
    occasion: 'Office',
    tint: ['#ece4d6', '#cfc4b0'],
  },
  {
    id: 11,
    name: 'Ribbed tank',
    colour: 'Sage',
    family: 'Pastel',
    fabric: 'knit',
    fit: 'Tailored',
    occasion: 'Brunch',
    tint: ['#a9bfa3', '#869e80'],
  },
  {
    id: 12,
    name: 'Anarkali',
    colour: 'Marigold',
    family: 'Jewel',
    fabric: 'cotton',
    fit: 'Tailored',
    occasion: 'Wedding',
    tint: ['#e2a134', '#b97a17'],
  },
]

const KEEP = 1
const PASS = -0.7
const THRESHOLD = 90

function traits(item: Item) {
  return [item.family, cap(item.fabric), item.fit, item.occasion]
}

function cap(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}

function score(item: Item, weights: Record<string, number>) {
  return traits(item).reduce((sum, t) => sum + (weights[t] ?? 0), 0)
}

// Highest score first; ties keep the original order so the deck is stable.
function rank(pool: Item[], weights: Record<string, number>) {
  return pool
    .map((item, i) => ({ item, s: score(item, weights), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((r) => r.item)
}

type Gone = { item: Item; dir: 'left' | 'right' }

export function SwipeArtifact() {
  const [weights, setWeights] = useState<Record<string, number>>({})
  const [remaining, setRemaining] = useState<Item[]>(ITEMS)
  const [gone, setGone] = useState<Gone[]>([])
  const [kept, setKept] = useState(0)
  const drag = useRef({ x: 0, startX: 0, active: false, id: 0 })

  const deck = rank(remaining, weights)
  const top = deck.at(0)
  const learned = Object.entries(weights)
    .filter(([, w]) => Math.abs(w) > 0.01)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 6)
  const maxWeight = Math.max(1, ...learned.map(([, w]) => Math.abs(w)))

  function decide(dir: 'left' | 'right') {
    if (!top) return
    const delta = dir === 'right' ? KEEP : PASS
    setWeights((w) => {
      const next = { ...w }
      for (const t of traits(top)) next[t] = (next[t] ?? 0) + delta
      return next
    })
    setRemaining((r) => r.filter((i) => i.id !== top.id))
    setGone((g) => [...g.slice(-2), { item: top, dir }])
    if (dir === 'right') setKept((k) => k + 1)
  }

  function reset() {
    setWeights({})
    setRemaining(ITEMS)
    setGone([])
    setKept(0)
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (!top) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { x: 0, startX: event.clientX, active: true, id: top.id }
    event.currentTarget.dataset.dragging = 'true'
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const d = drag.current
    if (!d.active) return
    d.x = event.clientX - d.startX
    event.currentTarget.style.setProperty('--dx', String(d.x))
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    const d = drag.current
    if (!d.active) return
    d.active = false
    const el = event.currentTarget
    delete el.dataset.dragging
    if (Math.abs(d.x) > THRESHOLD) {
      el.style.removeProperty('--dx')
      decide(d.x > 0 ? 'right' : 'left')
    } else {
      el.style.setProperty('--dx', '0')
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      decide('left')
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      decide('right')
    }
  }

  return (
    <div className="swipe">
      <div
        className="swipe-deck"
        tabIndex={0}
        role="group"
        aria-label="Swipe deck. Left arrow passes, right arrow keeps."
        onKeyDown={onKeyDown}
      >
        {gone.map(({ item, dir }) => (
          <article
            key={`gone-${item.id}`}
            className="swipe-card"
            data-gone={dir}
            aria-hidden="true"
          >
            <CardFace item={item} />
          </article>
        ))}
        {deck
          .slice(0, 3)
          .reverse()
          .map((item, i, arr) => {
            const depth = arr.length - 1 - i
            const isTop = depth === 0
            return (
              <article
                key={item.id}
                className="swipe-card"
                style={{ '--depth': depth } as React.CSSProperties}
                aria-hidden={!isTop}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onPointerCancel={isTop ? onPointerUp : undefined}
              >
                <CardFace item={item} />
              </article>
            )
          })}
        {top ? null : (
          <div className="swipe-empty">
            <p>
              You kept {kept} of {ITEMS.length}. In the app the deck never runs
              out.
            </p>
            <button type="button" className="chip-button" onClick={reset}>
              Shuffle the deck
            </button>
          </div>
        )}
      </div>

      <div className="swipe-controls">
        <button
          type="button"
          className="chip-button"
          onClick={() => decide('left')}
          disabled={!top}
        >
          Pass
        </button>
        <button
          type="button"
          className="chip-button chip-button-warm"
          onClick={() => decide('right')}
          disabled={!top}
        >
          Keep
        </button>
      </div>

      <div className="swipe-model" aria-live="polite">
        <p className="swipe-model-title">What the feed has learned</p>
        {learned.length === 0 ? (
          <p className="swipe-model-empty">
            Nothing yet. Drag the card, or use the buttons. Each choice changes
            which card comes next.
          </p>
        ) : (
          <ul>
            {learned.map(([trait, w]) => (
              <li key={trait}>
                <span>{trait}</span>
                <span
                  className="swipe-bar"
                  data-sign={w > 0 ? 'up' : 'down'}
                  style={
                    { '--w': Math.abs(w) / maxWeight } as React.CSSProperties
                  }
                />
                <span className="swipe-weight">
                  {w > 0 ? '+' : '−'}
                  {Math.abs(w).toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function CardFace({ item }: { item: Item }) {
  return (
    <>
      <div
        className="swatch"
        data-fabric={item.fabric}
        style={
          {
            '--c1': item.tint[0],
            '--c2': item.tint[1],
          } as React.CSSProperties
        }
      />
      <div className="swipe-card-body">
        <p className="swipe-card-name">{item.name}</p>
        <p>
          {item.colour}, {item.fabric}
        </p>
        <ul aria-label="Attributes">
          {traits(item).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
