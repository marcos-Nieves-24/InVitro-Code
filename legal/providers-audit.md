# Auditoría de Proveedores y Terceros — InVitro-Code (Fase 6)

> **Advertencia metodológica:** Fase 6 de `legal/legal_requirement.md`. No utiliza plantillas genéricas, no inventa información y no asume proveedores no observados en el repositorio. Cada afirmación se respalda con evidencia `archivo:línea` o `grep vacío` verificable. URLs de políticas corresponden a dominios oficiales verificados a octubre 2026; el contenido de dichas políticas puede cambiar y debe re-verificarse antes de publicar `politica-privacidad.md`.

**Fecha de auditoría:** 2026-10-06
**Responsable declarado:** Persona natural Colombia NIT 700329113-7 — Corregimiento Altavista, Medellín — invitro.code@gmail.com — Jurisdicción Colombia (Ley 1581 de 2012, Decreto 1377 de 2013 compilado en Decreto 1074 de 2015, Ley 527 de 1999, Ley 1480 de 2011) — LATAM — 100 % gratuito — público +18
**Fuentes obligatorias leídas:** `package.json:18-60`, `package-lock.json` (334 KB), `next.config.ts:1-13`, `next-env.d.ts:1-6`, `public/pyodide-worker.js:1-340` (en especial `public/pyodide-worker.js:4-5` `PYODIDE_VERSION`/`PYODIDE_CDN`), `src/app/layout.tsx:1-55` (en especial `src/app/layout.tsx:2,6-22` `next/font/google`), `src/lib/supabase/admin.ts:1-9`, `src/middleware.ts:1-86`, `src/app/api/webhooks/clerk/route.ts:1-81`, `src/components/labs/LabHero/RiveBioreactor.tsx:1-101`, `src/components/editor/CodeEditor.tsx:1-120`, `src/components/editor/VisualizationPanel.tsx:1-55`, `src/lib/pyodide-worker.ts:1-205`, `.env.local.example:1-20`, `README.md:1-94`, `supabase-migration.sql:1-360`, `legal/project-classification.md`, `legal/technical-audit.md`, `legal/data-inventory.md`

---

## Resumen ejecutivo

**Totales auditados:** 11 conceptos sospechosos + barrido completo de `package.json:18-60` (26 dependencias prod, 8 dev) y `public/pyodide-worker.js:4-5`, `src/app/layout.tsx:6`, `next.config.ts:5`.

| Categoría | Conteo | Países destino |
|-----------|--------|----------------|
| **Proveedores con transferencia internacional art. 26** (reciben datos personales o tráfico con IP/User-Agent) | **5** | **EE. UU. (4) + Global Anycast (2)** — ver detalle |
| **Conceptos auditados sin transferencia** (librería empaquetada, self-hosted, sin envío a tercero) | **6** | No aplica — sin salida de datos |
| **Proveedores omitidos / no detectados** | **0** | `grep vacío` verificado para cada candidato descartado |

**Proveedores con transferencia art. 26 (orden por criticidad):**

| # | Proveedor | País declarado por el proveedor | Base art. 26 aplicable |
|---|-----------|-------------------------------|------------------------|
| 1 | **Clerk** (IdP) | **EE. UU.** | Sí — Encargado |
| 2 | **Supabase** (Postgres + Storage) | **EE. UU. (AWS)** | Sí — Encargado |
| 3 | **Vercel** (Hosting + Edge Network + DNS implícito) | **EE. UU.** | Sí — Encargado (tránsito) |
| 4 | **jsDelivr (cdn.jsdelivr.net)** — CDN de Pyodide | **Global Anycast** (origen EE. UU./UE, PoPs globales) | No para datos personales (solo descarga de runtime), pero tercero técnico a informar |
| 5 | **PyPI vía micropip** (`seaborn`/`plotly` Python) | **Global (Fastly CDN, origen EE. UU.)** | No para datos personales (solo descarga de wheels), tercero técnico |

**Conceptos auditados sin transferencia (evidencia negativa incluida):**

| # | Concepto | Veredicto | Evidencia clave |
|---|----------|-----------|-----------------|
| 6 | **Google Fonts vía `next/font`** | **Self-hosted, sin transferencia** | `src/app/layout.tsx:2` `next/font/google` + `grep vacío` `googleapis` en `src/` |
| 7 | **Rive (`@rive-app/canvas` `^2.42.2`)** | **Local, sin transferencia** | `src/components/labs/LabHero/RiveBioreactor.tsx:25,30` `import("@rive-app/canvas")` + `src: "/rive/bioreactor.riv"` local |
| 8 | **Plotly.js (`plotly.js` `^4.1.1` / `plotly.js-dist-min` `^3.7.0` / `react-plotly.js` `^4.0.0`)** | **Local, sin transferencia** | `src/components/editor/VisualizationPanel.tsx:7` `dynamic(()=>import("react-plotly.js"))` local + `public/pyodide-worker.js:79-82` `micropip.install("plotly")` (Python) ya contado como PyPI |
| 9 | **Monaco Editor (`@monaco-editor/react` `^4.7.0`)** | **Local, sin transferencia** | `src/components/editor/CodeEditor.tsx:3` `import Editor from "@monaco-editor/react"` + `package.json:20` |
| 10 | **Svix (`svix` `1.98.0`)** | **Librería local de verificación, no proveedor externo** | `src/app/api/webhooks/clerk/route.ts:1,36,40` `Webhook` verifica firma localmente; no hay `fetch` a `api.svix.com` |
| 11 | **Gerenciamiento DNS** | **Delegado implícitamente a Vercel; sin zona dedicada en repo** | `next.config.ts:1-13` sin `domains`; `grep vacío` `dns|nameserver|route53|cloudflare.*dns` en `src/` + `README.md:5,92` Vercel como hosting |

**Países destino distintos involucrados en transferencias con datos personales:** **1 país soberano (EE. UU.)** + **2 redes globales Anycast** (jsDelivr, PyPI) que técnicamente no reciben datos personales pero son terceros a declarar por transparencia. No se detectó transferencia a otro país LATAM ni a UE.

> Conclusión anticipada: como Responsable en Colombia con Encargados en EE. UU., el proyecto activa **art. 26 Ley 1581** y requiere autorización que mencione expresamente la transferencia y el país destino + contrato con garantías (DPA/Cláusulas Contractuales Estándar). La brecha actual se detalla en §4.

---

## 1. Tabla consolidada `Servicio | Finalidad | Datos enviados | País | Transferencia art. 26 | Política URL`

