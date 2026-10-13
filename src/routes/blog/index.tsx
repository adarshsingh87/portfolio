import { createFileRoute } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { PostList } from '../../components/post-list'
import { fetchEntries } from '../../lib/blog-api'
import {
  BLOG_ID,
  PERSON_REF,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
  pageMeta,
} from '../../lib/seo'

const BLOG_DESCRIPTION =
  'Notes by Adarsh Singh on backend systems, protocols, developer tooling, and the decisions behind them.'
const BLOG_URL = absoluteUrl('/blog')
const BLOG_PREVIEW_IMAGE = `${SITE.domain}/blog-preview.png`
const BLOG_PREVIEW_IMAGE_ALT =
  'Writing by Adarsh Singh on backend systems and developer tooling'

export const Route = createFileRoute('/blog/')({
  loader: () => fetchEntries({ data: undefined }),
  head: ({ loaderData }) => ({
    meta: pageMeta({
      title: `Writing, ${SITE.name}`,
      description: BLOG_DESCRIPTION,
      path: '/blog',
      image: BLOG_PREVIEW_IMAGE,
      imageAlt: BLOG_PREVIEW_IMAGE_ALT,
    }),
    scripts: [
      jsonLd({
        '@type': 'Blog',
        '@id': BLOG_ID,
        url: BLOG_URL,
        name: `Writing by ${SITE.name}`,
        description: BLOG_DESCRIPTION,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        author: PERSON_REF,
        blogPost: (loaderData ?? [])
          .filter((e) => e.kind === 'internal')
          .map((e) => ({
            '@type': 'BlogPosting',
            headline: e.title,
            description: e.description,
            datePublished: e.date,
            url: absoluteUrl(`/blog/${e.slug}`),
          })),
      }),
    ],
  }),
  component: BlogIndex,
})

function BlogIndex() {
  const entries = Route.useLoaderData()

  return (
    <main id="main" className="wrap blog-index" data-atmo="quiet">
      <header className="page-head">
        <h1>Writing</h1>
        <p>
          Notes on systems I have built and what they taught me, written for the
          engineer who has to run them next.
        </p>
      </header>
      <PostList entries={entries} level={2} />
    </main>
  )
}
