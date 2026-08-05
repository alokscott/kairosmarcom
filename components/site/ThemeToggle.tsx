'use client'

import { useEffect, useState } from 'react'
import { track } from '@/lib/analytics'

type Theme = 'light' | 'dark' | 'system'

/**
 * Light/dark control. Three states, because "follow the OS" is a real preference
 * and a two-way switch silently discards it.
 *
 * The applied theme is written by the inline script in <head> before first paint;
 * this component only reads and updates it, so there is no flash.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    setTheme((localStorage.getItem('kairos-theme') as Theme) ?? 'system')
  }, [])

  const apply = (next: Theme) => {
    setTheme(next)
    if (next === 'system') {
      localStorage.removeItem('kairos-theme')
      document.documentElement.removeAttribute('data-theme')
    } else {
      localStorage.setItem('kairos-theme', next)
      document.documentElement.setAttribute('data-theme', next)
    }
    track('theme_change', { theme: next })
  }

  const next: Theme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
  const label = { dark: 'Dark', light: 'Light', system: 'System' }[theme]

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      className="btn btn--ghost px-3 py-2 text-xs"
      aria-label={`Theme: ${label}. Switch to ${next}.`}
    >
      <span aria-hidden="true">{theme === 'dark' ? '◐' : theme === 'light' ? '◑' : '◒'}</span>
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}
