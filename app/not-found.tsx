import Link from 'next/link'
import { cases } from '@/content/cases'
import { nav } from '@/content/site'

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <section className="section pt-40" data-accent="orange">
      <div className="shell">
        <p className="eyebrow mb-4">404</p>
        <h1 className="max-w-[16ch] text-[length:var(--text-h1)]">That page has moved, or never existed.</h1>
        <p className="muted mt-6 max-w-[52ch] text-[length:var(--text-lead)]">
          Old case-study links in the form <code className="faint">case.php?s=…</code> now redirect to their clean
          address, so an old bookmark should still land. If you arrived from one and ended up here, these are the nine
          studies.
        </p>

        <ul className="mt-10 m-0 grid list-none gap-x-8 gap-y-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <li key={c.slug}>
              <Link href={`/work/${c.slug}`} className="link-underline">
                {c.client}
              </Link>
            </li>
          ))}
        </ul>

        <nav aria-label="Site" className="mt-12">
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline muted">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" className="btn btn--primary mt-10">
          Back to the homepage
        </Link>
      </div>
    </section>
  )
}
