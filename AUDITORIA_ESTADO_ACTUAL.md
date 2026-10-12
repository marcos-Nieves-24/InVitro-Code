# Auditoría de Estado Actual — InVitro-Code

> **Qué es:** inventario técnico y funcional verificado del repositorio `invitro-code` en el worktree `presentation-reemplazo-directo`, al **2026-10-11**.
> **Para quién:** el responsable del proyecto y quien revise las auditorías hermanas.
> **Por qué importa:** las demás auditorías (UX/UI, funcional, sostenibilidad, legal) asumen hechos sobre el sistema. Este documento fija esos hechos con `archivo:línea` para que ninguna conclusión posterior se apoye en datos inventados o desactualizados.
>
> **Reglas aplicadas:** (1) HECHOS separados de NO_AUDITADO; (2) toda afirmación cita `archivo:línea`; (3) cuando el enunciado del encargo no coincide con lo verificado, se reporta lo verificado y se marca la discrepancia. **No** se cita `AUDITORIA_SEGURIDAD.md` (se escribía en paralelo y no existe al momento de esta auditoría): los ítems de seguridad se verificaron por lectura y `grep` propios.
>
> **Restricciones cumplidas:** sin tocar git, sin commits, sin `npm install`, sin dev server, sin acceso a paneles de proveedores.

---

## Resumen ejecutivo (leer esto primero)

El proyecto es una **plataforma educativa real y funcional**, no un prototipo: 41 lecciones con lab, notebook, quiz y bibliografía verificables en disco; autenticación, progreso, gamificación, bookmarks y perfil conectados a Supabase real vía service-role; 43 rutas compiladas. La base de código está sana — `type-check`, 187 tests y `build` pasan sin errores en la máquina del auditor.

La deuda principal **no es técnica, es documental y de contenido**:

1. La documentación declara **6 archivos / 37 tests** cuando la realidad medida hoy es **19 archivos / 187 tests** (`openspec/config.yaml:14`, `README.md:24,33`, `AGENTS.md:10`).
2. **El 90% del contenido educativo no tiene capa de presentación**: solo 4 de 41 lecciones (el módulo `ia` completo) usan los componentes de presentación.
3. **2 referencias a interactivos rojas y 6 de 7 archivos huérfanos** en `public/interactives/`: enlaces que fallan en silencio dentro de lecciones publicadas.
4. **`DESIGN.md` cita dos componentes que no existen** y contradice al middleware sobre si `/learn` es público.

**Discrepancias con el enunciado del encargo, verificadas:** el encargo indicaba "16 rutas API" y "30 rutas de build". Lo verificado es **15 rutas API** y **43 rutas de build** (11 estáticas ○ / 32 dinámicas ƒ). El "(30/30)" del log de build cuenta pasos de generación de páginas estáticas, no rutas.

---

## Quick path

1. ¿Existe el producto? → §3, §6.1 (contenido, auth, progreso reales).
2. ¿Qué stack corre de verdad? → §2 (todo contra `package.json`).
3. ¿El repo está sano? → §5 (los tres comandos ejecutados hoy).
4. ¿Qué está roto o ausente? → §6.2, §6.3, §7.
5. ¿Qué falta para decidir? → §9 (tabla final) + §10 (NO_AUDITADO).

---

## 1. Identidad del proyecto

| Campo | Valor | Evidencia |
|-------|-------|-----------|
| Qué es | Plataforma interactiva de aprendizaje (estilo Duolingo) para que estudiantes de biotecnología aprendan IA/ML mediante desafíos de programación | `README.md:3`; `openspec/config.yaml:10-11` |
| Para quién | Estudiantes de biotecnología. Público **+18**, B2C, **100% gratuito** (sin pagos ni suscripciones) | `README.md:3`; `legal/project-classification.md:14-15,28-30` |
| Idioma | **Español** en todo el contenido de usuario final | `README.md:7`; `src/app/layout.tsx:39` (`lang="es"`); `openspec/config.yaml:6` (`language: spanish`) |
| País de operación | **Colombia** (Corregimiento Altavista, Medellín) | `legal/project-classification.md:10`; `src/app/(legal)/aviso/page.tsx:66` |
| Alcance | LATAM con ancla Colombia | `legal/project-classification.md:13` |
| Responsable / Titular | Persona natural — **NIT 700329113-7** | `legal/project-classification.md:9`; `src/app/(legal)/aviso/page.tsx:34,65` |
| Contacto / canal de derechos | **invitro.code@gmail.com** | `legal/project-classification.md:11`; `src/app/(legal)/privacidad/page.tsx:62` |
| Modelo | Gratuito, sin monetización | `legal/project-classification.md:14` (grep vacío de pasarelas de pago) |

