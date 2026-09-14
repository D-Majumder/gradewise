import { Seo } from '../lib/Seo'

export function Privacy() {
  return (
    <>
      <Seo title="Privacy" description="GradeWise privacy policy — no accounts, no tracking of your marks or results, entirely client-side." path="/privacy" />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">Privacy</h1>
        <div className="mt-4 flex flex-col gap-4 text-[var(--text-muted)]">
          <p>
            GradeWise runs entirely in your browser. Every calculation — conversions, aggregation, target
            planning, custom formulas — happens locally on your device. There is no backend server that your
            marks, grades, or results are ever sent to.
          </p>
          <p>
            The only thing stored is your light/dark/system theme preference, saved in your browser's
            <code> localStorage</code> so it persists between visits. Nothing else is stored, and nothing is sent
            to us or to any third party.
          </p>
          <p>
            GradeWise is hosted as a static site on GitHub Pages. GitHub, as the host, may collect standard
            server access logs (e.g. IP address, user agent) as part of serving any static website; GradeWise
            itself does not add any analytics, tracking scripts, or cookies.
          </p>
          <p>
            If you use the Report page to open a GitHub issue, whatever you choose to include in that issue is
            visible on the public GitHub repository, governed by GitHub's own privacy policy.
          </p>
        </div>
      </section>
    </>
  )
}
