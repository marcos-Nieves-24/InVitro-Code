# Technical Design: Responsive Layout & Console Maximize

## 1. Technical Approach

### WS1: Sidebar-Responsive Content Layout

The current layout uses `padding-left` transitions on `<main>` in `InVitroShell.tsx` (`md:pl-[72px]` / `md:pl-[280px]`) which works, but content containers inside children use fixed `max-w-4xl mx-auto` (proyectos detail), `max-w-7xl mx-auto` (lesson-layout), and `max-w-[1440px] mx-auto` (laboratorios). These create dead whitespace when the sidebar collapses because `mx-auto` centers the content regardless of available width.

**Approach**: Introduce a CSS custom property `--sidebar-width` set via inline style on `<main>` in `InVitroShell.tsx`. Remove `max-w-* mx-auto` from page-level containers and replace with fluid `w-full px-6` plus a content-max constraint via `max-w-screen-2xl` (1536px) or a design token. The sidebar transition already animates `padding-left` over 300ms; the CSS variable approach lets child containers read the value via `calc(100vw - var(--sidebar-width))` if needed, but in practice the padding-based approach is sufficient and simpler — no variable plumbing needed.

On mobile, add `pt-14` to `<main>` to clear the floating hamburger button (z-[60]). The desktop sidebar is fixed-position with `z-50`, so `<main>` just needs its existing `pl-[sidebar-width]` padding.

For Monaco `automaticLayout: true` is already set in `CodeEditor.tsx`, which uses a built-in ResizeObserver. Since the sidebar toggle changes the container width via CSS padding transition, Monaco will auto-detect and re-layout. No manual dispatch needed — the `automaticLayout` option handles this.

### WS2: Console Maximize Overlay

Extend `ConsoleFrame.tsx` with a `maximized` boolean prop and internal state. When maximized, the component wraps its outer div in a fixed-position overlay (`fixed inset-0 z-40`) with a semi-transparent backdrop. The `z-40` layer sits below the sidebar (`z-50`) so the sidebar remains interactive, and above the mobile backdrop (`z-40 bg-deep-navy/30` — we need to bump mobile backdrop to `z-30` to avoid conflict).

Add a `Maximize2` / `Minimize2` Lucide icon toggle button in the title bar action area. Persist `maximized` state in `sessionStorage` keyed by a stable component identifier (e.g., `console-maximized-{title}`). Read on mount, write on toggle.

The parent `PyodideRunner.tsx` renders `CodeEditor` and `OutputPanel` in a `flex-col lg:flex-row` grid. When one panel is maximized, it breaks out of this flow via the fixed overlay, so `PyodideRunner` itself needs no layout changes — the maximized panel simply removes itself from flow and covers the viewport.

### WS3: NotebookActions Placement

Move `NotebookActions` from below the MDX content to above it in `AssignmentViewer.tsx`. Currently at line 64 (after the prose div), move to before line 58 (before the prose div). This matches `LabTabs.tsx` pattern where NotebookActions sits in the tab-bar header. No prop changes needed — `AssignmentViewer` already receives `mod`, `lesson`, and `hasNotebook`.

### WS4: Ethics Module Removal

The module loading in `src/lib/content/modules.ts` is entirely filesystem-driven — `getModules()` reads directory entries from `src/content/modules/`. Deleting the `etica/` directory automatically removes it from all dynamic lists (learn sidebar, dashboard modules, lesson counts). Only three hardcoded references need explicit removal:

1. `MODULE_ICONS` in `dashboard/page.tsx` — delete the `etica: Shield` entry
2. `moduleMultipliers` in `lib/gamification/utils.ts` — delete the `"etica": 1.0` entry
3. Test assertion in `lib/gamification/utils.test.ts` — remove the `etica` line from the "standard modules" test

Existing user progress rows in the `progress` table with `module_slug = 'etica'` become orphaned but harmless — they won't surface anywhere since the module no longer appears in navigation or dashboards. No migration needed per explicit user request.

### WS5: Emoji Removal & Neutral Spanish

**Component emojis** (5 occurrences found): Replace with Lucide icons or contextual text:
- `diagnostic-trainer.tsx:420` — `🔥` (streak) → `Flame` Lucide icon (already imported elsewhere in codebase)
- `diagnostic-trainer.tsx:485` — `📊` (diagnosis result) → `BarChart3` Lucide icon
- `conidia-sort-game.tsx:121` — `🔥` (streak) → `Flame` Lucide icon
- `dashboard/page.tsx:193` — `👋` (greeting) → remove entirely (text is sufficient)
- `interactive-table.tsx:203` — regex strip pattern (utility, not rendered emoji) — no change needed

**Content emojis**: Grep `src/content/modules/**` for emoji Unicode ranges. Remove from MDX text, preserving any emoji used in headings that serve as section markers (replace with Lucide icons via MDX component mapping).

**Neutral Spanish**: Scan component strings for regionalisms. Key candidates: "dale" (if present), "chevere", "bacano". Replace with neutral equivalents. The codebase already uses fairly neutral Spanish — this is mostly a content-layer pass.

## 2. Architecture Decisions

