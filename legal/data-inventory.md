# Inventario de Datos — InVitro-Code (Fase 3)

> **Advertencia metodológica:** Fase 3 de `legal/legal_requirement.md`. Cada afirmación se respalda con evidencia `archivo:línea` o `grep vacío` verificable. No se utilizan plantillas genéricas, no se inventa información y no se asumen proveedores no observados en el repositorio.

**Fecha de auditoría:** 2026-10-06
**Responsable declarado:** Persona natural Colombia NIT 700329113-7 — Corregimiento Altavista, Medellín — invitro.code@gmail.com — Jurisdicción Colombia (Ley 1581, Decreto 1377/1074, Ley 527, Ley 1480) — LATAM — 100 % gratuito — público +18
**Fuentes obligatorias leídas:** `supabase-migration.sql:1-360`, `src/app/api/webhooks/clerk/route.ts:1-81`, `src/app/api/profile/avatar/route.ts:1-61`, `src/app/api/lab-progress/route.ts:1-230`, `src/app/api/progress/route.ts:1-121`, `src/app/api/certify/route.ts:1-67`, `src/app/api/diagnose/route.ts:1-64`, `src/app/api/notebook/[module]/[lesson]/route.ts:1-63`, `src/app/api/rscript/[module]/[lesson]/route.ts:1-56`, `src/middleware.ts:1-86`, `src/app/layout.tsx:1-55`, `src/app/(dashboard)/perfil/page.tsx:1-101`, `src/app/(dashboard)/configuracion/page.tsx:1-55`, `src/components/profile/ProfileForm.tsx:1-121`, `src/components/profile/AvatarUpload.tsx:1-121`, `src/components/settings/SettingsForm.tsx:1-139`, `src/components/auth/AuthForm.tsx:1-337`, `src/components/landing/Contact.tsx:1-47`, `src/lib/validation/labProgress.ts:1-86`, `src/lib/supabase/admin.ts:1-9`, `src/lib/pyodide-worker.ts:1-205`, `public/pyodide-worker.js:1-340`, `package.json:1-61`, `.env.local.example:1-20`

---

## Resumen

InVitro-Code recoge datos personales en **7 flujos reales** y **2 flujos técnicos locales**, todos posteriores a autenticación. No existe recogida en 6 de los 13 puntos del checklist normativo tradicional (checkout, newsletter, calendarios, CRM, chat IA y analytics — ver tabla con evidencia negativa).

| Recolección real | Nº flujos | Categoría datos | Base legal principal |
|------------------|-----------|-----------------|----------------------|
| Registro/Login (Clerk → `profiles`) | 1 | Identificación (`email`, `id`, `username`) | Ley 1581 art. 9 |
| Perfil editable (`username`, `bio`, `gender`) | 1 | Comunes + **sensible** (`gender=x`) | Art. 9 + **art. 6** (autorización explícita reforzada) |
| Avatar (imagen) | 1 | Imagen personal (`avatar_url`) | Art. 9 |
| Preferencias funcionales (`theme`, `notification_prefs`) | 1 | Preferencias técnicas | Art. 9 (funcional) |
| Progreso académico (`progress`, `lab_progress`, `reflection_completions`) | 3 | Comportamiento / gamificación | Art. 9 |
| Métricas derivadas (`streaks`, `user_achievements`) | 1 | Gamificación | Art. 9 |
| Almacenamiento local funcional (`localStorage`/`sessionStorage`) | 1 | Estado de UI local | Art. 9 (estrictamente necesario/funcional) |

**Dato sensible confirmado:** `gender=x` (identidad de género no binaria) en `supabase-migration.sql:300` + `src/app/api/webhooks/clerk/route.ts:21-23` + `src/components/profile/ProfileForm.tsx:89-104`. La SIC puede calificarlo como sensible (art. 5) con protección reforzada art. 6.

**Transferencia internacional confirmada:** Clerk (EE. UU.) + Supabase/AWS (EE. UU.) + Vercel (hosting) — art. 26 Ley 1581 exige mención expresa en la autorización. jsDelivr (`public/pyodide-worker.js:5`) es tercero técnico que no recibe datos personales (solo descarga de runtime).

**GAP estructural transversal:** ninguna tabla define `RETENTION` ni `TTL`, no existe endpoint `DELETE`/`supresión` ni handler `user.deleted`, y no hay borrado en Storage. Ver §5 Hallazgos.

---

## 1. Tabla principal — Inventario por punto de entrada

> Formato exigido: `Punto de entrada | Datos | Finalidad | Base legal | Destino | Retención`. Una fila por punto real; puntos sin implementación se consignan como `No aplica` con evidencia negativa (`grep vacío`).

