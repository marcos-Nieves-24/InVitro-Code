# Auditoría de commits locales (ff0af93..cef461a) — higiene post-auditoría

**Veredicto global: PUSH CON CONDICIONES.** 5 de los 6 commits auditados son correctos y verificables.
El sexto (`3d7ba2e`) **borra 82 archivos de openspec en lugar de moverlos al archive**, y el hallazgo
P0 (`HX-CRON-01`) sigue 100% abierto porque ningún commit del rango toca `src/app/api/cron/`.

Alcance: audité los 6 commits pedidos. El rango contiene 8 commits adicionales fuera de alcance
(`88a038b`, `2f03e1d`, `52e87fc`, `d45d72a`, `6abcc5e`, `3fff1dd`, `87b3cd7`, `cef461a`); `87b3cd7` es
relevante porque es el que vuelve a desactualizar los conteos que `ecdd595` corrige.

> Método: solo `git show` / `git log` / `git diff` sobre los objetos del repo. El árbol de trabajo
> sigue en `ff0af93` (HEAD desacoplado) y no fue modificado. Los conteos de tests son estáticos
> (grep de líneas `test(`/`it(`); el `.mjs` además se ejecutó fuera del árbol (ver commit 2).

## Tabla por commit

| sha | intención | veredicto | evidencia (path:line del diff) | problema nuevo que introduce |
|---|---|---|---|---|
| `60b7e4c` | Registrar rutas cron de Vercel como públicas | **CORRIGE** (HX-CRON-02 / FN-CRON-01, P1) | `src/middleware.ts`: diff agrega tras `"/api/diagnose",` el comentario + `"/api/cron/purge-pending"` (contexto, ya existía) y `"/api/cron/recharge-freezes"`, `"/api/cron/daily-nudge"` (hoy `src/middleware.ts:12-15`). El gate es `const isPublic = publicRoutes.some(...)` → `if (!isPublic) { ... 401 }`, así que entrar en la lista basta para eliminar el 401 | El comentario "validated via CRON_SECRET in handler" es falso: los 3 handlers también aceptan presencia pura del header `x-vercel-cron` (`src/app/api/cron/purge-pending/route.ts:17-18`, bloque idéntico en `daily-nudge` y `recharge-freezes`). Ahora esas rutas pasan el middleware sin sesión y su única control es ese bypass |
| `9aecd0c` | Incluir `.mjs` en el glob de vitest y hacer real el test de requestId | **CORRIGE** | `vitest.config.mts:6` → `["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/*.test.mjs"]`. El `.mjs` ahora importa `test` de vitest (línea 10), `assert` lanza (12-14) y declara 5 tests reales (líneas 70, 87, 110, 141, 161); se eliminó el runner `main()`/`process.exit` | Riesgo menor: los tests dependen de timers reales (`setTimeout` 5-100 ms). Acá corrieron verdes (ver abajo), pero son flakiness candidates en CI cargada |
| `ed07f34` | Pinear Node 22 (.nvmrc) y `engines` | **CORRIGE** (con caveat) | `.nvmrc` nuevo con `22`; `package.json` agrega `"engines": { "node": ">=20.9", "npm": ">=10" }` | No hay `.npmrc` con `engine-strict` → `engines` es solo advertencia. No existe `.github/` ni en `ff0af93` ni en `cef461a`, así que nada en el repo obliga el pin: sigue siendo convención de dev, no enforcement |
| `c4ba33c` | Documentar `CRON_SECRET` y `RESEND_API_KEY` | **CORRIGE** | `.env.local.example:22-25` comentario + `CRON_SECRET=`; `:28` `RESEND_API_KEY=`. Ambos con valor vacío: **no se filtró ningún secreto real** | El comentario `:23-24` ("Handlers accept either Bearer o el header x-vercel-cron") instituye como mecanismo válido el bypass presence-only del header. `RESEND_API_KEY` sí existe en código: `src/app/api/cron/daily-nudge/route.ts:111-115` (fetch a `api.resend.com/emails`), y la nota "opcional" coincide con el `if` |
| `ecdd595` | Sincronizar conteos, coverage, skills y Node en docs | **PARCIAL** (corrige, pero queda stale y agrega falsedades) | `AGENTS.md:10` y `openspec/config.yaml:14,66` pasan de "6 files / 37 tests" a "20 files / 192 tests". La parte de coverage es real: `@vitest/coverage-v8` ya estaba en `package.json:53` y en `package-lock.json:45` de `ff0af93` | (a) 20/192 era correcto **en su propio commit**, no hoy: el tip real es 21 archivos / 199 tests. (b) `AGENTS.md:91` dice que los skills viven en `.agents/skills/` (`frontend-design`, `web-design-guidelines`) y que `.atl/skill-registry.md` indexa 25: en `ecdd595` no existe ninguna de esas rutas (`.atl/` está en `.gitignore:50`, es local-only); `.agents/skills/` aparece después por `d45d72a`/`6abcc5e` con 8 skills distintos. (c) Dejó viva la promesa falsa de CI en `AGENTS.md:82` (`.github/workflows/security-review.yml` no existe) |
| `3d7ba2e` | "Archivar" 11 changes completados | **NO CORRIGE / RIESGO ALTO** | `git show 3d7ba2e --name-status -M50` → **82 `D`, 0 `A`**. `git diff --name-status ff0af93..cef461a -- openspec/changes/` → **83 `D`, 0 `A`**. A `cef461a`, `openspec/changes/archive/` contiene solo el `2026-08-20-projects-hub-colab` preexistente (idéntico a `ff0af93`) | Borró 82 archivos de 11 changes en lugar de moverlos a `changes/archive/<fecha>-<nombre>/`. Eran cambios cerrados de verdad (los 11 tenían `archive-report.md`), así que la convención del repo pedía moverlos. Recuperables desde la historia, pero el tip pierde el lineage/receipts de 11 cambios |

