import { createFileRoute, Link } from '@tanstack/react-router'
import { EXPERIENCE, EDUCATION } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { PRINCIPLES, SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'
import { SectionHead, SiteFooter, SiteNav } from '../components/site'

export const Route = createFileRoute('/')({
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
  const featured = PROJECTS.filter((p) => p.featured)
  const rest = PROJECTS.filter((p) => !p.featured)
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <SiteNav />
      <main id="main" className="mx-auto max-w-6xl px-5">
        {/* Hero */}
        <section className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-xs text-zinc-500">Adarsh Singh — CTO, SmokeTrees Digital</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl">
              I run engineering and still ship it.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-400">
              Hands-on CTO working across frontend, backend, integrations, and
              cloud. I build production systems, then turn the repeatable parts
              into templates so small teams deliver like bigger ones.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="rounded-full bg-[#d6fd51] px-5 py-2.5 text-sm font-bold text-black hover:brightness-110">
                Selected work
              </a>
              <a href={`mailto:${SITE.email}`} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-white/5">
                {SITE.email}
              </a>
              <span className="flex gap-4 pl-1 font-mono text-xs text-zinc-500">
                <a href={SITE.github} className="hover:text-zinc-200">GH</a>
                <a href={SITE.linkedin} className="hover:text-zinc-200">LI</a>
                <a href={SITE.twitter} className="hover:text-zinc-200">X</a>
              </span>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                ['Millions', 'customers on systems I built or led'],
                ['3Cr+ / day', 'money through reconciliation flows'],
                ['50-60%', 'repetitive setup work removed'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-lg font-extrabold tracking-tight sm:text-xl">{v}</dt>
                  <dd className="mt-1 text-xs leading-snug text-zinc-500">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7" aria-label="Currently">
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Currently</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{EXPERIENCE[0]?.summary}</p>
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Defaults I defend</p>
              <ul className="mt-3 space-y-2.5">
                {PRINCIPLES.map((p) => (
                  <li key={p.title} className="text-[13px] leading-relaxed text-zinc-400">
                    <span className="font-semibold text-zinc-200">{p.title}.</span> {p.body}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        {/* Work */}
        <section id="work" className="border-t border-white/10 py-14">
          <SectionHead index="01" title="Selected work" note="OSS and tooling first, then product systems. No invented metrics." />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {featured.map((p) => (
              <article key={p.slug} className="bg-[#0a0a0b] p-7 transition-colors hover:bg-[#101013]">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#d6fd51]">{p.kind}</p>
                  {p.links[0] ? (
                    <a href={p.links[0].href} className="font-mono text-[11px] text-zinc-500 underline-offset-4 hover:text-zinc-200 hover:underline">
                      {p.links[0].label} ↗
                    </a>
                  ) : null}
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.summary}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-[13px] leading-relaxed text-zinc-500">
                      <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-zinc-500">{p.stack.join(' · ')}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {rest.map((p) => (
              <article key={p.slug} className="rounded-2xl border border-white/10 p-6">
                <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">{p.kind}</p>
                <h3 className="mt-2 font-bold">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{p.summary}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link to="/work" className="font-semibold underline decoration-[#d6fd51] decoration-2 underline-offset-4 hover:bg-[#d6fd51] hover:text-black hover:no-underline">
              Full work archive →
            </Link>
          </p>
        </section>

        {/* Experience */}
        <section id="experience" className="border-t border-white/10 py-14">
          <SectionHead index="02" title="Experience" note="CTO focus. Capabilities over chronology." />
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-lg font-bold">CTO — {EXPERIENCE[0]?.org}</p>
              <a href={EXPERIENCE[0]?.orgUrl} className="font-mono text-xs text-zinc-500 hover:text-zinc-300">smoketrees.in ↗</a>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{EXPERIENCE[0]?.summary}</p>
              <p className="mt-4 font-mono text-xs text-zinc-500">{EDUCATION.degree}, {EDUCATION.school}</p>
            </div>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {EXPERIENCE[0]?.bullets.map((b, i) => (
                <li key={b} className="flex gap-4 py-4 text-sm leading-relaxed text-zinc-300">
                  <span className="font-mono text-xs text-zinc-600">{String(i + 1).padStart(2, '0')}</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="border-t border-white/10 py-14">
          <SectionHead index="03" title="Stack" note="Breadth, not badges. No logo wall." />
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label} className="border-t border-white/10 pt-4">
                <dt className="text-sm font-bold">{g.label}</dt>
                <dd className="mt-1.5 text-sm text-zinc-400">{g.items.join(', ')}</dd>
                {g.note ? <dd className="mt-1 font-mono text-[11px] text-zinc-600">{g.note}</dd> : null}
              </div>
            ))}
          </dl>
          <p className="mt-6 font-mono text-xs text-zinc-600">Daily: Arch + Hyprland · Neovim · OpenCode — this site: TanStack Start on Cloudflare</p>
        </section>

        {/* Blog preview */}
        <section id="blog" className="border-t border-white/10 py-14">
          <SectionHead index="04" title="Blog" note="Markdown files, no CMS." />
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-white/15 p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-bold">Notes, coming soon.</p>
              <p className="mt-1 max-w-md text-sm text-zinc-500">Tooling, ONDC lessons, reconciliation patterns, running a small eng team. Files live in src/content/blog.</p>
            </div>
            <Link to="/blog" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:bg-white/5">Visit blog →</Link>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-white/10 py-14 sm:py-20">
          <p className="font-mono text-xs text-[#d6fd51]">05 — Contact</p>
          <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight sm:text-5xl">Short emails get fast replies.</h2>
          <p className="mt-4 max-w-lg text-[15px] text-zinc-400">Tell me what you are building and what production means for it. I read everything.</p>
          <a href={`mailto:${SITE.email}`} className="mt-8 inline-block rounded-full bg-zinc-100 px-7 py-3.5 text-[15px] font-bold text-black hover:bg-[#d6fd51]">
            {SITE.email}
          </a>
          <p className="mt-6 font-mono text-xs text-zinc-600">
            GitHub <a className="underline underline-offset-4 hover:text-zinc-300" href={SITE.github}>adarshsingh87</a>
            {' · '}LinkedIn <a className="underline underline-offset-4 hover:text-zinc-300" href={SITE.linkedin}>adarshsingh87</a>
            {' · '}X <a className="underline underline-offset-4 hover:text-zinc-300" href={SITE.twitter}>adarshsingh87</a>
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
