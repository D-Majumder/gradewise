import { describe, expect, it } from 'vitest'
import { institutions } from '../institutions'

/**
 * These tests enforce the provenance rule documented at the top of institutions.ts:
 * an 'official' rule must carry a real source with a title, and a rule with a
 * source.type of 'official' should be checkable (a URL) or explicitly note why not.
 * This exists so a future contributor can't silently add a fabricated formula —
 * the test suite itself is part of the accuracy guarantee.
 */
describe('institution data provenance', () => {
  const allIds = institutions.map((inst) => inst.id)

  it('has no duplicate institution ids', () => {
    expect(new Set(allIds).size).toBe(allIds.length)
  })

  for (const institution of institutions) {
    describe(institution.name, () => {
      it('has no duplicate rule ids and every rule references this institution', () => {
        const ruleIds = institution.rules.map((r) => r.id)
        expect(new Set(ruleIds).size).toBe(ruleIds.length)
        for (const rule of institution.rules) {
          expect(rule.institutionId).toBe(institution.id)
        }
      })

      it("has hasOfficialConversion === true only if at least one rule is actually status 'official'", () => {
        const hasOfficial = institution.rules.some((r) => r.status === 'official')
        expect(institution.hasOfficialConversion).toBe(hasOfficial)
      })

      for (const rule of institution.rules) {
        describe(`rule ${rule.id}`, () => {
          it('has a title on its source', () => {
            expect(rule.source, `rule ${rule.id} has no source at all`).toBeDefined()
            expect(rule.source?.title.length).toBeGreaterThan(0)
          })

          if (rule.status === 'official') {
            it('official rules must cite a checkable URL', () => {
              expect(rule.source?.url, `official rule ${rule.id} has no source URL`).toMatch(/^https?:\/\//)
            })
          }

          if (rule.status === 'unverified') {
            it('unverified rules must explain why in notes', () => {
              expect(rule.notes ?? '', `unverified rule ${rule.id} has no explanatory notes`).not.toBe('')
            })
          }

          it('has finite coefficients', () => {
            expect(Number.isFinite(rule.a)).toBe(true)
            expect(Number.isFinite(rule.b)).toBe(true)
          })
        })
      }
    })
  }
})
