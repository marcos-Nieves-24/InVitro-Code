# Política de Privacidad — InVitro-Code

> **Versión:** 2026-10-06-v1 — Generada como F11 de `legal/legal_requirement.md` desde `legal/data-inventory.md` (F3, 307 lí DEFINIDA v1) + `legal/providers-audit.md` (F6, 391 lí) + `legal/retention-policy.md` (67 lí) + `legal/dpa-register.md` (43 lí) + `legal/project-classification.md` (F1) + `legal/technical-audit.md` (F2). Sin plantillas genéricas, 100% evidencia `archivo:línea`. Jurisdicción Colombia (Ley 1581 de 2012, Decreto 1377/Decreto 1074, Ley 527 de 1999).

## 1. Responsable y contacto

| Campo | Valor |
|-------|-------|
| **Responsable del Tratamiento** | Persona natural — Colombia — **NIT 700329113-7** — Corregimiento Altavista, Medellín, Colombia |
| **Contacto y canal de derechos (art. 8/14-15 Ley 1581)** | **invitro.code@gmail.com** — consultas (10 días hábiles), reclamos (15 días hábiles), supresión/revocatoria art. 8 (15 días hábiles, `DELETE /api/account` + `user.deleted`), revocatoria de autorización |
| **Delegado / Encargado de interacción** | El Responsable atiende directamente (sin DPO tercerizado) |

Evidencia: `legal/project-classification.md:9-11` + `legal/aviso-legal.md:1` + `supabase-migration.sql:4-7` (Clerk único IdP, RLS `auth.jwt() ->> 'sub'`).

## 2. Qué datos tratamos y para qué (finalidades F-01..F-08)

| # | Punto | Datos | Finalidad | Base legal (Ley 1581) | Destino | Retención |
|---|-------|-------|-----------|----------------------|---------|-----------|
| **F-01** | **Registro/Login** | `email`, `password` (solo Clerk, hash), `id` Clerk (`sub`), `first_name`→`username`, `public_metadata.gender` opcional `f/m/x` | Crear/autenticar cuenta, sincronizar `profiles` | **Art. 9** previa/expresa/informada conservable (Ley 527 art. 5-12) + **Art. 26** transferencia EE. UU. (mención expresa) + `consent_logs(policy_version, hash, purposes, ip, user_agent, created_at)` (`supabase-migration.sql:408-437`) | **Clerk Inc. (EE. UU.)** IdP + espejo mínimo **Supabase `profiles`** (`migration.sql:18-30`) + tránsito **Vercel** | **DEFINIDA v1** — vida cuenta +6m tras supresión + `pending_since` purga 24h (`src/domain/consent.ts:33`, `vercel.json` cron `0 3 * * *`, `legal/retention-policy.md:12`) |
| **F-02** | **Perfil** | `username`, `bio` libre, `gender` `f/m/x/null` (`x` = sensible) | Personalizar identidad y gamificación | **Art. 9** + **Art. 6** reforzada para `gender=x` (facultativa, explícita, no condicionada) + **Art. 26** | **Supabase `profiles`** (`migration.sql:20-23,300-301`) vía `createAdminClient()` (`src/lib/supabase/admin.ts:4`) | **DEFINIDA v1** — vida cuenta |
| **F-03** | **Avatar** | Archivo imagen `image/jpeg|png|webp` ≤2 MB, `avatar_url` | Identificación visual | **Art. 9** + **Art. 26** | **Supabase Storage `avatars`** (`src/app/api/profile/avatar/route.ts:39-41` + `src/lib/profile/validateAvatar.ts` `jpg|jpeg|png|webp` + magic bytes + `remove(oldPath)` best-effort) | **DEFINIDA v1** — vida cuenta + purga huérfanos en supresión |
| **F-04** | **Configuración** | `theme` (`migration.sql:25`), `notification_prefs` (`migration.sql:26`) | Preferencias funcionales | **Art. 9** funcional | **Supabase `profiles`** (`src/app/(dashboard)/configuracion/page.tsx:36-48` + `src/components/settings/SettingsForm.tsx`) | **DEFINIDA v1** |
| **F-05** | **Progreso lecciones** | `module_slug`, `lesson_slug`, `completed`, `xp_earned`, `completed_at` (`migration.sql:65-74`) | Medir avance, XP server-authoritative (`src/app/api/progress/route.ts:75-77` `Math.min`), `advanceStreak` + `evaluateAchievements` | **Art. 9** | **Supabase `progress`** (+ dual-write desde `lab_progress`) | **DEFINIDA v1** |
| **F-06** | **Progreso labs** | `completion_status` (`migration.sql:313`), `completion_date`, `last_position` (`activeTab`, `scrollY`, `codeSnapshot` ≤8192 `migration.sql:315` + `src/lib/validation/labProgress.ts:7` + `capLastPosition` `route.ts:152-159`) | Persistir estado Pyodide entre sesiones | **Art. 9** (advertencia: `codeSnapshot` puede contener secretos si pegás API keys — no lo hagas) | **Supabase `lab_progress`** (`migration.sql:309-318`) | **DEFINIDA v1** — `completion_status/date` vida cuenta; `codeSnapshot` 60d sin `updated_at` (`migration.sql:337`) o al `completed`→`{}` |
| **F-07** | **Gamificación derivada** | `streaks` (`migration.sql:94-100`), `reflection_completions` (`migration.sql:120-127`), `user_achievements` (`migration.sql:194-199`) | Rachas, reflexiones, logros | **Art. 9** | **Supabase** derivadas | **DEFINIDA v1** |
| **F-08** | **Local funcional** | `localStorage` `lab-active-tab-*`, `lab-workspace-*`, `onboardingSeen` (`src/components/labs/LabTabs.tsx:46,59` etc.) + `sessionStorage` `console-maximized-*` (`src/components/editor/ConsoleFrame.tsx:41,52`) | Estado UI sin servidor | **Art. 9** funcional (no requiere consentimiento separado) | **Navegador del titular** (no se transmite) — ver `legal/politica-cookies.md: §2` | Navegador |

