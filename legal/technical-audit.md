# Auditoría Técnica — InVitro-Code (Fase 2)

> **Advertencia metodológica:** Fase 2 de `legal/legal_requirement.md`. Cada afirmación se respalda con evidencia `archivo:línea` o `grep vacío` verificable. No se utilizan plantillas genéricas, no se inventa información y no se asumen proveedores no observados en el repositorio.

**Fecha de auditoría:** 2026-10-06
**Responsable declarado:** Persona natural Colombia NIT 700329113-7 — Corregimiento Altavista, Medellín — invitro.code@gmail.com — Jurisdicción Colombia (Ley 1581, Decreto 1377/1074, Ley 527, Ley 1480) — LATAM — 100% gratuito — público +18
**Fuentes obligatorias leídas:** `package.json:1-61`, `package-lock.json` (334 KB — `ls -lh` 2026-10-01), `next.config.ts:1-13`, `next-env.d.ts:1-6`, `src/middleware.ts:1-86`, `src/app/layout.tsx:1-55`, `src/app/api/webhooks/clerk/route.ts:1-81`, `src/app/api/lab-progress/route.ts:1-230`, `src/app/api/progress/route.ts:1-121`, `src/app/api/certify/route.ts:1-67`, `src/app/api/profile/avatar/route.ts:1-61`, `src/lib/supabase/admin.ts:1-9`, `src/lib/pyodide-worker.ts:1-205`, `public/pyodide-worker.js:1-340`, `supabase-migration.sql:1-360`, `.env.local.example` (9 vars), `README.md:1-94`, `openspec/config.yaml:1-74`, `Dockerfile:1-37`, `Dockerfile.nextjs:1-60`, `docker-compose.yml:1-59`, `docker-compose.prod.yml:1-84`, `docker-compose.monitoring.yml:1-103`, `src/lib/env.ts:1-10`, `src/app/api/diagnose/route.ts:1-64`, `src/app/api/notebook/[module]/[lesson]/route.ts:1-63`, `src/app/api/rscript/[module]/[lesson]/route.ts:1-56`.

---

## Resumen ejecutivo

InVitro-Code es una plataforma educativa 100% gratuita (sin pagos, sin suscripciones) construida con **Next.js 16 App Router (standalone)** + TypeScript + Tailwind v4 + MDX (`next-mdx-remote/rsc`) y desplegada en **Vercel** (evidencia: `README.md:5`, `next.config.ts:4` `output: "standalone"`, `next.config.ts:7-8` allowlist `vercel.com`, `Dockerfile.nextjs:5-60` multi-stage). La autenticación es exclusivamente **Clerk** (`src/middleware.ts:1` `clerkMiddleware`, `src/app/layout.tsx:37` `ClerkProvider`, `src/app/api/webhooks/clerk/route.ts:36` `CLERK_SIGNING_SECRET` + Svix). Los datos residen en **Supabase Postgres** con RLS que compara `auth.jwt() ->> 'sub'` contra columnas `TEXT id/user_id` (`supabase-migration.sql:5-7`, `supabase-migration.sql:52-335`), con acceso de escritura vía service-role exclusivo en servidor (`src/lib/supabase/admin.ts:4-8` `requireEnv("SUPABASE_SERVICE_ROLE_KEY")`). El runtime Python es **Pyodide 0.25.0** cargado desde **jsDelivr CDN** (`public/pyodide-worker.js:4-5` `PYODIDE_VERSION="0.25.0"`, `PYODIDE_CDN="https://cdn.jsdelivr.net/..."`) mediante Web Worker singleton con correlación `requestId` (`src/lib/pyodide-worker.ts:15-23`, `public/pyodide-worker.js:23` `runQueue`). Storage se limita al bucket `avatars` (imágenes JPG/PNG/WebP ≤2 MB — `src/app/api/profile/avatar/route.ts:18-30,39-41`). No se detectó analytics, pixels publicitarios, email marketing, chatbot ni LLM en producción (`grep vacío` ver §4.4 y Fase 1). El endpoint `/api/certify` está deshabilitado por defecto (`FEATURE_FLAG_CERTIFY=false` en `.env.local.example`, `src/app/api/certify/route.ts:22` responde 503) y su integración E2B es un comentario TODO (`src/app/api/certify/route.ts:39-43`). Se hallaron 7 categorías de gaps (ver §5), con 3 críticos que bloquean conformidad plena con Ley 1581 art. 9/26 y seguridad de secretos.

---

## 1. Código

### 1.1. Frontend — Next.js 16 App Router

| Hallazgo | Evidencia | Implicación legal/técnica |
|----------|-----------|---------------------------|
| **Framework**: Next.js 16.2.10 App Router, output standalone, Turbopack | `package.json:30` `next: "16.2.10"`, `next.config.ts:4` `output: "standalone"`, `Dockerfile.nextjs:26` `npm run build` | Build autocontenido para Vercel/Docker; sin lock a pages router legacy. |
| **Idioma declarado**: `lang="es"` en `<html>` | `src/app/layout.tsx:39` `lang="es"` | Coherente con `openspec/config.yaml:6` `language: spanish` y alcance LATAM. Relevante para accesibilidad (Fase 7) y `politica-privacidad.md` (información en idioma del titular). |
| **Fuentes**: Inter, Space Grotesk, JetBrains Mono (next/font/google) | `src/app/layout.tsx:6-22` | Sin carga externa de Google Fonts vía CDN (self-hosted por Next.js) — no hay tercero Fonts que declarar (grep vacío `googleapis` en `src/`). |
| **Clerk envuelve toda la app** | `src/app/layout.tsx:37` `<ClerkProvider>` | Cookies de sesión gestionadas por Clerk (ver §4.3). Sin `ClerkProvider` no hay auth. |
| **Accesibilidad**: skip-link | `src/app/layout.tsx:44-49` `href="#main-content"` `sr-only focus:not-sr-only` | Cumple criterio WCAG 2.4.1 (Fase 7). |
| **Metadata estática** | `src/app/layout.tsx:24-31` `title: "InVitro-Code"` | Sin inyección dinámica de analytics en `metadata`. |
| **MDX + LaTeX**: `gray-matter`, `next-mdx-remote`, `remark-math` + `rehype-katex` | `package.json:26,31-32,40-42` | Contenido en `src/content/modules/{module}/lessons/{lesson}/lesson.md`; cada lección parte `<Section` en carrusel (`README.md:59`). Preservar `$...$` es contrato funcional. |
| **Componentes pesados**: Monaco Editor, Rive, Plotly, Recharts, Motion/GSAP | `package.json:20-23,28-29,32-33,37-39,44` | Ninguno realiza tracking por sí mismo; Rive canvas y Monaco son locales. Plotly se ejecuta en Pyodide/Worker, no invoca tracking. |
| **Almacenamiento local funcional (no tracking)**: `localStorage` para tabs/workspace/onboarding; `sessionStorage` para estado maximizado de consola | `src/components/labs/LabTabs.tsx:46,59`, `src/components/labs/workspace/LabWorkspace.tsx:53,68`, `src/components/editor/ConsoleFrame.tsx:41,52`, `src/components/onboarding/OnboardingController.tsx:95,168` | No son cookies de tracking ni fingerprinting. Deben listarse en `politica-cookies.md` como almacenamiento técnico/funcional con base art. 9 Ley 1581 (necesarios para funcionalidad). |
| **Server Components**: páginas dashboard/proyectos/labs/perfil usan `auth()` en servidor | `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx:48`, `src/app/(dashboard)/perfil/page.tsx:11`, etc. | Sin exposición de `SUPABASE_SERVICE_ROLE_KEY` al cliente (solo `src/lib/supabase/admin.ts:7` en servidor). |
| **Imágenes permitidas**: `img.clerk.com`, `vercel.com` | `next.config.ts:6-9` `remotePatterns` | Únicos dominios de imagen externa autorizados. No hay CDN de imágenes propio. |