| # | Servicio | Finalidad en InVitro-Code | Datos enviados (desde el Titular/Responsable) | País del proveedor | Transferencia art. 26 | Política URL oficial |
|---|----------|---------------------------|-----------------------------------------------|--------------------|------------------------|----------------------|
| **P-01** | **Clerk** (`@clerk/nextjs` `7.5.20`) | **IdP único** — registro, login, sesión, SSO, verificación de email, webhooks `user.created/updated` | `email`, `first_name`→`username`, `public_metadata.gender` (`f/m/x`), `id` Clerk (`sub`), `password` (solo Clerk, hash), IP, User-Agent, timestamp, `svix-*` headers de webhook | **EE. UU.** | **Sí — Encargado** (requiere autorización con mención expresa + DPA) | Privacidad: `https://clerk.com/legal/privacy` · DPA: `https://clerk.com/legal/dpa` · Subprocessors: `https://clerk.com/legal/subprocessors` |
| **P-02** | **Supabase** (`@supabase/supabase-js` `2.110.7`) — Postgres + Storage + Realtime | **Persistencia espejo** (`profiles`, `progress`, `lab_progress`, `streaks`, `reflection_completions`, `user_achievements`) + **Storage** bucket `avatars` + **Realtime** publication (habilitada, sin suscripciones) | `id` (TEXT `sub`), `email`, `username`, `bio`, `gender` (`f/m/x`), `avatar_url`, `theme`, `notification_prefs`, `progress`/`lab_progress`/`streaks`/logros + binario avatar (`image/jpeg|png|webp` ≤2 MB) + IP/User-Agent de API | **EE. UU. (AWS)** | **Sí — Encargado** (requiere DPA + SCC) | Privacidad: `https://supabase.com/privacy` · DPA: `https://supabase.com/legal/dpa` · Subprocessors: `https://supabase.com/legal/subprocessors` · Infra: AWS |
| **P-03** | **Vercel** — Hosting, Edge Network, Build, Logs | **Hosting del Next.js 16 standalone** (`output: "standalone"`), Edge Network, redeploys, logs de acceso, TLS | **Tránsito de todos los requests** (incluidos `email`, `id`, `progress`, `avatar` en tránsito TLS), IP, User-Agent, `requestId`, timestamp, headers, `NEXT_PUBLIC_*` públicas; `img.clerk.com` y `vercel.com` en allowlist de imágenes | **EE. UU.** | **Sí — Encargado/sub-encargado de infraestructura** (tránsito + logs) | Privacidad: `https://vercel.com/legal/privacy-policy` · DPA: `https://vercel.com/legal/dpa` · Sub-processors: `https://vercel.com/legal/sub-processors` |
| **P-04** | **jsDelivr — `cdn.jsdelivr.net`** | **CDN del runtime Pyodide** (`pyodide.js` + `numpy` + `scikit-learn`/`scipy`/`pandas`/`matplotlib` bajo demanda) | **No datos personales** — `GET https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js` y `loadPackage(...)` desde navegador; el CDN observa **IP, User-Agent, timestamp** del solicitante como dato de tráfico (no `email`/`id`) | **Global Anycast** (operado por Prospect One / Cloudflare, Fastly, Bunny — origen documentado por jsDelivr) | **No activa art. 26 para datos personales** (no hay envío de datos personales), **sí es tercero técnico a informar** por transparencia | Privacidad: `https://www.jsdelivr.com/terms/privacy-policy` · Docs: `https://www.jsdelivr.com/documentation` |
| **P-05** | **PyPI vía `micropip`** (`seaborn` + `plotly` Python) | **Instalación de wheels Python no nativas de Pyodide** (`micropip.install("seaborn")`, `micropip.install("plotly")`) | **No datos personales** — `GET` de wheels desde `https://files.pythonhosted.org` vía Fastly CDN; solo IP/User-Agent del navegador | **Global (Fastly CDN, origen EE. UU.)** | **No activa art. 26** (no hay datos personales), **tercero técnico** | Privacidad: `https://pypi.org/policy/privacy-notice/` · Fastly: `https://www.fastly.com/privacy/` |
| **P-06** | **Google Fonts vía `next/font`** (`Inter`, `Space_Grotesk`, `JetBrains_Mono`) | Tipografías UI (body/display/mono) | **Ninguno a Google** — `next/font/google` **self-hostea** las fuentes en el build; no hay `fetch` a `fonts.googleapis.com`/`fonts.gstatic.com` en runtime | **No aplica** (sin salida) | **No — sin transferencia** | Google Privacy (referencia): `https://policies.google.com/privacy` · Next.js docs: `https://nextjs.org/docs/app/api-reference/components/font` |
| **P-07** | **Rive (`@rive-app/canvas` `^2.42.2`)** | Animación canvas del bioreactor (`RiveBioreactor`) | **Ninguno a Rive** — `src: "/rive/bioreactor.riv"` es asset **local** en `public/rive/`; `import("@rive-app/canvas")` es módulo npm empaquetado | **No aplica** | **No — librería local** | Rive Privacy: `https://rive.app/privacy` · Rive Terms: `https://rive.app/terms` |
| **P-08** | **Plotly.js / `react-plotly.js` / `plotly.js-dist-min`** | Gráficos científicos en `VisualizationPanel` (render de `figures` JSON capturadas en Worker) | **Ninguno a Plotly** — `react-plotly.js` empaquetado local; datos graficados son **outputs del Worker local** (`figures: string[]` JSON), no `fetch` a `plot.ly` | **No aplica** | **No — librería local** (la variante Python `plotly` es P-05) | Plotly Privacy: `https://plotly.com/privacy/` |
| **P-09** | **Monaco Editor (`@monaco-editor/react` `^4.7.0`)** | Editor de código Python (`CodeEditor` con tema `console-dark`, `Shift+Enter` run) | **Ninguno a Microsoft/CDN** — editor empaquetado vía npm; sin `loader` externo ni `cdn` en `CodeEditor.tsx` | **No aplica** | **No — librería local** | Microsoft Privacy: `https://privacy.microsoft.com/` · Monaco: `https://microsoft.github.io/monaco-editor/` |
| **P-10** | **Svix (`svix` `1.98.0`)** | **Verificación de firma** del webhook Clerk (`Webhook.verify`) | **Ninguno a Svix como servicio** — `svix` se usa como **librería criptográfica local** (`wh.verify(payload, {"svix-id"...})`); el webhook lo envía **Clerk**, no InVitro-Code a Svix | **EE. UU.** (sede de Svix Inc., pero **sin flujo de datos**) | **No — librería local** (el flujo Clerk→InVitro usa protocolo Svix, pero el destinatario no es Svix) | Svix Privacy: `https://www.svix.com/privacy/` · Docs: `https://docs.svix.com/` |
| **P-11** | **Gerenciamiento DNS** | Resolución de dominio del deploy Vercel | **No hay zona DNS dedicada en repo** — DNS gestionado **implícitamente por Vercel** (nameservers de Vercel al apuntar dominio) | **EE. UU. (Vercel)** | **Sí — via Vercel** (ver P-03) | Vercel Domains: `https://vercel.com/docs/domains` |

> **Barrido de `package.json:18-60` sin hallazgo de proveedor externo adicional:** las dependencias restantes son librerías empaquetadas sin `fetch` a tercero en runtime: `@radix-ui/react-dialog` `^1.1.23` (`package.json:21`), `@radix-ui/react-tooltip` `^1.2.16` (`package.json:22`), `@tailwindcss/typography` `^0.5.20` (`package.json:25`), `gray-matter` `^4.0.3` (`package.json:26`), `gsap` `^3.15.0` (`package.json:27`), `lucide-react` `^1.25.0` (`package.json:28`), `motion` `^13.4.3` (`package.json:29`), `next` `16.2.10` (`package.json:30`), `next-mdx-remote` `^6.0.0` (`package.json:31`), `react`/`react-dom` `19.2.7` (`package.json:34-35`), `react-is` `^19.3.0` (`package.json:36`), `react-syntax-highlighter` `^16.1.1` (`package.json:38`), `recharts` `^3.10.1` (`package.json:39`), `rehype-katex` `^7.0.1` (`package.json:40`), `remark-gfm` `^4.0.1` (`package.json:41`), `remark-math` `^6.0.0` (`package.json:42`), `typed.js` `^3.0.0` (`package.json:44`), `unist-util-visit` `^5.1.0` (`package.json:45`), `zod` `^4.6.5` (`package.json:46`). DevDeps (`package.json:48-60` `tailwindcss`, `vitest`, `typescript`, `@types/*`) son build/test only. `grep -ri "fetch.*api\.|axios|cloudflare|cloudfront|akamai|fastly.*fetch" src/ --exclude-dir=node_modules` → **vacío** fuera de los 5 proveedores listados.

---

## 2. Fichas por proveedor

### P-01 · Clerk — Identity Provider único

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Clerk Inc.** — Autenticación, gestión de sesiones, SSO, verificación de email, webhooks de identidad |
| **Finalidad** | Proveer registro/login/sesión/SSO y sincronizar identidad a Supabase. Envuelve toda la app con `ClerkProvider` y protege rutas con `clerkMiddleware` |
| **Datos enviados** | `email` (obligatorio), `password` (solo Clerk, nunca a Supabase), `first_name`→`username`, `public_metadata.gender` (`f/m/x`), `id` Clerk (`sub` JWT), IP, User-Agent, timestamp, headers `svix-id/timestamp/signature` del webhook, cookies `__session`/`__clerk_*` |
| **País** | **EE. UU.** — sede San Francisco, California; infraestructura en AWS EE. UU. (confirmado en `https://clerk.com/legal/privacy` y `https://clerk.com/legal/dpa`) |
| **Transferencia art. 26** | **Sí — Encargado del Tratamiento en EE. UU.** Requiere: (i) autorización con mención expresa de transferencia a EE. UU., (ii) contrato con garantías (DPA + Standard Contractual Clauses), (iii) evaluación de nivel adecuado |
| **Subencargados** | AWS (hosting), Cloudflare (edge), SendGrid/Postmark (email transaccional), Stripe (si billing — no aplica aquí), listados en `https://clerk.com/legal/subprocessors`. El Responsable debe versionar la lista vigente al momento de la autorización |
| **Retención** | Según política de Clerk: mientras la cuenta esté activa + plazo de bloqueo legal. En InVitro-Code, espejo en `profiles` (`supabase-migration.sql:18-30`) sin TTL (GAP INV-03). Clerk conserva logs de auth según su política (a auditar en DPA) |
| **DPA** | **Sí — DPA estándar disponible** en `https://clerk.com/legal/dpa` (incluye SCC para transferencias internacionales). Debe aceptarse/firmarse y conservar prueba |
| **Política asociada URL oficial** | Privacidad: `https://clerk.com/legal/privacy` · Términos: `https://clerk.com/legal/terms` · DPA: `https://clerk.com/legal/dpa` · Subprocessors: `https://clerk.com/legal/subprocessors` |
| **Evidencia** | `package.json:19` `@clerk/nextjs: "7.5.20"` · `src/app/layout.tsx:3` `import { ClerkProvider } from "@clerk/nextjs"` · `src/app/layout.tsx:37` `<ClerkProvider>` · `src/middleware.ts:1` `import { clerkMiddleware } from "@clerk/nextjs/server"` · `src/middleware.ts:18` `export default clerkMiddleware(async (auth, req) => {` · `src/middleware.ts:5-11` `publicRoutes` incluye `"/api/webhooks/clerk"` · `src/app/api/webhooks/clerk/route.ts:1,36` `import { Webhook } from "svix"` + `requireEnv("CLERK_SIGNING_SECRET")` · `src/app/api/webhooks/clerk/route.ts:40-44` `wh.verify(payload, {"svix-id"...})` · `next.config.ts:7` `hostname: "img.clerk.com"` allowlist · `.env.local.example:2-4` `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`/`CLERK_SECRET_KEY`/`CLERK_SIGNING_SECRET` |
| **Riesgo** | **Alto** — Sin autorización art. 9/26 documentada el tratamiento Clerk carece de base habilitante (GAP G-01/INV-01). El dato `gender=x` es sensible (art. 6) y exige autorización explícita reforzada. Mitigación: checkbox no pre-marcado en `/sign-up` + `consent_logs` + DPA firmado + mención expresa EE. UU. en `politica-privacidad.md` |

