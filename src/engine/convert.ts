import type { CalculationResult, ConversionRule } from './types'
import { roundTo } from './round'

/**
 * Applies a linear conversion rule (percentage = a*x + b) and returns a full
 * result including a human-readable step-by-step breakdown. This is the only
 * place formulas are actually evaluated against a selected institution rule.
 */
export function applyLinearRule(inputValue: number, rule: ConversionRule): CalculationResult {
  const raw = rule.a * inputValue + rule.b
  const clamped = Math.max(0, Math.min(100, raw))
  const rounded = roundTo(clamped, 2)

  const aTerm = rule.a === 1 ? '' : `${formatCoefficient(rule.a)} x `
  const bTerm = rule.b === 0 ? '' : rule.b > 0 ? ` + ${formatCoefficient(rule.b)}` : ` - ${formatCoefficient(Math.abs(rule.b))}`

  return {
    value: rounded,
    unit: '%',
    formulaDisplay: rule.formulaDisplay,
    status: rule.status,
    source: rule.source,
    steps: [
      { label: 'Formula', expression: rule.formulaDisplay },
      { label: 'Substituting', expression: `${aTerm}${inputValue}${bTerm}` },
      { label: 'Result', expression: `${roundTo(raw, 4)}${raw !== clamped ? ' (clamped to valid range)' : ''}` },
    ],
  }
}

function formatCoefficient(n: number): string {
  return Number.isInteger(n) ? String(n) : String(roundTo(n, 4))
}

/** Simple, universal, scale-independent conversions that never require an institution rule. */

export function marksToPercentage(obtained: number, maximum: number): number {
  return roundTo((obtained / maximum) * 100, 2)
}

export function percentageToMarks(percentage: number, maximum: number): number {
  return roundTo((percentage / 100) * maximum, 2)
}

/** Generic (non-institution-specific) CGPA/GPA <-> percentage using a scale multiplier, e.g. x10 or x9.5. */
export function gpaToPercentageGeneric(gpa: number, multiplier: number): number {
  return roundTo(gpa * multiplier, 2)
}

export function percentageToGpaGeneric(percentage: number, multiplier: number, scaleMax: number): number {
  const gpa = percentage / multiplier
  return roundTo(Math.min(gpa, scaleMax), 2)
}

export function gradeToPoint(grade: string, table: Record<string, number>): number | null {
  const key = grade.trim().toUpperCase()
  return key in table ? table[key] : null
}

export function pointToGrade(point: number, table: Record<string, number>): string | null {
  let closest: string | null = null
  let smallestDiff = Infinity
  for (const [grade, value] of Object.entries(table)) {
    const diff = Math.abs(value - point)
    if (diff < smallestDiff) {
      smallestDiff = diff
      closest = grade
    }
  }
  return closest
}
