# Retención — Búsqueda cmd+K + Bookmarks (PR-3)

## Objetivo
Reducir fricción de descubrimiento: cmd+K global y guardar lecciones para volver sin navegar.

## Problema
Sin búsqueda el usuario navega módulos manualmente. Sin bookmarks no hay shortlist personal.

## Scope
- Búsqueda: `CommandPalette` clientLESS (substring normalizado, sin Fuse dep) indexando `getModulesWithLessons()` (título, module, slug)
- Bookmarks: `bookmarks` table + APIs + UI toggle + página `/bookmarks`
- Infra: `supabase-migration.sql §18` bookmarks

## Fuera de scope
- Historial, notas, AI search, server search

## Tasks
- [x] T1 — Migration `bookmarks` + domain helper `src/domain/bookmark.ts` — a7daddd
- [x] T2 — APIs `GET/POST/DELETE /api/bookmarks` — 626510e
- [x] T3 — UI `CommandPalette` (cmd+K / ctrl+K, backdrop, substring normalizado) + integración `InVitroShell`/`AppSidebar` — 36962d2
- [x] T4 — UI `BookmarkButton` + lista bookmarks en dashboard + tests — 4d93658

## Criterios
- [x] cmd+K abre palette, filtra por título/module, Enter navega `/learn/[module]/[slug]` — CommandPalette + provider en dashboard/learn layouts, normalize NFD, max 8, Arrow nav
- [x] Bookmark toggle persiste (POST/DELETE), GET lista, page `src/app/(dashboard)/bookmarks/page.tsx`
- [x] `type-check` + `build` + tests verdes — 142 tests (16 files), build 27 routes incl. /api/bookmarks + /bookmarks

## Branch
`feat/retencion-freeze-automatico` continuación (PR-3 slice). Real ~520 líneas (migration+domain+api+palette+bookmarks+tests).

## Verificación
- `npm run type-check` pass
- `npm run test` 142 pass (16 files) — bookmark 6 + normalize 6 nuevos
- `npm run build` pass (Next 16.2.10, 27 routes)
- Commits: a7daddd (T1), 626510e (T2), 36962d2 (T3), 4d93658 (T4)

## Siguiente
PR-3 listo para review. Siguiente slice PR-4 si aplica.
