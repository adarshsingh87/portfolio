import { createFileRoute } from '@tanstack/react-router'
import { PROJECTS } from '../data/projects'
import { SITE } from '../data/site'
import { SiteFooter, SiteNav } from '../components/site'
import { TechStackLine } from '../components/icons'
import { Reveal } from '../components/reveal'

export const Route = createFileRoute('/work')({
  head: () => ({
    meta: [
      { title: `Work by ${SITE.name}` },
      {
        name: 'description',
        content:
          'Engineering projects by Adarsh Singh, including open-source tools, ONDC integrations, and financial reconciliation systems.',
      },
    ],
  }),
  component: Work,
})

function Work() {
  return (
    <div className="archive-page">
      <SiteNav />
      <main id="main" className="archive-main">
        <Reveal className="archive-intro">
          <div>
            <span className="section-index">archive / 2019 → now</span>
            <h1 className="archive-title">
              Open-source tools and client work.
            </h1>
          </div>
          <p className="archive-copy">
            A working list of systems, tools, and client engagements. Some are
            open, some are under NDA, and all of them taught me something
            useful.
          </p>
        </Reveal>
        <div className="archive-list">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.slug} delay={Math.min(index * 40, 240)}>
              <article className="archive-item">
                <span className="work-item-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.summary}</p>
                  <ul className="archive-points">
                    {project.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="archive-meta">
                  <span>{project.kind}</span>
                  <TechStackLine items={project.stack} size={13} />
                  {project.links[0] ? (
                    <a
                      href={project.links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open project ↗
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
