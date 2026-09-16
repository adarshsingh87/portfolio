import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { SiteFooter, SiteNav } from '../../components/site'
import {
  BLOG_TITLE_TRANSITION_TYPE,
  blogTitleTransitionName,
  getPost,
} from '../../lib/blog'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — ${SITE.name}` },
          { name: 'description', content: loaderData.description },
          { property: 'og:title', content: loaderData.title },
          { property: 'og:description', content: loaderData.description },
        ]
      : [],
  }),
  component: Post,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Post not found.</h1>
        <Link to="/blog" className="mt-4 inline-block underline">Back to blog</Link>
      </main>
    </div>
  ),
})

function Post() {
  const post = Route.useLoaderData()
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <SiteNav />
      <main id="main" className="mx-auto max-w-3xl px-5 py-14">
        {/* No Reveal here: this header is the shared-element morph target and
            must be snapshot-visible the moment the transition starts. */}
        <Link to="/blog" viewTransition={{ types: [BLOG_TITLE_TRANSITION_TYPE] }} className="font-mono text-xs text-zinc-500 hover:text-zinc-200">← All notes</Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl" style={{ viewTransitionName: blogTitleTransitionName(post.slug) }}>{post.title}</h1>
        <p className="mt-3 font-mono text-xs text-zinc-500">
          {post.date} · {post.readingMinutes} min · {post.tags.join(', ')}
        </p>
        <article className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
      </main>
      <SiteFooter />
    </div>
  )
}
