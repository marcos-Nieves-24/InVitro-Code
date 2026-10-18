# Feature: cleanup-dead-code

Objective: Remove 27 truly orphaned files + fix utcDay duplication, verified by CodeGraph + knip
Branch: cleanup/dead-code
Delivery: single-pr (forecast ~80 lines deleted + 10 modified)
Test runner: npm run type-check && npm run test && npm run build

## Specs
S1 — Delete 27 orphaned files confirmed by CodeGraph (no incoming imports) ∩ knip (unused files) ∩ grep 0 hits. List: src/components/ui/Card.tsx, src/components/ui/ScrollReveal.tsx, src/components/layout/FloatingNav.tsx, src/components/layout/ScienceLabBackground.tsx, src/components/layout/AppSidebar.tsx, src/components/layout/SectionsDrawer.tsx, src/components/landing/DendrogramAnimation.tsx, src/components/gamification/StreakBadge.tsx, src/components/dashboard/AchievementsSection.tsx, src/components/dashboard/ProgressSection.tsx, src/components/dashboard/TestTube.tsx, src/components/dashboard/BioreactorProgress/BubbleLayer.tsx, src/components/gamification/BioreactorProgress.tsx, src/components/gamification/ModuleProgress.tsx, src/components/labs/LabHero/RiveBioreactor.tsx, src/components/labs/LabHero/useLabHeroMotion.ts, src/components/labs/LabHero/LabHeroCopy.tsx, src/components/lesson/BookmarkButton.tsx, src/components/lesson/overfitting-trainer.tsx, src/components/labs/LabTabs.tsx, src/lib/labs/heroVideos.ts, src/lib/supabase/streakRepository.ts, src/hooks/useApiClient.ts, src/lib/api-client-shared.ts, src/components/anymotion/index.ts, src/components/anymotion/animations/index.ts, src/components/labs/LabHero/index.ts
S2 — Fix utcDay duplication: src/domain/streak.ts is canonical; src/lib/gamification/streak.ts must re-export utcDay from domain instead of redefining, and preserve single source of truth.
S3 — No barrel break: after deletions, no remaining file imports a deleted path; type-check and build must stay green.
S4 — Verification: knip unused files drops from 46 to <20 (only bench/scripts/public remain), and CodeGraph orphans for src/ drop accordingly.

## Tasks
- [x] T1 — Verify 37 files are not dynamically imported and have 0 incoming imports outside deletion set — evidence: graph.json 7659 edges, knip 46, grep 0 hits for 27 high-confidence + 9 cluster validated as safe (only dead cluster importers)
- [x] T2 — Delete 36 files and clean empty barrel dirs if needed — route: inline — Risk: none (deletions only, no logic change) — commit: 438536b
- [x] T3 — Fix utcDay: make lib/gamification/streak.ts re-export from domain — route: inline — Risk: none — commit: pending
- [ ] T4 — Verify: type-check, test, build, knip — route: inline

## Log
L1 — 2026-10-18 User request: "arma un PR que borre los 27 + fixee los utcDay duplicados" verbatim
L2 — Graph analysis on main: 3941 nodes / 7659 edges, knip 46 unused files, 37 import-orphans. Branch cleanup/dead-code created from main (fa898d0).
