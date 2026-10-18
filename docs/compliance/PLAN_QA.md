# Plan QA — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16
> **Responsable:** Ingeniería QA · `invitro.code@gmail.com`
> **Stack de pruebas:** Vitest 4.1.10 (`environment: node`, `v8` coverage) · `vitest.config.mts:4-15` · sin `jsdom` (AGENTS.md — no necesario) · 223 tests en 23 files (green)
> **Gates:** `npm run type-check` (`tsc --noEmit`) · `npm run test` (`vitest run`) · `npm run assets:check` (prebuild) · `npm run build` (`next build`, Turbopack standalone)
> **Fuentes:** `vitest.config.mts` · `src/**/__tests__/**` · `src/app/api/**` · `legal/security-audit.md` · OWASP Top 10 / API Top 10 / LLM Top 10

---

## 1. Estrategia

| Dimensión | Qué cubre | Herramienta | Criterio de aceptación |
|---|---|---|---|
| **Funcional** | Flujos de usuario, formularios, auth, integraciones | Vitest + inspección manual | Todos los casos críticos en verde; sin regresión en `progress`/`lab-progress` |
| **Privacidad** | RLS, consent gate, supresión, no fuga entre usuarios | Vitest + RLS en `supabase-migration.sql` + tests `requestId-descarte` | Ningún test de aislamiento falla; `user.deleted` cascade verificado |
| **Seguridad** | OWASP Top 10, secretos, uploads, rate limit, headers | Vitest + `grep` + `validateAvatar` + `rate-limit.ts` | 0 secretos hardcodeados en `src/`; `validateAvatar` 100 % branches |
| **IA** | No hay LLM en runtime — verificar ausencia + Pyodide determinismo | `grep vacío openai` + `threshold-lab` determinismo `seed=42` | `grep vacío` + trainer `seed=42` reproducible |
| **Rendimiento / confiabilidad** | Latencia, concurrencia (`runQueue`), recuperación Worker | `pyodide-worker.ts` `discardWorker` + `runQueue` + `INIT_TIMEOUT 120s` | Worker auto-recovery sin estado zombie |

---

## 2. Matriz de pruebas

### A. QA funcional

| ID | Objetivo | Precondiciones | Pasos | Resultado esperado | Evidencia | Estado |
|---|---|---|---|---|---|---|
| QA-F-01 | Registro con consentimiento art. 9/26 | Sin sesión | 1. Ir a `/sign-up` 2. Llenar email/pw 3. **Sin** tildar `acceptBase` → submit | Error "Debés aceptar la Política..." `AuthForm.tsx:62` | `AuthForm.tsx:57-62` `acceptBase` gate | Manual — pendiente automatizar |
| QA-F-02 | Registro con `gender=x` sin explícito art. 6 | Clerk `public_metadata.gender=x` | Crear cuenta con `x` sin `acceptGenderX` | Webhook `403 Explicit gender consent required` `webhooks/clerk/route.ts:60` | `webhooks/clerk:60-67` + `domain/consent.ts:15` | Manual |
| QA-F-03 | Login y redirect | Cuenta `verified` | Ir a `/sign-in` con sesión activa | Redirect a `/dashboard` `middleware.ts:29` | `middleware.ts:21-31` | Manual |
| QA-F-04 | `POST /api/progress` happy path | Sesión `auth()` válida, `module_slug` en allowlist | `POST /api/progress {module_slug, lesson_slug, xp_earned}` | 200 + `progress` upsert + `streaks` + `achievements` | `progress/route.ts:35-110` + `progress/route.test.ts` | **Automático** `route.test.ts` |
| QA-F-05 | `POST /api/lab-progress` anti-downgrade | `lab_progress completion_status=completed` | `POST {completion_status:"in_progress"}` | Rechazo — no downgrade `lab-progress/route.ts:140-148` | `lab-progress/route.test.ts` | **Automático** |
| QA-F-06 | `lab-progress` cap `codeSnapshot` 8 KB | `last_position.codeSnapshot` 20 KB | `POST /api/lab-progress` con snapshot grande | Truncado a 8192 `capLastPosition` `route.ts:152` | `lab-progress/route.test.ts` | **Automático** |
| QA-F-07 | `GET /api/notebook/[module]/[lesson]` path traversal | Sin `..` en params | `GET /api/notebook/est%2F..%2Fetc/passwd` | 400/404 (no 200 con `/etc/passwd`) `path.resolve + startsWith(contentRoot)` `route.ts:23-37` | `notebook/route.ts:23-37` | Manual |
| QA-F-08 | `GET /api/diagnose` con `auth()` | Sin sesión | `GET /api/diagnose?module=python&slug=lesson01` sin cookie | 401 `diagnose/route.ts:8` (aunque `middleware.ts:11` la deja pasar — handler defiende) | `diagnose/route.ts:7-10` | Manual |
| QA-F-09 | `POST /api/certify` flag OFF | `FEATURE_FLAG_CERTIFY=false` | `POST /api/certify {code:"print(1)"}` con sesión | 503 `certified:false` `route.ts:22` | `certify/route.ts:22-27` | **Automático** (si se testea) |
| QA-F-10 | `POST /api/consent` validación | Sesión válida | `POST /api/consent` sin `TRANSFER_EEUU` | 400 `purposes must include F-01 and transfer:EEUU` `completeConsent.ts:17` | `completeConsent.ts:17` + `consent/route.ts:18` | **Automático** `src/application/use-cases/completeConsent.test.ts` (si existe) |
| QA-F-11 | `DELETE /api/account` self-supresión | Sesión válida | `DELETE /api/account` | 200 `deleted:true` + cascade 7 tablas + storage + Clerk `route.ts:11-45` | `account/route.ts:11` | Manual (e2e con test user) |
| QA-F-12 | Cron `purge-pending` auth | Sin `CRON_SECRET` ni `x-vercel-cron` | `GET /api/cron/purge-pending` sin header | 401 `isAuthorized` `purge-pending/route.ts:14-27` | `purge-pending/route.ts:14` | Manual |

