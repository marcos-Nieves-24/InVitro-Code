# Inventario de Tratamiento de Datos — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · Corregimiento Altavista, Medellín · `invitro.code@gmail.com`
> **Marco:** Ley 1581 de 2012 · Decreto 1377 de 2013 (compilado Decreto 1074 de 2015, Título 3) · Ley 527 de 1999 (mensajes de datos) · Ley 1480 de 2011 (consumidor, aplicable por gratuidad en lo pertinente)
> **Fuentes:** `supabase-migration.sql:1-550` · `src/domain/consent.ts:1-90` · `src/app/api/**` · `src/lib/profile/validateAvatar.ts` · `legal/data-inventory.md` (DEFINIDA v1) · `legal/retention-policy.md` · `legal/providers-audit.md`
> **Método:** Inspección directa del esquema, código y políticas. Sin datos inventados. Campos pendientes marcados `[POR CONFIRMAR]` solo donde no hay evidencia verificable.

---

## 1. Categorías y finalidades (F-01..F-08 + F-09 infra + consent)

| ID | Finalidad | Categoría de datos | Base Ley 1581 | Evidencia | Riesgo |
|---|---|---|---|---|---|
| **F-01** | **Registro y autenticación** — crear y verificar identidad | `email`, `password` (solo Clerk, hash, nunca a Supabase), `id` Clerk (`sub` TEXT), IP, User-Agent, `accepted_text_hash` (SHA-256) | **Art. 9** autorización previa + **art. 26** transferencia EE. UU. con mención expresa | `AuthForm.tsx:18` `getConsentText` + `domain/consent.ts:11` `F-01`/`TRANSFER_EEUU` obligatorios `completeConsent.ts:17` | Alto sin consent (resuelto) |
| **F-02** | **Perfil y personalización** — username, bio, género | `username` (derivado `first_name` o `email.split("@")[0]`), `bio`, `gender f/m/x`, `created_at`, `last_active_at` | **Art. 9** (autorización general) y **art. 6** reforzada para `gender=x` (sensible) | `webhooks/clerk/route.ts:22,60,76` `parseGender` + `domain/consent.ts:15` `GENDER_X` + gate `route.ts:60-67` | **Alto** si `x` sin explícito (resuelto con `acceptGenderX`) |
| **F-03** | **Avatar** — imagen de perfil | Binario `image/jpeg\|png\|webp ≤2 MB` + `avatar_url` TEXT (URL pública) | **Art. 9** | `profile/avatar/route.ts:18-47` + `validateAvatar.ts:1-60` (allowlist + magic bytes) | Medio (bucket hoy público) |
| **F-04** | **Preferencias y configuración** — tema, metas | `theme light\|dark\|system`, `daily_goal_xp 10..500`, `last_nudge_at`, `notification_prefs JSONB` | **Art. 9** | `profiles` `migration.sql:23-25,445` CHECK constraints + `configuracion/page.tsx:37` | Bajo |
| **F-05** | **Progreso pedagógico** — avance, XP, logros | `module_slug`, `lesson_slug`, `completed`, `xp_earned`, `completed_at`, `current_streak`, `longest_streak`, `last_active_date`, `freezes_available`, logros (`achievement_id`, `unlocked_at`) | **Art. 9** | `progress/route.ts:35` + `streaks` `migration.sql:94` + `user_achievements` `migration.sql:194` | Bajo |
| **F-06** | **Laboratorios** — persistencia de posición y código | `completion_status not_started\|in_progress\|completed`, `completion_date`, `last_position JSONB {activeTab,scrollY,codeSnapshot}` ≤8 KB | **Art. 9** | `lab-progress/route.ts:92` Zod + `capLastPosition` `route.ts:152` + `lab_progress` `migration.sql:309` | Medio (`codeSnapshot` minimización 60 d) |
| **F-07** | **Gamificación** — rachas, freezes, nudges | `freezes_available 0\|1`, `last_freeze_used`, `last_nudge_at` | **Art. 9** | `streaks` `migration.sql:430` + cron `recharge-freezes` `vercel.json:12` + `daily-nudge` | Bajo |
| **F-08** | **Almacenamiento local navegador** — tabs, workspace, onboarding | Claves `localStorage` (tabs/workspace/onboarding) + `sessionStorage` (consola maximizada) | **Art. 9** (técnico/funcional, necesario para funcionalidad) | `LabTabs.tsx:46`, `LabWorkspace.tsx:53`, `ConsoleFrame.tsx:41`, `OnboardingController.tsx:95` | Bajo (solo dispositivo, no se transmite) |
| **F-09** | **Infra / logs técnicos** — IP, UA, requestId, timestamp | IP, User-Agent, `requestId`, path, headers | **Art. 9** (legítimo interés técnico / ejecución contractual del servicio) | Vercel/Clerk/Supabase logs según plan | Medio (retención según Encargado) |
| **F-CONSENT** | **Evidencia de autorización conservable** | `policy_version`, `accepted_text_hash` SHA-256, `purposes[]`, `ip` INET, `user_agent`, `created_at` | **Art. 9 + Ley 527** (mensaje de datos conservable) | `consent_logs` `migration.sql:408-437` + `completeConsent.ts:17` + `consent/route.ts:18` | Alto si falta (resuelto) |

