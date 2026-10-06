# Legal Seguridad C — G-02 + G-04/G-05 + C5 + rate limiting

## Objetivo
Cerrar los críticos de seguridad restantes (excluye G-01/PROV-01/C1, G-03/C2 y PROV-02/C3 que van en otra sesión) sin romper base habilitante.

## Alcance autorizado
- Rama base: `feat/legal-f1-f3-f6` @0165c33. Nueva branch `feat/legal-seguridad-c-clean` desde ahí.
- Foco: `G-02 service-role`, `C5 monitoring hardcode`, `G-04 avatar público/ext`, `G-05 duplicación avatar`, rate limiting.
- NO tocar: `webhooks/clerk consent`, `user.deleted`, DPAs (otra sesión).
- Verificación: `npm run type-check` + `grep` + `vitest` si aplica.

## Tareas

- [ ] **C-G02 — Guard service-role** — `src/lib/supabase/admin.ts` solo server, lint `no-restricted-imports` para `createAdminClient` en `"use client"`, check pre-build sin exponer key, cachear `is_admin` vía `public_metadata.role` en `middleware.ts:59` para no crear admin client por request.
  - Archivos: `src/lib/supabase/admin.ts`, `src/middleware.ts`, `eslint` o script pre-build, `next.config.ts` si aplica.
  - Criterio: `grep -R createAdminClient src --include="*.tsx"` sin hits en client + `type-check` verde.

- [ ] **C-C5 — Secreto monitoreo** — `docker-compose.monitoring.yml:75` `GF_SECURITY_ADMIN_PASSWORD=invitro` → `${GF_PASSWORD:?}` + `.env.local.example` + doc.
  - Archivos: `docker-compose.monitoring.yml`, `.env.local.example`, `README.md` si aplica.
  - Criterio: `grep invitro docker-compose.monitoring.yml` vacío.

- [ ] **C-G04/G05 — Avatar hardening** — Centralizar `src/lib/profile/validateAvatar.ts` (allowlist ext lowercase `jpg|jpeg|png|webp`, size ≤2MB, sniff firma image/* por ArrayBuffer, no solo file.type), borrar objeto anterior al upload, migrar a signed URL o RLS Storage, unificar `src/app/api/profile/avatar/route.ts` y `src/app/(dashboard)/perfil/page.tsx:48` para usar validador central.
  - Archivos: `src/lib/profile/validateAvatar.ts` (nuevo), `src/app/api/profile/avatar/route.ts`, `src/app/(dashboard)/perfil/page.tsx`.
  - Criterio: `getPublicUrl` ya no público o documentado como privado + validación por firma + `storage.remove()` del anterior.

- [ ] **C-Rate — Rate limiting mínimo** — Middleware Map por IP+userId en `/api/progress` y `/api/lab-progress` (100 req/15min + Retry-After) con fallback a Upstash doc.
  - Archivos: `src/middleware.ts` o `src/lib/rate-limit.ts` + `src/app/api/progress/route.ts`, `src/app/api/lab-progress/route.ts`.
  - Criterio: `grep rateLimit` con hits + 429 con Retry-After observable.

## Entregables
- Branch `feat/legal-seguridad-c-clean` con work-unit commits por subtarea.
- Auditorías `legal/security-audit.md` y `legal/technical-audit.md` reconciliadas si cambia superficie.

## Progreso
- 2026-10-06 — Feature creado.
- 2026-10-06 — C-C5 done 9101c35: `docker-compose.monitoring.yml:75` `invitro` → `${GF_SECURITY_ADMIN_PASSWORD:?}` + `.env.local.example`.
- 2026-10-06 — C-G02 done e50c1f2: `admin.ts` server guard + `middleware.ts` cache `publicMetadata.role` + `scripts/check-admin-client.mjs`.
- 2026-10-06 — C-G04/G05 done 02fb756: `validateAvatar.ts` (magic bytes, ext↔MIME, `jpeg→jpg`, bloqueo `avatar.png.exe`) + `avatar/route.ts` + `perfil/page.tsx` usan validador + `remove(oldPath)` best-effort + TODO signed URL.
- 2026-10-06 — C-Rate done 247e76a: `rate-limit.ts` in-memory `Map` + 429 `Retry-After` en `progress` y `lab-progress` POST.
- 2026-10-06 — Verificación: `type-check` OK, `vitest` 11/11 92 tests, `grep invitro` EMPTY, `validateAvatar` hits OK, `checkRateLimit` hits OK. `git stash` de consent descartado en esta branch limpia. `docker-compose.monitoring.yml` gitignore pero force-added.
- 2026-10-06 — C-G02 guard service-role: `src/lib/supabase/admin.ts` server-only (`typeof window` guard + JSDoc), `src/middleware.ts` cache Lec1 `publicMetadata.role` / Lec2 DB fallback, `scripts/check-admin-client.mjs` (grep sin eslint) — `type-check` ok, `grep -R createAdminClient` sin hits en client.
- 2026-10-06 — C-C5 monitoreo: `docker-compose.monitoring.yml` `GF_SECURITY_ADMIN_PASSWORD=${GF_PASSWORD:?}` + `.env.local.example` + docs.
