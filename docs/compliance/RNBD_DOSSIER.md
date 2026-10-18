# Dossier RNBD — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16
> **Portal:** `https://rnbd.sic.gov.co/sisi/login` · **Norma:** Decreto 1074 de 2015, Título 3, Capítulo 26 (RNBD) · Ley 1581 de 2012
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · Corregimiento Altavista, Medellín · `invitro.code@gmail.com`
> **Estado:** ⏳ Pendiente de inscripción — este dossier es el **borrador listo para copiar al portal SIC**. Cada campo mapea 1:1 a los formularios del RNBD.
> **Fuentes:** `legal/data-inventory.md` DEFINIDA v1 · `legal/retention-policy.md §1-§2` · `legal/providers-audit.md` P-01..P-11 · `legal/dpa-register.md` · `supabase-migration.sql:1-550`

---

## Cómo usar este dossier

1. Entrá a `https://rnbd.sic.gov.co/sisi/login` con tu usuario (si no tenés, registrate como Persona Natural).
2. Creá el Responsable con los datos de §1.
3. Por cada base (§2.1..§2.8), creá una entrada en el RNBD copiando los campos tal cual (Finalidad, Datos, Medidas, Encargados, Transferencia, Retención).
4. Al terminar, descargá la constancia PDF y guardala en `legal/receipts/rnbd-radicado-YYYY-MM-DD.pdf`.
5. Corré `node scripts/verify-receipts.mjs` y `sha256sum legal/receipts/rnbd-radicado-*.pdf` — el hash va a `legal/dpa-register.md` y a este dossier §4.

> **Regla:** Si agregás una columna a `supabase-migration.sql` o un nuevo `ConsentPurpose` en `src/domain/consent.ts`, versioná este dossier a `v2` y actualizá el RNBD.

---

## 1. Responsable

| Campo RNBD | Valor |
|---|---|
| **Tipo de persona** | Persona natural |
| **NIT** | 700329113-7 |
| **Nombre / Razón social** | [Titular — persona natural, ver `legal/aviso-legal.md §1`] |
| **Domicilio** | Corregimiento Altavista, Medellín, Colombia |
| **Correo de contacto (canal art. 14-15)** | `invitro.code@gmail.com` |
| **Teléfono** | 3122555086 |
| **Actividad económica** | Plataforma educativa gratuita — enseñanza de ciencia de datos aplicada a biotecnología (sin venta, sin suscripción) |
| **Público** | Mayores de 18 años, LATAM, idioma español (`src/app/layout.tsx:39` `lang="es"`) |

---

## 2. Bases de datos a inscribir (8 entradas)

> **Criterio:** 7 bases operativas + 1 base de evidencia — 5 titulares a 2026-10-16 (tel. 3122555086) de consentimiento. Cada base es una tabla/bucket con finalidad distinta (art. 4). `logs infra` (Vercel/Clerk/Supabase) son infra del Encargado, no base del Responsable — se informan como Encargado, no como base separada (ver §2.8).

### 2.1 Base `profiles` — Perfil y cuenta

