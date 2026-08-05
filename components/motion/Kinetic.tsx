'use client'

import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { EASE_OUT_EXPO, POINTER_SPRING, useScrollProgress, useStill } from './scroll'

/**
 * Kinetic motion primitives.
 *
 * Three rules hold across all of them:
 *  - Content is in the DOM and readable before anything animates.
 *  - Only `transform`, `opacity` and `font-variation-settings` are animated.
 *  - Under reduced motion every one of these degrades to a static, correct layout —
 *    the pinned stages stop pinning, the type stops breathing, the tilt detaches.
 */

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
  ref,
}: {
  /** Scroll distance the pin lasts, in viewport heights. */
  vh?: number
  /** Rendered outside the sticky panel so it measures the full scroll range. */
  scene?: React.ReactNode
  children: React.ReactNode
  className?: string
  id?: string
  accent?: string
  /** The tall section, not the sticky panel — measure scroll against this. */
  ref?: React.Ref<HTMLElement>
}) {
  return (
    <section
      ref={ref}
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
  /** Which edge the lines arrive from. 'down' descends into place from above. */
  enter = 'up',
  /**
   * 'view' waits until the headline is scrolled into view; 'load' runs immediately on
   * mount. Use 'load' only above the fold — below it, the animation would finish
   * unseen and the reveal would be wasted.
   */
  trigger = 'view',
}: {
  lines: readonly string[]
  className?: string
  delay?: number
  kinetic?: boolean
  enter?: 'up' | 'down'
  trigger?: 'view' | 'load'
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const still = useStill()
  const progress = useScrollProgress(ref)

  // Deliberately narrow: 86 → 104. A wider sweep looks better in isolation but
  // changes the advance widths enough to re-wrap the headline mid-scroll, which
  // both breaks the authored line breaks and shifts everything below it.
  const wdth = useTransform(progress, [0, 1], [86, 104])
  const wght = useTransform(progress, [0, 1], [720, 880])
  const axis = useMotionTemplate`'wdth' ${wdth}, 'wght' ${wght}`

  const live = kinetic && !still

  return (
    <motion.span
      ref={ref}
      className={`kinetic ${kinetic ? 'kinetic--axis' : ''} ${className}`}
      style={live ? { fontVariationSettings: axis } : undefined}
      initial="hidden"
      {...(trigger === 'load'
        ? { animate: 'shown' }
        : { whileInView: 'shown', viewport: { once: true, amount: 0.05 } })}
    >
      {lines.map((line, i) => (
        <span key={line} className="kinetic__mask">
          <motion.span
            className="kinetic__line"
            variants={{
              hidden: enter === 'down' ? { y: '-88%', rotateX: 72, opacity: 0 } : { y: '88%', rotateX: -72, opacity: 0 },
              shown: { y: '0%', rotateX: 0, opacity: 1 },
            }}
            /* Collapsed, not removed — see the note in Reveal. A headline that never
               leaves its `hidden` variant is a headline nobody can read. */
            transition={
              still ? { duration: 0 } : { duration: 1, ease: EASE_OUT_EXPO, delay: delay / 1000 + i * 0.11 }
            }
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
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
  const still = useStill()
  const rotateX = useSpring(useMotionValue(0), POINTER_SPRING)
  const rotateY = useSpring(useMotionValue(0), POINTER_SPRING)
  const z = useSpring(useMotionValue(0), POINTER_SPRING)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transformPerspective: 1000, transformStyle: 'preserve-3d', rotateX, rotateY, z }}
      onPointerMove={
        still
          ? undefined
          : (e) => {
              const el = ref.current
              if (!el || !window.matchMedia('(pointer: fine)').matches) return
              const r = el.getBoundingClientRect()
              rotateY.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * max)
              rotateX.set(-((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * max)
              z.set(lift)
            }
      }
      onPointerLeave={() => {
        rotateX.set(0)
        rotateY.set(0)
        z.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
