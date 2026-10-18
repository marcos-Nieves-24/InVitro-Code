# Plan de Remediación — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · `invitro.code@gmail.com`
> **Fuentes:** `REGISTRO_RIESGOS.md` (R-01..R-08 + R-AI-01..04) · `AUDITORIA_TECNICA.md §6` · `PLAN_QA.md` · `legal/security-audit.md` · `legal/retention-policy.md`
> **Principio:** Correcciones técnicas inmediatas separadas de decisiones organizacionales/jurídicas que requieren aprobación humana.

---

## 1. Priorización

| Fase | Riesgos | Severidad | Esfuerzo | Cuándo | Aprobación |
|---|---|---|---|---|---|
| **Fase 0 — Ya resueltos** | G-01..G-04, monitoring hardcode, rate-limit in-memory | Crítica/Alta | — | `main@d5c6f6c` + `02fb756` + `247e76a` | Hecho |
| **Fase 1 — Higiene inmediata** | R-01 (headers), R-05 (diagnose), R-06 (DELETE docs), R-08 (a11y) | Media/Baja | 1-2 días | Sprint actual | Ingeniería (sin jurídico) |
| **Fase 2 — Privacidad** | R-02 (signedUrl) | Media | 1 día | Siguiente sprint | Ingeniería |
| **Fase 3 — Retención** | R-03 (cron purga 60 d + 24 m) | Media | 1-2 días | Siguiente sprint | Ingeniería + Titular (texto de aviso) |
| **Fase 4 — Escalamiento** | R-07 (Redis rate-limit) | Baja hoy | 1 día | Cuando `MAU > 10k` o abuso detectado | Ingeniería |
| **Fase 5 — Organizacional** | RNBD + DPAs + monitoreo jurisdicciones | Media (legal) | 2-3 días | Paralelo a Fases 1-3 | **Titular + abogado** |

---

## 2. Acciones por fase

### Fase 1 — Higiene inmediata (sin aprobación jurídica, bajo riesgo)

#### R-01 — Headers de seguridad

| Campo | Detalle |
|---|---|
| **Acción** | Añadir `async headers()` en `next.config.ts:1-20` |
| **Cambios** | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` · `X-Frame-Options: DENY` · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` · CSP mínima: `default-src 'self'; img-src 'self' data: https://img.clerk.com https://vercel.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; connect-src 'self' https://*.supabase.co https://*.clerk.com https://cdn.jsdelivr.net https://files.pythonhosted.org` |
| **Archivos** | `next.config.ts` (único) |
| **Prueba** | `npm run build` OK + `curl -I https://<prod> \| grep -i "strict-transport\|content-security"` con 2+ headers |
| **QA** | QA-S-09 |
| **Esfuerzo** | 0.5 día |
| **Criterio de cierre** | Headers presentes en prod + `npm run build` verde |

#### R-05 — `diagnose` fuera de `publicRoutes`

| Campo | Detalle |
|---|---|
| **Acción** | Remover `"/api/diagnose"` de `publicRoutes` en `src/middleware.ts:11` |
| **Archivos** | `src/middleware.ts:11` (1 línea) |
| **Prueba** | `curl https://<prod>/api/diagnose?module=python&slug=lesson01` sin cookie → 401 en middleware (no llega al handler) |
| **QA** | QA-F-08 |
| **Esfuerzo** | 0.25 día |

#### R-06 — Documentar `DELETE` RLS

| Campo | Detalle |
|---|---|
| **Acción** | Añadir `COMMENT ON TABLE` o header comment en `supabase-migration.sql:430-460` explicando que `FOR DELETE` existe en 7 tablas y que tablas sin DELETE usan `deny by default` + supresión vía `DELETE /api/account` |
| **Archivos** | `supabase-migration.sql` (solo comentarios) |
| **Esfuerzo** | 0.25 día |

#### R-08 — Accesibilidad WCAG AA

| Campo | Detalle |
|---|---|
| **Acción** | Fix `text-storm` vs `bg-surface` contraste (subir a 4.5:1), `aria-label` en `reflection-check.tsx:67`, heading `h1→h2` en `page.tsx:32` |
| **Archivos** | `src/components/lesson/reflection-check.tsx`, `src/app/learn/[module]/[slug]/page.tsx`, `src/app/globals.css` (tokens) |
| **Prueba** | `npm run test` + Lighthouse `accessibility` ≥95 + `legal/accessibility-audit.md` re-ejecutado |
| **QA** | QA funcional + a11y |
| **Esfuerzo** | 1 día |

### Fase 2 — Privacidad (siguiente sprint)

#### R-02 — Bucket `avatars` privado + `createSignedUrl`