**No se tratan:** pagos (`grep vacío stripe|checkout`), newsletters, analítica (`grep vacío gtag|GA4`), boletines, datos biométricos, financieros, de salud, ni de menores (público +18 `aviso-legal.md`).

---

## 2. Inventario detallado por tabla / bucket

| Tabla / Bucket | Columna / Objeto | Tipo | Origen | Finalidad | Destinatarios | Retención | Evidencia |
|---|---|---|---|---|---|---|---|
| `profiles` | `id` TEXT PK | Identificador | Clerk `sub` webhook `route.ts:60` | F-01/F-02 ancla | Supabase (EE. UU./AWS) + Clerk (EE. UU.) | Vida cuenta + 6 m tras supresión + 24 m inactividad → anonimizar | `migration.sql:19` + `retention-policy.md §1` |
| `profiles` | `email` TEXT | Contacto | Clerk `email_addresses[0]` `route.ts:54` | F-01 autenticación, F-09 notificaciones | Clerk, Supabase, Vercel (tránsito) | Vida cuenta | `migration.sql:20` |
| `profiles` | `username` TEXT | Identificador derivado | Clerk `first_name` o `email.split("@")[0]` `route.ts:60` | F-02 personalización | Supabase | Vida cuenta | `migration.sql:21` |
| `profiles` | `gender` TEXT CHECK `f\|m\|x` | **Sensible art. 6** | `public_metadata.gender` `route.ts:22` | F-02 personalización | Supabase | Vida cuenta | `migration.sql:430` + `domain/consent.ts:15` |
| `profiles` | `avatar_url` TEXT | URL pública | `storage avatars` `getPublicUrl` `route.ts:47` | F-03 imagen perfil | Supabase Storage (público hoy) | Vida cuenta | `migration.sql:23` |
| `profiles` | `bio` TEXT | Perfil | Form `perfil/page.tsx` | F-02 | Supabase | Vida cuenta | `migration.sql:24` |
| `profiles` | `theme`, `notification_prefs`, `daily_goal_xp`, `last_nudge_at` | Preferencias | Forms + cron | F-04/F-07 | Supabase | Vida cuenta | `migration.sql:23-25,445` |
| `profiles` | `consent_status`, `consent_version`, `pending_since` | Trámite consent | `completeConsent` + webhook hybrid gate | F-CONSENT ciclo de vida | Supabase | `pending` 24 h → purga (`P-04` infra) | `migration.sql:420-435` |
| `profiles` | `is_banned`, `role`, `last_active_at`, `created_at` | Control | Sistema | Seguridad/operación | Supabase | `last_active_at` 24 m → aviso → anonimizar | `migration.sql:26-29` |
| `progress` | `user_id`, `module_slug`, `lesson_slug`, `completed`, `xp_earned`, `completed_at` | Progreso | `POST /api/progress` | F-05 | Supabase | Vida cuenta | `migration.sql:65-74` |
| `lab_progress` | `user_id`, `module_slug`, `lesson_slug`, `completion_status`, `completion_date`, `last_position JSONB`, `updated_at` | Laboratorio | `POST /api/lab-progress` | F-06 | Supabase | `codeSnapshot` 60 d o `completed` → `{}` | `migration.sql:309-318,337` |
| `streaks` | `user_id`, `current_streak`, `longest_streak`, `last_active_date`, `freezes_available`, `last_freeze_used` | Rachas | `progress` + cron `recharge-freezes` | F-05/F-07 | Supabase | Vida cuenta | `migration.sql:94-100,430` |
| `reflection_completions` | `user_id`, `block_id`, `xp_earned`, `completed_at` | Reflexiones | `POST /api/progress/reflection` | F-05 | Supabase | Vida cuenta | `migration.sql:120-127` |
| `user_achievements` | `user_id`, `achievement_id`, `unlocked_at` | Logros | `evaluateAchievements` | F-05 | Supabase | Vida cuenta | `migration.sql:194-199` |
| `achievements` | `slug`, `title`, `description`, `category`, `xp_reward`, `condition_*` | Catálogo (no personal) | Seed `migration.sql:214-232` | F-05 | Supabase (lectura `auth.jwt()->>sub IS NOT NULL`) | Permanente (catálogo) | `migration.sql:174-184` |
| `bookmarks` | `user_id`, `module_slug`, `lesson_slug`, `created_at` | Guardados | `POST /api/bookmarks` | F-05 | Supabase | Vida cuenta | `migration.sql:470` |
| `consent_logs` | `id UUID`, `user_id`, `policy_version`, `accepted_text_hash`, `purposes[]`, `ip INET`, `user_agent`, `created_at` | **Evidencia Ley 527** | `POST /api/consent` | F-CONSENT | Supabase | Vida cuenta + 6 m tras supresión | `migration.sql:408-437` |
| `avatars` (Storage) | `${userId}-${Date.now()}.${ext}` | Binario imagen | `validateAvatar` + `storage.upload` | F-03 | Supabase Storage | Vida cuenta; `remove(oldPath)` al reemplazar | `profile/avatar/route.ts:37-47` |
| `localStorage` | `activeTab`, `workspace`, `onboardingCompleted`, etc. | Estado UI | `LabTabs.tsx` etc. | F-08 | Solo navegador | Hasta limpieza manual | `LabTabs.tsx:46` etc. |

