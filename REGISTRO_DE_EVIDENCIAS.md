# REGISTRO DE EVIDENCIAS — Auditoría de Plataforma InVitro-Code

| Campo | Valor |
|---|---|
| Fecha de la auditoría | 2026-10-11 (sesión del día; PR #70 abierto 22:15:17 UTC) |
| Fecha de re-verificación para este registro | 2026-10-11 ~23:05–23:15 hora local (04:05–04:15 UTC del 2026-10-12) |
| Repo / worktree | `/home/biohacker24/proyectos/invitro-code-worktrees/presentation-reemplazo-directo` |
| Estado de git | HEAD desacoplado en `ff0af93` |
| Método | Lectura de archivos, `grep` de positivos y negativos, y ejecución de los gates del proyecto. **No se modificó código, no se tocó git, no se corrió `npm install`.** |
| Documentos hermanos | `AUDITORIA_ESTADO_ACTUAL.md`, `AUDITORIA_FUNCIONAL.md`, `AUDITORIA_SEGURIDAD.md`, `AUDITORIA_SOSTENIBILIDAD.md`, `AUDITORIA_UX_UI.md`, `MATRIZ_CUMPLIMIENTO_LEGAL.md`, `odd/tasks/auditoria-plataforma-2026-10.md` |

Toda cifra de este registro proviene de una salida de comando observada o de una cita `archivo:línea`. Donde la re-verificación contradijo al enunciado del encargo, se documenta el valor medido y se señala la discrepancia (§4).

---

## 1. Comandos ejecutados (resultados observados)

| # | Comando | Propósito | Resultado observado | Hora aprox. |
|---|---|---|---|---|
| 1 | `git status && git branch -vv && git branch -r` | Estado del worktree y topología de ramas | HEAD desacoplado en `ff0af93` ("docs(odd): auditoria UX de Expediciones y plan de slices/migracion"). Worktree limpio salvo 7 archivos sin seguimiento (los .md de esta auditoría). Rama local `feat/presentation-reemplazo-directo` en `cef461a`; `git rev-list --left-right --count` → **`0 14`**: la rama local va **14 commits por delante** de `origin/feat/presentation-reemplazo-directo` (origin en `ff0af93`), 0 por detrás. `git branch -r --contains 88a038b` → vacío: `88a038b` existe solo en local (es el más antiguo de los 14 sin push). | Auditoría: 2026-10-11, antes de las 22:15 UTC. Re-verificación: ~23:09 local |
| 2 | `gh pr list --state open` | Inventario de PRs abiertos y su mergeabilidad | 3 PRs: **#70** `feat/presentation-reemplazo-directo` (abierto 2026-10-11T22:15:17Z), **#69** `fix/hero-cientifico-cut`, **#68** `chore/cards-higiene`. Verificado con `--json`: los tres `mergeable=MERGEABLE`, `mergeStateStatus=CLEAN`. | ~17:15–23:09 local (PR #70 creado 22:15:17 UTC = 17:15 local; re-verificación 23:09 local) |
| 3 | `gh pr list --head odd/lab-heroes-restore --state all` | ¿Existe PR para la rama `odd/lab-heroes-restore`? | **Vacío** (exit 0, sin filas). La rama está pusheada (`origin/odd/lab-heroes-restore`, 15 commits por delante de su base) pero **ningún PR la expone a revisión**. | ~23:00 local |
| 4 | `npm run type-check` | Gate estático (`tsc --noEmit`) | **OK, exit 0**, sin errores. Reproducido dos veces; la segunda capturando el código de salida sin pipe (`TYPECHECK_EXIT=0`). | 2026-10-11 ~23:00 local |
| 5 | `npm run test` | Gate de tests unitarios | **19 archivos / 187 tests, todos PASS** (vitest 4.1.10, `environment: node`). Reproducido: `Test Files 19 passed (19)`, `Tests 187 passed (187)`, ~1.2 s (auditoría original: ~2.5 s). | ~23:05:46 local (inicio del run reproducido) |
| 6 | `npm run build` | Gate de build + tabla de rutas real | **exit 0**; `✓ Compiled successfully in 13.8s`. Tabla de rutas: **43 rutas = 11 estáticas ○ + 32 dinámicas ƒ**, de las cuales **15 son rutas API**. El "(30/30)" del log son pasos de prerender de páginas estáticas, **no** rutas. Reproducido dos veces; la segunda capturando el código de salida (`BUILD_EXIT=0`). | ~23:05–23:14 local |
| 7 | `npx vitest list \| grep -i requestid` | ¿Corre el test de la race condition de ThresholdLab? | **Vacío** (grep exit 1). `src/__tests__/requestId-descarte.test.mjs` existe pero **ningún runner lo ejecuta**: el glob de `include` en `vitest.config.mts:6` solo cubre `src/**/*.test.ts` y `src/**/*.test.tsx`. | ~23:04 local |
| 8 | `node -v` | Versión de Node usada | Auditoría: **v22.23.2** (mínimo exigido por Next 16: ≥20.9). Re-ejecutado para este registro: **v24.21.0** (otra toolchain en el PATH del shell); los gates dieron resultados idénticos. No existe `.nvmrc` en este HEAD. | ~23:00 local |

---

## 2. Documentación leída (con propósito)

| Documento | Propósito de la lectura |
|---|---|
| `README.md` | Convenciones del proyecto, stack, requisitos (Node ≥20.9, línea 19), quickstart. Verificado también como fuente del drift de cifras de tests. |
| `DESIGN.md` | Sistema de diseño y tokens de referencia para los hallazgos de UI. |
| `AGENTS.md` | Mandatos del repo: arquitectura por capas, gates (`type-check`/`build`; `lint` roto por diseño), quirks de MDX y Pyodide. |
| `openspec/config.yaml` | Convenciones SDD y `verify`. Detectadas cifras desactualizadas de tests en líneas 14 y 66-67. |
| `legal/*` (18 archivos) | Inventario legal: **10 auditorías** (project-classification F1, technical-audit F2, data-inventory F3, cookies-audit F4, analytics-audit F5, providers-audit F6, accessibility-audit F7, ip-audit F8, ai-audit F9, security-audit F10) + `legal-final-report.md` + `dpa-register.md` + `retention-policy.md` + 5 políticas públicas (`aviso-legal`, `politica-privacidad`, `politica-cookies`, `terminos-condiciones`, `politica-ia`). |
| `odd/tasks/legal-auditoria-f1-f3-f6.md`, `legal-auditoria-f4-f5-f7-f10.md`, `legal-F11-generacion.md` | Trazabilidad de las remediaciones F1–F11 y del informe final. |
| `odd/tasks/expediciones-ux-audit.md` | El audit cuyo commit es precisamente este HEAD (`ff0af93`). |
| `odd/tasks/auditoria-plataforma-2026-10.md` | Índice de esta auditoría (archivo sin seguimiento). |
| `docs/adr/003-single-writer-progress.md` | Decisión arquitectónica de escritura única de progreso. |
| `supabase-migration.sql` | Esquema real (tablas, policies RLS, triggers) y encabezado con la convención Clerk/Supabase. |
| `src/middleware.ts` | Rutas públicas/admin, manejo de 401 vs redirect y `matcher`. |
| 15 rutas API (`src/app/api/**/route.ts`) | Revisión de handlers: derivación de identidad, rate limiting, validación de secretos en crons/webhook. |
| `src/app/(legal)/*` | Las 5 páginas legales públicas efectivamente servidas. |
| `package.json`, `vercel.json`, `vitest.config.mts` | Scripts y dependencias; 3 crons registrados; configuración de tests (origen del hallazgo del `.mjs`). |

---

## 3. Verificaciones puntuales (con cita `archivo:línea`)

| Verificación | Evidencia | Resultado |
|---|---|---|
| `publicRoutes` del middleware | `src/middleware.ts:5-19` (13 rutas), `adminRoutes:21`, `authRoutes:23`, `matcher:107-114` | Confirmado: API sin sesión → 401 JSON (`:50-53`); páginas → redirect `/sign-in` (`:55-57`). `/api/cron/purge-pending` es pública (`:12`). |
| Valores de rate limits | `src/lib/rate-limit.ts:12-16` (default 100 req / 15 min, ventana fija en memoria, `Map` `:5`, resetea al redeploy, comentario `:1`). Callers: `daily-goal` 20/15 min (`src/app/api/profile/daily-goal/route.ts:39`); `bookmarks` 50/15 min (`src/app/api/bookmarks/route.ts:58`); `progress` 100/15 min (`src/app/api/progress/route.ts:43`); `lab-progress` 100/15 min (`src/app/api/lab-progress/route.ts:60`) | Confirmado. Límite en memoria: no compartido entre instancias serverless. |
| Glob de `include` de vitest | `vitest.config.mts:6` → `["src/**/*.test.ts", "src/**/*.test.tsx"]` | Confirmado: `src/__tests__/requestId-descarte.test.mjs` excluido del run. |
| RLS en la base | `supabase-migration.sql`: 10 `CREATE TABLE` (`:18, :65, :94, :120, :174, :194, :276, :309, :408, :507`) y 9 `ALTER TABLE … ENABLE ROW LEVEL SECURITY` (`:52, :76, :102, :129, :186, :201, :320, :425, :514`) | **10 tablas, 9 con RLS**. La única sin RLS es `modules` (`:276`), coherente con contenido público de sólo lectura. |
| Secretos en el árbol trackeado | `git ls-files \| grep` de patrones de keys reales (`sk_live`, `sk_test` de ≥20 chars, JWT `eyJhbGci…`, `whsec_`, `re_`, assignments con valor) sobre todos los archivos trackeados | **0 valores reales**. Única coincidencia de patrón débil: `.env.local.example:9` con `SUPABASE_SERVICE_ROLE_KEY=` y **valor vacío** (plantilla documental; cotejado con `AUDITORIA_SEGURIDAD.md:206-210`, HX-SEC-14). |
| `InteractiveFrame` con `src` roto | 3 usos en MDX: `lesson02_how_ai_learns/lesson.md:280` → `/interactives/demo_06b_overfitting.html` (no existe); `lesson03_ai_in_biotech/lesson.md:187` → `/interactives/demo_10_pipeline_ml.html` (el archivo real es `demo_10_pipeline.html`); `lesson03_ai_in_biotech/lesson.md:74` → `demo_07_protein_3d.html` (existe) | **2 de 3 usos con src roto**: dos lecciones publicadas muestran un iframe vacío que falla en silencio. |
| HTML huérfanos en `public/interactives/` | Glob de los 7 HTML en disco + grep de referencias en `src/content`, `src/components`, `src/app` | **6 de 7 huérfanos**: sólo `demo_07_protein_3d.html` está referenciado. Huérfanos: `demo_01_features`, `demo_02_patterns`, `demo_03_rules`, `demo_08_alphafold`, `demo_09_rentosertib`, `demo_10_pipeline`. Además, dos HTML referenciados no existen en disco. |
| Rutas API reales | Glob de `src/app/api/**/route.{ts,tsx,js}` → 15 archivos; tabla del build → 15 APIs; `AUDITORIA_SEGURIDAD.md:187` → 15 rutas, 11 derivan identidad de `auth()` | **15 rutas API** (no 16 como decía el encargo, ni 14). |

---

## 4. Discrepancias detectadas al re-verificar (corregidas en este registro)

1. **"La rama local va 1 por delante (solo `88a038b` sin push)" — INCORRECTO.** Medido: `git rev-list --left-right --count` → `0 14`. La rama local `feat/presentation-reemplazo-directo` (hoy en `cef461a`) tiene **14 commits** que no están en `origin` (origin en `ff0af93`); `88a038b` es el más antiguo de ellos. Coincide con `AUDITORIA_ESTADO_ACTUAL.md:159`.
2. **`node -v`: v22.23.2 (auditoría) vs v24.21.0 (shell de re-verificación).** Mismo resultado en los cuatro gates; la diferencia es la toolchain activa, no el código.
3. **"14 rutas API" vs 15 verificadas** (glob + tabla del build + `AUDITORIA_SEGURIDAD.md:187`). El encargo original decía 16; el valor real es 15.
4. **Drift documental de tests:** `openspec/config.yaml:14` y `:66-67`, `README.md:24,33` y `AGENTS.md:10` declaran "6 archivos / 37 tests"; la medición real es **19 archivos / 187 tests** (cinco lugares desactualizados, cotejado con `AUDITORIA_ESTADO_ACTUAL.md:181-195`).

---

## 5. Limitaciones de la auditoría

- **Sin navegador:** lo puramente visual queda **NO_AUDITADO** — contraste medido en pantalla, responsive real en devices, animaciones.
- **Sin acceso a los paneles de Vercel / Supabase / Clerk:** planes, backups, uso real, costos y configuración de producción quedan **BLOQUEADOS**; sólo se audita lo verificable en el repo.
- **Sin pruebas de intrusión activas:** la auditoría de seguridad fue **estática + lectura**; no se ejecutó ningún ataque ni exploit.
- **Sin e2e:** los flujos críticos end-to-end quedan **NO_AUDITADO**. Método propuesto para cerrarlo: Playwright sobre los flujos de auth, progreso y labs.
- **Sin asesoría jurídica externa:** el cumplimiento legal es un **inventario técnico**, no una certificación.
- **Alcance del worktree:** HEAD desacoplado en `ff0af93`; los PRs abiertos (#68, #69, #70) contienen código que puede diferir de este snapshot.
- **Ramas no mergeadas:** los hallazgos sobre `feat/presentation-reemplazo-directo` (PR #70 en curso) no reflejan lo que esos PRs agregarán al mergearse; los 14 commits sin push y la rama `odd/lab-heroes-restore` (sin PR) quedaron fuera del alcance de revisión por par.

---

**Nota final:** La finalización de esta auditoría no certifica el cumplimiento de toda la legislación aplicable.
