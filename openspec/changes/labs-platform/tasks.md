# Tasks: Labs Platform

> `design.md` missing — tasks from proposal + 6 specs; reconcile at apply. Build → Vercel (annotate only). Verify: type-check + browser smoke.

## Review Workload Forecast

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

~900–1000 changed lines → 3 chained PRs: Quiz → Lab/Assignment/Notebook → Hub.

### Suggested Work Units

| Unit | Goal | PR | Focused test | Runtime harness | Rollback boundary |
|------|------|----|--------------|-----------------|-------------------|
| 1 | Quiz parser + runner | PR1 | type-check + node strip-types smoke on 2 quiz.md | N/A — no route until PR2 | Revert PR1: `quiz-parser.ts`, `QuizRunner.tsx` only |
| 2 | Tabs, notebook API + button, page | PR2 | type-check | Browser lesson page: run python, switch tabs, download | Revert PR2: route, page, 4 lab components; PR1 intact |
| 3 | Hub, cards, LabMission removal | PR3 | type-check | Browser /laboratorios: groups, cards, click-through | Revert PR3: placeholder page restored |

## PR 1 — Quiz capability

### Parser
- [x] 1.1 `src/lib/labs/quiz-parser.ts`: `QuizQuestion` type + `parseQuiz(raw)` → `{questions, parseMode:'structured'|'raw-fallback'}`; never throws (REQ-QUIZ-01).
- [x] 1.2 EN/ES headings at any `#`: Multiple Choice/Opción múltiple, Short Answer/Respuesta corta, Coding Question/Pregunta de código, Answer Key/Clave de respuestas (REQ-QUIZ-02).
- [x] 1.3 Options `- A)`/`A)`/`a)`/`- a)`; prefixes `**Q1:**`/`**1.**`; key letters → `correctAnswer` (REQ-QUIZ-03).
- [x] 1.4 Tolerate missing sections; unknown structure → `raw-fallback`, empty questions (REQ-QUIZ-04/05).

### Runner
- [x] 1.5 `src/components/labs/QuizRunner.tsx` (client, `{source}`): radios, text inputs, coding prompts.
- [x] 1.6 Submit marks correct/incorrect vs `correctAnswer`; Spanish chrome; no server writes (REQ-QUIZ-06).
- [x] 1.7 Answer Key toggle showing answer + explanation (REQ-QUIZ-07).
- [x] 1.8 Fallback renders raw markdown + "no disponible"; no crash (REQ-QUIZ-05).
- [x] 1.9 Verify: type-check + parser smoke on `python/lesson01_installing_python` + `ia/lesson01_what_is_ai`.

## PR 2 — Lab + Assignment + Notebook

### Helpers + API
- [x] 2.1 `src/lib/content/modules.ts`: add `hasLab/hasQuiz/hasNotebook(module, lesson)` (D8/D12).
- [x] 2.2 `src/app/api/notebook/[module]/[lesson]/route.ts`: auth → 401; traversal-safe resolve → 404 (REQ-NBAPI-01/05).
- [x] 2.3 200 ipynb content-type + attachment + raw stored bytes; 404 missing (REQ-NBAPI-02/03/04).

### Tabs
- [x] 2.4 `src/components/labs/LabRunner.tsx` (client): MDXRemote lab.md (remarkMath+remarkGfm+rehypeKatex, `table: MarkdownTable`); `pre` → python fences become dynamic PyodideRunner (ssr:false, defaultValue=body, protocol unchanged), bash static, no worker (REQ-LABRUN-01/02/03/04/06).
- [x] 2.5 Lab compile failure → raw + notice, page usable (REQ-LABRUN-05).
- [x] 2.6 `src/components/labs/AssignmentViewer.tsx`: MDXRemote assignment.md, MarkdownTable rubric, fallback (REQ-ASGN-01/02/04).
- [x] 2.7 `src/components/labs/NotebookDownloadButton.tsx` (client): fetch, save blob; hidden when absent (REQ-ASGN-03).

### Page
- [x] 2.8 `src/components/labs/LabTabs.tsx` (client): Laboratorio|Cuestionario|Proyecto, switch without reload, persist tab (REQ-LABPAGE-04).
- [x] 2.9 `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` (server): auth redirect, notFound(), convention reads (never `Quiz:` frontmatter), precompile MDX, InVitroShell (REQ-LABPAGE-01/02/03/05).
- [x] 2.10 Verify: type-check + browser smoke (real python run, tabs, rubric, download, fallback).

## PR 3 — Hub + navigation

- [x] 3.1 `src/components/labs/LabCard.tsx`: frontmatter title/difficulty/duration/prereqs (slug fallback), completed state, lesson link (REQ-HUB-03/05).
- [x] 3.2 `src/components/labs/LabHub.tsx`: modules by `order`, lessons by dir name, collapsible; completion via `createAdminClient()` on `progress` (REQ-HUB-02/04).
- [x] 3.3 Rewrite `src/app/(dashboard)/laboratorios/page.tsx`: keep auth/shell/topbar + XP/streak chrome; main content → LabHub (REQ-HUB-01/06).
- [x] 3.4 Delete `src/components/laboratorio/LabMission.tsx` + import; grep stragglers (REQ-HUB-06).
- [x] 3.5 Nav polish: labs links point to new routes; `/proyectos` untouched (D7).
- [x] 3.6 Verify: type-check + hub smoke + `/proyectos` regression check.