| Campo RNBD | Valor |
|---|---|
| **Nombre de la base** | `profiles` |
| **Finalidad** | F-01 Registro y autenticación + F-02 Perfil y personalización + F-04 Preferencias y control de cuenta |
| **Categorías de datos** | `id` (TEXT, `sub` Clerk), `email`, `username` (derivado `first_name`), `gender` (`f`/`m`/`x` — **dato sensible art. 6** cuando `x`), `avatar_url`, `bio`, `theme`, `notification_prefs` (JSONB), `daily_goal_xp`, `last_nudge_at`, `is_banned`, `role`, `consent_status`/`consent_version`/`pending_since`, `last_active_at`, `created_at` |
| **Dato sensible** | **Sí** — `gender=x` (art. 6). Requiere autorización explícita reforzada (`AuthForm.tsx:57` `acceptGenderX` + gate `webhooks/clerk/route.ts:60`). |
| **Cantidad de titulares** | 5 (a 2026-10-16 — actualizar anualmente ene-mar) |
| **Forma de recolección** | Formulario `AuthForm.tsx:48` + Clerk `signUp` + webhook `user.created/updated` (`src/app/api/webhooks/clerk/route.ts:27`) |
| **Medidas de seguridad** | RLS `USING (auth.jwt()->>sub = id)` (`supabase-migration.sql:52-62`) + `service_role` solo servidor (`src/lib/supabase/admin.ts:11` guard `typeof window`) + TLS Vercel + `validateAvatar` para `avatar_url` |
| **Encargados** | Clerk Inc. (EE. UU., IdP) + Supabase Inc./AWS (EE. UU., BD) + Vercel Inc. (EE. UU., tránsito) |
| **Transferencia internacional** | **Sí — art. 26** a EE. UU. (Clerk/Supabase/Vercel) con autorización expresa + DPA (ver §3) |
| **Retención** | Vida de la cuenta + 6 meses tras supresión art. 8 (15 d hábiles + bloqueo) + 24 meses inactividad (`last_active_at`) → aviso si `notification_prefs.email=true` y 15 d después anonimización (preserva `id`, borra PII). Ver `retention-policy.md §1`. |
| **Evidencia** | `supabase-migration.sql:19-30,420-435` · `legal/data-inventory.md F-01/F-02` · `retention-policy.md §1` |

### 2.2 Base `progress` — Avance pedagógico

| Campo | Valor |
|---|---|
| **Nombre** | `progress` |
| **Finalidad** | F-05 Progreso pedagógico, XP y gamificación |
| **Datos** | `user_id` (TEXT `sub`), `module_slug`, `lesson_slug`, `completed`, `xp_earned`, `completed_at` |
| **Medidas** | RLS `auth.jwt()->>sub = user_id` (`migration.sql:76-91`) + XP authoritative server `Math.min(requestedXp, serverXp)` (`progress/route.ts:77`) |
| **Encargados** | Supabase (EE. UU.) + Vercel (tránsito) |
| **Transferencia** | Sí — EE. UU. (vía Supabase/Vercel, cubierto por DPA) |
| **Retención** | Vida de la cuenta |
| **Evidencia** | `supabase-migration.sql:65-74` · `src/app/api/progress/route.ts:35` |

### 2.3 Base `lab_progress` — Laboratorios

| Campo | Valor |
|---|---|
| **Nombre** | `lab_progress` |
| **Finalidad** | F-06 Persistencia de laboratorios y posición del editor |
| **Datos** | `user_id`, `module_slug`, `lesson_slug`, `completion_status` (`not_started`/`in_progress`/`completed`), `completion_date`, `last_position` (JSONB `{activeTab, scrollY, codeSnapshot≤8KB}`), `updated_at` |
| **Medidas** | RLS `auth.jwt()->>sub` (`migration.sql:320-335`) + Zod `labProgressPostSchema` + `capLastPosition 8KB` + anti-downgrade `completed` terminal (`lab-progress/route.ts:92,140-159`) |
| **Encargados** | Supabase (EE. UU.) + Vercel |
| **Transferencia** | Sí — EE. UU. |
| **Retención** | `completion_status/date` vida cuenta; `codeSnapshot` 60 d sin `updated_at` o al `completed` → `{}` (minimización, `retention-policy.md §3 P1`) |
| **Evidencia** | `supabase-migration.sql:309-318,337` · `lab-progress/route.ts:92` |

### 2.4 Base `streaks` — Rachas

| Campo | Valor |
|---|---|
| **Nombre** | `streaks` |
| **Finalidad** | F-05/F-07 Rachas de estudio y freezes |
| **Datos** | `user_id`, `current_streak`, `longest_streak`, `last_active_date`, `freezes_available` (`0`/`1`), `last_freeze_used` |
| **Medidas** | RLS `auth.jwt()->>sub` (`migration.sql:102-118`) |
| **Encargados** | Supabase + Vercel |
| **Transferencia** | Sí — EE. UU. |
| **Retención** | Vida de la cuenta |
| **Evidencia** | `supabase-migration.sql:94-100,430` |

