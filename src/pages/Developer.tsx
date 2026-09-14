import { CreatorLinks } from '../components/CreatorLinks'
import { Seo } from '../lib/Seo'
import { CREATOR } from '../lib/creator'

export function Developer() {
  return (
    <>
      <Seo title="Developer" description={`GradeWise is built and maintained by ${CREATOR.name}.`} path="/developer" />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">Developer</h1>
        <div className="mt-4 flex flex-col gap-3 text-[var(--text-muted)]">
          <p>GradeWise is built and maintained by {CREATOR.name}.</p>
          <p>
            The project is open source. Bug reports, source corrections for university formulas, and pull
            requests are welcome.
          </p>
          <a
            href={CREATOR.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-block w-fit text-[var(--accent)] underline decoration-dotted"
          >
            {CREATOR.repo.replace('https://', '')}
          </a>
          <CreatorLinks className="mt-3" />
        </div>
      </section>
    </>
  )
}
