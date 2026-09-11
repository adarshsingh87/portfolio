// V2 — Dark Neumorphism. Same-surface soft UI adapted for dark mode.
import { EXPERIENCE } from '../data/experience'
import { PROJECTS } from '../data/projects'
import { SKILL_GROUPS } from '../data/skills'
import { SITE } from '../data/site'

export function V2NeuDark() {
  const featured = PROJECTS.filter((p) => p.featured)
  return (
    <div className="neu-dark min-h-screen">
      <div className="mx-auto max-w-6xl px-5 pb-20">
        <header className="flex items-center justify-between py-6">
          <div className="neu-extrude-sm flex items-center gap-3 rounded-2xl px-4 py-2.5">
            <span className="neu-inset-deep flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold text-[#d6fd51]">A</span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#e6ebf2]">Adarsh Singh</p>
              <p className="text-[11px] text-[#9aa6b5]">molded, not placed</p>
            </div>
          </div>
          <nav className="neu-extrude-sm hidden items-center gap-1 rounded-2xl p-1.5 md:flex" aria-label="V2">
            {['Work', 'Stack', 'About', 'Contact'].map((l) => (
              <a key={l} href={`#v2-${l.toLowerCase()}`} className="rounded-xl px-4 py-2 text-[13px] text-[#9aa6b5] hover:text-white">{l}</a>
            ))}
            <a href={`mailto:${SITE.email}`} className="rounded-xl bg-[#d6fd51] px-4 py-2 text-[13px] font-bold text-black">Email</a>
          </nav>
        </header>

        <section className="neu-extrude rounded-[32px] p-8 sm:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="neu-inset inline-block rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#9aa6b5]">
                CTO · SmokeTrees Digital
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#eef2f7] sm:text-6xl">
                Pressed in.<br />Built to last.
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#9aa6b5]">
                I am a hands-on CTO. My work lives in Express middleware, Go
                services, Postgres schemas, and the templates that stop teams
                from solving the same setup twice.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#v2-work" className="neu-extrude-sm rounded-2xl px-6 py-3.5 text-sm font-bold text-[#e6ebf2] transition-transform hover:-translate-y-0.5 active:translate-y-0">View work</a>
                <a href={`mailto:${SITE.email}`} className="neu-inset rounded-2xl px-6 py-3.5 font-mono text-sm text-[#d6fd51]">{SITE.email}</a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="neu-extrude rounded-full p-6">
                <div className="neu-inset-deep flex h-64 w-64 items-center justify-center rounded-full sm:h-72 sm:w-72">
                  <div className="neu-extrude-sm flex h-44 w-44 flex-col items-center justify-center rounded-full text-center">
                    <span className="font-mono text-3xl font-bold text-[#e6ebf2]">AS</span>
                    <span className="mt-2 px-6 text-[11px] leading-snug text-[#9aa6b5]">Arch · Neovim<br />Go · TS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ['Millions', 'customers on prod systems'],
              ['3Cr+ / day', 'money reconciled'],
              ['50-60%', 'repetitive work removed'],
            ].map(([v, l]) => (
              <div key={l} className="neu-inset rounded-2xl px-4 py-5 text-center">
                <p className="text-xl font-extrabold text-[#e6ebf2]">{v}</p>
                <p className="mt-1 text-xs text-[#9aa6b5]">{l}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="v2-work" className="mt-8 grid gap-6 md:grid-cols-2">
          {featured.map((p) => (
            <article key={p.slug} className="neu-extrude rounded-[32px] p-7 sm:p-8">
              <div className="neu-inset-deep mb-5 inline-block rounded-xl px-3 py-1.5 font-mono text-[11px] text-[#9aa6b5]">{p.kind}</div>
              <h3 className="text-xl font-bold text-[#eef2f7]">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9aa6b5]">{p.summary}</p>
              <ul className="mt-4 space-y-2">
                {p.points.slice(0, 2).map((pt) => (
                  <li key={pt} className="neu-inset rounded-xl px-3.5 py-2.5 text-[13px] text-[#c4ccd6]">{pt}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="v2-stack" className="neu-extrude mt-8 rounded-[32px] p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold text-[#eef2f7]">Tools, pressed flat</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SKILL_GROUPS.map((g) => (
              <div key={g.label} className="neu-inset rounded-2xl p-4">
                <p className="text-[13px] font-bold text-[#e6ebf2]">{g.label}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#9aa6b5]">{g.items.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="v2-about" className="neu-extrude mt-8 rounded-[32px] p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold text-[#eef2f7]">About</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[#9aa6b5]">{EXPERIENCE[0]?.summary}</p>
          <p className="neu-inset mt-6 rounded-2xl p-5 text-center font-mono text-xs text-[#9aa6b5]">Blog — comming soon placeholder</p>
        </section>

        <section id="v2-contact" className="neu-extrude mt-8 rounded-[32px] p-10 text-center">
          <h2 className="text-3xl font-extrabold text-[#eef2f7]">Push to talk.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#9aa6b5]">The button below is inset. The inbox behind it is real.</p>
          <a href={`mailto:${SITE.email}`} className="neu-inset-deep mt-6 inline-block rounded-2xl px-8 py-4 font-mono text-sm font-bold text-[#d6fd51]">{SITE.email}</a>
          <p className="mt-8 font-mono text-[11px] text-[#5f6b7a]">V2 · dark neumorphism · 44px targets · AAA text</p>
        </section>
      </div>
    </div>
  )
}
