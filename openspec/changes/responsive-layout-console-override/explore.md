## Exploration: responsive-layout-console-override

### Current State

The platform uses a responsive sidebar (AppSidebar) that collapses between 280px and 72px on desktop, with a mobile overlay. The main content area (InVitroShell) transitions padding to accommodate the sidebar width. However, content containers inside use fixed max-width + mx-auto (proyectos, laboratorios, lesson-layout), leaving unused space when the sidebar collapses. Mobile lacks top padding for the floating sidebar button. The console (ConsoleFrame) is used by CodeEditor and OutputPanel; there is no maximize overlay. Notebook actions (NotebookActions) appear at bottom in AssignmentViewer but at top in LabTabs. Ethics module exists with 7 lessons, referenced in dashboard icons and gamification weights. Emojis appear in several component files and dashboard page. All user-facing content is in Spanish but may contain regionalisms. Notebooks (~52) contain English prose and code comments.

### Affected Areas

**WS1: Sidebar Responsive Layout**
- `src/components/layout/AppSidebar.tsx` — sidebar width transitions (line 89)
- `src/components/layout/InVitroShell.tsx` — main padding transitions (line 28)
- `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx` — max-w-4xl mx-auto (line 112)
- `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` — max-w-4xl mx-auto (line 74)
- `src/components/lesson/lesson-layout.tsx` — max-w-7xl mx-auto (line 3)
- `src/app/(dashboard)/proyectos/page.tsx` — max-w-4xl mx-auto (line 49)
- `src/app/(dashboard)/laboratorios/page.tsx` — max-w-[1440px] mx-auto (line 87)
- Mobile: need `pt-14` on main element in InVitroShell.tsx line 28 for floating button.

**WS2: Console Maximize**
- `src/components/editor/ConsoleFrame.tsx` — shared console chrome (line 17)
- `src/components/editor/OutputPanel.tsx` — uses ConsoleFrame (line 21)
- `src/components/editor/CodeEditor.tsx` — uses ConsoleFrame (line 19)
- `src/components/editor/PyodideRunner.tsx` — flex layout (line 117)
- Need Maximize2/Minimize2 button, overlay container, sessionStorage persistence.

**WS3: Proyectos Notebook Buttons at Top**
- `src/components/labs/AssignmentViewer.tsx` — NotebookActions at bottom (line 63)
- `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx` — calls AssignmentViewer
- `src/components/labs/LabTabs.tsx` — NotebookActions at top (line 94) — reference.

**WS4: Remove Ethics Module**
- `src/content/modules/etica/` — entire directory (7 lessons + module.json + notebooks)
- `src/app/(dashboard)/dashboard/page.tsx` — MODULE_ICONS etica: Shield (line 54)
- `src/lib/gamification/utils.ts` — moduleMultipliers etica: 1.0 (line 11)
- `src/lib/gamification/utils.test.ts` — test for etica (line 9)
- `src/lib/content/modules.ts` — dynamic loading (no hardcode) — verify.

**WS5: Emoji Removal + Spanish Neutral**
- `src/components/lesson/diagnostic-trainer.tsx` — emojis (🔥, 📊)
- `src/app/(dashboard)/dashboard/page.tsx` — 👋 (line 193)
- Other component files with emojis (grep results)
- All content in `src/content/modules/**` (lesson.md, lab.md, quiz.md, assignment.md) — need to strip emojis and rewrite in neutral Spanish.

**WS6: Notebook Translation to Spanish**
- ~52 notebooks across python/, ia/, estadistica/, machine-learning/, etica/
- Translate markdown cells and code comments only, keep code intact.
- Each notebook requires careful diff.

### Approaches

**WS1: Sidebar Responsive Layout**
1. **Replace fixed max-w with fluid containers** — Change content containers to use `w-full max-w-none` on mobile, and on desktop use `max-w-prose` or similar that respects sidebar state. Could add a CSS variable for sidebar width and use `calc(100vw - var(--sidebar-width))`. 
   - Pros: Clean, responsive, works with existing Tailwind.
   - Cons: Requires updating each container individually.
   - Effort: Medium.

2. **Use CSS grid with sidebar area** — Restructure layout to use CSS grid where sidebar and main are grid areas. Main automatically takes remaining space.
   - Pros: Most robust, handles all content.
   - Cons: Larger refactor, may break existing padding.
   - Effort: High.

3. **Add a context provider for sidebar width** — Provide sidebar width via React context, main containers read it and adjust max-w accordingly.
   - Pros: Dynamic, centralizes logic.
   - Cons: More complex, adds client component.
   - Effort: Medium-High.

