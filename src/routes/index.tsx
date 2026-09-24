import { createFileRoute, Link } from '@tanstack/react-router'
import { EDUCATION, EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { PRINCIPLES, SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'
import { SignalField } from '../components/signal-field'
import { SiteFooter, SiteNav } from '../components/site'
import {
  MailIcon,
  SocialLinks,
  TechIcon,
  TechStackLine,
} from '../components/icons'
import { Reveal } from '../components/reveal'
import { getAllEntries } from '../lib/blog'

export const Route = createFileRoute('/')({
  loader: () => getAllEntries().slice(0, 3),
  head: () => ({
    meta: [
      { title: `${SITE.name}, CTO at ${SITE.company}` },
      { name: 'description', content: SITE.description },
      { property: 'og:title', content: `${SITE.name}, CTO at ${SITE.company}` },
      { property: 'og:description', content: SITE.description },
      { property: 'og:url', content: SITE.domain },
    ],
  }),
  component: Home,
})

function Home() {
  const featured = PROJECTS.filter((project) => project.featured).slice(0, 4)
  const latestPosts = Route.useLoaderData()

  return (
    <div className="site-shell home-page">
      <SiteNav />
      <main id="main">
        <section className="hero-section">
          <div className="container hero-grid">
            <Reveal className="hero-copy">
              <p className="hero-overline">
                <span className="hero-overline-line" aria-hidden="true" />
                Adarsh Singh / CTO, builder
              </p>
              <h1 className="hero-title">
                Product intent.
                <br />
                <span>Systems that hold.</span>
              </h1>
              <p className="hero-dek">
                CTO at SmokeTrees Digital. I make the architecture, delivery,
                and operating rhythm behind a product clear enough to scale.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  See the systems <span aria-hidden="true">↘</span>
                </a>
                <a className="text-link" href="#contact">
                  Start a conversation <span aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>
            <div className="orbital-wrap">
              <SignalField />
            </div>
          </div>
          <div
            className="container hero-proof"
            aria-label="Experience at a glance"
          >
            <div>
              <strong>Millions</strong>
              <span>customers touched by systems I helped build or lead</span>
            </div>
            <div>
              <strong>3Cr+ / day</strong>
              <span>in transaction value reconciled by the systems team</span>
            </div>
            <div>
              <strong>50–60%</strong>
              <span>
                less manual reconciliation work where automation applied
              </span>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            <span>Scroll to explore</span>
            <i />
          </div>
        </section>

        <section className="thesis-section" id="approach">
          <div className="container thesis-grid">
            <Reveal className="thesis-marker">
              <span>Operating thesis</span>
              <i aria-hidden="true" />
              <small>01 / 04</small>
            </Reveal>
            <Reveal delay={100} className="thesis-statement">
              <h2>My job is to make the next engineering decision easier.</h2>
              <p>
                That means naming the trade-offs, making the operating model
                visible, and leaving enough behind for the team to move without
                waiting for me.
              </p>
            </Reveal>
            <Reveal delay={180} className="thesis-principles">
              {[
                [
                  'Make the trade-off visible.',
                  'A decision people can repeat without you in the room.',
                ],
                [
                  'Design for year two.',
                  'The next version should be easier to operate than the first.',
                ],
                [
                  'Leave the system teachable.',
                  'The team should understand the why, not only the how.',
                ],
              ].map(([title, body], index) => (
                <div key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="showcase-section" id="work">
          <div className="container">
            <Reveal className="showcase-head">
              <h2>The work behind the work.</h2>
              <p>
                Products, platforms, and the operating systems that keep them
                dependable after launch.
              </p>
              <Link className="text-link" to="/work">
                Full archive <span aria-hidden="true">↗</span>
              </Link>
            </Reveal>
            <div className="project-grid">
              {featured.map((project, index) => (
                <Reveal
                  key={project.slug}
                  delay={index * 70}
                  className={`project-reveal project-reveal-${index + 1}`}
                >
                  <article
                    className={`project-panel project-panel-${index + 1}`}
                    data-cursor
                  >
                    <div className="project-panel-top">
                      <span>
                        {String(index + 1).padStart(2, '0')} / {project.kind}
                      </span>
                      <span>{project.stack[0]}</span>
                    </div>
                    <div
                      className={`project-art project-art-${index + 1}`}
                      aria-hidden="true"
                    >
                      <div className="project-art-grid" />
                      <div className="project-art-shape" />
                      <div className="project-art-orbit" />
                      <strong>
                        {index === 0
                          ? 'traceability'
                          : index === 1
                            ? 'repeatability'
                            : index === 2
                              ? 'consistency'
                              : 'discovery'}
                      </strong>
                    </div>
                    <div className="project-panel-copy">
                      <h3>{project.title}</h3>
                      <p>{project.summary}</p>
                      <div className="project-panel-bottom">
                        <span className="project-stack">
                          <TechStackLine items={project.stack} size={12} />
                        </span>
                        {project.links[0] ? (
                          <a
                            className="project-link"
                            href={project.links[0].href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open project <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="now-section" id="experience">
          <div className="container now-grid">
            <Reveal className="now-intro">
              <p className="now-kicker">Now / CTO at SmokeTrees Digital</p>
              <h2>Architecture is a team sport.</h2>
              <p className="now-copy">{EXPERIENCE[0]?.summary}</p>
              <a
                className="text-link"
                href={EXPERIENCE[0]?.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                smoketrees.in <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
            <Reveal delay={120} className="now-ledger">
              <div className="ledger-head">
                <span>In practice</span>
                <span>2021 → now</span>
              </div>
              <ol>
                {EXPERIENCE[0]?.bullets.map((bullet, index) => (
                  <li key={bullet}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{bullet}</p>
                  </li>
                ))}
              </ol>
              <div className="ledger-foot">
                {EDUCATION.degree} · {EDUCATION.school}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="toolkit-section" id="stack">
          <div className="container toolkit-grid">
            <Reveal className="toolkit-intro">
              <h2>
                I choose tools for the constraint,
                <br />
                not the trend.
              </h2>
              <p>
                The stack is a means, not the point. The point is knowing what
                the system needs and leaving the next engineer something clear.
              </p>
            </Reveal>
            <Reveal delay={120} className="toolkit-wall">
              {SKILL_GROUPS.map((group) => (
                <div className="toolkit-group" key={group.label}>
                  <h3>{group.label}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>
                        <TechIcon name={item} size={16} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="toolkit-principles">
                {PRINCIPLES.map((principle) => (
                  <div key={principle.title}>
                    <strong>{principle.title}</strong>
                    <p>{principle.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="notes-section" id="blog">
          <div className="container">
            <Reveal className="notes-head">
              <div>
                <h2>Notes from the operating layer.</h2>
                <p>Decisions, systems, and the occasional useful detour.</p>
              </div>
              <Link className="text-link" to="/blog">
                Read all notes <span aria-hidden="true">↗</span>
              </Link>
            </Reveal>
            <div className="notes-list">
              {latestPosts.length === 0 ? (
                <div className="blog-empty">
                  <p>
                    Notes are taking shape. The first few should be here soon.
                  </p>
                </div>
              ) : (
                latestPosts.map((entry) =>
                  entry.kind === 'internal' ? (
                    <Link
                      key={entry.slug}
                      className="notes-row"
                      to="/blog/$slug"
                      params={{ slug: entry.slug }}
                    >
                      <span className="notes-date">{entry.date}</span>
                      <div>
                        <h3>{entry.title}</h3>
                        <p>{entry.description}</p>
                      </div>
                      <span className="notes-action">read note ↗</span>
                    </Link>
                  ) : (
                    <a
                      key={entry.url}
                      className="notes-row"
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="notes-date">
                        {entry.date} · {entry.source}
                      </span>
                      <div>
                        <h3>{entry.title}</h3>
                        <p>{entry.description}</p>
                      </div>
                      <span className="notes-action">open ↗</span>
                    </a>
                  ),
                )
              )}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-panel">
            <Reveal>
              <p className="contact-kicker">Next / say hello</p>
              <h2>If the product is complex, let's make it legible.</h2>
              <p>
                I am most useful when the question is still blurry: what to
                build, how to ship it, and what must stay true as it grows.
              </p>
            </Reveal>
            <Reveal delay={120} className="contact-actions">
              <a
                className="button button-primary"
                href={`mailto:${SITE.email}`}
              >
                <MailIcon size={16} /> Start a conversation
              </a>
              <div className="contact-socials">
                <SocialLinks size={15} />
                <span>{SITE.email}</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
