# Tasks: Console Overlay Responsive to Sidebar

## Review Workload Forecast

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

Estimated changed lines: 40–60 across 4 files.

## Work Units

| Unit | Goal | PR | Test | Rollback |
|------|------|----|------|----------|
| 1 | CSS default + overlay update | PR1 | `npm run type-check` | Revert globals.css + ConsoleFrame |
| 2 | Shell + sidebar effects | PR1 | Playwright lab + learn pages | Revert InVitroShell + Sidebar |
| 3 | Playwright verification | PR1 | `npx playwright test` | N/A — test-only |

## Phase 1: CSS Foundation

- [x] 1.1 Add `:root { --sidebar-offset: 0px; }` default to `src/app/globals.css` after imports
- [ ] 1.2 Verify no Tailwind conflicts with new custom property via `npm run type-check`

## Phase 2: Overlay Update

- [x] 2.1 In `src/components/editor/ConsoleFrame.tsx`, replace `p-4 md:pl-[72px] lg:pl-[280px]` with `py-4 pr-4` plus inline `style={{ paddingLeft: "var(--sidebar-offset, 0px)", transition: "padding-left 300ms ease-in-out" }}`
- [ ] 2.2 Confirm overlay renders at 0px offset on fresh load (no flash)

## Phase 3: Reactive Sidebars

- [x] 3.1 In `src/components/layout/InVitroShell.tsx`, add `useEffect` that sets `--sidebar-offset` on `document.documentElement` from `collapsed` state + `matchMedia("(min-width: 768px)")` — 72px collapsed / 280px expanded / 0px mobile — with listener cleanup
- [x] 3.2 In `src/components/learn/Sidebar.tsx`, add `useEffect` that sets `--sidebar-offset` on `document.documentElement` from `desktopCollapsed` state + `matchMedia("(min-width: 1024px)")` — 0px collapsed / 256px expanded / 0px mobile — with listener cleanup

## Phase 4: Verification

- [ ] 4.1 Navigate to `/laboratorios`, toggle sidebar, maximize console, verify overlay padding matches expanded (280px) and collapsed (72px) state; no horizontal scroll
- [ ] 4.2 Navigate to `/learn` (or a learn page), toggle sidebar, maximize console, verify overlay padding matches expanded (256px) and collapsed (0px) state; no horizontal scroll
- [ ] 4.3 Resize viewport below 768px, maximize console, verify 0px left padding on any page