**No tratamos:** checkout/pagos (`grep vacío stripe/paypal/checkout` en `legal/project-classification.md:31`), newsletter (`grep vacío mailchimp/resend` `legal/project-classification.md:32`), analytics/pixels (`legal/analytics-audit.md:268` `grep` vacío `gtag/GA4/fbq`), chatbot/LLM runtime (`legal/ai-audit.md:268` 0 SDK, Pyodide es CPython WASM local `public/pyodide-worker.js:4-5` + `src/lib/pyodide-worker.ts:65`).

## 3. Bases legales

- **Art. 9 — Autorización previa, expresa, informada y conservable** para F-01..F-07. Se recaba vía checkbox **no pre-marcado** en `/sign-up` (`src/components/auth/AuthForm.tsx:220-280` con texto art.9/26 + art.6 + links a esta política y `aviso-legal.md`) y se conserva en `consent_logs(policy_version, accepted_text_hash, purposes, ip, user_agent, created_at)` (`supabase-migration.sql:408-437` `COMMENT` Ley 527) + `Clerk publicMetadata.consent_version` como espejo.
- **Art. 6 — Dato sensible `gender=x`** (`supabase-migration.sql:300` `CHECK ('f','m','x')` + `src/components/profile/ProfileForm.tsx:89-104`): tratamiento solo con **autorización explícita separada** (`acceptGenderX` checkbox `ProfileForm.tsx:114-130` + gate `src/app/(dashboard)/perfil/page.tsx:81` `hasGenderConsent`), facultativo ("Prefiero no decirlo" `null`) y no condicionado.
- **Art. 26 — Transferencia internacional a EE. UU.:** Responsable en Colombia → Encargados en **EE. UU.** (Clerk, Supabase/AWS, Vercel) — requiere mención expresa del país destino en la autorización + contrato con garantías (DPA + SCC). Ver §5.
- **Art. 10** no aplica como excepción (ningún flujo encaja, ver `legal/data-inventory.md:184-197`).

## 4. Derechos del titular (art. 8) y ejercicio

Podés ejercer **consulta, actualización, rectificación, supresión, revocatoria y reclamo** vía **invitro.code@gmail.com** (10/15 días hábiles, Dec. 1377 art. 14-15) o `DELETE /api/account` (revocatoria directa) + `user.deleted` (`src/app/api/webhooks/clerk/route.ts:105-126`) + cron `POST /api/cron/purge-pending` 24h (`vercel.json` + `src/domain/consent.ts:33` `PENDING_TTL_HOURS=24`). La supresión borra en cascada `lab_progress→progress→reflection_completions→streaks→user_achievements→consent_logs→storage avatars→profiles` + Clerk best-effort (`legal/data-inventory.md:236` DEFINIDA v1 + `legal/retention-policy.md:12`). Podés reclamar ante la **SIC**.

## 5. Encargados, transferencias y DPAs (art. 26)

