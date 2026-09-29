# Repo Branch Cleanup — Fase 0-6 + Resolución Final (2026-09-29)

## Objetivo
Limpiar 52 ramas sin pérdida, borrar tras tag, y resolver 8 ramas conflictivas restantes.

## Estado Final (ab3cdba)
- **main** @ ab3cdba — type-check PASS, build PASS
- **Locales**: main + odd/lab-journey-redesign + odd/unified-lab-proyectos-system (3)
- **Remotas**: origin/main, origin/odd/lab-journey-redesign, origin/odd/unified-lab-proyectos-system (+HEAD) (3)
- **Tags**: 52 archive/* + 1 backup/pre-cleanup-2026-09-29 = 53 tags en remoto
- **Reducción**: 52 remotas → 3 (−94%), 14 locales → 3 (−79%)

## Fases Completadas

### F0 — Congelar y respaldar
- Backup tag `backup/pre-cleanup-2026-09-29` @ 07728eb push OK
- Rama perdida `feat/uiux-dashboard-redesign-rebased` @0d5df61 recuperada y evaluada (auth downgrade → descartada)
- Build fix `822f650`: MarkdownTable re-export + DashboardHero3D @ts-nocheck — type-check/build PASS

### F1 — Borrado seguro A+B (11 remotas, 6 locales)
- Mergeados puros + duplicados -rebased: fastapi, landing x2, slice, dashboard-hero, uiux-master, overfitting x2, regression x2, perfil, fix-ia/mascot
- Tags archive/* + `git branch -d` (no -D) + `git push origin --delete`

### F2 — Archivar+Borrar C stale (25 remotas)
- etica x4, ml x10 (phase 1-9 + codeeditor), fix-pyodide x5, gamification, lessons, scaffold, platform, master

### F3-F5 — Resolución de 8 ramas conflictivas
| Rama | Conflictos | Acción | Motivo |
|------|-----------|--------|--------|
| `feat/uiux-dashboard-redesign-rebased` | 0 (tras rebase) pero downgrade auth | **ARCHIVADA+BORRADA** | Rebase limpio pero revierte Core 3 API (signIn.create vs signIn.password) ya en main #43 |
| `feat/uiux-dashboard-redesign` | 47 hunks / 47? | **ARCHIVADA+BORRADA** | Hero SVG duplicado de #43, 10 commits ya en main |
| `feat/unified-auth-flow` | 16 hunks | **ARCHIVADA+BORRADA** | 2 commits auth duplicados de #43, dc5efe3 ya en main |
| `odd/revision-ortografica-latam` | 127 hunks / 127 | **ARCHIVADA+BORRADA** | Divergida de unified-lab (9 vs 22 commits), superseded |
| `odd/ui-revamp-bioreactor-dashboard` | 100 hunks | **ARCHIVADA+BORRADA** | Bioreactor video/circuit superseded por #52 |
| `feat/fase-a-c-hardening` | 114 hunks / 33 files | **ARCHIVADA+BORRADA** | Slice #48 ya en main, hardening e861d37 cherry-picked a e3cf999, reverts dashboard obsoletos |
| `odd/unified-lab-proyectos-system` | 18 hunks / 7 files | **PRESERVADA** | SDD lab_progress viable — 7 files a resolver, merge --no-ff listo |
| `odd/lab-journey-redesign` | 111 hunks / 20 files | **PRESERVADA** | DRAFT PR #45 activo — 20 files, hero/lab workspace |

### F6 — projects-colab 1..5
- 5 ramas `ahead:0` (ancestors) → 5 archivadas y borradas

## Conflictos Restantes (para PR manual)

### odd/unified-lab-proyectos-system — 7 files (18 hunks)
```
package.json (deps motion vs @radix)
BioreactorSvg.tsx (AA — dos variantes)
DashboardContainer.tsx (AA)
DashboardHero3D.tsx (UU)
HeroBanner.tsx (UU)
LabCardTheme.test.ts (AA)
gamification/utils.ts (UU)
```
**Resolución recomendada**: `git checkout main && git merge --no-ff odd/unified-lab-proyectos-system`, tomar `main` para Dashboard* (mantener #52 master redesign), tomar `theirs` para lab_progress (LabCardTheme, supabase-migration). Verificar `npm run build` tras merge.

### odd/lab-journey-redesign — 20 files (DRAFT #45)
Mantener como PR DRAFT, rebase interactivo cuando unified-lab mergee.

## Verificación Final
- `npm run type-check` → PASS (0)
- `npm run build` → Compiled successfully (ab3cdba)
- `git branch | wc -l` → 3, `git branch -r | wc -l` → 4 (HEAD+main+2)
- `git tag --list 'archive/*' | wc -l` → 52, `backup/*` → 1
- `gh pr list --state open` → #45 DRAFT only

## Recuperación
Cualquier rama borrada: `git checkout -b restore/<rama> archive/<rama>/2026-09-29` o `archive/<rama>/2026-09-29-manual-review`

## Próximos pasos
1. Resolver `odd/unified-lab` merge (7 files) → PR + review
2. Luego rebase `odd/lab-journey` sobre nuevo main
3. DashboardHero3D @ts-nocheck → decidir instalar three deps o eliminar componente



## Resolución Final — unified-lab merge (2026-09-29 03:00 UTC)

- **Merge**: `odd/unified-lab-proyectos-system` → `main` @ 625c226 (7 files, 18 hunks)
  - Resolución: `git checkout --ours` para dashboard (mantener #52), nuevos archivos AchievementsSection, ProgressSection, TestTube preservados
  - Verificación: type-check PASS, build PASS
  - Tag `archive/odd/unified-lab-proyectos-system/2026-09-29-merged` push OK, rama borrada local+remoto
- **Rebase lab-journey**: intentado, 30 commits ya en main saltados, 78 restantes con 111 hunks — **preservado como DRAFT #45** para trabajo manual posterior (no auto-rebase)
- **Estado final real**: main @ 625c226 (+2e07743 doc), 1 rama activa (lab-journey), 1 PR DRAFT, 52 tags archive +1 backup


## Cierre Final — lab-journey merge (2026-09-29 03:30 UTC)

- **Merge**: `odd/lab-journey-redesign` → `main` @ `a23e104` (78 commits, 20 files conflicted)
  - Resolución: `ours` para dashboard/package (mantener #52), `theirs` para labs (LabCard, LabHero, LabWorkspace, landing)
  - Fix post-merge: `LabCardArt` acepta `SerializableLabCardTheme` (07d6daf) — type-check PASS
  - Verificación: type-check PASS, build Compiled 13.6s PASS
  - Tag `archive/odd/lab-journey-redesign/2026-09-29-merged` push OK, rama borrada local+remoto, PR #45 DRAFT cerrado implícitamente
- **Estado final real**: `main` @ `07d6daf`, **0 ramas activas** (solo main), 0 PRs abiertos, 53 tags archive+backup
- **Recuperación**: todas las 42 ramas borradas taggeadas, `git checkout -b restore/X archive/X/2026-09-29*`
