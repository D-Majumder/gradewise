# Security Policy

## Scope

GradeWise is a **static, entirely client-side** application (React + Vite, deployed as static files to GitHub
Pages). There is no backend server, no database, no user accounts, and no API that handles secrets or personal
data on GradeWise's own infrastructure — see [Privacy](https://d-majumder.github.io/gradewise/privacy) for
details. This meaningfully limits the attack surface, but client-side issues are still real security issues:
things like XSS in a page that renders user-supplied or institution data, dependency vulnerabilities pulled in
via `package.json`, or a supply-chain issue in the build pipeline are all in scope.

## Supported Versions

GradeWise does not currently ship versioned releases — it is continuously deployed from the `main` branch to
https://d-majumder.github.io/gradewise/. Only the latest code on `main` (i.e. what's currently live) is
supported; there is no older version receiving separate security fixes.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for a security vulnerability.** Publicly disclosing an exploitable
issue before it's been investigated and fixed puts users of the live site at risk.

Instead, please report it privately using GitHub's built-in private vulnerability reporting, which is enabled
on this repository:

**→ [Report a vulnerability](https://github.com/D-Majumder/gradewise/security/advisories/new)**

This opens a draft security advisory that is visible only to you and the maintainer — GitHub handles the private
communication, so no personal email address needs to be shared.

When reporting, please include:

- A description of the issue and its potential impact
- Steps to reproduce (a minimal example is ideal)
- The URL/route or file where you found it, if applicable

### Response expectations

This is a solo-maintained open-source project, not a company with a dedicated security team — please be
patient. As a general target, expect an initial acknowledgment within about a week. Fix timelines depend on
severity and complexity; you'll be kept updated within the advisory thread.

### If you'd rather not use GitHub's advisory feature

There is currently no separate, dedicated security contact email configured for this project. If you'd prefer
an email channel instead of a GitHub security advisory, please open a regular (non-sensitive) issue asking the
maintainer to share one, rather than including vulnerability details in a public issue.

> **Maintainer note (for @D-Majumder):** if you'd like a dedicated security contact email instead of relying
> solely on GitHub's private advisory flow, add it above and I'll link it here — nothing invented in the
> meantime.

## Please don't submit secrets

Never include real API keys, tokens, passwords, or other secrets in an issue, pull request, or commit — even
as a "redacted" example. GradeWise's architecture should never require one; if a proposed change seems to need
a secret, please raise that as a design question first (see [CONTRIBUTING.md](./CONTRIBUTING.md)) rather than
committing one.