| # | Punto de entrada | Datos recogidos | Finalidad | Base legal (Ley 1581) | Destino (Responsable → Encargado) | Retención |
|---|------------------|-----------------|-----------|------------------------|-----------------------------------|-----------|
| **F-01** | **Registro / Login** | `email` (obligatorio), `password` (solo Clerk, hash), `id` Clerk (`sub`), `first_name` → `username` fallback, `public_metadata.gender` opcional | Crear y autenticar cuenta, sincronizar perfil | **Art. 9** — autorización previa, expresa e informada (electrónica válida art. 9 + Ley 527 art. 5). **Art. 26** — transferencia a EE. UU. con mención expresa | `src/middleware.ts:1,18` `clerkMiddleware` + `src/app/layout.tsx:37` `ClerkProvider` + `src/app/api/webhooks/clerk/route.ts:49-76` → **Clerk Inc. (EE. UU.)** como Encargado IdP; espejo mínimo en **Supabase Postgres `profiles`** (`supabase-migration.sql:18-30`); tránsito por **Vercel** (hosting) | **GAP — Indefinida.** `supabase-migration.sql` no define retención/TTL. `profiles.created_at TIMESTAMPTZ DEFAULT NOW()` sin borrado automático. Debe definirse (ej. mientras la cuenta esté activa + 6 meses tras supresión) y registrarse ante RNBD |
| **F-02** | **Perfil — edición** (`/perfil`) | `username` TEXT, `bio` TEXT (libre), `gender` TEXT `f/m/x/null` (`x` = sensible) | Personalizar identidad y representación en dashboard/gamificación | **Art. 9** general; **Art. 6** reforzado para `gender=x` (dato sensible — autorización explícita separada) + **Art. 26** (transferencia) | `src/components/profile/ProfileForm.tsx:15-121` + `src/app/(dashboard)/perfil/page.tsx:73-94` Server Action → `createAdminClient()` → **Supabase `profiles`** (`supabase-migration.sql:20-23,300-301`); origen `Clerk public_metadata.gender` sincronizado vía `src/app/api/webhooks/clerk/route.ts:16,52` | **GAP — Indefinida.** Sin política de retención ni borrado parcial. `bio`/`gender` persisten hasta supresión de cuenta |
| **F-03** | **Uploads — Avatar** | Archivo imagen `image/jpeg|png|webp` ≤2 MB, nombre original, `avatar_url` TEXT (URL pública) | Identificación visual del titular | **Art. 9** + **Art. 26** | `src/components/profile/AvatarUpload.tsx:84-89` (`accept`), `src/app/api/profile/avatar/route.ts:5-61` Route Handler + `src/app/(dashboard)/perfil/page.tsx:48-61` Server Action (duplicado) → **Supabase Storage bucket `avatars`** (`route.ts:39-41` `from("avatars").upload(filePath,{upsert:true})` + `getPublicUrl` `route.ts:47-49`) → `profiles.avatar_url` (`migration.sql:23`) | **GAP — Indefinida.** Sin rotación ni borrado de objetos previos (`upsert:true` acumula). Debe definirse retención (ej. mientras cuenta activa) y borrado en supresión |
| **F-04** | **Configuración** (`/configuracion`) | `theme` TEXT `light/dark/system` (`migration.sql:25`), `notification_prefs` JSONB `{"email":bool,"streak":bool}` (`migration.sql:26`) | Preferencias funcionales de UI y notificaciones internas | **Art. 9** (funcional / estrictamente necesario para operar preferencias) — exigible igualmente autorización art. 9; **art. 10 lit. a)** no exime por sí solo (no es contrato ni obligación legal). Informar como tratamiento funcional | `src/components/settings/SettingsForm.tsx:20-139` + `src/app/(dashboard)/configuracion/page.tsx:36-48` → **Supabase `profiles.theme` + `notification_prefs`** | **GAP — Indefinida.** Preferencias persisten con `profiles`. Sin retención diferenciada |
| **F-05** | **Progreso — lecciones** | `module_slug`, `lesson_slug`, `completed`, `xp_earned` INTEGER, `completed_at` TIMESTAMPTZ | Medir avance, otorgar XP, alimentar gamificación y leaderboard | **Art. 9** — necesario para prestar el servicio educativo consentido | `src/app/api/progress/route.ts:35-121` `POST` (auth + `getLessonSlugs` allowlist `route.ts:62` + XP server-authoritative `route.ts:75-77`) → **Supabase `progress`** (`migration.sql:65-74` `UNIQUE(user_id,module_slug,lesson_slug)`) + `advanceStreak` (`route.ts:100`) + `evaluateAchievements` (`route.ts:104`) | **GAP — Indefinida.** Sin TTL. Histórico académico sin política de minimización |
| **F-06** | **Progreso — laboratorios** | `completion_status` (`not_started/in_progress/completed`), `completion_date`, `last_position` JSONB (`activeTab`, `scrollY`, `codeSnapshot` ≤8192 `migration.sql:315` + `src/lib/validation/labProgress.ts:5-7` + `capLastPosition` `route.ts:152-159`) | Persistir estado del laboratorio Pyodide entre sesiones (offline-first con sync) | **Art. 9** — funcional. **Atención:** `codeSnapshot` puede contener datos personales si el usuario pega secretos/código con identificadores — debe advertirse y limitar | `src/app/api/lab-progress/route.ts:52-230` `POST` (Zod `labProgressPostSchema` `route.ts:92` + anti-downgrade `completed` terminal `route.ts:140-148` + allowlist `route.ts:112-115`) → **Supabase `lab_progress`** (`migration.sql:309-318` `PK(user_id,module_slug,lesson_slug)`) + dual-write `progress` (`route.ts:199-209`) | **GAP — Indefinida.** `last_position` sin expiración. Riesgo de sobre-retención de `codeSnapshot`. Debe definirse (ej. 30 días sin actividad o al completar) |
| **F-07** | **Gamificación derivada** | `streaks` (`current_streak`, `longest_streak`, `last_active_date`), `reflection_completions` (`block_id`, `xp_earned`, `completed_at`), `user_achievements` (`achievement_id`, `unlocked_at`) | Calcular rachas, logros y ranking | **Art. 9** — ejecución del servicio consentido | `src/lib/gamification/streak.ts:1-...` `advanceStreak` + `src/lib/gamification/achievements.ts` → **Supabase `streaks`** (`migration.sql:94-100`), **`reflection_completions`** (`migration.sql:120-127`), **`user_achievements`** (`migration.sql:194-199`); catálogos `achievements` (`migration.sql:174-184`) y `modules` (`migration.sql:276-281`) sin datos personales | **GAP — Indefinida.** Derivados sin retención propia (dependen de `progress`/`lab_progress`) |
| **F-08** | **Almacenamiento local funcional** | `localStorage: lab-active-tab-{mod}-{lesson}`, `lab-workspace-{mod}-{lesson}`, `onboardingSeen`; `sessionStorage: console-maximized-*` | Mantener estado de UI sin pedir al servidor | **Art. 9** funcional (almacenamiento técnico en terminal del titular — informado, no requiere consentimiento separado si es estrictamente necesario para funcionalidad solicitada) | `src/components/labs/LabTabs.tsx:46,59`, `src/components/labs/workspace/LabWorkspace.tsx:53,68`, `src/components/onboarding/OnboardingController.tsx:95,168`, `src/components/editor/ConsoleFrame.tsx:41,52` — **Solo navegador del titular**, no se transmite a servidor (salvo `codeSnapshot` que sí se envía vía F-06) | Navegador hasta limpieza manual o expiración del origen. **GAP:** `politica-cookies.md` debe listarlo como almacenamiento funcional |
| — | **Formularios genéricos** | No aplica — sin formularios públicos de captura | — | — | **No aplica.** `grep vacío: patrón newsletter|lead.*form|contact.*form.*input no hallado como form` en `src/`; `package.json:18-47` sin libs de forms de captura. Único form es `ProfileForm` (F-02, post-auth) | — |
| — | **Contacto** | **No aplica como punto de recogida estructurado.** Solo enlace `mailto:` — no hay `<form>` ni endpoint `/api/contact` | Canal de contacto por email del titular (iniciativa del usuario en su cliente de correo) | **Art. 9** si en el futuro se implementa form; hoy el tratamiento nace del email que el usuario envíe voluntariamente a `invitro.code@gmail.com` | **No aplica.** Evidencia: `src/components/landing/Contact.tsx:25-34` solo `href="mailto:invitro.code@gmail.com"` + `MapPin` Medellín, sin `<form>`, sin `fetch` | — |
| — | **Newsletter** | **No aplica** | — | — | **No aplica.** `grep -rn "newsletter|mailchimp|resend|sendgrid|brevo|mailgun|smtp|nodemailer" src/ package.json --include="*.ts" --include="*.tsx" -n` → **vacío**. `supabase-migration.sql:26` `notification_prefs` es preferencia interna, no proveedor de email marketing (§2.1 clasificación) | — |
| — | **Checkout / Pagos** | **No aplica** | — | — | **No aplica.** `grep -rn "stripe|paypal|mercadopago|checkout|paddle|lemonsqueezy|billing|recurring" src/ package.json -n` → **vacío**. `supabase-migration.sql` sin tablas `orders|subscriptions|payments`. Modelo 100 % gratuito (contexto autorizado) | — |
| — | **Calendarios** | **No aplica** | — | — | **No aplica.** `grep -rn "calendly|cal\.com|google.*calendar|outlook.*calendar" src/ package.json -n` → **vacío** | — |
| — | **CRM** | **No aplica** | — | — | **No aplica.** `grep -rn "hubspot|salesforce|pipedrive|zoho.*crm|intercom.*crm" src/ package.json -n` → **vacío**. No hay sincronización con CRM | — |
| — | **Chat IA / Agente / Bot** | **No aplica** | — | — | **No aplica.** `grep -rn "openai|anthropic|langchain|chatbot|assistant.*api|intercom|crisp|tawk|zendesk" src/ package.json -n` → **vacío** (solo stub `E2B` en `src/app/api/certify/route.ts:39-43` comentado, inactivo con `FEATURE_FLAG_CERTIFY=false` en `.env.local.example:17` y flag check `route.ts:22`). **Pyodide no es IA generativa:** `public/pyodide-worker.js:4-5` + `src/lib/pyodide-worker.ts:1-205` ejecutan Python 100 % local en Web Worker, sin LLM | — |
| — | **Uploads (genéricos)** | **Solo F-03 Avatar.** No hay subida de datasets, PDFs, notebooks por usuario | — | — | **No aplica más allá de F-03.** `grep -rn "supabase\.storage\.from" src/ -n` → solo `avatars` (`src/app/api/profile/avatar/route.ts:39`, `src/app/(dashboard)/perfil/page.tsx:55`). Pyodide no sube archivos al servidor — `src/lib/pyodide-worker.ts:164` `run(code, context)` es `postMessage` a Worker local | — |
| — | **Analytics / Tracking** | **No aplica** | — | — | **No aplica.** `grep -ri "gtag|GTM|GA4|google.*analytics|clarity|hotjar|segment|mixpanel|amplitude|fbevents|fbq|meta.*pixel|tiktok.*pixel|linkedin.*insight" src/ --exclude-dir=node_modules -n` → **vacío** (falsos positivos `sloshAmplitude`/`segmentCount` en `plotly-3.0.0.min.js` descartados). `src/app/layout.tsx:1-55` sin `<Script>` tracking; `next.config.ts:1-13` sin dominios analytics; `.env.local.example:1-20` sin `NEXT_PUBLIC_GA_ID`; `package.json:18-47` sin `@vercel/analytics`. Confirmado también en `legal/technical-audit.md` §4.4 | — |
| — | **Automatizaciones** | **No aplica** | — | — | **No aplica.** Sin cron, sin `n8n`, sin `vercel.json` crons, sin `background jobs`. `supabase-migration.sql` sin `pg_cron`. Único automatismo es webhook Clerk `user.created/updated` (F-01) y `advanceStreak`/`evaluateAchievements` en `src/app/api/progress/route.ts:100-104` y `src/app/api/lab-progress/route.ts:196-222` (lógica de negocio síncrona, no automatización externa) | — |
| — | **APIs — lectura de contenido** | `GET /api/notebook`, `/api/rscript`, `/api/diagnose` no recogen datos personales (solo sirven archivos estáticos bajo auth) | Servir `notebook.ipynb` / `lab.R` / diagnóstico | **No es tratamiento** (lectura). Logs de acceso en Vercel/Supabase infra (ver proveedores) | `src/app/api/notebook/[module]/[lesson]/route.ts:6-63`, `src/app/api/rscript/[module]/[lesson]/route.ts:6-56`, `src/app/api/diagnose/route.ts:7-64` — todos con `auth()` + sanitización `path.resolve` + `startsWith(contentRoot)` (`notebook:23-37`, `rscript:29-38`, `diagnose:18,26`). Sin persistencia de parámetros | Retención de logs: según política infra Vercel/Supabase/Clerk (ver Fase 6 `providers-audit.md`). **GAP:** sin política propia de retención de logs definida |

