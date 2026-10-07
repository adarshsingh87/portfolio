import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { NotFoundPage } from '../../components/not-found'
import { PostList } from '../../components/post-list'
import {
  BLOG_TITLE_TRANSITION_TYPE,
  blogTitleTransitionName,
} from '../../lib/blog-shared'
import { fetchEntries, fetchPost } from '../../lib/blog-api'
import { formatDate } from '../../lib/format'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    // Independent requests, so they run in parallel.
    const [post, entries] = await Promise.all([
      fetchPost({ data: params.slug }),
      fetchEntries({ data: undefined }),
    ])
    if (!post) throw notFound()
    const others = entries
      .filter((e) => e.kind !== 'internal' || e.slug !== post.slug)
      .slice(0, 2)
    return { ...post, others }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] }

    const postUrl = `${SITE.domain}/blog/${loaderData.slug}`
    const postPreviewImage = `${SITE.domain}/blog/${loaderData.slug}.png`
    const postPreviewImageAlt = `Preview image for "${loaderData.title}"`
    const pageTitle = `${loaderData.title} | ${SITE.name}`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: loaderData.description },
        { name: 'author', content: SITE.name },
        { name: 'keywords', content: loaderData.tags.join(', ') },
        {
          name: 'robots',
          content: loaderData.draft ? 'noindex, nofollow' : 'index, follow',
        },
        { property: 'og:type', content: 'article' },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: loaderData.description },
        { property: 'og:url', content: postUrl },
        { property: 'og:image', content: postPreviewImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: postPreviewImageAlt },
        { property: 'article:published_time', content: loaderData.date },
        { property: 'article:author', content: SITE.name },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: SITE.twitterHandle },
        { name: 'twitter:creator', content: SITE.twitterHandle },
        { name: 'twitter:title', content: loaderData.title },
        { name: 'twitter:description', content: loaderData.description },
        { name: 'twitter:image', content: postPreviewImage },
        { name: 'twitter:image:alt', content: postPreviewImageAlt },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: loaderData.title,
            description: loaderData.description,
            datePublished: loaderData.date,
            image: postPreviewImage,
            author: {
              '@type': 'Person',
              name: SITE.name,
              url: SITE.domain,
            },
            publisher: {
              '@type': 'Person',
              name: SITE.name,
              url: SITE.domain,
            },
            mainEntityOfPage: postUrl,
            url: postUrl,
            keywords: loaderData.tags.join(', '),
            isPartOf: {
              '@type': 'Blog',
              name: `Writing by ${SITE.name}`,
              url: `${SITE.domain}/blog`,
            },
          }),
        },
      ],
    }
  },
  component: Post,
  notFoundComponent: () => <NotFoundPage />,
})

function Post() {
  const post = Route.useLoaderData()
  const { others } = post

  return (
    <main id="main" className="post">
      <article>
        <header className="post-head" data-chapter={post.title}>
          <Link
            to="/blog"
            viewTransition={{ types: [BLOG_TITLE_TRANSITION_TYPE] }}
            className="back-link"
          >
            Writing
          </Link>
          <h1
            className="post-title"
            style={{ viewTransitionName: blogTitleTransitionName(post.slug) }}
          >
            {post.title}
          </h1>
          <p className="post-dek">{post.description}</p>
          <p className="post-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingMinutes} min read</span>
          </p>
        </header>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
      {others.length > 0 ? (
        <aside className="post-more" aria-labelledby="more-title">
          <h2 id="more-title">Keep reading</h2>
          <PostList entries={others} />
        </aside>
      ) : null}
    </main>
  )
}
