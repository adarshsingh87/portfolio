import { createFileRoute, Link } from '@tanstack/react-router'
import { EDUCATION, EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { PRINCIPLES, SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'
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
    <div className="site-shell">
      <SiteNav />
      <main id="main">
        <section className="hero-section">
          <div className="container-wide hero-grid">
            <Reveal>
              <div className="hero-copy">
                <p className="eyebrow">Adarsh Singh / engineering</p>
                <h1 className="hero-title text-balance">
                  I build the <span className="signal-word">machinery</span>
                  <br />
                  behind the product.
                </h1>
                <p className="hero-dek">
                  CTO and hands-on engineer. I turn ambiguous product work into
                  systems people can trust, operate, and hand over.
                </p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#work">
                    See the work <span aria-hidden="true">↘</span>
                  </a>
                  <a className="text-link" href="#contact">
                    Email me <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <p className="hero-footnote">
                  <span className="status-dot" aria-hidden="true" />
                  Architecture, delivery, and the parts between them.
                </p>
              </div>
            </Reveal>

            <Reveal delay={180} className="hero-stage">
              <div className="signal-stage" aria-hidden="true">
                <div className="signal-orbit" />
                <div className="signal-orbit signal-orbit-two" />
                <div className="signal-cube">
                  <div className="signal-face signal-front">
                    <span>01 / core</span>
                    <strong>make</strong>
                    <span>clear</span>
                  </div>
                  <div className="signal-face signal-back">
                    <span>02 / edge</span>
                    <strong>ship</strong>
                    <span>reliably</span>
                  </div>
                  <div className="signal-face signal-right">
                    <span>03 / system</span>
                    <strong>hold</strong>
                    <span>shape</span>
                  </div>
                  <div className="signal-face signal-left">
                    <span>04 / care</span>
                    <strong>leave</strong>
                    <span>notes</span>
                  </div>
                  <div className="signal-face signal-top">
                    <span>mode</span>
                    <strong>build</strong>
                    <span>together</span>
                  </div>
                  <div className="signal-face signal-bottom">
                    <span>method</span>
                    <strong>steady</strong>
                    <span>progress</span>
                  </div>
                </div>
                <span className="signal-label signal-label-top">
                  systems / interfaces / operations
                </span>
                <span className="signal-label signal-label-right">
                  from first question to last deploy
                </span>
                <span className="signal-label signal-label-bottom">
                  field notes · 2026
                </span>
                <div className="signal-stamp">
                  hand-built
                  <br />
                  in the open
                </div>
              </div>
            </Reveal>
          </div>

          <div
            className="container-wide hero-rail"
            aria-label="Experience at a glance"
          >
            <div className="hero-stat">
              <span className="hero-stat-value">Millions</span>
              <span className="hero-stat-label">
                of customers touched by systems I helped build or lead
              </span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">3Cr+ / day</span>
              <span className="hero-stat-label">
                in transaction value reconciled by the systems team
              </span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">50–60%</span>
              <span className="hero-stat-label">
                less manual reconciliation work where automation applied
              </span>
            </div>
          </div>
        </section>

        <div className="signal-strip" aria-hidden="true">
          <div className="signal-strip-track">
            {[
              'build',
              'ship',
              'operate',
              'document',
              'build',
              'ship',
              'operate',
              'document',
            ].map((word, index) => (
              <span key={`${word}-${index}`}>{word}</span>
            ))}
          </div>
        </div>

        <section className="manifesto-section">
          <div className="container-wide manifesto-layout">
            <Reveal>
              <span className="section-index">00 / working thesis</span>
              <h2 className="manifesto-title">
                A system should hold its shape after the demo.
              </h2>
              <p className="manifesto-copy">
                I work from the model to the last deploy. The useful part is
                usually the seam between product thinking and production
                reality.
              </p>
            </Reveal>
            <Reveal delay={120} className="manifesto-list">
              {[
                {
                  title: 'Make the model clear.',
                  body: 'Good architecture gives a team a shared language before it gives it a framework.',
                },
                {
                  title: 'Leave a useful trace.',
                  body: 'Runbooks, decisions, and code that make the next change less dependent on memory.',
                },
                {
                  title: 'Keep the edges honest.',
                  body: 'A system should reveal what it knows, what it cannot do, and where a person takes over.',
                },
              ].map((item, index) => (
                <div className="manifesto-item" key={item.title}>
                  <span className="manifesto-index">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="container-wide">
            <Reveal className="work-intro">
              <div>
                <span className="section-index">01 / selected work</span>
                <h2 className="work-title">Built to be used.</h2>
              </div>
              <div>
                <p className="work-intro-copy">
                  Open-source tools, client systems, and the quiet
                  infrastructure that keeps both moving.
                </p>
                <Link className="text-link" to="/work">
                  View the full archive <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </Reveal>

            <div className="work-list">
              {featured.map((project, index) => (
                <Reveal key={project.slug} delay={index * 55}>
                  <article className="work-item">
                    <span className="work-item-index">0{index + 1}</span>
                    <div className="work-item-main">
                      <h3 className="work-item-title">{project.title}</h3>
                      <p className="work-item-summary">{project.summary}</p>
                      <ul className="work-item-points">
                        {project.points.slice(0, 2).map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="work-item-meta">
                      <span className="work-kind">{project.kind}</span>
                      <span className="work-stack">
                        <TechStackLine items={project.stack} size={13} />
                      </span>
                      {project.links[0] ? (
                        <a
                          className="work-link"
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
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="container-wide experience-layout">
            <Reveal>
              <div className="role-display">
                <span className="section-index">02 / experience</span>
                <span className="role-year">2021 → now</span>
                <h3>CTO, {EXPERIENCE[0]?.org}</h3>
                <p>{EXPERIENCE[0]?.summary}</p>
                <a
                  href={EXPERIENCE[0]?.orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  smoketrees.in ↗
                </a>
                <span className="education-note">
                  {EDUCATION.degree} · {EDUCATION.school}
                </span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ol className="experience-list">
                {EXPERIENCE[0]?.bullets.map((bullet, index) => (
                  <li key={bullet}>
                    <span>0{index + 1}</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        <section className="stack-section" id="stack">
          <div className="container-wide">
            <Reveal className="stack-intro">
              <span className="section-index">03 / the toolkit</span>
              <h2 className="stack-title">
                Tools change.
                <br />
                The <em>habit</em> does not.
              </h2>
            </Reveal>
            <div className="stack-grid">
              {SKILL_GROUPS.map((group) => (
                <Reveal key={group.label} delay={60}>
                  <div className="stack-group">
                    <h3>{group.label}</h3>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>
                          <TechIcon name={item} size={16} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {group.note ? (
                      <span className="stack-group-note">{group.note}</span>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="principles-strip">
              {PRINCIPLES.map((principle) => (
                <div className="principle" key={principle.title}>
                  <strong>{principle.title}</strong>
                  <p>{principle.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="writing-section" id="blog">
          <div className="container-wide">
            <Reveal className="writing-head">
              <div>
                <span className="section-index">04 / writing</span>
                <h2 className="writing-title">Notes from the workbench.</h2>
                <p className="writing-intro">
                  A small record of the things worth remembering after the
                  meeting ends.
                </p>
              </div>
              <Link className="text-link" to="/blog">
                Read all notes <span aria-hidden="true">↗</span>
              </Link>
            </Reveal>
            <div className="writing-list">
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
                      className="writing-row"
                      to="/blog/$slug"
                      params={{ slug: entry.slug }}
                    >
                      <span className="writing-date">{entry.date}</span>
                      <div>
                        <h3>{entry.title}</h3>
                        <p>{entry.description}</p>
                      </div>
                      <span className="writing-source">read note ↗</span>
                    </Link>
                  ) : (
                    <a
                      key={entry.url}
                      className="writing-row"
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="writing-date">
                        {entry.date} · {entry.source}
                      </span>
                      <div>
                        <h3>{entry.title}</h3>
                        <p>{entry.description}</p>
                      </div>
                      <span className="writing-source">open ↗</span>
                    </a>
                  ),
                )
              )}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container-wide contact-layout">
            <Reveal>
              <h2 className="contact-title">Bring me the hard part.</h2>
              <p className="contact-copy">
                If there is a system behind it, I will help you make the shape
                clearer and the next step less expensive.
              </p>
            </Reveal>
            <Reveal delay={120} className="contact-actions">
              <a className="button" href={`mailto:${SITE.email}`}>
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
