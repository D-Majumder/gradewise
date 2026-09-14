import { roundTo } from './round'

export interface TargetResult {
  achievable: boolean
  requiredValue: number | null
  message: string
}

/**
 * Given a current credit-weighted CGPA and a target CGPA after earning more credits,
 * solves for the SGPA required in the upcoming term(s):
 *   target = (current*currentCredits + required*nextCredits) / (currentCredits+nextCredits)
 *   => required = (target*(currentCredits+nextCredits) - current*currentCredits) / nextCredits
 */
export function requiredNextSgpa(
  currentCgpa: number,
  currentCredits: number,
  targetCgpa: number,
  nextCredits: number,
  scaleMax: number,
): TargetResult {
  if (nextCredits <= 0) {
    return { achievable: false, requiredValue: null, message: 'Please enter the credits for the upcoming semester(s).' }
  }
  const totalCredits = currentCredits + nextCredits
  const required = (targetCgpa * totalCredits - currentCgpa * currentCredits) / nextCredits
  const rounded = roundTo(required, 2)

  if (required <= 0) {
    return {
      achievable: true,
      requiredValue: 0,
      message: `Your target is already secured by your current record — any SGPA of 0 or above keeps you at or above ${targetCgpa}.`,
    }
  }
  if (required > scaleMax) {
    return {
      achievable: false,
      requiredValue: rounded,
      message: `That target cannot be reached under the current assumptions — it would require an SGPA of ${rounded}, which exceeds the maximum of ${scaleMax}.`,
    }
  }
  return {
    achievable: true,
    requiredValue: rounded,
    message: `You need an SGPA of ${rounded} or higher in the upcoming term(s) to reach a CGPA of ${targetCgpa}.`,
  }
}

/**
 * Solves for the marks required in a remaining component to reach a target overall percentage,
 * given marks already secured out of a portion of the total.
 */
export function requiredMarks(
  securedMarks: number,
  securedMax: number,
  totalMax: number,
  targetPercentage: number,
): TargetResult {
  const remainingMax = totalMax - securedMax
  if (remainingMax <= 0) {
    return { achievable: false, requiredValue: null, message: 'There are no remaining marks left to secure — please check the maximum marks entered.' }
  }
  const requiredTotal = (targetPercentage / 100) * totalMax
  const requiredRemaining = requiredTotal - securedMarks
  const rounded = roundTo(requiredRemaining, 2)

  if (requiredRemaining <= 0) {
    return {
      achievable: true,
      requiredValue: 0,
      message: `You have already secured enough marks to reach ${targetPercentage}% — no further marks are required.`,
    }
  }
  if (requiredRemaining > remainingMax) {
    return {
      achievable: false,
      requiredValue: rounded,
      message: `That target cannot be reached under the current assumptions — it would require ${rounded} marks out of the remaining ${remainingMax}.`,
    }
  }
  return {
    achievable: true,
    requiredValue: rounded,
    message: `You need ${rounded} out of the remaining ${remainingMax} marks to reach ${targetPercentage}%.`,
  }
}

/** Solves for the CGPA required to reach a target percentage, using a linear rule percentage = a*cgpa + b. */
export function requiredCgpaForPercentage(
  targetPercentage: number,
  a: number,
  b: number,
  scaleMax: number,
): TargetResult {
  if (a === 0) {
    return { achievable: false, requiredValue: null, message: 'This conversion rule cannot be inverted (its formula does not depend on CGPA).' }
  }
  const required = (targetPercentage - b) / a
  const rounded = roundTo(required, 2)
  if (required < 0) {
    return {
      achievable: true,
      requiredValue: 0,
      message: `A CGPA of 0 already exceeds this target under the selected formula.`,
    }
  }
  if (required > scaleMax) {
    return {
      achievable: false,
      requiredValue: rounded,
      message: `That target cannot be reached under the current assumptions — it would require a CGPA of ${rounded}, which exceeds the maximum of ${scaleMax}.`,
    }
  }
  return {
    achievable: true,
    requiredValue: rounded,
    message: `You need a CGPA of ${rounded} or higher to reach ${targetPercentage}% under the selected formula.`,
  }
}
