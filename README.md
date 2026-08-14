# InVitro-Code

Plataforma interactiva de aprendizaje (estilo Duolingo) para estudiantes de biotecnología que quieren aprender IA/ML mediante desafíos de programación.

**Stack**: Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · MDX (`next-mdx-remote/rsc`) · Clerk (auth) · Supabase (datos) · Pyodide (Python en el navegador) · Vercel (deploy)

Todo el contenido orientado al usuario está en **español**.

---

## Requisitos

- **Node ≥ 20.9** (Next 16 lo exige). El Node por defecto de la máquina puede ser 18 — usar una versión nueva: `nvm use 22` antes de `npm install`/dev/build.
- Claves de Clerk y Supabase (ver `.env.local.example`).

## Comandos

```bash
npm install        # instalar dependencias (con Node ≥ 20.9)
npm run dev        # servidor de desarrollo
npm run build      # build de producción (ver nota abajo)
npm run start      # servir el build
npm run type-check # gate estático confiable
```

> **Nota sobre `npm run lint`**: está roto por diseño (Next 16 eliminó el CLI `next lint` y el repo no tiene config de ESLint). No agregar una a menos que se pida. El gate estático es `npm run type-check`; la verificación real es `npm run build` (que Vercel corre en cada push).
>
> **Nota sobre `npm run build` local**: en máquinas con poca RAM el build de Turbopack puede morir por OOM (Killed). El deploy de Vercel corre el build en producción; localmente alcanza con `npm run type-check` + el dev server.

No hay test runner configurado (`strict_tdd: false`). `src/__tests__/requestId-descarte.test.mjs` es un artefacto manual.

## Configuración (env)

Ver `.env.local.example`:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_SIGNING_SECRET` | Auth Clerk |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase |
| `FEATURE_FLAG_CERTIFY` | Certificación E2B (default `false`; con `false` el endpoint rechaza 503 y la UI oculta el botón) |

---

## Arquitectura

**Content-driven**: los módulos viven en `src/content/modules/{module}/`, cada lección en `lessons/lessonNN_.../`:

```
src/content/modules/
  ia/lessons/lesson01_what_is_ai/
    lesson.md      # lección MDX (slides del carrusel)
    quiz.md        # cuestionario (parser tolerant, client-side)
    lab.md         # laboratorio (code blocks ejecutables con Pyodide)
    assignment.md  # proyecto/entrega con rúbrica
    notebook.ipynb # notebook descargable
    references.bib # referencias
    slides.md      # opcional (no se usa en runtime)
  module.json      # name + order del módulo
```

- **Orden de lecciones**: por nombre de directorio (`lessonNN_`), NO por frontmatter.
- **Lección (carrusel)**: `src/app/learn/[module]/[slug]/page.tsx` divide `lesson.md` en bloques `<Section>`, filtra el `Resumen`, renumera y compila cada bloque. Las claves de frontmatter se leen literales (`Lesson Title`, `Lesson Number`, etc.).
- **Laboratorio (tabs)**: `/laboratorios/[module]/[lesson]` compila `lab.md`/`assignment.md` con un plugin rehype (`src/lib/mdx/rehype-lab-sections.ts`) que estiliza por convención (bilingüe EN/ES): `# Lab:` → `LabHeader`; `## Objetivo/Duración/Dataset/Entregables` → `LabCallout`; `**Preguntas para reflexionar:**` → `ReflectionPrompt`. Los fences `python` se vuelven editores PyodideRunner ejecutables; los `bash` usan el `CodeBlock` terminal animado.
- **MDX**: los componentes custom deben exportarse desde `src/components/lesson/index.ts` y registrarse en el mapa `components` de la página correspondiente. Math: `remark-math` + `rehype-katex` (preservar `$...$`).
- **Alias**: `@/*` → `src/*`.

### Auth y datos (Clerk + Supabase)

- **Clerk es el ÚNICO proveedor de auth.** Supabase Auth NO se usa. RLS compara `auth.jwt() ->> 'sub'` contra columnas TEXT `id`/`user_id` — nunca `auth.uid()`.
- Escrituras del lado servidor usan el cliente service-role `createAdminClient()` (`src/lib/supabase/admin.ts`) con `SUPABASE_SERVICE_ROLE_KEY`.
- `src/proxy.ts` es el middleware; las rutas públicas se agregan ahí (API → 401, páginas → redirect a `/sign-in`).
- El schema se aplica manualmente vía `supabase-migration.sql` en el SQL editor de Supabase. Tablas: `profiles`, `progress`, `streaks`, `reflection_completions` (+ `achievements`, `user_achievements`). Los widgets de gamificación usan `supabase_realtime` — las tablas nuevas de widgets realtime deben agregarse a la publicación.

### Python en el navegador (Pyodide)

- El worker REAL es `public/pyodide-worker.js` (estático). `src/lib/pyodide/worker.ts` es un stub.
- Pyodide v0.25.0 desde jsdelivr CDN; los labs requieren red.
- Dos consumidores con protocolos distintos (mismos worker): `src/components/editor/PyodideRunner.tsx` (`init`/`runPython`, `ready`/`result`) y `src/lib/pyodide-worker.ts` (correlación `requestId`). Mantenerlos en sync.
- `/api/certify` es un stub MVP (siempre `certified: true` con el flag ON); el punto de integración E2B está marcado en el archivo.

## Workflow de contenido (openspec / SDD)

- `openspec/` guarda los cambios SDD (proposal/spec/design/tasks). `openspec/config.yaml` codifica las convenciones: contenido en español, keywords RFC 2119 en specs, patrones de componentes MDX en design. Los cambios completados se archivan con `archive-report.md` y sus specs delta se copian a `openspec/specs/<capability>/`.
- Los cambios de contenido de laboratorio deben reconciliarse con `openspec/changes/`.
- Commits: conventional commits (`feat(scope):`, `fix(db):`, ...) — sin líneas de atribución de IA.

## Datos útiles

- `next.config.ts` allowlist de imágenes: `img.clerk.com`, `vercel.com`.
- `.vercel_trigger_deploy_*` son disparadores de redeploy — no tocarlos.
- `.atl/skill-registry.md` es auto-generado por `gentle-ai skill-registry refresh` — no editarlo a mano (el `.atl/.skill-registry.cache.json` está gitignored).
