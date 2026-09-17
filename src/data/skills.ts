export type SkillGroup = {
  label: string
  note?: string
  items: string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Frontend and mobile',
    items: ['React', 'Next.js', 'Tailwind CSS', 'React Native', 'Flutter'],
  },
  {
    label: 'Backend',
    items: [
      'Go',
      'TypeScript',
      'JavaScript',
      'Express',
      'Hono',
      'Flask',
      'FastAPI',
      'LangChain',
    ],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'ElasticSearch'],
  },
  {
    label: 'Cloud and deployment',
    items: ['AWS', 'Azure', 'Vercel', 'Cloudflare', 'Kubernetes'],
  },
  {
    label: 'Daily drivers',
    items: ['Arch Linux', 'Hyprland', 'Neovim', 'OpenCode'],
  },
]

export const PRINCIPLES = [
  {
    title: 'Production first',
    body: 'If it cannot be deployed, monitored, and handed over, it is not done.',
  },
  {
    title: 'Reuse the setup',
    body: 'I use shared templates so we do not repeat the same setup on every project.',
  },
  {
    title: 'Write it down',
    body: 'I document decisions and write runbooks so the next engineer can work without waiting for me.',
  },
]