### 2.5 Base `reflection_completions` — Reflexiones

| Campo | Valor |
|---|---|
| **Nombre** | `reflection_completions` |
| **Finalidad** | F-05 Registro de reflexiones completadas |
| **Datos** | `user_id`, `block_id`, `xp_earned`, `completed_at` |
| **Medidas** | RLS `auth.jwt()->>sub` (`migration.sql:129-139`) |
| **Encargados** | Supabase + Vercel |
| **Transferencia** | Sí — EE. UU. |
| **Retención** | Vida de la cuenta |
| **Evidencia** | `supabase-migration.sql:120-127` |

### 2.6 Base `user_achievements` — Logros

| Campo | Valor |
|---|---|
| **Nombre** | `user_achievements` |
| **Finalidad** | F-05 Logros y XP desbloqueados |
| **Datos** | `user_id`, `achievement_id` (FK `achievements.id`), `unlocked_at` |
| **Medidas** | RLS `auth.jwt()->>sub` (`migration.sql:204-212`) + catálogo `achievements` lectura autenticada |
| **Encargados** | Supabase + Vercel |
| **Transferencia** | Sí — EE. UU. |
| **Retención** | Vida de la cuenta |
| **Evidencia** | `supabase-migration.sql:194-199` |

### 2.7 Bucket `avatars` — Imágenes de perfil (Storage)

| Campo | Valor |
|---|---|
| **Nombre** | `avatars` (Supabase Storage bucket) |
| **Finalidad** | F-03 Imagen de perfil |
| **Datos** | Binario `image/jpeg`/`image/png`/`image/webp` ≤2 MB, path `${userId}-${Date.now()}.${ext}` (futura migración a `crypto.randomUUID()`) |
| **Medidas** | `validateAvatar` (allowlist MIME + ext + magic bytes JPEG `FF D8 FF`/PNG `89 50 4E 47`/WebP `RIFF..WEBP` + coherencia MIME/ext + 2 MB) (`src/lib/profile/validateAvatar.ts`) + `remove(oldPath)` al reemplazar + RLS Storage (pendiente migrar a privado con `createSignedUrl`) |
| **Encargados** | Supabase Storage (EE. UU./AWS) + Vercel (tránsito) |
| **Transferencia** | Sí — EE. UU. |
| **Retención** | Vida de la cuenta; purga huérfanos en `user.deleted` y reemplazo |
| **Evidencia** | `src/app/api/profile/avatar/route.ts:18-47` · `validateAvatar.ts:1-60` |

### 2.8 Base `consent_logs` — Evidencia de autorización (Ley 527)

| Campo | Valor |
|---|---|
| **Nombre** | `consent_logs` |
| **Finalidad** | F-CONSENT Evidencia conservable de autorización (Ley 527 art. 12) + trazabilidad de transferencias art. 26 |
| **Datos** | `id` (UUID), `user_id` (TEXT `sub`), `policy_version` (ej. `2026-10-06-v1`), `accepted_text_hash` (SHA-256 del texto), `purposes[]` (ej. `{F-01,F-02,transfer:EEUU,gender:x}`), `ip` (INET), `user_agent`, `created_at` |
| **Medidas** | RLS `auth.jwt()->>sub = user_id` (`migration.sql:430`) + COMMENT Ley 527 (`migration.sql:418`) + `completeConsent.ts:17` exige `F-01 + TRANSFER_EEUU` |
| **Encargados** | Supabase (EE. UU.) + Vercel |
| **Transferencia** | Sí — EE. UU. |
| **Retención** | Vida de la cuenta + 6 meses tras supresión (Ley 527 conservable); luego purga o anonimización (`migration.sql:418` COMMENT + `retention-policy.md §1`) |
| **Evidencia** | `supabase-migration.sql:408-437` · `src/domain/consent.ts:11` · `src/application/use-cases/completeConsent.ts:17` |

