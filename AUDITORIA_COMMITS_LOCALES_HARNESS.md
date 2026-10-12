# Auditoría — Commits locales "harness" (sin push)

**Repo:** `invitro-code` · **Rango auditado:** `52e87fc`..`87b3cd7` (5 commits, 8 commits por encima de `ff0af93` = HEAD desacoplado)
**Método:** solo `git show` / `git diff` / `git ls-tree`. Nada modificado, nada commiteado.

## Veredicto en una línea

El **60% es valor real** (8 skills concretas, triage honesto, componente útil). El **40% es ceremonia**: el gate de QA de Fase 3 (`design:check`) **falla con exit 1 contra el `design-guide.yaml` que el mismo commit agrega**, y los design tokens contradicen `DESIGN.md` en 6 de 10 colores. No empujes Fase 3 tal cual.

---

## 1. Tabla por commit

| SHA | Intención | Veredicto | Evidencia (path:line) |
|---|---|---|---|
| `52e87fc` | Registrar Fase 0 (higiene) con evidencia | **SÓLIDO** | `odd/tasks/harness-hygiene-fase0.md:41-49` (SHAs de commit reales: `ed07f34`, `9aecd0c`, `ecdd595`, `60b7e4c`, `c4ba33c`, `3d7ba2e`); sección "Desviaciones / hallazgos" `:51-56` admite la premisa falsa de T2 y el error de conteo de T3 |
| `d45d72a` | 4 skills core + design tokens | **PARCIAL** | Skills sólidas: `.agents/skills/mdx-lesson-authoring/SKILL.md:52-59` (contrato del split por `<Section`, filtro `Resumen`, renumeración — derivado de `page.tsx` real) y `.agents/skills/pyodide-lab-contract/SKILL.md:36-56`. **Pero** `design.tokens.json` contradice `DESIGN.md` (ver §3) y la evidencia mide mal: `odd/tasks/harness-core-fase1.md:17` dice "148 líneas" para `react-best-practices/SKILL.md`, que en realidad tiene 73 (verificado con `git show --stat`) |
| `6abcc5e` | 4 skills workflow + triage `odd/tasks` | **PARCIAL** | Skills buenas y encadenadas: `.agents/skills/brainstorming/SKILL.md:13` (adaptación declarada de `obra/superpowers`) → `writing-plans` → `executing-plans` → `subagent-driven-development`. Triage real con 40 archivos clasificados: `odd/tasks/_triage-fase2.md:11-52`. **Pero** deja dos mentiras vivas que ellos mismos detectaron: `AGENTS.md:91` sigue diciendo "indexes 25 skills" (ellos afirman 33) y sigue nombrando `frontend-design` / `web-design-guidelines`, skills que **no existen** en `.agents/skills/` |
| `3fff1dd` | QA loop design-harness | **RIESGO** | `package.json:21-23` agrega `design:audit`/`design:check`/`design:compile` sobre `npx @design-harness/cli@latest`. El CLI existe (npm `@design-harness/cli@0.6.4`, verificado) y las firmas de `--help` coinciden… **pero `guide check` rechaza el guide**: ejecutado en sandbox con los archivos de este commit → `Guide schema error at --guide: $.schemaVersion is required; $.prohibitions is required; $.signatureElement is required; $.tokens must be object; $.project is not allowed; $.version is not allowed; $.aesthetic is not allowed; $.aesthetic_notes is not allowed; $.palette_intent is not allowed; $.components_context is not allowed; $.guides is not allowed; $.principles is not allowed` → **exit 1**. La única verificación hecha fue `--help`: `odd/tasks/harness-qa-fase3.md:39` |
| `87b3cd7` | `LabOfflineNotice` (demo del harness) | **PARCIAL** | Componente útil y bien derivado: `src/components/lesson/LabOfflineNotice.tsx:41-70` (listeners `online`/`offline`, `forcedOffline` como hook de test, cleanup en `useEffect`). **Pero** no hay ningún `lesson.md` que lo invoque (`git grep LabOfflineNotice 87b3cd7 -- src/content` → vacío): está cableado como *capacidad MDX*, no como funcionalidad en uso |

