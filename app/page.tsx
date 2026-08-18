import Link from 'next/link'
import ContactSection from '@/components/contact/ContactSection'
import FilmRail from '@/components/films/FilmRail'
import BrandRoster from '@/components/home/BrandRoster'
import ClientWall from '@/components/home/ClientWall'
import CraftProof from '@/components/home/CraftProof'
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
      <BrandRoster />
      <CraftProof />
      <ProcessSection />

      {/*
        Two columns, not a full-width heading over an indented list.

        The list used to sit at `col-start-2` under a heading at column one — a
        one-column nudge that read as a mistake rather than as an indent, and left a
        closed accordion of short questions stranded across ten columns of empty space.
        Splitting it puts the heading block and the list each on their own grid line,
        which is the pattern the rest of the page already runs, and gives the rows a
        measure they fill.
      */}
      <section id="objections" className="section" data-accent="violet">
        <div className="shell">
          <div className="grid-editorial items-start gap-y-10">
            <div className="col-span-4 md:col-span-5">
              <Reveal>
                <p className="eyebrow mb-4">Straight answers</p>
                <h2 className="max-w-[16ch] text-[length:var(--text-h2)]">
                  The four things people say before they say yes
                </h2>
                <p className="muted mt-6 max-w-[42ch] leading-relaxed">{objectionsIntro}</p>
              </Reveal>
            </div>

            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <Reveal delay={120}>
                <Accordion items={objections} idPrefix="objection" numbered />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="faqs" className="section" data-accent="lime">
        <div className="shell">
          <div className="grid-editorial items-start gap-y-10">
            {/*
              Sticky, unlike the objections block above it.

              Seven questions make this column roughly twice the height of its heading,
              and a heading that scrolls away from the list it names leaves the reader
              part-way down an unlabelled set of rows. Sticky needs the grid ITEM to
              stretch and the sticky box to be a child of it — with `items-start` the
              item is content-height and there is no room inside it to travel.
            */}
            <div className="col-span-4 md:col-span-5 md:self-stretch">
              <div className="md:sticky md:top-32">
                <Reveal>
                  <p className="eyebrow mb-4">FAQs</p>
                  <h2 className="max-w-[16ch] text-[length:var(--text-h2)]">Questions we get before the first call</h2>

                  {/* Moved up beside the heading. At the foot of a seven-row accordion
                      it was a line of small print after the last border; here it is the
                      other half of the invitation the heading is making. */}
                  <p className="muted mt-6 max-w-[42ch] leading-relaxed">
                    Still unsure?{' '}
                    <ContactLink channel="whatsapp" className="link-underline">
                      Message us on WhatsApp
                    </ContactLink>
                    . We answer those ourselves. Or{' '}
                    <Link href="/process" className="link-underline">
                      read the process in full
                    </Link>
                    .
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <Reveal delay={120}>
                <Accordion items={faqs} idPrefix="faq" numbered />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
