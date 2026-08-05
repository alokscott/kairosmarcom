# Technical architecture, performance, analytics, accessibility and SEO

## Stack

| Layer | Choice | Note |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server-rendered core content |
| Language | TypeScript, `strict` | |
| 3D | Three.js + React Three Fiber | One canvas for the whole site |
| Styling | Tailwind v4 `@theme` + custom properties | Tokens are first-class; no config file |
| Motion | CSS transitions, `IntersectionObserver`, view transitions | |
| Content | Typed modules in `content/` | Ships today with no CMS credentials |
| CMS | `cms/sanity.schema.ts` | Same shape; swap loaders to GROQ |
| Tests | `node --test` | No framework |

### Dependencies deliberately not added

**GSAP / ScrollTrigger** — the brief permits "GSAP ScrollTrigger *or* Motion". What
this site actually needs is enter-once reveals, scroll progress and stage detection.
`IntersectionObserver` plus one shared rAF loop covers all three.

**Lenis** — the brief allows it "only if accessible native behaviour is preserved".
Native `scroll-behavior: smooth` preserves it by definition, and honours
`prefers-reduced-motion` without configuration.

**A charting library** — the charts are labelled comparisons. A `<table>` styled as
bars is smaller, accessible by construction, and cannot drift from its data table
because it *is* the data table.

**Zod / a form library** — the validator is ~40 lines, dependency-free, and therefore
directly testable.

**An email SDK** — Resend is one authenticated `fetch`. A dependency that wraps one
call is a dependency to patch for no gain.

Net runtime dependency count: **7**.

## Rendering

- Every route is static or SSG except `POST /api/contact`.
- All nine case studies prerender at build (`generateStaticParams`, `dynamicParams: false`).
- The canvas is `ssr: false` behind a client boundary and mounts on idle.
- No page is gated behind a preloader or a percentage screen.

## Performance budget

| Metric | Budget | How it is held |
|---|---|---|
| LCP | ≤ 2.0s (4G, mid-range Android) | LCP is server-rendered text; fonts `display: swap`; no hero image request |
| CLS | ≤ 0.02 | Fixed canvas is out of flow; all images carry width/height; header padding animates, not layout |
| INP | ≤ 150ms | Scroll work is one rAF loop; per-frame values bypass React |
| Main-thread block before interactive | 0ms from WebGL | Canvas waits for `requestIdleCallback` |
| Total JS (first load) | ≤ 200KB gzip excluding three.js | Three.js is in the idle-loaded chunk, not the entry |
| Font files | 3 families, `swap`, subset latin | Archivo variable replaces two static weights |
| Image requests on first paint | 1 (logo) | No project imagery exists yet |

**Not yet measured on real hardware.** Lighthouse and a mid-range Android pass are
Phase 5 work — see `docs/13-qa-and-acceptance.md`. The budget is agreed here, before
the build is tuned to it, which is the order the brief asks for.

### 3D-specific controls

Device-pixel-ratio cap per tier · geometry and shader complexity per tier · frame-rate
governor that demotes once · `frameloop: 'never'` in background tabs · manual disposal
of every manually created `BufferGeometry` · no external model or texture files at all,
so there is nothing to Draco- or KTX2-compress and nothing to lazy-load per route.

---

## Analytics

Taxonomy is `EVENTS` in `lib/analytics.ts` — the map *is* the documentation, and an
event not in it cannot be fired.

| Group | Events |
|---|---|
| Conversion | `hero_cta_primary`, `hero_cta_secondary`, `contact_form_start`, `contact_form_invalid`, `contact_form_success`, `contact_email_click`, `contact_phone_click`, `contact_whatsapp_click` |
| Navigation | `nav_route_select`, `nav_menu_open`, `theme_change` |
| Work | `case_impression`, `case_open`, `case_filter`, `case_search`, `case_depth`, `case_next_prev`, `service_detail_open` |
| Film | `video_start`, `video_progress`, `video_complete` |
| Health | `reduced_motion_active`, `static_fallback_shown`, `webgl_unavailable` |

- **Primary conversion:** `contact_form_success`. It fires **only** after the server
  confirms a transport accepted the enquiry. If delivery fails the endpoint returns
  503 and no success event is emitted — a false conversion is worse than a lost one.
- **Assisted conversions:** the three contact-channel clicks, plus `case_depth` at 75+.
- **Deduplication:** `trackOnce` keys on event + params, so impressions and depth
  milestones fire once per session.
- **Privacy:** no vendor script is bundled. Events push to `window.dataLayer` if a tag
  manager exists, else dispatch a DOM `CustomEvent`. No identifiers, no device
  fingerprint, and never the free text a visitor typed.

---

## Accessibility (WCAG 2.2 AA)

- Semantic landmarks throughout; one `<h1>` per page; no heading levels skipped.
- Skip link, visible 3px focus ring in the section accent, never removed.
- Every interactive component is keyboard-operable: nav, mobile menu, filters, search,
  view toggle, service radio group, accordions, film tiles, video modal, form.
- `<dialog>` supplies focus trapping, Esc and background inertness for the menu and
  the video modal.
- Filter and search results announce via `aria-live="polite"` with a count.
- Form: real `<label>`s, `aria-describedby` for hint and error, `aria-invalid`, focus
  moved to the first invalid field, one `role="alert"` region for submission status.
- Charts are real tables with `<caption>`, `<th scope>` and stated units — there is no
  separate "accessible version" to fall out of sync.
- The canvas is `aria-hidden` and contains no text.
- Reduced motion removes all ambient and scroll-linked movement (see
  `docs/04-3d-and-motion.md`).
- Contrast is enforced by an automated test, not by review.
- Headline reveals split by **line**, never by character.

**Still required:** manual screen-reader passes (VoiceOver/Safari, NVDA/Firefox), a
keyboard-only pass of every route, and caption/transcript status for all 21 films.

---

## SEO

- Unique `<title>` and meta description on every route, including all nine studies.
  The layout owns the `| Kairos Marcom` suffix — case titles must not repeat it.
- Canonical URL on every page.
- Structured data: `ProfessionalService` (site-wide), `FAQPage`, `Service` ×6,
  `CreativeWork` per case study, `BreadcrumbList`, `VideoObject` per film.
  Case studies are `CreativeWork`, **not** `Product` or `Review` — marking a
  client-reported figure as an aggregate rating would misrepresent the evidence.
- Open Graph and Twitter cards on every route; `app/opengraph-image.jpg` fixes the
  broken share image on the current live site.
- `sitemap.xml` and `robots.txt` generated from content; neither existed before.
- Internal linking: services ↔ case studies ↔ industries, plus related work and
  previous/next on every study.
- Legacy URLs: single-hop 308s with the query string dropped — see
  `docs/09-content-migration.md`.
