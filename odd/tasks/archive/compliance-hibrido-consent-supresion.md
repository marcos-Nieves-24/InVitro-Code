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
- [x] **COMP-02 Dominio + puerto consent** — `src/domain/consent.ts` (enum Purpose, type ConsentRecord), `src/application/ports/ConsentRepository.ts` (save/hasValid/hasGenderConsent), `src/lib/supabase/consent.ts` adapter admin. Unit test vitest opcional. ✅ 2026-10-06 — 891481f, 200 líneas, type-check+build PASS.
- [x] **COMP-03 UI sign-up híbrida** — Restaurar `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` (no redirect), `src/components/auth/AuthForm.tsx` checkbox A obligatorio no pre-marcado (texto F-01..F-07 + EE.UU. + link politica-privacidad versionada), bloqueo `signUp.create()` si !checked, `POST /api/consent` con hash/ip/ua, manejo race con `public_metadata.consent_version`. ✅ 2026-10-06 — type-check+build PASS, 138 líneas.
- [x] **COMP-04 API consent + webhook híbrido** — `src/app/api/consent/route.ts` POST (auth or clerkId, Zod, hash verify), modificar `src/app/api/webhooks/clerk/route.ts:49-77` lógica híbrida: if gender=x && !hasGenderConsent → 403 (no guardar gender); else if !hasBaseConsent → upsert pending + 200; else verified. Preservar `route.ts:77` no-overwrite. Test Svix mock. ✅ 2026-10-06 — 07f315e, type-check+build PASS, 2 archivos 124 ins.
- [x] **COMP-05 Gate gender en perfil** — `src/components/profile/ProfileForm.tsx` + `src/app/(dashboard)/perfil/page.tsx:73-94` validar `gender=x` requiere `hasGenderConsent`, modal art.6 facultativo, error si falta. `src/app/(dashboard)/layout.tsx` banner pending bloqueante + guard en `progress/route.ts:79` y `lab-progress/route.ts:185` 403 si pending. ✅ 2026-10-06 — type-check+build PASS, 4 grupos 85 ins + banner.
- [x] **COMP-06 Supresión user.deleted + DELETE /account** — `src/app/api/webhooks/clerk/route.ts` rama `user.deleted` cascada (lab_progress→progress→reflection_completions→streaks→user_achievements→profiles→storage.remove avatars/* → consent_logs), `src/app/api/account/route.ts` DELETE (auth, cascada + clerk delete + 204), `supabase-migration.sql` RLS DELETE para titular, ON DELETE CASCADE donde falte. Log auditable. ✅ 2026-10-06 — type-check+build PASS, 2 archivos + migration 65 ins.
- [x] **COMP-07 Cron purga pending 24h** — `src/app/api/cron/purge-pending/route.ts` (verify CRON_SECRET) + `vercel.json` cron diario `0 3 * * *` (Hobby: 1/día ±59min, no hourly) o `pg_cron`, borra `consent_status=pending AND pending_since < NOW()-24h` + Clerk + Storage, documentar en `legal/data-inventory.md` §4. ✅ 2026-10-06 — type-check+build PASS, 3 archivos. Hobby adaptado 2026-10-06: `0 3 * * *` diario.
- [x] **COMP-08 DPAs versionados** — `legal/dpa-register.md` (Clerk/Supabase/Vercel DPA URL, versión, fecha, subencargados, receipt hash), actualizar `legal/providers-audit.md` §3.3 y `politica-privacidad.md` § Encargados (EE.UU. explícito). `legal/data-inventory.md` §3 bases legales con consent_logs ref. ✅ 2026-10-06 — 3 archivos, template 2026-10-06-v1 listo pendiente firma.
- [x] **COMP-09 Verificación + docs** — `npm run type-check`, `npm run build`, pruebas manuales trazas feliz/race/bloqueada, actualizar `legal/technical-audit.md` gaps G-01/G-03, evidenciar en feature doc. ✅ 2026-10-06 — type-check PASS, build 23 routes, tests 92/92, RLS auth.jwt verificado, vercel.json válido.

## Progreso
- 2026-10-06: feature doc creado, scope autorizado híbrido, branch `feat/legal-f1-f3-f6`.
- 2026-10-06: COMP-01 cf8b2ae (migration §14), COMP-02 891481f (domain/port/adapter), COMP-03 2db2a0e (sign-up checkbox), COMP-04 07f315e (consent API + webhook híbrido), COMP-05 a8d2079 (gate art.6 + banner + progress guards), COMP-06/07 811e478 (supresión + cron), COMP-08/09 verificación final — todos con type-check+build PASS.

## Evidencia
- cf8b2ae feat(db): consent_logs §14 (83 líneas, RLS Clerk JWT, retention notes)
- 891481f feat(consent): domain (ConsentPurpose F-01..F-07 + transfer:EEUU + gender:x) + port + adapter service-role (200 líneas)
- 2db2a0e feat(auth): sign-up real + checkbox A no pre-marcado art.9/26 (138 líneas)
- 07f315e feat(consent): POST /api/consent (Zod) + webhook híbrido strict gender=x→403 / pending 24h→200 / verified→verified (124 líneas)
- a8d2079 feat(compliance): ProfileForm checkbox B art.6 + perfil guard + ConsentBanner pending + progress/lab guards 403
- 811e478 feat(compliance): user.deleted cascada + DELETE /api/account + RLS DELETE 7 policies + cron purge diario Hobby `0 3 * * *` + vercel.json + data-inventory §4
- 92 tests PASS, build 23 routes (incluye /api/account, /api/consent, /api/cron/purge-pending, /sign-up), RLS auth.jwt verificado, vercel.json diario Hobby válido `0 3 * * *`

## Siguiente paso
- Aplicar `supabase-migration.sql` en Supabase SQL Editor (idempotente, IF NOT EXISTS). Setear `CRON_SECRET` en Vercel env para cron. Aceptar DPAs y guardar receipts en `legal/receipts/` + actualizar `dpa-register.md` hash. Luego `politica-privacidad.md` Fase 11 desbloqueada.

## Riesgos
- Race webhook vs consent (mitigado con pending + public_metadata).
- Svix 4xx no reintenta (necesita retry manual en /api/consent).
- Cron sin pg_cron en Free tier (fallback Vercel Cron).