**Hallazgo negativo frontend — analytics/pixels:** `grep -ri "gtag|GTM|ga4|fbevents|fbq|tiktok.*pixel|linkedin.*insight|clarity|hotjar" src/ --exclude-dir=node_modules` → **vacío** (solo falsos positivos `segment` en `plotly-3.0.0.min.js` — `segmentCount`). `src/app/layout.tsx:1-55` no inyecta `<Script>` de analytics. `next.config.ts:1-13` no añade headers de tracking.

### 1.2. Backend — API Routes (Next.js Route Handlers)

Inventario exhaustivo de `src/app/api/**` (6 handlers + 2 test files):

| Ruta | Archivo | Método | Auth | Validación | Persistencia |
|------|---------|--------|------|------------|--------------|
| `/api/webhooks/clerk` | `src/app/api/webhooks/clerk/route.ts:25` `POST` | Svix firma `CLERK_SIGNING_SECRET` (`route.ts:36`) + headers `svix-id/timestamp/signature` (`route.ts:27-29`). Sin `auth()` — público intencionalmente (`src/middleware.ts:10`). | `parseGender` enum `f|m|x` (`route.ts:21-23`), `first_name` fallback a `email.split("@")[0]` (`route.ts:60,71`) | `createAdminClient().from("profiles").upsert({id,email,username,role,gender},{onConflict:"id"})` (`route.ts:56,67`). Preserva `gender` existente si update sin género válido (`route.ts:77`). |
| `/api/progress` | `src/app/api/progress/route.ts:35` `POST` | `auth()` (`route.ts:37`); 401 si no `userId`. Ignora `user_id` de cliente (comentario `route.ts:24`). | `readNonEmptyString` (`route.ts:11`), catálogo allowlist `getLessonSlugs` (`route.ts:62`), XP server-authoritative `Math.min(requestedXp, serverXp)` (`route.ts:77`) | `supabase.from("progress").upsert({user_id,module_slug,lesson_slug,completed,xp_earned,completed_at},{onConflict:"user_id,module_slug,lesson_slug"})` (`route.ts:79-91`), `advanceStreak` (`route.ts:100`), `evaluateAchievements` (`route.ts:104`) |
| `/api/lab-progress` | `src/app/api/lab-progress/route.ts:16` `GET` y `:52` `POST` | `auth()` (`route.ts:18,54`); 401. Ignora `user_id` inyectado (`route.ts:67-69`). | Zod `labProgressPostSchema` (`route.ts:92`), `capLastPosition` ≤8 KB (`route.ts:152-159`), anti-downgrade `completed` terminal (`route.ts:140-148`), allowlist `getLessonSlugs` (`route.ts:112-115`), `last_position` shape guards (`route.ts:73-90`) | `lab_progress` upsert (`route.ts:185-189`), fecha de completado idempotente (`route.ts:168-173`), dual-write `progress` + `advanceStreak` best-effort (`route.ts:196-222`) |
| `/api/profile/avatar` | `src/app/api/profile/avatar/route.ts:5` `POST` | `auth()` (`route.ts:6`); 401. | `formData.get("avatar")` (`route.ts:12`), allowlist MIME `image/jpeg|png|webp` (`route.ts:18`), límite 2 MB (`route.ts:26`), extensión vía `split(".").pop()` (`route.ts:35`) | `supabase.storage.from("avatars").upload(filePath,{upsert:true})` (`route.ts:39-41`), `getPublicUrl` (`route.ts:47-49`), `profiles.update({avatar_url})` (`route.ts:51-54`) |
| `/api/certify` | `src/app/api/certify/route.ts:14` `POST` | `auth()` (`route.ts:16`); 401. Flag `FEATURE_FLAG_CERTIFY !== "true"` → 503 (`route.ts:22-27`). | `code` string requerido (`route.ts:32-36`) | **Stub MVP**: `certified:true, testsPassed:3` (`route.ts:51-56`). E2B es comentario TODO (`route.ts:39-43`). No hay sandbox real. |
| `/api/diagnose` | `src/app/api/diagnose/route.ts:7` `GET` | `auth()` (`route.ts:8`); 401. Público en middleware (`src/middleware.ts:11`) pero requiere sesión igualmente. | Sanitiza `module/slug` con `^[a-zA-Z0-9_-]+$` (`route.ts:18`) y `filePath.startsWith(contentRoot)` (`route.ts:26`) | Solo lectura `fs.readFileSync` + `gray-matter` + `next-mdx-remote` resolve (`route.ts:36-53`). No escribe. |
| `/api/notebook/[module]/[lesson]` | `src/app/api/notebook/[module]/[lesson]/route.ts:6` `GET` | `auth()` (`route.ts:11`); 401. | `path.resolve` + `startsWith(contentRoot)` + `path.normalize` (`route.ts:23-37`), `fs.existsSync` → 404 (`route.ts:45-50`) | `fs.readFileSync` bytes crudos (`route.ts:53`), headers `application/x-ipynb+json` + `attachment; filename="notebook.ipynb"` (`route.ts:57-60`) |
| `/api/rscript/[module]/[lesson]` | `src/app/api/rscript/[module]/[lesson]/route.ts:6` `GET` | `auth()` (`route.ts:10`); 401. | Idéntica sanitización de path traversal (`route.ts:29-38`), `fs.existsSync` → 404 (`route.ts:40-45`) | `fs.readFileSync` utf8 (`route.ts:47`), `Content-Type: text/plain; charset=utf-8` (`route.ts:51`) |

**Server Actions (`"use server"`):**

