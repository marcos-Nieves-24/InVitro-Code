# Estructura del proyecto — InVitro-Code

Plataforma interactiva de aprendizaje (estilo Duolingo) para estudiantes de biotecnología que aprenden IA/ML mediante desafíos de programación.

**Stack**: Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · MDX (`next-mdx-remote/rsc`) · Clerk (auth) · Supabase (datos) · Pyodide (Python en el navegador) · Vercel (deploy).

Todo el contenido orientado al usuario está en **español**.

---

## Árbol de estructura

Se omiten los artefactos generados/efímeros: `node_modules/`, `.next/`, `.git/`, `.codegraph/`, `tsconfig.tsbuildinfo` y `.playwright-mcp/`.

```
InVitro-Code/
├── AGENTS.md                      # Convenciones del repo para agentes/IA
├── LICENSE
├── README.md
├── PROJECT_STRUCTURE.md           # Este archivo
├── package.json / package-lock.json
├── tsconfig.json
├── next.config.ts                 # Allowlist de imágenes (clerk, vercel)
├── next-env.d.ts
├── postcss.config.mjs
├── vitest.config.mts              # Config de Vitest (tests unitarios)
├── opencode.json                  # Config de opencode (MCP, agents)
├── .env.local.example             # Variables de entorno requeridas
├── .gitignore
├── .vercel_trigger_deploy_*       # Triggers de redeploy (no tocar)
├── proxy.ts                       # Middleware de Next: protege rutas (API → 401, páginas → /sign-in)
├── supabase-migration.sql         # Schema SQL aplicado manualmente en Supabase
├── .atl/
│   └── skill-registry.md          # Auto-generado (no editar a mano)
├── openspec/                      # Cambios SDD y specs consolidadas
│   ├── config.yaml                # Convenciones del workflow SDD
│   ├── changes/                   # Un directorio por cambio (proposal/spec/design/tasks/...)
│   └── specs/                     # Specs consolidadas (una por dominio)
├── public/                        # Estáticos servidos tal cual
│   ├── pyodide-worker.js          # Worker real de Pyodide (Web Worker)
│   ├── data/                      # Datos JSON de interactivos
│   │   ├── diagnostic-trainer.json
│   │   ├── perceptron-trainer.json
│   │   └── threshold-lab.json
│   └── interactives/              # Demos HTML estáticas + assets
│       ├── assets/plotly-3.0.0.min.js
│       └── demo_*.html
└── src/
    ├── proxy.ts                   # (alias) Middleware de Next
    ├── __tests__/
    │   └── requestId-descarte.test.mjs   # Artefacto manual (no en npm scripts)
    ├── app/                       # Rutas (App Router)
    │   ├── layout.tsx             # Layout raíz (ClerkProvider, fonts)
    │   ├── globals.css
    │   ├── page.tsx               # Landing
    │   ├── (auth)/
    │   │   └── sign-in/[[...sign-in]]/page.tsx
    │   ├── (dashboard)/           # Área autenticada
    │   │   ├── dashboard/page.tsx
    │   │   ├── niveles/page.tsx
    │   │   ├── logros/page.tsx
    │   │   ├── comunidad/page.tsx
    │   │   ├── proyectos/page.tsx
    │   │   └── laboratorios/
    │   │       ├── page.tsx       # Hub de laboratorios
    │   │       └── [module]/[lesson]/page.tsx
    │   ├── learn/                 # Aprendizaje (lecciones + carrusel)
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── [module]/[slug]/
    │   │       ├── page.tsx       # Compila lesson.md por <Section> (carrusel)
    │   │       ├── error.tsx
    │   │       └── not-found.tsx
    │   └── api/                   # Route handlers
    │       ├── achievements/route.ts
    │       ├── certify/route.ts   # MVP stub: siempre certified:true (punto de integración E2B)
    │       ├── diagnose/route.ts
    │       ├── leaderboard/route.ts
    │       ├── notebook/[module]/[lesson]/route.ts   # Descarga de notebooks
    │       ├── progress/route.ts
    │       ├── progress/reflection/route.ts
    │       └── webhooks/clerk/route.ts
    ├── components/
    │   ├── lesson/                # Componentes MDX de lecciones (registrados en index.ts)
    │   │   ├── index.ts           # Registro de componentes MDX (barrel)
    │   │   └── *.tsx              # section, code-block, trainers, tablas, etc.
    │   ├── labs/                  # Plataforma de laboratorios
    │   │   ├── index.ts
    │   │   └── LabHub, LabRunner, QuizRunner, AssignmentViewer, ...
    │   ├── gamification/          # XP, streaks, logros, progreso de módulo
    │   ├── editor/                # CodeEditor (Monaco), OutputPanel, PyodideRunner
    │   ├── layout/                # AppSidebar, InVitroShell, InVitroTopBar
    │   ├── learn/                 # Sidebar de aprendizaje
    │   ├── ui/                    # Componentes base (Button, Card, Callout, ...)
    │   ├── mdx/                   # InteractivePrompt
    │   └── LessonComponents.tsx
    ├── content/
    │   └── modules/               # Contenido por módulo (ver sección abajo)
    ├── hooks/
    │   └── usePyodideWorker.ts    # Hook React sobre el worker singleton
    └── lib/
        ├── content/modules.ts     # Carga/orden de módulos y lecciones
        ├── gamification/          # achievements, user, utils (con tests)
        ├── labs/quiz-parser.ts    # Parseo de quiz.md (con tests)
        ├── mdx/rehype-lab-sections.ts  # Rehype para secciones de lab (con tests)
        ├── pyodide-worker.ts      # Singleton del worker Pyodide (requestId request/response)
        ├── supabase/admin.ts      # Cliente service-role (createAdminClient)
        └── ui/                    # empty-states, prose
```

