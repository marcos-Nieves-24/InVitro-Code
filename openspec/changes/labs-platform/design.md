# Design: Labs Platform

## Technical Approach

Content-driven lab center replacing the hardcoded `/laboratorios` placeholder. Server components read 4 content files per lesson (`lab.md`, `quiz.md`, `assignment.md`, `notebook.ipynb`), pass to client tabs that compile MDX with the existing pipeline (`remarkMath`+`remarkGfm`+`rehypeKatex`). Python code fences route to `PyodideRunner` (dynamically imported, `ssr: false`); non-python fences render statically. Quiz parser handles EN/ES headings, mixed option styles, and inline `<details>` answers with raw-fallback protection. Hub reads all modules via `getModules()` plus `progress` table join for completion state.

## Architecture Decisions

### Decision: MDX approach for lab content

**Choice**: `compileMDX` with `pre: LabCodeBlock` (client component) that inspects `className` and renders `PyodideRunner` for `language-python`, static `<pre>` otherwise.
**Alternatives considered**: (b) parse lab.md manually, compile prose chunks separately, render code blocks as standalone runners.
**Rationale**: MDX's `pre` component receives `{ children, className }` — we inspect `className.replace('language-', '')` to route. Same pipeline as lessons (`pre: CodeBlock` → `pre: LabCodeBlock`). No content splitting, no Regex on source markdown. PyodideRunner expects `defaultValue` string; we extract text from MDX's `<code>` child element via `React.Children.toArray`.

### Decision: File layout under `src/components/laboratorio/`

**Choice**: Flat component directory with barrel export.
**Alternatives considered**: `src/components/labs/` per proposal, co-located with page.
**Rationale**: Existing `LabMission` lives in `src/components/laboratorio/` — we supersede it in-place. `src/components/laboratorio/index.ts` barrel matches existing lesson component pattern. New components: `LabHub`, `LabCard`, `LabTabs`, `LabRunner`, `QuizRunner`, `AssignmentViewer`, `NotebookDownloadButton`. Utility: `src/lib/labs/quiz-parser.ts`.

### Decision: Quiz parser structure

**Choice**: Single module exporting `parseQuiz(mdContent: string): QuizResult`. Iterates top-level `##` sections; identifies type by heading regex match (EN+ES). MCQ options extracted by per-block regex: `(?:^|\n)(?:-\s*)?([A-Da-d])\)\s+(.+)`. `**Q{n}:**` or `**Q{n}.**` or `**{n}.**` question number prefix. Answers from two sources: (1) `<details><summary>Answer</summary>{text}</details>` HTML blocks, (2) `## Answer Key` / `## Clave de respuestas` section with `**Q{n}:** {letter} {text}` lines.
**Alternatives considered**: Markdown AST parser (unified/remark), frontmatter-based quiz format.
**Rationale**: 48 quiz.md files with two distinct formats — line-based regex handles both; AST overkill for no-frontmatter files. Tolerance requirement (REQ-QUIZ-05) demands `parseMode: 'raw-fallback'` on any parse failure.

### Decision: Hub progress join

**Choice**: Server component: `getModules()` + per-lesson frontmatter reads + single Supabase `progress` query (`createAdminClient()`) filtered by `user_id`.
**Alternatives considered**: Client-side Supabase realtime subscription, REST endpoint.
**Rationale**: Existing `laboratorios/page.tsx` + `proyectos/page.tsx` both use the `createAdminClient()` server-side pattern. `progress` table has `(user_id, module_slug, lesson_slug, completed)` — one query gives all completion state. RSS supports 48 cards with no pagination.

## Data Flow

```
Server (LabPage)                   Client (Tabs)
───────────────                    ────────────
fs.readFileSync(lab.md) ──► LabRunner (compileMDX → LabCodeBlock → PyodideRunner)
fs.readFileSync(quiz.md) ──► QuizRunner (parseQuiz → interactive form + key reveal)
fs.readFileSync(assignment.md) ──► AssignmentViewer (compileMDX → prose + rubric table)
fs.existsSync(notebook.ipynb) ──► NotebookDownloadButton (GET /api/notebook/...)
auth() → redirect(/sign-in)
```

```
Server (Hub)                       Client
───────────                        ──────
getModules() ─► sorted module list
getLessonTitle() per lesson ─► card metadata
Supabase progress query ─► completion flags
                                ──► LabHub (collapsible modules + LabCard grid)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/labs/quiz-parser.ts` | Create | Pure `parseQuiz(mdContent): QuizResult` — regex-based, no dependencies |
