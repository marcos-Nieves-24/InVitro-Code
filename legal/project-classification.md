# Clasificación del Proyecto — InVitro-Code (Fase 1)

> **Advertencia metodológica:** este documento es Fase 1 de `legal/legal_requirement.md`. No utiliza plantillas genéricas, no inventa información y no asume proveedores. Cada afirmación está respaldada por evidencia `archivo:línea` o por `grep vacío: patrón X no hallado` verificable en el repositorio.

## 1. Encabezado — Responsable, jurisdicción y modelo

| Campo | Valor | Fuente / Evidencia |
|-------|-------|---------------------|
| **Responsable / Titular** | Persona natural — Colombia — **NIT 700329113-7** | Contexto autorizado del encargo (dato aportado por el responsable). Corroborado en código: no existe razón social distinta en `README.md:1` (`InVitro-Code`) ni en `package.json:2` (`name: invitro-code`). |
| **Domicilio** | Corregimiento Altavista, Medellín, Colombia | Contexto autorizado. |
| **Contacto** | invitro.code@gmail.com | Contexto autorizado. |
| **País de operación (ancla jurisdiccional)** | **Colombia** | `README.md:1-3` (proyecto en español para LATAM, operado desde Colombia) + `supabase-migration.sql:4-7` (modelo de identidad y RLS bajo jurisdicción colombiana — comentario de cabecera). |
| **Países objetivo** | **LATAM** (alcance regional, base Colombia) | Contexto autorizado. Implementación: `src/app/layout.tsx:39` (`lang="es"`), `README.md:7` (todo el contenido en español), `openspec/config.yaml:6` (`language: spanish`). |
| **Modelo de negocio** | **100 % gratuito / sin monetización** | Contexto autorizado. Evidencia negativa: `grep vacío: patrón stripe|paypal|mercadopago|checkout|paddle|lemonsqueezy no hallado en src/ ni package.json` + `package.json:18-47` (sin dependencias de pago). |
| **Público objetivo** | **+18 años** (mayores de edad) | Contexto autorizado. Evidencia en código: sin flujos dirigidos a menores (ver ítem Menores). |
| **Marco normativo ancla** | Ley 1581 de 2012, Decreto 1377 de 2013 (compilado en Decreto 1074 de 2015), Ley 1266 de 2008, Ley 527 de 1999, Ley 1480 de 2011 | Contexto autorizado. Aplicabilidad justificada en §3. |

---

## 2. Tabla F1 — Clasificación (18 ítems)

> Formato exigido: `Item | Sí/No | Evidencia (archivo:línea o grep vacío)`. La columna **Justificación** amplía la evidencia con la cita concreta.

