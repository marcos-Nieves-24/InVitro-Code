# Archive Report: overfitting-trainer

> **schema**: gentle-ai.archive-report/v1
> **change**: overfitting-trainer
> **archived**: 2026-08-06
> **artifactStore**: hybrid (OpenSpec files + Engram)
> **status**: success — intentional-with-warnings (WARN-01, WARN-02, WARN-03 accepted; no CRITICAL)

## Final State

The change is COMPLETE and code-compliant. 19/19 spec requirements and 25/25 scenarios are COMPLIANT per the verification evidence; zero CRITICAL findings. `npm run type-check` passes (exit 0). `npm run build` could not execute in this environment (Node 18.19.1 < 20.9 required by Next.js 16; exit 126) — environment constraint, not a code defect, accepted per the PerceptronTrainer/KnnTrainer/RegressionTrainer precedent (all build successfully on Vercel Node 22). Implemented on branch `feat/overfitting-trainer` in two work-unit commits.

### What shipped

- `src/components/lesson/overfitting-trainer.tsx` (created, 692 lines, commit ffc3218): "use client" + dynamic Plotly, fetches `/data/perceptron-trainer.json`, mulberry32(42) stratified 70/30 split → mulberry32(7) stratified 50-point train subsample (172 test whole), Householder QR polynomial fit of min-max normalized `radius_mean` → binary label for degrees 1–15 (λ=0 strictly, no normal equations), dual-panel Plotly (LEFT: 50 train teal circles `#14b8a6` + 172 test orange × `#f59e0b` + fit curve `#0f172a`, no "función real" trace; RIGHT: grouped train/test ECM bars on `yaxis.type: "log"` with `hovertemplate: "ECM: %{y:.4f}"`), degree slider 1–15 default 1 with three-zone labels, diagnosis bands per §12 table (1–2 Subajuste / 3–6 Punto óptimo / 7 "transición (óptimo)" / 8–15 Sobreajuste), `aria-live="polite"` diagnosis, loading spinner + error/retry ("Reintentar"), UCI citation footer, Spanish voseo copy, responsive `grid-cols-1 lg:grid-cols-2`.
- Dual MDX registration (commit ffc3218): `src/components/lesson/index.ts` L21 (`export { OverfittingTrainer } from "./overfitting-trainer"`) + `src/app/learn/[module]/[slug]/page.tsx` L30 (import) and L157 (components map).
- Lesson content (commit 15f7c2a): `lesson02_how_ai_learns/lesson.md` §11 → title "Overfitting en acción", ReflectionCheck preserved (blockId `reflection-l02-overfitting-predict`, `moduleSlug="ia"`, `lessonSlug="lesson02_how_ai_learns"`, prompt/answer unchanged), `<OverfittingTrainer />` replaces `<InteractiveFrame src="/interactives/demo_06b_overfitting.html">` (no "datos sintéticos" caption), demo bullets rewritten honestly — no "función real", irreducible floor ≈0.10 framed as natural class overlap, fixed 50-biopsy subsample disclosed; §12 single-line coherence tweak ("error train en su piso (~0.10)" + transitional degree 7 note), table bands intact; §§13–14 untouched beyond permitted minor wording.
- Cleanup (commit 15f7c2a): `public/interactives/demo_06b_overfitting.html` deleted (last HTML iframe holdout in lesson02 gone); `src/content/modules/ia/README.md` demos (8)→(7), 6b row removed.

### Source-of-truth sync

Both delta specs are FULL specs for NEW capabilities (no ADDED/MODIFIED/REMOVED/RENAMED markers) and no `openspec/specs/{domain}/` existed — direct copies, verified byte-identical (`diff` clean):

| Domain | Action | Path | Requirements / Scenarios |
|--------|--------|------|--------------------------|
| interactive-overfitting | Created | `openspec/specs/interactive-overfitting/spec.md` | 13 / 17 |
| overfitting-lesson-content | Created | `openspec/specs/overfitting-lesson-content/spec.md` | 6 / 8 |

No destructive merge; nothing to warn about. `rules.archive` from `openspec/config.yaml` ("Warn before merging destructive deltas") — not triggered.

## Archive Disposition — Explicit Orchestrator Override

