# Auditoría integral de plataforma — InVitro-Code (2026-10-11)

## Objective
Determinar, con evidencia verificable del repo, qué necesita InVitro-Code para operar de forma legal, segura, funcional, accesible, mantenible y económicamente sostenible, y entregar los 8 documentos de auditoría que el usuario solicitó.

## Problem / Why
El usuario pidió un checklist maestro de auditoría con entregables obligatorios antes de proponer cualquier modificación. Ya existe trabajo previo sustancial (`legal/`, auditorías ODD F1-F11, `odd/tasks/expediciones-ux-audit.md`) que debe reconciliarse, no reescribirse desde cero.

## Scope
- Read-only sobre `src/`, `legal/`, `supabase-migration.sql`, configuración y git.
- Escritura autorizada SOLO de los 8 entregables `.md` en la raíz del repo.
- NO se modifica código, rutas, políticas, esquema ni producción. NO se instalan dependencias.

## Constraints
- HEAD desacoplado en `ff0af93` (worktree `presentation-reemplazo-directo`). Los entregables no tocan la rama de presentation.
- Pruebas: `npm run type-check`, `npm run test`, `npm run build` (Node v22.23.2, ok para Next 16).
- Todo hallazgo requiere `path:line` o comando de reproducción. Separar HECHOS / SOSPECHAS / PREGUNTAS.
- Idioma de artefactos: español (el usuario lo pidió explícitamente para esta auditoría).

## Tasks
- [x] T1 — Reconocimiento: estado git, inventario previo (`legal/`, `odd/tasks/legal-*`), rutas y mapa repo.
- [x] T2 — Mapeo backend/auth/RLS delegado (14 rutas API, RLS 11 tablas, cron, secretos).
- [x] T3 — Mapeo frontend/UX/contenido delegado (páginas, componentes, a11y, DESIGN.md, stubs).
- [x] T4 — Verificaciones ejecutables: type-check OK, 19 archivos/187 tests PASS, build 43 rutas (Node v22.23.2).
- [x] T5 — `AUDITORIA_ESTADO_ACTUAL.md` (387 líneas)
- [x] T6 — `MATRIZ_CUMPLIMIENTO_LEGAL.md` (197 líneas)
- [x] T7 — `AUDITORIA_SEGURIDAD.md` (311 líneas)
- [x] T8 — `AUDITORIA_UX_UI.md` (463 líneas)
- [x] T9 — `AUDITORIA_FUNCIONAL.md` (303 líneas)
- [x] T10 — `AUDITORIA_SOSTENIBILIDAD.md` (195 líneas)
- [x] T11 — `PLAN_ACCION_PRIORIZADO.md` (100 líneas)
- [x] T12 — `REGISTRO_DE_EVIDENCIAS.md` (88 líneas)
- [ ] T13 — Cierre: informe al usuario, pendientes de autorización. Sin commit hasta decisión del usuario.

## Correcciones durante la auditoría (verificado vs enunciado)
- Build: 43 rutas (11 estáticas / 32 dinámicas, 15 API), no 30 — el "(30/30)" del log son pasos de prerender.
- 15 rutas API (no 16). Tests reales 19/187 (docs dicen 6/37, desactualizado en 5 lugares).
- `requestId-descarte.test.mjs` NO corre (glob solo .ts/.tsx), pese a doc que dice que sí.
- Rama local avanzó de 88a038b a cef461a durante la sesión: 14 commits sin push, varios con fixes reales (60b7e4c crons públicos, 9aecd0c glob vitest) que aún no están mergeados ni aplicados al HEAD auditado ff0af93.
- Correcciones a claims iniciales: `BiotechGrowthTube` y `ui/Callout` NO son dead code; `vercel.json` existe; legal/security-audit.md tiene 6 afirmaciones stale.

## Acceptance criteria
- Cada entregable existe, cita evidencia `path:line` o comandos, y usa estados NO_AUDITADO/CUMPLE/PARCIAL/NO_CUMPLE/BLOQUEADO/NO_APLICA.
- Cada hallazgo tiene el formato obligatorio del usuario (ID, categoría, estado, evidencia, impacto, prioridad P0-P3, solución, archivos, criterio de aceptación).
- Cero invenciones: nada de NIT, certificaciones, políticas ni funcionalidades afirmadas sin evidencia.
- Producción intacta; git sin cambios de código.

## Route declaration
T2/T3: delegated (explore, mapping trigger >4 archivos). T5-T12: delegated writers (11+ archivos no triviales). T4: delegated/bounded (comandos). T13: inline.

## Key findings snapshot (evidencia recolectada)
Ver entregables; resumen en informe final al usuario.
