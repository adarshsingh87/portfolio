import type { PointerEvent } from 'react'
import { Link } from '@tanstack/react-router'
import type { Project } from '../data/projects'
import { PROJECTS } from '../data/projects'
import { Reveal } from './reveal'
import { TechStackLine } from './icons'

const FEATURED = PROJECTS.filter((project) => project.featured).slice(0, 6)

type ProjectSequenceProps = {
  projects?: Project[]
  compact?: boolean
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.slug === 'smoke-context') {
    return (
      <div
        className="project-visual visual-context"
        role="img"
        aria-label="Request context moving through a system and reaching the logs"
      >
        <div className="visual-axis axis-top">
          <span>request</span>
          <span>async boundary</span>
          <span>trace</span>
        </div>
        <div className="context-track">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="context-labels">
          <span>enter</span>
          <span>attach</span>
          <span>cross</span>
          <span>observe</span>
        </div>
        <strong>
          same context
          <br />
          all the way down
        </strong>
      </div>
    )
  }

  if (project.slug === 'backend-template') {
    return (
      <div
        className="project-visual visual-template"
        role="img"
        aria-label="A backend project structure assembling from shared defaults"
      >
        <div className="template-stack">
          <span>src</span>
          <span>routes</span>
          <span>db</span>
          <span>config</span>
        </div>
        <div className="template-stamp">
          ready
          <br />
          <em>again</em>
        </div>
        <div className="template-caption">structure before feature work</div>
      </div>
    )
  }

  if (project.slug === 'frontend-template') {
    return (
      <div
        className="project-visual visual-frontend"
        role="img"
        aria-label="A frontend project layout made from repeatable pieces"
      >
        <div className="frontend-grid">
          <span>app</span>
          <span>ui</span>
          <span>data</span>
          <span>routes</span>
        </div>
        <div className="frontend-rule" />
        <strong>
          repeat the
          <br />
          good parts
        </strong>
        <div className="frontend-caption">one base / many products</div>
      </div>
    )
  }

  if (project.slug === 'fomofy') {
    return (
      <div
        className="project-visual visual-fomofy"
        role="img"
        aria-label="A focused commerce discovery flow moving from many products to a considered choice"
      >
        <div className="fomo-cloud">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="fomo-line" />
        <div className="fomo-focus">
          <span>myfomo</span>
          <strong>
            less
            <br />
            scrolling
          </strong>
        </div>
        <div className="fomo-caption">discovery / recommendation</div>
      </div>
    )
  }

  if (project.slug === 'ondc') {
    return (
      <div
        className="project-visual visual-network"
        role="img"
        aria-label="A protocol network connecting buyers, sellers, fulfillment, and payment"
      >
        <div className="network-line line-one" />
        <div className="network-line line-two" />
        <div className="network-line line-three" />
        <div className="network-line line-four" />
        <div className="network-node node-buyer">
          <span>01</span>buyer
        </div>
        <div className="network-node node-network">
          <span>02</span>network
        </div>
        <div className="network-node node-seller">
          <span>03</span>seller
        </div>
        <div className="network-node node-fullfilment">
          <span>04</span>fulfilment
        </div>
        <div className="network-node node-payment">
          <span>05</span>payment
        </div>
        <strong>
          shared spec
          <br />
          independent parts
        </strong>
      </div>
    )
  }

  if (project.slug === 'reconciliation') {
    return (
      <div
        className="project-visual visual-reconciliation"
        role="img"
        aria-label="Two transaction streams converging into matched records"
      >
        <div className="recon-stream stream-a">
          <span>source a</span>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="recon-stream stream-b">
          <span>source b</span>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="recon-merge">
          <span>match</span>
          <strong>
            3Cr+<small>/ day</small>
          </strong>
          <i />
        </div>
        <div className="recon-caption">
          matched records / flagged exceptions
        </div>
      </div>
    )
  }

  if (project.slug === 'ai-chatbots') {
    return (
      <div
        className="project-visual visual-chatbot"
        role="img"
        aria-label="A support question moving through a knowledge flow and a human handoff"
      >
        <div className="chat-flow">
          <span>question</span>
          <b>→</b>
          <span>documents</span>
          <b>→</b>
          <span>answer / handoff</span>
        </div>
        <div className="chat-bracket">
          <i />
          bounded knowledge
        </div>
        <strong>
          know when
          <br />
          to hand off
        </strong>
      </div>
    )
  }

  if (project.slug === 'shopify') {
    return (
      <div
        className="project-visual visual-connectors"
        role="img"
        aria-label="Storefront, connector, and client system exchanging orders and catalog data"
      >
        <div className="connector-node">storefront</div>
        <div className="connector-node connector-mid">connector</div>
        <div className="connector-node">internal system</div>
        <div className="connector-arrow arrow-one">orders →</div>
        <div className="connector-arrow arrow-two">← catalog</div>
        <strong>
          translate
          <br />
          the boundary
        </strong>
      </div>
    )
  }

  return (
    <div
      className="project-visual visual-business"
      role="img"
      aria-label="Business workflow components mapping into a usable application"
    >
      <div className="business-words">
        <span>workflow</span>
        <span>roles</span>
        <span>records</span>
      </div>
      <div className="business-arrow">→</div>
      <div className="business-output">useful software</div>
    </div>
  )
}

function ProjectStory({ project, index }: { project: Project; index: number }) {
  const pointerMove = (event: PointerEvent<HTMLElement>) => {
    const element = event.currentTarget
    const bounds = element.getBoundingClientRect()
    element.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
    element.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
  }

  const resetPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '50%')
    event.currentTarget.style.setProperty('--pointer-y', '50%')
  }

  return (
    <Reveal>
      <article
        id={`project-${project.slug}`}
        className="project-story"
        data-cursor="view"
        onPointerMove={pointerMove}
        onPointerLeave={resetPointer}
      >
        <div className="project-story-meta">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.kind}</span>
        </div>
        <div className="project-story-copy">
          <p className="project-summary">{project.summary}</p>
          <h2>{project.title}</h2>
          <ul className="project-points">
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="project-story-bottom">
            <TechStackLine items={project.stack} size={12} />
            {project.links[0] ? (
              <a
                className="project-external"
                href={project.links[0].href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.links[0].label} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="project-private">selected experience</span>
            )}
          </div>
        </div>
        <ProjectVisual project={project} />
      </article>
    </Reveal>
  )
}

export function ProjectSequence({
  projects = FEATURED,
  compact = false,
}: ProjectSequenceProps) {
  const visibleProjects = compact ? projects : projects

  return (
    <div
      className={`project-sequence ${compact ? 'project-sequence-compact' : ''}`}
    >
      <aside className="project-index" aria-label="Selected project index">
        <span className="project-index-label">Project index</span>
        {visibleProjects.map((project, index) => (
          <a
            key={project.slug}
            href={`#project-${project.slug}`}
            className="project-index-link"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {project.title}
          </a>
        ))}
        <Link className="project-index-all" to="/work">
          All work <span aria-hidden="true">↗</span>
        </Link>
      </aside>
      <div className="project-stories">
        {visibleProjects.map((project, index) => (
          <ProjectStory key={project.slug} project={project} index={index} />
        ))}
      </div>
    </div>
  )
}
