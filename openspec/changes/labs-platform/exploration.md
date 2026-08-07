# Exploration: labs-platform

Date: 2026-08-07 · Agent: sdd-explore (verification pass) · Store: hybrid (OpenSpec + Engram)

## Current State

The InVitro-Code platform ships **48 lessons across 5 modules** (`ia`=4, `python`=17, `estadistica`=10, `machine-learning`=10, `etica`=7), each lesson directory holding `lesson.md` + 4 companion files: `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb` — **192 dead files total** (verified: 48 × 4). The only consumer pipeline is the lesson page (`src/app/learn/[module]/[slug]/page.tsx`), which reads **only `lesson.md`** via `fs.readFileSync`. The 4 companion files are referenced by NO page, route, or helper: greps for `quiz.md`/`lab.md`/`assignment.md` in `src/` return zero hits, and `notebook` only matches cosmetic terminal-simulation strings inside `code-block.tsx`.

The dashboard has two placeholder routes, both self-wrapping in `<InVitroShell>` (the `(dashboard)` group has NO `layout.tsx`):
- `src/app/(dashboard)/laboratorios/page.tsx` (185 lines) — server component loading real progress/streak/XP, renders `LabMission` (a client stepper: Concepto → Visualización → Laboratorio → Desafío) with a **hardcoded** wine-quality regression `DEFAULT_CODE`; no content-driven data.
- `src/app/(dashboard)/proyectos/page.tsx` (322 lines) — hardcoded "Desafío Bio-Data 2026" page linking to `/laboratorios`.

No sub-routes exist under `/laboratorios`. `AppSidebar` already exposes `Laboratorios → /laboratorios` and `Proyectos → /proyectos`.

The MDX pipeline is fully reusable: `compileMDX` + `remarkMath` + `remarkGfm` + `rehypeKatex` with `pre: CodeBlock` and `table: MarkdownTable` mapped in the lesson page. `MarkdownTable` (merged via `enable-gfm-tables`) styles any MDX-emitted `<table>` — rubric tables render styled for free. `PyodideRunner` (`src/components/editor/PyodideRunner.tsx`) drives the real `public/pyodide-worker.js` worker with `{type:"init"|"runPython"}` messages and is already embedded in `LabMission` and `LessonCodeEditor`.

## Verified Content Inventory (48 lessons × 4 files = 192)

| Module | Lessons | quiz.md | lab.md | assignment.md | notebook.ipynb |
|--------|---------|---------|--------|---------------|----------------|
| ia | 4 | 4 | 4 | 4 | 4 |
| python | 17 | 17 | 17 | 17 | 17 |
| estadistica | 10 | 10 | 10 | 10 | 10 |
| machine-learning | 10 | 10 | 10 | 10 | 10 |
| etica | 7 | 7 | 7 | 7 | 7 |
| **Total** | **48** | **48** | **48** | **48** | **48** |

Lesson dir names (`lessonNN_slug`) are the slugs used by `/learn/[module]/[slug]` — reusable verbatim for `/laboratorios/[module]/[lesson]` (Fact 10 ✓).

## Verified Content Structures (with caveats)

- **quiz.md** — no frontmatter. `# Quiz: <title>`, `## Multiple Choice (N questions)` (45×5, 2×4, 1×3), `## Short Answer (2 questions)` (44 files), `## Coding Question (1 question)` (27) / `## Coding Question` (17), answer key (28 as `## Answer Key`, remaining at `#` level). **Option style varies by module**: python uses `**Q1:**` + `- A)`, ia/estadistica use `**1.**` + `a)`. Parser must tolerate both.
- **lab.md** — no frontmatter. `# Lab: <title>`, Objective (`Objective` 34 / `Objetivo` 4 / `Objectives` 10), Duration (`Duration` 34 / `Duración` 4 / `Estimated time: 45 minutes` 10), `## Dataset` only in 17 files, `## Instructions`/`## Instrucciones` (38) with `### Part N` + python code blocks, Deliverables (`Deliverables` 44 / `Entregables` 4). **Caveat**: `**Preguntas para reflexionar:**` appears in only 4/48 labs and `**Check:**` in only 1/48 — NOT a reliable structural marker as previously assumed.
- **assignment.md** — no frontmatter. `# Assignment: <title>`, Objectives/Objetivos, Instructions/Instrucciones, Deliverables/Entregables, `Evaluation Rubric`/`Rúbrica` (21 files) with a **4-level markdown table** (Excellent 4 / Good 3 / Adequate 2 / Poor 1) + `**Total: 16 points**`.
- **notebook.ipynb** — nbformat 4 JSON. **Caveat vs. prior assumption**: only 6/48 notebooks have all-null `execution_count` + empty `outputs`; the other 42 contain real executed cells (266 code cells carry outputs, e.g. stdout/plots). A notebook viewer could render stored outputs or re-run via Pyodide; do not assume pristine notebooks.

## Metadata Sources (Fact 8 ✓)

- `lesson.md` frontmatter: `Lesson Title`, `Module`, `Lesson Number`, `Estimated Duration`, `Prerequisites`, `Difficulty`, `Learning Objectives`, `Keywords` — enough for lab cards (title, difficulty, duration, prereqs).
- `module.json` per module: `name`, `description`, `order` (e.g. ia order 1, python order 2).
- `src/lib/content/modules.ts` already exposes `getModules()`, `getLessons()`, `getLessonSlugs()`, `getLessonTitle()`, `getModulesInfo()`, `getModuleDisplayName()` — reuse rather than re-derive.

## Dangling References (Fact 9 ✓)

