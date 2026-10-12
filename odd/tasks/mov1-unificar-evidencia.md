# MOV 1 — Unificar evidencia (harness + audit-visual)

**Objetivo:** Un canal `runs/*` para todo: harness determinístico (`runs/demo`) + capturas manuales preview (`runs/audit-visual`). Sin duplicar ni pisar al otro agente.

**Problema:** `audit-visual/` con 42 PNG en raíz (untracked, sin .gitignore, sin manifest) vs `runs/demo/{audit.json,report.md,screenshots/}` determinístico con `design-guide.yaml:29-31` activo. Dos evidencias paralelas, ninguna diffable junta.

**Scope autorizado:** Solo mover + gitignore + design-guide.yaml. No tocar `src/app/preview/lesson/`, no tocar `Modules`/`OrbitalModules`, no tocar lógica.

**Forecast:** ~20 líneas autoras + moves. Estrategia: `single-pr`.

## Tasks

- [x] **T1 — Mover audit-visual a runs/** — `mkdir -p runs/audit-visual && mv audit-visual/*.png runs/audit-visual/ && rmdir audit-visual` (si `audit-visual` está vacío). Verificar `ls runs/audit-visual/ | wc -l` = 42. Como `runs/.gitignore` ya tiene `*` + `!.gitignore`, todo bajo `runs/` queda ignorado automáticamente — no hace falta tocar `.gitignore` raíz para `audit-visual/`, pero agregar `audit-visual/` a `.gitignore` como fallback si el otro agente lo recrea.
  - **Evidencia:** `ls runs/audit-visual/ | wc -l` = 42; `ls audit-visual` → No existe. `git check-ignore -v runs/audit-visual/step-00.png` → `runs/.gitignore:2:*`; ídem `ia-L1-s01.png`. Fallback agregado en `.gitignore:54` (`audit-visual/` bajo `# Local AI runtime state`); `git check-ignore -v audit-visual/step-00.png` → `.gitignore:54:audit-visual/`.

- [x] **T2 — Design guide segundo audit** — En `design-guide.yaml` agregar segundo guide bajo `guides:`:
  ```yaml
  - id: lesson-preview-audit
    description: Lesson preview visual QA — mismo contrato determinístico pero sobre /preview/lesson sin auth
    command: "npx @design-harness/cli audit --url http://localhost:3000/preview/lesson/ia/lesson01_what_is_ai --out runs/lesson"
    status: active
  ```
  Mantener el existente `design-harness-audit` intacto. Verificar que `design-guide.yaml` sigue parseando.
  - **Evidencia:** YAML parsea con `node`/`yaml` → `guides: 2` → `design-harness-audit [active] | lesson-preview-audit [active]`. Primer guide (líneas 14-24) byte-idéntico, sin tocar `compile_notes`.

- [x] **T3 — Verificar ignore** — `git check-ignore -v runs/audit-visual/step-00.png` debe dar `runs/.gitignore:1:*` y `git check-ignore -v audit-visual/step-00.png` (si queda) debe dar `.gitignore`. `git status --porcelain` no debe mostrar PNGs.
  - **Evidencia:** `runs/.gitignore:2:*` para ambos PNGs en `runs/audit-visual/`; `.gitignore:54:audit-visual/` para el path raíz (fallback). `git status --porcelain | grep -E "audit-visual|runs/demo|runs/lesson"` → sin matches (0 PNGs visibles).

- [x] **T4 — Verification** — `npm run type-check` + `npm run test` verdes. `cat design-guide.yaml` muestra 2 guides activos. `ls runs/audit-visual/ | wc -l` = 42.
  - **Evidencia:** `npm run type-check` → exit 0, sin errores. `npm run test` → `Test Files 21 passed (21)`, `Tests 199 passed (199)`. `design-guide.yaml` → 2 guides activos parseando. `ls runs/audit-visual/ | wc -l` = 42; `ls audit-visual` → No existe.

## Criterios de aceptación

- [x] `runs/audit-visual/*.png` con 42 archivos, `audit-visual/` en raíz vacío o no existe
- [x] `design-guide.yaml` con 2 guides (`design-harness-audit` + `lesson-preview-audit`)
- [x] `git status` no muestra PNGs (ignorados)
- [x] type-check + test verde

## Progreso

- 2026-10-12: Creado.
- 2026-10-11: T1-T4 completos (writer MOV1). Movido `audit-visual/` → `runs/audit-visual/` (42 PNGs), fallback `audit-visual/` en `.gitignore:54`, segundo guide `lesson-preview-audit` en `design-guide.yaml` (2 activos, parsea), type-check y tests verdes (21/199).

## Evidencia

- Commits: (pendiente — el parent orquesta el commit del work unit)

## Coordinación

- No toca código del preview. El otro agente puede seguir creando PNGs — ahora caerán en `runs/audit-visual/` (si usa nuevo path) o quedarán ignorados en raíz.
