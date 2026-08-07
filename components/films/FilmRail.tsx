'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useTransform } from 'motion/react'
import { KineticHeadline, PinnedStage } from '@/components/motion/Kinetic'
import { Reveal } from '@/components/motion/Reveal'
import { useMediaQuery, useScrollProgress } from '@/components/motion/scroll'
import { smoothScrollTo } from '@/components/motion/SmoothScroll'
import { Scene } from '@/components/three/Scene'
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

  /*
   * The rail is driven by the pin window directly rather than by a per-frame rAF
   * loop reading the scene store. Same travel, but the value passes through a spring,
   * so the track keeps moving and settles when the wheel stops instead of halting
   * with it — which is what made the old version feel stepped.
   */
  const [travel, setTravel] = useState(0)
  const progress = useScrollProgress(sectionRef, ['start start', 'end end'])
  const x = useTransform(progress, [0, 1], [0, -travel])

  /*
   * The exact condition under which globals.css un-pins `.stage` and turns `.htrack`
   * into a swipeable rail. The stylesheet is what actually makes the switch — it has
   * to be, so the rail is correct before hydration — and this mirrors it so the
   * JavaScript half stops driving a transform the CSS is overriding anyway.
   */
  const swiping = useMediaQuery('(prefers-reduced-motion: reduce), (max-width: 48rem), (max-height: 34rem)')

  useEffect(() => {
    // Distance the track must travel to bring its last tile flush with the right edge.
    if (swiping) {
      setTravel(0)
      return
    }
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth + 48))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [swiping])

  /* Keyboard: bring the focused tile into view by moving the page, not the track. */
  const onFocusIn = (e: React.FocusEvent<HTMLUListElement>) => {
    const track = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return
    /*
     * When the rail is a plain scroll container the browser already brings a focused
     * tile into view by scrolling the rail itself. Moving the page as well would fight
     * it, and the pin range this reads (`offsetHeight - innerHeight`) is meaningless
     * on an auto-height section.
     */
    if (swiping) return

    const tile = (e.target as HTMLElement).closest('li')
    if (!tile) return

    const travel = Math.max(1, track.scrollWidth - window.innerWidth + 48)
    const wanted = Math.min(1, Math.max(0, (tile.offsetLeft - 80) / travel))

    const rect = section.getBoundingClientRect()
    const top = window.scrollY + rect.top
    const pinRange = section.offsetHeight - window.innerHeight
    smoothScrollTo(top + wanted * pinRange)
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
                    The full archive <span aria-hidden="true" className="arrow">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            <motion.ul
              ref={trackRef}
              onFocus={onFocusIn}
              className="htrack mt-12 m-0 list-none p-0"
              style={{ x, paddingInline: 'clamp(1.25rem, 5vw, 4rem)' }}
              aria-label="Selected films"
            >
              {films.map((film) => (
                <li key={film.id} className="w-[74vw] shrink-0 sm:w-[21rem]">
                  <FilmTile film={film} onOpen={() => setOpen(film)} />
                </li>
              ))}
            </motion.ul>
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
      className="press group block w-full cursor-pointer text-left transition-transform duration-300 hover:-translate-y-1.5"
      style={{
        border: '1px solid var(--rule)',
        background: 'color-mix(in srgb, var(--bg-raised) 85%, transparent)',
        backdropFilter: 'blur(8px)',
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
    >
      <span className="pic relative block aspect-video w-full overflow-hidden" style={{ background: 'var(--bg-sunken)' }}>
        {poster ? (
          <>
            {/*
              Pic reveal: the still sits blurred and desaturated, with a sharp band
              cut through it. Hover — or keyboard focus, which matters more — opens
              the band to the full frame. Two copies of one image, so the browser
              decodes a single file and the reveal is a clip-path change.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt="" loading="lazy" decoding="async" width={480} height={360} className="pic__base" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              width={480}
              height={360}
              className="pic__sharp"
            />
            <span aria-hidden="true" className="pic__band" />
          </>
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
