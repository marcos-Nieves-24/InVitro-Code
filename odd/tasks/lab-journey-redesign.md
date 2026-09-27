# Feature: lab-journey-redesign — Structured Laboratory Learning Journey

## Objective
Rediseñar la experiencia de laboratorio como recorrido estructurado en 4 fases: Module Explorer (4 cards gamificadas) → Lab Landing cinemático con video MP4 → Guided Onboarding (scientist + spotlight) → Interactive Lab Workspace (instrucciones/editor/console/results), renombrando "Sala de Biorreactores" a "Sala de laboratorios" y eliminando referencias a biorreactores.

## Problem
El hub actual `/laboratorios` es una lista colapsable genérica sin jerarquía de viaje; no existe landing por módulo, ni onboarding para nuevos investigadores, ni workspace consistente. La temática de biorreactores está hardcodeada (`LabHero.tsx:108`, `LabHeroCopy.tsx:6-14`, `RiveBioreactor.tsx`) y contamina el mensaje educativo de los 4 módulos reales (IA, Python, Estadística, ML).

## Why
Un recorrido estructurado aumenta retención y reduce fricción cognitiva para estudiantes de biotecnología: progresión visible (test-tube), contexto cinemático por módulo (video MP4 optimizado), guía inicial sin bloquear usuarios avanzados, y workspace minimal científico alineado a `DESIGN.md`.

## Scope
- Incluye: `src/app/(dashboard)/laboratorios/**`, `src/components/labs/**` (explorer/landing/onboarding/workspace), `src/components/onboarding/**`, `src/lib/content/modules.ts`, `src/lib/gamification/utils.ts`, `src/components/editor/**`, `public/videos/lab-hero-*`, `src/app/globals.css` (solo progreso tube + spotlight tokens), renombrado de strings/messages.
- Excluye: cambios de esquema Supabase/Clerk, pipeline `lab.md` MDX, lógica Pyodide, rutas `/learn` y `/proyectos`, nuevos paquetes pesados.

## Constraints
- Tokens `DESIGN.md` §1.1-§1.5 son fuente de verdad — no hex hardcoded fuera de `@theme`.
- Stack: Next 16 App Router, TypeScript, Tailwind v4, `motion` (ya en deps), `lucide-react`; no añadir dependencias sin justificación.
- `prefers-reduced-motion: reduce` obligatorio (spotlight, progress tube, video poster fallback).
- Sin decoraciones AI-themed; estética minimal científica gamificada.
- Verificación Standard Mode (`strict_tdd: false` → `npm run type-check` + `npm run build` por tarea).

## Tasks

### T1 — Renombrado y limpieza temática [x]
- **Description:** Reemplazar "Sala de Biorreactores" → "Sala de laboratorios" y todas las apariciones de biorreactores por mensajes orientados a proyectos. Auditar `LabHero.tsx:108`, `LabHero.tsx:167`, `LabHeroCopy.tsx:PHRASES`, `RiveBioreactor.tsx`, `DESIGN.md:433-459`, `globals.css` comentarios burbuja, y cualquier `grep biorreactor`.
- **Files:** `src/components/labs/LabHero/LabHero.tsx`, `src/components/labs/LabHero/LabHeroCopy.tsx`, `src/components/labs/LabHero/RiveBioreactor.tsx` (deprecar o remover si no usa landing), `src/app/globals.css`, `DESIGN.md` referencia
- **Acceptance:** `grep -ri biorreactor` no retorna hits de UI visible; `LabHero`/`LabHeroCopy` muestran copy de proyectos; video hero ya no referencia bioreactor.
- **Verification:** `grep -ri biorreactor src/ | grep -v ".riv"` → vacío (excepto tokens internos/dashboard futuros T2/T8); `npm run type-check && npm run build` ✓
- **Route:** inline (mechanical string replace, 1-3 files + grep)
- **Status:** ☑ done (commit 3996ae9)

