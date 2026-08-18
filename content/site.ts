import type { Accent, Service, ServiceId } from './types'

/**
 * Site-wide copy and facts.
 *
 * Source of truth is the approved "Revised content" copy deck (received 2026-08-14),
 * which supersedes the 2026-08-05 migration of kairosmarcom.com/new. Contact details,
 * claims and client names are reproduced as supplied in that deck.
 */

export const site = {
  name: 'Kairos Marcom',
  /** Set NEXT_PUBLIC_SITE_URL in the deploy environment; this is the launch target. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kairosmarcom.com',
  tagline: 'Truthful. Mindful. Thoughtful. Ideas plentiful.',
  positioning: 'Media neutral brand development agency',
  description:
    'Kairos Marcom is a media neutral brand development agency with offices in Delhi, Dubai and Mumbai. Branding, creative design, digital, PR, technology and video from one senior team. Book a 30-minute call.',
  about:
    'We are a media neutral brand development agency. Amid the sea of sameness, we are an ocean of unusual, unexpected and unprecedented.',
  foundingDate: '2019',
  email: 'hello@kairosmarcom.com',
  phone: '+91 9811559841',
  phoneHref: 'tel:+919811559841',
  /** Second published line, listed alongside the Delhi number in the contact block. */
  phoneDubai: '+971 545519811',
  phoneDubaiHref: 'tel:+971545519811',
  whatsapp: 'https://wa.me/919811559841',
  hours: 'Mon–Fri, 10am–7pm IST',
  responseTime: 'We reply to every enquiry within one business day.',
  address: { locality: 'New Delhi', region: 'Delhi', country: 'IN' },
  social: {
    instagram: 'https://instagram.com/kairosmarcom',
    linkedin: 'https://linkedin.com/company/kairosmarcom',
    behance: 'https://behance.net/kairosmarcom',
    /* The copy deck adds Facebook to the social row without supplying a URL. This
       follows the handle every other channel uses and is flagged for confirmation. */
    facebook: 'https://facebook.com/kairosmarcom',
  },
} as const

/**
 * The three offices.
 *
 * Mumbai carries no street address: the copy deck lists it as "[address to be
 * supplied]". The city is published because the stat band counts three offices;
 * the address line stays null until one is provided rather than being invented.
 */
export const offices: { city: string; address: string | null }[] = [
  { city: 'Delhi', address: '241, unit number 3, 1st floor, Westend Marg, Saidulajab, New Delhi 110030' },
  { city: 'Dubai', address: 'F 02, M38, CBD Maktoum Branch Bldg, Al Khabeesi, Dubai' },
  { city: 'Mumbai', address: null },
]

export const nav = [
  { href: '/work', label: 'Case studies' },
  { href: '/services', label: 'Services' },
  { href: '/process', label: 'Process' },
  { href: '/about', label: 'About' },
  { href: '/#faqs', label: 'FAQs' },
] as const

/** The footer carries three destinations the header bar does not have room for. */
export const footerNav = [
  ...nav,
  { href: '/films', label: 'Film & motion' },
  { href: '/#brands', label: 'Brands' },
  { href: '/contact', label: 'Contact' },
] as const

/**
 * Full-bleed hero video.
 *
 * Set `src` to null to turn it off: the hero then falls back to the WebGL mark and
 * needs no other change (see components/home/Hero.tsx).
 *
 * `poster` is null because no still has been supplied. Without one the element shows
 * the page colour until the first frame decodes, which is the correct thing for a
 * decorative background — a poster is worth adding only if the video is large enough
 * that the gap is visible. Export frame one as a JPEG into `public/` and name it here.
 */
export const heroVideo: { src: string | null; poster: string | null } = {
  src: '/video1.mp4',
  poster: null,
}

export const hero = {
  eyebrow: 'Media neutral brand development agency',
  headline: ['Welcome to the', 'Hub of', 'Creativity'],
  body: 'A place where expressions are strategized, thoughts are innovative and stories are delivered. We are Truthfully Expressing, Thoughtfully Innovating, and Mindfully Delivering a coherent and effective strategy with our experience and expertise. Whether it is strategy, naming, design, digital experience, activation, or brand governance, we know what it takes to build brands for success.',
  primaryCta: { label: 'Let’s Work', href: '/contact' },
  secondaryCta: { label: 'See our work', href: '/work' },
  proof: [
    { value: 60, suffix: '+', label: 'happy clients' },
    { value: 6, suffix: '', label: 'disciplines under one roof' },
    { value: 3, suffix: '', label: 'offices — Delhi, Dubai, Mumbai' },
  ],
} as const

