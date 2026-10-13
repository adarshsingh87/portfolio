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
import {
  PERSON_ID,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
  pageMeta,
} from '../lib/seo'

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

export const Route = createRootRoute({
  head: ({ matches }) => {
    // A 404 must not claim the homepage as its canonical.
    const missing = matches.some((m) => m.status === 'notFound' || m._notFound)
    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        { name: 'author', content: SITE.name },
        { name: 'color-scheme', content: 'dark' },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:locale', content: 'en_IN' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: SITE.twitterHandle },
        { name: 'twitter:creator', content: SITE.twitterHandle },
        // Defaults. Every route overrides the whole set with its own.
        ...pageMeta({
          title: missing ? `Not found, ${SITE.name}` : SITE.title,
          description: SITE.description,
          path: '/',
        }),
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
        ...(missing
          ? []
          : [
              {
                rel: 'canonical',
                href: absoluteUrl(matches.at(-1)?.pathname ?? '/'),
              },
            ]),
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: `Writing by ${SITE.name}`,
          href: '/rss.xml',
        },
        { rel: 'author', href: '/humans.txt' },
      ],
      scripts: [
        // Before first paint, so a saved wallpaper palette never flashes the
        // default one.
        { children: RESTORE_SCRIPT },
        jsonLd({
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': WEBSITE_ID,
              url: absoluteUrl('/'),
              name: SITE.name,
              description: SITE.description,
              inLanguage: 'en',
              publisher: { '@id': PERSON_ID },
            },
            {
              '@type': 'Person',
              '@id': PERSON_ID,
              name: SITE.name,
              url: absoluteUrl('/'),
              description: SITE.description,
              jobTitle: 'CTO',
              worksFor: {
                '@type': 'Organization',
                name: SITE.company,
                url: SITE.companyUrl,
              },
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'VIT Vellore',
              },
              knowsAbout: [
                'Backend engineering',
                'Software architecture',
                'TypeScript',
                'Node.js',
                'Go',
                'PostgreSQL',
                'ONDC',
                'Reconciliation systems',
              ],
              email: `mailto:${SITE.email}`,
              sameAs: [SITE.github, SITE.linkedin, SITE.twitter],
            },
          ],
        }),
      ],
    }
  },
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
