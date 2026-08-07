# Proposal: Markdown Table Component

## Intent

Markdown tables in lesson content render as plain HTML with only prose-class text styling — no borders, header background, zebra rows, or overflow handling. Wide tables (e.g., ia/lesson02's 3-column "Tres regímenes de complejidad") overflow the carousel slide and look unstyled. Create a styled `table` element override in the MDX components map to fix all rendered markdown tables globally with zero content changes.

## Scope

### In Scope
- New `MarkdownTable` component wrapping markdown-emitted `<table>` children
- Map `table` → `MarkdownTable` in the lesson page's MDX `components` map
- Barrel export from `src/components/lesson/index.ts`
- Verifiable on: ia lesson02, lesson03, lesson04 + python lesson01

### Out of Scope
- ia/lesson01 table inside `<Section title="Resumen">` — filtered by design, not broken
- lab.md, assignment.md, quiz.md, README.md tables — no consumer exists
- Converting existing `<ComparisonTable>`/`<InteractiveTable>` usage to markdown
- Sort/search interactivity (existing `InteractiveTable` handles that)

## Capabilities

### New Capabilities
- `markdown-table-rendering`: styled container, header bg, zebra rows, hover, and overflow for all markdown tables rendered through the MDX lesson page

### Modified Capabilities
- None

## Approach

Create `src/components/lesson/markdown-table.tsx` (server component) that renders:
```tsx
<div className="overflow-x-auto rounded-lg border border-gray-200">
  <table className="w-full text-left text-sm [&_thead_tr]:border-b
    [&_thead_tr]:border-gray-200 [&_thead_tr]:bg-gray-50
    [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3
    [&_tbody_tr:nth-child(odd)]:bg-white
    [&_tbody_tr:nth-child(even)]:bg-gray-50/50
    [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-blue-50/40">
    {children}
  </table>
</div>
```

Add `table: MarkdownTable` to the `components` object in `src/app/learn/[module]/[slug]/page.tsx` (both carousel and fallback paths share this map). Export from `src/components/lesson/index.ts`.

Design language follows `ComparisonTable` (rounded border container, bg-gray-50 header, zebra rows, px-4 py-3 cells) and `InteractiveTable` (hover:bg-blue-50/40, transition-colors). Prose-class text styling (`prose-th:font-mono`, etc.) flows from the existing `lessonProseClass` — the wrapper only adds structure.

## Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Override `table` only (not thead/tbody/tr/th/td individually) | Simpler mapping; arbitrary Tailwind variants (`[&_thead_tr]`, `[&_tbody_tr]`) reach the children. Matches `pre: CodeBlock` precedent. |
| D2 | Accept `children: React.ReactNode` (standard HTML children from MDX) | MDX compiles markdown tables into HTML elements; the component receives them as children. No structured props needed. |
| D3 | Container: `rounded-lg border border-gray-200 overflow-x-auto`. Header: `bg-gray-50`. Rows: zebra + hover-blue. Cells: `px-4 py-3`. | Matches ComparisonTable/InteractiveTable visual language. Mobile-safe via overflow-x-auto. |
| D4 | lesson01 Resumen table intentionally not rendered | Page filters `<Section title="Resumen">` by design — that table is invisible, not broken. Document, do not change. |
| D5 | python lesson01's 3 tables get same restyling | Global `table` override — acceptable and consistent. Verified their content is standard markdown tables. |
| D6 | lab/assignment/quiz/README tables out of scope | No page consumes these files. Will remain unstyled until a rendering route is built. |
| D7 | Mobile: `overflow-x-auto` on container | Wide tables scroll horizontally on narrow viewports. No JS needed. |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/lesson/markdown-table.tsx` | New | Styled table wrapper component |
| `src/components/lesson/index.ts` | Modified | Add `MarkdownTable` export |
| `src/app/learn/[module]/[slug]/page.tsx` | Modified | Add `table: MarkdownTable` to components map |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tailwind v4 arbitrary variants fail to compile | Low | Verify with `npm run build`; fallback to explicit child component mapping (thead/tbody/tr/th/td) |
| Prose classes conflict with wrapper padding | Low | Prose only sets text/font — our padding is additive. Spot-check both modules. |
| Rendered rows/layout break on unusual tables | Low | All 6 affected tables are standard 2–3 column data tables. Verified during exploration. |

## Rollback Plan

1. Remove `table: MarkdownTable` from the `components` map in `page.tsx`
2. Remove `MarkdownTable` export from `src/components/lesson/index.ts`
3. Delete `src/components/lesson/markdown-table.tsx`
4. Rebuild — tables revert to prose-only styling

## Dependencies

- None (zero external dependencies)

## Success Criteria

- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] ia lesson02's "Tres regímenes de complejidad" table renders with borders, header bg, zebra rows, and no overflow
- [ ] ia lesson03, lesson04, and python lesson01 tables get the same styling
- [ ] Existing ComparisonTable/InteractiveTable instances render unchanged
