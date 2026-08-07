# Apply Progress: labs-platform

## PR 1 — Quiz capability

**Date**: 2026-08-07
**Branch**: `feat/labs-platform-01-quiz`
**Status**: All tasks complete

### Files Changed
| File | Action | Description |
|------|--------|-------------|
| `src/lib/labs/quiz-parser.ts` | Created | Pure parser: `parseQuiz(raw)` → `QuizResult`. Handles EN/ES headings, 5 option styles (`a)`, `A)`, `A.`, `- A)`, `- a)`), 3 question prefix formats (`**N.**`, `**QN:**`, `**QN.**`), separate answer key and `<details>` inline answers. Never throws — returns `raw-fallback` on failure. |
| `src/components/labs/QuizRunner.tsx` | Created | Client component with `{ raw }` prop. Renders interactive MCQ radios, short-answer/coding textareas, "Verificar respuestas" submit with score, "Ver respuestas" toggle for answer key reveal, Spanish UI chrome. Raw-fallback renders `pre` with "Formato no reconocido" notice. |
| `src/components/labs/index.ts` | Created | Barrel export of QuizRunner |

### Verification
- **Type-check**: `npx tsc --noEmit` → exit 0 (0 errors)
- **Parser smoke**: All 48 quiz files parsed: 48/48 structured, 0/48 raw-fallback
  - Validated against 7 diverse samples: `ia/lesson01`, `python/lesson03`, `estadistica/lesson01`, `etica/lesson01`, `ml/lesson01`, `python/lesson01`, `python/lesson07`
  - All produce correct question counts and types
- **Runtime harness**: N/A — no route exists until PR2 (QuizRunner requires LabTabs page integration)
- **Rollback boundary**: Revert PR1: `quiz-parser.ts`, `QuizRunner.tsx`, `index.ts` only

### Deviations from Design
- **File location**: Design specifies `src/components/laboratorio/`; implemented in `src/components/labs/` per orchestrator directive (consistent with tasks.md and `src/lib/labs/` path). This is reconciled in PR3 where the barrel under `src/components/laboratorio/` is created with the hub components.
- **Prop name**: Design says `{source: string}`; tasks say `{raw: string}`; implemented as `{raw}` to match the convention used by the orchestrator session context.

### Work Unit Evidence
| Evidence | Value |
|---|---|
| Focused test command | `node /tmp/opencode/quiz-parser-bulk.mjs` — 48/48 structured, exit 0 |
| Runtime harness | N/A — no route/page boundary until PR2 |
| Rollback boundary | `src/lib/labs/quiz-parser.ts`, `src/components/labs/QuizRunner.tsx`, `src/components/labs/index.ts` |

## PR 2 — Lab + Assignment + Notebook

**Date**: 2026-08-07
**Branch**: `feat/labs-platform-02-lab-assignment`
**Status**: All tasks complete

### Files Changed
| File | Action | Description |
|------|--------|-------------|
| `src/lib/content/modules.ts` | Modified | Added `hasLab`, `hasQuiz`, `hasNotebook` helpers (D8/D12) |
| `src/app/api/notebook/[module]/[lesson]/route.ts` | Created | GET handler: Clerk auth → 401, path traversal guard → 404, 200 ipynb download with Content-Disposition attachment (REQ-NBAPI-01–05) |
| `src/components/labs/LabCodeBlock.tsx` | Created | Client; MDX `pre` component. Python fences → dynamic PyodideRunner (ssr:false, extracts code text from children). Other languages → static `<pre>` (REQ-LABRUN-02/03/04/06) |
| `src/components/labs/LabRunner.tsx` | Created | Client; receives pre-compiled MDX ReactNode from server. Compile-failure fallback renders raw with "no disponible" notice (REQ-LABRUN-01/05) |
| `src/components/labs/AssignmentViewer.tsx` | Created | Client; receives pre-compiled MDX ReactNode + NotebookDownloadButton. Compile-failure fallback (REQ-ASGN-01/02/03/04) |
| `src/components/labs/NotebookDownloadButton.tsx` | Created | Client; fetches `/api/notebook/[module]/[lesson]`, creates blob download. Hidden when notebook absent (REQ-ASGN-03) |
| `src/components/labs/LabTabs.tsx` | Created | Client; tab container: Laboratorio/Cuestionario/Proyecto. localStorage active-tab persistence. Conditional tab visibility per content availability (REQ-LABPAGE-04) |
| `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` | Created | Server: Clerk auth → redirect, notFound(), compileMDX (lab + assignment) with remarkMath+remarkGfm+rehypeKatex + `pre: LabCodeBlock, table: MarkdownTable`. Convention-based reads. InVitroShell wrap (REQ-LABPAGE-01/02/03/05) |
| `src/components/labs/index.ts` | Modified | Extended barrel with LabCodeBlock, LabRunner, AssignmentViewer, NotebookDownloadButton, LabTabs |

### MDX Approach
- **Server-side compilation**: Page (server component) compiles both `lab.md` and `assignment.md` using `compileMDX` from `next-mdx-remote/rsc` with `pre: LabCodeBlock` and `table: MarkdownTable` in the components map. Compiled ReactNode is passed as props to client wrapper components (LabRunner, AssignmentViewer).
- **No client-side MDX**: `MDXRemote` (client-side) was not needed — the compileMDX → ReactNode → client component pattern handles serialization through RSC boundaries cleanly. `LabCodeBlock` (client) receives `className` from the compiled MDX output and routes python fences to dynamic `PyodideRunner` (ssr:false).
- **Compile failures**: Wrapped in try/catch on the server; LabRunner and AssignmentViewer render raw markdown + amber notice when `rawFallback !== null`.

### Verification
- **Type-check**: `npx tsc --noEmit` → exit 0 (0 errors)
- **Browser smoke**: Deferred to Vercel deployment (runtime harness). Covered scenarios: python execution in lab, tab switching with localStorage, notebook download, assignment rubric tables, compile failure fallback.
- **Runtime harness**: N/A — deferred to browser smoke post-deploy

### Work Unit Evidence
| Evidence | Value |
|---|---|
| Focused test command | `npm run type-check` (Node 22) — exit 0, 0 errors |
| Runtime harness | N/A — browser smoke deferred to Vercel; no local test-runner boundary before deploy |
| Rollback boundary | Revert PR2: route.ts, page.tsx, 5 lab components, modules.ts helpers; PR1 intact |
