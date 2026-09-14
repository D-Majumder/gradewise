import { describe, expect, it } from 'vitest'
import { applyLinearRule, gpaToPercentageGeneric, gradeToPoint, marksToPercentage, percentageToGpaGeneric, percentageToMarks, pointToGrade } from '../convert'
import type { ConversionRule } from '../types'

const sampleRule: ConversionRule = {
  id: 'test-rule',
  institutionId: 'test-university',
  programme: '*',
  regulation: '*',
  operation: 'cgpa_to_percentage',
  scaleMax: 10,
  formulaType: 'linear',
  a: 10,
  b: -7.5,
  formulaDisplay: '(CGPA - 0.75) x 10',
  status: 'official',
}

describe('applyLinearRule', () => {
  it('computes a standard official formula correctly', () => {
    const result = applyLinearRule(8.42, sampleRule)
    expect(result.value).toBeCloseTo(76.7, 2)
    expect(result.status).toBe('official')
  })

  it('clamps results above 100', () => {
    const rule = { ...sampleRule, a: 20, b: 0 }
    const result = applyLinearRule(9, rule)
    expect(result.value).toBe(100)
  })

  it('clamps results below 0', () => {
    const rule = { ...sampleRule, a: 10, b: -50 }
    const result = applyLinearRule(1, rule)
    expect(result.value).toBe(0)
  })

  it('handles minimum scale value', () => {
    const result = applyLinearRule(0, sampleRule)
    expect(result.value).toBe(0)
  })

  it('handles maximum scale value', () => {
    const result = applyLinearRule(10, sampleRule)
    expect(result.value).toBeCloseTo(92.5, 2)
  })
})

describe('marksToPercentage / percentageToMarks', () => {
  it('converts marks to percentage', () => {
    expect(marksToPercentage(85, 100)).toBe(85)
    expect(marksToPercentage(42.5, 50)).toBe(85)
  })

  it('handles marks = 0', () => {
    expect(marksToPercentage(0, 100)).toBe(0)
  })

  it('handles marks = maximum', () => {
    expect(marksToPercentage(100, 100)).toBe(100)
  })

  it('converts percentage back to marks', () => {
    expect(percentageToMarks(85, 100)).toBe(85)
  })
})

describe('gpaToPercentageGeneric / percentageToGpaGeneric', () => {
  it('applies a generic multiplier', () => {
    expect(gpaToPercentageGeneric(8.5, 9.5)).toBeCloseTo(80.75, 2)
  })

  it('inverts a generic multiplier', () => {
    expect(percentageToGpaGeneric(80.75, 9.5, 10)).toBeCloseTo(8.5, 2)
  })

  it('caps inverse conversion at scale max', () => {
    expect(percentageToGpaGeneric(100, 9.5, 10)).toBe(10)
  })
})

describe('grade <-> grade point tables', () => {
  const table = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, F: 0 }

  it('maps grade to point', () => {
    expect(gradeToPoint('O', table)).toBe(10)
    expect(gradeToPoint('a+', table)).toBe(9)
  })

  it('returns null for unknown grade', () => {
    expect(gradeToPoint('Z', table)).toBeNull()
  })

  it('maps point to nearest grade', () => {
    expect(pointToGrade(10, table)).toBe('O')
    expect(pointToGrade(8.4, table)).toBe('A')
  })
})
