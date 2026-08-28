# Proposal: Design System Rollout — "Laboratorio Digital"

## Intent

The platform has a partial, inconsistent prior attempt at theming: Material 3 tokens remain in `globals.css`, body font is DM_Sans (SHOULD be Inter), and the landing page includes a neural-network hero that DESIGN.md §4.1 explicitly removes. This change completes and corrects the rollout of the DESIGN.md "Laboratorio Digital" design system across all routes, components, and tokens.

## Scope

### In Scope
- Replace Material 3 palette with DESIGN.md tokens (ink, graphite, slate, storm, fog, mint, surface, surface-card, surface-raised)
- Add spacing, radius, shadow CSS custom properties per §1.3–1.4
- Fix fonts: Inter body (`--font-body`), Space Grotesk display (`--font-display`), JetBrains Mono mono
- Restyle all UI components (Button, Card, Callout, EmptyState, SiteHeader, PageShell) + add Skeleton
- Restyle layout shell: AppSidebar (graphite bg), InVitroTopBar (mint/ink tokens, sticky), InVitroShell
- Rewrite landing page hero: dark ink bg + terminal typing, REMOVE neural-network background
- Restyle all gamification components (XPBar, StreakBadge, LevelBadge, ModuleProgress, AchievementCard)
- Restyle lesson (~25), labs (12), editor (5) components to new palette
- Add animations: reduced-motion guard, 200-300ms transitions, page fade-in, scroll reveals, skeleton pulse, terminal typing
- Align all routes (/, /sign-in, /learn, dashboard/*, laboratorios/*, proyectos/*, niveles, logros, comunidad) to DESIGN.md wireframes

### Out of Scope
- Auth logic (Clerk) — unchanged
- Supabase schema — unchanged
- Pyodide worker logic — styling only, no behavioral changes
- Spanish MDX content — unchanged
- New route creation — only restyling existing routes

## Capabilities

### New Capabilities
- `design-tokens`: CSS custom properties for palette, spacing, radius, shadows, typography per DESIGN.md §1.1–1.4
- `animations`: Reduced-motion-respecting transitions, scroll reveals, skeleton loading, terminal typing per §1.5
- `skeleton-component`: New Skeleton UI component for loading states per §5.2

### Modified Capabilities
- `platform-setup`: Font stack changes (DM_Sans → Inter body), globals.css palette replacement
- `lesson-reader`: All lesson components restyled to new palette tokens
- `lab-page`: Lab components restyled to new palette tokens
- `lab-runner`: Editor/console components restyled to new palette tokens
- `progress-tracking`: Gamification components restyled to new palette tokens

## Approach

**Phase 1 — Tokens**: Replace `globals.css` palette, add spacing/radius/shadow tokens, fix font imports (Inter body, keep Space Grotesk display, add JetBrains Mono). This is the foundation; all other phases depend on it.

**Phase 2 — UI Core**: Restyle Button, Card, Callout, EmptyState, SiteHeader, PageShell. Create Skeleton component.

**Phase 3 — Layout/TopBar**: Restyle AppSidebar (graphite bg, mint active), InVitroTopBar (sticky, XP/streak with new tokens), InVitroShell (surface bg).

**Phase 4 — Landing**: Rewrite hero to dark ink + terminal typing. Remove neural-network background. Restyle modules grid.

**Phase 5 — Dashboard + Routes**: Restyle /dashboard, /laboratorios, /proyectos, /niveles, /logros, /comunidad, /sign-in, /learn to new tokens.

**Phase 6 — Animations**: Add reduced-motion guard, page fade-in, scroll reveals (IntersectionObserver), skeleton pulse, terminal typing animation.

**Phase 7 — Gamification + Lesson/Labs**: Restyle all gamification (5), lesson (~25), labs (12), editor (5) components.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/globals.css` | Modified | Replace Material 3 palette, add DESIGN.md tokens |
| `src/app/layout.tsx` | Modified | Fix DM_Sans → Inter body font |
| `src/app/page.tsx` | Modified | Remove neural-net hero, add terminal typing |
| `src/components/layout/*` | Modified | AppSidebar, InVitroShell, InVitroTopBar restyle |
| `src/components/ui/*` | Modified | All 6 components + new Skeleton |
| `src/components/gamification/*` | Modified | All 5 components restyle |
| `src/components/lesson/*` | Modified | ~25 components restyle |
| `src/components/labs/*` | Modified | 12 components restyle |
| `src/components/editor/*` | Modified | 5 components restyle |
| `src/app/(dashboard)/*` | Modified | 6 dashboard routes restyle |
| `src/app/learn/*` | Modified | Learn index + lesson page restyle |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Token replacement breaks existing component styling | High | Phase 1 tokens first; verify each phase with Playwright screenshots |
| 800-line review budget exceeded by component restyling | Medium | Chain PRs by phase; each phase is a self-contained work unit |
| Vercel build fails after push (no local build gate) | Low | `npm run type-check` before every commit; Playwright visual verification |

## Rollback Plan

Each phase commits independently. If any phase breaks the build or visual integrity:
1. `git revert` the phase commit
2. Re-verify with Playwright screenshots
3. Re-attempt with corrected tokens

The token phase (Phase 1) is the highest-risk rollback target — reverting it restores Material 3 palette globally.

## Dependencies

- DESIGN.md (root) — source of truth, already present
- Existing uncommitted diff on branch `projects-colab-5-duration` — treated as scaffold, SDD corrects + completes

## Success Criteria

- [ ] All Material 3 tokens replaced with DESIGN.md palette in `globals.css`
- [ ] Body font is Inter (not DM_Sans) verified via `npm run type-check`
- [ ] Landing hero has no neural-network background; terminal typing present
- [ ] All routes render with DESIGN.md palette verified via Playwright screenshots
- [ ] Animations respect `prefers-reduced-motion: reduce`
- [ ] `npm run type-check` passes after each phase commit