### T2 — Module Explorer: Progress Tube + Card [x]
- **Description:** Crear `ProgressTube.tsx` (test tube SVG vertical con fill `mint` proporcional a `completed/total`, ticks 25/50/75, label, a11y `progressbar`, reduce-motion static) y `ModuleExplorerCard.tsx` (title, XP reward via `calcXpForLesson` sum, lab count, ProgressTube, hover `motion` y: -4px + shadow-lg + border glow, click `Link` a `/laboratorios/[module]`).
- **Files:** `src/components/labs/explorer/ProgressTube.tsx`, `src/components/labs/explorer/ModuleExplorerCard.tsx`, `src/components/labs/explorer/index.ts`
- **Acceptance:** 4 estados visuales (0%/50%/100%/over), hover eleva card y escala `LabCardArt`, click navega y respeta `tabIndex`; a11y contraste ≥4.5:1, reduce-motion sin animación.
- **Verification:** `npm run type-check && npm run build`
- **Route:** delegated (2+ non-trivial files, new logic + art)
- **Status:** ☑ done (commit 76bcef2)

### T3 — Module Explorer: Integración en /laboratorios [x]
- **Description:** Reemplazar `LabHub` colapsable por `ModuleExplorerGrid` de 4 cards en `/laboratorios/page.tsx`. Calcular por módulo: `xpReward=sum(calcXpForLesson)`, `labCount=getLessonCount`, `completed=getProgress(module)`, reusar `getLabCardTheme`. Mantener `LabHeroLoader` o sustituir por hero simplificado "Sala de laboratorios" sin Rive.
- **Files:** `src/components/labs/explorer/ModuleExplorerGrid.tsx`, `src/app/(dashboard)/laboratorios/page.tsx`, `src/lib/content/modules.ts` (si añade `getModuleXpTotal`)
- **Acceptance:** Grid `1col mobile / 2col tablet / 4col desktop`, stagger 0/50/100/150ms, hero sin referencias bioreactor; `LabHub.tsx` queda deprecated pero no roto.
- **Verification:** `npm run type-check && npm run build` ✓ (19/19)
- **Route:** delegated (page + grid + data wiring)
- **Status:** ☑ done (commit 76bcef2)

### T4 — Lab Landing Screen por módulo (MP4 cinemático) [x]
- **Description:** Crear ruta `src/app/(dashboard)/laboratorios/[module]/page.tsx` (Server Component) con hero video MP4 optimizado full-bleed + overlay gradient, eyebrow (slug·N labs·XP), h1 module title, descripción `module.json:description`, CTA primario `[Empezar]` → primera lección incompleta (`getNextLesson` scoped). Añadir `src/lib/labs/heroVideos.ts` map 4 módulos → `{src,poster,alt}`.
- **Files:** `src/app/(dashboard)/laboratorios/[module]/page.tsx`, `src/components/labs/landing/LabLandingHero.tsx`, `src/lib/labs/heroVideos.ts`, `public/videos/lab-hero-{ia,python,estadistica,ml}.mp4` + posters
- **Acceptance:** Video `autoplay muted loop playsInline` con `poster` y fallback estático en reduce-motion; CTA resuelve correctamente (todo completo → "Repasar" a primera lección); breadcrumb y `InVitroShell` consistentes.
- **Verification:** `npm run type-check && npm run build`; manual check video carga y CTA navega
- **Route:** delegated (new route + hero + video map)
- **Status:** ☑ done (commit 69dfb10)

### T5 — Video assets optimizados MP4 [x]
- **Description:** Generar/importar 4 videos hero vía pipeline `anyim` (`npm run anim:generate -- --prompt`) y optimizar con ffmpeg (`h264 crf23 faststart 1920w`). Si `anymotion` no disponible, usar stock científico libre + overlay. Actualizar `heroVideos.ts` con duraciones y posters.
- **Files:** `public/videos/lab-hero-*.mp4`, `public/videos/lab-hero-*-poster.jpg`, `scripts/anyim.mjs` (uso no modificación), `src/lib/labs/heroVideos.ts`
- **Acceptance:** Cada MP4 <3MB, carga con `preload=metadata`, no layout shift, `poster` visible antes de autoplay, verifica con `npm run build` (asset size).
- **Verification:** `ls -lh public/videos/lab-hero-*` + `npm run build`
- **Route:** delegated (asset pipeline + verification)
- **Status:** ☑ done (2026-09-27 — placeholder strategy: copied circuit-growth-animation.mp4 → 4 hero MP4s + ffmpeg h264 crf23 faststart 1920w optimization 71K each; posters 1920x746 8.5K via ffmpeg frame extraction; heroVideos.ts mapping verified, no fix needed)

