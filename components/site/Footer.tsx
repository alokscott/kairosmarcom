import Link from 'next/link'
import Image from 'next/image'
import { cases } from '@/content/cases'
import { footerNav, site, social } from '@/content/site'
import ContactLink from './ContactLink'
import BrandMark from './BrandMark'
import LineIcon from './LineIcon'
import Tagline from './Tagline'
import { CONTACT_ICONS, SOCIAL_ICONS } from './icons'

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
      {/*
        Two parts, and the first is a full-bleed band.

        The brand — mark, positioning line, tagline — used to be a fourth column beside
        the three lists, competing for width with a nav menu. It is now a red band the
        width of the page, which is the one place on the site the brand colour is the
        ground rather than an accent on it.

        The band is `--accent-fill`, not `--accent`. That distinction exists precisely
        for this: a surface carrying text takes the 4.5:1 bar, and white on the exact
        logo red measures 3.96:1. The statement would have passed as large text; the
        tagline's 14px beats would not.
      */}
      <div className="footer-brand">
        <BrandMark className="footer-brand__mark" />

        <div className="shell relative py-14">
          <div className="grid-editorial items-end gap-y-8">
            <div className="col-span-4 md:col-span-7">
              {/* One mark, not the theme-swapped pair the header uses: the band is red
                  in both themes, so the reversed mark is always the right one. */}
              <Link href="/" className="inline-block no-underline" aria-label={`${site.name} — home`}>
                <Image src="/logo-wr.png" alt={site.name} width={503} height={160} className="footer-brand__logo h-10 w-auto" />
              </Link>

              <p className="statement mt-7 max-w-[30ch]">{site.about}</p>
            </div>

            <div className="col-span-4 md:col-span-5">
              <Tagline />
            </div>
          </div>
        </div>
      </div>

      {/* The bottom inset clears the iOS home indicator, which otherwise sits directly
          over the copyright line once the page paints edge to edge. */}
      <div className="shell pt-14" style={{ paddingBottom: 'calc(4rem + var(--safe-b))' }}>
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
            {/* Each line leads with its channel's mark, and the mark lives INSIDE the
                anchor. As a sibling it would have broken `a:only-child`, which is the
                selector granting these links their 44px touch height on phones — the
                icon would have cost the link its target size to sit next to it. */}
            <ul className="m-0 list-none space-y-2 p-0 text-sm">
              <li>
                <ContactLink channel="email" className="contact-line">
                  <LineIcon>{CONTACT_ICONS.email}</LineIcon>
                  <span className="link-underline">{site.email}</span>
                </ContactLink>
              </li>
              <li>
                <ContactLink channel="phone" className="contact-line">
                  <LineIcon>{CONTACT_ICONS.phone}</LineIcon>
                  <span className="link-underline">{site.phone}</span>
                </ContactLink>
              </li>
              {/* The Dubai line is a plain anchor: ContactLink only knows the three
                  primary channels, and adding a fourth to it for one number would put
                  a second "phone" into the analytics channel dimension. */}
              <li>
                <a href={site.phoneDubaiHref} className="contact-line muted">
                  <LineIcon>{CONTACT_ICONS.phone}</LineIcon>
                  <span className="link-underline">{site.phoneDubai}</span>
                </a>
              </li>
              <li>
                <ContactLink channel="whatsapp" className="contact-line">
                  <LineIcon>{CONTACT_ICONS.whatsapp}</LineIcon>
                  <span className="link-underline">WhatsApp</span>
                </ContactLink>
              </li>
              {/* Not a link, but it takes the icon anyway. Without one it would be the
                  only line in the column hanging off the left edge the other four
                  establish, which reads as a mistake rather than as a different kind
                  of line. */}
              <li className="contact-line faint pt-2">
                <LineIcon>{CONTACT_ICONS.hours}</LineIcon>
                <span>{site.hours}</span>
              </li>
            </ul>

            {/* Mapped over the one list in content, not written out link by link —
                which is what let Behance sit here pointing at an account that never
                existed. Add or remove a profile in `social` and this row follows.

                Icons rather than the four words they replace. The names were set at
                13px in a 4-of-12 column and wrapped to two lines; four marks everyone
                already knows say the same thing in a third of the width, and each is a
                44px target instead of a line of small text. The name stays as the
                accessible label — this is a picture of a word, not a replacement for
                one. */}
            {/* mt-10. The circles read as one visual object rather than another run of
                text lines, so they need the gap that separates two blocks, not the gap
                that separates two lines — at 1.5rem and even at 2rem they looked
                attached to the opening-hours line above them. */}
            <ul className="social-row m-0 mt-10 list-none p-0">
              {social.map((profile) => (
                <li key={profile.href}>
                  <a href={profile.href} className="social-link" rel="me noopener" aria-label={profile.label}>
                    <LineIcon>{SOCIAL_ICONS[profile.label]}</LineIcon>
                  </a>
                </li>
              ))}
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
