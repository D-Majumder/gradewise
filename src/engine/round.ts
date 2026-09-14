/**
 * Rounds using proper decimal correction to avoid classic floating point
 * artifacts (e.g. 1.005 -> 1 instead of 1.01 with naive Math.round).
 */
export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals)
  // Correct for floating point representation error before rounding.
  const corrected = Math.round((value + Number.EPSILON) * factor) / factor
  return Object.is(corrected, -0) ? 0 : corrected
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—'
  return roundTo(value, decimals).toFixed(decimals)
}
