export type Project = {
  slug: string
  title: string
  kind: 'OSS / Tooling' | 'Product' | 'Integration' | 'Automation' | 'Selected experience'
  summary: string
  points: string[]
  stack: string[]
  links: { label: string; href: string }[]
  featured?: boolean
}

// Ordered OSS-first per grilling decision.
export const PROJECTS: Project[] = [
  {
    slug: 'smoke-context',
    title: 'Smoke Context',
    kind: 'OSS / Tooling',
    summary:
      'A small context-management library for Express built on async storage. It carries request-scoped context through a call chain so logs can be traced without threading IDs through every function.',
    points: [
      'Request and context propagation using async storage',
      'Built for log tracing across sync and async boundaries',
      'Works in single-server apps and microservices',
    ],
    stack: ['TypeScript', 'Express', 'Node.js'],
    links: [{ label: 'GitHub profile', href: 'https://github.com/adarshsingh87' }],
    featured: true,
  },
  {
    slug: 'backend-template',
    title: 'SmokeTrees Backend Template',
    kind: 'OSS / Tooling',
    summary:
      'A mildly opinionated backend starting point. Sensible defaults, consistent layout, and the boring setup already done so new services start clean and stay consistent.',
    points: [
      'Consistent project layout across services',
      'Defaults that cut setup mistakes',
      'Faster start for new backend work, measured in the 50-60% range on repetitive setup',
    ],
    stack: ['TypeScript', 'Express', 'Hono', 'PostgreSQL'],
    links: [{ label: 'GitHub profile', href: 'https://github.com/adarshsingh87' }],
    featured: true,
  },
  {
    slug: 'frontend-template',
    title: 'SmokeTrees Frontend Template',
    kind: 'OSS / Tooling',
    summary:
      'A mildly opinionated Next.js starting point. Shared conventions for routing, data fetching, and styling so client projects begin from the same solid base.',
    points: [
      'Next.js conventions decided once, reused everywhere',
      'Reduces common implementation errors',
      'Repeatable start for client frontends',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    links: [{ label: 'GitHub profile', href: 'https://github.com/adarshsingh87' }],
    featured: true,
  },
  {
    slug: 'fomofy',
    title: 'Fomofy / MyFomo',
    kind: 'Product',
    summary:
      'An e-commerce experience built around less scrolling and better discovery. Focused product views with recommendations that narrow choices instead of adding noise.',
    points: [
      'Product discovery over endless scrolling',
      'Personalized recommendations',
      'A calmer, more focused shopping flow',
    ],
    stack: ['Next.js', 'React', 'TypeScript'],
    links: [{ label: 'myfomo.in', href: 'https://myfomo.in/' }],
    featured: true,
  },
  {
    slug: 'ondc',
    title: 'ONDC integrations',
    kind: 'Integration',
    summary:
      'Buyer-side and seller-side gift card flows plus a B2B retail seller implementation on ONDC. Protocol work where the spec is strict and the edge cases are real.',
    points: [
      'Gift cards, buyer side and seller side',
      'B2B retail seller implementation for a client',
      'Production systems serving millions of customers',
    ],
    stack: ['TypeScript', 'Go', 'PostgreSQL', 'AWS'],
    links: [{ label: 'ONDC protocol', href: 'https://ondc.org/' }],
    featured: true,
  },
  {
    slug: 'reconciliation',
    title: 'Reconciliation and financial automation',
    kind: 'Automation',
    summary:
      'Systems that match money movement against records and flag what does not line up. Daily reconciliation flows handling 3Cr+ in monetary transactions, plus the operational automations around them.',
    points: [
      'Reconciliation for daily money movement at 3Cr+ per day',
      'Operational and workflow automation around finance ops',
      'Repetitive manual work cut in the 50-60% range where applied',
    ],
    stack: ['Go', 'TypeScript', 'PostgreSQL', 'AWS'],
    links: [],
    featured: true,
  },
  {
    slug: 'ai-chatbots',
    title: 'AI chatbots',
    kind: 'Product',
    summary:
      'Chatbots built for client support and operations. Retrieval over client docs, human handoff where it matters, and honest scoping about what the bot should not answer.',
    points: ['Client-specific knowledge flows', 'Handoff paths for unresolved cases'],
    stack: ['TypeScript', 'Python', 'Flask'],
    links: [],
  },
  {
    slug: 'shopify',
    title: 'Shopify connectors',
    kind: 'Integration',
    summary:
      'Connectors and small apps that tie Shopify stores into client systems. Orders, inventory, and the unglamorous sync logic that keeps storefronts honest.',
    points: ['Storefront to internal-system sync', 'Order and catalog connectors'],
    stack: ['TypeScript', 'Express', 'PostgreSQL'],
    links: [],
  },
  {
    slug: 'business-apps',
    title: 'Business applications',
    kind: 'Selected experience',
    summary:
      'Learning management systems, CRMs, employee rewards and recognition tooling, and other custom internal software. Grouped here because each one matters less than the pattern: find the workflow, then encode it.',
    points: ['LMS builds', 'CRM builds', 'Rewards and recognition systems'],
    stack: ['React', 'Next.js', 'Go', 'PostgreSQL'],
    links: [],
  },
]
