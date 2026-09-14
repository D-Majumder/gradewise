import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { Seo } from '../lib/Seo'
import { institutions, searchInstitutions } from '../data/institutions'

export function Universities() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchInstitutions(query), [query])

  return (
    <>
      <Seo
        title="Universities & Institutions"
        description="Search Indian universities, IITs, NITs and colleges for source-verified CGPA-to-percentage conversion formulas on GradeWise."
        path="/universities"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: institutions.map((inst, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://d-majumder.github.io/gradewise/universities/${inst.id}`,
            name: inst.name,
          })),
        }}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">Universities &amp; institutions</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Every formula listed here is either verified against an official university/UGC/AICTE document (marked
          "Official formula") or explicitly flagged as unverified with notes on what was found. We add
          institutions gradually, prioritizing accuracy over coverage.
        </p>

        <div className="mt-6">
          <Field
            label="Search by university, college, city or state"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Jadavpur, Delhi, MAKAUT…"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {institutions.length === 0 && (
            <Card className="p-6 text-sm text-[var(--text-muted)]">
              Institution-specific formulas are being verified and added incrementally. In the meantime, use the{' '}
              <Link to="/" className="text-[var(--accent)] underline decoration-dotted">
                generic Convert calculator
              </Link>{' '}
              or the{' '}
              <Link to="/" className="text-[var(--accent)] underline decoration-dotted">
                custom formula
              </Link>{' '}
              tool if you already know your institution's official rule.
            </Card>
          )}
          {institutions.length > 0 && results.length === 0 && (
            <Card className="p-6 text-sm text-[var(--text-muted)]">No institutions matched "{query}" yet.</Card>
          )}
          {results.map((inst) => (
            <Link key={inst.id} to={`/universities/${inst.id}`}>
              <Card className="p-4 transition-colors hover:border-[var(--accent)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-[var(--text)]">{inst.name}</p>
                  <span
                    className={
                      inst.hasOfficialConversion
                        ? 'rounded-full bg-[var(--success-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--success)]'
                        : 'rounded-full bg-[var(--warning-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--warning)]'
                    }
                  >
                    {inst.hasOfficialConversion ? 'Official formula available' : 'No official formula yet'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {inst.city}, {inst.state} · {inst.type}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
