import { createServerFn } from '@tanstack/react-start'
import { getAllEntries, getPost } from './blog'

// Loaders call these. During SSR they run in place; on client navigation they
// become a fetch, so Markdown and the parser stay on the server.

export const fetchEntries = createServerFn({ method: 'GET' })
  .validator((limit: number | undefined) => limit)
  .handler(({ data: limit }) => {
    const entries = getAllEntries()
    return limit ? entries.slice(0, limit) : entries
  })

export const fetchPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => (await getPost(slug)) ?? null)
