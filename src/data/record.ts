import contributions from './contributions.json'

// One line per year. Totals come from the GitHub contribution calendar,
// which counts private repositories too.
const NOTES: Record<number, string> = {
  2019: 'Opened a GitHub account in my first term of Computer Science at VIT Vellore.',
  2020: 'Static sites, a QR code generator, a snake game, my first Flutter apps. First commits to SmokeTrees.',
  2021: 'Freelance websites for small businesses, written by hand.',
  2022: 'Rebuilt the SmokeTrees website, then went looking for harder problems.',
  2023: 'Learned Go. Started on ONDC. Most of my work moved into private repositories, and the count went up fivefold.',
  2024: 'Reconciliation systems in Go. Rewrote my Neovim config and sent small fixes upstream to BufferTabs.nvim and DefinitelyTyped.',
  2025: 'We started building Fomofy in March: the swipe feed, colour matching, and everything behind checkout.',
  2026: 'A Valkey service and an access-control module for our template, a template monorepo, and this site.',
}

export type RecordYear = { year: number; total: number; note: string }

export const RECORD: RecordYear[] = contributions.years.map(
  ({ year, total }) => ({
    year,
    total,
    note: NOTES[year] ?? '',
  }),
)

export const RECORD_TOTAL = RECORD.reduce((sum, y) => sum + y.total, 0)
export const RECORD_FETCHED = contributions.fetched
