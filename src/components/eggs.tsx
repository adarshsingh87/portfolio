import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Toasts } from './toasts'
import { PrintSheet } from './print-sheet'
import {
  onOpenConsole,
  onToggleTrace,
  openConsole,
  toggleTrace,
} from '../lib/console-bus'
import { toast } from '../lib/toast'
import { printBanner } from '../lib/banner'
import { startTimeLight } from '../lib/time-light'
import { startTrace } from '../lib/trace'
import {
  agree,
  agreementUnlocked,
  bloom,
  centers,
  moveLight,
  nearestLight,
  unlockAgreement,
} from '../lib/lights'

const Console = lazy(() => import('./console'))
const TracePanel = lazy(() => import('./trace-panel'))

// Everything hidden in the site that listens to the whole window lives here,
// so the rest of the code stays ordinary. Nothing in this file is needed to
// use the site.

function inField(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !!target.closest('input, textarea, select, [contenteditable="true"]')
  )
}

let greeted = false

export function Eggs() {
  const router = useRouter()
  const [console_, setConsole] = useState<{
    key: number
    prefill: string
  } | null>(null)
  const [trace, setTrace] = useState(false)

  useEffect(
    () =>
      onOpenConsole((prefill) =>
        setConsole((c) => ({ key: (c?.key ?? 0) + 1, prefill })),
      ),
    [],
  )
  useEffect(() => onToggleTrace((on) => setTrace((t) => on ?? !t)), [])

  useEffect(() => {
    if (!greeted) {
      greeted = true
      printBanner()
    }
    // Recording starts with the page, so the panel has the whole visit
    // whenever it is opened.
    startTrace(router)
    return startTimeLight()
  }, [router])

  return (
    <>
      <VimKeys />
      <PullMark />
      <GrabLights />
      <DropWallpaper />
      <Toasts />
      <PrintSheet />
      {console_ ? (
        <Suspense fallback={null}>
          <Console
            key={console_.key}
            initial={console_.prefill}
            onClose={() => setConsole(null)}
          />
        </Suspense>
      ) : null}
      {trace ? (
        <Suspense fallback={null}>
          <TracePanel onClose={() => setTrace(false)} />
        </Suspense>
      ) : null}
    </>
  )
}

// j and k scroll, gg and G jump, ":" opens the console with a colon prompt,
// "/" opens it plain, "t" toggles the trace.
function VimKeys() {
  useEffect(() => {
    let lastG = 0
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')

    const onKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return
      if (inField(event.target)) return
      const behavior = calm.matches ? 'auto' : 'smooth'

      switch (event.key) {
        case 'j':
          window.scrollBy({ top: 96, behavior })
          break
        case 'k':
          window.scrollBy({ top: -96, behavior })
          break
        case 'G':
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior,
          })
          break
        case 'g': {
          const now = event.timeStamp
          if (now - lastG < 600) {
            window.scrollTo({ top: 0, behavior })
            lastG = 0
          } else {
            lastG = now
          }
          break
        }
        case '/':
          event.preventDefault()
          openConsole()
          break
        case ':':
          event.preventDefault()
          openConsole(':')
          break
        case 't':
        case 'T':
          toggleTrace()
          break
        default:
          return
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}

// The three circles of the logo can be pulled out of register. Let go and
// they spring back. Pull one far enough and the console opens.
function PullMark() {
  useEffect(() => {
    // Raw pointer travel, in CSS pixels, that counts as "far enough".
    const OPEN_AT = 64
    // How far a circle can actually travel, however hard it is pulled.
    const REACH = 22

    let held: {
      circle: SVGCircleElement
      mark: SVGSVGElement
      pointerId: number
      x0: number
      y0: number
      // CSS pixels per SVG user unit.
      scale: number
      moved: boolean
      armed: boolean
    } | null = null

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary) return
      const circle =
        event.target instanceof Element
          ? event.target.closest<SVGCircleElement>('.nav-mark .mark circle')
          : null
      const mark = circle?.ownerSVGElement
      if (!circle || !mark) return
      held = {
        circle,
        mark,
        pointerId: event.pointerId,
        x0: event.clientX,
        y0: event.clientY,
        scale: mark.getBoundingClientRect().width / 32,
        moved: false,
        armed: false,
      }
      try {
        circle.setPointerCapture(event.pointerId)
      } catch {
        // The pointer is already gone. Window listeners still see the rest.
      }
      circle.dataset.held = 'true'
    }

    const onMove = (event: PointerEvent) => {
      if (!held || event.pointerId !== held.pointerId) return
      const dx = event.clientX - held.x0
      const dy = event.clientY - held.y0
      const dist = Math.hypot(dx, dy)
      if (dist > 4) held.moved = true
      if (!held.moved) return
      // Rubber band: easy at first, then stiffer the further it goes.
      const reach = REACH * Math.tanh(dist / (REACH * 2.2))
      const ux = dist ? dx / dist : 0
      const uy = dist ? dy / dist : 0
      held.circle.style.transform = `translate(${(ux * reach) / held.scale}px, ${(uy * reach) / held.scale}px)`
      const armed = dist > OPEN_AT
      if (armed !== held.armed) {
        held.armed = armed
        if (armed) held.mark.dataset.armed = 'true'
        else delete held.mark.dataset.armed
      }
    }

    const swallowClick = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const onUp = (event: PointerEvent) => {
      if (!held || event.pointerId !== held.pointerId) return
      const { circle, mark, moved, armed } = held
      held = null
      delete circle.dataset.held
      delete mark.dataset.armed
      circle.style.removeProperty('transform')
      if (!moved) return
      // A drag is not a click on the logo: stay on this page.
      window.addEventListener('click', swallowClick, {
        capture: true,
        once: true,
      })
      window.setTimeout(
        () =>
          window.removeEventListener('click', swallowClick, { capture: true }),
        0,
      )
      if (armed && event.type === 'pointerup') openConsole()
    }

    // Links are draggable by default, which would steal the gesture.
    const onDragStart = (event: DragEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest('.nav-mark')
      ) {
        event.preventDefault()
      }
    }

    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('dragstart', onDragStart)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  return null
}

