# Legal F11 Generación — ODD

## Objetivo
Generar los 6 entregables F11 de `legal/legal_requirement.md` (aviso-legal, politica-privacidad, politica-cookies, terminos-condiciones, politica-ia + final-report) sin plantillas, 100% evidencia `archivo:línea`, jurisdicción Colombia NIT 700329113-7, gratuito +18 LATAM, usando las 10 auditorías F1-F10 + fixes C/D/E + consent mergeado (d5c6f6c).

**Decisión ODD vs SDD:** ODD. SDD exige proposal/spec/design para ambigüedad sustancial. Acá tenemos 10 auditorías cerradas (3.5k líneas), fuentes `archivo:línea`, y marco legal fijo (Ley 1581/527/1480). No hay diseño arquitectónico abierto ni tradeoffs de implementación que justifiquen SDD overhead. ODD nos da trazabilidad con `odd/tasks` + work-unit commits ≤400 lí/PR, que es proporcional. SDD se reserva para features con espec incierta — no es el caso.

## Contexto y alcance autorizado
- Branch base: `main` @d5c6f6c (merge C/D/E + consent). Incluye: `consent_logs` + `user.deleted` + `DELETE /api/account` + `pending_since` + `dpa-register.md` + `validateAvatar` + `rate-limit` + `typed.js` gone + `LICENSE` exceptions + `retention-policy.md` DEFINIDA v1.
- Docs base: `legal/project-classification.md` 115, `technical-audit.md` 315, `data-inventory.md` 308 DEFINIDA, `cookies-audit.md` 222, `analytics-audit.md` 268, `providers-audit.md` 393, `accessibility-audit.md` 388, `ip-audit.md` 419, `ai-audit.md` 362, `security-audit.md` 297, `retention-policy.md` 67, `dpa-register.md` 43.
- Jurisdicción: Colombia, NIT 700329113-7, Corregimiento Altavista Medellín, invitro.code@gmail.com, LATAM, gratuito +18.
- Verificación: `npm run type-check` + `grep` por doc, Auditoría Final 8 checks `legal_requirement.md:399`.

## Tareas

- [ ] **F11-T1 — aviso-legal** — Generar `legal/aviso-legal.md` desde F1 (responsable real, actividad, contacto, jurisdicción). Debe citar `project-classification.md:9` y `supabase-migration.sql:4-7`, sin placeholders. Output `legal/aviso-legal.md`.
  - Criterio: responsable NIT/domicilio/contacto reales, hosting Vercel (`next.config.ts:4`), sin inventar.

- [ ] **F11-T2 — politica-cookies** — Generar `legal/politica-cookies.md` desde F4+F5 (solo cookies detectadas: `__clerk_*` técnicas + `localStorage` funcionales, 0 analíticas/publicitarias). Debe listar C-01/02 + S-01..03 con evidencia y explicar que no requiere CMP. Output `legal/politica-cookies.md`.
  - Criterio: solo cookies `cookies-audit.md` §1-2 + `data-inventory F-08`, con `grep vacío` para analíticas.

- [ ] **F11-T3 — terminos-condiciones** — Generar `legal/terminos-condiciones.md` (aplica aunque gratuito, art.43 Ley 1480). Desde F1/F2/F3: objeto, acceso, registro, uso, propiedad intelectual, limitación, canal. No incluir venta/suscripción. Output `legal/terminos-condiciones.md`.

- [ ] **F11-T4 — politica-ia** — Generar `legal/politica-ia.md` (aplica por IA offline, F9). Desde `ai-audit.md` 362 + `ip-audit.md` + `README` IA disclosure. Debe declarar Recraft/Anymotion/Spritecook + Pyodide no-IA + transparencia art.4 Ley 1581. Output `legal/politica-ia.md`.

- [ ] **F11-T5 — politica-privacidad** — Generar `legal/politica-privacidad.md` (crítica). Desde F3 DEFINIDA v1 + F6 5 transfer EE.UU. + `retention-policy.md` + `dpa-register.md` + consent `consent_logs` (`supabase-migration.sql:408`). Debe tener: responsable, finalidades F-01..F-07, bases art.9/6/26, derechos art.8 con canal invitro.code@gmail.com 10/15d, retención DEFINIDA v1, encargados y transferencias con país EE.UU., DPA links. Output `legal/politica-privacidad.md`.

- [ ] **F11-T6 — final-report + NO_APLICA** — Generar `legal/legal-final-report.md` con resumen ejecutivo, riesgos crítico/medio/bajo, recomendaciones, evidencias, estado cumplimiento (Auditoría Final 8 checks). Y documentar `politica-comercial.md` como **NO APLICA** (gratuito, `grep vacío stripe/checkout` + `project-classification.md:19`). Output `legal/legal-final-report.md` + nota NO_APLICA.

## Entregables F11
- `legal/aviso-legal.md`
- `legal/politica-privacidad.md`
- `legal/politica-cookies.md`
- `legal/terminos-condiciones.md`
- `legal/politica-ia.md`
- `legal/legal-final-report.md`
- `politica-comercial.md` → NO_APLICA documentado

## Progreso
- 2026-10-06 — Feature creado ODD, branch `feat/legal-F11-generacion` desde `main@d5c6f6c`, pendiente T1-T6.
- 2026-10-06 — Decisión ODD (no SDD): 10 auditorías cerradas + marco fijo, sin diseño abierto.
- 2026-10-06 — Paso 0 done d5c6f6c: merge `feat/legal-seguridad-c-clean` (C/D/E + retention) into `main` consent (resolvió conflicto `data-inventory §4` DEFINIDA v1 + pending_since 24h).
- 2026-10-06 — F11-T1 done: `legal/aviso-legal.md` (NIT 700329113-7, hosting Vercel, propiedad MIT+gsap Standard).
- 2026-10-06 — F11-T2 done: `legal/politica-cookies.md` (solo __clerk_* + localStorage, 0 tracking con grep vacío).
- 2026-10-06 — F11-T3 done: `legal/terminos-condiciones.md` (gratuito, sin venta, disclaimer certify, supresión 15d).
- 2026-10-06 — F11-T4 done: `legal/politica-ia.md` (0 LLM runtime, Pyodide determinista, Recraft/Anymotion/Spritecook).
- 2026-10-06 — F11-T5 done: `legal/politica-privacidad.md` (F-01..F-08, art.9/6/26, derechos 10/15d, retención DEFINIDA v1, 5 transfer EE.UU. + DPA).
- 2026-10-06 — F11-T6 done: `legal/legal-final-report.md` (8 checks Auditoría Final OK, 5 críticos resueltos, 6 medios observaciones, NO_APLICA comercial). Verificación: `type-check` OK, `vitest` 92 OK, `legal/*.md` 3548 lí (18 files).
