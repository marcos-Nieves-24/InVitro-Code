# Unified Lab-Proyectos System — Hero + Cards + Consoles + Botón único + Dashboard guiado

## Objetivo
Unificar el sistema visual de Laboratorios y Proyectos bajo la misma plantilla de Hero (con banner + consola gráfica), el mismo sistema de Cards (orbital híbrido + interior unificado), consolas gráficas por módulo, botón primario único (`SlideArrowButton`), y diagrama guiado en el Dashboard (`Tu progreso` + `Misión Actual`). Centralizar textos en `module.json` en lugar de hardcodear.

## Por qué
Landing y Labs divergieron: Orbital 3D vs grid, Hero con video vs pixel-art vs consola simple, ProjectCard desactualizado, múltiples estilos de botón, Dashboard sin guía. El usuario aprobó plan v4 y pidió llevar hasta el final con verificación Playwright.

## Alcance
- Cards: híbrido orbital + interior `ModuleCardContent` (Opción A)
- Heroes: `HeroWithConsole` + `heroImages.ts` + fallback video, para `/laboratorios` y `/laboratorios/[module]` y `/proyectos` y `/proyectos/[module]`
- Consolas: 5 variantes (`Hub, Intro, Python, Stats, ML`) + terminal chrome extraído
- Proyectos: replica Labs (hub grid + cards temáticas + hero por módulo con `proyecto-modulo-*.png` y `proyectos.png`)
- Botones: `SlideArrowButton` como primario único, migrar Landing/CTAs y `Button.tsx` deprecated
- Dashboard: `Tu progreso` biorreactor a la derecha 2× + texto EXP; `Misión Actual` con descripción de módulo + texto crecimiento planta; textos vía `module.json`
- Assets: copiar 10 imágenes desde `material-visual/laboratorio/` a `public/`

## Fuera de alcance
- Cambios de API/Supabase, RLS, Clerk, `supabase-migration.sql`
- Rewrites de `InVitroShell`, `GamingHUD`, `CommandPalette`
- Cambios de contenido MDX salvo `module.json`

## Restricciones
- Node >= 20.9, Next 16, Tailwind v4, `npm run type-check` + `npm run build` como gates (lint roto por diseño)
- RDD ON: cada work-unit commit pasa por `gentle-ai review assess` / `review status`
- ~400 líneas por PR slice (work-unit-commits heuristic)

## Tareas

### T0 — Assets
- [x] Copiar `banner.png`, `modulo-1..3.png`, `mdoulo-4.png→modulo-4.png`, `proyectos.png`, `proyecto-modulo-1..4.png` a `public/laboratorio/` y `public/proyectos/` (o `public/labs/` unificado). Verificar `next/image` y `imageRendering`. Commit. — fec6652 2026-09-28 (11 archivos, `ls -lh` verificado)

### T1 — Cards Landing híbrido
- [x] Crear `src/components/shared/ModuleCardContent.tsx` (chip accent 14%/30, LabCardArt 88, title, pills XP/labs, BiotechGrowthTube opcional, prop `compact`) — fec6652
- [x] Refactor `ModuleExplorerCard` → wrapper delega a `ModuleCardContent`
- [x] Refactor `OrbitalModules` interior → `ModuleCardContent compact`, ajustar `CARD_WIDTH 280→320`, `RING_RADIUS 340→360`, `extentHalf`, `PERSPECTIVE`, `fitScale`
- [x] Mobile/reduced-motion grid también usa compartido. Verificar visual.

