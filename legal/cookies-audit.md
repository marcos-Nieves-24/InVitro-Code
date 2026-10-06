# Auditoría de Cookies y Tracking — InVitro-Code (Fase 4)

> **Advertencia metodológica:** Fase 4 de `legal/legal_requirement.md`. Cada afirmación se respalda con evidencia `archivo:línea` o `grep vacío` verificable. No se utilizan plantillas genéricas, no se inventa información y no se asumen proveedores, cookies ni tecnologías de tracking no observadas en el repositorio. Reconciliado con `legal/technical-audit.md` §4.3 (Cookies y almacenamiento) y `legal/data-inventory.md` F-08 (Almacenamiento local funcional) — sin contradicción.

**Fecha de auditoría:** 2026-10-06
**Responsable declarado:** Persona natural Colombia NIT 700329113-7 — Corregimiento Altavista, Medellín — invitro.code@gmail.com — Jurisdicción Colombia (Ley 1581, Decreto 1377 art. 9/26, Decreto 1074 compilatorio, Ley 527, Ley 1480) — LATAM — 100% gratuito — público +18
**Fuentes obligatorias leídas:** `src/app/layout.tsx:1-55`, `src/middleware.ts:1-86`, `next.config.ts:1-13`, `package.json:1-61`, `src/lib/pyodide-worker.ts:1-205`, `public/pyodide-worker.js:1-340`, `src/components/labs/LabTabs.tsx:1-137`, `src/components/labs/workspace/LabWorkspace.tsx:1-232`, `src/components/editor/ConsoleFrame.tsx:1-128`, `src/components/onboarding/OnboardingController.tsx:1-245`, `src/lib/gamification/streak.ts:1-92`, `supabase-migration.sql:1-360`, `src/app/api/**` (6 handlers), `src/app/(dashboard)/**`, `legal/technical-audit.md:31,239-261`, `legal/data-inventory.md:46,143-151`.

---

## Resumen ejecutivo

**¿Hay cookies analíticas o publicitarias? No.** La auditoría exhaustiva del código, dependencias, configuración y fuentes de terceros concluye que **InVitro-Code no implementa ningún sistema de analítica ni de publicidad** y, por tanto, **no despliega cookies analíticas ni publicitarias**.

**¿Se necesita CMP (Consent Management Platform / banner de consentimiento)? No es obligatorio hoy, pero sí es obligatoria la información.** Al existir únicamente **cookies técnicas estrictamente necesarias** (sesión Clerk) y **almacenamiento local funcional** (`localStorage`/`sessionStorage` para estado de UI), el banner de consentimiento previo con opciones de rechazo/configuración granular/bloqueo de scripts **no es exigible** bajo Ley 1581 art. 9, Decreto 1377 y criterio SIC armonizado con art. 22.2 LSSI/ePrivacy (transposición de referencia). Lo que **sí es exigible** es:

1. Informar en `legal/politica-cookies.md` — de forma accesible y previa — la existencia, finalidad, titular y duración de las cookies técnicas y del almacenamiento funcional.
2. Mantener `politica-cookies.md` sincronizada con este inventario; cualquier nueva cookie/Storage/tracking invalida esta auditoría y obliga a re-auditar antes de publicar la política.
3. No introducir analíticas/publicitarias sin implementar previamente CMP con consentimiento previo, granular, revocable y con bloqueo efectivo de scripts (ver §4 y §5).

**Hallazgo positivo para privacidad:** ausencia total de tracking reduce transferencias internacionales de datos comportamentales y perfilado. **Contrapartida:** sin métricas de producto (confirmado en `legal/technical-audit.md` §4.4 y §5 G-01 a G-09).

**Riesgo principal heredado:** el mismo GAP transversal de `legal/technical-audit.md` §5 y `legal/data-inventory.md` §5 — falta de base habilitante documentada art. 9/art. 6 (sensible `gender=x`)/art. 26 (transferencia) y de procedimiento de supresión — aplica también al tratamiento vía cookies técnicas en la medida en que vehiculan identificador `sub`.

---

## 1. Inventario de cookies detectadas

> Clasificación conforme a Guía SIC / art. 22 LSSI / ePrivacy: **Técnicas** (estrictamente necesarias para prestar el servicio solicitado), **Funcionales** (preferencias no esenciales pero sin perfilado), **Analíticas** (medición), **Publicitarias** (perfilado/publicidad). Cada fila indica evidencia `archivo:línea` o `grep vacío`.

