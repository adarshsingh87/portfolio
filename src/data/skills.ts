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
    body: 'Build for the team that will operate it, not only the launch demo.',
  },
  {
    title: 'Boring where it counts',
    body: 'Choose the dependable path at the boundaries and spend novelty on the product.',
  },
  {
    title: 'Write it down',
    body: 'Leave the trade-off, the runbook, and the reason behind the decision.',
  },
]
