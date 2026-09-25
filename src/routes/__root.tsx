import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { CursorField } from '../components/cursor'
import { EasterEggs } from '../components/easter-eggs'
import { NotFoundPage } from '../components/not-found'
import { SITE } from '../data/site'

const TRAILING_SLASH_RE = /\/$/

function getCanonicalUrl(pathname: string | undefined) {
  if (!pathname || pathname === '/') return SITE.domain
  return `${SITE.domain}${pathname.replace(TRAILING_SLASH_RE, '')}`
}

export const Route = createRootRoute({
  head: ({ matches }) => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${SITE.name}, CTO at ${SITE.company}` },
      { name: 'description', content: SITE.description },
      { name: 'author', content: SITE.name },
      { name: 'theme-color', content: '#0e0f0d' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: `${SITE.name}, portfolio` },
      { property: 'og:title', content: `${SITE.name}, CTO at ${SITE.company}` },
      { property: 'og:description', content: SITE.description },
      { property: 'og:url', content: SITE.domain },
      { property: 'og:image', content: `${SITE.domain}/og.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      {
        property: 'og:image:alt',
        content: 'Adarsh Singh, CTO, engineer, and builder',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: `${SITE.name}, CTO at ${SITE.company}`,
      },
      { name: 'twitter:description', content: SITE.description },
      { name: 'twitter:image', content: `${SITE.domain}/og.png` },
      {
        name: 'twitter:image:alt',
        content: 'Adarsh Singh, CTO, engineer, and builder',
      },
      {
        name: 'keywords',
        content:
          'Adarsh Singh, CTO, software engineer, full-stack engineer, React, Next.js, Go, TypeScript, cloud, developer tooling',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: getCanonicalUrl(matches.at(-1)?.pathname) },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap',
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
  notFoundComponent: () => <NotFoundPage />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <CursorField />
        <EasterEggs />
        <Scripts />
      </body>
    </html>
  )
}