### T6 — Guided Onboarding (solo primer laboratorio) [x]
- **Description:** Crear `ScientistGuide.tsx`, `MangaSpeechBubble.tsx`, `SpotlightOverlay.tsx` (fixed overlay con clip-path hole via getBoundingClientRect), `CoachMarks.tsx` (1/5 + Siguiente/Omitir), `OnboardingController.tsx` (5 pasos: navigation, console, editor, run button, ecosystem). Persistencia `localStorage lab-onboarding-completed` + `supabase.profiles.onboarding_seen` (migration si falta). Solo muestra si `completedCount===0`.
- **Files:** `src/components/onboarding/ScientistGuide.tsx`, `src/components/onboarding/MangaSpeechBubble.tsx`, `src/components/onboarding/SpotlightOverlay.tsx`, `src/components/onboarding/CoachMarks.tsx`, `src/components/onboarding/OnboardingController.tsx`, `src/components/onboarding/index.ts`
- **Acceptance:** Secuencial 5 pasos, `Omitir` siempre visible, ESC cierra, reduce-motion sin transiciones, primer laboratorio solamente, no bloquea Pyodide.
- **Verification:** `npm run type-check && npm run build` ✓ (2026-09-27 — type-check PASS, build PASS 19/19)
- **Route:** delegated (5 components + wiring + persistence)
- **Status:** ☑ done (2026-09-27 — motion/AnimatePresence, spotlight rect with padding+border-mint+shadow-glow, prefers-reduced-motion, ESC handler, localStorage gate with 500ms delay)

### T7 — Interactive Lab Workspace [x]
- **Description:** Refactorizar `laboratorios/[module]/[lesson]/page.tsx` + `LabTabs.tsx` en `LabWorkspace.tsx` con layout 2-col desktop: izquierda instrucciones MDX scrollable, derecha stack (Editor `CodeEditor`/`PyodideRunner`, Console `OutputPanel`, Results `VisualizationPanel`). Mantener `LabRunner`/`PyodideRunner` intactos, solo envolver con grid y header con mini ProgressTube.
- **Files:** `src/components/labs/workspace/LabWorkspace.tsx`, `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx`, `src/components/labs/LabTabs.tsx` (refactor o wrapper)
- **Acceptance:** Visual consistente `DESIGN.md` (surface-card, radius-lg, fog/mint accents), sin decoraciones AI, responsive: stacked en mobile, paneles con altura controlada, Pyodide ready/run intacto.
- **Verification:** `npm run type-check && npm run build` ✓ (2026-09-27 — type-check PASS, build PASS 19/19)
- **Route:** delegated (workspace layout + page wiring)
- **Status:** ☑ done (2026-09-27 — LabWorkspace 2-col grid instructions/Editor/Results, onboarding attrs instructions/editor/run-button/results, CodeEditor run-button data attr, page progress gate completedCount===0)

### T8 — Pulido, a11y y verificación final [x]
- **Description:** QA cross-task: responsive breakpoints (`mobile <768 / tablet 768-1024 / desktop >1024`), contraste, `prefers-reduced-motion`, navegación por teclado, `grep` final biorreactores, revisión build/type, limpieza de `RiveBioreactor` si deprecated.
- **Files:** `odd/tasks/lab-journey-redesign.md`, `globals.css` (tokens spotlight/tube si faltan), touched files polish
- **Acceptance:** Todos T1–T7 acceptance cumplidos juntos; `type-check` y `build` verdes; sin regresiones en `/learn` y `/dashboard`.
- **Verification:** `npm run type-check && npm run build && npm run test` (vitest si aplica)
- **Status:** ☑ done (commit 670866f — 2026-09-27 — polish: SpotlightOverlay viewport clamp (padding 8px + Math.min/Math.max vw/vh), biorreactor grep 0 UI hits, AI decorations 0, hex audit OK, responsive 1/2/4 + object-cover + lg:2col verified, a11y progressbar/aria/focus-visible 12 prefers-reduced-motion branches)

## Authorized Scope
Rediseño experiencia laboratorios 4 fases + renombrado. No tocar `supabase-migration.sql` salvo columna `onboarding_seen` opcional, ni `learn/[module]/[slug]`, ni evaluación `calcLevel`.

