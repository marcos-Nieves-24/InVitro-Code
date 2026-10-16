# Expediciones 02 — estadística + ML a slices didácticas

**Objetivo:** extender el modelo canónico (IA + python) a estadistica (10 lecciones, ~107 secciones, 12 tablas) y machine-learning (10 lecciones, ~95 secciones, 7 tablas).
**Branch:** `feat/expediciones-m1-refactor` · **Delivery:** `feature-branch-chain` (heredada) · **Runner:** `npm run test` (Vitest), gates `npm run type-check` + `npm run build` + `npm run assets:check` · **TDD:** `strict_tdd: false` · **Writer default:** Beam (programado en opencode.json local)

## Specs

- **S1 — Alcance:** `src/content/modules/{estadistica,machine-learning}/lessons/*/lesson.md` (20 lecciones). Los ChoiceQuestion existentes (Q1, blockIds `reflection-*` y `choice-*`) SE PRESERVAN tal cual — el writer los deja intactos y construye alrededor. No tocar trainers/CodeEditor/plotly, lab.md/assignment.md/notebook.ipynb, ni protegidos.
- **S2 — Gramática de slice:** cada `<Section>` envuelta en `<RevealSequence mode="appear">`; prosa → `DialogueBox` (hook clínico/analítico primero); PROHIBIDO `##`/`###` sueltos hijos de RevealSequence; tablas (`InteractiveTable`, crudas, ASCII) → `ConceptCard`+bullets (sin players nuevos; candidatos anotados).
- **S3 — Interactividad sin players nuevos:** reveal paso a paso + quizzes existentes; donde había tabla, la comparación queda en bullets accionables. Players visuales = expedición futura.
- **S4 — Sin regresiones:** frontmatter, títulos, LaTeX `$...$`, code blocks, secuencia y blockIds intactos; type-check verde; MDX compila por bloques.
- **S5 — Verificación por lote:** type-check + MDX compile por archivo en cada writer (foreground, reportado); parent spot-check + 1 commit por wave; assess post-commit.

## Tasks

- [x] **E1 — est01,02,03** | S1-S4 | route: delegated (writer Beam) | evidencia: Sec==Rev (15,14,12), 0 tablas, 0 sueltos, type-check verde | status: done
- [x] **E2 — est04,05,06** | S1-S4 | route: delegated (writer Beam) | evidencia: 11,10,10 Sec==Rev, 0 tablas, type-check verde | status: done
- [x] **E3 — est07,08,09,10** | S1-S4 | route: delegated (writer Beam) | evidencia: 8,9,9,9 Sec==Rev, 0 tablas, type-check verde | status: done
- [x] **E4 — ML01,02,03** | S1-S4 | route: delegated (writer Beam) | evidencia: 16,13,12 Sec==Rev, 0 tablas, type-check verde | status: done
- [x] **E5 — ML04,05,06** | S1-S4 | route: delegated (writer Beam) | evidencia: Sec==Rev (11,9,8), 0 tablas, quizzes preservados, type-check verde | status: done
- [x] **E6 — ML07,08,09,10** | S1-S4 | route: delegated (writer Beam) | evidencia: Sec==Rev (7,7,6,6), 0 tablas, ML08/09 con quiz nuevo (e2-1), type-check verde | status: done
- [ ] **E7 — Verificación + commit final** | S5 | route: parent | status: en curso

## Log

- **L1 (2026-10-16):** "Expediciones 02 (est+ML)" — decisión del usuario ante la brecha T5 (est 107 secciones/2 reveals, ML 95/2, 19 tablas): nueva expedición en vez de cerrar.
- **Evidencia base:** T5 gates verdes (type-check, 223 tests, assets, build); python 149/149 + IA 56/56 canónicos; 0 ReflectionCheck/AnswerReveal en el repo.
