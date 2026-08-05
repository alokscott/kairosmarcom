# 3D art direction, scene map and motion system

## Principle

**Two canvas layers, and the text sits between them.** That is the whole trick. The
far scene renders behind the document; a second, deliberately cheap layer of near
motes renders in front of it at `z-index: 30`. Headlines therefore have material
both behind *and* ahead of them, which is what the eye reads as being inside a
space rather than looking at a picture of one — while every word stays real,
selectable, indexable DOM.

Interleaving depth around HTML cannot be done inside one canvas: z-order between
WebGL and the document is decided by the document, not the depth buffer. Hence two
contexts, the near one kept to a single points geometry with no lights.

One object, thirteen instructions. Every scene in the site is a re-parameterisation of
seven shared primitives, not a new environment. This is what keeps the bundle small,
the art direction coherent, and the meaning legible — the visitor sees the same
material behaving differently, which is the argument the copy is making.

**Nothing readable is ever inside the canvas.** The canvas is `aria-hidden`, carries
no text, sits at `z-index: -10`, and never receives pointer events.

## The primitives (`components/three/primitives.tsx`)

| Primitive | Meaning | Technique |
|---|---|---|
| `ShardField` | Scattered ideas aligning | Instanced tetrahedra; convergence lerped in the **vertex shader** via an instanced offset attribute, not by recomposing matrices in JS |
| `Core` | The decisive moment | Icosahedron; real transmission on high tier, emissive standard below. Leans toward the pointer, never chases it |
| `NodeCluster` | Independent parties | Emissive icosahedra, focus scales one and dims the rest |
| `Threads` | Connection | `LineSegments`, hub or chained |
| `FrameStack` | Surfaces, timelines, optical stacks | Wireframe planes stacked in z |
| `Ripple` | Cause, influence spreading | Expanding tori with fading opacity |
| `Lattice` | Logic, frameworks, protected grids | Ordered line grid |
| `Streams` | Directional media converging | Oriented boxes travelling inward |

Layouts come from a seeded PRNG (`mulberry32`), never `Math.random`, so a scene is
identical on every visit and across re-renders.

## Scene map (`components/three/presets.tsx`)

| Preset | Content it serves | Composition |
|---|---|---|
| `core` | Hero, About | ShardField (scroll-driven) + Core growing |
| `principle` | Four principles | Per stage: Nodes+Threads / Lattice+ShardField / Core / Ripple+Core |
| `constellation` | Services | Core + 6 Nodes + Threads, focus follows selection |
| `case-automotive` | BMW, Audi | Streams as light trails + tilted FrameStack as contours |
| `case-optics` | DJI, Insta360 | Core + 9-deep FrameStack as a lens + ring of shards |
| `case-education` | Global Opportunities, ThriveDx | Chained Nodes as pathways + small Core as portal |
| `case-security` | ThinkCyber | Dense Lattice + Nodes + chained Threads |
| `case-platform` | Ageless Digital | Layered FrameStack as data layers + operational Nodes |
| `case-ev` | BYD | Ripple + Core + converging Streams |
| `metrics` | Work index | Sparse Lattice + lattice-form ShardField |
| `film` | Film rail, Films page | Deep FrameStack, scroll-driven + drifting Streams |
| `process` | Kairo5Think | ShardField changing convergence **and** target form per stage |
| `contact` | Closing CTA | The hero in reverse — everything converges |

## How the DOM drives it

`<Scene preset accent>` is a measurement anchor that renders nothing visible. One rAF
loop serves every registered scene: it finds the most-visible section, writes its
scroll progress, and picks the nearest stage marker. Per-section scroll listeners would
multiply work by the number of sections for information one pass already has.

State is deliberately split:

- **`sceneMotion`** — a plain mutable object for scroll progress, pointer and tilt.
  Read inside `useFrame`. Routing 60fps values through React state would re-render the
  tree sixty times a second for no benefit.
- **The subscribable store** — preset, accent, intensity, focus, active. Low-frequency,
  so it goes through React and is allowed to swap which primitives are mounted.

Anything scroll-driven is passed to a primitive as a **getter**, not a number. A
captured number would freeze at render time.

## Performance governance

| Tier | Shards | Core detail | DPR cap | Transmission |
|---|---|---|---|---|
| low | 90 | 1 | 1.0 | no |
| medium | 220 | 2 | 1.5 | no |
| high | 420 | 4 | 2.0 | yes |

- Tier is chosen by **capability, not screen width**: WebGL2 support, core count,
  device memory, pointer type, save-data. Touch devices drop one tier because sustained
  load matters more than peak there.
- A rolling frame-rate governor demotes once, after a sustained shortfall over ~90
  frames — never on a single slow frame, and it never promotes back (oscillation reads
  worse than settling low).
- `frameloop` switches to `never` in a background tab.
- The canvas mounts on `requestIdleCallback` — text and CTAs are interactive first.
- No WebGL → a CSS radial-gradient poster in the section accent. Nothing else changes.

