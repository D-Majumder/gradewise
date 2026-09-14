import { Card } from '../components/ui/Card'
import { Seo } from '../lib/Seo'

export function Methodology() {
  return (
    <>
      <Seo
        title="Methodology"
        description="How GradeWise verifies and sources CGPA-to-percentage conversion formulas for Indian universities."
        path="/methodology"
      />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">Methodology</h1>
        <p className="mt-3 text-[var(--text-muted)]">
          GradeWise is built on one rule: accuracy and honest sourcing matter more than claiming the widest
          possible coverage. A wrong formula that happens to look official is worse than no formula at all.
        </p>

        <div className="mt-8 flex flex-col gap-5">
          <Card className="p-5">
            <h2 className="font-semibold text-[var(--text)]">Official</h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              The formula is drawn directly from a university's own ordinance, examination circular, grading
              regulations document, or an official UGC/AICTE circular — with a title and, where one exists, a
              working link back to that source, plus the date it was checked.
            </p>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold text-[var(--text)]">Unverified</h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              A formula that is commonly cited (student forums, coaching sites, third-party calculators) but that
              could not be confirmed against a primary/official document is still shown, clearly labeled as
              unverified, with a note on what was found — rather than silently omitted or presented as fact.
            </p>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold text-[var(--text)]">Generic conversions</h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              The Convert calculator's CGPA/SGPA ⇄ Percentage mode uses a scale-and-multiplier model (e.g. the
              widely cited "× 9.5" default for a 10-point scale) when no institution-specific rule is selected.
              This is explicitly labeled as generic — it is not asserted to be any particular university's
              official rule, and you should prefer an institution-specific formula whenever one is available.
            </p>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold text-[var(--text)]">Custom formulas</h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              The Custom formula tab lets you type in any linear or non-linear expression yourself — useful when
              you have your own institution's exact rule from an official source but it isn't in our registry
              yet. These are evaluated with a safe, sandboxed parser (never <code>eval()</code>), are always
              labeled "Custom formula", and are never treated as verified by GradeWise since GradeWise did not
              source or check them itself.
            </p>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold text-[var(--text)]">No fabrication</h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              We never invent a coefficient to fill a gap in coverage. An institution with no verified formula
              yet is listed as such rather than assigned a guessed rule.
            </p>
          </Card>
        </div>

        <Card className="mt-5 border-[var(--warning)]/30 bg-[var(--warning-soft)] p-5">
          <h2 className="font-semibold text-[var(--text)]">A correction we found worth flagging</h2>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            Many calculator sites describe "CGPA x 9.5" as "the AICTE/UGC-prescribed formula" for higher education.
            While verifying source documents, we found AICTE's own published grade-to-percentage table (Table E6,
            15.03.2000) — as certified and re-published by Jadavpur University and matched by MAKAUT's official
            conversion table — actually corresponds to <span className="gw-tabular font-medium text-[var(--text)]">(CGPA − 0.75) × 10</span>,
            not × 9.5. The × 9.5 figure most plausibly comes from CBSE's school-leaving (Class X/XII) CGPA rule, a
            different context that appears to have been widely mis-generalized online as a university-level AICTE
            rule. GradeWise's generic Convert calculator therefore does not present × 9.5 as an AICTE/UGC default —
            it's offered only as an editable, clearly generic multiplier.
          </p>
        </Card>

        <p className="mt-8 text-sm text-[var(--text-muted)]">
          Spotted an error, or have an official document for a formula we've marked unverified or don't have yet?
          Please use the Report page — corrections backed by an official source are the fastest way to improve
          GradeWise for everyone.
        </p>
      </section>
    </>
  )
}
