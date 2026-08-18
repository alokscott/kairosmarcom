import type { Metadata } from 'next'
import ContactSection from '@/components/contact/ContactSection'
import { Reveal } from '@/components/motion/Reveal'
import Accordion from '@/components/site/Accordion'
import { contact, faqs, site } from '@/content/site'
import { breadcrumbLd, faqLd, graph, organizationLd, pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Contact — book your 30-minute call',
  description:
    'Thirty minutes, no pitch deck, no obligation. A senior lead on the call, scope and fee agreed in writing before you commit, and an honest no if we are not the right fit. hello@kairosmarcom.com.',
  path: '/contact',
})

/** What happens next, drawn from the published first-call description. */
const NEXT_STEPS = [
  {
    step: '01',
    title: 'You send this form',
    body: 'It reaches a senior lead directly. We reply within one business day, Monday to Friday, 10am–7pm IST.',
  },
  {
    step: '02',
    title: 'Thirty minutes, no deck',
    body: 'You describe what is stuck, we ask questions. You leave with at least one useful observation whether or not you hire us.',
  },
  {
    step: '03',
    title: 'A number in writing',
    body: 'If it is a fit, scope and fee are agreed in writing before you commit to anything. If it is not, we will say so and point you somewhere better.',
  },
]

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            organizationLd(),
            faqLd(),
            breadcrumbLd([
              { name: 'Home', path: '/' },
              { name: 'Contact', path: '/contact' },
            ])
          ),
        }}
      />

      <section className="relative pt-40 pb-4" data-accent="orange">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">Ready when you are</p>
            <h1 className="max-w-[18ch] text-[length:var(--text-display)]">{contact.headline}</h1>
          </Reveal>
        </div>
      </section>

      <ContactSection heading={false} />

      <section className="section pt-0" data-accent="violet">
        <div className="shell">
          <h2 className="text-[length:var(--text-h2)]">What happens next</h2>
          <ol className="mt-10 m-0 grid list-none gap-px p-0 sm:grid-cols-3" style={{ background: 'var(--rule)' }}>
            {NEXT_STEPS.map((item) => (
              <li key={item.step} className="p-6" style={{ background: 'var(--bg)' }}>
                <p className="mono-num text-xs" style={{ color: 'var(--accent-text)' }}>
                  {item.step}
                </p>
                <h3 className="mt-2 text-[length:var(--text-h3)]">{item.title}</h3>
                <p className="muted mt-3 text-sm leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ol>

          <p className="faint mt-8 max-w-[62ch] text-sm">
            {contact.privacyNote} Read the{' '}
            <a href="/privacy" className="link-underline">
              privacy policy
            </a>{' '}
            for how long we keep enquiries and how to have one deleted. Office hours are {site.hours}.
          </p>
        </div>
      </section>

      <section className="section pt-0" data-accent="lime">
        <div className="shell">
          <h2 className="text-[length:var(--text-h2)]">Before you write</h2>
          <div className="mt-10 grid-editorial">
            <div className="col-span-4 md:col-span-10">
              <Accordion items={faqs} idPrefix="contact-faq" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
