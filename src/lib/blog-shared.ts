// Types and view-transition helpers that client components need. Kept apart
// from lib/blog.ts so post bodies never end up in the client bundle.

export type BlogPost = {
  title: string
  description: string
  date: string
  slug: string
  tags: string[]
  draft?: boolean
  html: string
  readingMinutes: number
}

export type BlogEntry =
  | {
      kind: 'internal'
      slug: string
      title: string
      description: string
      date: string
      tags: string[]
      readingMinutes: number
    }
  | {
      kind: 'external'
      title: string
      description: string
      date: string
      url: string
      source: string
    }

// The `blog-open` transition type lets CSS glide the post title between the
// list and the article instead of cross-fading the whole page.
export const BLOG_TITLE_TRANSITION_TYPE = 'blog-open'

export function blogTitleTransitionName(slug: string): string {
  return `blog-title-${slug}`
}