> El NIT y el correo se leyeron primero en `legal/project-classification.md` (fuente del encargo) **y** se corroboraron en las páginas legales publicadas antes de citarlos aquí. No son datos asumidos.

---

## 2. Stack REAL verificada (contra `package.json`)

La columna "Previsto" refleja lo que afirma la documentación del repo; "Verificado" es lo que reside en el árbol.

| Componente | Previsto | Verificado en código | Evidencia |
|---|---|---|---|
| Next.js | 16 App Router + Turbopack | **16.2.10** (pin exacto) | `package.json:30`; build: `▲ Next.js 16.2.10 (Turbopack)` |
| React / React DOM | 19 | **19.2.7** ambos | `package.json:34-35` |
| TypeScript | — | **6.0.3** | `package.json:57` |
| Tailwind | v4 | **4.3.3** + `@tailwindcss/postcss` 4.3.3 | `package.json:48,56`; `src/app/globals.css:1` (`@import "tailwindcss"`) |
| Auth | Clerk único | **`@clerk/nextjs` 7.5.20** | `package.json:19` |
| Auth Supabase | "no se usa" | **Confirmado: no se usa.** Cero referencias a Supabase Auth en `src/`; RLS compara `auth.jwt() ->> 'sub'` | `grep vacío: supabase.auth en src/`; `supabase-migration.sql:5-7` |
| Base de datos | Supabase | **`@supabase/supabase-js` 2.110.7**, cliente service-role | `package.json:24`; `src/lib/supabase/admin.ts:14-17` |
| MDX | next-mdx-remote | **^6.0.0**, usar `next-mdx-remote/rsc` (`compileMDX`) | `package.json:31`; `src/app/learn/[module]/[slug]/page.tsx:3` |
| Pyodide | 0.25.0 | **0.25.0** — **no está en `package.json`**: se carga por `importScripts` desde CDN | `public/pyodide-worker.js:4-5` |
| Plotly | sí | **plotly.js ^4.1.1**, `plotly.js-dist-min ^3.7.0`, `react-plotly.js ^4.0.0` | `package.json:32-33,37` |
| Monaco | sí | **`@monaco-editor/react` ^4.7.0**, usado en un componente | `package.json:20`; `src/components/editor/CodeEditor.tsx` |
| Webhooks | — | **svix 1.98.0** (firma de eventos Clerk) | `package.json:43`; `src/app/api/webhooks/clerk/route.ts` |
| Validación | — | **zod ^4.6.5** | `package.json:45` |
| Tests | Vitest | **^4.1.10** + `@vitest/coverage-v8` | `package.json:53,58` |
| Lint | "roto por diseño" | **Confirmado: no existe script ni config ESLint** (`grep "lint" package.json` → 0 resultados) | `package.json:5-17` |

**Dependencias de runtime adicionales observadas:** `gsap`, `motion ^13.4.3`, `@rive-app/canvas`, `lucide-react`, `recharts ^3.10.1`, `rehype-katex`, `remark-math`, `remark-gfm` (`package.json:27-41`). No hay dependencia declarada para Pyodide: el worker es un archivo estático servido desde `public/`.

---

## 3. Arquitectura y capas

### 3.1 Dirección de dependencias (respeta el mapa declarado)

```
domain (src/domain/*)          ← tipos y lógica pura
   ↑
application (src/application/) ← puertos + caso de uso
   ↑
infraestructura (src/lib/*)    ← adaptadores Supabase / Pyodide / rate-limit
   ↑
presentation (src/app/*, src/components/*)
```

| Capa | Evidencia verificada |
|---|---|
| `domain` | `src/domain/bookmark.ts`, `consent.ts`, `dailyGoal.ts`, `lesson-card.ts`, `module-card.ts`, `slide.ts`, `streak.ts` — **lógica pura con tests** (`*.test.ts` junto a cada uno) |
| `application` | `src/application/ports/ConsentRepository.ts`, `StreakRepository.ts`; `src/application/use-cases/completeConsent.ts` |
| `infraestructura` | `src/lib/supabase/` (adapters sobre `createAdminClient`), `src/lib/pyodide-worker.ts`, `src/lib/rate-limit.ts`, `src/lib/env.ts` |
| `presentation` | `src/app/**` (páginas y 15 Route Handlers), `src/components/**` (18 carpetas de UI) |
| `content` | `src/content/modules/{modulo}/lessons/{lesson}/` |

