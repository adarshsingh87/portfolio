import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Writing and case studies only change when the site is redeployed, so
    // data preloaded on hover is reused on click instead of fetched again.
    defaultPreloadStaleTime: 30_000,
    // Wrap client navigations in document.startViewTransition().
    // Ignored by browsers without support. Styling lives in styles.css.
    defaultViewTransition: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
