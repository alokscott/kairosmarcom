'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Film } from '@/content/types'
import { filmWatchUrl } from '@/content/films'
import { track } from '@/lib/analytics'

/**
 * Click-to-play film modal.
 *
 * Native <dialog> supplies the focus trap, Esc handling, backdrop and inert
 * background. The YouTube iframe is only created once the dialog opens — before
 * that there is no third-party request at all, which is both a performance
 * decision and the consent-aware default (brief §20).
 *
 * There is no autoplay with sound: `mute=0` with `autoplay=1` is ignored by
 * browsers anyway, and the play is an explicit user action here.
 */
export default function VideoDialog({ film, onClose }: { film: Film | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (film && !dialog.open) {
      dialog.showModal()
      setConsented(false)
    }
    if (!film && dialog.open) dialog.close()
  }, [film])

  const handleClose = useCallback(() => {
    setConsented(false)
    onClose()
  }, [onClose])

  const start = () => {
    if (!film) return
    setConsented(true)
    track('video_start', { film: film.id, client: film.client ?? 'none' })
  }

  const watchUrl = film ? filmWatchUrl(film) : null

  return (
    <dialog ref={ref} onClose={handleClose} aria-label={film ? `${film.title} — video` : 'Video'}>
      <div className="w-[min(96vw,72rem)]" style={{ background: 'var(--bg-raised)', border: '1px solid var(--rule)' }}>
        <div className="flex items-start justify-between gap-4 border-b p-4" style={{ borderColor: 'var(--rule)' }}>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{film?.title}</h2>
            <p className="faint text-xs">
              {film?.category}
              {film?.client ? ` · ${film.client}` : ''}
              {film?.year ? ` · ${film.year}` : ''}
            </p>
          </div>
          <button type="button" className="btn btn--ghost shrink-0" onClick={() => ref.current?.close()}>
            Close
          </button>
        </div>

        <div className="relative aspect-video w-full" style={{ background: 'var(--bg-sunken)' }}>
          {film?.youtubeId && consented ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`}
              title={film.title}
              allow="accelerated-destination; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              {film?.youtubeId ? (
                <div>
                  {/* Poster comes from YouTube's own CDN; no local art exists for any film. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`}
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
                    width={480}
                    height={360}
                  />
                  <button type="button" className="btn btn--primary relative" onClick={start}>
                    ▶ Play film
                  </button>
                  <p className="faint relative mt-3 max-w-[40ch] text-xs">
                    Playing loads the video from YouTube, which sets its own cookies. Captions are shown where the
                    upload provides them.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="muted max-w-[42ch] text-sm">
                    This film is listed in the archive but no playable link was published for it. It is kept here rather
                    than removed or pointed at a different video.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {watchUrl && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm" style={{ borderColor: 'var(--rule)' }}>
            <p className="faint text-xs">Hosted externally. Opens in a new tab.</p>
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
              Watch on {film?.externalUrl ? 'Facebook' : 'YouTube'} <span aria-hidden="true" className="arrow">↗</span>
            </a>
          </div>
        )}
      </div>
    </dialog>
  )
}
