# Auditoría Técnica — InVitro-Code

> **Versión:** 2026-10-16-v1 — Auditoría integral Fase I
> **Fecha:** 2026-10-16 · **Commit base:** `7b0cd26` · **Rama:** `main` (con cambios no committeados en `src/app/page.tsx` y landing)
> **Responsable declarado:** Persona natural Colombia · NIT 700329113-7 · Corregimiento Altavista, Medellín · `invitro.code@gmail.com` · Gratuito +18 · LATAM
> **Metodología:** Inspección directa del código fuente. Toda afirmación cita `archivo:línea` o `grep vacío` verificable. Sin plantillas genéricas, sin datos inventados.
> **Fuentes leídas:** `package.json:1-61` · `next.config.ts:1-20` · `src/middleware.ts:1-110` · `src/app/layout.tsx:1-55` · `src/lib/supabase/admin.ts:1-17` · `src/lib/env.ts:1-10` · `src/domain/consent.ts:1-90` · `src/lib/profile/validateAvatar.ts:1-80` · `src/lib/rate-limit.ts:1-35` · `src/lib/pyodide-worker.ts:1-205` · `public/pyodide-worker.js:1-340` · `supabase-migration.sql:1-550` · `src/app/api/**` (10 handlers) · `vercel.json:1-24` · `docker-compose*.yml` · `backend/app/**` · `vitest.config.mts` · `legal/` (18 auditorías)

---

## Resumen ejecutivo

**InVitro-Code** es una plataforma educativa 100 % gratuita (sin pagos, sin suscripciones) que enseña ciencia de datos aplicada a biotecnología con Python interactivo. Stack: **Next.js 16 App Router (standalone, Turbopack)** + TypeScript + Tailwind v4 + MDX (`next-mdx-remote/rsc`, `remark-math`/`rehype-katex`). Desplegada en **Vercel** (`next.config.ts:4` `output:"standalone"`). Auth exclusiva **Clerk 7.5.20** con `clerkMiddleware` y verificación Svix. Datos en **Supabase Postgres** con RLS `auth.jwt()->>sub` sobre columnas `TEXT` y escritura exclusiva vía `createAdminClient()` (service-role, solo servidor). Runtime Python **Pyodide 0.25.0** desde jsDelivr CDN ejecutado **100 % local en Web Worker** — no es IA generativa. Certificación server-side E2B en stub deshabilitado (`FEATURE_FLAG_CERTIFY=false`).

**Estado agregado:** **CONFORME con observaciones de higiene.** Las brechas críticas históricas (autorización art. 9/26, `user.deleted`, validación avatar, rate-limit, secretos) ya están resueltas en `main`. Quedan 5 observaciones medias/bajas (CSP, bucket privado, cron purga, accesibilidad, backups self-hosted) sin impacto crítico inmediato.

| Dimensión | Estado |
|---|---|
| Arquitectura y dependencias | ✅ Conforme |
| Autenticación y RLS | ✅ Conforme (cache `publicMetadata.role` en middleware) |
| Gestión de secretos | ✅ Conforme (hardcode Grafana migrado a `${VAR:?}`) |
| Uploads y validación | ✅ Conforme (`validateAvatar` con magic bytes + coherencia MIME/ext) |
| Rate limiting | ✅ Mitigado (in-memory `rate-limit.ts`, migrar a Redis si escala) |
| Headers de seguridad (CSP/HSTS) | ⚠️ Pendiente (medio) |
| Storage privado avatares | ⚠️ Pendiente (medio — hoy `getPublicUrl` público) |
| Cron purga 60 d / inactividad 24 m | ⚠️ Solo norma documental, sin job físico |

---

## 1. Frontend — Next.js 16 App Router

