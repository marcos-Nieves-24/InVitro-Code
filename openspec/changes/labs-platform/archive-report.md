# Archive Report: labs-platform

> **schema**: gentle-ai.archive-report/v1
> **change**: labs-platform
> **archived**: 2026-08-07
> **artifactStore**: hybrid (OpenSpec files + Engram)
> **status**: success — intentional-with-warnings (W-BUILD-DEFERRED accepted; design-path mismatch noted; no CRITICAL)

## Final State

The change is COMPLETE and verified. Verify verdict **PASS**: 33/33 spec requirements and 35/35 scenarios COMPLIANT per the terminal verification evidence; zero blockers, zero CRITICAL findings. `npm run type-check` passes (exit 0) on Node v22.23.2. `npm run build` was NOT executed locally — deferred to Vercel per explicit user instruction (accepted warning W-BUILD-DEFERRED, consistent with the enable-gfm-tables and PR #29 pattern). Native review APPROVED (lineage `review-8f6dadbfa4ba4e4c`, lens `review-reliability`, correction_budget 200, receipt present, terminal state `approved`). No commits were made during apply; delivery (commit/push/PR) is handled by the orchestrator.

### What shipped

- `src/lib/labs/quiz-parser.ts` — tolerant bilingual quiz parser (`parseQuiz` never throws; `structured | raw-fallback`); 48/48 quiz files parse structured.
- `src/components/labs/` — QuizRunner, LabRunner, LabCodeBlock, LabTabs, AssignmentViewer, NotebookDownloadButton, LabCard, LabHub, index.ts.
- `src/app/(dashboard)/laboratorios/page.tsx` — hub REPLACED the placeholder.
- `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` — LabPage with 3 tabs (Laboratorio/Cuestionario/Proyecto).
- `src/app/api/notebook/[module]/[lesson]/route.ts` — auth-gated, traversal-safe notebook download (raw stored bytes preserved).
- `src/lib/content/modules.ts` — +`hasLab`/`hasQuiz`/`hasNotebook`/`getLessonFrontmatter`.
- `src/components/laboratorio/LabMission.tsx` — DELETED (REQ-HUB-06); zero stray imports; `/proyectos` untouched.

## Source-of-truth sync

All 6 delta specs are FULL specs for NEW capabilities (no ADDED/MODIFIED/REMOVED/RENAMED markers) and no `openspec/specs/{domain}/` existed — direct copies, verified byte-identical (`diff -q` clean on all six), per the enable-gfm-tables precedent:

| Domain | Action | Path | Requirements / Scenarios |
|--------|--------|------|--------------------------|
| lab-page | Created | `openspec/specs/lab-page/spec.md` | 5 / 5 |
| lab-runner | Created | `openspec/specs/lab-runner/spec.md` | 6 / 7 |
| quiz-runner | Created | `openspec/specs/quiz-runner/spec.md` | 7 / 7 |
| assignment-viewer | Created | `openspec/specs/assignment-viewer/spec.md` | 4 / 5 |
| notebook-download-api | Created | `openspec/specs/notebook-download-api/spec.md` | 5 / 5 |
| lab-hub | Created | `openspec/specs/lab-hub/spec.md` | 6 / 6 |

**Reconciliation (non-destructive wording update)**: `openspec/specs/markdown-table-rendering/spec.md` Out-of-Scope line previously read "Tables in `lab.md`, `assignment.md`, `quiz.md`, `README.md` — no consumer". With labs-platform, `lab.md` and `assignment.md` DO have consumers: lab-runner (REQ-LABRUN-01) and assignment-viewer (REQ-ASGN-01/02) compile them through the MDX pipeline with `table: MarkdownTable`. The line now reads: "Tables in `quiz.md` — parsed structurally by `quiz-parser.ts` (REQ-QUIZ-01), not MDX-rendered; `README.md` — no consumer". This is a small non-destructive wording update explicitly instructed by the orchestrator (launch prompt rank 3); `rules.archive` ("Warn before merging destructive deltas") is not triggered — no destructive merge occurred. Flagged here for the audit trail.

## Archive Disposition — Explicit Orchestrator Override

Per the orchestrator's explicit instruction in the archive launch prompt (same convention as enable-gfm-tables, overfitting-trainer, and regression-trainer), **the change directory stays as the record**: `openspec/changes/labs-platform/` was NOT moved to `openspec/changes/archive/YYYY-MM-DD-labs-platform/`. The default move-to-archive behavior from the sdd-archive skill and `openspec-convention.md` is overridden; this `archive-report.md` inside the change directory is the terminal record of the cycle.

## Gates

### Native Review Receipt Gate — PASSED (approved)

Structured status `reviewGate.result: allow`, `blockedReasons: []`, `nextRecommended: "archive"`. Terminal receipt read at `.git/gentle-ai/review-transactions/v2/review-8f6dadbfa4ba4e4c/review-receipt.json`:

- `terminal_state: approved`, `evidence_outcome: passed`
- lineage `review-8f6dadbfa4ba4e4c`, generation 1, risk_level `medium`
- lens `review-reliability`, `findings: []` (zero findings), correction_budget 200
- final_candidate_tree `f8b868bdc6cb966c3b472331c50d124aa9863e71` == initial_review_tree (no fix delta; `fix_delta_hash` empty)
- `receipt_published: true` per `finalize-attempt-journal.json` (second attempt, verification outcome passed)
- reviewer evidence: inspected all 37 manifest paths; verified auth gates, traversal protection, MDX fallbacks, quiz-parser never-throw contract, null-safe frontmatter, conditional tabs — "No user-impacting behavioral defects introduced."

The receipt matches final candidate tree, paths digest, policy, ledger, fix delta, evidence, mode counters, and base relationship. Gate PASSED with no override needed.

### Task Completion Gate — PASSED

The persisted `openspec/changes/labs-platform/tasks.md` was written by `sdd-apply` with ALL 30 checkboxes marked complete (`[x]`: 1.1–1.9 PR1, 2.1–2.10 PR2, 3.1–3.6 PR3). Every implementation task is checked; no stale unchecked implementation task remains, and the gate's exceptional reconciliation path was not needed. `verify-report.md` Completeness table confirms 30/30 tasks complete; apply-progress corroborates.

### Action Context Guard — PASSED

`actionContext.mode` is repo-local (not `workspace-planning`); operations stayed inside the repo root. Pre-existing worktree noise (`.atl/`, `tsconfig.json`, `.gitignore`, `openspec/config.yaml`, `.codegraph/`, `.stitch-screens/`, `AGENTS.md`, `opencode.json`) is NOT part of this change and was excluded from archive operations.

## Verification Summary

Evidence revision `sha256:38fd3fa2ca375d64ee47e1c0348b7b183353edc4ba6a6d4faedb1aeef8e8c280` (verify-report obs #74, remediated 2026-08-07):

| Metric | Value |
|--------|-------|
| Verdict | PASS |
| Requirements | 33/33 code-compliant (lab-page 5, lab-runner 6, quiz-runner 7, assignment-viewer 4, notebook-download-api 5, lab-hub 6) |
| Scenarios | 35/35 code-compliant (5 + 7 + 7 + 5 + 5 + 6) |
| CRITICAL findings | 0 |
| Type-check | PASS (exit 0, Node v22.23.2 via nvm) |
| Quiz parser smoke | 4/4 structured (obs #75) — ia, python, estadistica, etica |
| Build | deferred to Vercel per user instruction — NOT executed locally |

**W-BUILD-DEFERRED (accepted)**: `npm run build` was not executed in this environment — the user explicitly deferred the build gate to the Vercel deployment pipeline (established pattern). Runtime behavior (Pyodide execution, tab switching, notebook download, SSR rendering) is confirmed by code inspection and native review, not by a local build. The type-check gate passed with exit 0. The Vercel build remains the final production validation step; this is an accepted warning, not a code defect.

**W-DESIGN-PATH (noted, non-blocking)**: `design.md` specifies components under `src/components/laboratorio/` but implementation uses `src/components/labs/` per orchestrator directive (documented in apply-progress; design file not updated). All references (imports, barrels) are internally consistent; low severity. Also `{source}` (design) vs `{raw}` (implementation) prop-name variance reconciled in apply-progress.

**SUG-01 (deferred)**: Add a browser smoke or E2E for the lab page route (Pyodide load, tab switch, notebook download) once the build runs on Vercel. Non-blocking process suggestion.

The `verify-report.md` YAML `verdict: pass` with 33/33 requirements and 35/35 scenarios is consistent with the Final-State Authority hierarchy: native review (rank 1, approved) and launch prompt final-state facts (rank 3) corroborate the verify snapshot (rank 4). No contradiction required silent resolution.

## Engram Traceability (hybrid mode)

All phase artifacts persisted to Engram (project `invitro-code`, scope `project`, type `architecture`):

| Artifact | Observation ID | Topic |
|----------|---------------|-------|
| explore | #68 | `sdd/labs-platform/explore` |
| proposal | #69 | `sdd/labs-platform/proposal` |
| spec | #70 | `sdd/labs-platform/spec` |
| tasks | #71 | `sdd/labs-platform/tasks` |
| design | #72 | `sdd/labs-platform/design` |
| apply-progress | #73 | `sdd/labs-platform/apply-progress` |
| verify-report | #74 | `sdd/labs-platform/verify-report` |
| quiz smoke | #75 | (discovery) |
| **archive-report** | (this archive) | `sdd/labs-platform/archive-report` |

No `sdd/labs-platform/review/*` Engram topics exist — native review artifacts live in `.git/gentle-ai/review-transactions/v2/review-8f6dadbfa4ba4e4c/` (transaction, state, ledger journal, reviewer result, terminal receipt). See gate above.

## Delivery Decision

Delivery plan per orchestrator: **4 stacked PRs** — PR1 quiz (parser + QuizRunner), PR2a lab-assignment-core (modules helpers, notebook API, LabRunner, LabCodeBlock, AssignmentViewer, NotebookDownloadButton), PR2b page+tabs (LabTabs + lesson page), PR3 hub (LabHub + LabCard + placeholder replacement + LabMission removal). This refines the tasks.md forecast (3 work units) by splitting PR2 into 2a/2b to keep review slices focused; the orchestrator handles commit/push/PR after archive. `sdd-archive` does not perform git operations.

## Artifacts

Created:
- `openspec/specs/lab-page/spec.md`
- `openspec/specs/lab-runner/spec.md`
- `openspec/specs/quiz-runner/spec.md`
- `openspec/specs/assignment-viewer/spec.md`
- `openspec/specs/notebook-download-api/spec.md`
- `openspec/specs/lab-hub/spec.md`
- `openspec/changes/labs-platform/archive-report.md`

Updated (non-destructive reconciliation):
- `openspec/specs/markdown-table-rendering/spec.md` — Out-of-Scope line corrected (`lab.md`/`assignment.md` now have `MarkdownTable` consumers)

SDD cycle complete: planned, implemented, verified, reviewed, archived. Ready for the next change.
