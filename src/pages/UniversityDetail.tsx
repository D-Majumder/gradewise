import { Link, Navigate, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Seo } from '../lib/Seo'
import { findInstitutionById } from '../data/institutions'

const STATUS_LABEL = { official: 'Official', custom: 'Custom', unverified: 'Unverified' } as const

export function UniversityDetail() {
  const { id } = useParams<{ id: string }>()
  const institution = id ? findInstitutionById(id) : undefined

  if (!institution) return <Navigate to="/universities" replace />

  const officialRules = institution.rules.filter((r) => r.status === 'official')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: institution.name,
    alternateName: institution.aliases.length > 0 ? institution.aliases : institution.shortName,
    url: institution.website,
    address: {
      '@type': 'PostalAddress',
      addressLocality: institution.city,
      addressRegion: institution.state,
      addressCountry: 'IN',
    },
  }

  return (
    <>
      <Seo
        title={`${institution.shortName ?? institution.name} CGPA to Percentage Calculator`}
        description={`${institution.shortName ?? institution.name} (${institution.city}, ${institution.state}) CGPA to percentage conversion — ${
          officialRules.length > 0 ? 'official, source-verified formula' : 'verification status'
        } and programme applicability on GradeWise.`}
        path={`/universities/${institution.id}`}
        jsonLd={jsonLd}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link to="/universities" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
          ← All universities
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-[var(--text)] sm:text-3xl">{institution.name}</h1>
        <p className="mt-1 text-[var(--text-muted)]">
          {institution.city}, {institution.state} · {institution.type}
          {institution.aliases.length > 0 && ` · also known as ${institution.aliases.join(', ')}`}
        </p>

        <p className="mt-4 text-sm text-[var(--text-muted)]">
          {institution.shortName ?? institution.name} offers {institution.programmes.join(', ')}, graded on a{' '}
          {institution.gradingScaleDescription}.{' '}
          {institution.website && (
            <>
              Official website:{' '}
              <a href={institution.website} target="_blank" rel="noreferrer" className="text-[var(--accent)] underline decoration-dotted">
                {institution.website.replace(/^https?:\/\//, '')}
              </a>
              .
            </>
          )}
        </p>

        {institution.notes && <p className="mt-3 text-sm text-[var(--text-muted)]">{institution.notes}</p>}

        <div className="mt-8 flex flex-col gap-4">
          {institution.rules.length === 0 && (
            <Card className="p-6 text-sm text-[var(--text-muted)]">
              No conversion formula has been verified for this institution yet — see the note above for what was
              checked. Use the{' '}
              <Link to="/" className="text-[var(--accent)] underline decoration-dotted">
                Custom formula calculator
              </Link>{' '}
              if you already have your official rule from another source.
            </Card>
          )}
          {institution.rules.map((rule) => (
            <Card key={rule.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[var(--text)]">
                  {rule.programme === '*' ? 'All programmes' : rule.programme} · {rule.regulation === '*' ? 'All regulations' : rule.regulation}
                </p>
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                  {STATUS_LABEL[rule.status]}
                </span>
              </div>
              <p className="mt-2 gw-tabular text-lg font-medium text-[var(--text)]">{rule.formulaDisplay}</p>
              {rule.source && (
                <p className="mt-2 text-xs text-[var(--text-faint)]">
                  Source:{' '}
                  {rule.source.url ? (
                    <a href={rule.source.url} target="_blank" rel="noreferrer" className="underline decoration-dotted">
                      {rule.source.title}
                    </a>
                  ) : (
                    rule.source.title
                  )}{' '}
                  · verified {rule.source.verifiedAt}
                </p>
              )}
              {rule.notes && <p className="mt-2 text-xs text-[var(--text-muted)]">{rule.notes}</p>}
              <Link
                to={`/?rule=${institution.id}::${rule.id}`}
                className="mt-3 inline-block text-sm font-medium text-[var(--accent)] underline decoration-dotted"
              >
                Use this formula in the calculator →
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