**Conclusión:** la separación no es solo documental. `createAdminClient` se importa exclusivamente desde servidor (`src/app/api/**`, `src/lib/supabase/*`, `src/application/use-cases/completeConsent.ts:7`) y el archivo tiene guardia en cliente (`src/lib/supabase/admin.ts:11-13`).

### 3.2 Middleware (`src/middleware.ts`, 115 líneas)

- `clerkMiddleware` único punto de entrada de auth (`src/middleware.ts:1,25`).
- **Lista de rutas públicas** (`src/middleware.ts:5-19`): `/`, `/sign-in`, `/sign-up`, `/sso-callback`, `/api/webhooks/clerk`, `/api/diagnose`, `/api/cron/purge-pending`, `/aviso`, `/privacidad`, `/cookies`, `/terminos`, `/ia`, `/preview/cards`.
- Política de negado: **páginas → redirect a `/sign-in`** con `redirect_url` (`:55-57`); **`/api/*` → 401 JSON** (`:49-54`).
- RBAC de admin: rol cacheado en el JWT de Clerk, fallback a consulta `profiles.role` con service-role (`:65-101`).
- ⚠ **Advertencia del build:** `The "middleware" file convention is deprecated. Please use "proxy" instead` — Next 16 renombra la convención. No rompe nada hoy, pero es deuda de migración.

### 3.3 API — 15 rutas (no 16)

| Ruta | Propósito |
|---|---|
| `/api/account` | Gestión de cuenta |
| `/api/bookmarks` | Marcadores |
| `/api/certify` | Certificación (stub tras flag — ver §6.2) |
| `/api/consent` | Consentimiento |
| `/api/cron/daily-nudge`, `/api/cron/purge-pending`, `/api/cron/recharge-freezes` | Tres tareas programadas |
| `/api/diagnose` | Diagnóstico de contenido MDX (pública) |
| `/api/lab-progress` | Progreso de laboratorios |
| `/api/notebook/[module]/[lesson]`, `/api/rscript/[module]/[lesson]` | Lectura de notebooks/scripts con saneamiento de path |
| `/api/profile/avatar`, `/api/profile/daily-goal` | Perfil |
| `/api/progress` | Progreso de lecciones |
| `/api/webhooks/clerk` | Sincronización Clerk → `profiles` |

### 3.4 Worker Pyodide (singleton compartido)

- Archivo real: `public/pyodide-worker.js` (340 líneas) — `PYODIDE_VERSION = "0.25.0"`, CDN `cdn.jsdelivr.net` (`:4-5`), `numpy` precargado (`:33`), `scikit-learn`/`matplotlib`/`pandas`/`scipy` bajo demanda (`:52-58`), `seaborn` vía `micropip` desde PyPI.
- Cliente: `src/lib/pyodide-worker.ts` (205 líneas) — **una sola instancia por sesión** (`pyodideWorker`, `:164`), correlación por `requestId` (`:68-73`).
- **Consecuencia operativa verificada:** los labs requieren red. Sin internet, fallan. Ver `AUDITORIA_SOSTENIBILIDAD.md` §2 para el análisis de criticidad.

### 3.5 Mapa de rutas del build (43 rutas — 11 estáticas ○, 32 dinámicas ƒ)

Salida literal de `npm run build` de hoy.

| Tipo | Rutas |
|---|---|
| **○ Estáticas (11)** | `/`, `/_not-found`, `/aviso`, `/cookies`, `/ia`, `/learn`, `/preview/bioreactor`, `/preview/cards`, `/privacidad`, `/sso-callback`, `/terminos` |
| **ƒ Páginas dinámicas (17)** | `/admin`, `/bookmarks`, `/comunidad`, `/configuracion`, `/dashboard`, `/laboratorios`, `/laboratorios/[module]`, `/laboratorios/[module]/[lesson]`, `/learn/[module]/[slug]`, `/logros`, `/niveles`, `/perfil`, `/proyectos`, `/proyectos/[module]`, `/proyectos/[module]/[lesson]`, `/sign-in/[[...sign-in]]`, `/sign-up/[[...sign-up]]` |
| **ƒ API (15)** | Las 15 de §3.3 |

**Hallazgo ID-ARQ-01:** el enunciado del encargo y `AUDITORIA_FUNCIONAL.md` declaran "30 rutas". El build lista **43**. El "(30/30)" del log cuenta pasos de prerender, no rutas. Quien planifique por cantidad de rutas debe usar 43.

---

## 4. Estado git verificado hoy (2026-10-11)

