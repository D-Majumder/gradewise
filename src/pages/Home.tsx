import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'
import { Seo } from '../lib/Seo'
import { ConvertTab } from './home/ConvertTab'
import { AggregateTab } from './home/AggregateTab'
import { TargetTab } from './home/TargetTab'
import { CustomFormulaTab } from './home/CustomFormulaTab'
import { findInstitutionById } from '../data/institutions'

type Section = 'convert' | 'aggregate' | 'target' | 'custom'

const SECTIONS: { value: Section; label: string }[] = [
  { value: 'convert', label: 'Convert' },
  { value: 'aggregate', label: 'SGPA / CGPA' },
  { value: 'target', label: 'Target' },
  { value: 'custom', label: 'Custom formula' },
]

function buildExpression(a: number, b: number): string {
  if (b === 0) return `CGPA * ${a}`
  return `CGPA * ${a} ${b > 0 ? '+' : '-'} ${Math.abs(b)}`
}

export function Home() {
  const [searchParams] = useSearchParams()

  const prefill = useMemo(() => {
    const ruleParam = searchParams.get('rule')
    if (!ruleParam || !ruleParam.includes('::')) return null
    const [institutionId, ruleId] = ruleParam.split('::')
    const institution = findInstitutionById(institutionId)
    const rule = institution?.rules.find((r) => r.id === ruleId)
    if (!institution || !rule) return null
    return { institution, rule, expression: buildExpression(rule.a, rule.b) }
  }, [searchParams])

  const [section, setSection] = useState<Section>(prefill ? 'custom' : 'convert')

  return (
    <>
      <Seo
        title="GradeWise — CGPA, SGPA & Percentage Calculator for Indian Universities"
        description="GradeWise helps students convert CGPA, SGPA, marks and grades accurately using verified, university-specific academic rules across India."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'GradeWise',
          url: 'https://d-majumder.github.io/gradewise/',
          applicationCategory: 'EducationApplication',
          operatingSystem: 'Any (web browser)',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          description:
            'Converts CGPA, SGPA, GPA, marks and percentage using verified, institution-specific formulas for Indian universities.',
        }}
      />

      <section className="mx-auto max-w-3xl px-4 pt-10 pb-4 text-center sm:px-6 sm:pt-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
          Your grades. Your university. Your percentage.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--text-muted)]">
          GradeWise converts CGPA, SGPA, marks and percentage using verified, institution-specific formulas —
          not a one-size-fits-all multiplier.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <Card className="p-4 sm:p-6">
          <Tabs label="Calculator section" value={section} onChange={setSection} items={SECTIONS} />
          <div className="mt-6">
            {section === 'convert' && <ConvertTab />}
            {section === 'aggregate' && <AggregateTab />}
            {section === 'target' && <TargetTab />}
            {section === 'custom' && (
              <CustomFormulaTab
                initialExpression={prefill?.expression}
                banner={
                  prefill && (
                    <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-3.5 text-sm text-[var(--accent)]">
                      Pre-filled with {prefill.institution.name}'s {prefill.rule.status === 'official' ? 'official' : 'unverified'} formula (
                      {prefill.rule.formulaDisplay}) for {prefill.rule.programme === '*' ? 'all programmes' : prefill.rule.programme}. Enter your
                      CGPA below and evaluate.
                    </div>
                  )
                }
              />
            )}
          </div>
        </Card>
      </section>
    </>
  )
}
