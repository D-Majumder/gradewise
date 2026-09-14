import { useMemo, useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Select } from '../../components/ui/Select'
import { ResultCard } from '../../components/ResultCard'
import {
  gpaToPercentageGeneric,
  marksToPercentage,
  parseNumericInput,
  percentageToGpaGeneric,
  percentageToMarks,
  validateGpaValue,
  validateMarks,
  validatePercentage,
} from '../../engine'

type Mode = 'gpaToPercentage' | 'percentageToGpa' | 'marksToPercentage' | 'percentageToMarks'

const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: 'gpaToPercentage', label: 'CGPA / SGPA → Percentage' },
  { value: 'percentageToGpa', label: 'Percentage → CGPA / SGPA' },
  { value: 'marksToPercentage', label: 'Marks → Percentage' },
  { value: 'percentageToMarks', label: 'Percentage → Marks' },
]

export function ConvertTab() {
  const [mode, setMode] = useState<Mode>('gpaToPercentage')

  const [gpaRaw, setGpaRaw] = useState('8.5')
  const [scaleMaxRaw, setScaleMaxRaw] = useState('10')
  const [multiplierRaw, setMultiplierRaw] = useState('9.5')

  const [percentRaw, setPercentRaw] = useState('80')
  const [obtainedRaw, setObtainedRaw] = useState('425')
  const [maxMarksRaw, setMaxMarksRaw] = useState('500')

  const gpa = parseNumericInput(gpaRaw)
  const scaleMax = parseNumericInput(scaleMaxRaw) ?? 10
  const multiplier = parseNumericInput(multiplierRaw) ?? 9.5
  const percent = parseNumericInput(percentRaw)
  const obtained = parseNumericInput(obtainedRaw)
  const maxMarks = parseNumericInput(maxMarksRaw)

  const gpaValidation = validateGpaValue(gpa, scaleMax)
  const percentValidation = validatePercentage(percent)
  const marksValidation = validateMarks(obtained, maxMarks)
  const maxMarksValidation = maxMarks !== null && maxMarks > 0 ? { valid: true } : { valid: false, error: 'Enter the maximum marks.' }

  const result = useMemo(() => {
    if (mode === 'gpaToPercentage' && gpaValidation.valid && gpa !== null) {
      return { value: gpaToPercentageGeneric(gpa, multiplier), unit: '%' }
    }
    if (mode === 'percentageToGpa' && percentValidation.valid && percent !== null) {
      return { value: percentageToGpaGeneric(percent, multiplier, scaleMax), unit: `/ ${scaleMax}` }
    }
    if (mode === 'marksToPercentage' && marksValidation.valid && obtained !== null && maxMarks !== null) {
      return { value: marksToPercentage(obtained, maxMarks), unit: '%' }
    }
    if (mode === 'percentageToMarks' && percentValidation.valid && maxMarksValidation.valid && percent !== null && maxMarks !== null) {
      return { value: percentageToMarks(percent, maxMarks), unit: `/ ${maxMarks}` }
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, gpa, percent, obtained, maxMarks, multiplier, scaleMax])

  return (
    <div className="flex flex-col gap-6">
      <Select label="What do you want to convert?" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
        {MODE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      {(mode === 'gpaToPercentage' || mode === 'percentageToGpa') && (
        <div className="grid gap-4 sm:grid-cols-2">
          {mode === 'gpaToPercentage' ? (
            <Field
              label="CGPA / SGPA"
              inputMode="decimal"
              value={gpaRaw}
              onChange={(e) => setGpaRaw(e.target.value)}
              error={gpaRaw !== '' && !gpaValidation.valid ? gpaValidation.error : undefined}
            />
          ) : (
            <Field
              label="Percentage"
              inputMode="decimal"
              value={percentRaw}
              onChange={(e) => setPercentRaw(e.target.value)}
              suffix="%"
              error={percentRaw !== '' && !percentValidation.valid ? percentValidation.error : undefined}
            />
          )}
          <Field
            label="Scale (out of)"
            inputMode="decimal"
            value={scaleMaxRaw}
            onChange={(e) => setScaleMaxRaw(e.target.value)}
            hint="e.g. 10 for a 10-point scale, 4 for a 4-point scale"
          />
          <Field
            label="Multiplier"
            inputMode="decimal"
            value={multiplierRaw}
            onChange={(e) => setMultiplierRaw(e.target.value)}
            hint="Generic, scale-only conversion — not any specific university's official rule, and the widely repeated 'x9.5' figure has no confirmed UGC/AICTE source (see Methodology). Most verified Indian formulas take the two-part form (CGPA - 0.75) x 10, which needs the Custom formula tab, not a single multiplier. Check the Universities page first for an institution-specific rule."
          />
        </div>
      )}

      {(mode === 'marksToPercentage' || mode === 'percentageToMarks') && (
        <div className="grid gap-4 sm:grid-cols-2">
          {mode === 'marksToPercentage' ? (
            <>
              <Field
                label="Marks obtained"
                inputMode="decimal"
                value={obtainedRaw}
                onChange={(e) => setObtainedRaw(e.target.value)}
                error={obtainedRaw !== '' && !marksValidation.valid ? marksValidation.error : undefined}
              />
              <Field
                label="Maximum marks"
                inputMode="decimal"
                value={maxMarksRaw}
                onChange={(e) => setMaxMarksRaw(e.target.value)}
              />
            </>
          ) : (
            <>
              <Field
                label="Percentage"
                inputMode="decimal"
                value={percentRaw}
                onChange={(e) => setPercentRaw(e.target.value)}
                suffix="%"
                error={percentRaw !== '' && !percentValidation.valid ? percentValidation.error : undefined}
              />
              <Field
                label="Out of (maximum marks)"
                inputMode="decimal"
                value={maxMarksRaw}
                onChange={(e) => setMaxMarksRaw(e.target.value)}
                error={maxMarksRaw !== '' && !maxMarksValidation.valid ? maxMarksValidation.error : undefined}
              />
            </>
          )}
        </div>
      )}

      {result && <ResultCard label="Result" value={result.value} unit={result.unit} />}
      {(mode === 'gpaToPercentage' || mode === 'percentageToGpa') && (
        <p className="-mt-2 text-xs text-[var(--text-faint)]">
          This is a generic scale conversion, not any specific university's official formula. For an
          institution-specific, source-verified formula, use the Universities page.
        </p>
      )}
    </div>
  )
}