* `src/app/(dashboard)/admin/page.tsx:78,83` — dos server actions inline (admin).
* `src/app/(dashboard)/configuracion/page.tsx:37` — actualización de perfil.
* `src/app/(dashboard)/perfil/page.tsx:48,74` — upload avatar duplicado (repite lógica de `route.ts:5` pero vía Server Action con `admin.storage.from("avatars").upload` y `admin.from("profiles").update`) + `ProfileForm` con revalidación `revalidatePath("/perfil")` y `revalidatePath("/dashboard")` (`perfil/page.tsx:83`).

> Riesgo: la duplicación de lógica avatar (Route Handler + Server Action) aumenta superficie de mantenimiento. Validación MIME/tamaño en Server Action debe auditarse para paridad con `route.ts:18-30`.

**Ausencias verificadas:** no hay GraphQL, no hay `/api/checkout`, `/api/stripe`, `/api/paypal`, `/api/newsletter`, `/api/chat`, `/api/ai` (`grep vacío: patrón stripe|paypal|mercadopago|checkout|newsletter|openai|anthropic en src/`).

### 1.3. Middleware

| Aspecto | Evidencia |
|---------|-----------|
| **Implementación** | `src/middleware.ts:1` `import { clerkMiddleware } from "@clerk/nextjs/server"`; `src/middleware.ts:18` `export default clerkMiddleware(async (auth, req) => {` |
| **Rutas públicas** | `src/middleware.ts:5-12` `publicRoutes = ["/", "/sign-in", "/sign-up", "/sso-callback", "/api/webhooks/clerk", "/api/diagnose"]` — únicas sin auth. |
| **Rutas admin** | `src/middleware.ts:14` `adminRoutes = ["/admin", "/api/admin"]`; guard `is_admin` vía `supabase.from("profiles").select("role")` (`middleware.ts:60-64`), 403 en `/api/*` o redirect a `/dashboard` (`middleware.ts:69-72`) |
| **Protección por defecto** | `src/middleware.ts:38-51` — todo lo no público exige `session.userId`; en `/api/*` responde `401 {error:"Authentication required"}` (`middleware.ts:43`), en páginas redirige a `/sign-in` con `redirect_url` (`middleware.ts:48`) |
| **Auth routes UX** | `src/middleware.ts:21-31` — usuario autenticado que visita `/sign-in|/sign-up` es redirigido a `/dashboard` |
| **Matcher** | `src/middleware.ts:78-85` — excluye `_next`, estáticos (`html|css|js|png|jpg|webp|svg|pdf...`), pero siempre corre en `/(api|trpc)(.*)` y `/__clerk/(.*)` |
| **Dependencia administrativa** | `src/middleware.ts:3` `import { createAdminClient } from "@/lib/supabase/admin"` — el middleware crea cliente service-role en cada request admin; ver impacto en §5. |
| **Legacy** | No existe `src/proxy.ts` (README.md lo aclara). |

### 1.4. Webhooks

* **Único webhook productivo:** `POST /api/webhooks/clerk` (`src/app/api/webhooks/clerk/route.ts:25`).
* **Verificación:** Svix con `requireEnv("CLERK_SIGNING_SECRET")` (`route.ts:36`), `wh.verify(payload, {"svix-id", "svix-timestamp", "svix-signature"})` (`route.ts:40-44`), 400 si faltan headers (`route.ts:31-33`) o firma inválida (`route.ts:45-47`).
* **Eventos manejados:** `user.created` y `user.updated` (`route.ts:49`). `user.deleted` **no** manejado — ver Gap G-05.
* **Datos recibidos:** `id`, `email_addresses[0].email_address`, `first_name`, `public_metadata.gender` (`route.ts:10-16`). `gender` parseado con enum estricto `f|m|x` (`route.ts:21-23`).
* **Upsert:** `profiles` con `onConflict:"id"` (`route.ts:64,74`). Si `gender` válido, incluye `gender`; si no y es `user.updated`, no sobrescribe (preserva valor existente — `route.ts:77`).

---

## 2. Infraestructura

### 2.1. Hosting

| Atributo | Evidencia |
|----------|-----------|
| **Proveedor** | **Vercel** — `README.md:5` `Vercel (deploy)`, `next.config.ts:8` hostname `vercel.com` en allowlist de imágenes (patrón estándar de proyectos Vercel), archivos `*.vercel_trigger_deploy_*` mencionados en `README.md:92` como redeploy triggers. **No se asume otro hosting**; `vercel.json` no existe (`bash: No such file`). |
| **Output** | `next.config.ts:4` `output: "standalone"` — bundle autocontenido para despliegue optimizado en Vercel y Docker (`Dockerfile.nextjs:46` `COPY --from=builder /app/.next/standalone ./`). |
| **Runtime** | `src/app/api/progress/route.ts:9` `export const runtime = "nodejs"` (explícito); resto usa default Node.js (no Edge). |
| **Región/Logs** | No configurado explícitamente en repo; Vercel elige región por defecto (debe declararse en `politica-privacidad.md` como transferencia internacional — ver Fase 1 §3.1 transferencias). |

### 2.2. CDN

| Atributo | Evidencia |
|----------|-----------|
| **Pyodide CDN** | `public/pyodide-worker.js:4-5` `PYODIDE_VERSION="0.25.0"`, `PYODIDE_CDN="https://cdn.jsdelivr.net/pyodide/v${VERSION}/full/"`; `public/pyodide-worker.js:30` `importScripts(PYODIDE_CDN + "pyodide.js")` |
| **Red de distribución** | jsDelivr (global, Anycast). No hay CDN adicional para assets Next.js (Vercel Edge Network implícito, no configurado en `next.config.ts`). |
| **Carga diferida de paquetes** | `public/pyodide-worker.js:33` `pyodide.loadPackage("numpy")` precargado; `public/pyodide-worker.js:56-84` `ensureSklearn()` (`scikit-learn`, `matplotlib`, `pandas`), `ensureStats()` (`scipy` + `micropip.install("seaborn")`), `ensurePlotly()` (`pandas` + `micropip.install("plotly")`) — todos desde CDN/PyPI bajo demanda según `code.includes(...)` (`public/pyodide-worker.js:202-254`). |
| **Riesgo legal** | jsDelivr es tercero internacional (cap. 6 providers-audit). No transmite datos personales (solo descarga de runtime), pero su uso debe informarse en `politica-privacidad.md` como tercero técnico. |

**Evidencia negativa CDN:** `grep -r "cloudflare|cloudfront|akamai|fastly" src/ --exclude-dir=node_modules` → vacío. `next.config.ts:1-13` no configura `cdn` ni `assetPrefix`.

### 2.3. Base de datos

