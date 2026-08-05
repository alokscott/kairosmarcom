'use client'

import { useRef, useState } from 'react'
import { contact, site } from '@/content/site'
import { track } from '@/lib/analytics'
import ContactLink from '@/components/site/ContactLink'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

/**
 * Clarity-call enquiry form.
 *
 * Validation is duplicated deliberately: the client copy gives immediate, per-field
 * feedback, and the server copy is the one that decides. The success event fires
 * only after the server confirms delivery — never on submit (brief §18).
 *
 * Spam handling is a honeypot plus a minimum fill time. Both are invisible to real
 * visitors, neither blocks assistive technology, and neither ships a third-party
 * challenge that would need its own consent notice.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const startedAt = useRef(Date.now())
  const touched = useRef(false)

  const onFirstInteraction = () => {
    if (touched.current) return
    touched.current = true
    track('contact_form_start')
  }

  const validate = (data: FormData): FieldErrors => {
    const next: FieldErrors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (name.length < 2) next.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Please enter a work email we can reply to.'
    if (message.length < 10) next.message = 'A sentence or two about what is stuck, please.'
    return next
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const found = validate(data)
    setErrors(found)
    if (Object.keys(found).length) {
      track('contact_form_invalid', { fields: Object.keys(found).join(',') })
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }

    setStatus('sending')
    setServerError(null)
    data.set('elapsed', String(Date.now() - startedAt.current))

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: data })
      const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: FieldErrors }

      if (!res.ok) {
        setStatus('error')
        setErrors(body.fields ?? {})
        setServerError(body.error ?? 'We could not send that. Please email or WhatsApp us instead.')
        track('contact_form_invalid', { reason: body.error ?? 'server' })
        return
      }

      setStatus('sent')
      // Confirmed by the server — this is the primary conversion.
      track('contact_form_success', { budget: String(data.get('budget') ?? 'unset') })
      form.reset()
    } catch {
      setStatus('error')
      setServerError('The network dropped that request. Please email or WhatsApp us instead.')
      track('contact_form_invalid', { reason: 'network' })
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="p-8"
        style={{ border: '1px solid var(--accent)', background: 'var(--bg-raised)' }}
      >
        <h3 className="text-[length:var(--text-h3)]">Thank you — that reached us.</h3>
        <p className="muted mt-4 max-w-[48ch] leading-relaxed">
          A senior lead will reply within one business day, {site.hours.toLowerCase()}. If it is urgent, WhatsApp is
          faster and we answer those ourselves.
        </p>
        <p className="mt-6 flex flex-wrap gap-4 text-sm">
          <ContactLink channel="whatsapp" className="link-underline">
            Message on WhatsApp
          </ContactLink>
          <ContactLink channel="email" className="link-underline">
            {site.email}
          </ContactLink>
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      onInput={onFirstInteraction}
      noValidate
      className="p-6 md:p-8"
      style={{ border: '1px solid var(--rule)', background: 'var(--bg-raised)' }}
    >
      <h3 className="text-[length:var(--text-h3)]">{contact.formTitle}</h3>
      <p className="faint mt-2 text-sm">{contact.formNote}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field
          name="name"
          label="Your name"
          required
          autoComplete="name"
          error={errors.name}
          className="sm:col-span-1"
        />
        <Field
          name="email"
          label="Work email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          className="sm:col-span-1"
        />
        <Field name="company" label="Company" autoComplete="organization" hint="Optional" className="sm:col-span-1" />

        <div className="sm:col-span-1">
          <label htmlFor="budget" className="mb-2 block text-sm font-medium">
            Rough budget <span className="faint font-normal">Optional</span>
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue={contact.budgets[0]}
            className="w-full px-3 py-2.5 text-sm"
            style={{ background: 'var(--bg)', border: '1px solid var(--rule-strong)', color: 'var(--fg)' }}
          >
            {contact.budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <Field
          name="message"
          label="What is stuck?"
          required
          multiline
          hint="A couple of sentences is plenty."
          error={errors.message}
          className="sm:col-span-2"
        />
      </div>

      {/* Honeypot. Hidden from sight and from assistive tech; only a bot fills it. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Request my call'}
        </button>
        <p className="faint max-w-[38ch] text-xs">{contact.privacyNote}</p>
      </div>

      {/* Single live region for submission status, so nothing is announced twice. */}
      <p role="alert" aria-live="assertive" className="mt-4 text-sm" style={{ color: 'var(--accent-text)' }}>
        {serverError}
      </p>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  required,
  multiline,
  hint,
  error,
  className = '',
  ...rest
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  multiline?: boolean
  hint?: string
  error?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const hintId = hint ? `${name}-hint` : undefined
  const errorId = error ? `${name}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const style = {
    background: 'var(--bg)',
    border: `1px solid ${error ? 'var(--accent)' : 'var(--rule-strong)'}`,
    color: 'var(--fg)',
  }

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}{' '}
        {required ? (
          <span aria-hidden="true" style={{ color: 'var(--accent-text)' }}>
            *
          </span>
        ) : (
          <span className="faint font-normal">Optional</span>
        )}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="w-full resize-y px-3 py-2.5 text-sm"
          style={style}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="w-full px-3 py-2.5 text-sm"
          style={style}
          {...rest}
        />
      )}

      {hint && (
        <p id={hintId} className="faint mt-1.5 text-xs">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium" style={{ color: 'var(--accent-text)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
