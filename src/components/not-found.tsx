import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Registered } from './registered'

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Not found, Adarsh Singh'
  }, [])

  return (
    <main id="main" className="wrap missing" data-atmo="home">
      <meta name="robots" content="noindex" />
      <Registered hero as="p" className="missing-code" text="404" />
      <h1>This address is out of register.</h1>
      <p>
        It does not lead anywhere. The link may be old, or the page may have
        moved when the site was rebuilt.
      </p>
      <p className="missing-links">
        <Link to="/" className="arrow-link">
          Go to the homepage
        </Link>
        <Link to="/work" className="arrow-link">
          See the work
        </Link>
      </p>
    </main>
  )
}
