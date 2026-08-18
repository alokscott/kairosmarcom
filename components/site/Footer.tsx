import Link from 'next/link'
import Image from 'next/image'
import { cases } from '@/content/cases'
import { footerNav, site } from '@/content/site'
import ContactLink from './ContactLink'
import Tagline from './Tagline'

/*
 * The footer paints its own opaque surface.
 *
 * It had no background, and the site's single WebGL canvas is `position: fixed`, so the
 * scene carried on painting behind the footer nav and the contact details all the way
 * down every page.
 *
 * `--bg-raised` rather than a literal #fff: it is the whitest surface in the token set
 * (#fffdf7 on the light theme) and it still resolves to a sensible raised dark in the
 * dark theme, where a hard white footer would read as a rendering fault.
 */
export default function Footer() {
  return (
    <footer
      className="no-print relative border-t"
      style={{ borderColor: 'var(--rule)', background: 'var(--bg-raised)' }}
    >
      {/* The bottom inset clears the iOS home indicator, which otherwise sits directly
          over the copyright line once the page paints edge to edge. */}
      <div className="shell pt-16" style={{ paddingBottom: 'calc(4rem + var(--safe-b))' }}>
        {/*
          Two parts, divided.

          The brand — mark, positioning line, tagline — used to be a fourth column
          beside the three lists, which made the agency's own statement compete for
          width with a nav menu and left its longest line wrapping to seven. It gets the
          full measure here, above a rule, and the lists sit under it as the utility
          they are.
        */}
        <div className="grid-editorial items-end gap-y-8">
          <div className="col-span-4 md:col-span-7">
            {/* Both marks ship and CSS picks one, so the logo is correct before
                hydration — the same pair the header uses. */}
            <Link href="/" className="inline-block no-underline" aria-label={`${site.name} — home`}>
              <Image src="/logo-wr.png" alt="" width={503} height={160} className="brand-mark brand-mark--dark h-9 w-auto" />
              <Image
                src="/logo.png"
                alt={site.name}
                width={503}
                height={160}
                className="brand-mark brand-mark--light h-9 w-auto"
              />
            </Link>

            <p className="statement mt-7 max-w-[30ch]">{site.about}</p>
          </div>

          <div className="col-span-4 md:col-span-5">
            <Tagline />
          </div>
        </div>

        <hr className="rule my-12" />

        <div className="grid-editorial">
          {/* Half-width from 416px up. Below that the two lists sat in ~140px columns
              and every case-study client name wrapped to two or three lines. */}
          <nav className="col-span-4 min-[26rem]:col-span-2 md:col-span-3" aria-label="Explore">
            <h2 className="mb-4 text-xs font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--fg-faint)' }}>
              Explore
            </h2>
            <ul className="m-0 list-none space-y-2 p-0 text-sm">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline muted">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="col-span-4 min-[26rem]:col-span-2 md:col-span-4" aria-label="Case studies">
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

          <div className="col-span-4 md:col-span-5">
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
              {/* The Dubai line is a plain anchor: ContactLink only knows the three
                  primary channels, and adding a fourth to it for one number would put
                  a second "phone" into the analytics channel dimension. */}
              <li>
                <a href={site.phoneDubaiHref} className="link-underline muted">
                  {site.phoneDubai}
                </a>
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
              <li>
                <a href={site.social.facebook} className="link-underline muted" rel="me noopener">
                  Facebook
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
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
