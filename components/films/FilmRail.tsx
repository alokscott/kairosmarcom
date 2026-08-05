'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { KineticHeadline, PinnedStage } from '@/components/motion/Kinetic'
import { Reveal } from '@/components/motion/Reveal'
import { Scene } from '@/components/three/Scene'
import { sceneMotion } from '@/components/three/store'
import { films } from '@/content/films'
import type { Film } from '@/content/types'
import VideoDialog from './VideoDialog'

/**
 * Film & motion — a pinned horizontal track.
 *
 * The panel sticks while vertical scroll drives the rail sideways, so the archive
 * reads as one continuous move rather than as a scrollbar the visitor has to find.
 * Vertical scrolling itself is untouched: this is `position: sticky` plus a
 * transform, not a wheel handler.
 *
 * Two things keep it usable rather than merely impressive:
 *  - `focusin` syncs page scroll to whichever tile the keyboard reached, so tabbing
 *    through the archive actually moves the track instead of focusing tiles that sit
 *    off-screen.
 *  - Under reduced motion the pin dissolves and the track becomes an ordinary
 *    horizontally scrollable list.
 */
export default function FilmRail() {
  const [open, setOpen] = useState<Film | null>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let visible = false

    const tick = () => {
      raf = 0
      // Distance the track must travel to bring its last tile flush with the right edge.
      const travel = Math.max(0, track.scrollWidth - window.innerWidth + 48)
      track.style.transform = `translate3d(${-sceneMotion.progress * travel}px, 0, 0)`
      if (visible) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    if (sectionRef.current) io.observe(sectionRef.current)

    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* Keyboard: bring the focused tile into view by moving the page, not the track. */
  const onFocusIn = (e: React.FocusEvent<HTMLUListElement>) => {
    const track = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tile = (e.target as HTMLElement).closest('li')
    if (!tile) return

    const travel = Math.max(1, track.scrollWidth - window.innerWidth + 48)
    const wanted = Math.min(1, Math.max(0, (tile.offsetLeft - 80) / travel))

    const rect = section.getBoundingClientRect()
    const top = window.scrollY + rect.top
    const pinRange = section.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + wanted * pinRange, behavior: 'smooth' })
  }

  return (
    <>
      <div ref={sectionRef}>
        <PinnedStage
          id="films"
          vh={320}
          accent="violet"
          className="in-scene"
          scene={<Scene preset="film" accent="violet" intensity={0.85} stages={1} />}
        >
          <div className="relative w-full">
            <div className="shell">
              <Reveal>
                <p className="eyebrow mb-4">Film &amp; motion</p>
                <div className="scrim flex flex-wrap items-end justify-between gap-6">
                  <h2 className="text-[length:var(--text-h1)]">
                    <KineticHeadline lines={['Twenty-one films.', 'Produced in-house.']} />
                  </h2>
                  <Link href="/films" className="btn btn--ghost">
                    The full archive <span className="arrow">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            <ul
              ref={trackRef}
              onFocus={onFocusIn}
              className="htrack mt-12 m-0 list-none p-0"
              style={{ paddingInline: 'clamp(1.25rem, 5vw, 4rem)' }}
              aria-label="Selected films"
            >
              {films.map((film) => (
                <li key={film.id} className="w-[74vw] shrink-0 sm:w-[21rem]">
                  <FilmTile film={film} onOpen={() => setOpen(film)} />
                </li>
              ))}
            </ul>
          </div>
        </PinnedStage>
      </div>

      <VideoDialog film={open} onClose={() => setOpen(null)} />
    </>
  )
}

export function FilmTile({ film, onOpen }: { film: Film; onOpen: () => void }) {
  const poster = film.youtubeId ? `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg` : null
  const playable = Boolean(film.youtubeId || film.externalUrl)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full cursor-pointer text-left transition-transform duration-500 hover:-translate-y-1.5"
      style={{
        border: '1px solid var(--rule)',
        background: 'color-mix(in srgb, var(--bg-raised) 85%, transparent)',
        backdropFilter: 'blur(8px)',
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
    >
      <span className="relative block aspect-video w-full overflow-hidden" style={{ background: 'var(--bg-sunken)' }}>
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            width={480}
            height={360}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
          />
        ) : (
          <span className="faint absolute inset-0 grid place-items-center text-xs">No preview published</span>
        )}
        {playable && (
          <span
            aria-hidden="true"
            className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full text-sm transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            ▶
          </span>
        )}
      </span>

      <span className="block p-4">
        <span className="eyebrow block">{film.category}</span>
        <span className="mt-2 block font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
          {film.title}
        </span>
        <span className="faint mt-1 block text-xs">
          {film.client ?? 'Kairos Marcom'}
          {film.year ? ` · ${film.year}` : ''}
        </span>
      </span>
    </button>
  )
}
