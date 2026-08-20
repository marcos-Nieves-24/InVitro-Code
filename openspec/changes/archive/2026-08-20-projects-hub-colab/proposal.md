# Proposal: Projects Hub + Colab Export

## Intent

`/proyectos` is a hardcoded Wine-Quality demo with no real data, and assignments are buried in the lab "Proyecto" tab. Students cannot open notebooks in Colab, and three redundant meta-sections (`Entregables`, `Rúbrica*`, `Tiempo estimado*`) clutter all 48 `assignment.md` files. This change makes projects a real content-driven hub, adds one-click Colab export, and declutters assignment/lab UI.

## Scope

### In Scope
1. **Colab export** — shared `NotebookActions` (Download + "Abrir en Colab") linking to the GitHub raw notebook URL. Shown in labs (when `notebook.ipynb` exists) and project detail.
2. **Content cleanup** — strip `## Entregables`, `## Rúbrica*`, `## Tiempo estimado*` from all 48 `assignment.md` (keep `## Entrega`).
3. **Duration removal** — drop "tiempo estimado" from learn-page header badge, `LabCard` row, and `LessonFrontmatter.duration`/`getLessonFrontmatter` (leave frontmatter key inert in files).
4. **Projects hub** — content-driven `/proyectos` (mirror `LabHub`/`LabCard`, grouped by module) + detail route `/proyectos/[module]/[lesson]` rendering `assignment.md` with `pre: LabCodeBlock` (interactive consoles). Remove "Proyecto" tab from `LabTabs`; stop compiling `assignment.md` in the lab page.

### Out of Scope
- Assignment submission/grading (already deferred).
- Colab auth handoff beyond the public-repo URL (no OAuth, no token storage).
- Removing the `Estimated Duration` frontmatter key from lesson files.
- Live notebook rendering.

## Current-State Analysis

- `src/app/(dashboard)/proyectos/page.tsx` = hardcoded Wine challenge + `EmptyState`; no content reads.
- `LabTabs` renders 3 tabs; assignment compiled twice in lab page (`pre: LabCodeBlock`), notebook download only inside `AssignmentViewer`.
- `NotebookDownloadButton` exists but no Colab action.
- Duration surfaced in `LabCard`, learn header, and `getLessonFrontmatter`.

## Approach

1. New `NotebookActions` component (Download + Colab `<a>` to `https://colab.research.google.com/github/marcos-Nieves-24/InVitro-Code/blob/main/src/content/modules/{module}/lessons/{lesson}/notebook.ipynb`). Render in lab page (already computes `hasNotebook`) and project detail.
2. Script/bulk-edit 48 `assignment.md` to remove the three section groups.
3. Remove duration from `LessonFrontmatter` + `getLessonFrontmatter`, `LabCard`, learn header badge.
4. New `projects-hub` (page + `ProjectCard`) mirroring `LabHub`; new `/proyectos/[module]/[lesson]` server page compiling `assignment.md` with `pre: LabCodeBlock` + `NotebookActions`. Remove `Proyecto` tab from `LabTabs`; lab page stops reading `assignment.md`.

## Tradeoffs

- **Public Colab URL** vs OAuth flow: chosen for zero-config; relies on repo staying public.
- **Shared `NotebookActions`** vs separate buttons: one component keeps Download+Colab consistent.
- **Strip sections in files** vs filter at render: file edits are one-time, simpler than render-time filtering.

## Capabilities

### New Capabilities
- `projects-hub`: content-driven projects hub + project detail route rendering `assignment.md` with interactive consoles and notebook actions.

### Modified Capabilities
- `lab-hub`: card metadata drops `Estimated Duration` row (REQ-HUB-03).
- `lab-page`: two tabs (Laboratorio/Cuestionario), no `Proyecto`, no `assignment.md` compile, notebook actions shown.
- `assignment-viewer`: `NotebookDownloadButton` → `NotebookActions` (Download + Colab); reused by project detail with `LabCodeBlock` consoles.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/labs/NotebookActions.tsx` | New | Shared Download + Colab actions |
| `src/components/labs/NotebookDownloadButton.tsx` | Modified | Reuse/refactor into NotebookActions |
| `src/components/labs/AssignmentViewer.tsx` | Modified | NotebookActions; reused in projects |
| `src/app/(dashboard)/proyectos/page.tsx` | Rewritten | Content-driven hub |
| `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx` | New | Project detail route |
| `src/components/labs/LabTabs.tsx` | Modified | Remove Proyecto tab |
| `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` | Modified | Stop assignment compile; add NotebookActions |
| `src/components/labs/LabCard.tsx` | Modified | Drop duration row |
| `src/app/learn/[module]/[slug]/page.tsx` | Modified | Drop duration badge |
| `src/lib/content/modules.ts` | Modified | Drop `duration` from frontmatter |
| `src/content/modules/**/assignment.md` (48) | Modified | Strip 3 section groups |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Colab URL breaks if repo/notebook paths change | Low | URL derives from module/lesson slugs, not hardcoded |
| Section-strip removes wanted content | Med | Targeted regex on exact headings; review diff before merge |
| Notebook absent in some lessons → Colab link dead | Med | Gate `NotebookActions` on `hasNotebook` |
| `pre: LabCodeBlock` heavy in projects (Pyodide) | Low | Lazy load + `ssr:false`, same as labs |

## Rollback Plan

- Revert the change via `git revert` (single-feature commits). Content-only `assignment.md` edits revert cleanly.
- Restore `Proyecto` tab and hardcoded page by reverting `LabTabs`/lab page and `/proyectos` commits.
- No DB/schema changes; no migration rollback needed.

## Dependencies

- Repo `marcos-Nieves-24/InVitro-Code` stays public; notebooks git-tracked (already true).

## Success Criteria

- [ ] `/proyectos` lists all modules with lesson project cards; detail route renders assignment with runnable consoles.
- [ ] Labs and projects show "Abrir en Colab" + Download when notebook exists.
- [ ] No `Entregables`/`Rúbrica`/`Tiempo estimado` sections remain in any `assignment.md`.
- [ ] No "tiempo estimado" appears in LabCard, learn header, or `LessonFrontmatter`.
- [ ] LabTabs shows only Laboratorio/Cuestionario; `npm run build` passes on Vercel.
