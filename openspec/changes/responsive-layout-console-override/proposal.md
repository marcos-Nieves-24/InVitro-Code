# Proposal: Platform Responsive Layout & Console Maximize

## Intent

InVitro-Code's sidebar collapse/expand leaves whitespace because content containers use fixed max-width + mx-auto. The dev console (ConsoleFrame) has no maximize capability. Notebook actions in Proyectos are at bottom instead of top. The Ethics module needs removal. Emojis need stripping and Spanish needs neutralization.

## Scope

### In Scope (WS1-WS5)
- WS1: Fix sidebar-responsive content layout (InVitroShell, content containers, mobile padding, Monaco ResizeObserver)
- WS2: Console maximize overlay (ConsoleFrame extension, sessionStorage, z-40 overlay)
- WS3: Proyectos notebook buttons at top (AssignmentViewer restructure)
- WS4: Ethics module removal (directory + references)
- WS5: Emoji removal + neutral Spanish (components + content)

### Out of Scope
- WS6: Notebook translation to Spanish (separate SDD change — ~52 notebooks)

## Capabilities
- `responsive-sidebar`: Fluid content containers that fill space when sidebar collapses/expands
- `console-maximize`: Overlay maximize for dev console panels
- `project-notebook-actions`: Consistent notebook action placement
- `ethics-module-removal`: Remove Ethics module from platform
- `content-language-cleanup`: Emoji removal + neutral Spanish text

## Approach

### WS1: Sidebar Responsive Layout
Replace fixed `max-w-*` containers with fluid `w-full max-w-none` on mobile. On desktop, use `max-w-7xl` or similar that respects sidebar state. Add `pt-14` on mobile main element for floating sidebar button. CSS variable for sidebar width via `calc(100vw - var(--sidebar-width))`.

**Tradeoffs**: Approach 1 (fluid containers) is sufficient and low risk. CSS grid refactor (Approach 2) is more robust but larger scope. Context provider (Approach 3) adds complexity for marginal benefit.

### WS2: Console Maximize
Extend ConsoleFrame with `maximized` state, toggle via Maximize2/Minimize2 button in title bar. When maximized, render as fixed overlay (z-40) within main area. Store state in sessionStorage for persistence.

**Tradeoffs**: Maximize state in ConsoleFrame (Approach 1) is clean and reusable. Provider wrapper (Approach 2) decouples but adds duplication. Recommend Approach 1.

### WS3: Proyectos Notebook Buttons at Top
Move NotebookActions inside AssignmentViewer before content, matching LabTabs placement.

**Tradeoffs**: Minimal risk. Prop-based placement (Approach 2) adds flexibility but is overkill. Recommend Approach 1.

### WS4: Remove Ethics Module
Delete `src/content/modules/etica/` directory. Remove etica from MODULE_ICONS and moduleMultipliers. Update test to remove etica line. Filesystem-based module loading means no dynamic references to break.

**Tradeoffs**: User progress for completed Ethics lessons will be orphaned. However, explicit user request to remove module. Migration could keep progress table entries but hide module from navigation.

### WS5: Emoji Removal + Spanish Neutral
Script-based emoji grep + manual neutral Spanish rewrite. Prioritize high-visibility emojis first (dashboard, component copy) and content later.

**Tradeoffs**: Removing emojis may break visual design (diagnostic-trainer uses emojis as icons). Need to replace with Lucide icons or remove. Content rewrite must preserve technical accuracy.

## Affected Areas (with paths)

**WS1: Sidebar Responsive Layout**
- `src/components/layout/AppSidebar.tsx` — sidebar width transitions
- `src/components/layout/InVitroShell.tsx` — main padding transitions
- `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx` — max-w-4xl mx-auto
- `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` — max-w-4xl mx-auto
- `src/components/lesson/lesson-layout.tsx` — max-w-7xl mx-auto
- `src/app/(dashboard)/proyectos/page.tsx` — max-w-4xl mx-auto
- `src/app/(dashboard)/laboratorios/page.tsx` — max-w-[1440px] mx-auto
- Mobile: need `pt-14` on main element in InVitroShell.tsx

**WS2: Console Maximize**
- `src/components/editor/ConsoleFrame.tsx` — shared console chrome
- `src/components/editor/OutputPanel.tsx` — uses ConsoleFrame
- `src/components/editor/CodeEditor.tsx` — uses ConsoleFrame
- `src/components/editor/PyodideRunner.tsx` — flex layout

**WS3: Proyectos Notebook Buttons at Top**
- `src/components/labs/AssignmentViewer.tsx` — NotebookActions at bottom
- `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx` — calls AssignmentViewer
- `src/components/labs/LabTabs.tsx` — NotebookActions at top (reference)

**WS4: Remove Ethics Module**
- `src/content/modules/etica/` — entire directory (7 lessons + module.json + notebooks)
- `src/app/(dashboard)/dashboard/page.tsx` — MODULE_ICONS etica: Shield
- `src/lib/gamification/utils.ts` — moduleMultipliers etica: 1.0
- `src/lib/gamification/utils.test.ts` — test for etica
- `src/lib/content/modules.ts` — dynamic loading (verify no hardcode)

**WS5: Emoji Removal + Spanish Neutral**
- `src/components/lesson/diagnostic-trainer.tsx` — emojis (🔥, 📊)
- `src/app/(dashboard)/dashboard/page.tsx` — 👋
- Other component files with emojis (grep results)
- All content in `src/content/modules/**` (lesson.md, lab.md, quiz.md, assignment.md)

## Risks

- **WS1**: Changing max-w may cause content to stretch too wide on large screens. Ensure reasonable max-width (e.g., max-w-7xl) when sidebar is collapsed.
- **WS2**: z-index conflicts: sidebar is z-50, overlay should be z-40 (below sidebar). Ensure overlay doesn't break Monaco editor layout; need ResizeObserver to trigger layout after maximize.
- **WS3**: Minimal risk; ensure consistent UX with labs.
- **WS4**: User progress for completed Ethics lessons will be orphaned. Deleting module directory may affect existing user progress (they have completed lessons). Need to consider migration: maybe keep progress but hide module. However, the user explicitly wants to remove the module.
- **WS5**: Removing emojis may break visual design (e.g., diagnostic trainer uses emojis as icons). Need to replace with Lucide icons or remove. Content rewrite must preserve technical accuracy.

## Rollback Plan

Git revert per PR since delivery is stacked-to-main. Each workstream is independent and can be reverted separately without affecting others.

## Success Criteria

- [ ] Sidebar collapse/expand fills content area without whitespace
- [ ] Console maximize works as overlay, z-index below sidebar
- [ ] Proyectos notebook buttons match LabTabs placement
- [ ] Ethics module completely removed with no broken references
- [ ] No emojis in components or content
- [ ] Spanish text is neutral (no regionalisms)

## What to Save

Write the proposal to: `openspec/changes/responsive-layout-console-override/proposal.md`
Also save to engram with topic_key: `sdd/responsive-layout-console-override/proposal`, project: `invitro-code`, type: `architecture`
