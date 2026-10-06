# Términos y Condiciones — InVitro-Code

> **Versión:** 2026-10-06-v1 — Generado como F11 de `legal/legal_requirement.md` desde `legal/project-classification.md` (F1) + `legal/technical-audit.md` (F2) + `legal/data-inventory.md` (F3). Jurisdicción Colombia (Ley 1480 de 2011, Ley 1581, Ley 527). Sin venta/suscripción, 100% gratuito +18.

## 1. Objeto y aceptación

InVitro-Code es una plataforma educativa gratuita para estudiantes de biotecnología que aprenden IA/ML con Python (`README.md:3`, `package.json:2` `invitro-code`). Al registrarte y usar el sitio aceptás estos Términos y la `legal/politica-privacidad.md` + `legal/politica-cookies.md` + `legal/aviso-legal.md`. Si no aceptás, no uses el servicio (`src/middleware.ts:38-51` redirige a `/sign-in` si no hay `session.userId`).

## 2. Titular

Persona natural Colombia **NIT 700329113-7**, domicilio Corregimiento Altavista, Medellín, Colombia, contacto **invitro.code@gmail.com** (`legal/aviso-legal.md:1` + `legal/project-classification.md:9-11`).

## 3. Acceso, registro y cuentas

- **Registro/Login:** vía **Clerk Inc. (EE. UU.)** IdP único (`src/middleware.ts:18` `clerkMiddleware` + `src/app/layout.tsx:37` `ClerkProvider` + `src/app/api/webhooks/clerk/route.ts:36` firma Svix). Creás cuenta con `email` + `password` (solo Clerk, hash) y verificación por código (`src/components/auth/AuthForm.tsx:47-98`). Al registrarte aceptás expresamente la Política de Privacidad con mención de finalidades F-01..F-07 y transferencia internacional art. 26 a EE. UU. (Clerk/Supabase/Vercel) + dato sensible `gender=x` facultativo art. 6, conservable en `consent_logs` (`supabase-migration.sql:408`, `legal/dpa-register.md`).
- **Requisitos:** mayor de 18 años (`legal/project-classification.md:15,42`), información veraz, una cuenta por persona.
- **Seguridad:** sos responsable de tu `password` y sesión (`__session`/`__clerk_*` técnicas en `legal/politica-cookies.md: §1`). Notificá a **invitro.code@gmail.com** ante uso no autorizado.

## 4. Contenido y uso permitido

- **Contenido educativo:** módulos `python`, `ia`, `estadistica`, `machine-learning` con `lesson.md`/`quiz.md`/`lab.md`/`assignment.md` en `src/content/modules/{module}/lessons/{lesson}/` (`README.md:59`, `legal/ip-audit.md:28`). Bibliografía en `references.bib` (cita académica, contenido de terceros con fines educativos).
- **Laboratorios:** ejecutás Python 100% local en tu navegador vía Pyodide 0.25.0 (`public/pyodide-worker.js:4-5` + `src/lib/pyodide-worker.ts:65` Web Worker) con `numpy`/`scikit-learn`/`scipy`/`seaborn`/`plotly` bajo demanda (`public/pyodide-worker.js:56-82`). El código se ejecuta en memoria del Worker (`legal/data-inventory.md: F-09`) y solo persiste si guardás `last_position.codeSnapshot` ≤8192 (`src/lib/validation/labProgress.ts:7`) en `lab_progress` (`supabase-migration.sql:309-318`). No pegues secretos/API keys/emails en el editor (`legal/data-inventory.md: INV-05`).
- **Gamificación:** `progress` (`migration.sql:65-74`), `lab_progress` (`migration.sql:309-318`), `streaks` (`migration.sql:94-100`), `reflection_completions` (`migration.sql:120-127`), `user_achievements` (`migration.sql:194-199`) + `rate-limit` 100/15min por `userId` (`src/lib/rate-limit.ts:12` + `src/app/api/progress/route.ts:43` 429 `Retry-After`).
- **Uso prohibido:** vulnerar `middleware.ts`/`supabase` RLS (`migration.sql:52-335` `auth.jwt()->>sub`), subir `avatar` con `file.type` no permitido o `ext` no allowlist (`src/lib/profile/validateAvatar.ts` `jpg|jpeg|png|webp` ≤2MB + magic bytes + `remove(oldPath)` best-effort), spamear `POST /api/progress`/`lab-progress` (rate limit), o compartir credenciales.

