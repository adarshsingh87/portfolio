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
import { Registered } from '../../components/registered'
import { previewAtmosphere } from '../../lib/atmosphere'
import {
  PERSON_REF,
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbs,
  jsonLd,
  pageMeta,
} from '../../lib/seo'

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    const project = getCase(params.slug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] }
    const title = `${loaderData.title}, ${SITE.name}`
    const path = `/work/${loaderData.slug}`
    const image = `${SITE.domain}/work/${loaderData.slug}.png`
    return {
      meta: pageMeta({
        title,
        description: loaderData.line,
        path,
        type: 'article',
        image,
        imageAlt: `${loaderData.title}: ${loaderData.line}`,
      }),
      scripts: [
        jsonLd({
          '@graph': [
            {
              '@type': 'Article',
              headline: loaderData.title,
              description: loaderData.summary,
              url: absoluteUrl(path),
              mainEntityOfPage: absoluteUrl(path),
              image,
              inLanguage: 'en',
              author: PERSON_REF,
              isPartOf: { '@id': WEBSITE_ID },
              keywords: loaderData.stack.join(', '),
              // The work itself was built by the SmokeTrees team.
              about: {
                '@type': 'CreativeWork',
                name: loaderData.title,
                creator: {
                  '@type': 'Organization',
                  name: SITE.company,
                  url: SITE.companyUrl,
                },
              },
            },
            breadcrumbs([
              { name: 'Home', path: '/' },
              { name: 'Work', path: '/work' },
              { name: loaderData.title, path },
            ]),
          ],
        }),
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
    <main id="main" className="case" data-atmo={project.slug}>
      <header className="wrap case-head" data-chapter={project.title}>
        <Link to="/work" className="back-link">
          All work
        </Link>
        <Registered
          as="h1"
          className="case-title"
          text={project.title}
          style={{ viewTransitionName: caseTransitionName(project.slug) }}
        />
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

      <div className="wrap case-stage">
        <Stage project={project} />
      </div>

      <div className="wrap case-facts">
        <Facts facts={project.facts} />
      </div>

      <div className="wrap case-body">
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

      <nav className="wrap case-next" aria-label="Next case study">
        <Link
          to="/work/$slug"
          params={{ slug: next.slug }}
          onPointerEnter={() => previewAtmosphere(next.slug)}
          onPointerLeave={() => previewAtmosphere(null, project.slug)}
        >
          <span className="case-next-label">Next case study</span>
          <Registered
            className="case-next-title"
            text={next.title}
            style={{ viewTransitionName: caseTransitionName(next.slug) }}
          />
          <span className="case-next-line">{next.line}</span>
        </Link>
      </nav>
    </main>
  )
}
