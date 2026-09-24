import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { NotFoundPage } from '../../components/not-found'
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
  notFoundComponent: () => <NotFoundPage />,
})

function Post() {
  const post = Route.useLoaderData()
  return (
    <div className="post-page">
      <SiteNav />
      <main id="main" className="post-main">
        <Link
          to="/blog"
          viewTransition={{ types: [BLOG_TITLE_TRANSITION_TYPE] }}
          className="post-back"
        >
          ← All notes
        </Link>
        <h1
          className="post-title"
          style={{ viewTransitionName: blogTitleTransitionName(post.slug) }}
        >
          {post.title}
        </h1>
        <p className="post-meta">
          {post.date} · {post.readingMinutes} min · {post.tags.join(', ')}
        </p>
        <article
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
