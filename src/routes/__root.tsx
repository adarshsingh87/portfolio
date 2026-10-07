import { Suspense, lazy, useEffect, useState } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import monaSans from '@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2?url'
import { Dock, Masthead, SiteFooter } from '../components/chrome'
import { NotFoundPage } from '../components/not-found'
import { SITE } from '../data/site'

const Console = lazy(() => import('../components/console'))

const TRAILING_SLASH_RE = /\/$/

function getCanonicalUrl(pathname: string | undefined) {
  if (!pathname || pathname === '/') return SITE.domain
  return `${SITE.domain}${pathname.replace(TRAILING_SLASH_RE, '')}`
}

export const Route = createRootRoute({
  head: ({ matches }) => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { title: SITE.title },
      { name: 'description', content: SITE.description },
      { name: 'author', content: SITE.name },
      { name: 'color-scheme', content: 'dark' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: SITE.title },
      { property: 'og:description', content: SITE.description },
      { property: 'og:url', content: SITE.domain },
      { property: 'og:image', content: `${SITE.domain}/og.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      {
        property: 'og:image:alt',
        content:
          'A building of lit windows, one per day of Adarsh Singh’s GitHub contributions since 2019',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: SITE.twitterHandle },
      { name: 'twitter:title', content: SITE.title },
      { name: 'twitter:description', content: SITE.description },
      { name: 'twitter:image', content: `${SITE.domain}/og.png` },
    ],
    links: [
      {
        rel: 'preload',
        href: monaSans,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: getCanonicalUrl(matches.at(-1)?.pathname) },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
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
          alumniOf: 'VIT Vellore',
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
        <meta name="theme-color" content="#0d1524" />
        <HeadContent />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Masthead />
        {children}
        <SiteFooter />
        <Dock />
        <ConsoleHost />
        <Scripts />
      </body>
    </html>
  )
}

function ConsoleHost() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey) return
      const t = event.target
      if (
        t instanceof Element &&
        t.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return
      }
      event.preventDefault()
      setOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return open ? (
    <Suspense fallback={null}>
      <Console onClose={() => setOpen(false)} />
    </Suspense>
  ) : null
}
