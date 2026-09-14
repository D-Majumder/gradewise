import { describe, expect, it } from 'vitest'
import { requiredCgpaForPercentage, requiredMarks, requiredNextSgpa } from '../target'

describe('requiredNextSgpa', () => {
  it('solves a normal achievable target', () => {
    const result = requiredNextSgpa(7.82, 72, 8.2, 24, 10)
    expect(result.achievable).toBe(true)
    expect(result.requiredValue).toBeCloseTo(9.34, 1)
  })

  it('reports an already-secured target', () => {
    const result = requiredNextSgpa(9.5, 200, 8.0, 10, 10)
    expect(result.achievable).toBe(true)
    expect(result.requiredValue).toBe(0)
  })

  it('reports an impossible target beyond scale max', () => {
    const result = requiredNextSgpa(5.0, 72, 9.9, 12, 10)
    expect(result.achievable).toBe(false)
  })

  it('rejects zero or negative next credits', () => {
    const result = requiredNextSgpa(7.5, 72, 8.0, 0, 10)
    expect(result.achievable).toBe(false)
  })
})

describe('requiredMarks', () => {
  it('solves a normal achievable target', () => {
    const result = requiredMarks(40, 50, 100, 75)
    expect(result.achievable).toBe(true)
    expect(result.requiredValue).toBe(35)
  })

  it('reports already-secured target', () => {
    const result = requiredMarks(45, 50, 100, 40)
    expect(result.requiredValue).toBe(0)
  })

  it('reports impossible target beyond remaining marks', () => {
    const result = requiredMarks(10, 50, 100, 95)
    expect(result.achievable).toBe(false)
  })
})

describe('requiredCgpaForPercentage', () => {
  it('inverts a linear formula correctly', () => {
    // percentage = 10*cgpa - 7.5  => for 76.7% cgpa should be 8.42
    const result = requiredCgpaForPercentage(76.7, 10, -7.5, 10)
    expect(result.requiredValue).toBeCloseTo(8.42, 2)
  })

  it('flags impossible target beyond scale max', () => {
    const result = requiredCgpaForPercentage(99.9, 10, -7.5, 10)
    expect(result.achievable).toBe(false)
  })
})
