'use client'

import { useEffect, useRef, useState } from 'react'
import type { MetricChart as Chart } from '@/content/types'

/**
 * Results visualisation.
 *
 * The chart IS a <table>. There is no separate "accessible equivalent" to keep in
 * sync, because a duplicated data representation is a data representation that
 * eventually disagrees with itself. Screen readers get real rows and headers;
 * sighted users get bars, drawn with CSS on those same cells.
 *
 * Bars always start at zero. There is deliberately no axis-truncation option —
 * the brief forbids it, and an API that cannot express a misleading chart cannot
 * accidentally produce one.
 */
export default function MetricChart({ chart, source }: { chart: Chart; source?: string | null }) {
  const ref = useRef<HTMLTableElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const max = Math.max(...chart.points.map((p) => p.value), 1)
  // For "lower is better", the winning bar is the smallest value.
  const best = chart.lowerIsBetter
    ? Math.min(...chart.points.map((p) => p.value))
    : Math.max(...chart.points.map((p) => p.value))

  return (
    <figure className="m-0">
      <table ref={ref} className="w-full border-collapse text-left">
        <caption className="mb-1 text-left">
          <span className="block font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            {chart.title}
          </span>
          <span className="muted mt-1 block max-w-[62ch] text-sm">{chart.takeaway}</span>
        </caption>

        <thead className="sr-only">
          <tr>
            <th scope="col">{chart.kind === 'category' ? 'Channel' : 'Period'}</th>
            <th scope="col">{chart.unit}</th>
          </tr>
        </thead>

        <tbody>
          {chart.points.map((p) => {
            const isBest = p.value === best
            const width = drawn ? `${Math.max((p.value / max) * 100, p.value > 0 ? 2 : 0)}%` : '0%'
            return (
              <tr key={p.label}>
                <th
                  scope="row"
                  className="w-[38%] py-2.5 pr-4 align-middle text-sm font-normal"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {p.label}
                </th>
                <td className="py-2.5 align-middle">
                  <span className="flex items-center gap-3">
                    {/*
                      The bar gets its own track rather than sitting directly in this
                      row. It used to be a `shrink-0` element sized `width: <percent>%`
                      of the row itself, so the longest bar took 100% of the row and
                      pushed the number off the end — on a 390px phone the top figure
                      was clipped at the viewport edge and simply could not be read.
                      Shrinking the bar instead would have been worse: the length is
                      the data, and a bar that shrinks to fit is a lying axis.

                      `flex-1 min-w-0` gives the track whatever is left once the number
                      has its space, and the percentage resolves against that. Every bar
                      still starts at zero and every bar is still measured against the
                      same track, so nothing about the scale changes — only the space it
                      is drawn in.
                    */}
                    <span className="min-w-0 flex-1">
                      <span
                        aria-hidden="true"
                        className="block h-2.5 rounded-[1px]"
                        style={{
                          width,
                          minWidth: p.value > 0 ? '2px' : '0',
                          background: isBest ? 'var(--accent)' : 'var(--rule-strong)',
                          transition: 'width 900ms var(--ease-out-expo)',
                        }}
                      />
                      {/* Zero is a real result here — it gets a visible mark, not an empty cell. */}
                      {p.value === 0 && (
                        <span aria-hidden="true" className="block h-2.5 w-px" style={{ background: 'var(--rule-strong)' }} />
                      )}
                    </span>
                    <span className="mono-num shrink-0 text-sm font-semibold">{p.display}</span>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <figcaption className="faint mt-2 text-xs">
        Figures in {chart.unit}.{chart.lowerIsBetter ? ' Lower is better.' : ''}
        {source ? ` ${source}` : ''}
      </figcaption>
    </figure>
  )
}
