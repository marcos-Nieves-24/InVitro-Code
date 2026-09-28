# Slice 1 — Safe Deletes (0 importers + 0 spec refs)

## Objective
Borrar 20+ archivos con 0 importers verificados en src/** y 14.5 MB de assets públicos huérfanos, sin tocar specs mandados ni romper type-check/build.

## Problem
Auditoría 4 exploraciones encontró 18 componentes + 4 lib/hooks + 3 public assets con 0 refs:
- dashboard/ComicBubble+useTypewriter (cadena muerta), DashboardHero3D, ErrorBoundary
- gamification/ModuleProgress, XPBar, LevelBadge, StreakBadge (BioreactorProgress ya es único vivo)
- layout/AppSidebar (superseded InVitroShell), FloatingNav, CommandPalette, ScienceLabBackground, SectionsDrawer (vivo SectionsDropdown)
- ui/SiteHeader, PageShell, Skeleton, ScrollReveal (reemplazado por useScrollReveal hook), Card
- labs/LabTabs (vivo LabWorkspace directo)
- lib/clerk-appearance (22 LOC nunca importado), lib/api-client (17 LOC apiFetch nunca usado), hooks/usePyodideWorker (51 LOC ThresholdLab ya JS puro), hooks/useScrollReveal (27 LOC nunca observado)
- public/dashboard/cientifico-1.svg, cientifico-x.svg, cientifica-adn.glb 6.7MB (GLB ya shim svg), public/videos/hero-lab-4k.mp4 14MB + poster 497KB (reemplazados por lab-hero-* per-module)

## Why
Son 400+ líneas + 21 MB que confunden y duplican bundle (motion vs framer, heroImages vs heroVideos ya resuelto). Slice 1 es PR <400 líneas (deletes cuentan pero son safe), Slice 2/3 requieren SDD deltas.

## Scope
- Borrar 18 componentes + 4 lib/hooks + 5 public assets (lista arriba) vía `rm` (git D)
- No tocar: heroVideos.ts (Slice 2), animations (Slice 3), specs, sdd, odd/tasks cerrados
- Verificación: `grep -r "from.*@/components"` 0 después, `npx tsc --noEmit` PASS, `npm run build` PASS (o OOM fallback a tsc), `npm test` 54 PASS

## Authorized scope
Solo deletes + .gitignore si falta coverage (ya está). No refactors.

## Tasks

### T1 — Delete 18 components
- **ID:** T1
- **Route:** delegated
- **Action:** `rm` cada archivo listado, `git status` D, `grep -r "ComicBubble\|DashboardHero3D\|ModuleProgress\|XPBar\|AppSidebar"` 0 después
- **Acceptance:** `ls src/components/dashboard/ComicBubble.tsx` no existe, 18 files D, `tsc` PASS
- **Checks:** `grep` 0, `ls` borrados

### T2 — Delete 4 lib/hooks
- **ID:** T2
- **Route:** delegated
- **Action:** `rm src/lib/clerk-appearance.ts src/lib/api-client.ts src/hooks/usePyodideWorker.ts src/hooks/useScrollReveal.ts`
- **Acceptance:** 4 files D, `grep clerk-appearance` 0, `tsc` PASS
- **Checks:** `ls` borrados

### T3 — Delete 5 public assets (14.5MB + 6.7MB)
- **ID:** T3
- **Route:** delegated
- **Action:** `rm public/dashboard/cientifico-1.svg public/dashboard/cientifico-x.svg public/dashboard/cientifica-adn.glb public/videos/hero-lab-4k.mp4 public/videos/hero-lab-4k-poster.jpg`
- **Acceptance:** `ls public/dashboard/cientifica-adn.glb` no existe, 14.5MB liberados, `grep hero-lab-4k` 0
- **Checks:** `ls`, `du -sh public/videos`

## Progress
- [x] T1 — 15 components (ModuleProgress, XPBar, LevelBadge, StreakBadge, AppSidebar, FloatingNav, CommandPalette, ScienceLabBackground, SectionsDrawer, SiteHeader, PageShell, Skeleton, ScrollReveal, Card, LabTabs, ErrorBoundary) — 15 D, ComicBubble/useTypewriter/DashboardHero3D kept (spec-mandated per dashboard-gaming-hero, dashboard-3d-hero)
- [x] T2 — 4 lib/hooks (clerk-appearance 22LOC, api-client 17LOC, usePyodideWorker 51LOC, useScrollReveal 27LOC) — 4 D
- [x] T3 — 5 public assets (cientifico-1.svg, cientifico-x.svg, cientifica-adn.glb 6.7MB, hero-lab-4k.mp4 14MB, poster 497KB) — 21.2MB liberados, public/dashboard 2.0M, public/videos 900K

## Verification evidence
- `grep -r "from.*@/components/gamification/ModuleProgress\|XPBar\|LevelBadge\|StreakBadge\|AppSidebar\|FloatingNav"` 0
- `grep -r "clerk-appearance\|usePyodideWorker\|useScrollReveal"` 0
- `grep -r "hero-lab-4k\|cientifica-adn.glb"` 0
- `./node_modules/.bin/tsc --noEmit` PASS (exit 0)
- `npm test` 7 files 54 passed (37+17)
- `ls` borrados confirmados, barrels ui/index.ts y labs/index.ts limpiados

## Next step
Slice 1 completo. Próximo: Slice 2 (spec consolidation: heroVideos.ts) y Slice 3 (animations) requieren SDD deltas separados.

## Delivery strategy
Single commit `chore(cleanup): slice 1 safe deletes (0 importers)` en worktree feat/fase-a-c-hardening, <400 líneas net (deletes). Forecast ~500 deletions pero safe.

## Relevant files
- Worktree: ~/proyectos/invitro-code-worktrees/feat-fase-a-c-hardening
- 18 components + 4 lib/hooks + 5 public assets (lista arriba)
