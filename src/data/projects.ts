export type Project = {
  slug: string
  title: string
  kind:
    | 'OSS / Tooling'
    | 'Product'
    | 'Integration'
    | 'Automation'
    | 'Selected experience'
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
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/smoke-trees/smoke-context',
      },
    ],
    featured: true,
  },
  {
    slug: 'backend-template',
    title: 'SmokeTrees Backend Template',
    kind: 'OSS / Tooling',
    summary:
      'A backend starting point. Project layout and defaults are decided up front, so every new service starts from the same structure instead of being assembled from scratch.',
    points: [
      'Consistent project layout across services',
      'Defaults chosen up front to cut common setup mistakes',
    ],
    stack: ['TypeScript', 'Express', 'PostgreSQL'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/smoke-trees/node-template-ts',
      },
    ],
    featured: true,
  },
  {
    slug: 'frontend-template',
    title: 'SmokeTrees Frontend Template',
    kind: 'OSS / Tooling',
    summary:
      'A Next.js starting point. Routing, data fetching, and styling conventions are decided once, so every client project starts from the same base instead of re-answering those questions.',
    points: [
      'Next.js conventions decided once, reused across client projects',
      'Shared conventions help reduce common implementation errors',
      'Client frontends start from a repeatable base',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/smoke-trees/next-FE-template',
      },
    ],
    featured: true,
  },
  {
    slug: 'fomofy',
    title: 'Fomofy / MyFomo',
    kind: 'Product',
    summary:
      'An e-commerce app that helps shoppers find products with less scrolling. Focused product views and personalized recommendations narrow the choices.',
    points: [
      'Product discovery over endless scrolling',
      'Personalized recommendations',
      'A calmer, more focused shopping flow',
    ],
    stack: ['Express', 'TypeScript', 'FastAPI', 'Flutter'],
    links: [{ label: 'myfomo.in', href: 'https://myfomo.in/' }],
    featured: true,
  },
  {
    slug: 'ondc',
    title: 'ONDC integrations',
    kind: 'Integration',
    summary:
      'ONDC integrations for buying and selling gift cards, plus a B2B retail seller implementation for a client.',
    points: [
      'Gift cards, buyer side and seller side',
      'B2B retail seller implementation for a client',
      'Production systems serving millions of customers',
    ],
    stack: [
      'TypeScript',
      'Kubernetes',
      'PostgreSQL',
      'AWS',
      'Express',
      'ElasticSearch',
    ],
    links: [],
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
    stack: ['Go', 'TypeScript', 'PostgreSQL'],
    links: [],
    featured: true,
  },
  {
    slug: 'ai-chatbots',
    title: 'AI chatbots',
    kind: 'Product',
    summary:
      'Support and operations chatbots that retrieve answers from client documents. They hand unresolved questions to people and have defined limits on what they answer.',
    points: [
      'Client-specific knowledge flows',
      'Handoff paths for unresolved cases',
    ],
    stack: ['TypeScript', 'LangChain'],
    links: [],
  },
  {
    slug: 'shopify',
    title: 'Shopify connectors',
    kind: 'Integration',
    summary:
      'Connectors and small apps that sync orders, inventory, and catalog data between Shopify stores and client systems.',
    points: [
      'Storefront to internal-system sync',
      'Order and catalog connectors',
    ],
    stack: ['TypeScript', 'Express', 'PostgreSQL', 'Liquid Templating'],
    links: [],
  },
  {
    slug: 'business-apps',
    title: 'Business applications',
    kind: 'Selected experience',
    summary:
      'Custom internal software, including learning management systems, CRMs, and employee rewards and recognition tools. I map the workflow before building the software.',
    points: ['LMS builds', 'CRM builds', 'Rewards and recognition systems'],
    stack: ['React', 'Next.js', 'Go', 'PostgreSQL'],
    links: [],
  },
]
