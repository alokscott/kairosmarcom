'use client'

import { Reveal } from '@/components/motion/Reveal'
import ContactLink from '@/components/site/ContactLink'
import { Scene } from '@/components/three/Scene'
import { contact, site } from '@/content/site'
import ContactForm from './ContactForm'

/**
 * Closing convergence.
 *
 * The scene here is the hero's in reverse: everything the site separated across
 * nine case studies and six disciplines aligns into one object as the visitor
 * reaches the call to action.
 */
export default function ContactSection({ heading = true }: { heading?: boolean }) {
  return (
    <section id="contact" className="section relative overflow-hidden" data-accent="orange">
      <Scene preset="contact" accent="orange" />

      <div className="shell relative">
        {heading && (
          <Reveal>
            <p className="eyebrow mb-4">Ready when you are</p>
            <h2 className="max-w-[18ch] text-[length:var(--text-h1)]">{contact.headline}</h2>
          </Reveal>
        )}

        <div className="mt-12 grid-editorial items-start">
          <div className="col-span-4 md:col-span-5">
            <Reveal>
              <p className="text-[length:var(--text-lead)] leading-relaxed">{contact.body}</p>

              <ul className="mt-8 m-0 list-none space-y-0 p-0">
                {contact.promises.map((promise) => (
                  <li
                    key={promise}
                    className="flex items-baseline gap-3 border-b py-3.5 text-sm"
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <span aria-hidden="true" style={{ color: 'var(--accent-text)' }}>
                      ✓
                    </span>
                    {promise}
                  </li>
                ))}
              </ul>

              <dl className="mt-10 space-y-4 text-sm">
                <div>
                  <dt className="faint text-xs tracking-[0.14em] uppercase">Email</dt>
                  <dd className="m-0 mt-1">
                    <ContactLink channel="email" className="link-underline">
                      {site.email}
                    </ContactLink>
                  </dd>
                </div>
                <div>
                  <dt className="faint text-xs tracking-[0.14em] uppercase">Phone</dt>
                  <dd className="m-0 mt-1">
                    <ContactLink channel="phone" className="link-underline">
                      {site.phone}
                    </ContactLink>
                  </dd>
                </div>
                <div>
                  <dt className="faint text-xs tracking-[0.14em] uppercase">WhatsApp</dt>
                  <dd className="m-0 mt-1">
                    <ContactLink channel="whatsapp" className="link-underline">
                      Message us — we answer those ourselves
                    </ContactLink>
                  </dd>
                </div>
                <div>
                  <dt className="faint text-xs tracking-[0.14em] uppercase">Hours</dt>
                  <dd className="muted m-0 mt-1">{site.hours}</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
