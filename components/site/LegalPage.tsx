import Link from 'next/link'

export interface LegalSection {
  heading: string
  body: string[]
  /**
   * Something a lawyer must decide, not something we can write. Rendered as a
   * visible marker in non-production so it cannot be published by accident.
   */
  review?: string
}

/**
 * Shared shell for the privacy and terms templates.
 *
 * Both pages were linked from every page of the source site and both returned 404,
 * so there is nothing to migrate. What is here describes what this build actually
 * does; anything that is a commercial or statutory decision is marked for review
 * rather than drafted on the client's behalf.
 */
export default function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string
  intro: string
  sections: LegalSection[]
}) {
  const showFlags = process.env.NEXT_PUBLIC_SHOW_CONTENT_FLAGS === 'true'
  const outstanding = sections.filter((s) => s.review)

  return (
    <article className="section pt-40" data-accent="silver">
      <div className="shell">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="max-w-[16ch] text-[length:var(--text-h1)]">{title}</h1>
        <p className="muted mt-6 max-w-[58ch] text-[length:var(--text-lead)]">{intro}</p>

        {showFlags && outstanding.length > 0 && (
          <aside
            className="mt-10 p-5"
            style={{ border: '1px dashed var(--rule-strong)', background: 'var(--bg-raised)' }}
            aria-label="Outstanding legal review items"
          >
            <p className="text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--accent-text)' }}>
              Requires legal sign-off before launch — {outstanding.length} item
              {outstanding.length === 1 ? '' : 's'}
            </p>
            <ul className="muted m-0 mt-3 list-disc space-y-1 pl-5 text-sm">
              {outstanding.map((s) => (
                <li key={s.heading}>
                  <strong>{s.heading}:</strong> {s.review}
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="mt-14 grid-editorial items-start">
          <nav aria-label="On this page" className="col-span-4 md:col-span-3">
            <ul className="m-0 list-none space-y-2 p-0 text-sm md:sticky md:top-28">
              {sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${slug(s.heading)}`} className="link-underline muted">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 md:col-span-8 md:col-start-5">
            {sections.map((s) => (
              <section
                key={s.heading}
                id={slug(s.heading)}
                className="scroll-mt-28 border-b py-8 first:pt-0"
                style={{ borderColor: 'var(--rule)' }}
              >
                <h2 className="text-[length:var(--text-h3)]">{s.heading}</h2>
                {s.body.map((paragraph) => (
                  <p key={paragraph} className="muted mt-4 max-w-[58ch] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {showFlags && s.review && (
                  <p className="mt-4 max-w-[58ch] text-sm" style={{ color: 'var(--accent-text)' }}>
                    Review needed: {s.review}
                  </p>
                )}
              </section>
            ))}

            <p className="faint mt-8 text-sm">
              Questions about this page?{' '}
              <Link href="/contact" className="link-underline">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