### T2 — Hero template unificado
- [x] Crear `src/components/shared/HeroWithConsole.tsx` (grid lg:2, bg fill + overlay #111439/60, copy + consola, `mediaFallback` opt-in video) — fec6652
- [x] Crear `src/lib/labs/heroImages.ts` (hub banner, 4 módulos lab, hub proyectos, 4 módulos proyecto). Deprecar `heroVideos.ts` detrás de flag. — fec6652
- [x] Migrar `LabHero.tsx` (hub) y `LabLandingHero.tsx` (módulo) a `HeroWithConsole`
- [x] Migrar `laboratorios/page.tsx` y `laboratorios/[module]/page.tsx` props (video → heroImages + console switch)

### T3 — Consolas variantes
- [x] Extraer `TerminalChrome` de `InteractiveTerminal.tsx:213` → `src/components/shared/TerminalChrome.tsx` — fec6652
- [x] Crear `src/components/labs/consoles/{Hub,Intro,Python,Stats,Ml}Console.tsx` con mismo chrome, payloads distintos (dendrograma, Hola IA, pandas, histograma motion, scatter). Respetar `prefers-reduced-motion`.

### T4 — Botón único
- [x] Extender `SlideArrowButton.tsx:13` con `variant primary|secondary` y `size sm|md|lg`
- [x] Marcar `Button.tsx:7` deprecated, delega `primary` a `SlideArrowButton`
- [x] Migrar `app/page.tsx:46` (2 CTAs), `LabLandingHero` CTA, `RCopyButton.tsx:12` (emerald/slate) y `DashboardContainer:187` ya usa SlideArrowButton (verificar). Tests visuales.

### T5 — Proyectos replica Labs
- [x] Hub `/proyectos/page.tsx:49` → HeroWithConsole (`proyectos.png`) + grid `ModuleCardContent` (theme/tint/art/XP) reemplazando acordeón `ProjectHub`
- [x] Refactor `ProjectCard.tsx:47` → delega a `ModuleCardContent`
- [x] Crear `src/app/(dashboard)/proyectos/[module]/page.tsx` espejo de `laboratorios/[module]/page.tsx` con `proyecto-modulo-*.png` + consola

### T6 — Dashboard "Tu progreso" rediagramación
- [x] `DashboardContainer.tsx:118` — grid `md:grid-cols-[1.1fr_auto]`, copy izquierda + `BioreactorProgress size xl (w320 h440)` derecha (nuevo `size xl` en `BioreactorProgress.tsx:22`), `glass-card p-6`, texto EXP: "El tanque se llena con EXP: cada lección suma XP y eleva el líquido. Al llenarse, subís de nivel."
- [x] Texto vía `module.json` field `progressHint` / fallback global en lib

### T7 — Dashboard "Misión Actual" guiado + module.json
- [x] Extender `src/lib/content/modules.ts` `readModuleJson` para `description` (ya), `shortDescription`/`missionBlurb`, `expHint`, `growthHint` + helpers `getModuleShortDescription`/`getModuleProgressHint`/`getModuleGrowthHint` — fec6652
- [x] Actualizar `src/content/modules/*/module.json` (ia, python, estadistica, machine-learning) con `shortDescription`, `progressHint`, `growthHint` (no hardcodear en componente) — fec6652
- [x] `DashboardContainer.tsx:151` — bajo `moduleName` mostrar `shortDescription` line-clamp-2, y bajo barra módulo agregar guía planta: "La planta crece con cada módulo: {completed}/{total} → {overallProgress}% crecimiento in-vitro."
- [x] Verificar fallback si `module.json` no tiene nuevos campos

### T8 — Verificación & Playwright
- [x] `npm run type-check` + `npm run build` por cada T — type-check PASS (tsc 0 errors), build PASS Next 16.2.10 compiled 14.3s + 19/19 static pages, rutas `/proyectos` y `/proyectos/[module]` en Route table
- [x] Playwright: `/` → orbital híbrido verificado (snapshot: cards MOD-01..04 ahora muestran 80/340/200 XP + labs pill + chip theme, SlideArrowButton "Empezar ahora"/"Iniciar sesión" size lg), `HeroBackground` + `InteractiveTerminal` intactos; `/laboratorios` `/proyectos` `/dashboard` → redirect a `/sign-in` por Clerk proxy (comportamiento esperado sin auth); verificación code-level para vistas autenticadas: `HeroWithConsole` con banner correcto (`heroImages.ts`), consolas variantes (`Hub/Intro/Python/Stats/Ml` con TerminalChrome + motion), `DashboardContainer` grid `1.1fr_auto` + `BioreactorProgress xl 320x440` a la derecha + `getModuleProgressHint` + `getModuleShortDescription`/`getModuleGrowthHint` con line-clamp-2 y planta `completed/total → overallProgress%`

## Criterios de aceptación
- Orbital conserva animación 3D pero cada card muestra chip accent, art 88, XP/labs pill y footer como Labs
- `/laboratorios` y cada `/laboratorios/[module]` usan `HeroWithConsole` con banner correcto y consola gráfica distinta; video solo si flag
- `/proyectos` hub y `[module]` replican estructura Labs con sus 5 banners
- Todo CTA primario es `SlideArrowButton`; no queda `Button primary` ni `Link bg-mint` suelto
- Dashboard `Tu progreso`: biorreactor a la derecha 2×, texto EXP presente desde `module.json` o fallback
- Dashboard `Misión Actual`: descripción módulo + texto crecimiento planta desde `module.json`
- `npm run type-check` y `npm run build` pasan; Playwright confirma sin regresiones visuales

## Progreso
- Branch: `odd/unified-lab-proyectos-system` (a crear desde `odd/lab-journey-redesign`)
- Commits work-unit por T, RDD assess por commit

## Fix v5 — 2026-09-28 — db98107
- [x] Bug proyectos serializable (CRITICAL, build blocker): `ModuleCardContent` `theme: LabCardTheme` → `SerializableLabCardTheme` + `LabCardArt` prop union `LabCardTheme | SerializableLabCardTheme` con fallback icon; `proyectos/page.tsx` `toSerializableTheme(getLabCardTheme(...))` — `npm run type-check` PASS
- [x] Modules fondo oscuro + Tu Progreso duplica: `Modules.tsx` `bg-surface-card` → `bg-[#111439]` + header `text-white/60` / `text-white` / `text-white/70`; `BioreactorProgress` prop `hideMeta` envuelve `Nivel/level/rank` y `EXP/%`; `DashboardContainer` `items-center` → `items-start pt-2` + `self-start` + `hideMeta` en `size xl` + `mt-4→mt-3`
- Commit: `db98107 fix(proyectos): make theme serializable and apply dark modules bg with dashboard declutter`

## Próximo paso
T0 assets → T1 cards → T2 hero → T3 consolas → T4 botones → T5 proyectos → T6/T7 dashboard → T8 playwright → Fix v5 aplicado
