import { createFileRoute, Link } from '@tanstack/react-router'
import { EXPERIENCE, EDUCATION } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { PRINCIPLES, SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'
import { SectionHead, SiteFooter, SiteNav } from '../components/site'
import { MailIcon, SocialLinks, TechIcon, TechStackLine } from '../components/icons'
import { Reveal } from '../components/reveal'
import {
  BLOG_TITLE_TRANSITION_TYPE,
  blogTitleTransitionName,
  getAllEntries,
} from '../lib/blog'

export const Route = createFileRoute('/')({
  loader: () => getAllEntries().slice(0, 3),
  head: () => ({
    meta: [
      { title: `${SITE.name} — Hands-on CTO` },
      { name: 'description', content: SITE.description },
      { property: 'og:title', content: `${SITE.name} — Hands-on CTO` },
      { property: 'og:description', content: SITE.description },
      { property: 'og:url', content: SITE.domain },
    ],
  }),
  component: Home,
})

function Home() {
  // Single pass (js-combine-iterations): one loop instead of two .filter()s.
  const featured: typeof PROJECTS = []
  const rest: typeof PROJECTS = []
  for (const p of PROJECTS) {
    if (p.featured) featured.push(p)
    else rest.push(p)
  }
  const latestPosts = Route.useLoaderData()
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <SiteNav />
      <main id="main" className="mx-auto max-w-6xl px-5">
        {/* Hero */}
        <section className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
            <p className="font-mono text-xs text-zinc-500">
              Adarsh Singh — CTO, SmokeTrees Digital
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl">
              CTO. Still mostly an engineer.
            </h1>
            </Reveal>
            <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-400">
              Most of my week is code review and client meetings these days. The
              rest is still hands-on: architecture decisions, the harder bugs,
              and the parts nobody else wants to touch.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="rounded-full bg-[#d6fd51] px-5 py-2.5 text-sm font-bold text-black hover:brightness-110"
              >
                Selected work
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-white/5"
              >
                <MailIcon size={16} /> {SITE.email}
              </a>
              <span className="flex gap-2 pl-1">
                <SocialLinks size={17} />
              </span>
            </div>
            </Reveal>
            <Reveal delay={240}>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                ['Millions', 'customers on systems I built or led'],
                ['3Cr+ / day', 'money through reconciliation flows'],
                ['50-60%', 'time savings by automating recon'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-lg font-extrabold tracking-tight sm:text-xl">
                    {v}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-zinc-500">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
            </Reveal>
          </div>
          <Reveal delay={180}>
          <aside
            className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
            aria-label="Currently"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
              Currently
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              {EXPERIENCE[0]?.summary}
            </p>
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Defaults I defend
              </p>
              <ul className="mt-3 space-y-2.5">
                {PRINCIPLES.map((p) => (
                  <li
                    key={p.title}
                    className="text-[13px] leading-relaxed text-zinc-400"
                  >
                    <span className="font-semibold text-zinc-200">
                      {p.title}.
                    </span>{' '}
                    {p.body}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          </Reveal>
        </section>

        {/* Work */}
        <section id="work" className="border-t border-white/10 py-14">
          <Reveal>
          <SectionHead index="01" title="Selected work" note="" />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {featured.map((p) => (
              <article
                key={p.slug}
                className="bg-[#0a0a0b] p-7 transition-colors hover:bg-[#101013]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#d6fd51]">
                    {p.kind}
                  </p>
                  {p.links[0] ? (
                    <a
                      href={p.links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-zinc-500 underline-offset-4 hover:text-zinc-200 hover:underline"
                    >
                      {p.links[0].label} ↗
                    </a>
                  ) : null}
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {p.summary}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {p.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex gap-2 text-[13px] leading-relaxed text-zinc-500"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600"
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-zinc-500">
                  <TechStackLine items={p.stack} />
                </p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {rest.map((p) => (
              <article
                key={p.slug}
                className="rounded-2xl border border-white/10 p-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                  {p.kind}
                </p>
                <h3 className="mt-2 font-bold">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
                  {p.summary}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link
              to="/work"
              className="font-semibold underline decoration-[#d6fd51] decoration-2 underline-offset-4 hover:bg-[#d6fd51] hover:text-black hover:no-underline"
            >
              Full work archive →
            </Link>
          </p>
          </Reveal>
        </section>

        {/* Experience */}
        <section id="experience" className="border-t border-white/10 py-14">
          <Reveal>
          <SectionHead index="02" title="Experience" note="" />
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-lg font-bold">CTO — {EXPERIENCE[0]?.org}</p>
              <a
                href={EXPERIENCE[0]?.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-zinc-500 hover:text-zinc-300"
              >
                smoketrees.in ↗
              </a>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {EXPERIENCE[0]?.summary}
              </p>
              <p className="mt-4 font-mono text-xs text-zinc-500">
                {EDUCATION.degree}, {EDUCATION.school}
              </p>
            </div>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {EXPERIENCE[0]?.bullets.map((b, i) => (
                <li
                  key={b}
                  className="flex gap-4 py-4 text-sm leading-relaxed text-zinc-300"
                >
                  <span className="font-mono text-xs text-zinc-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          </Reveal>
        </section>

        {/* Stack */}
        <section id="stack" className="border-t border-white/10 py-14">
          <Reveal>
          <SectionHead index="03" title="Stack" note="" />
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label} className="border-t border-white/10 pt-4">
                <dt className="text-sm font-bold">{g.label}</dt>
                <dd className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-300">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5"
                    >
                      <TechIcon name={item} size={17} />
                      {item}
                    </span>
                  ))}
                </dd>
                {g.note ? (
                  <dd className="mt-1 font-mono text-[11px] text-zinc-600">
                    {g.note}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
          </Reveal>
        </section>

        {/* Blog preview */}
        <section id="blog" className="border-t border-white/10 py-14">
          <Reveal>
          <SectionHead index="04" title="Blog" note="" />
          {latestPosts.length === 0 ? (
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-white/15 p-8 sm:flex-row sm:items-center">
              <div>
                <p className="text-lg font-bold">Notes, coming soon.</p>
                <p className="mt-1 max-w-md text-sm text-zinc-500">
                  Tooling, ONDC lessons, reconciliation patterns, running a
                  small eng team. Files live in src/content/blog.
                </p>
              </div>
              <Link
                to="/blog"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
              >
                Visit blog →
              </Link>
            </div>
          ) : (
            <div>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {latestPosts.map((e) =>
                  e.kind === 'internal' ? (
                    <Link
                      key={e.slug}
                      to="/blog/$slug"
                      params={{ slug: e.slug }}
                      viewTransition={{ types: [BLOG_TITLE_TRANSITION_TYPE] }}
                      className="group flex items-baseline justify-between gap-6 py-4"
                    >
                      <span className="font-semibold tracking-tight group-hover:underline group-hover:decoration-[#d6fd51] group-hover:underline-offset-4" style={{ viewTransitionName: blogTitleTransitionName(e.slug) }}>
                        {e.title}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-zinc-500">
                        {e.date}
                      </span>
                    </Link>
                  ) : (
                    <a
                      key={e.url}
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-6 py-4"
                    >
                      <span className="font-semibold tracking-tight group-hover:underline group-hover:decoration-[#d6fd51] group-hover:underline-offset-4">
                        {e.title}{' '}
                        <span
                          aria-hidden
                          className="font-mono text-xs text-zinc-500"
                        >
                          ↗
                        </span>
                        <span className="sr-only">
                          (opens in a new tab on {e.source})
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-zinc-500">
                        {e.date} · {e.source}
                      </span>
                    </a>
                  ),
                )}
              </div>
              <p className="mt-6">
                <Link
                  to="/blog"
                  className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
                >
                  All BLogs →
                </Link>
              </p>
            </div>
          )}
          </Reveal>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="border-t border-white/10 py-14 sm:py-20"
        >
          <Reveal>
          <p className="font-mono text-xs text-[#d6fd51]">05 — Contact</p>
          <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            Short emails get fast replies.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] text-zinc-400">
            Tell me what you are building and what production means for it. I
            read everything.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-7 py-3.5 text-[15px] font-bold text-black hover:bg-[#d6fd51]"
          >
            <MailIcon size={18} /> {SITE.email}
          </a>
          <div className="mt-6 flex gap-2">
            <SocialLinks size={17} />
          </div>
          <p className="mt-4 font-mono text-xs text-zinc-600">
            GitHub{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-zinc-300"
              href={SITE.github}
            >
              adarshsingh87
            </a>
            {' · '}LinkedIn{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-zinc-300"
              href={SITE.linkedin}
            >
              adarshsingh87
            </a>
            {' · '}X{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-zinc-300"
              href={SITE.twitter}
            >
              adarshsingh87
            </a>
          </p>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
