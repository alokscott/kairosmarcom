'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { setScene, type Theme } from '@/components/three/store'
import { track } from '@/lib/analytics'

/**
 * Two states, never three.
 *
 * There is no "system" option any more: the site defaults to light and the OS
 * preference is not consulted anywhere (see the `:root` block in globals.css). A
 * tri-state control whose third state looks identical to one of the other two is a
 * control nobody can predict.
 *
 * The knob travels on a spring and squashes along its direction of travel while it
 * moves — that stretch is the whole reason this reads as liquid rather than as a
 * checkbox. It settles back to round on arrival.
 */

/** Matches --bg in each theme block of globals.css. */
const BG: Record<Theme, string> = { light: '#F4F1E9', dark: '#080808' }

const TRACK = 56
const KNOB = 26
const PAD = 3
const TRAVEL = TRACK - KNOB - PAD * 2

/** Whatever the pre-paint script in app/layout.tsx already applied to <html>. */
function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function ThemeToggle() {
  // Starts at the SSR value so hydration matches exactly, then syncs from the DOM
  // below. `ready` suppresses the spring for that first sync, so a returning
  // dark-mode visitor sees the knob already in place rather than sliding on load.
  const [theme, setTheme] = useState<Theme>('light')
  const [ready, setReady] = useState(false)
  const still = useReducedMotion()
  const isDark = theme === 'dark'

  useEffect(() => {
    setTheme(currentTheme())
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // The inline script owns `data-theme` before React exists, but it cannot reach the
  // scene store — and the 3D layer needs the theme to choose its blending mode and
  // key light, or it washes out completely on bone.
  useEffect(() => {
    setScene({ theme })
  }, [theme])

  const apply = useCallback((next: Theme) => {
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG[next])
    try {
      localStorage.setItem('kairos-theme', next)
    } catch {
      // Private mode. The theme still applies for this page view.
    }
    track('theme_change', { theme: next })
  }, [])

  const animate = ready && !still

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Dark mode: ${isDark ? 'on' : 'off'}`}
      onClick={() => apply(isDark ? 'light' : 'dark')}
      className="theme-toggle"
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <motion.span
          className="theme-toggle__knob"
          initial={false}
          animate={{ x: isDark ? TRAVEL : 0, scaleX: animate ? [1, 1.3, 1] : 1 }}
          transition={
            animate
              ? {
                  x: { type: 'spring', stiffness: 430, damping: 28, mass: 0.7 },
                  scaleX: { duration: 0.42, times: [0, 0.38, 1], ease: [0.16, 1, 0.3, 1] },
                }
              : { duration: 0 }
          }
        >
          {/* Rotates through the swap so the glyph turns over rather than popping. */}
          <motion.span
            className="theme-toggle__glyph"
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={animate ? { type: 'spring', stiffness: 260, damping: 24 } : { duration: 0 }}
          >
            {isDark ? <Moon /> : <Sun />}
          </motion.span>
        </motion.span>
      </span>
    </button>
  )
}

function Sun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function Moon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.2A8.4 8.4 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" />
    </svg>
  )
}
