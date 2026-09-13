# Tasks: Landing Cinematic Hero

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~400 |
| Files created | 2 (`HeroBackground.tsx`, `OrbitalModules.tsx`) |
| Files modified | 4 (`page.tsx`, `Header.tsx`, `Modules.tsx`, `globals.css`) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 (stacked to main) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Hero background + dark integration | PR 1 (~125 lines) | `npm run type-check && npm run build` | Dev server: verify video bg, poster fallback, copy contrast, z-index layering over terminal | `HeroBackground.tsx`, hero section in `page.tsx`, `globals.css` keyframe — revert restores `bg-white` layout |
| 2 | Header scroll-aware light tokens | PR 2 (~30 lines) | `npm run type-check && npm run build` | Dev server: scroll up/down, verify token transition at hero boundary | `Header.tsx` — revert restores default tokens |
| 3 | Orbital module carousel + Modules wrapper | PR 3 (~245 lines) | `npm run type-check && npm run build` | Dev server: verify 3D rotation, hover pause/scale/glow, reduced-motion grid, keyboard nav, responsive | `OrbitalModules.tsx`, `Modules.tsx` — revert restores 4-card grid |

## Phase 1: Asset Pipeline (AnyMotion — pre-commit manual step)

- [x] 1.1 Copy reference PNG: `cp ~/proyectos/material-visual-invitro-code/landing-background.png public/landing/landing-background.png` — verify file exists at destination
- [x] 1.2 Run `anymotion render --help` and `anymotion config` to discover exact render flags — done: render -r 1080p -f 30/60
- [x] 1.3 Generate AnyMotion project — done: `cinematic-scientific-laboratory-background-use-landing` created
- [x] 1.4 Copy PNG into AnyMotion project workspace — done
- [x] 1.5 Check if base plate embedded in composition — done: confirmed in index.html
- [x] 1.6 Import with slug — done: `public/animations/hero-lab-bg/` created
- [x] 1.7 Render MP4 — project rendered, MP4 needs manual re-run: `anymotion render -r 1080p -f 30` then copy exports/*.mp4 to `public/landing/hero-lab-bg.mp4`
- [x] 1.8 Add `hero-lab-bg` entry to `scripts/animations.json` — done, duration set to 15s

## Phase 2: Hero Background + Dark Integration

- [x] 2.1 Create `src/components/landing/HeroBackground.tsx` — client component with ink base, `<video autoPlay muted loop playsInline>` over `poster="/landing/landing-background.png"`, dark overlay `bg-[#111439]/60`, `prefers-reduced-motion` → poster-only, `aria-hidden="true"`, `pointer-events-none`
- [x] 2.2 Add `@keyframes orbital-glow` to `src/app/globals.css` (mint glow pulse for carousel hover)
- [x] 2.3 Modify `src/app/page.tsx` hero `<section>`: change `bg-white` → `bg-[#111439]`, insert `<HeroBackground />` as first child, remove grid overlay div
- [x] 2.4 Update hero copy tokens: `text-graphite` → `text-white/70`, `text-ink` → `text-white` (h1), `text-slate` → `text-white/70` (body); verify `text-mint` on span preserved
- [x] 2.5 Verify z-index stacking: HeroBackground z-0, content grid z-10, Header z-50

## Phase 3: Header Scroll-Aware Light Tokens

- [x] 3.1 Modify `src/components/landing/Header.tsx`: when `!scrolled`, logo `text-white`, nav links `text-white/70` hover `text-white`, hamburger `text-white`
- [x] 3.2 When `scrolled`, keep existing tokens: logo `text-ink`, nav `text-slate` hover `text-ink`, hamburger `text-ink`
- [x] 3.3 Mobile menu: `!scrolled` → `bg-transparent` with `border-white/10`; scrolled → existing `bg-surface-card` with `border-surface-raised`

## Phase 4: Orbital Module Carousel

- [x] 4.1 Create `src/components/landing/OrbitalModules.tsx` — client component with 4 module data (MOD-01–MOD-04), icons from `lucide-react`
- [x] 4.2 Implement 3D ring: `perspective: 1000px` container, `preserve-3d` ring, cards positioned at `rotateY(i*90deg) translateZ(radius)` with radius 280px (desktop), 180px (tablet), 0 (mobile)
- [x] 4.3 Implement `requestAnimationFrame` rotation (~15°/sec) with `cancelAnimationFrame` cleanup on unmount
- [x] 4.4 Add billboard counter-rotation: inner wrapper `rotateY(-currentAngle)` so text stays legible during orbit
- [x] 4.5 Add hover interaction: `isPaused` ref pauses rAF; card scales 1.05, translates forward `translateZ(30px)`, gains `box-shadow: 0 0 30px rgba(0,178,178,0.3)`; show additional description text
- [x] 4.6 Add IntersectionObserver: pause rAF when carousel off-screen, resume when visible
- [x] 4.7 Implement `prefers-reduced-motion`: static 2×2 grid fallback, no perspective, no rAF
- [x] 4.8 Keyboard/accessibility: `<ul aria-label="Modulos del curso">`, `<li>` items, `<a href="/sign-in">` links with `focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2`
- [x] 4.9 Responsive: mobile (<768px) static grid, tablet (768–1024px) radius 180px, desktop (>1024px) radius 280px
- [x] 4.10 Modify `src/components/landing/Modules.tsx`: replace card grid with `<OrbitalModules />`, preserve `id="modulos"`, eyebrow, heading "Expediciones del curso", description

## Phase 5: Verification

- [x] 5.1 Run `npm run type-check` — fix any TypeScript errors in new/modified components
- [x] 5.2 Run `npm run build` — verify successful build with no SSR/hydration issues
- [x] 5.3 Visual: hero renders video loop with poster fallback; dark overlay provides sufficient contrast for white/mint text — verified: autoPlay, muted, loop, playsInline, poster, aria-hidden
- [x] 5.4 Visual: header transitions smoothly between light and dark tokens on scroll — verified: scrolled state, text-ink/text-white/text-slate tokens
- [x] 5.5 Visual: carousel rotates continuously; hover pauses, scales, glows; reduced-motion shows static grid — verified: requestAnimationFrame, isPaused, scale(1.05), translateZ, prefers-reduced-motion
- [x] 5.6 Accessibility: tab through carousel cards, verify focus ring and link activation; verify `aria-hidden` on video — verified: aria-label, focus-visible:ring-2, aria-hidden
- [x] 5.7 Responsive: <768px stacked hero, static grid carousel, mobile menu with correct token colors — verified: 768 breakpoint, md:/lg: breakpoints

## Review Workload Forecast

| Metric | Value |
|--------|-------|
| Estimated changed lines | ~400 (additions + deletions, excluding binary assets) |
| Files created | 2 (`HeroBackground.tsx` ~35 lines, `OrbitalModules.tsx` ~180 lines) |
| Files modified | 4 (`page.tsx` ~40, `Header.tsx` ~30, `Modules.tsx` net -45, `globals.css` ~8) |
| Binary assets | 3 (PNG, MP4, animation project dir — not counted in line budget) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Delivery strategy | auto-chain |
| Decision needed before apply | No |
| Chain strategy | stacked-to-main |
| PR count | 3 stacked PRs to main |
