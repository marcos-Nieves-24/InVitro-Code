# Tasks: Projects Hub + Colab Export

## Review Workload Forecast

Budget 800 (session); total ~2000 → chained PRs; each unit < 800.

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

> Placeholder: strategy not chosen; units independent — `stacked-to-main` fits. Confirm before apply.

| Unit | PR | Est | Test cmd | Runtime | Rollback |
|---|---|---|---|---|---|
| 1 Content strip (48 assignment.md) | PR 1 | ~−1000 | grep headings → 0 | N/A content-only | Revert content commit |
| 2 NotebookActions | PR 2 | ~+190 | type-check; grep old button → 0 | Playwright: lab actions | Revert notebook commit |
| 3 Projects hub + detail | PR 3 | ~+700 | type-check | Playwright: hub+detail | Revert projects commit |
| 4 LabTabs 2-tab refactor | PR 4 | ~−80 | grep `assignmentContent` → 0 | Playwright: 2 tabs | Revert LabTabs commit |
| 5 Duration removal | PR 5 | ~−25 | grep duration refs → 0 | Playwright: no duration UI | Revert duration commit |

Commits (conventional, no AI attribution): `chore(content): strip redundant sections from assignment.md` · `feat(labs): add NotebookActions with Colab export` · `feat(projects): content-driven proyectos hub and detail route` · `refactor(labs): drop Proyecto tab and assignment compile from lab page` · `refactor(labs): remove duration display`. Threat matrix all-N/A → no RED tests.

## Phase 1: Content Cleanup
- [x] 1.1 Scripted per-heading strip over all 48 `assignment.md`: drop `^##\s+` heading+body when normalized body starts `entregables|rubrica|tiempo estimado`; keep `## Entrega`. Accept: REQ-CLEAN-01/02/03 (diff = assignment.md only).

## Phase 2: Notebook Actions
- [x] 2.1 Create `src/components/labs/NotebookActions.tsx`: Download = `GET /api/notebook/{mod}/{lesson}` + blob; Colab `<a>` slug-derived from `COLAB_BASE`; `null` when `!hasNotebook`; Spanish labels. Accept: REQ-NB-01..04.
- [x] 2.2 Delete `NotebookDownloadButton.tsx`; export `NotebookActions` from `src/components/labs/index.ts`.
- [x] 2.3 `AssignmentViewer.tsx`: swap `NotebookDownloadButton` → `NotebookActions`. Accept: REQ-ASGN-03.

## Phase 3: Projects Hub + Detail
- [x] 3.1 Create `src/components/projects/ProjectCard.tsx` (mirror LabCard; href `/proyectos/{module}/{lesson}`; no duration/completion). Accept: REQ-PROJ-03.
- [x] 3.2 Create `src/components/projects/ProjectHub.tsx` (mirror LabHub: collapsible groups; empty state). Accept: REQ-PROJ-02.
- [x] 3.3 Rewrite `src/app/(dashboard)/proyectos/page.tsx`: auth gate, `ProjectModuleGroup[]`, `InVitroShell`+`ProjectHub`; drop Wine demo. Accept: REQ-PROJ-01/06.
- [x] 3.4 Create `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx`: auth gate, `notFound()` when dir missing, compile `assignment.md` with `pre: LabCodeBlock`, `InVitroShell`+title+back link+`AssignmentViewer`. Accept: REQ-PROJ-04/05, REQ-ASGN-01.

## Phase 4: Lab Page Refactor
- [x] 4.1 `LabTabs.tsx`: remove `Proyecto` tab + assignment props; `TabId="lab"|"quiz"`; `NotebookActions` in tab-bar header. Accept: REQ-LABPAGE-04/06.
- [x] 4.2 Lab page: remove assignment.md read/compile; pass no assignment props. Accept: REQ-LABPAGE-03.

## Phase 5: Duration Removal
- [x] 5.1 `modules.ts`: drop `duration?` from `LessonFrontmatter` + `getLessonFrontmatter` return. Accept: REQ-DUR-02.
- [x] 5.2 `LabCard.tsx`: delete duration row + `Clock` import. Accept: REQ-HUB-03.
- [x] 5.3 Learn page: delete `Estimated Duration` badge in `renderHeader`. Accept: REQ-DUR-01/03 (key stays inert).

## Phase 6: Verification / QA
- [x] 6.1 Greps: 0 stripped headings; 0 `NotebookDownloadButton`; 0 duration refs.
- [x] 6.2 `npm run type-check` (Node ≥20.9); Vercel `npm run build` gates deploy.
- [ ] 6.3 Post-deploy Playwright: hub lists modules; detail consoles+actions; 2 tabs; no duration UI.