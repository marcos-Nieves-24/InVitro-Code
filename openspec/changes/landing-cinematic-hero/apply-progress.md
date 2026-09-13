# Apply Progress: Landing Cinematic Hero — Slice 1

## Slice: Dark Cinematic Hero Background + Dark Hero Surface + Header Contrast

**Status**: Complete
**Mode**: Standard (strict_tdd: false)
**Commit**: `6e8e1c4` on `feature/landing-cinematic-hero`
**Delivery strategy**: auto-chain | feature-branch-chain
**Work unit**: Slice 1 of 3 (hero background + dark integration + header scroll tokens)

## Completed Tasks

- [x] 1.1 Copy reference PNG to `public/landing/landing-background.png`
- [x] 2.1 Create `src/components/landing/HeroBackground.tsx`
- [x] 2.3 Modify `src/app/page.tsx` hero section (bg-white → bg-[#111439], insert HeroBackground, remove grid overlay)
- [x] 2.4 Update hero copy tokens (text-graphite → text-white/70, text-ink → text-white, text-slate → text-white/70)
- [x] 2.5 Verify z-index stacking (HeroBackground z-0, content grid z-10, Header z-50)
- [x] 3.1 Header unscrolled tokens (logo white, nav text-white/70, hamburger text-white)
- [x] 3.2 Header scrolled tokens (existing ink/slate tokens preserved)
- [x] 3.3 Mobile menu scroll-aware (transparent/dark → card/light)
- [x] 5.1 npm run type-check — passes
- [x] 5.2 npm run build — passes

## Files Changed

| File | Action | Lines | Description |
|------|--------|-------|-------------|
| `public/landing/landing-background.png` | Created | binary | Reference PNG copied from material-visual repo (1.9MB) — video poster + fallback |
| `src/components/landing/HeroBackground.tsx` | Created | 30 | Client component: ink base, video layer with poster, dark overlay, reduced-motion support |
| `src/app/page.tsx` | Modified | -9 net | Hero section dark surface, HeroBackground inserted, copy tokens switched to light |
| `src/components/landing/Header.tsx` | Modified | +18 net | Scroll-aware logo (CSS filter for dark bg), text tokens, nav links, hamburger, mobile menu |
| `openspec/changes/landing-cinematic-hero/tasks.md` | Modified | +10/-10 | Marked slice 1 tasks as complete |

## Work Unit Evidence

| Evidence | Value |
|----------|-------|
| Focused test command and exact result | `npm run type-check` → exit 0, no errors; `npm run build` → exit 0, compiled in 11.6s, 24 static pages generated |
| Runtime harness command/scenario | N/A — no runtime boundary; purely visual component changes verified via build (SSR/hydration safety confirmed by successful static generation of `/` route) |
| Rollback boundary | `HeroBackground.tsx`, hero section in `page.tsx`, `Header.tsx` scroll tokens — revert restores `bg-white` layout with default header tokens |

## Deviations from Design

1. **Logo SVG handling**: `logo-negativo.svg` has `fill="#000000"` (black) — invisible on dark hero background. Instead of switching to `logo.svg` (which has a dark background square), applied CSS `brightness-0 invert` filter on the existing `logo-negativo.svg` when unscrolled. This makes the black fill white on the dark hero, and reverts to normal black on the light scrolled surface. Functionally equivalent to the design intent.

2. **Task 2.2 (orbital-glow keyframe)**: Skipped per orchestrator instruction — not needed for this slice (belongs to the orbital carousel slice).

## Issues Found

None.

## Remaining Tasks (not in this slice)

- [ ] 1.2–1.8 AnyMotion pipeline (manual asset steps)
- [ ] 2.2 Add `@keyframes orbital-glow` to globals.css (carousel slice)
- [ ] 4.1–4.10 Orbital module carousel (slice 3)
- [ ] 5.3–5.7 Manual visual/accessibility verification

## Rollback

To rollback this slice only:
1. `git revert 6e8e1c4`
2. Hero returns to `bg-white` with grid overlay
3. Header returns to default tokens
4. `HeroBackground.tsx` removed
5. `public/landing/landing-background.png` removed (harmless if left)