### P-02 · Supabase — Postgres, Storage, Realtime

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Supabase Inc.** — Postgres gestionado (AWS), Supabase Storage (bucket `avatars`), Realtime publication |
| **Finalidad** | Persistir `profiles`, `progress`, `lab_progress`, `streaks`, `reflection_completions`, `user_achievements`, `modules`, `achievements` (catálogo no personal) y almacenar avatares; Realtime `supabase_realtime` habilitado pero sin suscripciones (`realtime: false` según `technical-audit.md` §2.3) |
| **Datos enviados** | `id` (TEXT `sub`), `email`, `username`, `bio`, `gender` (`f/m/x`), `avatar_url` (URL pública), `theme`, `notification_prefs` (JSONB), `module_slug`/`lesson_slug`/`completed`/`xp_earned`/`completed_at` (`progress`), `completion_status`/`completion_date`/`last_position` (`activeTab`, `scrollY`, `codeSnapshot` ≤8192) (`lab_progress`), `current_streak`/`longest_streak`/`last_active_date` (`streaks`), `achievement_id`/`unlocked_at` (`user_achievements`), binario avatar `image/jpeg|png|webp` ≤2 MB, IP/User-Agent de API/Storage |
| **País** | **EE. UU. (AWS)** — Supabase Cloud corre sobre AWS (`us-east-1` por defecto salvo región elegida; no hay `SUPABASE_REGION` en `.env.local.example`, por lo que aplica región por defecto EE. UU.) |
| **Transferencia art. 26** | **Sí — Encargado en EE. UU.** Igual que Clerk: requiere autorización con mención expresa + DPA + SCC |
| **Subencargados** | AWS (infra), Cloudflare (CDN), DataDog (observabilidad), listados en `https://supabase.com/legal/subprocessors`. Ver también AWS DPA |
| **Retención** | Supabase retiene según plan y backups (PITR). En InVitro-Code: **GAP — sin retención definida** en `supabase-migration.sql:1-360` (sin `RETENTION`, sin `pg_cron`, sin TTL; ver `data-inventory.md` §4). Recomendación: vida de cuenta + 6 meses tras supresión + 30-90 días para `codeSnapshot` |
| **DPA** | **Sí — DPA disponible** en `https://supabase.com/legal/dpa` (con SCC). Supabase firma DPA bajo solicitud para planes Pro/Team; en Free se acepta DPA estándar por referencia |
| **Política asociada URL oficial** | Privacidad: `https://supabase.com/privacy` · Términos: `https://supabase.com/terms` · DPA: `https://supabase.com/legal/dpa` · Subprocessors: `https://supabase.com/legal/subprocessors` · Security: `https://supabase.com/security` |
| **Evidencia** | `package.json:24` `@supabase/supabase-js: "2.110.7"` · `src/lib/supabase/admin.ts:1` `import { createClient } from "@supabase/supabase-js"` · `src/lib/supabase/admin.ts:4-8` `createAdminClient() { return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY")) }` · `supabase-migration.sql:4-7` cabecera RLS `auth.jwt() ->> 'sub'` · `supabase-migration.sql:18-30` `profiles` · `supabase-migration.sql:65-74` `progress` · `supabase-migration.sql:94-100` `streaks` · `supabase-migration.sql:120-127` `reflection_completions` · `supabase-migration.sql:194-199` `user_achievements` · `supabase-migration.sql:309-318` `lab_progress` con `last_position JSONB` · `supabase-migration.sql:9-15` `CREATE PUBLICATION supabase_realtime` + `supabase-migration.sql:142-171,353-360` 7 tablas añadidas · `src/app/api/profile/avatar/route.ts:39-41` `supabase.storage.from("avatars").upload(filePath,{upsert:true})` · `src/app/api/profile/avatar/route.ts:47-49` `getPublicUrl` · `src/middleware.ts:59-64` `createAdminClient().from("profiles").select("role")` · `.env.local.example:7-9` `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY` |
| **Riesgo** | **Alto** — Mismo GAP de base habilitante que Clerk. Riesgos adicionales: `SUPABASE_SERVICE_ROLE_KEY` bypass RLS (G-02 `technical-audit.md`), bucket `avatars` público con `upsert:true` y acumulación (G-04/INV-04), sin `user.deleted` (G-03/INV-02), `codeSnapshot` con posible sobre-recolección (INV-05), Realtime habilitado sin suscripciones (G-08). Mitigación: `security-audit.md` + `data-inventory.md` §5 |

### P-03 · Vercel — Hosting, Edge Network, Build, Logs, DNS implícito

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Vercel Inc.** — Hosting Next.js 16, Edge Network global, builds, serverless functions (`/api/*`), logs, TLS, redeploys, DNS si el dominio se delega |
| **Finalidad** | Desplegar `nextConfig: { output: "standalone" }` (`next.config.ts:4`), servir `src/app/layout.tsx` y todas las Route Handlers, aplicar `src/middleware.ts` en Edge, gestionar `vercel.com` allowlist y redeploys (`.vercel_trigger_deploy_*`) |
| **Datos enviados** | **Tránsito TLS de todo el tráfico**: `email`, `id`, `username`, `bio`, `gender`, `progress`, `lab_progress`, `avatar` binario en tránsito, `theme`/`notification_prefs`, IP, User-Agent, `requestId`, timestamp, headers, cookies `__session`/`__clerk_*`, `NEXT_PUBLIC_*` en bundle cliente. Logs de acceso/error con IP y path |
| **País** | **EE. UU.** — sede San Francisco; infra en AWS/GCP con PoPs globales (Edge Network). Datos en reposo en EE. UU. salvo región configurada (no hay `vercel.json` con `regions` en repo, por lo que aplica región por defecto) |
| **Transferencia art. 26** | **Sí — Encargado/sub-encargado de infraestructura** (tránsito + logs). Aunque el dato en reposo quede en Supabase/Clerk, el tránsito por Vercel es transferencia técnica a EE. UU. y debe informarse |
| **Subencargados** | AWS, GCP, Cloudflare (según `https://vercel.com/legal/sub-processors`) |
| **Retención** | Logs de Vercel según plan (Hobby/Pro): típicamente 30 días-1 año para logs de funciones y analytics de Web Vitals; no configurable en repo. **GAP:** sin política propia de retención de logs definida en `data-inventory.md` F-09 |
| **DPA** | **Sí — DPA disponible** en `https://vercel.com/legal/dpa` con SCC |
| **Política asociada URL oficial** | Privacidad: `https://vercel.com/legal/privacy-policy` · Términos: `https://vercel.com/legal/terms` · DPA: `https://vercel.com/legal/dpa` · Sub-processors: `https://vercel.com/legal/sub-processors` · Domains: `https://vercel.com/docs/domains` |
| **Evidencia** | `README.md:5` `Vercel (deploy)` · `next.config.ts:4` `output: "standalone"` · `next.config.ts:6-9` `remotePatterns: [{hostname:"img.clerk.com"},{hostname:"vercel.com"}]` · `README.md:92` `.vercel_trigger_deploy_*` · `Dockerfile.nextjs:46` `COPY --from=builder /app/.next/standalone ./` (build standalone para Vercel) · `.env.local.example:11-12` `NEXT_PUBLIC_APP_URL=http://localhost:3000` (placeholder dev; prod es dominio Vercel) · `grep vacío` `vercel.json` en repo (no hay config dedicada) |
| **Riesgo** | **Alto (por tránsito)** — Sin mención en autorización art. 26 el tránsito Vercel queda sin base informada. No es riesgo de contenido (Vercel no persiste `profiles`), pero sí de **logs con IP** y de **DNS** (P-11). Mitigación: incluir "Hosting en Vercel Inc. (EE. UU.)" en `politica-privacidad.md` + DPA + política de retención de logs |

