// Snapshots the GitHub contribution calendar into src/data/contributions.json.
// The homepage hero is drawn from this file, so it is committed, not fetched
// at build time (CI has no token and the data only needs a periodic refresh).
//
// Usage: node scripts/fetch-contributions.mjs
// Auth:  uses GITHUB_TOKEN if set, otherwise `gh auth token`.

import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const LOGIN = 'adarshsingh87'
const FIRST_YEAR = 2019
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'src/data/contributions.json')

const token =
  process.env.GITHUB_TOKEN ||
  execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim()

const QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`

async function fetchYear(year) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        login: LOGIN,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  const json = await res.json()
  const cal = json.data.user.contributionsCollection.contributionCalendar
  return {
    year,
    total: cal.totalContributions,
    days: cal.weeks.flatMap((w) => w.contributionDays),
  }
}

const today = new Date().toISOString().slice(0, 10)
const years = []
for (let y = FIRST_YEAR; y <= new Date().getUTCFullYear(); y++) {
  years.push(await fetchYear(y))
}

// Account created 2019-10-09; start the series on the Monday-aligned week
// GitHub reports so columns line up with calendar weeks.
const days = years
  .flatMap((y) => y.days)
  .filter((d) => d.date >= '2019-10-07' && d.date <= today)

const out = {
  login: LOGIN,
  fetched: today,
  start: days[0].date,
  // One base-36 token per day, comma separated: compact and trivially parsed.
  counts: days.map((d) => d.contributionCount.toString(36)).join(','),
  years: years.map(({ year, total }) => ({ year, total })),
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
console.log(
  `contributions: ${days.length} days, ${out.years.map((y) => `${y.year}=${y.total}`).join(' ')}`,
)
