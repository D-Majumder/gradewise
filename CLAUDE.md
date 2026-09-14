# CLAUDE.md — GradeWise

Guidance for continuing work on this repository in future sessions.

## What this project is

GradeWise is an **India-wide academic conversion platform**, not merely a CGPA calculator. Product philosophy
(do not drift from this): **accuracy and trustworthy, source-verified institutional rules matter more than
claiming maximum university coverage.** Never fabricate a conversion formula to fill a gap — an institution
with no verified rule is listed with `hasOfficialConversion: false` and empty or explicitly `'unverified'`
rules, never a guessed coefficient.

Stack: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + react-router-dom v7 + react-helmet-async. Entirely
client-side, no backend, deployed to GitHub Pages (base path `/gradewise/`) via `.github/workflows/deploy.yml`.

## Architecture

- `src/engine/` — pure calculation engine, zero React dependencies, fully unit-tested (`__tests__/`). Covers:
  linear conversion rules (`convert.ts`), semester/year aggregation with credit weighting and automatic
  fallback to simple average (`aggregate.ts`), target-SGPA/marks/CGPA solving (`target.ts`), a sandboxed
  (non-`eval`) arithmetic expression parser for custom formulas (`formula.ts`), input validation
  (`validate.ts`), and floating-point-safe rounding (`round.ts`). Import from `src/engine` (barrel `index.ts`).
- `src/data/institutions.ts` — the institution/rule registry. **Read the provenance-rule comment at the top of
  this file before editing it.** Every entry's source and verification is checked by
  `src/data/__tests__/institutions.test.ts` — an `official`-status rule without a real `https://` source URL,
  or an `unverified`-status rule without explanatory `notes`, fails CI.
- `src/pages/` — one file per route, wired in `src/App.tsx`. The calculator lives at `/` (`Home.tsx`) and is
  split into four tabs under `src/pages/home/`: Convert (generic scale conversion), Aggregate (SGPA→CGPA,
  year-wise, backlog/improvement guidance), Target (required SGPA/marks/CGPA), Custom formula.
- `src/components/` — `ResultCard` (rolling-number animation via `useAnimatedNumber`, respects
  `prefers-reduced-motion`), `ThemeToggle`, `layout/Header` + `layout/Footer`, and `ui/` primitives
  (Button, Card, Field, Select, Tabs) using Tailwind classes bound to CSS custom properties defined in
  `src/index.css` (light/dark/system theme via `data-theme` attribute, set pre-paint in `index.html` to avoid
  a flash of incorrect theme).
- `scripts/generate-sitemap.ts` — regenerates `public/sitemap.xml` from `src/data/institutions.ts` plus the
  static routes. Runs automatically as part of `npm run build`; run `npm run sitemap` to refresh it standalone.
- `public/404.html` + the inline script in `index.html` — GitHub Pages SPA deep-link workaround (stash the
  intended path in `sessionStorage`, bounce to `/gradewise/`, restore via `history.replaceState`).

## Conventions

- No comments explaining *what* code does — only *why*, for non-obvious constraints (see existing files for
  the calibration).
- `roundTo`/`formatNumber` from `src/engine/round.ts` for any displayed numeric value — never raw `.toFixed()`.
- New UI text that makes a claim about a formula being official/generic/unverified must stay honest about
  which it is — this is the product's core trust promise, not a style nit.
- Run `npx tsc -b`, `npm test`, `npx oxlint`, and `npm run build` before committing — `tsc -b` catches issues
  vitest's esbuild transform won't (e.g. `erasableSyntaxOnly` violations like TS parameter-property shorthand).

## Status as of this session

Done: calculation engine (full, tested), theme system, SEO helper, routing shell, all four calculator tabs
wired end-to-end, university search/detail pages, About/Methodology/Developer/Report/Privacy pages, rolling
number result animation, responsive/accessible layout, CI (`ci.yml`) and Pages deployment (`deploy.yml`)
workflows, auto-generated sitemap, and a seed set of source-verified institutions: University of Delhi (UG+PG
CBCS), Jadavpur University (AICTE Engineering/Technology only), VTU, MAKAUT, IIT Roorkee, IIT Tirupati — plus
Anna University / University of Calcutta / University of Mumbai listed with their formulas explicitly
unverified or absent (see `/methodology` for the flagged correction on the commonly-miscited "CGPA x 9.5"
AICTE/UGC claim — the real AICTE table is `(CGPA - 0.75) x 10`).

Not yet done (pick up here):
- **University coverage is intentionally small.** Expand it institution-by-institution, always fetching and
  reading a primary document before adding an `official` rule — never transcribe a secondary/calculator-site
  claim as official. Good next targets: IIT Madras/Kharagpur/Patna/Hyderabad (secondary sources reported
  formulas but were not fetched/verified), and any other high-enrollment state university once a real circular
  is located.
- **Grade-letter ↔ grade-point tables** (`gradeToPoint`/`pointToGrade` in `convert.ts`) exist in the engine but
  have no UI yet — most Indian universities use different O/A+/A/B+/... tables, so this needs to be
  institution-scoped data, not a single hardcoded table.
- No component/UI tests yet (only the engine and data-provenance layers are tested). If adding React Testing
  Library tests, `@testing-library/react` and `jsdom` are already devDependencies and `src/test/setup.ts` is
  wired into `vite.config.ts`.
- No `og-image.png` exists yet at the path referenced by `index.html`'s Open Graph tags — add one under
  `public/` (1200×630) or remove the tag.
- Repository has no GitHub remote configured yet in this environment — `deploy.yml` won't run until this repo
  is pushed to `github.com/D-Majumder/gradewise` (or the repo name / `base` in `vite.config.ts` and the
  `SITE_URL` constants in `src/lib/Seo.tsx` and `scripts/generate-sitemap.ts` are updated to match wherever it
  actually gets hosted) and Pages is enabled with the "GitHub Actions" source.
