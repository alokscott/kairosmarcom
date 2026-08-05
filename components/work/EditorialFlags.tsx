import type { CaseStudy } from '@/content/types'

/**
 * Editorial state banner.
 *
 * Every migrated study carries open items — missing imagery, unstated years, no
 * approved testimonial. Those need to be visible to the people preparing the site,
 * and invisible to a visitor, so this renders only when NEXT_PUBLIC_SHOW_CONTENT_FLAGS
 * is set. Staging turns it on; production leaves it off.
 *
 * The flags are never a substitute for the migration sheet — see
 * docs/09-content-migration.md, which is the tracked list.
 */
export default function EditorialFlags({ study }: { study: CaseStudy }) {
  if (process.env.NEXT_PUBLIC_SHOW_CONTENT_FLAGS !== 'true') return null
  if (study.state === 'published' && study.openItems.length === 0) return null

  return (
    <aside
      className="shell my-8"
      aria-label={`Editorial status for ${study.client}`}
    >
      <div className="p-5" style={{ border: '1px dashed var(--rule-strong)', background: 'var(--bg-raised)' }}>
        <p className="text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--accent-text)' }}>
          Editorial status — {study.state.replace(/-/g, ' ')}
        </p>
        {study.openItems.length > 0 && (
          <ul className="muted m-0 mt-3 list-disc space-y-1 pl-5 text-sm">
            {study.openItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
