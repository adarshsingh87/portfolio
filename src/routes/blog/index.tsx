import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { SiteFooter, SiteNav } from '../../components/site'
import { getAllEntries } from '../../lib/blog'

export const Route = createFileRoute('/blog/')({
  loader: () => getAllEntries(),
  head: () => ({
    meta: [
      { title: `Blog — ${SITE.name}` },
      { name: 'description', content: 'Notes on tooling, integrations, and running a small engineering team. Markdown-driven, no CMS.' },
    ],
  }),
  component: BlogIndex,
})

function BlogIndex() {
  const entries = Route.useLoaderData()
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <SiteNav />
      <main id="main" className="mx-auto max-w-3xl px-5 py-14">
        <p className="font-mono text-xs text-zinc-500">Blog</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Notes.</h1>
        {entries.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <p className="inline-block rounded-full border border-white/10 px-4 py-1.5 font-mono text-xs text-zinc-400">comming soon</p>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-zinc-400">
              No posts published yet. New posts are Markdown files in{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">src/content/blog</code>.
              Add one, rebuild, and it appears here automatically.
            </p>
            <p className="mt-6 font-mono text-[11px] text-zinc-600">See BLOG_GUIDE.md for the 60-second workflow</p>
          </div>
        ) : (
          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {entries.map((e) =>
              e.kind === 'internal' ? (
                <Link key={e.slug} to="/blog/$slug" params={{ slug: e.slug }} className="group block py-6">
                  <p className="font-mono text-[11px] text-zinc-500">{e.date} · {e.readingMinutes} min</p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight group-hover:underline group-hover:decoration-[#d6fd51] group-hover:underline-offset-4">{e.title}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{e.description}</p>
                </Link>
              ) : (
                <a key={e.url} href={e.url} target="_blank" rel="noopener noreferrer" className="group block py-6">
                  <p className="font-mono text-[11px] text-zinc-500">
                    {e.date} · {e.source} <span aria-hidden>↗</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight group-hover:underline group-hover:decoration-[#d6fd51] group-hover:underline-offset-4">{e.title}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{e.description}</p>
                </a>
              ),
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
