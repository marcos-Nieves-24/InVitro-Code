# Tasks — design-system-rollout

> Execution: auto | PR strategy: ask-on-risk | Budget: 800 lines/PR. Each phase = one work-unit commit. Verify with `npm run type-check` + Playwright screenshot per phase.

## 1. Tokens (foundation — Phase 1)
- [ ] 1.1 Replace Material 3 palette in `src/app/globals.css` `@theme` with DESIGN.md §1.1 tokens (ink, graphite, slate, storm, fog, mint, surface, surface-card, surface-raised)
- [ ] 1.2 Add spacing (`--space-xs`..`--space-3xl`), radius (`--radius-sm`..`--radius-full`), shadow (`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`) tokens per §1.3–1.4
- [ ] 1.3 Fix `src/app/layout.tsx` fonts: Inter (`--font-body`), Space Grotesk (`--font-display`), JetBrains Mono (`--font-mono`); remove DM_Sans/Plus_Jakarta_Sans
- [ ] 1.4 Remove old Material 3 vars (`--color-primary`, `--color-tertiary`, `--color-surface-container*`, `--color-on-surface*`, `--color-outline*`, `--color-deep-navy`, `--color-xp-*`, `--color-hero-*`, `--color-glass-*`, `--color-brand*`, `--color-teal-*`) after confirming no references remain

## 2. UI Core (Phase 2)
- [ ] 2.1 Restyle `src/components/ui/Button.tsx` (mint primary, fog secondary, graphite ghost)
- [ ] 2.2 Restyle `src/components/ui/Card.tsx` (surface-card bg, surface-raised border, shadow-md)
- [ ] 2.3 Restyle `src/components/ui/Callout.tsx` (fog/mint accent, surface-raised bg)
- [ ] 2.4 Restyle `src/components/ui/EmptyState.tsx` (storm text, mint CTA)
- [ ] 2.5 Restyle `src/components/ui/SiteHeader.tsx` (graphite dark public header)
- [ ] 2.6 Restyle `src/components/ui/PageShell.tsx` (width-content 920px)
- [ ] 2.7 Create `src/components/ui/Skeleton.tsx` (card/row/text/circle/shimmer variants, pulse)

## 3. Layout + TopBar (Phase 3)
- [x] 3.1 Restyle `src/components/layout/AppSidebar.tsx` (graphite bg, mint active, storm/fog text)
- [x] 3.2 Restyle `src/components/layout/InVitroShell.tsx` (surface bg, integrate InVitroTopBar)
- [x] 3.3 Restyle `src/components/layout/InVitroTopBar.tsx` (mint XP pill, fog/storm streak, storm breadcrumb, sticky)

## 4. Landing (Phase 4)
- [x] 4.1 Rewrite `src/app/page.tsx` hero: ink bg + terminal typing, REMOVE `.hero-neural-*` markup/classes
- [x] 4.2 Restyle modules grid (surface-card cards, mint hover, storm slug eyebrow) per §4.1
- [x] 4.3 Remove `.hero-neural-*` keyframes/classes from `globals.css`

## 5. Dashboard + Routes (Phase 5)
- [ ] 5.1 Restyle `src/app/(dashboard)/dashboard/page.tsx` (Mint CTA, ring mint glow, module bars, logros) + use InVitroTopBar
- [ ] 5.2 Restyle `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` (surface card, mint/ink)
- [ ] 5.3 Restyle `src/app/learn/page.tsx` (glass cards, mint accents)
- [ ] 5.4 Restyle `src/app/learn/[module]/[slug]/page.tsx` (sidebar + carousel, new palette)
- [ ] 5.5 Restyle laboratorios / proyectos / niveles / logros / comunidad route pages

## 6. Animations (Phase 6)
- [ ] 6.1 Add `@keyframes` (fade-in, reveal, skeleton-pulse) + `.is-visible` to `globals.css`
- [ ] 6.2 Create `src/hooks/useScrollReveal.ts` (IntersectionObserver, reduced-motion aware)
- [ ] 6.3 Apply page fade-in to route `<main>` wrappers
- [ ] 6.4 Extend `@media (prefers-reduced-motion: reduce)` to cover all new animations
- [ ] 6.5 Keep terminal typing + cursor blink, retheme to ink/mint

## 7. Gamification (Phase 7)
- [ ] 7.1 Restyle `XPBar.tsx` (mint fill, surface-raised track, skeleton)
- [ ] 7.2 Restyle `StreakBadge.tsx` (fog badge, flame)
- [ ] 7.3 Restyle `LevelBadge.tsx` (mint ring glow, ink text)
- [ ] 7.4 Restyle `ModuleProgress.tsx` (mint/fog bars)
- [ ] 7.5 Restyle `AchievementCard.tsx` (surface-card, storm lock, mint unlock)

## 8. Lesson / Labs / Editor (Phase 8)
- [ ] 8.1 Restyle lesson components (~25): code-block, concept-card, callout-info/check, mascot-message, lesson-carousel, section, answer-reveal, badge, celebration-overlay, comparison/interactive/markdown-table, lab-progress, reflection-check + trainers
- [ ] 8.2 Restyle labs components (12): LabHub, LabCard, LabTabs, LabRunner, LabCodeBlock, LabHeader, LabCallout, QuizRunner, ReflectionPrompt, AssignmentViewer, NotebookActions
- [ ] 8.3 Restyle editor components (5): CodeEditor, ConsoleFrame, OutputPanel, PyodideRunner, VisualizationPanel (ink console, mint prompt)
