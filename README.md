# GradeWise

GradeWise is an India-wide **academic conversion platform** — not just another CGPA calculator. It converts
CGPA, SGPA, GPA, marks and percentage; aggregates semester and year results with proper credit weighting; plans
target scores; and, where a university's own conversion rule has been verified against an official document,
applies that exact formula instead of a generic estimate.

- **Live site:** https://d-majumder.github.io/gradewise/
- **Repository:** https://github.com/D-Majumder/gradewise

[![CI](https://github.com/D-Majumder/gradewise/actions/workflows/ci.yml/badge.svg)](https://github.com/D-Majumder/gradewise/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/D-Majumder/gradewise/actions/workflows/deploy.yml/badge.svg)](https://github.com/D-Majumder/gradewise/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](./CODE_OF_CONDUCT.md)

**Project governance:** [License](./LICENSE) · [Contributing](./CONTRIBUTING.md) ·
[Code of Conduct](./CODE_OF_CONDUCT.md) · [Security Policy](./SECURITY.md) · [Support](./SUPPORT.md)

## Why

Most "CGPA to percentage" tools apply one multiplier to every student. Indian universities actually use
genuinely different, officially defined formulas — the gap between a generic guess and a student's real,
institution-mandated percentage can matter for admissions and eligibility cutoffs. GradeWise prioritizes
**accuracy and honest sourcing over maximum coverage**. See [/methodology](https://d-majumder.github.io/gradewise/methodology)
for the verification standard, and the "University data philosophy" section below.

## Features

- **Convert** — CGPA/SGPA ⇄ percentage (generic, scale-and-multiplier model) and marks ⇄ percentage
- **SGPA / CGPA** — semester-wise and year-wise aggregation, credit-weighted with automatic fallback to a
  simple average (and an explicit note whenever that fallback happens), plus guidance on handling backlog,
  repeat and grade-improvement subjects
- **Target** — required SGPA to hit a target CGPA, required marks to hit a target percentage, required CGPA to
  hit a target percentage under a given linear rule
- **Custom formula** — a safe, sandboxed (no `eval()`) expression evaluator for any linear or non-linear
  formula, for when you have your own institution's exact rule but it isn't in the registry yet
- **Universities** — searchable registry of institutions with source-verified conversion formulas; each
  university page links straight back into the Custom formula calculator pre-filled with its exact rule
- Rolling-number result animation (respects `prefers-reduced-motion`), Copy result / Share, light/dark/system
  theme, fully responsive down to ~360px, accessible (skip link, labeled form controls, `aria-live` results)

## Architecture

```
src/engine/        pure calculation engine — zero React deps, fully unit-tested
src/data/          institution/rule registry + provenance tests
src/pages/         one file per route; the calculator's 4 tabs live under src/pages/home/
src/components/    ResultCard, ThemeToggle, layout, ui primitives
scripts/           sitemap generation from the institution registry
.github/workflows/ CI (lint+typecheck+test+build) and GitHub Pages deploy
```

Stack: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + react-router-dom v7 + react-helmet-async. Entirely
client-side — no backend, no analytics, no tracking. See `CLAUDE.md` for a deeper architecture/conventions guide.

## Supported calculation modes

CGPA→%, %→CGPA, marks→%, %→marks, semester SGPA→CGPA (credit-weighted or simple average), year-wise CGPA→overall
CGPA, required-SGPA-for-target-CGPA, required-marks-for-target-%, required-CGPA-for-target-%, and arbitrary
custom formulas over user-defined variables.

## Academic data provenance

Every `ConversionRule` in `src/data/institutions.ts` carries a `status` (`official` / `unverified` / `custom`):

- **`official`** — the formula was confirmed by fetching and reading a primary document (a university
  ordinance, examination circular, or an AICTE/UGC circular), and the rule carries a real, checkable source URL
  and the date it was verified.
- **`unverified`** — a formula that is commonly cited elsewhere but could not be confirmed against a primary
  document is still listed, explicitly labeled unverified, with notes on what was found.
- An institution with **no** confirmed formula is still listed (so it's searchable) with an empty `rules` array
  and a note explaining what was checked — never a guessed coefficient.

This is enforced, not just documented: `src/data/__tests__/institutions.test.ts` fails CI if an `official` rule
lacks a real `https://` source URL, or an `unverified` rule lacks explanatory notes.

### Reporting formula errors

Spotted a formula that's wrong, outdated, or missing a caveat? Please don't silently work around it — open a
[formula correction issue](https://github.com/D-Majumder/gradewise/issues/new?template=formula_correction.md)
(or the in-app [/report](https://d-majumder.github.io/gradewise/report) page, which links to the same place).
Corrections backed by an official source are the fastest to act on; see
[CONTRIBUTING.md](./CONTRIBUTING.md#academic-formula--university-data-contributions) for exactly what to
include. If your institution isn't listed at all, use the
[university request template](https://github.com/D-Majumder/gradewise/issues/new?template=university_request.md)
instead.

## Local setup

```bash
git clone https://github.com/D-Majumder/gradewise.git
cd gradewise
npm install
npm run dev
```

## Testing

```bash
npm test          # vitest — engine + data-provenance tests
npm run lint       # oxlint
npx tsc -b         # typecheck (catches things vitest's esbuild transform won't)
npm run build      # typecheck + sitemap + production build
```

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`: install → lint → typecheck → test → build → publish
`dist/` to GitHub Pages via `actions/deploy-pages`. `.github/workflows/ci.yml` runs the same checks (without
deploying) on every push and pull request.

To point this repo at a different GitHub Pages URL: update `base` in `vite.config.ts`, `SITE_URL` in
`src/lib/Seo.tsx`, `SITE_URL` in `scripts/generate-sitemap.ts`, and the hardcoded canonical/OG URLs in
`index.html`, then re-run `npm run build`. GitHub Pages itself needs "Build and deployment: GitHub Actions" set
under the repository's Settings → Pages (already configured for this repo).

## How to add an institution

1. Add an entry to the `institutions` array in `src/data/institutions.ts` with `rules: []` and a `notes` field
   explaining what you checked and why no formula is confirmed yet.
2. Run `npm test` — `institutions.test.ts` will validate the shape.

## How to add a verified formula

1. Find the university's own ordinance, examination circular, grading regulations document, or an AICTE/UGC
   circular that states the formula directly — a secondary site repeating it is not sufficient for `official`.
2. Add a `ConversionRule` to that institution's `rules` array with `status: 'official'`, `formulaType: 'linear'`,
   the `a`/`b` coefficients, and a `source` with the real document title, a working URL, and today's date as
   `verifiedAt`.
3. If you only have a secondary source, add it with `status: 'unverified'` instead, and explain in `notes` what
   you found and why it isn't confirmed.
4. Run `npm test` to confirm it passes the provenance checks, then open a PR — see
   [/report](https://d-majumder.github.io/gradewise/report) for the same process without a local setup.

The two steps above are a quick reference — the full contribution process (branch naming, commit/PR
expectations, coding standards, accessibility, and the complete academic-data-sourcing requirements) is in
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

Contributions are welcome — code, documentation, and especially source-verified university formula corrections.
Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request; for anything beyond a small,
obviously-correct fix, open an issue first to discuss the approach. Participation is governed by the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## License

The GradeWise application source code is licensed under the [MIT License](./LICENSE) —
Copyright © 2026 Dhruba Majumder.

That license covers this repository's own code and original written content. It does **not** extend to the
academic grading regulations, formulas, or institutional names/trademarks referenced in the university data —
those remain the property of, and are governed by the policies of, their respective institutions. See the
"Scope of this license" note at the bottom of [LICENSE](./LICENSE) for the full explanation.

## Security

GradeWise is static and entirely client-side, which limits (but doesn't eliminate) its security surface — see
[SECURITY.md](./SECURITY.md) for what's in scope and how to privately report a vulnerability via GitHub's
security advisories (please don't open a public issue for one).

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you're
expected to uphold it.

## Support

Need help, have a question, or aren't sure where a report belongs? See [SUPPORT.md](./SUPPORT.md) — this is a
solo-maintained project with no dedicated support team, but it explains the best channel for each kind of ask.

## Citing GradeWise

If you'd like to cite this project (e.g. in a report or thesis referencing it), see [CITATION.cff](./CITATION.cff).

## Creator

Built and maintained by [Dhruba Majumder](https://github.com/D-Majumder). Attribution links on the About/
Developer pages come from a single source of truth (`src/lib/creator.ts`); GitHub is a real, always-shown URL,
while Portfolio and LinkedIn only render once configured — see `.env.example` for local dev, or set the
`VITE_PORTFOLIO_URL` / `VITE_LINKEDIN_URL` repository Actions **variables** (not secrets) for the deployed site.
