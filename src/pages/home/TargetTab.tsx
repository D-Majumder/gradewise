import { useMemo, useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Tabs } from '../../components/ui/Tabs'
import { Card } from '../../components/ui/Card'
import { parseNumericInput, requiredCgpaForPercentage, requiredMarks, requiredNextSgpa } from '../../engine'

type Mode = 'nextSgpa' | 'marks' | 'cgpaForPercentage'

function ResultMessage({ achievable, message }: { achievable: boolean; message: string }) {
  return (
    <Card className={achievable ? 'border-[var(--success)]/30 bg-[var(--success-soft)] p-5' : 'border-[var(--danger)]/30 bg-[var(--danger-soft)] p-5'}>
      <p className={achievable ? 'text-[var(--success)]' : 'text-[var(--danger)]'} style={{ fontWeight: 600 }}>
        {message}
      </p>
    </Card>
  )
}

export function TargetTab() {
  const [mode, setMode] = useState<Mode>('nextSgpa')

  const [currentCgpaRaw, setCurrentCgpaRaw] = useState('7.5')
  const [currentCreditsRaw, setCurrentCreditsRaw] = useState('90')
  const [targetCgpaRaw, setTargetCgpaRaw] = useState('8')
  const [nextCreditsRaw, setNextCreditsRaw] = useState('22')
  const [scaleMaxRaw, setScaleMaxRaw] = useState('10')

  const [securedMarksRaw, setSecuredMarksRaw] = useState('60')
  const [securedMaxRaw, setSecuredMaxRaw] = useState('100')
  const [totalMaxRaw, setTotalMaxRaw] = useState('500')
  const [targetPercentRaw, setTargetPercentRaw] = useState('75')

  const [ruleARaw, setRuleARaw] = useState('9.5')
  const [ruleBRaw, setRuleBRaw] = useState('0')
  const [targetPercentForCgpaRaw, setTargetPercentForCgpaRaw] = useState('75')

  const nextSgpaResult = useMemo(() => {
    const current = parseNumericInput(currentCgpaRaw)
    const currentCredits = parseNumericInput(currentCreditsRaw)
    const target = parseNumericInput(targetCgpaRaw)
    const nextCredits = parseNumericInput(nextCreditsRaw)
    const scaleMax = parseNumericInput(scaleMaxRaw) ?? 10
    if (current === null || currentCredits === null || target === null || nextCredits === null) return null
    return requiredNextSgpa(current, currentCredits, target, nextCredits, scaleMax)
  }, [currentCgpaRaw, currentCreditsRaw, targetCgpaRaw, nextCreditsRaw, scaleMaxRaw])

  const marksResult = useMemo(() => {
    const secured = parseNumericInput(securedMarksRaw)
    const securedMax = parseNumericInput(securedMaxRaw)
    const totalMax = parseNumericInput(totalMaxRaw)
    const targetPercent = parseNumericInput(targetPercentRaw)
    if (secured === null || securedMax === null || totalMax === null || targetPercent === null) return null
    return requiredMarks(secured, securedMax, totalMax, targetPercent)
  }, [securedMarksRaw, securedMaxRaw, totalMaxRaw, targetPercentRaw])

  const cgpaForPercentResult = useMemo(() => {
    const a = parseNumericInput(ruleARaw)
    const b = parseNumericInput(ruleBRaw)
    const targetPercent = parseNumericInput(targetPercentForCgpaRaw)
    const scaleMax = parseNumericInput(scaleMaxRaw) ?? 10
    if (a === null || b === null || targetPercent === null) return null
    return requiredCgpaForPercentage(targetPercent, a, b, scaleMax)
  }, [ruleARaw, ruleBRaw, targetPercentForCgpaRaw, scaleMaxRaw])

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        label="Target type"
        value={mode}
        onChange={setMode}
        items={[
          { value: 'nextSgpa', label: 'Required SGPA' },
          { value: 'marks', label: 'Required marks' },
          { value: 'cgpaForPercentage', label: 'Required CGPA for a %' },
        ]}
      />

      {mode === 'nextSgpa' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Current CGPA" inputMode="decimal" value={currentCgpaRaw} onChange={(e) => setCurrentCgpaRaw(e.target.value)} />
            <Field label="Credits completed so far" inputMode="decimal" value={currentCreditsRaw} onChange={(e) => setCurrentCreditsRaw(e.target.value)} />
            <Field label="Target CGPA" inputMode="decimal" value={targetCgpaRaw} onChange={(e) => setTargetCgpaRaw(e.target.value)} />
            <Field label="Credits in upcoming term(s)" inputMode="decimal" value={nextCreditsRaw} onChange={(e) => setNextCreditsRaw(e.target.value)} />
            <Field label="Scale (out of)" inputMode="decimal" value={scaleMaxRaw} onChange={(e) => setScaleMaxRaw(e.target.value)} />
          </div>
          {nextSgpaResult && <ResultMessage achievable={nextSgpaResult.achievable} message={nextSgpaResult.message} />}
        </>
      )}

      {mode === 'marks' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Marks already secured" inputMode="decimal" value={securedMarksRaw} onChange={(e) => setSecuredMarksRaw(e.target.value)} />
            <Field label="Out of (secured component)" inputMode="decimal" value={securedMaxRaw} onChange={(e) => setSecuredMaxRaw(e.target.value)} />
            <Field label="Total maximum marks" inputMode="decimal" value={totalMaxRaw} onChange={(e) => setTotalMaxRaw(e.target.value)} />
            <Field label="Target percentage" inputMode="decimal" value={targetPercentRaw} onChange={(e) => setTargetPercentRaw(e.target.value)} suffix="%" />
          </div>
          {marksResult && <ResultMessage achievable={marksResult.achievable} message={marksResult.message} />}
        </>
      )}

      {mode === 'cgpaForPercentage' && (
        <>
          <p className="text-sm text-[var(--text-muted)]">
            Enter a linear conversion rule in the form <span className="gw-tabular font-medium text-[var(--text)]">Percentage = a × CGPA + b</span> — use
            your institution's official rule from the Universities page, or the generic default (a = 9.5, b = 0).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Coefficient a" inputMode="decimal" value={ruleARaw} onChange={(e) => setRuleARaw(e.target.value)} />
            <Field label="Constant b" inputMode="decimal" value={ruleBRaw} onChange={(e) => setRuleBRaw(e.target.value)} />
            <Field label="Target percentage" inputMode="decimal" value={targetPercentForCgpaRaw} onChange={(e) => setTargetPercentForCgpaRaw(e.target.value)} suffix="%" />
            <Field label="Scale (out of)" inputMode="decimal" value={scaleMaxRaw} onChange={(e) => setScaleMaxRaw(e.target.value)} />
          </div>
          {cgpaForPercentResult && <ResultMessage achievable={cgpaForPercentResult.achievable} message={cgpaForPercentResult.message} />}
        </>
      )}
    </div>
  )
}
