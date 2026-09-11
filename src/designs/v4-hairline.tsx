// V4 — Hairline Grid. Linear/Vercel-adjacent minimal: 12-col grid, hairlines, dot grid, small caps.
import { EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'

export function V4Hairline() {
  const featured = PROJECTS.filter((p) => p.featured)
  return (
    <div className="min-h-screen bg-[#0b0d10] text-zinc-200">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(125,211,252,0.09),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 pb-20">
        <header className="flex h-16 items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 text-[11px]">A</span>
            <span className="tracking-tight text-zinc-300">adarshsingh87</span>
            <span className="hidden text-zinc-600 sm:inline">/ portfolio</span>
          </div>
          <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-widest text-zinc-500" aria-label="V4">
            <a href="#v4-work" className="hover:text-white">Work</a>
            <a href="#v4-stack" className="hover:text-white">Stack</a>
            <a href="#v4-exp" className="hover:text-white">Exp</a>
            <a href={`mailto:${SITE.email}`} className="rounded-md border border-white/15 px-3 py-1.5 text-zinc-200 hover:bg-white hover:text-black">Contact</a>
          </nav>
        </header>

        <section className="grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] mt-10">
          <div className="bg-[#0b0d10] p-8 sm:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-300/80">● systems · integrations · automation</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Adarsh Singh builds the boring parts so production stays interesting.
            </h1>
            <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-zinc-400">
              CTO at SmokeTrees Digital. Express context libraries, Next.js and backend
              templates, ONDC flows, Shopify sync, reconciliation at 3Cr+ a day. Small
              team, steady output.
            </p>
            <div className="mt-8 grid sm:grid-cols-3">
              {[
                ['OSS first', 'smoke-context + templates'],
                ['Scale', 'millions of customers'],
                ['Leverage', '50-60% less repeat work'],
              ].map(([k, v], i) => (
                <div key={k} className={`border-white/[0.08] py-4 pr-6 ${i > 0 ? 'sm:border-l sm:pl-6' : ''}`}>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">{k}</p>
                  <p className="mt-1 text-sm text-zinc-200">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="v4-work" className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Selected work</h2>
            <span className="font-mono text-[11px] text-zinc-600">{featured.length} items · OSS first</span>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
            {featured.map((p) => (
              <article key={p.slug} className="group bg-[#0b0d10] p-7 transition-colors hover:bg-[#0e1116]">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="uppercase tracking-widest text-zinc-500">{p.kind}</span>
                  <span className="text-zinc-700 transition-colors group-hover:text-sky-300">↗</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{p.summary}</p>
                <p className="mt-4 border-t border-white/[0.06] pt-3 font-mono text-[11px] text-zinc-500">{p.stack.join('  /  ')}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="v4-stack" className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-[1fr_2fr]">
          <div className="bg-[#0b0d10] p-7">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Stack</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">Breadth over badges. What I reach for when production is on the line.</p>
          </div>
          <div className="grid bg-white/[0.08] gap-px sm:grid-cols-2">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label} className="bg-[#0b0d10] p-6">
                <p className="text-sm font-semibold text-zinc-100">{g.label}</p>
                <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-500">{g.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="v4-exp" className="mt-10 rounded-xl border border-white/[0.08] p-7 sm:p-9">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Experience</h2>
          <p className="mt-4 text-[15px] font-medium text-zinc-100">CTO — SmokeTrees Digital</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">{EXPERIENCE[0]?.summary}</p>
          <div className="mt-5 grid gap-2">
            {EXPERIENCE[0]?.bullets.map((b) => (
              <p key={b} className="border-l-2 border-sky-300/40 pl-4 text-[13px] leading-relaxed text-zinc-400">{b}</p>
            ))}
          </div>
          <p className="mt-6 rounded-lg border border-dashed border-white/10 p-4 text-center font-mono text-[11px] text-zinc-500">Blog — comming soon</p>
        </section>

        <section className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-7 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-zinc-400">$ mail {SITE.email}</p>
          <a href={`mailto:${SITE.email}`} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-sky-200">Write an email</a>
        </section>
      </div>
    </div>
  )
}
