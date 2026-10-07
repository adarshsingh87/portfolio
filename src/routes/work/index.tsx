import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { CASES, ENTRIES } from '../../data/work'
import { VisibilityMark, caseTransitionName } from '../../components/work'

const DESCRIPTION =
  'Everything Adarsh Singh can point to since 2020: a swipe-driven fashion backend, ONDC integrations, reconciliation in Go, open-source backend templates, and more.'

export const Route = createFileRoute('/work/')({
  head: () => ({
    meta: [
      { title: `Work, ${SITE.name}` },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: `Work, ${SITE.name}` },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: `${SITE.domain}/work` },
    ],
  }),
  component: WorkIndex,
})

function WorkIndex() {
  return (
    <main id="main" className="index-page">
      <header className="page-head">
        <h1>Work</h1>
        <p>
          Everything I can point to since 2020. Rows marked private are client
          or company code: I can tell you what they do and how, but not link to
          them.
        </p>
      </header>

      <section aria-labelledby="cases-title">
        <h2 id="cases-title" className="index-label">
          Case studies
        </h2>
        <ul className="index-list">
          {CASES.map((c) => (
            <li key={c.slug}>
              <Link
                to="/work/$slug"
                params={{ slug: c.slug }}
                className="index-row index-row-case"
              >
                <h3 style={{ viewTransitionName: caseTransitionName(c.slug) }}>
                  {c.title}
                </h3>
                <p>{c.line}</p>
                <span className="index-period">{c.period}</span>
                <VisibilityMark value={c.visibility} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="more-title">
        <h2 id="more-title" className="index-label">
          Everything else
        </h2>
        <ul className="index-list">
          {ENTRIES.map((e) => (
            <li key={e.title}>
              {e.href ? (
                <a
                  href={e.href}
                  className="index-row"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3>{e.title}</h3>
                  <p>{e.line}</p>
                  <span className="index-period">{e.period}</span>
                  <VisibilityMark value={e.visibility} />
                </a>
              ) : (
                <div className="index-row">
                  <h3>{e.title}</h3>
                  <p>{e.line}</p>
                  <span className="index-period">{e.period}</span>
                  <VisibilityMark value={e.visibility} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
