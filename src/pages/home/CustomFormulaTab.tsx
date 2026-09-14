import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { ResultCard } from '../../components/ResultCard'
import { evaluateFormula, FormulaError } from '../../engine/formula'
import { parseNumericInput } from '../../engine'

interface Variable {
  id: string
  name: string
  valueRaw: string
}

let varCounter = 0
function newVariable(name = ''): Variable {
  varCounter += 1
  return { id: `var-${varCounter}`, name, valueRaw: '' }
}

export function CustomFormulaTab() {
  const [expression, setExpression] = useState('(CGPA - 0.75) * 10')
  const [variables, setVariables] = useState<Variable[]>([newVariable('CGPA')])
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addVariable = () => setVariables((v) => [...v, newVariable()])
  const removeVariable = (id: string) => setVariables((v) => v.filter((x) => x.id !== id))
  const updateVariable = (id: string, patch: Partial<Variable>) =>
    setVariables((v) => v.map((x) => (x.id === id ? { ...x, ...patch } : x)))

  const evaluate = () => {
    setError(null)
    setResult(null)
    const values: Record<string, number> = {}
    for (const v of variables) {
      if (v.name.trim() === '') continue
      const parsed = parseNumericInput(v.valueRaw)
      if (parsed === null) {
        setError(`Please enter a valid number for "${v.name}".`)
        return
      }
      values[v.name.trim()] = parsed
    }
    try {
      setResult(evaluateFormula(expression, values))
    } catch (e) {
      setError(e instanceof FormulaError ? e.message : 'Could not evaluate this formula.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-[var(--text-muted)]">
        Build your own conversion formula using named variables — for example if your institution's exact rule
        isn't listed yet on the Universities page but you have it from an official source. Supports +, -, *, /, ^,
        parentheses, and decimal numbers. This never uses <code>eval()</code> — expressions are parsed safely.
      </p>

      <Field label="Formula" value={expression} onChange={(e) => setExpression(e.target.value)} hint="e.g. (CGPA - 0.75) * 10" />

      <div className="flex flex-col gap-3">
        {variables.map((v) => (
          <div key={v.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2 sm:gap-3">
            <Field label="Variable name" value={v.name} onChange={(e) => updateVariable(v.id, { name: e.target.value })} />
            <Field label="Value" inputMode="decimal" value={v.valueRaw} onChange={(e) => updateVariable(v.id, { valueRaw: e.target.value })} />
            <Button type="button" variant="ghost" onClick={() => removeVariable(v.id)} disabled={variables.length <= 1} aria-label={`Remove ${v.name || 'variable'}`}>
              ✕
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={addVariable}>
          + Add variable
        </Button>
        <Button type="button" onClick={evaluate}>
          Evaluate
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-[var(--danger)]">
          {error}
        </p>
      )}

      {result !== null && !error && <ResultCard label="Result" value={result} unit="" status="custom" />}
    </div>
  )
}
