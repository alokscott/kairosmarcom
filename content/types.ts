/**
 * Content model for Kairos Marcom.
 *
 * These types are the contract the CMS (see /cms/sanity.schema.ts) implements.
 * Every field that the live source site did not provide is `null` or `[]` — the
 * templates hide the corresponding module rather than inventing a value.
 */

/** CMS editorial workflow states (spec §16). */
export type ContentState =
  | 'draft'
  | 'internal-review'
  | 'client-approval-required'
  | 'approved'
  | 'published'
  | 'archived'

/** The six disciplines. Used for service tags and filtering. */
export type ServiceId = 'creative-design' | 'branding' | 'digital' | 'public-relations' | 'technology' | 'video'

/** 3D scene presets. One shared scene manager renders these (spec §17). */
export type ScenePreset =
  | 'core'
  | 'principle'
  | 'constellation'
  | 'case-automotive'
  | 'case-optics'
  | 'case-education'
  | 'case-security'
  | 'case-platform'
  | 'case-ev'
  | 'metrics'
  | 'film'
  | 'process'
  | 'contact'

export type Accent = 'orange' | 'lime' | 'violet' | 'silver'

/**
 * One measured comparison.
 *
 * `value` drives bar length only; `display` is the verbatim figure as published
 * (Indian digit grouping preserved). Bars always start at zero — there is no
 * axis-truncation option by design.
 */
export interface MetricPoint {
  label: string
  /** Numeric magnitude for the bar. For a range like "45–50" this is the upper bound. */
  value: number
  /** Verbatim published figure, e.g. "8,83,626", "45–50", "₹2,000", "194.1K". */
  display: string
}

export interface MetricChart {
  id: string
  title: string
  /** Written takeaway shown with the chart. Required — a chart without one is not shippable. */
  takeaway: string
  /** What the numbers count, e.g. "accounts reached". Announced to screen readers. */
  unit: string
  kind: 'before-after' | 'category' | 'period'
  /** True when a smaller number is the better outcome (cost per lead). */
  lowerIsBetter?: boolean
  points: MetricPoint[]
}

export interface GalleryItem {
  src: string
  alt: string
  caption: string | null
  credit: string | null
  width: number
  height: number
}

export interface CaseVideo {
  /** YouTube watch URL or ID. */
  youtubeId: string
  title: string
  client: string | null
  category: string
  /** Captions confirmed present on the hosted video. */
  hasCaptions: boolean
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
}

export interface CaseStudy {
  slug: string
  client: string
  projectTitle: string
  /** Null where the source site never stated one. Do not guess. */
  industry: string | null
  location: string | null
  year: string | null
  duration: string | null
  /** One-line outcome used on cards and in the index. */
  summary: string
  /** Who the client is, in their own framing. */
  clientDescription: string
  /** Short tags shown on cards (source site's own tag set). */
  tags: string[]
  /** Which of the six disciplines ran on the account. */
  services: ServiceId[]
  channels: { platform: string; handle: string }[]
  /** Big figures in the case hero. */
  headline: { value: string; label: string }[]
  objective: string[]
  challenge: string[]
  /** Research/insight. Absent on every migrated study — module hides until supplied. */
  insight: string | null
  strategy: string[]
  /** Concrete artefacts handed over. Absent on migrated studies. */
  deliverables: string[]
  results: string[]
  charts: MetricChart[]
  /** Provenance note rendered directly beneath the results. */
  metricSource: string | null
  scene: ScenePreset
  accent: Accent
  heroImage: GalleryItem | null
  gallery: GalleryItem[]
  videos: CaseVideo[]
  testimonial: Testimonial | null
  related: string[]
  seo: { title: string; description: string; socialImage: string | null }
  state: ContentState
  /** Items an editor must resolve before this study is considered complete. */
  openItems: string[]
}

export interface Film {
  id: string
  title: string
  client: string | null
  category: string
  /** YouTube ID, or null where the source listed the film without a link. */
  youtubeId: string | null
  /** Non-YouTube hosted URL (one Facebook-hosted film in the archive). */
  externalUrl: string | null
  year: string | null
}

export interface Service {
  id: ServiceId
  name: string
  /** Short promise used in previews. */
  blurb: string
  capabilities: string[]
  /** Longer page copy: the problem this discipline solves. */
  solves: string
  accent: Accent
  /** Case studies that evidence this discipline. */
  cases: string[]
}