## 5. Propiedad intelectual

Código y UI **MIT** (`LICENSE:1` `Copyright (c) 2026 marcos-Nieves-24`) con excepción **gsap@3.15.0 Standard Free** (`LICENSE:25` + https://gsap.com/standard-license/ + `legal/ip-audit.md:51`) — uso comercial gratuito sin reventa de fuente ni editor. Tipografías OFL self-hosted `next/font/google` (`src/app/layout.tsx:6-22`). Favicons Recraft AI 8 C2PA + Anymotion 12 + Spritecook ~40 sprites son assets offline con disclosure en `README.md:99` y `legal/politica-ia.md`. Contenido de lecciones es del titular salvo citas `references.bib`. No se concede licencia sobre marcas de terceros.

## 6. Gratuidad, sin venta

Servicio **100% gratuito, sin venta online, sin suscripciones, sin ecommerce** (`legal/project-classification.md:14,31-32` `grep vacío stripe/paypal/checkout/paddle` 0 resultados, `package.json:18-47` sin SDK de pago, `supabase-migration.sql` sin `subscriptions`/`orders`). Por ello **no aplican** retracto, reversión de pagos ni garantía legal de producto con precio (Ley 1480 Cap. V), pero **sí aplica** deber de información veraz y protección de datos del consumidor (Ley 1480 art. 53).

## 7. Disponibilidad y limitación

Servicio "as is" (MIT `LICENSE:15`), dependiente de Vercel/Supabase/Clerk/jsDelivr; labs requieren red (`README.md:80`). Sin SLA de uptime. Certificación `POST /api/certify` es stub MVP (`src/app/api/certify/route.ts:22` `FEATURE_FLAG_CERTIFY=false` → 503, con `true` responde `certified: true` sin sandbox E2B real `src/app/api/certify/route.ts:39-43`) — no es certificación oficial ni título académico; etiquetado honesto exigido por `legal/project-classification.md:82`.

## 8. Terminación y supresión

Podés eliminar tu cuenta vía `DELETE /api/account` o solicitando supresión a **invitro.code@gmail.com** (art. 8 Ley 1581, 15 días hábiles). La supresión borra en cascada `lab_progress→progress→reflection_completions→streaks→user_achievements→consent_logs→storage avatars→profiles` + Clerk best-effort + cron `POST /api/cron/purge-pending` 24h (`src/domain/consent.ts:33` `PENDING_TTL_HOURS=24`, Vercel Cron `0 3 * * *` en `vercel.json`, `legal/retention-policy.md:12` + `legal/data-inventory.md:236` DEFINIDA v1). Logs infra según Encargado (`legal/retention-policy.md:12`). Podemos suspender cuentas que violen estos Términos o la ley.

## 9. Responsabilidad

No respondemos por daños derivados de uso indebido, pérdida de `codeSnapshot` si pegaste secretos, o indisponibilidad de jsDelivr/PyPI (`P-04/P-05` solo `GET` runtime). Límite máximo: al ser gratuito, la responsabilidad se limita a la re-prestación del servicio o supresión. Medidas de seguridad art. 19 Ley 1581 documentadas en `legal/security-audit.md` (service-role guard `admin.ts:11`, avatar `validateAvatar`, rate-limit, `GF_SECURITY_ADMIN_PASSWORD` env).

## 10. Modificaciones y ley aplicable

Podemos modificar estos Términos versionando (`2026-10-06-v2`) y notificando vía `notification_prefs.email` si está en `true` (`profiles.notification_prefs` `migration.sql:26`). Ley aplicable: **Colombia** (Ley 1480 + Ley 1581 + Ley 527); competencia SIC/juzgados de Medellín para usuarios en Colombia; para LATAM, ley colombiana como ancla sin perjuicio de norma local imperativa. Contacto: **invitro.code@gmail.com**.

---

*Generado como F11 `terminos-condiciones.md` desde `legal/project-classification.md` + `legal/technical-audit.md` + `legal/data-inventory.md` + `legal/security-audit.md` sin venta inventada.*
