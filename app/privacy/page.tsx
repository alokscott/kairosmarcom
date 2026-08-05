import type { Metadata } from 'next'
import LegalPage, { type LegalSection } from '@/components/site/LegalPage'
import { site } from '@/content/site'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy',
  description: `How Kairos Marcom handles enquiry details, analytics and third-party embeds on ${site.url}.`,
  path: '/privacy',
})

/**
 * The source site linked /privacy from every page and returned 404. There is no
 * previous policy to migrate, so this is a template: every clause describes what
 * this build actually does technically, and the commercial and retention terms are
 * marked for the client's legal sign-off rather than invented.
 */
const SECTIONS: LegalSection[] = [
  {
    heading: 'What this policy covers',
    body: [
      `This policy covers ${site.url} and the enquiry form on it. It does not cover the separate platforms we run on behalf of clients, or the third-party services linked from this site.`,
    ],
  },
  {
    heading: 'What we collect when you contact us',
    body: [
      'The clarity-call form asks for your name, work email, and a description of the problem. Company name and budget band are optional. We also record the time of submission.',
      'We use those details to reply to your enquiry and for nothing else. We do not add you to a mailing list, and we do not sell, rent or share the details with anyone outside Kairos Marcom.',
    ],
  },
  {
    heading: 'Spam protection',
    body: [
      'The form includes a hidden field that a person never sees and a check on how long the form took to complete. Both exist only to reject automated submissions. Neither builds a profile of you and neither is shared.',
      'We apply a short-term limit on submissions from the same network connection. The IP address is used for that check in memory and is not stored with your enquiry.',
    ],
  },
  {
    heading: 'Analytics',
    body: [
      'We measure how the site is used in aggregate: which pages are opened, which case studies are read, which filters are used, and whether a session ran with reduced motion or without WebGL.',
      'These events carry no identifiers, no device fingerprint, and never the free text you typed into the form.',
    ],
    review: 'Confirm the analytics vendor and region before launch, and whether a consent banner is required for it.',
  },
  {
    heading: 'Third-party embeds',
    body: [
      'Films are hosted on YouTube and, in one case, Facebook. Nothing loads from either until you press play on a film. Once you do, that provider sets its own cookies and applies its own privacy policy, which we do not control.',
      'Fonts are served from Google Fonts.',
    ],
    review: 'If the site serves the EU or UK, confirm whether a consent layer is required before the fonts request.',
  },
  {
    heading: 'How long we keep enquiries',
    body: ['Enquiries are kept for as long as the conversation is live, and then archived.'],
    review: 'Set a specific retention period with the client and replace this paragraph with it.',
  },
  {
    heading: 'Your rights',
    body: [
      `You can ask what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to ${site.email} and we will act on it.`,
    ],
    review:
      'Confirm the applicable regime — India DPDP Act 2023 and, if relevant, UK/EU GDPR — and add the statutory response window and grievance-officer details the regime requires.',
  },
  {
    heading: 'Contact',
    body: [`Kairos Marcom, ${site.address.locality}, ${site.address.region}, India. ${site.email} · ${site.phone}.`],
    review: 'Add the registered entity name and full registered address.',
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we handle the details you send us, what we measure, and what the embedded services do."
      sections={SECTIONS}
    />
  )
}
