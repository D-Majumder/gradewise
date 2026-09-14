import { Card } from '../components/ui/Card'
import { Seo } from '../lib/Seo'
import { CREATOR } from '../lib/creator'

export function Report() {
  return (
    <>
      <Seo
        title="Report an issue"
        description="Report an incorrect formula, missing university, or bug in GradeWise."
        path="/report"
      />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">Report an issue</h1>
        <p className="mt-3 text-[var(--text-muted)]">
          Found an incorrect conversion formula, an outdated source link, a calculation bug, or a university that
          isn't listed yet? Reports backed by an official source (a university circular, ordinance, or grading
          regulations document) are the fastest to act on.
        </p>

        <Card className="mt-6 p-5">
          <h2 className="font-semibold text-[var(--text)]">On GitHub (preferred)</h2>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            Open an issue with as much detail as you can — the institution/programme/regulation year, the
            formula you believe is correct, and a link to the official source.
          </p>
          <a
            href={`${CREATOR.repo}/issues/new`}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block text-[var(--accent)] underline decoration-dotted"
          >
            Open a GitHub issue
          </a>
        </Card>

        <p className="mt-6 text-xs text-[var(--text-faint)]">
          GradeWise does not run its own server-side form or store any data you submit here — reports go directly
          to the public GitHub repository.
        </p>
      </section>
    </>
  )
}
