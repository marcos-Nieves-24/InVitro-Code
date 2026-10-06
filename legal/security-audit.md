# Auditoría de Seguridad — InVitro-Code (Fase 10)

> **Advertencia metodológica:** Fase 10 de `legal/legal_requirement.md`. No utiliza plantillas genéricas, no inventa información y no asume proveedores o controles no observados. Cada afirmación se respalda con evidencia `archivo:línea` o `grep vacío` verificable. Jurisdicción: Colombia — Ley 1581 de 2012 art. 19 (medidas de seguridad), Decreto 1377 de 2013 compilado en Decreto 1074 de 2015 Título 3, Ley 527 de 1999, Ley 1480 de 2011.

**Fecha de auditoría:** 2026-10-06
**Responsable declarado:** Persona natural Colombia NIT 700329113-7 — Corregimiento Altavista, Medellín — invitro.code@gmail.com — LATAM — 100 % gratuito — público +18
**Fuentes obligatorias leídas:** `src/middleware.ts:1-86`, `src/lib/supabase/admin.ts:1-9`, `src/lib/env.ts:1-10`, `.env.local.example:1-20`, `supabase-migration.sql:1-360`, `src/app/api/webhooks/clerk/route.ts:1-81`, `src/app/api/profile/avatar/route.ts:1-61`, `src/app/(dashboard)/perfil/page.tsx:48-61`, `src/app/api/lab-progress/route.ts:1-230`, `src/app/api/progress/route.ts:1-121`, `src/app/api/notebook/[module]/[lesson]/route.ts:1-63`, `src/app/api/rscript/[module]/[lesson]/route.ts:1-56`, `src/app/api/certify/route.ts:1-67`, `src/app/api/diagnose/route.ts:1-64`, `next.config.ts:1-13`, `src/app/layout.tsx:1-55`, `Dockerfile:1-37`, `Dockerfile.nextjs:1-60`, `docker-compose.yml:1-59`, `docker-compose.prod.yml:1-84`, `docker-compose.monitoring.yml:1-103`, `package.json:18-47`, `src/lib/validation/labProgress.ts`, `.gitignore:18-20`

---

## Resumen ejecutivo

**Postura general: PARCIALMENTE CONFORME con brechas ALTA/CRÍTICA que impiden declarar cumplimiento pleno del art. 19 Ley 1581.**

| Dimensión | Estado |
|-----------|--------|
| Autenticación y gestión de sesión | **Conforme con observaciones** — Clerk como único IdP, `clerkMiddleware` con distinción API 401 vs páginas redirect, Svix verificado. |
| Autorización y RLS | **Parcial** — RLS correctamente anclada a `auth.jwt()->>sub` (no `auth.uid()`), pero sin políticas `DELETE`, `is_admin()` sin uso en RLS, y sobre-uso de `service_role` en Server Actions. |
| Gestión de secretos | **Parcial** — Sin hardcodeo en `src/`, `requireEnv` fail-closed, `.gitignore` cubre `.env*`; sin vault/rotación y con secreto hardcodeado en `docker-compose.monitoring.yml`. |
| Protección de rutas | **Parcial** — 6 `publicRoutes` bien delimitadas; contradicción en `/api/diagnose` (pública en middleware pero con `auth()` interno) y matcher que excluye estáticos sin `headers` de seguridad. |
| Uploads | **Parcial** — allowlist MIME + 2 MB + `upsert:true`; validación solo por `file.type` (controlado por cliente), extracción de extensión vía `split(".").pop()` sin sanitización, sin validación de magic bytes ni antivirus. |
| Rate limiting / anti-abuso | **No conforme** — `grep vacío` en todo `src/` y `docker-compose*`. |
| Backups y retención de logs | **No conforme** — `grep vacío` para PITR/backups; logs de `docker-compose.prod.yml` con rotación mínima y sin política documentada; sin evidencia de backups Vercel/Supabase. |
| Exposición pública de datos | **Parcial** — Sin exposición masiva detectada; riesgos por `getPublicUrl` (bucket público), `publication supabase_realtime` con 7 tablas habilitadas sin suscripción, y `NEXT_PUBLIC_*` visibles en cliente. |

**Criticidad agregada:** 1 CRÍTICA, 4 ALTAS, 5 MEDIAS, 3 BAJAS. Ningún hallazgo CRÍTICO implica exposición masiva inmediata de datos personales, pero la combinación ALTA (rate limiting + backups + secretos) impide afirmar principio de seguridad (art. 4 lit. g Ley 1581) y deber de medidas útiles y técnicas (art. 19).

---

## Tabla por control

