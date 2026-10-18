# Compliance — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · `invitro.code@gmail.com`

## Índice de entregables (10 documentos)

| # | Documento | Descripción | Fuente primaria |
|---|---|---|---|
| 1 | [`AUDITORIA_TECNICA.md`](./AUDITORIA_TECNICA.md) | Arquitectura, hallazgos verificados, brechas | Inspección directa `src/**` + `supabase-migration.sql` + `package.json` |
| 2 | [`INVENTARIO_TRATAMIENTO_DATOS.md`](./INVENTARIO_TRATAMIENTO_DATOS.md) | Categorías F-01..F-09, bases, retención DEFINIDA v1 | `supabase-migration.sql` + `domain/consent.ts` + `legal/data-inventory.md` |
| 3 | [`FLUJO_DATOS_Y_PROVEEDORES.md`](./FLUJO_DATOS_Y_PROVEEDORES.md) | Diagrama, flujos por fase, fichas P-01..P-11 | `public/pyodide-worker.js` + `src/lib/pyodide-worker.ts` + `legal/providers-audit.md` |
| 4 | [`POLITICA_PRIVACIDAD.md`](./POLITICA_PRIVACIDAD.md) | Borrador publicable (Ley 1581 + Ley 527 + art. 26) | `legal/politica-privacidad.md` v1 + `retention-policy.md` |
| 5 | [`POLITICA_GOBERNANZA_IA.md`](./POLITICA_GOBERNANZA_IA.md) | Reglas IA (Pyodide no es IA, assets offline, E2B stub) | `legal/ai-audit.md` + inspección `package.json` + `pyodide-worker.js` |
| 6 | [`MATRIZ_CUMPLIMIENTO_INTERNACIONAL.md`](./MATRIZ_CUMPLIMIENTO_INTERNACIONAL.md) | Colombia (ancla) + UE/GDPR + EE. UU./CCPA + UK + Brasil/LGPD | Fuentes oficiales oct 2026 (EUR-Lex, LegInfo CA, Planalto) |
| 7 | [`PLAN_QA.md`](./PLAN_QA.md) | Estrategia, matriz QA-F/P/S/AI/R, gates, pruebas ejecutadas | `vitest.config.mts` + OWASP Top 10 |
| 8 | [`REGISTRO_RIESGOS.md`](./REGISTRO_RIESGOS.md) | 8 riesgos abiertos (4 medios/4 bajos) + 4 IA latentes + 7 históricos resueltos | `legal/security-audit.md` C-01..C-12 |
| 9 | [`PLAN_REMEDIACION.md`](./PLAN_REMEDIACION.md) | 5 fases, acciones, cronograma, verificación | `REGISTRO_RIESGOS.md` R-01..R-08 |
| 10 | [`PREGUNTAS_PENDIENTES.md`](./PREGUNTAS_PENDIENTES.md) | 16 preguntas para titular/abogado (J/T/P/I) | Todos los anteriores |
| 11 | [`RNBD_DOSSIER.md`](./RNBD_DOSSIER.md) | **Dossier RNBD listo para copiar al portal SIC** (8 bases con todos los campos) | `retention-policy.md` + `data-inventory.md` + `dpa-register.md` |

## Documentación previa (`legal/`)

Los 10 entregables de `docs/compliance/` consolidan y actualizan las 18 auditorías previas en `legal/` (F1-F10 + F11, 2026-10-06). `legal/` permanece como archivo histórico; `docs/compliance/` es la **versión vigente** para operación y publicación.

```
legal/                          ← 18 auditorías F1-F10 + F11 (2026-10-06, archivo)
docs/compliance/                ← 10 entregables vigentes (2026-10-16-v1, operación)
src/app/(legal)/*/page.tsx      ← 5 páginas publicadas (/privacidad, /cookies, /terminos, /aviso, /ia)
```

## Cambios técnicos implementados (2026-10-16)

| Cambio | Archivo | Riesgo cerrado |
|---|---|---|
| Headers CSP/HSTS/X-Frame/X-Content-Type/Referrer/Permissions | `next.config.ts:15-55` | R-01 (Medio) |
| `GET /api/diagnose` → protegida (fuera de `publicRoutes`) | `src/middleware.ts:11` | R-05/R-06 (Bajo) |
| Cron `purge-snapshots` 60 d (`0 2 * * *`) + handler | `vercel.json:20` + `src/app/api/cron/purge-snapshots/route.ts` | R-03 (Medio, parcial) |

Verificación: `npm run type-check` ✅ · `npm run test` 223/223 ✅ · `npm run build` ✅

## Infra RNBD/DPAs (2026-10-16)

- **Dossier:** `RNBD_DOSSIER.md` — 8 bases listas para `https://rnbd.sic.gov.co/sisi/login` (§2.1..§2.8 con Finalidad/Datos/Medidas/Encargados/Transferencia/Retención)
- **DPAs:** `legal/dpa-register.md` v1 2026-10-16 + `legal/receipts/README.md` + `scripts/verify-receipts.mjs` (`npm run receipts:verify`)
- **Flujo:** aceptar 3 DPAs → `sha256sum legal/receipts/*.pdf` → inscribir 8 bases → guardar `rnbd-radicado-*.pdf` → anotar radicado

## Cómo mantener

Un nuevo proveedor, nueva cookie, nueva columna `supabase-migration.sql`, nuevo `purpose` en `domain/consent.ts` o `FEATURE_FLAG_CERTIFY=true` **obliga a re-auditar y versionar** a `2026-10-16-v2` los documentos afectados y `CURRENT_POLICY_VERSION` (`src/domain/consent.ts:21`).

## Referencias rápidas

- **RNBD:** `https://rnbd.sic.gov.co/sisi/login` — inscribir 7 bases (`retention-policy.md §2`)
- **DPAs:** `legal/dpa-register.md §3` — Clerk `https://clerk.com/legal/dpa` · Supabase `https://supabase.com/legal/dpa` · Vercel `https://vercel.com/legal/dpa`
- **Contacto derechos:** `invitro.code@gmail.com` — 10 d consultas / 15 d reclamos (art. 14-15)
