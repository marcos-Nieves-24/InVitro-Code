# Registro de Riesgos — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16 · **Metodología:** Probabilidad × Impacto → Severidad (Crítica/Alta/Media/Baja). Cada hallazgo cita `archivo:línea` o `grep vacío`.
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · `invitro.code@gmail.com`
> **Fuentes:** `legal/security-audit.md` (C-01..C-12) · `legal/data-inventory.md` · `legal/ai-audit.md` · `legal/providers-audit.md` · `AUDITORIA_TECNICA.md §6` · `PLAN_QA.md`
> **Estado histórico:** 5 críticas históricas ya resueltas en `main` (ver §5).

---

## Resumen por severidad

| Severidad | Abiertos | Resueltos (históricos) |
|---|---|---|
| **Crítica** | 0 | 3 (G-01 autorización, G-03 user.deleted, monitoring hardcode) |
| **Alta** | 0 | 2 (G-02 service-role, G-04 avatar) |
| **Media** | 4 | — |
| **Baja** | 4 | — |

---

## 1. Riesgos abiertos (2026-10-16)

| ID | Descripción y evidencia | Componente | Categoría | Prob. | Impacto | Severidad | Consecuencia si se materializa | Solución propuesta | Dependencias / Esfuerzo | Responsable | Criterio de cierre |
|---|---|---|---|---|---|---|---|---|---|
| **R-01** | **Sin headers de seguridad CSP/HSTS/X-Frame/X-Content-Type-Options** — `grep vacío "headers\|Content-Security-Policy\|Strict-Transport\|X-Frame" next.config.ts src/middleware.ts` · `next.config.ts:1-20` solo `output` + `images.remotePatterns` + `turbopack.root`. Vercel inyecta algunos por defecto pero no están evidenciados en repo. | `next.config.ts` · `src/middleware.ts` | Seguridad | Media | Medio | **Media** | Clickjacking, MIME sniffing, downgrade TLS si no se delega a Vercel; OWASP A05 · CWE-319/1021 | Añadir `async headers()` en `next.config.ts` con `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima + CSP allowlist `img.clerk.com`, `cdn.jsdelivr.net`, `*.supabase.co` | Sin deps · 0.5 día · test `curl -I` | Ingeniería | `curl -I https://<prod> \| grep -i "strict-transport\|content-security\|x-frame"` con 3 headers presentes + `npm run build` OK |
| **R-02** | **Bucket `avatars` público con `getPublicUrl`** — `src/app/api/profile/avatar/route.ts:47` `getPublicUrl(filePath)` implica bucket público URL predecible `${userId}-${Date.now()}.${ext}`; sin `authenticated` read ni `signedUrl`. Aunque RLS protege escritura, lectura es pública si se conoce la URL. | `src/app/api/profile/avatar/route.ts:47` · `src/app/(dashboard)/perfil/page.tsx:53` · `supabase-migration.sql` (sin `storage` RLS para `avatars`) | Privacidad / Seguridad | Baja | Medio | **Media** | Enumeración de avatares si se filtra `userId`; no hay fuga masiva pero viola minimización | Migrar a `createSignedUrl(3600)` o bucket privado con policy `auth.jwt()->>sub = owner` + renombrar a `crypto.randomUUID()` sin `userId` · documentar en `supabase-migration.sql` | Supabase Storage config · 1 día | Ingeniería | `getPublicUrl` reemplazado por `createSignedUrl` + policy `storage` RLS + test `validateAvatar` + `npm run test` verde |
| **R-03** | **Cron purga `codeSnapshot` 60 d / inactividad 24 m sin job físico** — `legal/retention-policy.md §3 P1/P2` solo norma documental; sin `pg_cron` ni `vercel.json` entry para `purge-snapshot`/`purge-inactive`. `supabase-migration.sql` sin `RETENTION` ni TTL físico. | `legal/retention-policy.md §3` · `supabase-migration.sql:315,337` · `vercel.json:1-24` (solo 3 crons: `purge-pending`, `recharge-freezes`, `daily-nudge`) | Privacidad / Legal (retención minimización) | Media | Medio | **Media** | `codeSnapshot` retenido más allá de 60 d (sobre-recolección INV-05); `last_active_at` 24 m sin anonimización (RET-02) | Implementar `vercel.json` cron `0 2 * * * /api/cron/purge-snapshots` + `pg_cron` `UPDATE lab_progress SET last_position='{}' WHERE updated_at < NOW()-60d` + job mensual inactividad con aviso `notification_prefs.email` | Vercel Cron o `pg_cron` · 1-2 días | Ingeniería + Titular (aviso) | Cron en `vercel.json` + handler `/api/cron/purge-snapshots` + test con `updated_at` mock + `retention-policy.md` §4 actualizado |
| **R-04** | **`supabase_realtime` publication con 7 tablas sin suscripción activa** — `supabase-migration.sql:9-14` crea `supabase_realtime` + `supabase-migration.sql:142-171,353-360` añade 7 tablas (`profiles`, `progress`, `streaks`, `reflection_completions`, `achievements`, `user_achievements`, `lab_progress`); `grep vacío "supabase.channel\|realtime.*subscribe" src/` (confirmado en `providers-audit.md`). | `supabase-migration.sql:9-14` · `supabase-migration.sql:353-360` | Seguridad | Baja | Medio | **Media** | Superficie latente: si un cliente obtiene JWT y se activa `channel.subscribe`, `postgres_changes` expone `profiles`/`progress` sin nueva migración | Mantener en publication solo `achievements` (catálogo público) o deshabilitar hasta tener RLS fino + test; documentar decisión con `COMMENT` en `migration.sql` | Supabase migration · 0.5 día | Ingeniería | Publication con ≤2 tablas o `AUDIT: publication mínima` comment + `grep` de `supabase.channel` sigue vacío |
| **R-05** | **`GET /api/diagnose` pública en middleware pero con `auth()` en handler** — `src/middleware.ts:11` incluye `"/api/diagnose"` en `publicRoutes` (anon pasa middleware) pero `src/app/api/diagnose/route.ts:8` exige `auth()` → 401. No hay bypass, pero hay confusión y `diagnose` expone `fileExists`/`frontmatterKeys`/`mdxModulesResolve` a quien adivine el path (fingerprinting). | `src/middleware.ts:11` vs `src/app/api/diagnose/route.ts:7-10` | Seguridad | Baja | Bajo | **Baja** | Fingerprinting de `src/content/modules/**` (no PII, pero enumeración de lecciones) | Sacar `"/api/diagnose"` de `publicRoutes` (forzar 401 en middleware) o limitar a `role=admin` con `is_admin(auth.jwt()->>sub)` | Sin deps · 0.25 día | Ingeniería | `diagnose` fuera de `publicRoutes` o con guard `admin` + `curl` anon → 401 en middleware + `npm run test` |
| **R-06** | **Sin políticas `DELETE` explícitas (aunque deny by default)** — `supabase-migration.sql:52-460` sin `FOR DELETE` en varias tablas salvo `profiles`/`lab_progress`/etc. (hoy sí hay `FOR DELETE USING (auth.jwt()->>sub = ...)` en 7 tablas `migration.sql:430-460`, pero auditoría previa lo marcó como faltante — verificar idempotencia). | `supabase-migration.sql:430-460` | Seguridad / Legal (art. 8) | Baja | Bajo | **Baja** | Auditor externo interpreta como olvido; no hay bypass real (deny by default) pero falta trazabilidad para supresión | Añadir `COMMENT` o doc en `migration.sql` "Sin borrado directo; supresión vía `DELETE /api/account` auditada" o `CREATE POLICY ... FOR DELETE USING (false)` donde no haya DELETE | Migration · 0.25 día | Ingeniería | Políticas `DELETE` documentadas o `USING false` + `data-inventory.md §6` coherente |
| **R-07** | **Rate limiting in-memory (resetea al redeploy)** — `src/lib/rate-limit.ts:1-35` `Map<string,Entry>` en memoria; no persiste entre instancias Vercel (serverless, múltiples lambdas). Bajo volumen hoy, pero con escala el límite no se comparte. | `src/lib/rate-limit.ts:1-35` · `src/app/api/progress/route.ts:40` · `lab-progress/route.ts:60` | Seguridad / Rendimiento | Media | Medio | **Baja** (hoy) → **Media** si escala | Bypass de rate limit por instancia; farming XP / flood avatar si atacante distribuye requests | Migrar a Upstash Redis (`@upstash/ratelimit`) o Vercel Firewall cuando `MAU > 10k` | Upstash/Vercel · 1 día (cuando escale) | Ingeniería | `rate-limit.ts` con `Redis` backend o `vercel.json` firewall + test 429 distribuido |
| **R-08** | **Accesibilidad WCAG AA parcial** — `legal/accessibility-audit.md:388` 6/10 AA; 3 altas (contraste, `aria-label` en `reflection-check.tsx:67`, heading `page.tsx:32`). No bloquea legal, sí UX y potencial demanda de accesibilidad. | `src/components/lesson/reflection-check.tsx:67` · `src/app/learn/[module]/[slug]/page.tsx:32` · `legal/accessibility-audit.md` | Funcionalidad / Legal | Media | Bajo | **Baja** | Exclusión de usuarios con discapacidad; riesgo reputacional | Fix contraste `text-storm` vs `bg-surface`, `aria-label` en `reflection-check`, heading `h1→h2` | Sin deps · 1 día | Ingeniería | `accessibility-audit.md` re-ejecutado 8/10 + Lighthouse `accessibility` ≥95 |

