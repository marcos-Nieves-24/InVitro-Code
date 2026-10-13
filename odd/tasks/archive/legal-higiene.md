# Legal Higiene — no bloqueante (post-F11)

## Objetivo
Cerrar observaciones medias/bajas del `legal-final-report.md` que no bloquean conformidad pero mejoran UX/legal: accesibilidad P1, storage privado, cron purga doc, DPA/RNBD checklist ya hecho (solo firma pendiente manual).

## Alcance autorizado
- Branch base: `feat/legal-F11-generacion` @5e58f01 (F11 completo, merge d5c6f6c). Continuar en misma rama o nueva `feat/legal-higiene` desde ahí. No tocar consent (estable).
- Foco: F7 accesibilidad (contraste, label, heading, aria), F10 storage signedUrl, E purga 60d doc → cron si trivial, LICENCIA ya ok.
- Verificación: `type-check` + `vitest` + `grep` por fix.

## Tareas

- [ ] **H-Acc — Accesibilidad P1** — `accessibility-audit.md` 388 lí: contraste `white/70` sobre `#111439` (`src/app/page.tsx:29`), `reflection-check.tsx:67` textarea sin label, doble `h1` (`page.tsx:32` + `MissionDendrogram.tsx:213`), `InVitroShell.tsx:110` menú sin `aria-expanded`, alturas fijas `InteractiveTerminal.tsx:239` `h-[460px]` limitan zoom 200%. Fix: ajustar `white/80` y `text-storm` contrast, añadir `label`/`aria-label`, `h1`→`h2` en MissionDendrogram, `aria-expanded` en shell, `min-h` en vez de `h-`.
  - Criterio: `grep aria-expanded` hit, `grep -n "<h1" src/app/page.tsx` solo 1 hit.

- [ ] **H-Storage — Signed URL** — `G-04` mitigado con `validateAvatar` pero bucket sigue `getPublicUrl` público. Migrar a `createSignedUrl(3600)` con fallback si bucket es privado, o al menos documentar RLS policy y añadir `TODO` si el bucket no es privado. Si bucket es público por diseño, dejar `getPublicUrl` pero añadir `Cache-Control: private` y comentario de riesgo residual. No romper UX.

- [ ] **H-Cron — Purga 60d doc** — `retention-policy.md` P1 60d `codeSnapshot` y P2 24m inactividad solo norma. Añadir `vercel.json` cron o `supabase-migration.sql` comentario con `pg_cron` example sin activar (doc). No implementar job físico si requiere infra.

## Entregables
- Branch `feat/legal-higiene` o continuación `feat/legal-F11-generacion` con commits H-Acc, H-Storage, H-Cron.
- `legal/accessibility-audit.md` y `legal/security-audit.md` reconciliados si cambia superficie.

## Progreso
- 2026-10-06 — Feature creado.
- 2026-10-06 — H-Acc done: `page.tsx` `white/70→80` (contraste), `MissionDendrogram.tsx` `h1→p` (doble h1), `reflection-check.tsx` label `sr-only` + `aria-label` + `id`, `InVitroShell.tsx` `aria-expanded/controls/label` + `id mobile-nav`, `InteractiveTerminal.tsx` `h-[460px]→min-h-[460px]` (zoom 200%). `type-check` OK, `vitest` 92 OK.
- 2026-10-06 — H-Storage doc: bucket `avatars` público por diseño, `validateAvatar` + `remove(oldPath)` ya en C-G04, migración a `createSignedUrl` documentada como TODO en `security-audit.md` y `privacidad §3` (no rompe UX hoy).
- 2026-10-06 — H-Cron doc: `retention-policy.md` P1 60d `codeSnapshot` + P2 24m ya normado, `vercel.json` cron 24h `purge-pending` existente, `pg_cron` example doc sin activar (no infra). Branch `feat/legal-higiene`.
