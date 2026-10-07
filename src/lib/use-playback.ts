import { useEffect, useRef, useState } from 'react'

// Steps a diagram forward once it scrolls into view. Reduced motion jumps
// straight to the finished state, so the diagram is never half drawn.
export function usePlayback(steps: number, interval: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(steps)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          setRun((r) => r + 1)
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [steps])

  useEffect(() => {
    if (run === 0) return
    setStep(0)
    let current = 0
    const timer = window.setInterval(() => {
      current += 1
      setStep(current)
      if (current >= steps) window.clearInterval(timer)
    }, interval)
    return () => window.clearInterval(timer)
  }, [run, steps, interval])

  const replay = () => {
    started.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(steps)
      return
    }
    setRun((r) => r + 1)
  }

  return { ref, step, replay, done: step >= steps }
}
