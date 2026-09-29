# Fase A-C Hardening — Data Integrity, Content, Pyodide, Dashboard, Tooling

## Objective
Cerrar deuda no resuelta auditada (P0/P1/P2) en worktree aislado `feat/fase-a-c-hardening` sin pisar `odd/revision-ortografica-latam` ni `odd/unified-lab-proyectos-system`.

## Problem
Auditoría (4 exploraciones paralelas) encontró:
- P0: `POST /api/progress` no existe → streak siempre 0; `getLessons()` sin sort → sidebar vs carousel discrepan; `profiles.theme` sin CHECK; `supabase_realtime` no idempotente
- P1: `page.tsx:175-195` H1 strip/Resumen filter/renumber frágiles + sin try/catch por slide; `pyodide-worker.js` initPromise muerto + stdout global sin mutex + sin offline UX; `BioreactorProgress` duplicado + rank thresholds dual + realtime muerto + dead code hero
- P2: `vitest` node-only sin coverage, `requestId-descarte.test.mjs` orphan, `skills-lock.json` drift, rama `odd/unified-lab-proyectos-system` dirty

## Why
Fase 1 (104 skills) + Fase 2 (120 skills + CI) cubren guardrails, pero sin A-C la UX de lección/lab y la integridad de progreso siguen rotas. Worktree `~/proyectos/invitro-code-worktrees/feat-fase-a-c-hardening` (rama `feat/fase-a-c-hardening` desde `odd/revision-ortografica-latam` @ b36670f) aísla el trabajo.

## Branch & Worktree
- Branch: `feat/fase-a-c-hardening` (conventional, GitHub best practice: `type/scope-description`, lowercase hyphens)
- Worktree: `~/proyectos/invitro-code-worktrees/feat-fase-a-c-hardening` (sibling, nunca /tmp, con `.codegraph/` propio)
- Base: `odd/revision-ortografica-latam` @ b36670f (incluye Fase 1+2: f56fd36, f265487)
- Skills: `.opencode/skills` gitignored — copiar desde main (104) + `gentle-ai skill-registry refresh` → 120 totales

## Scope
- Revivir `POST /api/progress` con upsert idempotente + dual-write `progress` + `streaks` + `achievements` (canoniza gamification)
- Fix `getLessons().sort()`, harden `page.tsx` Section split, mutex `pyodide-worker.js`, offline UX, canonizar `gamification/BioreactorProgress` DOM bubbles (borrar `dashboard/BioreactorProgress`), unificar ranks, limpiar dead code, vitest jsdom+coverage, skills-lock, rama hygiene
- No tocar `lint` (roto by design), no añadir marketplace Fase 3, no cambiar `.vercel_trigger_deploy_*`

## Authorized scope
Fase A→C completa en worktree. Commits con conventional commits sin AI attribution. Verificación: `type-check` + `skill-registry` + `build` 19/19 en CI.

## Tasks

### Fase A — P0 Data Integrity

#### T-A1 — Revivir POST /api/progress (upsert idempotente)
- **ID:** T-A1
- **Route:** delegated
- **Action:** Crear `src/app/api/progress/route.ts` con `Clerk auth()` 401, `createAdminClient()` service-role, validación `module_slug/lesson_slug`, `upsert progress onConflict user_id,module_slug,lesson_slug`, `upsert streaks` (current_streak +1 si last_active_date = ayer, reset si >1 día, update longest_streak), `evaluateAchievements` si helper existe. Retorna `{progress, streak}`. Actualizar `AGENTS.md:24` proxy→middleware.
- **Acceptance:** `POST /api/progress` existe, idempotente, streak incrementa, `CompleteLessonButton.tsx:27` recibe streak, `type-check` PASS
- **Checks:** `curl POST` manual, `grep auth.jwt` en migration, `type-check`

#### T-A2 — Fix getLessons().sort()
- **ID:** T-A2
- **Route:** delegated
- **Action:** `src/lib/content/modules.ts:170` añadir `.sort()` o `return getLessonSlugs().map(...)` para que `getLessons()` use mismo orden que `getLessonSlugs():115`. Test con 3 módulos.
- **Acceptance:** Sidebar `layout.tsx:9` y carousel `page.tsx:60` mismo orden
- **Checks:** `grep -n "getLessons"`, manual sort test

#### T-A3 — Hardening profiles.theme + realtime
- **ID:** T-A3
- **Route:** delegated
- **Action:** `supabase-migration.sql:25` añadir `CHECK (theme IN ('light','dark','system'))`, `InVitroShell.tsx:31` sanitizar, `supabase-migration.sql:130` hacer `ADD TABLE` idempotente por tabla + remover `user_achievements` si aplica, `AGENTS.md:24` fix `src/proxy.ts`→`src/middleware.ts`
- **Acceptance:** theme CHECK existe, realtime no falla en re-run, AGENTS.md correcto
- **Checks:** `grep CHECK`, `grep supabase_realtime`, `grep proxy`

