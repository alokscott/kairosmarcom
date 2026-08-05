import type { Accent, Service, ServiceId } from './types'

/**
 * Site-wide copy and facts, migrated verbatim from kairosmarcom.com/new (audited 2026-08-05).
 * Contact details, claims and client names are reproduced as published.
 */

export const site = {
  name: 'Kairos Marcom',
  /** Set NEXT_PUBLIC_SITE_URL in the deploy environment; this is the launch target. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kairosmarcom.com',
  tagline: 'Truthful. Mindful. Thoughtful. Ideas plentiful.',
  positioning: 'Full-service branding & communications',
  description:
    'Kairos Marcom is a full-service branding firm in New Delhi. We turn fuzzy positioning into a sharp brand story, then build the design, digital, PR and video work that carries it. Book a free 30-minute brand clarity call.',
  about:
    'Amid the sea of sameness, we are an ocean of unusual, unexpected and unprecedented. A full-service branding firm built to manage, capture and leverage change.',
  foundingDate: '2019',
  email: 'hello@kairosmarcom.com',
  phone: '+91-9811559841',
  phoneHref: 'tel:+919811559841',
  whatsapp: 'https://wa.me/919811559841',
  hours: 'Mon–Fri, 10am–7pm IST',
  responseTime: 'We reply to every enquiry within one business day.',
  address: { locality: 'New Delhi', region: 'Delhi', country: 'IN' },
  social: {
    instagram: 'https://instagram.com/kairosmarcom',
    linkedin: 'https://linkedin.com/company/kairosmarcom',
    behance: 'https://behance.net/kairosmarcom',
  },
} as const

export const nav = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/process', label: 'Process' },
  { href: '/about', label: 'About' },
  { href: '/films', label: 'Films' },
  { href: '/contact', label: 'Contact' },
] as const

export const hero = {
  eyebrow: 'Full-service branding & communications',
  headline: ['Welcome to the', 'Hub of', 'Creativity'],
  body: 'Most growing brands are not short on ideas — they are short on a story people repeat. We are the branding partner for founders and marketing leads whose product is genuinely good but whose message keeps getting lost. In eight weeks you get positioning that holds, a brand system your team can actually run, and campaigns that earn attention instead of buying it.',
  primaryCta: { label: 'Book a free 30-min clarity call', href: '/contact' },
  secondaryCta: { label: 'Explore our work', href: '/work' },
  assurance: 'We reply to every enquiry within one business day.',
  proof: [
    { value: 6, suffix: '', label: 'disciplines under one roof' },
    { value: 8, suffix: 'wk', label: 'from kickoff to launch-ready' },
    { value: 1, suffix: '', label: 'senior lead on every project' },
  ],
} as const

/**
 * The client wall. Verbatim from the source site's marquee.
 * Only five have logo files on the source; the rest are set in type there and here.
 * Publishing any client logo needs written permission — see docs/09-content-migration.md.
 */
export const clients = [
  'BMW',
  'Audi',
  'DJI',
  'Insta360',
  'BYD',
  'Mahindra',
  'CaratLane',
  'DLF',
  'Welspun',
  'ThriveDx',
] as const

export const clientsIntro = 'Trusted by teams at BMW, Audi, DJI, Insta360, BYD and ThriveDx'

/** Four things every piece of work has to earn. Each drives a 3D transformation. */
export const principles: {
  id: string
  index: string
  title: string
  body: string
  accent: Accent
  /** How the shared core behaves for this principle. */
  motif: string
}[] = [
  {
    id: 'connection',
    index: '01',
    title: 'Connection',
    body: 'Before a single layout, we find the meaning underneath the product — the reason a person would care on a Tuesday afternoon. That is the thread everything else hangs from.',
    accent: 'orange',
    motif: 'Independent nodes find each other and a thread is drawn between them.',
  },
  {
    id: 'logic',
    index: '02',
    title: 'Logic',
    body: 'Claims need evidence. We pressure-test your positioning against real customer language, competitor territory and what your team can honestly deliver.',
    accent: 'silver',
    motif: 'The loose field snaps onto an ordered axis and holds its shape.',
  },
  {
    id: 'magic',
    index: '03',
    title: 'Magic',
    body: 'Strategy that stays in a deck is worthless. We know which idea will prove valuable and actionable — and we build that one properly.',
    accent: 'violet',
    motif: 'One element refracts and the whole structure reveals a second reading.',
  },
  {
    id: 'cause',
    index: '04',
    title: 'Cause',
    body: 'We take on work that spreads something positive. Brands that make a real change get our best thinking, and our best rates.',
    accent: 'lime',
    motif: 'A single impulse ripples outward and moves everything it reaches.',
  },
]

export const principlesIntro =
  'Amid the sea of sameness, we are an ocean of unusual, unexpected and unprecedented. These four tests are how we keep that honest.'

export const dna = [
  {
    title: 'Creatively led',
    body: 'Quality and integrity first. Creativity sits at the centre of the business, not in a service line.',
  },
  {
    title: 'Strategically driven',
    body: 'Rigorous creative strategy rooted in brand purpose — not last decade’s playbook reheated.',
  },
  {
    title: 'Systems thinkers',
    body: 'We build growth solutions at the intersection of imagination and what your team can realistically run.',
  },
  {
    title: 'Instinctively generous',
    body: 'We share the thinking, not just the output. Your team should get sharper by working with us.',
  },
]

export const servicesIntro =
  'You brief once. Strategy, design, digital, PR, media and video all come from the same room, so the story does not drift between channels.'

export const services: Service[] = [
  {
    id: 'creative-design',
    name: 'Creative Design',
    blurb:
      'Identity systems, packaging, print and illustration. The visual language that makes you recognisable in three seconds flat.',
    capabilities: ['Logo & identity systems', 'Packaging & print', 'Illustration', 'Brand guidelines'],
    solves:
      'You are recognisable to the people already inside your company and invisible to everyone else. Design work fixes that by giving the brand a form people can pick out of a feed without reading the name.',
    accent: 'orange',
    cases: ['ageless-digital', 'bmw-bavaria-motors', 'insta360-india'],
  },
  {
    id: 'branding',
    name: 'Branding',
    blurb:
      'Positioning, naming, messaging architecture and tone of voice — the strategic core the rest of the work is built on.',
    capabilities: ['Positioning & narrative', 'Naming', 'Messaging architecture', 'Tone of voice'],
    solves:
      'Every team member describes the company differently, so the market has no single sentence to repeat. Branding settles the argument internally first, then makes the answer usable everywhere.',
    accent: 'violet',
    cases: ['bmw-bavaria-motors', 'dji-india', 'thinkcyber-india'],
  },
  {
    id: 'digital',
    name: 'Digital',
    blurb:
      'Websites and product surfaces that load fast, read clearly and move people to the next step without a hard sell.',
    capabilities: ['Website design & build', 'Landing pages', 'UX writing', 'Analytics setup'],
    solves:
      'Traffic arrives and leaves without doing anything. Digital work makes the path obvious, the page fast and the measurement honest enough to act on.',
    accent: 'lime',
    cases: ['ageless-digital', 'global-opportunities', 'byd-kristan-auto'],
  },
  {
    id: 'public-relations',
    name: 'Public Relations',
    blurb: 'Earned coverage and founder positioning. We build the story first, then place it where your buyers already read.',
    capabilities: ['Media relations', 'Founder positioning', 'Press kits', 'Launch comms'],
    solves:
      'Nobody outside your paid audience has heard of you. PR earns third-party credibility, which is the only kind buyers actually weight.',
    accent: 'orange',
    cases: ['bmw-bavaria-motors', 'byd-kristan-auto', 'thinkcyber-india'],
  },
  {
    id: 'media',
    name: 'Media',
    blurb: 'Paid planning and buying across search, social and programmatic, run against outcomes rather than impressions.',
    capabilities: ['Paid social & search', 'Programmatic', 'Campaign reporting', 'Budget planning'],
    solves:
      'Spend is going out and the reporting talks about reach instead of revenue. Media planning ties the budget to a number the business already cares about.',
    accent: 'violet',
    cases: ['global-opportunities', 'thrivedx', 'audi-gurugram'],
  },
  {
    id: 'video',
    name: 'Video',
    blurb: 'Motion, film and animation — from a 15-second scroll-stopper to a full brand film, produced in-house.',
    capabilities: ['Brand films', 'Motion graphics', 'Social cutdowns', 'Product demos'],
    solves:
      'The story needs more than a still frame to land. Film and motion carry tone and demonstration in a way copy alone cannot, and it is produced by the same team that wrote the strategy.',
    accent: 'lime',
    cases: ['bmw-bavaria-motors', 'audi-gurugram', 'dji-india'],
  },
]

export const serviceById = (id: ServiceId) => services.find((s) => s.id === id)!

export const processIntro =
  'Kairos means the supreme moment — the right thing said at the right time. Our process exists to find that moment for your brand, then build everything around it.'

export const processSteps = [
  {
    index: '01',
    when: 'Week 1–2',
    title: 'Listen',
    body: 'Two weeks of interviews with your team and your customers. We come back with what people actually say about you, not what the deck claims.',
    motif: 'Sound and signal enter the form. Nothing is sorted yet.',
    /** Documented on the redesign; not published on the source site. Marked for approval. */
    clientDecision: 'You nominate the customers we speak to and sign off the interview list.',
  },
  {
    index: '02',
    when: 'Week 3',
    title: 'Distil',
    body: 'We narrow everything to one defensible position and the three proof points that hold it up. You approve this before anything gets designed.',
    motif: 'Noise compresses into one sharp object.',
    clientDecision: 'Approval gate: you sign off the position and proof points before design starts.',
  },
  {
    index: '03',
    when: 'Week 4–7',
    title: 'Build',
    body: 'Identity, messaging, site and campaign assets get made in parallel by the same senior team, so nothing drifts out of sync.',
    motif: 'Components assemble into one system.',
    clientDecision: 'Two review rounds: first creative in week four, near-final in week six.',
  },
  {
    index: '04',
    when: 'Week 8',
    title: 'Hand over',
    body: 'You get the files, the guidelines and a working session so your team can run it without calling us every week.',
    motif: 'The system expands into reusable modules and leaves the room.',
    clientDecision: 'Handover session with the team who will run it day to day.',
  },
]

export const objectionsIntro = 'We would rather deal with these now than pretend they do not come up.'

export const objections = [
  {
    q: 'We can’t afford a full rebrand right now.',
    a: 'Then do not do one. Most engagements start with positioning and messaging only — roughly a quarter of the cost of a full identity, and it is the part that moves numbers. Identity can follow next year if it still matters.',
  },
  {
    q: 'We already have an in-house design team.',
    a: 'Good, that makes this cheaper. We do the strategy and the master system, your team executes it day to day. Several of our clients use us exactly this way, two or three times a year.',
  },
  {
    q: 'Agencies always overrun and overcharge.',
    a: 'Fair. Every engagement is fixed-scope and fixed-fee, agreed before we start. If we underestimate, that is our problem, not a change order. You will see the full number before you commit to anything.',
  },
  {
    q: 'We need results, not another strategy deck.',
    a: 'The deck is a by-product. What you actually receive is a live site, a working brand system, campaign assets and a team that knows how to use them. The thinking is free; the build is what you pay for.',
  },
]

export const faqs = [
  {
    q: 'What does a typical engagement cost?',
    a: 'It depends on scope. A positioning and messaging project is a fraction of a full brand build with identity, site and launch assets. Either way you get a fixed number in writing after the first call — we do not do open-ended retainers unless you ask for one.',
  },
  {
    q: 'How long until we see something?',
    a: 'You will see the strategic direction in week three and first creative in week four. Full handover is week eight for most brand builds. Smaller messaging-only projects run three to four weeks.',
  },
  {
    q: 'Who actually does the work?',
    a: 'The senior people you meet on the call. We are a small team of marketers, project managers, creatives and designers — there is no junior handoff after the pitch, because there is no pitch team.',
  },
  {
    q: 'Do you work with companies outside India?',
    a: 'Yes. We run remote engagements across timezones and keep a standing overlap window for calls. Roughly a third of our current work is international.',
  },
  {
    q: 'Can we engage Kairos for only one service?',
    a: 'That is fine, and it is often the smart way to start. We will tell you honestly if the piece you are asking for will not work without the strategy underneath it, but the decision stays yours.',
  },
  {
    q: 'What happens on the first call?',
    a: 'Thirty minutes, no deck. You describe what is stuck, we ask questions, and you leave with at least one useful observation whether or not you hire us. If it is not a fit, we will say so and point you somewhere better.',
  },
]

export const contact = {
  headline: 'Tell us what is stuck. We’ll tell you what we would do.',
  body: 'Thirty minutes, no pitch deck, no obligation. Describe the brand and what is not landing — you will leave the call with a clear read on the problem, whether or not you work with us.',
  promises: [
    'A senior lead on the call, not a salesperson',
    'A fixed scope and fixed fee before you commit',
    'An honest no if we are not the right fit',
  ],
  formTitle: 'Book your 30-minute call',
  formNote: 'No deck, no obligation. We reply to every enquiry within one business day.',
  privacyNote: 'We use your details to reply to this enquiry and nothing else. No lists, no resale.',
  budgets: ['Prefer not to say', 'Under ₹2L', '₹2L – ₹5L', '₹5L – ₹15L', '₹15L+'],
} as const
