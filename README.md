# Kairos Marcom

A cinematic, 3D-first rebuild of kairosmarcom.com — nine indexable case studies, a
21-film archive, six service pages and a conversion-focused contact flow, built so that
none of it depends on WebGL to be readable.

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run build      # 23 routes, 9 case studies prerendered
npm test           # 33 assertions
npm run typecheck
```

## Structure

```
app/                 Routes. Everything static or SSG except POST /api/contact
components/
  three/             The single canvas: store, primitives, presets, quality tiers
  motion/            Reveal, RevealLines, Counter, Magnetic, DepthTracker
  work/  films/  home/  contact/  site/
content/             Typed content modules — the current source of truth
cms/                 Sanity schema for the same shape
lib/                 analytics, seo, enquiry validation, legacy URLs
proxy.ts             Legacy URL handling, single-hop
docs/                Deliverables — start with docs/00-creative-thesis.md
test/                node:test, no framework
```

## Read first

| Document | What is in it |
|---|---|
| [`docs/00-creative-thesis.md`](docs/00-creative-thesis.md) | The idea and why the site is shaped this way |
| [`docs/09-content-migration.md`](docs/09-content-migration.md) | **Content inventory, what is missing, redirect plan.** Read before publishing anything |
| [`docs/02-sitemap-and-ux.md`](docs/02-sitemap-and-ux.md) | Sitemap, route map, page-by-page UX |
| [`docs/04-3d-and-motion.md`](docs/04-3d-and-motion.md) | Scene map, primitives, quality tiers, motion spec |
| [`docs/06-design-tokens.md`](docs/06-design-tokens.md) | Tokens, type, component inventory |
| [`docs/08-architecture-analytics-a11y-seo.md`](docs/08-architecture-analytics-a11y-seo.md) | Stack, performance budget, analytics, accessibility, SEO |
| [`docs/13-qa-and-acceptance.md`](docs/13-qa-and-acceptance.md) | What is verified, what is outstanding |
| [`docs/migration-map.csv`](docs/migration-map.csv) | Old URL → new URL → owner → status |

## Two things that will bite you

**The contact form returns 503 until a transport is configured.** Set
`RESEND_API_KEY` + `CONTACT_TO`, or `CONTACT_WEBHOOK_URL`. This is deliberate: the
endpoint reports success only when a transport confirms delivery, so an unconfigured
deploy shows visitors the direct email and WhatsApp fallback instead of silently
swallowing enquiries.

**There is no project imagery.** The source site had none — no campaign artwork, no
galleries, no team photos. The design carries itself on type, colour and the 3D layer,
and every image slot fills in the moment approved assets arrive. Nothing was
fabricated to fill a gap. `docs/09-content-migration.md` lists exactly what is needed.

## Content integrity

Every figure on the site is reproduced as published, including Indian digit grouping
(`8,83,626`), ranges (`45–50`), and the distinction between platform-reported and
client-reported data. `NEXT_PUBLIC_SHOW_CONTENT_FLAGS=true` on staging surfaces the
open items on each case study and the legal-review items on `/privacy` and `/terms`.
It must be unset in production.