| Hecho | Evidencia |
|---|---|
| Worktree | `/home/biohacker24/proyectos/invitro-code-worktrees/presentation-reemplazo-directo` — **HEAD desacoplado en `ff0af93`** ("docs(odd): auditoria UX de Expediciones y plan de slices/migracion") | `git worktree list` |
| Worktree principal | `/home/biohacker24/proyectos/invitro-code` en `cef461a` `[feat/presentation-reemplazo-directo]` | `git worktree list` |
| PR **#70** abierto, rama `feat/presentation-reemplazo-directo` — **MERGEABLE**, checks Graphify + Vercel **SUCCESS** | `gh pr view 70 --json mergeable,statusCheckRollup` |
| PR **#69** abierto, rama `fix/hero-cientifico-cut` — **MERGEABLE** | `gh pr view 69` |
| PR **#68** abierto, rama `chore/cards-higiene` — **MERGEABLE** | `gh pr view 68` |
| Rama `odd/lab-heroes-restore` **pusheada sin PR** (`origin/odd/lab-heroes-restore` @ `b42eda5`) | `git log origin/odd/lab-heroes-restore`; `gh pr list --head odd/lab-heroes-restore` → vacío |
| Commit **`88a038b`** ("feat(lesson): OverfittingPlayer y controles reales de animacion") **solo local, sin push**: no está en ningún remote. La rama local `feat/presentation-reemplazo-directo` va **14 commits por delante** de `origin/` (0 por detrás) | `git branch -r --contains 88a038b` → vacío; `git rev-list --left-right --count origin/feat/… --feat/…` → `0 14` |
| `ff0af93` **sí está pusheado** (contenido en `origin/feat/presentation-reemplazo-directo`) | `git merge-base --is-ancestor ff0af93 origin/feat/presentation-reemplazo-directo` |

**Lectura:** hay trabajo entregable sin revisión en dos direcciones — `88a038b` y los 13 commits que lo acompañan viven solo en la máquina del mantenedor, y `odd/lab-heroes-restore` está en remoto sin PR que lo exponga a revisión. Los tres PRs abiertos están verdes.

---

## 5. Verificaciones ejecutadas HOY (2026-10-11)

| Comando | Resultado | Detalle |
|---|---|---|
| `node -v` | **v22.23.2** | por encima del mínimo `≥20.9` exigido por Next 16 (`README.md:19`) |
| `npm run type-check` | **OK — sin errores** | `tsc --noEmit`, exit 0 |
| `npm run test` | **19 archivos / 187 tests, todos PASS** | Vitest 4.1.10, `environment: node`, exit 0. Los 19 archivos son 18 `.test.ts` + 1 `.test.tsx` |
| `npm run build` | **OK — exit 0** | 43 rutas (11 ○ / 32 ƒ), 15 API. Compilado en 15.7s, TypeScript en 10.9s |

**Advertencia emitida por el build (no bloqueante):** convención `middleware` deprecada a favor de `proxy`.

### 5.1 Deuda de conteo de tests — verificada, no especulada

| Dónde se afirma | Qué afirma | Realidad medida hoy |
|---|---|---|
| `openspec/config.yaml:14` | "6 unit test files / 37 tests" | **19 / 187** |
| `openspec/config.yaml:66-67` | idem | **19 / 187** |
| `README.md:24` | "6 archivos, 37 tests" | **19 / 187** |
| `README.md:33` | "6 archivos / 37 tests" | **19 / 187** |
| `AGENTS.md:10` | "6 files / 37 tests" | **19 / 187** |

**Hallazgo DOC-TEST-01**
- **Categoría:** doc-drift | **Estado:** VERIFICADO
- **Descripción:** 5 lugares en 3 archivos declaran 6 archivos/37 tests; la medición de hoy es 19 archivos/187 tests.
- **Evidencia:** `openspec/config.yaml:14,66-67`; `README.md:24,33`; `AGENTS.md:10`. Medida: salida de `npm run test` del día (`Test Files 19 passed (19)`, `Tests 187 passed (187)`).
- **Impacto:** decisiones de cobertura tomadas sobre datos falsos; un reviewer subestima lo que la suite protege.
- **Prioridad:** P2
- **Solución:** actualizar los 5 lugares a "19 archivos / 187 tests".
- **Archivos:** `openspec/config.yaml`, `README.md`, `AGENTS.md`
- **Criterio de aceptación:** los 5 lugares citan 19/187 y coinciden con `npm run test`.