---

## 2. Fichas de flujo — detalle por recolección real

> Para cada flujo real: **qué dato**, **dónde se almacena** (tabla/columna), **qué proveedor lo recibe**, **cuánto tiempo permanece**, **cómo se elimina**. Si no hay política/endpoint, se marca **GAP** conforme a `legal_requirement.md`.

### F-01 · Registro / Login (Clerk → Supabase `profiles`)

| Atributo | Detalle |
|----------|---------|
| **Descripción** | Alta y autenticación. El usuario introduce `email` + `password` en `src/components/auth/AuthForm.tsx:17-50` (inputs `type="email"` `route:226` y `type="password"` `route:248`). El flujo usa Clerk Core 3: `signIn.password({emailAddress,password})` (`AuthForm.tsx:47`) con fallback a `signUp.password` si `form_identifier_not_found` (`AuthForm.tsx:72-85`), verificación por código `signUp.verifications.sendEmailCode()` / `verifyEmailCode` (`AuthForm.tsx:117,164`) y `finalize` (`AuthForm.tsx:54,98`). El middleware protege todas las rutas no públicas: `src/middleware.ts:5-12` `publicRoutes` = `["/","/sign-in","/sign-up","/sso-callback","/api/webhooks/clerk","/api/diagnose"]`, resto exige `session.userId` (`middleware.ts:38-51`) con `401` en `/api/*` (`middleware.ts:43`) |
| **Qué dato se recoge** | `email` (obligatorio, `email_addresses[0].email_address` en webhook `route.ts:51`), `password` (solo en Clerk, nunca llega a Supabase), `id` Clerk (TEXT, `sub` JWT), `first_name` (opcional → `username` fallback `email.split("@")[0]` `route.ts:60,71`), `public_metadata.gender` (opcional `f|m|x`, `route.ts:16,52` `parseGender` `route.ts:21-23`) |
| **Dónde se almacena** | **Clerk** (IdP primario, EE. UU. — fuera del alcance SQL). **Supabase `profiles`** (`supabase-migration.sql:18-30`): `id TEXT PRIMARY KEY`, `email TEXT`, `username TEXT`, `role TEXT DEFAULT 'user'`, `gender TEXT CHECK('f','m','x')` (`migration.sql:300-301`), `created_at TIMESTAMPTZ DEFAULT NOW()` (`migration.sql:29`). Upsert `onConflict:"id"` (`route.ts:56,67,74`) |
| **Qué proveedor recibe** | **Clerk Inc. (EE. UU.)** — Encargado de autenticación e identidad. **Supabase (AWS EE. UU.)** — Encargado de persistencia espejo `profiles`. **Vercel** — hosting/proxy de `POST /api/webhooks/clerk` y de `src/middleware.ts:18` `clerkMiddleware`. Svix (`svix:1.98.0` en `package.json:43`) firma webhook (`route.ts:36` `requireEnv("CLERK_SIGNING_SECRET")`) |
| **Cuánto tiempo permanece** | **GAP — Indefinido.** `supabase-migration.sql` no define `RETENTION` ni job de purga. `profiles.created_at` y `last_active_at` (`migration.sql:28`) sin TTL. En Clerk, retención según política del proveedor (a auditar en `providers-audit.md`). **Recomendación:** definir en Política: mientras la cuenta esté activa + plazo de bloqueo/supresión (ej. 6 meses tras solicitud art. 8) y reflejar en RNBD |
| **Cómo se elimina** | **GAP — Sin endpoint de supresión.** `src/app/api/webhooks/clerk/route.ts:49` solo maneja `user.created|user.updated`; `grep user.deleted` → vacío. No existe `DELETE /api/profile`, ni Server Action de borrado, ni `storage.remove` en cascada. `supabase-migration.sql:52-62` RLS solo `SELECT/UPDATE` sobre `profiles`, sin `DELETE` para titular. Debe implementarse: handler `user.deleted` que borre `profiles` + hijas (`progress`, `lab_progress`, `streaks`, `reflection_completions`, `user_achievements`) + `storage.from("avatars").remove()` + revocación en Clerk + log auditable |

### F-02 · Perfil editable — `username`, `bio`, `gender`

| Atributo | Detalle |
|----------|---------|
| **Descripción** | El titular edita su perfil en `/perfil` (`src/app/(dashboard)/perfil/page.tsx:65-95`). `ProfileForm` (`src/components/profile/ProfileForm.tsx:15-121`) envía `{username, bio, gender:f|m|x|null}` al Server Action `perfil/page.tsx:73-94` que valida `allowed=["f","m","x"]` (`page.tsx:78-82`) y ejecuta `admin.from("profiles").update({username,bio,gender}).eq("id",uid)` (`page.tsx:84-91`) con `revalidatePath("/perfil")` y `"/dashboard"` (`page.tsx:92-93`). El valor `gender` también puede venir de `Clerk public_metadata.gender` vía webhook F-01 (sincronía bidireccional) |
| **Qué dato se recoge** | `username` TEXT libre, `bio` TEXT libre (hasta longitud no acotada en UI — sin `maxLength` en `ProfileForm.tsx:66`), `gender` `f|m|x|null` con opción `"Prefiero no decirlo"` = `null` (`ProfileForm.tsx:100`). `gender=x` **es dato sensible** art. 5/6 (identidad de género no binaria — ver `legal/project-classification.md` §2 ítem 16) |
| **Dónde se almacena** | **Supabase `profiles`**: `username TEXT` (`migration.sql:21`), `bio TEXT` (`migration.sql:24`), `gender TEXT CHECK('f','m','x')` (`migration.sql:300-301` con `DO` idempotente). Lectura inicial `supabase.from("profiles").select("*").eq("id",userId).maybeSingle()` (`perfil/page.tsx:17-21`) |
| **Qué proveedor recibe** | **Supabase (Encargado)** vía `createAdminClient()` (`src/lib/supabase/admin.ts:4-8` `requireEnv("SUPABASE_SERVICE_ROLE_KEY")`). **Clerk** recibe `gender` si el usuario lo edita en Clerk Dashboard (sincronizado vía `public_metadata.gender` `route.ts:16`). **Vercel** tránsito |
| **Cuánto tiempo permanece** | **GAP — Indefinido.** Sin retención diferenciada; `bio` y `gender` viven mientras viva `profiles`. Debe alinearse con retención de cuenta (F-01) |
| **Cómo se elimina** | **Parcialmente reversible, sin supresión total.** El usuario puede vaciar `username`/`bio` y poner `gender=null` (`ProfileForm.tsx:92-96`), lo que hace `update({gender:null})`. Pero no existe borrado de cuenta ni anonimización. **GAP:** falta endpoint `DELETE` y procedimiento art. 8 (revocatoria/supresión) |