| # | Nombre | Tipo | Finalidad | Titular | Duración | Evidencia | ¿Requiere consentimiento previo? |
|---|--------|------|-----------|---------|----------|-----------|----------------------------------|
| **C-01** | `__session` | **Técnica — estrictamente necesaria** | Mantener sesión autenticada Clerk; vehicula JWT `sub` que Supabase RLS valida como `auth.jwt() ->> 'sub'` | **Clerk Inc. (EE. UU.)** — Encargado IdP | Sesión (expira al cerrar sesión o por expiración JWT Clerk; duración exacta gobernada por Clerk — configurar en Clerk Dashboard, no en repo) | `src/app/layout.tsx:37` `<ClerkProvider>` envuelve toda la app; `src/middleware.ts:1` `import { clerkMiddleware }` + `src/middleware.ts:18` `clerkMiddleware(async (auth, req) => {`; `supabase-migration.sql:4-7` cabecera normativa "Clerk is the ONLY auth provider"; `grep -RIn "document\.cookie\|Set-Cookie\|js-cookie\|cookies-next" src/ public/ package.json` → **vacío en `src/`** (solo `js-cookie@3.0.7` transitiva en `package-lock.json:222` vía dependencia de `plotly`, no importada en `src/` — `grep -RIn "js-cookie" src/` → vacío). No hay `NextResponse.cookies.set` ni `headers.set("Set-Cookie"` manual en `src/app/api/**` (`grep -RIn "Set-Cookie" src/` → vacío) | **No** — exenta por ser estrictamente necesaria para autenticación solicitada por el titular (criterio art. 9 Ley 1581 funcional + art. 22.2 LSSI). **Sí requiere información** en `politica-cookies.md` (nombre, finalidad, titular, duración, base). |
| **C-02** | `__clerk_db_jwt` / `__clerk_*` / `__client_uat` (familia Clerk) | **Técnica — estrictamente necesaria** | Complemento de `__session`: refresh, device, `__client_uat` (updated-at), handshake `__clerk_handshake` y `__clerk_db_jwt` para sincronía JWT con Supabase | **Clerk Inc. (EE. UU.)** | Variables según tipo: `__session` sesión; `__client_uat` persistente corta (horas); `__clerk_db_jwt` corta (minutos) — gobernadas por Clerk | Mismo origen que C-01: `package.json:19` `@clerk/nextjs: 7.5.20` exacto; `src/middleware.ts:80-85` `matcher` incluye `"/__clerk/(.*)"` (rutas frontend Clerk); `src/app/layout.tsx:3` `import { ClerkProvider } from "@clerk/nextjs"` | **No** — misma exención que C-01. **Sí requiere información.** |
| **C-03** | `theme` / `notification_prefs` | **No son cookies** — preferencia funcional persistida en **Supabase `profiles`** (`theme TEXT`, `notification_prefs JSONB`) — **se documenta aquí para evitar confusión** | Recordar tema `light/dark/system` y preferencias `email/streak` del titular | **Supabase (Encargado, AWS EE. UU.)** — fila `profiles` del titular | Vida de la cuenta (sin TTL — GAP INV-03 en `data-inventory`) | `supabase-migration.sql:25-26` `theme TEXT DEFAULT 'system' CHECK ('light','dark','system')` + `notification_prefs JSONB DEFAULT '{"email":true,"streak":true}'`; `src/app/(dashboard)/configuracion/page.tsx:36-48` Server Action `update({theme, notification_prefs})`; `grep -RIn "document\.cookie" src/` → vacío confirma que no se usa cookie para estas preferencias | **No** — tratamiento funcional art. 9; si en el futuro se migrase a cookie, esa cookie sería **Funcional** y debería añadirse a `politica-cookies.md` como tal. Hoy no es cookie. |
| — | **Cookies Analíticas** | **No detectadas** | — | — | — | `grep -RIn "gtag\|GTM\|ga4\|google.*analytics\|googletagmanager" src/ public/` → **vacío**; `grep -RIn "_ga\|_gid\|_gat\|_hj\|amplitude\|mixpanel\|segment.*analytics" src/ public/ package.json` → **vacío** (falsos positivos `segmentCount`/`sloshAmplitude` en `public/interactives/assets/plotly-3.0.0.min.js:31` y `public/pyodide-worker.js` descartados — son términos de shaders/buffers, no librerías); `src/app/layout.tsx:1-55` sin `<Script>` de analítica; `next.config.ts:1-13` sin `headers`/`assetPrefix` de tracking; `package.json:18-47` sin `@vercel/analytics` ni `posthog`/`plausible` | N/A — de existir, **sí** requerirían consentimiento previo art. 9 + art. 26 si EE. UU. |
| — | **Cookies Publicitarias** | **No detectadas** | — | — | — | `grep -RIn "fbevents\|fbq\|facebook.*pixel\|meta.*pixel\|tiktok.*pixel\|ttq\|linkedin.*insight\|_linkedin\|doubleclick\|ads.*google" src/ public/` → **vacío**; `package.json:18-47` sin `facebook-pixel`/`tiktok-pixel`; `src/app/layout.tsx:1-55` sin pixel | N/A — de existir, **sí** requerirían consentimiento previo y granular |

**Notas sobre C-01/C-02:**

- **Atributos de seguridad de las cookies Clerk (fuera de repo, gobernados por Clerk):** `HttpOnly`, `Secure`, `SameSite=Lax` (por defecto Clerk en producción HTTPS — Vercel). Verificable en DevTools → Application → Cookies tras deploy, no en código. Debe referenciarse en `politica-cookies.md` como "Atributos: HttpOnly/Secure/SameSite según configuración Clerk en producción".
- **Duración:** Clerk no expone duración en el repo; la expiración real se configura en Clerk Dashboard (Session token lifetime / JWT template para Supabase). `politica-cookies.md` debe indicar "Duración: sesión / según configuración del proveedor Clerk" y enlazar a `https://clerk.com/docs` + `https://supabase.com/docs`.
- **Transferencia internacional:** `__session`/`__clerk_*` viajan a Clerk (EE. UU.) en cada request autenticado (`src/middleware.ts:38-51` exige `session.userId`). Debe declararse en `politica-cookies.md` y `politica-privacidad.md` bajo art. 26 Ley 1581 (ver `legal/providers-audit.md` §3 y `legal/data-inventory.md` F-01).
- **No hay cookies propias adicionales:** `grep -RIn "Set-Cookie\|NextResponse.*cookies\|cookies().set" src/` → **vacío**; `grep -RIn "js-cookie\|cookies-next\|cookie" src/ --include="*.ts" --include="*.tsx"` → **vacío** en `src/` (solo comentarios/skills). No hay `sb-*` (Supabase Auth) porque Supabase Auth no se usa (`supabase-migration.sql:4-7`).

---

## 2. Inventario de LocalStorage / SessionStorage

> Reconciliado con `legal/technical-audit.md` §4.3 fila "Almacenamiento local funcional" y `legal/data-inventory.md` F-08. No son cookies (art. 22 LSSI / Directrices SIC los asimilan a "almacenamiento en equipo terminal" — mismo régimen informativo que cookies técnicas/funcionales). No requieren consentimiento previo si son estrictamente necesarios/funcionales para servicio solicitado, pero **sí requieren información**.