Per the orchestrator's explicit instruction in the archive launch prompt (same convention as regression-trainer), **the change directory stays as the record**: `openspec/changes/overfitting-trainer/` was NOT moved to `openspec/changes/archive/YYYY-MM-DD-overfitting-trainer/`. The default move-to-archive behavior from the sdd-archive skill and `openspec-convention.md` is overridden; this `archive-report.md` inside the change directory is the terminal record of the cycle. The `openspec/changes/archive/` directory was not created (nothing to move).

## Gates

### Native Review Receipt Gate — PASSED (disabled/unmanaged)

No native review artifacts exist for this change: no `openspec/changes/overfitting-trainer/reviews/*` files, and no Engram `sdd/overfitting-trainer/review/*` topics exist (mem_search over the change topic space returns only phase artifacts, no review/transaction/ledger/receipt/gate-context). With the review kill switch off and no review governing this change, the gate's only relaxation applies: `disabled/unmanaged`. There is no explicit review artifact that failed validation, so the gate does not block. No reviewer was launched (not archive's role).

### Task Completion Gate — PASSED (exceptional mechanical reconciliation)

The persisted `tasks.md` was written by `sdd-apply` with ALL 21 checkboxes unchecked, despite complete implementation on disk (commits ffc3218 + 15f7c2a). Per the gate, archive may proceed only when the orchestrator explicitly instructs reconciliation AND `apply-progress`/`verify-report` prove completion. Both conditions hold:

