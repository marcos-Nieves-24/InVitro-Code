# Política de Cookies — InVitro-Code

> **Versión:** 2026-10-06-v1 — Generada como F11 de `legal/legal_requirement.md` desde `legal/cookies-audit.md` (F4, 222 lí) + `legal/analytics-audit.md` (F5, 268 lí) + `legal/data-inventory.md` F-08 + `legal/technical-audit.md` §4.3. Sin tracking inventado, solo cookies/Storage detectados con evidencia `archivo:línea`. Jurisdicción Colombia (Ley 1581 art. 9/26, Ley 527).

## Resumen

InVitro-Code **no usa cookies analíticas ni publicitarias ni píxeles** (`legal/cookies-audit.md:36-37` + `legal/analytics-audit.md:54` `grep` vacío para `gtag/GTM/GA4/fbq/clarity/hotjar` en `src/`/`public/`/`package.json`/`next.config.ts` + `src/app/layout.tsx:1-55` sin `<Script>` tracking + `next.config.ts:1-13` sin dominios de tracking). Solo emplea **cookies técnicas estrictamente necesarias** (sesión Clerk) y **almacenamiento local funcional** (no tracking). Por tanto, **no requiere banner de consentimiento previo con rechazar/granular** bajo Ley 1581 art. 9 (técnicas exentas), pero **sí requiere esta política informativa** y transparencia sobre almacenamiento local.

## 1. Cookies técnicas — estrictamente necesarias (sin consentimiento previo, con información)

| Cookie | Tipo | Finalidad | Titular | Duración | Base legal | Evidencia |
|--------|------|-----------|---------|----------|------------|-----------|
| `__session` | Técnica — sesión | Mantener sesión autenticada y CSRF | **Clerk Inc. (EE. UU.)** vía `ClerkProvider` | Sesión / 1 año según sesión Clerk (renovable) | Art. 9 exenta (estrictamente necesaria para autenticación solicitada) + Art. 26 informada (transferencia EE. UU. con DPA) | `src/app/layout.tsx:37` `<ClerkProvider>` + `src/middleware.ts:1` `clerkMiddleware` + `legal/cookies-audit.md: C-01` + `legal/providers-audit.md: P-01` |
| `__clerk_*`, `__client_uat` | Técnica — sesión/estado | Id. de cliente y última actividad para `auth()` | **Clerk Inc.** | Sesión / persistente corta | Art. 9 exenta | `legal/cookies-audit.md: C-02` + `grep vacío` `document.cookie`/`Set-Cookie` manual en `src/app/api/**` (0 resultados, auditable `grep -R "cookie" src/`) |
| `sb-*` (si aplica) | Técnica — Supabase | Mantener JWT `sub` para RLS `auth.jwt() ->> 'sub'` | **Supabase (AWS EE. UU.)** | Sesión | Art. 9 exenta + Art. 26 | `src/lib/supabase/admin.ts:1` + `supabase-migration.sql:4-7` RLS. En este build, Supabase se usa solo server-side vía `createAdminClient()` (`src/lib/supabase/admin.ts:4`) y no setea `sb-*` en cliente — fila informativa si aparece en navegador por anon key |

**Atributos de seguridad:** Clerk gestiona `HttpOnly`/`Secure`/`SameSite` (server-side, no `document.cookie` en `src/`). Verificado `legal/technical-audit.md:240-242` y `legal/cookies-audit.md: §1`.

## 2. Almacenamiento local funcional — no tracking (sin consentimiento previo, con información)

| Key | Storage | Finalidad | Titular | Evidencia |
|-----|---------|-----------|---------|-----------|
| `lab-active-tab-{module}-{lesson}` | `localStorage` | Recordar pestaña activa (lab/quiz) por lección | Navegador del titular (no se transmite) | `src/components/labs/LabTabs.tsx:46,59` + `src/components/labs/workspace/LabWorkspace.tsx:53,68` + `legal/cookies-audit.md: S-01` + `legal/data-inventory.md: F-08` |
| `lab-workspace-{module}-{lesson}` | `localStorage` | Estado del workspace | Navegador | `src/components/labs/workspace/LabWorkspace.tsx:53,68` |
| `lab-onboarding-completed` | `localStorage` | Si el onboarding fue visto | Navegador | `src/components/onboarding/OnboardingController.tsx:95,168` + `legal/cookies-audit.md: S-02` |
| `console-maximized-{id}` | `sessionStorage` | Estado maximizado de consola | Navegador (por pestaña) | `src/components/editor/ConsoleFrame.tsx:41,52` + `legal/cookies-audit.md: S-03` |
| `theme`, `notification_prefs` | **No son cookies** — columnas `profiles.theme` (`migration.sql:25`) y `notification_prefs` (`migration.sql:26`) | Preferencias funcionales | Supabase (Encargado) | `legal/cookies-audit.md: C-03` (aclaración no-cookie) |

