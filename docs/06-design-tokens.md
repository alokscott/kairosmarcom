# Design tokens, typography and component inventory

All tokens live in `app/globals.css`. Contrast is asserted by
`test/contrast.test.mjs`, which runs against the stylesheet itself — editing a hex
without checking will fail the suite.

## Colour

The brief's palette, unchanged:

| Token | Value |
|---|---|
| `--color-ink` | `#080808` |
| `--color-bone` | `#F4F1E9` |
| `--color-orange` | `#FF4B23` |
| `--color-lime` | `#C8FF3D` |
| `--color-violet` | `#5C3BFF` |
| `--color-silver` | `#B7B8B5` |

### Why each accent has three tokens

Two of the brand colours are **not legible as body text** on one of the two
backgrounds:

- `#C8FF3D` on bone → **1.03:1**
- `#5C3BFF` on near-black → **3.28:1**

And one is not legible *under* ink when used as a fill:

- ink on `#5C3BFF` → **3.36:1** (caught by the test, not by eye)

So every accent resolves three ways:

| Token | Used for | Bar |
|---|---|---|
| `--accent` | Shapes, rules, 3D lighting, display type ≥32px/700 | 3:1 (WCAG 1.4.11) |
| `--accent-text` | Body-size text in the current theme | 4.5:1 |
| `--on-accent` | Foreground when `--accent` is a fill | 4.5:1 |

Resolved values:

| Accent | dark `--accent-text` | light `--accent-text` | `--on-accent` |
|---|---|---|---|
| orange | `#FF4B23` (5.9:1) | `#C4340F` (4.9:1) | ink |
| lime | `#C8FF3D` (16.8:1) | `#4A6300` (5.9:1) | ink |
| violet | `#A48CFF` (7.3:1) | `#5C3BFF` (5.3:1) | **bone** |
| silver | `#B7B8B5` (9.6:1) | `#5F615C` (5.6:1) | ink |

**One accent per section.** A section declares `data-accent="orange|lime|violet|silver"`
and every descendant resolves from it. No page shows all five accents at once.

## Themes

Dark is the default (cinematic). Light is a full peer, not an afterthought. Three
states: dark, light, system — because "follow the OS" is a real preference and a
two-way switch discards it. Applied by a synchronous inline script before first paint,
so there is no flash.

## Typography

| Role | Family | Why |
|---|---|---|
| Display | **Archivo** (variable, `wght` + `wdth`) | Carries a width axis, so headlines compress and expand without a second file. Already the brand's face — continuity is free |
| Body | **Space Grotesk** | Already in use, highly readable at small sizes |
| Editorial | **Instrument Serif** (400, italic) | Restrained serif for statements and pull quotes only |

Fluid scale, all `clamp()`:

```
--text-mega     3.5rem  → 13rem
--text-display  2.75rem → 7.5rem
--text-h1       2.25rem → 4.75rem
--text-h2       1.75rem → 3rem
--text-h3       1.25rem → 1.75rem
--text-lead     1.0625rem → 1.375rem
--text-body     1rem    → 1.0625rem
```

Display type sets at `line-height: .92`, `letter-spacing: -.03em`, `text-wrap: balance`.
Body copy uses `text-wrap: pretty` and caps at ~64ch.

## Grid and spacing

12 columns from `48rem` up, 4 below. Gutter `clamp(1rem, 2.5vw, 2rem)`. Editorial
container `78rem`; wide container `110rem`. Section rhythm
`clamp(4.5rem, 11vh, 9rem)`.

## Motion tokens

```
--dur-micro      180ms
--dur-component  380ms
--dur-reveal     720ms
--dur-page       640ms
--ease-out-expo      cubic-bezier(.16, 1, .3, 1)
--ease-in-out-quart  cubic-bezier(.76, 0, .24, 1)
--ease-out-back      cubic-bezier(.34, 1.4, .64, 1)
```

## Texture

Grain is procedural — an inline `feTurbulence` data URI at 5.5% (dark) / 3.5% (light).
No image request, no third-party asset.

---

## Component inventory

### Platform primitives used instead of libraries

| Need | Used | Instead of |
|---|---|---|
| Accordion (objections, FAQs) | `<details>`/`<summary>` | ~40 lines of ARIA disclosure that still loses find-in-page |
| Video modal, lightbox, mobile menu | `<dialog>` | A focus-trap dependency |
| Case-study section nav | Same-page `<a href="#…">` | A JS router |
| Results charts | `<table>` styled as bars | A charting library **and** a duplicate data table |
| Film rail | `overflow-x: auto` | A carousel library |
| Scroll reveals | `IntersectionObserver` + CSS `animation-timeline` where supported | GSAP ScrollTrigger |
| Smooth scroll | Native `scroll-behavior` | Lenis |

### Site

`Header` (sticky, shrinks on scroll, `<dialog>` mobile menu, theme control) ·
`Footer` · `ThemeToggle` · `ContactLink` (email/phone/WhatsApp with its analytics
event attached in one place) · `Accordion` · `LegalPage`

### Motion

`Reveal` · `RevealLines` (line-array, never per-character — a character-split headline
is read out letter by letter by screen readers) · `Counter` · `Magnetic` ·
`DepthTracker` · `MotionPreferenceProbe`

### Work

`CaseCard` (three layouts, one content structure) · `WorkFilters` · `CaseNav` ·
`MetricChart` · `EditorialFlags`

### Films

`FilmRail` · `FilmArchive` · `FilmTile` · `VideoDialog`

### Contact

`ContactSection` · `ContactForm`

### 3D

`SceneMount` → `SceneRoot` (the single canvas) · `Scene` / `useStage` (DOM binding) ·
`presets` · `primitives` · `quality` · `store`
