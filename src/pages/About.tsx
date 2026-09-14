import { Seo } from '../lib/Seo'

export function About() {
  return (
    <>
      <Seo
        title="About"
        description="GradeWise is an India-wide academic conversion platform for CGPA, SGPA, marks and percentage — not just another CGPA calculator."
        path="/about"
      />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">About GradeWise</h1>
        <div className="mt-4 flex flex-col gap-4 text-[var(--text-muted)]">
          <p>
            Most "CGPA to percentage" tools apply a single multiplier to every student, regardless of which
            university issued their grade card. That's a rough approximation at best — Indian universities use
            genuinely different, officially defined conversion formulas, and the gap between the generic estimate
            and a student's real, institution-mandated percentage can matter for admissions, job applications,
            and higher-study eligibility cutoffs.
          </p>
          <p>
            GradeWise is built as an India-wide academic conversion platform, not merely a CGPA calculator: it
            aggregates semester and year results with proper credit weighting, converts between CGPA, SGPA, GPA,
            marks and percentage, supports target-score planning, and — where a university's official conversion
            rule has been verified — applies that exact formula instead of a generic estimate.
          </p>
          <p>
            See the Methodology page for how formulas are verified and labeled, and the Report page if you'd like
            to contribute a correction or a source for an institution that isn't covered yet.
          </p>
        </div>
      </section>
    </>
  )
}
