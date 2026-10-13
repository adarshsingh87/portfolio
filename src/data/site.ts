export const SITE = {
  name: 'Adarsh Singh',
  title: 'Adarsh Singh, CTO at SmokeTrees Digital',
  domain: 'https://adarshsingh87.com',
  email: 'me@adarshsingh87.com',
  github: 'https://github.com/adarshsingh87',
  githubHandle: 'adarshsingh87',
  linkedin: 'https://www.linkedin.com/in/adarshsingh87/',
  twitter: 'https://x.com/adarshsingh87',
  twitterHandle: '@adarshsingh87',
  company: 'SmokeTrees Digital',
  companyUrl: 'https://smoketrees.in/',
  education: 'Computer Science, VIT Vellore',
  // Kept under 160 characters so search results show all of it.
  description:
    'Adarsh Singh is CTO at SmokeTrees Digital, where his team builds backends for a fashion app, ONDC integrations, reconciliation, and open-source templates.',
} as const

export const NAV = [
  { label: 'Work', to: '/work' },
  { label: 'Writing', to: '/blog' },
] as const
