# Legal Retención E — INV-03 + RNBD + Backups

## Objetivo
Formalizar retención/TTL y respaldos para cerrar GAP INV-03 (ALTA) y habilitar RNBD, sin tocar consent (otra sesión).

## Alcance autorizado
- Rama base: `feat/legal-seguridad-c-clean` @c9aa426 (C+D hechos). Continuar en misma rama.
- Foco: definir tabla retención normativa (no SQL TTL aún, solo norma versionada), documentar PITR/backups Vercel/Supabase, añadir job doc para purga `codeSnapshot` y avatars huérfanos.
- No tocar: `webhooks/clerk` consent, `user.deleted` (otra sesión).
- Verificación: `grep retencion|retención` en legal docs con hits, `type-check` OK.

## Tareas

- [ ] **E-INV03 — Tabla retención normativa** — Actualizar `legal/data-inventory.md` §4 para pasar de GAP a NORMA: reemplazar filas `GAP` por retenciones definidas:
  - `profiles` → vida cuenta + 6 meses tras supresión (art.8 15 días hábiles + bloqueo), `last_active_at` 24 meses inactividad → anonimizar con aviso.
  - `progress/streaks/reflection_completions/user_achievements` → vida cuenta (coherente con `profiles`).
  - `lab_progress` `completion_status/date` → vida cuenta, `last_position.codeSnapshot` → 60 días sin `updated_at` o al `completed` → `{}` (minimización).
  - `avatars` → vida cuenta, `remove(oldPath)` al reemplazar (ya en C-G04) + purga huérfanos en supresión.
  - `localStorage` → navegador.
  - Logs infra → según Encargado (Clerk/Supabase/Vercel) + enlace a `providers-audit.md`.
  - Marcar `Estado: DEFINIDA (norma v1 2026-10-06)` y añadir `Norma de Retención v1` en §4.

- [ ] **E-Backups — Documentar PITR** — Añadir en `legal/technical-audit.md` §2.3 o `legal/security-audit.md` §backups tabla RPO/RTO con Supabase PITR (7 días free, 30 Pro) + Vercel logs 30d-1año + recomendación `pg_cron` o cron Vercel para purga `codeSnapshot` (no implementar, solo doc).

- [ ] **E-RNBD — Checklist** — Añadir en `legal/data-inventory.md` o nuevo `legal/retention-policy.md` corto (max 80 líneas) con checklist RNBD: bases a registrar, finalidades, Encargados, medidas, retención, canal derechos.

## Entregables
- `legal/data-inventory.md` §4 actualizado (GAP→DEFINIDA)
- `legal/retention-policy.md` (opcional, 60-80 lí) o sección en `technical-audit.md`
- Branch con commits `docs(legal): E-retencion norma y backups`

## Progreso
- 2026-10-06 — Feature creado.
- 2026-10-06 — E-INV03+RNBD done c325b44: `data-inventory.md` §4 GAP→DEFINIDA v1 (8 filas, `profiles` vida cuenta+6m+24m anonimizar, `codeSnapshot` 60d, `avatars` remove best-effort), `retention-policy.md` 67 lí (tabla compacta + checklist RNBD 7 bases + purgas P1/P2, norma doc sin SQL TTL).
- 2026-10-06 — E-Backups done 994ff02: `security-audit.md` tabla PITR (Supabase 7d/30d, Vercel 30d/1año, Clerk DPA, Storage avatars) + `technical-audit.md` §2.3 filas Backups PITR + Logs infra.
- Verificación: `grep DEFINIDA v1` 8 hits, `retention-policy.md` 5.7KB, `grep PITR` hits, `type-check` OK. Branch `feat/legal-seguridad-c-clean`.
