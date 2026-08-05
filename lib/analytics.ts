'use client'

/**
 * Analytics event taxonomy (brief §18).
 *
 * This map IS the documentation — if an event is not listed here it cannot be
 * fired, which stops the taxonomy drifting away from the spec over time.
 *
 * Privacy posture: no vendor script is bundled. Events are pushed to
 * `window.dataLayer` when a tag manager is present and otherwise dispatched as a
 * DOM CustomEvent, so the client chooses the destination at deploy time rather
 * than inheriting ours. No payload contains free text a visitor typed, no
 * identifiers, and no device fingerprint.
 */

export const EVENTS = {
  /* Conversion */
  hero_cta_primary: 'Primary hero CTA — book a clarity call',
  hero_cta_secondary: 'Secondary hero CTA — explore the work',
  contact_form_start: 'First interaction with any contact-form field',
  contact_form_invalid: 'Client- or server-side validation rejected the submission',
  contact_form_success: 'Server confirmed the enquiry was delivered — the primary conversion',
  contact_email_click: 'mailto: link opened',
  contact_phone_click: 'tel: link opened',
  contact_whatsapp_click: 'WhatsApp link opened',

  /* Navigation */
  nav_route_select: 'A primary navigation route was chosen',
  nav_menu_open: 'Full-screen mobile menu opened',
  theme_change: 'Light/dark control used',

  /* Work */
  case_impression: 'A case-study card entered the viewport',
  case_open: 'A case study was opened from a card or link',
  case_filter: 'A work-index filter was applied or cleared',
  case_search: 'The work-index client search was used',
  case_depth: 'Scroll depth milestone inside a case study (25/50/75/100)',
  case_next_prev: 'Previous/next project navigation used',
  service_detail_open: 'A service was expanded or focused',

  /* Film */
  video_start: 'A film was opened and playback began',
  video_progress: 'Playback milestone (25/50/75)',
  video_complete: 'Playback reached the end',

  /* Experience health — aggregate only */
  reduced_motion_active: 'Session ran with reduced motion (aggregate count)',
  static_fallback_shown: 'A static fallback replaced a 3D scene (aggregate count)',
  webgl_unavailable: 'WebGL failed to initialise (aggregate count, no device data)',
} as const

export type EventName = keyof typeof EVENTS

type Primitive = string | number | boolean | null

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * Fire an event. Never call this optimistically for a conversion — `contact_form_success`
 * must only follow a confirmed server response (brief §18).
 */
export function track(event: EventName, params: Record<string, Primitive> = {}) {
  if (typeof window === 'undefined') return
  const payload = { event, ...params }
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload)
  window.dispatchEvent(new CustomEvent('kairos:analytics', { detail: payload }))
}

/** Deduplicated firing, for impression-style events that can re-trigger on scroll. */
const fired = new Set<string>()
export function trackOnce(event: EventName, params: Record<string, Primitive> = {}) {
  const key = `${event}:${JSON.stringify(params)}`
  if (fired.has(key)) return
  fired.add(key)
  track(event, params)
}
