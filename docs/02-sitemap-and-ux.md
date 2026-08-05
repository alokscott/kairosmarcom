# Sitemap, route map and page-by-page UX specification

## Sitemap

```
/                          Home
/work                      Case-study index (filter, search, grid/list)
  /work/ageless-digital
  /work/bmw-bavaria-motors
  /work/dji-india
  /work/insta360-india
  /work/global-opportunities
  /work/audi-gurugram
  /work/byd-kristan-auto
  /work/thinkcyber-india
  /work/thrivedx
/services                  Six disciplines in full
/process                   Kairo5Think expanded
/about                     Meaning, philosophy, principles, DNA, clients
/films                     Filterable archive, 21 films
/contact                   Conversion page
/privacy                   Template — legal sign-off required
/terms                     Template — legal sign-off required
/sitemap.xml               Generated from content
/robots.txt                Generated
/api/contact               POST only, noindex
```

Build output: 23 routes, 9 case studies prerendered, one dynamic endpoint.

## Route map

| Route | Render | Scene preset | Accent |
|---|---|---|---|
| `/` | Static | `core` → `principle` → `constellation` → `film` → `process` → `contact` | rotates per section |
| `/work` | Static | `metrics` | orange |
| `/work/[slug]` | SSG ×9 | per study (`case-automotive`, `case-optics`, `case-education`, `case-security`, `case-platform`, `case-ev`) | per study |
| `/services` | Static | `constellation` | violet, then per discipline |
| `/process` | Static | `process` | lime |
| `/about` | Static | `core` | orange → violet → lime → silver |
| `/films` | Static | `film` | violet |
| `/contact` | Static | `contact` | orange |
| `/privacy`, `/terms` | Static | none | silver |

---

## Page specifications

### `/` Home

1. **Hero** — full-viewport, bottom-aligned. Eyebrow, three-line masked headline
   ("Welcome to the / Hub of / Creativity"), body, two CTAs, one-business-day
   assurance, three counting proof stats. Scene: fragments converge into the core as
   the section scrolls. Primary CTA is magnetic on fine pointers only.
2. **Client wall** — marquee set in type. Pauses on hover, removed under reduced
   motion, duplicated copy is `aria-hidden` so it is announced once.
3. **Philosophy** — four principles as scroll stages. Each stage changes the section
   accent *and* the core's behaviour: connection → nodes and threads; logic → ordered
   lattice; magic → refracting core; cause → expanding ripple. Followed by the four
   DNA statements as an editorial manifesto, not cards.
4. **Services preview** — a radio group of six disciplines beside a live panel.
   Selecting one focuses its node in the constellation. Arrow keys work; the panel is
   `aria-live="polite"`.
5. **Selected work** — all nine studies as editorial panels in an irregular rhythm
   (wide / split / tall). Every panel carries client, industry, tags, one outcome
   number, and a "View case study" link. Impressions tracked once each.
6. **Film rail** — real horizontal overflow container. Tab, touch drag, shift-scroll
   all work. Click opens the modal; nothing is hover-dependent.
7. **Process** — four scroll stages; the shard field changes convergence *and* target
   form (sphere → tight core → lattice → ring) across Listen / Distil / Build / Hand over.
   Week numbers are literal text.
8. **Objections** — four native `<details>`, not one-at-a-time.
9. **FAQs** — six native `<details>`, FAQ structured data emitted.
10. **Contact** — the hero's convergence in reverse, plus the form.

### `/work` Case-study index

Cinematic intro over the `metrics` scene, a featured study (BMW — deepest results
module), then four filter facets (service, industry, type, platform), client search,
and a grid/list toggle. Filtering is over an array already on the page: instant, no
fetch, every card server-rendered and crawlable. Result count is announced politely.
Zero-result state explains how to recover rather than dead-ending.

### `/work/[slug]` Case study

- **Hero** — breadcrumb, industry · location eyebrow, client as H1 with a
  view-transition name shared with its card, client description, tags, duration, and
  up to three headline stats.
- **Sticky nav** — built from the sections that exist on *that* study, so no anchor
  ever points at nothing. Scroll progress is decorative; the highlighted item carries
  the same information.
- **Body** — Overview, Objective, Challenge, Insight, What we did, Delivered, Impact,
  The numbers, Gallery, Testimonial, Services. Absent modules are omitted from both
  the page and the nav.
- **Results** — charts are `<table>` elements styled as bars (see
  `docs/06-design-tokens.md`), with the provenance note directly beneath.
- **Close** — recap CTA, related work by industry/tag, previous/next.

Validated against the three structurally different studies the brief names:

| | Ageless Digital | BMW Bavaria | ThriveDx |
|---|---|---|---|
| Headline stats | none | 3 | 3 |
| Challenge | absent | 3 points | 2 points |
| Charts | none | 3 | none |
| Channels | none | 3 | 2 |
| Nav items | 6 | 9 | 7 |

All three render without a gap, an empty heading or a dead anchor.

### `/services`

Hero over the constellation, then one full section per discipline: what it solves,
deliverables, and the case studies that evidence it. Then "How the six connect" (the
four process steps), then "Ways to engage" (four models drawn from published copy),
then the CTA.

### `/process`

Hero, the four stages with the evolving object, "What we need from you" (five client
responsibilities), what happens after handover, then objections and FAQs.

### `/about`

Meaning of Kairos, creative philosophy, the four principles, DNA, the senior-led
operating model, founding year and location, clients in type. **No team section** —
see `docs/09-content-migration.md`.

### `/films`

Filter by category, client and year over all 21 films. Two films without a playable
link stay in the archive and open a modal that says so. Nothing loads from YouTube
until play is pressed.

### `/contact`

Headline, three promises, four contact channels with hours, the form, "What happens
next" in three steps, and the FAQs.
