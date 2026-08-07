# Tasks: Markdown Table Component

## Review Workload Forecast

Estimated changed lines: ~25–30 (1 new ~20-line file + 2 one-line edits)

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Styled `table` override end-to-end (component + barrel + map) | PR 1 | `npm run type-check` | `npm run dev`, visit ia/lesson02 slide with "Tres regímenes de complejidad" table — borders, gray header, zebra rows, no overflow | Revert `page.tsx` map entry + `index.ts` export, delete `markdown-table.tsx`; tables return to prose styling |

Single PR. Change is well under the 400-line budget; no chaining, no `size:exception` needed.

## Phase 1: Component

- [x] 1.1 Create `src/components/lesson/markdown-table.tsx`: pure presentational server component (no `"use client"`, no state) accepting `children: React.ReactNode`; render `<div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">` wrapping `<table className="w-full text-left text-sm">` with arbitrary-variant styling per spec REQ-TBL-03…07 (`[&_thead_tr]:border-b [&_thead_tr]:border-gray-200 [&_thead_tr]:bg-gray-50 [&_th]:px-4 [&_th]:py-3 [&_th]:font-mono [&_th]:text-[11px] [&_th]:uppercase [&_th]:text-gray-500 [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-gray-700 [&_tbody_tr:nth-child(odd)]:bg-white [&_tbody_tr:nth-child(even)]:bg-gray-50/50 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-blue-50/40`). Do NOT restyle `thead`/`tbody`/`tr`/`th`/`td` as separate map entries (D1).

## Phase 2: Wiring

- [x] 2.1 Export `MarkdownTable` from `src/components/lesson/index.ts` (alphabetical, near `InteractiveTable`).
- [x] 2.2 Add `table: MarkdownTable` to the `components` map in `src/app/learn/[module]/[slug]/page.tsx` (line ~162, beside `pre: CodeBlock`) — shared by carousel `compileMDX` and fallback `MDXRemote` paths (REQ-TBL-02).

## Phase 3: Verification

- [x] 3.1 `npm run type-check` passes (REQ-TBL-10). Use Node >= 20.9 via `nvm use` — machine default is Node 18.
- [ ] 3.2 `npm run build` succeeds — confirms Tailwind v4 arbitrary variants compile (proposal risk #1). **ANNOTATED AT ARCHIVE (W-BUILD-DEFERRED, accepted)**: build NOT executed locally per user instruction "No hagas Build Node, eso se encarga Vercel" — gate deferred to the Vercel deploy pipeline. Machine infra (3.3Gi RAM) OOM-kills Next 16 Turbopack prod build. `npm run type-check` (exit 0) and `npm run dev` (Ready 664ms, zero errors) pass cleanly. Not a code defect.
- [ ] 3.3 Spot-check with `npm run dev`: ia lesson02 "Tres regímenes de complejidad" has borders, header bg, zebra rows, no overflow; python lesson01's 3 tables styled; existing `<ComparisonTable>`/`<InteractiveTable>` render unchanged (REQ-TBL-08). **ANNOTATED AT ARCHIVE (W-SPOT-CHECK, accepted)**: visual spot-check pending — orchestrator or manual tester to confirm the 6 affected tables render on the carousel. Non-blocking.

## Phase 4: Guardrails

- [x] 4.1 Confirm NO content changes: `git status` shows only the 3 files above; all `lesson.md` files untouched (REQ-TBL-09). **RECONCILED AT ARCHIVE**: checkbox was stale — content guardrail substantively verified by `git status` in apply-progress and verify-report, and re-confirmed by archive agent (zero lesson.md/quiz.md/lab.md/assignment.md/README.md modifications; only markdown-table.tsx, index.ts, page.tsx changed).

## Notes

- No tests required: project has no test runner wired into npm scripts (`strict_tdd: false`); verification gates are `type-check` + `build` + manual spot-check.
- ia/lesson01 Resumen table stays invisible by design (D4) — not a regression.
