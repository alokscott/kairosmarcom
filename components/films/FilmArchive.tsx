'use client'

import { useMemo, useState } from 'react'
import { filmCategories, filmClients, films, filmYears } from '@/content/films'
import type { Film } from '@/content/types'
import { FilmTile } from './FilmRail'
import VideoDialog from './VideoDialog'

/**
 * The filterable film archive.
 *
 * Twenty-one films, including the two the source site lists without a playable
 * link. Those stay in the archive and open a modal that says so, rather than being
 * dropped from the count or quietly pointed at a different video.
 */
export default function FilmArchive() {
  const [open, setOpen] = useState<Film | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [client, setClient] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)

  const results = useMemo(
    () =>
      films.filter(
        (f) =>
          (!category || f.category === category) &&
          (!client || f.client === client) &&
          (!year || f.year === year)
      ),
    [category, client, year]
  )

  const any = Boolean(category || client || year)

  return (
    <div>
      <div className="space-y-4 border-b pb-8" style={{ borderColor: 'var(--rule)' }}>
        <FilterRow label="Category" values={filmCategories} active={category} onChange={setCategory} />
        <FilterRow label="Client" values={filmClients} active={client} onChange={setClient} />
        <FilterRow label="Year" values={filmYears} active={year} onChange={setYear} />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm">
          <span className="mono-num font-semibold">{results.length}</span>{' '}
          <span className="muted">
            {results.length === 1 ? 'film' : 'films'}
            {any ? ' match these filters' : ' in the archive'}
          </span>
        </p>
        {any && (
          <button
            type="button"
            className="link-underline text-sm"
            onClick={() => {
              setCategory(null)
              setClient(null)
              setYear(null)
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="muted mt-16 max-w-[46ch]">
          No film matches that combination. Only three films carry a published year, so filtering by year narrows things
          sharply.
        </p>
      ) : (
        <ul className="mt-10 m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((film) => (
            <li key={film.id}>
              <FilmTile film={film} onOpen={() => setOpen(film)} />
            </li>
          ))}
        </ul>
      )}

      <VideoDialog film={open} onClose={() => setOpen(null)} />
    </div>
  )
}

function FilterRow({
  label,
  values,
  active,
  onChange,
}: {
  label: string
  values: string[]
  active: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <fieldset className="m-0 flex flex-wrap items-baseline gap-2 border-0 p-0">
      <legend className="sr-only">Filter by {label.toLowerCase()}</legend>
      <span className="mr-2 w-20 shrink-0 text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--fg-faint)' }}>
        {label}
      </span>
      {values.map((value) => {
        const on = active === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? null : value)}
            className="tap-44 px-3 py-1.5 text-xs"
            style={{
              border: `1px solid ${on ? 'var(--accent)' : 'var(--rule)'}`,
              background: on ? 'var(--accent)' : 'transparent',
              color: on ? 'var(--on-accent)' : 'var(--fg-muted)',
              transition: 'all 180ms var(--ease-out-expo)',
            }}
          >
            {value}
          </button>
        )
      })}
    </fieldset>
  )
}
