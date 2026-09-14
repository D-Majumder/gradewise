import type { ValidationResult } from './types'

function ok(): ValidationResult {
  return { valid: true }
}
function fail(error: string): ValidationResult {
  return { valid: false, error }
}

/** Parses a user-entered numeric string. Rejects empty, malformed, NaN, Infinity. */
export function parseNumericInput(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '')
  if (trimmed === '') return null
  // Only allow an optional leading minus, digits, and a single decimal point.
  if (!/^-?\d*\.?\d+$/.test(trimmed)) return null
  const value = Number(trimmed)
  if (!Number.isFinite(value)) return null
  return value
}

export function validateGpaValue(value: number | null, scaleMax: number): ValidationResult {
  if (value === null || Number.isNaN(value)) return fail(`Please enter a value between 0 and ${scaleMax}.`)
  if (!Number.isFinite(value)) return fail('Please enter a finite number.')
  if (value < 0) return fail(`This value cannot be negative. Please enter a value between 0 and ${scaleMax}.`)
  if (value > scaleMax) return fail(`This value cannot exceed ${scaleMax} on a ${scaleMax}-point scale.`)
  return ok()
}

export function validatePercentage(value: number | null): ValidationResult {
  if (value === null || Number.isNaN(value)) return fail('Please enter a percentage between 0 and 100.')
  if (value < 0) return fail('Percentage cannot be negative.')
  if (value > 100) return fail('Percentage cannot exceed 100.')
  return ok()
}

export function validateMarks(obtained: number | null, maximum: number | null): ValidationResult {
  if (maximum === null || Number.isNaN(maximum)) return fail('Please enter the maximum marks.')
  if (maximum <= 0) return fail('Maximum marks must be greater than 0.')
  if (obtained === null || Number.isNaN(obtained)) return fail('Please enter the marks obtained.')
  if (obtained < 0) return fail('Marks obtained cannot be negative.')
  if (obtained > maximum) return fail('Marks obtained cannot be greater than the maximum marks.')
  return ok()
}

export function validateCredits(value: number | null): ValidationResult {
  if (value === null) return ok() // credits are often optional
  if (Number.isNaN(value) || !Number.isFinite(value)) return fail('Please enter a valid credit value.')
  if (value < 0) return fail('Credits cannot be negative.')
  if (value > 60) return fail('That credit value looks too high for a single semester. Please double-check.')
  return ok()
}

export function validateSemesterEntry(
  sgpa: number | null,
  scaleMax: number,
): ValidationResult {
  return validateGpaValue(sgpa, scaleMax)
}
