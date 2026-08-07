# Archive Report: enable-gfm-tables

> **schema**: gentle-ai.archive-report/v1
> **change**: enable-gfm-tables
> **archived**: 2026-08-07
> **artifactStore**: hybrid (OpenSpec files + Engram)
> **status**: success — intentional-with-warnings (W-BUILD-DEFERRED accepted; no CRITICAL)

## Final State

The change is COMPLETE and verified. Verify verdict **PASS**: 10/10 spec requirements and 11/11 scenarios COMPLIANT per the verification evidence; zero blockers, zero CRITICAL findings. `npm run type-check` passes (exit 0) on Node v22.23.2 (nvm). CompileMDX audit: 48/48 lessons compile, 0 RAW_TABLE, 0 COMPILE_ERROR; all 6 GFM pipe tables render as real `<table>` elements with `<thead>/<th>`, styled by the pre-existing `MarkdownTable` component (PR #29). `npm run build` was NOT executed locally — deferred to Vercel per explicit user instruction (accepted warning W-BUILD-DEFERRED, consistent with the PR #29 pattern). No commits were made during apply; delivery is handled by the orchestrator (extends PR #29 branch `feat/content-table-component`).

### What shipped

- `remark-gfm ^4.0.1` added to `package.json` dependencies (with `package-lock.json` via `npm install`).
- `src/app/learn/[module]/[slug]/page.tsx`: `import remarkGfm from "remark-gfm"` and `remarkPlugins: [remarkMath, remarkGfm]` in `mdxConfig` (GFM registered AFTER math, so math tokenizes into dedicated nodes before GFM transforms run).
- `src/app/learn/[module]/[slug]/page.tsx`: H1 strip regex hardened from `/^# .+\n?/` to `/^\s*# .+\n?/` so 13 python lessons with a leading-newline title no longer drop a block.
- `src/content/modules/machine-learning/lessons/lesson08_gradient_boosting/lesson.md` L90: unescaped `<10,000` → `\<10,000` (CommonMark backslash escape) inside the `<CalloutInfo>`, fixing the lesson08 500 ("Unexpected character `1`" MDX parse failure). lesson10/lesson14 `<`-with-digit occurrences intentionally untouched (already valid MDX).
- No content changes to the 4 lesson files with pipe tables (ia 02/03/04, python 01) — they parse unchanged through GFM.

## Source-of-truth sync

Both delta specs are FULL specs for NEW capabilities (no ADDED/MODIFIED/REMOVED/RENAMED markers) and no `openspec/specs/{domain}/` existed — direct copies, verified byte-identical (`diff` clean):

| Domain | Action | Path | Requirements / Scenarios |
|--------|--------|------|--------------------------|
| gfm-table-parsing | Created | `openspec/specs/gfm-table-parsing/spec.md` | 8 / 8 |
| lesson08-mdx-compile | Created | `openspec/specs/lesson08-mdx-compile/spec.md` | 2 / 3 |

No destructive merge; nothing to warn about. `rules.archive` from `openspec/config.yaml` ("Warn before merging destructive deltas") — not triggered.

## Archive Disposition — Explicit Orchestrator Override

Per the orchestrator's explicit instruction in the archive launch prompt (same convention as overfitting-trainer and regression-trainer), **the change directory stays as the record**: `openspec/changes/enable-gfm-tables/` was NOT moved to `openspec/changes/archive/YYYY-MM-DD-enable-gfm-tables/`. The default move-to-archive behavior from the sdd-archive skill and `openspec-convention.md` is overridden; this `archive-report.md` inside the change directory is the terminal record of the cycle. The `openspec/changes/archive/` directory was not created (nothing to move).

## Gates

### Native Review Receipt Gate — PASSED (disabled/unmanaged)

No native review artifacts exist for this change: no `openspec/changes/enable-gfm-tables/review/*` files, and no Engram `sdd/enable-gfm-tables/review/*` topics exist (mem_search over the change topic space returns only phase artifacts, no transaction/ledger/receipt/gate-context). With the review kill switch off and no review governing this change, the gate's only relaxation applies: `disabled/unmanaged`. There is no explicit review artifact that failed validation, so the gate does not block. No reviewer was launched (not archive's role).

### Task Completion Gate — PASSED

