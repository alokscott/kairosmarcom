'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { EASE_OUT_EXPO, POINTER_SPRING, useStill } from './scroll'

/**
 * Kinetic motion primitives.
 *
 * Three rules hold across all of them:
 *  - Content is in the DOM and readable before anything animates.
 *  - Only `transform` and `opacity` are animated. `font-variation-settings` used to
 *    be on that list and is not any more: it is the one property here that forces a
 *    text re-shape and a relayout, and it re-wrapped the hero headline on every
 *    scroll. See KineticHeadline.
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
 * Line-by-line headline reveal that rotates in from the horizon.
 *
 * Lines are authored as an array rather than split from a string: a per-character
 * split would fragment the accessible name and be read out letter by letter.
 *
 * The `wdth` axis is NO LONGER scroll-driven, for two independent reasons found by
 * measuring it:
 *
 *  1. It did not work. `useScroll` measured this element, which lives inside a
 *     sticky pin — a stuck element's rect stops changing, so progress froze and the
 *     axis reported one constant value (98.47) at every scroll position on the page.
 *  2. It was actively harmful. `font-variation-settings` is the one layout-affecting
 *     property in this file: changing it re-shapes the text and relayouts the heading
 *     every frame. "Welcome to the" sat within a pixel of its column's wrap point, so
 *     sub-unit jitter in the axis flipped the hero between three and four lines
 *     continuously while scrolling.
 *
 * `kinetic` now selects a static optical width instead. Restoring the sweep would
 * mean measuring the stage rather than this element AND accepting a per-frame text
 * relayout — the `white-space: nowrap` on `.kinetic__line` is what would keep it
 * from ever re-wrapping again.
 */
export function KineticHeadline({
  lines,
  className = '',
  delay = 0,
  /** Select the wider optical setting on Archivo's `wdth` axis. Static, not scrolled. */
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

  return (
    <motion.span
      ref={ref}
      className={`kinetic ${kinetic ? 'kinetic--axis' : ''} ${className}`}
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