| Aspecto | Evidencia | Implicación |
|---|---|---|
| **Framework** | `package.json:30` `next: "16.4.1"` · `next.config.ts:4` `output:"standalone"` · `Dockerfile.nextjs:26` `npm run build` | Bundle autocontenido, Turbopack. Node ≥20.9 (`package.json engines`). |
| **`lang="es"`** | `src/app/layout.tsx:39` `<html lang="es">` | Coherente con `openspec/config.yaml:6` `language: spanish` y alcance LATAM. |
| **Clerk envuelve toda la app** | `src/app/layout.tsx:37` `<ClerkProvider>` | Cookies `__session`/`__clerk_*` gestionadas por Clerk. Sin provider no hay auth. |
| **Fuentes self-hosted** | `src/app/layout.tsx:6-22` `next/font/google` (Inter/Space Grotesk/JetBrains Mono) | No hay `fetch` a `fonts.googleapis.com` (`grep vacío googleapis` en `src/`). No es transferencia. |
| **MDX + LaTeX** | `package.json:26,31-32,40-42` `gray-matter`/`next-mdx-remote`/`remark-math`/`rehype-katex` | `src/content/modules/{module}/lessons/{lesson}/lesson.md` con split `<Section` en carrusel. Requiere preservar `$...$`. |
| **Componentes pesados** | `@monaco-editor/react` `^4.7.0`, `@rive-app/canvas` `^2.42.2`, `plotly.js` `^4.1.1`, `recharts`, `motion`, `gsap` | Todos empaquetados localmente. Ninguno hace tracking externo. |
| **Storage local funcional** | `src/components/labs/LabTabs.tsx:46`, `LabWorkspace.tsx:53`, `ConsoleFrame.tsx:41`, `OnboardingController.tsx:95` | `localStorage` (tabs/workspace/onboarding) + `sessionStorage` (consola). Bosquejado en `POLITICA_PRIVACIDAD.md §6`. No es cookie de tracking. |
| **Server Components** | `src/app/(dashboard)/*/page.tsx` con `auth()` en servidor | `SUPABASE_SERVICE_ROLE_KEY` nunca llega al cliente (solo `src/lib/supabase/admin.ts:7`). |

**Verificación negativa — analytics/pixels:**

```
grep -ri "gtag|GTM|ga4|fbevents|fbq|tiktok.*pixel|hotjar|clarity" src/ --exclude-dir=node_modules → vacío
src/app/layout.tsx:1-55 sin <Script> de analytics · next.config.ts:1-20 sin headers de tracking
```

## 2. Backend — API Routes y Server Actions

### 2.1 Route Handlers (`src/app/api/**`)

| # | Ruta | Método | Auth | Validación | Persistencia |
|---|---|---|---|---|---|
| 1 | `/api/webhooks/clerk` `route.ts:27` | POST | Svix `CLERK_SIGNING_SECRET` `route.ts:36` + `svix-*` headers `route.ts:27-29`; público intencional `middleware.ts:10` | `parseGender` enum `f\|m\|x` `route.ts:21`, híbrido consent gate `hasValidConsent`/`hasGenderConsent` `route.ts:54-67` | `profiles` upsert `onConflict:"id"` `route.ts:76,91` · `user.deleted` cascade 8 tablas + storage + Clerk `route.ts:105-126` |
| 2 | `/api/consent` `route.ts:18` | POST | `auth()` preferido, fallback `body.userId` (pre-webhook race) `route.ts:29-48` | Zod `ConsentPurpose` enum `route.ts:11`, hash SHA-256 64-128 hex `route.ts:14` | `completeConsent()` → `consent_logs` insert + `profiles` flip `verified` |
| 3 | `/api/account` `route.ts:11` | DELETE | `auth()` `route.ts:12` → 401 | Self-supresión art. 8; sin body | Cascade 6 tablas + storage + `profiles` + `clerkClient.users.deleteUser` best-effort |
| 4 | `/api/progress` `route.ts:35` | POST | `auth()` `route.ts:37` | `readNonEmptyString` + `getLessonSlugs` allowlist + `Math.min(requestedXp, serverXp)` authoritative | `progress` upsert + `advanceStreak` + `evaluateAchievements` |
| 5 | `/api/lab-progress` `route.ts:52` | GET/POST | `auth()` `route.ts:18,54` | Zod `labProgressPostSchema` + `capLastPosition` ≤8 KB + anti-downgrade `completed` + allowlist slugs | `lab_progress` upsert + dual-write `progress` best-effort |
| 6 | `/api/profile/avatar` `route.ts:5` | POST | `auth()` `route.ts:6` | `validateAvatar()` (`file.type` allowlist + `file.name` ext + magic bytes + coherencia MIME/ext) + 2 MB | `storage.from("avatars").upload` + `getPublicUrl` + `profiles.avatar_url` |
| 7 | `/api/certify` `route.ts:14` | POST | `auth()` `route.ts:16` + `FEATURE_FLAG_CERTIFY!=="true"` → 503 `route.ts:22` | `code` string requerido | Stub MVP `certified:true` (flag ON); E2B es TODO comentado `route.ts:39-48` — no es IA |
| 8 | `/api/diagnose` `route.ts:7` | GET | `auth()` `route.ts:8` (pública en middleware pero handler exige sesión) | `^[a-zA-Z0-9_-]+$` + `path.startsWith(contentRoot)` anti `..` | Solo lectura `fs.readFileSync` + `gray-matter` — no escribe |
| 9 | `/api/notebook/[module]/[lesson]` `route.ts:6` | GET | `auth()` `route.ts:11` | `path.resolve` + `startsWith(contentRoot)` + `path.normalize` | `fs.readFileSync` bytes crudos |
| 10 | `/api/rscript/[module]/[lesson]` `route.ts:6` | GET | `auth()` `route.ts:10` | Idéntica sanitización path traversal | `fs.readFileSync` utf8 |
| 11-13 | `/api/cron/purge-pending` `recharge-freezes` `daily-nudge` | GET | `CRON_SECRET` Bearer o `x-vercel-cron` `purge-pending/route.ts:14-27` | `PENDING_TTL_HOURS=24` + `consent_status=pending ∧ pending_since < cutoff` | Best-effort delete cascade + `clerkClient.deleteUser` |
| 14 | `/api/bookmarks` `route.ts:5` | GET/POST/DELETE | `auth()` | `module_slug`/`lesson_slug` con allowlist | `bookmarks` RLS `auth.jwt()->>sub` |

