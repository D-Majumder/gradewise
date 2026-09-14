import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'
import { Seo } from '../lib/Seo'
import { ConvertTab } from './home/ConvertTab'
import { AggregateTab } from './home/AggregateTab'
import { TargetTab } from './home/TargetTab'
import { CustomFormulaTab } from './home/CustomFormulaTab'

type Section = 'convert' | 'aggregate' | 'target' | 'custom'

const SECTIONS: { value: Section; label: string }[] = [
  { value: 'convert', label: 'Convert' },
  { value: 'aggregate', label: 'SGPA / CGPA' },
  { value: 'target', label: 'Target' },
  { value: 'custom', label: 'Custom formula' },
]

export function Home() {
  const [section, setSection] = useState<Section>('convert')

  return (
    <>
      <Seo
        title="GradeWise — CGPA to Percentage Calculator for Indian Universities"
        description="Convert CGPA, SGPA, GPA, marks and percentage with institution-specific, source-verified formulas for Indian universities. Aggregate semester and year results, plan target scores, and build custom formulas — free and entirely client-side."
        path="/"
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
            {section === 'custom' && <CustomFormulaTab />}
          </div>
        </Card>
      </section>
    </>
  )
}
