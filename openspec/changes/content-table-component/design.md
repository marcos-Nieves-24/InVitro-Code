# Design: Markdown Table Component

## Technical Approach

Wrap MDX-emitted `<table>` children in a styled container using Tailwind arbitrary variants — no sub-element overrides, no content changes. The existing `lessonProseClass` handles typography (font, size, color); `MarkdownTable` adds structure (borders, backgrounds, padding, zebra, hover, overflow). Follows the `pre: CodeBlock` single-wrapper precedent. Server component, zero state.

## Architecture Decisions

| # | Option | Tradeoff | Decision |
|---|--------|----------|----------|
| D1 | Single wrapper with arbitrary variants (`[&_thead_tr]`) vs explicit th/td/tr overrides | Arbitrary variants: simpler mapping, one file. Explicit overrides: more control but 6+ components in the map, bloat for 6 tables. | **Single wrapper**. Matches `pre: CodeBlock` precedent. Fallback to explicit overrides only if Tailwind v4 rejects the variants at build time. |
| D2 | Additive vs overriding prose typography | Prose already sets `font-mono text-[11px] uppercase text-gray-500` on `th` and `text-sm text-gray-700` on `td`. Overriding duplicates; additive avoids conflict. | **Additive**. MarkdownTable adds `px-4 py-3` padding, border, bg, zebra, hover. Prose injects typography. No `!important` or reset needed. |

## Data Flow

```
lesson.md (markdown table)
  → MDX compiler → HTML <table><thead>...</table> as children
  → MarkdownTable wraps children in styled <div> + <table>
  → prose plugin injects typography classes (text-sm, font-mono, text-gray-500/700)
  → Final DOM: <div.overflow-x-auto> <table.w-full> {children} </table> </div>
```

Prose and MarkdownTable operate on the same `<table>` element — their class sets do not conflict (prose: text/font; MarkdownTable: layout/color).

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/lesson/markdown-table.tsx` | Create | Server component: styled wrapper around `<table>` children |
| `src/components/lesson/index.ts` | Modify | Add `export { MarkdownTable } from "./markdown-table"` |
| `src/app/learn/[module]/[slug]/page.tsx` | Modify | Import + add `table: MarkdownTable` to `components` map |

## Interfaces / Contracts

```tsx
// src/components/lesson/markdown-table.tsx
export function MarkdownTable({ children }: { children: React.ReactNode }) { ... }
```

No props beyond standard React children. MDX handles the table structure; MarkdownTable is purely presentational.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Static | Type-check + build | `npm run type-check` && `npm run build` |
| Visual | All 6 affected tables render styled | Manual spot-check: ia lesson02/03/04 + python lesson01 |
| Regression | ComparisonTable/InteractiveTable unchanged | Visual: existing lessons using these components still work |

No test runner configured (`strict_tdd: false`). Build gates are the verification contract.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Rollback: remove the `table` mapping entry + barrel export + delete the file.

## Open Questions

None. All decisions resolved.