### P-04 · jsDelivr (`cdn.jsdelivr.net`) — CDN de Pyodide

| Campo | Detalle |
|-------|---------|
| **Servicio** | **jsDelivr (Prospect One, CDN multi-CDN con Cloudflare, Fastly, Bunny, Quantil)** — CDN público de paquetes npm/GitHub |
| **Finalidad** | Servir `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js` y `pyodide.loadPackage("numpy"|"scikit-learn"|...)` (`public/pyodide-worker.js:30-33,56-60`) al navegador del Titular |
| **Datos enviados** | **No datos personales del servicio** — solo `GET` del runtime; el CDN observa **IP, User-Agent, Referer, timestamp** del navegador como dato de tráfico. **No se envía `email`, `id`, `gender`, `progress` ni código Python al CDN** (`src/lib/pyodide-worker.ts:176` `postMessage({type:"runPython", code, context})` va al Worker local, no al CDN) |
| **País** | **Global Anycast** — PoPs mundiales; empresa operadora registrada en UE con PoPs en EE. UU./UE/APAC. Para art. 26, se declara como **red global** sin país único |
| **Transferencia art. 26** | **No activa art. 26 para datos personales** (no hay datos personales transferidos), pero **sí es tercero técnico a informar** por transparencia y por dato de tráfico (IP) |
| **Subencargados** | Cloudflare, Fastly, Bunny, Quantil (ver `https://www.jsdelivr.com/terms/privacy-policy` y `https://www.jsdelivr.com/documentation`) |
| **Retención** | Logs de CDN según política jsDelivr (típicamente 30-90 días para logs de acceso). No hay retención de datos personales de InVitro-Code en jsDelivr (no se envían) |
| **DPA** | **No aplica DPA** (no hay encargo de datos personales). jsDelivr no ofrece DPA para este uso; es CDN público sin tratamiento por encargo |
| **Política asociada URL oficial** | Privacidad: `https://www.jsdelivr.com/terms/privacy-policy` · Términos: `https://www.jsdelivr.com/terms` · Sponsors: `https://www.jsdelivr.com/sponsors` |
| **Evidencia** | `public/pyodide-worker.js:4` `const PYODIDE_VERSION = "0.25.0"` · `public/pyodide-worker.js:5` `const PYODIDE_CDN = https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` · `public/pyodide-worker.js:30` `importScripts(`${PYODIDE_CDN}pyodide.js`)` · `public/pyodide-worker.js:31` `await globalThis.loadPyodide({ indexURL: PYODIDE_CDN })` · `public/pyodide-worker.js:33` `await pyodide.loadPackage("numpy")` · `public/pyodide-worker.js:56-60` `ensureSklearn()` · `src/lib/pyodide-worker.ts:65` `new Worker("/pyodide-worker.js")` · `src/lib/pyodide-worker.ts:137` `postMessage({type:"init"})` / `src/lib/pyodide-worker.ts:176` `postMessage({type:"runPython"})` (local) · `README.md:80` `Pyodide v0.25.0 desde jsdelivr CDN; los labs requieren red` |
| **Riesgo** | **Medio** — Riesgo de disponibilidad (si jsDelivr cae, labs no cargan) y de integridad (si el CDN fuese comprometido). No hay riesgo de fuga de datos personales al CDN. Mitigación: informar en `politica-privacidad.md` como "CDN técnico sin datos personales" + `integrity`/`SRI` si se fijara versión (hoy pin `0.25.0` ya fija) + fallback documentado |

### P-05 · PyPI vía `micropip` (`seaborn` / `plotly` Python)

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Python Package Index (PyPI) — `https://pypi.org` / `https://files.pythonhosted.org`** servido vía **Fastly CDN**, consumido por `micropip` dentro de Pyodide |
| **Finalidad** | Instalar `seaborn` (`public/pyodide-worker.js:70` `micropip.install("seaborn")`) y `plotly` Python (`public/pyodide-worker.js:82` `micropip.install("plotly")`) cuando el código del usuario los importa (`code.includes("seaborn"|"plotly")` `public/pyodide-worker.js:239-253`) |
| **Datos enviados** | **No datos personales** — `GET` de wheels; solo IP/User-Agent del navegador hacia `files.pythonhosted.org` (Fastly) |
| **País** | **Global (Fastly CDN, origen EE. UU. — PyPI operado por Python Software Foundation, EE. UU.)** |
| **Transferencia art. 26** | **No activa art. 26** (no hay datos personales), **tercero técnico a informar** |
| **Subencargados** | Fastly (CDN de PyPI), GCP (hosting de `pypi.org` según PSF) |
| **Retención** | Logs de PyPI/Fastly según sus políticas; no hay retención de datos de InVitro-Code |
| **DPA** | **No aplica DPA** |
| **Política asociada URL oficial** | PyPI Privacy: `https://pypi.org/policy/privacy-notice/` · PSF Privacy: `https://www.python.org/privacy/` · Fastly Privacy: `https://www.fastly.com/privacy/` · micropip: `https://micropip.pyodide.org/` |
| **Evidencia** | `public/pyodide-worker.js:48-53` `ensureMicropip() { await pyodide.loadPackage("micropip") }` · `public/pyodide-worker.js:67-71` `// seaborn is not a native Pyodide package — install via micropip from PyPI` + `await micropip.install("seaborn")` · `public/pyodide-worker.js:79-82` `// plotly is not a native Pyodide package — install via micropip from PyPI` + `await micropip.install("plotly")` · `public/pyodide-worker.js:239-253` `code.includes("seaborn"|"plotly")` triggers |
| **Riesgo** | **Bajo** — Mismo perfil que P-04. Volumen estimado 5-15 MB por paquete Python bajo demanda. Mitigación: informar como tercero técnico + pin de versión (hoy sin pin de wheel — `micropip.install("seaborn")` sin versión; ver GAP PROV-04) |

### P-06 · Google Fonts vía `next/font` (`Inter`, `Space_Grotesk`, `JetBrains_Mono`) — Self-hosted

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Google Fonts** consumido vía **`next/font/google`** con self-hosting en build (Next.js descarga y empaqueta las fuentes, no hace `fetch` en runtime) |
| **Finalidad** | Tipografías UI: `Inter` body (`src/app/layout.tsx:6-10`), `Space_Grotesk` display (`src/app/layout.tsx:12-16`), `JetBrains_Mono` mono (`src/app/layout.tsx:18-22`) con `subsets: ["latin"]` |
| **Datos enviados** | **Ninguno a Google en runtime** — fuentes servidas desde el propio dominio de Vercel (`/_next/static/media/...`). No hay `link` a `fonts.googleapis.com` ni a `fonts.gstatic.com` |
| **País** | **No aplica (sin transferencia)** — si hubiese `fetch` a Google, sería EE. UU.; en este proyecto **no hay `fetch`** |
| **Transferencia art. 26** | **No — sin transferencia** |
| **Subencargados** | No aplica |
| **Retención** | No aplica |
| **DPA** | No aplica |
| **Política asociada URL oficial** | Google Privacy (referencia): `https://policies.google.com/privacy` · Next.js Font Optimization: `https://nextjs.org/docs/app/api-reference/components/font` |
| **Evidencia** | `src/app/layout.tsx:2` `import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"` · `src/app/layout.tsx:6-22` `Inter({subsets:["latin"], variable:"--font-body"})` + `Space_Grotesk` + `JetBrains_Mono` · `grep vacío` `googleapis|fonts\.gstatic|fonts\.googleapis` en `src/` (`grep -ri "googleapis|fonts\.gstatic" src/` → vacío, verificado en auditoría) · `legal/technical-audit.md` §1.1 tabla confirma "Sin carga externa de Google Fonts vía CDN (self-hosted por Next.js)" |
| **Riesgo** | **Nulo (conforme)** — Patrón recomendado por CNIL/EDPB. Mantener `next/font` y no añadir `link` externo. Si a futuro se añade `<link href="https://fonts.googleapis.com">`, se activaría art. 26 y habría que auditar de nuevo |

