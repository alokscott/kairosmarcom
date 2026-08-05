/**
 * CMS schema for Kairos Marcom (Sanity dialect).
 *
 * This is the authoring layer for the same shape as `content/types.ts`. The site
 * currently reads typed content modules, which is why it builds and deploys with no
 * CMS credentials; dropping these schemas into a Sanity studio and swapping the
 * three loaders in `content/` for GROQ queries is the only change needed to move
 * editing into the CMS. The templates do not change, because the shape does not.
 *
 * Two rules are enforced here rather than left to editor discipline:
 *
 *  1. A metric chart cannot be saved without a written takeaway and the numbers'
 *     provenance. The brief forbids a chart without either, so the schema refuses one.
 *  2. `state` is required and defaults to `draft`. Publishing is a deliberate act.
 *
 * Not enforceable in a schema, and therefore in docs/09-content-migration.md instead:
 * no figure may be re-typed as independently verified when the source recorded it as
 * client-reported.
 */

const CONTENT_STATES = [
  { title: 'Draft', value: 'draft' },
  { title: 'Internal review', value: 'internal-review' },
  { title: 'Client approval required', value: 'client-approval-required' },
  { title: 'Approved', value: 'approved' },
  { title: 'Published', value: 'published' },
  { title: 'Archived', value: 'archived' },
]

const SERVICE_IDS = [
  { title: 'Creative Design', value: 'creative-design' },
  { title: 'Branding', value: 'branding' },
  { title: 'Digital', value: 'digital' },
  { title: 'Public Relations', value: 'public-relations' },
  { title: 'Media', value: 'media' },
  { title: 'Video', value: 'video' },
]

const SCENE_PRESETS = [
  'core',
  'principle',
  'constellation',
  'case-automotive',
  'case-optics',
  'case-education',
  'case-security',
  'case-platform',
  'case-ev',
  'metrics',
  'film',
  'process',
  'contact',
].map((value) => ({ title: value, value }))

const ACCENTS = ['orange', 'lime', 'violet', 'silver'].map((value) => ({ title: value, value }))

/* ------------------------------------------------------------------ */
/* Objects                                                             */
/* ------------------------------------------------------------------ */

export const metricPoint = {
  name: 'metricPoint',
  title: 'Metric point',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (R: Rule) => R.required() },
    {
      name: 'value',
      title: 'Numeric value',
      type: 'number',
      description: 'Drives bar length only. For a range like 45–50, enter the upper bound.',
      validation: (R: Rule) => R.required().min(0),
    },
    {
      name: 'display',
      title: 'Published figure',
      type: 'string',
      description: 'Exactly as published, including Indian digit grouping — e.g. 8,83,626 or 45–50 or ₹2,000.',
      validation: (R: Rule) => R.required(),
    },
  ],
  preview: { select: { title: 'label', subtitle: 'display' } },
}

export const metricChart = {
  name: 'metricChart',
  title: 'Metric chart',
  type: 'object',
  fields: [
    { name: 'id', title: 'ID', type: 'slug', options: { source: 'title' }, validation: (R: Rule) => R.required() },
    { name: 'title', title: 'Chart title', type: 'string', validation: (R: Rule) => R.required() },
    {
      name: 'takeaway',
      title: 'Written takeaway',
      type: 'text',
      rows: 2,
      description: 'What this chart means in one sentence. Required — a chart without one cannot ship.',
      validation: (R: Rule) => R.required().min(10),
    },
    {
      name: 'unit',
      title: 'Unit',
      type: 'string',
      description: 'What the numbers count, e.g. "accounts reached". Announced to screen readers.',
      validation: (R: Rule) => R.required(),
    },
    {
      name: 'kind',
      title: 'Comparison type',
      type: 'string',
      options: {
        list: [
          { title: 'Before / after', value: 'before-after' },
          { title: 'Category', value: 'category' },
          { title: 'Period over period', value: 'period' },
        ],
        layout: 'radio',
      },
      validation: (R: Rule) => R.required(),
    },
    {
      name: 'lowerIsBetter',
      title: 'Lower is better',
      type: 'boolean',
      description: 'Tick for cost metrics, so the smaller bar is the one highlighted.',
      initialValue: false,
    },
    {
      name: 'points',
      title: 'Points',
      type: 'array',
      of: [{ type: 'metricPoint' }],
      validation: (R: Rule) => R.required().min(2),
    },
  ],
  preview: { select: { title: 'title', subtitle: 'takeaway' } },
}

export const galleryItem = {
  name: 'galleryItem',
  title: 'Gallery item',
  type: 'object',
  fields: [
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (R: Rule) => R.required() },
    {
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'What the image shows. Required — decorative-only images do not belong in a case gallery.',
      validation: (R: Rule) => R.required(),
    },
    { name: 'caption', title: 'Caption', type: 'string' },
    { name: 'credit', title: 'Credit', type: 'string' },
    {
      name: 'approved',
      title: 'Client-approved for publication',
      type: 'boolean',
      initialValue: false,
      description: 'Unticked images are hidden on the published site.',
    },
  ],
}

