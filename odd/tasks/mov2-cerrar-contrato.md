# MOV 2 — Cerrar contrato MDX + unificar proyección ModuleCard

**Objetivo:** Que la regla "Section = composición de primitives, no prosa corrida" deje de ser doc y pase a ser contrato cobrado por el harness, y que Modules/preview usen una sola proyección canónica.

**Gap:** `expediciones-visual-learning-plan.md:65-67` dice "no prosa corrida" pero `mdx-lesson-authoring/SKILL.md:82-84` solo cubre split/Resumen/LaTeX/registro. `Modules.tsx:8-20` mapea a mano, `preview/cards/page.tsx:18-25` duplica con mock, `OrbitalModules:8` sí usa `buildModuleCardModel`. Tres proyecciones del mismo dominio.

**Scope autorizado:** Solo skill + 2 archivos de proyección. No tocar `RevealSequence`, `AnymotionStage`, `lesson.md` contenido.

**Forecast:** ~60 líneas autoras. Estrategia: `single-pr`.

## Tasks

- [x] **T1 — Skill mdx-lesson-authoring** — Actualizar `.agents/skills/mdx-lesson-authoring/SKILL.md`:
  - Agregar sección `## Section composition contract (MOV2)` con:
    - Una `<Section>` es **composición de presentation primitives** (`DialogueBox`, `RevealSequence`, `ChoiceQuestion`, `AnymotionStage`, `ConceptCard`, etc.), **no prosa corrida** (`expediciones-visual-learning-plan:65`).
    - Si hay prosa, debe estar envuelta en `RevealSequence` o `DialogueBox`, no suelta.
    - Presupuesto visual: `AnymotionStage` `max-h-[calc(100vh-22rem)] max-w-[calc((100vh-22rem)*16/9)]` (ver `e2a0f75` docstring `:22-27` + `:36`).
    - Referenciar `Section` props (`number`, `title`, `eyebrow`, `description` string, `children` ReactNode) — `children` es donde van los primitives.
  - Mantener checklist existente, solo agregar esta sección. Frontmatter intacto.

- [x] **T2 — Unificar proyección ModuleCard** — `src/components/landing/Modules.tsx:8-20` y `src/app/preview/cards/page.tsx:18-25` deben usar `buildModuleCardModel` de `src/domain/module-card.ts` como hace `OrbitalModules.tsx:8`.
  - En `Modules.tsx`: importar `buildModuleCardModel` y reemplazar el `map` manual por llamada a `buildModuleCardModel({ slug, title, description, lessonCount, labCount: slugCount, xpReward, completed: null, total: null })` + `{ ...model, lessons: model.lessonCount, href }` (mapeo `lessons` porque `ModuleData` de `OrbitalModules` no está en superficie de edición).
  - En `preview/cards/page.tsx`: YA usaba `buildModuleCardModel` (líneas 21-30) — verificado, sin cambios. `ModuleCard` recibe `model` uniforme.
  - Verificado que `getLabCardTheme` y `buildModuleCardModel` no colisionan (theme es visual, model es datos).

- [x] **T3 — Verification** — `npm run type-check` verde, `npm run test` verde (21/199). `gentle-ai skill-registry refresh --force` y verificar que `mdx-lesson-authoring` sigue indexada. `grep -n "prosa corrida\|composition contract" .agents/skills/mdx-lesson-authoring/SKILL.md` debe matchear.

## Criterios de aceptación

- [x] Skill con sección composition contract y presupuesto AnymotionStage
- [x] Modules.tsx y preview/cards/page.tsx usan buildModuleCardModel
- [x] type-check + test verde
- [x] skill-registry 33+ skills (ahora 33, con MOV2 sigue 33)

## Progreso

- 2026-10-12: Creado.
- 2026-10-12: T1–T3 completadas. Skill con `## Section composition contract (MOV2)` (línea 87); `Modules.tsx` usa `buildModuleCardModel` con mapeo `lessons: model.lessonCount`; `preview/cards/page.tsx` ya era correcto (sin cambios).

## Evidencia

- Commits: (pendiente — no se commiteó en este writer)
- Verificación:
  - `npm run type-check` → verde (tsc --noEmit sin errores)
  - `npm run test` → 21 files / 199 tests passed
  - `grep -n "composition contract\|no prosa corrida" .agents/skills/mdx-lesson-authoring/SKILL.md` → línea 87 y 89
  - `gentle-ai skill-registry refresh --force` → "Skill registry refreshed (33 skills)"

## Coordinación

- No toca preview/lesson ni RevealSequence. El otro agente sigue en su preview sin conflicto. Si `preview/cards/page.tsx` no existe, reportar y no crear.
