import { NextResponse } from 'next/server'
import { contact, site } from '@/content/site'
import { validateEnquiry } from '@/lib/enquiry'

/**
 * Clarity-call enquiry endpoint.
 *
 * The server is the authority on validity and on whether an enquiry was delivered.
 * It returns 200 only once a transport has confirmed it — the client fires the
 * conversion event off that response, so an optimistic 200 here would corrupt the
 * conversion numbers as well as losing the enquiry (brief §18, §20).
 *
 * Validation itself lives in lib/enquiry.ts so it can be tested without a request.
 */

export const runtime = 'nodejs'

/**
 * ponytail: in-memory, per-instance rate limiting. Correct for a single node and for
 * the traffic this form sees; move to Redis or the platform's own limiter if the
 * site is ever deployed across more than one instance.
 */
const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  // Keep the map from growing without bound on a long-lived process.
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
  }
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  const now = Date.now()
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'

  if (rateLimited(ip, now)) {
    return NextResponse.json(
      { error: 'Too many enquiries from this connection. Please email us instead.' },
      { status: 429 }
    )
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Malformed submission.' }, { status: 400 })
  }

  const result = validateEnquiry({
    name: form.get('name'),
    email: form.get('email'),
    company: form.get('company'),
    message: form.get('message'),
    budget: form.get('budget'),
    website: form.get('website'),
    elapsed: form.get('elapsed'),
  }, contact.budgets)

  // Answer a honeypot hit as though it worked; telling a bot it was caught only
  // helps it adapt. Nothing is sent anywhere.
  if (result.outcome === 'honeypot') return NextResponse.json({ ok: true })

  if (result.outcome === 'too-fast') {
    return NextResponse.json({ error: 'That submitted too quickly. Please try again.' }, { status: 400 })
  }

  if (result.outcome === 'invalid') {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: result.fields }, { status: 422 })
  }

  const delivered = await deliver({ ...result.enquiry, receivedAt: new Date(now).toISOString() })
  if (!delivered) {
    return NextResponse.json(
      {
        error: `We could not deliver that just now. Please email ${site.email} or message us on WhatsApp — we answer those ourselves.`,
      },
      { status: 503 }
    )
  }

  return NextResponse.json({ ok: true })
}

type Enquiry = {
  name: string
  email: string
  company: string | null
  budget: string
  message: string
  receivedAt: string
}

/**
 * Delivery transports, tried in order. Returns false when none is configured or none
 * confirms — the caller turns that into a 503 carrying the direct contact channels,
 * rather than a success screen over a lost enquiry.
 *
 * No SDK: each provider is a single authenticated POST, and a dependency that wraps
 * one fetch call is a dependency to patch for no gain.
 */
async function deliver(enquiry: Enquiry): Promise<boolean> {
  const subject = `Clarity call — ${enquiry.name}${enquiry.company ? ` (${enquiry.company})` : ''}`
  const text = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Company: ${enquiry.company ?? '—'}`,
    `Budget: ${enquiry.budget}`,
    '',
    'What is stuck:',
    enquiry.message,
    '',
    `Received: ${enquiry.receivedAt}`,
  ].join('\n')

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? 'Kairos site <site@kairosmarcom.com>',
          to: process.env.CONTACT_TO,
          reply_to: enquiry.email,
          subject,
          text,
        }),
      })
      if (res.ok) return true
    } catch {
      /* fall through to the webhook */
    }
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, ...enquiry }),
      })
      if (res.ok && (await webhookAccepted(res))) return true
    } catch {
      /* fall through */
    }
  }

  return false
}

/**
 * A 2xx is not always a yes.
 *
 * The status code alone was the whole test here, on the reasonable assumption that an
 * endpoint reports failure with a failure status. Some form relays do not: FormSubmit,
 * tried while wiring this site up, answers a rejected server-side submission with
 * HTTP 200 and `{"success":"false","message":"..."}` in the body. Against the old check
 * that counted as delivered, so the visitor would have seen the success screen while
 * the enquiry went nowhere — precisely the outcome the 503 path exists to prevent.
 *
 * So a JSON body that explicitly says it failed is believed over the status line.
 * Anything else — no body, a non-JSON body, JSON without a verdict — stays a success,
 * because an ordinary CRM or Zapier hook says nothing and means yes, and this must not
 * start rejecting the endpoints it was built for.
 */
async function webhookAccepted(res: Response): Promise<boolean> {
  if (!res.headers.get('content-type')?.includes('json')) return true
  try {
    const body = (await res.json()) as { success?: unknown; ok?: unknown }
    for (const verdict of [body.success, body.ok]) {
      if (verdict === false || verdict === 'false') return false
    }
    return true
  } catch {
    // Unreadable or malformed body on an otherwise-2xx response: nothing to disprove.
    return true
  }
}