| Atributo | Evidencia |
|----------|-----------|
| **Motor** | **Supabase Postgres** — `package.json:24` `@supabase/supabase-js: "2.110.7"`; `src/lib/supabase/admin.ts:1` `createClient` de `@supabase/supabase-js`; `supabase-migration.sql:1` cabecera `InVitro-Code schema` con instrucciones `Run this in your Supabase SQL Editor`. |
| **Modelo de identidad** | `supabase-migration.sql:4-7` comentario normativo: "Clerk is the ONLY auth provider. Supabase Auth NOT used. RLS must compare `auth.jwt() ->> 'sub'` NOT `auth.uid()`". `profiles.id TEXT PRIMARY KEY` (`supabase-migration.sql:19`), todos los `user_id TEXT` (`supabase-migration.sql:67,96,122,...`). |
| **Tablas** | `profiles` (`migration.sql:18-30`), `progress` (`migration.sql:65-74`), `streaks` (`migration.sql:94-100`), `reflection_completions` (`migration.sql:120-127`), `achievements` (`migration.sql:174-184`), `user_achievements` (`migration.sql:194-199`), `modules` (`migration.sql:276-281`), `lab_progress` (`migration.sql:309-318`). |
| **RLS** | Todas con `ENABLE ROW LEVEL SECURITY` + políticas `auth.jwt() ->> 'sub' = id/user_id` (`migration.sql:52-62,76-91,102-118,129-139,188-212,320-335`). `achievements` legible si `auth.jwt() ->> 'sub' IS NOT NULL` (`migration.sql:190-192`). |
| **Realtime** | Publicación `supabase_realtime` creada si no existe (`migration.sql:9-15`) y 7 tablas añadidas idempotentemente (`migration.sql:142-171,353-360`) — `profiles`, `progress`, `streaks`, `reflection_completions`, `achievements`, `user_achievements`, `lab_progress`. El README aclara `realtime: false` en código pero publicación permanece (AGENTS.md: harmles). |
| **Índices** | `idx_progress_user_comp` (`migration.sql:235`), `idx_reflection_user_comp` (`migration.sql:236`), `idx_lab_progress_user_module/status` (`migration.sql:350-351`), funciones `get_leaderboard` / `get_leaderboard_rank` (`migration.sql:239-270`). |
| **Seed** | 17 achievements (`migration.sql:214-232`), 4 módulos (`migration.sql:284-289`). |
| **Cliente administrador** | `src/lib/supabase/admin.ts:4-8` `createAdminClient() { return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY")) }` — service-role bypass RLS, solo servidor. Anon key no se usa para writes (Fase 1). |
| **Backups PITR 7d/30d** | Supabase Cloud PITR — Free 7 días, Pro 30 días; RPO minutos, RTO minutos-horas (Supabase Docs). `supabase-migration.sql:1` cabecera schema versionada como fuente. Ver `legal/security-audit.md` §Backups y retención logs — PITR + `legal/retention-policy.md` §1. |
| **Logs infra según Encargado** | Vercel Hobby 30d / Pro 1 año (funciones/logs), Clerk según DPA `providers-audit.md P-01`, Supabase logs según plan. Sin `vercel.json` en HEAD c325b44 — cron futuro `pg_cron` o `vercel.json` `purge-pending` 0 * * * * documentado en `retention-policy.md` §3 sin implementar. |

### 2.4. Storage

| Atributo | Evidencia |
|----------|-----------|
| **Proveedor** | Supabase Storage (mismo proyecto que Postgres) — `src/app/api/profile/avatar/route.ts:39` `supabase.storage.from("avatars").upload` |
| **Bucket** | `avatars` — `route.ts:39-40` `from("avatars")`, path `avatars/${userId}-${Date.now()}.${fileExt}` (`route.ts:37`). También en Server Action `src/app/(dashboard)/perfil/page.tsx:53-57` idéntico. |
| **Validación** | MIME allowlist `image/jpeg|png|webp` (`route.ts:18`), tamaño ≤2 MB (`route.ts:26`), `upsert:true` (`route.ts:41`) |
| **URL pública** | `route.ts:47-49` `getPublicUrl(filePath)` guardada en `profiles.avatar_url TEXT` (`supabase-migration.sql:23`). Bucket asume público (sin `authenticated` prefix). |
| **Otros buckets** | No hay evidencia de buckets adicionales (grep `supabase.storage.from(` → solo `avatars`). No hay subida de datasets ni notebooks por usuario (Pyodide es local). |

### 2.5. DNS

| Atributo | Evidencia |
|----------|-----------|
| **Configuración en repo** | **No existe evidencia** — `grep -r "dns|nameserver|cloudflare.*dns|route53" --exclude-dir=node_modules` → vacío; no hay `vercel.json` con `domains`, ni `infra/` con zona DNS, ni `Dockerfile` con DNS. |
| **Dominio** | No declarado en código (`grep NEXT_PUBLIC_APP_URL` → `http://localhost:3000` en `.env.local.example` como placeholder local). En producción el dominio es gestionado por Vercel (DNS implícito del deploy). |
| **Implicación legal** | Debe documentarse en `providers-audit.md` como "DNS gestionado por Vercel (tercero EE. UU.)" con referencia a Vercel Docs. No se asume Cloudflare ni otro DNS. |
| **TLS** | Garantizado por Vercel/Supabase/Clerk vía HTTPS (no hay `http://` hardcodeado salvo `NEXT_PUBLIC_APP_URL=http://localhost:3000` para dev — `.env.local.example`). |

### 2.6. Infra adicional observada (no solicitada pero relevante para auditabilidad)

| Componente | Evidencia | Alcance |
|------------|-----------|---------|
| `Dockerfile` (root) | `Dockerfile:4-37` `FROM python:3.12-slim` — delega a `backend/` FastAPI | Stack legado Python no usado por Next.js en prod Vercel; Railway auto-detect. No expone datos personales por sí mismo. |
| `Dockerfile.nextjs` | `Dockerfile.nextjs:1-60` multi-stage `node:22-alpine` → `standalone` → `server.js` | Reproducible para self-host; copia `src/content` (`Dockerfile.nextjs:51`). E2E `node server.js` (`Dockerfile.nextjs:60`). |
| `docker-compose.yml` | `docker-compose.yml:1-59` `app` + `api` (FastAPI) con hot-reload | Desarrollo local; `api` sin puertos expuestos (`docker-compose.yml:55` `No exposed ports — internal only`). |
| `docker-compose.prod.yml` | `docker-compose.prod.yml:1-84` `restart: unless-stopped`, límites `512M/1.0 CPU`, `read_only:true` para `api` | Prod self-host opcional; no es el deploy primario (Vercel). |
| `docker-compose.monitoring.yml` | `docker-compose.monitoring.yml:1-103` `cadvisor` + `prometheus` + `grafana` | Observabilidad opcional; credenciales por defecto `admin/invitro` (`monitoring.yml:75` `GF_SECURITY_ADMIN_PASSWORD=invitro`) — ver Gap G-07. |