export const channel = {
  name: 'channel',
  title: 'Channel',
  type: 'object',
  fields: [
    { name: 'platform', title: 'Platform', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'handle', title: 'Handle', type: 'string', validation: (R: Rule) => R.required() },
  ],
  preview: { select: { title: 'platform', subtitle: 'handle' } },
}

export const headlineStat = {
  name: 'headlineStat',
  title: 'Headline stat',
  type: 'object',
  fields: [
    { name: 'value', title: 'Value', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'label', title: 'Label', type: 'string', validation: (R: Rule) => R.required() },
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
}

export const testimonial = {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'object',
  description: 'Never publish without written client approval on file.',
  fields: [
    { name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (R: Rule) => R.required() },
    { name: 'name', title: 'Name', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'role', title: 'Role', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'company', title: 'Company', type: 'string', validation: (R: Rule) => R.required() },
    {
      name: 'approvalReference',
      title: 'Approval reference',
      type: 'string',
      description: 'Email or document reference for the written approval.',
      validation: (R: Rule) => R.required(),
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */

export const caseStudy = {
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'narrative', title: 'Narrative' },
    { name: 'results', title: 'Results' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
    { name: 'workflow', title: 'Workflow' },
  ],
  fields: [
    { name: 'slug', title: 'Slug', type: 'slug', group: 'identity', options: { source: 'client' }, validation: (R: Rule) => R.required() },
    { name: 'client', title: 'Client', type: 'string', group: 'identity', validation: (R: Rule) => R.required() },
    { name: 'projectTitle', title: 'Project title', type: 'string', group: 'identity', validation: (R: Rule) => R.required() },
    {
      name: 'industry',
      title: 'Industry',
      type: 'string',
      group: 'identity',
      description: 'Leave empty if the source never stated one. Do not guess — an empty field hides the label.',
    },
    { name: 'location', title: 'Location', type: 'string', group: 'identity' },
    { name: 'year', title: 'Year', type: 'string', group: 'identity' },
    { name: 'duration', title: 'Duration', type: 'string', group: 'identity' },
    {
      name: 'summary',
      title: 'Outcome summary',
      type: 'text',
      rows: 2,
      group: 'identity',
      description: 'One sentence, used on every card. Lead with the result.',
      validation: (R: Rule) => R.required().max(160),
    },
    { name: 'clientDescription', title: 'Client description', type: 'text', rows: 3, group: 'identity', validation: (R: Rule) => R.required() },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], group: 'identity', options: { layout: 'tags' } },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'identity',
      of: [{ type: 'string', options: { list: SERVICE_IDS } }],
      validation: (R: Rule) => R.required().min(1),
    },
    { name: 'channels', title: 'Channels', type: 'array', of: [{ type: 'channel' }], group: 'identity' },

    { name: 'headline', title: 'Headline stats', type: 'array', of: [{ type: 'headlineStat' }], group: 'results' },
    { name: 'objective', title: 'Objective', type: 'array', of: [{ type: 'string' }], group: 'narrative', validation: (R: Rule) => R.required().min(1) },
    { name: 'challenge', title: 'Brand challenge', type: 'array', of: [{ type: 'string' }], group: 'narrative' },
    {
      name: 'insight',
      title: 'Research / insight',
      type: 'text',
      rows: 3,
      group: 'narrative',
      description: 'The module hides entirely when empty. Leave blank rather than writing something plausible.',
    },
    { name: 'strategy', title: 'What we did', type: 'array', of: [{ type: 'string' }], group: 'narrative', validation: (R: Rule) => R.required().min(1) },
    { name: 'deliverables', title: 'What we delivered', type: 'array', of: [{ type: 'string' }], group: 'narrative' },
    { name: 'results', title: 'Impact', type: 'array', of: [{ type: 'string' }], group: 'results', validation: (R: Rule) => R.required().min(1) },
    { name: 'charts', title: 'Metric charts', type: 'array', of: [{ type: 'metricChart' }], group: 'results' },
    {
      name: 'metricSource',
      title: 'Where these figures come from',
      type: 'text',
      rows: 3,
      group: 'results',
      description:
        'Rendered directly beneath the results. State which figures are platform-reported and which are client-reported — they are different kinds of evidence and must not be merged.',
      validation: (R: Rule) =>
        R.custom((value: string | undefined, context: { document?: { charts?: unknown[] } }) =>
          (context.document?.charts?.length ?? 0) > 0 && !value
            ? 'A results module cannot be published without stating where the numbers came from.'
            : true
        ),
    },

    { name: 'heroImage', title: 'Hero image', type: 'galleryItem', group: 'media' },
    { name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'galleryItem' }], group: 'media' },
    { name: 'videos', title: 'Videos', type: 'array', of: [{ type: 'reference', to: [{ type: 'film' }] }], group: 'media' },
    { name: 'testimonial', title: 'Testimonial', type: 'testimonial', group: 'media' },
    {
      name: 'scene',
      title: '3D scene preset',
      type: 'string',
      group: 'media',
      options: { list: SCENE_PRESETS },
      description: 'Pick the preset that matches the work. Do not reuse one generic scene across unrelated studies.',
      validation: (R: Rule) => R.required(),
    },
    { name: 'accent', title: 'Accent', type: 'string', group: 'media', options: { list: ACCENTS }, validation: (R: Rule) => R.required() },

    { name: 'related', title: 'Related case studies', type: 'array', of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }], group: 'seo', description: 'Leave empty to fall back to same-industry matching.' },
    { name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo', description: 'No "| Kairos Marcom" suffix — the layout appends it.', validation: (R: Rule) => R.required().max(70) },
    { name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, group: 'seo', validation: (R: Rule) => R.required().max(180) },
    { name: 'socialImage', title: 'Social image', type: 'image', group: 'seo' },

    { name: 'state', title: 'Content state', type: 'string', group: 'workflow', options: { list: CONTENT_STATES }, initialValue: 'draft', validation: (R: Rule) => R.required() },
    { name: 'openItems', title: 'Open items', type: 'array', of: [{ type: 'string' }], group: 'workflow', description: 'What still has to be resolved before this study is complete.' },
  ],
  preview: { select: { title: 'client', subtitle: 'summary' } },
}

