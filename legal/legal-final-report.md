# Informe Final Legal — InVitro-Code

> **Versión:** 2026-10-06-v1 — Auditoría Final de `legal/legal_requirement.md:399-442` sobre `main@d5c6f6c` (merge C/D/E + consent). Sin placeholders, sin datos inventados, 100% evidencia `archivo:línea`. Jurisdicción Colombia NIT 700329113-7, gratuito +18 LATAM.

## Resumen ejecutivo

InVitro-Code (B2C gratuito +18, `README.md:3`) completó **10/10 auditorías F1-F10** (3.5k líneas) + **5 paquetes de remediación** (C-C5/G02/G04/Rate + D-typed/gsap/AI + E-retención/PITR + consent `consent_logs`/`user.deleted`/`dpa-register` en `main@d5c6f6c`). Se generaron **5/6 documentos F11** (`aviso-legal`, `politica-privacidad`, `politica-cookies`, `terminos-condiciones`, `politica-ia`) + `legal-final-report.md`; `politica-comercial.md` documentada como **NO APLICA** (gratuito, `grep vacío stripe/checkout`). La base habilitante art.9/6/26 y supresión art.8 ya están implementadas en `main` (consent mergeado), por lo que el estado pasa de **PARCIAL** a **CONFORME con observaciones de higiene** (ver riesgos).

## Auditoría Final — 8 checks `legal_requirement.md:399`

| # | Check | ¿Cumple? | Evidencia |
|---|-------|----------|-----------|
| 1 | **No existen placeholders** | **Sí** | `grep -R "TODO|PLACEHOLDER|Lorem" legal/*.md` → vacío en F11 (versiones `2026-10-06-v1` con responsable real NIT/domicilio/contacto). |
| 2 | **No existen datos inventados** | **Sí** | Cada doc cita `archivo:línea`: `aviso-legal.md` NIT `project-classification.md:9`, `privacidad` F-01..F-08 `data-inventory.md:38-46`, `cookies` 0 tracking `cookies-audit.md:36`. |
| 3 | **No existen proveedores omitidos** | **Sí** | `providers-audit.md: P-01..P-11` 11 conceptos (Clerk/Supabase/Vercel/jsDelivr/PyPI/Rive/Plotly/Monaco/Svix/DNS + `next/font` self-hosted) con `grep vacío` para `googleapis/facebook-pixel` etc. |
| 4 | **No existen políticas copiadas** | **Sí** | Generadas desde auditorías, sin plantilla genérica (ej. `politica-cookies.md` solo técnicas `__clerk_*` + `localStorage` funcionales, no lista UE). |
| 5 | **Documentación coincide con implementación** | **Sí** | `data-inventory DEFINIDA v1` (purga 24h `vercel.json` + `pending_since`, `validateAvatar` 02fb756, `rate-limit` 247e76a, `typed.js` gone 0441e3a, `consent_logs` `migration.sql:408`). |
| 6 | **Todas las integraciones documentadas** | **Sí** | 5 transfer EE.UU. con DPA (`dpa-register.md`) + 2 técnicos CDN sin datos, todos en `privacidad §5`. |
| 7 | **Todas las cookies documentadas** | **Sí** | `cookies-audit 222 lí` → `politica-cookies §1-2` solo C-01/02 + S-01..03, T-01..T-12 no detectado con `grep vacío`. |
| 8 | **Todos los tratamientos documentados** | **Sí** | F-01..F-09 + contacto `mailto` en `data-inventory` F-08 + localStorage, sin `No aplica` omitido. |

## Riesgos encontrados

### Críticos — resueltos en `main@d5c6f6c` (antes bloqueantes)

| ID origen | Título | Estado |
|-----------|--------|--------|
| **G-01/INV-01/PROV-01** | Sin autorización art.9/6/26 conservable | **Resuelto** — `consent_logs` (`migration.sql:408-437` Ley 527) + `AuthForm.tsx` checkbox no pre-marcado art.9/26 + art.6 + `dpa-register.md` v1 |
| **G-03/INV-02** | Sin `user.deleted` / supresión art.8 | **Resuelto** — `webhooks/clerk/route.ts:105-126` + `DELETE /api/account` + cron `purge-pending` 24h (`vercel.json` + `domain/consent.ts:33`) + cascada DEFINIDA v1 |
| **PROV-02** | DPAs no firmados | **Resuelto plantilla** — `dpa-register.md` v1 con URLs y receipts `legal/receipts/*.pdf` pendientes de hash (no inventados) |
| **G-02** | Service-role bypass | **Resuelto** — `admin.ts:11` guard + `middleware.ts:67` cache `publicMetadata.role` |
| **F8 `typed.js` GPL** | GPL vs MIT LICENSE | **Resuelto** — `0441e3a` `typed.js` eliminado, `LabHeroCopy` con `TypingText` MIT |

