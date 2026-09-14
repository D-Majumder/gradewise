import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Seo } from '../lib/Seo'

export function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page does not exist on GradeWise." path="/404" noindex />
      <section className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-[var(--text)]">Page not found</h1>
        <p className="mt-2 text-[var(--text-muted)]">The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="mt-6">
          <Button>Back to the calculator</Button>
        </Link>
      </section>
    </>
  )
}
