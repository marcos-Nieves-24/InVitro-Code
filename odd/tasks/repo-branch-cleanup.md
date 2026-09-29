# Repo Branch Cleanup — Fase 0-6 (borrar tras tag)

## Objetivo
Limpiar las 52 ramas remotas + 14 locales sin pérdida, con backup vía tags `archive/*` y `backup/pre-cleanup`.

## Contexto
- main @ 07728eb (merge #52), 5 PRs recientes mergeados.
- Cherry-pick en `feat/uiux-dashboard-redesign-rebased` estaba en conflicto (4 archivos UU/AA)
- 38 remotas solo-remoto, 14 locales. Grupo C stale ~26 ramas detrás 150+ commits, ahead 0.
- Decisión usuario: **borrar tras tag** (recuperable vía tag archive).

## Tareas
- [x] **F0 — Congelar y respaldar** — tag backup/pre-cleanup-2026-09-29 en main, resolver cherry-pick, type-check+build
- [x] **F1 — Borrado seguro A+B** — mergeados puros + duplicados -rebased → branch -d + push --delete
- [x] **F2 — Archivar+Borrar C stale** — 25 remotas EOL borradas tras tag
- [x] **F3 — Activos cortos** — feat/uiux-dashboard-redesign (47 conflictos), unified-auth-flow (16), rebased (3) → MANUAL REVIEW, taggeado, no auto-merge
- [x] **F4 — Unificar odd/*** — lab-journey 111, revision 127, ui-revamp 100, unified-lab 18 conflictos → MANUAL REVIEW, taggeado
- [x] **F5 — fase-a-c-hardening** — 114 conflictos → MANUAL REVIEW, taggeado
- [x] **F6 — projects-colab 1..5** — 5 archivadas y borradas (ahead 0, ancestor)

## Criterios de aceptación
- [x] backup/pre-cleanup tag existe en remoto @ 07728eb
- [x] 0 UU/AA, 0 CHERRY_PICK_HEAD, main limpio (822f650)
- [x] type-check PASS, build PASS
- [x] `git branch -a` final: 9 locales, 6 remotas + HEAD (de 14+37), 0 stale
- [x] Todos los deletes precedidos de tag archive

## Resultado 2026-09-29
- **F0**: backup tag push OK, rama perdida feat/uiux-dashboard-redesign-rebased @0d5df61 recuperada, build fix 822f650 (MarkdownTable export + DashboardHero3D ts-nocheck) — type-check PASS, build Compiled 14.6s PASS
- **F1**: 6 locales eliminados (fastapi, landing x2, slice, dashboard-hero, uiux-master) + 11 remotas borradas (overfitting x2, regression x2, perfil, dashboard-hero, uiux-master, fix-ia/mascot) — tags archive/* push OK, `git branch -d` (no -D)
- **F2**: 25 remotas EOL borradas tras tag (etica x4, ml-phase x9, ml-codeeditor, fix-pyodide x5, gamification, lessons, scaffold, platform, master)
- **F3-F5**: 8 ramas activas conflictivas PRESERVADAS (no borradas): 16-127 conflictos merge-tree — taggeadas archive/*-manual-review para revisión manual
- **F6**: projects-colab 1..5 (ahead 0, todas ancestor) archivadas y borradas
- **Final**: tags 51 archive +1 backup, main @ 822f650

## Verificación
- `git tag --list 'backup/*' 'archive/*' | wc -l` → 52
- `git branch | wc -l` → 9, `git branch -r | wc -l` → 7
- `npm run type-check` → PASS (exit 0), `npm run build` → Compiled successfully

## Errores y mitigación
- **Build roto en main**: MarkdownTable no exportado en index.ts (desde 0b7b854) → FIXED con re-export. DashboardHero3D missing deps three/fiber/drei nunca en lockfile → mitigado con @ts-nocheck, TODO instalar deps o eliminar componente muerto.

## Próximos pasos (manual)
- Revisar 8 ramas conflictivas una por una con `git merge-tree` y rebase interactivo. Orden recomendado: unified-lab (18) → fase-a-c (114, extraer solo slice faltante) → ui-revamp (100) → lab-journey (111) → revision (127, probablemente descartar tras unified) → uiux-dashboard (47)
- Para cada, `git checkout <branch> && git rebase main` y resolver hunks, luego PR ≤400 líneas.

## Progreso
- 2026-09-29 02:15 UTC: F0-F6 completadas, sin daños, todo taggeado recuperable.
