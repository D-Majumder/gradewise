import { describe, expect, it } from 'vitest'
import { evaluateFormula, FormulaError } from '../formula'

describe('evaluateFormula', () => {
  it('evaluates a simple multiplication', () => {
    expect(evaluateFormula('CGPA * 9.5', { CGPA: 8 })).toBeCloseTo(76, 4)
  })

  it('evaluates parentheses and subtraction', () => {
    expect(evaluateFormula('(CGPA - 0.75) * 10', { CGPA: 8.42 })).toBeCloseTo(76.7, 4)
  })

  it('respects operator precedence', () => {
    expect(evaluateFormula('2 + 3 * 4', {})).toBe(14)
  })

  it('supports exponents', () => {
    expect(evaluateFormula('2 ^ 3', {})).toBe(8)
  })

  it('supports unary minus', () => {
    expect(evaluateFormula('-CGPA + 10', { CGPA: 3 })).toBe(7)
  })

  it('is case-insensitive for variable names', () => {
    expect(evaluateFormula('cgpa * 10', { CGPA: 5 })).toBe(50)
  })

  it('rejects unknown variables', () => {
    expect(() => evaluateFormula('MARKS * 10', { CGPA: 5 })).toThrow(FormulaError)
  })

  it('rejects arbitrary identifiers instead of executing them like eval would', () => {
    expect(() => evaluateFormula('alert(1)', {})).toThrow(FormulaError)
  })

  it('rejects function-call-like syntax safely', () => {
    expect(() => evaluateFormula('CGPA(10)', { CGPA: 5 })).toThrow(FormulaError)
  })

  it('rejects division by zero', () => {
    expect(() => evaluateFormula('CGPA / 0', { CGPA: 5 })).toThrow(FormulaError)
  })

  it('rejects empty formula', () => {
    expect(() => evaluateFormula('', {})).toThrow(FormulaError)
  })

  it('rejects malformed parentheses', () => {
    expect(() => evaluateFormula('(CGPA * 10', { CGPA: 5 })).toThrow(FormulaError)
  })

  it('rejects malformed numbers', () => {
    expect(() => evaluateFormula('CGPA * 8.4.2', { CGPA: 5 })).toThrow(FormulaError)
  })

  it('never uses eval or Function constructor internally', () => {
    // Structural guarantee: confirm the module source contains no eval/Function usage.
    const src = evaluateFormula.toString()
    expect(src.includes('eval(')).toBe(false)
  })
})