---

## 2. Matriz de criticidad (Probabilidad × Impacto)

| Prob. \ Impacto | Bajo | Medio | Alto |
|---|---|---|---|
| **Alta** | — | — | — (0) |
| **Media** | R-08 | R-01, R-03, R-04 | — |
| **Baja** | R-05, R-06 | R-02, R-07 | — |

## 3. Riesgos de IA (no hay LLM en runtime — riesgos latentes si se incorpora)

| ID | Riesgo | Prob. hoy | Impacto si se incorpora | Severidad futura | Mitigación futura |
|---|---|---|---|---|---|
| R-AI-01 | Alucinación / afirmaciones sin respaldo | Nula (no hay LLM) | Alto | Alta | Validación humana + citación + disclaimer `politica-ia.md §6` |
| R-AI-02 | Prompt injection → bypass `auth()`/RLS | Nula | Crítico | Crítica | Sanitización + allowlist herramientas + `auth()` en cada tool |
| R-AI-03 | Fuga de `codeSnapshot`/PII al LLM | Nula | Alto | Alta | DPA + minimización + no loguear `codeSnapshot` completo |
| R-AI-04 | Sesgo en calificación/recomendación | Nula | Alto | Alta | Evaluación sesgo + HUM en loop + apelación |

## 4. Dependencias de remediación

