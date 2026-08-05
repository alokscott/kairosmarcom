import type { Metadata } from 'next'
import LegalPage, { type LegalSection } from '@/components/site/LegalPage'
import { site } from '@/content/site'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Terms',
  description: `Terms covering use of ${site.url}, the case-study figures published on it, and enquiries sent through it.`,
  path: '/terms',
})

/**
 * As with the privacy page, the source site linked /terms and returned 404. This is
 * a template. Sections describing what the site does are written; anything that is
 * a commercial or jurisdictional decision is left for the client's lawyer.
 */
const SECTIONS: LegalSection[] = [
  {
    heading: 'Using this site',
    body: [
      `This site is published by Kairos Marcom, ${site.address.locality}. Using it means accepting these terms.`,
      'The text, layout, code and 3D work on this site belong to Kairos Marcom unless stated otherwise.',
    ],
    review: 'Add the registered entity name and confirm the governing law and jurisdiction.',
  },
  {
    heading: 'Case-study figures',
    body: [
      'Every figure in a case study carries a note stating where it came from. Some are read directly from Meta and Instagram account dashboards; others are as reported by the client. Those are two different kinds of evidence and the site labels them separately.',
      'None of the figures on this site have been independently audited, and none of them is a forecast. Past results on one account are not a promise of the same outcome on another.',
    ],
  },
  {
    heading: 'Client names and marks',
    body: [
      'Client names appear to describe work Kairos Marcom carried out. Trade marks, logos and product names belong to their respective owners, and their appearance here does not imply that the owner endorses Kairos Marcom.',
    ],
    review: 'Confirm which client names and marks carry written permission for publication before launch.',
  },
  {
    heading: 'Films and third-party content',
    body: [
      'Films are hosted on YouTube and, in one case, Facebook, and play under those providers’ terms. Following an external link takes you to a site we do not control and are not responsible for.',
    ],
  },
  {
    heading: 'Enquiries',
    body: [
      'Sending the enquiry form does not create a contract or a professional engagement. Work begins only under a separate written scope and fee agreed by both sides.',
      'We reply to enquiries within one business day during office hours, but that is a service commitment rather than a contractual term.',
    ],
  },
  {
    heading: 'Availability',
    body: [
      'We aim to keep the site available and accurate, but we do not guarantee that it will be uninterrupted or free of error.',
    ],
    review: 'Add the liability limitation and warranty disclaimer wording the client’s lawyer approves.',
  },
  {
    heading: 'Changes',
    body: ['We may update these terms. The version on this page is the one that applies.'],
    review: 'Decide whether a "last updated" date and change log are required.',
  },
  {
    heading: 'Contact',
    body: [`${site.email} · ${site.phone} · ${site.hours}.`],
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      intro="Terms covering use of this site, how the published case-study figures should be read, and what sending an enquiry does and does not create."
      sections={SECTIONS}
    />
  )
}
