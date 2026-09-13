# Proposal: Landing Page Overhaul

## Intent

Redesign the landing page to better communicate InVitro-Code's mission, showcase the team, and add interactive elements. The current page has unused module pathway code and lacks mission/vision content. This overhaul modernizes the design while maintaining the existing server component architecture.

## Scope

### In Scope
- Remove "Expediciones del curso" module pathway section and unused imports
- Add "Qué es InVitro-Code" section with mission, vision, and 3 value cards
- Add "Equipo y Contacto" section with team member cards and contact info
- Create InteractiveTerminal client component with typewriter effect
- Create DendrogramAnimation client component with SVG draw animation
- Update color palette to navy/teal theme
- Add animation keyframes for typewriter cursor and SVG stroke

### Out of Scope
- Changes to authenticated pages (dashboard, lessons, labs)
- Backend API modifications
- Content structure changes (modules, lessons)
- Performance optimization beyond animation additions

## Capabilities

### New Capabilities
- `landing-page`: Landing page structure, sections, and interactive components
- `landing-animations`: Client-side animations for terminal typewriter and dendrogram SVG draw

### Modified Capabilities
- None (no existing landing page spec exists)

## Approach

1. **Server/Client Split**: Keep `src/app/page.tsx` as server component. Extract interactive pieces into dedicated client components (`src/components/landing/InteractiveTerminal.tsx`, `src/components/landing/DendrogramAnimation.tsx`).

2. **Color Migration**: Update CSS custom properties in `src/app/globals.css`:
   - `--color-ink`: #000000 → #111439 (Navy)
   - `--color-graphite`: #2a272a → #005f88 (Blue)
   - `--color-mint`: #a3cfcd → #00b2b2 (Teal)
   - `--color-surface`: #f4f6f8 → #FFFFFF

3. **Animation Strategy**: Add keyframes for cursor blink and SVG stroke-dashoffset. Use `useEffect` with `useState` for typewriter sequence. SVG uses `strokeDasharray`/`strokeDashoffset` with CSS transitions.

4. **Content Structure**: Spanish-language content per project convention. Mock data for team members embedded in page component.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/page.tsx` | Modified | Remove module pathway, add new sections, import client components |
| `src/app/globals.css` | Modified | Update color palette, add animation keyframes |
| `src/components/landing/InteractiveTerminal.tsx` | New | Client component with typewriter effect |
| `src/components/landing/DendrogramAnimation.tsx` | New | Client component with SVG draw animation |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Color palette change affects entire site | High | Test all pages after update; ensure dark mode still works |
| Server/client component boundary issues | Medium | Use `'use client'` only in extracted components; keep page as server |
| Animation performance on mobile | Low | Use CSS animations; respect `prefers-reduced-motion` |
| Mock data looks unrealistic | Low | Use generic names; can be replaced with real data later |

## Rollback Plan

1. Revert `src/app/page.tsx` to original version (git checkout)
2. Revert `src/app/globals.css` color changes
3. Delete new component files (`src/components/landing/`)
4. Run `npm run build` to verify no errors

## Dependencies

- Lucide React icons (already installed)
- Tailwind CSS v4 (already configured)
- No new dependencies required

## Success Criteria

- [ ] Landing page builds without errors (`npm run build`)
- [ ] TypeScript type-check passes (`npm run type-check`)
- [ ] All 4 sections render correctly (hero, mission, team, footer)
- [ ] Interactive terminal triggers on click and types once
- [ ] Dendrogram animation triggers on click and draws SVG
- [ ] Color palette updates apply site-wide
- [ ] No regressions in authenticated pages
- [ ] Responsive design works on mobile and desktop