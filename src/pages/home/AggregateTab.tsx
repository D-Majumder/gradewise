import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { Tabs } from '../../components/ui/Tabs'
import { ResultCard } from '../../components/ResultCard'
import { aggregateSemesters, aggregateYears, parseNumericInput } from '../../engine'
import type { SemesterEntry, YearEntry } from '../../engine/types'

type Level = 'semester' | 'year'

interface Row {
  id: string
  label: string
  valueRaw: string
  creditsRaw: string
}

let rowCounter = 0
function newRow(label: string): Row {
  rowCounter += 1
  return { id: `row-${rowCounter}`, label, valueRaw: '', creditsRaw: '' }
}

export function AggregateTab() {
  const [level, setLevel] = useState<Level>('semester')
  const [creditWeighted, setCreditWeighted] = useState(true)
  const [rows, setRows] = useState<Row[]>([newRow('Semester 1'), newRow('Semester 2')])

  const addRow = () => setRows((r) => [...r, newRow(level === 'semester' ? `Semester ${r.length + 1}` : `Year ${r.length + 1}`)])
  const removeRow = (id: string) => setRows((r) => (r.length > 1 ? r.filter((row) => row.id !== id) : r))
  const updateRow = (id: string, patch: Partial<Row>) => setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)))

  const result = useMemo(() => {
    if (level === 'semester') {
      const entries: SemesterEntry[] = rows.map((r) => ({
        id: r.id,
        label: r.label,
        sgpa: parseNumericInput(r.valueRaw),
        credits: parseNumericInput(r.creditsRaw),
      }))
      return aggregateSemesters(entries, creditWeighted)
    }
    const entries: YearEntry[] = rows.map((r) => ({
      id: r.id,
      label: r.label,
      cgpa: parseNumericInput(r.valueRaw),
      credits: parseNumericInput(r.creditsRaw),
    }))
    return aggregateYears(entries, creditWeighted)
  }, [level, rows, creditWeighted])

  const hasAnyValue = rows.some((r) => parseNumericInput(r.valueRaw) !== null)

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        label="Aggregation level"
        value={level}
        onChange={(v) => {
          setLevel(v)
          setRows(v === 'semester' ? [newRow('Semester 1'), newRow('Semester 2')] : [newRow('Year 1'), newRow('Year 2')])
        }}
        items={[
          { value: 'semester', label: 'Semester SGPA → CGPA' },
          { value: 'year', label: 'Year-wise CGPA → Overall CGPA' },
        ]}
      />

      <label className="flex items-center gap-2 text-sm text-[var(--text)]">
        <input
          type="checkbox"
          checked={creditWeighted}
          onChange={(e) => setCreditWeighted(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
        />
        Weight by credits (recommended — falls back to a simple average automatically if any credit value is missing)
      </label>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 sm:gap-3">
            <Field
              label="Label"
              value={row.label}
              onChange={(e) => updateRow(row.id, { label: e.target.value })}
            />
            <Field
              label={level === 'semester' ? 'SGPA' : 'CGPA'}
              inputMode="decimal"
              value={row.valueRaw}
              onChange={(e) => updateRow(row.id, { valueRaw: e.target.value })}
            />
            <Field
              label="Credits"
              inputMode="decimal"
              value={row.creditsRaw}
              onChange={(e) => updateRow(row.id, { creditsRaw: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => removeRow(row.id)}
              disabled={rows.length <= 1}
              aria-label={`Remove ${row.label}`}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="secondary" onClick={addRow} className="self-start">
        + Add {level === 'semester' ? 'semester' : 'year'}
      </Button>

      <details className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-muted)]">
        <summary className="cursor-pointer font-medium text-[var(--text)]">Handling backlogs, repeats, and grade improvements</summary>
        <p className="mt-2">
          If a subject was a backlog (failed and cleared later) or you took an improvement exam, most universities
          replace that subject's grade point in the SGPA of the semester it belongs to — either with the cleared
          grade or the better of the two attempts, per that university's own regulations. Once you know the
          corrected SGPA for the affected semester, just edit that row's value above and the CGPA recalculates
          instantly. GradeWise does not assume a specific backlog-averaging rule since these vary by institution
          and regulation year — check your official grade card or exam regulations for how your university treats
          backlog/improvement grades before entering the corrected SGPA.
        </p>
      </details>

      {hasAnyValue && (
        <ResultCard label={level === 'semester' ? 'Cumulative CGPA' : 'Overall CGPA'} value={result.cgpa} unit="">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Method: {result.method === 'credit_weighted' ? 'Credit-weighted average' : 'Simple average'}
              {result.usedFallback && ' (fell back from credit-weighted — one or more credit values were missing)'}
              {result.totalCredits !== null && ` · Total credits: ${result.totalCredits}`}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[var(--text-faint)]">
                    <th className="py-1 pr-3 font-medium">Label</th>
                    <th className="py-1 pr-3 font-medium">{level === 'semester' ? 'SGPA' : 'CGPA'}</th>
                    <th className="py-1 pr-3 font-medium">Credits</th>
                    <th className="py-1 font-medium">Contribution</th>
                  </tr>
                </thead>
                <tbody className="gw-tabular">
                  {result.rows.map((r, i) => (
                    <tr key={i} className="border-t border-[var(--border)]">
                      <td className="py-1.5 pr-3">{r.label}</td>
                      <td className="py-1.5 pr-3">{r.value}</td>
                      <td className="py-1.5 pr-3">{r.weight ?? '—'}</td>
                      <td className="py-1.5">{r.contribution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  )
}