---

## 3. Encargados y transferencias (art. 26)

| Encargado | País | Servicio | DPA URL | Subencargados vigentes | Estado DPA |
|---|---|---|---|---|---|
| **Clerk Inc.** | EE. UU. | IdP único (registro, login, sesión, SSO, webhooks) | `https://clerk.com/legal/dpa` | `https://clerk.com/legal/subprocessors` | ⏳ Pendiente firma — guardar en `legal/receipts/clerk-dpa-*.pdf` |
| **Supabase Inc. (AWS)** | EE. UU. | Postgres + Storage `avatars` + Realtime | `https://supabase.com/legal/dpa` | `https://supabase.com/legal/subprocessors` | ⏳ Pendiente firma — `legal/receipts/supabase-dpa-*.pdf` |
| **Vercel Inc.** | EE. UU. | Hosting + Edge + Build + Logs + Crons + DNS | `https://vercel.com/legal/dpa` | `https://vercel.com/legal/sub-processors` | ⏳ Pendiente firma — `legal/receipts/vercel-dpa-*.pdf` |

> Terceros técnicos sin DPA (solo transparencia): jsDelivr `cdn.jsdelivr.net` + PyPI `files.pythonhosted.org` (Fastly) — solo `GET` de runtime/wheels sin datos personales (`public/pyodide-worker.js:5,67-82`). Ver `legal/providers-audit.md` P-04/P-05.

---

## 4. Checklist de inscripción

- [ ] **Paso 1 — DPAs:** Aceptar los 3 DPAs en sus URLs, descargar PDFs a `legal/receipts/` con nombre `*-dpa-YYYY-MM-DD-vN.pdf`.
- [ ] **Paso 2 — Hashes:** Correr `node scripts/verify-receipts.mjs` y `sha256sum legal/receipts/*.pdf` → copiar a `legal/dpa-register.md §1` columna `Receipt hash`.
- [ ] **Paso 3 — RNBD:** Inscribir las 8 bases (§2.1..§2.8) en `https://rnbd.sic.gov.co/sisi/login` copiando cada tabla.
- [ ] **Paso 4 — Constancia:** Descargar constancia RNBD PDF → `legal/receipts/rnbd-radicado-YYYY-MM-DD.pdf` + `sha256sum` → registrar en este dossier.
- [ ] **Paso 5 — Actualizar docs:** Anotar N° de radicado RNBD en `retention-policy.md §2` y en `docs/compliance/INVENTARIO_TRATAMIENTO_DATOS.md §4`.

| Fecha | Acción | Hash / Radicado | Responsable |
|---|---|---|---|
| 2026-10-16 | Dossier v1 creado (plantilla) | — | Auditoría |
| [POR CONFIRMAR] | Clerk DPA aceptado | `[hash]` | Titular |
| [POR CONFIRMAR] | Supabase DPA aceptado | `[hash]` | Titular |
| [POR CONFIRMAR] | Vercel DPA aceptado | `[hash]` | Titular |
| [POR CONFIRMAR] | RNBD 8 bases inscritas | N° radicado `[POR CONFIRMAR]` | Titular |

---

## 5. Referencias

- Decreto 1074 de 2015, Título 3, Capítulo 26: `https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=76838`
- Ley 1581 de 2012: `https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981`
- Ley 527 de 1999: `https://www.secretariasenado.gov.co/senado/basedoc/ley_0527_1999.html`
- RNBD portal: `https://rnbd.sic.gov.co/sisi/login`
- SIC Guía RNBD: `https://www.sic.gov.co/manejo-de-datos-personales`
- Este dossier complementa `legal/retention-policy.md`, `legal/data-inventory.md` y `legal/dpa-register.md`.

---

*Dossier 2026-10-16-v1 — listo para copiar al portal SIC. Un nuevo campo en `profiles`, nuevo bucket o nuevo Encargado obliga a versionar a v2 y actualizar el RNBD.*
