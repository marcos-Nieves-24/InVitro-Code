# Archive Report — projects-hub-colab

**Change**: projects-hub-colab
**Phase**: archive
**Date archived**: 2026-08-20
**Archive location**: `openspec/changes/archive/2026-08-20-projects-hub-colab/`
**Artifact store mode**: both (openspec files + Engram `sdd/projects-hub-colab/archive-report`)
**Archived by**: sdd-archive sub-agent (hybrid execution contract)

## Intent (from proposal)

`/proyectos` was a hardcoded Wine-Quality demo; assignments were buried in the lab "Proyecto" tab; students could not open notebooks in Colab; three redundant meta-sections (`Entregables`, `Rúbrica*`, `Tiempo estimado*`) cluttered all 48 `assignment.md`. The change made projects a real content-driven hub, added one-click Colab export, and decluttered the assignment/lab UI.

## Delivered Scope (final state)

- **NotebookActions** — shared Download + "Abrir en Colab" component (`src/components/labs/NotebookActions.tsx`); replaces and absorbs `NotebookDownloadButton`; gated on `hasNotebook`; slug-derived Colab URL; Spanish labels. Rendered in the lab page tab-bar header and the project detail route.
- **Content cleanup** — stripped `## Entregables`, `## Rúbrica*`, `## Tiempo estimado*` from all 48 `assignment.md`; `## Entrega` preserved (7 etica files); only `assignment.md` files touched (REQ-CLEAN-03).
- **Duration removal** — `Estimated Duration` badge removed from learn header; duration row + `Clock` import removed from `LabCard`; `LessonFrontmatter.duration` / `getLessonFrontmatter` no longer expose it; the frontmatter key stays inert in the 48 lesson files (REQ-DUR-03).
- **Projects hub** — content-driven `/proyectos` (mirrors `LabHub`/`LabCard`, grouped by module, auth-gated, `InVitroShell`); detail route `/proyectos/[module]/[lesson]` compiles `assignment.md` with `pre: LabCodeBlock` consoles and `NotebookActions`.
- **Lab page refactor** — `LabTabs` reduced to 2 tabs (`Laboratorio`/`Cuestionario`); lab page no longer reads/compiles `assignment.md`.

## Verification Result

Verdict: **PASS WITH WARNINGS** (per `verify-report.md`, persisted at verification time)
- Requirements: 22/22 compliant; Scenarios: 26/26 compliant (static + grep evidence)
- CRITICAL findings: **0**; Blockers: **0**
- Executed evidence: 6 verification greps, all exit 0 (`Entregables|Rúbrica|Tiempo` → 0; `NotebookDownloadButton` → 0; duration refs → 0; `assignmentContent|assignmentRawFallback` → 0; `## Entrega` → 7 preserved; inert `Estimated Duration` keys → 48)
- Build: `npm run type-check` / `npm run build` **not run locally** — intentionally deferred (RAM constraint); Vercel `npm run build` gates deploy (task 6.2)
- SUGGESTION (informational): code comments in `AssignmentViewer.tsx` reference `REQ-ASGN-04`. Note: `REQ-ASGN-04` (Compile Failure Fallback) **exists in the main spec** `openspec/specs/assignment-viewer/spec.md` and is preserved by this archive's merge; the verify-time claim "no REQ-ASGN-04 exists in any spec" applied to the delta spec, which only covers REQ-ASGN-01/03. No action required; comments are valid against the source of truth.

## Tasks Status at Close

Persisted tasks artifact (`tasks.md`): 16 tasks, **15 checked**, **1 unchecked**:

| Task | State | Source | Rationale |
|---|---|---|---|
| 1.1–5.3, 6.1 (implementation + static greps) | ✅ complete | tasks.md `[x]` | apply-progress confirms each work unit |
| 6.2 `npm run type-check` / Vercel `npm run build` | ✅ checked in tasks.md; local run deferred | tasks.md `[x]`; apply-progress notes local skip | Task text encodes the gate: Vercel `npm run build` gates deploy; local type-check skipped per orchestrator RAM constraint |
| 6.3 Post-deploy Playwright QA | ⬜ **open (deferred)** | tasks.md `[ ]` | Requires deployed app after PRs merge and Vercel deploy; cannot run locally |

**Gate resolution**: The archived audit trail retains 6.3 **unchecked** — it is genuinely incomplete, not a stale checkbox, and is not falsified. The orchestrator explicitly directed archive with this deferred runtime gate (final-state facts in launch prompt), and the verify verdict is PASS WITH WARNINGS with 0 CRITICAL findings. This is the OpenSpec-permitted archive-after-user-confirmation path: the archive is marked **intentional-with-warnings** for the single deferred post-deploy QA gate. CRITICAL-issue block rule: not triggered (0 CRITICAL). No stale-checkbox reconciliation was performed because 6.3 is not complete.

