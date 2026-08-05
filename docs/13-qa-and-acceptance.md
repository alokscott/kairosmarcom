# Implementation phases, QA checklist and acceptance criteria

## Phase status

| Phase | Status |
|---|---|
| 1 — Discovery and content | **Done.** Source audited 2026-08-05, nine studies and 21 films migrated verbatim, migration and redirect map produced (`docs/09-content-migration.md`, `migration-map.csv`) |
| 2 — UX and creative direction | **Done.** Sitemap, route map and page specs in `docs/02-sitemap-and-ux.md`; Kairos Core, the service constellation and the case-hero transition are all built rather than prototyped |
| 3 — Design system and templates | **Done.** Tokens, type, grid and motion primitives shipped; case template validated against Ageless Digital, BMW Bavaria and ThriveDx |
| 4 — Development and CMS | **Done.** All routes built, CMS schema authored, forms/analytics/metadata/structured data/redirects connected |
| 5 — QA and launch | **Partial.** Automated and server-level checks pass; the items in §3 need real hardware and client sign-off |

## 1. Acceptance criteria — verified

| Criterion | Evidence |
|---|---|
| Every route implemented and linked | 23 routes build; all reachable from header, footer or in-page links |
| Nine case studies with dedicated pages | All 9 prerendered as SSG, populated from migrated content |
| Every card links to the correct study, back/forward works | Real `<Link>` anchors, no interception; verified 200 on all nine |
| Legacy URLs redirect without chains | All legacy shapes resolve in **1 hop** to a clean URL, query string dropped — verified against the built server; `test/legacy-urls.test.mjs` asserts no output ever redirects again |
| Core content usable with WebGL disabled | Case study renders 5,156 characters of body text with all `<script>` stripped; every figure, source note, CTA and nav item present; `<canvas>` count in server HTML is 0 |
| No essential text inside canvas | Canvas is `aria-hidden`, contains no text nodes |
| No page blocked behind a preloader | No loading screen exists; canvas mounts on `requestIdleCallback` after content is interactive |
| Charts have title, units, takeaway, source, accessible equivalent | The chart *is* a `<table>`; 3 tables rendered on the BMW study |
| No misleading truncated axes | Bars always scale from zero; the API cannot express an axis minimum |
| Server-side validation, spam-protected | Honeypot, minimum fill time, budget allowlist, length clamping, control-character stripping — 12 assertions in `test/enquiry.test.mjs` |
| Success events only after server confirmation | Endpoint returns 503 with no transport configured; client fires no success event |
| Analytics without duplicate events | `trackOnce` keys on event + params |
| Unique metadata per page | Verified; duplicate title suffix found and fixed |
| Sitemap, robots, canonicals, structured data | All generated; none existed on the source site |
| Contrast meets AA | 14 assertions in `test/contrast.test.mjs`, run against the stylesheet |

### Defects found by driving the real page

The motion overhaul was verified by scrolling a real browser over the DevTools
Protocol and measuring the DOM, not by reading the code. That found seven bugs a
build and a typecheck both passed:

1. **A WebGL probe that broke WebGL.** `hasWebGL()` created a context and called
   `loseContext()`; that made the next creation fail, so the probe said "supported"
   and the canvas then threw an uncaught error. Replaced with a non-destructive
   check plus an error boundary.
2. **`.panel { position: relative }` beat Tailwind's `absolute`**, un-stacking every
   cross-fading stage card into a vertical column.
3. **`inert={false}` still emitted the attribute**, making the *visible* stage card
   inert and leaving a hidden one focusable — the exact inverse of the intent.
4. **The camera dolly put body copy on the lit core at 2.95:1**, below AA and below
   even the 3:1 large-text bar.
5. **A fixed header occluded the top of every pinned panel** — content centred in the
   full viewport starts underneath the nav.
6. **Stacked cards were semi-transparent**, so two client names overlapped as a
   double exposure.
7. **The scene colour lagged the DOM accent** on staged sections: the accent changes
   on a render, not a scroll, so the scene kept the previous colour until the visitor
   moved again.