### Failure handling — two layers, because one is not enough

`canCreateWebGL()` is the fast path. R3F builds its renderer asynchronously, so a
context failure surfaces as an **unhandled promise rejection that no React error
boundary can catch**; checking first is what stops that from being reached.

`CanvasBoundary` covers what a check cannot predict: a context that dies *after* a
successful start (GPU reset, graphics switch, exhausted context pool).

The probe deliberately does **not** call `loseContext()`. An earlier version did, to
be tidy about the context budget, and that made the *next* creation fail — so the
probe reported "supported" and the real canvas then threw. Verified in a headless
run with the GPU disabled: 0 uncaught errors, full page text, poster shown.

## Pinned scroll stages

Three sections pin: the hero (280vh), the four principles (420vh) and the process
(420vh). The panel sticks while the page scrolls past, and that scroll drives the
scene.

This is `position: sticky`, **not** scroll-jacking. Wheel, trackpad, spacebar,
scrollbar and keyboard all move the page at exactly their normal rate; nothing
intercepts the event. What pinning buys is the room for a scrubbed transformation
without the visitor losing their place.

- Stage index and scroll scrub are re-normalised to the **pin window** —
  `[vh/(vh+H), H/(vh+H)]` — because the section enters and leaves the viewport
  outside that range, and scrubbing across those parts would spend most of the
  animation off-screen.
- Inside a sticky panel every stage marker shares one scroll position, so staged
  sections set `stages={n}` on `<Scene>` and derive the index from progress instead
  of from element positions.
- Inactive stage cards are `inert` and `aria-hidden`, not merely faded — otherwise a
  screen reader is read four competing paragraphs at once and the tab order runs
  through invisible content.
- `@media (prefers-reduced-motion: reduce)` sets `.stage { height: auto }` and
  `.stage__pin { position: static }`, so the whole mechanism dissolves into ordinary
  stacked sections. Same on viewports under 34rem tall, where a 420vh pin is just a
  long wait.

## Contrast over a moving scene

Copy sitting on a live scene cannot assume its background. Two surfaces:

| Class | Use | Guarantee |
|---|---|---|
| `.scrim` | Oversized display type | Soft radial lift; the type is large enough for the 3:1 bar |
| `.panel` | All body copy | 88% background + blur → ~11:1 against bone even with the fully lit core directly behind |

The camera dolly is capped at 5.8 units for the same reason: pushed closer, the core
becomes a full-bleed field and bone measures **2.95:1** on it — below AA for text and
below even the large-text bar. This was caught by screenshotting a scrolled page, not
by reading the code.

`.panel` deliberately declares no `position`. An earlier version set `relative`,
which beat Tailwind's `absolute` utility and silently un-stacked every cross-fading
stage card into a vertical column.

## Motion system

| Class | Duration | Easing |
|---|---|---|
| Micro-interactions (hover, focus, button) | 180ms | `cubic-bezier(.16,1,.3,1)` |
| Component transitions (accordion, panel, filter) | 380ms | same |
| Section reveals | 720ms, 90ms stagger per line | same |
| Page transitions | 640ms | `cubic-bezier(.76,0,.24,1)` |
| Chart bars | 900ms, on entering view | out-expo |
| Counters | 1100ms, once | out-expo |

**Techniques used:** pinned scroll stages with scrubbed 3D · kinetic headlines that
rotate in from the horizon per line and breathe Archivo's variable `wdth`/`wght` axes
on scroll · a stacked-card deck for the nine case studies, receding via pure CSS
`animation-timeline: view()` with no JavaScript at all · a pinned horizontal film
track · perspective pointer tilt on cards · magnetic CTAs · scroll-linked camera dolly
and roll · animated underlines, sliding arrows, accent rules drawing on hover ·
view-transition names shared between a case card and its detail H1 · counters that
only run when visible.

The variable-axis range is deliberately narrow (`wdth` 86→104). A wider sweep looks
better in isolation but changes advance widths enough to re-wrap the headline
mid-scroll, which breaks the authored line breaks and shifts everything below it.

Headline reveals split by **line**, never by character: a per-character split
fragments the accessible name and is read out letter by letter.

**Deliberately not used:** scroll hijacking, intro animations, constantly rotating
text, motion on every object, low-contrast glassmorphism, heavy blur over text,
anything that delays access to content.

## Reduced motion

`prefers-reduced-motion: reduce` does all of the following:

- Global animation and transition durations collapse to ~0.
- Scene `intensity` is set to `0` — all ambient rotation, drift, ripple and orbit stop.
  The scene holds its composed state rather than disappearing.
- The client marquee stops and resets to its start position.
- Counters render their final value immediately.
- Chart bars draw at full width without animating.
- `Reveal` and `RevealLines` render content in place with no transform.
- Magnetic CTAs do not attach their pointer listener at all.
- `scroll-behavior` reverts to `auto`.

On coarse pointers, no custom cursor and no pointer-parallax listener is attached.
Device orientation is only read where the platform grants it without a permission
prompt.