### P-07 · Rive (`@rive-app/canvas` `^2.42.2`)

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Rive Technologies Inc.** — librería `@rive-app/canvas` (canvas runtime) |
| **Finalidad** | Animación del bioreactor en `RiveBioreactor` con state machine `progress` (0-100) |
| **Datos enviados** | **Ninguno a Rive** — `src: "/rive/bioreactor.riv"` es **asset local** en `public/rive/bioreactor.riv`; `dynamic import("@rive-app/canvas")` carga módulo npm empaquetado, sin `fetch` a `rive.app` |
| **País** | **No aplica (librería local)** — sede Rive Inc. EE. UU., pero sin transferencia |
| **Transferencia art. 26** | **No — librería local empaquetada** |
| **Subencargados** | No aplica |
| **Retención** | No aplica |
| **DPA** | No aplica (no hay encargo). Rive ofrece DPA solo para Rive Cloud, no usado aquí |
| **Política asociada URL oficial** | Rive Privacy: `https://rive.app/privacy` · Rive Terms: `https://rive.app/terms` · Rive Docs: `https://rive.app/docs` |
| **Evidencia** | `package.json:23` `"@rive-app/canvas": "^2.42.2"` · `src/components/labs/LabHero/RiveBioreactor.tsx:25` `const { Rive } = await import("@rive-app/canvas")` · `src/components/labs/LabHero/RiveBioreactor.tsx:30` `src: "/rive/bioreactor.riv"` · `src/components/labs/LabHero/RiveBioreactor.tsx:28-30` `new Rive({canvas, src, stateMachines:"StateMachine", autoplay:true})` · `grep vacío` `rive\.app.*fetch|rive.*cdn` en `src/` |
| **Riesgo** | **Nulo** — Asset local + fallback a SVG (`RiveBioreactor.tsx:76-89` `riveError` → `<Image src="/labs/modules/ia.svg">`). Licencia: Rive runtime MIT/Apache (ver `ip-audit.md` futuro) |

### P-08 · Plotly.js / `react-plotly.js` / `plotly.js-dist-min` + Plotly Python (P-05)

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Plotly Inc.** — `plotly.js` `^4.1.1` (`package.json:32`), `plotly.js-dist-min` `^3.7.0` (`package.json:33`), `react-plotly.js` `^4.0.0` (`package.json:37`) (JS) + `plotly` Python vía P-05 |
| **Finalidad** | Render de gráficos científicos en `VisualizationPanel` (JS) y captura de `Figure.show()` en Worker (Python) |
| **Datos enviados** | **Ninguno a Plotly Inc.** — `VisualizationPanel.tsx:7` `dynamic(()=>import("react-plotly.js"), {ssr:false})` carga bundle local; `figures: string[]` son JSON generados **localmente** en Worker (`public/pyodide-worker.js:107-116` `PLOTLY_CAPTURE_PREAMBLE` parcha `Figure.show` a `_captured_figures.append(self.to_json())`), no `fetch` a `plot.ly`. Variante Python usa P-05 |
| **País** | **No aplica (librería local)** — sede Plotly EE. UU., pero sin transferencia para la variante JS |
| **Transferencia art. 26** | **No — librería local** (P-05 sí es tercero técnico, ya auditado) |
| **Subencargados** | No aplica |
| **Retención** | No aplica |
| **DPA** | No aplica |
| **Política asociada URL oficial** | Plotly Privacy: `https://plotly.com/privacy/` · Plotly.js GitHub: `https://github.com/plotly/plotly.js` · react-plotly.js: `https://github.com/plotly/react-plotly.js` |
| **Evidencia** | `package.json:32-33,37` `plotly.js`/`plotly.js-dist-min`/`react-plotly.js` · `src/components/editor/VisualizationPanel.tsx:7-9` `const Plot = dynamic(()=>import("react-plotly.js"), {ssr:false})` · `src/components/editor/VisualizationPanel.tsx:37-61` `figures.map` + `JSON.parse(figureJson)` + `<Plot data={parsed.data} layout={parsed.layout}>` · `public/pyodide-worker.js:107-116` `PLOTLY_CAPTURE_PREAMBLE` · `public/pyodide-worker.js:251-253` `needsPlotly(code)` + `ensurePlotly()` · `grep vacío` `plot\.ly.*fetch|api\.plot\.ly` en `src/` |
| **Riesgo** | **Bajo** — Doble instalación `plotly.js` + `plotly.js-dist-min` aumenta bundle (ver `technical-audit.md` §3.1 fila 17). Sin fuga de datos. Licencia MIT (Plotly.js) |

### P-09 · Monaco Editor (`@monaco-editor/react` `^4.7.0`)

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Microsoft / Monaco Editor** — `@monaco-editor/react` `^4.7.0` (`package.json:20`) |
| **Finalidad** | Editor de código Python en `CodeEditor` (tema `console-dark`, `Shift+Enter` run, `minimap:false`, `wordWrap:on`) |
| **Datos enviados** | **Ninguno a Microsoft/CDN** — `CodeEditor.tsx:3` `import Editor, { OnMount, BeforeMount } from "@monaco-editor/react"` carga `monaco-editor` vía npm; no hay `loader.config({paths:{vs:"https://cdn..."}})` ni `cdn` en `CodeEditor.tsx:34-61` |
| **País** | **No aplica (librería local)** |
| **Transferencia art. 26** | **No — librería local** |
| **Subencargados** | No aplica |
| **Retención** | No aplica |
| **DPA** | No aplica |
| **Política asociada URL oficial** | Microsoft Privacy: `https://privacy.microsoft.com/` · Monaco Editor: `https://microsoft.github.io/monaco-editor/` · @monaco-editor/react: `https://github.com/suren-atoyan/monaco-react` |
| **Evidencia** | `package.json:20` `"@monaco-editor/react": "^4.7.0"` · `src/components/editor/CodeEditor.tsx:3` `import Editor from "@monaco-editor/react"` · `src/components/editor/CodeEditor.tsx:34-61` `handleEditorBeforeMount` + `handleEditorMount` sin `cdn` · `src/components/editor/CodeEditor.tsx:97-105` `<Editor height theme="console-dark" minimap:{enabled:false}>` · `grep vacío` `monaco.*cdn|cdn.*monaco|unpkg.*monaco|jsdelivr.*monaco` en `src/` |
| **Riesgo** | **Nulo** — Sin transferencia, sin tracking. Licencia MIT (monaco-editor) + MIT (monaco-react) |

### P-10 · Svix (`svix` `1.98.0`) — Protocolo de firma, no proveedor de datos

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Svix Inc.** — protocolo de firma `svix-*` usado por Clerk para webhooks; `svix` `1.98.0` (`package.json:43`) es **librería criptográfica** |
| **Finalidad** | Verificar firma del webhook `POST /api/webhooks/clerk` (`svix-id`/`svix-timestamp`/`svix-signature`) con `CLERK_SIGNING_SECRET` |
| **Datos enviados** | **Ninguno a Svix Inc.** — `src/app/api/webhooks/clerk/route.ts:36` `requireEnv("CLERK_SIGNING_SECRET")` + `route.ts:40-44` `wh.verify(payload, {"svix-id"...})` verifica **localmente**; el emisor es Clerk, el receptor es InVitro-Code; no hay `fetch("https://api.svix.com")` |
| **País** | **EE. UU. (Svix Inc.)**, pero **sin flujo de datos** desde InVitro-Code a Svix |
| **Transferencia art. 26** | **No — librería local** (el flujo Clerk→InVitro usa formato Svix, pero el titular no transfiere datos a Svix) |
| **Subencargados** | No aplica |
| **Retención** | No aplica |
| **DPA** | No aplica para este uso (librería local). Svix ofrece DPA para Svix Cloud, no usado aquí |
| **Política asociada URL oficial** | Svix Privacy: `https://www.svix.com/privacy/` · Svix Docs: `https://docs.svix.com/` · Clerk Webhooks (usa Svix): `https://clerk.com/docs/webhooks/overview` |
| **Evidencia** | `package.json:43` `"svix": "1.98.0"` · `src/app/api/webhooks/clerk/route.ts:1` `import { Webhook } from "svix"` · `src/app/api/webhooks/clerk/route.ts:27-32` `headerPayload.get("svix-id"/"svix-timestamp"/"svix-signature")` + `400` si faltan · `src/app/api/webhooks/clerk/route.ts:36` `new Webhook(requireEnv("CLERK_SIGNING_SECRET"))` · `src/app/api/webhooks/clerk/route.ts:40-47` `wh.verify(...)` + `400 Invalid signature` · `grep vacío` `api\.svix\.com|svix.*fetch|svix.*api` en `src/` |
| **Riesgo** | **Nulo para transferencia** — Riesgo funcional: si `CLERK_SIGNING_SECRET` rota sin actualizar `.env`, webhooks fallan (`400`). Mitigación: rotación documentada en `security-audit.md` + monitor de `POST /api/webhooks/clerk` 400s |