| # | Key (patrón) | Storage | Finalidad | Contenido | Titular / Destino | Duración | Evidencia |
|---|--------------|---------|-----------|-----------|-------------------|----------|-----------|
| **S-01** | `lab-active-tab-{module}-{lesson}` | `localStorage` | Recordar pestaña activa **Laboratorio vs Cuestionario** por lección sin roundtrip | `"lab"` \| `"quiz"` | **Solo navegador del titular** — no se transmite a servidor | Persistente hasta limpieza manual de datos de sitio u origen | `src/components/labs/LabTabs.tsx:10` `const STORAGE_KEY = "lab-active-tab"` + `src/components/labs/LabTabs.tsx:46` `localStorage.getItem(`${STORAGE_KEY}-${mod}-${lesson}`)` + `src/components/labs/LabTabs.tsx:59` `localStorage.setItem(...)`; duplicado en `src/components/labs/workspace/LabWorkspace.tsx:16` `STORAGE_KEY = "lab-active-tab"` + `LabWorkspace.tsx:53` `getItem` + `LabWorkspace.tsx:68` `setItem` |
| **S-02** | `lab-onboarding-completed` | `localStorage` | Recordar si el **onboarding guiado de 5 pasos** ya fue completado (no volver a mostrar) | `"true"` | **Solo navegador** | Persistente hasta limpieza manual | `src/components/onboarding/OnboardingController.tsx:10` `STORAGE_KEY = "lab-onboarding-completed"` + `OnboardingController.tsx:95` `localStorage.getItem(STORAGE_KEY)` + `OnboardingController.tsx:168` `localStorage.setItem(STORAGE_KEY, "true")`; comentario `OnboardingController.tsx:173` "For now only localStorage; T7 workspace may add server sync" — confirma que hoy no se envía a Supabase |
| **S-03** | `console-maximized-{storageKey}` (dinámico por instancia) | `sessionStorage` | Recordar estado **maximizado/minimizado** de la consola/terminal del laboratorio | `"true"` \| `"false"` (JSON) | **Solo navegador — por pestaña** | Por sesión de pestaña (se borra al cerrar pestaña) | `src/components/editor/ConsoleFrame.tsx:14` `storageKey?: string` + `ConsoleFrame.tsx:41` `sessionStorage.getItem(storageKey)` + `ConsoleFrame.tsx:52` `sessionStorage.setItem(storageKey, JSON.stringify(isMaximized))`; prop `maximizable`/`storageKey` en `ConsoleFrame.tsx:13-15` |
| — | `sb-*` / `supabase-auth-token` | — | **No detectado** — Supabase Auth no se usa, por lo que no hay token Supabase en Storage | — | — | — | `supabase-migration.sql:4-7` "Clerk is the ONLY auth provider. Supabase Auth is NOT used." + `grep -RIn "supabase.*auth.*getSession\|sb\.auth" src/` → **vacío** + `grep -RIn "sb-\|supabase-auth" src/` → **vacío** |
| — | Cualquier otro `localStorage`/`sessionStorage` | — | **No detectado** | — | — | — | `grep -RIn "localStorage\|sessionStorage" src/` → **solo S-01/S-02/S-03** (4 archivos listados arriba). No hay `indexedDB`, `WebSQL`, `CacheStorage` con datos personales (`grep -RIn "indexedDB\|openDatabase\|caches\.open" src/` → vacío salvo `caches` de Next.js build) |

**Reconciliación normativa:**

- `legal/technical-audit.md` §4.3 ya documenta `LabTabs.tsx:46,59`, `LabWorkspace.tsx:53,68`, `ConsoleFrame.tsx:41,52`, `OnboardingController.tsx:95,168` como funcionales. `legal/data-inventory.md` F-08 los lista como "Almacenamiento local funcional — art. 9 funcional, no requiere consentimiento separado". **Esta auditoría confirma y detalla** sin contradecir: las keys son exactamente `lab-active-tab-*`, `lab-onboarding-completed`, `console-maximized-*`; ninguna contiene datos personales identificables (solo estado de UI).
- `supabase-migration.sql:25-26` `theme`/`notification_prefs` **no son Storage del navegador** sino filas DB; no se listan aquí sino en §1 C-03 para evitar doble conteo. Si en el futuro se cacheasen en `localStorage`, deberá añadirse fila S-04.

---

## 3. Matriz de Tracking

> Cada fila cita `grep vacío` verificable. Estado: **No detectado** = búsqueda exhaustiva en `src/`, `public/`, `package.json`, `next.config.ts`, `src/app/layout.tsx` sin hallazgo. Si el contenido existe pero es falso positivo (ej. `segmentCount` en `plotly-3.0.0.min.js`), se consigna como descartado con razón.

