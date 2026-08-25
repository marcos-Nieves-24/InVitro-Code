<!--
Generated: 2026-08-25 · Source: codebase-memory (9443 nodes, 36955 edges) · READ-ONLY inference
Regeneration: re-index + get_architecture(all) + index_status
-->
# InVitro-Code — Documentación MVP (codebase-memory)

## 1. Descripción del producto

**InVitro-Code** es una plataforma interactiva de aprendizaje estilo Duolingo para estudiantes de biotecnología que aprenden IA/ML resolviendo desafíos de código en el navegador.

**Propuesta de valor**: El estudiante avanza por lecciones (MDX) → valida con quiz → practica en laboratorios con Python real (Pyodide) → entrega proyectos. Cada acción suma XP, rachas y logros. Todo el contenido orientado al usuario está en **español neutro**; código e identificadores en inglés.

**Usuarios**: Estudiantes de biotecnología sin background profundo en programación que necesitan fundamentos de Python, IA, estadística y ML con contexto biotech.

**Plataforma**: Web, desplegada en Vercel, sin instalación local de Python.

## 2. Stack verificado (codebase-memory)

| Capa | Evidencia graph |
|------|-----------------|
| **Framework** | Next.js 16.2.10 App Router + Turbopack (entry_points: 20, src/app) |
| **Lenguaje** | TypeScript 104 archivos (dominante), HTML 7, JS 2, SQL 1, CSS 1, YAML 1 |
| **Estilos** | Tailwind CSS v4 |
| **Contenido** | `next-mdx-remote/rsc` + remark-math + remark-gfm + rehype-katex |
| **Auth** | Clerk (`@clerk/nextjs/server`) único proveedor |
| **Datos** | `@supabase/supabase-js` (service-role), RLS con `auth.jwt() ->> 'sub'` |
| **Python browser** | Pyodide 0.25.0 vía CDN jsdelivr + Web Worker singleton |
| **Deploy** | Vercel, imágenes allowlist `img.clerk.com`, `vercel.com` |

> **Nodos por paquete** (codebase-memory): `interactives` 4868, `components` 242, `lib` 78, `app` 38 — el peso está en interactivos estáticos (Plotly).

## 3. Arquitectura — capas y boundaries

**Capas inferidas por fan-in/out:**

| Capa | Rol | Fan-in | Fan-out |
|------|-----|--------|---------|
| `lib` | core — cliente Supabase, Pyodide singleton, gamificación, contenido | 71 | 0 |
| `components` | core — lesson, labs, gamification, editor | 25 | 5 |
| `app` | entry — páginas + API routes | 0 | 65→lib, 25→components |
| `hooks` | entry — usePyodideWorker | 0 | 1→lib |
| `__tests__` | aislado | 0 | 0 |

**Boundaries (llamadas cross-capa):**
- `app → lib` 65 llamadas (principal acoplamiento)
- `app → components` 25
- `components → lib` 5

**Entry points (20)** — App Router: landing `/`, `sign-in`, dashboard (dashboard, comunidad, laboratorios, logros, niveles, proyectos), `learn/[module]/[slug]`, 8 API routes.

## 4. Mapa de rutas (filesystem + routes graph)

```
/ (landing)
/sign-in/[[...sign-in]] (Clerk)
learn/[module]/[slug] (carrusel MDX) + error.tsx / not-found.tsx
(dashboard)/ dashboard | comunidad | laboratorios | logros | niveles | proyectos (+ [module]/[lesson])
api/ achievements | certify | diagnose | leaderboard | notebook/[module]/[lesson] | progress | progress/reflection | webhooks/clerk
proxy.ts — clerkMiddleware: públicas `/`, `/sign-in`, `/sign-up`, `/api/webhooks/clerk`, `/api/diagnose`; resto → 401 (API) o redirect /sign-in (páginas)
```

## 5. Pipeline de contenido (MDX)

**Fuente de verdad**: `src/content/modules/{module}/lessons/{lesson}/` — cada lección con `lesson.md` (YAML frontmatter literales: `Lesson Title`, `Lesson Number`, `Module`, `Learning Objectives`, `Estimated Duration`, `Prerequisites`, `Difficulty`), `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb`, `references.bib`.

**Orden**: filesystem `lessonNN_` lexicográfico (no frontmatter). Módulos actuales: `ia` (4), `python` (17), `estadistica` (10), `machine-learning` (10). `module.json` define `name` + `order`.

**Render lección** (`learn/[module]/[slug]/page.tsx`): `readFileSync + gray-matter` → quita H1 → `split(/(?=<Section )/)` → filtra `title="Resumen"` → renumera `number={i+1}` → `compileMDX` por bloque → `LessonCarousel`. Si falla, fallback a `MDXRemote`.