---

## 3. Bases de legitimación (por verificar con asesor jurídico)

| Finalidad | Base invocada | ¿Verificada en código? | Pendiente jurídico |
|---|---|---|---|
| F-01..F-08 | **Art. 9** autorización previa, expresa e informada + **art. 26** con mención EE. UU. | ✅ `AuthForm.tsx:18` texto incluye finalidades + EE. UU. + canal `invitro.code@gmail.com` + base "Ley 1581 arts. 9 y 26 y Ley 527" · `domain/consent.ts:11` exige `F-01` + `TRANSFER_EEUU` | Confirmar suficiencia del texto frente a SIC y si requiere doble aceptación separada |
| `gender=x` | **Art. 6** autorización explícita reforzada para dato sensible | ✅ `AuthForm.tsx:57` `acceptGenderX` separado + webhook gate `route.ts:60` | Confirmar si `gender` debe inscribirse como base separada en RNBD |
| `consent_logs` | **Ley 527** mensaje de datos conservable (timestamp + hash + ip/ua + versión) | ✅ `migration.sql:418` COMMENT + `consent_logs` con `ip`/`user_agent`/`accepted_text_hash` | Confirmar plazo de conservación probatoria (6 m es criterio operativo, no legal mínimo) |
| F-09 logs infra | Ejecución contractual + interés legítimo técnico | ⚠️ Implícita (no hay consent separado para logs; se informa en `privacidad §5`) | Validar si requiere mención específica en autorización o basta información |