```
Fase 1 (0.5-1 d):  R-01 (headers) + R-05 (diagnose) + R-06 (DELETE docs)  → sin deps, en paralelo
Fase 2 (1 d):      R-02 (signedUrl) → requiere Supabase Storage config
Fase 3 (1-2 d):    R-03 (cron purga) → requiere vercel.json + handler + pg_cron
Fase 4 (cuando escale): R-07 (Redis) → Upstash/Vercel
Fase 5 (1 d):      R-08 (a11y) → sin deps, en paralelo con Fase 1
```

## 5. Históricos resueltos (no abiertos, trazabilidad)

| ID origen | Título | Severidad original | Resolución | Commit/evidencia |
|---|---|---|---|---|
| G-01/INV-01/PROV-01 | Sin autorización art. 9/26 conservable | **Crítica** | `consent_logs` `migration.sql:408` + `AuthForm` checkbox no pre-marcado + `dpa-register.md` | `main@d5c6f6c` |
| G-03/INV-02 | Sin `user.deleted` / supresión art. 8 | **Crítica** | `webhooks/clerk/route.ts:105` cascade + `DELETE /api/account` + `cron/purge-pending` 24 h | `main@d5c6f6c` |
| H-01 | `GF_SECURITY_ADMIN_PASSWORD=invitro` hardcodeada | **Crítica** | Migrado a `${GF_SECURITY_ADMIN_PASSWORD:?...}` | `docker-compose.monitoring.yml:75` |
| G-02 | `service-role` bypass sin guard | **Alta** | `admin.ts:11` `throw if window` + cache `publicMetadata.role` `middleware.ts:60` | `admin.ts:11` |
| G-04/INV-04 | Avatar público sin `remove(oldPath)` | **Alta** | `validateAvatar` magic bytes + `remove(oldPath)` al reemplazar | `02fb756` |
| PROV-02 | DPAs no firmados | **Alta** | Plantilla `dpa-register.md` v1 con URLs/pasos | `legal/dpa-register.md` |
| — | Rate limiting ausente | **Alta** | `rate-limit.ts` in-memory 100/15 min + 429 | `247e76a` |

---

*Registro 2026-10-16-v1 — cada fila cita `archivo:línea`. Un nuevo handler, nueva tabla o nuevo proveedor obliga a re-evaluar y versionar.*