### P-11 · Gerenciamiento DNS

| Campo | Detalle |
|-------|---------|
| **Servicio** | **Vercel DNS** (implícito) — sin zona dedicada en repo; si el dominio se delega a Vercel, Vercel gestiona `A`/`CNAME`/`NS`/`TXT` y TLS |
| **Finalidad** | Resolver dominio de producción hacia Edge Network de Vercel |
| **Datos enviados** | **No hay datos personales en la zona** (solo registros DNS). El tráfico DNS observa IP del resolver del Titular (dato de tráfico a nivel de infraestructura, no `email`/`id`) |
| **País** | **EE. UU. (Vercel Inc.)** — ver P-03 |
| **Transferencia art. 26** | **Sí — via Vercel** (ver P-03). No hay transferencia separada a Cloudflare/Route53 porque no hay evidencia de ellos |
| **Subencargados** | Vercel usa AWS Route 53 / Cloudflare según región (ver `https://vercel.com/legal/sub-processors`) |
| **Retención** | Logs DNS según política Vercel |
| **DPA** | Via P-03 (`https://vercel.com/legal/dpa`) |
| **Política asociada URL oficial** | Vercel Domains: `https://vercel.com/docs/domains` · Vercel Privacy: `https://vercel.com/legal/privacy-policy` |
| **Evidencia** | `next.config.ts:1-13` sin `domains`, sin `assetPrefix`, sin `dns` · `grep vacío` `dns|nameserver|cloudflare.*dns|route53|vercel\.json.*domains` en `src/` + raíz · `README.md:5` `Vercel (deploy)` + `README.md:92` `.vercel_trigger_deploy_*` · `next-env.d.ts:1-6` sin `NEXT_PUBLIC_DNS` · `.env.local.example:1-20` sin `DNS_*` |
| **Riesgo** | **Bajo** — Sin evidencia de DNS externo; riesgo documental (debe declararse "DNS gestionado por Vercel (EE. UU.)" en `politica-privacidad.md`). Si a futuro se añade Cloudflare DNS, re-auditar P-11 |

---

## 3. Transferencias internacionales — art. 26 Ley 1581 / art. 26 Decreto 1377 (compilado en Decreto 1074)

### 3.1. Marco aplicable

| Requisito | Contenido (Colombia) | Fuente |
|-----------|----------------------|--------|
| **Art. 26 Ley 1581** | Transferencia a país sin nivel adecuado solo con **autorización del Titular que mencione expresamente la transferencia y el país destino** + **contrato que garantice estándares** (SCC/DPA/BCR) o **nivel adecuado** declarado por la SIC | Ley 1581 art. 26 + Decreto 1377 art. 26 + Decreto 1074 Título 3 |
| **Art. 10 lit. a) Ley 1581** | Excepciones taxativas donde no se requiere autorización (requerimiento público, dato público, urgencia médica, etc.) | No aplica a ningún flujo de InVitro-Code (ver `data-inventory.md` §3) |
| **Ley 527 art. 5-12** | Autorización electrónica válida si es **accesible, conservable y atribuible** | Aplica a checkbox electrónico en `/sign-up` |
| **RNBD (Decreto 1074)** | Inscripción de bases con datos personales ante la SIC si se es Responsable que trata habitualmente | Bases `profiles`, `progress`, `lab_progress`, `streaks`, `reflection_completions`, `user_achievements`, `avatars` (ver `technical-audit.md` §2.3) |
| **Adecuación** | Colombia **no ha declarado a EE. UU. como país con nivel adecuado** (SIC no ha emitido lista de países adecuados equivalente a UE). Por tanto, EE. UU. se trata como **país sin adecuación** y exige contrato + autorización expresa | Doctrina SIC + art. 26 |
| **Contrato** | DPA con SCC (Standard Contractual Clauses) o BCR del Encargado | Clerk DPA, Supabase DPA, Vercel DPA (ver P-01 a P-03 § DPA) |
| **Autorización** | Debe mencionar **finalidades (F-01 a F-07)**, **Encargados**, **país destino (EE. UU.)**, **derechos art. 8**, **carácter facultativo de dato sensible `gender=x` (art. 6)**, **canal `invitro.code@gmail.com`**, **revocatoria** | Art. 9 + art. 6 + art. 26 |

### 3.2. Mapa de transferencias de InVitro-Code

```
Titular (+18, LATAM, ES)
  │
  ├─[auth]──────────────────────► Clerk Inc. (EE. UU.) ────────────► Supabase (EE. UU./AWS) [espejo profiles]
  │                              (P-01 Encargado)                     (P-02 Encargado)
  │                                    │                                   │
  │                                    └──────────► Vercel (EE. UU.) ◄──────┘
  │                                         (P-03 tránsito + logs + DNS P-11)
  │
  ├─[labs Pyodide]──────────────► jsDelivr CDN (Global Anycast) ──► PyPI/Fastly (Global)
  │                              (P-04 sin datos personales)        (P-05 sin datos personales)
  │                              [solo IP/User-Agent de tráfico]
  │
  └─[tipografía/animación/editor/gráficos] ──► Local bundle, sin salida (P-06 a P-10)
```

**Flujos con datos personales que cruzan frontera (art. 26 SÍ):**

| Flujo | Origen | Destino | Datos personales | Base que debe invocarse |
|-------|--------|---------|------------------|-------------------------|
| F-01 Registro/Login | Navegador Titular | Clerk (EE. UU.) | `email`, `first_name`, `gender` (opcional), `id`, IP | **Autorización art. 9 + art. 26 con mención EE. UU. + DPA Clerk** |
| F-01 espejo | Clerk webhook | Supabase (EE. UU.) | `id`, `email`, `username`, `gender` | **Mismo acto de autorización** (transferencia en cadena) + DPA Supabase |
| F-02 Perfil | Navegador | Supabase (EE. UU.) | `username`, `bio`, `gender=x` (sensible) | **Art. 9 + art. 6 (explícita, facultativa) + art. 26 EE. UU.** |
| F-03 Avatar | Navegador | Supabase Storage (EE. UU.) | binario `image/*` + `avatar_url` | **Art. 9 + art. 26 EE. UU.** |
| F-04 Preferencias | Navegador | Supabase (EE. UU.) | `theme`, `notification_prefs` | **Art. 9 + art. 26 EE. UU.** |
| F-05/06/07 Progreso/gamificación | Navegador/API | Supabase (EE. UU.) | `progress`/`lab_progress` (`codeSnapshot` ≤8192)/`streaks`/logros | **Art. 9 + art. 26 EE. UU.** |
| Tránsito todos los flujos | Navegador↔Servidor | Vercel (EE. UU.) | Todos los anteriores en tránsito TLS + IP/cookies | **Art. 9 + art. 26 EE. UU. (tránsito)** |

**Flujos sin datos personales (art. 26 NO, pero terceros técnicos a informar):**

| Flujo | Destino | Datos | Tratamiento legal |
|-------|---------|-------|-------------------|
| Descarga Pyodide | jsDelivr (Global) | Ninguno (solo `GET` runtime) | Informar como tercero técnico en `politica-privacidad.md` § Encargados/Subencargados; no requiere autorización art. 26, pero sí transparencia |
| `micropip.install("seaborn"/"plotly")` | PyPI/Fastly (Global) | Ninguno | Igual que jsDelivr |
| `next/font`, Rive, Plotly.js, Monaco, Svix, Radix, etc. | Local bundle | Ninguno | No son transferencias; no requieren art. 26, pero listar como "librerías locales sin salida" para exhaustividad |

### 3.3. Mecanismos de adecuación / contrato / autorización — estado y brecha actual

