import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { CASES, getCase } from '../../data/work'
import { NotFoundPage } from '../../components/not-found'
import {
  Facts,
  Stage,
  VisibilityMark,
  caseTransitionName,
} from '../../components/work'

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    const project = getCase(params.slug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] }
    const title = `${loaderData.title}, ${SITE.name}`
    return {
      meta: [
        { title },
        { name: 'description', content: loaderData.line },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: loaderData.line },
        {
          property: 'og:url',
          content: `${SITE.domain}/work/${loaderData.slug}`,
        },
      ],
    }
  },
  component: CaseStudy,
  notFoundComponent: () => <NotFoundPage />,
})

function CaseStudy() {
  const project = Route.useLoaderData()
  const index = CASES.findIndex((c) => c.slug === project.slug)
  const next = CASES[(index + 1) % CASES.length]

  return (
    <main id="main" className="case">
      <header className="case-head" data-chapter={project.title}>
        <Link to="/work" className="back-link">
          All work
        </Link>
        <h1
          className="case-title"
          style={{ viewTransitionName: caseTransitionName(project.slug) }}
        >
          {project.title}
        </h1>
        <p className="case-line">{project.line}</p>
        <dl className="case-meta">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{project.period}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{project.stack.join(', ')}</dd>
          </div>
          <div>
            <dt>Code</dt>
            <dd>
              <VisibilityMark value={project.visibility} />
            </dd>
          </div>
        </dl>
      </header>

      <div className="case-stage">
        <Stage project={project} />
      </div>

      <div className="case-facts">
        <Facts facts={project.facts} />
      </div>

      <div className="case-body">
        {project.sections.map((section) => (
          <section key={section.heading} className="case-section">
            <h2>{section.heading}</h2>
            <div className="case-prose">
              {section.body.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </section>
        ))}
        {project.related || project.links.length > 0 ? (
          <section className="case-section case-elsewhere">
            <h2>Elsewhere</h2>
            <ul className="case-prose">
              {project.related ? (
                <li>
                  <Link to={project.related.to} className="arrow-link">
                    {project.related.label}
                  </Link>
                </li>
              ) : null}
              {project.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="arrow-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <nav className="case-next" aria-label="Next case study">
        <Link to="/work/$slug" params={{ slug: next.slug }}>
          <span className="case-next-label">Next</span>
          <span
            className="case-next-title"
            style={{ viewTransitionName: caseTransitionName(next.slug) }}
          >
            {next.title}
          </span>
          <span className="case-next-line">{next.line}</span>
        </Link>
      </nav>
    </main>
  )
}