**Server Actions (`"use server"`):** `src/app/(dashboard)/perfil/page.tsx:48` (avatar duplicado — hoy unificado vía `validateAvatar`), `src/app/(dashboard)/admin/page.tsx:78` (admin), `src/app/(dashboard)/configuracion/page.tsx:37` (prefs).

**Ausencias verificadas:** `grep -r "stripe|paypal|mercadopago|checkout|newsletter|openai|anthropic|langchain" src/` → vacío (fuera de `node_modules`).

### 2.2 Middleware

| Aspecto | Evidencia |
|---|---|
| Import | `src/middleware.ts:1` `clerkMiddleware` |
| `publicRoutes` | `middleware.ts:5-12` `/`, `/sign-in`, `/sign-up`, `/sso-callback`, `/api/webhooks/clerk`, crons (3), `/aviso`, `/privacidad`, `/cookies`, `/terminos`, `/ia` |
| `adminRoutes` | `middleware.ts:14` `/admin`, `/api/admin` — guard `publicMetadata.role` cache + DB fallback `profiles.role` `middleware.ts:58-73` |
| Default | No público → exige `session.userId`; API → 401 JSON `middleware.ts:43`, páginas → redirect `/sign-in?redirect_url=` `middleware.ts:48` |
| Matcher | `middleware.ts:78-85` excluye `_next`/estáticos, siempre corre en `/(api\|trpc)(.*)` y `/__clerk/(.*)` |

## 3. Infraestructura

| Componente | Evidencia | Estado |
|---|---|---|
| **Vercel** | `README.md:5`, `next.config.ts:4` standalone, `vercel.json:1-24` crons 3 jobs | Deploy primario, Edge Network, TLS, logs. Región por defecto EE. UU. |
| **Supabase** | `package.json:24` `2.110.7`, `supabase-migration.sql:4-7` cabecera RLS, `admin.ts:10` service-role | Postgres + Storage + Realtime (publications idempotentes, sin `channel.subscribe` activo) |
| **jsDelivr CDN** | `public/pyodide-worker.js:4-5` `PYODIDE_VERSION 0.25.0` + `PYODIDE_CDN https://cdn.jsdelivr.net/...` | Solo descarga de runtime Python; no recibe datos personales |
| **PyPI via micropip** | `public/pyodide-worker.js:67-82` `micropip.install("seaborn"/"plotly")` | Wheels Python; sin datos personales |
| **DNS** | Sin zona dedicada; gestionado implícitamente por Vercel (`grep vacío dns|route53` en `src/`) | Vía Vercel (EE. UU.) |
| **Docker** | `Dockerfile.nextjs` standalone, `docker-compose.yml` (dev), `docker-compose.prod.yml` (prod self-host), `docker-compose.monitoring.yml` (cadvisor/prometheus/grafana — secreto migrado a `${GF_SECURITY_ADMIN_PASSWORD:?}`) | Opcional self-host; build reproducible |

## 4. Dependencias

### 4.1 Producción (`dependencies`)

