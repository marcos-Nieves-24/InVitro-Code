# Legal Auditoría F1-F3 + F6 — InVitro-Code (Colombia / LATAM)

## Objetivo
Auditar con evidencia y generar los 4 entregables de `legal/legal_requirement.md` fases 1-3 y 6, sin plantillas, sin inventar, con base jurídica Colombia (Ley 1581/1266/527/1480) para persona natural NIT 700329113-7 operando desde Medellín, servicio gratuito +18 dirigido a LATAM.

> Heurística: ~400 líneas por tarea, una por entregable. Commits por tarea con evidencia `archivo:línea`.

## Contexto y alcance autorizado
- **Autorizado por usuario (2026-10-05):** Ejecutar F1-F3+F6. Entidad: persona natural Colombia, NIT 700329113-7, domicilio Corregimiento Altavista Medellín, contacto invitro.code@gmail.com, países objetivo LATAM, proyecto 100% gratuito +18. Jurisdicción: Colombia (Ley 1581, Dec 1377/1074, Ley 527, Ley 1480).
- **Stack verificado:** Next 16 App Router + TS + Tailwind v4 + Clerk + Supabase + Vercel + Pyodide cdn.jsdelivr.net (ver `package.json`, `src/middleware.ts`, `supabase-migration.sql`, `public/pyodide-worker.js:5`).
- **No aplica hoy:** ecommerce/venta/suscripción/checkout/newsletter/CRM/chatbot IA — debe quedar documentado como NO con evidencia negativa (grep vacío).
- **TDD:** `strict_tdd: false` (`openspec/config.yaml`), pero verificación `type-check + build` aplica si se toca código de soporte.

## Tareas

- [ ] **T1 — F1 project-classification** — Clasificar B2B/B2C/mixto y checklist F1 (analytics, pixels, login, uploads, IA, sensibles, menores, etc.). Fuente: `README.md`, `supabase-migration.sql`, `src/middleware.ts`, `src/app/api/*`, `package.json`, `public/pyodide-worker.js`. Output `legal/project-classification.md`.
  - Criterio aceptación: tabla F1 completa con `Sí/No + evidencia archivo:línea`, país operación/objetivo y modelo negocio explícitos. Sin assumptions sin citar.
  - Checks: `Read` del md generado + grep de 2 claims.

- [ ] **T2 — F2 technical-audit** — Inventario código/infra/deps/config. Mapear frontend/backend/middleware/API/webhooks, hosting Vercel, CDN jsDelivr, DB Supabase, storage (si aplica), DNS, `package.json` deps, env vars, auth (`Clerk`), cookies. Output `legal/technical-audit.md`.
  - Criterio: cada bullet F2 con hallazgo + evidencia + riesgo. Providers no inventados.
  - Checks: `type-check` si se genera tooling.

- [ ] **T3 — F3 data-inventory** — Inventariar puntos de recogida (formularios, registro, login, analytics, APIs) + tabla `Punto|Datos|Finalidad|Base legal (Ley 1581 art.9)|Destino|Retención` + flujo por dato (dónde se almacena, proveedor, retención, eliminación). Output `legal/data-inventory.md`.
  - Criterio: cubre `profiles/progress/streaks/reflection_completions/lab_progress` + `gender` como semi-sensible, con retención/eliminación documentada o marcada como GAP.
  - Checks: validar contra `supabase-migration.sql` + rutas API.

- [ ] **T4 — F6 providers-audit** — Inventariar terceros `Clerk, Supabase, Vercel, jsDelivr, PyPI/micropip, Google Fonts (next/font), Rive, Plotly, Monaco`. Por proveedor: servicio, finalidad, datos enviados, país, transferencias art.26 Ley 1581, política URL. Output `legal/providers-audit.md`.
  - Criterio: sin proveedor omitido de `package.json`/`next.config.ts`/`public/pyodide-worker.js`/`src/app/layout.tsx`.
  - Checks: cross-check con F2.

## Entregables (F1-F3+F6)
- `legal/project-classification.md`
- `legal/technical-audit.md`
- `legal/data-inventory.md`
- `legal/providers-audit.md`

Fases F4,F5,F7-F11 quedan fuera de este slice (se abren en siguiente feature).

## Riesgos iniciales
- Transferencias internacionales sin contrato art.26 documentado → crítico.
- `gender` sensible sin autorización reforzada → alto.
- Sin CMP/granular consent → no conforme F4 (se documenta en slice siguiente).

## Progreso
- 2026-10-05 — Feature creado, pendiente ejecución T1-T4.
- 2026-10-06 — T1 F1 completado: `legal/project-classification.md` (115 líneas, 19 filas F1, evidencia archivo:línea + grep vacío, implicancias Ley 1581/527/1480).
- 2026-10-06 — T2 F2 completado: `legal/technical-audit.md` (313 líneas, 8 API routes, infra Vercel/jsDelivr/Supabase, 26+8 deps, 9 gaps G-01..G-09).
- 2026-10-06 — T3 F3 completado: `legal/data-inventory.md` (307 líneas, tabla 8 flujos reales + 8 No aplica, 9 fichas F-01..F-09, 7 GAPs INV-01..07).
- 2026-10-06 — T4 F6 completado: `legal/providers-audit.md` (391 líneas, 5 con transferencia art.26 + 6 sin, 11 fichas P-01..P-11, mapa transferencias + 7 GAPs PROV-01..07).
- Verificación: `wc -l legal/*.md` → 1570 líneas totales, todos legibles UTF-8.

## Evidencia commits
- Pendiente commit work-unit `docs(legal): F1-F3+F6 auditoría Colombia NIT 700329113-7` (incluye 4 md + feature doc). Branch `feat/legal-f1-f3-f6` a crear desde main.
