## Exploration: content-table-component

### Current State

Lesson content is compiled in `src/app/learn/[module]/[slug]/page.tsx` — the ONLY MDX entry point in the app (sole `compileMDX`/`MDXRemote` consumer). Each lesson's `lesson.md` is split on `<Section>` blocks, filtered (sections with `title="Resumen"` are dropped), renumbered, and each block is compiled separately into a carousel slide. Both render paths (carousel and fallback `MDXRemote`) apply `lessonProseClass` from `src/lib/ui/prose.ts` on the wrapper.

Markdown tables (`| ... |`) in content compile to plain HTML `table/thead/tbody/tr/th/td` elements. The lesson page's `components` map registers many named MDX components plus `pre: CodeBlock`, but does NOT override `table`. The only table styling comes from Tailwind Typography prose classes in `lessonProseClass`: `prose-table:text-sm prose-th:font-mono prose-th:text-[11px] prose-th:uppercase prose-th:tracking-[0.08em] prose-th:text-gray-500 prose-td:text-gray-700`. There are NO borders, NO header background, NO zebra rows, NO hover states, and NO `overflow-x-auto` wrapper — so wide tables (e.g. lesson02's 3-column "¿Qué pasa?" with long text) render cramped and overflow the carousel slide. This matches the reported poor formatting on `lesson02_how_ai_learns`.

Two styled table components already exist and establish the design language:
- `src/components/lesson/comparison-table.tsx` (`ComparisonTable`, server component, prop-driven): `overflow-x-auto rounded-lg border border-gray-200` container, `bg-gray-50` header row, uppercase mono 11px gray-500 headers, zebra rows (`bg-white` / `bg-gray-50/50`), `px-4 py-3` cells.
- `src/components/lesson/interactive-table.tsx` (`InteractiveTable`, client component, prop-driven, sortable + searchable + optional caption): `rounded-xl border border-gray-200 shadow-sm` container, same header language, zebra rows with `hover:bg-blue-50/40`, `CellRenderer` for inline-code cells.

Both are exported from `src/components/lesson/index.ts` and mapped in the lesson page. Neither is affected by a future `table` mapping (MDX component mapping only transforms the markdown-emitted HTML elements, not the internal JSX of mapped components).

### Markdown Table Inventory

**Rendered by the lesson page (module 1 = `ia`) — 3 tables:**
- `ia/lessons/lesson02_how_ai_learns/lesson.md` L240–244 — "Tres regímenes de complejidad" (CONCEPTO), 3 cols × 3 rows, heavy cell text — **the reported table**
- `ia/lessons/lesson03_ai_in_biotech/lesson.md` L132–139 — "Pipeline de ML en biotecnología" (CONCEPTO), 2 cols × 6 rows, bold cells
- `ia/lessons/lesson04_real_cases/lesson.md` L232–237 — "Lo que aprendimos en el Módulo 1" (CIERRE), 2 cols × 4 rows

**In module 1 but NOT rendered:**
- `ia/lessons/lesson01_what_is_ai/lesson.md` L185–191 — "Concepto | Idea clave" sits inside `<Section title="Resumen">`, which the page filters out by design
- `ia/lessons/lesson01_what_is_ai/lab.md` L222–228 and `lesson02_how_ai_learns/lab.md` L225–232 — rubric tables ("Criterio | Puntos") — no page consumes `lab.md`
- `ia/lessons/lesson01_what_is_ai/assignment.md` L45–50 and `lesson02_how_ai_learns/assignment.md` L47–52 — grading rubrics — no page consumes `assignment.md`
- Module `README.md` files — no page consumes them

**Rendered tables in OTHER modules (reuse candidates, automatically fixed by a `table` override):**
- `python/lessons/lesson01_installing_python/lesson.md` — 3 markdown tables (19 pipe lines): "Distribución" L57–62, "Comandos pip" L150–155, "Concepto" L286–292
- `machine-learning`, `estadistica`, `etica` — ZERO markdown tables; they use `<ComparisonTable>`/`<InteractiveTable>` MDX components instead (heavily, e.g. ml lesson01 uses 3 ComparisonTables)