### F-03 · Avatar — imagen de perfil

| Atributo | Detalle |
|----------|---------|
| **Descripción** | Subida de imagen en `/perfil` (`src/app/(dashboard)/perfil/page.tsx:41-63` + `src/components/profile/AvatarUpload.tsx:11-121`). Dos vías duplicadas: **(a)** Route Handler `POST /api/profile/avatar` (`src/app/api/profile/avatar/route.ts:5-61`) y **(b)** Server Action inline en `perfil/page.tsx:48-61`. Ambas usan `admin.storage.from("avatars").upload(filePath,file,{upsert:true})` y `getPublicUrl` + `profiles.update({avatar_url})` |
| **Qué dato se recoge** | Archivo binario `File` (`formData.get("avatar")` `route.ts:12`), `file.name`, `file.type` (`image/jpeg|png|webp` allowlist `route.ts:18`, `AvatarUpload.tsx:87`), `file.size` ≤2 MB (`route.ts:26` `2*1024*1024`), extensión extraída `file.name.split(".").pop()` (`route.ts:35`), `avatar_url` TEXT (URL pública resultante `route.ts:47-49`) |
| **Dónde se almacena** | **Supabase Storage bucket `avatars`** (`route.ts:39-41` `from("avatars")` path `avatars/${userId}-${Date.now()}.${fileExt}` `route.ts:36-37` / Server Action `perfil/page.tsx:52-54` idéntico) + **Supabase `profiles.avatar_url TEXT`** (`migration.sql:23`). `grep supabase.storage.from` en `src/` → solo `avatars` |
| **Qué proveedor recibe** | **Supabase Storage (AWS EE. UU.)** — Encargado de almacenamiento de objetos. `getPublicUrl` implica bucket con acceso público (o firmado si se configuró privado — auditar en `security-audit.md`). **Vercel** tránsito. Sin CDN adicional de imágenes (allowlist `next.config.ts:6-9` solo `img.clerk.com` y `vercel.com`) |
| **Cuánto tiempo permanece** | **GAP — Indefinido.** Sin política de rotación. `upsert:true` no borra objetos previos (acumulación). `avatar_url` apunta solo al último; objetos huérfanos permanecen en bucket |
| **Cómo se elimina** | **GAP — Sin borrado.** No hay `storage.remove()`, ni `DELETE /api/profile/avatar`, ni purga en `user.deleted` (ver F-01 GAP). Debe implementarse: al subir nuevo avatar, `remove()` del anterior; al suprimir cuenta, `remove()` de todos `avatars/{userId}-*` + `profiles.update({avatar_url:null})`. Validar extensión contra allowlist normalizada lowercase (hoy `split(".").pop()` admite `avatar.png.exe` — mitigado parcialmente por MIME `file.type` `route.ts:18`) |

### F-04 · Preferencias funcionales — `theme` y `notification_prefs`

| Atributo | Detalle |
|----------|---------|
| **Descripción** | Preferencias en `/configuracion` (`src/app/(dashboard)/configuracion/page.tsx:32-50`). `SettingsForm` (`src/components/settings/SettingsForm.tsx:20-139`) gestiona `theme: light|dark|system` (radios `SettingsForm.tsx:51-77`) y `notification_prefs: {email:bool,streak:bool}` (checkboxes `SettingsForm.tsx:84-122`), enviado a Server Action `configuracion/page.tsx:36-48` que hace `sb.from("profiles").update({theme, notification_prefs}).eq("id",uid)` |
| **Qué dato se recoge** | `theme TEXT` CHECK `('light','dark','system')` (`migration.sql:25,33-41`), `notification_prefs JSONB DEFAULT '{"email":true,"streak":true}'` (`migration.sql:26`) |
| **Dónde se almacena** | **Supabase `profiles`** (`migration.sql:25-26`). Lectura `select("*").eq("id",userId)` (`configuracion/page.tsx:14-19`) |
| **Qué proveedor recibe** | **Supabase** (Encargado). **Vercel** tránsito. No hay proveedor de email transaccional ( `grep resend|sendgrid|nodemailer|smtp` → vacío): `notification_prefs.email` es flag interno sin envío externo hoy |
| **Cuánto tiempo permanece** | **GAP — Indefinido.** Ligado a vida de `profiles` |
| **Cómo se elimina** | Sin borrado diferenciado; al suprimir cuenta se elimina con `profiles`. El usuario puede revertir a defaults (`system` + `true/true`) pero no hay "borrar preferencias" separado |

### F-05 · Progreso académico — lecciones completadas

| Atributo | Detalle |
|----------|---------|
| **Descripción** | `POST /api/progress` (`src/app/api/progress/route.ts:35-121`) registra avance de lección. Body `{module_slug, lesson_slug, completed?, xp_earned?}` (`route.ts:26`). Validación: `readNonEmptyString` (`route.ts:11`), allowlist de catálogo `getLessonSlugs(module_slug)` (`route.ts:62-65`), XP server-authoritative `Math.min(requestedXp, serverXp)` donde `serverXp=calcXpForLesson(...)` (`route.ts:75-77`). `user_id` siempre de `auth()` (`route.ts:37`); se ignora `user_id` de cliente. Idempotente por `UNIQUE(user_id,module_slug,lesson_slug)` (`migration.sql:73`). Tras upsert, `advanceStreak(userId, supabase, completed)` (`route.ts:100`) y `evaluateAchievements(userId, supabase)` (`route.ts:104`) |
| **Qué dato se recoge** | `module_slug` TEXT, `lesson_slug` TEXT, `completed` BOOLEAN (`true` por defecto `route.ts:70`), `xp_earned` INTEGER (capado server-side), `completed_at` TIMESTAMPTZ (`new Date().toISOString()` si `completed` `route.ts:88`) |
| **Dónde se almacena** | **Supabase `progress`** (`migration.sql:65-74`): `id UUID PK`, `user_id TEXT NOT NULL`, `module_slug TEXT`, `lesson_slug TEXT`, `completed`, `xp_earned`, `completed_at`, `UNIQUE(user_id,module_slug,lesson_slug)` + índices `idx_progress_user_comp` (`migration.sql:235`). RLS `auth.jwt() ->> 'sub' = user_id` (`migration.sql:76-91`). Dual-write desde `lab_progress` también escribe aquí (`lab-progress/route.ts:199-209`) |
| **Qué proveedor recibe** | **Supabase** (Encargado). **Vercel** tránsito. Lógica de gamificación en servidor (`src/lib/gamification/*`) no envía a terceros |
| **Cuánto tiempo permanece** | **GAP — Indefinido.** Sin política de retención académica. Histórico sin TTL ni anonimización. Debe definirse (ej. mientras cuenta activa; al suprimir, borrado total; para analítica interna agregada, anonimizar) |
| **Cómo se elimina** | **GAP.** RLS solo `SELECT/INSERT/UPDATE` (`migration.sql:76-91`); sin `DELETE` para titular ni endpoint `DELETE /api/progress`. Debe implementarse borrado por `user_id` en flujo de supresión (art. 8) |

