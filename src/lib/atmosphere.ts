// Lets a link show what the light will look like on the page it leads to.
// The IntersectionObserver in <Atmosphere> takes over again once the pointer
// moves on and something else crosses the middle of the screen.
export function previewAtmosphere(slug: string | null, fallback = 'home') {
  document.documentElement.dataset.atmo = slug ?? fallback
}

// What the light looks like for a page before anything has scrolled into
// view. The same rule runs on the server for the first paint.
export function defaultAtmosphere(pathname: string) {
  if (pathname.startsWith('/blog')) return 'quiet'
  if (pathname.startsWith('/work/')) return pathname.split('/')[2]
  return 'home'
}
