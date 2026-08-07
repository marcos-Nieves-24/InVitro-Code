# Exploration: enable-gfm-tables

Status: VERIFIED (facts re-checked against repo; original audit was empirical compileMDX reproduction over all 48 lesson.md files + targeted GFM tests).

## Current State

The lesson renderer `src/app/learn/[module]/[slug]/page.tsx` compiles each `<Section>` block with `compileMDX` using:

```ts
const mdxConfig = {
  blockJS: false,
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
};
```

**Root cause**: `remark-gfm` is NOT installed (`package.json` has `next-mdx-remote ^6.0.0`, `rehype-katex ^7.0.1`, `remark-math ^6.0.0` — no `remark-gfm`) and NOT in `remarkPlugins`. GFM pipe tables are not CommonMark, so raw markdown tables never parse into `<table>` — they render as literal-pipe paragraphs.

Notably, the styling half already shipped: PR #29 (`content-table-component` change, HEAD commit `749f5b3` on branch `feat/content-table-component`) added `src/components/lesson/markdown-table.tsx` and registered `table: MarkdownTable` in the components map (page.tsx:164, index.ts:20). Its merged spec `openspec/specs/markdown-table-rendering/spec.md` contains ZERO mentions of `gfm`/`remark` — the component was built without enabling the parser. **PR #29 implication: the presentational layer is ready but dead until remark-gfm parses tables.**

## Verified Facts (spot-checked against repo, 2026-08-07)

1. `mdxConfig` at page.tsx:40-46 — `remarkPlugins: [remarkMath]`, `rehypePlugins: [rehypeKatex]`, no remark-gfm. ✔
2. `package.json` — `next-mdx-remote ^6.0.0` (L19), `rehype-katex ^7.0.1` (L26), `remark-math ^6.0.0` (L27); no `remark-gfm`. ✔
3. Raw GFM tables exist ONLY in rendered Sections of 4 files (all blank-line separated, flow context inside `<Section>`):
   - `ia/lesson02_how_ai_learns` — §12 "Tres regímenes de complejidad", L240-244 (sep L241)
   - `ia/lesson03_ai_in_biotech` — §7 "Pipeline de ML en biotecnología", L132-139 (sep L133)
   - `ia/lesson04_real_cases` — §10 "Lo que aprendimos en el Módulo 1", L232-237 (sep L233)
   - `python/lesson01_installing_python` — 3 tables: §3 "Distribuciones de Python" L57-62 (sep L58), §6 "pip — El Instalador de Paquetes" L150-155 (sep L151), §11 "Resumen y Conceptos Clave" L286-292 (sep L287)
4. `estadistica`, `etica`, `machine-learning` — ZERO `^|` markdown tables (use `ComparisonTable`/`InteractiveTable` components instead). ✔
5. **Pre-existing MDX compile error (independent of GFM)**: `machine-learning/lesson08_gradient_boosting/lesson.md:90` — `Para datasets <10,000 filas` unescaped `<` + digit in prose (inside `<CalloutInfo>`) → MDX "Unexpected character `1` (U+0031) before name" → lesson 500s. Global scan confirms only 3 `<`+digit occurrences: lesson08:90 (prose — BROKEN), `machine-learning/lesson10_applications:79` `(<1000 filas)` (JSX prop string — SAFE), `python/lesson14_pandas:276` `"<30"` (code block — SAFE). ✔
6. Python lessons 05-17 (13 files) start content with a leading newline before `# Title` (blank L21, H1 L22) → H1 strip regex `/^# .+\n?/` misses it; the H1-only pre-`<Section>` block is dropped by the block filter — benign, header renders frontmatter `Lesson Title`. (lesson01 has no H1 at all.) ✔
7. Side-effect scan: 0 strikethrough (`~~`), 0 task lists (`- [ ]`), 4 `http` matches all in markdown links / code spans — GFM autolink has no visible side effects. List/heading/bold/math (CommonMark + remark-math) render correctly inside `<Section>` (orchestrator T4-T7 tests). ✔
8. `quiz.md`/`lab.md`/`assignment.md`/`slides.md`/`notebook.ipynb`/`references.bib` have ZERO code consumers in `src/` (only README docs + frontmatter metadata strings; slides.md already deleted as unused in `cf869d6`). ✔

## Affected Areas

- `package.json` — add `remark-gfm` dependency.
- `src/app/learn/[module]/[slug]/page.tsx` — add `remark-gfm` to `remarkPlugins` in `mdxConfig` (L40-46).
- `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md` — table L240-244 becomes a styled table.
- `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lesson.md` — table L132-139 becomes a styled table.
- `src/content/modules/ia/lessons/lesson04_real_cases/lesson.md` — table L232-237 becomes a styled table.
- `src/content/modules/python/lessons/lesson01_installing_python/lesson.md` — 3 tables (L57-62, L150-155, L286-292) become styled tables.
- `src/content/modules/machine-learning/lessons/lesson08_gradient_boosting/lesson.md` — pre-existing compile error at L90; blocks verify until fixed (independent of this change).
- `src/components/lesson/markdown-table.tsx` — consumer activated (no changes needed).

## Approaches

1. **Add remark-gfm (recommended)** — `npm i remark-gfm`, register in `remarkPlugins`.
   - Pros: One dep + one line; activates all 6 tables; styled by existing MarkdownTable; negligible side effects (verified: no strikethrough/task-list/bare-URL in content).
   - Cons: Requires fixing lesson08:90 `<` before build succeeds (blocker regardless of GFM).
   - Effort: Low

2. **Convert tables to `<ComparisonTable>`/`<InteractiveTable>` components** — replace raw markdown tables with existing MDX components.
   - Pros: No new dependency; consistent with estadistica/etica/ml modules.
   - Cons: Higher content churn (6 tables across 4 files), loses simple markdown authoring; doesn't fix lesson08:90 either.
   - Effort: Medium

3. **Do nothing** — leave tables rendering as literal-pipe text.
   - Pros: Zero risk.
   - Cons: 6 tables render broken/ugly; MarkdownTable component stays dead; contradicts PR #29 intent.
   - Effort: None

## Recommendation

Approach 1: add `remark-gfm` and register it. It is minimal, activates the styled table component PR #29 already shipped, and the side-effect surface is verified negligible. Must be paired with fixing `lesson08_gradient_boosting/lesson.md:90` (escape as `\<10,000` or reword) — that lesson 500s today independently of this change and will fail `npm run build`.

## Risks

- `lesson08_gradient_boosting` page currently 500s from the unescaped `<10,000` at L90; `npm run build` will fail unless fixed in the same change (or a companion one).
- GFM autolink could theoretically affect future content with bare URLs — none exist today; low ongoing risk, monitor in content review.
- remark-gfm version must be compatible with the installed remark/micromark stack (`remark-math ^6`); verify with `npm run type-check` (build deferred to Vercel per user instruction).

## Ready for Proposal

Yes — root cause, inventory, and risks are verified. Tell the user: the fix is one dependency + one plugin line, the 6 tables will be styled by the already-shipped MarkdownTable component, and lesson08:90 must be fixed in the same change (it's a live 500 today, not caused by GFM).