---

## 2. Las 8 skills nuevas

Todas tienen frontmatter válido (`name` + `description` con "Use when:") y contenido LLM-first concreto — cero placeholders genéricos. Ninguna duplica por nombre a las skills instaladas (ninguna coincide con `skill-creator`, `go-testing`, `chained-pr`, `work-unit-commits`, `rdd-defect-workflow`, `sdd-*`). Solapamiento **conceptual** (no de nombre): `executing-plans`/`writing-plans` cubren terreno que ya vive en el protocolo ODD/SDD del orquestador, y `react-best-practices` es una **adaptación vendida** (`metadata.author: vercel`) sin URL de origen ni licencia.

| Skill | Veredicto (1 línea) |
|---|---|
| `mdx-lesson-authoring` | **SÓLIDA** — la más valiosa del grupo: contrato verificado contra `page.tsx` real (`:52-59`), frontmatter literal, registro en 2 pasos, `$...$` |
| `pyodide-lab-contract` | **SÓLIDA** — captura el hallazgo "los labs requieren red" con la evidencia correcta (`:49`); protocolo `requestId` y serialización `runQueue` documentados |
| `react-best-practices` | **ÚTIL** — 8 categorías por impacto, anclada al repo (`:22`, `:34`, `:43` mencionan Pyodide/MDX/realtime-off); es vendida de Vercel sin link de origen |
| `vercel-optimize` | **ÚTIL** — flujo metrics→routes→reporte rankeado; la más "genérica" de las 4 pero con anclas reales (`:47-48` labs pesados, `/api/certify` stub) |
| `brainstorming` | **SÓLIDA** — "no se escribe código en esta fase" + regla de 1 pregunta a la vez (`:30`), adaptación declarada de `obra/superpowers` (`:13`) |
| `writing-plans` | **SÓLIDA** — YAGNI + RED/GREEN real + el contrato TDD del repo (`strict_tdd: false` → `type-check` como gate mínimo, `:26-32`); cruza bien a las otras skills (`:52-55`) |
| `executing-plans` | **SÓLIDA** — bucle por batches con "marcá `[x]` solo con evidencia" (`:24`) y gates correctos del repo (`:40-44`) |
| `subagent-driven-development` | **SÓLIDA** — topología orchestrator/workers con `max_threads=4`/`max_depth=2` y la regla de worktrees + `.codegraph/` propio (`:32-35`) |

**Nota de instalación (deuda):** `.gitignore:51` ignora `.agents/` completo. Los 8 `SKILL.md` entraron por `git add -f` (el propio mensaje de `d45d72a` lo admite: "fuerza add .agents/skills"). Un clone los recibe (tracked > ignored), pero **toda skill nueva en `.agents/skills/` requiere `-f`**, y el registry de `gentle-ai` escanea `~/.agents/skills`, `~/.config/opencode/skills`, etc. — **ningún path del repo** (`.atl/skill-registry.md:9-14`). Las afirmaciones "registry 25→29→33, 4 nuevas en scope `project`" son **inverificables desde el repo**: `.atl/` está gitignored (`git ls-files .atl` → vacío).

---

## 3. `design.tokens.json` — doc muerta con valores inventados

**Consumidores:** ninguno en código. `git grep design.tokens` sobre los 5 commits solo devuelve: `design-guide.yaml:3` (auto-referencia), `AGENTS.md:108-110` (prosa) y `src/components/lesson/LabOfflineNotice.tsx:10-19`, que **copia los hex a mano** con comentarios que apuntan al JSON. No hay `import` del JSON en ningún lado. **Es documentación, no sistema de tokens.**

**Consistencia con `DESIGN.md` / `globals.css @theme`:**