/**
 * The trust strip.
 *
 * The copy deck asks for logos rather than type. Only four client marks exist as
 * files in this repo, so each entry carries its mark where one is on hand and falls
 * back to a wordmark where it is not — the layout takes the remaining files unchanged
 * once they land. Publishing any client logo needs written permission on file; see
 * docs/09-content-migration.md.
 */
export const clients: { name: string; logo: string | null }[] = [
  { name: 'Bavaria Motors', logo: '/logos/bmw.svg' },
  { name: 'Audi Gurugram', logo: '/logos/audi.svg' },
  { name: 'DJI India', logo: '/logos/dji.svg' },
  { name: 'Insta360 India', logo: '/logos/insta360.svg' },
  { name: 'BYD Kristan Auto', logo: null },
]

export const clientsIntro = 'Trusted by'

/** Four cards under "How we think". Each drives a 3D transformation. */
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
    body: 'We work towards finding the meaning, significance and deeper connection that the brand holds towards the audience. That is the thread everything else hangs from.',
    accent: 'orange',
    motif: 'Independent nodes find each other and a thread is drawn between them.',
  },
  {
    id: 'logic',
    index: '02',
    title: 'Logic',
    body: 'The strategic use of logic, claims and evidence to spread the word about brands, making it strong, reasonable and clear. Evidence, not assertion.',
    /*
     * Was 'silver'. That mattered when the palette had four hues and each principle
     * carried its own; now `silver` is the one NEUTRAL, kept for bands that should
     * recede, so declaring it here turned this principle's icon, numeral and progress
     * bar grey while the other three were red — and on the homepage it drained the
     * whole pinned stage as you scrolled through Logic. `silver` is a role now, not a
     * colour choice, and nothing that wants emphasis should ask for it.
     */
    accent: 'orange',
    motif: 'The loose field snaps onto an ordered axis and holds its shape.',
  },
  {
    id: 'magic',
    index: '03',
    title: 'Magic',
    body: 'We believe that there is a magic in advertising — the ability to understand what will prove valuable and actionable for the brand, then building that one properly.',
    accent: 'violet',
    motif: 'One element refracts and the whole structure reveals a second reading.',
  },
  {
    id: 'cause',
    index: '04',
    title: 'Cause',
    body: 'Everything sums up to how mankind is affected by an action. We think of spreading positivity and bringing fruitful changes in the lives of people.',
    accent: 'lime',
    motif: 'A single impulse ripples outward and moves everything it reaches.',
  },
]

export const principlesIntro =
  'Amid the sea of sameness, we are an ocean of unusual, unexpected and unprecedented. These four are how we keep that honest.'

export const dna = [
  {
    title: 'Creatively led',
    body: 'We work with an ambition to create the best and put creativity at the center of everything. Quality and integrity above all else.',
  },
  {
    title: 'Strategically driven',
    body: 'We can’t solve tomorrow’s problem with yesterday’s answers. We pave the path to world-class work through strategy rooted in brand purpose.',
  },
  {
    title: 'Systems thinkers',
    body: 'We look forward to when everything else goes sideways. Growth solutions at the intersection of imagination and reality.',
  },
  {
    title: 'Instinctively generous',
    body: 'We positively impact lives and not just make noise. In good times or bad, we lead the change as a force of growth and good.',
  },
]

export const servicesIntro =
  'You brief once. Branding, digital, creative design, video, PR and technology all come from the same room, so the story does not drift between channels.'