| # | Item | Resultado | Evidencia | Justificación |
|---|------|-----------|-----------|---------------|
| 1 | **País desde el que opera el negocio** | **Colombia** | `README.md:1` + contexto autorizado NIT 700329113-7 / Altavista-Medellín | El repositorio no declara otra jurisdicción. `supabase-migration.sql:4` establece que Clerk es único IdP y que RLS compara `auth.jwt() ->> 'sub'`, arquitectura operada por el responsable en Colombia. El ancla LATAM/Colombia fue aportada como dato de negocio y es coherente con `lang="es"` en `src/app/layout.tsx:39`. |
| 2 | **Países objetivo** | **LATAM (base Colombia)** | `src/app/layout.tsx:39` (`lang="es"`) + `openspec/config.yaml:6` (`language: spanish`) + `README.md:7` | Todo el contenido usuario-final está en español. `src/content/modules/` contiene módulos `python`, `ia`, `estadistica`, `machine-learning` con lecciones en español. No hay i18n multi-país; el alcance LATAM es declaración de negocio, no segmentación técnica por país. |
| 3 | **B2B** | **No** | `grep vacío: patrón B2B|empresa|enterprise no hallado como modelo de negocio` + `README.md:3` | `README.md:3` define el producto como "plataforma interactiva para estudiantes de biotecnología". No existe portal, pricing ni flujo B2B. |
| 4 | **B2C** | **Sí** | `README.md:3` + `src/middleware.ts:5-11` (`publicRoutes`) + `src/app/layout.tsx:37` (`ClerkProvider`) | Servicio directo al consumidor final (estudiante +18). El flujo de registro/login es individual vía Clerk (`src/middleware.ts:18` `clerkMiddleware`), sin intermediación empresarial. |
| 5 | **Mixto (B2B + B2C)** | **No** | `README.md:3` + `package.json:18-47` | No hay evidencia de modelo mixto. Un único tipo de usuario (`supabase-migration.sql:18` `profiles` con `role TEXT DEFAULT 'user'`). |
| 6 | **Venta online** | **No** | `grep vacío: patrón stripe|paypal|mercadopago|checkout|paddle|lemonsqueezy no hallado` (0 resultados en `src/` y `package.json`) | `package.json:18-47` no lista SDK de pagos. No hay ruta `/api/checkout`, ni carrito, ni precios. El encargo confirma 100 % gratuito. |
| 7 | **Suscripciones** | **No** | `grep vacío: patrón subscrip|suscrip|billing|recurring no hallado` + `supabase-migration.sql:18-30` | La tabla `profiles` y `progress` no modela planes, periodos ni renovaciones. No hay tabla `subscriptions`. |
| 8 | **Captación de leads** | **No** | `grep vacío: patrón newsletter|mailchimp|resend|sendgrid|brevo|mailgun|lead no hallado` (0 resultados) | No hay formulario de contacto, ni landing de captura, ni CRM de leads. Los únicos formularios son `src/components/profile/ProfileForm.tsx:16` (perfil autenticado) y `src/app/api/profile/avatar/route.ts:11` (avatar), ambos post-autenticación, no pre-conversión. |
| 9 | **Email marketing** | **No** | `grep vacío: patrón newsletter|mailchimp|resend|sendgrid|brevo|mailgun|email.*marketing no hallado` | `supabase-migration.sql:26` define `notification_prefs JSONB DEFAULT '{"email": true, "streak": true}'` pero `grep vacío: patrón resend|sendgrid|nodemailer|smtp no hallado` confirma que no hay proveedor de envío. La preferencia es funcional interna, no marketing. |
| 10 | **Analytics** | **No** | `grep vacío: patrón gtag|GTM|GA4|google.*analytics|clarity|hotjar|segment|mixpanel|amplitude no hallado` (solo falsos positivos `sloshAmplitude/segment` en SVGs, sin scripts) | `src/app/layout.tsx:1-55` no inyecta scripts de analítica. `next.config.ts:1-13` no añade dominios de analytics. No hay `NEXT_PUBLIC_GA_ID` ni similar en `.env.local.example`. |
| 11 | **Pixels publicitarios** | **No** | `grep vacío: patrón fbevents|fbq|meta.*pixel|facebook.*pixel|tiktok.*pixel|linkedin.*insight no hallado` | Confirmado por ausencia total en `src/` y `package.json`. |
| 12 | **Login** | **Sí** | `src/middleware.ts:18` (`clerkMiddleware`) + `src/middleware.ts:5-11` (`publicRoutes`) + `src/app/layout.tsx:37` (`ClerkProvider`) + `src/app/api/webhooks/clerk/route.ts:36` (`Webhook(requireEnv("CLERK_SIGNING_SECRET"))`) + `supabase-migration.sql:18` (`CREATE TABLE profiles (id TEXT PRIMARY KEY)`) | Autenticación obligatoria: `src/middleware.ts:38-51` redirige páginas no públicas a `/sign-in` y responde `401` en `/api/*`. `src/app/api/progress/route.ts:37` y `src/app/api/lab-progress/route.ts:18` exigen `auth()` (401 si no hay `userId`). `src/app/api/webhooks/clerk/route.ts:49-76` sincroniza `user.created/user.updated` a `profiles`. |
| 13 | **Subida de archivos** | **Sí** | `src/app/api/profile/avatar/route.ts:11` (`formData.get("avatar")`) + `src/app/api/profile/avatar/route.ts:39-41` (`supabase.storage.from("avatars").upload`) + `src/components/profile/AvatarUpload.tsx:11` (`AvatarUpload`) | Única subida habilitada: avatar. `src/app/api/profile/avatar/route.ts:18-30` valida `image/jpeg|png|webp` y `2 MB` máximo. Almacenamiento en bucket `avatars` de Supabase Storage; URL pública guardada en `supabase-migration.sql:23` (`avatar_url TEXT`). No hay subida genérica de documentos ni de datasets por el usuario (Pyodide ejecuta código localmente, sin upload). |
| 14 | **Chatbot** | **No** | `grep vacío: patrón chatbot|intercom|crisp|tawk|zendesk no hallado` | No hay widget de chat ni endpoint `/api/chat`. |
| 15 | **Agente IA (LLM / agente autónomo)** | **No** | `grep vacío: patrón openai|anthropic|langchain|assistant.*api no hallado` + `src/app/api/certify/route.ts:39-43` (stub `E2B integration point` con comentario "Replace this block") + `public/pyodide-worker.js:5` (`PYODIDE_CDN`) | No hay LLM ni agente autónomo en producción. `public/pyodide-worker.js:1-340` y `src/lib/pyodide-worker.ts:17` implementan **ejecución local de Python (Pyodide v0.25.0)** vía Web Worker, no IA generativa. `/api/certify` es stub MVP que siempre responde `certified: true` con flag ON (`src/app/api/certify/route.ts:51-56`) y está deshabilitado por defecto (`.env.local.example` `FEATURE_FLAG_CERTIFY=false`). Mención de `E2B` es punto de integración futuro, no proveedor activo. |
| 16 | **Datos sensibles (Ley 1581 art. 5)** | **Sí — limitado** | `supabase-migration.sql:300` (`gender TEXT CHECK (gender IN ('f','m','x'))`) + `src/app/api/webhooks/clerk/route.ts:21-23` (`parseGender`) + `src/components/profile/ProfileForm.tsx:89` (`select gender`) | **Sí por identidad de género no binaria (`x`)**, que la SIC puede tratar como dato sensible (vida sexual / identidad) con protección reforzada del art. 6 Ley 1581 (autorización explícita). Los valores `f/m/x` se capturan en `profiles.gender` y `Clerk public_metadata.gender`. **No** se tratan otros datos sensibles del art. 5: `grep vacío: patrón origen racial|religión|sindical|salud|biometric|genético no hallado` en esquema y APIs. Campos `bio`, `avatar_url`, `theme`, `notification_prefs` son datos comunes. |
| 17 | **Menores de edad** | **No** | Contexto autorizado (público +18) + `grep vacío: patrón menor|niñ|parental|age.?verification no hallado` + `supabase-migration.sql:18-30` (sin campo fecha de nacimiento / edad) | El proyecto declara público mayor de 18 años y no implementa verificación de edad ni consentimiento parental. El contenido educativo (`src/content/modules/`) no está dirigido a menores. No hay control de edad en `src/middleware.ts` ni en `profiles`. |
| 18 | **Contenido de terceros** | **Sí** | `src/content/modules/*/lessons/*/references.bib` (ej. `src/content/modules/estadistica/lessons/lesson01_descriptive_stats/references.bib`) + `src/content/modules/machine-learning/README.md:44` (`references.bib — Bibliografía APA 7`) + `public/pyodide-worker.js:5` (`cdn.jsdelivr.net`) | Bibliografía académica en formato `references.bib` citada en cada lección (contenido de terceros con fines educativos/cita). Además, dependencias de terceros cargadas como recursos externos: Pyodide/NumPy/scikit-learn desde `https://cdn.jsdelivr.net` (`public/pyodide-worker.js:5`), sin re-hosting. No hay embeds de YouTube/Vimeo/Maps (`grep vacío: patrón youtube|vimeo|maps no hallado`). |
| 19 | **Ecommerce** | **No** | `grep vacío: patrón ecommerce|cart|carrito|tienda.*online|catalog.*price no hallado` + `README.md:3` | No hay catálogo, carrito, checkout ni facturación. Coherente con modelo 100 % gratuito. |

