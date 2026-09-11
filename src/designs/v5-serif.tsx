// V5 — Ink Serif. Warm-black quiet luxury: serif display, generous air, numbered footnotes.
import { EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'

export function V5Serif() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 4)
  return (
    <div className="min-h-screen bg-[#0e0e0c] text-[#ece9e2]">
      <div className="mx-auto max-w-4xl px-6 pb-24">
        <header className="flex items-center justify-between py-8">
          <p className="font-serif text-lg italic">Adarsh Singh</p>
          <nav className="flex gap-5 text-[13px] text-[#a8a49a]" aria-label="V5">
            <a href="#v5-work" className="hover:text-white">Work</a>
            <a href="#v5-stack" className="hover:text-white">Stack</a>
            <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">Contact</a>
          </nav>
        </header>

        <section className="border-y border-white/10 py-16 text-center sm:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8f8b81]">CTO · SmokeTrees Digital · India</p>
          <h1 className="mx-auto mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Software that behaves.
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-[#b8b4a9]">
            I lead engineering and write code most weeks. Integrations, automation,
            and templates that let small teams carry production weight.
          </p>
          <p className="mt-8 font-mono text-xs text-[#8f8b81]">millions served · 3Cr+ reconciled daily · 50-60% repetition removed</p>
        </section>

        <section id="v5-work" className="py-14">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-[#8f8b81]">Selected work</p>
          <div className="mt-10 space-y-12">
            {featured.map((p, i) => (
              <article key={p.slug} className="grid gap-4 sm:grid-cols-[64px_1fr] sm:gap-6">
                <span className="font-serif text-4xl italic text-[#3f3d38]">{String(i + 1).padStart(2, '0')}</span>
                <div className="border-b border-white/10 pb-12">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#8f8b81]">{p.kind}</p>
                  <h3 className="mt-2 font-serif text-3xl font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#b8b4a9]">{p.summary}</p>
                  <p className="mt-4 font-mono text-xs text-[#8f8b81]">{p.stack.join(' — ')}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="v5-stack" className="border-t border-white/10 py-14">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-[#8f8b81]">Instruments</p>
          <div className="mx-auto mt-8 max-w-2xl text-center">
            {SKILL_GROUPS.map((g) => (
              <p key={g.label} className="mt-4 text-[15px] leading-relaxed text-[#b8b4a9]">
                <span className="font-serif italic text-[#ece9e2]">{g.label}.</span> {g.items.join(', ')}
              </p>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <p className="font-serif text-2xl italic leading-relaxed text-[#d8d4ca]">
            “{EXPERIENCE[0]?.summary}”
          </p>
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-widest text-[#8f8b81]">Blog — comming soon</p>
        </section>

        <section className="border-t border-white/10 py-14 text-center">
          <p className="font-serif text-4xl">Write to me.</p>
          <a href={`mailto:${SITE.email}`} className="mt-5 inline-block border-b-2 border-[#d6fd51] pb-1 font-mono text-sm text-[#ece9e2]">{SITE.email}</a>
          <p className="mt-8 font-mono text-[11px] text-[#6b675e]">V5 · warm black · serif display · no cards</p>
        </section>
      </div>
    </div>
  )
}
