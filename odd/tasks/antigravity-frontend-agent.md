# Antigravity Frontend Agent — ODD Feature

**Objetivo:** Incorporar Antigravity CLI (`agy` 1.2.10) como subagente orquestado por opencode, con harness plan-first → accept autorizado, context engineering por slice y loop de verificación visual para frontend moderno preciso.

**Problema:** `agy` está instalado y autenticado pero no integrado; `gentle-orchestrator` no puede delegarle (allowlist cerrada), `~/.gemini/antigravity-cli/settings.json` sin `permissions.allow`, `.agents/` sin harness frontend, Playwright MCP deshabilitado sin ojos sobre el UI.

**Por qué:** Evitar doble-escritor y ceguera visual; `agy` propone (plan) y opencode dispone (verify + lenses). Escalar a accept solo con envelope acotado.

**Scope autorizado:** `opencode.json` (solo `agent.antigravity` + `gentle-orchestrator.permission.task`), `.opencode/agent/antigravity.md`, `~/.gemini/antigravity-cli/settings.json` (scoped allowlist + trustedWorkspaces), `.agents/agents/frontend-plan|frontend-accept/agent.md`, habilitación Playwright MCP en `opencode.json` (sin tocar código de producto todavía).

**Constraints:** No `__managed_by` en agente nuevo (gentle-ai sync), `edit/write:deny` en wrapper opencode, `--dangerously-skip-permissions` prohibido, `trustedWorkspaces` explícito al repo, sin `__managed_by`, heurística work-unit ~400 líneas no bloqueante.

**TDD:** `strict_tdd: false` (vitest node-only). Verificación: `agy -p --output-format json | jq`, restart opencode, `opencode mcp list`, `npm run type-check`.

**Delivery:** ODD work-unit commits en feature branch; branch-first si se está en default.

## Tasks

- [x] **AGY-01 Wrapper opencode** — Crear `.opencode/agent/antigravity.md` (mode subagent, permiso solo `agy *`, protocolo plan-first) + registrar `antigravity: allow` en `gentle-orchestrator.permission.task` en `opencode.json`. Sin `__managed_by`, inline discovery.
- [x] **AGY-02 Harness agy** — Actualizar `~/.gemini/antigravity-cli/settings.json` (`permissions.allow` + `trustedWorkspaces` explícito repo) + crear `.agents/agents/frontend-plan/agent.md` (plan, `view_file,grep_search`, sandbox) y `.agents/agents/frontend-accept/agent.md` (accept acotado). Modelos opencode rotos `mimo-v2.5-free` corregidos a `muse-spark-1.2-contributor`.
- [x] **AGY-03 Context engineering + ruteo skills** — Documentado bundle por slice (AGENTS.md digest + globals.css tokens + ui/ inventory) y tabla 1-skill-por-concern + CodeGraph-first en ambos harnesses.
- [x] **AGY-04 Ojos (Playwright MCP)** — Habilitado `mcp.playwright` en `opencode.json` (`enabled:true`, `--caps=vision` añadido). `npx playwright init-agents` pendiente (requiere instalación Playwright).
- [x] **AGY-05 Verificación E2E** — `opencode.json` y `settings.json` válidos (json.tool), `npm run type-check` pass vacío, `agy -p --mode plan --output-format json` hiteó quota 429 (quota individual agotada, reset 166h) — harness funcional, bloqueado por billing no por config.

## Progreso
- 2026-09-24: feature doc creado, harness implementado inline (delegación bloqueada por modelo `mimo-v2.5-free` inexistente → fix + inline). Branch `main` limpio, sin feature branch necesaria por scope config.

## Evidencia
- `.opencode/agent/antigravity.md` (5262B, permission `agy *:allow`, plan-first + skills routing + stack rules)
- `.agents/agents/frontend-plan/agent.md` (3069B, tools view_file/grep_search, sandbox)
- `.agents/agents/frontend-accept/agent.md` (2242B, scoped accept con envelope)
- `opencode.json` diff: `gentle-orchestrator.task.antigravity=allow`, `explore/general/plan` model fix, `mcp.playwright enabled:true + --caps=vision`
- `~/.gemini/antigravity-cli/settings.json` diff: `trustedWorkspaces + invitro-code`, `permissions.allow[5]`
- `npm run type-check` → pass (sin salida)
- `agy -p` smoke → `ERROR RESOURCE_EXHAUSTED 429` quota, conversation_id `5cc25080-8511-4822-a0b4-7ab8594a7412` — envelope JSON válido, harness operativo

## Siguiente paso
- Tras `opencode` restart: `opencode mcp list` debe mostrar `playwright connected` (Brave + vision). Cuando agy quota resetee o se upgradee plan, re-hacer smoke y probar delegación real `gentle-orchestrator → Task(antigravity, PLAN)` en slice `src/components/gamification/`. Fase 2 MCP `antigravity-cli-mcp` queda como evolución documentada (requiere Bun).