### B. QA de privacidad

| ID | Objetivo | Precondiciones | Pasos | Esperado | Evidencia | Estado |
|---|---|---|---|---|---|---|
| QA-P-01 | RLS aísla usuarios — no lectura cruzada | Dos usuarios A/B | A lee `progress` de B vía `supabase.from("progress").select().eq("user_id", B)` con JWT de A | 0 filas (RLS `auth.jwt()->>sub = user_id` `migration.sql:80`) | `migration.sql:52-460` | Manual (pgTAP o supabase test) |
| QA-P-02 | `DELETE` RLS aísla usuarios | Usuario A | A intenta `DELETE FROM progress WHERE user_id=B` con JWT de A | 0 filas borradas | `migration.sql:430` `FOR DELETE USING (auth.jwt()->>sub = user_id)` | Manual |
| QA-P-03 | `requestId` no fuga entre sesiones | Pyodide Worker con 2 runs concurrentes | `run(codeA)` + `run(codeB)` con `requestId` distintos | Cada `pending.get(requestId)` resuelve su propio `output` `pyodide-worker.ts:67` | `pyodide-worker.ts:67-73` + `requestId-descarte.test.mjs` | **Automático** `requestId-descarte.test.mjs` |
| QA-P-04 | `codeSnapshot` no contiene PII | `last_position.codeSnapshot` con `email` pegado por usuario | Inspeccionar `lab_progress.last_position` en DB | CodeSnapshot limitado 8192 y purgado 60 d; no debe usarse para PII (advertido en `terminos §3`) | `lab-progress/route.ts:152` + `retention-policy.md §3 P1` | Manual |
| QA-P-05 | `supabase_realtime` no exfiltra sin RLS | `supabase_realtime` con 7 tablas en publication | Intentar `supabase.channel("test").on("postgres_changes", {table:"profiles"})` sin JWT | Sin datos (o solo propios por RLS) | `migration.sql:9-14,353-360` + `grep vacío channel.subscribe` en `src/` | Manual |
| QA-P-06 | Consent `pending` no da acceso a progreso | `profiles.consent_status=pending` | Usuario `pending` accede a `/dashboard` o `POST /api/progress` | `ConsentBanner` visible `ConsentBanner.tsx:12` + posible gate futuro (no bypass de RLS) | `ConsentBanner.tsx:12` + `middleware.ts` (no bloquea hoy — observación) | Manual |

### C. QA de seguridad (OWASP)