### Contenido: `src/content/modules/`

Cada módulo sigue el patrón:

```
modules/<modulo>/
├── module.json                  # name (display) y order (orden de visualización)
├── README.md
├── notebooks/                   # Notebooks de referencia del módulo
├── subunits/                    # (solo machine-learning) subagrupaciones con README
└── lessons/
    └── lessonNN_<slug>/         # Prefijo numérico define el orden (convención)
        ├── lesson.md            # Lección MDX + YAML frontmatter
        ├── quiz.md              # Quiz
        ├── lab.md               # Laboratorio
        ├── assignment.md        # Tarea
        ├── notebook.ipynb       # Notebook Jupyter
        └── references.bib       # Bibliografía
```

| Módulo | Carpeta | Lecciones |
|---|---|---|
| Python para datos | `python` | 17 (`lesson01_installing_python` … `lesson17_plotly`) |
| Introducción a la IA | `ia` | 4 |
| Machine Learning | `machine-learning` | 10 |
| Estadística | `estadistica` | 10 |
> **Nota**: `supabase-migration.sql` siembra un logro `etica-en-ia` (condición `module_completed: etica`), pero el módulo `etica` **no existe todavía** en el filesystem. Se creará cuando se desarrolle ese contenido.

---

## Descripción de las partes clave

### `src/app/` — Rutas
- `learn/[module]/[slug]` es el corazón del aprendizaje: `page.tsx` divide `lesson.md` por bloques `<Section>`, filtra la sección `Resumen`, renumera `number={n}` y compila cada bloque por separado en un carrusel.
- `(dashboard)/` agrupa el área autenticada (dashboard, niveles, logros, comunidad, proyectos, laboratorios).
- `api/` expone los route handlers de progreso, logros, leaderboard, diagnóstico, certificación, descarga de notebooks y webhooks de Clerk.

### `src/components/`
- `lesson/` — componentes MDX usados en el contenido. Para añadir uno hay que exportarlo en `index.ts` **y** mapearlo en el mapa `components` de la página de lección.
- `labs/` — la plataforma de laboratorios: hub, runner, quiz, assignments, tabs, descarga de notebooks, prompts de reflexión.
- `gamification/` — XP, rachas (streaks), logros, badges de nivel y progreso por módulo.
- `editor/` — editor de código (Monaco) + panel de salida + `PyodideRunner`.
- `layout/` — shell de la app (sidebar, top bar).
- `ui/` — componentes base reutilizables.

### `src/lib/` — Lógica de dominio y servicios
- `content/modules.ts` — lectura y orden de módulos/lecciones.
- `pyodide-worker.ts` — **singleton**: un solo worker compartido por sesión, con correlación `requestId` request/response. `PyodideRunner`, `usePyodideWorker` y `ThresholdLab` consumen su `run()`.
- `supabase/admin.ts` — cliente service-role (`SUPABASE_SERVICE_ROLE_KEY`) para mutaciones del lado servidor. Los writes con la anon key están prohibidos.
- `mdx/` y `labs/` — utilidades de transformación MDX y parseo de quiz (con tests unitarios en Vitest).

### `public/`
- `pyodide-worker.js` — el **worker real** de Pyodide (v0.25.0, jsdelivr CDN; numpy precargado, scikit-learn/matplotlib/pandas/scipy bajo demanda, seaborn vía micropip). Debe mantenerse en sincronía con `src/lib/pyodide-worker.ts`. **Los labs requieren red.**
- `interactives/` — demos HTML estáticas (algunas usan Plotly) para contenido de lecciones.

### `openspec/`
- `changes/` — artefactos SDD por cambio (proposal, spec(s), design, tasks, reports). Cada cambio es un directorio.
- `specs/` — specs consolidadas tras archivado.
- Al implementar código nuevo hay que reconciliarlo con los cambios activos ahí.

---

## Convenciones clave

- **Orden de lecciones basado en el sistema de archivos**: las lecciones se ordenan por nombre de directorio (`lessonNN_`), no por frontmatter. Renombrar un directorio reordena el módulo.
- **Componentes MDX registrados**: exportar desde `src/components/lesson/index.ts` + mapear en la página de lección. Las fórmulas usan `remark-math` + `rehype-katex` (`$...$`).
- **Auth**: Clerk es el único proveedor. RLS compara `auth.jwt() ->> 'sub'` contra columnas TEXT `id`/`user_id` (nunca `auth.uid()`). Writes del servidor vía `createAdminClient()`.
- **Schema**: `supabase-migration.sql` se aplica manualmente en el SQL editor de Supabase. Tablas: `profiles`, `progress`, `streaks`, `reflection_completions`.
- **Pyodide**: consumidores pasan por el singleton `src/lib/pyodide-worker.ts`; mantener `public/pyodide-worker.js` y el singleton en sincronía.
- **Gate estático**: `npm run type-check`. `npm run lint` está roto por diseño (Next 16 eliminó `next lint`, sin config ESLint). La verificación real es `npm run build`. No hay test runner en npm scripts (`strict_tdd: false`).
- **Node**: Next 16 exige Node ≥ 20.9; el Node por defecto de la máquina puede ser 18 (`nvm use` antes de instalar/buildear).