import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

import appCss from '../styles.css?url'
import { SITE } from '../data/site'

// Devtools are dev-only: lazy + never rendered in prod so they stay out
// of the production bundle (bundle-dynamic-imports / bundle-defer-third-party).
const TanStackDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-devtools').then((m) => ({
        default: m.TanStackDevtools,
      })),
    )
const TanStackRouterDevtoolsPanel = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-router-devtools').then((m) => ({
        default: m.TanStackRouterDevtoolsPanel,
      })),
    )

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${SITE.name}, CTO at ${SITE.company}` },
      { name: 'description', content: SITE.description },
      { name: 'author', content: SITE.name },
      { name: 'theme-color', content: '#11110f' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: `${SITE.name}, portfolio` },
      { property: 'og:title', content: `${SITE.name}, CTO at ${SITE.company}` },
      { property: 'og:description', content: SITE.description },
      { property: 'og:url', content: SITE.domain },
      { property: 'og:image', content: `${SITE.domain}/og.svg` },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: `${SITE.name}, CTO at ${SITE.company}`,
      },
      { name: 'twitter:description', content: SITE.description },
      { name: 'twitter:image', content: `${SITE.domain}/og.svg` },
      {
        name: 'keywords',
        content:
          'Adarsh Singh, CTO, software engineer, full-stack engineer, React, Next.js, Go, TypeScript, cloud, developer tooling',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: SITE.domain },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: SITE.name,
          jobTitle: 'CTO',
          worksFor: {
            '@type': 'Organization',
            name: SITE.company,
            url: SITE.companyUrl,
          },
          url: SITE.domain,
          email: `mailto:${SITE.email}`,
          sameAs: [SITE.github, SITE.linkedin, SITE.twitter],
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        {children}
        {import.meta.env.DEV ? (
          <Suspense fallback={null}>
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </Suspense>
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
