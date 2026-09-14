# Contributing to GradeWise

Thanks for considering a contribution. GradeWise is an India-wide **academic conversion platform**, not just
another CGPA calculator — its entire value depends on being more accurate and more honestly sourced than the
generic calculator sites it's trying to improve on. Please read this document before opening a PR, especially
the [Academic formula / university data contributions](#academic-formula--university-data-contributions)
section if you're touching `src/data/institutions.ts`.

## Project philosophy

1. **Accuracy and honest sourcing over maximum coverage.** A wrong formula that looks official is worse than no
   formula at all. It is always acceptable to list an institution with no rule yet.
2. **Never fabricate.** No invented conversion coefficients, no guessed grade tables, no assumed formulas "based
   on similar universities."
3. **Be explicit about certainty.** Every conversion rule carries a status — `official`, `unverified`, or
   `custom` — and the UI/methodology page must never blur that distinction.
4. **Client-side only.** No backend, no analytics, no tracking. Don't introduce a dependency that phones home.

## Development setup

Requires Node.js 22+ and npm.

```bash
git clone https://github.com/D-Majumder/gradewise.git
cd gradewise
npm install
npm run dev       # start the dev server
```

Useful commands while working:

```bash
npm test           # run vitest (engine + data-provenance + component tests)
npm run lint        # oxlint
npx tsc -b          # typecheck
npm run build       # typecheck + generate sitemap + production build
npm run sitemap      # regenerate public/sitemap.xml only
```

All four (`npm test`, `npm run lint`, `npx tsc -b`, `npm run build`) must pass before you open a PR — the same
checks run in CI (`.github/workflows/ci.yml`) and will block merge otherwise.

## Branch naming

Branch off `main` using a short, descriptive, kebab-case name prefixed by type:

- `feat/<short-description>` — new functionality
- `fix/<short-description>` — bug fix
- `data/<institution-slug>` — adding or correcting university/formula data
- `docs/<short-description>` — documentation only
- `chore/<short-description>` — tooling, CI, dependency, refactor with no behavior change

## Commit expectations

- Write commit messages that explain **why**, not just what — the diff already shows what changed.
- Keep commits reasonably scoped; don't bundle an unrelated formatting pass with a feature change.
- **Do not add any AI/Claude co-author trailer or attribution line to commits or PR descriptions submitted to
  this project**, regardless of what tooling you used to help write the code. Commits should be authored under
  your own identity.
- No secrets, API keys, tokens, or `.env` files with real values in any commit — GradeWise has no backend and
  should never need one; if your change seems to require a secret, that's a sign it doesn't belong here.

## Coding standards

- TypeScript, strict mode as configured — don't loosen `tsconfig` settings to work around a type error.
- Follow the existing code style (see `src/engine/` for the calculation layer's conventions, `src/components/ui/`
  for UI primitives). Run `npm run lint` before pushing.
- Default to **no comments**. Only add one when the *why* is genuinely non-obvious (a hidden constraint, a
  workaround, a surprising invariant) — not to restate what the code already says.
- Use `roundTo`/`formatNumber` from `src/engine/round.ts` for any displayed numeric value; never raw
  `.toFixed()`, which has known floating-point pitfalls this project deliberately works around.
- Don't add speculative abstractions, feature flags, or "just in case" configuration for requirements nobody has
  asked for yet.

## Testing requirements

- Any change to `src/engine/` needs a corresponding test in `src/engine/__tests__/`.
- Any change to `src/data/institutions.ts` is automatically checked by
  `src/data/__tests__/institutions.test.ts` (see below) — make sure it still passes.
- UI/component changes don't require exhaustive test coverage, but if you're fixing a bug, a regression test is
  appreciated.

## Accessibility & UI/UX expectations

- All interactive elements must be reachable and operable by keyboard (native `<button>`/`<a>`/`<select>`/
  `<input>` elements are already used throughout — prefer them over custom widgets).
- Form inputs need a visible, associated `<label>` (see `src/components/ui/Field.tsx` and `Select.tsx` for the
  existing pattern) — no placeholder-only labeling.
- Respect `prefers-reduced-motion` for any new animation (see `src/hooks/useAnimatedNumber.ts` for the existing
  pattern).
- Maintain responsive layout down to ~360px width, and check both light and dark themes (the app supports
  light/dark/system via CSS custom properties in `src/index.css` — use the existing `var(--...)` tokens rather
  than hardcoding colors).
- New result/error states should announce to assistive tech where appropriate (see `aria-live` usage on
  `ResultCard`).

## Issue-first guidance

Small, obviously-correct fixes (typos, a broken link, an off-by-one in a validation message) can go straight to
a PR. For anything substantial — a new calculator mode, a UI redesign, a new page, a change to how aggregation
or rounding works — **please open an issue first** to discuss the approach before investing time in an
implementation that might not fit the project's direction.

## Pull request process

1. Fork the repo (or branch directly if you have write access) and make your change on a branch named per the
   convention above.
2. Run `npm test`, `npm run lint`, `npx tsc -b`, and `npm run build` locally — all must pass.
3. Fill out the PR template completely, including the checklist at the bottom.
4. A PR that touches `src/data/institutions.ts` must include full source provenance for any new or changed rule
   (see the next section) — PRs without it will be asked to add it before merge, not merged with a placeholder.
5. Keep the PR focused; a maintainer may ask you to split an unrelated bundle of changes.

## Academic formula / university data contributions

This is the part of the project where accuracy matters most, so the bar is higher here than anywhere else in
the codebase.

**If you are adding or changing an entry in `src/data/institutions.ts`, your PR must include all of the
following:**

1. **Institution** — full official name (and common abbreviation/aliases if any).
2. **Programme/degree** — which programme(s) the rule applies to (e.g. "B.Tech", "all UG programmes", "MBA").
3. **Regulation/batch**, if applicable — the scheme, regulation year, or admission-batch the rule applies to;
   many universities changed their formula across regulation years, so "all batches" must be an explicit,
   verified claim, not a default assumption.
4. **The exact rule** — written as a precise formula (e.g. `Percentage = (CGPA - 0.75) x 10`), not a vague
   description.
5. **Official source** — the actual document: an ordinance, examination circular, grading regulations PDF, or
   an AICTE/UGC circular. A named document, not "the university's website" in general.
6. **Source URL** — a working, direct link to that document (or the page hosting it). If the document has no
   stable URL, say so explicitly and explain how it can be independently verified.
7. **Verification date** — the date you (the contributor) actually opened/checked that source.
8. **A worked example** — at least one sample input/output pair (e.g. "CGPA 8.20 → 74.5%") showing the formula
   applied, so a reviewer can sanity-check it against the source without redoing your research.
9. **Appropriate tests** — `src/data/__tests__/institutions.test.ts` already enforces the structural provenance
   rules (an `official` rule must have a real `https://` source URL; an `unverified` rule must have explanatory
   notes) — make sure your addition passes it, and add a targeted test if your change introduces new logic.

**Do NOT submit a university conversion rule based only on:**

- third-party CGPA calculator websites
- blog posts
- Reddit, Quora, or other social media
- search-engine AI summaries or snippets
- unverified claims from students ("my friend said...")

These are exactly the kind of secondary sources this project exists to be more accurate than. If that's the
best source you have, submit it with `status: 'unverified'` and say so honestly in the notes — see below.

### Official vs. unverified vs. custom

- **`official`** — the formula has been confirmed by fetching and reading a primary document, and the entry
  carries a real, checkable `source.url` plus the date it was verified. This is the only status that gets the
  "Official formula" badge and green styling in the UI.
- **`unverified`** — a formula you found but could not confirm against a primary document. Still valuable to
  include (so the institution is searchable and the claim is visible), but must be labeled `status: 'unverified'`
  with `notes` explaining exactly what you found and why it isn't confirmed. Never upgrade a rule to `official`
  without doing the actual verification described above.
- **`custom`** — not something you add to the data file at all; it's the live, in-app custom-formula calculator
  users fill in themselves. Not relevant to data PRs.

**Never silently change an existing `official` rule.** If you believe a currently-listed official formula is
wrong or outdated, open an issue (use the "Formula correction" template) with your evidence — don't just
overwrite it in a PR without flagging that you're disputing an existing verified entry.

## Code of Conduct

Participation in this project is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Questions

If something in this guide is unclear, open a [Support](./SUPPORT.md)-style discussion/issue rather than
guessing — clarifying the guide itself is a welcome contribution too.
