'use client'

import { useEffect, useRef, useState } from 'react'
import { trackOnce } from '@/lib/analytics'

/**
 * Motion primitives.
 *
 * All of them share one rule: the content is in the DOM and readable before any
 * animation runs. Nothing here gates access to text — if the observer never fires,
 * or motion is reduced, the element is simply visible.
 */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fires once, the first time `ref` is at least `threshold` visible. */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])

  return [ref, seen] as const
}

/** Masked reveal: content slides up from behind its own edge. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  as?: 'div' | 'span' | 'li' | 'p'
  className?: string
}) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const off = reduced()

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        opacity: off || seen ? 1 : 0,
        transform: off || seen ? 'none' : 'translateY(26px)',
        transition: off ? 'none' : `opacity 720ms var(--ease-out-expo) ${delay}ms, transform 720ms var(--ease-out-expo) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}

/**
 * Line-by-line masked headline reveal.
 *
 * Lines are authored as an array rather than split from a string, so the accessible
 * name is never fragmented into per-character spans that screen readers read out
 * one letter at a time.
 */
export function RevealLines({
  lines,
  className = '',
  delay = 0,
}: {
  lines: readonly string[]
  className?: string
  delay?: number
}) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.05)
  const off = reduced()

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <span
            className="block"
            style={{
              transform: off || seen ? 'none' : 'translateY(105%)',
              transition: off ? 'none' : `transform 820ms var(--ease-out-expo) ${delay + i * 90}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  )
}

/**
 * Counts up when it becomes visible, then stops.
 *
 * The final value is rendered on the server and never removed from the DOM, so a
 * visitor with JS disabled — or a crawler — sees the real number, not a zero.
 */
export function Counter({
  value,
  suffix = '',
  duration = 1100,
  className = '',
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.4)
  const [display, setDisplay] = useState(value)
  const started = useRef(false)

  useEffect(() => {
    if (!seen || started.current) return
    started.current = true
    if (reduced()) return

    setDisplay(0)
    let raf = 0
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutExpo, so the number lands rather than crawls
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(Math.round(eased * value))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [seen, value, duration])

  return (
    <span ref={ref} className={`mono-num ${className}`}>
      {display}
      {suffix}
    </span>
  )
}

/** Magnetic CTA: the element leans toward the pointer. Fine pointers only. */
export function Magnetic({
  children,
  strength = 0.28,
  className = '',
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`
    }
    const reset = () => {
      el.style.transform = 'translate3d(0,0,0)'
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', reset)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
    }
  }, [strength])

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ transition: 'transform 380ms var(--ease-out-expo)' }}
    >
      {children}
    </span>
  )
}

/** Reports scroll-depth milestones once each. Used on case studies. */
export function DepthTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const milestones = [25, 50, 75, 100]
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = (window.scrollY / max) * 100
      for (const m of milestones) {
        if (pct >= m) trackOnce('case_depth', { slug, depth: m })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  return null
}

/** Records, in aggregate only, that this session ran with reduced motion. */
export function MotionPreferenceProbe() {
  useEffect(() => {
    if (reduced()) trackOnce('reduced_motion_active')
    const onWebglFail = () => trackOnce('webgl_unavailable')
    window.addEventListener('kairos:webgl-unavailable', onWebglFail)
    return () => window.removeEventListener('kairos:webgl-unavailable', onWebglFail)
  }, [])
  return null
}
