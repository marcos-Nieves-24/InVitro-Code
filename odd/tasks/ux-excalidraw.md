# Feature: ux-excalidraw — Wireframes separados con formato referencia

Objetivo: Generar TODOS los excalidraw de la UX actual por separados, clonando el formato hand-drawn de `~/Descargas/UX-design.excalidraw`.
Branch: feat/ux-excalidraw
Delivery: single-pr (docs only, sin código prod) — forecast ~28 archivos .excalidraw
Test runner: manual visual (excalidraw.com) + `python3 -m json.tool` validación + `npm run type-check` no-regresión

## Specs
S1 — Formato clonado: cada .excalidraw respeta tokens de referencia: strokeColor #1e1e1e, backgroundColor transparent, fillStyle solid, strokeWidth 4 (containers)/2 (detalles), roughness 1, opacity 100, roundness type:3 rectangles/type:2 lines, fontFamily 5, fontSize 16/20/28/36, hachure off. Verificado contra `~/Descargas/UX-design.excalidraw` (796 elements, 78 groups, 0 frames/files).
S2 — Separados por pantalla: 1 archivo por ruta + `00-index.excalidraw` con mapa de navegación. Naming `NN-nombre.excalidraw` en `docs/ux/excalidraw/`. 27 pantallas: 01-landing, 02-learn-index, 03-learn-lesson, 04-dashboard, 05-perfil, 06-comunidad, 07-laboratorios-index, 08-laboratorios-module, 09-laboratorios-lesson, 10-proyectos-index, 11-proyectos-module, 12-proyectos-lesson, 13-logros, 14-niveles, 15-configuracion, 16-bookmarks, 17-admin, 18-sign-in, 19-sign-up, 20-sso-callback, 21-terminos, 22-privacidad, 23-aviso, 24-cookies, 25-ia, 26-preview-lesson, 27-preview-bioreactor, + 00-index.
S3 — Contenido wireframe fiel: cada archivo refleja componentes reales de `src/app/*/page.tsx` y `src/components/*` (no placeholders genéricos). Incluye estados clave: default, empty, loading/error donde aplica, y anotaciones de interacción (tabs, modals, Pyodide).
S4 — Template base reutilizable: `docs/ux/excalidraw/_template.excalidraw` extraído de referencia con appState canónico, para que futuros excalidraw hereden el mismo contrato sin drift.
S5 — Validación: cada archivo es JSON válido (`type: excalidraw, version:2`), abre en excalidraw.com sin errores, y `docs/ux/README.md` documenta inventario y cómo editar (import/export, `npx mcp-excalidraw-server`).

## Tasks
- [x] T1 — Template base + scaffolding — Extraer `_template.excalidraw` de referencia + crear `docs/ux/excalidraw/` + `docs/ux/README.md` esqueleto. Route: inline. S4,S5 — done 2026-10-25
- [x] T2 — Core flows (Fase 1) — 01-landing, 02-learn-index, 03-learn-lesson, 04-dashboard, 05-perfil. Route: inline. S1,S2,S3 — done 2026-10-25
- [x] T3 — Comunidad + Labs/Proyectos (Fase 2a) — 06-comunidad, 07-laboratorios-index, 08-laboratorios-module, 09-laboratorios-lesson, 10-proyectos-index, 11-proyectos-module, 12-proyectos-lesson. Route: inline. S1,S2,S3 — done 2026-10-25
- [x] T4 — Dashboard extras + Admin (Fase 2b) — 13-logros, 14-niveles, 15-configuracion, 16-bookmarks, 17-admin. Route: inline. S1,S2,S3 — done 2026-10-25
- [x] T5 — Auth + Legal + Preview + Índice (Fase 3) — 18-sign-in, 19-sign-up, 20-sso-callback, 21-terminos, 22-privacidad, 23-aviso, 24-cookies, 25-ia, 26-preview-lesson, 27-preview-bioreactor, 00-index (mapa navegación). Route: inline. S1,S2,S3 — done 2026-10-25
- [x] T6 — QA y cierre — Validar JSON de 28 archivos, screenshots spot-check, actualizar README con inventario final, `type-check` pass. Route: inline. S5 — done 2026-10-25 (29 archivos: 28 pantallas + template, type-check pass, bad stroke 0)

## Log
L1 — 2026-10-25 — Request verbatim: "arma un plan para crear TODOS los excalidraw de mi UX actual con el formato que tiene ~/Descargas/UX-design.excalidraw" → respuesta con diagnóstico de formato (796 elements, 78 groups, tokens #1e1e1e/roughness1/fontFamily5) + inventario 27 pantallas. Usuario: "por separados" → entrega por archivos separados + 00-index.
