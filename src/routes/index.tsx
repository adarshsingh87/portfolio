import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../data/site'
import { CASES, ENTRIES } from '../data/work'
import { RECORD_TOTAL } from '../data/record'
import { Chapter, VisibilityMark } from '../components/work'
import { Record } from '../components/record'
import { PostList } from '../components/post-list'
import { Registered } from '../components/registered'
import { fetchEntries } from '../lib/blog-api'
import { previewAtmosphere } from '../lib/atmosphere'

export const Route = createFileRoute('/')({
  loader: () => fetchEntries({ data: 3 }),
  head: () => ({
    meta: [
      { title: SITE.title },
      { name: 'description', content: SITE.description },
    ],
  }),
  component: Home,
})

const TOTAL = new Intl.NumberFormat('en-IN').format(RECORD_TOTAL)

function Home() {
  const posts = Route.useLoaderData()

  return (
    <main id="main">
      <section className="hero" data-atmo="home" aria-labelledby="hero-title">
        <div className="wrap hero-inner">
          <Registered
            hero
            as="h1"
            id="hero-title"
            className="hero-title"
            text={['Making every', 'system agree.']}
          />
          <div className="hero-foot">
            <p className="hero-lede">
              I’m Adarsh Singh, CTO at{' '}
              <a
                href={SITE.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                SmokeTrees Digital
              </a>
              . My team and I build the backends behind other people’s products:
              a fashion app that learns from swipes, integrations with India’s
              open commerce network, systems that reconcile stock and money.
              Nearly all of it lives in private repositories, so this site shows
              you the shape of it.
            </p>
            <nav className="hero-index" aria-label="Case studies">
              <p>Four systems</p>
              <ul>
                {CASES.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`#${c.slug}`}
                      onPointerEnter={() => previewAtmosphere(c.slug)}
                      onPointerLeave={() => previewAtmosphere(null)}
                      onFocus={() => previewAtmosphere(c.slug)}
                      onBlur={() => previewAtmosphere(null)}
                    >
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <section className="section work" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <header className="section-head">
            <Registered as="h2" id="work-title" text="Four systems, up close" />
            <p>
              Three of the four are private. For those I can describe the
              problem, the decisions, and the outcome, and draw you a working
              sketch. The fourth is open source, so you can read every line.
            </p>
          </header>
        </div>
        {CASES.map((project) => (
          <Chapter key={project.slug} project={project} />
        ))}
      </section>

      <section
        className="section also"
        data-atmo="home"
        aria-labelledby="also-title"
      >
        <div className="wrap">
          <header className="section-head">
            <Registered as="h2" id="also-title" text="Also on the record" />
            <Link to="/work" className="arrow-link">
              The full index
            </Link>
          </header>
          <ul className="also-list">
            {ENTRIES.map((entry) => (
              <li key={entry.title}>
                <h3>{entry.title}</h3>
                <p>{entry.line}</p>
                <span className="also-meta">
                  <span>{entry.period}</span>
                  <VisibilityMark value={entry.visibility} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="section story"
        data-atmo="home"
        data-chapter="The long way round"
        aria-labelledby="story-title"
      >
        <div className="wrap">
          <div className="story-top">
            <Registered
              as="h2"
              id="story-title"
              className="story-title"
              text="I started with websites written by hand. Now I write the part underneath."
            />
            <div className="story-copy">
              <p>
                I studied Computer Science at VIT Vellore and started out
                writing websites by hand for small businesses. These days I
                spend about half my time on architecture and delivery calls, and
                the other half still writing code.
              </p>
              <p>
                Arch Linux, Hyprland, Neovim, Ghostty, and fish. My desktop
                blurs every popup and takes its colours from the wallpaper,
                which probably explains this website.
              </p>
            </div>
          </div>

          <div className="record" id="record" aria-labelledby="record-title">
            <header className="record-head">
              <h3 id="record-title">The record</h3>
              <p>
                {TOTAL} GitHub contributions since October 2019, private
                repositories included. The jump in 2023 is the year my work
                moved into private repositories.
              </p>
            </header>
            <Record />
          </div>
        </div>
      </section>

      <section
        className="section writing"
        data-atmo="home"
        data-chapter="Writing"
        aria-labelledby="writing-title"
      >
        <div className="wrap">
          <header className="section-head">
            <Registered as="h2" id="writing-title" text="Writing" />
            <Link to="/blog" className="arrow-link">
              All writing
            </Link>
          </header>
          <PostList entries={posts} />
        </div>
      </section>
    </main>
  )
}
