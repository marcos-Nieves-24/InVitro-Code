# Fase 1 — Anti-Vibe Web Skills (Arquitectura / APIs / Seguridad)

## Objective
Instalar base mínima anti-vibecoding para desarrollo web con agentes: arquitectura, frontend, backend, APIs y seguridad, sin incurrir en errores típicos del vibecoding.

## Problem
El repo tiene frontend cubierto (`frontend-design`, `design-system`, `ui-ux-pro-max`) pero carece de guardrails de arquitectura, diseño de APIs y revisión de seguridad. Apiiro 2025 muestra +322% privilege escalation y +153% fallas de arquitectura en código asistido por AI sin estos controles. Context drift en `AGENTS.md` amplifica el daño en semana 3.

## Why
Fase 1 definida en plan aprobado: pack base `farmage/opencode-skills` (66 skills) + 4 skills curados de `awesome-copilot` (`security-review`, `api-design-principles`, `webapp-testing`, `chrome-devtools`) + endurecimiento de `AGENTS.md` adaptado a Next.js 16 / Clerk / Supabase / MDX del proyecto.

## Scope
- Instalar skills en proyecto (`.opencode/skills` o `.agents/skills` según harnés) con pinning reproducible
- No tocar código de producto salvo `AGENTS.md` (append de sección Anti-Vibe) y config de skills
- No instalar plugins npm pesados ni marketplace central (Fase 3)
- Verificación: `gentle-ai skill-registry refresh`, conteo de skills, `npm run type-check`, `npm run build` si aplica

## Constraints
- Node >=20.9 para Next 16 (no romper `npm run lint` — está roto por diseño)
- RLS usa `auth.jwt() ->> 'sub'` — skills de DB deben respetarlo
- Conventional commits sin AI attribution
- Mantener `.atl/skill-registry.md` auto-generado (no editar a mano)

## Authorized scope
Instalación de skills y documentación de agente local. Sin cambios de UI/producto.

## Tasks

### T1 — Instalar pack `farmage/opencode-skills` (66 skills)
- **ID:** T1
- **Route:** delegated
- **Trigger evidence:** 2+ files/dirs (66 SKILL.md + references) + bash install
- **Action:** Clonar `https://github.com/farmage/opencode-skills.git` a /tmp, ejecutar `make install-local` o equivalente (`cp -r skills/* .opencode/skills/` + `cp -r .opencode/commands/*` si existen), validar estructura
- **Acceptance:** `ls .opencode/skills | wc -l` >= 60, cada dir tiene `SKILL.md`, registry ve nuevos skills
- **Checks:** `ls .opencode/skills/<skill>/SKILL.md` spot-check 5 skills; `gentle-ai skill-registry refresh` no error

### T2 — Instalar 4 skills de `github/awesome-copilot`
- **ID:** T2
- **Route:** delegated
- **Trigger evidence:** 4 skills × (SKILL.md + references) = 8+ archivos + web fetch
- **Action:** Para cada skill (`security-review`, `api-design-principles`, `webapp-testing`, `chrome-devtools`): fetch `https://raw.githubusercontent.com/github/awesome-copilot/main/skills/<name>/SKILL.md` (+ referencias si existen vía `gh skill` o raw). Alternativa: `npx skills add github/awesome-copilot --skill <name>` si `skills` CLI está. Instalar en `.opencode/skills/<name>/SKILL.md` (project-local, compartido en repo)
- **Acceptance:** Los 4 directorios existen con SKILL.md válido, descripciones contienen triggers esperados (security scan, REST/GraphQL, Playwright, Chrome DevTools)
- **Checks:** `head -20 .opencode/skills/security-review/SKILL.md` etc.; registry refresh

