import { SITE } from '../data/site'

// Stable ids so every page's JSON-LD points at the same Person and WebSite
// instead of redefining them.
export const PERSON_ID = `${SITE.domain}/#person`
export const WEBSITE_ID = `${SITE.domain}/#website`
export const BLOG_ID = `${SITE.domain}/blog#blog`

export const DEFAULT_IMAGE = `${SITE.domain}/og.png`
export const DEFAULT_IMAGE_ALT =
  'Making every system agree. Three coloured lights overlap into white over the name of Adarsh Singh, CTO at SmokeTrees Digital'

const TRAILING_SLASH_RE = /\/$/

export function absoluteUrl(path: string): string {
  if (path === '/' || path === '') return `${SITE.domain}/`
  return `${SITE.domain}${path.replace(TRAILING_SLASH_RE, '')}`
}

type PageMeta = {
  // The <title>.
  title: string
  // What share cards show. Defaults to the title.
  shareTitle?: string
  description: string
  path: string
  type?: 'website' | 'article'
  image?: string
  imageAlt?: string
}

// The full set of description, Open Graph, and Twitter tags for one page.
// The router dedupes meta by name/property, so a route that returns all of
// these replaces every default the root sets. Returning only some of them
// leaks the homepage's title into share cards.
export function pageMeta({
  title,
  shareTitle = title,
  description,
  path,
  type = 'website',
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
}: PageMeta) {
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:title', content: shareTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: absoluteUrl(path) },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: imageAlt },
    { name: 'twitter:title', content: shareTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: imageAlt },
  ]
}

export function jsonLd(data: object) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify({ '@context': 'https://schema.org', ...data }),
  }
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export const PERSON_REF = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE.name,
  url: absoluteUrl('/'),
}