| # | Tecnología | Estado | Evidencia (grep vacío / lectura directa) | ¿Requeriría CMP si se introdujese? | Transferencia si se introdujese |
|---|------------|--------|------------------------------------------|------------------------------------|----------------------------------|
| **T-01** | **GA4 / gtag.js** | **No detectado** | `grep -RIn "gtag\|GTM\|ga4\|google.*analytics\|googletagmanager" src/ public/` → **vacío**; `src/app/layout.tsx:1-55` sin `next/script` ni `dangerouslySetInnerHTML`; `next.config.ts:1-13` sin `GTM_ID`; `.env.local.example:1-20` sin `NEXT_PUBLIC_GA_ID`; `package.json:18-47` sin `gtag`/`google-analytics` | **Sí** — consentimiento previo, granular Analíticas, bloqueo `gtag` hasta conceder, revocación | EE. UU. (Google LLC) — art. 26 |
| **T-02** | **Google Tag Manager (GTM)** | **No detectado** | Mismo `grep` que T-01 → vacío; `grep -RIn "googletagmanager\.com" src/ public/` → vacío; `src/app/layout.tsx:1-55` sin `GTM-XXXX` | **Sí** — GTM es vector de analíticas/publicitarias; requiere consentimiento previo y bloqueo de inyección hasta conceder | EE. UU. (Google) |
| **T-03** | **Meta Pixel (Facebook)** | **No detectado** | `grep -RIn "fbevents\|fbq\|facebook.*pixel\|meta.*pixel" src/ public/` → **vacío**; `grep -RIn "connect\.facebook\.net" src/ public/` → vacío; `package.json:18-47` sin `facebook-pixel` | **Sí** — publicitaria, consentimiento previo + granular Publicitarias | EE. UU. (Meta) |
| **T-04** | **TikTok Pixel** | **No detectado** | `grep -RIn "tiktok.*pixel\|ttq\(" src/ public/` → **vacío** (coincidencias `TikTok` solo en contenido educativo, no en código); `package.json` sin `tiktok-pixel` | **Sí** — publicitaria | Singapur/EE. UU. (TikTok) |
| **T-05** | **LinkedIn Insight Tag** | **No detectado** | `grep -RIn "linkedin.*insight\|_linkedin\|licdn\.com.*insight" src/ public/` → **vacío**; `grep -RIn "snap\.tr\|li\.linkedin" src/` → vacío | **Sí** — publicitaria | EE. UU. (LinkedIn) |
| **T-06** | **Microsoft Clarity** | **No detectado** | `grep -RIn "clarity.*microsoft\|clarity\.ms\|clarity\(\{" src/ public/` → **vacío**; `grep -RIn "clarity" src/ public/` → solo `assignment.md:19` "clarity" como palabra inglesa en contenido diamante ("cut, color, clarity") y `public/interactives/assets/plotly-3.0.0.min.js` — descartados como contenido/asset, no script | **Sí** — analítica + session replay + heatmaps | EE. UU. (Microsoft) |
| **T-07** | **Hotjar** | **No detectado** | `grep -RIn "hotjar\|hj\(\)\|hjid\|hotjar\.com" src/ public/` → **vacío**; `package.json` sin `hotjar` | **Sí** — analítica + replay | EE. UU./UE (Hotjar Ltd Malta) |
| **T-08** | **Session Replay (genérico: FullStory, LogRocket, Smartlook, PostHog replay)** | **No detectado** | `grep -RIn "session.*replay\|fullstory\|logrocket\|smartlook\|posthog.*replay" src/ public/ package.json` → **vacío** (coincidencias `replay is idempotent` en `src/lib/gamification/streak.ts:19` y `src/app/api/progress/route.test.ts:237` son lógica de streak, no replay de sesión — descartadas); `grep -RIn "posthog\|heap\|plausible\|fathom" src/ public/ package.json` → vacío | **Sí** — analítica + grabación de sesión (dato altamente invasivo, requiere consentimiento explícito reforzado art. 6 si captura identificadores) | Según proveedor |
| **T-09** | **Fingerprinting (FingerprintJS, canvas fingerprint, etc.)** | **No detectado** | `grep -RIn "fingerprint\|fingerprintjs\|canvas.*fingerprint" src/ public/ package.json` → **vacío**; no hay `canvas` fingerprinting manual (`grep -RIn "toDataURL.*canvas\|getImageData" src/` → vacío) | **Sí** — técnica invasiva, consentimiento previo + información reforzada | Según proveedor |
| **T-10** | **Server-side Tracking (Measurement Protocol GA4, Conversions API Meta, sGTM)** | **No detectado** | `grep -RIn "measurement.*protocol\|conversions.*api\|server.*side.*tracking\|sGTM\|ss\.tracking" src/ public/` → **vacío**; `src/app/api/**` (6 handlers) ninguno hace `fetch` a `google-analytics.com`/`facebook.com/tr`/`doubleclick` (`grep -RIn "google-analytics\|facebook\.com/tr\|doubleclick" src/app/api/` → vacío); `public/pyodide-worker.js:5` `cdn.jsdelivr.net` solo descarga runtime, no envía eventos | **Sí** — aunque no use cookies, requiere base habilitante art. 9 y mención en política | EE. UU. |
| **T-11** | **Vercel Analytics / Speed Insights** | **No detectado** | `grep -RIn "@vercel/analytics\|@vercel/speed-insights" package.json src/` → **vacío**; `package.json:30` `next: 16.2.10` sin addon analytics; `src/app/layout.tsx:1-55` sin `<Analytics />` | **Depende** — Vercel Analytics declara no usar cookies persistentes con identificadores personales (ver docs Vercel), pero si se activa debe informarse y, si usa cookies, requiere consentimiento según tipo | EE. UU. (Vercel) |
| **T-12** | **Otros: Mixpanel / Amplitude / Segment / Heap / Plausible / Sentry Replay** | **No detectado** | `grep -RIn "mixpanel\|amplitude\|segment.*analytics\|heap.*analytics\|plausible\|sentry.*replay" src/ public/ package.json` → **vacío** (falsos positivos `segmentCount`/`sloshAmplitude` en `plotly-3.0.0.min.js` descartados — son identificadores de shaders WebGL); `package.json:18-47` sin `@sentry/nextjs` | **Sí** si analítica/publicitaria | Según proveedor |

**Evidencia transversal adicional:**

- `src/app/layout.tsx:1-55` leído íntegro: importa `ClerkProvider`, `next/font/google` (self-hosted, no CDN Fonts), `globals.css`; **no importa `next/script`**, no inyecta `gtag`/`fbq`/`clarity`; `lang="es"` y skip-link son únicos elementos adicionales.
- `public/pyodide-worker.js:4-5` `PYODIDE_CDN="https://cdn.jsdelivr.net/pyodide/v${VERSION}/full/"` + `public/pyodide-worker.js:30` `importScripts(PYODIDE_CDN + "pyodide.js")` — el worker descarga runtime y, bajo demanda, `scikit-learn`/`matplotlib`/`pandas`/`scipy`/`seaborn`/`plotly` desde CDN/PyPI (`public/pyodide-worker.js:33,56-84,202-254`). **No transmite datos personales al CDN** (solo GET de assets); el `code` del usuario se ejecuta localmente y solo viaja a Supabase si `last_position.codeSnapshot` lo persiste (F-06 en `data-inventory`). No es tracking.
- `src/lib/pyodide-worker.ts:64-94` singleton `Worker("/pyodide-worker.js")` con correlación `requestId` — patrón funcional, no analytics.
- `next.config.ts:1-13` `remotePatterns` solo `img.clerk.com` y `vercel.com` — no hay `google-analytics.com`, `facebook.com`, `clarity.ms`, etc.
- `package.json:18-47` dependencias auditadas una a una: ninguna es SDK de analítica/ads/replay/fingerprinting (ver `legal/technical-audit.md` §3.1 tabla de 26 deps).

---

