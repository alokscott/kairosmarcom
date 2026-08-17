'use client'

import { Reveal } from '@/components/motion/Reveal'
import ContactLink from '@/components/site/ContactLink'
import { Scene } from '@/components/three/Scene'
import { contact, offices, site } from '@/content/site'
import ContactForm from './ContactForm'

/**
 * Closing convergence.
 *
 * ─── Why this is compact ───
 *
 * The left column used to be a single `<dl>` running Email, Phone, WhatsApp, Hours and
 * then three offices, every one of them a 12px uppercase label over a line of body
 * text. Nine stacked rows of small print beside a tall form made the section about two
 * and a half viewports of scrolling to reach a button, and the two things a visitor is
 * actually hunting for — the email address and the phone number — were set at the same
 * size as the office hours.
 *
 * It is now three bands with a job each: the ask, the channels, the addresses. The
 * channels are display type, because "read the email address" is the whole task. The
 * offices are cards, so the city is a heading rather than a caption and the addresses
 * are picked out instead of buried. Everything else that was in that list — hours,
 * response time — is one line of small print at the foot, which is where a detail
 * nobody is scanning for belongs.
 */
export default function ContactSection({ heading = true }: { heading?: boolean }) {
  /*
   * The section sets tighter block padding than `.section`, which runs to 9rem a side.
   * This is the last band before the footer and the one the whole page is pointing at —
   * the generous rhythm that gives an editorial section room to breathe just puts more
   * scrolling between a decided visitor and the submit button.
   */
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-[clamp(3.5rem,8vh,5.5rem)]"
      data-accent="orange"
    >
      <Scene preset="contact" accent="orange" />

      <div className="shell relative">
        <div className="grid-editorial items-start gap-y-10">
          <div className="col-span-4 md:col-span-5">
            {heading && (
              <Reveal>
                <p className="eyebrow mb-4">Ready when you are</p>
                <h2 className="max-w-[16ch] text-[length:var(--text-h2)]">{contact.headline}</h2>
              </Reveal>
            )}

            <Reveal delay={heading ? 100 : 0}>
              <p className={`muted max-w-[44ch] leading-relaxed ${heading ? 'mt-6' : ''}`}>{contact.body}</p>

              <ul className="mt-7 m-0 list-none space-y-0 p-0">
                {contact.promises.map((promise) => (
                  <li
                    key={promise}
                    className="flex items-baseline gap-3 border-b py-3 text-sm"
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <span aria-hidden="true" style={{ color: 'var(--accent-text)' }}>
                      ✓
                    </span>
                    {promise}
                  </li>
                ))}
              </ul>

              {/*
                Display type, not a labelled list row. These two lines are what a
                visitor who has decided to get in touch is looking for, and at 14px
                under a 12px caption they were the least prominent thing in the column.
              */}
              <dl className="mt-9 m-0">
                <dt className="eyebrow">Email</dt>
                <dd className="m-0 mt-1.5">
                  <ContactLink
                    channel="email"
                    className="link-underline font-[family-name:var(--font-display)] text-[clamp(1.125rem,1.9vw,1.5rem)] font-bold tracking-tight"
                  >
                    {site.email}
                  </ContactLink>
                </dd>

                <dt className="eyebrow mt-6">Phone</dt>
                <dd className="m-0 mt-1.5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <span className="flex items-baseline gap-2">
                    <ContactLink
                      channel="phone"
                      className="link-underline font-[family-name:var(--font-display)] text-[clamp(1.125rem,1.9vw,1.5rem)] font-bold tracking-tight"
                    >
                      {site.phone}
                    </ContactLink>
                    <span className="faint text-xs tracking-[0.14em] uppercase">Delhi</span>
                  </span>
                  <span className="flex items-baseline gap-2">
                    <a
                      href={site.phoneDubaiHref}
                      className="link-underline font-[family-name:var(--font-display)] text-[clamp(1.125rem,1.9vw,1.5rem)] font-bold tracking-tight"
                    >
                      {site.phoneDubai}
                    </a>
                    <span className="faint text-xs tracking-[0.14em] uppercase">Dubai</span>
                  </span>
                </dd>
              </dl>

              <p className="mt-6 text-sm">
                <ContactLink channel="whatsapp" className="link-underline">
                  Or message us on WhatsApp
                </ContactLink>
                <span className="faint"> — we answer those ourselves.</span>
              </p>
            </Reveal>
          </div>

          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <ContactForm />
          </div>

          {/*
            Full width under both columns. Three addresses are a row of equals, and in
            the left column they were a third stack of small print pushing the form's
            first field further down the page.
          */}
          <div className="col-span-4 md:col-span-12">
            <Reveal delay={140}>
              {/* No "Where we are" label above this. Three cards headed Delhi, Dubai
                  and Mumbai are already unambiguous, and the caption was a row of
                  height spent restating them. */}
              <ul className="m-0 grid list-none p-0 sm:grid-cols-2 lg:grid-cols-3">
                {offices.map((office) => (
                  <li
                    key={office.city}
                    className="-mt-px -ml-px border p-5"
                    style={{ background: 'var(--bg)', borderColor: 'var(--rule)' }}
                  >
                    <p className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-extrabold tracking-tight">
                      {office.city}
                    </p>
                    {/* Mumbai has no street address yet, so the city is published
                        without one rather than under an invented placeholder. The line
                        fills in the moment an address reaches content/site.ts. */}
                    <p className="muted mt-2 max-w-[34ch] text-sm leading-relaxed">
                      {office.address ?? <span className="faint">Address to be supplied</span>}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="faint mt-6 text-sm">
                {site.hours}. {site.responseTime}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