| ID | Objetivo | OWASP | Pasos | Esperado | Evidencia | Estado |
|---|---|---|---|---|---|---|
| QA-S-01 | Secretos no hardcodeados en `src/` | A07 | `grep -r "sk_\|whsec\|SUPABASE_SERVICE_ROLE" src/ --include="*.ts"` → vacío (excepto `requireEnv` en `admin.ts`) | Vacío en `src/`; `admin.ts:15` `requireEnv` fail-closed | `admin.ts:15` + `.gitignore:19` `.env*` | **Automático** (CI grep) |
| QA-S-02 | `GF_SECURITY_ADMIN_PASSWORD` no hardcodeada | A07 / CWE-798 | Inspeccionar `docker-compose.monitoring.yml:75` | `${GF_SECURITY_ADMIN_PASSWORD:?...}` (no `invitro` literal) | `monitoring.yml:75` | ✅ **Corregido** |
| QA-S-03 | Avatar `file.type` spoof rechazado | A03 / CWE-434 | Subir `avatar.png` con `Content-Type: image/png` pero magic bytes `FF D8 FF` (JPEG) + `file.type=image/png` | 400 "Invalid image signature" o "extension does not match MIME" | `validateAvatar.ts:40-55` ext↔MIME + magic bytes | **Automático** `validateAvatar.test.ts` |
| QA-S-04 | Avatar doble extensión rechazada | A03 | Subir `avatar.png.exe` o `../avatar.png` | 400 "Invalid file extension" `validateAvatar.ts:31` | `validateAvatar.ts:31` allowlist `jpg\|jpeg\|png\|webp` | **Automático** |
| QA-S-05 | Path traversal en `notebook`/`rscript` | A01 | `GET /api/notebook/../../etc/passwd` | 400/404, no 200 | `notebook/route.ts:29` `startsWith(contentRoot)` | Manual |
| QA-S-06 | Rate limit 429 en `POST /api/progress` | A04 | Enviar 101 requests en 15 min con mismo `userId` | 429 + `Retry-After` `rate-limit.ts:20-25` | `rate-limit.ts:20` + `progress/route.ts:40` `checkRateLimit` | Manual (k6 o script) |
| QA-S-07 | XSS en MDX — no `dangerouslySetInnerHTML` con usuario | A03 | Inspeccionar `src/app/learn/[module]/[slug]/page.tsx` render MDX | MDX compilado con `next-mdx-remote/rsc` (sanitizado), no `dangerouslySetInnerHTML` con input de usuario | `page.tsx` + `remark-gfm` | Manual |
| QA-S-08 | `service-role` no expuesto al cliente | A01 | `grep -r "createAdminClient" src/ --include="*.tsx" --include="client"` → vacío en `"use client"` | Vacío; `admin.ts:11` `throw if window` | `admin.ts:11` | **Automático** (CI grep) |
| QA-S-09 | Headers de seguridad (CSP/HSTS) | A05 | `curl -I https://<prod> | grep -i "content-security\|strict-transport\|x-frame"` | Presentes (si Vercel los inyecta) o TODO en `next.config.ts` | `next.config.ts` (hoy sin `headers()`) | ⚠️ **Pendiente** |
| QA-S-10 | Prompt injection (futuro LLM) | LLM Top 10 | No aplica hoy — `grep vacío openai\|anthropic` en `src/` | Vacío (no hay LLM) | `package.json:18-47` | **No aplicable** |

### D. QA de IA (hoy: verificar ausencia + determinismo Pyodide)

| ID | Objetivo | Pasos | Esperado | Evidencia | Estado |
|---|---|---|---|---|---|
| QA-AI-01 | No hay LLM/chatbot en runtime | `grep -r "openai\|anthropic\|langchain\|@ai-sdk\|cohere\|gemini" src/ --include="*.ts" --include="*.tsx"` | Vacío fuera de `node_modules` | `package.json:18-47` sin SDK IA | **Automático** (CI grep) |
| QA-AI-02 | `/api/certify` no es IA | `POST /api/certify` con flag OFF → 503; con flag ON → stub `certified:true` determinista | 503 / stub, no LLM | `certify/route.ts:22,51-56` | Manual |
| QA-AI-03 | Pyodide determinismo `seed=42` | Ejecutar `diagnostic-trainer.tsx:431` KNN `seed=42` dos veces con mismo input | Misma salida (determinista) | `diagnostic-trainer.tsx:431` + `threshold-lab.tsx:203` `seed=42` | Manual |
| QA-AI-04 | `codeSnapshot` no se envía a LLM | Inspeccionar `pyodide-worker.ts:176` `postMessage` destino | Solo Worker local, no `fetch` a `api.openai.com` | `pyodide-worker.ts:176` + `pyodide-worker.js:265` | **Automático** (CI grep `fetch.*openai`) |

### E. QA de rendimiento y confiabilidad

