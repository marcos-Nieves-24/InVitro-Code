# Fase 2 — Workflow Superpowers

**Objetivo:** Instalar workflow que evita que el agente salte a codear sin spec, y limpiar deuda de tasks.

**Problema:** `odd/tasks/` con 39 tasks (muchos stale), AGENTS.md referencia `superpowers:*` que no existe como skill, sin proceso `brainstorm → plan → execute`.

**Scope autorizado:** Solo workflow. No tocar lógica de negocio, no tocar deps, no tocar contenido.

**Forecast:** ~400 líneas autoras (4 skills). Estrategia: `single-pr`.

## Tasks

- [x] **T1 — Brainstorming skill** — Crear `.agents/skills/brainstorming/SKILL.md` (adaptado de obra/superpowers + osmontero/opencode-skills). Debe forzar: no codear sin explorar, sacarte el spec en chunks legibles, preguntar 1 cosa a la vez. Frontmatter válido, <120 líneas, triggers claros.
- [x] **T2 — Writing-plans skill** — Crear `.agents/skills/writing-plans/SKILL.md`. Plan que un junior sin contexto pueda seguir: YAGNI, TDD red→green, pasos atómicos. Debe referenciar `mdx-lesson-authoring` y `pyodide-lab-contract` cuando aplique.
- [x] **T3 — Executing-plans + subagent-driven-development** — Crear 2 skills:
  - `.agents/skills/executing-plans/SKILL.md` — ejecución por batches, subagentes, verificación por task
  - `.agents/skills/subagent-driven-development/SKILL.md` — orquestación: 1 orchestrator fino + N workers, `max_threads=4`, worktrees aislados si hay paralelismo real
- [x] **T4 — AGENTS.md workflow wiring** — Reemplazar la línea `superpowers:brainstorming → writing-plans → executing-plans` por sección `## Workflow` que describa el flujo real instalado (brainstorm → plan → execute → verify → archive) y mencione que `odd/tasks/` es la fuente de verdad con `max 400 líneas por task`.
- [x] **T5 — Odd tasks triage** — Auditar `odd/tasks/*.md` (39 files). Marcar stale vs activo sin borrar nada: crear `odd/tasks/_triage-fase2.md` con tabla `task | estado | acción recomendada` (activo / stale / archivar). No borrar archivos, solo clasificar.
- [x] **T6 — Registry + verification** — `gentle-ai skill-registry refresh --force` → 33 skills esperados. `npm run type-check` + `npm run test` verdes.

## Criterios de aceptación

- [x] 4 SKILL.md existen con frontmatter válido y <150 líneas cada uno
- [x] AGENTS.md tiene sección Workflow que reemplaza la referencia rota
- [x] odd/tasks/_triage-fase2.md existe con clasificación de los 39 tasks
- [x] registry lista 33 skills (29 + 4 nuevas)
- [x] type-check + test verdes

## Progreso

- 2026-10-12: Creado. Branch feat/presentation-reemplazo-directo.
- 2026-10-12: T1-T6 completadas (writer delegado). Verificación verde.

## Evidencia

- **T1** — `.agents/skills/brainstorming/SKILL.md` (60 líneas).
- **T2** — `.agents/skills/writing-plans/SKILL.md` (63 líneas; referencia `mdx-lesson-authoring` + `pyodide-lab-contract`).
- **T3** — `.agents/skills/executing-plans/SKILL.md` (59 líneas) + `.agents/skills/subagent-driven-development/SKILL.md` (65 líneas; `max_threads=4`, `max_depth=2`, worktrees bajo `~/proyectos/<repo>-worktrees/`, `.codegraph/` por worktree).
- **T4** — `AGENTS.md`: bullet `superpowers:*` eliminado; sección `## Workflow — Brainstorm → Plan → Execute (Fase 2)` agregada tras `### 7` (antes del bloque managed). Resto intacto.
- **T5** — `odd/tasks/_triage-fase2.md`: 40 archivos `.md` clasificados (8 activo / 3 stale / 29 archivar). Evidencia: `git branch --merged main` + `git log -1 --format=%ci` por archivo + lectura de estado. Nada borrado.
- **T6** — `gentle-ai skill-registry refresh --force` → `33 skills` (4 nuevas indexadas en `.atl/skill-registry.md`). `npm run type-check` PASS (sin salida). `npm run test` → `Test Files 20 passed (20)`, `Tests 192 passed (192)`.
- Commits: (pendiente — work-unit commit del harness workflow).

## Siguiente paso

- Commit work-unit del harness workflow (4 skills + AGENTS.md + triage + registry) y abrir PR single-pr.
- Follow-up menor detectado: `AGENTS.md:91` dice "indexes 25 skills" (stale: hoy son 33). Fuera del scope T4 ("resto intacto") — corregir en el mismo PR o uno aparte.