The persisted `openspec/changes/enable-gfm-tables/tasks.md` was written by `sdd-apply` with ALL 8 checkboxes marked complete (`[x]`: 1.1–1.2, 2.1–2.3, 3.1–3.3). Every implementation task is checked; no stale unchecked implementation task remains, and the gate's exceptional reconciliation path was not needed. Note: task 3.1's literal `npm run build` instruction was intentionally not executed — the tasks artifact itself records the deferral ("**NOTE: `npm run build` deferred to Vercel per user instruction — not run locally; gate tracked there**") and verify-report carries W-BUILD-DEFERRED. The remaining verification gates (type-check exit 0, 48/48 compileMDX audit, git-status guard) were all executed and passed.

### Action Context Guard — PASSED

`actionContext.mode: repo-local` (not `workspace-planning`); `allowedEditRoots: [/home/nieves/projects/InVitro-Code]`. All operations stayed inside the repo root.

## Verification Summary

Evidence revision `sha256:8d5064444c46c62502531c8796c6c624298fa11dc560afc1f8db4cfb8b66cd5b` (verify-report obs #65, 2026-08-07):

| Metric | Value |
|--------|-------|
| Verdict | PASS |
| Requirements | 10/10 code-compliant (gfm-table-parsing 8, lesson08-mdx-compile 2) |
| Scenarios | 11/11 code-compliant (8 + 3) |
| CRITICAL findings | 0 |
| Type-check | PASS (exit 0, Node v22.23.2 via nvm) |
| CompileMDX audit | 48/48 lessons, 0 RAW_TABLE, 0 COMPILE_ERROR |
| Build | deferred to Vercel per user instruction — NOT executed locally |

**W-BUILD-DEFERRED (accepted)**: `npm run build` was not executed in this environment — the user explicitly deferred the build gate to the Vercel deployment pipeline, following the established W-BUILD-DEFERRED pattern from PR #29. The MDX compilation gate was instead covered by the compileMDX audit (48/48 lessons compile, 6 tables render as `<table>`, lesson08 no longer errors) and `npm run type-check` (exit 0). The Vercel build gate remains the final production validation step; this is an accepted warning, not a code defect.

**SUG-01 (deferred)**: Consider adding a CI workflow that runs the compileMDX audit on every PR to catch MDX regressions before deploy. Non-blocking process suggestion.

The `verify-report.md` YAML `verdict: pass` is consistent with the Final-State Authority hierarchy: the verify snapshot (rank 4) is the terminal verification evidence and the launch prompt's final-state facts (rank 3) corroborate it — 10/10 requirements, 11/11 scenarios, type-check exit 0, 48/48 compile audit, W-BUILD-DEFERRED accepted. No contradiction required silent resolution.

## Engram Traceability (hybrid mode)

All phase artifacts persisted to Engram (project `invitro-code`, scope `project`, type `architecture`):

| Artifact | Observation ID | Topic |
|----------|---------------|-------|
| explore | #59 | `sdd/enable-gfm-tables/explore` |
| proposal | #60 | `sdd/enable-gfm-tables/proposal` |
| spec | #61 | `sdd/enable-gfm-tables/spec` |
| tasks | #62 | `sdd/enable-gfm-tables/tasks` |
| design | #63 | `sdd/enable-gfm-tables/design` |
| apply-progress | #64 | `sdd/enable-gfm-tables/apply-progress` |
| verify-report | #65 | `sdd/enable-gfm-tables/verify-report` |
| **archive-report** | (this archive) | `sdd/enable-gfm-tables/archive-report` |

No `sdd/enable-gfm-tables/review/*` topics exist (native review disabled/unmanaged — see gate above).

## Delivery Decision

Single PR on the existing PR #29 branch `feat/content-table-component` (maintainer-approved split from the tasks.md Review Workload Forecast: ~40–60 changed lines, low 400-line budget risk, no chaining). The apply produced 3 implementation file changes (`package.json` + `package-lock.json`, `page.tsx`, `lesson08.md` L90) plus the openspec artifacts; **no commits were made during apply**. Delivery (commit/push/PR) is the orchestrator's next step; `sdd-archive` does not perform git operations.

## Artifacts

Created:
- `openspec/specs/gfm-table-parsing/spec.md`
- `openspec/specs/lesson08-mdx-compile/spec.md`
- `openspec/changes/enable-gfm-tables/archive-report.md`

SDD cycle complete: planned, implemented, verified, archived. Ready for the next change.