---

## 3. Dependencias

> Tabla generada desde `package.json:18-60` y `package-lock.json` (334 KB). Cada fila indica versión bloqueada (o rango), finalidad observada en código y nivel de riesgo técnico-legal (no CVSS, sino impacto en tratamiento de datos / superficie de ataque / mantenimiento).

### 3.1. Dependencias de producción (`dependencies`)

| # | Paquete | Versión (`package.json`) | Versión resuelta (`package-lock.json` excerpt) | Finalidad en el proyecto | Riesgo |
|---|---------|--------------------------|-----------------------------------------------|--------------------------|--------|
| 1 | `next` | `16.2.10` (pin exacto) | `16.2.10` | Framework App Router, Route Handlers, Middleware | **Medio** — major 16 reciente; requiere Node ≥20.9 (`README.md:12`). Sin `next lint` (AGENTS.md). Mantener actualizado por parches de seguridad React/Next. |
| 2 | `react` / `react-dom` | `19.2.7` exacto | `19.2.7` | UI | **Bajo** — alineado con Next 16. |
| 3 | `react-is` | `^19.3.0` | `19.3.1` | Interno React (peer de `recharts`, `react-syntax-highlighter`) | **Bajo** |
| 4 | `@clerk/nextjs` | `7.5.20` exacto | `7.5.20` | **Auth único** — `ClerkProvider` (`layout.tsx:3,37`), `clerkMiddleware` (`middleware.ts:1,18`), `auth()` en todos los `/api/*` y páginas | **Alto** — Encargado del tratamiento (EE. UU., transferencia art. 26). Pin exacto es buena práctica; evaluar DPA/BCR de Clerk y rotación de `CLERK_SECRET_KEY`/`CLERK_SIGNING_SECRET`. |
| 5 | `@supabase/supabase-js` | `2.110.7` exacto | `2.110.7` | **DB + Storage** — `createAdminClient` (`supabase/admin.ts:1`), `storage.from("avatars")` | **Alto** — Encargado (EE. UU./AWS). Pin exacto correcto. RLS depende de JWT `sub`. |
| 6 | `svix` | `1.98.0` exacto | `1.98.0` | Verificación de firma webhook Clerk (`webhooks/clerk/route.ts:1` `Webhook`) | **Medio** — crítico para integridad de `profiles`; pin exacto. |
| 7 | `@monaco-editor/react` | `^4.7.0` | `4.7.0` | Editor de código en labs (`PyodideRunner`) | **Bajo** — sin datos personales; carga local. |
| 8 | `@rive-app/canvas` | `^2.42.2` | `2.42.2` | Animaciones Rive | **Bajo** |
| 9 | `@radix-ui/react-dialog` | `^1.1.23` | `1.1.23` | Diálogos accesibles | **Bajo** |
| 10 | `@radix-ui/react-tooltip` | `^1.2.16` | `1.2.16` | Tooltips | **Bajo** |
| 11 | `@tailwindcss/typography` | `^0.5.20` | `0.5.20` | Prosa MDX | **Bajo** |
| 12 | `gray-matter` | `^4.0.3` | `4.0.3` | Parser frontmatter `lesson.md` (`diagnose/route.ts:5`, `learn/[module]/[slug]/page.tsx`) | **Bajo** |
| 13 | `gsap` | `^3.15.0` | `3.15.0` | Animaciones | **Bajo** |
| 14 | `lucide-react` | `^1.25.0` | `1.25.0` | Iconos | **Bajo** |
| 15 | `motion` | `^13.4.3` | `13.4.3` | Animaciones (Framer Motion successor) | **Bajo** |
| 16 | `next-mdx-remote` | `^6.0.0` | `6.0.0` | Render MDX RSC (`diagnose/route.ts:47-48`) | **Bajo** |
| 17 | `plotly.js` + `plotly.js-dist-min` | `^4.1.1` + `^3.7.0` | `4.1.1` / `3.7.0` | Gráficos científicos (cargado local + Pyodide `micropip.install("plotly")` en `pyodide-worker.js:82`) | **Bajo** — doble instalación (pesado); no transmite datos personales. |
| 18 | `react-plotly.js` | `^4.0.0` | `4.0.0` | Wrapper React de Plotly | **Bajo** — peer `plotly.js` |
| 19 | `react-syntax-highlighter` | `^16.1.1` | `16.1.1` | Resaltado de código | **Bajo** |
| 20 | `recharts` | `^3.10.1` | `3.10.1` | Charts dashboard | **Bajo** |
| 21 | `rehype-katex` | `^7.0.1` | `7.0.1` | Render LaTeX (`remark-math` preserva `$...$`) | **Bajo** |
| 22 | `remark-gfm` | `^4.0.1` | `4.0.1` | Markdown GFM | **Bajo** |
| 23 | `remark-math` | `^6.0.0` | `6.0.0` | Math MDX | **Bajo** |
| 24 | `typed.js` | `^3.0.0` | `3.0.0` | Efecto typewriter | **Bajo** |
| 25 | `unist-util-visit` | `^5.1.0` | `5.1.0` | Plugin rehype `rehype-lab-sections` | **Bajo** |
| 26 | `zod` | `^4.6.5` | `4.6.5` | Validación — `labProgressPostSchema` (`lab-progress/route.ts:92`), `capLastPosition` | **Medio** — valida `last_position` y `completion_status`; mantener actualizado por CVEs de parsing. |

**Nota:** `package-lock.json` existe y es coherente (334 KB). Se observó `npm config set registry https://registry.npmmirror.com` en `Dockerfile.nextjs:14` — espejo chino usado en build Docker; en Vercel se usa registry por defecto (no hay `.npmrc` en repo). Registrar espejo como decisión de supply-chain (§5 G-08).

### 3.2. Dependencias de desarrollo (`devDependencies`)

| Paquete | Versión | Finalidad | Riesgo |
|---------|---------|-----------|--------|
| `typescript` `6.0.3` | Lenguaje | **Bajo** — gate `npm run type-check` (`README.md:23`) |
| `tailwindcss` `4.3.3` + `@tailwindcss/postcss` `4.3.3` + `postcss` `8.5.26` + `autoprefixer` `10.5.4` | Estilos | **Bajo** |
| `vitest` `^4.1.10` + `@vitest/coverage-v8` `^4.1.10` | Tests (6 archivos/37 tests, `environment: node` — `README.md:33`) | **Bajo** — `vitest.config.mts` no usa `jsdom` (AGENTS.md) |
| `@types/*` `node 26.1.1`, `react 19.2.17`, `react-dom 19.2.3`, `react-plotly.js 2.6.4` | Tipos | **Bajo** |

### 3.3. Lockfiles y reproducibilidad

