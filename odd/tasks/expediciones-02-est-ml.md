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
- [x] **E7 — Verificación + commit final** | S5 | route: parent | evidencia: Sec==Rev en las 20, 0 tablas/sueltos, quizzes ok (ML08/09 con quiz nuevo), type-check verde, assess `passive` wave1+wave2 | status: done (2026-10-16)

## Log

- **L1 (2026-10-16):** "Expediciones 02 (est+ML)" — decisión del usuario ante la brecha T5 (est 107 secciones/2 reveals, ML 95/2, 19 tablas): nueva expedición en vez de cerrar.
- **Evidencia base:** T5 gates verdes (type-check, 223 tests, assets, build); python 149/149 + IA 56/56 canónicos; 0 ReflectionCheck/AnswerReveal en el repo.

## Animaciones explicativas (expedición ANI)

- [x] **AT0 — Primitivo `<EquationTour>` + `<EquationStep>`** | route: parent inline | superficie: `src/components/lesson/presentation/EquationTour.tsx` (nuevo), barrel, mapa MDX | diseño: stepper por pasos con $...$ del pipeline (sin KaTeX en runtime, sin deps nuevas), caption obligatoria, dots + Atrás/Siguiente, sin autoplay (seguro reduced-motion) | status: done (type-check verde)
- [x] **AT1 — Tours est01,02,03** (media-mediana-IQR/Z, curtosis/skew, Bayes) | route: delegated (writer Beam) | status: done (2026-10-16): 2 tours (media/IQR, skew/curtosis) + Bayes 4 steps; type-check + MDX OK
- [x] **AT2 — Tours est04,05,09** (Normal+PMFs, Pearson/Spearman+covarianza, R²/CV) | route: delegated (writer Beam) | status: done (2026-10-16): 4+3+2 tours, MDX OK
- [x] **AT3 — Tours ML02,03,06** (regresión+gradiente+R², sigmoide+log-loss, inercia KMeans) | route: delegated (writer Beam) | status: done (2026-10-16): 3+2+1 tours, Bayes verificado en browser (1/4 → Verosimilitud), 0 errores

## P2 — Players gráficos de algoritmos

- [x] **P2.0 — Integración Overfitting→ML01 + ConfusionMatrix→ML03** | route: parent inline | verifica registro existente, inserta en la sección visual correspondiente | status: pendiente (dentro de B1)
- [ ] **P2.B1 — GradientDescentPlayer + KMeansPlayer** | route: delegated (2 writers paralelos, superficies disjuntas) | superficie: `src/components/anymotion/animations/GradientDescentPlayer.tsx` + `.../KMeansPlayer.tsx` (registro e integración los hace el parent) | contrato: props `{caption: string}`, AnymotionStage 16:9, controles play/pause/scrub o stepper determinista, frame estático con reduced-motion, sin autoplay, caption | status: en curso (2 writers Beam)
- [ ] **P2.B2 — RocBuilder + TreeSplit + integración ConfusionMatrix** | pendiente
- [ ] **P2.B3 — BayesUpdate + DistributionShape** | pendiente