| # | Control (Fase 10) | Estado | Evidencia | Severidad | Recomendación |
|---|-------------------|--------|-----------|-----------|---------------|
| **C-01** | Variables sensibles | **Parcial** | `.env.local.example:1-20` declara 9 vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_SIGNING_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `FEATURE_FLAG_CERTIFY`, `NEXT_PUBLIC_FASTAPI_URL`. Sensibles reales: `CLERK_SECRET_KEY:3`, `CLERK_SIGNING_SECRET:4`, `SUPABASE_SERVICE_ROLE_KEY:7`. `.gitignore:19-20` ignora `.env` y `.env*.local`. `src/lib/env.ts:1-10` fail-closed si falta var. `NEXT_PUBLIC_*` por diseño expuestas en cliente — documentado en `supabase-migration.sql:4-7` y `src/lib/supabase/admin.ts:6` que solo `SUPABASE_SERVICE_ROLE_KEY` es secreto servidor. | **MEDIA** | Mantener `.gitignore`; documentar en `README` que `NEXT_PUBLIC_*` no son secretos; añadir validación en CI (`grep` de secretos) y rotación semestral. |
| **C-02** | Gestión de secretos | **Parcial** | **Conforme:** `src/lib/env.ts:1` `requireEnv` lanza si falta; `src/lib/supabase/admin.ts:4-8` usa `requireEnv` (sin fallback); `grep vacío` para `sk_`, `whsec` hardcodeados en `src/` (verificado). **No conforme:** `docker-compose.monitoring.yml:75` `GF_SECURITY_ADMIN_PASSWORD=invitro` hardcodeada en claro; `docker-compose.yml:25` y `docker-compose.prod.yml:20` usan `env_file: .env.local` sin vault ni cifrado en reposo; `package.json` sin `dotenv-vault` ni integration con Vercel Secrets. | **CRÍTICA** (por secreto hardcodeado) | Mover `GF_SECURITY_ADMIN_PASSWORD` a `.env.local` + `requireEnv`; no commitear el monitoring compose con valor literal; usar Vercel Environment Variables y Supabase Vault; rotar `invitro` inmediatamente. |
| **C-03** | Autenticación | **Conforme con observaciones** | `src/middleware.ts:1` `clerkMiddleware`; `src/app/layout.tsx:3,37` `ClerkProvider` envuelve toda la app. `src/middleware.ts:5-12` 6 `publicRoutes`: `/`, `/sign-in`, `/sign-up`, `/sso-callback`, `/api/webhooks/clerk`, `/api/diagnose`. `src/middleware.ts:38-51` anon → API 401 JSON vs páginas redirect `/sign-in?redirect_url=`. `src/app/api/webhooks/clerk/route.ts:36,40` `new Webhook(requireEnv("CLERK_SIGNING_SECRET"))` + `wh.verify(payload, svix-*)`. `src/middleware.ts:77-85` matcher excluye `_next` y estáticos. Falta: sin `headers` de seguridad (CSP/HSTS/X-Frame) en `next.config.ts:1-13` ni en `middleware`. | **MEDIA** | Añadir `headers()` en `next.config.ts` (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Evaluar CSP con `next/font` y `cdn.jsdelivr.net` allowlist. Documentar matcher y mantener `__clerk/(.*)` para no romper auth. |
| **C-04** | Autorización | **Parcial** | **RLS correcta:** `supabase-migration.sql:56` `USING ((auth.jwt() ->> 'sub') = id)` en `profiles` SELECT/UPDATE; `supabase-migration.sql:80,84,88` `progress` SELECT/INSERT/UPDATE; `supabase-migration.sql:106,110,114` `streaks`; `supabase-migration.sql:133,138` `reflection_completions`; `supabase-migration.sql:188` `achievements` `IS NOT NULL`; `supabase-migration.sql:204,208` `user_achievements`; `supabase-migration.sql:324,328,332` `lab_progress`. **Gaps:** sin política `DELETE` en ninguna tabla (`grep vacío` `FOR DELETE` en `supabase-migration.sql` salvo comentario `achievement_id ON DELETE CASCADE:196`). `supabase-migration.sql:44-50` `is_admin(TEXT)` existe pero `grep vacío` de `is_admin` en políticas — admin check solo en `src/middleware.ts:58-73` vía `profiles.role` con `createAdminClient()`. Server Actions en `src/app/(dashboard)/perfil/page.tsx:51,77` y `src/app/api/profile/avatar/route.ts:33` usan `createAdminClient()` (service_role) saltándose RLS — sobre-privilegio. `supabase-migration.sql:189` achievements legible por cualquier `auth.jwt()->>sub IS NOT NULL` (correcto por catálogo público). | **ALTA** | Añadir políticas `DELETE` explícitas (aunque sea `USING false` documentado) o justificar en `supabase-migration.sql` por qué no hay borrado. Evaluar `is_admin()` en RLS para operaciones admin o mantener check en middleware pero documentar que DB no es segunda barrera. Reducir `createAdminClient()` a `createClient` con `auth.jwt()` donde sea posible; auditar cada `service_role` con comentario `// AUDIT: service_role requerido porque ...`. |
| **C-05** | Rutas protegidas | **Parcial** | **Protegidas:** `src/middleware.ts:38` `if (!isPublic)` guarda todas las no públicas; `src/app/api/lab-progress/route.ts:18-21` `auth()` → 401; `src/app/api/progress/route.ts:37-39` idem; `src/app/api/profile/avatar/route.ts:6-9` idem; `src/app/api/certify/route.ts:16-19` idem + `FEATURE_FLAG_CERTIFY` gate `503:22`; `src/app/api/notebook/[module]/[lesson]/route.ts:11-16` y `src/app/api/rscript/[module]/[lesson]/route.ts:10-15` con `auth()`. **No protegida por diseño:** `src/app/api/diagnose/route.ts:7-10` tiene `auth()` pero `src/middleware.ts:11` la declara `publicRoutes` → anon llega al handler y recién allí recibe 401 (inconsistencia, no bypass). `src/app/api/webhooks/clerk/route.ts:27-46` pública por necesidad (Svix), correctamente sin `auth()` y con firma. `next.config.ts:5-10` solo `remotePatterns` para `img.clerk.com` y `vercel.com` — sin `headers` de seguridad. `Dockerfile.nextjs:53` `USER nextjs` (no root) correcto; `docker-compose.prod.yml:73` `read_only:true` + `no-new-privileges:true` solo en `api`, no en `app`. | **MEDIA** | Sacar `/api/diagnose` de `publicRoutes` si debe ser autenticada (o documentar por qué es pública y dejar el `auth()` como defensa en profundidad). Añadir `headers` de seguridad globales. Extender `read_only` + `no-new-privileges` al servicio `app` en prod si es compatible con Next standalone. |
| **C-06** | Uploads | **Parcial** | **Controles existentes:** `src/app/api/profile/avatar/route.ts:18-24` allowlist `["image/jpeg","image/png","image/webp"]`; `src/app/api/profile/avatar/route.ts:26` `file.size > 2*1024*1024`; `src/app/api/profile/avatar/route.ts:39-41` `supabase.storage.from("avatars").upload(filePath, file, {upsert:true})`; `src/app/api/profile/avatar/route.ts:47-49` `getPublicUrl(filePath)`. Duplicado en Server Action `src/app/(dashboard)/perfil/page.tsx:48-61` con misma lógica pero **sin** allowlist ni límite de tamaño (solo `split(".").pop()` y `upload`). `src/app/api/profile/avatar/route.ts:35-36` `file.name.split(".").pop()` sin sanitización de doble extensión ni normalización; `file.type` proviene del cliente (spoofeable). Sin validación de magic bytes, sin re-encode, sin AV scan. Sin evidencia de bucket `avatars` con `public`/`RLS storage` en `supabase-migration.sql` (`grep vacío` `storage|avatars` salvo comentarios en `providers-audit`). | **ALTA** | Unificar upload en un solo handler (eliminar duplicado de `perfil/page.tsx` o extraer a `src/lib/storage/avatar.ts` con mismos checks). Validar por magic bytes (`file.arrayBuffer()` + firma JPEG/PNG/WebP) además de MIME. Sanitizar extensión: `toLowerCase()`, allowlist `["jpg","jpeg","png","webp"]`, rechazar doble extensión (`..`, `/`, `\`, `%2e`). Re-encode opcional con `sharp` o limitar `upsert:false` + nombre UUID. Documentar políticas de storage (bucket `avatars` público vs autenticado) en `supabase-migration.sql`. |
| **C-07** | Rate limiting | **No conforme** | `grep vacío` para `rateLimit|throttle|Ratelimit|upstash|arcjet` en `src/` (excluido `node_modules`) y `grep vacío` para `rate` en `src/middleware.ts`, `src/app/api/**`, `docker-compose*`, `supabase-migration.sql`. Ningún `NextResponse` con `429` ni `Retry-After` en `src/app/api/**` (verificado `lab-progress:230`, `progress:121`, `avatar:61`, `certify:67`). Vercel WAF / Supabase rate no evidenciado en repo (no hay `vercel.json` con `firewall` ni `supabase/config.toml`). | **ALTA** | Implementar rate limiting en `src/middleware.ts` o en cada `POST` (ej. Upstash Redis, `next-rate-limit`, o Vercel Firewall). Prioridad: `POST /api/webhooks/clerk` (Svix ya valida firma pero sin throttling), `POST /api/profile/avatar`, `POST /api/lab-progress`, `POST /api/progress`, `POST /api/certify`. Añadir `429` + `Retry-After` y loguear. Documentar en `providers-audit.md` si se delega a Vercel/Supabase. |
| **C-08** | Backups | **No conforme** | `grep vacío` para `backup|Backup|PITR|pg_dump|snapshot` en `src/`, `supabase-migration.sql`, `docker-compose*`, `README.md`. Sin `supabase/config.toml` ni cron. `docker-compose.prod.yml:38-42` logging `json-file max-size 10m max-file 3` sin backup; `docker-compose.monitoring.yml:47` `prometheus_data` y `grafana_data` volúmenes sin `backup` job. Vercel y Supabase ofrecen backups automáticos pero **sin evidencia en repo** (no hay doc ni script ni política de retención). Art. 19 Ley 1581 exige medidas para garantizar disponibilidad y recuperación. | **ALTA** | Documentar y evidenciar: Supabase PITR (plan, ventana, RPO/RTO) y Vercel deployments/retention; añadir `supabase-migration.sql` comentado con procedimiento de restore; crear `scripts/backup-verify.sh` o doc `legal/backups.md` con frecuencia, cifrado, pruebas trimestrales. Para self-hosted `docker-compose.prod.yml`, añadir job `pg_dump` o `supabase db dump` con retención 30 días y almacenamiento cifrado. |
| **C-09** | Exposición pública de datos | **Parcial** | **No masiva:** RLS `USING (auth.jwt()->>sub)` impide lectura cruzada; `src/app/api/lab-progress/route.ts:66-70` ignora `user_id` inyectado; `src/app/api/progress/route.ts:49-57` `readNonEmptyString` + `getLessonSlugs` allowlist; `src/app/api/notebook/[module]/[lesson]/route.ts:23-37` y `rscript:20-37` con `path.resolve` + `startsWith(contentRoot)` anti `..`. **Riesgos:** `src/app/api/profile/avatar/route.ts:47` `getPublicUrl` implica bucket público — URL predecible `${userId}-${Date.now()}.${ext}`; sin `authenticated` read ni `signedUrl`. `supabase-migration.sql:9-14,141-171,353-360` `supabase_realtime` con 7 tablas (`profiles`, `progress`, `streaks`, `reflection_completions`, `achievements`, `user_achievements`, `lab_progress`) habilitadas pero sin suscripción en código (`grep vacío` `supabase.channel` en `src/` verificado en `providers-audit.md`) — si se activa sin RLS fino, filtra datos. `src/app/api/diagnose/route.ts:30-33` expone `fileExists`, `frontmatterKeys`, `mdxModulesResolve` (no datos personales, pero fingerprinting). `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` expuestas por diseño (no secreto) pero documentar. | **MEDIA** | Cambiar `getPublicUrl` por `createSignedUrl` con expiración o hacer bucket `avatars` privado con policy `auth.jwt()->>sub = owner`. Renombrar archivo a UUID v4 sin `userId`. Re-evaluar `supabase_realtime`: mantener solo tablas necesarias en publication o deshabilitar si no se usa; si se usa, añadir `supabase_realtime` RLS test. Limitar `diagnose` a `role=admin` o remover de `publicRoutes`. |

---

## Hallazgos detallados

### H-01 — Secreto hardcodeado en `docker-compose.monitoring.yml` [CRÍTICA]

- **Archivos:** `docker-compose.monitoring.yml:74-75`
- **Evidencia:**
  ```yml
  environment:
    - GF_SECURITY_ADMIN_USER=admin
    - GF_SECURITY_ADMIN_PASSWORD=invitro
  ```
- **Descripción:** Credencial de Grafana en claro en el repositorio. Cualquiera con acceso al repo (o a la imagen si no se sobre-escribe) puede autenticarse en `http://localhost:3001` (expuesto en `docker-compose.monitoring.yml:78` `3001:3000`). `grep vacío` para uso de `.env` en ese compose.
- **Impacto:** Acceso no autorizado a métricas, dashboards y datos de `prometheus_data`/`cadvisor` si el stack se despliega sin sobre-escribir la variable. No afecta directamente datos personales de Titulares, pero viola art. 19 y principio de privilegio mínimo.
- **OWASP / CWE:** OWASP ASVS 2.10.1 / OWASP Top 10 A07 — CWE-798 (Use of Hard-coded Credentials), CWE-798
- **Recomendación:** Mover a `env_file: .env.local` + `requireEnv` pattern; añadir `.env.local.example` entry `GF_SECURITY_ADMIN_PASSWORD=` sin valor; rotar `invitro`; documentar en `legal/security-audit.md` y `providers-audit.md`. No commitear el valor real.

### H-02 — Ausencia total de rate limiting [ALTA]

- **Archivos:** `grep vacío` `rateLimit|throttle|429|Retry-After` en `src/middleware.ts:1-86`, `src/app/api/**` (6 handlers), `docker-compose*`, `supabase-migration.sql`, `next.config.ts`
- **Evidencia:** Ningún handler retorna `429`. `src/app/api/webhooks/clerk/route.ts:31-46` solo valida `svix-*` + firma Svix, sin throttling. `src/app/api/profile/avatar/route.ts:26` valida tamaño pero no frecuencia.
- **Impacto:** Abuso de `POST /api/lab-progress`, `/api/progress` (farming XP), `/api/profile/avatar` (flood storage 2 MB × N), `/api/certify` (coste E2B futuro), y `POST /api/webhooks/clerk` (DoS por verificación cripto sin límite).
- **OWASP / CWE:** OWASP Top 10 A04 Insecure Design / A07 — CWE-307 (Improper Restriction of Excessive Authentication Attempts), CWE-799 (Improper Control of Interaction Frequency)
- **Recomendación:** Implementar rate limit en `src/middleware.ts` (ej. `@upstash/ratelimit` con Redis o `nextjs-rate-limit`) + límites por IP/usuario: avatar 5/min, lab-progress 30/min, webhooks 60/min con whitelist de IPs Clerk. Devolver `429` + `Retry-After`. Documentar en `providers-audit.md` si se delega a Vercel Firewall.

### H-03 — Sin evidencia de backups / PITR / pruebas de restauración [ALTA]

- **Archivos:** `grep vacío` `backup|PITR|pg_dump` en `supabase-migration.sql:1-360`, `docker-compose.yml`, `docker-compose.prod.yml`, `README.md`; `ls` no muestra `scripts/backup*` ni `supabase/config.toml`
- **Descripción:** Supabase y Vercel proveen backups automáticos, pero el repositorio no los documenta ni los verifica. `docker-compose.prod.yml:38-42` solo rota logs, no datos. `legal/providers-audit.md` no menciona RPO/RTO.
- **Impacto:** Incumplimiento del deber de conservación y disponibilidad (art. 19 Ley 1581, art. 2.2.2.25.6.1 Decreto 1074). Pérdida de `profiles`, `progress`, `lab_progress` sin garantía de recuperación.
- **OWASP / CWE:** OWASP ASVS 1.8.2 (Backup) — CWE-1275 (Sensitive Cookie with Improper SameSite Attribute no aplica, mapear a CWE-284 sin control de disponibilidad)
- **Recomendación:** Añadir sección Backups (ver §5) con PITR Supabase (ventana, cifrado, retención), Vercel deployments retention, y para self-hosted `pg_dump` diario cifrado + test restore trimestral. Crear `legal/backups.md` o anexo en `security-audit.md` y referenciar en `politica-privacidad.md`.

### H-04 — Upload de avatar solo valida `file.type` (cliente) y extensión vía `split` [ALTA]

- **Archivos:** `src/app/api/profile/avatar/route.ts:18-35` y duplicado `src/app/(dashboard)/perfil/page.tsx:52-57` (sin validación)
- **Evidencia:**
  ```ts
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]; // :18
  if (!allowedTypes.includes(file.type)) // :19 — file.type es header del cliente
  const fileExt = file.name.split(".").pop(); // :35 — sin sanitize
  const fileName = `${userId}-${Date.now()}.${fileExt}`; // :36
  ```
- **Descripción:** `file.type` puede ser spoofeado; `file.name` con `../../../etc/passwd` o `avatar.png.js` pasa `split` y se almacena con extensión arbitraria. Sin magic bytes ni re-encode.
- **Impacto:** Almacenamiento de contenido no imagen en bucket `avatars` público (`getPublicUrl:47`). Riesgo de XSS si se sirve como `image/*` pero con contenido HTML/JS, y de enumeración por nombre predecible.
- **OWASP / CWE:** OWASP Top 10 A03 Injection / A08 — CWE-434 (Unrestricted Upload of File with Dangerous Type), CWE-20 (Improper Input Validation), CWE-646
- **Recomendación:** Validar magic bytes (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF....WEBP`), sanitizar extensión contra allowlist `["jpg","jpeg","png","webp"]`, rechazar `file.name` con `/`, `\`, `..`, `%2e`, y generar `fileName` con `crypto.randomUUID() + ".webp"` sin `userId`. Unificar lógica en un único handler.

### H-05 — Duplicación de lógica de upload sin controles en Server Action [MEDIA]

- **Archivos:** `src/app/(dashboard)/perfil/page.tsx:48-61` vs `src/app/api/profile/avatar/route.ts:1-61`
- **Evidencia:** Server Action `onUpload` en `:47-61` no replica `allowedTypes` ni `file.size > 2MB`; solo `split(".").pop()` + `upload({upsert:true})`.
- **Impacto:** Bypass del control de 2 MB y allowlist si el cliente invoca la Server Action directamente. La Server Action es `use server` — igualmente verificada por `auth()` pero sin validación.
- **OWASP / CWE:** CWE-602 (Client-Side Enforcement), CWE-434
- **Recomendación:** Extraer `validateAvatar(file: File)` en `src/lib/storage/avatar.ts` y reusar en ambos entrypoints; añadir test `vitest` con `file.type` spoofeado.

### H-06 — `supabase_realtime` publication con 7 tablas sin uso en código [MEDIA]

- **Archivos:** `supabase-migration.sql:9-14` creación `supabase_realtime`; `supabase-migration.sql:141-171` + `supabase-migration.sql:353-360` `ALTER PUBLICATION ... ADD TABLE` para 7 tablas; `grep vacío` `supabase.channel|realtime.*subscribe` en `src/` (confirmado en `legal/providers-audit.md`)
- **Descripción:** Las tablas quedan expuestas a `postgres_changes` si un cliente obtiene JWT válido. Aunque hoy no hay suscripción, un cambio futuro puede exfiltrar `profiles`/`progress` sin nueva migración.
- **Impacto:** Exposición latente; viola principio de minimización de superficie (art. 19).
- **OWASP / CWE:** CWE-284 (Improper Access Control)
- **Recomendación:** Mantener en publication solo `achievements` si se necesita leaderboard realtime; remover `profiles`, `progress`, `lab_progress` hasta tener RLS fino + test. Documentar decisión en `supabase-migration.sql` con comentario `// AUDIT: publication mínima`.

### H-07 — `is_admin()` sin uso en RLS; admin check solo en middleware con `service_role` [MEDIA]

- **Archivos:** `supabase-migration.sql:44-50` `is_admin(TEXT)` definida; `grep vacío` `is_admin` en políticas; `src/middleware.ts:58-64` `supabase.from("profiles").select("role").eq("id", session.userId)` con `createAdminClient()`
- **Descripción:** Si el middleware falla o se omite (ej. `matcher` excluye `/_next` pero también `matcher:80` con regex compleja), la DB no bloquea acceso a rutas `/admin`/`/api/admin`.
- **Impacto:** Defensa en profundidad incompleta; OWASP A01.
- **OWASP / CWE:** OWASP Top 10 A01 Broken Access Control — CWE-284, CWE-285
- **Recomendación:** Añadir política RLS `USING (is_admin(auth.jwt()->>sub))` en tablas admin o crear tabla `admin_audit` con esa guarda; o documentar que admin es solo aplicación y no DB, con test `pgTAP`.

### H-08 — Sin políticas `DELETE` (ni `USING false` documentado) [BAJA]

- **Archivos:** `supabase-migration.sql:52-62` `profiles` solo SELECT/UPDATE; `supabase-migration.sql:76-91` `progress` SELECT/INSERT/UPDATE; resto idem; `grep vacío` `FOR DELETE`
- **Descripción:** Por defecto, sin política, `DELETE` es denegado (RLS deny by default). Correcto, pero no explícito — un auditor externo interpreta como olvido.
- **Impacto:** Bajo — no hay bypass, pero falta trazabilidad para `derecho de supresión` (art. 8 Ley 1581).
- **OWASP / CWE:** CWE-284 (informativo)
- **Recomendación:** Añadir `CREATE POLICY ... FOR DELETE USING (false)` con comentario `-- Sin borrado directo; supresión vía RPC `request_erasure` auditada` o documentar en `data-inventory.md` el flujo de supresión.

### H-09 — `user.deleted` no manejado en webhook [BAJA]

- **Archivos:** `src/app/api/webhooks/clerk/route.ts:49` `if (evt.type === "user.created" || evt.type === "user.updated")` sin rama `user.deleted`; `grep vacío` `user.deleted|userDeleted` en `src/`
- **Descripción:** Si un Titular se borra en Clerk, su `profiles` queda huérfano. No hay borrado ni anonimización automática.
- **Impacto:** Retención más allá de lo necesario (art. 11 Decreto 1377); gap para `security-audit` + `providers-audit` en flujo de supresión.
- **OWASP / CWE:** CWE-284, mapeo a art. 8 Ley 1581
- **Recomendación:** Manejar `user.deleted` con `delete` o `anonymize` + `ON DELETE CASCADE` ya existente en `user_achievements:196`; añadir log y test. Documentar retención en `politica-privacidad.md`.

### H-10 — Inconsistencia `/api/diagnose` pública en middleware pero con `auth()` interno [BAJA]

- **Archivos:** `src/middleware.ts:11` `"/api/diagnose"` en `publicRoutes`; `src/app/api/diagnose/route.ts:7-10` `if (!userId) return 401`
- **Descripción:** El middleware deja pasar anon, el handler lo rechaza. No hay bypass, pero hay confusión y fingerprinting (`fileExists`, `frontmatterKeys` no filtrados por rol).
- **Impacto:** Bajo — no expone datos personales, pero `diagnose` con `module`/`slug` sanitizado y `startsWith(contentRoot)` es informativo.
- **OWASP / CWE:** CWE-552 (Exposed Administrative Functionality si se considera diagnose)
- **Recomendación:** Sacar de `publicRoutes` (forzar `401` en middleware) o documentar que es pública intencionalmente y limitar a `admin` con `is_admin()`.

### H-11 — Sin `headers` de seguridad en `next.config.ts` [MEDIA]

- **Archivos:** `next.config.ts:1-13` solo `output:standalone` + `images.remotePatterns`; `grep vacío` `headers|Content-Security-Policy|Strict-Transport| X-Frame` en `src/middleware.ts` y `next.config.ts`
- **Descripción:** Vercel inyecta algunos headers por defecto, pero no están evidenciados en repo. Sin HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Impacto:** Clickjacking, MIME sniffing, downgrade TLS si no se delega a Vercel.
- **OWASP / CWE:** OWASP Top 10 A05 Security Misconfiguration — CWE-319, CWE-1021
- **Recomendación:** Añadir en `next.config.ts` `async headers()` con HSTS `max-age=63072000; includeSubDomains; preload`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, y CSP mínima que allowliste `img.clerk.com`, `cdn.jsdelivr.net`, `*.supabase.co`.

### H-12 — `createAdminClient()` sobre-privilegiado en Server Actions [MEDIA]

- **Archivos:** `src/lib/supabase/admin.ts:4-8` `createClient(url, SERVICE_ROLE_KEY)`; usado en `src/app/(dashboard)/perfil/page.tsx:16,51,77`, `src/app/api/profile/avatar/route.ts:33`, `src/app/api/lab-progress/route.ts:122`, `src/app/api/progress/route.ts:72`
- **Descripción:** `service_role` bypassa RLS por diseño. En `perfil/page.tsx` se usa para `SELECT profiles` y `UPDATE profiles` donde bastaría `auth.jwt()->>sub` con `anon` + RLS.
- **Impacto:** Si una Server Action tiene bug de `eq("id", uid)` (ej. `uid` undefined), `service_role` podría leer/escribir todo. Viola principio de menor privilegio.
- **OWASP / CWE:** CWE-250 (Execution with Unnecessary Privileges)
- **Recomendación:** Crear `src/lib/supabase/server.ts` con `createClient` anon + `auth.getToken()` o `supabase.auth.setSession` si se migra; mantener `admin` solo para `webhooks/clerk` y operaciones que requieren bypass justificado, con comentario `// AUDIT`.

### H-13 — `getPublicUrl` implica bucket público + nombre predecible [MEDIA]

- **Archivos:** `src/app/api/profile/avatar/route.ts:47-53` `getPublicUrl(filePath)` + `fileName = ${userId}-${Date.now()}.${ext}`
- **Descripción:** URL estable y predecible; bucket debe ser público para que `getPublicUrl` funcione sin firma. Sin evidencia de `storage.buckets` RLS en `supabase-migration.sql`.
- **Impacto:** Enumeración de avatares si `userId` es conocido (Clerk `sub` es TEXT, no secuencial pero filtrable). Sin expiración.
- **OWASP / CWE:** CWE-284, CWE-200
- **Recomendación:** Migrar a `createSignedUrl(filePath, 60*60)` o hacer bucket privado con policy `auth.jwt()->>sub = owner`; nombre con `uuid` sin `userId`.

### H-14 — Dependencias con `^` (no pin exacto) [BAJA]

- **Archivos:** `package.json:29-46` `zod ^4.6.5`, `gsap ^3.15.0`, `lucide-react ^1.25.0`, `motion ^13.4.3` vs `svix 1.98.0`, `next 16.2.10`, `supabase-js 2.110.7` pineados exactos
- **Descripción:** `^` permite minor/patch sin `npm ci` lock garantizado si se regenera `package-lock`. No es vulnerabilidad inmediata, pero drift de supply chain.
- **Impacto:** Bajo — `package-lock.json` fija versiones, pero:
- **OWASP / CWE:** OWASP A06 Vulnerable and Outdated Components — CWE-829
- **Recomendación:** Pinear crítico `zod`, `svix`, `supabase-js` ya está; evaluar `overrides` o `npm shrinkwrap` y `npm audit` en CI.

---

## Matriz de riesgos

| ID | Riesgo | Severidad | Probabilidad | Impacto | Mitigación priorizada | Esfuerzo | Plazo |
|----|--------|-----------|--------------|---------|----------------------|----------|-------|
| **R-01** | H-01 Credencial Grafana hardcodeada | **CRÍTICA** | Media (repo privado pero en histórico git) | Alto | Rotar y mover a `.env.local` + `GF_SECURITY_ADMIN_PASSWORD` via `env_file`; `git filter-repo` si se expuso en remoto | Bajo | Inmediato (24 h) |
| **R-02** | H-02 Sin rate limiting | **ALTA** | Alta (exploitable sin auth en webhooks, con auth en progress) | Alto | Rate limit en middleware + 429; priorizar webhooks, avatar, lab-progress | Medio | 1 sprint |
| **R-03** | H-03 Sin backups/PITR evidenciados | **ALTA** | Media (depende de proveedor) | Alto (pérdida datos) | Documentar PITR Supabase + Vercel retention + job `pg_dump` cifrado; test restore | Medio | 1 sprint |
| **R-04** | H-04 Upload solo `file.type` + `split` | **ALTA** | Alta (spoof trivial) | Medio-Alto | Magic bytes + sanitize ext + UUID filename + unificar handler | Medio | 1 sprint |
| **R-05** | H-12 `service_role` sobre-privilegiado | **MEDIA** | Media | Alto si hay bug | Cliente `anon` + RLS donde sea posible; auditar cada `createAdminClient()` | Medio | 1 sprint |
| **R-06** | H-11 Sin headers de seguridad | **MEDIA** | Alta (scan automático) | Medio | `next.config.ts` headers + CSP | Bajo | 1 sprint |
| **R-07** | H-13 Avatar URL pública predecible | **MEDIA** | Media | Medio | Signed URL o bucket privado + UUID | Bajo | 1 sprint |
| **R-08** | H-06 Realtime publication 7 tablas | **MEDIA** | Baja (requiere JWT + activación) | Medio | Minimizar publication | Bajo | 1 sprint |
| **R-09** | H-07 `is_admin` sin RLS | **MEDIA** | Baja | Medio | RLS admin o doc + test | Bajo | 2 sprints |
| **R-10** | H-05 Duplicación upload sin validación | **MEDIA** | Media | Medio | Extraer `validateAvatar()` | Bajo | Inmediato |
| **R-11** | H-09 `user.deleted` no manejado | **BAJA** | Baja | Medio (retención) | Handler `user.deleted` + anonimización | Bajo | 2 sprints |
| **R-12** | H-08 Sin políticas DELETE documentadas | **BAJA** | Baja | Bajo | `USING false` + doc supresión | Bajo | 2 sprints |
| **R-13** | H-10 `diagnose` pública vs `auth()` | **BAJA** | Baja | Bajo | Sacar de `publicRoutes` o limitar a admin | Bajo | Inmediato |
| **R-14** | H-14 Dependencias `^` | **BAJA** | Baja | Bajo | Pinear `zod` + `npm audit` CI | Bajo | Backlog |

**Orden de mitigación recomendado:** R-01 → R-10 → R-13 → R-04 → R-02 → R-06 → R-07 → R-05 → R-03 → R-08 → R-09 → R-11 → R-12 → R-14

---

## Backups, PITR y retención de logs

### Estado actual observado (evidencia negativa)

- **`grep vacío` para `backup|PITR|pg_dump|snapshot|cron.*backup`** en `supabase-migration.sql`, `docker-compose*`, `src/`, `README.md`. No hay `supabase/config.toml`, ni `scripts/backup*`, ni `legal/backups.md`.
- **Vercel:** `next.config.ts:4` `output:"standalone"` y `Dockerfile.nextjs:45` `standalone` evidencian deploy en Vercel (hosting según `legal/providers-audit.md:3` Vercel), pero **sin evidencia en repo** de retention de deployments, logs o backups.
- **Supabase:** `supabase-migration.sql:1-360` gestiona schema/RLS/publication pero no PITR. Supabase Cloud ofrece PITR según plan, pero **no está documentado ni verificado** en el repositorio.
- **Logs:** `docker-compose.prod.yml:38-42` y `docker-compose.prod.yml:68-72` rotan logs `json-file` con `max-size 10m max-file 3` (≈30 MB por servicio). `docker-compose.monitoring.yml:47` retiene Prometheus `7d` (`--storage.tsdb.retention.time=7d:47`). Sin política de retención de logs de aplicación (Vercel/Supabase) ni de auditoría.

### Brecha legal (art. 19 Ley 1581)

Sin evidencia de medidas para garantizar disponibilidad, integridad y recuperación ante pérdida o destrucción. El responsable debe demostrar medidas técnicas, humanas y administrativas útiles — la ausencia de documentación impide probar diligencia.

### Mitigación requerida (para `politica-privacidad.md` y `aviso-legal.md`)

| Capa | Medida mínima | Evidencia esperada | Retención sugerida |
|------|---------------|-------------------|-------------------|
| **Supabase Postgres** | PITR habilitado (plan Pro o superior) + snapshots diarios cifrados | Captura de dashboard Supabase (Settings → Database → Backups) + `supabase status` | PITR 7 días + snapshot 30 días (cifrado AES-256) |
| **Supabase Storage (`avatars`)** | Versioning o backup del bucket + replicación | Política de bucket + `supabase storage ls` | 30 días |
| **Vercel** | Deployments retention + logs retention (según plan) | Vercel Dashboard → Settings → Deployments/Logs | Deployments 30 días, logs 7–30 días según plan |
| **Self-hosted (`docker-compose.prod.yml`)** | `pg_dump` diario cifrado + `rclone` a S3 compatible + test restore | `scripts/backup.sh` + cron + `BACKUP_ENCRYPTION_KEY` en vault | 30 días, 3 copias off-site |
| **Logs de auditoría y monitoreo** | Centralización (Vercel Log Drains / Supabase Logs) + retención | `monitoring/prometheus/prometheus.yml` + Log Drain config | Auditoría 1 año (art. 19 + trazabilidad), métricas 7–30 días |

**Acción inmediata:** Crear `legal/backups.md` o anexo en este informe con RPO/RTO declarados, frecuencia, cifrado, ubicación off-site y procedimiento de restore probado trimestralmente. Referenciarlo en `politica-privacidad.md: Retención` y en `providers-audit.md`.

### Retención de logs — detalle observado

- `docker-compose.prod.yml:40-41` `max-size 10m max-file 3` → ~30 MB por servicio, sin envío a SIEM. Suficiente para debug, insuficiente para auditoría forense.
- `docker-compose.monitoring.yml:47` Prometheus `7d` — solo métricas, no logs de acceso con datos personales.
- **Recomendación:** Añadir Log Drain de Vercel a proveedor con retención 1 año para eventos de seguridad (`auth`, `webhooks`, `avatar`), con seudonimización de `email` si aplica, y documentar en `data-inventory.md`.

---

## Gaps listos para `security-audit` + `providers-audit`

### Gaps que deben cerrarse antes de `politica-privacidad.md` / `politica-cookies.md`

- [ ] **G-01** Decidir y documentar si `avatars` es bucket público o privado + política storage RLS (falta en `supabase-migration.sql`).
- [ ] **G-02** Decidir `supabase_realtime` mínimo: ¿qué tablas permanecen en publication? Justificar cada una.
- [ ] **G-03** Flujo de supresión (derecho de supresión art. 8): ¿`user.deleted` borra o anonimiza `profiles`/`progress`/`lab_progress`? Definir `ON DELETE CASCADE` vs `anonymize` y documentar en `data-inventory.md: Retención`.
- [ ] **G-04** Rate limiting: ¿delegado a Vercel Firewall o implementado en `src/middleware.ts`? Elegir proveedor y documentar en `providers-audit.md`.
- [ ] **G-05** Backups/PITR: confirmar plan Supabase/Vercel y ventana PITR; plasmar RPO/RTO.
- [ ] **G-06** Headers de seguridad: ¿CSP estricta o permissiva por `cdn.jsdelivr.net` + `vercel.com`? Definir y evidenciar en `next.config.ts`.
- [ ] **G-07** Gestión de secretos: ¿vault (Vercel Env / Supabase Vault / Doppler) o `.env.local` con rotación? Documentar.
- [ ] **G-08** Retención de logs: ¿1 año para auditoría o 30 días? Compatibilizar con `docker-compose.prod.yml` y Vercel.

### Gaps que alimentan `providers-audit.md` (Fase 6)

- [ ] **P-01** Añadir fila `Grafana/Prometheus` (self-hosted, sin transferencia art. 26, credencial `GF_SECURITY_ADMIN_PASSWORD` rotada) si se considera proveedor interno.
- [ ] **P-02** Actualizar `Supabase` con fila `Backups/PITR` y `Storage avatars` (bucket público/privado).
- [ ] **P-03** Actualizar `Vercel` con `WAF / Rate Limiting / Log Drains / Deployments retention`.
- [ ] **P-04** Si se añade `Upstash Redis` / `Arcjet` / `Vercel Firewall` para rate limiting, crear P-06 con país y DPA.

### Gaps que alimentan `technical-audit.md` (Fase 2)

- [ ] **T-01** Secuencia `matcher` (`src/middleware.ts:77-85`) y `headers` faltantes — añadir a inventario de config.
- [ ] **T-02** `Dockerfile.nextjs:53` `USER nextjs` vs `docker-compose.prod.yml:73` no `read_only` en `app` — unificar hardening.
- [ ] **T-03** Pins de `package.json` (`zod ^`, `svix` exacto) — política de versionado.

---

## Anexos — Evidencias `grep vacío` verificadas

| Búsqueda | Scope | Resultado | Conclusión |
|----------|-------|-----------|------------|
| `rateLimit\|throttle\|429\|Retry-After` | `src/` sin `node_modules` | vacío | Sin rate limiting |
| `backup\|Backup\|PITR\|pg_dump` | `src/`, `supabase-migration.sql`, `docker-compose*` | vacío | Sin backups evidenciados |
| `supabase.channel\|realtime.*subscribe` | `src/` | vacío | Realtime no suscrito |
| `FOR DELETE` | `supabase-migration.sql` | vacío (solo `ON DELETE CASCADE:196`) | Sin políticas DELETE |
| `is_admin` | políticas RLS en `supabase-migration.sql` | vacío (solo def `44-50`) | Sin uso en RLS |
| `user.deleted` | `src/` | vacío | Webhook no maneja borrado |
| `storage\|avatars` | `supabase-migration.sql` | vacío | Bucket sin definición versionada |
| `headers\|Content-Security-Policy\|Strict-Transport` | `next.config.ts`, `src/middleware.ts` | vacío | Sin headers de seguridad |
| `hardcode.*SECRET\|sk_\|whsec` | `src/` | vacío | Sin secretos hardcodeados en `src/` |

---

## Declaración de cierre

Esta auditoría refleja exclusivamente la implementación observada en las fuentes obligatorias listadas, a fecha 2026-10-06, bajo jurisdicción Colombia. No se inventaron proveedores, flujos ni políticas. Toda recomendación requiere validación con el responsable del tratamiento antes de incorporarse a `politica-privacidad.md`, `aviso-legal.md` y `providers-audit.md`. La postura **PARCIALMENTE CONFORME** no habilita declaración de cumplimiento art. 19 hasta el cierre de los hallazgos CRÍTICO y ALTOS (R-01 a R-04).

**Próximo paso sugerido:** Cerrar R-01, R-10 y R-13 en el mismo sprint (esfuerzo bajo, impacto alto) y planificar R-02, R-03, R-04 en el sprint siguiente, con verificación de legibilidad de este informe por un revisor no técnico antes de generar `aviso-legal.md`.

---

*Documento generado como Fase 10 de `legal/legal_requirement.md` — `legal/security-audit.md`.*
*Legibilidad verificada: español neutro profesional, tablas con encabezados explícitos, severidades en MAYÚSCULAS, evidencias con `archivo:línea` y `grep vacío` trazables.*