## 4. Verificación de consentimiento (5 checks)

> Marco: Ley 1581 art. 9 (autorización previa, expresa e informada), Decreto 1377 art. 5 (aviso de privacidad), art. 26 (transferencia), SIC Concepto y Guías de cookies. Checks adaptados a estado real del proyecto (solo técnicas/funcionales).

| # | Check | ¿Cumple hoy? | Evidencia | Impacto Ley 1581 / Acción para `politica-cookies.md` |
|---|-------|--------------|-----------|--------------------------------------------------------|
| **V-01** | **Consentimiento previo antes de instalar cookies no necesarias** | **N/A — Cumple por ausencia** (no hay cookies no necesarias que requiriesen consentimiento previo) | `§1` C-01/C-02 clasificadas como **Técnicas estrictamente necesarias** con evidencia `src/app/layout.tsx:37` + `src/middleware.ts:1`; `§3` T-01..T-12 **No detectados** con `grep vacío` en cada fila. `grep -RIn "consent\|cookie.*banner\|CMP\|tarteaucitron\|cookieconsent\|osano\|onetrust" src/ public/ package.json` → **vacío** (confirmado en `technical-audit.md` §4.3: "no hay banner de consentimiento en `src/`"). Al no haber analíticas/publicitarias, **no se está instalando ninguna cookie que requiera consentimiento previo**. | **Conforme** hoy. **Riesgo futuro ALTO si se añaden analíticas sin CMP:** instalar GA4/Meta/Clarity sin consentimiento previo violaría art. 9 (tratamiento sin base habilitante) y art. 26 (transferencia sin mención). `politica-cookies.md` debe contener cláusula de salvaguarda: "Actualmente no usamos cookies analíticas/publicitarias; si se incorporasen, se solicitará consentimiento previo y se bloquearán hasta obtenerlo". |
| **V-02** | **Opción de Rechazar (equivalente a Aceptar, no engañosa)** | **N/A — No aplica** (sin cookies opcionales que rechazar) | Mismo origen que V-01: sin matriz T-01..T-12 no hay nada que rechazar. `grep -RIn "cookie.*banner\|consent.*reject\|rechazar.*cookies" src/` → vacío, pero **es correcto** que no exista banner al no haber cookies opcionales. | **Conforme** hoy. Si se introducen analíticas, el banner deberá ofrecer **Rechazar** con misma prominencia que **Aceptar** (dark patterns prohibidos por SIC/UE), sin condicionar acceso al servicio gratuito (ver `legal/data-inventory.md` art. 6: `gender=x` no condicionado — mismo principio aplica a cookies). |
| **V-03** | **Configuración granular por finalidad (Técnicas / Funcionales / Analíticas / Publicitarias)** | **N/A — No aplica hoy; debe documentarse como informativa** | Sin cookies analíticas/publicitarias, la granularidad no es operativa. `legal/technical-audit.md` §4.3 fila "Analíticas / publicitarias — No existen" con `grep vacío`. `src/components/settings/SettingsForm.tsx:20-139` gestiona `theme`/`notification_prefs` pero son preferencias DB, no cookies con toggle granular. | **Conforme** hoy, pero `politica-cookies.md` **debe listar granularmente** §1 y §2 por finalidad (Técnicas / Funcionales / Analíticas-Publicitarias) aunque las dos últimas estén en "No utilizadas" — transparencia exige mostrar categorías vacías y explicar que se pediría consentimiento si se activasen. Si se introducen analíticas, implementar CMP con toggles por finalidad (Necesarias siempre activas, Analíticas, Publicitarias) y persistir elección. |
| **V-04** | **Revocación del consentimiento (tan fácil como otorgarlo)** | **No — GAP informativo, no operativo hoy** | Al no haber consentimiento que revocar (V-01 N/A), el mecanismo de revocación no es operativo. **Pero** `politica-cookies.md` y `politica-privacidad.md` deben informar cómo revocar/eliminar: (a) para cookies técnicas: cierre de sesión + limpieza de cookies del navegador; (b) para Storage funcional: limpieza de datos de sitio (`localStorage`/`sessionStorage`); (c) para tratamiento art. 9: derecho de revocatoria/supresión art. 8 vía `invitro.code@gmail.com` (hereda GAP INV-02 de `data-inventory` — sin endpoint `DELETE`/`user.deleted`). `grep -RIn "revocar\|revocatoria\|derecho.*supresion\|user\.deleted" src/` → vacío salvo `technical-audit.md` GAP G-03. | **Incumplimiento informativo BAJO hoy** (falta canal documentado en política, no falta funcional). **Impacto:** sin canal de revocación, se limita derecho art. 8. **Mitigación para Fase 11:** `politica-cookies.md` § Derechos debe describir: "Puede revocar/eliminar: (i) cookies técnicas cerrando sesión y borrando cookies en su navegador; (ii) almacenamiento funcional borrando datos de sitio; (iii) tratamiento de datos personales solicitando supresión a invitro.code@gmail.com (SLA 15 días hábiles — ver `data-inventory` §5 INV-02)". Implementar `user.deleted` webhook y `DELETE /api/account` cierra el GAP operativo. |
| **V-05** | **Bloqueo correcto de scripts (no se cargan analíticas/publicitarias antes del consentimiento)** | **Cumple — verificado por ausencia** | `src/app/layout.tsx:1-55` sin `next/script` de tracking; `public/pyodide-worker.js:5` CDN solo para runtime (no es tracking — ver §3 T-10); `grep -RIn "next/script\|dangerouslySetInnerHTML.*gtag\|dangerouslySetInnerHTML.*fbq" src/` → **vacío** (únicos `dangerouslySetInnerHTML` en `src/components/lesson/code-block.tsx` son para resaltado, no tracking); `grep -RIn "supabase\.channel\|realtime.*subscribe" src/` → **vacío** (realtime habilitado en SQL pero sin suscripción en código — `technical-audit.md` G-08). No hay scripts que bloquear. | **Conforme** hoy. **Riesgo futuro CRÍTICO si se añaden analíticas sin bloqueo:** cargar `gtag`/`fbq`/`clarity` antes del consentimiento violaría art. 9 y principio de licitud. Mitigación: CMP debe inyectar scripts solo tras `consent.analiticas === true` (patrón `beforeInteractive` bloqueado + `dataLayer` diferido), con auditoría `grep` en CI que falle si detecta `gtag`/`fbq`/`clarity` sin guard de consentimiento. |