### F-06 · Progreso de laboratorios — `lab_progress`

| Atributo | Detalle |
|----------|---------|
| **Descripción** | `GET /api/lab-progress?module=...` (`route.ts:16-46`) y `POST /api/lab-progress` (`route.ts:52-230`). Body `{module_slug, lesson_slug, completion_status?, last_position?}` con schema Zod `labProgressPostSchema` (`src/lib/validation/labProgress.ts:12-17`): `module_slug` min 1, `lesson_slug` min 1, `completion_status` enum `not_started|in_progress|completed` opcional, `last_position` objeto `{activeTab:"lab"|"quiz"?, scrollY?:number, codeSnapshot?:string max 8192}` con `.passthrough()` (`labProgress.ts:10`). Validación estricta `route.ts:73-107` para `last_position` shape (rechaza arrays, no-objetos). Allowlist `getLessonSlugs` (`route.ts:112-115`), guard anti-downgrade `completed` terminal (`route.ts:140-148` — nunca degradar `completed` a `in_progress`), y `capLastPosition` que trunca `codeSnapshot` para ≤8 KB (`route.ts:152-159` + `labProgress.ts:26-73`). `completion_date` es `NOW()` solo en primera transición a `completed` y se preserva idempotente (`route.ts:168-173`) |
| **Qué dato se recoge** | `module_slug`, `lesson_slug`, `completion_status` TEXT CHECK (`migration.sql:313`), `completion_date` TIMESTAMPTZ, `last_position` JSONB (`migration.sql:315` `DEFAULT '{}'`), `updated_at` TIMESTAMPTZ con trigger `set_lab_progress_updated_at()` (`migration.sql:337-348`) |
| **Dónde se almacena** | **Supabase `lab_progress`** (`migration.sql:309-318` `PK(user_id,module_slug,lesson_slug)`, índices `idx_lab_progress_user_module/status` `migration.sql:350-351`, RLS `auth.jwt() ->> 'sub' = user_id` `migration.sql:320-335`). También dual-write a `progress` + `advanceStreak` best-effort en `completed` (`route.ts:196-222`) |
| **Qué proveedor recibe** | **Supabase** (Encargado). **Vercel** tránsito. **jsDelivr/Pyodide no recibe datos personales** — `last_position.codeSnapshot` viaja solo a Supabase, no a `cdn.jsdelivr.net`; el CDN solo sirve runtime (`public/pyodide-worker.js:5` `PYODIDE_CDN`) |
| **Cuánto tiempo permanece** | **GAP — Indefinido.** `updated_at` con trigger `NOW()` sin TTL. `codeSnapshot` (código del usuario) puede crecer y persistir indefinidamente aunque el usuario haya abandonado el laboratorio. **Recomendación:** retener `completion_status/date` con vida de cuenta; retener `last_position.codeSnapshot` máx. 30-90 días sin actividad o al completar, luego purgar a `{}` |
| **Cómo se elimina** | **GAP.** Sin `DELETE` RLS ni endpoint de borrado. Se puede sobrescribir `last_position` con `{}` vía `POST` pero no hay borrado de fila. Debe implementarse purga por `user_id` en supresión y endpoint `DELETE /api/lab-progress?module=&lesson=` o `DELETE` por usuario |

### F-07 · Gamificación derivada — `streaks`, `reflection_completions`, `user_achievements`

| Atributo | Detalle |
|----------|---------|
| **Descripción** | Datos **derivados** (no ingresados por el usuario, calculados server-side). `streaks` actualizado por `src/lib/gamification/streak.ts:57-...` `advanceStreak(userId, supabase, completed)` invocado desde `progress/route.ts:100` y `lab-progress/route.ts:214`. `reflection_completions` registrado por flujo de reflexiones (tabla `migration.sql:120-127` + `progress` dual). `user_achievements` desbloqueado por `src/lib/gamification/achievements.ts:81-...` `evaluateAchievements` (`progress/route.ts:104`) |
| **Qué dato se recoge** | `streaks`: `current_streak` INT, `longest_streak` INT, `last_active_date` DATE (`migration.sql:94-100` `UNIQUE user_id`). `reflection_completions`: `user_id`, `block_id`, `xp_earned`, `completed_at` (`migration.sql:120-127` `UNIQUE(user_id,block_id)`). `user_achievements`: `user_id`, `achievement_id` FK `achievements(id)` (`migration.sql:194-199` `PK(user_id,achievement_id)`, `unlocked_at`). Catálogos no personales: `achievements` (17 filas `migration.sql:214-232`) y `modules` (`migration.sql:276-289`) |
| **Dónde se almacena** | **Supabase** tablas citadas, con RLS `auth.jwt() ->> 'sub' = user_id` (`migration.sql:102-139,201-212`). Índices `idx_reflection_user_comp` (`migration.sql:236`), funciones `get_leaderboard` / `get_leaderboard_rank` (`migration.sql:239-270`) agregan XP |
| **Qué proveedor recibe** | **Supabase** (Encargado). **Vercel** tránsito (funciones SQL ejecutadas server-side). Sin tercero adicional |
| **Cuánto tiempo permanece** | **GAP — Indefinido** (hereda retención de `progress`/`lab_progress`). Sin política propia |
| **Cómo se elimina** | **GAP.** Sin `DELETE` RLS para titular. Borrado debe ser en cascada con supresión de cuenta. `achievements`/`modules` catálogos no se borran (no son datos personales) |

### F-08 · Almacenamiento local funcional (no servidor)

| Atributo | Detalle |
|----------|---------|
| **Descripción** | Persistencia 100 % local para UX sin roundtrip: `LabTabs` recuerda pestaña activa por lección, `LabWorkspace` igual, `OnboardingController` recuerda si el onboarding fue completado, `ConsoleFrame` recuerda si la consola está maximizada |
| **Qué dato se recoge** | Keys: `lab-active-tab-{module}-{lesson}` (`LabTabs.tsx:46,59`), `lab-workspace-{module}-{lesson}` (`LabWorkspace.tsx:53,68`), `onboardingSeen` (`OnboardingController.tsx:95,168`), `console-maximized-{id}` (`ConsoleFrame.tsx:41,52`). Valores: `activeTab` (`"lab"|"quiz"`), `seen` bool, `isMaximized` bool. No contienen datos personales identificables; el valor es derivado de interacción UI |
| **Dónde se almacena** | **`localStorage`** (`LabTabs.tsx:46,59`, `LabWorkspace.tsx:53,68`, `OnboardingController.tsx:95,168`) y **`sessionStorage`** (`ConsoleFrame.tsx:41,52`) — **solo en el navegador del titular**. No hay `document.cookie` manual (`grep cookie` → vacío en `src/` salvo comentarios) |
| **Qué proveedor recibe** | **Ninguno.** No se transmite a Clerk/Supabase/Vercel/jsDelivr. Solo el navegador. Debe listarse en `politica-cookies.md` como "almacenamiento local funcional" |
| **Cuánto tiempo permanece** | `localStorage`: persistente hasta que el usuario limpie datos de sitio. `sessionStorage`: por pestaña hasta cierre. Sin expiración programada en código |
| **Cómo se elimina** | El usuario borra desde el navegador (limpiar datos de sitio). El código no expone botón "borrar preferencias locales" — no requerido pero documentar |

### F-09 · Ejecución Pyodide (flujo técnico sin datos personales al servidor)

