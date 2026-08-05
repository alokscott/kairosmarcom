'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Kinetic motion primitives.
 *
 * Three rules hold across all of them:
 *  - Content is in the DOM and readable before anything animates.
 *  - Only `transform`, `opacity` and `font-variation-settings` are animated.
 *  - Under reduced motion every one of these degrades to a static, correct layout —
 *    the pinned stages stop pinning, the type stops breathing, the tilt detaches.
 */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ */
/* Pinned scroll stage                                                 */
/* ------------------------------------------------------------------ */

/**
 * A tall section whose inner panel sticks while the page scrolls past it, giving
 * a scene the room to transform without stealing the scrollbar.
 *
 * This is `position: sticky`, not scroll-jacking: the wheel, trackpad, spacebar and
 * scrollbar all move the page at exactly their normal rate. The brief rules out
 * hijacking, not pinning — and pinning is what buys a scrubbed 3D transformation.
 */
export function PinnedStage({
  vh = 260,
  scene,
  children,
  className = '',
  id,
  accent,
}: {
  /** Scroll distance the pin lasts, in viewport heights. */
  vh?: number
  /** Rendered outside the sticky panel so it measures the full scroll range. */
  scene?: React.ReactNode
  children: React.ReactNode
  className?: string
  id?: string
  accent?: string
}) {
  return (
    <section
      id={id}
      data-accent={accent}
      className={`stage relative ${className}`}
      style={{ ['--stage-vh' as string]: `${vh}vh` }}
    >
      {scene}
      <div className="stage__pin">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Kinetic headline                                                    */
/* ------------------------------------------------------------------ */

/**
 * Line-by-line headline reveal that rotates in from the horizon, plus optional
 * scroll-linked width on Archivo's variable `wdth` axis.
 *
 * Lines are authored as an array rather than split from a string: a per-character
 * split would fragment the accessible name and be read out letter by letter.
 */
export function KineticHeadline({
  lines,
  className = '',
  delay = 0,
  /** Breathe the variable width axis as the section scrolls. */
  kinetic = false,
}: {
  lines: readonly string[]
  className?: string
  delay?: number
  kinetic?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [seen, setSeen] = useState(false)
  const off = reduced()

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (off || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen, off])

  // Width axis tracks the element's travel through the viewport. One rAF loop, one
  // custom-property write per frame, and it stops the moment the element leaves.
  useEffect(() => {
    const el = ref.current
    if (!el || !kinetic || off) return

    let raf = 0
    let visible = false
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })

    function tick() {
      raf = 0
      const node = ref.current
      if (!node) return
      const r = node.getBoundingClientRect()
      const t = 1 - Math.min(1, Math.max(0, (r.top + r.height / 2) / window.innerHeight))
      // Deliberately narrow: 86 → 104. A wider sweep looks better in isolation but
      // changes the advance widths enough to re-wrap the headline mid-scroll, which
      // both breaks the authored line breaks and shifts everything below it.
      node.style.setProperty('--wdth', String(86 + t * 18))
      node.style.setProperty('--wght', String(720 + t * 160))
      if (visible) raf = requestAnimationFrame(tick)
    }

    io.observe(el)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [kinetic, off])

  return (
    <span ref={ref} className={`kinetic ${kinetic ? 'kinetic--axis' : ''} ${className}`}>
      {lines.map((line, i) => (
        <span key={line} className="kinetic__mask">
          <span
            className="kinetic__line"
            style={{
              transform: off || seen ? 'none' : 'translateY(88%) rotateX(-72deg)',
              opacity: off || seen ? 1 : 0,
              transitionDelay: off ? '0ms' : `${delay + i * 110}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Pointer tilt                                                        */
/* ------------------------------------------------------------------ */

/**
 * Perspective tilt toward the pointer. Fine pointers only — on touch it would
 * either never fire or fire on tap, and a card that tips when you try to open it
 * is worse than one that does not move.
 */
export function Tilt({
  children,
  max = 7,
  lift = 10,
  className = '',
}: {
  children: React.ReactNode
  /** Maximum rotation in degrees. */
  max?: number
  /** Z translation on hover, in px. */
  lift?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const loop = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      el.style.transform = `perspective(1000px) rotateX(${cy}deg) rotateY(${cx}deg) translateZ(${
        Math.abs(cx) + Math.abs(cy) > 0.2 ? lift : 0
      }px)`
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) raf = requestAnimationFrame(loop)
      else raf = 0
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * max
      ty = -((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * max
      start()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      start()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [max, lift])

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll-scrubbed parallax                                            */
/* ------------------------------------------------------------------ */

/** Translates its child against the scroll direction. `speed` is px per viewport. */
export function Parallax({
  children,
  speed = 60,
  className = '',
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return

    let raf = 0
    let visible = false

    const tick = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const t = (r.top + r.height / 2) / window.innerHeight - 0.5
      el.style.transform = `translate3d(0, ${-t * speed}px, 0)`
      if (visible) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(el)

    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
