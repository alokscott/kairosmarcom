import Link from 'next/link'
import { cases } from '@/content/cases'
import { nav, site } from '@/content/site'
import ContactLink from './ContactLink'

export default function Footer() {
  return (
    <footer className="no-print relative border-t" style={{ borderColor: 'var(--rule)' }}>
      <div className="shell py-16">
        <div className="grid-editorial">
          <div className="col-span-4 md:col-span-4">
            <p className="statement max-w-[24ch]">{site.about}</p>
            <p className="eyebrow mt-6">{site.tagline}</p>
          </div>

          <nav className="col-span-2 md:col-span-2 md:col-start-6" aria-label="Explore">
            <h2 className="mb-4 text-xs font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--fg-faint)' }}>
              Explore
            </h2>
            <ul className="m-0 list-none space-y-2 p-0 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline muted">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="col-span-2 md:col-span-2" aria-label="Case studies">
            <h2 className="mb-4 text-xs font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--fg-faint)' }}>
              Case studies
            </h2>
            <ul className="m-0 list-none space-y-2 p-0 text-sm">
              {cases.map((c) => (
                <li key={c.slug}>
                  <Link href={`/work/${c.slug}`} className="link-underline muted">
                    {c.client}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 md:col-span-3">
            <h2 className="mb-4 text-xs font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--fg-faint)' }}>
              Get in touch
            </h2>
            <ul className="m-0 list-none space-y-2 p-0 text-sm">
              <li>
                <ContactLink channel="email" className="link-underline">
                  {site.email}
                </ContactLink>
              </li>
              <li>
                <ContactLink channel="phone" className="link-underline">
                  {site.phone}
                </ContactLink>
              </li>
              <li>
                <ContactLink channel="whatsapp" className="link-underline">
                  WhatsApp
                </ContactLink>
              </li>
              <li className="faint pt-2">{site.hours}</li>
            </ul>

            {/* flex-wrap: three social links in a 4-of-12 column overflowed the
                viewport by 18px at the 768px breakpoint, which put a horizontal
                scrollbar on every page of the site. */}
            <ul className="mt-6 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-sm">
              <li>
                <a href={site.social.instagram} className="link-underline muted" rel="me noopener">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.social.linkedin} className="link-underline muted" rel="me noopener">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.social.behance} className="link-underline muted" rel="me noopener">
                  Behance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="rule my-10" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs" style={{ color: 'var(--fg-faint)' }}>
          <p>© {new Date().getFullYear()} Kairos Marcom. All rights reserved.</p>
          {/* A list, not a paragraph: these are two navigation targets rather than a
              sentence, and as list items they inherit the 44px touch height that
              standalone links get on coarse pointers. */}
          <ul className="m-0 flex list-none gap-4 p-0">
            <li>
              <Link href="/privacy" className="link-underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="link-underline">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
