'use client'

import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { EASE_OUT_EXPO, POINTER_SPRING, useStill } from './scroll'
import { trackOnce } from '@/lib/analytics'

/**
 * Motion primitives.
 *
 * All of them share one rule: the content is in the DOM and readable before any
 * animation runs. Nothing here gates access to text — if the observer never fires,
 * or motion is reduced, the element is simply visible.
 */

const TAGS = { div: motion.div, span: motion.span, li: motion.li, p: motion.p } as const

/** Masked reveal: content rises into place the first time it is scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  as?: keyof typeof TAGS
  className?: string
}) {
  const still = useStill()
  const Tag = TAGS[as]

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      /*
       * Reduced motion collapses the duration rather than removing the animation.
       * Dropping `whileInView` would leave the element on its `initial` opacity of 0
       * — the text would be permanently invisible to exactly the people who asked for
       * less movement, not more.
       */
      transition={still ? { duration: 0 } : { duration: 0.72, delay: delay / 1000, ease: EASE_OUT_EXPO }}
    >
      {children}
    </Tag>
  )
}

/**
 * Counts up when it becomes visible, then stops.
 *
 * The final value is rendered on the server and never removed from the DOM, so a
 * visitor with JS disabled — or a crawler — sees the real number, not a zero.
 *
 * The running value is a motion value rendered directly as a child, so the count
 * writes to the DOM text node instead of re-rendering this component sixty times a
 * second, which is what the previous `setState`-per-frame version did.
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
  const still = useStill()
  const count = useMotionValue(value)
  const shown = useTransform(count, (v) => String(Math.round(v)))
  const started = useRef(false)

  return (
    <motion.span
      className={`mono-num ${className}`}
      viewport={{ once: true, amount: 0.4 }}
      onViewportEnter={() => {
        if (started.current || still) return
        started.current = true
        count.set(0)
        animate(count, value, { duration: duration / 1000, ease: EASE_OUT_EXPO })
      }}
    >
      <motion.span>{shown}</motion.span>
      {suffix}
    </motion.span>
  )
}

/**
 * Magnetic CTA: the element leans toward the pointer, on a spring so it trails the
 * cursor slightly and settles back rather than snapping. Fine pointers only — on
 * touch it would fire on tap, and a button that slides away as you press it is
 * worse than one that does not move.
 */
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
  const still = useStill()
  const x = useSpring(useMotionValue(0), POINTER_SPRING)
  const y = useSpring(useMotionValue(0), POINTER_SPRING)

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      // Handlers are detached under reduced motion; the element itself never changes
      // type, so the tree stays identical across hydration.
      onPointerMove={
        still
          ? undefined
          : (e) => {
              const el = ref.current
              if (!el || !window.matchMedia('(pointer: fine)').matches) return
              const r = el.getBoundingClientRect()
              x.set((e.clientX - (r.left + r.width / 2)) * strength)
              y.set((e.clientY - (r.top + r.height / 2)) * strength)
            }
      }
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) trackOnce('reduced_motion_active')
    const onWebglFail = () => trackOnce('webgl_unavailable')
    window.addEventListener('kairos:webgl-unavailable', onWebglFail)
    return () => window.removeEventListener('kairos:webgl-unavailable', onWebglFail)
  }, [])
  return null
}
