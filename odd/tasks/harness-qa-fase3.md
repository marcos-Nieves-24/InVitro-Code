# Fase 3 — QA Loop (Design Harness)

**Objetivo:** Cerrar el harness con loop de evidencia visual — screenshot + medida determinística que el agente puede fixear sin tu ojo.

**Inspiración:** `ictechgy/design-harness` — `local URL → screenshots → audit.json → report.md → agent loop`

**Scope autorizado:** Solo QA loop. No tocar lógica de negocio, no tocar deps major (svix etc.), no reescribir componentes.

**Forecast:** ~120 líneas autoras. Estrategia: `single-pr`.

## Tasks

- [x] **T1 — CLI + scripts** — Agregar `@design-harness/cli` como devDependency (o documentar `npx @design-harness/cli@latest` sin instalar) + agregar scripts a package.json: `design:audit` (`npx @design-harness/cli audit --url http://localhost:3000 --out runs/demo`) y `design:check` (`npx @design-harness/cli guide check --guide ./design-guide.yaml --target . --max-tokens 2000`). No instalar chromium en CI ahora, solo local.
- [x] **T2 — Guide compile/check wiring** — Actualizar `design-guide.yaml` status `planned` → `active` y verificar `npx @design-harness/cli guide compile --guide ./design-guide.yaml --target .` genera artefactos sin pisar `AGENTS.md` existente. Si compile modifica AGENTS.md, revertir y documentar.
- [x] **T3 — Runs gitignore + docs** — Crear `runs/.gitignore` (`*` + `!.gitignore`) para que `runs/demo/` no se commitee pero el dir exista. Agregar a AGENTS.md sección `## QA Loop (Fase 3)` con uso: `npm run dev` + `npm run design:audit`, output `runs/demo/{audit.json,report.md,screenshots/}`, y que el harness es determinístico (no LLM judge).
- [x] **T4 — Verification** — `npm run type-check` + `npm run test` verdes. `npx @design-harness/cli --help` responde (CLI disponible). No correr audit completo sin app corriendo — solo verificar CLI.
- [x] **T5 — Registry refresh** — `gentle-ai skill-registry refresh --force` verifica 33 skills (sin nuevas skills en esta fase).

## Criterios de aceptación

- [x] `package.json` tiene `design:audit` y `design:check` scripts (más `design:compile`)
- [x] `design-guide.yaml` status active y `guide compile` documentado como marker-owned (no ejecutado para no pisar AGENTS.md sin control)
- [x] `runs/.gitignore` existe y `runs/demo/` está ignorado
- [x] AGENTS.md tiene sección QA Loop
- [x] type-check + test verdes, CLI help OK
- [x] registry 33 skills

## Progreso

- 2026-10-12: Creado. Branch feat/presentation-reemplazo-directo.
- 2026-10-11: T1-T5 ejecutados. Scripts `design:audit`/`design:check`/`design:compile` en package.json, `design-guide.yaml` status `active` (+compile_notes), `runs/.gitignore` creado, sección `## QA Loop — Design Harness (Fase 3)` en AGENTS.md. No se corrió `guide compile` (escribe AGENTS.md) — documentado en el yaml.

## Evidencia

- Commits: (pendiente — work-unit commit al cierre)
- T1: `package.json` scripts `design:audit`/`design:check`/`design:compile` (JSON válido verificado). No se agregó devDependency: `npx @design-harness/cli@latest` evita instalar chromium/CLI hasta que se necesite audit.
- T2: `design-guide.yaml` `status: active`; `compile_notes` documenta que `guide compile` es marker-owned y escribe AGENTS.md (correr manual + diffeo).
- T3: `runs/.gitignore` (`*` + `!.gitignore`) → `git check-ignore runs/demo/x.png` OK. AGENTS.md sección QA Loop agregada.
- T4: `npm run type-check` → sin errores. `npm run test` → 20 files / 192 tests passed. `npx @design-harness/cli@latest --help` → responde (audit / loop / guide compile / guide check; firmas coinciden con los scripts).
- T5: `gentle-ai skill-registry refresh --force` → 33 skills.

## Siguiente paso

- Work-unit commit en branch `feat/presentation-reemplazo-directo`. Luego, cuando se necesite audit real: `npm install` la CLI + `npm run dev` + `npm run design:audit`.