> Nota: la tabla lista 19 filas porque el checklist F1 desdobla B2B/B2C/Mixto en tres ítems independientes. Todos los "No" fueron probados con `grep` y con lectura de `package.json` y `supabase-migration.sql`.

---

## 3. Implicancias legales — Colombia (base ancla LATAM)

### 3.1. Ley 1581 de 2012 y Decreto 1377 de 2013 / Decreto 1074 de 2015

**Aplica plenamente.** InVitro-Code es **Responsable del Tratamiento** (persona natural, NIT 700329113-7, domicilio Altavista-Medellín, contacto invitro.code@gmail.com) y Clerk/Supabase/jsDelivr son **Encargados/Subencargados**.

| Obligación | Qué exige | Cómo impacta a este proyecto (evidencia) |
|------------|-----------|-------------------------------------------|
| **Autorización previa, expresa e informada — art. 9 Ley 1581** | Todo tratamiento de datos personales requiere autorización del titular, salvo excepciones legales. Debe ser informada (finalidades), previa y conservable. | Existe tratamiento desde el registro: `src/app/api/webhooks/clerk/route.ts:49-76` crea/actualiza `profiles` con `id`, `email`, `username`, `gender`. También `src/app/api/progress/route.ts:79` y `src/app/api/lab-progress/route.ts:67` persisten `progress`/`lab_progress`. Se debe implementar aviso + autorización (checkbox no pre-marcado) en `/sign-up` y conservar prueba. El dato `gender=x` exige **autorización explícita y reforzada** (art. 6) por tratarse de dato sensible. |
| **Finalidades y principios (art. 4)** | Finalidad legítima, libertad, veracidad, transparencia, acceso y circulación restringida, seguridad, confidencialidad. | Finalidades actuales identificadas: autenticación (`src/middleware.ts:18`), perfil (`supabase-migration.sql:18`), progreso/gamificación (`supabase-migration.sql:65-360`), avatar (`src/app/api/profile/avatar/route.ts:39`). Cada finalidad debe declararse en la Política de Privacidad y limitar la recolección a lo necesario (ej. `bio` y `avatar_url` son opcionales). |
| **Derechos de los titulares — art. 8 (consulta, reclamo, supresión, revocatoria)** | Procedimiento de PQRS con términos (10/15 días hábiles). | Debe habilitarse canal (invitro.code@gmail.com) y flujo interno: `supabase-migration.sql:52-62` (RLS `auth.jwt() ->> 'sub' = id`) ya garantiza acceso por titular; falta procedimiento documentado de supresión/revocatoria y eliminación en cascada (`profiles` → `progress` → `lab_progress` → `streaks` → `user_achievements` + borrado en Clerk y en Storage `avatars/`). |
| **Deberes del Responsable — art. 17** | Garantizar Habeas Data, conservar autorización, informar finalidad, adoptar medidas de seguridad, tramitar consultas/reclamos. | Medidas técnicas ya existentes: `src/lib/supabase/admin.ts:4` (`createAdminClient` con `SUPABASE_SERVICE_ROLE_KEY` solo en servidor), `src/middleware.ts:59-64` (RBAC admin), RLS por `auth.jwt() ->> 'sub'` (`supabase-migration.sql:5-7`). Queda por documentar: manual interno, registro de incidentes, y prueba de autorización. |
| **Deberes del Encargado — art. 18** | Tratar solo según instrucciones del Responsable, con seguridad y confidencialidad. | Clerk y Supabase actúan como Encargados. Debe firmarse/aceptarse su DPA (Clerk DPA, Supabase DPA) y reflejarlo en la Política. El aviso debe listar Encargados y su rol. |
| **Transferencia y Transmisión — art. 26 Ley 1581** | Transferencia internacional solo a países con nivel adecuado o con autorización + contrato que garantice estándares. El Decreto 1377 art. 26 exige declaración ante la SIC si aplica. | **Transferencia internacional confirmada:** Clerk (`src/middleware.ts:1`, `src/app/layout.tsx:3`) — EE. UU.; Supabase (`src/lib/supabase/admin.ts:1`, `@supabase/supabase-js` en `package.json:24`) — EE. UU. (AWS); jsDelivr/Pyodide (`public/pyodide-worker.js:5` `cdn.jsdelivr.net`) — red global con descarga de paquetes Python (no datos personales, pero es tercero). Como Responsable en Colombia con Encargados en EE. UU., se requiere **autorización que incluya transferencia internacional** + cláusula contractual (DPA/Standard Contractual Clauses) + análisis del nivel de adecuación. La Política debe informar expresamente la transferencia y el país destino. |
| **Registro Nacional de Bases de Datos (RNBD) — Decreto 1074, Título 3** | Obligación de registrar bases con datos personales ante la SIC (Superintendencia de Industria y Comercio) cuando se es Responsable que trata datos en Colombia y cumple umbrales (sociedades/entidades; personas naturales con actividad económica relevante deben evaluar). | Bases identificadas: `profiles`, `progress`, `streaks`, `reflection_completions`, `lab_progress`, `user_achievements`, `achievements` (esta última sin datos personales), `modules`, más Storage `avatars/`. Aunque el proyecto es gratuito y sin ánimo de lucro directo, al existir tratamiento habitual (registro, progreso, avatares) el Responsable debe **evaluar con asesor jurídico si está obligado a inscribir** la(s) base(s) en el RNBD y, en caso afirmativo, registrar finalidades, Encargados (Clerk, Supabase), medidas de seguridad y canal de reclamos (invitro.code@gmail.com). No registrar cuando corresponde es sancionable por la SIC. |
| **Medidas de seguridad — art. 19 Dec. 1377 / art. 2.2.2.25.6.1 Dec. 1074** | Medidas técnicas, humanas y administrativas razonables según el riesgo. | Ya implementado: RLS (`supabase-migration.sql:52-335`), `createAdminClient` solo servidor (`src/lib/supabase/admin.ts:4`), validación de avatar (`src/app/api/profile/avatar/route.ts:18-30`), validación Zod en `src/app/api/lab-progress/route.ts:92-107` y `src/lib/validation/labProgress.ts`, sanitización de paths en `src/app/api/notebook/[module]/[lesson]/route.ts:22-37`. Pendiente documentar: política de retención, cifrado en tránsito/reposo (garantizado por Vercel/Supabase/Clerk vía TLS), gestión de secretos (`.env.local.example:1-15` — claves `CLERK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY` nunca en cliente). |

