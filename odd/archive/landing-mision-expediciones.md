# Landing — Misión/Visión + Expediciones editorial

**Objetivo:** Corregir Misión/Visión (títulos, rects justificados sin Lucides, glass leve) y evolucionar "Expediciones del curso" a carrusel editorial premium (fondo claro con textura ambiental sutil, card activa destacada, secundarias atenuadas, flechas + dots).

**Problema:** Misión/Visión usa label "Pilares", iconos Lucide que desperdician espacio, textos sin justificar y contenedor sólido sin personalidad. Expediciones vive en `bg-[#111439]` oscuro con anillo 3D orbital auto-rotado (`OrbitalModules.tsx` perspective/rAF/billboard) que no comunica jerarquía editorial ni coincide con la referencia visual (4 visibles con activa destacada).

**Por qué:** Usuario pidió explícitamente en español: Título `Donde la biotecnología encuentra la IA` / Subtítulo `Construimos el puente entre las ciencias de la vida y la inteligencia artificial.` + spec premium 16 puntos (fondo #F8FBFA, decoración 5-12% solo bordes, header CONTENIDO teal, título navy #101B3D 42-52px, card activa con acento teal fino, sin glow fuerte, `Menos elementos, mejor ejecutados`). Requiere sobreescritura directa sin código muerto.

**Scope autorizado:** `src/components/landing/MissionDendrogram.tsx`, `src/components/landing/Modules.tsx`, `src/components/landing/OrbitalModules.tsx` (rewrite directo), `src/components/shared/ModuleCardContent.tsx` (pills/icon ajuste menor), `src/app/globals.css` solo si hace falta util `.expeditions-*`. No tocar dashboard, `LabCardTheme`, lógica de módulos, otras secciones landing.

**Constraints:** Mantener datos `modules[MOD-01..04]` y links `/sign-in` existentes; no cambiar contenido/lógica de curso; no dashboard; paleta nueva solo para esta sección (`#F8FBFA/#FFFFFF/#101B3D/#0AAE9A/#DDF5EF/#47769A/#DCEAE8/#668094`); animaciones 250-400ms sin parallax/rebote; responsive 4/2-3/1; decoración solo bordes no compite con cards; glass leve con `backdrop-blur-xl`.

**TDD:** `strict_tdd: false` (vitest node-only). Gates: `npm run type-check` + `npm run build`. Visual desktop ≥1024 y mobile.

**Delivery:** ODD work-unit commits en feature branch `odd/lab-heroes-restore` (ya activo, branch-first cumplido). Heurística ~400 líneas advisory.

## Tasks

- [x] **LM-01 Misión header + Pilares + glass** — En `MissionDendrogram.tsx:221-233` aplicar Título/Subtítulo nuevos, eliminar `<text>Pilares</text>` `417-432`, quitar `FlaskConical/Users/Globe` de imports y `pilares[]`, borrar círculos+foreignObject Icon en Rects `469-581` y Vision `583-658`, centrar títulos, divider `CARDS_Y+42`, desc justify `14px/1.6` `CARD_W-28`, container `border-white/40 bg-white/65 backdrop-blur-xl backdrop-saturate-150`.
- [x] **LM-02 Expediciones fondo + header editorial** — En `Modules.tsx` cambiar `section#modulos` de `bg-[#111439]` a `bg-[#F8FBFA] relative overflow-hidden`, header a `CONTENIDO` teal `12px tracking 0.22em uppercase`, título navy `42-48px`, subtítulo `#668094 17px max-w-[680px]`, agregar 2 blobs mint + 2 arcos SVG `stroke #DDF5EF 0.9px opacity .5` `pointer-events-none` en bordes 5-12%.
- [x] **LM-03 Carrusel rewrite (sobreescribir)** — Reescribir `OrbitalModules.tsx` eliminando `ROTATION_SPEED/PERSPECTIVE/RING_RADIUS/FADE/ rAF /preserve-3d/billboard` y todo 3D; implementar estado `activeIndex` (init 3 = MOD-04), track `flex gap-5` con `translateX`, cards `320px rounded-[18px] border-[#DCEAE8] bg-white`, activa `scale 1.04 min-h 320 acento border-l #0AAE9A shadow 0_16_40`, secundarias `opacity-60 saturate 0.92`, flechas circulares `h-9 w-9 bg-white border #DCEAE8 text #0AAE9A`, dots `bg #0AAE9A` activo, responsive 4/2-3/1 sin overflow, `prefers-reduced-motion`.
- [x] **LM-04 Pills + icon pulido** — En `ModuleCardContent.tsx` ajustar chip `11px`, art `56`, pills XP/Labs `bg #F0F9F7 border #DCEAE8 text #47769A text-xs` con icon `text #0AAE9A` y círculo `bg #DDF5EF`.
- [x] **LM-05 Verificación** — `npm run type-check`, `npm run build`, smoke visual (glass, justify, 4 visibles con activa, flechas/dots).
- [x] **LM-06 Playwright polish (post-review 2026-10-01)** — Playwright `npm run dev` evidenció: Expediciones muestra 1 sola card (Machine Learning) centrada en vez de 4 visibles `[parcial][ACTIVA][sec][parcial]`; translate `offset=active*340` deja off-screen a vecinas. Misión Rects con justify inter-word genera gaps exagerados y "Accesibilidad" se percibe cortado por ancho. Ajustar: (a) carrusel a ventana rotada circular para lograr 4 visibles sin huecos, viewport con peek lateral 16px, (b) justify suavizado con `hyphens:auto` sin `inter-word` y ancho texto `CARD_W-28`, (c) verificar glass y header centrado a 1280.
- [x] **LM-07 Borde, carrusel premium + MOD #00B5C5 (2026-10-01)** — Playwright 20:45 evidencia 4 visibles pero: (a) borde inferior de cards toca el Div (sombra recortada por `overflow-hidden` sin `pb`), (b) carrusel actual es `justify-center` sin slide — falta efecto translate suave comparado con referencia, (c) chip MOD-x usa `theme.accent` oscuro, debe ser `#00B5C5`. Verificar además que Misión header `Donde la biotecnología...` quede visible (ya agregado en 212-220 pero usuario reporta no verlo — confirmar render). **Fix:** viewport `overflow-visible md:overflow-hidden pb-10` para aire 16px bajo cards + `ul` micro-slide `translateX(trackOffset)` `380ms cubic-bezier(0.16,1,0.3,1)` + chip MOD fijo `#00B5C5` + Misión header sin `reveal` oculto.
- [x] **LM-08 Tipografía +1-2px + carrusel 2x botones/dots full width (2026-10-01)** — Usuario: olvida diagramación, solo +1-2px fuente; carrusel botones laterales 2x por fuera y dots 2-3x aprovechando todo el ancho (fiel a imagen). **Fix:** `MissionDendrogram.tsx:212-220` h1 `text-[12px] md:text-[13px] font-mono tracking-[0.22em] text-[#00B5C5]`, h2 `text-[34px] md:text-[44px]`, h3 `text-[18px] md:text-[19px]`; `Modules.tsx` inner `max-w-[1360px] px-2 md:px-6`; `OrbitalModules.tsx` `CARD_W 332 GAP 16` (4*332+3*16=1376 llena 1360 con peek), viewport `px-2 md:px-[8px] gap-4 pb-10`, flechas `h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 left-2 md:left-[-8px] right-2 md:right-[-8px] top-[45%] border-[#E2E8F0] shadow-[0_8px_24px_rgba(16,27,61,0.10)] Chevron 22px`, dots `h-3 w-3 md:h-3.5 md:w-3.5 / h-2.5 w-2.5 mt-8 md:mt-10 gap-3 md:gap-4`; sin código muerto, sin tocar glass/SVG/chip #00B5C5.
- [x] **LM-09 Flechas fuera gutter 96 centradas (2026-10-01)** — Alinear botones por fuera sin solape, fiel a imagen, aprovechando 1360. **Fix opción A:** `OrbitalModules.tsx:115` viewport `px-12 md:px-16` → `px-20 md:px-24` (gutter 80/96; offset 24 + botón 56 + aire 16 = 96 → 16px libres card-botón); `OrbitalModules.tsx:173-189` flechas `left-2 md:left-4 right-2 md:right-4 top-[42%]` → `left-4 md:left-6 right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 md:h-14 md:w-14 lg:h-14 lg:w-14` `bg-white border-[#E2E8F0] shadow-[0_8px_24px_rgba(16,27,61,0.10)] text-[#0AAE9A] Chevron 22`; `Modules.tsx:48` inner `px-2 md:px-6` → `px-2 md:px-4` (aire externo mínimo, gutter viewport da espacio). Mantiene `CARD_W 332 GAP 16` (1376=1360+16 peek 8px/lado), `ordered` circular, `micro-slide`, `dots 2-3x`, `chip #00B5C5`, tipografía H1/H2/H3 intactos. Sin tocar `MissionDendrogram.tsx`.
- [x] **LM-10 Animación scroll fluida 380ms + arrastre momentum mobile (2026-10-01)** — Añadir scroll fluido por botones/dots (380ms) y drag con momentum en mobile con `motion` (A+C). **Scope:** `OrbitalModules.tsx` → `motion.ul` con `x` spring/tween + `drag="x"` en mobile + `prefers-reduced-motion` fallback; `Modules.tsx` viewport `overflow-x-hidden overflow-y-visible` para no recortar sombra durante slide.

## Progreso
- 2026-10-01: feature doc creado, branch `odd/lab-heroes-restore` activo.
- 2026-10-01: LM-01..LM-04 implementados con sobreescritura directa sin código muerto; `CARD_H 215` sin overflow verificado.
- 2026-10-01: Playwright dev review (http://localhost:3000) — Expediciones 1-card bug confirmado, Misión justify gaps; creado LM-06.
- 2026-10-01: LM-06 ejecutado — carrusel ventana rotada 4 visibles + justify suavizado; `npm run type-check: passed`; Playwright 20:45 confirma 4 visibles pero borde tocando y MOD color pendiente (LM-07).
- 2026-10-01: LM-07 ejecutado — borde pb-10 + micro-slide translateX + MOD #00B5C5 + Misión header visible; `npm run type-check: passed` · `npm run build: passed`.
- 2026-10-01: Usuario confirmó +1-2px tipografía y carrusel 2x/dots 2-3x full width (LM-08 pendiente).
- 2026-10-01: LM-08 ejecutado — tipografía +1-2px (h1 12→13, h2 32/42→34/44, h3 17→18/19) + carrusel full width 1360 (332/16) + flechas 2x por fuera (-8px) 48-56px + dots 2-3x; `npm run type-check: passed` · `npm run build: passed`.
- 2026-10-01: LM-09 ejecutado — viewport gutter 80/96 + flechas top-1/2 z-10 centradas sin solape + inner px-2 md:px-4; `npm run type-check: passed` · `npm run build: passed` (Next 16.2.10 Turbopack, 21/21 static).
- 2026-10-01: Usuario pidió animación scroll fluida 380ms + drag mobile (LM-10 pendiente, ODD).
- 2026-10-01: LM-10 ejecutado — `OrbitalModules.tsx` motion.ul `animate x` 380ms `[0.16,1,0.3,1]` + drag mobile `x` elastic 0.2 momentum + `useReducedMotion` fallback + `willChange touch-pan-y` + `Modules.tsx` `overflow-x-hidden overflow-y-visible`; `npm run type-check: passed`.

## Evidencia
- `4f8c910` feat(landing): mission header + pilares justified without icons + glass — `MissionDendrogram.tsx`
- `53a7ee9` feat(landing): expediciones header editorial + fondo claro con decoracion ambiental — `Modules.tsx`
- `5f2be31` feat(landing): rewrite carrusel expediciones a editorial con activa destacada — `OrbitalModules.tsx`
- `c4bbb88` feat(landing): pills expediciones con acento teal y art 56px — `ModuleCardContent.tsx`
- `79c234e` fix(landing): expediciones 4 visibles y mision justify polish — ventana rotada circular + hyphens sin inter-word (LM-06)
- `e4c9e2d` fix(landing): lm-07 borde carrusel y MOD #00B5C5 — viewport pb-10 + micro-slide + chip #00B5C5 + header sin reveal (LM-07)
- Verificación: `npm run type-check: passed` · `npm run build: passed (Next 16.2.10 Turbopack, 21/21 static)`
- Playwright screenshots 2026-10-01T20:40-45: Hero ok, Misión dendrograma ok con header nuevo (212-220), Expediciones 4 visibles con borde inferior al ras (bug LM-07).
- `cc12b1d` fix(landing): lm-08 tipografia +1-2px y carrusel 2x full width — `MissionDendrogram.tsx` h1/h2/h3 + `Modules.tsx` 1360 + `OrbitalModules.tsx` 332/16 flechas 2x dots 2-3x (LM-08)
- `872af19` fix(landing): lm-09 flechas fuera gutter 96 centradas — `OrbitalModules.tsx:115` px-20 md:px-24 + `173-189` left-4 md:left-6 right-4 md:right-6 top-1/2 z-10 + `Modules.tsx:48` px-2 md:px-4 (LM-09)
- `7cd1a71` feat(landing): lm-10 scroll fluido 380ms + drag mobile — `OrbitalModules.tsx` motion.ul `animate x` 380ms + drag `x` momentum mobile (elastic 0.2, constraints -1044/0, velocity ±500) + `useReducedMotion` + `willChange touch-pan-y` + `Modules.tsx` `overflow-x-hidden overflow-y-visible` (LM-10)

## Siguiente paso
- Verificación visual desktop ≥1024 y mobile (tipografía + carrusel 1360 sin recorte, flechas por fuera, dots full width).
- Cierre ODD o siguiente feature según roadmap.
