import { createFileRoute } from '@tanstack/react-router'
import { SITE } from '../../data/site'
import { PostList } from '../../components/post-list'
import { fetchEntries } from '../../lib/blog-api'

const BLOG_DESCRIPTION =
  'Notes by Adarsh Singh on backend systems, protocols, developer tooling, and the decisions behind them.'
const BLOG_URL = `${SITE.domain}/blog`
const BLOG_PREVIEW_IMAGE = `${SITE.domain}/blog-preview.png`
const BLOG_PREVIEW_IMAGE_ALT =
  'Writing by Adarsh Singh on backend systems and developer tooling'

export const Route = createFileRoute('/blog/')({
  loader: () => fetchEntries({ data: undefined }),
  head: () => ({
    meta: [
      { title: `Writing, ${SITE.name}` },
      { name: 'description', content: BLOG_DESCRIPTION },
      { name: 'author', content: SITE.name },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: `Writing, ${SITE.name}` },
      { property: 'og:description', content: BLOG_DESCRIPTION },
      { property: 'og:url', content: BLOG_URL },
      { property: 'og:image', content: BLOG_PREVIEW_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: BLOG_PREVIEW_IMAGE_ALT },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: SITE.twitterHandle },
      { name: 'twitter:creator', content: SITE.twitterHandle },
      { name: 'twitter:title', content: `Writing, ${SITE.name}` },
      { name: 'twitter:description', content: BLOG_DESCRIPTION },
      { name: 'twitter:image', content: BLOG_PREVIEW_IMAGE },
      { name: 'twitter:image:alt', content: BLOG_PREVIEW_IMAGE_ALT },
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