**Quiz/lab/assignment consumption:** verified via grep — no `.ts`/`.tsx` file references `quiz.md`, `lab.md`, or `assignment.md`. These files are authoring artifacts only (no download route, no rendering page). Out of scope for this change unless a consumer is added.

### Affected Areas

- `src/app/learn/[module]/[slug]/page.tsx` — add `table: MarkdownTable` to the `components` map (both carousel and fallback paths share this map)
- `src/components/lesson/markdown-table.tsx` — NEW component: wrapper `div` (rounded border container + `overflow-x-auto`) returning a styled `<table>{children}</table>`; matches ComparisonTable/InteractiveTable design language via Tailwind arbitrary variants (`[&_thead_tr]:bg-gray-50`, zebra rows via `[&_tbody_tr:nth-child(odd)]`, header mono-uppercase prose styles already cascade from `lessonProseClass`)
- `src/components/lesson/index.ts` — export the new component
- Content (`ia` lesson02/03/04, `python` lesson01) — NO edits required; improvement is automatic

### Approaches

1. **Override `table` in the MDX components map with a new `MarkdownTable` wrapper** — automatic styling for every markdown table, zero content churn.
   - Pros: fixes all rendered markdown tables at once (incl. python lesson01's 3); keeps tables as plain markdown in content; follows the existing `pre: CodeBlock` precedent; low risk, no data transcription.
   - Cons: no per-table interactivity (sort/search — that's what `InteractiveTable` is for); visual change is global across modules.
   - Effort: Low

2. **Convert all markdown tables to `<ComparisonTable>`/`<InteractiveTable>` MDX components in content** — rich per-table control.
   - Pros: reuses battle-tested components; adds sort/search/captions where wanted.
   - Cons: heavy content churn (transcribe 7 rendered tables into props arrays); loses plain-markdown editability; doesn't automatically cover future tables; more diff for reviewers.
   - Effort: Medium/High

3. **Hybrid: Approach 1 now + opt-in conversion to `InteractiveTable`/`ComparisonTable` where interactivity is later desired**.
   - Pros: immediate fix with zero content risk; staged enhancement path.
   - Cons: two mechanisms to keep coherent; slight ambiguity about which to use for new content.
   - Effort: Low now + Medium later

### Recommendation

Approach 1 (map `table` → new `MarkdownTable` component). It directly answers the user's ask ("React component for tables"), fixes the reported lesson02 rendering and the other rendered markdown tables (ia lesson03/04, python lesson01) with a single small component, needs no content edits, and preserves markdown tables as the simple authoring format. Reuse the ComparisonTable/InteractiveTable design tokens (rounded bordered container, `bg-gray-50` header, zebra rows, mono-uppercase headers) so all three feel like one family. Optionally extend later per Approach 3.

### Risks

- **Resumen filter**: lesson01's table is intentionally not rendered (section filtered by `title="Resumen"`) — user should be told this table is invisible by design, not broken.
- **lab.md / assignment.md / README.md tables**: no consumer exists; they will remain unstyled until a rendering/download page is built (out of this change's scope).
- **Global visual change**: the `table` override also restyles python lesson01's 3 tables; verify `npm run build` and spot-check both modules.
- **Tailwind v4 arbitrary variants** on the wrapper must be verified to compile (repo uses Tailwind v4).
- **Prose cascade**: inner `th/td` have no explicit classes; rely on `prose-th`/`prose-td` from `lessonProseClass` plus wrapper variants — keep the wrapper's variants additive, not conflicting.

### Ready for Proposal

Yes — tell the user: the root cause is the missing `table` override (prose-only styling, no container/overflow); 3 module-1 tables are actually rendered (lesson02/03/04) while lesson01's is in a filtered `Resumen` section and lab/assignment rubrics have no rendering page; recommended fix is a new `MarkdownTable` component mapped to `table`, with zero content changes.
