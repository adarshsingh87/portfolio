import { createFileRoute } from '@tanstack/react-router'
import { PROJECTS } from '../data/projects'
import { SITE } from '../data/site'
import { SiteFooter, SiteNav } from '../components/site'
import { TechStackLine } from '../components/icons'
import { Reveal } from '../components/reveal'

export const Route = createFileRoute('/work')({
  head: () => ({
    meta: [
      { title: `Work — ${SITE.name}` },
      { name: 'description', content: 'Selected engineering work: OSS tooling, product builds, integrations, and automation.' },
    ],
  }),
  component: Work,
})

function Work() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <SiteNav />
      <main id="main" className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
        <p className="font-mono text-xs text-zinc-500">Archive</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">All work, OSS first.</h1>
        <p className="mt-4 max-w-2xl text-[15px] text-zinc-400">
          Tooling I maintain, products I shaped, integrations that survived contact
          with production. Metrics shown are the ones confirmed: millions of
          customers, 3Cr+ reconciled daily, 50-60% repetitive work removed.
        </p>
        </Reveal>
        <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 60, 300)}>
            <article className="bg-[#0a0a0b] p-7 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-bold tracking-tight">{p.title}</h2>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#d6fd51]">{p.kind}</span>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">{p.summary}</p>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {p.points.map((pt) => (
                  <li key={pt} className="text-[13px] text-zinc-500">— {pt}</li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-[11px] text-zinc-600"><TechStackLine items={p.stack} size={13} /></p>
            </article>
            </Reveal>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
