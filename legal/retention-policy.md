# Política de Retención v1 — 2026-10-06

> Norma de retención versionada para RNBD (Decreto 1074 de 2015, Título 3) y `politica-privacidad.md`. Principio de temporalidad y minimización — art. 4 Ley 1581 de 2012. Sin SQL TTL físico en esta versión.

## Alcance y vigencia

Esta política define la retención aplicable a todas las bases y buckets listados en `legal/data-inventory.md` §4. Vigente desde 2026-10-06, revisable al implementar cron o modificar `supabase-migration.sql`. Registrable en RNBD ante la SIC.

## 1. Tabla resumida — retención por base

| Tabla / Bucket | Retención | Base art. 4 Ley 1581 | Evidencia |
|---|---|---|---|
| `profiles` | Vida cuenta + 6 meses tras supresión art. 8 (15 días hábiles + bloqueo) + 24 meses inactividad (`last_active_at` `migration.sql:28` / `created_at` `migration.sql:29`) → anonimizar con aviso si `notification_prefs.email=true` | Necesidad, temporalidad, finalidad | `migration.sql:28-29`, `52-62` |
| `progress` | Vida cuenta (coherente con `profiles`); `completed_at` `migration.sql:72` | Finalidad, temporalidad | `migration.sql:72` |
| `lab_progress` | `completion_status/date` vida cuenta; `last_position.codeSnapshot` `migration.sql:315` 60 días sin `updated_at` `migration.sql:337` o al `completed` → `{}` | Minimización, temporalidad | `migration.sql:315`, `337` |
| `streaks` | Vida cuenta | Finalidad | `migration.sql:99` |
| `reflection_completions` | Vida cuenta | Finalidad | `migration.sql:129` |
| `user_achievements` | Vida cuenta | Finalidad | `migration.sql:197` |
| `avatars` (Storage) | Vida cuenta; `remove(oldPath)` al reemplazar (C-G04 `validateAvatar` 02fb756) + purga huérfanos en supresión | Minimización | `storage.remove()` C-G04 |
| `localStorage`/`sessionStorage` | Navegador hasta limpieza | — | F-08 |
| `logs infra` (Vercel/Supabase/Clerk) | Según Encargado: Vercel 30d-1año, Supabase PITR 7d free/30d Pro, Clerk según DPA | Temporalidad delegada | `providers-audit.md` |

La retención de cada base respeta el principio de temporalidad: conservar solo mientras dure la finalidad y hasta 6 meses tras supresión para atender reclamaciones (art. 8).

## 2. RNBD — Bases a registrar

Registrar ante la SIC cada base con finalidad, Encargados y medidas (Decreto 1074, Título 3):

- [ ] **Base `profiles`** — Finalidad: autenticación, perfil, preferencias y control de cuenta. Encargados: Clerk Inc. (EE. UU., IdP), Supabase/AWS (EE. UU., BD). Medidas: RLS `auth.jwt()->>sub`, TLS, `service_role` solo server. Retención: §1. Canal derechos: `invitro.code@gmail.com` (10/15 días hábiles).
- [ ] **Base `progress`** — Finalidad: avance pedagógico y gamificación. Encargado: Supabase. Retención: vida cuenta.
- [ ] **Base `lab_progress`** — Finalidad: persistencia de laboratorios y posición del editor. Encargado: Supabase. Retención: §1 con purga `codeSnapshot` 60d.
- [ ] **Base `streaks`** — Finalidad: rachas de estudio. Encargado: Supabase. Retención: vida cuenta.
- [ ] **Base `reflection_completions`** — Finalidad: registro de reflexiones. Encargado: Supabase. Retención: vida cuenta.
- [ ] **Base `user_achievements`** — Finalidad: logros y XP. Encargado: Supabase. Retención: vida cuenta.
- [ ] **Bucket `avatars` (Storage)** — Finalidad: imagen de perfil. Encargado: Supabase Storage. Medida: `validateAvatar` + `remove(oldPath)`. Retención: vida cuenta.

Encargados transversales: Clerk (auth), Supabase (BD/Storage), Vercel (hosting/logs). DPA vigentes a referenciar en `providers-audit.md`. Titular del registro: persona natural Colombia — contacto `invitro.code@gmail.com`.

## 3. Purgas programadas

- **P1 — `codeSnapshot` 60 días:** cron diario que ejecuta `UPDATE lab_progress SET last_position = '{}' WHERE updated_at < NOW() - INTERVAL '60 days' OR completion_status='completed'`. Minimiza sobre-recolección (INV-05).
- **P2 — Inactividad 24 meses:** job mensual que detecta `profiles.last_active_at < NOW() - INTERVAL '24 months'`; envía aviso si `notification_prefs.email=true` y, sin reactivación en 15 días, anonimiza `profiles` (mantiene `id` para integridad referencial, borra PII).
- **P3 — Supresión art. 8:** a solicitud del titular vía `invitro.code@gmail.com` o `DELETE /api/account` (otra sesión), borrado en cascada en ≤15 días hábiles con bloqueo intermedio.
- **P4 — Avatares huérfanos:** en `user.deleted` y reemplazo de avatar, `storage.remove()` best-effort (ya en C-G04).

Las purgas P1/P2 se documentan en `data-inventory.md` §4 y se ejecutarán sin afectar `consent_logs` ni el flujo de consentimiento.

## 4. Nota de implementación

> **SQL TTL no implementado en v1 — norma documental.** La implementación de purgas (P1/P2) se hará en sesión futura con `pg_cron` o Vercel Cron (`/api/cron/purge-*`), sin tocar el consentimiento (`webhooks/clerk` y `consent_logs`). Esta política es suficiente para RNBD y `politica-privacidad.md`.

## 5. Referencias normativas y trazabilidad

- Ley 1581 de 2012, art. 4 (principios) y art. 8 (supresión), Decreto 1074 Título 3 (RNBD).
- `supabase-migration.sql:28-29` (`last_active_at`/`created_at`), `:72` (`completed_at`), `:315` (`last_position`), `:337` (`updated_at`).
- `legal/data-inventory.md` §4 — fuente normativa primaria; `providers-audit.md` y `security-audit.md` §backups para logs infra.
- `legal/dpa-register.md` — DPA de Encargados a referenciar en RNBD.

## 6. Control de cambios

| Versión | Fecha | Descripción |
|---|---|---|
| v1 | 2026-10-06 | Norma inicial — cierra GAP INV-03 (ALTA), habilita RNBD sin SQL TTL |

---

*Retención v1 — 2026-10-06 — Registrable en RNBD. Citas: `migration.sql:28-29,72,315,337`. Revisar al implementar cron o cambiar `supabase-migration.sql`. Verificación: `grep -n "DEFINIDA v1" legal/data-inventory.md`.*
