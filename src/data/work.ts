// Every claim here traces back to a repository, a published post, a public
// SmokeTrees case study (smoketrees.in/work), or copy from the previous
// version of this site. Client work is described at the level SmokeTrees
// already publishes, and credited to the team.

export type Visibility = 'open' | 'private'

export type Artifact = 'swipe' | 'protocol' | 'layers' | 'ledger'

export type Fact = { value: string; label: string }

export type CaseSection = { heading: string; body: string[] }

export type Project = {
  slug: string
  title: string
  line: string
  period: string
  role: string
  visibility: Visibility
  stack: string[]
  links: { label: string; href: string }[]
  facts: Fact[]
  artifact: Artifact
  // Short version for the homepage chapter.
  summary: string
  sections: CaseSection[]
  related?: { label: string; to: string }
}

export const CASES: Project[] = [
  {
    slug: 'fomofy',
    title: 'Fomofy',
    line: 'A fashion app where every swipe teaches the feed what to show next.',
    period: '2025 to now',
    role: 'Led the backend, as CTO of the team that built it',
    visibility: 'private',
    stack: ['TypeScript', 'Express', 'PostgreSQL', 'Redis', 'Flutter'],
    links: [
      { label: 'myfomo.in', href: 'https://myfomo.in/' },
      {
        label: 'SmokeTrees case study',
        href: 'https://smoketrees.in/work/fomofy-app',
      },
    ],
    facts: [
      {
        value: 'Live',
        label: 'on iOS and Android, built for Kreative Motion Ventures',
      },
      {
        value: '6',
        label:
          'style signals behind each feed: trends, size, body type, comfort, occasion, skin tone',
      },
      {
        value: 'Fewer',
        label: 'colour-related returns, with add-to-cart conversion up',
      },
    ],
    artifact: 'swipe',
    summary:
      'Fomofy replaces the endless product grid with a feed you swipe through one piece at a time. We built it for Kreative Motion Ventures: a feed that learns from every swipe, colour matching against skin tone, virtual try-on, and the orders, shipping, and brand payouts underneath.',
    sections: [
      {
        heading: 'What it is',
        body: [
          'Fomofy is a fashion shopping app for iOS and Android, built by our team for Kreative Motion Ventures. Generic feeds ignored size, body type, and taste, so discovery felt like noise. Fomofy builds the feed from each shopper’s own signals instead, and shows curated homegrown labels one piece at a time. Keep it or pass.',
        ],
      },
      {
        heading: 'Every swipe is a signal',
        body: [
          'The feed learns from what you keep and what you pass. That only works if every product is described the same way the shopper is, so each piece carries its fit, fabric, colour family, and occasion, and the ranking compares like with like.',
        ],
      },
      {
        heading: 'Colour and fit',
        body: [
          'Skin-tone matching detects tone and undertone, maps it to a palette, and flags which colours complement or clash, which powers a “best for you” filter. Virtual try-on overlays a garment on a photo the shopper uploads. Both went after the most common reason for a return.',
        ],
      },
      {
        heading: 'The commerce underneath',
        body: [
          'Brands bring their catalogues in through Shopify. Orders, shipping across several couriers, returns, and brand payouts each sit behind a single interface, so adding a courier or a payment rule does not mean touching order code.',
        ],
      },
    ],
  },
  {
    slug: 'ondc',
    title: 'ONDC integrations',
    line: 'Gift cards and B2B retail on India’s open commerce network, from both sides of the protocol.',
    period: '2023 to now',
    role: 'Architecture and integration work, with the SmokeTrees team',
    visibility: 'private',
    stack: [
      'TypeScript',
      'Express',
      'PostgreSQL',
      'Kubernetes',
      'AWS',
      'Elasticsearch',
    ],
    links: [
      {
        label: 'SmokeTrees case study: brand validation',
        href: 'https://smoketrees.in/work/earnest-validation',
      },
    ],
    facts: [
      {
        value: '3',
        label:
          'seats at the table: gift card buyer, gift card seller, B2B retail seller',
      },
      { value: 'Millions', label: 'of customers served through these flows' },
      {
        value: '30 min',
        label:
          'to validate 1,000+ gift-card brands, about as long as one brand took by hand',
      },
    ],
    artifact: 'protocol',
    summary:
      'ONDC is a protocol, not a service. Nobody runs the server. Buyer and seller apps each implement a shared spec, and replies arrive as callbacks from whoever answers. We built gift card integrations on both sides and a B2B retail seller, and helped shape the gift card taxonomy itself.',
    sections: [
      {
        heading: 'An API has one author. A protocol has none.',
        body: [
          'With a normal API, one team owns the contract. With ONDC, buyer apps and seller apps implement a shared specification independently, and you are integrating with however many teams decided to interpret it.',
          'We built gift card integrations as a buyer and as a seller, plus a B2B retail seller for a client. Same spec, three seats at the table, three flavours of “technically compliant but not what we expected”. We had also argued over parts of the gift card taxonomy, which made watching three teams interpret it three ways its own kind of humbling.',
        ],
      },
      {
        heading: 'Replies come around, not back',
        body: [
          'You send a search and the answers do not return on that connection. They arrive at a callback endpoint, sometimes from a participant you never called, sometimes late, sometimes twice.',
          'So a broken integration is rarely a stack trace. It is a callback that never came, or one carrying a transaction ID you are not tracking. The fixes are unglamorous: idempotency keys on every handler, defensive parsing of every field, and the raw payload logged before anything touches it.',
        ],
      },
      {
        heading: 'One library for the cryptography',
        body: [
          'Every ONDC service we run imports the same shared library. It signs requests, handles the key exchange for encrypted payloads, and wraps registry and category lookups. Keeping that in one package means one place to fix when the network changes the rules, which it does.',
        ],
      },
      {
        heading: 'Checking brands before they go live',
        body: [
          'Each gift-card brand needs its own denominations, commissions, margins, provider routing, and settlement rules. A manual check before activation took about 30 minutes per brand, and across more than 1,000 brands, misconfigured ones still slipped through. We built a validation engine that checks all of them in about 30 minutes, and re-runs daily to catch changes on the provider side.',
        ],
      },
      {
        heading: 'One transaction, five services',
        body: [
          'Inside our side of the network, a single transaction could pass through four or five services before reaching anyone else. Request-scoped context keeps the transaction ID attached as it hops between them, so one grep shows the whole path a callback took.',
        ],
      },
    ],
    related: {
      label: 'Read the full essay on APIs and protocols',
      to: '/blog/api-vs-protocol-ondc',
    },
  },
  {
    slug: 'backend-kit',
    title: 'The backend kit',
    line: 'Open-source packages that make the boring decisions once, for developers and for coding agents.',
    period: '2020 to now',
    role: 'Maintained with the SmokeTrees team',
    visibility: 'open',
    stack: ['TypeScript', 'Express', 'TypeORM', 'PostgreSQL', 'Inversify'],
    links: [
      {
        label: 'node-template-ts',
        href: 'https://github.com/smoke-trees/node-template-ts',
      },
      {
        label: 'postgres-backend',
        href: 'https://github.com/smoke-trees/node-postgres-backend-core',
      },
      {
        label: 'smoke-context',
        href: 'https://github.com/smoke-trees/smoke-context',
      },
      {
        label: 'next-FE-template',
        href: 'https://github.com/smoke-trees/next-FE-template',
      },
    ],
    facts: [
      {
        value: '1',
        label:
          'command scaffolds an entity: interface, model, DAO, service, controller',
      },
      {
        value: '2020',
        label: 'when it started; every new backend we build still starts here',
      },
      { value: '0', label: 'migrations an agent is allowed to write' },
    ],
    artifact: 'layers',
    summary:
      'Every new backend used to start with the same arguments. Now it starts from a template stacked on two packages we maintain. Fomofy is built on it, and so are most of our client services. It also turned out to be why coding agents write code in our repos that needs no second pass.',
    sections: [
      {
        heading: 'The base classes do the boring part',
        body: [
          'postgres-backend ships abstract classes for the CRUD layer: BaseEntity, Dao, Service, and ServiceController. Read, list, create, update, and delete are already written, so you only reach for the raw database when a query does not fit.',
          'Run ./generate.sh Invoice and you get an interface, a TypeORM entity, a DAO, a service, and a controller, registered and ready. Every function returns the same Result shape, so nobody guesses whether something throws or returns null.',
        ],
      },
      {
        heading: 'Logs that know where they came from',
        body: [
          'Logging goes through smoke-context instead of console.log. It carries request-scoped context through every await without threading an ID through function signatures, and each line names the class and function that wrote it.',
        ],
      },
      {
        heading: 'Written down for the agents too',
        body: [
          'The template ships an AGENTS.md and a CLAUDE.md that spell out naming, column types, the Result pattern, and where to stop. Migrations are off-limits: an agent can change an entity and describe the migration it needs, but a person writes it.',
          'Pointing an agent at generate.sh instead of asking it to write five files from scratch means the scaffolding is right by construction. Its job shrinks to the fields and the business logic.',
        ],
      },
      {
        heading: 'Still moving',
        body: [
          'This year we added a Valkey service and opened an access-control module, and started folding the pieces into a monorepo. The Next.js frontend template does the same job for client frontends.',
        ],
      },
    ],
    related: {
      label: 'Read why we built it for developers and agents',
      to: '/blog/backend-template-for-developers-and-ai-agents',
    },
  },
  {
    slug: 'reconciliation',
    title: 'Reconciliation',
    line: 'Systems that make every source agree about the same stock and the same money.',
    period: '2024 to now',
    role: 'Architecture, with the SmokeTrees team',
    visibility: 'private',
    stack: ['Go', 'TypeScript', 'PostgreSQL'],
    links: [
      {
        label: 'SmokeTrees case study: reconciliation',
        href: 'https://smoketrees.in/work/primarc-reconciliation',
      },
      {
        label: 'SmokeTrees case study: commissions',
        href: 'https://smoketrees.in/work/primarc-commission',
      },
    ],
    facts: [
      {
        value: '3 wk → 20 min',
        label: 'to reconcile stock across every platform',
      },
      {
        value: '1,00,000+',
        label: 'units reconciled each week without manual work',
      },
      { value: '67%', label: 'less manual finance effort on commission runs' },
    ],
    artifact: 'ledger',
    summary:
      'A marketplace business ran its stock across five systems that never agreed, and its money across exports with different columns and different ideas of the truth. Reconciling by hand took weeks every month. We built systems that read every source, match them, and leave a person only the rows that disagree.',
    sections: [
      {
        heading: 'Five systems, five truths',
        body: [
          'Stock lived in an ERP, an order management system, Amazon, Flipkart, and dark stores. Money lived in storefront, payment gateway, courier, and warehouse exports. Each had its own version of events, and the result was overselling, stockouts, and a finance team that spent its month lining up spreadsheets.',
        ],
      },
      {
        heading: 'Formats as data, not code',
        body: [
          'The readers for each source sit on file and column configurations stored as data. When a provider renames a column or ships a new export format, the fix is a config change, not a deploy. Retention filters by month and year keep the working set small enough to search and sort quickly.',
        ],
      },
      {
        heading: 'Leave people the exceptions',
        body: [
          'Matching is the easy part. The design work is in what happens to the rows that do not match: they get flagged with the reason, the moment they appear, so finance starts from the problem instead of from the spreadsheet.',
          'Reconciliation went from three weeks to twenty minutes, across more than 1,00,000 units a week. On the commission side, refunds adjust payouts automatically with a full audit trail, and manual finance effort dropped by 67 percent while volume grew tenfold.',
        ],
      },
    ],
  },
]

