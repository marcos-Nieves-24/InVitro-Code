# Design: Landing Cinematic Hero

## Technical Approach

Dark-ink hero with a looping MP4 video background (AnyMotion-rendered) behind the existing copy + InteractiveTerminal layout. The `Modules` section gains a 3D orbital carousel via pure React/CSS transforms. Header switches to light tokens when the hero is in view. All new components are client components; the landing page itself stays server-rendered.

## Architecture Decisions

| Decision | Options | Chosen | Rationale |
|----------|---------|--------|-----------|
| Hero background delivery | `<video>` MP4 loop vs live iframe vs CSS gradient | `<video>` MP4 | Self-contained, no external dep, works offline after load; CSS gradient can't match the cinematic quality spec demands |
| AnyMotion pipeline integration | `anim:generate` + `anim:import` + `anymotion render` vs manual script | `npm run anim:generate` → `npm run anim:import` → `anymotion render` | Reuses existing pipeline; catalog entry enables reproducibility |
| Base-plate composition | Reference PNG as base plate inside AnyMotion composition | Copy PNG into generated project workspace; prompt names it; apply step embeds if agent doesn't | Leverages existing asset; AnyMotion generate is prompt-only so PNG must be an explicit workspace file |
| Carousel implementation | React/CSS 3D transforms vs Three.js vs Spline | React/CSS transforms + rAF | Zero new dependencies; GPU-accelerated via `transform`; sufficient for 4 cards |
| Reduced-motion for video | Poster-only vs CSS gradient fallback | Poster-only (autoplay off) | Matches InteractiveTerminal.tsx pattern; poster is the natural fallback |
| Reduced-motion for carousel | Static grid vs no carousel | Static 2-col grid | Preserves content discoverability without animation |
| Catalog entry for hero-bg | Keep in `scripts/animations.json` vs discard after render | Keep | Enables re-render if prompt tuning needed; cost is one JSON row |

## AnyMotion Generation + Render Pipeline

### Sequence

1. **Copy reference PNG** to `public/landing/landing-background.png` (poster fallback).

2. **Generate AnyMotion project**:
   ```bash
   npm run anim:generate -- --prompt "Cinematic scientific laboratory background. Use the file landing-background.png in this project as a full-bleed base plate (CSS background-image or <img> filling the 1920x1080 stage). Overlay animated elements ABOVE the base: slow-rotating DNA helix (cyan), particles flowing along helix strands, floating holographic glass panels, dynamic bar charts and data streams, pulsing neural network nodes, expanding dendrograms, blinking dashboard indicators, ambient volumetric light rays. Palette: cyan #00b2b2, teal #005f88, soft blue, white highlights on dark #111439 background. Motion is slow, elegant, scientific — NOT cyberpunk. Seamless loop (first frame equals last frame). 1920x1080."
   ```
   This runs `node scripts/anyim.mjs generate`, which calls `anymotion generate` and auto-imports the freshest generated project into `public/animations/<slug>/`. The slug is derived from the generated project directory name.

3. **Copy PNG into project workspace**: After generation, copy the reference PNG into the AnyMotion project workspace so the composition can reference it:
   ```bash
   cp public/landing/landing-background.png ~/anymotion-projects/<generated-slug>/landing-background.png
   ```
   If the generated composition did not embed the base plate, edit `index.html`/`style.css` in the workspace to add a full-bleed `<img>` or `background-image` referencing `landing-background.png` before rendering.

4. **Import with exact slug** (if `anim:generate` auto-slug differs from `hero-lab-bg`):
   ```bash
   npm run anim:import -- --source ~/anymotion-projects/<generated-slug> --slug hero-lab-bg --title "Hero Lab Background" --type concept
   ```
   This creates `public/animations/hero-lab-bg/` (carrying the PNG along) and adds the entry to `scripts/animations.json`.

