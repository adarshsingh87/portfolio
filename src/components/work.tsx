import { Link } from '@tanstack/react-router'
import type { Artifact, Project, Visibility } from '../data/work'
import { SwipeArtifact } from './artifacts/swipe'
import { ProtocolArtifact } from './artifacts/protocol'
import { LayersArtifact } from './artifacts/layers'
import { LedgerArtifact } from './artifacts/ledger'

export function caseTransitionName(slug: string) {
  return `case-${slug}`
}

export function ArtifactView({ kind }: { kind: Artifact }) {
  switch (kind) {
    case 'swipe':
      return <SwipeArtifact />
    case 'protocol':
      return <ProtocolArtifact />
    case 'layers':
      return <LayersArtifact />
    case 'ledger':
      return <LedgerArtifact />
  }
}

export function VisibilityMark({ value }: { value: Visibility }) {
  return (
    <span className="visibility" data-visibility={value}>
      <i aria-hidden="true" />
      {value === 'open' ? 'Open source' : 'Private repository'}
    </span>
  )
}

// The stage frames an artifact. Private work sits behind frosted glass;
// open-source work gets clear glass and links to the code.
export function Stage({ project }: { project: Project }) {
  return (
    <figure className="stage" data-visibility={project.visibility}>
      <ArtifactView kind={project.artifact} />
      <figcaption className="stage-note">
        {project.visibility === 'private' ? (
          <>The code is private. This is a working sketch of the idea.</>
        ) : (
          <>
            The code is public:{' '}
            {project.links.map((l, i) => (
              <span key={l.href}>
                {i > 0 ? ', ' : null}
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </span>
            ))}
            .
          </>
        )}
      </figcaption>
    </figure>
  )
}

export function Facts({ facts }: { facts: Project['facts'] }) {
  return (
    <dl className="facts">
      {facts.map((f) => (
        <div key={f.label}>
          <dt>{f.value}</dt>
          <dd>{f.label}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Chapter({ project }: { project: Project }) {
  return (
    <article
      className="chapter"
      data-artifact={project.artifact}
      data-chapter={project.title}
      aria-labelledby={`chapter-${project.slug}`}
    >
      <header className="chapter-head">
        <p className="chapter-meta">
          <VisibilityMark value={project.visibility} />
          <span>{project.period}</span>
        </p>
        <h3
          className="chapter-title"
          id={`chapter-${project.slug}`}
          style={{ viewTransitionName: caseTransitionName(project.slug) }}
        >
          {project.title}
        </h3>
        <p className="chapter-line">{project.line}</p>
      </header>
      <div className="chapter-body">
        <div className="chapter-text">
          <p>{project.summary}</p>
          <Facts facts={project.facts} />
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            className="arrow-link"
          >
            Read the case study
            <span className="sr-only">: {project.title}</span>
          </Link>
        </div>
        <Stage project={project} />
      </div>
    </article>
  )
}