| ID | Objetivo | Pasos | Esperado | Evidencia | Estado |
|---|---|---|---|---|---|
| QA-R-01 | Worker `runQueue` serializa runs | Lanzar 3 `pyodideWorker.run()` concurrentes con `requestId` distintos | `runQueue` `pyodide-worker.js:23` los encadena; cada `output` corresponde a su `requestId` `pyodide-worker.ts:67` | `pyodide-worker.js:23` `let runQueue = Promise.resolve()` + `pyodide-worker.ts:67` | **Automático** `requestId-descarte.test.mjs` |
| QA-R-02 | Worker auto-recovery tras crash | `worker.onerror` → `discardWorker` → `getWorker()` recrea | Siguiente `run()` funciona tras `discardWorker` `pyodide-worker.ts:90-110` | `pyodide-worker.ts:90` `discardWorker` + `getWorker` | Manual (inyección de error) |
| QA-R-03 | `INIT_TIMEOUT 120s` evita hang | Desconectar red (`isOffline()` `pyodide-worker.ts:20`) → `ready()` | `PyodideOfflineError` inmediato, no espera 120 s | `pyodide-worker.ts:20,120` `isOffline()` + `PyodideOfflineError` | Manual |
| QA-R-04 | Cron `purge-pending` no bloquea con 100 `pending` | 100 usuarios `pending_since < cutoff` | `purge-pending` `LIMIT 100` `route.ts:70` + loop `purgeUser` best-effort | `purge-pending/route.ts:60-80` | Manual (staging) |
| QA-R-05 | Build no regresiona | `npm run build` (Turbopack) | Build OK, `output: standalone` `next.config.ts:4` | `next.config.ts:4` + `Dockerfile.nextjs:46` | **Automático** (CI) |

---

## 3. Ejecución y gates

| Gate | Comando | Cuándo | Criterio |
|---|---|---|---|
| **Types** | `npm run type-check` (`tsc --noEmit`) | Pre-commit + CI | 0 errores |
| **Tests** | `npm run test` (`vitest run`) | Pre-commit + CI | 223/223 (hoy) — sin regresión |
| **Coverage** | `npm run test -- --coverage` (`v8`) | CI semanal | No baja de baseline (hoy ~60 % en `domain/consent` + `validateAvatar` + `rate-limit`) |
| **Assets** | `npm run assets:check` (`check-hero-assets.mjs`) | Prebuild | 0 diffs >0.5 en viewBox |
| **Build** | `npm run build` | CI | Sin error Turbopack |
| **Greps de seguridad** | `grep -r "openai\|harcode.*password\|supabase.*service_role" src/` | CI | Greps de IA vacíos; secretos vacíos |
| **Headers** | `curl -I https://<prod>` | Deploy | CSP/HSTS presentes (cuando se implemente) |

---

## 4. Pruebas no destructivas ejecutadas el 2026-10-16

| Comando | Resultado |
|---|---|
| `npm run test` | **223 passed (23 files, 1.16 s)** — `vitest 4.1.10`, `environment: node` |
| `grep vacío openai\|anthropic` en `src/` | **Vacío** — confirmado no hay LLM en runtime |
| `grep vacío gtag\|GTM` en `src/` | **Vacío** — confirmado no hay analítica |
| `grep vacío stripe\|checkout` en `src/` | **Vacío** — confirmado no hay pagos |
| Inspección `validateAvatar.ts` | **Magic bytes + coherencia MIME/ext OK** |
| Inspección `docker-compose.monitoring.yml:75` | **Corregido** a `${VAR:?}` |

**Pruebas no ejecutadas (requieren staging/prod o e2e):** QA-F-07/08/11/12 (path traversal, diagnose, supresión e2e, cron auth), QA-P-01/02 (RLS e2e), QA-S-06 (rate limit 429 e2e), QA-R-02/04 (recovery/cron con 100). Procedimiento reproducible en §2.

---

## 5. Referencias

- OWASP Top 10 (2021) · OWASP API Security Top 10 (2023) · OWASP Top 10 for LLM Applications (2023) — referenciales para QA-S/QA-AI
- `legal/security-audit.md` (388 lí, 12 controles C-01..C-12) — fuente de QA-S
- `legal/ai-audit.md` (5 pruebas de ausencia de LLM) — fuente de QA-AI
- `legal/analytics-audit.md` — confirma 0 analítica
- `vitest.config.mts:4-15` — config de tests

---

*Plan QA 2026-10-16-v1 — cada caso cita `archivo:línea`. Un nuevo handler `/api/*`, nueva tabla o nuevo flag obliga a añadir casos y re-ejecutar gates.*
