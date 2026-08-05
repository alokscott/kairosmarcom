'use client'

import { useReducedMotion, useScroll, useSpring, type MotionValue } from 'motion/react'
import { useEffect, useState, type RefObject } from 'react'

/**
 * Shared scroll plumbing.
 *
 * The single most important thing in this file is the spring. A raw scroll value
 * tracks the wheel one-to-one, so anything driven by it stops dead the instant the
 * wheel does — that is the "stepping" quality the old hand-rolled rAF loops had.
 * Passing it through a spring lets the value keep travelling and settle, which is
 * what makes scrubbed motion feel continuous rather than tied to the input device.
 *
 * Low stiffness with high damping: enough lag to feel weighted, no overshoot, so
 * scrubbed layout never oscillates around its resting position.
 */
export const SCROLL_SPRING = { stiffness: 90, damping: 22, restDelta: 0.001 } as const

/** Snappier spring for pointer-following, where lag reads as latency, not weight. */
export const POINTER_SPRING = { stiffness: 260, damping: 20, mass: 0.6 } as const

/** The brief's easing curve, as a motion-compatible tuple. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/**
 * Reduced-motion preference, held false until after hydration.
 *
 * `useReducedMotion()` reads the media query on the client but reports false during
 * SSR, so branching the rendered tree on it directly makes the server and the first
 * client render disagree — React throws a hydration mismatch and regenerates the
 * whole tree. Deferring by one commit means both renders agree, and the preference
 * takes effect immediately afterwards.
 *
 * Prefer branching a `transition` or an event handler over branching the tree at all;
 * swapping element types after mount remounts the subtree.
 */
export function useStill(): boolean {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && !!reduced
}

type Offset = NonNullable<Parameters<typeof useScroll>[0]>['offset']

/**
 * 0→1 as `ref` travels the viewport, smoothed.
 *
 * Defaults to the full transit: 0 when the element's top edge is at the bottom of
 * the viewport, 1 when its bottom edge reaches the top.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  offset: Offset = ['start end', 'end start']
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset })
  return useSpring(scrollYProgress, SCROLL_SPRING)
}