Detalle de `3d7ba2e` — los 11 directorios borrados por completo (ninguno deja archivos huérfanos en
`cef461a`): `complete-ia-module` (4), `content-table-component` (8), `enable-gfm-tables` (9),
`estadistica-interactive-lessons` (6), `labs-platform` (13), `overfitting-trainer` (8),
`platform-mvp` (10), `real-data-replace-mocks` (6), `regression-trainer` (8),
`responsive-layout-console-override` (10), `ui-modernization` (1).

## Verificación de los 5 hallazgos cruzados

| Hallazgo | Estado tras el rango | Evidencia |
|---|---|---|
| **HX-CRON-02 / FN-CRON-01** (P1): daily-nudge y recharge-freezes morían con 401 del middleware | **CORREGIDO** | `src/middleware.ts:12-15` (diff de `60b7e4c`). Las 3 rutas existen (`src/app/api/cron/daily-nudge/route.ts`, `recharge-freezes`, `purge-pending`) y están declaradas en `vercel.json` (`0 0 * * *`, `0 0 * * 1`, `0 3 * * *`). Con `isPublic=true` ya no entran al branch que devuelve 401 |
| **HX-CRON-01** (P0): purge-pending acepta bypass por presencia del header `x-vercel-cron` | **SIGUE ABIERTO — ningún commit lo toca** | `git diff ff0af93..cef461a --stat -- src/app/api/cron/` → **vacío**. El código en `cef461a` sigue teniendo `if (vercelCronHeader !== null) { return true; }` en `src/app/api/cron/purge-pending/route.ts:17-18`. Peor: `60b7e4c` hizo la ruta pública en middleware, así que el header es el *único* control y lo puede setear cualquiera. El handler borra en cascada `lab_progress`, `progress`, `reflection_completions`, `streaks`, `user_achievements`, `consent_logs`, avatares y `profiles` con cliente service-role |
| **FN-GOV-01** (P2): docs 6 archivos/37 tests vs real 19/187 | **PARCIALMENTE corregido y vuelto a romper** | A `ff0af93` corrían 19 archivos (el glob excluía el `.mjs`) con 187 tests: real. `9aecd0c` agregó el `.mjs` (+5 tests) → 20/192, que es exactamente lo que escribió `ecdd595`. Pero `87b3cd7` agregó `src/components/lesson/LabOfflineNotice.test.ts` (7 tests) → **hoy el tip real es 21 archivos / 199 tests** (`git diff --name-status ff0af93..cef461a -- 'src/**/*.test.*'` → solo `M` del `.mjs` y `A` de ese archivo). Los docs ya mienten por 1 archivo / 7 tests |
| `requestId-descarte.test.mjs` no corría | **CORREGIDO, y el contenido es un test real y válido** | Glob nuevo (`vitest.config.mts:6`). Lo ejecuté fuera del árbol (sandbox en `/tmp/opencode/audit-run`, sin tocar el repo) con vitest 4.1.10 y Node v22.23.2: **`Test Files 1 passed (1) / Tests 5 passed (5)`**, 449 ms. Cubren baseline, debounce, respuestas fuera de orden, arrastre rápido y no-descarte de la primera respuesta. **No rompe la suite existente**: el diff solo toca el `.mjs` y la config; el glob es aditivo (no puede excluir archivos) y ningún otro test fue modificado |
| `.env.local.example`: ¿documenta bien `CRON_SECRET`? | **SÍ, sin filtrar valores** | `CRON_SECRET=` y `RESEND_API_KEY=` con valor vacío (`.env.local.example:25,28`). `RESEND_API_KEY` se usa de verdad: `src/app/api/cron/daily-nudge/route.ts:111-115` |

