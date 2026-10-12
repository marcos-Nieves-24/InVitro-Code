# Feature: labs-hero-tweaks — Hero + Header + Cards parity

## Objective
Quitar progress y botón del Hero de laboratorios, mover Racha al header, reemplazar tubos por BiotechGrowthTube ajustado, agrandar favicons 2×, igualar colores Python/Bioestadística a AI/ML (paridad propuesta).

## Problem
Hero muestra XP bar y CTA duplicados debajo del video 4K; Racha solo en HUD footer no visible en header; cards usan ProgressTube simple vs tubo del dashboard; favicons 44px pequeños vs hero 3840×2160; Python mint #A3CFCD y Bio fog #82A0AA desentonan con AI ink y ML graphite oscuros.

## Why
Unificar jerarquía visual, liberar HUD footer, mejorar scannability y consistencia DESIGN.md.

## Scope
- Incluye: LabHero.tsx (quitar XP + CTAs), InVitroShell.tsx + laboratorios/page.tsx (racha header), ModuleExplorerCard.tsx (BiotechGrowthTube size 96 + favicon 88), LabCardTheme.ts (paridad colores)
- Excluye: video 4K ya entregado, onboarding, workspace

## Constraints
- Conservar HUD footer (nivel) pero sin XP/racha/CTA; preservar backdrop-blur.
- BiotechGrowthTube exp/maxExp mapping, size 96-110 para card p-6.
- Favicons SVG siguen nítidos a 88px.
- Colores: python → #0F161F (IA), estadistica → #2A272A (ML), tints respectivos.

## Tasks

### T1 — Hero sin progress ni CTA [x]
- **Files:** src/components/labs/LabHero/LabHero.tsx
- **Acceptance:** XP bar Gem/h2 y ambos botones Explorar eliminados; video + consola + nivel permanecen; build verde.
- **Status:** ☑ done — removed XP bar (Gem+bar+totalXp), Streak (Flame), CTA pill (ArrowRight), SlideArrowButton in console; kept video+gradient+console 3×TypingText+HUD Level only; removed xpPercent/scrollToHub/unused imports
- **Verification:** type-check PASS, build PASS 19/19

### T2 — Racha en header [x]
- **Files:** src/components/layout/InVitroShell.tsx, src/app/(dashboard)/laboratorios/page.tsx
- **Acceptance:** Header muestra Flame + días junto avatar; LabHero HUD sin racha; mobile menu muestra racha.
- **Status:** ☑ done — InVitroShell currentStreak? prop + Flame badge hidden sm:flex before avatar + mobile dropdown badge; laboratorios/page.tsx passes currentStreak
- **Verification:** type-check PASS, build PASS 19/19

### T3 — Tubos BiotechGrowthTube en cards [x]
- **Files:** src/components/labs/explorer/ModuleExplorerCard.tsx
- **Acceptance:** ProgressTube reemplazado por BiotechGrowthTube exp/maxExp size 96, gap ajustado, sin overflow.
- **Status:** ☑ done — import BiotechGrowthTube, <BiotechGrowthTube exp={completed} maxExp={total} size={96} label={`${completed}/${total}`} className="shrink-0" />
- **Verification:** type-check PASS, build PASS 19/19

### T4 — Favicons 2× [x]
- **Files:** src/components/labs/explorer/ModuleExplorerCard.tsx
- **Acceptance:** LabCardArt size 88 con hover scale 110 intacto.
- **Status:** ☑ done — LabCardArt size 44 → 88, group-hover:scale-110 preserved, SVG sharp at 88px

### T5 — Paridad colores Python/Bio [x]
- **Files:** src/components/labs/LabCardTheme.ts
- **Acceptance:** python #0F161F, estadistica #2A272A, contraste ≥4.5:1.
- **Status:** ☑ done — python accent #A3CFCD→#0F161F tint #E8ECF0→#F4F6F8; estadistica accent #82A0AA→#2A272A tint #F4F6F8→#E8ECF0

## TDD Mode
Standard Mode.

## Progress
- 2026-09-27 — Feature created, branch odd/lab-journey-redesign, no writes yet.
- Decision ODD (no SDD) — 5 tweaks claros, baja ambigüedad.
- 2026-09-27 — T1-T5 done (3747369) — hero without progress/CTA, racha in header, biotech tube 96, favicon 88, parity colors — type-check PASS, build PASS 19/19

### T6 — Hero console bg spritecook sin HUD nivel [x]
- **Files:** src/components/labs/LabHero/LabHero.tsx, public/images/spritecook/lab-hero-256-complete-enhanced-1024x576.png (pre-existente 1024×576)
- **Acceptance:** section bg-black (console dark, no bg-graphite); purple div comic-bg eliminado; consola ampliada w-full max-w-[520px] p-6 bg-[#0a0a0a] shadow-2xl; TypingText // 4 laboratorios eliminado (2 líneas restantes); HUD footer Nivel eliminado por completo; video 4K preservado con opacity-40 + overlay bg-black/60; spritecook img 512×288 a la derecha flex-row lg, stack flex-col mobile, rounded-xl shadow-xl; layout flex gap-8 items-center justify-between p-8 lg:p-12.
- **Status:** ☑ done — bg-graphite→bg-black, video opacity-40 + bg-black/60 overlay, unwrapped comic 420px div, console 520px #0a0a0a p-6, removed // line, removed HUD border-t hud-bg Niv. span, added spritecook img 1024×576 displayed 480/512, type-check PASS build PASS 19/19, grep Niv. 0 comic-bg 0 "4 laboratorios" 0
- **Verification:** type-check PASS, build PASS 19/19, grep checks 0

### T7 — Pixel-art background reemplaza video 4K [x]
- **Files:** src/components/labs/LabHero/LabHero.tsx, public/images/spritecook/lab-hero-256-complete-enhanced-1024x576.png (pre-existente)
- **Acceptance:** `<video>` + poster + `prefersReducedMotion` img fallback + `bg-black/60` overlay removidos; pixel-art img full-bleed `absolute inset-0 object-cover` con `imageRendering: pixelated` como background; overlay `bg-black/55 backdrop-blur-[1px]` para legibilidad consola; foreground img duplicado a la derecha removido; layout `flex items-center justify-center min-h-[380px] p-8 lg:p-12` con consola centrada `max-w-[560px] bg-[#0a0a0a]/90 backdrop-blur-sm`; `prefersReducedMotion` var removida (TS unused clean); `hero-lab-4k` 0, `spritecook` 1.
- **Status:** ☑ done — video 4K (lines 42-63) + poster fallback + overlay bg-black/60 removed, pixel-art background + bg-black/55 overlay added, foreground duplicate img removed, console centered 560px, type-check PASS build PASS 19/19
- **Verification:** type-check PASS, build PASS 19/19, grep hero-lab-4k 0 spritecook 1

## Verification Evidence
- type-check: `npm run type-check` → PASS (no errors)
- build: `npm run build` → PASS (19/19, compiled 16.9s)
- T6 grep: `grep "Niv\." LabHero.tsx` → 0, `grep "comic-bg" LabHero.tsx` → 0, `grep "4 laboratorios" LabHero.tsx` → 0
- T7 grep: `grep "hero-lab-4k" LabHero.tsx` → 0, `grep "spritecook" LabHero.tsx` → 1
- InVitroShell racha header untouched (Flame badge preserved)

---
*Locator: odd/tasks/labs-hero-tweaks.md*
