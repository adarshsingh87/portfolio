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
    title: 'Design for the handover',
    body: 'Build for the operator who inherits the system, not only the launch demo.',
  },
  {
    title: 'Create leverage',
    body: 'Templates, automation, and shared decisions should make the next project cheaper.',
  },
  {
    title: 'Leave a trail',
    body: 'Runbooks and architecture notes should let the team move without waiting for me.',
  },
]
