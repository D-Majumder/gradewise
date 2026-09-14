import { describe, expect, it } from 'vitest'
import { aggregateSemesters, aggregateYears } from '../aggregate'
import type { SemesterEntry, YearEntry } from '../types'

function sem(id: string, sgpa: number | null, credits: number | null): SemesterEntry {
  return { id, label: id, sgpa, credits }
}

describe('aggregateSemesters', () => {
  it('computes credit-weighted CGPA when all semesters have credits', () => {
    const semesters = [sem('S1', 7.82, 22), sem('S2', 8.14, 24)]
    const result = aggregateSemesters(semesters, true)
    expect(result.method).toBe('credit_weighted')
    const expected = (7.82 * 22 + 8.14 * 24) / (22 + 24)
    expect(result.cgpa).toBeCloseTo(expected, 2)
    expect(result.usedFallback).toBe(false)
  })

  it('falls back to simple average when credits are missing, and flags the fallback', () => {
    const semesters = [sem('S1', 7.82, null), sem('S2', 8.14, 24)]
    const result = aggregateSemesters(semesters, true)
    expect(result.method).toBe('simple_average')
    expect(result.usedFallback).toBe(true)
    expect(result.cgpa).toBeCloseTo((7.82 + 8.14) / 2, 2)
  })

  it('uses simple average when credit weighting is not requested', () => {
    const semesters = [sem('S1', 7.82, 22), sem('S2', 8.14, 24)]
    const result = aggregateSemesters(semesters, false)
    expect(result.method).toBe('simple_average')
    expect(result.usedFallback).toBe(false)
  })

  it('ignores incomplete semester entries', () => {
    const semesters = [sem('S1', 7.82, 22), sem('S2', null, null)]
    const result = aggregateSemesters(semesters, true)
    expect(result.rows.length).toBe(1)
  })

  it('handles an empty semester list without throwing', () => {
    const result = aggregateSemesters([], true)
    expect(result.cgpa).toBe(0)
    expect(result.rows.length).toBe(0)
  })
})

describe('aggregateYears', () => {
  function yr(id: string, cgpa: number | null, credits: number | null): YearEntry {
    return { id, label: id, cgpa, credits }
  }

  it('computes credit-weighted cumulative CGPA across years', () => {
    const years = [yr('Y1', 7.5, 44), yr('Y2', 8.0, 46)]
    const result = aggregateYears(years, true)
    expect(result.method).toBe('credit_weighted')
    expect(result.cgpa).toBeCloseTo((7.5 * 44 + 8.0 * 46) / 90, 2)
  })

  it('falls back gracefully with missing credits', () => {
    const years = [yr('Y1', 7.5, null), yr('Y2', 8.0, null)]
    const result = aggregateYears(years, true)
    expect(result.method).toBe('simple_average')
  })
})