### 3.2. Ley 1266 de 2008 (Habeas Data financiero) — No aplica como régimen principal

No hay datos financieros, crediticios ni comerciales (`grep vacío: patrón stripe|paypal|checkout` + `supabase-migration.sql` sin tablas financieras). Si a futuro se incorpora monetización, deberá evaluarse conjuntamente con Ley 1581.

### 3.3. Ley 527 de 1999 (Mensajes de Datos y Firma Digital)

Aplica a la **validez de la autorización electrónica** (art. 9 — autorización puede obtenerse por medios electrónicos si es accesible y conservable) y a la **conservación de mensajes de datos** (art. 12). La autorización del art. 9 Ley 1581 puede recabarse vía checkbox electrónico en `/sign-up`, siempre que se genere prueba conservable (log con timestamp, IP, texto aceptado y versión de la Política). `src/app/api/webhooks/clerk/route.ts:36` ya conserva prueba de creación vía firma Svix (`CLERK_SIGNING_SECRET`), patrón extensible a la prueba de consentimiento.

### 3.4. Ley 1480 de 2011 (Estatuto del Consumidor)

**Aplica de forma atenuada.** Aunque el servicio es gratuito, el usuario es **consumidor** (destinatario final) y el Responsable es **proveedor** de un servicio digital. Obliga a:

