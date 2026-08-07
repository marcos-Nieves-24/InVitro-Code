# Proposal: Labs Platform

## Intent

192 dead content files (48 lessons × quiz/lab/assignment/notebook) sit unread. `/laboratorios` is a hardcoded placeholder with one wine-quality regression stepper. `/proyectos` is a static page. Transform `/laboratorios` into the interactive practice center.

## Scope

### In Scope
- `/laboratorios` hub: module-grouped collapsible lesson cards
- `/laboratorios/[module]/[lesson]` page with 3 tabs: Lab (MDX + PyodideRunner), Cuestionario (interactive quiz), Proyecto (rubric + notebook download)
- Tolerant quiz parser (EN/ES headings, `- A)` / `a)` option styles, missing sections; fallback → raw markdown)
- `GET /api/notebook/[module]/[lesson]` → .ipynb download (preserved stored outputs)

### Out of Scope
- `/proyectos` redesign, assignment grading, Supabase quiz storage, PyodideProvider, live notebook viewer, quiz_attempts table

## Capabilities

### New Capabilities
- `labs-platform`: Module hub + tabbed `/laboratorios/[module]/[lesson]` route reusing existing MDX+Pyodide pipeline
- `quiz-renderer`: Parse quiz.md → interactive multiple-choice/short-answer with client-side validation + Answer Key reveal
- `notebook-api`: Serve notebook.ipynb as file download via API route

### Modified Capabilities
- `markdown-table-rendering`: Extend `table → MarkdownTable` consumer scope to lab.md and assignment.md rendering (was explicitly excluded); no component changes

## Approach

Tabs (Lab/Cuestionario/Proyecto) — independent activities, not carousel. Lab: `compileMDX` with existing pipeline (`remarkMath+remarkGfm+rehypeKatex`), `pre` mapped to PyodideWrapper embedding `PyodideRunner` per code block. Quiz: tolerant parser reads quiz.md sections → radio/text inputs + Answer Key reveal; client-side only. Proyecto: compileMDX renders assignment.md with rubric auto-styled via MarkdownTable; notebook download button hits API route. Supersede `LabMission` (hardcoded stepper → removed). Extend `modules.ts` with path-check helpers (`hasNotebook/hasQuiz/hasLab`).

## Decisions

| D# | Decision | Why |
|----|----------|-----|
| D1 | Tabs, not carousel | Activities independent; free navigation |
| D2 | PyodideRunner per block | MVP; PyodideProvider phase 2 |
| D3 | Client-side quiz only | No Supabase writes MVP; quiz_attempts phase 2 |
| D4 | Existing MDX pipeline | Consistent with lesson rendering |
| D5 | Module-grouped cards | Avoid flat 48-item list |
| D6 | Notebook download only | Live viewer phase 3 |
| D7 | /proyectos untouched | Phase 2 redesign |
| D8 | lesson.md + module.json metadata | Never trust frontmatter `Quiz:` ref |
| D9 | PyodideRunner, not CodeBlock | CodeBlock = terminal sim; LabMission = hardcoded — supersede both |
| D10 | Tolerant quiz parser | EN/ES headings, mixed option styles; fail → raw MD |
| D11 | Preserved notebook outputs | 42/48 have executed cells; preserve in download |
| D12 | Always read quiz.md | estadistica has 10 dangling frontmatter refs |

## Affected Areas

| Area | Impact |
|------|--------|
| `src/app/(dashboard)/laboratorios/page.tsx` | Modified — hub replaces hardcoded LabMission |
| `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` | New — tabbed page |
| `src/app/api/notebook/[module]/[lesson]/route.ts` | New |
| `src/components/laboratorio/LabMission.tsx` | Removed |
| `src/components/labs/` | New — QuizRenderer, NotebookDownload |
| `src/lib/content/modules.ts` | Modified — path helpers |
| `src/lib/content/quiz-parser.ts` | New |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Quiz parser breaks on edge cases | Medium | Fallback: raw markdown + "no disponible" notice |
| Pyodide per-block performance | Medium | `ssr: false`, lazy; measure before phase 2 |
| MDX compile fails on content variance | Low | Tolerant frontmatter-less compile; catch+fallback |

## Rollback Plan

Revert PRs. `/laboratorios` returns to current placeholder. `/api/notebook` removed. No DB migrations → no data rollback. Affected components self-contained.

## Dependencies

None external. Reuses MDX pipeline, PyodideRunner, modules.ts.

## Success Criteria

- [ ] Hub shows collapsible module cards with lesson links for all 5 modules
- [ ] Lab/Cuestionario/Proyecto tabs render for all 48 lessons
- [ ] Interactive quiz with Answer Key reveal on every quiz.md
- [ ] Notebook download returns valid .ipynb
- [ ] `npm run type-check` + `npm run build` pass
- [ ] No /proyectos regression
