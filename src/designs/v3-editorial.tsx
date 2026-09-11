// V3 — Editorial Minimal Dark. The production pick. Type-led, hairlines, no cards.
import { EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'

export function V3Editorial() {
  const featured = PROJECTS.filter((p) => p.featured)
  const rest = PROJECTS.filter((p) => !p.featured)
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <div className="mx-auto max-w-3xl px-5 pb-24">
        <header className="flex items-center justify-between border-b border-white/10 py-5">
          <p className="text-sm font-semibold tracking-tight">Adarsh Singh <span className="ml-2 font-mono text-[11px] font-normal text-zinc-500">CTO, SmokeTrees</span></p>
          <nav className="flex gap-4 font-mono text-xs text-zinc-400" aria-label="V3">
            <a href="#v3-work" className="hover:text-white">Work</a>
            <a href="#v3-stack" className="hover:text-white">Stack</a>
            <a href="#v3-blog" className="hover:text-white">Blog</a>
            <a href={`mailto:${SITE.email}`} className="text-[#d6fd51]">Email</a>
          </nav>
        </header>

        <section className="border-b border-white/10 py-14 sm:py-20">
          <p className="font-mono text-xs text-zinc-500">Portfolio — 2026</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            I run engineering and still ship it.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Hands-on CTO at SmokeTrees Digital. I build production systems across
            frontend, backend, and cloud, then turn the repeatable parts into
            templates so the next project starts further along.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 font-mono text-xs text-zinc-500">
            <span>Millions of customers</span>
            <span>3Cr+ / day reconciled</span>
            <span>50-60% setup time cut</span>
          </div>
        </section>

        <section id="v3-work" className="border-b border-white/10 py-12">
          <p className="font-mono text-xs text-[#d6fd51]">01 — Selected work, OSS first</p>
          <div className="mt-6">
            {featured.map((p, i) => (
              <article key={p.slug} className="group border-t border-white/10 py-7 first:border-t-0 first:pt-0">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-bold tracking-tight group-hover:underline group-hover:decoration-[#d6fd51] group-hover:underline-offset-4">
                    <span className="mr-3 font-mono text-xs font-normal text-zinc-600">{String(i + 1).padStart(2, '0')}</span>
                    {p.title}
                  </h3>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-zinc-500">{p.kind}</span>
                </div>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-zinc-400">{p.summary}</p>
                <p className="mt-3 font-mono text-xs text-zinc-500">{p.stack.join(' · ')}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Also</p>
            {rest.map((p) => (
              <p key={p.slug} className="mt-3 text-sm text-zinc-400">
                <span className="font-semibold text-zinc-200">{p.title}.</span> {p.summary}
              </p>
            ))}
          </div>
        </section>

        <section id="v3-stack" className="border-b border-white/10 py-12">
          <p className="font-mono text-xs text-[#d6fd51]">02 — Stack</p>
          <dl className="mt-6 space-y-5">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label} className="grid gap-1 sm:grid-cols-[180px_1fr]">
                <dt className="text-sm font-semibold text-zinc-200">{g.label}</dt>
                <dd className="text-sm text-zinc-400">{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-zinc-500">
            Arch + Hyprland, Neovim, OpenCode. This site runs TanStack Start on Cloudflare.
          </p>
        </section>

        <section className="border-b border-white/10 py-12">
          <p className="font-mono text-xs text-[#d6fd51]">03 — How I work</p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-300">{EXPERIENCE[0]?.summary}</p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-400">
            {EXPERIENCE[0]?.bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </section>

        <section id="v3-blog" className="border-b border-white/10 py-12">
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-xs text-[#d6fd51]">04 — Blog</p>
            <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-zinc-400">comming soon</span>
          </div>
          <p className="mt-4 text-sm text-zinc-500">Markdown-driven, no CMS. Posts appear when a file lands in src/content/blog.</p>
        </section>

        <section className="py-12">
          <p className="font-mono text-xs text-[#d6fd51]">05 — Contact</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight">Email works best.</h2>
          <a href={`mailto:${SITE.email}`} className="mt-4 inline-block text-lg font-semibold underline decoration-[#d6fd51] decoration-2 underline-offset-8 hover:bg-[#d6fd51] hover:text-black hover:no-underline">{SITE.email}</a>
          <p className="mt-6 font-mono text-xs text-zinc-600">GitHub · LinkedIn · X — adarshsingh87</p>
        </section>
      </div>
    </div>
  )
}