> **Regla MDX**: componente debe exportarse en `src/components/lesson/index.ts` (22 exports) Y mapearse en la página. Math preserva `$...$`.

**Render lab** (`laboratorios/[module]/[lesson]`): `lab.md` + plugin `rehype-lab-sections.ts` (→ LabHeader, LabCallout, ReflectionPrompt), fences `python` → `PyodideRunner`, `bash` → `CodeBlock`.

## 6. Auth y datos

- **Clerk único** — `auth()` en server components/handlers. RLS compara `auth.jwt() ->> 'sub'` con TEXT `id`/`user_id` (nunca `auth.uid()`).
- **Escrituras**: siempre `createAdminClient()` (service-role `SUPABASE_SERVICE_ROLE_KEY`). Anon key nunca para writes.
- **Webhook** `POST /api/webhooks/clerk` (Svix `CLERK_SIGNING_SECRET`) hace upsert en `profiles` ante `user.created`.
- **Esquema** (`supabase-migration.sql`, 6 tablas RLS): `profiles` (id TEXT=Clerk id), `progress` (user_id, module_slug, lesson_slug, completed, xp_earned), `streaks` (current/longest, last_active_date), `reflection_completions` (block_id), `achievements` (catálogo 17 logros), `user_achievements` (unlocks PK compuesta). Funciones `get_leaderboard`, `get_leaderboard_rank`.

## 7. Pyodide — Python en navegador

Worker real `public/pyodide-worker.js` (estático, no bundler) + singleton `src/lib/pyodide-worker.ts` (una instancia/sesión, `requestId` correlation, queue, timeout 120s). Consumidores: `PyodideRunner`, `usePyodideWorker`, `ThresholdLab` → `pyodideWorker.run(code, context)`. Protocolo `{type:"init"|"runPython", requestId}` → `{type:"ready"|"result"|"error", output, figures, requestId}`. Carga: `numpy` siempre; `scikit-learn`/`matplotlib`/`pandas`/`scipy`/`seaborn`/`plotly` bajo demanda (CDN + micropip). **Requiere red**.

## 8. Gamificación

`calcXpForLesson` → upsert `progress` → `isSameDay`/`isNextDay` (racha) → `evaluateAchievements` (condiciones: lessons_completed, total_xp, current_streak, reflections_completed, module_completed) con `ON CONFLICT DO NOTHING`. XP total = `progress` + `reflection_completions`. Componentes: `XPBar`, `LevelBadge`, `StreakBadge`, `ModuleProgress`, `AchievementCard`. Realtime requiere publicación `supabase_realtime` (ahora incluye `achievements`, `user_achievements` tras fix E2).

## 9. Superficie API

| Ruta | Método | Nota |
|------|--------|------|
| `/api/achievements` | GET | evaluateAchievements contra datos reales |
| `/api/certify` | POST | MVP stub — `FEATURE_FLAG_CERTIFY !== "true"` → 503; ON → siempre `certified:true` (punto E2B) |
| `/api/diagnose` | GET | público |
| `/api/leaderboard` | GET | RPCs |
| `/api/notebook/[module]/[lesson]` | GET | sirve ipynb |
| `/api/progress` | POST | upsert + racha + achievements (no fatal) |
| `/api/progress/reflection` | POST | +5 XP, 23505 → isNew:false |
| `/api/webhooks/clerk` | POST | Svix |

## 10. MVP — qué es y qué falta

**MVP definido**: Estudiante puede registrarse (Clerk) → navegar lecciones en carrusel → completar lecciones (XP+racha) → ejecutar labs Python en browser → descargar notebooks → ver logros/leaderboard.

**Funciona hoy**: Auth, contenido filesystem, carrusel MDX, labs Pyodide, progreso/racha/logros (17 logros seed), leaderboard, realtime (profiles/progress/streaks/reflections + achievements).

**Falta/riesgo**: `/api/certify` es stub (E2B pendiente), módulo `etica` referenciado pero no existe (tracker: `etica-en-ia` sin contenido), tests mínimos (`strict_tdd:false`, solo 3 tests utils), `certify` flag OFF por defecto.

**Verify**: `npm run type-check` (gate), `npm run build` (integración real). `npm run lint` roto por diseño Next 16.

---
*Fuente exclusiva: codebase-memory graph (9443 nodos, 36955 edges, 485 archivos, 18 routes) + supabase-migration.sql + package.json. Sin inferencias CodeGraph.*
