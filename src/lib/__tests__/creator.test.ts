import { describe, expect, it } from 'vitest'
import { CREATOR } from '../creator'

/**
 * Regression guard for the "never invent a URL" rule: portfolio and LinkedIn
 * must stay empty unless an env var actually sets them, so the About/Developer
 * pages never render a placeholder link that goes nowhere.
 */
describe('CREATOR config', () => {
  it('always has a real, checkable GitHub profile and repo URL', () => {
    expect(CREATOR.githubProfile).toMatch(/^https:\/\/github\.com\//)
    expect(CREATOR.repo).toMatch(/^https:\/\/github\.com\/.+\/gradewise$/)
  })

  it('does not fabricate a portfolio or LinkedIn URL when none is configured', () => {
    // No VITE_PORTFOLIO_URL / VITE_LINKEDIN_URL is set in the test environment.
    expect(CREATOR.portfolio).toBe('')
    expect(CREATOR.linkedin).toBe('')
  })
})
