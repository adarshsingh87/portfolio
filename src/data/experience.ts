export type Experience = {
  role: string
  org: string
  orgUrl: string
  summary: string
  bullets: string[]
}

export const EXPERIENCE: Experience[] = [
  {
    role: 'CTO',
    org: 'SmokeTrees Digital',
    orgUrl: 'https://smoketrees.in/',
    summary:
      'I run engineering at SmokeTrees. Half the job is architecture and delivery calls. The other half is still code: templates, integrations, and the systems clients depend on daily.',
    bullets: [
      'Design client and internal systems using Next.js, Go, TypeScript, and PostgreSQL',
      'Maintain shared project templates, set code review practices, and plan deployments on AWS, Azure, Vercel, and Cloudflare',
      'Delivered ONDC buyer and seller flows, Shopify connectors, AI chatbots, and systems that reconcile 3Cr+ in transactions per day',
      'Cut repetitive setup work by 50-60% in projects where we applied shared templates and automation',
    ],
  },
]

export const EDUCATION = {
  school: 'VIT Vellore',
  degree: 'Computer Science',
}
