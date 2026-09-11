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
      'Own architecture across client and internal builds, from Next.js frontends to Go and TypeScript backends on Postgres',
      'Set the defaults: backend and frontend templates, review habits, deploy paths on AWS, Azure, Vercel, and Cloudflare',
      'Delivered ONDC buyer and seller flows, Shopify connectors, AI chatbots, and reconciliation systems moving 3Cr+ per day',
      'Kept the team small and the output steady by removing repetitive setup work, often in the 50-60% range',
    ],
  },
]

export const EDUCATION = {
  school: 'VIT Vellore',
  degree: 'Computer Science',
}