All 10 `estadistica` lesson.md frontmatters reference non-existent quiz filenames, e.g. `Quiz: statistical_distributions_quiz.md`, `Quiz: descriptive_statistics_quiz.md`, `Quiz: eda_quiz.md` — only `quiz.md` exists on disk. No other module does this. The labs platform must read `quiz.md` by convention, never the frontmatter ref.

## Available Infrastructure (Facts 6–7 ✓)

- MDX: `compileMDX`/`MDXRemote` from `next-mdx-remote/rsc` + `remarkMath` + `remarkGfm` + `rehypeKatex` — reuse the lesson page `mdxConfig` verbatim.
- `MarkdownTable` (server component, exported from `src/components/lesson/index.ts`) maps `table` — rubric tables styled automatically.
- **Caveat**: `CodeBlock` (`src/components/lesson/code-block.tsx`) is a `"use client"` terminal **simulation** (types lines, prints emulated output) — NOT interactive Pyodide. Interactive execution lives in `PyodideRunner` (already embedded in `LabMission` and `LessonCodeEditor` via dynamic import, `ssr: false`). Labs needing real execution should reuse `PyodideRunner`, not `CodeBlock`.
- Pyodide: real worker at `public/pyodide-worker.js`; `src/lib/pyodide/worker.ts` is a stub. Protocol: post `{type:"init"}` then `{type:"runPython", code}`; read `{type:"ready"|"result"}`.

## Affected Areas

- `src/app/(dashboard)/laboratorios/page.tsx` — becomes content-driven index of labs (or a hub listing modules).
- `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` — NEW route rendering quiz/lab/assignment (likely tabs or sections).
- `src/app/(dashboard)/laboratorios/[module]/page.tsx` — NEW optional module listing.
- `src/components/laboratorio/LabMission.tsx` — currently hardcoded stepper; candidate to become content-driven or be superseded.
- `src/app/(dashboard)/proyectos/page.tsx` — "Desafío Bio-Data 2026" page; links to `/laboratorios`; may gain deeper project views later.
- `src/app/learn/[module]/[slug]/page.tsx` — pattern source for MDX pipeline reuse (read-only reference).
- `src/lib/content/modules.ts` — extend with lab/quiz metadata helpers.
- `src/components/lesson/code-block.tsx`, `markdown-table.tsx`, `src/components/editor/PyodideRunner.tsx` — reused as-is.

## Approaches

1. **Content-driven labs platform (`/laboratorios` becomes a real hub)** — new `[module]/[lesson]` route reads `lab.md`/`quiz.md`/`assignment.md` via the existing MDX pipeline, with tabs (Teoría/Lab/Quiz/Tarea) or stepper; cards built from `module.json` + `lesson.md` frontmatter.
   - Pros: revives 192 authored files; consistent with existing architecture; reuses proven MDX/Pyodide infra; low new infra
   - Cons: content format variance (EN/ES headings, option styles) requires a tolerant renderer; notebooks need a viewer decision (stored outputs vs. live Pyodide)
   - Effort: Medium

2. **Course-builder/creator module** — lab/quiz authoring UI writing content files.
   - Pros: accelerates future content authoring
   - Cons: much larger scope; overlaps with content-driven rendering; not needed to ship the platform
   - Effort: High

3. **Assignment submission + grading pipeline (Supabase)** — new table for submissions, `reflection_completions`-style storage, rubric-based scoring.
   - Pros: completes the learning loop; real value for instructors
   - Cons: biggest scope; needs schema migration, RLS policies, realtime consideration; better as a follow-up change
   - Effort: High

## Recommendation

Start with Approach 1: a content-driven labs platform that renders `lab.md` (with embedded Python code blocks running through `PyodideRunner`), `quiz.md` (interactive multiple-choice/short-answer with `Answer Key` reveal), and `assignment.md` (rubric table via `MarkdownTable`) at `/laboratorios/[module]/[lesson]`, with a module/lesson index built from `src/lib/content/modules.ts`. This is the minimal change that makes the dead content live, reuses every available primitive, and leaves Approach 3 (submissions) as a clean follow-up change.

## Risks

- Content format variance (EN vs ES headings, `- A)` vs `a)` options, missing `Dataset`/`Preguntas` sections) — a strict parser will break; prefer tolerant rendering (frontmatter-less: render sections by heading pattern match, fall back gracefully).
- `notebook.ipynb` mostly contains executed outputs — do not assume clean notebooks; decide stored-output rendering vs. live execution.
- Dangling `Quiz:` frontmatter refs in all 10 estadistica lessons — never trust them; always read `quiz.md`.
- Lab pages needing interactive execution must use `PyodideRunner` (real worker), NOT `CodeBlock` (terminal simulation only).
- Existing `LabMission` stepper is hardcoded; decide supersede vs. refactor to avoid two competing lab UIs.
- Labs require network access for Pyodide CDN packages (scikit-learn, pandas, seaborn); offline they degrade.

## Ready for Proposal

Yes — the orchestrator should tell the user: exploration verified 192 dead content files (48 lessons × quiz/lab/assignment/notebook), zero current consumers, a fully reusable MDX+Pyodide pipeline, and two placeholder dashboard routes. Recommend proceeding to proposal for a content-driven labs platform (Approach 1), with assignment grading as a scoped follow-up.

## Key Learnings

1. All 48 lessons carry dead quiz/lab/assignment/notebook files consumed by no route or helper.
2. Only 6 of 48 notebooks are pristine; 42 contain executed cells with stored outputs.
3. Content headings vary by module (EN vs ES, option styles, section presence), so parsers must be tolerant.
4. The MDX pipeline, MarkdownTable, and PyodideRunner are fully reusable from the lesson page.
5. All 10 estadistica lesson frontmatters reference non-existent quiz filenames; only quiz.md exists.