export const services: Service[] = [
  {
    id: 'creative-design',
    name: 'Creative Design',
    blurb:
      'Identity systems, packaging, print and illustration. The visual language that makes a brand recognisable in three seconds flat.',
    capabilities: [
      'Logo creation and revamp',
      'Brand and communication guidelines',
      'Packaging and print',
      'Social media systems',
    ],
    solves:
      'You are recognisable to the people already inside your company and invisible to everyone else. Design work fixes that by giving the brand a form people can pick out of a feed without reading the name.',
    accent: 'orange',
    cases: ['ageless-digital', 'bmw-bavaria-motors', 'insta360-india'],
  },
  {
    id: 'branding',
    name: 'Branding',
    blurb:
      'Positioning, naming, messaging architecture and tone of voice. The strategic core the rest of the work is built on.',
    capabilities: ['Positioning and narrative', 'Naming', 'Messaging architecture', 'Tone of voice'],
    solves:
      'Every team member describes the company differently, so the market has no single sentence to repeat. Branding settles the argument internally first, then makes the answer usable everywhere.',
    accent: 'violet',
    cases: ['bmw-bavaria-motors', 'dji-india', 'thinkcyber-india'],
  },
  {
    id: 'digital',
    name: 'Digital',
    blurb:
      'Digital and social presence built to be found, understood and acted upon. Content calendars, paid campaigns and the reporting behind them.',
    capabilities: ['Social media management', 'Google Search and display', 'Meta campaigns', 'Influencer outreach'],
    solves:
      'Traffic arrives and leaves without doing anything, and the reporting talks about reach instead of revenue. Digital work makes the path obvious and ties the spend to a number the business already cares about.',
    accent: 'lime',
    cases: ['global-opportunities', 'thrivedx', 'byd-kristan-auto'],
  },
  {
    id: 'public-relations',
    name: 'Public Relations',
    blurb:
      'Earned coverage in the national press, founder positioning and industry commentary. We build the story first, then place it where your buyers read.',
    capabilities: ['Media relations', 'Founder positioning', 'Press releases', 'Industry commentary'],
    solves:
      'Nobody outside your paid audience has heard of you. PR earns third-party credibility, which is the only kind buyers actually weight.',
    accent: 'orange',
    cases: ['bmw-bavaria-motors', 'byd-kristan-auto', 'thinkcyber-india'],
  },
  {
    id: 'technology',
    name: 'Technology',
    blurb:
      'Technology development innovation is our strength. If the technology isn’t available on the market, in some cases, we create it.',
    capabilities: ['Websites', 'Ecommerce builds', 'ERP dashboards', 'Analytics setup'],
    solves:
      'The idea is agreed and then nothing can be shipped, because the platform it needs does not exist or does not fit. We build the site, the store or the dashboard ourselves, so the strategy is not trimmed to whatever software allows.',
    accent: 'violet',
    cases: ['ageless-digital', 'global-opportunities', 'audi-gurugram'],
  },
  {
    id: 'video',
    name: 'Video',
    blurb:
      'Motion, film and animation, from event coverage and ad films to memoirs, CSR films and 3D motion, produced by the same team that writes the strategy.',
    capabilities: ['Brand films', 'Ad films', 'Event coverage', 'Motion and 3D graphics'],
    solves:
      'The story needs more than a still frame to land. Film and motion carry tone and demonstration in a way copy alone cannot, and it is produced by the same team that wrote the strategy.',
    accent: 'lime',
    cases: ['bmw-bavaria-motors', 'audi-gurugram', 'dji-india'],
  },
]

export const serviceById = (id: ServiceId) => services.find((s) => s.id === id)!

/* ---------------------------------------------------------------- */
/* Brands we work with                                                */
/* ---------------------------------------------------------------- */

/**
 * The full client roster, eight sectors deep.
 *
 * `logo` is null on every entry today: no mark for these brands exists as a file in
 * this repo and none carries written permission to republish, so the band renders
 * wordmarks. The shape takes logo paths unchanged the moment approved files land.
 */
export const brandsIntro =
  'Hospitality, fintech, automotive, airlines, consumer, education, real estate and industry bodies. Automotive engagements are with authorised dealer and distributor partners.'

