// V1 — Midnight Glass. Dark glassmorphism: layered blur, aurora bg, glass panels.
import { EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { PRINCIPLES, SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'

export function V1Glass() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 6)
  return (
    <div className="relative min-h-screen overflow-clip bg-[#070b14] text-slate-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(125,211,252,0.22),transparent)] blur-3xl" />
        <div className="absolute right-[-160px] top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,0.18),transparent)] blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-120px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(214,253,81,0.08),transparent)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="glass-chip flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold">A</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Adarsh Singh</p>
            <p className="text-[11px] text-slate-400">CTO · SmokeTrees Digital</p>
          </div>
        </div>
        <nav className="glass-chip hidden items-center gap-1 rounded-full px-2 py-1 text-[13px] md:flex" aria-label="V1">
          {['Work', 'Stack', 'Experience', 'Blog', 'Contact'].map((l) => (
            <a key={l} href={`#v1-${l.toLowerCase()}`} className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/10 hover:text-white">{l}</a>
          ))}
          <a href={`mailto:${SITE.email}`} className="ml-1 rounded-full bg-white px-3.5 py-1.5 font-semibold text-slate-950">Email</a>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-20">
        <section className="grid gap-6 pt-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel reveal rounded-[28px] p-8 sm:p-12">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Available for select builds
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Systems that hold up in production.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300">
              I am Adarsh, CTO at SmokeTrees Digital. I work across the stack on
              integrations, automation, and cloud infrastructure, and I keep the
              defaults sharp so small teams ship like bigger ones.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#v1-work" className="rounded-2xl bg-[#d6fd51] px-5 py-3 text-sm font-bold text-slate-950">See selected work</a>
              <a href={`mailto:${SITE.email}`} className="glass-chip rounded-2xl px-5 py-3 text-sm font-semibold text-white">me@adarshsingh87.com</a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-3 text-center">
              {[
                ['Millions', 'customers served'],
                ['3Cr+ / day', 'reconciled flows'],
                ['50-60%', 'setup time cut'],
              ].map(([v, l]) => (
                <div key={l} className="glass-chip rounded-2xl px-2 py-4">
                  <dt className="text-lg font-extrabold">{v}</dt>
                  <dd className="mt-1 text-[11px] leading-snug text-slate-400">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-6">
            <div className="glass-panel rounded-[28px] p-7">
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Now</p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-200">
                {EXPERIENCE[0]?.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['Go', 'TypeScript', 'Postgres', 'AWS', 'ONDC', 'Next.js'].map((t) => (
                  <span key={t} className="glass-chip rounded-full px-3 py-1 font-mono text-[11px] text-slate-300">{t}</span>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-[28px] p-7">
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Principles</p>
              <ul className="mt-4 space-y-3">
                {PRINCIPLES.map((p) => (
                  <li key={p.title} className="text-sm leading-relaxed text-slate-300">
                    <span className="font-semibold text-white">{p.title}.</span> {p.body}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="v1-work" className="mt-6 grid gap-6 md:grid-cols-2">
          {featured.map((p) => (
            <article key={p.slug} className="glass-panel rounded-[24px] p-7 transition-transform hover:-translate-y-1">
              <p className="font-mono text-[11px] uppercase tracking-widest text-sky-200/80">{p.kind}</p>
              <h3 className="mt-2 text-xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-300">{s}</span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section id="v1-stack" className="glass-panel mt-6 rounded-[24px] p-7 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight">Stack, without the logo wall</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label}>
                <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">{g.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">{g.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="v1-blog" className="glass-panel mt-6 flex flex-col items-start justify-between gap-4 rounded-[24px] p-7 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blog</h2>
            <p className="mt-2 text-sm text-slate-300">Long-form notes on tooling, integrations, and running a small eng team. Coming soon.</p>
          </div>
          <span className="glass-chip rounded-full px-4 py-2 font-mono text-xs text-slate-200">comming soon</span>
        </section>

        <section id="v1-contact" className="glass-panel mt-6 rounded-[24px] p-8 text-center sm:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight">One inbox, no form.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">Short emails get fast replies. Tell me what you are building and what production means for it.</p>
          <a href={`mailto:${SITE.email}`} className="mt-6 inline-block rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950">{SITE.email}</a>
        </section>
      </main>
    </div>
  )
}
