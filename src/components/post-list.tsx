import { Link } from '@tanstack/react-router'
import type { BlogEntry } from '../lib/blog-shared'
import {
  BLOG_TITLE_TRANSITION_TYPE,
  blogTitleTransitionName,
} from '../lib/blog-shared'
import { formatDate } from '../lib/format'

export function PostList({
  entries,
  level = 3,
}: {
  entries: BlogEntry[]
  level?: 2 | 3
}) {
  const Heading = level === 2 ? 'h2' : 'h3'

  if (entries.length === 0) {
    return <p className="posts-empty">The first note is on its way.</p>
  }

  return (
    <ul className="posts">
      {entries.map((entry) => (
        <li key={entry.kind === 'internal' ? entry.slug : entry.url}>
          {entry.kind === 'internal' ? (
            <Link
              to="/blog/$slug"
              params={{ slug: entry.slug }}
              viewTransition={{ types: [BLOG_TITLE_TRANSITION_TYPE] }}
              className="post-row"
            >
              <time dateTime={entry.date}>
                {formatDate(entry.date, 'short')}
              </time>
              <Heading
                style={{
                  viewTransitionName: blogTitleTransitionName(entry.slug),
                }}
              >
                {entry.title}
              </Heading>
              <p>{entry.description}</p>
              <span className="post-row-meta">
                {entry.readingMinutes} min read
              </span>
            </Link>
          ) : (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="post-row"
            >
              <time dateTime={entry.date}>
                {formatDate(entry.date, 'short')}
              </time>
              <Heading>{entry.title}</Heading>
              <p>{entry.description}</p>
              <span className="post-row-meta">
                On {entry.source}
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}