const BLOCKED =
  'a, button, input, textarea, select, label, summary, [contenteditable], pre, table, svg, img, figure, .stage, .nav, .console, .trace, .toasts, .halo, [data-cursor]'

// Only blank background can be grabbed: no controls, no media, and no
// element that holds text of its own.
function isEmpty(target: EventTarget | null) {
  if (!(target instanceof Element) || target.closest(BLOCKED)) return false
  for (const node of target.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      return false
  }
  return true
}

// Press and hold on empty background to pick up the nearest light, then drag.
// Put all three on top of each other and the page blooms white.
function GrabLights() {
  const hud = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const HOLD_MOUSE = 350
    const HOLD_TOUCH = 500
    let timer = 0
    let pending: { x: number; y: number; pointerId: number } | null = null
    let held: {
      el: HTMLElement
      start: { x: number; y: number }
      x0: number
      y0: number
    } | null = null
    let agreed = false
    let lastToast = 0

    const paintHud = () => {
      const dots = hud.current?.children
      if (!dots) return
      centers().forEach((c, i) => {
        const dot = dots[i] as HTMLElement | undefined
        if (dot) dot.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`
      })
    }

    const stopScroll = (event: TouchEvent) => event.preventDefault()

    const begin = () => {
      if (!pending) return
      const grabbed = nearestLight(pending.x, pending.y)
      if (!grabbed) return
      held = { ...grabbed, x0: pending.x, y0: pending.y }
      document.documentElement.dataset.grab = 'true'
      window.getSelection()?.removeAllRanges()
      window.addEventListener('touchmove', stopScroll, { passive: false })
      paintHud()
    }

    const cancelPending = () => {
      window.clearTimeout(timer)
      pending = null
    }

    const end = () => {
      cancelPending()
      if (!held) return
      held = null
      agreed = false
      delete document.documentElement.dataset.grab
      window.removeEventListener('touchmove', stopScroll)
    }

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary || !isEmpty(event.target))
        return
      pending = {
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
      }
      timer = window.setTimeout(
        begin,
        event.pointerType === 'touch' ? HOLD_TOUCH : HOLD_MOUSE,
      )
    }

    const onMove = (event: PointerEvent) => {
      if (held) {
        moveLight(
          held.el,
          held.start,
          event.clientX - held.x0,
          event.clientY - held.y0,
        )
        paintHud()
        if (agree()) {
          if (!agreed) {
            agreed = true
            bloom()
            if (event.timeStamp - lastToast > 4000) {
              lastToast = event.timeStamp
              const first = !agreementUnlocked()
              unlockAgreement()
              toast({
                text: first
                  ? 'All three agree. A new console command is unlocked: reconcile.'
                  : 'All three agree.',
              })
            }
          }
        } else {
          agreed = false
        }
        return
      }
      // Moving before the hold finishes means a text selection or a scroll.
      if (
        pending &&
        Math.hypot(event.clientX - pending.x, event.clientY - pending.y) > 8
      ) {
        cancelPending()
      }
    }

    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      end()
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
  }, [])

  return (
    <div className="grab-hud" ref={hud} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  )
}

// Drop an image anywhere and the three signals take its colours.
function DropWallpaper() {
  const [over, setOver] = useState(false)

  useEffect(() => {
    let depth = 0
    const hasFiles = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes('Files')

    const onEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth++
      setOver(true)
    }
    const onOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault()
    }
    const onLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return
      depth = Math.max(0, depth - 1)
      if (depth === 0) setOver(false)
    }
    const onDrop = async (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth = 0
      setOver(false)
      const file = Array.from(event.dataTransfer?.files ?? []).find((f) =>
        f.type.startsWith('image/'),
      )
      if (!file) {
        toast({
          text: 'That is not an image. Drop a wallpaper, a photo, or a screenshot.',
        })
        return
      }
      const { setWallpaper } = await import('../lib/wallpaper-flow')
      await setWallpaper(file)
    }

    window.addEventListener('dragenter', onEnter)
    window.addEventListener('dragover', onOver)
    window.addEventListener('dragleave', onLeave)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragenter', onEnter)
      window.removeEventListener('dragover', onOver)
      window.removeEventListener('dragleave', onLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [])

  return over ? (
    <div className="drop" aria-hidden="true">
      <p>Drop an image to take its colours</p>
    </div>
  ) : null
}
