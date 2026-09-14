import type { AggregationMethod, SemesterEntry, YearEntry } from './types'
import { roundTo } from './round'

export interface AggregationBreakdownRow {
  label: string
  value: number
  weight: number | null
  contribution: number
}

export interface AggregationResult {
  cgpa: number
  method: AggregationMethod
  rows: AggregationBreakdownRow[]
  totalCredits: number | null
  usedFallback: boolean // true if credit-weighting was requested but credits were missing, so we fell back to simple average
}

/**
 * Aggregates semester SGPAs into a cumulative CGPA.
 * - If every semester has credits and the caller wants credit weighting, uses sum(SGPA*credits)/sum(credits).
 * - Otherwise falls back to a simple arithmetic mean, and flags that fallback explicitly so the UI
 *   never silently misrepresents which method was used.
 */
export function aggregateSemesters(
  semesters: SemesterEntry[],
  preferCreditWeighted: boolean,
): AggregationResult {
  const valid = semesters.filter((s) => s.sgpa !== null && !Number.isNaN(s.sgpa))
  const allHaveCredits = valid.length > 0 && valid.every((s) => s.credits !== null && s.credits > 0)

  const useCreditWeighting = preferCreditWeighted && allHaveCredits

  if (useCreditWeighting) {
    const totalCredits = valid.reduce((sum, s) => sum + (s.credits ?? 0), 0)
    const totalPoints = valid.reduce((sum, s) => sum + (s.sgpa ?? 0) * (s.credits ?? 0), 0)
    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    return {
      cgpa: roundTo(cgpa, 2),
      method: 'credit_weighted',
      totalCredits,
      usedFallback: false,
      rows: valid.map((s) => ({
        label: s.label,
        value: s.sgpa as number,
        weight: s.credits,
        contribution: roundTo((s.sgpa as number) * (s.credits as number), 2),
      })),
    }
  }

  const cgpa = valid.length > 0 ? valid.reduce((sum, s) => sum + (s.sgpa ?? 0), 0) / valid.length : 0
  return {
    cgpa: roundTo(cgpa, 2),
    method: 'simple_average',
    totalCredits: allHaveCredits ? valid.reduce((sum, s) => sum + (s.credits ?? 0), 0) : null,
    usedFallback: preferCreditWeighted && !allHaveCredits && valid.length > 0,
    rows: valid.map((s) => ({
      label: s.label,
      value: s.sgpa as number,
      weight: s.credits,
      contribution: s.sgpa as number,
    })),
  }
}

export function aggregateYears(years: YearEntry[], preferCreditWeighted: boolean): AggregationResult {
  const valid = years.filter((y) => y.cgpa !== null && !Number.isNaN(y.cgpa))
  const allHaveCredits = valid.length > 0 && valid.every((y) => y.credits !== null && y.credits > 0)
  const useCreditWeighting = preferCreditWeighted && allHaveCredits

  if (useCreditWeighting) {
    const totalCredits = valid.reduce((sum, y) => sum + (y.credits ?? 0), 0)
    const totalPoints = valid.reduce((sum, y) => sum + (y.cgpa ?? 0) * (y.credits ?? 0), 0)
    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    return {
      cgpa: roundTo(cgpa, 2),
      method: 'credit_weighted',
      totalCredits,
      usedFallback: false,
      rows: valid.map((y) => ({
        label: y.label,
        value: y.cgpa as number,
        weight: y.credits,
        contribution: roundTo((y.cgpa as number) * (y.credits as number), 2),
      })),
    }
  }

  const cgpa = valid.length > 0 ? valid.reduce((sum, y) => sum + (y.cgpa ?? 0), 0) / valid.length : 0
  return {
    cgpa: roundTo(cgpa, 2),
    method: 'simple_average',
    totalCredits: allHaveCredits ? valid.reduce((sum, y) => sum + (y.credits ?? 0), 0) : null,
    usedFallback: preferCreditWeighted && !allHaveCredits && valid.length > 0,
    rows: valid.map((y) => ({
      label: y.label,
      value: y.cgpa as number,
      weight: y.credits,
      contribution: y.cgpa as number,
    })),
  }
}