5. **Render MP4** (manual pre-commit step — exact command to be discovered via `anymotion render --help` and `anymotion config` during apply):
   ```bash
   # Target output spec (not exact flags — verify via --help):
   # - public/landing/hero-lab-bg.mp4
   # - H.264, CRF ~23, yuv420p, no audio (-an)
   # - 1920x1080
   ```
   The rendered MP4 is the shipped artifact. The HTML project in `public/animations/hero-lab-bg/` is kept for reproducibility only.

### Render Specifications (target — exact flags discovered at apply time)

- **Resolution**: 1920×1080 (16:9)
- **Duration**: 8–12 seconds (seamless loop)
- **Codec**: H.264, CRF ~23, `yuv420p` pixel format
- **Audio**: None (muted, no audio track)
- **Loop verification**: Extract first and last frames; compare visually; if seam is visible, re-generate with "seamless loop" emphasis in prompt

### Catalog Integration

The `scripts/animations.json` entry for `hero-lab-bg`:
```json
{
  "slug": "hero-lab-bg",
  "title": "Hero Lab Background",
  "type": "concept",
  "duration": 10,
  "src": "/animations/hero-lab-bg/index.html",
  "reactComponent": null,
  "generated": true,
  "inLesson": false,
  "updatedAt": "2026-09-13"
}
```

The project stays in the catalog and `public/animations/hero-lab-bg/` for reproducibility — the HTML is NOT shipped to users (the MP4 is), but the catalog entry lets us re-render if prompt tuning is needed. `npm run anim:convert` is NOT run for this change since no React wrapper is needed (we embed the MP4 directly via `<video>`).

### Failure Handling

If AnyMotion generation/render fails or is unavailable:
- The `<video>` tag has `poster="/landing/landing-background.png"` — the poster image displays immediately
- The hero section has `bg-[#111439]` (ink token) as the base — if even the poster fails, the dark surface is visible
- **Build never blocks on AnyMotion**: the MP4 and poster are pre-committed assets; the pipeline is a manual step, not a build step
- Fallback path: CSS gradient `bg-gradient-to-br from-[#111439] via-[#005f88]/20 to-[#111439]` as a last-resort background on the section element

## Hero Background Component

**New file**: `src/components/landing/HeroBackground.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";

export function HeroBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Ink base — always visible */}
      <div className="absolute inset-0 bg-[#111439]" />

      {/* Video layer — hidden when reduced motion */}
      {!reducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/landing/landing-background.png"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src="/landing/hero-lab-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-[#111439]/60" />
    </div>
  );
}
```

### SSR/Hydration Safety

- `useEffect` with `useState(false)` ensures SSR renders no `<video>` (server renders the ink background only); client hydrates and shows video
- `window.matchMedia` is guarded by `typeof window` check in `useEffect`
- No layout shift: video fills the same space as the ink background

### z-Index Stacking

```
z-0:  HeroBackground (ink bg + video + overlay)
z-10: Hero content (copy + InteractiveTerminal)  ← existing z-10 on grid
z-50: Header (sticky)                            ← existing z-50
```

## Hero Section Changes

**`src/app/page.tsx`**: The hero `<section>` changes from `bg-white` to dark ink:

```tsx
<section className="relative overflow-hidden bg-[#111439] px-6 pt-20 pb-16 md:px-10 md:pt-32 md:pb-24">
  <HeroBackground />

  <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
    {/* Left: copy — tokens switch to light */}
    <div className="flex flex-col gap-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
        Aprendizaje Interactivo
      </p>
      <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
        Aprende{" "}
        <span className="text-mint">IA y Machine Learning</span> con
        Python para Biotecnologia
      </h1>
      <p className="max-w-md text-lg leading-relaxed text-white/70">
        Un curso para biotecnologos que quieren entender datos, modelos
        y decisiones desde el pregrado. Terminales interactivas, labs en
        vivo y desafios de codigo real.
      </p>
      {/* CTAs preserved — mint stays mint */}
      <div className="flex flex-wrap gap-4">
        <Link href="/sign-up" className="...">Empezar ahora</Link>
        <Link href="/sign-in" className="...">Iniciar sesion</Link>
      </div>
    </div>

    {/* Right: terminal — unchanged */}
    <div className="w-full max-w-[880px]">
      <InteractiveTerminal />
    </div>
  </div>
</section>
```