export const brandRoster: { sector: string; brands: string[] }[] = [
  {
    sector: 'Hospitality',
    brands: ['Roseate Hotels & Resorts', 'Junoon', 'Melia', 'The Hubb Dubai', 'Doha Gymkhana', 'The Royal Plaza'],
  },
  {
    sector: 'Fintech',
    brands: ['DPNC Global', 'Paytm', 'Namaste Credit', 'RenewBuy', 'Recomm', 'Client Associates'],
  },
  {
    sector: 'Automotive',
    brands: ['BMW', 'MINI', 'Audi', 'Mahindra', 'BYD', 'Renault'],
  },
  {
    sector: 'Organisation',
    brands: [
      'GS1 India',
      'FICSI',
      'Media & Entertainment Skills Council',
      'CG Corp Global',
      'CG Foods',
      'ITC Limited',
    ],
  },
  {
    sector: 'Airlines',
    brands: ['Pradhaan Air Express', 'Vistara', 'Garuda Indonesia', 'Thai Smile', 'Air Works', 'Air Tanzania'],
  },
  {
    sector: 'Consumer',
    brands: ['Nescafé', 'Exo', 'DJI', 'Insta360', 'Wai Wai', 'One Earth Hygiene'],
  },
  {
    sector: 'Education',
    brands: ['Inkclick', 'Chanakya IAS Academy', 'Global Opportunities', 'ThinkCyber India', 'ThriveDx'],
  },
  {
    sector: 'Real Estate',
    brands: ['Avtara Homes', 'Cyberhub', 'Ramprastha Real Estate', 'Attalika', 'Realsta'],
  },
]

/* ---------------------------------------------------------------- */
/* Craft proof                                                        */
/* ---------------------------------------------------------------- */

/**
 * Credentials work that has no case study of its own.
 *
 * Reuses the discipline-grid treatment from the services band. Seven entries, not
 * six: the copy deck describes the layout as the six-card grid but supplies Logo
 * Creation and Logo Revamp as separate lines, and merging them would drop the
 * distinction between new marks and rebuilds.
 */
export const craftIntro =
  'The work behind the case studies — marks drawn, systems written, feeds run, coverage placed and platforms built.'

export const craftProof: { title: string; body: string }[] = [
  {
    title: 'Logo Creation',
    body: 'Avtara Homes, Complete Sports Solutions, Pradhaan Air Express, Biogiene, Shipyagri, Attalika, Maktub, Ramprastha, Datstop.',
  },
  {
    title: 'Logo Revamp',
    body: 'SLS Skyways Group to SLS India. Travel House to International Travel House.',
  },
  {
    title: 'Brand Guidelines',
    body: 'Corporate master systems for International Travel House, Avtara Homes and Shipyaari.',
  },
  {
    title: 'Social Media',
    body: 'Intersekt with the Axor Showers series, Avtara Homes, Realsta, DJI, BMW, Insta360, Shipyagri, Truth Ventures.',
  },
  {
    title: 'Digital Marketing',
    body: 'Google Search for Audi Gurugram, BMW and MINI Bird Automotive, Diyos Hospital and Ferticity. Meta and display across the roster.',
  },
  {
    title: 'Public Relations',
    body: 'Daalchini Technologies in Financial Express, Outlook, BW Disrupt and PTI. RenewBuy in ETCIO and ET Tech. Supply chain commentary in TOI, Indian Express and Mint.',
  },
  {
    title: 'Technology',
    body: 'Websites for Recomm, Truth Ventures, BioXcel, Moti Jewels Palace, My Logistics Gurukul, Avtara Homes and Global Opportunities. Ecommerce for Yugen and AV. The DataKart ERP dashboard for GS1 India.',
  },
]

/* ---------------------------------------------------------------- */
/* Process                                                            */
/* ---------------------------------------------------------------- */

export const processIntro =
  'Kairos means the supreme moment, the right thing said at the right time. Our process exists to find that moment for your brand, then build everything around it. Believe. Repeat.'

/**
 * `stage` is the step's own name in the copy deck; `title` is the label it carries on
 * screen. No week numbers: timelines are scoped per engagement and put in writing
 * before anything starts, so publishing a fixed calendar here would contradict that.
 */
