# Fase 1 — Harness Core

**Objetivo:** Instalar el harness que maximiza output por prompt: skills atómicas curadas + design tokens + orquestación afinada. Que no tengas que acordarte del workflow.

**Inspiración:** vercel-labs/agent-skills (skills atómicas) + ictechgy/design-harness (QA loop evidencia) + obra/superpowers (proceso spec→plan→ejecución) + osmontero/opencode-skills (orquestación multi-agente)

**Scope autorizado:** Solo harness core. No tocar lógica de negocio, no tocar deps major, no tocar contenido MDX.

**Forecast:** ~350 líneas autoras. Estrategia: `single-pr` (bajo 400).

## Tasks

- [x] **T1 — Skills atómicas Vercel** — Instalar/curar en `.agents/skills/`:
  - `react-best-practices` (40 reglas Vercel: waterfalls, bundle, server/client perf)
  - `vercel-optimize` (auditoría costo/perf Vercel)
  - Adaptar triggers a tu stack (Next 16 + MDX + Plotly). Cada skill: `SKILL.md` con frontmatter válido, sin duplicar `web-design-guidelines` ya existente.
  - Evidencia: `.agents/skills/react-best-practices/SKILL.md` (8 categorías por impacto, 148 líneas) + `.agents/skills/vercel-optimize/SKILL.md` (audit flow metrics→routes→ranked report). Frontmatter `name`+`description` validado con PyYAML.
- [x] **T2 — Skills propias InVitro** — Crear 2 skills nuevas:
  - `mdx-lesson-authoring` — Contrato `<Section>`, filtro `Resumen`, renumeración, registro en `src/components/lesson/index.ts` + `page.tsx` map, preservación `$...$` LaTeX, orden por dirname `lessonNN_`
  - `pyodide-lab-contract` — Singleton `src/lib/pyodide-worker.ts` ↔ `public/pyodide-worker.js`, `requestId` correlation, CDN deps (numpy preload, sklearn/matplotlib lazy, seaborn micropip), tabs: código→consola→visualización
  - Evidencia: ambos `SKILL.md` creados; contrato derivado de `src/app/learn/[module]/[slug]/page.tsx` y `public/pyodide-worker.js` reales (no inventado).
- [x] **T3 — Design tokens + guide** — Crear `design-guide.yaml` y `design.tokens.json`:
  - Paleta contrast-verified (10 tokens semánticos), type scale, spacing, radius
  - Referencia a `design-harness` CLI (`npx @design-harness/cli audit`) como QA loop futuro (Fase 3)
  - No tocar CSS existente, solo tokens + guide
  - Evidencia: ratios WCAG calculados reales (text 16.45:1, primary 6.18:1, muted 5.48:1; accent 3.78:1 documentado como AA-large/graphics). `design.tokens.json` parsea; `design-guide.yaml` parsea (aesthetic biotech-lab).
- [x] **T4 — Opencode tuning** — Ajustar `opencode.json`:
  - Verificar `gentle-orchestrator` + `gentle-ai-worker/explore/verify` ya OK (no tocar)
  - Agregar `skill-creator` awareness si falta, asegurar `default_agent: gentle-orchestrator`
  - Documentar `max_threads` policy en AGENTS.md si cambia
  - Evidencia: verificado `default_agent=gentle-orchestrator`; `gentle-ai-worker`/`explore`/`verify` existen. Sin cambios necesarios — `opencode.json` NO se tocó (skill-creator ya está en registry, user scope).
- [x] **T5 — AGENTS.md wiring** — Agregar sección breve "Harness Skills" listando las 6 skills (4 existentes+2 nuevas) con triggers. No repetir contenido de SKILL.md, solo índice.
  - Evidencia: sección `## Harness Skills (Fase 1)` agregada antes de Anti-Vibe Guardrails (5 bullets, índice únicamente).
- [x] **T6 — Registry refresh + verification** — `gentle-ai skill-registry refresh --force` y `npm run type-check` + `npm run test` verdes. Verificar registry lista 6+ skills.
  - Evidencia: registry refrescado (25→29 skills); las 4 nuevas listadas con scope `project`. `type-check` limpio; `test` 20 archivos / 192 tests passed.

## Criterios de aceptación

- [x] `.agents/skills/react-best-practices/SKILL.md` y `vercel-optimize/SKILL.md` existen y pasan frontmatter válido
- [x] `.agents/skills/mdx-lesson-authoring/SKILL.md` y `pyodide-lab-contract/SKILL.md` existen con contratos de tu stack
- [x] `design-guide.yaml` + `design.tokens.json` existen y son válidos
- [x] `.atl/skill-registry.md` lista las nuevas skills
- [x] `type-check` + `test` (20/192) verdes

## Progreso

- 2026-10-12: Creado. Branch feat/presentation-reemplazo-directo.
- 2026-10-12: T1-T6 completadas (writer delegado). Verificación verde.

## Evidencia

- Commits: (pendiente — work-unit commit del harness core)
- `gentle-ai skill-registry refresh --force` → 29 skills, 4 nuevas en scope `project`
- `npm run type-check` → sin errores
- `npm run test` → 20 archivos / 192 tests passed

## Siguiente paso

- Commit del harness core (T1-T6). Fase 2 pendiente.