Copy token mapping: `text-graphite` → `text-white/70` (eyebrow — fog #5A7A8A on ink #111439 = 3.88 contrast, fails WCAG AA 4.5:1; white/70 = 9.11, passes), `text-ink` → `text-white` (h1), `text-slate` → `text-white/70` (body). CTA buttons keep mint bg + ink text (unchanged).

## Header Scroll-Aware Light Tokens

**`src/components/landing/Header.tsx`**: Reuse the existing `scrolled` state (line 19: `window.scrollY > 20`). Class strategy:

```tsx
<header className={`fixed top-0 left-0 right-0 z-50 header-bg ${
  scrolled
    ? "bg-surface-card/95 shadow-sm backdrop-blur-sm"      // light surface (unchanged)
    : "bg-transparent"                                        // transparent over dark hero
}`}>
```

Logo text and nav links switch based on `scrolled`:
- **Unscrolled** (`!scrolled`): `text-white` for logo, `text-white/70` hover `text-white` for nav links, `text-white` for hamburger icon
- **Scrolled**: `text-ink` for logo, `text-slate` hover `text-ink` for nav links, `text-ink` for hamburger icon

Mobile menu: when `!scrolled`, `bg-transparent` with `border-white/10` border; when scrolled, `bg-surface-card` with `border-surface-raised` (existing).

Implementation uses conditional class strings keyed on `scrolled` — no new mechanism.

## Orbital Module Carousel

**New file**: `src/components/landing/OrbitalModules.tsx`

### Data

Same 4 modules from current `Modules.tsx` (lines 6-38), same icons from `lucide-react` (Brain, Code, BarChart3, FlaskConical).

### 3D Technique

```
Container: perspective: 1600 * fitScale; relative; height 460px;
           overflow-x: clip; overflow-y: visible
Ring: position: relative, transform-style: preserve-3d
Card i:  transform: rotateY(i * 90deg) translateZ(340px) translate(-50%, -50%)
          (mobile < 768px renders the static grid instead of the ring)
```

**Anti-overlap radius**: The perspective magnification inflates the front card (~1.27× at 1600px), so a small radius makes it overlap its neighbours and clip their text. `RING_RADIUS = 340` is the smallest radius that keeps the magnified front card clear of the card at 90°; solve `radius >= (CARD_WIDTH/2) * (1 + P/(P - radius))`. The perspective distance was raised from 1000 to 1600 for the same reason (less magnification).

**Billboard counter-rotation**: Each card has an inner wrapper with `transform: rotateY(-(currentAngle + i * 90deg))` so text stays legible as the ring rotates. The counter-rotation MUST cancel the card's own ring angle (`i * 90deg`), not only `currentAngle`; otherwise cards at 90°/270° render edge-on and the card at 180° renders mirrored. The billboard lives on its own wrapper, separate from the hover transform, so the hover transition never lags the per-frame rotation.

**Angular fade (no visible occlusion)**: A card is fully opaque within ±90° of the front and fades to 0 by ±105° — just before it starts passing behind the front card (measured overlap onset ≈105.5°). This guarantees a card is never visible while partially occluded. Because a 4-card ring has a card directly behind the front one, only 2–3 cards are visible at any instant by construction.

**Responsive fit**: `fitScale = clamp((containerWidth/2 - 16) / (2.05 * radius), 0.3, 1)` with `containerWidth = min(vw - 48px, 1280px)`. The scene is scaled with `scale3d(fitScale, fitScale, fitScale)` AND the perspective is scaled by the same factor, so the projection stays exactly proportional and no card escapes the container at any viewport width.

**Rotation**: `requestAnimationFrame` updating a `currentAngle` state (or ref + forceUpdate) that increments ~15°/sec. Applied to the ring container as `transform: rotateY(${currentAngle}deg)`.

### Hover Interaction

Inner wrapper (inside the billboard counter-rotation) handles hover transforms so they don't fight the orbit:
- **On hover**: `scale(1.05)`, `translateZ(30px)`, `box-shadow: 0 0 30px rgba(0,178,178,0.3)` (mint glow)
- **Pause rotation**: set `isPaused` ref to true; rAF loop checks and skips angle increment
- **Detail reveal**: expand card height or show additional description text via CSS transition

### Performance

- **Transform/opacity only** — no layout-triggering properties
- `will-change: transform` on the ring container
- rAF cleanup: `cancelAnimationFrame` on unmount
- **IntersectionObserver**: pause rAF when carousel is off-screen; resume when visible
- Target 60 FPS — 4 cards with CSS transforms is well within budget

### Reduced Motion

```tsx
const reducedMotion = useRef(false);
useEffect(() => {
  reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}, []);
```

When reduced: render a static 2×2 grid (matching current `md:grid-cols-2 lg:grid-cols-4` layout), no rAF, no perspective.

### Keyboard Accessibility

- Render as a semantic `<ul>` with `<li>` items, each containing an `<a href="/sign-in">` link (preserving current Explorar behavior)
- Container has `aria-label="Modulos del curso"` on the `<ul>`
- Every link is natively focusable; no `tabIndex` needed on `<a>` elements
- Focus styles: `focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2` (standard focus-visible pattern)

### Responsive Strategy

| Breakpoint | Behavior |
|-----------|----------|
| Desktop (>1024px) | Full 3D ring, radius 280px, 4 cards visible |
| Tablet (768-1024px) | Smaller ring, radius 180px, 2-3 cards visible |
| Mobile (<768px) | Static 2×2 grid, no 3D, no rotation |

### globals.css Additions

One new keyframe (only if needed for the glow pulse on hover):

```css
@keyframes orbital-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 178, 178, 0.2); }
  50% { box-shadow: 0 0 30px rgba(0, 178, 178, 0.4); }
}
```

No other new keyframes — all rotation is JS-driven via rAF + inline transforms.

## Modules.tsx Wrapper

`src/components/landing/Modules.tsx` becomes:

```tsx
"use client";
import { Reveal } from "@/components/Reveal";
import { OrbitalModules } from "./OrbitalModules";

export function Modules() {
  return (
    <section id="modulos" className="bg-surface-card px-6 py-24">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="eyebrow text-storm">Contenido</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink mt-3 mb-4 md:text-4xl">
              Expediciones del curso
            </h2>
            <p className="text-lg leading-relaxed text-slate max-w-2xl mx-auto">
              Cada modulo es una expedicion guiada que combina teoria, practica
              en terminal y laboratorios interactivos.
            </p>
          </div>
        </Reveal>
        <OrbitalModules />
      </div>
    </section>
  );
}
```

Section `id="modulos"`, eyebrow, heading, and description preserved exactly.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/landing/HeroBackground.tsx` | Create | Client component: video bg + ink base + dark overlay, reduced-motion poster-only |
| `src/components/landing/OrbitalModules.tsx` | Create | Client component: 3D orbital carousel of 4 modules, rAF rotation, hover, reduced-motion grid |
| `src/app/page.tsx` | Modify | Hero section: bg-white → bg-[#111439], insert HeroBackground, copy tokens → light, grid z-10 |
| `src/components/landing/Header.tsx` | Modify | Add scrolled-aware light/dark token classes for logo, nav links, hamburger |
| `src/components/landing/Modules.tsx` | Modify | Replace card grid with `<OrbitalModules />`, preserve section id/eyebrow/heading |
| `public/landing/landing-background.png` | Create | Reference PNG (copied from material-visual repo) — poster fallback |
| `public/landing/hero-lab-bg.mp4` | Create | Rendered MP4 loop from AnyMotion |
| `public/animations/hero-lab-bg/` | Create | Imported AnyMotion project (for reproducibility) |
| `scripts/animations.json` | Modify | Add `hero-lab-bg` catalog entry |
| `src/app/globals.css` | Modify | Add `orbital-glow` keyframe (if needed) |

## Interfaces / Contracts

### HeroBackground Props
```tsx
// None — self-contained, reads reduced-motion from OS
export function HeroBackground(): JSX.Element
```

### OrbitalModules Props
```tsx
// None — uses the hardcoded module data (same as current Modules.tsx)
export function OrbitalModules(): JSX.Element
```

### animations.json Entry
```typescript
interface AnimationEntry {
  slug: string;
  title: string;
  type: "concept" | "algorithm";
  duration: number;
  src: string;
  reactComponent: string | null;
  generated: boolean;
  inLesson: boolean;
  updatedAt: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Gates | `npm run type-check` | Static — catches TS errors in new components |
| Gates | `npm run build` | Full build — catches SSR/hydration issues, missing imports |
| Manual | Loop seam visibility | Visual inspection: play video, watch transition point |
| Manual | WCAG contrast | Verify white/mint text over dark overlay meets 4.5:1 ratio |
| Manual | Reduced motion | OS setting → verify poster-only hero, static grid carousel |
| Manual | Header scroll | Scroll up/down → verify token transition is smooth |
| Manual | Carousel hover | Hover card → verify pause + scale + glow |
| Manual | Carousel focus | Tab through cards → verify focus ring, link activation |
| Manual | Mobile layout | Resize to <768px → verify stacked hero, static grid carousel |

No test runner exists (`strict_tdd: false`). Do not invent unit tests.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. AnyMotion is a manual offline pipeline, not invoked at runtime.

## Migration / Rollout

No data migration. The MP4 and poster are committed as static assets. Deploy is standard Vercel build. No feature flags needed — the change is visual-only.

**Rollback**: Revert the commit(s). Hero returns to `bg-white` layout; `Modules.tsx` reverts to card grid; `OrbitalModules.tsx` and `HeroBackground.tsx` deleted. AnyMotion assets in `public/` can be left (harmless) or removed. No schema or data changes involved.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Loop seam visible in MP4 | Medium | Visual | AnyMotion prompt emphasizes seamless loop; poster masks transition; re-generate if needed |
| AnyMotion generation variance | Medium | Visual | Multiple generations; pick best; poster as permanent fallback |
| Video payload (~2-5 MB) | Medium | Performance | `preload="auto"` for autoplay; poster-first display; consider WebM for bandwidth |
| SSR hydration mismatch (video) | Low | Build | `useEffect` + `useState(false)` ensures SSR renders no video; safe hydration |
| rAF memory leak in carousel | Low | Performance | `cancelAnimationFrame` on unmount; IntersectionObserver pauses off-screen |
| Hero height/layout shift | Low | Layout | Video fills absolute inset; no content reflow; ink base always present |
| Header token transition jank | Low | Visual | CSS transitions on existing `header-bg` class; no JS measurement needed |

## Apply-Time Discovery Checklist

These items MUST be verified during the apply phase before committing assets:

- [ ] **Exact `anymotion render` invocation**: Run `anymotion render --help` and `anymotion config` to learn the real flags. Document the exact command used in the commit message. Target output: `public/landing/hero-lab-bg.mp4` (H.264, CRF ~23, yuv420p, no audio, 1920×1080).
- [ ] **Base-plate embedding**: After `anim:generate`, check whether the generated composition embedded `landing-background.png` as a full-bleed base. If not, edit `index.html`/`style.css` in the project workspace to add the base layer before rendering.
- [ ] **Loop seam**: Extract first and last frames of the rendered MP4. Compare visually. If the seam is visible, re-generate with stronger "seamless loop" prompt emphasis.
- [ ] **Generated slug**: `anim:generate` auto-derives the slug from the project directory name. If it differs from `hero-lab-bg`, run `npm run anim:import` with explicit `--slug hero-lab-bg` to rename.
