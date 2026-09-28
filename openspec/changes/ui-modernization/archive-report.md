# Archive Report — UI Modernization

## Summary
Complete UI modernization of InVitro-Code platform: token unification, widget shadows, transitions, layout organization, sidebar accordion, and hero refactor.

## Status: ✅ Complete

## Changes Applied

### F0 — Freeze tokens
- Unified 9 hex values in globals.css to match DESIGN.md §1.1
- Added --shadow-xs and --shadow-widget-hover tokens

### F1 — Widget shadows
- Card.tsx: default shadow-sm, interactive hover:shadow-md + translateY(-2px)
- glass-card: transition + hover state
- StreakBadge: subtler border/bg

### F2 — Transitions
- Added .widget-hover, .btn-press, .link-arrow, .accordion-panel utility classes
- Button.tsx: transition-all + btn-press
- XPBar/ModuleProgress: tightened animation durations

### F3 — Layout organization
- Consistent spacing: px-6 py-8 md:px-10 across dashboard and learn
- Grid gaps standardized to gap-6
- Section rhythm: space-y-12

### F4 — Sidebar accordion
- 4 macrogrupos = 4 módulos with accordion behavior
- Hover opens on desktop, click/tap/keyboard on all devices
- aria-expanded/controls, aria-current="page"
- Grid-rows animation via .accordion-panel CSS class

### F5 — Hero refactor
- HeroBanner.tsx is now the single hero source
- Dashboard page uses <HeroBanner> instead of inline hero
- Progress bars unified: gradient from-fog to-mint

## Files Modified
- src/app/globals.css
- src/components/ui/Card.tsx
- src/components/ui/Button.tsx
- src/components/gamification/XPBar.tsx
- src/components/gamification/ModuleProgress.tsx
- src/components/gamification/StreakBadge.tsx
- src/components/learn/Sidebar.tsx
- src/components/dashboard/HeroBanner.tsx
- src/app/(dashboard)/dashboard/page.tsx
- src/app/learn/page.tsx
- src/app/learn/layout.tsx

## Verification
- npm run type-check: ✅ passes
- npm run build: ✅ passes (18/18 pages generated)
- Playwright: all 9 routes load without errors

## Rollback
Each phase is independent. To rollback a specific phase, revert the files modified in that phase only.
