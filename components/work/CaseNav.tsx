'use client'

import { useEffect, useState } from 'react'

/**
 * Sticky in-page navigation for a case study.
 *
 * Items are built from the sections that actually exist on the study, so a study
 * without a challenge or a results module never advertises an anchor that goes
 * nowhere. It is an ordinary <nav> of same-page anchors: it works with JavaScript
 * off, and the scroll-spy highlight is the only thing that needs JS.
 */
export default function CaseNav({ items }: { items: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(items[0]?.id ?? '')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return

    const onScroll = () => {
      const marker = window.innerHeight * 0.3
      let active = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) active = section
      }
      setCurrent(active.id)

      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  return (
    <nav
      aria-label="Sections of this case study"
      className="no-print sticky top-24 hidden self-start lg:block"
    >
      {/* Progress is decorative — the same information is in the highlighted item. */}
      <div aria-hidden="true" className="mb-6 h-px w-full" style={{ background: 'var(--rule)' }}>
        <div
          className="h-px origin-left"
          style={{ background: 'var(--accent)', transform: `scaleX(${progress})`, transformOrigin: 'left' }}
        />
      </div>

      <ul className="m-0 list-none space-y-1 p-0 text-sm">
        {items.map((item) => {
          const on = current === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? 'true' : undefined}
                className="block py-1.5 no-underline"
                style={{
                  color: on ? 'var(--accent-text)' : 'var(--fg-muted)',
                  fontWeight: on ? 600 : 400,
                  transition: 'color 180ms var(--ease-out-expo)',
                }}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