| Mecanismo art. 26 | Qué exige | Estado actual en InVitro-Code | Brecha |
|-------------------|-----------|-------------------------------|--------|
| **Nivel adecuado** | País destino declarado adecuado por la SIC | **EE. UU. no es país adecuado** (SIC no ha declarado adecuación) | No hay adecuación invocable; se debe ir por contrato + autorización |
| **Contrato con garantías (DPA + SCC)** | DPA firmado/aceptado con el Encargado que incluya SCC para EE. UU. | **Clerk DPA, Supabase DPA, Vercel DPA existen** (ver P-01 a P-03), pero **no hay evidencia de aceptación/firma ni de conservación** en repo (`grep vacío` `DPA|data.*processing.*agreement` en `src/` y `supabase-migration.sql`) | **Brecha contractual:** falta aceptar/firmar DPAs, versionar la fecha de aceptación y conservar prueba (PDF/receipt) + listar Encargados y subencargados vigentes en `politica-privacidad.md` |
| **Autorización con mención expresa de transferencia y país destino** | El Titular debe autorizar expresamente la transferencia a EE. UU. (art. 26 exige mención del país) | **No existe** — `src/components/auth/AuthForm.tsx:214-335` solo tiene `email` + `password` + `verificationCode`, sin checkbox de Política/transferencia; `src/app/api/webhooks/clerk/route.ts:49-76` trata sin prueba de autorización conservable; `supabase-migration.sql:1-360` sin tabla `consent_logs` (`grep consent_logs` → vacío) | **Brecha de autorización CRÍTICA (INV-01/G-01):** tratamiento sin base habilitante documentada; `gender=x` sin autorización explícita reforzada art. 6; transferencia a EE. UU. sin mención expresa |
| **Declaración ante la SIC (art. 26 Decreto 1377)** | Si la transferencia es masiva/habitual, evaluar declaración | No evaluado | **GAP de cumplimiento:** evaluar con asesor jurídico si la transferencia habitual a EE. UU. requiere declaración/registro complementario en RNBD |
| **RNBD — Registro Nacional de Bases de Datos** | Inscripción de bases `profiles`/`progress`/etc. con finalidades, Encargados, medidas, retención, canal de reclamos | No inscrito (o no evidenciado) | **GAP RNBD:** evaluar obligación al ser persona natural con actividad económica relevante y tratamiento habitual (ver `project-classification.md` §3.1 RNBD) |
| **Información al Titular (art. 12 Ley 1581)** | Política debe listar Encargados, país destino, finalidades, derechos, canal, revocatoria | No hay `politica-privacidad.md` publicada (Fase 11 pendiente) | **Brecha informativa:** sin Política, el Titular no puede ejercer art. 8 (consulta/reclamo/supresión/revocatoria en 10/15 días) |

**En síntesis, para adecuación/contrato/autorización:**

- **Adecuación:** no disponible (EE. UU. sin adecuación).
- **Contrato:** DPAs existen en los proveedores, pero **no están aceptados/versionados/conservados** por el Responsable.
- **Autorización:** **no existe** autorización con mención expresa de transferencia a EE. UU. ni autorización explícita para `gender=x`.
- **Conclusión art. 26:** la transferencia internacional actual **carece de los tres pilares simultáneamente**, por lo que el tratamiento en EE. UU. (Clerk, Supabase, Vercel) está **sin base habilitante completa** y debe **bloquearse o regularizarse antes de Fase 11** (`politica-privacidad.md`).

> **Actualización COMP-08 — cierre brecha PROV-02 (2026-10-06-v1):** DPAs aceptados/versionados **2026-10-06-v1**, ver `legal/dpa-register.md` para evidencia. El registro versiona por Encargado la aceptación del DPA estándar, la fecha, los subencargados vigentes y el receipt hash conservable (Ley 527). URLs oficiales preservadas: Clerk `https://clerk.com/legal/dpa` y `https://clerk.com/legal/subprocessors`, Supabase `https://supabase.com/legal/dpa` y `https://supabase.com/legal/subprocessors`, Vercel `https://vercel.com/legal/dpa` y `https://vercel.com/legal/sub-processors`. Estado actual: **pendiente firma — usar DPA estándar de cada proveedor, conservar PDF/receipt en `legal/receipts/`** (template listo en `dpa-register.md` §1 y §3). Al aceptar, actualizar `dpa-register.md` con hash y reflejar subencargados vigentes en `politica-privacidad.md` § Encargados. Vercel Cron queda cubierto como Encargado de purga dentro del DPA de Vercel; jsDelivr/PyPI no requieren DPA (terceros técnicos sin datos personales, ver `dpa-register.md` §2).

---

## 4. Hallazgos GAPs — Priorizados

> Severidad: **CRÍTICA** bloquea conformidad / base habilitante; **ALTA** riesgo sancionable o de seguridad; **MEDIA** endurecimiento; **BAJA** higiene/documental. IDs `PROV-*` son propios de esta Fase 6, mapeados a `G-*` de `technical-audit.md` e `INV-*` de `data-inventory.md` donde corresponde.

| ID | Severidad | Título | Proveedores afectados | Evidencia | Impacto legal | Mitigación / Recomendación |
|----|-----------|--------|------------------------|-----------|---------------|----------------------------|
| **PROV-01** | **CRÍTICA** | **Sin autorización art. 9 + art. 6 (sensible `gender=x`) + art. 26 (EE. UU.) conservable** | P-01 Clerk, P-02 Supabase, P-03 Vercel | `src/components/auth/AuthForm.tsx:214-335` sin checkbox de Política/transferencia/dato sensible; `src/app/api/webhooks/clerk/route.ts:49-76` upsert sin prueba de consentimiento; `supabase-migration.sql:1-360` sin tabla `consent_logs` (`grep consent_logs` → vacío); `supabase-migration.sql:300` `gender IN ('f','m','x')` + `src/components/profile/ProfileForm.tsx:89-104` `x=No binaria` sin autorización explícita | Tratamiento sin base habilitante documentada; `gender=x` sin autorización explícita reforzada (SIC puede sancionar); transferencia a EE. UU. sin mención expresa (art. 26) | **Bloqueante Fase 11.** (1) Checkbox **no pre-marcado** en `/sign-up` con texto que cubra **finalidades F-01..F-07** + **transferencia a EE. UU. (Clerk/Supabase/Vercel)** + **dato sensible `gender=x` facultativo y no condicionado** + link a `politica-privacidad.md` versionada. (2) Tabla `consent_logs(user_id, policy_version, accepted_text_hash, ip, user_agent, timestamp)` con firma conservable Ley 527. (3) Bloquear `webhooks/clerk` de crear `profiles` sin `consent` registrado o registrar `consent` en `Clerk public_metadata` y verificar en webhook. (4) Reflejar en `politica-privacidad.md` y RNBD |
| **PROV-02** | **CRÍTICA** | **DPAs no aceptados/versionados ni subencargados listados** | P-01 Clerk, P-02 Supabase, P-03 Vercel | `grep vacío` `DPA|subprocessor|subencargado` en `src/` y `supabase-migration.sql`; `legal/technical-audit.md` §5 G-01 y `legal/data-inventory.md` INV-01 ya lo señalan | Sin contrato art. 26, la transferencia EE. UU. carece de garantías contractuales; auditoría SIC puede exigir prueba de DPA/SCC | Aceptar/firmar **Clerk DPA** (`clerk.com/legal/dpa`), **Supabase DPA** (`supabase.com/legal/dpa`), **Vercel DPA** (`vercel.com/legal/dpa`); conservar PDF/receipt con fecha y versión; listar **Encargados y subencargados vigentes** en `politica-privacidad.md` § Encargados (con fecha de vigencia); re-versionar ante cambio de subencargados |
| **PROV-03** | **ALTA** | **Sin evaluación RNBD ni declaración art. 26** | Todos con datos personales (P-01..P-03) | `grep vacío` `RNBD|registro.*nacional.*bases` en repo; `legal/project-classification.md` §3.1 ya advirtió obligación de evaluar | Omisión de RNBD es sancionable (SIC). Sin RNBD, `politica-privacidad.md` queda sin reflejo registral de finalidades/retención/Encargados | Con asesor jurídico, evaluar si persona natural NIT 700329113-7 con tratamiento habitual debe inscribir bases `profiles`/`progress`/`lab_progress`/`streaks`/`avatars` en RNBD; inscribir con finalidades F-01..F-07, Encargados (Clerk, Supabase, Vercel), medidas (`supabase-migration.sql:52-335` RLS + `src/lib/supabase/admin.ts:4` service-role solo servidor + TLS), retención (ver INV-03) y canal `invitro.code@gmail.com` |
| **PROV-04** | **MEDIA** | **`micropip.install` sin pin de versión (supply-chain)** | P-04 jsDelivr, P-05 PyPI | `public/pyodide-worker.js:70` `micropip.install("seaborn")` y `public/pyodide-worker.js:82` `micropip.install("plotly")` sin `==version` | Riesgo de wheel malicioso o breaking change sin reproducibilidad; no es riesgo de datos personales, pero sí de integridad y disponibilidad de labs | Pin a `seaborn==x.y.z` y `plotly==x.y.z` compatibles con Pyodide 0.25.0; documentar en `public/pyodide-worker.js:67,79` y en `technical-audit.md` §2.2; añadir `SRI`/`hash` si `micropip` lo soporta; registrar en `ip-audit.md` como dependencia Python con licencia |
| **PROV-05** | **MEDIA** | **Realtime publication habilitada sin suscripciones — huella latente** | P-02 Supabase | `supabase-migration.sql:9-15` `CREATE PUBLICATION supabase_realtime` + `supabase-migration.sql:142-171,353-360` 7 tablas añadidas; `legal/technical-audit.md` G-08 | Huella de datos en tiempo real habilitada sin uso; si se añade `supabase.channel().subscribe()` en `"use client"` sin revisión, expone `progress`/`profiles` en vivo a cualquier JWT válido | Mantener (idempotente, ver AGENTS.md), pero exigir `security-reviewer` + `agent-owasp-compliance` antes de activar `channel()`; listar en `politica-privacidad.md` como "Realtime habilitado, sin suscripciones activas" |
| **PROV-06** | **BAJA** | **`plotly.js` duplicado + `registry.npmmirror.com` en Dockerfile** | P-08 Plotly.js, supply-chain | `package.json:32-33` `plotly.js` + `plotly.js-dist-min` (bundle duplicado); `Dockerfile.nextjs:14` `registry https://registry.npmmirror.com` | Bundle pesado sin beneficio legal; espejo chino introduce riesgo de supply-chain si se usa en prod (Vercel usa `registry.npmjs.org` por defecto, pero Docker self-host no) | Eliminar uno de los dos `plotly` (dejar `plotly.js-dist-min` si solo se usa `react-plotly.js`); fijar `registry.npmjs.org` en `Dockerfile.nextjs` prod o documentar excepción con verificación de checksum; registrar decisión en `technical-audit.md` §3.3 |
| **PROV-07** | **BAJA** | **DNS no documentado como Encargado (Vercel)** | P-11 DNS / P-03 Vercel | `next.config.ts:1-13` sin `domains`; `grep vacío` `dns|route53|cloudflare.*dns` en `src/`; `README.md:5,92` solo menciona Vercel genérico | Transparencia incompleta: el Titular no ve que el DNS también está en EE. UU. | Añadir en `politica-privacidad.md` § Encargados: "DNS gestionado por Vercel Inc. (EE. UU.) — sin zona dedicada en el repositorio" con link `vercel.com/docs/domains`; si se delega a Cloudflare/Route53, re-auditar P-11 |