| Token | `design.tokens.json` | `DESIGN.md:16-39` / `:1049-1073` | Match |
|---|---|---|---|
| `bg` | `#FBF8F5` | no existe (surface = `#FFFFFF`) | **INVENTADO** |
| `surface` | `#FFFFFF` | `surface`/`surface-card` `#FFFFFF` | ✓ |
| `primary` | `#0063AE` | `brand-600` `#0063AE` | ✓ |
| `accent` | `#008DBF` | `brand-500` `#008DBF`, pero el acento vivo canónico es `mint` = `brand-400` `#00B5C5` (`DESIGN.md:47`) | ~ parcial |
| `success` | `#047857` | `success` `#10b981` (`:39`, `:1073`) | ✗ |
| `warning` | `#B45309` | no existe token `warning` | **INVENTADO** |
| `error` | `#BA1A1A` | `error` `#ba1a1a` | ✓ |
| `text` | `#1A1A1A` | `ink` `#000000`; `#1A1A1a` es `surface-card` en `.dark` | ✗ |
| `muted` | `#5B6770` | `storm` `#677381` | ✗ |
| `border` | `#CBD5DC` | `surface-raised` `#e8ecf0` / `storm` `#677381` | ✗ |
| radius | `4 / 8 / 12 / 9999 px` | `6 / 10 / 16 / 24 / 9999 px` (`:97-101`) | ✗ (3 de 4) |
| type scale | `.75 .875 1 1.125 1.5 2 rem` | `hero 3.5 / h1 2.25 / h2 1.75 / h3 1.25 / … / eyebrow .6875` (`:75-83`) | ✗ arriba de `lg`: `xl`/`2xl` no existen, `h1`-`h3` sin token |
| spacing | `4 8 12 16 24 32 px` | `4 8 16 24 32 48 64` (`:89-95`) | ~ el `12px` es inventado, faltan 48/64 |

**Lo que sí está bien:** la aritmética de contraste es real, no decorativa. Verifiqué los ratios: `#FBF8F5` vs `#1A1A1A` = 16.45:1 ✓, `#0063AE` on white = 6.18:1 ✓, `#008DBF` on white = 3.78:1 ✓ y `#1A1A1A` sobre `#008DBF` = 4.61:1 ✓, `#047857` on white = 5.49:1 ✓. Los cálculos son correctos; **los valores base son los que no coinciden con el sistema canónico**.

---

## 4. `design-guide.yaml` — schema inválido para su propio CLI

Nueve claves top-level (`project`, `version`, `tokens`, `aesthetic`, `aesthetic_notes`, `palette_intent`, `components_context`, `guides`, `principles`) más 5 anidadas en `guides[0]` (`id`, `description`, `command`, `status`, `compile_notes`) = **14 claves, ninguna aceptada por el CLI**.

El validador real exige `schemaVersion`, `prohibitions`, `signatureElement` y que `tokens` sea un **objeto inline**, no un path. El split en dos archivos (`tokens: ./design.tokens.json`) es justamente lo que el CLI rechaza. **Ninguna de las 14 clases de clave sobrevive la validación.**

Además el `status: active` (`design-guide.yaml:17`) es falso: el gate que declara activo está rojo. Nota honesta del commit: `compile_notes:18-24` advierte que `guide compile` escribe `AGENTS.md` — buena señal de criterio.

---

## 5. `odd/tasks/harness-*.md` — seguimiento real, no documentos vacíos

Los cuatro documentos de Fase 0-3 tienen objetivo, scope autorizado, forecast de líneas, tasks con evidencia, criterios de aceptación, progreso y "siguiente paso". No son plantillas vacías.

