import { Seo } from '../lib/Seo'

export function Developer() {
  return (
    <>
      <Seo title="Developer" description="GradeWise is built and maintained by D. Majumder." path="/developer" />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">Developer</h1>
        <div className="mt-4 flex flex-col gap-3 text-[var(--text-muted)]">
          <p>GradeWise is built and maintained by D. Majumder.</p>
          <p>
            The project is open source. Bug reports, source corrections for university formulas, and pull
            requests are welcome — see the GitHub repository for details.
          </p>
          <a
            href="https://github.com/D-Majumder/gradewise"
            target="_blank"
            rel="noreferrer"
            className="inline-block w-fit text-[var(--accent)] underline decoration-dotted"
          >
            github.com/D-Majumder/gradewise
          </a>
        </div>
      </section>
    </>
  )
}
