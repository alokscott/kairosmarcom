'use client'

import { useMemo, useState } from 'react'
import type { CaseStudy } from '@/content/types'
import { serviceById } from '@/content/site'
import { track } from '@/lib/analytics'
import CaseCard from './CaseCard'

/**
 * Work index filtering.
 *
 * Filtering happens over an array that is already on the page, so results are
 * instant and every card stays server-rendered and crawlable — nothing is fetched
 * and nothing is hidden from a crawler behind a filter state.
 *
 * The result count is announced politely on every change, because a silent list
 * that shrinks is invisible to anyone not watching it.
 */

type Facet = 'service' | 'industry' | 'tag' | 'platform'

export default function WorkFilters({ studies }: { studies: CaseStudy[] }) {
  const [active, setActive] = useState<Record<Facet, string | null>>({
    service: null,
    industry: null,
    tag: null,
    platform: null,
  })
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const facets = useMemo(() => {
    const uniq = (xs: string[]) => [...new Set(xs)].sort()
    return {
      service: uniq(studies.flatMap((c) => c.services.map((s) => serviceById(s).name))),
      industry: uniq(studies.map((c) => c.industry).filter((i): i is string => Boolean(i))),
      tag: uniq(studies.flatMap((c) => c.tags)),
      platform: uniq(studies.flatMap((c) => c.channels.map((ch) => ch.platform))),
    }
  }, [studies])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return studies.filter((c) => {
      if (active.service && !c.services.some((s) => serviceById(s).name === active.service)) return false
      if (active.industry && c.industry !== active.industry) return false
      if (active.tag && !c.tags.includes(active.tag)) return false
      if (active.platform && !c.channels.some((ch) => ch.platform === active.platform)) return false
      if (q && !`${c.client} ${c.projectTitle} ${c.summary}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [studies, active, query])

  const toggle = (facet: Facet, value: string) => {
    setActive((prev) => {
      const next = { ...prev, [facet]: prev[facet] === value ? null : value }
      track('case_filter', { facet, value: next[facet] ?? 'cleared' })
      return next
    })
  }

  const clearAll = () => {
    setActive({ service: null, industry: null, tag: null, platform: null })
    setQuery('')
    track('case_filter', { facet: 'all', value: 'cleared' })
  }

  const anyActive = Object.values(active).some(Boolean) || query.trim().length > 0

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b pb-6" style={{ borderColor: 'var(--rule)' }}>
        <div className="min-w-[16rem] flex-1">
          <label htmlFor="case-search" className="mb-2 block text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--fg-faint)' }}>
            Search by client
          </label>
          <input
            id="case-search"
            type="search"
            value={query}
            placeholder="BMW, DJI, ThriveDx…"
            onChange={(e) => setQuery(e.target.value)}
            onBlur={(e) => e.target.value && track('case_search', { length: e.target.value.length })}
            className="w-full px-3 py-2.5 text-sm"
            style={{ background: 'var(--bg)', border: '1px solid var(--rule-strong)', color: 'var(--fg)' }}
          />
        </div>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--fg-faint)' }}>
            View
          </legend>
          <div className="flex gap-2">
            {(['grid', 'list'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className="btn btn--ghost px-3 py-2 text-xs capitalize"
                style={view === mode ? { borderColor: 'var(--accent)', color: 'var(--accent-text)' } : undefined}
              >
                {mode}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 space-y-4">
        {(Object.keys(facets) as Facet[]).map((facet) => (
          <fieldset key={facet} className="m-0 flex flex-wrap items-baseline gap-2 border-0 p-0">
            <legend className="sr-only">Filter by {facet}</legend>
            <span className="mr-2 w-20 shrink-0 text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--fg-faint)' }}>
              {facet === 'tag' ? 'Type' : facet}
            </span>
            {facets[facet].map((value) => {
              const on = active[facet] === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggle(facet, value)}
                  aria-pressed={on}
                  className="px-3 py-1.5 text-xs"
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
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm">
          <span className="mono-num font-semibold">{results.length}</span>{' '}
          <span className="muted">
            {results.length === 1 ? 'case study' : 'case studies'}
            {anyActive ? ' match these filters' : ' in total'}
          </span>
        </p>
        {anyActive && (
          <button type="button" onClick={clearAll} className="link-underline text-sm">
            Clear all
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="muted mt-16 max-w-[46ch]">
          Nothing matches that combination. Clearing one of the filters will bring results back — every study is still
          listed, none have been removed.
        </p>
      ) : (
        <div className="grid-editorial mt-10">
          {results.map((study, i) => (
            <CaseCard
              key={study.slug}
              study={study}
              index={i}
              layout={view === 'list' ? 'wide' : i % 3 === 0 ? 'split' : 'tall'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