**Hallazgo DOC-TEST-02**
- **Categoría:** doc-drift / falsedad verificable | **Estado:** VERIFICADO
- **Descripción:** `README.md:33` y `AGENTS.md:10` afirman que `src/__tests__/requestId-descarte.test.mjs` "es un test de Vitest real… incluido en el `include` del config". **No corre**: el glob solo cubre `.ts`/`.tsx`.
- **Evidencia:** `vitest.config.mts:5-6` → `include: ["src/**/*.test.ts", "src/**/*.test.tsx"]`. El archivo existe (`src/__tests__/requestId-descarte.test.mjs`) pero ningún runner lo ejecuta; la cuenta de 19 archivos cuadra sin él.
- **Impacto:** un test de condición de carrera (lógica de `requestId` del worker Pyodide) está documentado como activo y no protege nada.
- **Prioridad:** P2
- **Solución:** añadir `src/**/*.test.mjs` al `include` (y verificar que pasa) **o** borrar el archivo y quitar la afirmación. Ambas son válidas;documentar cuál se eligió.
- **Archivos:** `vitest.config.mts`, `README.md`, `AGENTS.md`
- **Criterio de aceptación:** `vitest run` reporta el archivo en su lista **o** el archivo y su mención en docs desaparecen.

---

## 6. Funcionalidades: existentes vs simuladas vs ausentes

### 6.1 EXISTENTES (verificadas en código y contenido)

| Funcionalidad | Estado | Evidencia |
|---|---|---|
| Auth Clerk completa | ✅ | `src/middleware.ts:1,25`; `src/app/layout.tsx:37`; webhook svix → `profiles` (`src/app/api/webhooks/clerk/route.ts`) |
| Progreso de lecciones con datos Supabase reales | ✅ | `src/app/api/progress/route.ts` |
| Progreso de labs | ✅ | `src/app/api/lab-progress/route.ts` |
| Bookmarks | ✅ | `src/app/api/bookmarks/route.ts`, `src/components/lesson/BookmarkButton.tsx` |
| Perfil + avatar (única subida de archivos) | ✅ | `src/app/api/profile/avatar/route.ts:11,27,39-41` |
| Consentimiento art. 9 persistido | ✅ | `src/app/api/consent/route.ts`; `src/lib/supabase/consent.ts` (3 usos de service-role) |
| Gamificación server-rendered | ✅ | `src/app/(dashboard)/dashboard/page.tsx` es `async` sin `"use client"`; lógica en `src/lib/gamification/{streak,achievements,activity,user}.ts` |
| Contenido: **4 módulos / 41 lecciones** | ✅ | `ls src/content/modules/` → `estadistica`(10), `ia`(4), `machine-learning`(10), `python`(17) |
| Frontmatter completo | ✅ | **41/41** `lesson.md` con `Lesson Title:` (`grep -rl "^Lesson Title:" | wc -l` = 41) |
| Labs reales | ✅ | 41 `lab.md` + 41 `*.ipynb` (python 17, machine-learning 10, estadistica 10, ia 4) |
| Quizzes y tareas | ✅ | 41 `quiz.md`, 41 `assignment.md` |
| Bibliografía | ✅ | 41 `references.bib` |
| Página de lección (carrusel + capa de presentación) | ⚠ parcial | `src/app/learn/[module]/[slug]/page.tsx:188-195` — parte por `<Section`, filtra `Resumen`, renumera `number={n}`. Los componentes de presentación existen en `src/components/lesson/presentation/` y están mapeados en `src/components/lesson/index.ts:22-26` |

**Nota sobre la capa de presentación (corrige el enunciado del encargo):** el encargo decía "solo ia/lesson01 completo, 37 lecciones sin animaciones". Lo verificado: **4 lecciones usan componentes de presentación** — todo el módulo `ia`:
- `<RevealSequence>`: `ia/lesson01..04` (4)
- `<ChoiceQuestion>`: `ia/lesson01..04` (4)
- `<DialogueBox>`: **solo `ia/lesson01_what_is_ai`**
- `<FeatureButtonList>`: **solo `ia/lesson01_what_is_ai`**
- Las 4 lecciones restantes de `ia` ya tienen presentación parcial, y **37 lecciones (python, machine-learning, estadística) no usan ninguno** de estos componentes.
- Los `*Player` de animación exportados (`BrainVsChipPlayer`, `MatrixPlayer`, `ConidiaToVectorPlayer`, `FeatureSpace2DPlayer` en `src/components/lesson/index.ts:27-30`) tienen **0 usos en contenido**: `grep vacío: patrón <BrainVsChipPlayer|<MatrixPlayer|… en src/content/`.
- `slides.md`: **0 archivos** en todo `src/content/`.

### 6.2 SIMULADAS (existen pero no hacen lo que aparentan)