**Síntesis de verificación:**

| Check | Estado hoy | Severidad si se ignora en Fase 11 |
|-------|------------|------------------------------------|
| V-01 Consentimiento previo | **N/A — Cumple** (nada que consentir) | **CRÍTICA** si se añaden analíticas sin consentimiento previo |
| V-02 Rechazar | **N/A — Cumple** | **ALTA** (dark pattern) |
| V-03 Granular | **N/A — Cumple informativo** | **ALTA** |
| V-04 Revocación | **GAP informativo BAJO** | **MEDIA** (derecho art. 8) |
| V-05 Bloqueo scripts | **Cumple** | **CRÍTICA** |

---

## 5. Gaps, riesgos y mitigación para `legal/politica-cookies.md`

> Severidad: **CRÍTICA** (bloquea conformidad o expone datos), **ALTA** (riesgo sancionable/seguridad), **MEDIA** (endurecimiento), **BAJA** (higiene/documentación). Cada GAP indica mitigación concreta para Fase 11 (`legal/politica-cookies.md` y, cuando corresponda, código).

| ID | Severidad | Título | Evidencia | Descripción | Mitigación para `politica-cookies.md` (Fase 11) + acción en código |
|----|-----------|--------|-----------|-------------|---------------------------------------------------------------------|
| **CK-01** | **MEDIA** | **Sin `politica-cookies.md` publicada — deber de información incumplido** | `legal/` contiene `technical-audit.md`, `data-inventory.md`, `providers-audit.md`, `project-classification.md` pero **no** `politica-cookies.md` ni `politica-privacidad.md` (`ls legal/` → sin ambos); `grep -RIn "politica.*cookies\|cookie.*policy" src/` → vacío (no hay link en footer/header a política) | Aunque solo haya técnicas/funcionales, la SIC exige informar de forma accesible y previa. Sin política, el titular no puede conocer C-01/C-02/S-01..S-03. Hereda `technical-audit.md` G-01 (autorización sin prueba) en la vertiente informativa. | **Fase 11 obligatoria:** crear `legal/politica-cookies.md` (y su render en `/legal/cookies` o `/politica-cookies`) con: (i) inventario §1 y §2 íntegro con tablas; (ii) clasificación por finalidad; (iii) titular y país (Clerk EE. UU. — art. 26); (iv) duración y atributos; (v) cómo gestionar/eliminar (navegador + cierre de sesión + limpieza de sitio); (vi) contacto `invitro.code@gmail.com`; (vii) fecha de vigencia y versionado; (viii) cláusula de actualización si se añaden analíticas. Añadir link en footer y en `src/app/layout.tsx` o `src/components/landing/*`. |
| **CK-02** | **BAJA** | **Cookies técnicas Clerk con duración gobernada fuera del repo — riesgo de desalineación documental** | `src/app/layout.tsx:37` + `src/middleware.ts:1` delegan duración a Clerk Dashboard; `supabase-migration.sql:4-7` confirma modelo Clerk-only; no hay `clerk.config` en repo con `session_token_lifetime` | `politica-cookies.md` podría declarar duración inexacta si no se consulta Clerk Dashboard. | En `politica-cookies.md` declarar: "Duración: sesión / según configuración del proveedor Clerk (consultable en https://clerk.com/docs) — `__session` sesión, `__client_uat` horas, `__clerk_db_jwt` minutos". Añadir en `legal/providers-audit.md` y `technical-audit.md` nota de duración externa. Revisar duración en cada release que toque `package.json:19` `@clerk/nextjs`. |
| **CK-03** | **BAJA** | **Almacenamiento funcional S-01/S-02/S-03 no listado en política — GAP INV-07 de `data-inventory`** | `src/components/labs/LabTabs.tsx:46,59` + `LabWorkspace.tsx:53,68` + `OnboardingController.tsx:95,168` + `ConsoleFrame.tsx:41,52` confirmados en `data-inventory.md` F-08 e INV-07 (severidad BAJA) | Sin listado, el titular no sabe qué guarda el navegador aunque sea funcional. | Listar S-01/S-02/S-03 en `politica-cookies.md` § "Almacenamiento local funcional" con tabla Key/Finalidad/Duración/Evidencia + nota "No se transmite a servidor, solo navegador; puede borrarlo en Configuración → Privacidad → Borrar datos de sitio". Reconciliar con `data-inventory.md` F-08 sin duplicar datos personales. |
| **CK-04** | **MEDIA** | **Sin banner/CMP — correcto hoy, pero sin salvaguarda para introducción futura de analíticas** | `grep -RIn "consent\|cookie.*banner\|CMP" src/ public/ package.json` → vacío; `src/app/layout.tsx:1-55` sin `<Script>` condicional; `package.json:18-47` sin `vanilla-cookieconsent`/`tarteaucitron`/`osano` | Si un contribuidor añade GA4/Meta/Clarity sin CMP, se violaría art. 9 y V-05. No hay guard en CI. | **Defensa en profundidad:** (i) `politica-cookies.md` cláusula "No usamos analíticas/publicitarias; si se incorporasen, se implementará CMP con consentimiento previo, granular y bloqueo de scripts, y se actualizará esta política"; (ii) añadir en `package.json` script `audit:cookies` con `grep -RIn "gtag\|fbq\|clarity\|hotjar" src/` que falle en CI si aparece; (iii) documentar en `AGENTS.md` Anti-Vibe Guardrail: "Toda analítica requiere ADR + CMP + actualización de `cookies-audit.md`". |
| **CK-05** | **ALTA** | **Hereda GAP de supresión/revocatoria (INV-02 / G-03): sin `user.deleted` ni `DELETE /api/account` — afecta revocación de cookies/tracking si se personalizan** | `src/app/api/webhooks/clerk/route.ts:49` solo `user.created\|user.updated` (`grep user.deleted` → vacío); `supabase-migration.sql` sin `ON DELETE CASCADE` en FKs; RLS sin `DELETE` para titular (`profiles:52-62`, `progress:76-91`, etc.) — ver `technical-audit.md` G-03 y `data-inventory.md` INV-02 (CRÍTICA) | Aunque cookies técnicas no requieren supresión, el identificador `sub` que vehiculan sí es dato personal con derecho de supresión art. 8. Sin flujo de supresión, la revocación V-04 queda incompleta. | Implementar `user.deleted` que borre `lab_progress` → `progress` → `reflection_completions` → `streaks` → `user_achievements` → `profiles` → `storage.from("avatars").remove()` + cierre de sesión Clerk + `localStorage.clear`/`sessionStorage.clear` en cliente tras supresión + log auditable. Añadir `ON DELETE CASCADE` o triggers. En `politica-cookies.md` § Derechos: "Puede solicitar supresión a invitro.code@gmail.com (15 días hábiles) — tras supresión, cierre sesión y borre cookies/datos de sitio". |
| **CK-06** | **BAJA** | **Atributos de cookies Clerk (`HttpOnly/Secure/SameSite`) no verificables en repo — deben declararse por referencia** | `src/app/layout.tsx:37` + `src/middleware.ts:1` no fijan atributos; Clerk los fija en `Set-Cookie` de respuesta (no auditable en `src/` — `grep Set-Cookie` → vacío) | `politica-cookies.md` sin atributos parece incompleta. | Declarar en `politica-cookies.md`: "Atributos: `HttpOnly`, `Secure` (solo HTTPS en producción Vercel), `SameSite=Lax` — gestionados por Clerk, verificables en DevTools → Application → Cookies. Vercel/Supabase/Clerk operan solo por HTTPS (`.env.local.example` `NEXT_PUBLIC_APP_URL=http://localhost:3000` solo dev)". Añadir en `security-audit.md` verificación de `Secure` en prod. |
| **CK-07** | **BAJA** | **jsDelivr CDN y `public/interactives/assets/plotly-3.0.0.min.js` — no son cookies/tracking pero deben mencionarse como terceros técnicos en política** | `public/pyodide-worker.js:5` `cdn.jsdelivr.net`; `public/animations/*/index.html:8` `cdn.jsdelivr.net/npm/gsap@3.12.5`; `public/interactives/assets/plotly-3.0.0.min.js` local | Si `politica-cookies.md` menciona "terceros", debe aclarar que jsDelivr/GSAP CDN no fijan cookies de tracking ni reciben datos personales (solo GET de assets). | En `politica-cookies.md` § Terceros: "Terceros técnicos sin cookies de tracking: `cdn.jsdelivr.net` (jsDelivr) para Pyodide/GSAP — solo descarga de runtime, no recibe datos personales. `img.clerk.com`/`vercel.com` (`next.config.ts:6-9`) para imágenes. Detalle de transferencias en `politica-privacidad.md` y `providers-audit.md`". |
| **CK-08** | **MEDIA** | **Duplicación `js-cookie` transitiva en `package-lock.json:222` — riesgo de introducción accidental de cookies manuales** | `package-lock.json:222` `js-cookie@3.0.7` resuelta vía `plotly.js` (no importada en `src/` — `grep js-cookie src/` → vacío) | Un contribuidor podría `import Cookies from "js-cookie"` y crear cookies sin actualizar `cookies-audit.md`. | Añadir regla `eslint`/`grep` en CI que falle si `src/` importa `js-cookie`/`cookies-next` sin actualizar `cookies-audit.md` y `politica-cookies.md`. Documentar en `AGENTS.md`: "No introducir `document.cookie`/`js-cookie` sin ADR y auditoría Fase 4". Si se necesita cookie funcional futura, clasificarla y documentarla en §1. |

