import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { SiteFooter, SiteNav } from '../../components/site'
import { Reveal } from '../../components/reveal'
import {
  BLOG_TITLE_TRANSITION_TYPE,
  blogTitleTransitionName,
  getAllEntries,
} from '../../lib/blog'

export const Route = createFileRoute('/blog/')({
  loader: () => getAllEntries(),
  head: () => ({
    meta: [
      { title: `Blog — ${SITE.name}` },
      {
        name: 'description',
        content:
          'Notes on tooling, integrations, and running a small engineering team. Markdown-driven, no CMS.',
      },
    ],
  }),
  component: BlogIndex,
})

function BlogIndex() {
  const entries = Route.useLoaderData()
  const [featured, ...rest] = entries

  return (
    <div className="blog-page">
      <SiteNav />
      <main id="main" className="blog-main">
        <Reveal className="blog-intro">
          <div className="blog-intro-top">
            <span>Field notes / operating layer</span>
            <span>{entries.length} entries</span>
          </div>
          <div className="blog-intro-grid">
            <h1 className="blog-title">Notes.</h1>
            <p className="blog-intro-copy">
              Decisions, systems, and the occasional useful detour from the work
              of building a product.
            </p>
          </div>
        </Reveal>
        {entries.length === 0 ? (
          <div className="blog-empty">
            <p>Notes are taking shape. The first few should be here soon.</p>
          </div>
        ) : (
          <>
            <Reveal className="blog-feature">
              <div className="blog-feature-top">
                <span>Featured note</span>
                <span>{featured.date}</span>
              </div>
              {featured.kind === 'internal' ? (
                <Link
                  to="/blog/$slug"
                  params={{ slug: featured.slug }}
                  viewTransition={{ types: [BLOG_TITLE_TRANSITION_TYPE] }}
                >
                  <h2
                    style={{
                      viewTransitionName: blogTitleTransitionName(
                        featured.slug,
                      ),
                    }}
                  >
                    {featured.title}
                  </h2>
                  <p>{featured.description}</p>
                  <span className="blog-feature-link">
                    Read note · {featured.readingMinutes} min{' '}
                    <i aria-hidden="true">↗</i>
                  </span>
                </Link>
              ) : (
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2>{featured.title}</h2>
                  <p>{featured.description}</p>
                  <span className="blog-feature-link">
                    Open note · {featured.source} <i aria-hidden="true">↗</i>
                  </span>
                </a>
              )}
              <div className="blog-feature-glyph" aria-hidden="true">
                <span>AS</span>
                <i />
                <strong>
                  read
                  <br />
                  slowly
                </strong>
              </div>
            </Reveal>
            <div className="blog-list-head">
              <span>Archive</span>
              <span>Newest first</span>
            </div>
            <div className="blog-list">
              {rest.map((entry, index) =>
                entry.kind === 'internal' ? (
                  <Link
                    key={entry.slug}
                    className="blog-entry"
                    to="/blog/$slug"
                    params={{ slug: entry.slug }}
                    viewTransition={{ types: [BLOG_TITLE_TRANSITION_TYPE] }}
                  >
                    <div className="blog-entry-top">
                      <span className="blog-entry-number">
                        {String(index + 2).padStart(2, '0')}
                      </span>
                      <p className="blog-entry-meta">
                        {entry.date} · {entry.readingMinutes} min
                      </p>
                    </div>
                    <h2
                      style={{
                        viewTransitionName: blogTitleTransitionName(entry.slug),
                      }}
                    >
                      {entry.title}
                    </h2>
                    <p>{entry.description}</p>
                  </Link>
                ) : (
                  <a
                    key={entry.url}
                    className="blog-entry"
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="blog-entry-top">
                      <span className="blog-entry-number">
                        {String(index + 2).padStart(2, '0')}
                      </span>
                      <p className="blog-entry-meta">
                        {entry.date} · {entry.source}{' '}
                        <span aria-hidden="true">↗</span>
                        <span className="sr-only">(opens in a new tab)</span>
                      </p>
                    </div>
                    <h2>{entry.title}</h2>
                    <p>{entry.description}</p>
                  </a>
                ),
              )}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