- `odd/tasks/harness-core-fase1.md` — el más completo: 6 tasks con evidencia por task (`:13-35`), incluye el hallazgo honesto de T4 ("`opencode.json` NO se tocó, sin cambios necesarios", `:31`). Defecto: el conteo de líneas de T1 (148 vs 73 reales) y el criterio de aceptación `:42` apunta a `.atl/skill-registry.md`, que no está trackeado → inverificable en review.
- `odd/tasks/harness-qa-fase3.md` — bien estructurado y explícito en lo que **no** hizo (`:31`: "No se corrió `guide compile` (escribe AGENTS.md)"). Su punto flojo es la evidencia de T4: `--help` OK no es "el gate funciona".
- `odd/tasks/_triage-fase2.md` — el mejor artefacto del grupo: 40 archivos clasificados con criterio explícito (`:4-9`) y método declarado (`git log -1 --format=%ci`, `git branch --merged main`). Cuadra con el repo: 41 archivos en `odd/tasks/` a `87b3cd7`, 40 sin contar el creado después.
- `odd/tasks/lab-offline-notice.md` — coincide con lo entregado (7 tests, 21 files / 199 tests; verifiqué 21 archivos de test y 7 tests en el archivo). **Pero el criterio `:41` "Usa design tokens, no hardcodea colores" es falso**: el componente hardcodea los hex (`LabOfflineNotice.tsx:11-18`) y solo los comenta.

---

## 6. `package.json` (3fff1dd) — comandos reales, gate roto

Tres scripts (`package.json:21-23`):

- `design:audit` → `npx @design-harness/cli@latest audit --url http://localhost:3000 --out runs/demo`
- `design:check` → `… guide check --guide ./design-guide.yaml --target . --max-tokens 2000`
- `design:compile` → `… guide compile --guide ./design-guide.yaml --target .`

**¿Ejecutan comandos que existen?** Sí. `@design-harness/cli@0.6.4` existe en npm y expone exactamente `audit`, `loop`, `guide compile`, `guide check`; `--max-tokens` es válido en el rango `1..2000` (usaron el máximo). `runs/.gitignore:1-3` (`*` + `!.gitignore`) hace bien su trabajo.

**El problema no es el comando, es el input:** `design:check` y `design:compile` fallan con el `design-guide.yaml` del repo (schema error, exit 1). Decisión de no instalar la CLI como devDependency (`harness-qa-fase3.md:36`) es defendible, pero deja los scripts clavados en `@latest` → no determinista.

---

## 7. `LabOfflineNotice` (87b3cd7) — útil, pero es capacidad, no feature en uso

**Qué hace:** banner accesible (`role="alert"`, `aria-live="polite"`, ícono `WifiOff`) que aparece cuando el navegador está offline, con mensaje default en español (`LabOfflineNotice.tsx:21-22`). Helpers puros testeables: `resolveOffline` (`:33-39`, `forcedOffline` gana sobre `navigator.onLine`) y `getOfflineMessage` (`:25-27`, fallback en input vacío). Cleanup de listeners correcto (`:66-69`).

**Dónde se usa:** exportado en `src/components/lesson/index.ts:33` y mapeado en el `components` map de `page.tsx:175`. Eso lo habilita para **cualquier** `lesson.md`… pero **ningún `lesson.md` lo invoca**. El `[harness demo]` del mensaje es honesto: es una demo de validación del harness, no una feature de producto entregada.

**¿Sirve para el hallazgo "labs requieren red"?** Parcialmente. El hallazgo real (`AGENTS.md:95`, `pyodide-lab-contract:49`) es que Pyodide carga desde jsdelivr + micropip desde PyPI. `navigator.onLine === false` solo detecta "sin red del SO"; **no detecta CDN caído, DNS roto ni error del worker**, que son los casos que realmente rompen un lab. Además `PyodideRunner` ya lanza `PyodideOfflineError`, así que hay dos caminos offline sin unificar. Una mejora de valor real sería suscribirse al estado del singleton `pyodideWorker` (evento `error`) y mostrar este mismo banner.

**El test (45 líneas, 7 casos):** pasa conceptualmente. Node env sin DOM, ejercita los helpers puros + `typeof LabOfflineNotice === "function"` (`:12-15`). Es honesto sobre su límite: **no prueba render** (no hay jsdom, por diseño del repo). Casualidad numérica: el archivo declara 7 tests y contiene exactamente 7 `it(...)`.

**Detalle de UX:** usa `TOKENS.bg = #FBF8F5` como fondo de la alerta, o sea el mismo color del canvas de página. Un aviso debería diferenciarse del fondo; con `border #CBD5DC` (1.41:1, decorativo según su propio JSON) la tareta casi no se recorta.

