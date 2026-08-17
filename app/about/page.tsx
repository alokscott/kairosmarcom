import type { Metadata } from 'next'
import Link from 'next/link'
import { DnaHeading } from '@/components/home/Principles'
import { Reveal } from '@/components/motion/Reveal'
import Tagline from '@/components/site/Tagline'
import { Scene } from '@/components/three/Scene'
import { clients, dna, principles, principlesIntro, site } from '@/content/site'
import { breadcrumbLd, graph, organizationLd, pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'About — the meaning of Kairos',
  description:
    'Kairos means the supreme moment: the right thing said at the right time. A senior-led branding and communications firm in New Delhi, working with brands across India and internationally.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            organizationLd(),
            breadcrumbLd([
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
            ])
          ),
        }}
      />

      <section className="relative overflow-hidden pt-40 pb-16" data-accent="orange">
        <Scene preset="core" accent="orange" />
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-4">About</p>
            <h1 className="max-w-[16ch] text-[length:var(--text-display)]">Kairos means the supreme moment</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="statement mt-10 max-w-[40ch]">
              The right thing said at the right time. Everything the studio does exists to find that moment for a brand,
              then build around it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section border-t" style={{ borderColor: 'var(--rule)' }}>
        <div className="shell">
          <div className="grid-editorial items-start">
            <div className="col-span-4 md:col-span-5">
              <h2 className="text-[length:var(--text-h2)]">Creative philosophy</h2>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <p className="text-[length:var(--text-lead)] leading-relaxed">{site.about}</p>
              <p className="muted mt-6 leading-relaxed">
                A place where expressions are strategized, thoughts are innovative and stories are delivered. Whether it
                is strategy, naming, design, digital experience, activation or brand governance, we know what it takes
                to build brands for success.
              </p>
              <Tagline className="mt-8" />
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" data-accent="violet">
        <div className="shell">
          <h2 className="max-w-[16ch] text-[length:var(--text-h1)]">How we get things flowing, in four steps</h2>
          <p className="muted mt-6 max-w-[58ch] text-[length:var(--text-lead)]">{principlesIntro}</p>

          <ol className="mt-14 m-0 grid list-none gap-px p-0 sm:grid-cols-2" style={{ background: 'var(--rule)' }}>
            {principles.map((p) => (
              <li key={p.id} data-accent={p.accent} className="p-7" style={{ background: 'var(--bg)' }}>
                <p className="mono-num text-xs" style={{ color: 'var(--accent-text)' }}>
                  {p.index}
                </p>
                <h3 className="mt-2 text-[length:var(--text-h2)]">{p.title}</h3>
                <p className="muted mt-4 max-w-[46ch] leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pt-0" data-accent="lime">
        <div className="shell">
          {/* The same lockup as the homepage band, imported rather than restated so
              the two cannot drift apart. */}
          <DnaHeading />
          <dl className="mt-10 grid-editorial m-0">
            {dna.map((item) => (
              <div key={item.title} className="col-span-4 md:col-span-6 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                <dt className="statement mb-3">{item.title}</dt>
                <dd className="muted m-0 max-w-[52ch] leading-relaxed">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <div className="grid-editorial items-start">
            <div className="col-span-4 md:col-span-5">
              <h2 className="text-[length:var(--text-h2)]">Senior-led, by design</h2>
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <p className="text-[length:var(--text-lead)] leading-relaxed">
                The senior people you meet on the call are the ones who do the work. We are a pack of creativity-driven
                and execution-strong professionals — passionate marketers, project managers, creatives and designers.
                There is no junior handoff after the pitch, because there is no pitch team.
              </p>
              <p className="muted mt-6 leading-relaxed">
                Founded in {site.foundingDate}, with offices in Delhi, Dubai and Mumbai. We have worked across India,
                Bangladesh, Sri Lanka and the UAE, and we run remote engagements with a standing overlap window for
                calls.
              </p>
              <p className="muted mt-6 leading-relaxed">
                We take on work that spreads something positive. Brands that make a real change get our best thinking,
                and our best rates.
              </p>

              {/*
                Team profiles are intentionally absent. No names, roles, biographies or
                portraits are published on the source site, and the brief forbids both
                inventing them and filling the gap with stock photography. The section
                appears the moment approved profiles exist.
              */}
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" data-accent="silver">
        <div className="shell">
          <h2 className="text-[length:var(--text-h2)]">Clients</h2>
          <ul className="mt-8 m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
            {clients.map((client) => (
              <li
                key={client.name}
                className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,3vw,2rem)] font-bold tracking-tight"
                style={{ color: 'var(--fg-muted)' }}
              >
                {client.name}
              </li>
            ))}
          </ul>
          <p className="faint mt-6 max-w-[62ch] text-sm">
            Names are listed as supplied. Client marks are not reproduced here until written permission for each is on
            file. The full roster — hospitality, fintech, automotive, airlines, consumer, education, real estate and
            industry bodies — is on the{' '}
            <Link href="/#brands" className="link-underline">
              home page
            </Link>
            .
          </p>

          <Link href="/work" className="btn btn--ghost mt-8">
            See what we did for them <span aria-hidden="true" className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