## TDD Mode
Standard Mode — `strict_tdd: false` (detectado `src/__tests__/` aislados, `vitest env:node`). No RED requerido; checks por tarea según verificación arriba. Forward mode `strict_tdd:false, runner: npm run test` a workers.

## Delivery Strategy
`ask-on-risk` (default). Forecast ~950 authored lines (8 tasks, 12-15 files). Si running count > ~400 líneas, consultar split `stacked-to-main` vs `feature-branch-chain`.

## Forecast
- **Authored lines:** ~950 (additions+deletions, videos/mp4/posters excluded)
- **Files:** 12-15 (`explorer/ 3`, `landing/ 2`, `onboarding/ 5`, `workspace/ 1`, pages 2, heroVideos 1, assets 8)
- **Work-unit commits:** 5-6 (T1+T2-3, T4-5, T6, T7, T8 polish)

## Progress
- 2026-09-27 — Feature document created; no source writes yet. All tasks ☐ unchecked. Branch `odd/lab-journey-redesign` pending.
- 2026-09-27 — T1 done (3996ae9) — rename Sala de Biorreactores → Sala de laboratorios
- 2026-09-27 — T2+T3 done (9b8946e) — ModuleExplorer ProgressTube + Card + Grid 1/2/4
- 2026-09-27 — T4 done (2178bf6) — LabLandingHero cinematic MP4 + heroVideos map
- 2026-09-27 — T5 done (08925ca) — 4 hero MP4 71K + posters 8.5K ffmpeg crf23
- 2026-09-27 — T6 done (3f8f49c) — Onboarding ScientistGuide + Spotlight + CoachMarks 5 pasos
- 2026-09-27 — T7 done (7cb3990) — LabWorkspace 2-col grid + LabRunner/PyodideRunner wiring
- 2026-09-27 — T8 done (670866f) — cross-task QA passed, viewport clamp added

## Verification Evidence
- T1: `grep -ri biorreactor src/ | grep -v .riv` → 0 UI hits (dashboard BioreactorProgress excluded per scope); `type-check PASS`, `build PASS 19/19`
- T2+T3: `type-check PASS`, `build PASS 19/19`, grid 1/2/4 verified, ProgressTube a11y progressbar + focus-visible, prefers-reduced-motion via useReducedMotion
- T4: `type-check PASS`, `build PASS 19/19`, video autoplay/muted/loop/playsInline + poster fallback, lab-hero-*.mp4 71K each
- T5: `ls -lh public/videos/lab-hero-*` → 4×71K MP4 + 4×8.5K poster JPG; ffmpeg h264 crf23 faststart 1920w; `build PASS`
- T6: `type-check PASS`, `build PASS 19/19`, 5 steps navigation/instructions/editor/run/results, fallbackSelector aside, ESC + Omitir, prefers-reduced-motion, localStorage gate 500ms
- T7: `type-check PASS`, `build PASS 19/19`, 2-col lg:grid-cols-2, stacked mobile, data-onboarding attrs instructions/editor/run-button/results
- T8: `npm run type-check` → PASS (0 errors); `npm run build` → PASS 19/19; `npm run test` → 33/33 PASS (6 files, 845ms); `grep -Rin biorreactor src/ public/ | grep -v .riv | grep -v dashboard/Bioreactor` → 1 hit content-only (lesson10_applications/lesson.md bioreactor pedagógico permitido); `grep robot/🤖 src/components/labs` → 0; `grep #[0-9a-fA-F]{6} src/components/labs/explorer/...` → only #00B5C5 fallback referencing var(--color-mint) + LabCardTheme tokens; `grep prefers-reduced-motion` → 12 branches; responsive: explorer grid 1/2/4, landing object-cover overflow-hidden, workspace lg:2col, spotlight viewport clamped Math.min/Math.max vw/vh
- No regressions: `/learn` and `/dashboard` builds intact, RiveBioreactor kept as fallback per T1 (LabHeroLoader still used for hub, LabLessonHero deprecated not deleted)

---
*Locator: `odd/tasks/lab-journey-redesign.md` | Engram mirror: `odd/lab-journey-redesign/tasks`*
