import type { Metadata } from 'next'
import FilmArchive from '@/components/films/FilmArchive'
import { Reveal } from '@/components/motion/Reveal'
import { Scene } from '@/components/three/Scene'
import { films } from '@/content/films'
import { breadcrumbLd, graph, pageMeta, videoLd } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Films — twenty-one films, in-house',
  description:
    'Event coverage, ad films, brand videos, memoirs, CSR and public-interest films and 3D motion for BMW, Audi, DLF, CaratLane, Welspun, Skyways and more. Produced in-house by Kairos Marcom.',
  path: '/films',
})

export default function FilmsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph(
            ...films.map(videoLd),
            breadcrumbLd([
              { name: 'Home', path: '/' },
              { name: 'Films', path: '/films' },
            ])
          ),
        }}
      />

      <section className="relative overflow-hidden pt-40 pb-16" data-accent="violet">
        <Scene preset="film" accent="violet" />
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-4">Film &amp; motion</p>
            <h1 className="max-w-[13ch] text-[length:var(--text-display)]">Twenty-one films, in-house.</h1>
            <p className="muted mt-8 max-w-[58ch] text-[length:var(--text-lead)]">
              Event coverage, ad films, brand videos, memoirs, CSR and 3D motion, produced by the same team that writes
              the strategy.
            </p>
            <p className="faint mt-4 max-w-[58ch] text-sm">
              Films play from their original host. Nothing loads from YouTube until you press play, and captions appear
              where the upload provides them.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <h2 className="sr-only">Filter and browse the film archive</h2>
          <FilmArchive />
        </div>
      </section>
    </>
  )
}
