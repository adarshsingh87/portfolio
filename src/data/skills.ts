export type SkillGroup = {
  label: string
  note?: string
  items: string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Frontend / Mobile',
    items: ['React', 'Next.js', 'Tailwind CSS', 'React Native', 'Flutter'],
  },
  {
    label: 'Backend',
    items: ['Go', 'TypeScript', 'JavaScript', 'Express', 'Hono', 'Flask'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    label: 'Cloud / Deploy',
    items: ['AWS', 'Azure', 'Vercel', 'Cloudflare'],
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
    title: 'Boring where it counts',
    body: 'Templates, conventions, and defaults. Novelty only where the problem is novel.',
  },
  {
    title: 'Write it down',
    body: 'Context propagation, runbooks, readable code. The next person should not need me in the room.',
  },
]