| Funcionalidad | Qué hace realmente | Evidencia |
|---|---|---|
| `/api/certify` | **Stub.** Con `FEATURE_FLAG_CERTIFY !== "true"` (default) responde **503** y nunca `certified: true`. Solo con flag ON devuelve `certified: true` hardcodeado — sin ejecutar nada | `src/app/api/certify/route.ts:22-25` (503), `:50-56` ("For MVP, always pass… E2B se integrará en próxima versión"). Default OFF: `.env.local.example` (`FEATURE_FLAG_CERTIFY=false`) |
| `/preview/cards` | Preview público **sin auth** de cards reales con **progreso mock** (primer módulo 60%, resto 0) | `src/app/preview/cards/page.tsx:3` ("progreso mock"), `:19` ("Progreso mock (primer módulo 60%, resto 0)") |
| `/preview/bioreactor` | Demo con **datos hardcodeados** y contador que auto-incrementa en un `setInterval` | `src/app/preview/bioreactor/page.tsx:7-9,18-22` (`exp`/`level`/`rank` literales; `setInterval` de 900ms) |

**Nota:** la ruta `/preview/cards` está en `publicRoutes` (`src/middleware.ts:18`) y el PR #68 abierto se titula "remove preview/cards" — la eliminación ya está decidida pero aún no mergeada.

### 6.3 AUSENTES (verificado por ausencia)

| Capacidad | Estado | Evidencia |
|---|---|---|
| Tests e2e / integración | ❌ | Sin `playwright`/`cypress`/`puppeteer` en `package.json`; `openspec/config.yaml` marca `integration: available: false`, `e2e: available: false` |
| Lint | ❌ | Sin script `lint` ni config ESLint (`package.json:5-17`) |
| Analytics | ❌ | `grep vacío: patrón gtag|GTM|GA4|clarity|hotjar|segment|mixpanel|amplitude en src/` y `.env.local.example:1-15` sin IDs |
| Backups de código/DB | ❌ BLOQUEADO | Sin workflows CI (`.github/workflows/` no existe), sin `pg_dump`/cron de backup en `package.json`/`vercel.json`/`docker-compose.monitoring.yml`. **BLOQUEADO:** los backups reales de Supabase/Vercel solo se verifican con acceso a panel — no se afirma que no existan, se afirma que no hay evidencia en el repo |
| RNBD (Registro Nacional de Bases de Datos) | ❌ | Ver §8 — `NO_CUMPLE` en `MATRIZ_CUMPLIMIENTO_LEGAL.md` |
| Failover / multi-proveedor | ❌ BLOQUEADO | Un solo proveedor por capacidad (Clerk, Supabase, Vercel). Análisis de criticidad en `AUDITORIA_SOSTENIBILIDAD.md` §1.2 |

---

## 7. Deuda de documentación (verificada)

### 7.1 `DESIGN.md` cita componentes inexistentes

- `DESIGN.md:180` documenta `PageShell` → `src/components/ui/PageShell.tsx`
- `DESIGN.md:185` documenta `SiteHeader` → `src/components/ui/SiteHeader.tsx`

**Verificado:** `grep vacío: PageShell en src/` y `grep vacío: SiteHeader en src/`. Ninguno de los dos archivos existe. Quien implemente una página nueva siguiendo `DESIGN.md` escribirá imports que no compilan. (Analizado en profundidad en `AUDITORIA_UX_UI.md` §4.)

### 7.2 `public/interactives/`: huérfanos y enlaces rojos

**Estado del directorio** (7 HTML + 1 JS en `assets/`):

| Archivo | Referenciado en contenido |
|---|---|
| `demo_01_features.html` | ❌ huérfano |
| `demo_02_patterns.html` | ❌ huérfano |
| `demo_03_rules.html` | ❌ huérfano |
| `demo_07_protein_3d.html` | ✅ `ia/lesson03_ai_in_biotech:74` |
| `demo_08_alphafold.html` | ❌ huérfano |
| `demo_09_rentosertib.html` | ❌ huérfano |
| `demo_10_pipeline.html` | ❌ huérfano |

**Hallazgo CONT-IFRAME-01** — *corrige el enunciado: no son "2 InteractiveFrame con src roto" aislados, son 2 de 3 usos totales.*
- **Categoría:** contenido / falla silenciosa | **Estado:** VERIFICADO
- **Descripción:** dos `<InteractiveFrame>` apuntan a archivos que **no existen** en `public/interactives/`. El iframe renderiza vacío o 404 **sin error de build** (MDX no valida assets).
- **Evidencia:**
  - `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md:280` → `src="/interactives/demo_06b_overfitting.html"` — no existe.
  - `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lesson.md:187` → `src="/interactives/demo_10_pipeline_ml.html"` — no existe (el archivo real se llama `demo_10_pipeline.html`).
