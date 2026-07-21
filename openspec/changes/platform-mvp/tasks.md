# Tasks: Platform MVP

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2500-3500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR #1 (scaffold+auth) → PR #2 (lessons+editor) → PR #3 (gamification+dashboard) |
| Delivery strategy | force-chained |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | PR | Focused test | Rollback |
|------|------|----|-------------|----------|
| 1 | Scaffold + Auth + Supabase DB | PR #1 | `npm run build && npm run dev` | Revert Vercel deploy |
| 2 | MDX Reader + Monaco + Pyodide | PR #2 | Abrir lección, correr `print("hola")` | Revert merge |
| 3 | Gamificación + Dashboard | PR #3 | Completar lección, ver XP + streak | Revert merge |

PR #1 base = `main` (feature branch `platform-mvp`)
PR #2 base = rama PR #1
PR #3 base = rama PR #2
Solo `platform-mvp` mergea a main.

---

## PR #1 — Fundación: Scaffold + Auth + Base de datos

### Phase 1: Project Scaffold

- [x] 1.1 Crear proyecto: `npx create-next-app@latest` con App Router, TypeScript strict, Tailwind CSS
- [x] 1.2 Instalar dependencias: `@clerk/nextjs`, `@supabase/supabase-js`, `@supabase/ssr`, `svix`
- [x] 1.3 Configurar `next.config.ts`, `tsconfig.json`, `.env.local.example`, `tailwind.config.ts`, `postcss.config.mjs`
- [x] 1.4 Crear estructura de carpetas: `app/`, `components/`, `lib/supabase/`, `lib/pyodide/`, `lib/gamification/`, `content/modules/example`
- [x] 1.5 Crear `middleware.ts` con Clerk auth para proteger `/learn/*` y `/dashboard`
- [x] 1.6 Crear `app/layout.tsx` raíz con ClerkProvider, Inter font, metadata

### Phase 2: Auth (Clerk + Supabase)

- [x] 2.1 Instalar Clerk SDK + Supabase SDK + Svix en package.json
- [x] 2.2 Crear `app/(auth)/sign-in/[[...sign-in]]/page.tsx` con `<SignIn />` de Clerk
- [x] 2.3 Configurar middleware.ts para proteger `/learn/*`, `/dashboard`, públicas `/sign-in`, `/api/webhooks`
- [x] 2.4 Crear `supabase-migration.sql` con tabla `profiles` + RLS policies
- [x] 2.5 Crear `lib/supabase/client.ts` (browser) y `lib/supabase/admin.ts` (service role)
- [x] 2.6 Crear `app/api/webhooks/clerk/route.ts` — webhook `user.created` -> upsert profiles en Supabase
- [x] 2.7 Configurar Clerk JWT template (pendiente manual: Clerk dashboard → Sessions → Templates → Supabase)
- [x] 2.8 RLS policies incluidas en `supabase-migration.sql`

---

## PR #2 — Core educativo: Lecciones + Editor + Pyodide

### Phase 3: MDX Lesson Reader

- [x] 3.1 Instalar `next-mdx-remote` y `react-syntax-highlighter`
- [x] 3.2 Crear `content/modules/example/hola-mundo.mdx` — lección "Hola Mundo" con texto, código Python, y componente `<CodeEditor />`
- [x] 3.3 Crear `app/learn/layout.tsx` con navegación lateral (sidebar de lecciones)
- [x] 3.4 Crear `app/learn/[module]/[slug]/page.tsx` — server component que lee MDX con `next-mdx-remote/rsc`, renderiza contenido
- [x] 3.5 Implementar página `not-found.tsx` para `/learn/[module]/[slug]` cuando no existe el MDX
- [x] 3.6 Sidebar con módulos/lecciones listados desde `content/modules/` (progreso se agrega en PR #3)

### Phase 4: Code Editor (Monaco + Pyodide)

- [x] 4.1 Instalar `@monaco-editor/react` y crear `components/editor/CodeEditor.tsx` con configuración Python
- [x] 4.2 Crear `public/pyodide-worker.js` — Web Worker con `importScripts()` para Pyodide CDN, compatible con browser
- [x] 4.3 Crear `components/editor/PyodideRunner.tsx` — maneja ciclo de vida del Worker, lazy-loading, integra editor
- [x] 4.4 Crear `components/editor/OutputPanel.tsx` — captura stdout/stderr del Worker, los muestra formateados
- [x] 4.5 Botón "Run" conecta Monaco → Worker → OutputPanel

### Phase 5: Exercise Validation

- [x] 5.1 Validación client-side: PyodideRunner compara output con test cases esperados
- [x] 5.2 Feedback visual: check verde o cruz roja en OutputPanel según validación
- [x] 5.3 Botón "⭐ Estoy listo" en OutputPanel (aparece tras validación exitosa) + POST /api/certify con stub E2B

---

## PR #3 — Gamificación + Dashboard

### Phase 6: Progress Tracking + Gamification

- [x] 6.1 Tabla Supabase `progress` con RLS (merged en migration.sql)
- [x] 6.2 Tabla Supabase `streaks` con RLS (merged en migration.sql)
- [x] 6.3 API `POST /api/progress` — upsert progreso, actualiza streaks, devuelve XP
- [x] 6.4 `lib/gamification/utils.ts` — calcXpForLesson(), calcLevel(), timestamps
- [x] 6.5 `components/gamification/XPBar.tsx`
- [x] 6.6 `components/gamification/StreakBadge.tsx`
- [x] 6.7 `components/gamification/LevelBadge.tsx`
- [x] 6.8 `components/gamification/ModuleProgress.tsx`

### Phase 7: Dashboard + Landing

- [x] 7.1 Dashboard actualizado con LevelBadge, StreakBadge, XPBar, ModuleProgress
- [x] 7.2 Landing verificado — auth-aware redirect funciona
- [x] 7.3 Layout verificado — ClerkProvider presente
- [x] Botón "Marcar como Completado" en lecciones conectado a POST /api/progress