export type Entry = {
  title: string
  line: string
  period: string
  visibility: Visibility
  stack: string[]
  href?: string
}

// Work with no case study. Shown in the index with what can be said.
export const ENTRIES: Entry[] = [
  {
    title: 'Event ticketing',
    line: 'Ticketing for large events. Wallet passes on the lock screen cut gate entry time by more than half.',
    period: '2024 to now',
    visibility: 'private',
    stack: ['TypeScript', 'Flutter'],
    href: 'https://smoketrees.in/work/apple-wallet-event-entry',
  },
  {
    title: 'Property buying estimates',
    line: 'Data-backed property buying decisions. A call that took three hours by hand now takes five minutes.',
    period: '2025',
    visibility: 'private',
    stack: ['TypeScript', 'PostgreSQL'],
    href: 'https://smoketrees.in/work/property-buying-estimates',
  },
  {
    title: 'Support chatbots',
    line: 'Answer from a client’s own documents, stay inside defined limits, and hand off to a person when they cannot help.',
    period: '2024 to now',
    visibility: 'private',
    stack: ['TypeScript', 'LangChain'],
  },
  {
    title: 'Shopify connectors',
    line: 'Orders, inventory, and catalogue sync between Shopify stores and the systems behind them.',
    period: '2024 to now',
    visibility: 'private',
    stack: ['TypeScript', 'Express', 'Liquid'],
  },
  {
    title: 'Business software',
    line: 'Learning management, CRM, and employee rewards platforms. We map the workflow before writing any of it.',
    period: '2023 to now',
    visibility: 'private',
    stack: ['React', 'Next.js', 'Go', 'PostgreSQL'],
  },
  {
    title: 'Next.js frontend template',
    line: 'Routing, data fetching, and styling decided once, so client frontends start from the same base.',
    period: '2024 to now',
    visibility: 'open',
    stack: ['Next.js', 'React', 'TypeScript'],
    href: 'https://github.com/smoke-trees/next-FE-template',
  },
  {
    title: 'SmokeTrees website',
    line: 'We rebuilt the company site in 2022.',
    period: '2022',
    visibility: 'open',
    stack: ['JavaScript'],
    href: 'https://github.com/smoke-trees/smoketreesv3',
  },
  {
    title: 'Client websites',
    line: 'Hand-coded sites for Equipo, Rainmaker BA, and a designer’s portfolio while I was studying.',
    period: '2020 to 2021',
    visibility: 'open',
    stack: ['HTML', 'SCSS', 'JavaScript'],
    href: 'https://adarshsingh87.github.io/rainmaker/',
  },
]

export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug)
}