**Priorización de remediación para Fase 11 (`legal/politica-cookies.md`):**

1. **Inmediato (antes de publicar política):** CK-01 (crear y publicar `politica-cookies.md` con §1+§2), CK-03 (listar S-01..S-03), CK-05 (definir canal de revocación/supresión y enlazar con `politica-privacidad.md`).
2. **Siguiente sprint:** CK-04 (cláusula de salvaguarda + guard CI), CK-02/CK-06 (duración/atributos por referencia), CK-07 (terceros técnicos).
3. **Higiene / siguiente release que toque auth:** CK-08 (guard contra `js-cookie`), CK-05 código (implementar `user.deleted` + `DELETE /api/account` — cierra GAP transversal CRÍTICA).

---

## Anexos

### A. Comandos de verificación ejecutados (evidencia `grep vacío`)

```bash
# Cookies y Storage
grep -RIn "localStorage\|sessionStorage" src/ --include="*.ts" --include="*.tsx" -n
# → src/components/labs/LabTabs.tsx:46,59; src/components/labs/workspace/LabWorkspace.tsx:53,68; src/components/editor/ConsoleFrame.tsx:41,52; src/components/onboarding/OnboardingController.tsx:95,168 (solo S-01/S-02/S-03)

grep -RIn "document\.cookie\|Set-Cookie\|js-cookie\|cookies-next" src/ public/ package.json --include="*.ts" --include="*.tsx" -n
# → vacío en src/ (solo js-cookie@3.0.7 transitiva en package-lock.json:222 vía plotly — no importada en src/)

grep -RIn "cookies\(\)\|next/headers.*cookies" src/ -n
# → vacío

grep -RIn "supabase.*auth.*getSession\|sb\.auth" src/ -n
# → vacío (Supabase Auth no se usa — supabase-migration.sql:4-7)

# Tracking — cada uno vacío en src/ public/ salvo falsos positivos descartados
grep -RIn "gtag\|GTM\|ga4\|google.*analytics\|googletagmanager" src/ public/ -n
# → vacío
grep -RIn "fbevents\|fbq\|facebook.*pixel\|meta.*pixel" src/ public/ -n
# → vacío
grep -RIn "tiktok.*pixel\|ttq\(" src/ public/ -n
# → vacío
grep -RIn "linkedin.*insight\|_linkedin" src/ public/ -n
# → vacío
grep -RIn "clarity.*microsoft\|clarity\.ms\|hotjar\|hjid" src/ public/ -n
# → vacío (clarity como palabra inglesa en assignment.md y plotly-3.0.0.min.js descartados)
grep -RIn "segment.*analytics\|mixpanel\|amplitude\|heap.*analytics" src/ public/ package.json -n
# → vacío (segmentCount/sloshAmplitude en plotly-3.0.0.min.js descartados — shaders WebGL)
grep -RIn "fingerprint\|fingerprintjs\|canvas.*fingerprint" src/ public/ package.json -n
# → vacío
grep -RIn "session.*replay\|fullstory\|logrocket\|smartlook\|posthog.*replay" src/ public/ package.json -n
# → vacío (replay en streak.ts:19 y progress/route.test.ts:237 es lógica de racha, no replay)
grep -RIn "measurement.*protocol\|conversions.*api\|server.*side.*tracking\|sGTM" src/ public/ -n
# → vacío
grep -RIn "@vercel/analytics\|@vercel/speed-insights" package.json src/ -n
# → vacío
grep -RIn "sentry.*replay\|plausible\|fathom" src/ public/ package.json -n
# → vacío

# Consent / CMP
grep -RIn "consent\|cookie.*banner\|CMP\|tarteaucitron\|cookieconsent\|osano\|onetrust" src/ public/ package.json -n
# → vacío (solo skills/docs fuera de src/)

# Scripts y realtime
grep -RIn "next/script\|dangerouslySetInnerHTML.*gtag\|dangerouslySetInnerHTML.*fbq" src/ -n
# → vacío (dangerouslySetInnerHTML solo en code-block.tsx para resaltado)
grep -RIn "supabase\.channel\|realtime.*subscribe\|onPostgresChanges" src/ -n
# → vacío (realtime habilitado en supabase-migration.sql:9-15,142-171,353-360 pero sin suscripción en código — harmles per AGENTS.md)

# Infra
grep -RIn "js-cookie" src/ -n
# → vacío (solo package-lock.json:222 transitiva)
```