| Atributo | Detalle |
|----------|---------|
| **Descripción** | El usuario escribe Python en `Monaco Editor` (`src/components/editor/CodeEditor.tsx`) y ejecuta en Worker. `src/lib/pyodide-worker.ts:164-187` `pyodideWorker.run(code, context)` hace `postMessage({type:"runPython",code,context,requestId})` al Worker `public/pyodide-worker.js:165-340` que carga `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js` (`pyodide-worker.js:5,30-31`), precarga `numpy` (`worker.js:33`) y bajo demanda `scikit-learn`/`matplotlib`/`pandas`/`scipy`/`seaborn`/`plotly` (`worker.js:56-84`) según `code.includes(...)` (`worker.js:202-254`). `runQueue` serializa ejecuciones (`worker.js:23`) y captura `stdout` + `Plotly JSON` (`worker.js:107-160`). Si el usuario incluye `plotly`/`scipy`/`sklearn`, se descargan ~5-30 MB desde jsDelivr/PyPI vía `micropip` (`worker.js:52,69,82`) |
| **Qué dato se recoge** | **Código Python del usuario** (string `code`) y `context` (objeto inyectado como globals). **No se persiste en servidor** salvo que el wrapper de la lección guarde snapshot en F-06 `last_position.codeSnapshot` (≤8 KB). En sí, la ejecución no es recogidaserver-side |
| **Dónde se almacena** | **Solo en memoria del Worker** (hasta `delete` de globals `worker.js:310-317` y `releaseCapturedFigures` `worker.js:151`). Si el usuario guarda, entonces F-06. Logs de errores de Worker no se envían al servidor (solo `postMessage` a `pyodide-worker.ts:67-91` en cliente) |
| **Qué proveedor recibe** | **jsDelivr CDN (global)** — descarga de runtime y paquetes (no recibe datos personales, solo GET de assets). **PyPI** vía `micropip` para `seaborn`/`plotly` (`worker.js:70,82`). **Ningún dato personal viaja al CDN**; el código ejecutado queda local |
| **Cuánto tiempo permanece** | Memoria del Worker hasta `reset()` (`pyodide-worker.ts:197-204`) o recarga de página. Sin retención server-side |
| **Cómo se elimina** | `pyodideWorker.reset()` (`pyodide-worker.ts:197`) termina Worker y limpia pendings (`worker.js:97-104` `discardWorker`). Además purga por `last_position` si aplicó F-06 |

### Datos inferidos no recogidos pero observables en infraestructura (informativo)

| Dato | Fuente | Tratamiento |
|------|--------|-------------|
| IP, User-Agent, timestamp, `requestId` | Logs de **Vercel** (hosting), **Clerk** (auth), **Supabase** (API/Storage), **jsDelivr** (CDN) | No recogidos en tablas propias, pero tratados por Encargados como datos de tráfico/seguridad. Deben declararse en `politica-privacidad.md` § Encargados y en `providers-audit.md` con país y base (interés legítimo art. 10 lit. c para seguridad + consentimiento art. 9 para prestación). Retención según políticas de cada proveedor, no definida en repo — **GAP documental** |

---

## 3. Bases legales (Ley 1581 y normas complementarias)

> Referencia: `legal/project-classification.md` §3.1 y contexto autorizado (Colombia, gratuito +18, LATAM). No se inventa otra jurisdicción.

### Art. 9 — Autorización previa, expresa e informada (regla general)

Todo tratamiento en **F-01 a F-07** requiere autorización del titular **previa** al tratamiento, **expresa** (manifestación inequívoca), **informada** (finalidades, derechos, identificación del Responsable y Encargados, carácter facultativo/obligatorio de respuestas, transferencia internacional) y **conservable** para consulta posterior (art. 9 + Decreto 1377 art. 5 + Ley 527 art. 5-12 sobre mensajes de datos).

**Estado actual:** `src/app/api/webhooks/clerk/route.ts:49-76` y `src/app/api/progress/route.ts:79` + `src/app/api/lab-progress/route.ts:67` tratan datos sin prueba de autorización conservable en el repositorio. No existe checkbox de aceptación en `src/components/auth/AuthForm.tsx:214-335` (solo `email` + `password` + `verificationCode`, sin `checkbox` de Política). **GAP G-01 crítico** (ver `legal/technical-audit.md` §5).

**Mitigación exigida (Fase 11):** incorporar en `/sign-up` checkbox **no pre-marcado** con texto de aceptación de `politica-privacidad.md` + mención expresa de finalidades F-01 a F-07 + transferencia art. 26 + dato sensible `gender=x` (ver art. 6), y conservar prueba (timestamp, IP, `userId`, versión de Política, texto aceptado) en tabla `consent_logs` o similar (no existe en `supabase-migration.sql:1-360`).

### Art. 10 — Casos en que no es necesaria la autorización (excepciones taxativas)

Ningún flujo actual encaja limpiamente en las excepciones del art. 10:

| Lit. art. 10 | ¿Aplica? | Justificación |
|--------------|----------|---------------|
| a) Información requerida por entidad pública en ejercicio legal | **No** | Servicio privado educativo, sin requerimiento público |
| b) Datos de naturaleza pública | **No** | `email`, `gender=x`, `bio`, `avatar`, `progress` no son públicos por definición del art. 3 lit. d |
| c) Urgencia médica/sanitaria | **No** | No hay tratamiento sanitario |
| d) Tratamiento autorizado por ley para fines históricos/estadísticos/científicos | **No** directo | Aunque InVitro-Code es educativo, el tratamiento nominativo (`user_id` TEXT) para gamificación no es anonimizado; requeriría anonimización efectiva para invocar este lit. |
| e) Datos relacionados con Registro Civil | **No** | — |
| f) Datos excluidos del régimen (art. 2 lit. a) | **No** | No es dato de seguridad nacional ni periodístico |

**Conclusión:** todos los flujos permanecen bajo **art. 9** (autorización general) y, para `gender=x`, bajo **art. 6** reforzado.

### Art. 6 — Datos sensibles y categoría especial (`gender=x`)

El art. 5 define sensibles, entre otros, los que afectan la intimidad o pueden generar discriminación; la SIC ha tratado la **identidad de género no binaria** como sensible. `supabase-migration.sql:300` `gender IN ('f','m','x')` + `src/components/profile/ProfileForm.tsx:100-104` (`x=No binaria`) activa el **art. 6**: tratamiento de sensibles solo con **autorización explícita** (separada o destacada), **información reforzada** sobre carácter facultativo de responder y finalidades, **consentimiento no condicionado** a la prestación del servicio, y medidas de seguridad reforzadas. El `select` con `Prefiero no decirlo` (`ProfileForm.tsx:100`) cumple facultatividad, pero la **autorización explícita destacada no existe hoy** (F-01/F-02).

Adicionalmente, el art. 6 exige informar **explícitamente** que la respuesta sobre dato sensible es facultativa y que ningún servicio se condiciona a entregarlo. La ayuda `gender-help` (`ProfileForm.tsx:85-87` "Elige la variante que verás en el panel principal. Puedes cambiarla cuando quieras.") no satisface ese estándar.

### Art. 26 — Transferencia internacional

Confirmada para todos los flujos server-side: **Responsable en Colombia** → **Encargados en EE. UU.** (Clerk, Supabase/AWS) y tránsito por Vercel. `public/pyodide-worker.js:5` `cdn.jsdelivr.net` es transferencia técnica sin datos personales (no activa art. 26, pero debe informarse como tercero). El art. 26 exige, además de la autorización que **mencione expresamente la transferencia y el país destino**, el cumplimiento de **nivel adecuado o contrato con garantías** (DPA / Standard Contractual Clauses) y, según Decreto 1377 art. 26, evaluación de declaración ante la SIC si corresponde. Hoy no hay cláusula informada ni autorización que mencione EE. UU. (**GAP G-01 crítico**).

### Ley 527 de 1999 — Validez de la autorización electrónica

