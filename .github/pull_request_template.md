## Summary

<!-- What does this PR change, and why? -->

## Related issue

<!-- Link an issue if one exists, e.g. "Closes #12" -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] University/formula data addition or correction
- [ ] Documentation
- [ ] Chore / tooling / refactor (no behavior change)

## Academic data provenance (only if this PR touches `src/data/institutions.ts`)

<!-- Skip this section entirely if your PR doesn't touch institution/formula data. -->

- [ ] I've included the institution, programme, regulation/batch, exact rule, official source, source URL,
      verification date, and a worked example, per
      [CONTRIBUTING.md](../CONTRIBUTING.md#academic-formula--university-data-contributions).
- [ ] This is **not** based solely on a calculator website, blog, social media post, or an AI-generated search
      summary.
- [ ] I have not silently changed an existing `official`-status rule — if I'm disputing one, there's a linked
      issue with evidence.
- [ ] The rule's `status` (`official` / `unverified`) honestly reflects what I could actually verify.

## Checklist

- [ ] `npm test` passes (vitest — engine, data-provenance, and any new tests)
- [ ] `npm run lint` passes (oxlint)
- [ ] `npx tsc -b` passes (TypeScript)
- [ ] `npm run build` passes (includes sitemap generation + production build)
- [ ] No fabricated academic formulas, university names, or sources
- [ ] Accessibility considered (keyboard reachable, labeled inputs, respects `prefers-reduced-motion` if this
      touches animation, checked in both light and dark theme if this touches UI)
- [ ] No secrets, API keys, tokens, or real `.env` values committed
- [ ] Documentation updated if this changes setup, behavior, or the data-contribution process
      (README / CONTRIBUTING / CLAUDE.md as relevant)
- [ ] I have not added a Claude/AI co-author trailer or attribution to this commit/PR.

## Screenshots (if a UI change)

<!-- Before/after screenshots or a short clip help a lot for review -->