- **Impacto:** estudiantes de 2 de las 4 lecciones del módulo de IA ven un recuadro vacío donde debería haber una simulación. Es una **falla silenciosa**: no aparece en type-check, ni tests, ni build.
- **Prioridad:** P1
- **Solución:** decidir por destino: renombrar `demo_10_pipeline.html` → `demo_10_pipeline_ml.html`, y crear o descartar el 404 de `demo_06b_overfitting.html` (reemplazando el `<InteractiveFrame>` por otro interactivo existente).
- **Archivos:** los dos `lesson.md`; `public/interactives/`
- **Criterio de aceptación:** los 3 `InteractiveFrame src=` en contenido resuelven a un archivo existente, y `npm run build` sigue en verde.

**Costo adjunto:** 6 de 7 HTML (~131 KB de assets) se sirven sin que ninguna página los use. Decisión pendiente: publicar como referencia o borrar.

### 7.3 Contradicción middleware vs `DESIGN.md` sobre `/learn`

| Fuente | Afirma |
|---|---|
| `DESIGN.md:518` | `/learn` → "Índice de módulos **(público)**" |
| `src/middleware.ts:5-19` | `/learn` **no está** en `publicRoutes` → requiere sesión; sin sesión redirige a `/sign-in` (`:55-57`) |

**Verificado:** el código manda. Un visitante anónimo que llegue a `/learn` es redirigido al login. La documentación describe un producto más abierto que el que existe.

### 7.4 `AGENTS.md` afirma algo falso sobre `/api/certify`

- `AGENTS.md:34`: "`/api/certify` is an MVP stub that **always returns `certified: true`**".
- Realidad: `src/app/api/certify/route.ts:22-25` responde **503 con `certified: false`** mientras el flag esté en default (`FEATURE_FLAG_CERTIFY=false`). **Nunca** devuelve `certified: true` sin el flag activo.

### 7.5 CI inexistente

`AGENTS.md` describe `.github/workflows/security-review.yml`. **Verificado: el directorio `.github/workflows/` no existe.** Los checks verdes del PR #70 provienen de Vercel y Graphify, configurados en GitHub, no de workflows en el repo.

---

## 8. Estado legal resumido

> Resumen de `MATRIZ_CUMPLIMIENTO_LEGAL.md` (documento hermano, 197 líneas). Los totales se leyeron de su resumen ejecutivo y se contrasta la identidad del responsable contra `src/app/(legal)/aviso/page.tsx:34,65` — coinciden.

| Estado | Filas | Lectura |
|---|---|---|
| **CUMPLE** | 22 | Obligación implementada y evidenciada en código o página publicada |
| **PARCIAL** | 7 | Implementada a medias o con brecha residual documentada |
| **NO_CUMPLE** | **1** | **RNBD** — obligación vigente sin ejecutar |
| **NO_APLICA** | 5 | Inaplicable por modelo gratuito/B2C/+18, documentado con razón |
| **NO_AUDITADO** | 1 | Otras leyes LATAM fuera del alcance auditado |

**Pendientes de gestión profesional (no técnicos):** firmar/aceptar **DPAs** de Clerk y Supabase; evaluación e inscripción del **RNBD** ante la SIC; implementar las **purgas de 60 días / 24 meses** que hoy son solo norma documentada (`legal/data-inventory.md:266`).

**Sobre seguridad (verificado por esta auditoría, sin citar `AUDITORIA_SEGURIDAD.md`):** `supabase-migration.sql` declara **25 policies** RLS comparando `auth.jwt() ->> 'sub'` contra columnas TEXT, y la única aparición de `auth.uid()` es un comentario que explica que **no** se usa (`supabase-migration.sql:7`). Las escrituras de servidor usan service-role en 10 archivos (`src/app/api/**`, `src/lib/supabase/*`, `src/application/use-cases/completeConsent.ts:50`), sin key de servicio en cliente (guardia en `src/lib/supabase/admin.ts:11-13`). La validación completa de RLS policy-por-policy es de `AUDITORIA_SEGURIDAD.md`.

---

## 9. Tabla final