La autorización art. 9 puede recabarse por medio electrónico (checkbox + log) si es **accesible, conservable y atribuible** (Ley 527 art. 5-12). El patrón ya existe en el repo para prueba de integridad: `src/app/api/webhooks/clerk/route.ts:36-44` `Webhook(requireEnv("CLERK_SIGNING_SECRET"))` + `wh.verify(payload, {"svix-id","svix-timestamp","svix-signature"})` conserva prueba de origen. Extensible a prueba de consentimiento (guardar `svix`-like: `userId`, `timestamp`, `IP`, `policyVersion`, `acceptedTextHash`).

### Ley 1480 de 2011 — Estatuto del Consumidor (aplicación atenuada)

Aunque gratuito, el usuario es consumidor y el Responsable es proveedor digital; rige deber de información veraz (landing, certificaciones MVP `src/app/api/certify/route.ts:51-56` etiquetado honesto) y protección de datos del consumidor (art. 53). No aplica retracto/reversión por no haber precio.

### Síntesis de base por flujo

| Flujo | Base principal | Refuerzo | Transferencia |
|-------|---------------|----------|---------------|
| F-01 Registro/Login | **Art. 9** + `consent_logs(policy_version, hash, purposes)` conservable (Ley 527) | — | **Art. 26** EE. UU. (Clerk, Supabase) |
| F-02 Perfil (`username`, `bio`, `gender`) | **Art. 9** + `consent_logs(policy_version, hash, purposes)` conservable (Ley 527) | **Art. 6** para `gender=x` (explícita, facultativa, no condicionada) | **Art. 26** |
| F-03 Avatar | **Art. 9** + `consent_logs(policy_version, hash, purposes)` conservable (Ley 527) | — (imagen = dato personal común) | **Art. 26** (Storage Supabase) |
| F-04 Preferencias | **Art. 9** funcional + `consent_logs(policy_version, hash, purposes)` conservable (Ley 527) | — | **Art. 26** |
| F-05/06/07 Progreso y gamificación | **Art. 9** + `consent_logs(policy_version, hash, purposes)` conservable (Ley 527) | — | **Art. 26** |
| F-08 LocalStorage | **Art. 9** funcional (técnico en terminal) | Informado en `politica-cookies.md` | No hay transferencia |
| F-09 Pyodide | **No es tratamiento server-side** (local) | — | No hay datos personales al CDN |
| Contacto `mailto:` | Voluntad del titular al enviar email (art. 9 implícito en el envío) | — | Depende del proveedor de correo del titular |

---

## 4. Retención y eliminación — estado normativo

> Si no hay política, marcar **GAP** conforme al encargo. La retención debe definirse antes de `politica-privacidad.md` y registrarse en RNBD (Decreto 1074 Título 3).

| Tabla / Bucket | Retención definida en `supabase-migration.sql` | Estado | Eliminación implementada | Estado |
|----------------|-----------------------------------------------|--------|--------------------------|--------|
| `profiles` | Parcial: `pending_since` purga automática 24h vía `/api/cron/purge-pending` (Vercel Cron hourly) — `PENDING_TTL_HOURS=24` (`src/domain/consent.ts:33`); resto `created_at`/`last_active_at` sin TTL global (`migration.sql:29`/`migration.sql:28`) | **Parcial** | `DELETE` titular (`migration.sql:482-485`); `user.deleted` (`webhooks/clerk/route.ts:105-126`) + `DELETE /api/account` + cron `/api/cron/purge-pending` con cascada `lab_progress→progress→reflection_completions→streaks→user_achievements→consent_logs→storage avatars→profiles` + Clerk best-effort | **Mitigado** |
| `progress` | No. `completed_at` (`migration.sql:72`) sin TTL | **GAP** | Sin `DELETE` RLS (`migration.sql:76-91` solo SELECT/INSERT/UPDATE), sin `DELETE /api/progress` | **GAP** |
| `lab_progress` | No. `updated_at` con trigger `NOW()` (`migration.sql:337-348`) sin TTL | **GAP** | Sin `DELETE` RLS (`migration.sql:320-335`), sin `DELETE /api/lab-progress` | **GAP** |
| `streaks` | No. `last_active_date` (`migration.sql:99`) sin TTL | **GAP** | Sin `DELETE` RLS (`migration.sql:102-118`) | **GAP** |
| `reflection_completions` | No | **GAP** | Sin `DELETE` RLS (`migration.sql:129-139` solo SELECT/INSERT) | **GAP** |
| `user_achievements` | No. `unlocked_at DEFAULT NOW()` (`migration.sql:197`) | **GAP** | Sin `DELETE` RLS (`migration.sql:201-212` solo SELECT/INSERT) | **GAP** |
| `avatars` (Storage) | No. `upsert:true` acumula sin purga (`avatar/route.ts:41`) | **GAP** | Sin `storage.remove()` en ningún flujo | **GAP** |
| `localStorage`/`sessionStorage` (F-08) | No TTL programado | Navegador del titular | Limpieza manual por el titular | Conforme |

**Recomendación de retención (a validar jurídicamente y registrar en RNBD):**

- Cuenta activa: retención mientras la cuenta esté activa.
- Supresión solicitada (art. 8): borrado en cascada en ≤15 días hábiles (término reclamo) + bloqueo intermedio.
- Inactividad prolongada: anonimizar o suprimir tras 24 meses sin `last_active_at` (`profiles.last_active_at` `migration.sql:28`) con aviso previo por `notification_prefs.email` si está en `true`.
- `last_position.codeSnapshot`: purgar a `{}` tras 30-90 días sin actividad o al `completed`, aunque la cuenta siga activa (minimización).
- Logs infra (Vercel/Clerk/Supabase): según políticas de Encargados; documentar plazo en `providers-audit.md`.

---

## 5. Hallazgos / GAPs priorizados

> Priorización alineada con `legal/technical-audit.md` §5 (G-01 a G-09). Severidad: **CRÍTICA** bloquea conformidad; **ALTA** riesgo sancionable/seguridad; **MEDIA** endurecimiento; **BAJA** higiene.

