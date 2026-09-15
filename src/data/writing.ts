export type ExternalPost = {
  title: string
  description: string
  date: string // YYYY-MM-DD, used for sorting newest first
  url: string // absolute external URL, opened in a new tab
  source: string // short publication label, e.g. "smoketrees.in"
}

// Posts published elsewhere. They appear on /blog (and the homepage preview)
// by title, but link out instead of rendering a local page.
// To add one, append an entry:
//
//   {
//     title: 'What I actually do as a CTO',
//     description: 'A week of calendars, code reviews, and client calls.',
//     date: '2026-08-02',
//     url: 'https://smoketrees.in/blog/cto-week',
//     source: 'smoketrees.in',
//   },
export const EXTERNAL_POSTS: ExternalPost[] = []