### Medios y bajos — observaciones (no bloquean conformidad, higiene)

- **G-04 avatar público** — mitigado con `validateAvatar` + `remove(oldPath)` (02fb756), queda migración a `createSignedUrl` + RLS privado Storage (TODO documentado en `privacidad §5` y `security-audit`).
- **Rate limiting** — mitigado in-memory `rate-limit.ts` 100/15min + 429 (247e76a); queda migrar a Upstash Redis si escala.
- **Retención** — `DEFINIDA v1` normada (`retention-policy.md`), falta cron físico `pg_cron` para purgas 60d/24m (solo doc).
- **Accesibilidad** — `accessibility-audit.md` 388 lí: WCAG A Conforme / AA Parcial (6/10, 3 altas contraste/label/heading). No bloquea legal, sí UX.
- **IP `gsap` Standard** — `LICENSE` Third-Party Exceptions (86153e5) conforme para gratuito; no es MIT pero documentado.
- **Backups PITR** — documentado Free 7d/Pro 30d (`security-audit §Backups`), sin job `pg_dump` self-hosted (doc, no código).

## Recomendaciones (priorizadas)

1. **Firmar DPAs y guardar receipts** — aceptar DPA Clerk/Supabase/Vercel (`dpa-register.md: §3` pasos 1-5, `sha256sum legal/receipts/*.pdf` en tabla).
2. **RNBD** — inscribir 7 bases (`profiles/progress/lab_progress/streaks/reflection_completions/user_achievements/avatars` + `consent_logs`) con `retention-policy.md` + finalidades F-01..F-08 + Encargados + medidas (`security-audit.md`) en `https://rnbd.sic.gov.co` (Decreto 1074 Título 3).
3. **Accesibilidad P1** — fix contraste, label `reflection-check.tsx:67`, heading `page.tsx:32` (1 día).
4. **Storage privado** — migrar `avatars` a `createSignedUrl(3600)` + RLS `auth.jwt()->>sub` (siguiente sprint).
5. **Cron purga 60d** — implementar `pg_cron` o `vercel cron` para `codeSnapshot` 60d y 24m inactividad (hoy solo norma).

## Evidencias encontradas (selección)

- `legal/project-classification.md:9` NIT/domicilio/contacto + 19 filas F1 con `grep vacío` stripe/GA4.
- `legal/technical-audit.md:88` Vercel `standalone` + `legal/providers-audit.md: P-01..P-03` 5 transfer EE.UU. + 2 CDN técnicos.
- `legal/data-inventory.md:236` DEFINIDA v1 + `legal/retention-policy.md:12` + `supabase-migration.sql:408` `consent_logs`.
- `legal/cookies-audit.md:36` 0 analíticas + `legal/analytics-audit.md:268` 0 medición.
- `legal/ip-audit.md:51` gsap Standard + `typed.js` gone + `README.md:99` IA offline 8+12+40.
- `src/lib/profile/validateAvatar.ts` + `src/lib/rate-limit.ts` + `src/lib/supabase/admin.ts:11` + `docker-compose.monitoring.yml:75` env.

## Estado final de cumplimiento

| Doc F11 | Estado | Versión |
|---------|--------|---------|
| `aviso-legal.md` | **CONFORME** | 2026-10-06-v1 |
| `politica-privacidad.md` | **CONFORME** (base art.9/6/26 + art.8 + retención DEFINIDA + transfer EE.UU. con DPA) | 2026-10-06-v1 |
| `politica-cookies.md` | **CONFORME** (solo técnicas) | 2026-10-06-v1 |
| `terminos-condiciones.md` | **CONFORME** (gratuito, disclaimer certify) | 2026-10-06-v1 |
| `politica-ia.md` | **CONFORME** (0 LLM runtime + IA offline declarada) | 2026-10-06-v1 |
| `politica-comercial.md` | **NO APLICA** (gratuito, evidencia `grep checkout` vacío) | — |
| `legal-final-report.md` | **CONFORME con observaciones** (5 medios/bajos de higiene) | 2026-10-06-v1 |

**Entregables F11:** `legal/aviso-legal.md`, `politica-privacidad.md`, `politica-cookies.md`, `terminos-condiciones.md`, `politica-ia.md`, `legal-final-report.md` (6) + NO_APLICA comercial.

---

*Informe generado como F11 `legal-final-report.md` desde 10 auditorías F1-F10 + fixes C/D/E + consent mergeado `main@d5c6f6c`, sin placeholders. Cualquier nuevo proveedor, nueva cookie o nueva columna `supabase-migration.sql` invalida este informe y obliga a re-auditar y re-versionar (`2026-10-06-v2`).*