| Choice | Alternatives | Rationale |
|---|---|---|
| **WS1: Padding-based sidebar width** (keep existing `pl-[sidebar-width]`) | CSS variable `--sidebar-width` + `calc()` in children; CSS Grid refactor | Padding approach is already implemented and working. CSS variable adds plumbing complexity for marginal benefit. Grid refactor is overkill for this scope. |
| **WS2: Extend ConsoleFrame in-place** | New wrapper component `MaximizableConsole`; Provider-based state | ConsoleFrame is the shared chrome — extending it keeps the API simple. Wrapper adds a layer for no reason. Provider adds complexity for a single toggle. |
| **WS2: z-40 for overlay** | z-30 (below mobile backdrop); z-60 (above sidebar) | z-40 keeps overlay below sidebar (z-50) so sidebar stays interactive. Must bump mobile backdrop from z-40 to z-30 to avoid stacking conflict. |
| **WS3: Move NotebookActions before content** | Prop-based slot placement; context-based | Simple move matches LabTabs pattern exactly. Props add flexibility that isn't needed. |
| **WS4: Delete directory + manual reference cleanup** | DB migration to hide module; keep directory but exclude from nav | Filesystem loading means deletion is clean. DB migration is over-engineering for an explicit removal request. Orphaned progress rows are harmless. |
| **WS5: Lucide icons for emoji replacement** | SVG custom icons; plain text removal | Lucide is already the project icon library. Custom SVGs add maintenance. Plain text removal works where emoji was decorative, not functional. |

## 3. File Changes

| File | Action | Description |
|---|---|---|
| `src/components/layout/InVitroShell.tsx` | Edit | Add `pt-14 md:pt-0` to `<main>` for mobile floating button clearance |
| `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx` | Edit | Replace `max-w-4xl mx-auto` with `w-full max-w-screen-2xl mx-auto` |
| `src/app/(dashboard)/proyectos/page.tsx` | Edit | Same max-w fluid replacement |
| `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` | Edit | Same max-w fluid replacement |
| `src/app/(dashboard)/laboratorios/page.tsx` | Edit | Replace `max-w-[1440px] mx-auto` with fluid |
| `src/components/lesson/lesson-layout.tsx` | Edit | Replace `max-w-7xl mx-auto` with `w-full max-w-screen-2xl mx-auto` |
| `src/components/editor/ConsoleFrame.tsx` | Edit | Add `maximized` state, fixed overlay rendering, Maximize2/Minimize2 toggle, sessionStorage persistence |
| `src/components/layout/AppSidebar.tsx` | Edit | Bump mobile backdrop from `z-40` to `z-30` to avoid conflict with console overlay |
| `src/components/labs/AssignmentViewer.tsx` | Edit | Move `NotebookActions` from after content to before content |
| `src/content/modules/etica/` | Delete | Entire directory (7 lessons + module.json + notebooks) |
| `src/app/(dashboard)/dashboard/page.tsx` | Edit | Remove `etica: Shield` from MODULE_ICONS; remove `👋` emoji |
| `src/lib/gamification/utils.ts` | Edit | Remove `"etica": 1.0` from moduleMultipliers |
| `src/lib/gamification/utils.test.ts` | Edit | Remove `etica` assertion from standard modules test |
| `src/components/lesson/diagnostic-trainer.tsx` | Edit | Replace `🔥` with `<Flame />`, `📊` with `<BarChart3 />` |
| `src/components/lesson/conidia-sort-game.tsx` | Edit | Replace `🔥` with `<Flame />` |
| `src/components/lesson/interactive-table.tsx` | Edit | Remove emoji from regex strip pattern (or leave as utility) |

## 4. Interfaces / Contracts

### ConsoleFrame (new props)

```typescript
interface ConsoleFrameProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  maximized?: boolean;           // NEW: controlled maximize state
  onMaximizeToggle?: () => void; // NEW: callback for parent
}
```

### sessionStorage Key

```
console-maximized-{title}  →  "true" | "false"
```

### CSS Token Addition (globals.css)

No new tokens needed — existing `--width-layout-max` (920px) covers prose content. Wider containers (trainers, labs) use Tailwind's `max-w-screen-2xl` (1536px) which is a framework default.

## 5. Testing Strategy

| Area | Verification |
|---|---|
| **WS1** | Visual: sidebar toggle fills content without whitespace at 1440px, 1920px, and mobile. `npm run build` passes. No horizontal scroll. |
| **WS2** | Functional: maximize button toggles overlay; sidebar remains clickable; `sessionStorage` persists across navigation; ResizeObserver triggers Monaco re-layout. |
| **WS3** | Visual: Proyectos page shows NotebookActions above content; hidden when no notebook. Matches LabTabs placement. |
| **WS4** | `npm run type-check` passes. `grep -r "etica" src/` returns only orphaned DB references (progress table). `npm run build` succeeds. |
| **WS5** | `grep -r '[🔥📊👋🚀💡🎯🎓🔬🧬🧪📝✅❌⚙️🌟⭐💡📊🔍📈🧠]' src/components/` returns zero matches. No emoji in MDX content files. |
| **Full** | `npm run build` clean. No TypeScript errors. No broken imports. |

## 6. Migration / Rollout

### Phase 1 (WS1 + WS3 — low risk, independent)
- InVitroShell mobile padding + page container fluid widths
- AssignmentViewer NotebookActions repositioning
- PR: `fix(layout): fluid content containers and top notebook actions`

### Phase 2 (WS4 — deletion, irreversible)
- Delete `etica/` directory, remove hardcoded references
- PR: `feat(content): remove ethics module`
- Note: Orphaned progress rows in DB are intentional — no migration needed.

### Phase 3 (WS5 — content cleanup)
- Emoji replacement in components, then content files
- PR: `feat(content): remove emojis and neutralize Spanish`

### Phase 4 (WS2 — new feature, highest complexity)
- ConsoleFrame maximize overlay, sessionStorage, z-index coordination
- PR: `feat(editor): console maximize overlay`

Each phase is independently revertable via git revert per the proposal's rollback plan.