- Información veraz y suficiente sobre el servicio (`README.md:3` y landing `src/app/page.tsx` deben ser coherentes con lo prestado).
- No incurrir en publicidad engañosa.
- Garantía de calidad/idoneidad del servicio (aunque gratuito, no puede inducir a error sobre certificaciones: `src/app/api/certify/route.ts:54-56` debe etiquetarse como "MVP no certificante" hasta integrar E2B real).
- Como **no hay venta, ni precio, ni transacción**, no aplican los capítulos de retracto, reversión de pagos ni garantía legal de producto, pero sí el deber general de información y el régimen de protección de datos del consumidor (art. 53 — datos personales del consumidor).

### 3.5. Síntesis de obligaciones inmediatas (Fase 1 → Fases siguientes)

1. **Aviso y autorización art. 9 + art. 6 (dato sensible `gender=x`)** con mención expresa de **transferencia internacional art. 26** a EE. UU. (Clerk, Supabase). Sin esto, el tratamiento actual (`src/app/api/webhooks/clerk/route.ts:49`) carece de base habilitante documentada.
2. **Política de Privacidad** que refleje exactamente el inventario de datos auditado (Fase 3) y la lista de Encargados (Fase 6), sin copiar plantillas.
3. **Evaluación RNBD** y, si corresponde, inscripción ante la SIC (Fase 2 — auditoría técnica debe aportar medidas de seguridad y encargados).
4. **Procedimiento de derechos art. 8** (canal invitro.code@gmail.com, términos, borrado en cascada en `profiles` + Clerk + Storage `avatars/`).
5. **Cookies/tracking:** al no haber analytics ni pixels, la `politica-cookies.md` solo documentará cookies técnicas/funcionales (sesión Clerk, preferencias `theme`/`notification_prefs`, `localStorage`/`sessionStorage` funcionales — ver Fase 4).
6. **LATAM:** al operar solo bajo ancla Colombia, los usuarios de otros países LATAM se tratan bajo el estándar colombiano + contrato de transferencia art. 26; si se abre establecimiento o se dirige oferta específica a un país con ley propia (ej. Brasil LGPD, México LFPDPPP), se evaluará adecuación local en iteración futura. Por ahora, la base Colombia + art. 26 cubre el alcance declarado.

