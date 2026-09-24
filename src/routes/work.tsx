import { createFileRoute } from '@tanstack/react-router'
import { PROJECTS } from '../data/projects'
import { SITE } from '../data/site'
import { ProjectSequence } from '../components/project-sequence'
import { SiteFooter, SiteNav } from '../components/site'
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
            <span className="section-label">Archive / 2019 → now</span>
            <h1 className="archive-title">The work is the argument.</h1>
          </div>
          <p className="archive-copy">
            Open-source tools, client systems, and the engineering decisions
            that made them easier to run. Some are open, some are under NDA.
          </p>
        </Reveal>
        <ProjectSequence projects={PROJECTS} compact />
      </main>
      <SiteFooter />
    </div>
  )
}
