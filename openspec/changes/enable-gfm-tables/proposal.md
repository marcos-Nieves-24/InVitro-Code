# Proposal: Enable GFM Table Parsing

## Intent

Six markdown tables in 4 lessons render as raw pipes — `remark-gfm` is absent from the MDX pipeline. PR #29 shipped `MarkdownTable` but it stays dormant without GFM. Separately, `lesson08_gradient_boosting` 500s from an unescaped `<10,000` in prose. Fix both, plus a hygiene regex for 13 H1-less lessons.

## Scope

### In Scope
- Install `remark-gfm`, register in `mdxConfig.remarkPlugins`
- Escape `<10,000` → `\<10,000` in lesson08 L90
- Fix H1 strip regex: `/^# .+\n?/` → `/^\s*# .+\n?/`

### Out of Scope
- Converting tables to `ComparisonTable`/`InteractiveTable` props
- `MarkdownTable` component changes, quiz/lab/assignment files, other content

## Capabilities

### New Capabilities
- `gfm-table-parsing`: MDX lesson compilation SHALL parse GFM pipe tables into `<table>` elements
- `lesson08-mdx-compile`: The lesson08 gradient boosting page SHALL compile without error

### Modified Capabilities
None — `markdown-table-rendering` spec requirements are unchanged; this activates the parser upstream.

## Approach

| Decision | Choice | Rejected |
|----------|--------|----------|
| D1: Parse tables | `npm install remark-gfm` + one plugin line | Convert 6 tables to `ComparisonTable` props (content churn, doesn't fix lesson08) |
| D2: Fix lesson08 | `\<10,000` backslash escape | Rewording (loses author framing) |
| D3: H1 hygiene | Accept leading whitespace in regex | Skip (13 titles only slightly off) |
| D4: Delivery | Same branch as PR #29 (`feat/content-table-component`) | Separate PR (splits coherent fix) |
| D5: Build gate | Defer to Vercel per user | Local `npm run build` |

## Affected Areas

| Area | Impact |
|------|--------|
| `package.json` | Add `remark-gfm` |
| `page.tsx` L40-46 | Add plugin + fix regex |
| `lesson08/lesson.md` L90 | Escape `<` |
| 4 lesson files (ia 02/03/04, python 01) | Tables now parse (no content edits) |
| `markdown-table.tsx` | Component activates |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| remark-gfm ↔ remark-math ^6 conflict | Low | Both official remark plugins, same major; `npm run type-check` catches |
| GFM autolink alters future content | Low | Zero bare URLs today; monitor in content review |
| lesson08 escape fails in MDX flow | Low | `<Section>` blank-line context allows CommonMark `\` escape; verified elsewhere |

## Rollback Plan

Revert 2-3 commits on `feat/content-table-component` branch, or decline PR #29. No migration, no data loss.

## Dependencies

- PR #29 (branch `feat/content-table-component`) — `MarkdownTable` component required
- `remark-gfm` (npm, latest stable)

## Success Criteria

- [ ] `npm run type-check` passes with remark-gfm registered
- [ ] 6 tables render styled, not raw pipes
- [ ] `lesson08_gradient_boosting` loads (no 500)
- [ ] No GFM side effects (strikethrough, task lists) alter rendered content
