# Feature: compliance-hibrido-consent-supresion — ODD

## Objetivo
Cerrar deuda crítica Ley 1581 art.9/art.6/art.26 + Ley 527 con modelo híbrido (estricto para `gender=x`, pending 24h para base), implementar supresión `user.deleted` + `DELETE /api/account`, y versionar DPAs/subencargados. Base habilitante conservable + transferencia EE.UU. explícita.

## Problema
Tratamiento actual `webhooks/clerk:49` + `progress:79` sin autorización conservable, sin checkbox en `/sign-up`, sin tabla `consent_logs`, sin mención art.26 EEUU (PROV-01). `user.deleted` huérfano viola art.8 (G-03/INV-02). DPAs no firmados/versionados (PROV-02).

## Por qué
Auditorías F1-F3 + F6 (2026-10-06) bloquean Fase 11 `politica-privacidad.md`. Riesgo SIC sancionable. Híbrido equilibra pureza legal en sensible vs conversión en base.

## Scope autorizado
`supabase-migration.sql` (consent_logs + columnas profiles + RLS DELETE + índices), `src/domain/consent.ts`, `src/application/ports/ConsentRepository.ts`, `src/lib/supabase/consent.ts`, `src/app/api/consent/route.ts`, `src/app/api/webhooks/clerk/route.ts`, `src/components/auth/AuthForm.tsx`, `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`, `src/components/profile/ProfileForm.tsx`, `src/app/(dashboard)/perfil/page.tsx`, `src/app/api/account/route.ts`, `src/app/(dashboard)/layout.tsx` (banner pending), cron `src/app/api/cron/purge-pending/route.ts` o `vercel.json`, `legal/dpa-register.md`, `legal/data-inventory.md` §3, `supabase-migration.sql` retention notes, `.env.local.example` (policy version).

## Constraints
- Clerk único IdP, RLS `auth.jwt()->>'sub'` TEXT, `createAdminClient()` solo server.
- `gender=x` nunca persiste sin consent explícito separado art.6, facultativo no condicionado.
- Ley 527: consent conservable (timestamp, ip, ua, hash, version).
- Vercel Cron o pg_cron para purga pending 24h; 4xx no reintenta Svix, 5xx sí.
- `npm run type-check` + `npm run build` gates; `npm run lint` roto por diseño (no usar).
- ~400 líneas heuristic por task, no cap estricto.

## TDD
`strict_tdd: false` (vitest node-only). Verificación por `type-check` + `build` + manual webhook Svix mock.

## Tasks
- [x] **COMP-01 Migración consent + retention base** — `supabase-migration.sql` §14: `consent_logs` (id, user_id FK CASCADE, policy_version, accepted_text_hash, purposes TEXT[], ip, user_agent, created_at), `profiles.consent_status/consent_version/pending_since`, índices, RLS (users read own, admin insert), comentarios retención (6 meses post-supresión, codeSnapshot 30-90d). Verificar `grep consent_logs` ya no vacío. ✅ 2026-10-06 — type-check PASS, 83 líneas §14, commit pendiente.
- [ ] **COMP-02 Dominio + puerto consent** — `src/domain/consent.ts` (enum Purpose, type ConsentRecord), `src/application/ports/ConsentRepository.ts` (save/hasValid/hasGenderConsent), `src/lib/supabase/consent.ts` adapter admin. Unit test vitest opcional.
- [ ] **COMP-03 UI sign-up híbrida** — Restaurar `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` (no redirect), `src/components/auth/AuthForm.tsx` checkbox A obligatorio no pre-marcado (texto F-01..F-07 + EE.UU. + link politica-privacidad versionada), bloqueo `signUp.create()` si !checked, `POST /api/consent` con hash/ip/ua, manejo race con `public_metadata.consent_version`.
- [ ] **COMP-04 API consent + webhook híbrido** — `src/app/api/consent/route.ts` POST (auth or clerkId, Zod, hash verify), modificar `src/app/api/webhooks/clerk/route.ts:49-77` lógica híbrida: if gender=x && !hasGenderConsent → 403 (no guardar gender); else if !hasBaseConsent → upsert pending + 200; else verified. Preservar `route.ts:77` no-overwrite. Test Svix mock.
- [ ] **COMP-05 Gate gender en perfil** — `src/components/profile/ProfileForm.tsx` + `src/app/(dashboard)/perfil/page.tsx:73-94` validar `gender=x` requiere `hasGenderConsent`, modal art.6 facultativo, error si falta. `src/app/(dashboard)/layout.tsx` banner pending bloqueante + guard en `progress/route.ts:79` y `lab-progress/route.ts:185` 403 si pending.
- [ ] **COMP-06 Supresión user.deleted + DELETE /account** — `src/app/api/webhooks/clerk/route.ts` rama `user.deleted` cascada (lab_progress→progress→reflection_completions→streaks→user_achievements→profiles→storage.remove avatars/* → consent_logs), `src/app/api/account/route.ts` DELETE (auth, cascada + clerk delete + 204), `supabase-migration.sql` RLS DELETE para titular, ON DELETE CASCADE donde falte. Log auditable.
- [ ] **COMP-07 Cron purga pending 24h** — `src/app/api/cron/purge-pending/route.ts` (verify CRON_SECRET) + `vercel.json` cron hourly o `pg_cron`, borra `consent_status=pending AND pending_since < NOW()-24h` + Clerk + Storage, documentar en `legal/data-inventory.md` §4.
- [ ] **COMP-08 DPAs versionados** — `legal/dpa-register.md` (Clerk/Supabase/Vercel DPA URL, versión, fecha, subencargados, receipt hash), actualizar `legal/providers-audit.md` §3.3 y `politica-privacidad.md` § Encargados (EE.UU. explícito). `legal/data-inventory.md` §3 bases legales con consent_logs ref.
- [ ] **COMP-09 Verificación + docs** — `npm run type-check`, `npm run build`, pruebas manuales trazas feliz/race/bloqueada, actualizar `legal/technical-audit.md` gaps G-01/G-03, evidenciar en feature doc.

## Progreso
- 2026-10-06: feature doc creado, scope autorizado híbrido, branch `feat/legal-f1-f3-f6` existente.

## Evidencia
- (pendiente) commits por task con hash

## Siguiente paso
- Ejecutar COMP-01 tras verificar out-of-date file.

## Riesgos
- Race webhook vs consent (mitigado con pending + public_metadata).
- Svix 4xx no reintenta (necesita retry manual en /api/consent).
- Cron sin pg_cron en Free tier (fallback Vercel Cron).
