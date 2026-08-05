import Link from 'next/link'
import ContactSection from '@/components/contact/ContactSection'
import FilmRail from '@/components/films/FilmRail'
import ClientWall from '@/components/home/ClientWall'
import Hero from '@/components/home/Hero'
import Principles from '@/components/home/Principles'
import ProcessSection from '@/components/home/ProcessSection'
import SelectedWork from '@/components/home/SelectedWork'
import ServicesPreview from '@/components/home/ServicesPreview'
import { Reveal } from '@/components/motion/Reveal'
import Accordion from '@/components/site/Accordion'
import ContactLink from '@/components/site/ContactLink'
import { faqs, objections, objectionsIntro, site } from '@/content/site'
import { faqLd, graph, organizationLd, pageMeta, serviceLd } from '@/lib/seo'

/**
 * The title here is `absolute` so the root layout's "%s | Kairos Marcom" template
 * does not append the suffix to a title that already ends in the brand name.
 */
export const metadata = {
  ...pageMeta({
    title: 'Kairos Marcom | Branding, Creative & Campaigns That Make People Act',
    description: site.description,
    path: '/',
  }),
  title: { absolute: 'Kairos Marcom | Branding, Creative & Campaigns That Make People Act' },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: graph(organizationLd(), faqLd(), ...serviceLd()) }}
      />

      <Hero />
      <ClientWall />
      <Principles />
      <ServicesPreview />
      <SelectedWork />
      <FilmRail />
      <ProcessSection />

      <section id="objections" className="section" data-accent="violet">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">Straight answers</p>
            <h2 className="max-w-[18ch] text-[length:var(--text-h1)]">
              The four things people say before they say yes
            </h2>
            <p className="muted mt-6 max-w-[52ch] text-[length:var(--text-lead)]">{objectionsIntro}</p>
          </Reveal>

          <div className="mt-12 grid-editorial">
            <div className="col-span-4 md:col-span-10 md:col-start-2">
              <Accordion items={objections} idPrefix="objection" />
            </div>
          </div>
        </div>
      </section>

      <section id="faqs" className="section" data-accent="lime">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">FAQs</p>
            <h2 className="max-w-[18ch] text-[length:var(--text-h1)]">Questions we get before the first call</h2>
          </Reveal>

          <div className="mt-12 grid-editorial">
            <div className="col-span-4 md:col-span-10 md:col-start-2">
              <Accordion items={faqs} idPrefix="faq" />

              <p className="muted mt-10 text-sm">
                Still unsure?{' '}
                <ContactLink channel="whatsapp" className="link-underline">
                  Message us on WhatsApp
                </ContactLink>{' '}
                — we answer those ourselves. Or{' '}
                <Link href="/process" className="link-underline">
                  read the process in full
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