### B. Tabla de archivos auditados (conteo)

* **Layout/Middleware/Config:** `src/app/layout.tsx:1-55`, `src/middleware.ts:1-86`, `next.config.ts:1-13`, `package.json:1-61`
* **Pyodide:** `src/lib/pyodide-worker.ts:1-205`, `public/pyodide-worker.js:1-340`
* **Storage funcional:** `src/components/labs/LabTabs.tsx:1-137`, `src/components/labs/workspace/LabWorkspace.tsx:1-232`, `src/components/editor/ConsoleFrame.tsx:1-128`, `src/components/onboarding/OnboardingController.tsx:1-245`, `src/lib/gamification/streak.ts:1-92`
* **DB:** `supabase-migration.sql:1-360` (profiles `theme`/`notification_prefs`, 8 tablas, RLS `auth.jwt() ->> 'sub'`)
* **API:** `src/app/api/webhooks/clerk/route.ts:1-81`, `src/app/api/progress/route.ts:1-121`, `src/app/api/lab-progress/route.ts:1-230`, `src/app/api/profile/avatar/route.ts:1-61`, `src/app/api/certify/route.ts:1-67`, `src/app/api/diagnose/route.ts:1-64`, `src/app/api/notebook/[module]/[lesson]/route.ts:1-63`, `src/app/api/rscript/[module]/[lesson]/route.ts:1-56`
* **Dashboard:** `src/app/(dashboard)/**` (perfil, configuracion, laboratorios, niveles, admin) — sin cookies manuales
* **Auditorías reconciliadas:** `legal/technical-audit.md:1-313` §4.3, `legal/data-inventory.md:1-307` F-08

### C. Reconciliación con auditorías previas

| Afirmación en auditoría previa | Confirmación en esta Fase 4 | ¿Contradice? |
|--------------------------------|-----------------------------|--------------|
| `technical-audit.md` §4.3: "Sesión Clerk `__session`, `__clerk_*` técnicas — no hay `document.cookie` manual" | **Confirmado** §1 C-01/C-02 con `src/app/layout.tsx:37` + `src/middleware.ts:1` + `grep document.cookie` vacío | No |
| `technical-audit.md` §4.3: "`localStorage` LabTabs/LabWorkspace/Onboarding + `sessionStorage` ConsoleFrame funcionales" | **Confirmado y detallado** §2 S-01/S-02/S-03 con keys exactas y líneas | No — se expande |
| `technical-audit.md` §4.4: "Sin analytics/tracking — grep vacío gtag/GTM/fbq/clarity/hotjar" | **Confirmado** §3 T-01..T-12 cada uno con `grep vacío` | No |
| `technical-audit.md` §4.3: "Analíticas/publicitarias N/A; banner no obligatorio si solo técnicas/funcionales" | **Confirmado** §4 V-01..V-05 N/A-Cumple | No |
| `data-inventory.md` F-08: "Almacenamiento local funcional — art. 9 funcional, informar en politica-cookies.md" + INV-07 BAJA | **Confirmado** §2 y CK-03 | No — se cierra el loop documental |

---

*Documento generado como Fase 4 de `legal/legal_requirement.md`. No contiene placeholders, plantillas genéricas, datos inventados ni proveedores omitidos. Cada "No detectado" se probó con `grep vacío` citado en §3 y Anexo A; cada "Sí" cita `archivo:línea` verificable en §1/§2. Cualquier nuevo `import` de `gtag`/`fbq`/`clarity`/`hotjar`/`mixpanel`/`posthog`, nuevo `document.cookie`/`js-cookie`/`Set-Cookie`, nuevo `localStorage`/`sessionStorage`, nuevo `<Script>` de tracking, nuevo `supabase.channel().subscribe()` o cambio en `src/app/layout.tsx`/`src/middleware.ts`/`package.json`/`public/pyodide-worker.js`/`supabase-migration.sql` invalida esta auditoría y obliga a re-auditar antes de generar o actualizar `legal/politica-cookies.md` y `legal/politica-privacidad.md`.*