**Test suite: 33 assertions, all passing.** Three further defects were caught by these
tests rather than by review:

1. Ink on violet as a button fill is 3.36:1 — failed AA. Fixed with `--on-accent`.
2. `Number('abc')` is `NaN` and `NaN < 2500` is `false`, so a bot sending a
   non-numeric `elapsed` walked straight past the anti-spam timing gate.
3. `redirects()` in `next.config.ts` forwarded `?s=` onto the clean URL and turned
   `/new/` into a two-hop chain. Both fixed by moving to the proxy layer.

## 2. QA performed

- All 23 routes return 200; unknown route returns 404 with the nine studies listed.
- All ten legacy URL shapes → single-hop 308 to the correct clean address.
- `/api/contact`: valid → 503 (no transport configured, correct); honeypot → 200 with
  nothing sent; too-fast → 400; `elapsed=abc` → 400; bad email → 422 with field errors;
  rate limiter allows 5 per IP per 10 minutes, blocks the 6th, other IPs unaffected.
- Server-rendered HTML contains every published figure, provenance note, objective,
  challenge and strategy bullet verbatim.
- `tsc --noEmit` clean; production build clean.
- Scrolled-page verification over CDP at eight positions across the 19,981px page:
  **0 runtime exceptions**, every pinned stage resolving to the correct index.
- WebGL disabled: 0 uncaught errors, 0 THREE errors, 12,361 characters of page text.
- Reduced motion emulated: `.stage` height auto, pin `static`, marquee and kinetic
  axis off, stack recede off, foreground layer never mounted, all text present.

## 3. Outstanding before launch

**Blocking on the client**

- [ ] Campaign artwork per case study, with usage rights
- [ ] Written permission for each of the ten client marks
- [ ] Testimonials, with approval references
- [ ] Team names, roles, bios and art-directed portraits (no stock)
- [ ] Engagement years for all nine studies
- [ ] ThriveDx provenance note — the only study whose figures have no published source
- [ ] Ageless Digital industry label
- [ ] Playable links for *BMW Golf Cup 2021* and *Mahindra Electric*
- [ ] Caption/transcript status for all 21 films

**Blocking on legal**

- [ ] Privacy policy: retention period, applicable regime (India DPDP 2023 and/or
      UK/EU GDPR), grievance officer, registered entity and address
- [ ] Terms: governing law, liability limitation, warranty disclaimer
- [ ] Whether a consent layer is required for Google Fonts in the EU/UK

**Blocking on configuration**

- [ ] `RESEND_API_KEY` + `CONTACT_TO`, or `CONTACT_WEBHOOK_URL`. **Until one is set,
      every enquiry returns 503.** This is deliberate — the form shows the direct
      email and WhatsApp fallback rather than reporting a false success.
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production origin
- [ ] `NEXT_PUBLIC_SHOW_CONTENT_FLAGS` unset or `false` in production
- [ ] Analytics destination chosen and wired to `window.dataLayer`

**Requires real devices and manual testing**

- [ ] Lighthouse 90+ across performance, accessibility, SEO and best practices, on
      throttled 4G and mid-range Android
- [ ] Screen-reader pass: VoiceOver/Safari and NVDA/Firefox
- [ ] Keyboard-only pass of every route, filter, accordion, modal and the form
- [ ] Mobile pass on a real mid-range Android: no hover dependency, scene holds frame
      rate or demotes cleanly
- [ ] WebGL-disabled pass in every browser
- [ ] Redirect and metadata crawl of the deployed site
- [ ] End-to-end enquiry delivery test once a transport is configured

## 4. Rollback

The site is static apart from one endpoint, so rollback is a redeploy of the previous
build. The only stateful risk is enquiry delivery: verify one end-to-end submission
reaches the inbox immediately after cutover, before DNS propagation completes, and keep
the legacy `/new/` deployment reachable at an internal hostname for one week so the
migrated copy can be diffed against source if anything is disputed.
