# Proposal: Landing Cinematic Hero

## Intent

The landing hero currently shows a plain `bg-white` section with a grid overlay and two-column layout (copy + terminal). DESIGN.md §4.1 specifies a dark ink hero as the signature element, but it was never implemented with the cinematic quality the spec envisions. This change delivers a premium, science-lab-grade first impression: a looping cinematic video background (rendered via AnyMotion) with animated overlays on the hero, plus a native React/CSS 3D orbital carousel replacing the current 4-card grid in the Expeditions section. The goal is to immediately communicate: scientific research, AI/data-driven, professionalism, premium product.

**Palette note**: Live tokens are in `src/app/globals.css` @theme (ink `#111439`, blue `#005f88`, teal `#00b2b2`, fog `#5A7A8A`). DESIGN.md §1.1 hex table is stale. The AnyMotion clip hardcodes cyan/teal/blue/white because it cannot read CSS tokens.

## Scope

### In Scope
- AnyMotion pipeline: generate → import → render → embed cinematic video loop
- Base-plate composition: `landing-background.png` as base layer, animated overlays on top
- Dark hero integration: video background, dark overlay for text contrast, copy + terminal above
- Orbital module carousel: replaces the 4-card grid inside the Expeditions section (`src/components/landing/Modules.tsx`, id="modulos") with a 3D rotating carousel of the 4 real course modules (MOD-01 through MOD-04)
- Header text tokens: switch from dark-on-light to light-on-dark for hero context
- `<video>` embed with autoplay, muted, loop, playsInline, poster fallback

### Out of Scope
- Clerk/Supabase auth logic — unchanged
- Lesson content and MDX components — unchanged
- AnyMotion pipeline internals (scripts/anyim.mjs, scripts/anymotion-utils.mjs) — additive usage only, no refactoring
- Adding a test runner or linter — not in scope
- Responsive hero crop behavior beyond basic 16:9 containment

## Capabilities

### New Capabilities
- `hero-cinematic-background`: AnyMotion video loop embedded in hero, base-plate + overlay composition, dark overlay for readability, poster/fallback support
- `orbital-module-carousel`: Native React/CSS 3D carousel replacing the Expeditions card grid; rAF rotation, billboard counter-rotation, hover pause + scale + glow, reduced-motion static fallback

### Modified Capabilities
- `interactive-terminal`: Minor context change — terminal now renders over a dark video background instead of white; verify contrast and z-index layering

## Approach

**Video pipeline**: Use `anymotion generate` with a prompt composing `public/landing/landing-background.png` as base + animated scientific overlays (particles, data flows). `anymotion render` produces `public/landing/hero-lab-bg.mp4`. Embed as `<video autoPlay muted loop playsInline poster="/landing/landing-background.png">` in hero section. AnyMotion project slug `hero-lab-bg` lives at `public/animations/hero-lab-bg/` and is catalogued in `scripts/animations.json`.

**Dark hero integration**: Hero section gets `bg-ink` or video fill. Dark semi-transparent overlay (`bg-ink/60`) over video for text readability. Copy (eyebrow, h1, body, CTAs) and InteractiveTerminal layer above via z-index. Header switches to light text tokens when hero is in viewport.

**Orbital carousel**: Lives inside the Expeditions section (`src/components/landing/Modules.tsx`, id="modulos"), replacing the current 4-card grid. Extracted to a new component `src/components/landing/OrbitalModules.tsx`; `Modules.tsx` becomes a thin wrapper preserving the section id, eyebrow, and heading "Expediciones del curso". Pure React + CSS 3D transforms. `requestAnimationFrame`-driven Y-axis rotation. Each card uses `backface-visibility: hidden` with billboard counter-rotation for legibility. Hover: pause rotation, bring card forward (`translateZ`), scale 1.05, mint glow shadow. `prefers-reduced-motion: reduce` → static grid layout, no animation.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/page.tsx` | Modified | Hero section: video embed + dark overlay |
| `src/components/landing/Header.tsx` | Modified | Light text tokens over dark hero (scroll-aware) |
| `src/components/landing/Modules.tsx` | Modified | Card grid replaced by OrbitalModules wrapper; section id="modulos" preserved |
| `src/components/landing/OrbitalModules.tsx` (new) | New | 3D carousel component rendering the 4 real modules |
| `public/landing/landing-background.png` (new) | New | Copied reference PNG used as video poster |
| `public/landing/hero-lab-bg.mp4` (new) | New | Rendered MP4 loop from AnyMotion |
| `public/animations/hero-lab-bg/` (new) | New | Imported AnyMotion project output |
| `scripts/animations.json` | Modified | New `hero-lab-bg` project entry |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Loop seam visible in MP4 | Medium | AnyMotion prompt requests seamless loop; poster fallback masks transition |
| AI generation variance (AnyMotion) | Medium | Multiple generations; pick best; poster as permanent fallback |
| Video payload weight (~2-5 MB) | Medium | Poster-first loading; consider WebM fallback for bandwidth |
| Fixed 16:9 crop vs responsive hero | Low | Use `object-cover` CSS; hero height constrained to viewport |
| Header/copy contrast after darkening | Low | Dark overlay + verified WCAG contrast ratios on mint/white text |
| AnyMotion generation cost/time | Low | Budget 2-3 generation attempts; poster ensures degraded UX is acceptable |

## Tradeoffs

| Decision | Chosen | Rejected | Rationale |
|----------|--------|----------|-----------|
| Background delivery | Rendered looping video (`<video>`) | Live iframe embed | Video is self-contained, no external dependency, works offline after load |
| Base plate | Raster `landing-background.png` in AnyMotion clip | Fully procedural CSS/Canvas | Leverages existing asset; procedural would be heavier to author and maintain |
| Carousel modules | 4 real course modules | 8 generic services | Authentic content builds trust; generic services are not in the product |

## Rollback Plan

1. Revert the commit(s) introducing hero + carousel changes
2. Hero returns to `bg-white` two-column layout with terminal
3. `Modules.tsx` reverts to original 4-card grid; `OrbitalModules.tsx` deleted
4. No data or schema changes involved — purely visual rollback
5. AnyMotion assets in `public/animations/` and `public/landing/` can be left (harmless) or removed

## Dependencies

- AnyMotion CLI v1.1.2 (already installed)
- Reference PNG: `/home/biohacker24/proyectos/material-visual-invitro-code/landing-background.png` (copied to `public/landing/landing-background.png`)
- AnyMotion project directory at `~/anymotion-projects`

## Success Criteria

- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] Hero renders looping video from `public/landing/hero-lab-bg.mp4` with poster fallback at `public/landing/landing-background.png`
- [ ] Dark overlay provides sufficient contrast for white/mint text (WCAG AA)
- [ ] Expeditions section (id="modulos") renders orbital carousel with 4 modules and smooth 3D rotation
- [ ] Hover on carousel card: pause + scale + glow effect
- [ ] `prefers-reduced-motion: reduce` → static grid, no animation
- [ ] Header text is light-colored when hero is visible, transitions on scroll
- [ ] InteractiveTerminal renders correctly over video background