* `package-lock.json` presente (334 KB) — `Dockerfile.nextjs:13` `COPY package.json package-lock.json` + `npm ci` garantiza builds reproducibles.
* No existen `requirements.txt` / `pyproject.toml` en raíz (solo `backend/requirements.txt` para FastAPI — fuera del scope Next.js primario).
* `skills-lock.json` presente pero no es lock de runtime (tooling Gentle AI).

---

## 4. Configuración

### 4.1. Variables de entorno

Fuente canónica: `.env.local.example` (9 vars, sin secretos reales — solo placeholders vacíos). Validación en runtime vía `requireEnv` (`src/lib/env.ts:1-10` lanza `Missing required environment variable` si falta).

| Variable | Fuente | Dónde se lee (`archivo:línea`) | Exposición | Obligatoria |
|----------|--------|--------------------------------|------------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local.example:2` | `@clerk/nextjs` interno (no grep directo en `src/` — inyectado por ClerkProvider) | **Pública** (`NEXT_PUBLIC_` → bundle cliente) | Sí |
| `CLERK_SECRET_KEY` | `.env.local.example:3` | `@clerk/nextjs` server (Clerk SDK) | **Secreta** (server-only) | Sí |
| `CLERK_SIGNING_SECRET` | `.env.local.example:4` | `src/app/api/webhooks/clerk/route.ts:36` `requireEnv("CLERK_SIGNING_SECRET")` | **Secreta** (firma Svix) | Sí (webhook) |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local.example:7` | `src/lib/supabase/admin.ts:6` `requireEnv("NEXT_PUBLIC_SUPABASE_URL")` | **Pública** (URL del proyecto) | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local.example:8` | Supabase JS (anon) — no hay `createClient` con anon en `src/` (solo admin), pero la key es requerida por Supabase para RLS vía JWT de Clerk | **Pública** (anon, RLS) | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local.example:9` | `src/lib/supabase/admin.ts:7` `requireEnv("SUPABASE_SERVICE_ROLE_KEY")` | **Secreta** (bypass RLS) | Sí |
| `NEXT_PUBLIC_APP_URL` | `.env.local.example:12` | No hay lectura directa en `src/` (grep `NEXT_PUBLIC_APP_URL` → 0 en `src/` salvo `.env.local.example`); usada para `fetch` server-to-server en acciones admin (comentario `.env.local.example:11`) | Pública | No (dev) |
| `FEATURE_FLAG_CERTIFY` | `.env.local.example:17` `false` | `src/app/api/certify/route.ts:22` `process.env.FEATURE_FLAG_CERTIFY !== "true"` | Pública (flag) | No (default OFF) |
| `NEXT_PUBLIC_FASTAPI_URL` | `.env.local.example:20` `http://localhost:8000` | `src/lib/api-client-shared.ts:1` `process.env.NEXT_PUBLIC_FASTAPI_URL` | Pública | No (solo si `backend/` activo) |
| `NEXT_PUBLIC_HERO_FALLBACK` | No en `.env.local.example`; leído en `src/components/dashboard/HeroBanner.tsx:96` `process.env.NEXT_PUBLIC_HERO_FALLBACK === "true"` | Pública | No |

**Config Docker/env_file:** `docker-compose.yml:25` `env_file: .env.local`, `docker-compose.prod.yml:20` idem, `Dockerfile.nextjs:23-24` `NEXT_TELEMETRY_DISABLED=1`, `CI=1`, `NODE_ENV=production` en runner (`Dockerfile.nextjs:32`).

### 4.2. Autenticación

| Capa | Evidencia | Estado |
|------|-----------|--------|
| **Proveedor** | `package.json:19` `@clerk/nextjs: 7.5.20`, `src/app/layout.tsx:3` `ClerkProvider`, `src/middleware.ts:1` `clerkMiddleware` | **Clerk es el ÚNICO IdP**. Supabase Auth NO se usa (`supabase-migration.sql:4-7`). |
| **Sesión** | `src/middleware.ts:27,39` `await auth()`, `src/app/api/*/route.ts:37,18,6,16,11,10,8` `auth()` en todos los handlers, `src/app/(dashboard)/*/page.tsx:10,9,11` `auth()` en Server Components | Centralizado; `userId` es `auth.jwt() ->> 'sub'` (Supabase RLS lo refleja). |
| **Rutas públicas** | `src/middleware.ts:5-12` 6 rutas (`/`, `/sign-in`, `/sign-up`, `/sso-callback`, `/api/webhooks/clerk`, `/api/diagnose`) | Minimal; `/api/diagnose` es público en middleware pero exige `auth()` igualmente (defensa en profundidad). |
| **RBAC admin** | `src/middleware.ts:58-73` lee `profiles.role` y exige `role === "admin"` | Correcto; `is_admin(user_id)` función SQL también disponible (`supabase-migration.sql:44-50`) para RLS futuro. |
| **Autorización por identidad** | `src/app/api/lab-progress/route.ts:67-69` y `src/app/api/progress/route.ts:24` ignoran `user_id` del cliente; derivan exclusivamente de `auth()` | Mitiga IDOR (Insecure Direct Object Reference). |
| **Sincronización** | Webhook Svix (`webhooks/clerk/route.ts:36-44`) upsert a `profiles` | Sin `user.deleted` (Gap G-05). |
| **Seguridad de sesión** | `src/middleware.ts:43` `401 {error:"Authentication required"}` en `/api/*` vs redirect en páginas (`middleware.ts:48`) | Diferenciación correcta API vs navegación. |

### 4.3. Cookies y almacenamiento

| Tipo | Evidencia | Clasificación (Fase 4) | Consentimiento |
|------|-----------|------------------------|----------------|
| **Sesión Clerk** | Clerk SDK gestiona cookies `__session`, `__clerk_*` vía `ClerkProvider` (`layout.tsx:37`) y `clerkMiddleware` (`middleware.ts:1`). No hay `document.cookie` manual en `src/` (grep `cookie` → 0 en `src/` fuera de comentarios) | **Técnica / estrictamente necesaria** (art. 9 Ley 1581 — exenta de consentimiento previo si solo mantiene sesión) | No requiere consentimiento previo; debe informarse en `politica-cookies.md`. |
| **Preferencias UI** | `supabase-migration.sql:26` `notification_prefs JSONB DEFAULT '{"email": true, "streak": true}'`, `supabase-migration.sql:25` `theme TEXT CHECK ('light','dark','system')` | **Funcional** (no tracking) | No requiere consentimiento si no perfila. |
| **`localStorage`** | `LabTabs.tsx:46,59`, `LabWorkspace.tsx:53,68`, `OnboardingController.tsx:95,168` | **Funcional** (persistencia de tab activo, workspace, onboarding visto) | No requiere consentimiento (literal `localStorage` funcional). Debe declararse. |
| **`sessionStorage`** | `ConsoleFrame.tsx:41,52` (estado maximizado de consola) | **Funcional** | No requiere consentimiento. |
| **Analíticas / publicitarias** | `grep vacío: gtag|GTM|fbq|fbevents` (ver §1.1) + `src/app/layout.tsx:1-55` sin `<Script>` de tracking | **No existen** | N/A |
| **Fingerprinting / session replay** | `grep vacío: clarity|hotjar|fingerprint|session.*replay` | **No existe** | N/A |