---

## 8. Valor real para la plataforma vs. ceremonia de agente

**Valor real (quedátelo):**
1. `mdx-lesson-authoring` + `pyodide-lab-contract` — conocimiento tácito del repo que hoy vive solo en cabezas. Es lo que más rendimiento da por prompt.
2. Las 4 skills de workflow — proceso explícito y encadenado, con cruces correctos entre sí.
3. `odd/tasks/_triage-fase2.md` — 40 archivos clasificados con método y evidencia; higiene real de `odd/tasks/`.
4. `52e87fc` — el registro honesto de Fase 0, con la sección de desviaciones que otros commits no tienen.
5. `LabOfflineNotice` — componente chico, accesible, con tests; base reusable si se conecta al estado real del worker.
6. Los scripts `design:*` en `package.json` — apuntan a tooling real; el cableado está bien, el input está mal.

**Ceremonia de agente (coste sin retorno):**
1. `design-guide.yaml` / `design.tokens.json` — 110 líneas que ningún código consume, con 6 colores inventados y un schema que el CLI rechaza. Es el artefacto de más alto coste/beneficio negativo del grupo.
2. El gate `design:check` declarado `active` sin haberlo ejecutado — verificaron `--help` y afirmaron "firmas coinciden". Eso es exactamente el vibecoding que la Fase 0 dice combatir.
3. Los conteos del registry (25→29→33) — inverificables desde el repo (`.atl/` gitignored, y las fuentes escaneadas no incluyen `.agents/skills/` del proyecto).
4. Métricas de evidencia infladas: "148 líneas" vs 73 reales; "usa design tokens, no hardcodea colores" vs hex hardcodeados.
5. `AGENTS.md:91` — quedó con "25 skills" y dos skills inexistentes; el propio `harness-workflow-fase2.md:48` lo marcó como follow-up y no se hizo.
6. `vercel-optimize` — skill de auditoría de costos para un proyecto sin tráfico medible todavía.

---

## 9. Recomendación: **pushear selectivo**

**Pusheá (en este orden, como cadena corta):**
1. `52e87fc` + `6abcc5e` **sin cambios** — skills de workflow + triaje + registro honesto de Fase 0. El de mayor valor y el de menor riesgo.
2. `d45d72a` **modificado**: quédate las 4 skills; **sacá `design.tokens.json` y `design-guide.yaml`** de este commit (o movélos a uno propio con los valores corregidos). Antes de commitear, corregí los 6 valores que contradicen `DESIGN.md` (`success`, `text`, `muted`, `border`, `warning`, `bg`), los radii (4/8/12 → 6/10/16) y la escala de tipo, y arreglá el conteo de líneas en `harness-core-fase1.md:17`.
3. `87b3cd7` **modificado**: el componente y el test están bien. Sacá el `[harness demo]` del subject si va a main como feature, o dejalo si va a una rama de demo. Ideal: conectalo al estado del worker (`error` event) para que cubra el caso real, y usá un fondo que se recorte del canvas.
4. `3fff1dd` — **NO lo empujes todavía**. Requerido antes: reescribir `design-guide.yaml` al schema real (`schemaVersion`, `prohibitions`, `signatureElement`, `tokens` como objeto inline) y **ejecutar `npm run design:check` hasta ver exit 0**. Sin eso, el commit agrega un gate rojo y una mentira en `AGENTS.md:108-110`.

**Archivá aparte:** `design-guide.yaml` + `design.tokens.json` tal como están (en una rama `harness/design-tokens-wip`), más los conteos de registry como evidencia no verificable. Sirven como boceto; no como contrato activo.

**Deuda a anotar en el PR (no bloquea):** `.agents/` gitignore + `git add -f`; `AGENTS.md:91` stale (25 skills, skills inexistentes); `AGENTS.md:96` manda instalar skills nuevas en `.opencode/skills/` mientras estas 8 viven en `.agents/skills/` — decidan una sola convención.
