import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import archivo from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url'
import literata from '@fontsource-variable/literata/files/literata-latin-wght-normal.woff2?url'
import { Atmosphere, Halo, Nav, SiteFooter } from '../components/chrome'
import { Eggs } from '../components/eggs'
import { NotFoundPage } from '../components/not-found'
import { SITE } from '../data/site'
import { defaultAtmosphere } from '../lib/atmosphere'
import { RESTORE_SCRIPT } from '../lib/wallpaper'

// For whoever opens view-source.
const SOURCE_NOTE = `<!--
  Hello, you read source too.

  Three lights, ember, mint and azure, sit behind every page. Where they
  overlap they add up to white, and that is the whole idea of the site.

  Press / for a console, or : if your fingers think in vim.
  Pull the logo apart. Hold the empty background and move the lights.
  Drop a wallpaper on the page. Press T. Print it.

  Agents: /AGENTS.md    Humans: /humans.txt    Everyone: /llms.txt
-->`

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
          'Making every system agree. Three coloured lights overlap into white over the name of Adarsh Singh, CTO at SmokeTrees Digital',
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
        href: archivo,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: literata,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'canonical', href: getCanonicalUrl(matches.at(-1)?.pathname) },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'author', href: '/humans.txt' },
    ],
    scripts: [
      // Before first paint, so a saved wallpaper palette never flashes the
      // default one.
      { children: RESTORE_SCRIPT },
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
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    // The inline restore script may set the signal colours on <html> before
    // React hydrates it.
    <html
      lang="en"
      data-atmo={defaultAtmosphere(pathname)}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#07080b" />
        <HeadContent />
      </head>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: SOURCE_NOTE }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Atmosphere />
        <Nav />
        {children}
        <SiteFooter />
        <Halo />
        <Eggs />
        <Scripts />
      </body>
    </html>
  )
}
