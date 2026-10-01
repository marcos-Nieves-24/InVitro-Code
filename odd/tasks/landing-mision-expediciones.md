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

## Progreso
- 2026-10-01: feature doc creado, branch `odd/lab-heroes-restore` activo.
- 2026-10-01: LM-01..LM-04 implementados con sobreescritura directa sin código muerto; `CARD_H 215` sin overflow verificado.
- 2026-10-01: Playwright dev review (http://localhost:3000) — Expediciones 1-card bug confirmado, Misión justify gaps; creado LM-06.
- 2026-10-01: LM-06 ejecutado — carrusel ventana rotada 4 visibles + justify suavizado; `npm run type-check: passed`; Playwright 20:45 confirma 4 visibles pero borde tocando y MOD color pendiente (LM-07).
- 2026-10-01: LM-07 ejecutado — borde pb-10 + micro-slide translateX + MOD #00B5C5 + Misión header visible; `npm run type-check: passed` · `npm run build: passed`.

## Evidencia
- `4f8c910` feat(landing): mission header + pilares justified without icons + glass — `MissionDendrogram.tsx`
- `53a7ee9` feat(landing): expediciones header editorial + fondo claro con decoracion ambiental — `Modules.tsx`
- `5f2be31` feat(landing): rewrite carrusel expediciones a editorial con activa destacada — `OrbitalModules.tsx`
- `c4bbb88` feat(landing): pills expediciones con acento teal y art 56px — `ModuleCardContent.tsx`
- `79c234e` fix(landing): expediciones 4 visibles y mision justify polish — ventana rotada circular + hyphens sin inter-word (LM-06)
- `e4c9e2d` fix(landing): lm-07 borde carrusel y MOD #00B5C5 — viewport pb-10 + micro-slide + chip #00B5C5 + header sin reveal (LM-07)
- Verificación: `npm run type-check: passed` · `npm run build: passed (Next 16.2.10 Turbopack, 21/21 static)`
- Playwright screenshots 2026-10-01T20:40-45: Hero ok, Misión dendrograma ok con header nuevo (212-220), Expediciones 4 visibles con borde inferior al ras (bug LM-07).

## Siguiente paso
- Verificación Playwright LM-07 (viewport pb-10 + translate + MOD #00B5C5 visibles) y cierre ODD si todo ok.
