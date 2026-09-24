import { createFileRoute, Link } from '@tanstack/react-router'
import { EDUCATION, EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { PRINCIPLES, SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'
import { ProjectSequence } from '../components/project-sequence'
import { SignalField } from '../components/signal-field'
import { SiteFooter, SiteNav } from '../components/site'
import { MailIcon, SocialLinks, TechIcon } from '../components/icons'
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

const STACK_CONTEXT: Record<string, string> = {
  React: 'frontend template · business apps',
  'Next.js': 'frontend template · client builds',
  'React Native': 'mobile surfaces',
  Flutter: 'Fomofy / MyFomo',
  Go: 'reconciliation · business apps',
  TypeScript: 'Smoke Context · connectors',
  'Node.js': 'Smoke Context · templates',
  Express: 'Smoke Context · Shopify',
  FastAPI: 'Fomofy / MyFomo',
  PostgreSQL: 'ONDC · reconciliation',
  MySQL: 'business systems',
  MongoDB: 'business systems',
  Elasticsearch: 'ONDC search',
  AWS: 'production deployments',
  Azure: 'production deployments',
  Vercel: 'frontend delivery',
  Cloudflare: 'edge delivery',
  Kubernetes: 'ONDC services',
  'Arch Linux': 'daily driver',
  Hyprland: 'daily driver',
  Neovim: 'daily driver',
  OpenCode: 'daily driver',
  'Tailwind CSS': 'frontend template',
  JavaScript: 'web builds',
  Hono: 'service templates',
  Flask: 'service templates',
  LangChain: 'AI chatbots',
}

function Home() {
  const latestPosts = Route.useLoaderData()
  const experience = EXPERIENCE[0]
  const featuredPost = latestPosts.at(0)

  return (
    <div className="site-shell home-page">
      <SiteNav />
      <main id="main">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <Reveal className="hero-copy">
              <p className="hero-overline">
                <span className="hero-overline-line" aria-hidden="true" />{' '}
                Adarsh Singh / CTO / builder
              </p>
              <h1 id="hero-title" className="hero-title">
                I build the systems that make a product hold up in the real
                world<span className="hero-title-mark">.</span>
              </h1>
              <p className="hero-dek">
                CTO at SmokeTrees Digital. Architecture, delivery, templates,
                integrations, and the code that keeps the whole thing honest.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  Enter the work <span aria-hidden="true">↘</span>
                </a>
                <a className="text-link" href="#contact">
                  Start a conversation <span aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>
            <div className="signal-wrap">
              <SignalField />
            </div>
          </div>
          <div className="container hero-index" aria-label="Page index">
            <span>Portfolio / 01</span>
            <span>CTO · engineer · builder</span>
            <span>India / 2026</span>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            <span>Scroll to inspect</span>
            <i />
          </div>
        </section>

        <section className="metrics-section" aria-labelledby="metrics-title">
          <div className="container metrics-intro">
            <p className="section-label">Evidence, not adjectives</p>
            <h2 id="metrics-title">
              The system gets interesting when real people use it.
            </h2>
          </div>
          <div className="container metrics-list">
            <Reveal className="metric-row metric-row-featured" delay={0}>
              <span className="metric-index">01</span>
              <strong>millions</strong>
              <p>of customers touched by systems I helped build or lead.</p>
            </Reveal>
            <Reveal className="metric-row" delay={80}>
              <span className="metric-index">02</span>
              <strong>
                3Cr<span>+</span>
              </strong>
              <p>per day through reconciliation flows.</p>
            </Reveal>
            <Reveal className="metric-row" delay={160}>
              <span className="metric-index">03</span>
              <strong>
                50–60<span>%</span>
              </strong>
              <p>
                less repetitive setup work where shared templates and automation
                applied.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          className="thesis-section"
          id="approach"
          aria-labelledby="approach-title"
        >
          <div className="container thesis-grid">
            <Reveal className="thesis-marker">
              <span>Operating thesis</span>
              <i aria-hidden="true" />
              <small>02 / 06</small>
            </Reveal>
            <Reveal className="thesis-statement" delay={100}>
              <h2 id="approach-title">
                My job is to make the next engineering decision easier.
              </h2>
              <p>
                Name the trade-off. Make the operating model visible. Leave
                enough behind for the team to move without waiting for me.
              </p>
            </Reveal>
            <Reveal className="thesis-principles" delay={180}>
              {PRINCIPLES.map((principle, index) => (
                <div key={principle.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{principle.title}</strong>
                  <p>{principle.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section
          className="work-section"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="container work-intro">
            <Reveal>
              <p className="section-label">Selected work / 2021 → now</p>
              <h2 id="work-title">The work behind the work.</h2>
              <p>
                Products, protocols, and operating systems that keep their shape
                after launch.
              </p>
            </Reveal>
            <Reveal delay={100} className="work-intro-note">
              <span>06 case studies</span>
              <span>open tools / client systems / internal work</span>
            </Reveal>
          </div>
          <ProjectSequence
            projects={PROJECTS.filter((project) => project.featured).slice(
              0,
              6,
            )}
          />
        </section>

        <section
          className="experience-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="container experience-grid">
            <Reveal className="experience-intro">
              <p className="section-label">Now / CTO at SmokeTrees Digital</p>
              <h2 id="experience-title">Architecture is a team sport.</h2>
              <p>{experience.summary}</p>
              <a
                className="text-link"
                href={experience.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                smoketrees.in <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
            <Reveal delay={120} className="experience-ledger">
              <div className="ledger-head">
                <span>In practice</span>
                <span>2021 → now</span>
              </div>
              <ol>
                {experience.bullets.map((bullet, index) => (
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

        <section
          className="stack-section"
          id="stack"
          aria-labelledby="stack-title"
        >
          <div className="container stack-intro">
            <p className="section-label">Systems I work with</p>
            <h2 id="stack-title">The stack is a means, not the point.</h2>
            <p>
              Choose for the constraint. Keep enough context that the next
              engineer can pick up the work.
            </p>
          </div>
          <div className="container stack-groups">
            {SKILL_GROUPS.map((group, groupIndex) => (
              <Reveal
                className="stack-group"
                delay={groupIndex * 50}
                key={group.label}
              >
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item} tabIndex={0}>
                      <span className="stack-item">
                        <TechIcon name={item} size={16} />
                        {item}
                      </span>
                      <span className="stack-context">
                        {STACK_CONTEXT[item] ??
                          'used across the systems I build'}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          className="writing-section"
          id="blog"
          aria-labelledby="writing-title"
        >
          <div className="container writing-intro">
            <p className="section-label">Writing / field notes</p>
            <h2 id="writing-title">Notes from the operating layer.</h2>
            <p>Decisions, systems, and the occasional useful detour.</p>
          </div>
          {featuredPost ? (
            <div className="container writing-feature">
              <Reveal className="writing-feature-index">
                <span>Latest note</span>
                <span>{featuredPost.date}</span>
              </Reveal>
              <Reveal className="writing-feature-copy" delay={80}>
                {featuredPost.kind === 'internal' ? (
                  <Link to="/blog/$slug" params={{ slug: featuredPost.slug }}>
                    <h3>{featuredPost.title}</h3>
                    <p>{featuredPost.description}</p>
                    <span className="writing-read">
                      Read note · {featuredPost.readingMinutes} min{' '}
                      <i aria-hidden="true">↗</i>
                    </span>
                  </Link>
                ) : (
                  <a
                    href={featuredPost.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3>{featuredPost.title}</h3>
                    <p>{featuredPost.description}</p>
                    <span className="writing-read">
                      Open note · {featuredPost.source}{' '}
                      <i aria-hidden="true">↗</i>
                    </span>
                  </a>
                )}
              </Reveal>
              <Reveal className="writing-feature-mark" delay={160}>
                <span>AS / 87</span>
                <i />
                <strong>
                  read
                  <br />
                  slowly
                </strong>
              </Reveal>
            </div>
          ) : null}
          <div className="container writing-list">
            {latestPosts.slice(1).map((entry, index) =>
              entry.kind === 'internal' ? (
                <Link
                  key={entry.slug}
                  to="/blog/$slug"
                  params={{ slug: entry.slug }}
                  className="writing-row"
                >
                  <span className="writing-row-number">
                    {String(index + 2).padStart(2, '0')}
                  </span>
                  <span className="writing-row-date">{entry.date}</span>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </div>
                  <span className="writing-row-action">
                    {entry.readingMinutes} min <i aria-hidden="true">↗</i>
                  </span>
                </Link>
              ) : (
                <a
                  key={entry.url}
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="writing-row"
                >
                  <span className="writing-row-number">
                    {String(index + 2).padStart(2, '0')}
                  </span>
                  <span className="writing-row-date">{entry.date}</span>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </div>
                  <span className="writing-row-action">
                    {entry.source} <i aria-hidden="true">↗</i>
                  </span>
                </a>
              ),
            )}
            <Link to="/blog" className="writing-all">
              All writing <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section
          className="about-section"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="container about-grid">
            <Reveal className="about-mark">
              <span>
                Adarsh
                <br />
                Singh
              </span>
              <i />
              <small>CTO / engineer / builder</small>
            </Reveal>
            <Reveal className="about-copy" delay={100}>
              <p className="section-label">About the person</p>
              <h2 id="about-title">
                I like the point where a product becomes a system.
              </h2>
              <p>
                At SmokeTrees, that means architecture across client and
                internal builds, delivery decisions, and enough hands-on code to
                keep the abstractions honest.
              </p>
              <p>
                Computer Science at VIT Vellore. Arch Linux, Neovim, and a bias
                toward systems that explain themselves.
              </p>
            </Reveal>
            <Reveal className="about-links" delay={180}>
              <span>Find me elsewhere</span>
              <SocialLinks size={16} />
              <a href={`mailto:${SITE.email}`} className="about-email">
                {SITE.email} <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
          </div>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="container contact-panel">
            <Reveal>
              <p className="section-label">Next / say hello</p>
              <h2 id="contact-title">Have something worth building?</h2>
              <p>If the product is complex, let's make it legible.</p>
            </Reveal>
            <Reveal className="contact-actions" delay={120}>
              <a
                className="button button-primary"
                href={`mailto:${SITE.email}`}
              >
                <MailIcon size={16} /> Email Adarsh
              </a>
              <span>{SITE.email}</span>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