### T3 — Endurecer `AGENTS.md` (sección Anti-Vibe)
- **ID:** T3
- **Route:** delegated (reads AGENTS.md + vibe-starter-kit principles)
- **Trigger evidence:** lectura de AGENTS.md + escritura de sección (preparation trigger)
- **Action:** Añadir al final de `AGENTS.md` sección `## Anti-Vibe Guardrails (Fase 1)` con: dependency direction (domain→application→infrastructure→presentation), "donde va el código" (mapa de `src/`), contratos/interfaces primero, enums para providers, prohibición de vendor imports en domain/application, testing expectations, y checklist de context update. Adaptado a stack invitro-code (Next 16 App Router, Clerk service-role, Supabase RLS, MDX Section carousel, `@/*`). No reescribir archivo, solo append/augment.
- **Acceptance:** `AGENTS.md` contiene nueva sección, no rompe headers existentes, menciona `auth.jwt() ->> 'sub'` y `lessonNN_` ordering
- **Checks:** `grep -c "Anti-Vibe"` ==1; `npm run type-check` pasa (no afecta build)

### T4 — Verificación y documentación
- **ID:** T4
- **Route:** inline (1-3 files read/check)
- **Trigger evidence:** bounded read + bash state
- **Action:** Ejecutar `gentle-ai skill-registry refresh --force`, contar skills, verificar `opencode.json` descubre skills, `npm run type-check`, spot-check `build` si rápido, crear resumen de instalados
- **Acceptance:** Registry actualizado, T1+T2+T3 verificados, type-check pass
- **Checks:** `gentle-ai skill-registry refresh`, `ls .opencode/skills`, `npm run type-check`

## Progress
- [x] T1 — Instalar pack farmage — 67 skills copiados a .opencode/skills (total 81, luego 86 con T2). Verificado `api-designer`, `security-reviewer` OK. Commit pendiente (skills gitignored, intencional).
- [x] T2 — Instalar 4 skills awesome-copilot + bonus cloud-design-patterns — `security-review` (168 líneas), `api-design-principles` (110), `webapp-testing` (133), `chrome-devtools` (97), `cloud-design-patterns` (62) → total project skills 86
- [x] T3 — Endurecer AGENTS.md — sección Anti-Vibe Guardrails añadida (líneas ~45-110), cubre dependency direction, mapa de capas, contratos, API & RLS (`auth.jwt() ->> 'sub'`), frontend MDX/Pyodide, testing
- [x] T4 — Verificación — `gentle-ai skill-registry refresh` → 102 skills (86 project + 16 user/global), `npx tsc --noEmit` PASS (0 errors), `ls .opencode/skills | wc -l` = 86

## Verification evidence
- `gentle-ai skill-registry refresh`: "Skill registry refreshed (102 skills): .atl/skill-registry.md" (EXIT 0, force también 102)
- `ls .opencode/skills | wc -l` = 86 (14 origin + 67 farmage + 5 curados)
- Spot checks: `head -3` de api-designer, api-design-principles, security-reviewer, security-review OK
- `npx tsc --noEmit` EXIT 0 (full + skipLibCheck)
- Nota: `.opencode/skills` y `.atl/` están en `.gitignore` (local state). Skills no se commitean; se reproducen vía `AGENTS.md` §7 + este task doc. Para compartir en equipo, correr mismos `curl`/`cp` o `make install-local` desde farmage.

## Next step
Fase 1 completa. Siguiente: Fase 2 (hardening web + superpowers) o usar nuevos skills en próximo feature (ej: API con `api-design-principles` + `security-review`).

## Commits
- (pendiente) `feat(agents): fase 1 anti-vibe skills + guardrails` — AGENTS.md + odd/tasks/fase1-anti-vibe-web-skills.md

## Delivery strategy
Single commit por tarea (work-unit commits), branch feature si estamos en main. Forecast <400 líneas (skills son markdown copiado, no código).

## Relevant files
- `AGENTS.md` — reglas de agente y guardrails
- `.opencode/skills/` — destino project-local de skills
- `.atl/skill-registry.md` — índice auto-generado
- `opencode.json` — config descubrimiento skills
