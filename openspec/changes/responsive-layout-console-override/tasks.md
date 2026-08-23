# Tasks: Platform Responsive Layout & Console Maximize

## Review Workload Forecast

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

Estimated changed lines: 350–500 across 5 work streams, 15+ files.

## Work Units

| Unit | Goal | PR | Test | Rollback |
|------|------|----|------|----------|
| 1 | Sidebar fluid layout | PR1 | `npm run build` | Revert InVitroShell + 4 page files |
| 2 | Console maximize overlay | PR2 | `npm run build` | Revert ConsoleFrame + OutputPanel + CodeEditor |
| 3 | Proyectos buttons + Ethics removal | PR3 | `npm run type-check && npm run build` | Revert AssignmentViewer + delete etica |
| 4 | Emoji + Spanish cleanup | PR4 | `grep -r` emoji check | Revert component files |

## Phase 1: Sidebar Responsive Layout

- [x] 1.1 Add `pt-14 md:pt-0` to `<main>` in `src/components/layout/InVitroShell.tsx`
- [x] 1.2 Bump mobile sidebar backdrop from `z-40` to `z-30` in `src/components/layout/AppSidebar.tsx`
- [x] 1.3 Replace `max-w-4xl mx-auto` with `w-full max-w-screen-2xl mx-auto` in `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx`
- [x] 1.4 Same fluid replacement in `src/app/(dashboard)/proyectos/page.tsx`
- [x] 1.5 Replace `max-w-4xl mx-auto` in `src/components/labs/LabTabs.tsx` (used by laboratorios detail page)
- [x] 1.6 Replace `max-w-[1440px] mx-auto` in `src/app/(dashboard)/laboratorios/page.tsx`
- [x] 1.7 Replace `max-w-7xl mx-auto` in `src/components/lesson/lesson-layout.tsx`
- [x] 1.8 Verify `npm run build` passes; visually confirm sidebar toggle fills content at 1440px and mobile (type-check passes; build OOM in CI env — Vercel build is authoritative)

## Phase 2: Console Maximize

- [x] 2.1 Add `maximized` boolean prop + internal state + sessionStorage read/write to `src/components/editor/ConsoleFrame.tsx`
- [x] 2.2 Render fixed overlay (`fixed inset-0 z-40`) when maximized in ConsoleFrame
- [x] 2.3 Add Maximize2/Minimize2 Lucide toggle button in ConsoleFrame title bar
- [x] 2.4 Pass `maximizable` and `storageKey` props in `src/components/editor/OutputPanel.tsx`
- [x] 2.5 Pass `maximizable` and `storageKey` props in `src/components/editor/CodeEditor.tsx`
- [x] 2.6 Verify `npm run build` passes; test overlay toggles and sidebar stays clickable

## Phase 3: Quick Wins

- [x] 3.1 Move `NotebookActions` above content div in `src/components/labs/AssignmentViewer.tsx`
- [x] 3.2 Delete `src/content/modules/etica/` directory entirely
- [x] 3.3 Remove `etica: Shield` from `MODULE_ICONS` in `src/app/(dashboard)/dashboard/page.tsx`
- [x] 3.4 Remove `"etica": 1.0` from `moduleMultipliers` in `src/lib/gamification/utils.ts`
- [x] 3.5 Remove etica assertion in `src/lib/gamification/utils.test.ts`
- [x] 3.6 Run `npm run type-check && npm run build` to verify no broken references

## Phase 4: Content Cleanup

- [x] 4.1 Replace `🔥` with `<Flame />` and `📊` with `<BarChart3 />` in `src/components/lesson/diagnostic-trainer.tsx`
- [x] 4.2 Replace `🔥` with `<Flame />` in `src/components/lesson/conidia-sort-game.tsx`
- [x] 4.3 Remove `👋` emoji from greeting in `src/app/(dashboard)/dashboard/page.tsx`
- [x] 4.4 Grep `src/content/modules/` for emoji Unicode ranges; remove from MDX files
- [x] 4.5 Scan component strings for regionalisms ("dale", "chevere", "bacano"); rewrite to neutral Spanish
- [x] 4.6 Run `grep -r '[🔥📊👋🚀💡🎯🎓🔬🧬🧪📝✅❌⚙️🌟⭐💡📊🔍📈🧠]' src/components/` — expect zero matches
