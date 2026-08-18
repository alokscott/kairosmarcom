'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Inertial scrolling.
 *
 * This is the one place the site takes over an input it previously left alone, so
 * it is worth being precise about what it does and does not do.
 *
 * Lenis does NOT transform the page. It reads wheel and touch events, eases the
 * value, and writes real `scrollTop` — so `position: sticky`, `animation-timeline:
 * view()`, `IntersectionObserver`, the scene's `getBoundingClientRect` measurement
 * pass and motion's `useScroll` all keep working unchanged, because from their point
 * of view the page is simply being scrolled. A transform-based smooth-scroll library
 * would have broken every one of them.
 *
 * `scroll-behavior: smooth` is removed from `html` in globals.css: the two fight over
 * the same scroll position, and the CSS one wins on anchor jumps, which produces a
 * visible stutter as Lenis is dragged back mid-ease.
 *
 * Under reduced motion it does not run at all. Easing the scroll is exactly the kind
 * of "the page moves differently than I asked it to" effect that preference exists to
 * remove, and native scrolling is already the correct behaviour.
 */
let instance: Lenis | null = null

/**
 * Programmatic scroll that goes through Lenis when it is running.
 *
 * Native `window.scrollTo({ behavior: 'smooth' })` and Lenis both write scrollTop on
 * their own schedules, so calling the native one while Lenis is live makes the two
 * ease against each other and the page judders to its destination. Falls back to the
 * native call when Lenis is absent — reduced motion, or before mount.
 */
export function smoothScrollTo(top: number) {
  if (instance) instance.scrollTo(top)
  else window.scrollTo({ top, behavior: 'smooth' })
}

/**
 * Freeze the page behind a full-screen overlay.
 *
 * A modal `<dialog>` makes the background inert to clicks and to the tab order, but it
 * does NOT stop it scrolling — open the mobile menu, drag anywhere, and the page slid
 * underneath it. That is the single clearest "this is a web page" tell an overlay can
 * have, so both scroll paths are stopped: Lenis, which owns the wheel and would keep
 * easing a scroll it had already accepted, and the document itself for the reduced-
 * motion case where Lenis is not running at all.
 *
 * `overflow` goes on the root rather than on `body` because `body` already carries
 * `overflow-x: hidden`, and setting the shorthand there would clobber it on unlock.
 * The paired `scrollbar-gutter: stable` in globals.css is what stops the page jumping
 * sideways by the scrollbar width as the overlay opens.
 */
export function setScrollLocked(locked: boolean) {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      // Just past half a second of glide. Long enough to feel weighted, short enough
      // that the page still stops roughly where the wheel says it should.
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Touch devices already have momentum scrolling in the OS, and doubling it up
      // makes the page feel detached from the finger.
      syncTouch: false,
      // Let Lenis own in-page anchor jumps (the skip link, the FAQ links) so they
      // ease to their target instead of teleporting past a half-finished ease.
      anchors: true,
    })

    instance = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      instance = null
    }
  }, [])

  return null
}
