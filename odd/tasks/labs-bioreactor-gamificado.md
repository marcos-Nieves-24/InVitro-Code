# Labs Bioreactor Gamificado — ODD Feature

**Objetivo:** Refactorizar `/laboratorios` en Sala de Bioreactores gamificada con header animado (Rive + GSAP + Typed.js), cards temáticas por módulo usando favicons vectoriales, y HUD integrado reemplazando `Nivel 0 · Novato`.

**Problema:** Hub actual `src/app/(dashboard)/laboratorios/page.tsx:90` genérico, `InVitroTopBar.tsx:9` muestra `0 XP / 0 días` negativo, `LabCard.tsx:54` monocromática sin identidad por tema, `LabHub.tsx:61` sin estados gamificados, tokens gaming `globals.css:74-94` desaprovechados.

**Por qué:** Primera impresión vacía en labs frena retención; diferenciación temática + teatralidad de laboratorio aumenta engagement Duolingo-style para biotecnólogos.

**Scope autorizado:** Solo `src/app/(dashboard)/laboratorios/**`, `src/components/labs/**`, `public/labs/**`, `public/rive/**`, `src/app/globals.css` (keyframes burbujas). No tocar `Supabase`, `Clerk`, ni otras secciones dashboard. Leer `~/proyectos/material-visual-invitro-code/favicon/modulos/*.svg` permitido, no modificar origen.

**Constraints:** Sin emojis, ilustración vectorial favicon; `prefers-reduced-motion:109`; `dynamic ssr:false` para Rive/GSAP/Typed; no bloquear Pyodide; accesibilidad contraste ≥4.5:1.

**Stack header:** `rive/app` `@rive-app/canvas` + `greensock/gsap` ScrollTrigger+SplitText + `mattboldt/typed.js` — frases reales rotativas.

**Favicons mapeo (confirmado):** modulo-1→`ia` (order 1), modulo-2→`python` (order 2), modulo-3→`estadistica` (order 3), modulo-4→`machine-learning` (order 4). Optimizar con svgo `fill→currentColor`.

**TDD:** `strict_tdd: false` (vitest solo unit `environment:node`, sin coverage). Verificación por `npm run type-check` + `npm run build` + manual reduced-motion. Runner `npm run test` si se añaden tests.

**Delivery:** ODD work-unit commits en feature branch; `~400 líneas/task` heurística no bloqueante.

## Tasks

- [x] **LAB-01 F0 Assets** — Optimizar 4 favicons → `public/labs/modules/{ia,python,estadistica,ml}.svg` + placeholder `public/rive/bioreactor.riv` (+ `public/rive/README.md`). Verif: `ls -lh`, `npm run type-check` (svgo no disponible, limpieza manual con node script).
  - Commit: `de388b2`
  - Tamaños antes: ia=52KB, python=47KB, estadistica=49KB, ml=56KB (total 204KB)
  - Tamaños después: ia=9.1KB, python=5.7KB, estadistica=7.2KB, ml=12KB (total 34KB, 83% reducción)
  - Gotchas: c2pa manifest = ~40KB de metadata por archivo; fill original `#0F161F` y `#080808`;svgo no instalado, limpieza manual con regex node; viewBox se rompía al comprimir whitespace (proteger con split por quotes)
- [x] **LAB-02 F1 LabHero** — `src/components/labs/LabHero/{LabHero.tsx,RiveBioreactor.tsx,LabHeroCopy.tsx,useLabHeroMotion.ts}` + integración `laboratorios/page.tsx:76` (quitar `InVitroTopBar`, inyectar `LabHero` + HUD `calcLevel/rankTitle` `utils.ts:23,42`). Frases typed.js reales. Verif: `type-check + build`, Lighthouse perf.
  - Commit: `b980dc6`
  - Archivos creados: LabHero.tsx (174L), LabHeroCopy.tsx (54L), RiveBioreactor.tsx (101L), useLabHeroMotion.ts (110L), LabHeroLoader.tsx (29L), index.ts
  - page.tsx modificado: InVitroTopBar removido, LabHeroLoader importado con `dynamic ssr:false`, título/desc movidos al hero, id="hub" añadido al contenedor LabHub
  - Deps: `@rive-app/canvas ^2.42.2`, `typed.js ^3.0.0` añadidos, gsap sin duplicar
  - Gotchas: `dynamic ssr:false` no permitido en Server Components (Next.js 16) — requiere wrapper client `LabHeroLoader.tsx`. GSAP SplitText accessible en `gsap/SplitText` (no necesita Club GreenSock). `prefers-reduced-motion` se maneja en `useLabHeroMotion` (guard early return) + CSS tokens `--motion-*` en globals.css.
- [x] **LAB-03 F2 Hub/Cards** — `LabCardTheme.ts` + `LabCardArt.tsx` + refactor `LabHub.tsx:28` + `LabCard.tsx:43` con identidad por tema, `LabProgressRing`, `LabStreakPill`. Verif: visual 4 temas, estados card.
  - Commit: `7752079`
  - Archivos creados: LabCardTheme.ts (54L), LabCardArt.tsx (37L), LabProgressRing.tsx (53L), LabStreakPill.tsx (28L)
  - Archivos modificados: LabCard.tsx (138L → refactor completo), LabHub.tsx (142L → headers temáticos), index.ts (exports +4), modules.ts (LessonFrontmatter +estimatedDuration)
  - Gotchas: `framer-motion` motion import requiere client boundary en LabCard (ya era server-only antes, ahora importa desde client-safe). `LabCardTheme` type export con `export type` necesario por `isolatedModules`. SVG `currentColor` no hereda sin CSS `color` en el parent — LabCardArt aplica `style={{ color: theme.accent }}` al img. `aria-disabled` + `tabIndex=-1` para cards bloqueadas sin wrapper `<div>`.
- [ ] **LAB-04 F3 Lección** — `LabLessonHero` compacto en `laboratorios/[module]/[lesson]/page.tsx:112` + `LabCallout` tint tema. Verif: build + navegación lección.
- [ ] **LAB-05 F4 Polish** — `LabXpToast` + `framer-motion` hover + `vitest` para theme map + `globals.css` keyframes burbuja. Verif: `npm run test`, `type-check`, `build`.

## Progreso

- 2026-09-21: Feature creado, 5 tasks. Branch pendiente. Mirror Engram pendiente sync.
- 2026-09-21: LAB-01 completado. Commit `d44e5c0` en `feat/uiux-master-redesign`.
- 2026-09-21: LAB-02 completado. Commit `b980dc6` en `feat/uiux-master-redesign`.
- 2026-09-21: LAB-03 completado. Commit `7752079` en `feat/uiux-master-redesign`.

## Criterios de aceptación

- [ ] `Nivel 0 · Novato / 0 XP / 0 días` no visible en `/laboratorios` y lección; HUD integrado en hero muestra progreso real.
- [ ] 4 cards con favicon vectorial + tint por módulo, sin emojis, hover `card-hover/widget-hover`.
- [ ] Hero con Rive burbujas + GSAP burbujas ascendentes + Typed 7 frases reales, respeta `prefers-reduced-motion`.
- [ ] `npm run type-check` + `npm run build` verdes.

## Próximo paso

Ejecutar LAB-03.