| Dimensión | Estado | Evidencia | Brecha principal |
|---|---|---|---|
| Stack y build | ✅ SANA | `npm run build` exit 0, 43 rutas; versions pinadas en `package.json:19-58` | Pyodide fuera de `package.json` (CDN, sin lock) |
| Tipos | ✅ SANA | `npm run type-check` OK | — |
| Tests unitarios | ✅ SANA | 19 archivos / 187 tests PASS | Sin integración ni e2e; `.mjs` documentado como vivo y no corre |
| Arquitectura / capas | ✅ SANA | `src/domain`, `src/application/{ports,use-cases}`, `src/lib`; service-role solo en servidor | Solo 2 puertos y 1 use-case formalizados; mayoría de rutas usan el adapter directo |
| Auth y datos reales | ✅ FUNCIONAL | Clerk + Supabase service-role en 10 archivos de servidor; webhook svix | — |
| Contenido educativo | ⚠ PARCIAL | 41 lecciones completas (lab, notebook, quiz, tarea, bibliografía) | Solo 4/41 con capa de presentación; 0 `slides.md`; 0 usos de los `*Player` |
| Assets interactivos | ❌ DEFICIENTE | 2 `InteractiveFrame` con `src` inexistente; 6/7 HTML huérfanos | Simulaciones vacías en 2 lecciones publicadas; falla silenciosa |
| Rutas simuladas | ⚠ PARCIAL | `/api/certify` stub tras flag (503 default); `/preview/cards` y `/preview/bioreactor` con datos mock | Certificación no certifica; `/preview/cards` ya decidida a eliminar (PR #68) |
| Documentación | ❌ DEFICIENTE | 5 lugares con conteo de tests falso; `DESIGN.md:180,185` componentes inexistentes; `:518` contradice middleware; `AGENTS.md:34` falso; CI inexistente | El repo tiene ≥4 fuentes de verdad en desacuerdo verificable |
| Higiene git | ⚠ PARCIAL | 3 PRs abiertos todos MERGEABLE y verdes | `88a038b` + 13 commits solo locales; `odd/lab-heroes-restore` pusheada sin PR |
| Observabilidad | ❌ AUSENTE | sin analytics, sin CI en repo, sin failover | Sin telemetría de errores ni de uso |
| Cumplimiento legal | ⚠ PARCIAL | 22 CUMPLE / 7 PARCIAL / **1 NO_CUMPLE (RNBD)** | DPAs, RNBD y purgas 60d/24m sin ejecutar |

---

## 10. NO_AUDITADO — lo que esta auditoría NO puede afirmar

| Ítem | Por qué queda fuera | Cómo verificarlo |
|---|---|---|
| Backups reales de Supabase/Vercel | Requiere acceso a panel | Revisar configuración de backups en Supabase y Vercel |
| Costos por usuario | Sin datos de uso ni plan contratado | Panel de Vercel/Supabase |
| Render visual real (contraste, foco, teclado) | Requiere navegador | `axe-core` / Colour Contrast Analyser sobre el render — ver `AUDITORIA_UX_UI.md` §8 |
| Ejecución de la app en producción | Esta auditoría es estática | Correr `npm run dev` y recorrer flujos |
| Conformidad RLS policy-por-policy | Alcance de `AUDITORIA_SEGURIDAD.md` | Ese documento |
| Vigencia de políticas legales publicadas | Requiere validación profesional | Abogado / SIC |

---

## Muestreo de verificación de paths

Muestra de 8 paths citados en este documento, verificados como existentes al cierre:

| Path | Estado |
|---|---|
| `package.json` | ✅ existe (60 líneas) |
| `src/middleware.ts` | ✅ existe (115 líneas) |
| `src/app/api/certify/route.ts` | ✅ existe (67 líneas) |
| `src/app/learn/[module]/[slug]/page.tsx` | ✅ existe (238 líneas) |
| `public/pyodide-worker.js` | ✅ existe (340 líneas) |
| `src/lib/supabase/admin.ts` | ✅ existe (18 líneas) |
| `legal/project-classification.md` | ✅ existe (115 líneas) |
| `vitest.config.mts` | ✅ existe (19 líneas) |

Paths citados cuya **inexistencia es el hallazgo**: `src/components/ui/PageShell.tsx` (desde `DESIGN.md:180`) y `src/components/ui/SiteHeader.tsx` (desde `DESIGN.md:185`) — confirmados ausentes; `public/interactives/demo_06b_overfitting.html` y `public/interactives/demo_10_pipeline_ml.html` — confirmados ausentes; `.github/workflows/` — confirmado ausente.

---

*Documento generado el 2026-10-11. Método: lectura de archivos, `grep` de negativos y positivos, y ejecución de `type-check` / `test` / `build` en Node v22.23.2. No se modificó código, no se tocó git, no se instaló nada. Toda cifra proviene de una salida de comando o de `archivo:línea`.*