**WS2: Console Maximize**
1. **Add maximize state to ConsoleFrame** — Extend ConsoleFrame with a `maximized` prop, toggle via button in title bar. When maximized, render as fixed overlay (z-40) with full width/height inside main area. Store state in sessionStorage.
   - Pros: Reusable for any console, minimal changes to consumers.
   - Cons: Need to handle ResizeObserver for Monaco editor.
   - Effort: Medium.

2. **Create MaximizeProvider wrapper** — Wrap each console in a provider that manages maximize state, overlay portal, and persistence.
   - Pros: Decouples from ConsoleFrame.
   - Cons: More components, duplication.
   - Effort: Medium.

**WS3: Proyectos Notebook Buttons at Top**
1. **Move NotebookActions inside AssignmentViewer before content** — In AssignmentViewer, render NotebookActions first (as in LabTabs). 
   - Pros: Simple, consistent with labs.
   - Cons: Minimal.

2. **Pass NotebookActions as prop to AssignmentViewer** — Let parent decide placement.
   - Pros: Flexibility.
   - Cons: Overkill.

**WS4: Remove Ethics Module**
1. **Delete directory and remove references** — Delete `src/content/modules/etica/`. Remove etica from MODULE_ICONS and moduleMultipliers. Update test to remove etica line.
   - Pros: Clean removal.
   - Cons: Need to ensure no other dynamic references (like getModules() which reads directory). Since modules.ts reads filesystem, removing directory automatically removes module from list.
   - Effort: Low.

**WS5: Emoji Removal + Spanish Neutral**
1. **Grep and replace emojis** — Use regex to remove all emojis from component files. For content, iterate over .md files and strip emojis using a script. Then rewrite Spanish in neutral register.
   - Pros: Comprehensive.
   - Cons: Time-consuming, risk of breaking formatting.
   - Effort: High.

2. **Create a shared emoji removal utility** — But emojis are in static content, not generated.
   - Cons: Not needed.

**WS6: Notebook Translation to Spanish**
1. **Manual translation notebook by notebook** — Read each .ipynb, parse JSON, translate markdown cells and code comments, write back. Could write a script to extract cells, but translation itself requires human or AI.
   - Pros: Accurate.
   - Cons: Massive effort (52 notebooks). Could batch with AI assistance.
   - Effort: Very High.

2. **Use AI translation in a batch script** — Write a Node script that uses an AI model to translate each cell. But we don't have AI API access.
   - Cons: Not feasible.

### Recommendation

**WS1**: Approach 1 (fluid containers) is sufficient and low risk. Add `pt-14` for mobile.

**WS2**: Approach 1 (maximize state in ConsoleFrame) is clean and reusable.

**WS3**: Approach 1 (move NotebookActions) is straightforward.

**WS4**: Approach 1 (delete directory and references) is safe.

**WS5**: Approach 1 (manual grep and rewrite) but given the scope, we might need to prioritize high-visibility emojis first (dashboard, component copy) and content later.

**WS6**: This is a massive effort. Consider doing a subset (maybe only python notebooks) or using external translation service. Could be a separate SDD change.

### Risks

- **WS1**: Changing max-w may cause content to stretch too wide on large screens. Ensure we keep a reasonable max-width (e.g., max-w-7xl) when sidebar is collapsed.
- **WS2**: z-index conflicts: sidebar is z-50, overlay should be z-40 (below sidebar). Ensure overlay doesn't break Monaco editor layout; need ResizeObserver to trigger layout after maximize.
- **WS3**: Minimal risk; ensure consistent UX with labs.
- **WS4**: Ensure no other references to etica exist (e.g., in progress table, achievements). Deleting module directory may affect existing user progress (they have completed lessons). Need to consider migration: maybe keep progress but hide module. However, the user explicitly wants to remove the module.
- **WS5**: Removing emojis may break visual design (e.g., diagnostic trainer uses emojis as icons). Need to replace with Lucide icons or remove. Content rewrite must preserve technical accuracy.
- **WS6**: Notebook translation may break code if comments contain syntax. Must keep code cells untouched. Could cause merge conflicts if notebooks are large.

### Ready for Proposal

Yes — the exploration is comprehensive. However, WS6 (Notebook Translation) is a massive effort that may warrant a separate SDD change. Recommend splitting into two PRs: one for WS1-WS5, another for WS6.

### Key Learnings

1. Content containers use fixed max-w + mx-auto, causing wasted space when sidebar collapses.
2. Console maximize overlay must be placed below sidebar z-index (z-40 vs z-50).
3. Ethics module removal is safe due to filesystem-based module loading, but user progress may need consideration.
4. Emojis appear in component files (diagnostic-trainer, dashboard) and need replacement with accessible icons.
5. Notebook translation to Spanish is a very large effort (52 notebooks) and may need external tooling.