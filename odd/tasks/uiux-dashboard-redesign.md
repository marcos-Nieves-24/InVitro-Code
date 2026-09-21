# Feature: UI/UX Dashboard Redesign

## Objective
Transform InVitro-Code's dashboard, navigation, card system, and motion design to SaaS-level quality (Vercel/Stripe/Linear tier).

## Problem
- Dashboard hero uses heavy Three.js 3D model (GLB) causing slow load and large bundle
- Sidebar has 11 flat nav items without visual grouping
- Card system fragmented: CSS `.glass-card` + `Card.tsx` component
- Framer Motion installed but unused; scroll reveal is hand-rolled IntersectionObserver
- No page transitions, no AnimatePresence

## Scope
- Dashboard hero: replace 3D with SVG illustration + anime background
- Sidebar: group nav items into visual sections
- Cards: unify into single component with variants
- Motion: Framer Motion for page transitions and scroll reveals
- Radix UI: tooltips for collapsed sidebar

## Constraints
- Don't break existing functionality
- Don't change business logic
- Every change must have UX/UI justification
- Spanish content, English code
- Respect `prefers-reduced-motion`

## Tasks

### T1: Copy assets + install dependencies
- [ ] Copy `cientifica 1.svg` → `public/dashboard/cientifica-1.svg`
- [ ] Copy `dashboard-fondo-anime.png` → `public/dashboard/dashboard-fondo-anime.png`
- [ ] `npm install @radix-ui/react-tooltip @radix-ui/react-dialog`
- **Files**: package.json, public/dashboard/
- **Estimated lines**: ~5 (package.json changes)

### T2: Replace 3D hero with SVG + anime background
- [ ] Rewrite `DashboardHero3D.tsx` — replace Canvas with `<Image src="/dashboard/cientifica-1.svg">`
- [ ] Update `HeroBanner.tsx` — background to `dashboard-fondo-anime.png`, adjust overlay
- [ ] Simplify `DashboardHero3DWrapper.tsx` — remove dynamic import, render SVG directly
- **Files**: DashboardHero3D.tsx, HeroBanner.tsx, DashboardHero3DWrapper.tsx
- **Estimated lines**: ~80 deletions, ~40 additions

### T3: Group sidebar nav items
- [ ] Refactor `NAV_ITEMS` into sections: Aprender, Progreso, Social, Cuenta
- [ ] Add section labels and visual separators
- **Files**: AppSidebar.tsx
- **Estimated lines**: ~30 additions

### T4: Unify card system
- [ ] Add `variant="glass"` to `Card.tsx` using `.glass-card` styles
- [ ] Update usages of `.glass-card` to use Card component
- **Files**: Card.tsx, globals.css, components using glass-card
- **Estimated lines**: ~20 additions, ~10 deletions

### T5: Integrate Framer Motion
- [ ] `template.tsx`: Add `AnimatePresence` + `motion.div` for page transitions
- [ ] `Reveal.tsx`: Rewrite with `useInView` from Framer Motion
- [ ] Respect `prefers-reduced-motion`
- **Files**: template.tsx, Reveal.tsx, useScrollReveal.ts
- **Estimated lines**: ~40 additions, ~20 deletions

### T6: Add Radix tooltips
- [ ] Wrap sidebar nav items with `<Tooltip>` for collapsed mode
- **Files**: AppSidebar.tsx
- **Estimated lines**: ~30 additions

## Acceptance Criteria
- [ ] Dashboard loads without Three.js bundle
- [ ] SVG scientist illustration displays correctly at all viewports
- [ ] Anime background renders with proper contrast
- [ ] Sidebar items grouped into 4 sections with labels
- [ ] Card component supports `variant="glass"`
- [ ] Page transitions animate on navigation
- [ ] Scroll reveals use Framer Motion
- [ ] Tooltips appear on sidebar hover in collapsed mode
- [ ] `npm run type-check` passes
- [ ] `npm run build` passes
- [ ] `prefers-reduced-motion` disables all animations

## Delivery Strategy
- auto-chain (PRs split automatically if >400 lines)
- Chain strategy: stacked-to-main

## Progress
- [x] T1: Copy assets + install Radix UI
- [x] T2: Replace 3D hero
- [x] T3: Group sidebar
- [x] T4: Unify cards
- [x] T5: Framer Motion
- [x] T6: Radix tooltips
