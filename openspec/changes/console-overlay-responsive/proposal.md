# Proposal: Console Overlay Responsive to Sidebar

## Intent

The maximized console overlay in `ConsoleFrame` uses hardcoded `padding-left` values (`md:pl-[72px] lg:pl-[280px]`) that do not react to the sidebar's collapsed/expanded state or which sidebar is active. This leaves blank space or misaligns the console when the sidebar toggles. The content area outside the console also lacks smooth transitions in some paths. The fix must make both content AND the dev console fully responsive to sidebar collapse/expand on desktop and mobile, with smooth transitions.

## Scope

### In Scope
- Introduce reactive `--sidebar-offset` CSS custom property in each shell wrapper
- Replace hardcoded padding in `ConsoleFrame` maximized overlay with `var(--sidebar-offset)`
- Ensure smooth `transition` on the offset value for both sidebars
- Verify mobile (<md) behavior: both sidebars hidden, offset = 0

### Out of Scope
- New maximize feature (already exists)
- Content language cleanup, ethics-section removal, notebook translation (separate changes)
- CSS Grid full refactor (documented as alternative, not implemented)

## Capabilities

### New Capabilities
- `sidebar-responsive-overlay`: ConsoleFrame overlay and content padding react to sidebar width via CSS custom property

### Modified Capabilities
None — no existing spec changes at the requirement level.

## Approach

**Chosen: CSS Custom Property `--sidebar-offset`**

Each shell wrapper (`InVitroShell`, `learn/layout.tsx`) sets `--sidebar-offset` on its root element to the current sidebar width (0 on mobile; 72px/280px for app shell; 256px/0 for learn layout). `ConsoleFrame`'s maximized overlay reads `padding-left: var(--sidebar-offset, 0px)`. A CSS `transition` on the custom property provides smooth animation.

**Alternative evaluated: CSS Grid refactor** — Replace flex + margin-left with a CSS Grid `grid-template-columns: var(--sidebar-offset) 1fr`. More structurally correct but touches every layout wrapper and risks regressions across all pages. Not justified for this scope.

**Alternative evaluated: React Context/provider** — A `SidebarContext` passes collapsed state to `ConsoleFrame` via props. Adds component-level coupling; the overlay is `fixed` and deeply nested, making prop threading awkward. CSS variable inherits into `fixed` descendants natively.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/editor/ConsoleFrame.tsx` | Modified | Replace hardcoded `pl` with `var(--sidebar-offset)` |
| `src/components/layout/InVitroShell.tsx` | Modified | Set `--sidebar-offset` based on collapsed state, add transition |
| `src/app/learn/layout.tsx` | Modified | Set `--sidebar-offset` based on learn sidebar collapsed state |
| `src/app/globals.css` | Modified | Add `transition` rule for `--sidebar-offset` if not handled inline |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CSS variable not inherited into `fixed` descendants in some browsers | Low | `fixed` elements DO inherit custom properties; verify with Playwright |
| Transition jank on slow machines | Low | Use `will-change: padding-left` or `transition` only on offset |
| Two sidebars setting same variable simultaneously | Medium | Each shell sets it on its own root; only one shell is active per route |

## Rollback Plan

Git revert the single commit. All changes are CSS/layout-only with no data or auth impact.

## Dependencies

None — pure CSS/React layout change.

## Verification

UI behavior confirmed with Playwright only. Do NOT run `npm run build` for this change.

## Success Criteria

- [ ] Maximizing console on app shell pages: overlay respects collapsed (72px) and expanded (280px) sidebar width
- [ ] Maximizing console on learn pages: overlay respects collapsed (0px) and expanded (256px) sidebar width
- [ ] Mobile (<md): overlay has 0px left padding regardless of route
- [ ] Sidebar toggle produces smooth transition on both content and overlay
- [ ] No blank space visible when sidebar collapses or expands

## What to Save

Write the proposal to: `openspec/changes/console-overlay-responsive/proposal.md`
Also save to Engram with topic_key: `sdd/console-overlay-responsive/proposal`, project: `invitro-code`, type: `architecture`
