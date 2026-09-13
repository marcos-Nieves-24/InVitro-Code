# Apply Progress: Landing Cinematic Hero

**Status**: In progress — 21/33 tasks complete (Slices 1–2 done, plus post-slice carousel fixes)
**Mode**: Standard (strict_tdd: false)
**Delivery strategy**: auto-chain | stacked-to-main
**Branch**: `feature/landing-cinematic-hero`

## Summary

| Slice | Scope | Tasks | State | Commit |
|-------|-------|-------|-------|--------|
| 1 | Dark cinematic hero background + dark hero surface + header contrast | 1.1, 2.1, 2.3–2.5, 3.1–3.3, 5.1–5.2 | Committed | `154ce4d` |
| 2 | Orbital module carousel (replaces Expeditions card grid) | 2.2, 4.1–4.10 | Implemented, uncommitted | — |
| — | Post-slice carousel fixes (legibility + responsive fit) | — | Applied, uncommitted | — |

---

## Slice 1: Dark Cinematic Hero Background + Dark Hero Surface + Header Contrast

**Status**: Complete
**Commit**: `154ce4d` on `feature/landing-cinematic-hero`
**Work unit**: Slice 1 of 3

### Completed Tasks

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

### Files Changed

| File | Action | Lines | Description |
|------|--------|-------|-------------|
| `public/landing/landing-background.png` | Created | binary | Reference PNG copied from material-visual repo (1.9MB) — video poster + fallback |
| `src/components/landing/HeroBackground.tsx` | Created | 39 | Client component: ink base, video layer with poster, dark overlay, reduced-motion support |
| `src/app/page.tsx` | Modified | -13 net | Hero section dark surface, HeroBackground inserted, copy tokens switched to light |
| `src/components/landing/Header.tsx` | Modified | +30 net | Scroll-aware logo (CSS filter for dark bg), text tokens, nav links, hamburger, mobile menu |
| `openspec/changes/landing-cinematic-hero/tasks.md` | Modified | +10/-10 | Marked slice 1 tasks as complete |
| `openspec/changes/landing-cinematic-hero/apply-progress.md` | Created | 66 | Slice 1 progress record |

### Deviations from Design

1. **Logo SVG handling**: `logo-negativo.svg` has `fill="#000000"` (black) — invisible on dark hero background. Instead of switching to `logo.svg` (which has a dark background square), applied CSS `brightness-0 invert` filter on the existing `logo-negativo.svg` when unscrolled. Functionally equivalent to the design intent.

### Issues Found

None.

---

## Slice 2: Orbital Module Carousel

**Status**: Implemented — pending commit
**Work unit**: Slice 2 of 3

### Completed Tasks

- [x] 2.2 Add `@keyframes orbital-glow` to `src/app/globals.css`
- [x] 4.1 Create `src/components/landing/OrbitalModules.tsx` — client component with 4 module data (MOD-01–MOD-04), icons from `lucide-react`
- [x] 4.2 Implement 3D ring (`perspective`, `preserve-3d`, `rotateY(i*90deg) translateZ(radius)`) with responsive radius 280/180/0
- [x] 4.3 Implement `requestAnimationFrame` rotation (~15°/sec) with `cancelAnimationFrame` cleanup
- [x] 4.4 Billboard counter-rotation so text stays legible during orbit
- [x] 4.5 Hover interaction: pause rAF, scale 1.05, `translateZ(30px)`, mint glow, extra description
- [x] 4.6 IntersectionObserver pause when off-screen
- [x] 4.7 `prefers-reduced-motion` static grid fallback
- [x] 4.8 Keyboard/accessibility: `<ul aria-label>`, `<li>`, `<a href="/sign-in">` with focus-visible ring
- [x] 4.9 Responsive radius (mobile static / tablet 180 / desktop 280)
- [x] 4.10 Modify `src/components/landing/Modules.tsx` to render `<OrbitalModules />`, preserving `id="modulos"`, eyebrow, heading, description

### Files Changed (uncommitted)

| File | Action | Lines | Description |
|------|--------|-------|-------------|
| `src/components/landing/OrbitalModules.tsx` | Created | 328 | 3D orbital carousel: rAF rotation, billboard wrapper, angular fade, IntersectionObserver, reduced-motion grid, responsive fit |
| `src/components/landing/Modules.tsx` | Modified | 94 → 26 | Card grid replaced by `<OrbitalModules />` wrapper; section chrome preserved |
| `src/app/globals.css` | Modified | +10 | `@keyframes orbital-glow` + `.orbital-card-glow` |
| `openspec/changes/landing-cinematic-hero/tasks.md` | Modified | +11/-11 | Marked slice 2 tasks as complete |

### Work Unit Evidence

