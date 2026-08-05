'use client'

import { site } from '@/content/site'
import { track } from '@/lib/analytics'

/**
 * Email / phone / WhatsApp link with its assisted-conversion event attached.
 * One component so the three channels can never drift apart or lose tracking.
 */
export default function ContactLink({
  channel,
  children,
  className = '',
}: {
  channel: 'email' | 'phone' | 'whatsapp'
  children: React.ReactNode
  className?: string
}) {
  const config = {
    email: { href: `mailto:${site.email}`, event: 'contact_email_click' },
    phone: { href: site.phoneHref, event: 'contact_phone_click' },
    whatsapp: { href: site.whatsapp, event: 'contact_whatsapp_click' },
  } as const

  const { href, event } = config[channel]

  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event)}
      {...(channel === 'whatsapp' ? { rel: 'noopener', target: '_blank' } : {})}
    >
      {children}
    </a>
  )
}