| # | Paquete | Versión | Finalidad | Riesgo |
|---|---|---|---|---|
| 1 | `next` | `16.4.1` pin | App Router, Route Handlers, Middleware | Medio — mantener parches de seguridad |
| 2 | `react`/`react-dom` | `19.2.7` pin | UI | Bajo |
| 3 | `@clerk/nextjs` | `7.5.20` pin | **IdP único** | Alto — Encargado EE. UU. con DPA |
| 4 | `@supabase/supabase-js` | `2.110.7` pin | **DB + Storage** | Alto — Encargado EE. UU. (AWS) |
| 5 | `svix` | `1.98.0` pin | Webhook firma (librería local, no proveedor) | Medio |
| 6 | `zod` | `^4.6.5` | Validación `labProgressPostSchema`, consent | Medio |
| 7-13 | `@monaco-editor/react`, `@rive-app/canvas`, `@radix-ui/*`, `plotly.js`/`recharts`, `motion`/`gsap`, `lucide-react` | rangos `^` | UI/editor/animación/charts | Bajo (empaquetados local) |
| 14-18 | `gray-matter`, `next-mdx-remote`, `remark-gfm/math`, `rehype-katex`, `unist-util-visit` | `^` | MDX/LaTeX | Bajo |

DevDeps: `typescript 6.0.3` · `vitest 4.1.10` + `@vitest/coverage-v8` · `tailwindcss 4.3.3` · `playwright-core`.

Reproducibilidad: `package-lock.json` 345 KB coherente · `Dockerfile.nextjs:14` usa espejo `registry.npmmirror.com` (registrar en supply-chain).

### 4.2 Backend Python (`backend/requirements.txt`)

`fastapi` `uvicorn` `asyncpg` `python-jose` `pydantic-settings` `httpx` `slowapi` — FastAPI en `backend/app/main.py` con `CORSMiddleware` (`CORS_ORIGINS` por defecto `localhost:3000`, ver `backend/app/config.py:8`), pool `asyncpg`, JWT Clerk via `jose`. Rol secundario (Next.js es canónico, ver `docs/adr/003-single-writer-progress.md`).

## 5. Seguridad — resumen por control

