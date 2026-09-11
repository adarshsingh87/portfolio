import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { SiteFooter, SiteNav } from '../../components/site'

export const Route = createFileRoute('/designs/')({
  head: () => ({
    meta: [{ title: `Design variants — ${SITE.name}` }],
  }),
  component: Designs,
})

const VARIANTS = [
  {
    slug: 'v1', name: 'V1 — Midnight Glass', desc: 'Dark glassmorphism. Layered blur, aurora background, glass panels and chips.',
    strengths: 'Premium feel, clear hierarchy, strong hero metrics.', weaknesses: 'Backdrop-blur cost on low-end phones. Needs contrast care.',
  },
  {
    slug: 'v2', name: 'V2 — Soft Press Dark', desc: 'Neumorphism adapted to dark mode. Same-surface extruded and inset physics.',
    strengths: 'Tactile, memorable, calm. True depth system.', weaknesses: 'Low-contrast risk for muted text. Heavier shadows, less editorial.',
  },
  {
    slug: 'v3', name: 'V3 — Editorial Minimal (production)', desc: 'Type-led single column. Hairlines, numbered sections, no cards.',
    strengths: 'Fastest, most readable, most maintainable. Best for a CTO brand.', weaknesses: 'Least decorative. Relies on copy quality.',
  },
  {
    slug: 'v4', name: 'V4 — Hairline Grid', desc: 'Product-grid minimal. Hairline cells, small caps, dot-free precision.',
    strengths: 'Scales to many projects. Familiar to engineers.', weaknesses: 'Can read as a tool UI rather than a person.',
  },
  {
    slug: 'v5', name: 'V5 — Ink Serif', desc: 'Warm-black quiet luxury. Serif display, centered rhythm, footnote numbering.',
    strengths: 'Distinct, confident, executive-friendly.', weaknesses: 'Serif taste is polarizing. Centered text hurts long reads.',
  },
]

function Designs() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <SiteNav />
      <main id="main" className="mx-auto max-w-6xl px-5 py-14">
        <p className="font-mono text-xs text-zinc-500">Process</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Five dark-minimal directions, one winner.</h1>
        <p className="mt-4 max-w-2xl text-[15px] text-zinc-400">
          Per your call: no terminal, no overdone templates. All five stay dark and
          restrained, including dark glass and dark neumorphism. Each variant below
          renders the same content (hero, work, stack, experience, blog, contact)
          so the comparison is honest.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {VARIANTS.map((v) => (
            <article key={v.slug} className="rounded-2xl border border-white/10 p-7">
              <h2 className="text-lg font-bold">{v.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">{v.desc}</p>
              <p className="mt-3 text-[13px] text-zinc-500"><span className="text-zinc-300">Strong:</span> {v.strengths}</p>
              <p className="mt-1 text-[13px] text-zinc-500"><span className="text-zinc-300">Weak:</span> {v.weaknesses}</p>
              <Link to="/designs/$variant" params={{ variant: v.slug }} className="mt-5 inline-block rounded-full bg-zinc-100 px-4 py-2 text-[13px] font-bold text-black hover:bg-[#d6fd51]">
                Open {v.slug.toUpperCase()} →
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-[#d6fd51]/30 bg-[#d6fd51]/5 p-7">
          <h2 className="text-lg font-bold">Recommendation: V3 Editorial Minimal.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">
            It is the fastest to load, easiest to read on a phone, cheapest to maintain,
            and the best fit for a 50/50 CTO and engineer brand that also speaks to
            executives. Glass (V1) is the runner-up for drama, but blur cost and contrast
            risk make it the wrong default. The production homepage at <Link to="/" className="underline">/</Link> is
            V3 refined with full content, SEO, and Cloudflare deployment.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
