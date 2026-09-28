# Fase 2 — Hardening OWASP + Superpowers + CI Security

## Objective
Agregar guardrails que bloquean los fallos más caros del vibecoding antes de producción: OWASP ASI Top 10, supply-chain de skills/MCP, metodología estricta y CI automatizado.

## Problem
Fase 1 instaló base (86 project skills, 102 totales) pero quedan 3 gaps que explotan en semana 3:
- Sin chequeo OWASP agéntico → privilege escalation no detectada (Apiiro +322%)
- Sin verificación de supply-chain → skill maliciosa exfiltra service_role key (Shai-Hulud / s1ngularity 2026)
- Sin harness → one-shot "add billing" genera schemas compitiendo, sin ADR
- Sin CI → security-review depende de que el dev lo ejecute manualmente

## Why
Fase 2 cierra esos gaps con 2 skills OWASP/supply-chain + harness superpowers + GitHub Action. Todo opt-in y reversible, sin tocar `src/` de producto.

## Scope
- Instalar 2-3 skills de `github/awesome-copilot` (agent-owasp-compliance, agent-supply-chain, mcp-security-audit) en `.opencode/skills/`
- Instalar harness `obra/superpowers` (14 workflow skills) en `.opencode/skills/` o `.agents/skills/` según descubrimiento
- Crear `.github/workflows/security-review.yml` con Action oficial `anthropics/claude-code-security-review` (requiere secret `CLAUDE_API_KEY` documentado, no hardcodeado)
- Actualizar `AGENTS.md` §6-7 para referenciar nuevos skills y workflow
- No instalar marketplace central ni superagent MCP (Fase 3)
- Verificación: skill-registry 104+, tsc --noEmit PASS

## Constraints
- .opencode/ y .agents/ están en .gitignore (local state) — skills no se commitean, se reproducen vía docs. Workflow `.github/` SÍ se commitea.
- No hardcodear `CLERK_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `CLAUDE_API_KEY`. Validar con `security-review` antes de merge.
- Conventional commits sin AI attribution
- Node >=20.9, `npm run lint` roto por diseño — no agregar eslint

## Authorized scope
Configuración de skills y CI. Sin cambios de UI/producto salvo AGENTS.md y workflow.

## Tasks

### T1 — Instalar skills OWASP + Supply-Chain (2-3 skills)
- **ID:** T1
- **Route:** delegated (bash + curl)
- **Trigger evidence:** 2-3 SKILL.md + referencias, web fetch
- **Action:** Para cada skill (`agent-owasp-compliance`, `agent-supply-chain`, `mcp-security-audit` como bonus si existe): `curl -fsSL https://raw.githubusercontent.com/github/awesome-copilot/main/skills/<name>/SKILL.md -o .opencode/skills/<name>/SKILL.md`. Verificar `head -5` y `wc -l`.
- **Acceptance:** Directorios existen con SKILL.md válido, descripciones contienen "OWASP ASI", "supply chain", "mcp security". `gentle-ai skill-registry refresh` los lista.
- **Checks:** `ls .opencode/skills/agent-*` ; `grep -i owasp` en SKILL.md