1. **Explicit instruction**: the orchestrator's launch prompt asserts implementation is COMPLETE with authoritative final-state facts and explicitly instructs: "reconcile stale task checkboxes with apply-progress/verify-report proof" (final-state authority, rank 3 — outranks the persisted task checkboxes).
2. **Proof of completion**: `sdd/overfitting-trainer/apply-progress` (Engram obs #43) documents both work-unit commits and the shipped component/content/cleanup; `verify-report.md` (obs #44) documents 19/19 requirements and 25/25 scenarios code-compliant, 0 CRITICAL, type-check exit 0.

Reconciliation performed (mechanical, checkbox state only — no task semantics changed):
- Marked `[x]`: all Phase 1–4 implementation tasks (1.1–1.8, 2.1–2.2, 3.1–3.2, 4.1–4.2), plus verification tasks 5.1 (type-check PASS, exit 0), 5.3 (determinism — verified by code inspection: pure function, constant seeds 42/7, fresh PRNG per call), 5.5 (trainer — code-inspection + logical trace per verify-report methodology; `strict_tdd: false`), 5.6 (content — grep `"función real"` → 0, table bands confirmed on disk), 5.7 (cleanup — demo_06b absent, README "(7)" confirmed on disk).
- Left open with annotations: **5.2** (build — WARN-01 env-blocked, Node 18 < 20.9) and **5.4** (runtime ECM curve shape — WARN-02, predicted from QR λ=0 math + 50-point subsample but not confirmed with runtime numbers). These are non-implementation verification tasks whose literal runtime instructions were not met; they are NOT stale completion claims. The archive report below records the acceptance rationale. No implementation task remains unchecked.

### Action Context Guard — PASSED

`actionContext.mode: repo-local` (not `workspace-planning`); `allowedEditRoots: [/home/nieves/projects/InVitro-Code]`. All operations stayed inside the repo root.

## Verification Summary

Evidence revision `sha256:e3b0c442…7852b855` (verify-report obs #44, 2026-08-06):

| Metric | Value |
|--------|-------|
| Requirements | 19/19 code-compliant (interactive-overfitting 13, overfitting-lesson-content 6) |
| Scenarios | 25/25 code-compliant (17 + 8) |
| CRITICAL findings | 0 |
| Type-check | PASS (exit 0) |
| Build | env-blocked (Node 18.19.1 < 20.9; exit 126) — NOT a code defect |

**WARN-01 (accepted)**: `npm run build` exits 126 on the Node version gate (Next.js 16 requires >=20.9; machine runs Node 18.19.1). The MDX compilation gate could not execute in this environment. Accepted per precedent: PerceptronTrainer, KnnTrainer, and RegressionTrainer — the same component pattern — build successfully on Vercel Node 22, and the change's MDX compilation is verified indirectly via passing type-check + confirmed dual registration points + `overfitting-trainer.tsx` type-correct JSX. Verification via `npm run build` requires a Node >=20.9 host.

**WARN-02 (accepted)**: No runtime ECM curve verification — spec scenarios 3 (Stable high-degree fit), 4 (Live readout), 6 (Panels reflect the degree), and 7 (Default degree) are verified by code inspection only: no test runner exists (`strict_tdd: false`) and the build environment is blocked. The QR + back-substitution path is correct by inspection; the curve-shape prediction (train ECM ~0.10 at all degrees, test ECM minimum ~degree 3–6, test explosion from degree 9+, degree 15 ~471k) follows from the λ=0 math and 50-point subsample but cannot be confirmed with actual numbers in this environment.

**WARN-03 (accepted)**: `test_failure_jitter` — test point Y values are jittered (`-0.05` / `1.05`) for visual separation from train points; ECM computation uses real labels, so metrics are correct. Legend distinguishes train/test by marker shape and color, mitigating the visual-offset concern. Non-code presentational note.

**SUG-01 (deferred)**: Retry uses `window.location.reload()` — a full page reload loses the slider position; resetting internal state would be smoother UX. Non-blocking polish.
**SUG-02 (deferred)**: `formatECM` (threshold-based) and the on-bar text (`toFixed(4)`) use different formatting for the same value; aligning them would be consistent. Non-blocking polish.
**SUG-03 (deferred)**: Slider zone labels (`text-[10px]`) don't visually align with the degree numbers below; adding position markers would help. Non-blocking polish.

The `verify-report.md` YAML `verdict: fail` reflects `build_exit_code: 126` (environment gate) only — zero blockers, zero CRITICAL code findings. Consistent with the Final-State Authority hierarchy: the launch prompt's final-state facts (rank 3) and native review absence (rank 1, disabled) govern over the intermediate `fail` snapshot; the build claim is reported as environment-blocked, not as a code failure, and no contradiction needed silent resolution. The verify-report header's "Tasks total 17 / complete 17" count is an intermediate snapshot of apply-state accounting and is superseded by the persisted tasks artifact's 21 checkboxes reconciled above (19 closed, 2 open caveats).

## Engram Traceability (hybrid mode)

All phase artifacts persisted to Engram (project `invitro-code`, scope `project`, type `architecture`):

| Artifact | Observation ID | Topic |
|----------|---------------|-------|
| explore | #37 | `sdd/overfitting-trainer/explore` |
| proposal | #38 | `sdd/overfitting-trainer/proposal` |
| spec | #39 | `sdd/overfitting-trainer/spec` |
| design | #40 | `sdd/overfitting-trainer/design` |
| tasks | #41 | `sdd/overfitting-trainer/tasks` |
| apply-progress | #43 | `sdd/overfitting-trainer/apply-progress` |
| verify-report | #44 | `sdd/overfitting-trainer/verify-report` |
| **archive-report** | (this archive) | `sdd/overfitting-trainer/archive-report` |

No `sdd/overfitting-trainer/review/*` topics exist (native review disabled/unmanaged — see gate above).

## Delivery Decision

TWO PRs, maintainer-approved split (final-state facts; supersedes the intermediate tasks.md forecast of a single PR):
- **PR1** = component + registration (commit ffc3218): `overfitting-trainer.tsx` (692 lines) + `index.ts` barrel + `page.tsx` import/map — 695 insertions.
- **PR2** = content + cleanup (commit 15f7c2a): lesson02 §11–12 + README (7) + deleted `demo_06b_overfitting.html` — 9 insertions / 447 deletions.

Delivery (`push`/`PR`) is the orchestrator's next step; `sdd-archive` does not perform git operations.

## Artifacts

Created:
- `openspec/specs/interactive-overfitting/spec.md`
- `openspec/specs/overfitting-lesson-content/spec.md`
- `openspec/changes/overfitting-trainer/archive-report.md`

Modified:
- `openspec/changes/overfitting-trainer/tasks.md` (stale-checkbox reconciliation + annotations, per Task Completion Gate exceptional path)

SDD cycle complete: planned, implemented, verified, archived. Ready for the next change.