| Campo | Detalle |
|---|---|
| **Acción** | (1) Cambiar bucket `avatars` a privado en Supabase Dashboard; (2) Reemplazar `getPublicUrl` por `createSignedUrl(filePath, 3600)` en `profile/avatar/route.ts:47` y `perfil/page.tsx:53`; (3) Añadir policy `storage` RLS `USING (auth.jwt()->>sub = owner)` o `USING (true)` para lectura con `signedUrl`; (4) Renombrar `fileName` a `crypto.randomUUID().jpg` sin `userId`. |
| **Archivos** | `src/app/api/profile/avatar/route.ts`, `src/app/(dashboard)/perfil/page.tsx`, `supabase-migration.sql` (storage RLS) |
| **Prueba** | Subir avatar → URL firmada expira en 3600 s → sin `userId` en path → `npm run test` + `validateAvatar` |
| **QA** | QA-P-01 + QA-S-03/04 |
| **Esfuerzo** | 1 día |
| **Dependencia** | Supabase Storage config (titular) |

### Fase 3 — Retención (siguiente sprint)

#### R-03 — Cron purga `codeSnapshot` 60 d + inactividad 24 m

| Campo | Detalle |
|---|---|
| **Acción** | (1) `vercel.json:1-24` añadir `{"path":"/api/cron/purge-snapshots","schedule":"0 2 * * *"}`; (2) Crear `src/app/api/cron/purge-snapshots/route.ts` con `isAuthorized` (CRON_SECRET/x-vercel-cron) + `UPDATE lab_progress SET last_position='{}' WHERE updated_at < NOW()-60d OR completion_status='completed'`; (3) Job mensual `purge-inactive` para `last_active_at < NOW()-24m` con aviso si `notification_prefs->>'email'='true'` + anonimización 15 d después. |
| **Archivos** | `vercel.json`, `src/app/api/cron/purge-snapshots/route.ts` (nuevo), `src/app/api/cron/purge-inactive/route.ts` (nuevo) |
| **Prueba** | Insertar `lab_progress` con `updated_at = NOW()-61d` → cron → `last_position='{}'` · `npm run test` |
| **QA** | QA-R-04 |
| **Esfuerzo** | 1-2 días |
| **Dependencia** | `CRON_SECRET` en Vercel env + texto de aviso aprobado por titular |

### Fase 4 — Escalamiento (cuando aplique)

#### R-07 — Redis rate-limit

| Campo | Detalle |
|---|---|
| **Acción** | Migrar `src/lib/rate-limit.ts` de `Map` in-memory a `@upstash/ratelimit` con Redis (o Vercel Firewall). Mantener misma interfaz `checkRateLimit(key, limit, windowMs)`. |
| **Disparador** | `MAU > 10k` o detección de abuso (farming XP, flood avatar) |
| **Esfuerzo** | 1 día |

### Fase 5 — Organizacional (requiere aprobación humana)

| # | Acción | Responsable | Plazo | Evidencia de cierre |
|---|---|---|---|---|
| 5.1 | **Firmar DPAs** Clerk/Supabase/Vercel y conservar `legal/receipts/*.pdf` con `sha256sum` en `legal/dpa-register.md` | Titular | 1-2 días | `sha256sum legal/receipts/*.pdf` en tabla `dpa-register.md §3` |
| 5.2 | **Inscribir 7 bases en RNBD** (`https://rnbd.sic.gov.co/sisi/login`) con `retention-policy.md §2` checklist | Titular + abogado | 1 día | Certificado RNBD + `retention-policy.md` con N° de radicado |
| 5.3 | **Monitorear jurisdicciones** UE/UK/Brasil/California — si entra tráfico, activar anexos GDPR/LGPD/CCPA (`MATRIZ_CUMPLIMIENTO_INTERNACIONAL.md §2`) | Titular | Continuo | Log de países de usuarios + `MATRIZ` versionada si aplica |
| 5.4 | **Definir canal y SLA de reclamos** art. 14-15 (10/15 d) + log interno | Titular | 0.5 día | Procedimiento en `POLITICA_PRIVACIDAD.md §4` + bandeja `invitro.code@gmail.com` con SLA |

---

## 3. Cronograma sugerido

```
Semana 1:  Fase 1 (R-01, R-05, R-06, R-08) + Fase 5.1/5.2 (DPAs/RNBD) en paralelo
Semana 2:  Fase 2 (R-02 signedUrl) + Fase 3 (R-03 crons) + Fase 5.3 (monitoreo)
Futuro:    Fase 4 (R-07 Redis) cuando escale
```

## 4. Verificación post-remediación

| Gate | Comando | Criterio |
|---|---|---|
| Types | `npm run type-check` | 0 errores |
| Tests | `npm run test` | 223/223 (hoy) + nuevos tests `purge-snapshots`, `signedUrl` |
| Build | `npm run build` | OK (Turbopack) |
| Assets | `npm run assets:check` | 0 diffs |
| Headers | `curl -I https://<prod>` | 3+ headers presentes |
| Supresión | `DELETE /api/account` en staging con test user | 200 + 0 filas en 7 tablas + Clerk `user.deleted` |
| Logs | Vercel/Supabase dashboards | Cron `purge-pending` 0 3 * * * + `purge-snapshots` 0 2 * * * en verde |

---

*Plan 2026-10-16-v1 — cada acción cita `archivo:línea` y QA. Un nuevo riesgo en `REGISTRO_RIESGOS.md` obliga a versionar este plan.*
