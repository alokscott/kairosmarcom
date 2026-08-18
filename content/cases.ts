import type { CaseStudy } from './types'

/**
 * All nine case studies, migrated verbatim from kairosmarcom.com/new/case.php?s={slug}
 * (audited 2026-08-05).
 *
 * Content-integrity rules applied:
 *  - Every claim, figure and provenance note is reproduced as published.
 *  - Indian digit grouping is preserved in `display` (8,83,626 / 5,86,554 / 4,74,754).
 *  - Fields the source never stated are `null` / `[]` and listed in `openItems`.
 *  - Nothing here was inferred, rounded, or written to fill a gap.
 *
 * Known source-wide gaps, carried on every record: no project imagery, no client
 * testimonials, no engagement years, no stated insight section.
 *
 * seo.title carries no "| Kairos Marcom" suffix — the root layout's title template
 * appends it, and baking it in here produced it twice.
 */

const NO_ASSETS = [
  'No project imagery exists on the source site — hero and gallery need client-approved assets.',
  'No client testimonial published — requires client approval before any quote is added.',
  'Engagement year not stated on the source site — confirm with the account lead.',
  'No research/insight section on the source site — supply or leave hidden.',
]

export const cases: CaseStudy[] = [
  {
    slug: 'ageless-digital',
    client: 'Ageless Digital',
    projectTitle: 'Operations platform & mobile app',
    industry: null,
    location: null,
    year: null,
    duration: 'Ongoing engagement',
    summary: 'One panel for sale, purchase, field-team and finance data — plus the app the team runs on.',
    clientDescription:
      'Ageless Digital Private Limited runs a field sales operation where the numbers that matter — what was sold, what was bought, where the regional sales team is and what it costs — lived in different places. We designed and built the system that puts them in one.',
    tags: ['Product design', 'Platform', 'Mobile app'],
    services: ['digital', 'creative-design'],
    channels: [],
    headline: [],
    objective: [
      'Give the business a single place to track sale and purchase data, rather than reconciling it after the fact.',
      'Track the regional sales team — activity, location and the finance attached to it — as it happens.',
      'Put the same system in the field team’s hands, not just on a desk.',
    ],
    challenge: [],
    insight: null,
    strategy: [
      'Designed and developed the operations panel: sale and purchase data tracked end to end, in one view.',
      'Built RSM tracking into it — regional sales manager activity, location and associated finance, reported together instead of separately.',
      'Designed the companion mobile app so the field team works from the same data the panel reports on.',
    ],
    deliverables: [],
    results: [
      'Sale and purchase tracking runs through a single panel.',
      'RSM activity, location and finance report from one system rather than three.',
      'The mobile app is designed and delivered alongside the panel, on the same data.',
    ],
    charts: [],
    metricSource: null,
    scene: 'case-platform',
    accent: 'lime',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'Ageless Digital — operations platform & mobile app',
      description:
        'Kairos designed and built one operations panel for Ageless Digital: sale, purchase, regional-sales-team and finance data in a single view, plus the field app that runs on it.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: [
      ...NO_ASSETS,
      'Industry not stated on the source site — confirm the sector label before publishing.',
      'No brand-challenge section published for this study.',
      'No measured results module — outcomes are qualitative only.',
    ],
  },

  {
    slug: 'bmw-bavaria-motors',
    client: 'BMW Bavaria Motors',
    projectTitle: 'BMW Bavaria Motors',
    industry: 'Automotive retail',
    location: 'Pune, Goa & Aurangabad',
    year: null,
    duration: null,
    summary:
      'Instagram reach of 1.3M with 8,83,626 engagements, and a lead pipeline built from zero to 45–50 a month.',
    clientDescription:
      'BMW Bavaria is the authorised dealer of BMW cars in Pune, Goa and Aurangabad. BMW is one of the world’s most premium car marques.',
    tags: ['Digital', 'Social', 'Video', 'Lead gen'],
    services: ['branding', 'digital', 'creative-design', 'video', 'public-relations'],
    channels: [
      { platform: 'Facebook', handle: '@BMWBAVARIAMOTORS' },
      { platform: 'Instagram', handle: '@bmw_bavaria_motors' },
      { platform: 'LinkedIn', handle: '@BMW-Bavaria-Motors' },
    ],
    headline: [
      { value: '1.3M', label: 'Instagram reach' },
      { value: '8,83,626', label: 'engagements' },
      { value: '45–50', label: 'leads per month, from zero' },
    ],
    objective: [
      'Create and maintain the brand’s digital presence across three cities — Pune, Aurangabad and Goa.',
      'Run activity that builds awareness and increases brand engagement.',
      'Collaborate with creators on influencer activity to attract customers and lift brand presence.',
      'Generate leads.',
      'Offline events, video creation and social media growth.',
    ],
    challenge: [
      'Low engagement and reach.',
      'No creative marketing approach in place.',
      'Lead generation needed to be broken down model by model.',
    ],
    insight: null,
    strategy: [
      'Built the brand’s digital presence through websites and landing pages.',
      'Created social media pages for each location, on a content calendar built to give followers something worth following.',
      'Ran influencer and media outreach for awareness and visibility, and to earn genuine followers rather than bought ones.',
      'Targeted paid activity across social and Google to generate quality lead data.',
    ],
    deliverables: [],
    results: [
      'Interested leads increased from 0 to 45–50 per month.',
      'Conversion of leads into sales increased from 0 to 7–8 per month.',
      'Instagram account reach increased to 1.3M, with 8,83,626 engagements.',
    ],
    charts: [
      {
        id: 'qualified-leads',
        title: 'Qualified leads per month',
        takeaway: 'From no pipeline at all to a steady monthly number.',
        unit: 'qualified leads per month',
        kind: 'before-after',
        points: [
          { label: 'Before', value: 0, display: '0' },
          { label: 'After', value: 50, display: '45–50' },
        ],
      },
      {
        id: 'leads-to-sales',
        title: 'Leads converted to sales, per month',
        takeaway: 'The same pipeline, measured at the end of the funnel.',
        unit: 'sales per month',
        kind: 'before-after',
        points: [
          { label: 'Before', value: 0, display: '0' },
          { label: 'After', value: 8, display: '7–8' },
        ],
      },
      {
        id: 'reach-by-channel',
        title: 'Reach by channel, one week',
        takeaway:
          '56 pieces of content published that week — 3 Facebook posts, 5 Instagram posts, 15 and 12 stories, 21 ads.',
        unit: 'accounts reached',
        kind: 'category',
        points: [
          { label: 'Instagram', value: 194100, display: '194.1K' },
          { label: 'Facebook', value: 117700, display: '117.7K' },
        ],
      },
    ],
    metricSource:
      'Meta and Instagram account analytics for the week of 12–18 Nov, as reported in the platform dashboards. Lead and sales figures are as reported by the client.',
    scene: 'case-automotive',
    accent: 'orange',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'BMW Bavaria Motors — 1.3M reach, 45–50 leads a month',
      description:
        'How Kairos built BMW Bavaria Motors’ digital presence across Pune, Goa and Aurangabad: 1.3M Instagram reach, 8,83,626 engagements and a lead pipeline from zero to 45–50 a month.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: NO_ASSETS,
  },

  {
    slug: 'dji-india',
    client: 'DJI India',
    projectTitle: 'DJI India',
    industry: 'Consumer technology',
    location: 'India, Bangladesh & Sri Lanka',
    year: null,
    duration: 'First six months of the engagement',
    summary: '15,000 followers in under six months and a 285% lift in conversions across three countries.',
    clientDescription:
      'DJI India is the authorised importer and distributor of DJI in India. DJI is an international brand known for its gimbal and camera technology.',
    tags: ['Digital', 'Social', 'Influencer'],
    services: ['branding', 'digital', 'creative-design', 'video', 'public-relations'],
    channels: [
      { platform: 'Instagram', handle: '@djiindiashop' },
      { platform: 'Facebook', handle: '@DJIIndiaShop' },
    ],
    headline: [
      { value: '15k+', label: 'followers in under 6 months' },
      { value: '700k+', label: 'video views' },
      { value: '285%', label: 'increase in conversions' },
    ],
    objective: [
      'Create and maintain the brand’s digital presence across three countries — India, Bangladesh and Sri Lanka.',
      'Run activity that builds awareness and increases brand engagement.',
      'Collaborate with creators on influencer activity to attract customers and lift brand presence.',
    ],
    challenge: ['Low engagement and reach.', 'No creative marketing approach in place.', 'No regional digital presence.'],
    insight: null,
    strategy: [
      'Built the brand’s digital presence through websites and landing pages.',
      'Created social media pages for each location, on a content calendar built to give followers something worth following.',
      'Collaborated with creators to promote the brand and grow its organic reach.',
    ],
    deliverables: [],
    results: [
      '15k+ followers for the brand in less than six months.',
      'More than 700k video views and 5,86,554 engagements.',
      'Social media engagement increased 5×.',
      'Offline store location searches increased 8×.',
      'Conversions increased by 285%.',
    ],
    charts: [
      {
        id: 'reach-by-channel',
        title: 'Reach by channel, one week',
        takeaway: '32 pieces of content published that week — 8 Facebook posts, 8 Instagram posts, 6 stories, 10 ads.',
        unit: 'accounts reached',
        kind: 'category',
        points: [
          { label: 'Instagram', value: 206400, display: '206.4K' },
          { label: 'Facebook', value: 80900, display: '80.9K' },
        ],
      },
      {
        id: 'audience-added',
        title: 'Audience added that week',
        takeaway: 'New page likes and follows, 12–18 Nov.',
        unit: 'new followers',
        kind: 'category',
        points: [
          { label: 'Facebook page likes', value: 690, display: '690' },
          { label: 'Instagram followers', value: 419, display: '419' },
        ],
      },
    ],
    metricSource:
      'Meta and Instagram account analytics for the week of 12–18 Nov, as reported in the platform dashboards. Follower, view and conversion figures cover the first six months of the engagement.',
    scene: 'case-optics',
    accent: 'violet',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'DJI India — 15k followers, 285% more conversions',
      description:
        'Kairos built DJI’s regional digital presence across India, Bangladesh and Sri Lanka: 15k+ followers in under six months, 700k+ video views and a 285% lift in conversions.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: NO_ASSETS,
  },

  {
    slug: 'insta360-india',
    client: 'Insta360 India',
    projectTitle: 'Insta360 India',
    industry: 'Consumer technology',
    location: 'India',
    year: null,
    duration: null,
    summary: '20M+ impressions and 3× the social media engagement of previous campaigns.',
    clientDescription:
      'Insta360 India is the authorised importer and distributor of Insta360 in India. Insta360 is an international brand known for its 360 camera technology, across a wide range of products including action cameras.',
    tags: ['Digital', 'Social', 'Influencer'],
    services: ['branding', 'digital', 'creative-design', 'video', 'public-relations'],
    channels: [
      { platform: 'Instagram', handle: '@insta360india' },
      { platform: 'Facebook', handle: '@Insta360IndiaOfficial' },
    ],
    headline: [
      { value: '20M+', label: 'impressions' },
      { value: '13k', label: 'Instagram followers' },
      { value: '2.90%', label: 'average engagement rate' },
    ],
    objective: [
      'Create and maintain the brand’s digital presence.',
      'Run activity that builds awareness and increases brand engagement.',
      'Collaborate with creators on influencer activity to attract customers and lift brand presence.',
    ],
    challenge: ['Low engagement and reach.', 'No creative marketing approach in place.', 'No regional digital presence.'],
    insight: null,
    strategy: [
      'Built the brand’s digital presence through websites and landing pages.',
      'Created social media pages for each location, on a content calendar built to give followers something worth following.',
      'Collaborated with creators to promote the brand and grow its organic reach.',
    ],
    deliverables: [],
    results: [
      '13k followers on Instagram, more than 496k video views and 4,74,754 engagements.',
      'Three times the social media engagement of previous campaigns.',
      'Awareness created at scale: 20M+ impressions.',
      'The right audience reached, at a 2.90% average engagement rate.',
      'Deeply engaged consumers: an average engagement time of 48 seconds.',
    ],
    charts: [
      {
        id: 'reach-by-channel',
        title: 'Reach by channel, one week',
        takeaway: '45 pieces of content published that week — 12 Facebook posts, 12 Instagram posts, 11 stories, 10 ads.',
        unit: 'accounts reached',
        kind: 'category',
        points: [
          { label: 'Instagram', value: 165000, display: '165.0K' },
          { label: 'Facebook', value: 115600, display: '115.6K' },
        ],
      },
      {
        id: 'audience-added',
        title: 'Audience added that week',
        takeaway: 'New page likes and follows, 12–18 Nov.',
        unit: 'new followers',
        kind: 'category',
        points: [
          { label: 'Facebook page likes', value: 980, display: '980' },
          { label: 'Instagram followers', value: 658, display: '658' },
        ],
      },
    ],
    metricSource:
      'Meta and Instagram account analytics for the week of 12–18 Nov, as reported in the platform dashboards. Impression, engagement-rate and dwell-time figures cover the campaign period.',
    scene: 'case-optics',
    accent: 'lime',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'Insta360 India — 20M+ impressions, 3× engagement',
      description:
        'Kairos ran Insta360 India’s digital presence to 20M+ impressions, 13k Instagram followers and a 2.90% average engagement rate — triple the engagement of previous campaigns.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: NO_ASSETS,
  },

  {
    slug: 'global-opportunities',
    client: 'Global Opportunities',
    projectTitle: 'Global Opportunities',
    industry: 'Education consulting',
    location: 'India & Nepal',
    year: null,
    duration: null,
    summary: 'Cost per lead cut from ₹2,000 to ₹650, with 3M profile impressions on Instagram.',
    clientDescription:
      'Global Opportunities is India’s pioneer education consulting group, handling student recruitment from India and Nepal for 700+ institutions and university partners across the globe.',
    tags: ['Performance', 'Social', 'Landing pages'],
    services: ['branding', 'digital', 'creative-design', 'video', 'public-relations', 'technology'],
    channels: [
      { platform: 'Instagram', handle: '@global.opportunities' },
      { platform: 'Facebook', handle: '@GlobalOpportunitie' },
    ],
    headline: [
      { value: '₹2,000 → ₹650', label: 'cost per lead' },
      { value: '3M', label: 'Instagram profile reach' },
      { value: '2.6M', label: 'Facebook profile reach' },
    ],
    objective: [
      'Generate quality leads at a low cost.',
      'Create and maintain the digital and social presence.',
      'Run activity that builds awareness and increases brand engagement.',
    ],
    challenge: ['Cost per lead was very high.', 'No quality content on social media to earn engagement.'],
    insight: null,
    strategy: [
      'Built the brand’s digital presence through landing pages.',
      'Changed the targeting and keyword strategy to match the real audience.',
      'Created Instagram reels to earn more views and engagement.',
    ],
    deliverables: [],
    results: [
      'Cost per lead went from ₹2,000 to ₹650.',
      'Engagement on Instagram increased.',
      'Profile reach reached 2.6M on Facebook and 3M on Instagram.',
      'Lead quality rose, which is what actually moved conversions.',
    ],
    charts: [
      {
        id: 'cost-per-lead',
        title: 'Cost per lead',
        takeaway: 'Lower is better. Rebuilding the targeting and keyword strategy is what moved it.',
        unit: 'rupees per lead',
        kind: 'before-after',
        lowerIsBetter: true,
        points: [
          { label: 'Before', value: 2000, display: '₹2,000' },
          { label: 'After', value: 650, display: '₹650' },
        ],
      },
      {
        id: 'reach-by-format',
        title: 'Instagram post reach by format',
        takeaway:
          'Reels earned the most reach of the three formats, which is why the content plan shifted towards them.',
        unit: 'average accounts reached per post',
        kind: 'category',
        points: [
          { label: 'Reel', value: 11000, display: '11K' },
          { label: 'Photo', value: 9700, display: '9.7K' },
          { label: 'Video', value: 1800, display: '1.8K' },
        ],
      },
      {
        id: 'instagram-impressions',
        title: 'Instagram profile impressions',
        takeaway: 'Against the previous comparable period.',
        unit: 'impressions',
        kind: 'period',
        points: [
          { label: 'Previous period', value: 272000, display: '272K' },
          { label: 'This period', value: 3000000, display: '3M' },
        ],
      },
      {
        id: 'facebook-reach',
        title: 'Facebook total reach',
        takeaway: 'Against the previous comparable period.',
        unit: 'accounts reached',
        kind: 'period',
        points: [
          { label: 'Previous period', value: 277000, display: '277K' },
          { label: 'This period', value: 2600000, display: '2.6M' },
        ],
      },
    ],
    metricSource:
      'Cost per lead as reported by the client; reach, impression and post-format figures from Meta and Instagram account analytics, measured against the previous comparable period.',
    scene: 'case-education',
    accent: 'orange',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'Global Opportunities — cost per lead ₹2,000 to ₹650',
      description:
        'Kairos rebuilt targeting, keywords and landing pages for Global Opportunities: cost per lead fell from ₹2,000 to ₹650 while Instagram profile reach grew to 3M.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: NO_ASSETS,
  },

  {
    slug: 'audi-gurugram',
    client: 'Audi Gurugram',
    projectTitle: 'Audi Gurugram',
    industry: 'Automotive retail',
    location: 'Delhi-NCR',
    year: null,
    duration: null,
    summary: 'Instagram reach of 2.1M, with 2M accounts reached in a single thirty-day window.',
    clientDescription:
      'Audi Gurugram is the authorised dealer of Audi cars in Gurugram. The Audi Group is among the world’s leading producers of premium cars.',
    tags: ['Digital', 'Social', 'Lead gen', 'Events'],
    services: ['branding', 'digital', 'creative-design', 'video', 'public-relations'],
    channels: [
      { platform: 'Facebook', handle: '@AudiGurugram' },
      { platform: 'Instagram', handle: '@audi_gurugram' },
      { platform: 'LinkedIn', handle: '@Audi-Gurugram' },
    ],
    headline: [
      { value: '2.1M', label: 'Instagram reach' },
      { value: '45–50', label: 'leads per month, from zero' },
      { value: '7–8', label: 'sales per month, from zero' },
    ],
    objective: [
      'Create and maintain the brand’s digital presence in Delhi-NCR.',
      'Run activity that builds awareness and increases brand engagement.',
      'Generate leads for luxury cars in Delhi-NCR.',
    ],
    challenge: ['Low engagement and reach.', 'Leads were arriving, but not the ones that convert.'],
    insight: null,
    strategy: [
      'Took over the brand’s online presence and managed its social media handles.',
      'Changed the targeting and keyword strategy to narrow the audience.',
      'Built a new audience around product requirements, on the platform where those buyers actually are.',
      'Created a new Instagram form with filtering questions, to weed out uninterested leads before they reached sales.',
      'Produced real-time social content for events organised by Audi Gurugram.',
    ],
    deliverables: [],
    results: [
      'Interested leads increased from 0 to 45–50 per month.',
      'Conversion of leads into sales increased from 0 to 7–8 per month.',
      'Instagram account reach increased to 2.1M.',
    ],
    charts: [
      {
        id: 'qualified-leads',
        title: 'Qualified leads per month',
        takeaway: 'The filtering questions on the enquiry form are what changed the quality.',
        unit: 'qualified leads per month',
        kind: 'before-after',
        points: [
          { label: 'Before', value: 0, display: '0' },
          { label: 'After', value: 50, display: '45–50' },
        ],
      },
      {
        id: 'leads-to-sales',
        title: 'Leads converted to sales, per month',
        takeaway: 'The same pipeline, measured at the end of the funnel.',
        unit: 'sales per month',
        kind: 'before-after',
        points: [
          { label: 'Before', value: 0, display: '0' },
          { label: 'After', value: 8, display: '7–8' },
        ],
      },
    ],
    metricSource:
      'Lead and sales figures as reported by the client; reach from the brand’s Instagram account analytics.',
    scene: 'case-automotive',
    accent: 'violet',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'Audi Gurugram — 2.1M reach, 45–50 leads a month',
      description:
        'Kairos rebuilt Audi Gurugram’s targeting and enquiry flow: Instagram reach to 2.1M, and a qualified lead pipeline from zero to 45–50 a month with 7–8 converting to sales.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: NO_ASSETS,
  },

  {
    slug: 'byd-kristan-auto',
    client: 'BYD Kristan Auto',
    projectTitle: 'BYD Kristan Auto',
    industry: 'Electric vehicles',
    location: 'Gurugram',
    year: null,
    duration: 'First two months from launch',
    summary: '238,913 accounts reached on Instagram in two months, from no digital presence at all.',
    clientDescription:
      'BYD Kristan Auto is the authorised dealer of BYD electric cars in Gurugram. BYD is the fourth largest plug-in electric vehicle company and the fourth largest BEV company in the world.',
    tags: ['Launch', 'Digital', 'Social'],
    services: ['branding', 'digital', 'creative-design', 'video', 'public-relations'],
    channels: [
      { platform: 'Instagram', handle: '@byd.kristanauto' },
      { platform: 'Facebook', handle: '@BYDKristanAuto' },
      { platform: 'LinkedIn', handle: '@BYD-KristanAuto' },
    ],
    headline: [{ value: '238K', label: 'Instagram reach in 2 months' }],
    objective: [
      'Create and maintain the digital and social presence of BYD Kristan Auto.',
      'Run activity that builds awareness and increases brand engagement.',
      'Generate leads for EV cars in Delhi-NCR.',
    ],
    challenge: ['No digital presence.', 'No brand presence to generate quality leads from.'],
    insight: null,
    strategy: [
      'Built the brand’s digital presence through websites and landing pages.',
      'Created their social media pages, with content built to give followers something worth following.',
      'Built an audience around product requirements, on the platform where those buyers actually are.',
    ],
    deliverables: [],
    results: [
      'The Instagram account reached 238K in two months.',
      'Collaborated with media and influencers to promote the brand and grow its organic reach.',
      'Generated quality leads to book their newly launched car.',
    ],
    charts: [
      {
        id: 'instagram-reach',
        title: 'Instagram accounts reached',
        takeaway: 'From no digital presence at all, inside the first two months.',
        unit: 'accounts reached',
        kind: 'before-after',
        points: [
          { label: 'At launch', value: 0, display: '0' },
          { label: 'After 2 months', value: 238913, display: '238,913' },
        ],
      },
      {
        id: 'reach-by-channel',
        title: 'Reach by channel, one week',
        takeaway: '28 pieces of content published that week — 11 Facebook posts, 12 Instagram posts, 5 stories.',
        unit: 'accounts reached',
        kind: 'category',
        points: [
          { label: 'Facebook', value: 75100, display: '75.1K' },
          { label: 'Instagram', value: 67500, display: '67.5K' },
        ],
      },
    ],
    metricSource:
      'Meta and Instagram account analytics for the week of 12–18 Nov, as reported in the platform dashboards. The two-month reach figure is from the brand’s Instagram account analytics.',
    scene: 'case-ev',
    accent: 'lime',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'BYD Kristan Auto — 238K reach from a standing start',
      description:
        'Kairos launched BYD Kristan Auto’s digital and social presence in Gurugram from nothing: 238,913 Instagram accounts reached inside the first two months.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: NO_ASSETS,
  },

  {
    slug: 'thinkcyber-india',
    client: 'ThinkCyber India',
    projectTitle: 'ThinkCyber India',
    industry: 'Cybersecurity education',
    location: 'India',
    year: null,
    duration: 'First four months (1 May – 31 Aug)',
    summary: 'A cold-start market entry with 154 registered users inside two days.',
    clientDescription:
      'ThinkCyber India is the Indian arm of Tel Aviv-based ThinkCyber, delivering cybersecurity education and product solutions.',
    tags: ['Market entry', 'Digital', 'Webinar'],
    services: ['branding', 'digital', 'creative-design', 'video', 'public-relations'],
    channels: [
      { platform: 'Instagram', handle: '@thinkcyber.india' },
      { platform: 'Facebook', handle: '@ThinkCyberIndia' },
    ],
    headline: [
      { value: '154', label: 'registrations in 2 days' },
      { value: '100+', label: 'concurrent live viewers' },
    ],
    objective: [
      'Launch the brand in the Indian market.',
      'Create and maintain the digital and social presence of ThinkCyber India.',
      'Run activity that builds awareness and increases brand engagement.',
    ],
    challenge: [
      'No digital or social presence in the Indian market.',
      'No brand awareness to generate quality leads from.',
    ],
    insight: null,
    strategy: [
      'Built the brand’s digital presence through websites and landing pages.',
      'Created their social media pages, with content built to give followers something worth following.',
      'Organised a webinar to build awareness among students and professionals.',
    ],
    deliverables: [],
    results: [
      'The webinar drew 154 registered users within two days.',
      '100+ concurrent live views during the webinar itself.',
    ],
    charts: [
      {
        id: 'reach-first-four-months',
        title: 'Reach by channel, first four months',
        takeaway: 'A cold start: every one of these numbers was zero before the launch.',
        unit: 'accounts reached',
        kind: 'category',
        points: [
          { label: 'Facebook page', value: 314230, display: '314,230' },
          { label: 'Paid', value: 300606, display: '300,606' },
          { label: 'Instagram', value: 85749, display: '85,749' },
        ],
      },
    ],
    metricSource:
      'Reach from Meta and Instagram account analytics for 1 May – 31 Aug, against a standing start the period before. Webinar figures from the registration platform.',
    scene: 'case-security',
    accent: 'violet',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'ThinkCyber India — market entry, webinar filled in 48 hours',
      description:
        'Kairos launched ThinkCyber India from zero presence: 314,230 Facebook page reach in four months and a webinar that drew 154 registrations in two days.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: NO_ASSETS,
  },

  {
    slug: 'thrivedx',
    client: 'ThriveDx',
    projectTitle: 'ThriveDx',
    industry: 'Professional education',
    location: 'India',
    year: null,
    duration: null,
    summary: '1,000+ leads at an average CPL of ₹45, and 365 webinar registrations in three days.',
    clientDescription:
      'ThriveDx partners with top-tier educational institutions, global enterprises and government agencies to run professional development programmes, equipping the workforce with the digital skills that carry a career.',
    tags: ['Market entry', 'Performance', 'Webinar'],
    services: ['branding', 'digital', 'creative-design', 'video', 'public-relations', 'technology'],
    channels: [
      { platform: 'Instagram', handle: '@thrivedx' },
      { platform: 'LinkedIn', handle: '@ThriveDx' },
    ],
    headline: [
      { value: '1,000+', label: 'leads generated' },
      { value: '₹45', label: 'average cost per lead' },
      { value: '365', label: 'registrations in 3 days' },
    ],
    objective: [
      'Launch the brand in the Indian market.',
      'Create and maintain the digital and social presence of ThriveDx.',
      'Run activity that builds awareness and increases brand engagement.',
    ],
    challenge: [
      'No digital or social presence in the Indian market.',
      'No brand awareness to generate quality leads from.',
    ],
    insight: null,
    strategy: [
      'Built the brand’s digital presence through websites and landing pages.',
      'Created their social media pages, with content built to give followers something worth following.',
      'Organised a webinar to build awareness among students and professionals.',
    ],
    deliverables: [],
    results: [
      'Garnered 1,000+ leads at an average cost per lead of ₹45.',
      'The webinar drew 365 registered users within three days.',
      '450+ concurrent live views during the webinar itself.',
    ],
    charts: [],
    metricSource: null,
    scene: 'case-education',
    accent: 'orange',
    heroImage: null,
    gallery: [],
    videos: [],
    testimonial: null,
    related: [],
    seo: {
      title: 'ThriveDx — 1,000+ leads at ₹45 each',
      description:
        'Kairos launched ThriveDx in India from no presence at all: 1,000+ leads at an average ₹45 cost per lead, and a webinar that drew 365 registrations in three days.',
      socialImage: null,
    },
    state: 'client-approval-required',
    openItems: [
      ...NO_ASSETS,
      'No provenance note published for the lead, cost-per-lead and webinar figures — confirm the source before publishing.',
      'No "The numbers" module on the source study — charts omitted rather than reconstructed.',
    ],
  },
]

export const caseBySlug = (slug: string) => cases.find((c) => c.slug === slug)

/** Site order drives previous/next. */
export const caseIndex = (slug: string) => cases.findIndex((c) => c.slug === slug)

export function caseNeighbours(slug: string) {
  const i = caseIndex(slug)
  return { previous: i > 0 ? cases[i - 1] : null, next: i >= 0 && i < cases.length - 1 ? cases[i + 1] : null }
}

/**
 * Related work. Uses the CMS `related` list when an editor has set one, otherwise
 * falls back to same-industry, then shared tags. Never returns the study itself.
 */
export function relatedCases(slug: string, limit = 3): CaseStudy[] {
  const self = caseBySlug(slug)
  if (!self) return []
  if (self.related.length) return self.related.map(caseBySlug).filter((c): c is CaseStudy => Boolean(c)).slice(0, limit)

  const others = cases.filter((c) => c.slug !== slug)
  const score = (c: CaseStudy) =>
    (c.industry && c.industry === self.industry ? 10 : 0) + c.tags.filter((t) => self.tags.includes(t)).length
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit)
}
