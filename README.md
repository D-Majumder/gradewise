# GradeWise

GradeWise is an India-wide **academic conversion platform** — not just another CGPA calculator. It converts
CGPA, SGPA, GPA, marks and percentage; aggregates semester and year results with proper credit weighting; plans
target scores; and, where a university's own conversion rule has been verified against an official document,
applies that exact formula instead of a generic estimate.

**[Live site](https://d-majumder.github.io/gradewise/)**

## Why

Most "CGPA to percentage" tools apply one multiplier to every student. Indian universities actually use
genuinely different, officially defined formulas — the gap between a generic guess and a student's real,
institution-mandated percentage can matter for admissions and eligibility cutoffs. GradeWise prioritizes
**accuracy and honest sourcing over maximum coverage**: see [/methodology](https://d-majumder.github.io/gradewise/methodology)
for how formulas are verified and labeled (official / unverified), and `src/data/institutions.ts` for the
provenance rule enforced on every entry.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + react-router-dom, entirely client-side (no backend, no
tracking). Deployed as a static site to GitHub Pages via GitHub Actions.

## Development

```bash
npm install
npm run dev      # start dev server
npm test         # run vitest
npm run lint     # oxlint
npm run build    # typecheck + generate sitemap + production build
```

The calculation engine (`src/engine/`) has zero React/UI dependencies and is unit-tested in isolation. Adding
or editing an institution's conversion formula in `src/data/institutions.ts` is covered by
`src/data/__tests__/institutions.test.ts`, which enforces that every `official` rule cites a real source URL and
every `unverified` rule explains why.

## Contributing a formula correction

Reports backed by an official source (university circular, ordinance, or grading regulations document) are the
fastest to act on — see [/report](https://d-majumder.github.io/gradewise/report) or open a GitHub issue directly.
