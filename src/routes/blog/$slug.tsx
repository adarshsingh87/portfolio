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
import {
  BLOG_ID,
  PERSON_REF,
  absoluteUrl,
  breadcrumbs,
  jsonLd,
  pageMeta,
} from '../../lib/seo'

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

    const path = `/blog/${loaderData.slug}`
    const postUrl = absoluteUrl(path)
    const postPreviewImage = `${SITE.domain}/blog/${loaderData.slug}.png`

    return {
      meta: [
        ...pageMeta({
          title: `${loaderData.title} | ${SITE.name}`,
          shareTitle: loaderData.title,
          description: loaderData.description,
          path,
          type: 'article',
          image: postPreviewImage,
          imageAlt: `Preview image for "${loaderData.title}"`,
        }),
        { name: 'keywords', content: loaderData.tags.join(', ') },
        {
          name: 'robots',
          content: loaderData.draft ? 'noindex, nofollow' : 'index, follow',
        },
        { property: 'article:published_time', content: loaderData.date },
        { property: 'article:author', content: SITE.name },
      ],
      scripts: [
        jsonLd({
          '@graph': [
            {
              '@type': 'BlogPosting',
              headline: loaderData.title,
              description: loaderData.description,
              datePublished: loaderData.date,
              dateModified: loaderData.date,
              image: postPreviewImage,
              inLanguage: 'en',
              author: PERSON_REF,
              publisher: PERSON_REF,
              mainEntityOfPage: postUrl,
              url: postUrl,
              keywords: loaderData.tags.join(', '),
              timeRequired: `PT${loaderData.readingMinutes}M`,
              isPartOf: {
                '@type': 'Blog',
                '@id': BLOG_ID,
                name: `Writing by ${SITE.name}`,
                url: absoluteUrl('/blog'),
              },
            },
            breadcrumbs([
              { name: 'Home', path: '/' },
              { name: 'Writing', path: '/blog' },
              { name: loaderData.title, path },
            ]),
          ],
        }),
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
    <main id="main" className="wrap post" data-atmo="quiet">
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
