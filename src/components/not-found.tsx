import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Not found, Adarsh Singh'
  }, [])

  return (
    <main id="main" className="missing">
      <meta name="robots" content="noindex" />
      <div className="missing-pane" aria-hidden="true">
        <span>404</span>
      </div>
      <h1>Nothing behind this glass.</h1>
      <p>
        This address does not lead anywhere. The link may be old, or the page
        may have moved when the site was rebuilt.
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