| Evidence | Value |
|----------|-------|
| Focused test command and result | `npm run type-check` → exit 0, no errors; `npm run build` → exit 0, 24 static pages generated |
| Runtime harness | N/A — no test runner configured. Visual behavior verified with Playwright screenshots across the rotation cycle at 1440/1024/820px viewports (headless Chromium) |
| Rollback boundary | Delete `OrbitalModules.tsx`, restore `Modules.tsx` 4-card grid, remove `orbital-glow` keyframe from `globals.css` — reverts to static grid |

---

## Post-Slice Fixes (carousel legibility + sizing)

These fixes were requested during visual review after slice 2. All are applied on top of slice 2 (uncommitted).

### Fix 1: Billboard counter-rotation rendered cards edge-on / mirrored

**Symptom**: Only one card was readable at a time; cards at 90°/270° rendered edge-on and the card at 180° rendered **mirrored** text.

**Root cause**: The inner billboard counter-rotated only `rotateY(-currentAngle)`, leaving each card rotated by its own ring angle (`i * 90deg`) in world space. The wrong formula originated in the design artifact (`design.md` §"Billboard counter-rotation"), which the implementation followed faithfully.

**Correction**: `rotateY(-(currentAngle + i * 90deg))` so every card faces the viewer. The billboard was also moved to its own wrapper, separate from the hover transform, because the previous `transition-all duration-300` also animated the per-frame billboard rotation and made the card lag the ring. `design.md` was updated with the correct formula.

### Fix 2: Cards escaped the container (Python and Statistics)

**Symptom**: The MOD-02 (Python para Biotecnologia) and MOD-03 (Estadistica y Probabilidad) cards overflowed the carousel container horizontally — MOD-02 past the right edge at every width, off-viewport at ≤1100px, and producing page horizontal scroll at 768px.

**Root cause**: The ring size followed viewport breakpoints only, but perspective magnification inflates the projected front/side cards. The projected horizontal half-extent (~679px at radius 340) exceeded the container half-width at narrower viewports — there was no fitting or containment.

**Correction**: A uniform `fitScale` derived from the real container width (`min(vw - 48px, 1280px)`):

```
extentHalf  = 2.05 * radius            // measured projected half-extent at scale 1
fitScale    = clamp((containerWidth / 2 - 16) / extentHalf, 0.3, 1)
```

- Scene scaled with `scale3d(fitScale, fitScale, fitScale)` (not 2D `scale`, which would leave `translateZ` untouched and overlap cards).
- Perspective scaled by the same factor (`perspective: 1600 * fitScale`) so the projection stays exactly proportional and the look is preserved.
- Container `height` 400 → 460px (hover headroom) with `overflow-x: clip` as a safety net.

**Verification (sweep)**: Sampled projected card bounding boxes over a full rotation-pattern period at 13 viewport widths (768–1920). No card exceeds the container or viewport at any width; `document.scrollWidth === innerWidth` everywhere (no horizontal scroll).

### Fix 3: Front card overlapped its neighbours and clipped their text

**Symptom**: Even once contained, the magnified front card covered part of the adjacent cards, so Python and Estadistica showed their text cut off mid-line as they rotated behind the front card.

**Root cause**: At perspective 1000 and radius 280 the front card projected ~1.39× and invaded the card at 90°, and cards at 105–180° were still painted while passing behind the front card.

**Correction**:
- **Anti-overlap radius**: `RING_RADIUS = 340` — the smallest radius that keeps the magnified front card clear of the card at 90°, solving `radius >= (CARD_WIDTH/2) * (1 + P/(P - radius))`. Perspective raised 1000 → 1600 to reduce magnification.
- **Angular fade instead of constant dimming**: cards are fully opaque within ±90° of the front and fade to 0 by ±105° (measured occlusion onset ≈105.5°), so a card is never visible while partially occluded.

**Trade-off**: by construction a 4-card ring places a card directly behind the front one, so 2–3 cards are visible at any instant. Guaranteeing zero overlap and zero clipped text means not all four are simultaneously visible. `design.md` §"Orbital Module Carousel" records the geometry, the radial bound, and the fade.

---

## Remaining Tasks (not in this apply)

- [ ] 1.2–1.8 AnyMotion pipeline (manual asset steps — generate/import/render `hero-lab-bg.mp4`)
- [ ] 5.3–5.7 Manual visual/accessibility/responsive verification

## Overall Task Progress

- Total: 33
- Complete: 21
- Pending: 12 (Phase 1 asset pipeline + Phase 5 manual verification)

## Rollback

- **Slice 1 only**: `git revert 154ce4d` → hero returns to `bg-white` with grid overlay; header returns to default tokens; `HeroBackground.tsx` removed.
- **Slice 2 + fixes**: delete `src/components/landing/OrbitalModules.tsx`; restore `src/components/landing/Modules.tsx` 4-card grid; remove `orbital-glow` keyframe from `globals.css`.
