import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../data/site'
import { CASES, ENTRIES } from '../data/work'
import { RECORD_TOTAL } from '../data/record'
import { GlassFacade } from '../components/glass-facade'
import { Chapter, VisibilityMark } from '../components/work'
import { Record } from '../components/record'
import { PostList } from '../components/post-list'
import { fetchEntries } from '../lib/blog-api'

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
    <main id="main" className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            <span>Most of what</span> <span>we build happens</span>{' '}
            <span>behind glass.</span>
          </h1>
          <p className="hero-lede">
            I’m Adarsh Singh, CTO at{' '}
            <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">
              SmokeTrees Digital
            </a>
            . My team and I build the backends behind other people’s products: a
            fashion app that learns from swipes, integrations with India’s open
            commerce network, systems that reconcile stock and money. Nearly all
            of it lives in private repositories, so this site shows you the
            shape of it.
          </p>
        </div>
        <figure className="hero-figure">
          <GlassFacade />
          <figcaption className="hero-key">
            Each window is a day since October 2019, lit by that day’s GitHub
            contributions, {TOTAL} in all. Each floor is a year.{' '}
            <span className="hint-fine">
              Move across the glass to look closer.
            </span>
            <span className="hint-coarse">
              Drag across the glass to look closer.
            </span>
          </figcaption>
        </figure>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <header className="section-head">
          <h2 id="work-title">Four systems, up close</h2>
          <p>
            Three of the four are private. For those I can describe the problem,
            the decisions, and the outcome, and draw you a working sketch. The
            fourth is open source, so you can read every line.
          </p>
        </header>
        {CASES.map((project) => (
          <Chapter key={project.slug} project={project} />
        ))}
      </section>

      <section className="also" aria-labelledby="also-title">
        <header className="section-head section-head-compact">
          <h2 id="also-title">Also on the record</h2>
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
                <VisibilityMark value={entry.visibility} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="record"
        id="record"
        aria-labelledby="record-title"
        data-chapter="The record"
      >
        <header className="section-head">
          <h2 id="record-title">The building, floor by floor</h2>
          <p>
            The same contributions as the facade at the top, one year to a row.
            The jump in 2023 is the year my work moved into private
            repositories.
          </p>
        </header>
        <Record />
      </section>

      <section
        className="writing"
        aria-labelledby="writing-title"
        data-chapter="Writing"
      >
        <header className="section-head section-head-compact">
          <h2 id="writing-title">Writing</h2>
          <Link to="/blog" className="arrow-link">
            All writing
          </Link>
        </header>
        <PostList entries={posts} />
      </section>

      <section className="desk" aria-labelledby="desk-title">
        <h2 id="desk-title">At the desk</h2>
        <div className="desk-copy">
          <p>
            Arch Linux, Hyprland, Neovim, Ghostty, and fish. My desktop blurs
            every popup and takes its colours from the wallpaper, which probably
            explains this website.
          </p>
          <p>
            I studied Computer Science at VIT Vellore and started out writing
            websites by hand for small businesses. These days I spend about half
            my time on architecture and delivery calls, and the other half still
            writing code.
          </p>
        </div>
      </section>
    </main>
  )
}