### T2 — Instalar harness `obra/superpowers`
- **ID:** T2
- **Route:** delegated (bash + git sparse / curl)
- **Trigger evidence:** 14 skills + bootstrap, multi-file
- **Action:** Clonar `https://github.com/obra/superpowers.git` shallow a /tmp/superpowers, copiar `skills/*` y lógica de bootstrap a `.opencode/skills/superpowers-*` o `.agents/skills/` según compatibilidad. Si el repo usa estructura `skills/<name>/SKILL.md`, copiar cada una como `superpowers-<name>` para no colisionar. Alternativa: fetch manual si clon falla por tamaño. Documentar instalación en AGENTS.md.
- **Acceptance:** Al menos 7 skills de superpowers visibles (`brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `requesting-code-review`, etc.) con SKILL.md. Registry los detecta.
- **Checks:** `ls .opencode/skills | grep superpowers` ; `head -5` de brainstorming

### T3 — Configurar GitHub Action `claude-code-security-review`
- **ID:** T3
- **Route:** delegated (write 1 file)
- **Trigger evidence:** 1 yaml file, no research
- **Action:** Crear `.github/workflows/security-review.yml` con: `on: pull_request`, `jobs: security-review` usando `anthropics/claude-code-security-review@v1` (o main), inputs `claude-api-key: ${{ secrets.CLAUDE_API_KEY }}`, `comment-pr: true`. Añadir nota en AGENTS.md §6 que requiere secret configurado en repo settings. No hardcodear key. Incluir `permissions: contents: read, pull-requests: write`.
- **Acceptance:** Archivo existe, yaml válido, menciona `CLAUDE_API_KEY` como secret, no contiene key literal. `cat` muestra workflow.
- **Checks:** `cat .github/workflows/security-review.yml` ; `yamllint` si disponible o `python -c "import yaml"`

### T4 — Actualizar AGENTS.md + Verificación
- **ID:** T4
- **Route:** inline (read 1 file + bash)
- **Trigger evidence:** bounded read
- **Action:** Añadir en `AGENTS.md` Anti-Vibe §6 referencia a nuevos skills (`agent-owasp-compliance`, `agent-supply-chain`, `superpowers:*`) y en §7 nota sobre workflow `.github/workflows/security-review.yml` y secret requerido. Ejecutar `gentle-ai skill-registry refresh --force`, contar `ls .opencode/skills | wc -l`, `npx tsc --noEmit`.
- **Acceptance:** AGENTS.md menciona Fase 2 skills y workflow. Registry 104+ (86 +3 +14 ≈103). tsc PASS.
- **Checks:** `grep -i "Fase 2\|superpowers\|owasp" AGENTS.md` ; `gentle-ai skill-registry refresh` ; `ls .opencode/skills | wc -l`

## Progress
- [x] T1 — OWASP + Supply-Chain — 3 skills: agent-owasp-compliance (323 líneas), agent-supply-chain (339), mcp-security-audit (278) → total project 89
- [x] T2 — Superpowers harness — 15 skills: brainstorming (285), writing-plans (204), executing-plans (373), subagent-driven-development (568), test-driven-development (330), etc. → total project 104
- [x] T3 — GitHub Action security-review — `.github/workflows/security-review.yml` creado, yaml OK, usa `anthropics/claude-code-security-review@v1` con `secrets.CLAUDE_API_KEY`, `permissions: contents: read, pull-requests: write`, `if: secrets.CLAUDE_API_KEY != ''`
- [x] T4 — AGENTS.md + verificación — §4 añade supply-chain + CI note, §6 actualiza a "Fase 2: 104 project skills, 120+ totales" + superpowers flow, `gentle-ai skill-registry refresh` → 120 skills (104 project + 16 global), `npx tsc --noEmit` PASS

## Verification evidence
- `gentle-ai skill-registry refresh`: "Skill registry refreshed (120 skills)" (project 104, total 120)
- `ls .opencode/skills | wc -l` = 104
- Spot: `agent-owasp-compliance/SKILL.md` contains OWASP ASI Top 10, `agent-supply-chain` supply chain, `mcp-security-audit` MCP, `brainstorming` superpowers OK
- `cat .github/workflows/security-review.yml` yaml OK (python yaml.safe_load)
- `npx tsc --noEmit` EXIT 0
- Nota: `.opencode/skills` gitignored (local), workflow `.github/` tracked, Fase 2 reproducible vía AGENTS.md §4/§6

## Next step
Fase 2 completa. Próximo: Fase 3 (marketplace central + superagent MCP) solo si equipo >3, o usar nuevos guardrails en próximo feature (ej: pedir `superpowers:brainstorming` para API).

## Commits
- (pendiente) `feat(agents): fase 2 hardening owasp + superpowers + ci security` — AGENTS.md + .github/workflows/security-review.yml + odd/tasks/fase2-*.md

## Delivery strategy
Work-unit commits por tarea (skills son gitignored, solo AGENTS.md + workflow + task doc se commitean). Forecast <400 líneas authored (AGENTS.md + yaml).

## Relevant files
- `AGENTS.md` — guardrails
- `.opencode/skills/` — destino skills (gitignored)
- `.github/workflows/security-review.yml` — CI (tracked)
- `.atl/skill-registry.md` — índice auto-generado (gitignored)