## Delivery State

5 stacked PRs created targeting `main` (all **open**, **not yet merged**):

| PR | Commit | Scope |
|---|---|---|
| #34 | `chore(content): strip redundant sections from assignment.md` | 48 assignment.md cleanup |
| #35 | `feat(labs): add NotebookActions with Colab export` | NotebookActions + AssignmentViewer swap |
| #36 | `feat(projects): content-driven proyectos hub and detail route` | hub + detail route + ProjectCard/ProjectHub |
| #37 | `refactor(labs): drop Proyecto tab and assignment compile from lab page` | LabTabs 2 tabs |
| #38 | `refactor(labs): remove duration display` | duration removal (+ `chore(sdd)` planning artifacts on this branch) |

Currently on branch `projects-colab-5-duration` (PR #38). Merging + deploy remain with the orchestrator/user.

## Risks / Deferred Gates

- **Build gate (6.2)**: `npm run build` runs on Vercel as the deploy gate; PRs merge before the app builds — build failure would block deploy, not archive.
- **Post-deploy Playwright QA (6.3)**: still open; runs after PRs merge and Vercel deploys. Validates: hub lists modules, detail consoles+actions, 2 tabs, no duration UI.
- **Colab URL depends on the repo staying public** (accepted design tradeoff; URL slug-derived, not hardcoded per lesson).
- **Pyodide `pre: LabCodeBlock` in project detail requires network at runtime** (same constraint as labs).

## Rollback

`git revert` of the 5 PR branches. No DB/schema changes; no migration rollback needed. Content-only `assignment.md` edits revert cleanly.

## Spec Sync (delta → main specs)

| Domain | Action | Details |
|---|---|---|
| `assignment-viewer` | **Merged** (existing main spec) | MODIFIED REQ-ASGN-01 (adds `pre: LabCodeBlock`), MODIFIED REQ-ASGN-03 (Notebook Actions replaces Notebook Download), REMOVED REQ-ASGN-02 (Reason + Migration documented in delta); REQ-ASGN-04 preserved |
| `lab-hub` | **Merged** (existing main spec) | MODIFIED REQ-HUB-03 (card MUST NOT show Estimated Duration); other requirements preserved |
| `lab-page` | **Merged** (existing main spec) | MODIFIED REQ-LABPAGE-03 (MUST NOT read `assignment.md`), MODIFIED REQ-LABPAGE-04 (2 panels), ADDED REQ-LABPAGE-06 (Notebook Actions); other requirements preserved |
| `assignment-content-cleanup` | **Created** (new full spec) | Mechanical copy to `openspec/specs/assignment-content-cleanup/spec.md`, `diff -r` empty |
| `duration-removal` | **Created** (new full spec) | Mechanical copy to `openspec/specs/duration-removal/spec.md`, `diff -r` empty |
| `notebook-actions` | **Created** (new full spec) | Mechanical copy to `openspec/specs/notebook-actions/spec.md`, `diff -r` empty |
| `projects-hub` | **Created** (new full spec) | Mechanical copy to `openspec/specs/projects-hub/spec.md`, `diff -r` empty |

Merge notes:
- `(Previously: ...)` change-narrative parentheticals in MODIFIED deltas were stripped when merging into main specs (steady-state truth only); the full delta narrative is preserved in the archived change folder.
- Main-spec `Purpose` sections were updated for coherence where they described pre-change behavior (duration, 3 tabs, Proyecto-tab-only viewer). No requirement outside the deltas was altered.
- **Destructive-merge warning (config.yaml `rules.archive`)**: the only removal is REQ-ASGN-02 (single requirement, with `(Reason:)` + `(Migration:)` in the delta). This is a small documented removal, not a large-section deletion; no confirmation needed beyond this record.

## Archive Mechanical Verification

- Change folder moved with `git mv` (byte-identical): `diff -r` snapshot-vs-archived output **empty** — no truncation/alteration.
- 4 new main specs copied with `cp` + `diff -r` readback: all **empty** diffs.
- Archive report is additive-only and excluded from the source/destination comparison.

## Engram Persistence

Topic key: `sdd/projects-hub-colab/archive-report` (type `architecture`, `capture_prompt: false`, project `invitro-code`).

Source artifacts read from filesystem (hybrid mode): `proposal.md`, `design.md`, `tasks.md`, `apply-progress.md`, `verify-report.md`, 7 delta specs under `specs/`, existing main specs `openspec/specs/{assignment-viewer,lab-hub,lab-page}/spec.md`, `openspec/config.yaml`.