### Fase B — P1 Content / Pyodide / Dashboard

#### T-B1 — Harden page.tsx Section split
- **ID:** T-B1
- **Route:** delegated
- **Action:** `src/app/learn/[module]/[slug]/page.tsx:175` H1 a `/^\uFEFF?\s*# .+$/m`, `:181` Resumen a `title\s*=\s*["']Resumen["']`, `:184` number a `number\s*=\s*\{\d+\}` + default `number` si falta, wrap `Promise.all(compileMDX)` con try/catch por slide (pattern laboratorios:104), añadir `zod` frontmatter schema en `getLessonFrontmatter`
- **Acceptance:** H1 miss 0, Resumen case-insensitive, no 500 por slide malformado, frontmatter valida
- **Checks:** `grep -n "Resumen"`, `grep "compileMDX"`, manual page render

#### T-B2 — Worker mutex + offline UX
- **ID:** T-B2
- **Route:** delegated
- **Action:** `public/pyodide-worker.js:11` reset `initPromise=null` en catch, `const PYODIDE_VERSION="0.25.0"`, serializar `runQueue = runQueue.then(()=>doRun())`, `readCapturedFigures` con `destroy()+clear`, `src/lib/pyodide-worker.ts:42` reset `workerInstance/readyPromise` en onerror, `src/components/editor/PyodideRunner.tsx:47` `navigator.onLine` banner + retry
- **Acceptance:** worker no muere permanente, no interleaving, offline mensaje claro
- **Checks:** `grep initPromise`, `grep runQueue`, manual offline test

#### T-B3 — Canonizar gamification/BioreactorProgress DOM bubbles
- **ID:** T-B3
- **Route:** delegated
- **Action:** Mantener `src/components/gamification/BioreactorProgress.tsx:6` (DOM bubbles) como único `BioreactorProgress`. Borrar `src/components/dashboard/BioreactorProgress/` (BioreactorProgress.tsx:10, BioreactorSvg.tsx, index.ts). Actualizar `DashboardContainer.tsx:20` import a `from "@/components/gamification/BioreactorProgress"` y mapear `progressPercentage = Math.min(100, (progressToNext/nextLevelXp)*100)`. Unificar `rankTitle` thresholds (`utils.ts:42` → `[0,200,500,1000,2000,3500]` XP) vs `niveles/page.tsx:31`. Decidir realtime: implementar `supabase.channel('progress_changes')` o borrar `ADD TABLE` y documentar `realtime: false`.
- **Acceptance:** Solo 1 BioreactorProgress existe (gamification), Dashboard usa DOM bubbles, ranks coherentes, no duplicate bundle
- **Checks:** `ls dashboard/BioreactorProgress` no existe, `grep BioreactorProgress` 1 origen, `grep rankTitle`

#### T-B4 — Dead code / hero limpieza
- **ID:** T-B4
- **Route:** delegated
- **Action:** Borrar `ProgressSection.tsx`, `AchievementsSection.tsx`, `BubbleLayer.tsx`, `TestTube.tsx` (keeping `BiotechGrowthTube` solo si usado en DashboardContainer:187/191), colapsar `HeroSection→HeroBanner`, borrar `DashboardHero3D*` + import muerto `ComicBubble` en `HeroBanner.tsx:7`, `clipPath` con `useId`, dedup `motion` vs `framer-motion` vs `gsap` (quedarse `motion/react` + `gsap` si gamification lo necesita), `video` con `poster`
- **Acceptance:** archivos muertos borrados, `HeroBanner` 1 componente, no imports muertos, `type-check` PASS
- **Checks:** `ls` borrados, `grep ComicBubble` 0, `grep motion` único

### Fase C — P2 Tooling / Higiene

#### T-C1 — Vitest jsdom + coverage
- **ID:** T-C1
- **Route:** delegated
- **Action:** `vitest.config.mts:7` a `environment:"jsdom"` o `projects:[{node},{jsdom}]`, `coverage:{provider:"v8"}`, `include:["src/**/*.test.mjs"]` para `requestId-descarte.test.mjs`, alinear `openspec/config.yaml:48-59` y `README.md:30`
- **Acceptance:** `npm test` corre 33 tests, coverage report genera, README correcto
- **Checks:** `npm test`, `grep vitest.config`