---

## 4. Retención — DEFINIDA v1 (registrable en RNBD)

Fuente primaria: `legal/retention-policy.md §1` · `legal/data-inventory.md §4` · `supabase-migration.sql` COMMENTs.

| Tabla / Bucket | Retención normativa | Base | Estado |
|---|---|---|---|
| `profiles` | **Vida de la cuenta + 6 meses tras supresión** (art. 8: 15 d hábiles + bloqueo) **+ 24 meses de inactividad** (`last_active_at`) → anonimizar con aviso si `notification_prefs.email=true` | Temporalidad, necesidad (art. 4) | Norma documental v1 |
| `progress` / `streaks` / `reflection_completions` / `user_achievements` / `bookmarks` | **Vida de la cuenta** (coherente con `profiles`) | Finalidad | Norma v1 |
| `lab_progress` (`last_position.codeSnapshot`) | **60 días sin `updated_at` o al `completed` → `{}`** (minimización) | Minimización, temporalidad | Norma v1 · gap INV-05 |
| `avatars` | **Vida de la cuenta**; `remove(oldPath)` al reemplazar + purga huérfanos en supresión | Minimización | Implementado `02fb756` |
| `consent_logs` | **Vida de la cuenta + 6 meses tras supresión**; luego purga o anonimización | Ley 527 conservable | Norma v1 · `migration.sql:418` |
| `profiles` en `pending` | **24 h** (`pending_since < NOW()-24h` → purga) | Temporalidad (COMP-07) | **Implementado** `cron/purge-pending` + `vercel.json` |
| `localStorage`/`sessionStorage` | **Hasta limpieza manual del navegador** | — | Solo dispositivo |
| Logs infra (Vercel/Supabase/Clerk) | **Según Encargado** (Vercel 30 d–1 año; Supabase PITR 7/30 d; Clerk según DPA) | Temporalidad delegada | Según `providers-audit.md` |

**Bases a registrar en RNBD** (Decreto 1074 Título 3, `https://rnbd.sic.gov.co`): 7 bases (`profiles`, `progress`, `lab_progress`, `streaks`, `reflection_completions`, `user_achievements`, `avatars` + `consent_logs`) con Encargados Clerk/Supabase/Vercel + DPA + medidas (ver `retention-policy.md §2` checklist).

---

## 5. Ubicación y destinatarios

| Dato | Ubicación primaria | Destinatarios / Encargados | País | Transferencia |
|---|---|---|---|---|
| Todo dato persistido (`profiles`..`consent_logs`) | **Supabase Postgres (AWS)** | **Supabase Inc.** | EE. UU. | **Sí — art. 26** (mención + DPA) |
| Sesión, `email`, `password`, `gender` en tránsito inicial | **Clerk** | **Clerk Inc.** | EE. UU. | **Sí — art. 26** |
| Todo request en tránsito (TLS) + logs | **Vercel** | **Vercel Inc.** | EE. UU. | **Sí — infra** |
| Runtime Python (`pyodide.js`, wheels) | **jsDelivr / PyPI (Fastly)** | Prospect One / PSF | Anycast global | **No** (sin datos personales; tercero técnico a informar) |
| `localStorage`/`sessionStorage` | **Navegador del Titular** | Ninguno | Local | No hay transferencia |

RLS: Todo acceso a Supabase en cliente exige `auth.jwt()->>sub = id/user_id` (`migration.sql:52-460`). Escritura solo vía `createAdminClient()` en servidor (service-role, `admin.ts:10`).

---

## 6. Derechos del Titular (art. 8) — implementación técnica