| Encargado | País | Datos que recibe | DPA / Subencargados | Evidencia |
|-----------|------|------------------|---------------------|-----------|
| **Clerk Inc.** — IdP único | **EE. UU.** | `email`, `first_name`→`username`, `gender` opcional, `id` `sub`, IP, `svix-*` headers | DPA `https://clerk.com/legal/dpa` + `https://clerk.com/legal/subprocessors` | `src/middleware.ts:1,18` `clerkMiddleware` + `src/app/api/webhooks/clerk/route.ts:36` `CLERK_SIGNING_SECRET` + `legal/providers-audit.md: P-01` + `legal/dpa-register.md: §1` |
| **Supabase Inc. (AWS)** — Postgres + Storage `avatars` + Realtime | **EE. UU. (AWS)** | `profiles/progress/lab_progress/streaks/achievements` + binario avatar + `consent_logs` + IP | DPA `https://supabase.com/legal/dpa` + `https://supabase.com/legal/subprocessors` | `src/lib/supabase/admin.ts:4` `createAdminClient()` + `supabase-migration.sql:4-7` RLS `auth.jwt()->>sub` + `legal/providers-audit.md: P-02` |
| **Vercel Inc.** — Hosting/Edge/cron | **EE. UU.** | Tránsito TLS de todos los requests + logs + cron purga | DPA `https://vercel.com/legal/dpa` + `https://vercel.com/legal/sub-processors` | `next.config.ts:4` `standalone` + `vercel.json` cron + `legal/providers-audit.md: P-03` |

**Terceros técnicos sin datos personales** (no activan art. 26, solo transparencia): **jsDelivr** `cdn.jsdelivr.net` Pyodide 0.25.0 + **PyPI** `files.pythonhosted.org` vía Fastly (`public/pyodide-worker.js:4-5,30-33,56-82` solo `GET` runtime, no `email`/`id` — `legal/providers-audit.md: P-04/P-05`). Tipografías `next/font/google` self-hosted (`src/app/layout.tsx:6-22`, no `fetch` a `googleapis`), Rive/Plotly/Monaco locales (`legal/providers-audit.md: P-06..P-10`).

**Nivel adecuado:** EE. UU. **no declarado adecuado por SIC** — la transferencia se basa en **autorización con mención expresa + DPA/SCC** (ver `legal/dpa-register.md` 2026-10-06-v1 con receipts `legal/receipts/*.pdf` + hashes).

## 6. Seguridad (art. 19 Ley 1581)

Medidas técnicas: RLS `auth.jwt()->>sub` (`migration.sql:52-335`), `createAdminClient()` solo server con guard `window` throw (`src/lib/supabase/admin.ts:11`) + cache `publicMetadata.role` en `middleware.ts:67` (evita roundtrip), avatar `validateAvatar.ts` (magic bytes + `jpg|jpeg|png|webp` + `remove(oldPath)`), rate-limit `src/lib/rate-limit.ts:12` 100/15min + `429 Retry-After` (`progress:43` + `lab-progress:60`), `GF_SECURITY_ADMIN_PASSWORD` env (`docker-compose.monitoring.yml:75` `${GF_SECURITY_ADMIN_PASSWORD:?}`) — ver `legal/security-audit.md` + `legal/technical-audit.md`. Medidas humanas/administrativas: canal único `invitro.code@gmail.com`, versionado de política, `consent_logs` conservable (Ley 527).

## 7. Retención

**Norma DEFINIDA v1 2026-10-06** (`legal/retention-policy.md:12` + `legal/data-inventory.md:236`): vida cuenta +6m tras supresión + 24m inactividad `last_active_at` → anonimizar + `codeSnapshot` 60d o al `completed`→`{}`. Logs infra según Encargado (Vercel 30d/1año, Supabase PITR 7d/30d, Clerk DPA). `pending` purga automática 24-48h (`vercel.json` cron + `src/domain/consent.ts:33`). Ver `legal/retention-policy.md` y `legal/data-inventory.md:236` tabla DEFINIDA.

## 8. Cookies

Ver `legal/politica-cookies.md: §1-2` — solo `__session`/`__clerk_*` técnicas + `localStorage` funcionales, 0 analíticas/publicitarias (`legal/cookies-audit.md:36-37`).

## 9. Cambios y contacto

Cambios versionados (`2026-10-06-v2`) notificados vía `notification_prefs.email` si está en `true`. Contacto: **invitro.code@gmail.com**. Podés ejercer derechos art. 8 y reclamar ante SIC.

---

*Generada como F11 `politica-privacidad.md` desde `legal/data-inventory.md` DEFINIDA v1 + `legal/providers-audit.md` + `legal/retention-policy.md` + `legal/dpa-register.md` + `supabase-migration.sql:408` sin proveedores inventados. Coherente con `legal/aviso-legal.md` y `legal/politica-cookies.md`.*