export const film = {
  name: 'film',
  title: 'Film',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'client', title: 'Client', type: 'string' },
    { name: 'category', title: 'Category', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'youtubeId', title: 'YouTube ID', type: 'string' },
    { name: 'externalUrl', title: 'External URL', type: 'url', description: 'For films hosted somewhere other than YouTube.' },
    { name: 'year', title: 'Year', type: 'string', description: 'Only where it is actually known. Do not infer from the title.' },
    { name: 'hasCaptions', title: 'Captions confirmed on the upload', type: 'boolean', initialValue: false },
    { name: 'state', title: 'Content state', type: 'string', options: { list: CONTENT_STATES }, initialValue: 'draft' },
  ],
  preview: { select: { title: 'title', subtitle: 'client' } },
}

export const service = {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    { name: 'id', title: 'ID', type: 'string', options: { list: SERVICE_IDS }, validation: (R: Rule) => R.required() },
    { name: 'name', title: 'Name', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'blurb', title: 'Blurb', type: 'text', rows: 2, validation: (R: Rule) => R.required() },
    { name: 'solves', title: 'What this solves', type: 'text', rows: 3, validation: (R: Rule) => R.required() },
    { name: 'capabilities', title: 'Deliverables', type: 'array', of: [{ type: 'string' }], validation: (R: Rule) => R.required().min(1) },
    { name: 'accent', title: 'Accent', type: 'string', options: { list: ACCENTS } },
    { name: 'cases', title: 'Evidence', type: 'array', of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }] },
    { name: 'order', title: 'Order', type: 'number' },
  ],
}

export const siteSettings = {
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    { name: 'email', title: 'Email', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'phone', title: 'Phone', type: 'string', validation: (R: Rule) => R.required() },
    { name: 'whatsapp', title: 'WhatsApp link', type: 'url' },
    { name: 'hours', title: 'Office hours', type: 'string' },
    { name: 'responseTime', title: 'Response commitment', type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'about', title: 'About statement', type: 'text', rows: 3 },
    {
      name: 'clients',
      title: 'Client wall',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'logo', title: 'Logo', type: 'image' },
            {
              name: 'logoApproved',
              title: 'Written permission on file to publish this mark',
              type: 'boolean',
              initialValue: false,
              description: 'The wall renders the name in type until this is ticked.',
            },
          ],
        },
      ],
    },
    { name: 'faqs', title: 'FAQs', type: 'array', of: [{ type: 'object', fields: [{ name: 'q', type: 'string' }, { name: 'a', type: 'text' }] }] },
    { name: 'objections', title: 'Objections', type: 'array', of: [{ type: 'object', fields: [{ name: 'q', type: 'string' }, { name: 'a', type: 'text' }] }] },
  ],
}

/** Minimal structural type for Sanity's validation builder. */
interface Rule {
  required(): Rule
  min(n: number): Rule
  max(n: number): Rule
  custom(fn: (value: never, context: never) => true | string): Rule
}

export const schemaTypes = [
  caseStudy,
  film,
  service,
  siteSettings,
  metricChart,
  metricPoint,
  galleryItem,
  channel,
  headlineStat,
  testimonial,
]