#### T-C2 — Skills-lock drift
- **ID:** T-C2
- **Route:** inline
- **Action:** Alinear `skills-lock.json` (2 vs 120) o documentar `gentle-ai skill-registry refresh` en `README.md` installation
- **Acceptance:** lock o docs alineados
- **Checks:** `cat skills-lock.json`, `grep skill-registry README`

#### T-C3 — Rama dirty hygiene
- **ID:** T-C3
- **Route:** inline
- **Action:** `git add` allowlist para `assets/`, `monitoring/`, `public/dashboard/*.glb` o extender `.gitignore`, commit `POST /api/progress`, `git worktree list` limpio
- **Acceptance:** `git status --porcelain` <10 líneas dirty, worktree listo para PR
- **Checks:** `git status`, `git worktree list`

## Progress
- [ ] T-A1 — POST /api/progress
- [ ] T-A2 — getLessons sort
- [ ] T-A3 — theme CHECK + realtime
- [ ] T-B1 — page.tsx hardening
- [ ] T-B2 — worker mutex
- [x] T-B3 — canonize gamification bubbles
- [ ] T-B4 — dead code
- [ ] T-C1 — vitest
- [ ] T-C2 — skills-lock
- [ ] T-C3 — hygiene

## Verification evidence
- T-B3: `npx tsc --noEmit` → exit 0. `npm run build` → OK (route `/preview/bioreactor` prerendered). `npx vitest run src/lib/gamification/utils.test.ts` → 10/10 pass. `npm run test` → 2 pre-existing failures en `src/components/labs/LabCardTheme.test.ts` (acents `#A3CFCD`/`#82A0AA`), archivo intacto respecto a HEAD → fuera de scope.
- T-B3: `ls src/components/dashboard/BioreactorProgress` → no existe; `git status` muestra 6 archivos como `D` (BioreactorProgress, BioreactorSvg, BioreactorVessel, BubbleLayer, index, useBioreactorMotion). `grep -r "dashboard/BioreactorProgress" src` → 0.
- T-B3: ranks unificados vía `RANK_THRESHOLDS` en `src/lib/gamification/utils.ts`; `rankTitle(level)` resuelve por la escalera canónica (convierte level→XP), así que `rankTitle(calcLevel(xp).level) === rankNameForXp(xp)` por construcción (test de acuerdo en 14 totales XP). `niveles/page.tsx` importa la escalera y usa `rankIndexForXp`; solo conserva icono/descripción/skills.
- T-B3: `DashboardContainer` envuelve el layer canónico en un padre `relative h-48 w-40 overflow-hidden` — sin esa caja el `absolute inset-0` escapaba al `<div className="relative overflow-hidden rounded-2xl">` del video y cubría el panel completo. Se restauró la semántica `role="progressbar"` que aportaba el componente SVG borrado. Hoisted `levelProgressPct` para que barra + bioreactor + a11y lean el mismo valor.
- T-B3: `BiotechGrowthTube` NO era duplicado — `sm:flex` / `sm:hidden` es un par responsivo mutuamente excluyente (línea ~192 y ~197). Se conservan ambos; eliminar uno ocultaría la planta en mobile.
- T-B3: `src/app/preview/bioreactor/page.tsx` importaba el módulo borrado (rompía `tsc`); reescrito contra el componente canónico en vez de borrar la ruta dev.
- T-B3: realtime — `grep -rn "supabase.channel|\.subscribe("` → 0 resultados en `src/`. Ningún widget se suscribe; la línea de AGENTS.md que lo afirmaba era falsa, corregida a `realtime: false` documentado. La publicación se deja (ya idempotente desde T-A3).
- T-B3: sin commit aún (work-unit commit pendiente de tu OK).

## Next step
Commit de T-B3 como work unit; luego T-B4 (dead code: `ProgressSection.tsx`, `AchievementsSection.tsx`, `TestTube.tsx` siguen vivos; `BubbleLayer.tsx` ya cayó con el folder de BioreactorProgress).

## Delivery strategy
ODD work-unit commits por task en `feat/fase-a-c-hardening` worktree. Merge final `git merge --no-ff` o PR.

## Relevant files
- Worktree: `~/proyectos/invitro-code-worktrees/feat-fase-a-c-hardening`
- `src/app/api/progress/route.ts` — nuevo
- `src/lib/content/modules.ts:170` — sort
- `supabase-migration.sql:25,130` — CHECK + realtime
- `src/app/learn/[module]/[slug]/page.tsx:175-195` — Section
- `public/pyodide-worker.js` — mutex
- `src/components/gamification/BioreactorProgress.tsx:6` — canon
- `src/components/dashboard/BioreactorProgress/` — borrar
- `vitest.config.mts` — jsdom