| Derecho | Endpoint / Canal | Evidencia | Plazo |
|---|---|---|---|
| **Supresión** | `DELETE /api/account` (self-service) + `invitro.code@gmail.com` + `user.deleted` webhook | `account/route.ts:11` cascade 8 tablas + storage + Clerk · `webhooks/clerk/route.ts:105` · `legal/data-inventory.md F-CONSENT` | ≤15 días hábiles (art. 8) |
| **Consulta / reclamo** | `invitro.code@gmail.com` | `AuthForm.tsx:18` canal citado en texto de consent | 10/15 días hábiles (Decreto 1377) |
| **Revocatoria** | `invitro.code@gmail.com` (sin `DELETE` no hay revocatoria parcial automatizada) | `politica-privacidad.md §4` | Según solicitud |
| **Actualización / rectificación** | `PATCH` perfil (`perfil/page.tsx`, `configuracion/page.tsx`) | RLS `USING (auth.jwt()->>sub = id)` | Inmediato |

RLS `FOR DELETE` idempotente habilitada en 7 tablas (`migration.sql:430-460` `USING (auth.jwt()->>sub = id/user_id)`).

---

## 7. Medidas de protección

| Medida | Estado | Evidencia |
|---|---|---|
| RLS `auth.jwt()->>sub` en 8 tablas + `achievements` lectura autenticada | ✅ | `migration.sql:52-460` |
| Service-role solo servidor + guard `typeof window` | ✅ | `admin.ts:11-12` `throw if window` + `requireEnv` |
| `validateAvatar` (allowlist MIME + ext + magic bytes + coherencia MIME/ext + 2 MB) | ✅ | `validateAvatar.ts:1-60` |
| Zod + allowlist `getLessonSlugs` + XP authoritative server | ✅ | `progress/route.ts:62,77` · `lab-progress/route.ts:92,112` |
| Rate limiting 100/15 min in-memory | ✅ Mitigado | `rate-limit.ts:1-35` + `progress`/`lab-progress`/`bookmarks`/`reflection` |
| `pending` 24 h + cron `purge-pending` daily `0 3 * * *` | ✅ | `domain/consent.ts:21` + `cron/purge-pending/route.ts:60` + `vercel.json:4` |
| Storage `remove(oldPath)` al reemplazar avatar | ✅ | `validateAvatar` fix `02fb756` |
| CSP/HSTS headers | ⚠️ Pendiente | `grep vacío headers|CSP en next.config.ts` |
| Vault / rotación semestral | ⚠️ `.env.local` sin vault | `.env.local.example` + `.gitignore` (observación) |

---

## 8. Riesgos por tratamiento

| Tratamiento | Riesgo principal | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| `gender=x` sensible | Discriminación / infracción art. 6 sin explícito | Media → **Baja** (resuelto) | Alto | `acceptGenderX` separado + gate webhook `route.ts:60` + RNBD base separada |
| `codeSnapshot` en `last_position` | Sobre-recolección (código arbitrario del usuario persistido) | Media | Medio | Minimización 60 d + 8 KB cap + `completed` → `{}` (norma) |
| `avatars` público | Enumeración / reemplazo no autorizado (aunque RLS protege) | Baja | Medio | `validateAvatar` + `remove(oldPath)`; migrar a `createSignedUrl` |
| `pending` indefinido | Retención más allá de finalidad si cron falla | Baja | Medio | Cron `vercel.json` + `PENDING_TTL_HOURS=24` + monitoreo logs |
| `DELETE /api/account` best-effort | Supresión incompleta si Clerk no disponible | Baja | Alto | Reintento logueado; canal alterno `invitro.code@gmail.com` |

---

*Inventario 2026-10-16-v1 — cada fila cita `archivo:línea`. Un nuevo campo en `profiles`, nuevo `purpose` en `domain/consent.ts` o nuevo bucket obliga a versionar este inventario y `retention-policy.md`.*
