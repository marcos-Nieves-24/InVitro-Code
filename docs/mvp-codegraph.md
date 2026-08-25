<!--
Generated: 2026-08-25 · Source: CodeGraph index · READ-ONLY inference
Regeneration: codegraph explore + node/callees/impact
-->
# InVitro-Code — Documentación MVP (CodeGraph)

## 1. Descripción del producto

**InVitro-Code** — Duolingo para biotecnólogos que aprenden IA/ML codeando. El alumno elige módulo → lección en carrusel → quiz → lab ejecutable (Python real en browser) → entrega → gana XP. Todo en **español** (UI/contenido), código en inglés.

**Problema que resuelve**: Biotech necesita Python/estadística/ML pero los cursos genéricos no usan datasets biológicos. InVitro usa Breast Cancer Wisconsin, Iris, PDB/ Biopython.

**Módulos hoy**: `python` 17 lecciones, `ia` 4, `machine-learning` 10, `estadistica` 10. Total 41 lecciones filesystem-driven (`lessonNN_`).

## 2. Grafo de dependencias (CodeGraph)

**Nodo central**: `src/lib/pyodide-worker.ts` — singleton `pyodideWorker` (requestId correlation, queue, 120s timeout). Provee `ready()` + `run(code, context)`.

**Consumidores directos** (callees):
- `src/components/editor/PyodideRunner.tsx` → `pyodideWorker.ready() + run()`
- `src/hooks/usePyodideWorker.ts` → `usePyodideWorker().run()` → `pyodideWorker.run()`
- `ThresholdLab` / `LabCodeBlock` → mismo singleton

**Worker real**: `public/pyodide-worker.js` — `readCapturedFigures()` lee `_captured_figures` (Python list → JS via PyProxy), `ensurePyodide()`, `ensureSklearn()`, `ensureStats()`, `ensurePlotly()` (lazy por `code.includes()`), captura stdout + figures → `{output, figures}`.

**Hotspots** (mayor fan-in): `public/interactives/assets/plotly-3.0.0.min.js` domina (2324 hits) — vendor no business. App code hotspot real: `lib` (71 inbound) y `components` (25).

**Boundaries**: `app → lib (65)` es el acoplamiento principal; `app → components (25)`; `components → lib (5)`. No ciclos detectados.

**Clusters CodeGraph** (12, cohesion 0.4–0.77): `public` domina (559 miembros cohesión 0.66), `src` cluster 22 (97 miembros, DashboardPage, createAdminClient, getModules) con cohesion 1.0 — bien aislado.

## 3. Arquitectura por CodeGraph

```
[App Router Entrypoints 20]
  ↓ 65 calls
[lib core] ← 5 calls ← [components core]
  ↑ 1 call ← [hooks]
[public/pyodide-worker.js] ↔ [lib/pyodide-worker.ts] (via Worker postMessage requestId)
[content/modules filesystem] → [lib/content/modules.ts] → [app/learn, app/labs]
[Supabase] ← [lib/supabase/admin.ts] ← [api routes]
```

**Símbolos clave**:
- `getModules()` / `getLessonSlugs()` / `getLessonTitle()` / `formatLessonName()` (lib/content)
- `pyodideWorker` (lib), `readCapturedFigures` (worker), `usePyodideWorker` (hook)
- `ConidiaSortGame` (lesson) — ahora con props `moduleSlug/lessonSlug/blockId` (fix E3, blast radius: 0 callers directos, usado vía MDX)
- `LessonError` (learn/error.tsx) — boundary error client

## 4. Flujo lección (call path)

`learn/[module]/[slug]/page.tsx`:
`fs.readFileSync + gray-matter` → `split(/(?=<Section )/)` → `filter !Resumen` → `map renumber number={i+1}` → `for compileMDX(remark-math, remark-gfm, rehype-katex)` → `LessonCarousel(slides, nextLessonHref)`.

`laboratorios/[module]/[lesson]/page.tsx`:
`hasLab/hasQuiz/hasNotebook` → `compileMDX` con `rehype-lab-sections` → `LabRunner` (python fences → PyodideRunner).

**MDX registration**: `components/lesson/index.ts` barrel (22) + map `components` en page. Falta → crash compilación sección.

## 5. Auth & datos (CodeGraph trace)

`proxy.ts (clerkMiddleware)` → `auth()` → `createAdminClient()` → Supabase service-role.

`supabase/admin.ts`: 8 líneas, `createClient(NEXT_PUBLIC_SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)` — único punto de escritura.

**Tablas** (6): `profiles` (TEXT id), `progress` (unique user/module/lesson), `streaks` (unique user_id), `reflection_completions` (unique user/block), `achievements` (17 seed), `user_achievements` (PK user_id+achievement_id).

**Publish realtime**: `profiles, progress, streaks, reflection_completions, achievements, user_achievements` (completo tras E2).

## 6. Blast radius e impacto

- Cambiar `pyodide-worker.ts` afecta `PyodideRunner`, `usePyodideWorker`, `ThresholdLab` — verificar protocolo `requestId` en `public/pyodide-worker.js` siempre.
- Cambiar `lib/content/modules.ts` (`getModules`, `getLessonSlugs`) afecta todas las páginas `learn`, `laboratorios`, `proyectos`, `comunidad`, `dashboard` — ordenar cambia navegación.
- `ConidiaSortGame` — blast radius bajo (sin callers estáticos), pero hardcode previo bloqueaba reuso; fix props lo hace reusable.
- `supabase-migration.sql` — blast radius infra: requiere re-ejecutar en Supabase SQL Editor.

## 7. Complejidad y tests

- `strict_tdd:false`, vitest config existe pero npm `test` no usado en CI; tests reales: `gamification/utils.test.ts`, `labs/quiz-parser.test.ts`, `mdx/rehype-lab-sections.test.ts` + artefacto manual `requestId-descarte.test.mjs` (5 tests race condition ThresholdLab).
- Sin `eslint` (Next 16 removió `next lint`). Gate confiable: `type-check` + `build`.

## 8. MVP — alcance mínimo

**Entra MVP**:
- [x] 41 lecciones navegables + carrusel
- [x] Labs Pyodide ejecutables (numpy siempre, resto lazy) + notebooks descargables
- [x] Progreso XP + racha (isSameDay/isNextDay) + 17 logros + leaderboard (RPCs)
- [x] Auth Clerk + RLS
- [x] Deploy Vercel

**No entra MVP** (post-MVP):
- [ ] Certificación E2B (`/api/certify` stub → integración sandbox)
- [ ] Módulo `etica` (7 lecciones) — logro `etica-en-ia` sin contenido
- [ ] Tests cobertura amplia, lint
- [ ] Offline Pyodide (hoy requiere CDN)

**Riesgo RAM**: Turbopack build OOM en máquinas <2GB — usar `type-check` local, build en Vercel.

**Verificación**: `npx tsc --noEmit` (liviano), `npm run build` solo en CI/Vercel.

---
*Fuente exclusiva: CodeGraph (worker singleton, callees, blast radius, hotspots, clusters) + verificación código. Sin inferencias codebase-memory.*