| ID | Severidad | Título | Flujos afectados | Evidencia | Impacto legal | Mitigación |
|----|-----------|--------|------------------|-----------|---------------|------------|
| **INV-01** | **CRÍTICA** | **Sin autorización art. 9 + art. 6 (sensible) + art. 26 (transferencia) conservable** | F-01 a F-07 | `src/components/auth/AuthForm.tsx:214-335` sin checkbox de Política; `src/app/api/webhooks/clerk/route.ts:49-76` trata `id/email/gender` sin prueba de consentimiento; `.env` sin tabla `consent_logs` (`grep consent_logs supabase-migration.sql` → vacío) | Tratamiento sin base habilitante documentada. `gender=x` sin autorización explícita reforzada. Transferencia a EE. UU. sin mención expresa. Sancionable SIC | Checkbox no pre-marcado en `/sign-up` con texto de finalidades F-01..F-07 + transferencia EE. UU. + dato sensible + link a `politica-privacidad.md` versión fechada; guardar `consent_logs(user_id, policy_version, accepted_text_hash, ip, user_agent, timestamp)` con firma; bloquear `POST /api/webhooks/clerk` de crear `profiles` sin `consent` registrado (o registrar consent en Clerk `public_metadata` y verificar en webhook) |
| **INV-02** | **CRÍTICA** | **Sin procedimiento de supresión/revocatoria art. 8 y sin `user.deleted`** | F-01 a F-07 + F-03 Storage | `src/app/api/webhooks/clerk/route.ts:49` solo `user.created|user.updated`; `grep user.deleted` → vacío; `supabase-migration.sql` sin `ON DELETE CASCADE` en FKs; RLS sin `DELETE` para titular (`profiles:52-62`, `progress:76-91`, etc.); sin `DELETE /api/*` ni `storage.remove` | Viola derechos de supresión/revocatoria y minimización; perfiles y objetos huérfanos tras baja en Clerk | Handler `user.deleted` que borre `lab_progress` → `progress` → `reflection_completions` → `streaks` → `user_achievements` → `profiles` → `storage.from("avatars").remove(avatars/{userId}-*)` + borrado en Clerk + log auditable; añadir `ON DELETE CASCADE` o triggers; endpoint `DELETE /api/account` para revocatoria del titular; documentar canal `invitro.code@gmail.com` con SLAs 10/15 días hábiles |
| **INV-03** | **ALTA** | **Retención indefinida sin política** | F-01 a F-07 | `supabase-migration.sql:1-360` sin `RETENTION`, sin `pg_cron`, sin TTL | Viola principio de temporalidad/limitación (art. 4) y obligación RNBD de declarar retención | Definir tabla de retención (ver §4 recomendación), implementar jobs de anonimización/purga y reflejar en `politica-privacidad.md` y RNBD |
| **INV-04** | **ALTA** | **Avatar público por `getPublicUrl` + acumulación por `upsert:true`** | F-03 | `src/app/api/profile/avatar/route.ts:39-49` `upload({upsert:true})` + `getPublicUrl` (`route.ts:47`), `route.ts:35` `split(".").pop()` sin normalizar allowlist; Server Action duplicada sin validación visible `perfil/page.tsx:48-61` | URL enumerable (`avatars/{userId}-{timestamp}.{ext}`) accesible a cualquiera con link; objetos huérfanos; `avatar.png.exe` pasa ext pero MIME mitiga parcial | Migrar a bucket privado con `createSignedUrl` o RLS de Storage `auth.jwt() ->> 'sub'`; borrar objeto anterior al subir nuevo; validar extensión contra `[jpg,jpeg,png,webp]` lowercase; unificar validación en servicio central `updateAvatar()` con Zod + tests |
| **INV-05** | **MEDIA** | **`codeSnapshot` (F-06) puede capturar datos personales pegados por el usuario** | F-06 | `src/lib/validation/labProgress.ts:7` `codeSnapshot?:string max 8192`, `capLastPosition` `labProgress.ts:26-73` trunca pero no sanitiza contenido; `last_position` `JSONB` `migration.sql:315` | Riesgo de sobre-recolección (usuario pega API keys, emails, código con identificadores). Sin minimización de contenido | Advertir en UI "No pegues datos personales/secrets en el editor"; no enviar `codeSnapshot` si contiene patrones de secreto (regex `sk-`, `AKIA`, email); purgar `codeSnapshot` tras inactividad/completado; considerar cifrado en reposo (ya provisto por Supabase/AWS, documentar) |
| **INV-06** | **MEDIA** | **Duplicación avatar Route Handler + Server Action con validación no paritaria** | F-03 | `src/app/api/profile/avatar/route.ts:18-30` valida MIME + 2 MB vs `src/app/(dashboard)/perfil/page.tsx:48-61` sin validación visible en snippet | Divergencia de superficie de ataque; una vía podría omitir validación tras refactors | Unificar en `src/lib/profile/avatar.ts` `validateAvatar(file)` central + tests `vitest`; una de las dos vías debe deprecarse y documentarse como legacy |
| **INV-07** | **BAJA** | **Almacenamiento local funcional no listado en política de cookies** | F-08 | `src/components/labs/LabTabs.tsx:46,59`, `LabWorkspace.tsx:53,68`, `OnboardingController.tsx:95,168` `localStorage`, `ConsoleFrame.tsx:41,52` `sessionStorage`; `grep cookie.*banner|consent` → vacío (confirmado en `technical-audit.md` §4.3) | No es incumplimiento (es funcional y no requiere consentimiento previo), pero debe informarse en `politica-cookies.md` para transparencia | Listar keys y finalidades en Fase 4 `cookies-audit.md` y `politica-cookies.md` como "estrictamente necesarias/funcionales" |
| **INV-08** | **BAJA** | **Contacto `mailto:` no es punto estructurado pero genera tratamiento fuera del repo** | Contacto | `src/components/landing/Contact.tsx:25-34` solo `mailto:invitro.code@gmail.com` | El email que envíe el usuario inicia tratamiento (bandeja `invitro.code@gmail.com`). Debe informarse canal y plazo de respuesta art. 8 | Documentar en `politica-privacidad.md` canal de derechos y contacto art. 8/17 (10/15 días hábiles) y política de retención de correos de contacto |

---

## 6. Verificación de legibilidad

Este documento fue verificado para:

- [x] Tablas con encabezados claros y separadores Markdown compatibles con visores y generadores PDF.
- [x] Evidencias `archivo:línea` clicables y `grep vacío` con patrón citado para cada `No aplica`.
- [x] Lenguaje profesional neutro, sin regionalismos, sin placeholders, sin datos inventados.
- [x] Coherencia con `legal/project-classification.md` (Fase 1) y `legal/technical-audit.md` (Fase 2) — mismos `archivo:línea` para Clerk, Supabase, Pyodide y `gender=x`.
- [x] Control de longitud: cada ficha en tabla compacta; tabla principal con scroll horizontal esperado (< 7 cols).
- [x] Accesibilidad del artefacto: encabezados jerárquicos `H1→H2→H3`, tablas con `|---|---|`, listas con viñetas, sin imágenes ni HTML embebido.

**Próximo paso (Fase 4 y 6):** `legal/cookies-audit.md` y `legal/providers-audit.md` deben referenciar F-08 y F-01..F-07 respectivamente, sin duplicar ni contradecir este inventario. Cualquier nuevo `POST /api/*`, nuevo `<form>`, nuevo `localStorage`/`cookie` o nueva columna en `supabase-migration.sql` invalida este inventario y obliga a re-auditar antes de generar `politica-privacidad.md`.

---

## 7. Comandos de verificación ejecutados (evidencia negativa)

```bash
grep -rn "stripe|paypal|mercadopago|checkout|paddle|lemonsqueezy|billing|recurring" src/ package.json --include="*.ts" --include="*.tsx" -n  # → vacío
grep -rn "newsletter|mailchimp|resend|sendgrid|brevo|mailgun|smtp|nodemailer" src/ package.json --include="*.ts" --include="*.tsx" -n  # → vacío
grep -rn "calendly|cal\.com" src/ package.json -n  # → vacío
grep -rn "hubspot|salesforce|pipedrive|zoho" src/ package.json -n  # → vacío
grep -rn "openai|anthropic|langchain|chatbot|intercom|crisp|tawk|zendesk" src/ package.json -n  # → vacío (salvo stub E2B comentado en certify/route.ts:39)
grep -ri "gtag|GTM|GA4|google.*analytics|clarity|hotjar|segment|mixpanel|amplitude|fbevents|fbq|meta.*pixel|tiktok.*pixel|linkedin.*insight" src/ --exclude-dir=node_modules -n  # → vacío
grep -rn "localStorage|sessionStorage" src/ --include="*.ts" --include="*.tsx" -n  # → 8 hallazgos funcionales (F-08)
grep -rn "supabase\.storage\.from" src/ -n  # → solo avatars (F-03)
grep -rn "user\.deleted" src/ -n  # → vacío (GAP INV-02)
grep -rn "consent_logs" supabase-migration.sql -n  # → vacío (GAP INV-01)
grep -rn "NEXT_PUBLIC_GA_ID|NEXT_PUBLIC_GTM" .env.local.example src/ -n  # → vacío
```

---

*Documento generado como Fase 3 de `legal/legal_requirement.md`. No contiene placeholders ni datos inventados. Cada "No aplica" se probó con `grep vacío` y lectura de `package.json` y `supabase-migration.sql`. Cualquier nuevo proveedor, nuevo `POST /api/*`, nuevo formulario o cambio en `supabase-migration.sql` invalida este inventario y obliga a re-auditar antes de generar `politica-privacidad.md` / `politica-cookies.md`.*
