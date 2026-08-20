# Design: Projects Hub + Colab Export

## Technical Approach

Three independent tracks: (1) shared `NotebookActions` (Download + Colab) replacing `NotebookDownloadButton`; (2) a content-driven `/proyectos` hub + `/proyectos/[module]/[lesson]` detail route that reuses the existing lab MDX pipeline (`LabCodeBlock` → PyodideRunner); (3) content/duration cleanup via a one-off bulk edit and small UI/frontmatter edits. No DB changes.

## Architecture Decisions

| Decision | Option A | Option B | Choice | Rationale |
|---|---|---|---|---|
| Notebook actions | Absorb `NotebookDownloadButton` into `NotebookActions` | Add Colab `<a>` beside existing button | **A** | One component = one place for fetch+blob logic + Colab URL; single import for lab & project. |
| Project cards | Mirror `LabCard`/`LabHub` in `src/components/projects/` | Reuse `LabCard` with `basePath` prop | **A** | Lab card href/completion are lab-specific; mirroring follows the existing per-feature colocation (`labs/`). |
| Completion state on project cards | Show progress | Omit | **Omit** | No source for "project complete" (submission out of scope); spec says completion MAY be shown. |
| Content cleanup | Per-heading block strip | Truncate file at first stripped heading | **A** | `## Entrega` appears *after* `## Tiempo estimado` in etica lessons; truncation would delete it. |
| NotebookActions in lab page | Mount in `LabTabs` tab-bar header (right-aligned) | Bottom of `LabRunner` panel | **A** | Visible regardless of active tab; keeps server page simple. |

## Data Flow

```
/proyectos (server)          /proyectos/[module]/[lesson] (server)
getModules() ──▶ ProjectHub ──▶ ProjectCard grid            auth → notFound? → read assignment.md
getLessonSlugs() → ProjectModuleGroup[]                      compileMDX(mdxConfig) → AssignmentViewer
getLessonFrontmatter()                                         ├─ LabCodeBlock → PyodideRunner (3 consoles)
                                                                └─ NotebookActions (gated hasNotebook)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/labs/NotebookActions.tsx` | Create | Client comp: Download (fetch `/api/notebook/{mod}/{lesson}` + blob) + `<a target="_blank" rel="noopener noreferrer">` Colab link. Returns `null` when `!hasNotebook`. |
| `src/components/labs/NotebookDownloadButton.tsx` | Delete | Absorbed into `NotebookActions`. |
| `src/components/labs/AssignmentViewer.tsx` | Modify | Swap `NotebookDownloadButton` → `NotebookActions`; add `pre: LabCodeBlock` to its compile map (it already compiles with lesson pipeline). |
| `src/components/labs/LabTabs.tsx` | Modify | Drop `Proyecto` tab + `assignmentContent`/`assignmentRawFallback` props; `TabId = "lab" \| "quiz"`; render `NotebookActions` in tab-bar header. |
| `src/components/labs/index.ts` | Modify | Replace `NotebookDownloadButton` export with `NotebookActions`. |
| `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` | Modify | Remove `assignment.md` read/compile; pass nothing assignment-related to `LabTabs`. |
| `src/components/projects/ProjectCard.tsx` | Create | Mirror `LabCard`: links `/proyectos/{module}/{lesson}`, shows title + difficulty + prereqs, no duration, no completion. |
| `src/components/projects/ProjectHub.tsx` | Create | Mirror `LabHub`: collapsible module groups, no completion counter; empty state "No hay proyectos disponibles". |
| `src/app/(dashboard)/proyectos/page.tsx` | Rewrite | Server comp: auth gate, build `ProjectModuleGroup[]` from `getModules`/`getLessonSlugs`/`getLessonFrontmatter`, render `ProjectHub`. |
| `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx` | Create | Server comp: auth gate, `fs.existsSync(lessonDir) → notFound()`, compile `assignment.md` with lab `mdxConfig`, render `InVitroShell` + title (`getLessonTitle`) + back link + `AssignmentViewer`. |
| `src/components/labs/LabCard.tsx` | Modify | Delete `{lesson.duration && …}` row + unused `Clock` import. |
| `src/app/learn/[module]/[slug]/page.tsx` | Modify | Delete `Estimated Duration` Badge block in `renderHeader`. |
| `src/lib/content/modules.ts` | Modify | Remove `duration?` from `LessonFrontmatter`; remove `duration:` from `getLessonFrontmatter` return. |
| `src/content/modules/**/assignment.md` (48) | Modify | Strip the three section groups (below). |

## Interfaces / Contracts

```ts
// NotebookActions.tsx
interface NotebookActionsProps { mod: string; lesson: string; hasNotebook: boolean }
const COLAB_BASE = "https://colab.research.google.com/github/marcos-Nieves-24/InVitro-Code/blob/main";
// href = `${COLAB_BASE}/src/content/modules/${mod}/lessons/${lesson}/notebook.ipynb`

// ProjectHub.tsx
export interface ProjectModuleGroup {
  slug: string; name: string; order: number;
  lessons: { slug: string; frontmatter: LessonFrontmatter | null }[];
}

// LabTabs.tsx (new shape)
interface LabTabsProps { module: string; lesson: string; labContent: ReactNode;
  labRawFallback: string | null; quizRaw: string | null; hasNotebook: boolean }
```

## Content Cleanup Algorithm

Run once over all 48 `assignment.md`. Per line: if a line matches heading `^##\s+` and its **normalized** body (lowercase, NFD strip accents) starts with `entregables`, `rubrica`, or `tiempo estimado`, drop that line and every following line up to (not including) the next `^#{1,3}\s+` heading; then resume. This removes `Entregables`, `Rúbrica` / `Rúbrica de evaluación` / `Rúbrica de Evaluación`, and `Tiempo estimado` / `Tiempo Estimado` / `Tiempo estimado: N horas`, while preserving `## Entrega` (normalizes to `entrega`, not a prefix match) and all content before the first stripped heading. Every core section (`Objetivos`, `Instrucciones`, `Dataset`, `Escenario`, `Código/Datos iniciales`) precedes `Entregables`, so no core content is lost. Apply must review the git diff per REQ-CLEAN-03 (only `assignment.md` changes).

## Duration Removal (exact)

Only three source consumers exist (verified by grep): `LabCard.tsx` (lines 94–99 + `Clock` import), `learn/[module]/[slug]/page.tsx` (`renderHeader` Estimated Duration Badge, lines 109–111), `modules.ts` (`LessonFrontmatter.duration` + `getLessonFrontmatter` return). `Estimated Duration` key stays inert in `lesson.md` files (REQ-DUR-03).

## Testing Strategy

No test runner (`strict_tdd: false`). Verification = `npm run type-check` + `npm run build` (Vercel). Manual: grep confirms zero `Entregables|Rúbrica|Tiempo estimado` headings remain in `assignment.md`; `/proyectos` lists modules; detail route renders runnable consoles; Colab/Download appear only when `notebook.ipynb` exists.

## Threat Matrix

No routing/shell/subprocess/VCS/PR/executable-classification boundary. All five rows N/A. Note: the new detail route reads filesystem paths from URL params exactly as the existing lab page does (`fs.existsSync → notFound()`); the `/api/notebook` route already carries path-traversal protection (REQ-NBAPI-05). No new boundary introduced.

## Migration / Rollout

No DB migration. Additive routes + one-time content edits. Rollback via `git revert` per track (single-feature commits); content edits revert cleanly.

## Open Questions

- [ ] None blocking. Minor: keep `NotebookDownloadButton` as a re-export alias for backward compat, or delete outright (design assumes delete + barrel update).