| # | Control | Estado | Evidencia |
|---|---|---|---|
| C-01 | Variables sensibles | ✅ | `.env.local.example:1-20` 9 vars · `src/lib/env.ts:1-10` `requireEnv` fail-closed · `.gitignore:19-20` ignora `.env*` |
| C-02 | Gestión de secretos | ✅ | Sin hardcode en `src/` · `docker-compose.monitoring.yml:75` migrado a `${GF_SECURITY_ADMIN_PASSWORD:?}` · sin vault (observación) |
| C-03 | Autenticación | ✅ | `clerkMiddleware` + `ClerkProvider` + Svix `wh.verify` `webhooks/clerk/route.ts:40` · falta CSP/HSTS (gap medio) |
| C-04 | Autorización/RLS | ✅ | RLS `auth.jwt()->>sub` en 8 tablas · `admin.ts:11` guard `typeof window` · `middleware.ts:60` cache `publicMetadata.role` + DB fallback |
| C-05 | Rutas protegidas | ✅ | `publicRoutes` delimitadas `middleware.ts:5-12` · `/api/diagnose` pública pero handler con `auth()` (inconsistencia menor) |
| C-06 | Uploads | ✅ | `validateAvatar` allowlist MIME + ext + magic bytes (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF..WEBP`) + coherencia + `MAX_SIZE 2 MB` |
| C-07 | Rate limiting | ✅ Mitigado | `src/lib/rate-limit.ts` in-memory 100/15 min · usado en `progress`, `lab-progress`, `bookmarks`, `daily-goal`, `reflection` |
| C-08 | Backups/PITR | ⚠️ Doc | Supabase PITR 7 d free/30 d Pro (no `pg_dump` self-hosted) · `retention-policy.md §1` |
| C-09 | Exposición de datos | ✅ | Sin exposición masiva · riesgo `getPublicUrl` público (gap medio → migrar a `createSignedUrl`) · `supabase_realtime` 7 tablas sin suscripción activa |

## 6. Mapa de datos (resumen — detalle en `INVENTARIO_TRATAMIENTO_DATOS.md`)

| # | Dato | Origen | Base/Tipo | Estado |
|---|---|---|---|---|
| 1 | `email`, `id` Clerk (`sub`) | Form registro `AuthForm.tsx:48` | `profiles.id/email` + Clerk | Transfer EE. UU. con DPA |
| 2 | `username` (derivado `first_name` o `email.split("@")[0]`) | Clerk webhook `route.ts:60` | `profiles.username` | — |
| 3 | `gender` `f\|m\|x` | `public_metadata.gender` `route.ts:22` | `profiles.gender` CHECK `f\|m\|x` | `x` sensible art. 6, consent explícito `gender:x` |
| 4 | `avatar` binario | `validateAvatar` + `storage.from("avatars")` | `profiles.avatar_url` + bucket | Público hoy (gap) |
| 5 | `progress` / `lab_progress` / `streaks` / `reflection_completions` / `user_achievements` | `POST /api/progress`, `lab-progress`, `advanceStreak` | Tablas RLS | Vida cuenta |
| 6 | `consent_logs` | `POST /api/consent` (`completeConsent`) | `consent_logs` (Ley 527 conservable) | Vida cuenta + 6 m tras supresión |
| 7 | `bookmarks` | `POST /api/bookmarks` | `bookmarks` | Vida cuenta |
| 8 | Código Python del usuario | `PyodideRunner.tsx:123` → Worker local | **Solo memoria del Worker** — nunca se persiste ni envía a terceros | No sale del dispositivo |

## 7. Hallazgos y brechas priorizadas

| ID | Categoría | Severidad | Evidencia | Estado |
|---|---|---|---|---|
| H-01 | CSP/HSTS/X-Frame sin headers | Seguridad | `grep vacío headers\|CSP\|HSTS en next.config.ts + middleware.ts` | **Medio — pendiente** (mitigado parcialmente por Vercel defaults) |
| H-02 | Bucket `avatars` público `getPublicUrl` | Privacidad/Sec | `src/app/api/profile/avatar/route.ts:47` `getPublicUrl` | **Medio — pendiente** (mitigado con `validateAvatar` + `remove(oldPath)`, migrar a `createSignedUrl`) |
| H-03 | Cron purga `codeSnapshot` 60 d / inactividad 24 m sin job físico | Retención | `retention-policy.md §3` solo norma, sin `pg_cron`/`vercel.json` entry | **Medio — pendiente** |
| H-04 | `supabase_realtime` 7 tablas sin uso pero en publication | Seguridad | `supabase-migration.sql:9-14,142-171` + `grep vacío supabase.channel` en `src/` | **Bajo** (superficie latente) |
| H-05 | Accesibilidad WCAG AA parcial | QA | `legal/accessibility-audit.md:388` 6/10 | **Bajo** (no legal bloqueante) |
| H-06 | `diagnose` pública en middleware pero `auth()` en handler | Seguridad | `middleware.ts:11` vs `diagnose/route.ts:8` | **Bajo** (sin fuga, confusión) |

> Críticas históricas ya resueltas: G-01 autorización art.9/26 (`consent_logs` + `AuthForm` checkbox no pre-marcado) · G-03 `user.deleted` cascade (`webhooks/clerk/route.ts:105`) · G-04 avatar (`validateAvatar` 02fb756) · G-02 service-role guard (`admin.ts:11`) · monitoring hardcode (`monitoring.yml:75` → `${VAR:?}`) · rate-limit (`rate-limit.ts` 247e76a).

## 8. Verificación

| Gate | Comando | Resultado |
|---|---|---|
| Tests | `npm run test` (`vitest run`, `environment: node`) | **223/223 passed** (23 files, 1.16 s) — `legal` + `domain` + `retention` + `assignment` + labs |
| Types | `npm run type-check` (`tsc --noEmit`) | Ver gate CI |
| Build | `npm run build` (`next build`, Turbopack, standalone) | Ver gate CI |
| Assets | `npm run assets:check` (prebuild) | Falla en 1 fixture `dashboard/cientifico-1.svg` viewBox/content mismatch (preexistente, no bloquea auditoría) |

## 9. Referencias cruzadas

- `INVENTARIO_TRATAMIENTO_DATOS.md` — detalle por finalidad F-01..F-08, bases, retención DEFINIDA v1
- `FLUJO_DATOS_Y_PROVEEDORES.md` — diagrama, flujos y fichas P-01..P-11
- `POLITICA_PRIVACIDAD.md` · `POLITICA_GOBERNANZA_IA.md` — borradores publicables
- `MATRIZ_CUMPLIMIENTO_INTERNACIONAL.md` — normas por jurisdicción
- `PLAN_QA.md` · `REGISTRO_RIESGOS.md` · `PLAN_REMEDIACION.md` · `PREGUNTAS_PENDIENTES.md`
- `legal/` (18 auditorías previas F1-F10 + F11) — fuente primaria de esta auditoría integral 2026-10-16

---

*Auditoría técnica 2026-10-16-v1 — sin placeholders, sin datos inventados. Cada hallazgo cita `archivo:línea`. Un nuevo proveedor, nueva cookie o nueva columna `supabase-migration.sql` obliga a re-auditar y versionar.*