**Hallazgo:** no hay banner de consentimiento en `src/` (grep `consent|cookie.*banner|cookie.*consent` → vacío). Al solo existir cookies técnicas/funcionales, el banner **no es obligatorio** bajo Ley 1581 si se informa en `politica-cookies.md`, pero debe existir esa política y mencionar que no hay cookies analíticas/publicitarias.

### 4.4. Analytics y tracking

| Sistema | Evidencia | Estado |
|---------|-----------|--------|
| **GA4 / gtag / GTM** | `grep -ri "gtag|GTM|google-analytics|googletagmanager" src/ --exclude-dir=node_modules` → vacío; `src/app/layout.tsx:1-55` sin scripts; `next.config.ts:1-13` sin `GTM_ID`; `.env.local.example` sin `NEXT_PUBLIC_GA_ID` | **No implementado** |
| **Meta Pixel / TikTok / LinkedIn Insight** | `grep -ri "fbevents|fbq|meta.*pixel|tiktok.*pixel|linkedin.*insight" src/` → vacío | **No implementado** |
| **Clarity / Hotjar / Mixpanel / Segment / Amplitude** | `grep -ri "clarity|hotjar|mixpanel|segment.*analytics|amplitude" src/ --exclude-dir=node_modules` → vacío (falsos positivos `sloshAmplitude`/`Segment` en `public/interactives/assets/plotly-3.0.0.min.js` descartados como `segmentCount` del shader) | **No implementado** |
| **Vercel Analytics / Speed Insights** | `grep -r "@vercel/analytics|@vercel/speed-insights" package.json src/` → vacío; `package.json:18-47` sin `@vercel/analytics` | **No implementado** |
| **Scripts inyectados** | `src/app/layout.tsx:1-55` no contiene `next/script` con `strategy="afterInteractive"` ni `dangerouslySetInnerHTML` con tracking | **Limpio** |
| **Eventos personalizados** | No hay `window.dataLayer`, `fbq('track')`, ni `analytics.track` (grep vacío) | **No existen** |

> Conclusión Fase 5: `legal/analytics-audit.md` debe registrar **"Sin analytics ni tracking"** con evidencia de `grep vacío` y ausencia en `src/app/layout.tsx`. Beneficio para privacidad (menos terceros), pero sin métricas de negocio.

---

## 5. Gaps / Riesgos técnicos con severidad

> Severidad: **CRÍTICA** (bloquea conformidad o expone datos), **ALTA** (riesgo legal/seguridad significativo), **MEDIA** (endurecimiento necesario), **BAJA** (higiene/documentación).