Limpieza: `localStorage` hasta limpieza manual del sitio; `sessionStorage` al cerrar pestaña. No hay `fingerprint`, `session replay` ni `localStorage` de tracking (`grep vacío` `fingerprint|session.*replay` en `legal/cookies-audit.md: T-09/T-10`).

## 3. Cookies analíticas y publicitarias — no existen (evidencia negativa)

| Categoría | Estado | Evidencia negativa (auditable) |
|-----------|--------|--------------------------------|
| **Analíticas (GA4, GTM, Clarity, Hotjar, PostHog, Mixpanel, Amplitude)** | **No detectadas** | `grep -RIn "gtag|GTM|ga4|google.*analytics|googletagmanager|clarity|hotjar|mixpanel|amplitude|posthog|segment.*analytics" src/ public/ package.json next.config.ts` → **vacío** (`legal/cookies-audit.md:73/T-01`, `legal/analytics-audit.md:268`); `src/app/layout.tsx:1-55` sin `next/script`; `package.json:18-47` sin `@vercel/analytics` |
| **Publicitarias (Meta Pixel, TikTok, LinkedIn Insight, DoubleClick)** | **No detectadas** | `grep -RIn "fbevents|fbq|facebook.*pixel|meta.*pixel|tiktok.*pixel|ttq|linkedin.*insight|doubleclick" src/ public/` → **vacío** (`legal/cookies-audit.md:75/T-03`, `legal/analytics-audit.md:268`); `package.json` sin `facebook-pixel` |
| **Server-side tracking (Measurement Protocol, Conversions API, sGTM)** | **No detectado** | `grep -RIn "measurement.*protocol|conversions.*api|sGTM|ss.tracking" src/ public/` → vacío; `src/app/api/**` (6 handlers) sin `fetch` a `google-analytics.com`/`facebook.com/tr` (`legal/cookies-audit.md:82/T-10`) |

Si a futuro se activa analítica, esta política debe actualizarse a `2026-10-06-v2` y se activará banner con **aceptar/rechazar/granular/revocación + bloqueo previo de scripts** (hoy no requerido).

## 4. Consentimiento, rechazo y revocación

Dado que solo hay técnicas estrictamente necesarias y funcionales locales, **no hay consentimiento previo que recabar ni bloqueo de scripts** (V-01..V-05 en `legal/cookies-audit.md: §4` — V-01/V-02/V-03/V-05 N/A-Cumple). La revocación de almacenamiento local es limpieza manual del navegador (datos de sitio). Los derechos art. 8 (revocatoria/supresión) sobre datos server-side se ejercen vía **invitro.code@gmail.com** (10/15 días hábiles) o `DELETE /api/account` + `user.deleted` (`src/app/api/webhooks/clerk/route.ts:105-126` + `legal/retention-policy.md`).

## 5. Terceros técnicos sin cookies (información)

- **jsDelivr** `cdn.jsdelivr.net` Pyodide 0.25.0 + **PyPI** `files.pythonhosted.org` vía Fastly (`public/pyodide-worker.js:4-5,30-33,56-82`) solo hacen `GET` de runtime/wheels, no setean cookies ni reciben datos personales — terceros técnicos informados por transparencia (`legal/providers-audit.md: P-04/P-05`), no requieren consentimiento art. 26 (sin datos personales).
- **Vercel, Clerk, Supabase** como Encargados de tránsito/persistencia se informan en `legal/politica-privacidad.md` y `legal/providers-audit.md` con DPA; sus cookies son solo las técnicas listadas en §1.

## 6. Actualizaciones

Cualquier nueva cookie, `localStorage`/`sessionStorage` o activación de analítica/pixel invalida `2026-10-06-v1` y obliga a publicar `2026-10-06-v2` y, si son analíticas/publicitarias, a activar CMP con bloqueo previo. Ver `legal/cookies-audit.md` y `legal/analytics-audit.md` como auditoría previa.

---

*Generada como F11 `politica-cookies.md` desde `legal/cookies-audit.md` + `legal/analytics-audit.md` + `legal/data-inventory.md` F-08, sin analíticas inventadas. Coherente con `legal/retention-policy.md` (logs infra según Encargado).*