## Qué queda roto tras estos commits

1. **P0 abierto: `/api/cron/purge-pending` sigue siendo un purge masivo autenticable por header
   casero.** Commit ninguno. Con `60b7e4c` la ruta quedó fuera del middleware, así que el
   `x-vercel-cron: 1` de cualquier cliente alcanza el borrado en cascada de todos los usuarios.
   Fix requerido: exigir `CRON_SECRET` siempre, y tratar `x-vercel-cron` solo como refuerzo
   (o verificar origen Vercel), no como credencial.
2. **Pérdida de gobernanza en openspec (nueva, introducida por estos commits).** El tip perdió 11
   changes archivados; el archive quedó más vacío que el padre. No es pérdida de código de producto,
   pero sí de recibos SDD (proposal/spec/design/tasks/verify/archive-report de 11 cambios).
3. **Docs sigue mintiendo en 3 lugares** (`AGENTS.md:10` y `openspec/config.yaml:14,66`: 20/192 vs
   21/199 real; `AGENTS.md:91`: skills inexistentes y registry local-only; `AGENTS.md:82`: CI que no
   existe). El patrón se repitió dos veces: corregir conteos a mano los vuelve a romper en el
   commit siguiente.
4. **Documentación de seguridad inconsistente con el código**: `.env.local.example:23-24` y el
   comentario de `src/middleware.ts:12` presentan el header `x-vercel-cron` como validación, cuando
   es un bypass.

## Recomendación de push: **PUSH CON CONDICIONES**

Pusheable con baja fricción: `60b7e4c`, `9aecd0c`, `ed07f34`, `c4ba33c`, y la intención de
`ecdd595` (con los números arreglados). Bloqueantes antes de pushear:

1. **`3d7ba2e` — reparar antes de que propague.** Committear de nuevo los 11 directorios en
   `openspec/changes/archive/<YYYY-MM-DD>-<nombre>/` recuperándolos con
   `git show ff0af93:openspec/changes/<nombre>/...` (todo está en la historia). Alternativa:
   `rebase -i` y reescribir el commit como un move real. No empujes un tip cuyo archive es más
   chico que su padre.
2. **Contadores**: llevar a 21/199 o, mejor, eliminar los números hardcodeados y dejar solo el
   comando — así ningún commit futuro los vuelve stale.
3. **Docs**: borrar o corregir `AGENTS.md:91` (skills/registry) y `AGENTS.md:82` (CI inexistente).
4. **Abrir issue para HX-CRON-01 (P0)** con la evidencia de `route.ts:17-18`; no cerrar el alcance
   "cron" hasta tener el fix. Idealmente en el mismo commit que endurece el check, no en docs.

Si `3d7ba2e` se pushea tal cual, el costo es recuperable (historia) pero silencioso para cualquiera
que clone después: por eso la condición 1 es la única realmente bloqueante.

---

_Verificación del auditor: todas las afirmaciones de este documento provienen de `git show`/`git log`/
`git diff` sobre `ff0af93`/`cef461a` y de una ejecución aislada del `.mjs` fuera del árbol de trabajo.
No se ejecutó `checkout`, `stash`, ni se modificó o commiteó nada._