---

## 4. Metodología y trazabilidad de la auditoría

- **Fecha de auditoría:** 2026-10-05.
- **Fuentes leídas:** `README.md`, `package.json`, `next.config.ts`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/api/webhooks/clerk/route.ts`, `supabase-migration.sql`, `public/pyodide-worker.js`, `src/app/api/lab-progress/route.ts`, `src/app/api/progress/route.ts`, `src/app/api/certify/route.ts`, `src/app/api/profile/avatar/route.ts`, `src/app/api/diagnose/route.ts`, `src/app/api/notebook/[module]/[lesson]/route.ts`, `src/app/api/rscript/[module]/[lesson]/route.ts`, `src/lib/supabase/admin.ts`, `openspec/config.yaml`, `.env.local.example`.
- **Búsquedas de negativos (grep) ejecutadas y con 0 hallazgos relevantes:**
  - `stripe|paypal|mercadopago|checkout|paddle|lemonsqueezy` → 0
  - `gtag|GTM|GA4|google.*analytics|clarity|hotjar|segment|mixpanel|amplitude` → 0 (falsos positivos `sloshAmplitude`/`Segment` en SVGs descartados)
  - `fbevents|fbq|meta.*pixel|facebook.*pixel|tiktok.*pixel|linkedin.*insight` → 0
  - `newsletter|mailchimp|resend|sendgrid|brevo|mailgun` → 0
  - `chatbot|intercom|crisp|tawk|zendesk` → 0
  - `openai|anthropic|langchain` (salvo comentario stub `E2B` en `src/app/api/certify/route.ts:39`) → 0
  - `B2B|enterprise` como modelo de negocio → 0
- **Búsquedas con hallazgos positivos:**
  - `upload|supabase.*storage|FormData` → `src/app/api/profile/avatar/route.ts:11,39` (avatar)
  - `gender` → `supabase-migration.sql:300`, `src/app/api/webhooks/clerk/route.ts:21`, `src/components/profile/ProfileForm.tsx:89`
  - `localStorage|sessionStorage` → `src/components/labs/LabTabs.tsx:46,59`, `src/components/labs/workspace/LabWorkspace.tsx:53,68`, `src/components/editor/ConsoleFrame.tsx:41,52`, `src/components/onboarding/OnboardingController.tsx:95,168` (uso funcional, no tracking)
- **Criterio de evidencia:** cada "Sí" cita el archivo y línea donde el comportamiento es observable; cada "No" cita el patrón grep ejecutado y su resultado vacío, más la ausencia del proveedor en `package.json:18-47`.

---

*Documento generado como Fase 1 de `legal/legal_requirement.md`. No contiene placeholders ni datos inventados. Cualquier cambio en el código (nuevo proveedor, nuevo formulario, nuevo pixel) invalida esta clasificación y obliga a re-auditar.*
