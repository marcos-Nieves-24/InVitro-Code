# Auditoría de commits locales sin push — `ff0af93..cef461a`

Rango auditado: 14 commits, 126 archivos, +1941/-8354. Método: `git show`/`git diff` sobre objetos (árbol de trabajo intacto en `ff0af93`); sin checkout, sin commit. Reportes detallados: `AUDITORIA_COMMITS_LOCALES_HIGIENE.md`, `AUDITORIA_COMMITS_LOCALES_HARNESS.md`, `AUDITORIA_COMMITS_LOCALES_PRODUCTO.md`.

## Veredicto por commit

| SHA | Veredicto | Nota |
|---|---|---|
| `60b7e4c` middleware crons públicos | **CORRIGE** P1 (FN-CRON-01/HX-CRON-02) | `middleware.ts:12-15` suma las 2 rutas al gate público. **Efecto secundario**: endurece la superficie del P0 (ver abajo) |
| `9aecd0c` vitest `.mjs` | **CORRIGE** | glob aditivo; test real de 5 casos, **ejecutado: 5/5 verde** |
| `ed07f34` Node 22 pin | **CORRIGE** | convención, no enforcement (sin CI) |
| `c4ba33c` env docs | **CORRIGE** | CRON_SECRET/RESEND_API_KEY documentados vacíos; RESEND sí se usa (`daily-nudge/route.ts:111-115`) |
| `ecdd595` sync docs | **PARCIAL** | llevó conteos a 20/192; el tip real ya es 21/199; introdujo claims falsos nuevos (`AGENTS.md:91` skills inexistentes) |
| `3d7ba2e` "archive 11 changes" | **BLOQUEANTE** | `git show --name-status`: **82 D, 0 A**. Borró los changes, no los movió a `changes/archive/`. Pérdida documental |
| `52e87fc` Fase 0 harness | **SÓLIDO** | evidencia honesta con desviaciones |
| `d45d72a` Fase 1 | **PARCIAL** | 4 skills concretas; `design.tokens.json` es doc muerta (nadie la importa) y **6/10 colores contradicen `globals.css`** (radii 4/8/12 vs 6/10/16) |
| `6abcc5e` Fase 2 | **PARCIAL** | skills buenas + triaje real; sigue con los follow-up abiertos |
| `3fff1dd` Fase 3 | **RIESGO** | el gate `npm run design:check` **falla**: `design-guide.yaml` no matchea el schema del CLI (`$.schemaVersion`, `$.prohibitions`, `tokens` debe ser objeto inline). Fase 3 committeó gate rojo verificado solo con `--help` |
| `87b3cd7` LabOfflineNotice | **SÓLIDO (scoped)** | lógica limpia + test honesto; **ningún `lesson.md` lo usa** — es capacidad, no feature |
| `88a038b` OverfittingPlayer | **SÓLIDO** | corrige bug REAL verificado en ff0af93: autoPlay congelaba la animación en t=0 (`useAnymotionTimeline.ts:45,48,83,115-122`). Hex en SVG = patrón preexistente, no la violación de AuthForm |
| `2f03e1d` LessonVideo | **PARCIAL** | registro OK; `<video>` sin `<track>` → subtítulos siguen abiertos |
| `cef461a` dots 24px + "TDZ fix" | **PARCIAL** | dots 24×24 con span `aria-hidden` **cumple WCAG 2.2 SC 2.5.8**; el "TDZ crash" nunca existió en la base y `handleAdvance`/`registerRevealAdvance`/`consumeRevealAdvance` quedaron **sin call sites** (código muerto; `noUnusedLocals` off lo disimula) |

## Bloqueantes para push

1. **`3d7ba2e` perdió documentación.** Antes de pushear: recuperar los 11 changes a `openspec/changes/archive/` desde `ff0af93` (mover, no borrar).
2. **`3fff1dd` tiene el gate en rojo.** No pushear hasta reescribir `design-guide.yaml` al schema real y ver `npm run design:check` en exit 0.
3. **`cef461a` promete un fix que no existe.** Eliminar el registry muerto o cablearlo de verdad en `lesson-carousel.tsx:107`.

## Lo que estos commits NO tocan (sigue abierto)

- **P0 intacto y agravado**: `git diff ff0af93..cef461a -- src/app/api/cron/` es **vacío**. `purge-pending` sigue aceptando `x-vercel-cron` como credencial (`route.ts:17-18`), ahora sobre ruta que `60b7e4c` hizo pública en middleware.
- Headers de seguridad ausentes (`next.config.ts` sin `headers()`).
- Contraste 2.62:1 en enlaces de consentimiento (`AuthForm`, 17 hexes intactos).
- Hero `#111439` fuera de tokens (`page.tsx:23`).
- `InteractiveFrame` roto en `lesson03:187` (`demo_10_pipeline_ml.html`; el real es `demo_10_pipeline.html`).
- `focus-visible` en Header/Footer.

## Estrategia de push recomendada

**Push selectivo, no el rango completo:**
1. Pusheables ya: `60b7e4c`, `9aecd0c`, `ed07f34`, `c4ba33c`, `52e87fc`, `88a038b`, `2f03e1d`, `87b3cd7` (quitar `[harness demo]` si va a main).
2. Pusheables modificados: `d45d72a` (corregir 6 colores + radii + escala de tipos), `6abcc5e`, `ecdd595` (conteos por comando, no por número; corregir AGENTS.md).
3. Bloqueados: `3d7ba2e`, `3fff1dd`, `cef461a` (requieren trabajo previo).

Nota: el carrusel de `lesson02` quedó con el InteractiveFrame roto corregido por `88a038b`; `lesson03` sigue roto.