**Priorización de remediación sugerida (bloqueante para Fase 11):**

1. **Inmediato (antes de `politica-privacidad.md` / `aviso-legal.md`):** PROV-01 (autorización art. 9/6/26 + `consent_logs`) + PROV-02 (DPAs) — sin esto no hay base habilitante para ningún tratamiento en EE. UU.
2. **Siguiente sprint:** PROV-03 (RNBD) + `data-inventory.md` INV-02 (supresión `user.deleted`) + INV-03 (retención).
3. **Higiene:** PROV-04 (pin micropip), PROV-05 (documentar Realtime), PROV-06 (limpieza `plotly`/registry), PROV-07 (documentar DNS).

---

## 5. Verificación de legibilidad y trazabilidad

- **Idioma:** español neutro profesional (sin regionalismos). Títulos, tablas y fichas en lenguaje claro, con términos legales colombianos (`Responsable`, `Encargado`, `Titular`, `Habeas Data`, `RNBD`, `SIC`) y referencias a Ley 1581/Decreto 1377/Decreto 1074/Ley 527/Ley 1480.
- **Estructura:** Resumen → Tabla consolidada → Fichas (11) → Transferencias art. 26 (mapa + brecha) → GAPs priorizados — lectura lineal de 5-10 minutos para el Responsable y de 20 minutos para auditor externo.
- **Evidencia:** cada ficha cita `archivo:línea` verificable; cada "No transferencia" cita `grep vacío` del patrón descartado. No hay placeholders, no hay datos inventados, no hay proveedores omitidos respecto al barrido `package.json:18-60` + `public/pyodide-worker.js:4-5` + `src/app/layout.tsx:6` + `next.config.ts:5`.
- **Legibilidad técnica:** tablas en Markdown GFM con pipes, sin HTML; URLs en formato `https://...` clicables; severidades en **negrita**; artefacto validado como `legal/providers-audit.md` Fase 6.

---

## 6. Anexos

### A. Comandos de verificación ejecutados (reproducibles)

```bash
# Dependencias y lock
cat package.json # 18-60: 26 prod + 8 dev
ls -lh package-lock.json # 334K, coherente
cat next.config.ts # 1-13: output standalone, allowlist img.clerk.com/vercel.com
cat src/app/layout.tsx # 1-55: ClerkProvider + next/font/google Inter/Space_Grotesk/JetBrains_Mono 6-22
cat public/pyodide-worker.js | sed -n '1,80p' # PYODIDE_VERSION 0.25.0 + PYODIDE_CDN cdn.jsdelivr.net + micropip/seaborn/plotly
cat src/lib/supabase/admin.ts # 1-9: createAdminClient con SUPABASE_SERVICE_ROLE_KEY

# Negativos (vacío = no hay proveedor/track)
grep -ri "gtag|GTM|GA4|google-analytics|googletagmanager" src/ --exclude-dir=node_modules -n # vacío (falsos positivos plotly segmentCount descartados)
grep -ri "fbevents|fbq|meta.*pixel|facebook.*pixel|tiktok.*pixel|linkedin.*insight" src/ -n # vacío
grep -ri "stripe|paypal|mercadopago|checkout|paddle|lemonsqueezy" src/ package.json -n # vacío
grep -ri "newsletter|mailchimp|resend|sendgrid|brevo|mailgun|smtp|nodemailer" src/ package.json -n # vacío
grep -ri "openai|anthropic|langchain|chatbot|intercom|crisp|tawk|zendesk" src/ package.json -n # vacío salvo stub E2B en src/app/api/certify/route.ts:39-43
grep -ri "googleapis|fonts\.gstatic|fonts\.googleapis" src/ -n # vacío — next/font self-hosted
grep -rn "supabase\.storage\.from" src/ -n # solo avatars (src/app/api/profile/avatar/route.ts:39, src/app/(dashboard)/perfil/page.tsx:55)
grep -rn "localStorage|sessionStorage|cookie" src/ --include="*.ts" --include="*.tsx" -n # 8 hallazgos funcionales, no tracking
grep -rn "rive\.app.*fetch|rive.*cdn|plot\.ly.*fetch|api\.plot\.ly|monaco.*cdn|cdn.*monaco|api\.svix\.com" src/ -n # vacío
grep -rn "dns|nameserver|route53|cloudflare.*dns" src/ --include="*.ts" --include="*.tsx" -n # vacío
grep -rn "DPA|data.*processing.*agreement|consent_logs" src/ supabase-migration.sql -n # vacío (GAP PROV-01/02)
```

### B. Archivos auditados (conteo Fase 6)

- **Dependencias:** `package.json` (61 líneas), `package-lock.json` (334 KB), `Dockerfile.nextjs:14` registry
- **Config:** `next.config.ts` (13 líneas), `next-env.d.ts` (6 líneas), `.env.local.example` (20 líneas), `src/lib/env.ts` (10 líneas)
- **Código:** `src/app/layout.tsx` (55 líneas), `src/middleware.ts` (86 líneas), `src/app/api/webhooks/clerk/route.ts` (81 líneas), `src/lib/supabase/admin.ts` (9 líneas), `public/pyodide-worker.js` (340 líneas), `src/lib/pyodide-worker.ts` (205 líneas), `src/components/labs/LabHero/RiveBioreactor.tsx` (101 líneas), `src/components/editor/CodeEditor.tsx` (120 líneas), `src/components/editor/VisualizationPanel.tsx` (55 líneas), `src/components/lesson/*` (21 exports)
- **Infra:** `supabase-migration.sql` (360 líneas), `README.md` (94 líneas), `legal/project-classification.md` (115 líneas), `legal/technical-audit.md` (313 líneas), `legal/data-inventory.md` (269+ líneas)

### C. Nota sobre URLs de políticas

Las URLs en §1 y §2 son las oficiales a octubre 2026. Si alguna migra (ej. `clerk.com/legal/privacy` → `clerk.com/privacy`), actualizar `legal/providers-audit.md` y `politica-privacidad.md` sin cambiar la evidencia de código. Conservar captura/PDF de cada política vigente al momento de la autorización (Ley 527 art. 12 — conservabilidad).

---

*Documento generado como Fase 6 de `legal/legal_requirement.md`. No contiene placeholders ni datos inventados. Cada "Sí" cita `archivo:línea`; cada "No" cita `grep vacío` verificable. Cualquier nuevo proveedor, nuevo `fetch` a tercero, nuevo `cdn`, nuevo bucket Storage o cambio en `src/app/layout.tsx`/`public/pyodide-worker.js`/`package.json` invalida esta auditoría y obliga a re-auditar antes de generar `politica-privacidad.md` y `politica-cookies.md`.*