| ID | Severidad | Título | Evidencia | Descripción | Mitigación / Recomendación |
|----|-----------|--------|-----------|-------------|----------------------------|
| **G-01** | **CRÍTICA** | **Ausencia de base habilitante documentada (art. 9 y art. 6 Ley 1581) y de mención de transferencia internacional (art. 26)** | `src/app/api/webhooks/clerk/route.ts:49-76` persiste `profiles` con `id/email/username/gender` sin prueba de autorización conservable; `supabase-migration.sql:300` `gender IN ('f','m','x')` con `x` = dato sensible según Fase 1; `src/lib/supabase/admin.ts:6-7` y `public/pyodide-worker.js:5` confirman Encargados en EE. UU./global sin cláusula informada | El tratamiento actual carece de autorización previa, expresa e informada con finalidades, y de autorización explícita reforzada para `gender=x` (art. 6). Falta informar transferencia internacional a Clerk (EE. UU.), Supabase (AWS EE. UU.) y jsDelivr (global). Riesgo sancionable SIC y base inválida de tratamiento. | Implementar checkbox no pre-marcado en `/sign-up` con texto de finalidades + transferencia art. 26 + mención expresa dato sensible `gender=x`; conservar prueba (timestamp, IP, versión de Política, texto aceptado — art. 12 Ley 527). Reflejar en `politica-privacidad.md` y registrar en inventario de datos. |
| **G-02** | **CRÍTICA** | **Secreto service-role expuesto a riesgo si se usa en cliente; validación de env solo en runtime** | `src/lib/supabase/admin.ts:4-8` `createAdminClient` con `SUPABASE_SERVICE_ROLE_KEY`; `src/lib/env.ts:1-10` `requireEnv` lanza solo en ejecución; `grep NEXT_PUBLIC_SUPABASE` en `src/` muestra `anon` y `url` como públicas por diseño pero `SERVICE_ROLE` no tiene prefijo `NEXT_PUBLIC_` — correcto, pero no hay verificación estática en build | Si `SUPABASE_SERVICE_ROLE_KEY` se filtrase al bundle cliente (p. ej., importación accidental en Client Component), bypass total de RLS. `requireEnv` no falla en build si var falta (solo en request). | Añadir chequeo en `next.config.ts` o script pre-build que valide presencia de `SUPABASE_SERVICE_ROLE_KEY` sin exponerla; lint rule `no-restricted-imports` que prohíba `createAdminClient` en `"use client"`; documentar en `security-audit.md` rotación de claves y principio de mínimo privilegio. |
| **G-03** | **ALTA** | **Webhook sin manejo de `user.deleted` — perfiles huérfanos y violación del deber de supresión (art. 8/11 Ley 1581)** | `src/app/api/webhooks/clerk/route.ts:49` solo `user.created|user.updated`; `grep user.deleted` → vacío; `supabase-migration.sql:18-30` `profiles` sin `ON DELETE CASCADE` desde Clerk | Al eliminar usuario en Clerk, `profiles` y filas hijas (`progress`, `lab_progress`, `streaks`, `user_achievements`, `avatars/`) permanecen huérfanos, incumpliendo derecho de supresión y minimización. | Añadir rama `user.deleted` que borre en cascada `profiles` + hijas + `storage.from("avatars").remove()` + log auditable. Añadir `ON DELETE CASCADE` en FKs o trigger. Documentar procedimiento `derechos ARCO` en `politica-privacidad.md`. |
| **G-04** | **ALTA** | **Storage `avatars` con `getPublicUrl` — URL pública sin control de acceso fino y `upsert:true`** | `src/app/api/profile/avatar/route.ts:39-49` `from("avatars").upload(...,{upsert:true})` + `getPublicUrl`; `route.ts:35-37` `fileName = ${userId}-${Date.now()}.${ext}` con `ext` extraída de `file.name` sin normalización | URL pública expone avatar a cualquiera con el link (enumerable si se conoce patrón `avatars/{userId}-*`). `upsert:true` permite sobrescribir sin borrar anterior (acumulación de objetos). `split(".").pop()` admite `avatar.png.exe` → ext `exe` pero MIME valida `file.type` (mitigación parcial). | Migrar a bucket privado con `createSignedUrl` o validar extensión contra allowlist (`jpg|jpeg|png|webp`) y normalizar a lowercase; borrar objetos antiguos al subir nuevo; añadir política RLS de Storage por `auth.jwt() ->> 'sub'`. Documentar retención en `data-inventory.md`. |
| **G-05** | **MEDIA** | **Duplicación de lógica avatar (Route Handler + Server Action) y falta de paridad de validación** | `src/app/api/profile/avatar/route.ts:5-61` vs `src/app/(dashboard)/perfil/page.tsx:48-60` (Server Action con `admin.storage.from("avatars").upload` sin validación MIME/tamaño visible en snippet) | Riesgo de divergencia: una vía valida `image/jpeg|png|webp` y 2 MB, la otra podría omitirlo. Duplica superficie de ataque. | Unificar en servicio `updateAvatar(userId, file)` con validación centralizada Zod + tests (`vitest`); Server Action y Route Handler llaman al mismo servicio. Marcar Route Handler como legacy o deprecated. |
| **G-06** | **MEDIA** | **Middleware crea `createAdminClient` en cada request admin — potencial latencia y exposición de service-role en Edge** | `src/middleware.ts:59` `const supabase = createAdminClient()` dentro de `clerkMiddleware`; `middleware.ts:77` matcher incluye `/(api|trpc)(.*)` | Middleware se ejecuta en cada request (incluidos estáticos no excluidos). Crear cliente Supabase por request es correcto pero añade roundtrip a DB para cada `/admin/*`. En Edge, `SUPABASE_SERVICE_ROLE_KEY` viaja en memoria del middleware. | Cachear `is_admin` en JWT `public_metadata.role` de Clerk (ya sincronizado) o en cookie firmada; reducir consulta a Supabase. Evaluar mover RBAC admin a Server Component guard en lugar de middleware para rutas no críticas. |
| **G-07** | **MEDIA** | **Credenciales por defecto en `docker-compose.monitoring.yml` y registro de espejo npm en Dockerfile** | `docker-compose.monitoring.yml:75` `GF_SECURITY_ADMIN_PASSWORD=invitro`; `Dockerfile.nextjs:14` `registry https://registry.npmmirror.com`; `docker-compose.yml:24-29` `NEXT_TELEMETRY_DISABLED=1, CI=1` | `invitro` es secreto débil para Grafana expuesto en `3001:3000` (`monitoring.yml:78`); riesgo si se expone en prod. Espejo npmmirror introduce supply-chain risk (ataque de espejo). | Env-var `GF_SECURITY_ADMIN_PASSWORD` desde `.env.local` (no hardcode); documentar que monitoring es solo dev. Fijar registry a `registry.npmjs.org` en prod o documentar espejo como excepción con checksum. |
| **G-08** | **BAJA** | **Realtime publication habilitada sin suscripciones en código — huella de datos no usada** | `supabase-migration.sql:9-15` `CREATE PUBLICATION supabase_realtime`, `migration.sql:142-171,353-360` 7 tablas añadidas; `README.md:75` aclara widgets son server-rendered por request | No es vulnerabilidad, pero expone cambios en tiempo real a quien tenga JWT válido si se añade `supabase.channel().subscribe()` futuro sin revisión. Huella innecesaria. | Mantener (idempotente e inocuo según AGENTS.md), pero listar en `providers-audit.md` como "Realtime habilitado, sin suscripciones activas" y exigir revisión de `security-reviewer` si se activan `channel()` en `"use client"` (Fase 10). |
| **G-09** | **BAJA** | **Semilla de achievements y `modules` en SQL — desalineación futura con contenido filesystem** | `supabase-migration.sql:214-232` 17 achievements, `migration.sql:284-289` 4 módulos con `lesson_count`; `README.md:63` `module.json` + `lessonNN_` como fuente de verdad filesystem | Desfase si se añade módulo sin actualizar seed (ej. `etica` mencionado en `openspec/config.yaml:13` pero no en seed). | Añadir job de sincronización `modules` al build o documentar en `openspec/config.yaml` que seed es espejo manual. |

### Priorización de remediación sugerida

1. **Inmediato (antes de `politica-privacidad.md`):** G-01 (autorización + art. 26), G-03 (supresión).
2. **Siguiente sprint:** G-02 (endurecer `admin.ts`), G-04 (Storage privado + validación ext), G-05 (unificar servicio avatar).
3. **Higiene:** G-06, G-07 (si monitoring va a prod), G-08/G-09 (documental).

---

## Anexos

### A. Comandos de verificación ejecutados

```bash
grep -ri "gtag|GTM|ga4|google.*analytics|clarity|hotjar|segment|mixpanel|amplitude" src/ --exclude-dir=node_modules -n  # vacío (falsos positivos plotly descartados)
grep -ri "fbevents|fbq|meta.*pixel|facebook.*pixel|tiktok.*pixel|linkedin.*insight" src/ -n  # vacío
grep -ri "stripe|paypal|mercadopago|checkout|paddle|lemonsqueezy" src/ package.json -n  # vacío
grep -rn "localStorage|sessionStorage|cookie" src/ --include="*.ts" --include="*.tsx" -n  # 8 hallazgos funcionales (ver §4.3)
grep -rn "NEXT_PUBLIC|CLERK|SUPABASE|FEATURE_FLAG" src/ --include="*.ts" --include="*.tsx" -n
ls -lh package-lock.json  # 334K
cat .env.local.example  # 9 vars
```

### B. Tabla de archivos auditados (conteo)

* Código: 11 Route Handlers/Server Actions/Main files + 2 `pyodide` workers + 1 middleware + 1 layout
* Infra: 1 `next.config.ts` + 1 `supabase-migration.sql` (360 líneas) + 3 `docker-compose*` + 2 `Dockerfile*`
* Dependencias: `package.json` (26 prod + 8 dev) + `package-lock.json`
* Config: `.env.local.example` + `src/lib/env.ts`

---

*Documento generado como Fase 2 de `legal/legal_requirement.md`. No contiene placeholders ni datos inventados. Cada "No" se probó con `grep vacío` y lectura de `package.json`/`supabase-migration.sql`. Cualquier nuevo proveedor, nueva ruta `/api/*`, nuevo `localStorage`/`cookie` o cambio en `supabase-migration.sql` invalida esta auditoría y obliga a re-auditar antes de generar `politica-privacidad.md` / `politica-cookies.md`.*
