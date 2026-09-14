import { describe, expect, it } from 'vitest'
import { parseNumericInput, validateCredits, validateGpaValue, validateMarks, validatePercentage } from '../validate'

describe('parseNumericInput', () => {
  it('parses a plain integer', () => {
    expect(parseNumericInput('8')).toBe(8)
  })
  it('parses a decimal', () => {
    expect(parseNumericInput('8.42')).toBe(8.42)
  })
  it('handles pasted values with commas', () => {
    expect(parseNumericInput('1,234')).toBe(1234)
  })
  it('returns null for empty input', () => {
    expect(parseNumericInput('')).toBeNull()
    expect(parseNumericInput('   ')).toBeNull()
  })
  it('returns null for malformed decimals', () => {
    expect(parseNumericInput('8.4.2')).toBeNull()
    expect(parseNumericInput('abc')).toBeNull()
    expect(parseNumericInput('8..2')).toBeNull()
  })
  it('rejects Infinity and NaN text', () => {
    expect(parseNumericInput('Infinity')).toBeNull()
    expect(parseNumericInput('NaN')).toBeNull()
  })
})

describe('validateGpaValue', () => {
  it('accepts values within a 10-point scale', () => {
    expect(validateGpaValue(8.42, 10).valid).toBe(true)
  })
  it('accepts the minimum boundary', () => {
    expect(validateGpaValue(0, 10).valid).toBe(true)
  })
  it('accepts the maximum boundary', () => {
    expect(validateGpaValue(10, 10).valid).toBe(true)
  })
  it('rejects values above scale max', () => {
    expect(validateGpaValue(10.5, 10).valid).toBe(false)
  })
  it('rejects negative values', () => {
    expect(validateGpaValue(-1, 10).valid).toBe(false)
  })
  it('rejects null/empty input', () => {
    expect(validateGpaValue(null, 10).valid).toBe(false)
  })
  it('validates against a 4-point scale', () => {
    expect(validateGpaValue(4.2, 4).valid).toBe(false)
    expect(validateGpaValue(3.8, 4).valid).toBe(true)
  })
})

describe('validatePercentage', () => {
  it('accepts 0-100 range', () => {
    expect(validatePercentage(76.7).valid).toBe(true)
  })
  it('rejects above 100', () => {
    expect(validatePercentage(101).valid).toBe(false)
  })
  it('rejects negative', () => {
    expect(validatePercentage(-5).valid).toBe(false)
  })
})

describe('validateMarks', () => {
  it('accepts obtained <= maximum', () => {
    expect(validateMarks(85, 100).valid).toBe(true)
  })
  it('accepts obtained = 0', () => {
    expect(validateMarks(0, 100).valid).toBe(true)
  })
  it('accepts obtained = maximum', () => {
    expect(validateMarks(100, 100).valid).toBe(true)
  })
  it('rejects obtained > maximum', () => {
    expect(validateMarks(120, 100).valid).toBe(false)
  })
  it('rejects negative marks', () => {
    expect(validateMarks(-5, 100).valid).toBe(false)
  })
  it('rejects maximum <= 0', () => {
    expect(validateMarks(10, 0).valid).toBe(false)
    expect(validateMarks(10, -10).valid).toBe(false)
  })
  it('rejects empty obtained/maximum', () => {
    expect(validateMarks(null, 100).valid).toBe(false)
    expect(validateMarks(50, null).valid).toBe(false)
  })
})

describe('validateCredits', () => {
  it('treats null as valid (optional)', () => {
    expect(validateCredits(null).valid).toBe(true)
  })
  it('rejects negative credits', () => {
    expect(validateCredits(-2).valid).toBe(false)
  })
  it('rejects unrealistically high credits', () => {
    expect(validateCredits(500).valid).toBe(false)
  })
})