| `src/components/laboratorio/LabCodeBlock.tsx` | Create | Client; reads MDX `pre` children+className; routes python→PyodideRunner, other→static `<pre>` |
| `src/components/laboratorio/LabRunner.tsx` | Create | Client; compileMDX with LabCodeBlock as `pre`, MarkdownTable as `table` |
| `src/components/laboratorio/QuizRunner.tsx` | Create | Client; calls parseQuiz, renders MCQ radio + short-answer text inputs, validate + key reveal |
| `src/components/laboratorio/AssignmentViewer.tsx` | Create | Client; compileMDX assignment.md, rubric table via MarkdownTable |
| `src/components/laboratorio/NotebookDownloadButton.tsx` | Create | Client; fetches `/api/notebook/[module]/[lesson]`, saves blob; disabled when notebook absent |
| `src/components/laboratorio/LabTabs.tsx` | Create | Client; tab state (Lab/Cuestionario/Proyecto), localStorage active-tab, conditional tab visibility |
| `src/components/laboratorio/LabHub.tsx` | Create | Client; collapsible module sections with LabCard grid |
| `src/components/laboratorio/LabCard.tsx` | Create | Client; lesson metadata card (title/difficulty/duration/prereqs/completed), links to lab page |
| `src/components/laboratorio/index.ts` | Create | Barrel re-export of new lab components |
| `src/app/(dashboard)/laboratorios/page.tsx` | Modify | Replace LabMission+sidebar with InVitroShell+LabHub server component |
| `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` | Create | Server: auth gate, 4-file read, shell wrap, pass strings/booleans to LabTabs client |
| `src/app/api/notebook/[module]/[lesson]/route.ts` | Create | GET handler: auth check, path safety, file read, Content-Disposition download |
| `src/components/laboratorio/LabMission.tsx` | Delete | Superseded by LabHub+LabPage |
| `src/lib/content/modules.ts` | Modify | Add `getLessonFrontmatterSlugSafe(module, lesson): LessonFrontmatter` helper for hub cards |

## Interfaces / Contracts

### `QuizResult` (quiz-parser.ts)

```typescript
interface QuizQuestion {
  id: number;
  type: 'mcq' | 'short-answer' | 'coding';
  question: string;
  options?: string[];          // mcq only
  correctAnswer?: string;     // mcq: letter; short-answer/coding: text
  explanation?: string;       // from answer key
}

interface QuizResult {
  parseMode: 'structured' | 'raw-fallback';
  questions: QuizQuestion[];  // empty on raw-fallback
}
```

### `LabCodeBlock` props (MDX `pre` contract)

```typescript
interface LabCodeBlockProps {
  children: React.ReactNode;   // <code> element from MDX
  className?: string;          // "language-python", "language-bash", etc.
}
```

### `LabTabs` props

```typescript
interface LabTabsProps {
  module: string;
  lesson: string;
  labContent: string;          // raw lab.md
  quizContent: string | null;  // null → hide Cuestionario tab
  assignmentContent: string | null; // null → hide Proyecto tab  
  hasNotebook: boolean;        // controls download button availability
}
```

### Notebook API response

```
200: Content-Type: application/x-ipynb+json
     Content-Disposition: attachment; filename="notebook.ipynb"
     Body: raw file bytes (no re-execution)
401: { error: "Unauthorized" }
404: { error: "Not found" }
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Type-check | All new files | `npm run type-check` (strict TypeScript) |
| Build | Full app build | `npm run build` (Next.js compilation) |
| Manual | 48 lessons render all tabs | Click-through on 5 modules after deploy |
| Manual | Quiz fallback on unparseable content | Create a deliberately malformed quiz.md fixture |
| Manual | Notebook download with preserved outputs | Download ml/lesson02, verify cell outputs in Jupyter |
| Manual | Path traversal rejection | `GET /api/notebook/python/../etc/passwd` → 404 |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary is introduced. The notebook API path-safety check (`REQ-NBAPI-05`) is a standard filesystem sanitization guard, not a shell/process boundary.

## Migration / Rollout

No migration required. No DB schema changes. Rollback: revert PRs; `/laboratorios` returns to LabMission placeholder. `/api/notebook` route is additive — removing it has no side effects.

## Open Questions

- [ ] Should `LabTabs` active tab persist in `localStorage` keyed by `{module}/{lesson}` or globally? (Recommend per-lesson — more useful.)
- [ ] Should the hub show progress for lessons completed via `/learn` (current `progress` table) or only via `/laboratorios`? (Same table — hub reads existing `progress` rows so `/learn` completions automatically appear.)

## PR Split Plan

### PR 1: Quiz Infrastructure (est. ~300 lines)
- `src/lib/labs/quiz-parser.ts` — pure function, zero dependencies
- `src/components/laboratorio/QuizRunner.tsx` — client component
- Verify: `npm run type-check`; manual quiz rendering on sample files

### PR 2: Lab Page + Runner + Assignment + Notebook API (est. ~400 lines)
- `src/components/laboratorio/LabCodeBlock.tsx`
- `src/components/laboratorio/LabRunner.tsx`
- `src/components/laboratorio/LabTabs.tsx`
- `src/components/laboratorio/AssignmentViewer.tsx`
- `src/components/laboratorio/NotebookDownloadButton.tsx`
- `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx`
- `src/app/api/notebook/[module]/[lesson]/route.ts`
- Dependencies: `QuizRunner` from PR 1 (merged)

### PR 3: Hub + Card + Navigation (est. ~350 lines)
- `src/components/laboratorio/LabHub.tsx`
- `src/components/laboratorio/LabCard.tsx`
- `src/components/laboratorio/index.ts` (barrel)
- `src/app/(dashboard)/laboratorios/page.tsx` (replace placeholder)
- `src/components/laboratorio/LabMission.tsx` (delete)
- `src/lib/content/modules.ts` (add `getLessonFrontmatterSlugSafe`)
- Dependencies: PR 2 route exists (hub links to it)
