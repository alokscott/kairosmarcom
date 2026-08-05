# Content inventory, migration assumptions and redirect plan

Source audited **5 August 2026** from `kairosmarcom.com/new` and its nine
`case.php?s=` pages. `docs/migration-map.csv` is the machine-readable version of this
document — old URL, new URL, owner, migration status, asset status, redirect status.

---

## 1. What the source site actually contained

| Item | Found | Notes |
|---|---|---|
| Homepage | 1 | Single page, all sections as `#` anchors |
| Case studies | 9 | `case.php?s={slug}`, all reachable |
| Films | 21 | 19 with a playable link, 2 without |
| Legal pages | 0 | `/privacy` and `/terms` linked sitewide, both **404** |
| `sitemap.xml` | 0 | 404 |
| `robots.txt` | 0 | 404 |
| Project imagery | **0** | See §3 |
| Client testimonials | **0** | None published anywhere |
| Team profiles | **0** | No names, roles, bios or portraits |

### Assets that exist and were migrated

`logo.png`, `logo-wr.png` (reversed), `mark.png`, `og-cover.jpg` (1200×630), and five
client marks: `ageless-digital.png`, `audi.svg`, `bmw.svg`, `dji.svg`, `insta360.svg`.
All now under `public/`.

**Defect found on the live site:** the Open Graph image is referenced as
`https://kairosmarcom.com/assets/img/og-cover.jpg`, which 404s — the file is actually
at `/new/assets/img/og-cover.jpg`. Every share card on the current site is broken.
Fixed here via `app/opengraph-image.jpg`.

---

## 2. Migration rules applied

1. **Verbatim, or absent.** Every claim, figure, objective, challenge and strategy
   bullet is reproduced exactly as published. No sentence was "improved" into saying
   something the source did not say.
2. **Indian digit grouping preserved.** `8,83,626`, `5,86,554`, `4,74,754`, `₹2,000`
   are stored as published in a separate `display` field; the numeric `value` field
   exists only to size a bar.
3. **Provenance never upgraded.** Where the source says "as reported by the client",
   it still says that. Platform-dashboard figures and client-reported figures are
   labelled separately on every results module, because they are different kinds of
   evidence.
4. **Empty beats plausible.** Unstated fields are `null` and their module does not
   render. Nothing was inferred to fill a layout.
5. **Ranges stay ranges.** `45–50` was not averaged to `47`. `7–8` was not rounded.

### Judgement calls — flag if any is wrong

| Call | Why | Reversible by |
|---|---|---|
| "Technology" (a 7th service label used on case pages) maps to **Digital** | The new site has six disciplines; Digital is defined as "websites and product surfaces" | Editing `services` on the affected studies |
| "Videos" maps to **Video** | Naming only | Same |
| Ageless Digital has **no industry** | The source never stated one; guessing "SaaS" or "logistics" would be invention | Setting `industry` in the CMS |
| Films' `year` only where the **title** states it (2018, 2019, 2021) | Three films name their year; the other eighteen do not | Setting `year` per film |
| Homepage FAQ "What if we only need one thing…" retitled to **"Can we engage Kairos for only one service?"** | The brief specifies this wording; the answer is unchanged and verbatim | — |
| Services page **"Ways to engage"** | Restructured from the published objection and FAQ answers — the quarter-of-the-cost line, fixed scope and fee, the in-house-team model, the single-discipline model. No new commercial terms, no prices the source did not state | — |
| Process page **"What we need from you"** | Written from commitments the source already makes ("you approve this before anything gets designed", "a working session so your team can run it") | — |
| Contact page **"What happens next"** | Drawn from the published first-call description | — |

---

## 3. The asset problem — read this before launch

**There is no project imagery anywhere in the source material.** Not one campaign
image, social post, screenshot, storyboard, outdoor execution, device mockup or
behind-the-scenes frame exists for any of the nine studies.

The brief asks each case panel to carry "campaign artwork or project imagery" and each
case study to carry a media gallery. That content cannot be produced without the
client, and fabricating it is explicitly forbidden. So:

- The design carries its weight with type, the accent system and the 3D scene, and
  reads as finished rather than as a page missing its pictures.
- `heroImage` and `gallery` slots exist and render the moment approved assets land —
  no template change required.
- The client wall is **set in type, not logos**. Five marks exist as files but none
  carries written permission to republish. `siteSettings.clients[].logoApproved`
  switches each one to its mark individually.
- The About page has **no team section**. Rather than stock photography, which the
  brief forbids, the section appears when approved profiles exist.

**Required from the client before launch:**

1. Campaign artwork per case study, with usage rights confirmed.
2. Written permission per client mark — all ten named brands.
3. Any client testimonial, with an approval reference recorded against it.
4. Team names, roles, bios and art-directed portraits (no stock).
5. Engagement years for all nine studies.
6. ThriveDx: the provenance note for the 1,000+ leads / ₹45 CPL / 365-registration
   figures. It is the one study whose numbers have no published source.
7. Ageless Digital: the industry label.
8. Playable links for *BMW Golf Cup 2021* and *Mahindra Electric*.
9. Caption/transcript status for all 21 films.

Set `NEXT_PUBLIC_SHOW_CONTENT_FLAGS=true` on staging to see the per-study open items
in place.

---

## 4. Redirect plan

All legacy handling is in `proxy.ts` (logic in `lib/legacy-urls.ts`, covered by
`test/legacy-urls.test.mjs`). **Every legacy URL resolves in exactly one 308 hop to a
clean address with no query string.**

| Legacy URL | Destination | Hops |
|---|---|---|
| `/new/case.php?s={slug}` | `/work/{slug}` | 1 |
| `/case.php?s={slug}` | `/work/{slug}` | 1 |
| `/new/case.php` (no/unknown slug) | `/work` | 1 |
| `/new`, `/new/` | `/` | 1 |
| `/new/{path}` | `/{path}` | 1 |
| `/index.html`, `/index.php` | `/` | 1 |
| `/about.html` | `/about` | 1 |
| `/services.html` | `/services` | 1 |
| `/contact.html` | `/contact` | 1 |
| any `/{path}/` | `/{path}` | 1 |

Two things `next.config.ts` `redirects()` could not do, which is why this is the
proxy layer:

1. Config redirects **forward the original query string**, so `?s=dji-india` survived
   onto `/work/dji-india?s=dji-india` — a second crawlable URL for the same page.
2. Next's trailing-slash normalisation runs **before** config redirects, so `/new/`
   became `/new` and then `/` — a two-hop chain on what is currently the most-linked
   URL on the live site.

Both were caught by testing the built server, not by reading the config.

---

## 5. Editorial states

`draft` → `internal-review` → `client-approval-required` → `approved` → `published`
→ `archived`.

All nine studies currently sit at **`client-approval-required`**, because none has the
imagery, testimonial or year data a published state implies. `openItems` on each
record lists what is outstanding; the CSV totals them.
