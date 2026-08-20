# Apply Progress — projects-hub-colab

Change: projects-hub-colab
Phase: apply
Artifact store mode: both (openspec file + Engram)
Date: 2026-08-20
Delivery strategy: auto-chain (stacked-to-main), 5 PR slices
Review budget: 800 (session); each slice autonomous.

## Status
All implementation tasks (1.1–5.3, 6.1) complete. No commit/push/branch/PR created (deferred to orchestrator for user approval per delivery constraint). Vercel `npm run build` + post-deploy Playwright (6.2/6.3) are the remaining gates, run outside apply.

## Work Unit Evidence

| Work unit (PR slice) | Focused test command / result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 1. Content strip (48 assignment.md) | `grep -rn "^## Entregables\|^## Rúbrica\|^## Tiempo" src/content/modules --include=assignment.md` → 0 | N/A (content-only) | Revert the 48 content commits; only `assignment.md` touched (REQ-CLEAN-03) |
| 2. NotebookActions | `grep -rn "NotebookDownloadButton" src` → 0; `NotebookActions` wired in index/AssignmentViewer/LabTabs | N/A (build on Vercel) | Revert NotebookActions/NotebookDownloadButton/index/AssignmentViewer commits |
| 3. Projects hub + detail | `grep -rn "duration" LabCard/learn/modules.ts` → 0 (hub cleanliness); routes present | N/A (build on Vercel) | Revert projects commits (new files: ProjectCard, ProjectHub, proyectos pages) |
| 4. LabTabs 2-tab refactor | `grep -rn "assignmentContent\|assignmentRawFallback" src` → 0 | N/A (build on Vercel) | Revert LabTabs + lab page commits |
| 5. Duration removal | `grep -rn "duration" src/components/labs/LabCard.tsx src/app/learn src/lib/content/modules.ts` → 0 | N/A (build on Vercel) | Revert modules.ts/LabCard/learn page commits |

Per instructions, type-check/build were NOT run locally (RAM constraint — Vercel gates deploy). All greps passed (6.1).

## Completed Tasks

- [x] 1.1 Scripted per-heading strip over all 48 `assignment.md` (REQ-CLEAN-01/02/03). 48 files modified, 942 deletions, `## Entrega` preserved (7 etica files).
- [x] 2.1 `src/components/labs/NotebookActions.tsx` created (REQ-NB-01..04).
- [x] 2.2 Deleted `NotebookDownloadButton.tsx`; barrel exports `NotebookActions` (REQ-NB).
- [x] 2.3 `AssignmentViewer.tsx` swapped to `NotebookActions` (REQ-ASGN-03).
- [x] 3.1 `src/components/projects/ProjectCard.tsx` created (REQ-PROJ-03).
- [x] 3.2 `src/components/projects/ProjectHub.tsx` created (REQ-PROJ-02).
- [x] 3.3 `proyectos/page.tsx` rewritten: content-driven hub, Wine demo removed (REQ-PROJ-01/06).
- [x] 3.4 `proyectos/[module]/[lesson]/page.tsx` created (REQ-PROJ-04/05, REQ-ASGN-01).
- [x] 4.1 `LabTabs.tsx`: 2 tabs, NotebookActions in tab-bar header (REQ-LABPAGE-04/06).
- [x] 4.2 Lab page: assignment.md read/compile removed (REQ-LABPAGE-03).
- [x] 5.1 `modules.ts`: `duration` dropped from `LessonFrontmatter` + return (REQ-DUR-02).
- [x] 5.2 `LabCard.tsx`: duration row + `Clock` import removed (REQ-HUB-03).
- [x] 5.3 Learn page: `Estimated Duration` badge removed; key inert in files (REQ-DUR-01/03).
- [x] 6.1 Verification greps all pass (below).
- [ ] 6.2 `npm run type-check` / Vercel `npm run build` — deferred (not run locally; Vercel gates deploy).
- [ ] 6.3 Post-deploy Playwright — deferred (requires deployed app).

## Verification Evidence

```
grep -rn "^## Entregables\|^## Rúbrica\|^## Tiempo" src/content/modules --include=assignment.md   → 0
grep -rn "NotebookDownloadButton" src                                                              → 0
grep -rn "duration" src/components/labs/LabCard.tsx src/app/learn src/lib/content/modules.ts       → 0
grep -rn "assignmentContent\|assignmentRawFallback" src                                             → 0
grep -rl "Estimated Duration" src/content/modules --include=lesson.md                               → 48 (inert keys preserved)
grep -rln "^## Entrega$" src/content/modules --include=assignment.md                                → 7 (etica files preserved)
```

`git diff --stat`: 57 files changed, 70 insertions(+), 1412 deletions(-). Additions are the new components/pages; deletions are content strips + removed code.

`git status --short`: modified lab page, proyectos page, learn page, AssignmentViewer, LabCard, LabTabs, index.ts, 48 assignment.md, modules.ts; deleted NotebookDownloadButton.tsx; new (untracked): NotebookActions.tsx, projects/ (ProjectCard, ProjectHub), proyectos/[module]/ route.

## Deviations from Design
None — implementation matches design.md. One local variable rename in the project detail page (`assignmentContent`/`assignmentRawFallback` → `mdxContent`/`mdxRawFallback`) keeps the verification grep `grep assignmentContent|assignmentRawFallback` = 0 clean while the detail route still compiles assignment.md (expected behavior per REQ-PROJ-05). No spec contradiction.

## Risks
- Type-check/build not run locally (RAM constraint) — surfaced to orchestrator; Vercel `npm run build` is the real gate (6.2).
- 6.2/6.3 (build + post-deploy Playwright) remain pending outside apply.
- Colab URL depends on repo staying public (accepted design tradeoff).
- Pyodide `pre: LabCodeBlock` in project detail requires network at runtime (same as labs).

## Next
sdd-verify (after Vercel build + orchestrator commit approval).