export const processSteps = [
  {
    index: '01',
    stage: 'Observe',
    title: 'Listen',
    body: 'We start with your team and your customers. We come back with what people actually say about you, not what the deck claims.',
    motif: 'Sound and signal enter the form. Nothing is sorted yet.',
    clientDecision: 'You nominate the customers and team members we speak to.',
  },
  {
    index: '02',
    stage: 'Reflect and discuss',
    title: 'Distil',
    body: 'We narrow everything to one defensible position and the proof points that hold it up. You approve this before anything gets designed.',
    motif: 'Noise compresses into one sharp object.',
    clientDecision: 'Approval gate: you sign off the position and proof points before design starts.',
  },
  {
    index: '03',
    stage: 'Plan and act',
    title: 'Build',
    body: 'Identity, messaging, site and campaign assets get made in parallel by the same senior team, so nothing drifts out of sync.',
    motif: 'Components assemble into one system.',
    clientDecision: 'Two review rounds: first creative, then near-final.',
  },
  {
    index: '04',
    stage: 'Impact',
    title: 'Hand over',
    body: 'You get the files, the guidelines and a working session, so your team can run it without calling us every week.',
    motif: 'The system expands into reusable modules and leaves the room.',
    clientDecision: 'Handover session with the team who will run it day to day.',
  },
]

export const objectionsIntro = 'We would rather deal with these now than pretend they do not come up.'

export const objections = [
  {
    q: 'We can’t afford a full rebrand right now.',
    a: 'Then do not do one. A great deal can be moved by positioning and messaging alone, and that is often the part that shifts the numbers. Identity can follow next year if it still matters.',
  },
  {
    q: 'We already have an in-house design team.',
    a: 'Good, that makes this leaner. We do the strategy and the master system, your team executes it day to day. Several of our clients work with us exactly this way, two or three times a year.',
  },
  {
    q: 'Agencies always overrun and overcharge.',
    a: 'Fair. Scope and fee are agreed in writing before we start, and you will see the full number before you commit to anything. Nothing gets built on a brief you have not signed off.',
  },
  {
    q: 'We need results, not another strategy deck.',
    a: 'The deck is a by-product. What you actually receive is a live site, a working brand system, campaign assets and a team that knows how to use them. Nine engagements, written up with numbers.',
  },
]

export const faqs = [
  {
    q: 'What does a typical engagement cost?',
    a: 'It depends entirely on scope. A positioning and messaging project is a fraction of a full brand build with identity, site and launch assets. Either way you get a number in writing after the first call.',
  },
  {
    q: 'How long until we see something?',
    a: 'It depends on scope, and we put a timeline in writing before anything starts. As a rule, strategic direction comes before creative, and creative comes before build, so nothing is designed on an unapproved position.',
  },
  {
    q: 'Who actually does the work?',
    a: 'The senior people you meet on the call. We are a pack of creativity-driven and execution-strong professionals — passionate marketers, project managers, creatives and designers. No junior handoff after the pitch.',
  },
  {
    q: 'Do you build websites and technology, or only campaigns?',
    a: 'Both. We have built ten websites, two ecommerce stores and the DataKart ERP dashboard for GS1 India, and we run the campaigns that point at them. If the technology isn’t available, in some cases we create it.',
  },
  {
    q: 'Do you work with companies outside India?',
    a: 'Yes. We have offices in Delhi, Dubai and Mumbai, and we have worked across India, Bangladesh, Sri Lanka and the UAE. We run remote engagements with a standing overlap window for calls.',
  },
  {
    q: 'What if we only need one thing — just a video, or just the site?',
    a: 'That is fine, and it is often the smart way to start. We will tell you honestly if the piece you are asking for will not work without the strategy underneath it, but the decision stays yours.',
  },
  {
    q: 'What happens on the first call?',
    a: 'Thirty minutes, no deck. You describe what is stuck, we ask questions, and you leave with at least one useful observation whether or not you hire us. If it is not a fit, we will say so and point you somewhere better.',
  },
]

export const contact = {
  headline: 'Looking to create momentum? Let’s work.',
  body: 'Thirty minutes, no pitch deck, no obligation. Describe the brand and what is not landing, and you will leave the call with a clear read on the problem, whether or not you work with us.',
  promises: [
    'A senior lead on the call, not a salesperson',
    'Scope and fee agreed in writing before you commit',
    'An honest no if we are not the right fit',
  ],
  formTitle: 'Book your 30-minute call',
  formNote: 'No deck, no obligation. Describe the brand and what is not landing, in a couple of sentences.',
  privacyNote: 'We use your details to reply to this enquiry and nothing else. No lists, no resale.',
  budgets: ['Prefer not to say', 'Under ₹2L', '₹2L – ₹5L', '₹5L – ₹15L', '₹15L+'],
} as const
