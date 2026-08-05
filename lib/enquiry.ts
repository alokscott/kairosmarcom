/**
 * Enquiry validation — the trust boundary for the contact form.
 *
 * Deliberately dependency-free: no Next types, no content imports, nothing that
 * needs a request or a bundler. That is what lets it be tested directly, and the
 * allowed budget list is passed in rather than imported so the check cannot quietly
 * diverge from whatever the caller actually rendered.
 */

export const LIMITS = { name: 100, email: 200, company: 120, message: 2000 } as const
export const MIN_FILL_MS = 2500

/** Strip control characters, collapse whitespace, clamp length. */
export function clean(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

export interface EnquiryInput {
  name: unknown
  email: unknown
  company: unknown
  message: unknown
  budget: unknown
  website: unknown
  elapsed: unknown
}

export interface CleanEnquiry {
  name: string
  email: string
  company: string | null
  budget: string
  message: string
}

export type EnquiryResult =
  | { outcome: 'ok'; enquiry: CleanEnquiry }
  /** Honeypot tripped. The caller answers as success so a bot learns nothing. */
  | { outcome: 'honeypot' }
  | { outcome: 'too-fast' }
  | { outcome: 'invalid'; fields: Record<string, string> }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEnquiry(input: EnquiryInput, allowedBudgets: readonly string[]): EnquiryResult {
  if (clean(input.website, 50)) return { outcome: 'honeypot' }

  // Non-finite must fail closed: `NaN < MIN_FILL_MS` is false, so a bot sending
  // elapsed="abc" would otherwise walk straight past the timing gate.
  const elapsed = Number(input.elapsed)
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return { outcome: 'too-fast' }

  const name = clean(input.name, LIMITS.name)
  const email = clean(input.email, LIMITS.email)
  const company = clean(input.company, LIMITS.company)
  const message = clean(input.message, LIMITS.message)

  // Never trust the select: a value outside the published list means a hand-crafted
  // payload, so fall back to the safe default rather than storing what arrived.
  const budgetRaw = clean(input.budget, 40)
  const budget = allowedBudgets.includes(budgetRaw) ? budgetRaw : allowedBudgets[0]

  const fields: Record<string, string> = {}
  if (name.length < 2) fields.name = 'Please tell us your name.'
  if (!EMAIL.test(email)) fields.email = 'Please enter a work email we can reply to.'
  if (message.length < 10) fields.message = 'A sentence or two about what is stuck, please.'

  if (Object.keys(fields).length) return { outcome: 'invalid', fields }

  return { outcome: 'ok', enquiry: { name, email, company: company || null, budget, message } }
}
