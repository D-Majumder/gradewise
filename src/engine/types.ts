/**
 * Core types for the GradeWise calculation engine.
 * This module has zero React/UI dependencies so it can be unit tested in isolation.
 */

export type RuleStatus = 'official' | 'custom' | 'unverified'

export interface RuleSource {
  type: 'official' | 'secondary'
  title: string
  url: string
  verifiedAt: string // ISO date, e.g. "2026-08-01"
}

export type ConversionOperation =
  | 'cgpa_to_percentage'
  | 'sgpa_to_percentage'
  | 'gpa_to_percentage'
  | 'percentage_to_cgpa'

/**
 * A linear conversion rule: percentage = a * scaleValue + b
 * This covers the overwhelming majority of real institutional formulas,
 * e.g. "(CGPA - 0.75) x 10" => a=10, b=-7.5 ; "CGPA x 9.5" => a=9.5, b=0
 */
export interface ConversionRule {
  id: string
  institutionId: string
  programme: string // specific programme code, or "*" for all programmes
  regulation: string // e.g. "2021", "CBCS 2019", or "*" for all regulations
  operation: ConversionOperation
  scaleMax: number // e.g. 10 or 4
  formulaType: 'linear'
  a: number
  b: number
  formulaDisplay: string // human readable, e.g. "(CGPA - 0.75) x 10"
  status: RuleStatus
  source?: RuleSource
  notes?: string
}

export type AggregationMethod = 'credit_weighted' | 'simple_average' | 'institution_specific'

export interface SemesterEntry {
  id: string
  label: string
  sgpa: number | null
  credits: number | null
}

export interface YearEntry {
  id: string
  label: string
  cgpa: number | null
  credits: number | null
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface CalculationStep {
  label: string
  expression: string
}

export interface CalculationResult {
  value: number
  unit: '%' | 'CGPA' | 'GPA' | 'marks'
  steps: CalculationStep[]
  formulaDisplay: string
  status: RuleStatus
  source?: RuleSource
}
