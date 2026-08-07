# Tasks: Enable GFM Table Parsing + Lesson08 MDX Fix

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~40–60 (incl. lockfile) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR — extends PR #29 on `feat/content-table-component` |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | GFM plugin + lesson08 escape + H1 regex, verified | PR #29 (extends) | `npm run type-check` | compileMDX heredoc audit (expect `<table>`, 0 RAW_TABLE, 0 COMPILE_ERROR) + `npm run dev` spot-check lesson08 + ia lesson02 table | Revert 2–3 commits on `feat/content-table-component`; no migration |

Single PR on the existing PR #29 branch (user-approved). Well under 400 lines; no chaining, no `size:exception`.

## Phase 1: Foundation

- [x] 1.1 `source ~/.nvm/nvm.sh && nvm use 22 && npm install remark-gfm` — verify `remark-gfm` in `package.json` `dependencies` and `package-lock.json` (REQ-GFM-01).
- [x] 1.2 **VERIFICATION-FIRST** — run the compileMDX heredoc audit: a `<Section>` block containing a blank-line-separated GFM pipe table compiled with `remarkPlugins: [remarkMath, remarkGfm]` MUST produce a `<table>` element (T2 case, REQ-GFM-03). If it fails, STOP and report — fallback documented in proposal, do not improvise.

## Phase 2: Core Implementation

- [x] 2.1 `src/app/learn/[module]/[slug]/page.tsx` — `import remarkGfm from "remark-gfm";` and set `remarkPlugins: [remarkMath, remarkGfm]` in `mdxConfig` L40-46, GFM after math (REQ-GFM-02).
- [x] 2.2 `src/content/modules/machine-learning/lessons/lesson08_gradient_boosting/lesson.md` L90 — escape `<10,000` → `\<10,000` inside the `<CalloutInfo>` (REQ-L08-01). Preserve rest of prose.
- [x] 2.3 `src/app/learn/[module]/[slug]/page.tsx` L171 — H1 strip regex `/^# .+\n?/` → `/^\s*# .+\n?/` so leading-newline titles strip (REQ-H1-01, REQ-H1-02).

## Phase 3: Verification

- [x] 3.1 `npm run type-check` with Node 22 exits 0 (REQ-GFM-06). **NOTE: `npm run build` deferred to Vercel per user instruction — not run locally; gate tracked there.**
- [x] 3.2 Re-run compileMDX audit heredoc over all lessons — expect 0 RAW_TABLE, 0 COMPILE_ERROR (REQ-L08-01, REQ-L08-02: literal `<10,000`, no stray H1).
- [x] 3.3 `git status` — only `package.json`, `package-lock.json`, `page.tsx`, `lesson08/lesson.md` changed; no other content files touched (REQ-GFM-05 no-regression guard).

## Notes

- No test runner in project (`strict_tdd: false`); verification gates are type-check + compileMDX audit + git-status guard. Build gate deferred to Vercel (W-BUILD-DEFERRED pattern per PR #29).
- lesson10/lesson14 `<`-with-digit occurrences stay untouched (REQ-L08-01 scenario 2).
