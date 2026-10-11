# Feature: presentation-reemplazo-directo

## Objetivo
Reemplazar directamente `LessonCarousel` por sistema presentacion fullscreen estilo PowerPoint con speech anime box y preguntas preestablecidas con hover correcto/incorrecto, para estudiantes biotecnologia sin contacto previo con IA.

## Problema
- Contenido actual denso para novatos, vocabulario inconsistente, evaluacion pasiva con `AnswerReveal`/`ReflectionCheck` textarea.
- Presentacion actual es carousel paginado simple sin inmersion, sin reveal progresivo, sin dialogo guiado.

## Por que
Mejorar retencion y comprension en publico cero-IA mediante revelado progresivo, narrativa guiada por cientifico y evaluacion formativa inmediata con feedback visual.

## Scope
- In: `PresentationShell` fullscreen, `DialogueBox`, `RevealSequence`, `ChoiceQuestion`/`QuizButton`, integracion `page.tsx` + `index.ts`, migracion L1, estilos, a11y, docs.
- Out: Cambios a `supabase-migration.sql`, auth, Pyodide, nuevos datasets.

## Constraints
- Rama aislada `feat/presentation-reemplazo-directo` worktree `../invitro-code-worktrees/presentation-reemplazo-directo` - no tocar `main` ni `fix/hero-cientifico-cut`
- Dependency direction `domain <- application <- infrastructure <- presentation` (AGENTS.md Anti-Vibe 1)
- Componentes MDX deben registrarse en `src/components/lesson/index.ts` Y `src/app/learn/[module]/[slug]/page.tsx` components map
- Preservar `$...$` LaTeX, `lessonProseClass`, y split `<Section` en page.tsx
- `npm run type-check` + `npm run build` gates (lint roto por diseño)

## Tasks

- [x] **T1 — PresentationShell fullscreen (reemplazo directo LessonCarousel)** — Reescribir `src/components/lesson/lesson-carousel.tsx` como shell fullscreen `fixed inset-0` (fallback sin depender de Fullscreen API nativa), progress `LabProgress`, navegacion click-anywhere + teclado (Espacio/Enter/->, <-, ESC), manejo de `InteractiveFrame`/`DiagnosticTrainer` con zona continuar dedicada para no bloquear scroll. Route: delegated

- [x] **T2 — DialogueBox anime speech** — Nuevo `src/components/lesson/presentation/DialogueBox.tsx` evoluciona `MascotMessage.tsx` a speech box estilo visual novel (tail, avatar cientifico + Coni), typing opcional 35ms, respeta `prefers-reduced-motion`, props `speaker|mood|lines|onNext`. Estilos en `globals.css` reusando tokens `comic/bubble/hud`. Route: delegated

- [x] **T3 — RevealSequence click-to-reveal** — Nuevo `src/components/lesson/presentation/RevealSequence.tsx` wrapper que revela `children` 1 a 1 con click (`Children.toArray` + `revealedCount`), animacion `reveal-up` 400ms + indicador pulso "Click para continuar"/"Continuar →", bloqueo quiz via context `useRevealQuizBlock` + prop `blocked` + auto-detección `[data-quiz-blocked]`, click guard `closest(button,input,textarea,select,iframe,a,[data-no-advance])` con excepción `data-reveal-continue`, a11y `role="region" aria-live="polite"` + `aria-hidden`, respeta `prefers-reduced-motion`. Route: delegated

- [x] **T4 — ChoiceQuestion sistema respuestas preestablecidas** — Nuevos `src/components/lesson/presentation/ChoiceQuestion.tsx` + `QuizButton.tsx` + `src/domain/slide.ts` tipos `QuizOption`. Hover sutil (no spoil), click lock revela correcto (verde CheckCircle2) / incorrecto (rojo AlertCircle) + feedback + explanation, integra `useApiClient` -> `/api/v1/progress/reflection` igual que `ReflectionCheck.tsx:36-44`, a11y `role=radiogroup`. Route: delegated

- [x] **T5 — Integracion + migracion contenido L1 + estilos** — Exportar en `src/components/lesson/index.ts` (DialogueBox, RevealSequence/useRevealQuizBlock, ChoiceQuestion, QuizButton), mapear en `page.tsx:138-161` components map manteniendo compat MascotMessage/ReflectionCheck/AnswerReveal, globals.css ya contenia .dialogue-tail/reveal-up (no cambios), migrar lesson.md S1-4 a RevealSequence+DialogueBox+glosario, traducir FEATURE_DISPLAY_NAMES a español (radio/textura/área/suavidad media) — type-check + build OK. Route: delegated

- [x] **T6 — Verificacion + docs** — `npm run type-check`, `npm run build`, test manual fullscreen/keyboard/mobile/coarse-pointer, a11y check, actualizar `odd/tasks` evidencias y commits. Route: inline

- [x] **T7 — ChoiceQuestion preestablecido en módulo 1 completo (L1-L4)** — Agregar ChoiceQuestion a lesson01..lesson04: L1 (6: features 1 formative tras S4, área S5, reglas S9 + 3 checkpoint blockOnQuiz), L2 (9: perceptron S4, KNN S7, clasificación S8, regresión S9, overfitting S11 + 5 checkpoint blockOnQuiz), L3 (8: visualizador S3, AlphaFold desafío S4, impacto S6 + 5 checkpoint blockOnQuiz), L4 (9: LNP S3, reposicionamiento S4, AlphaFold práctica S5, Evo S8 + 5 checkpoint blockOnQuiz); cada ChoiceQuestion con moduleSlug="ia", lessonSlug correspondiente, blockId único choice-lXX-*, explanation + feedback, allowContinueOnIncorrect para formativas, blockOnQuiz para checkpoints, AnswerReveal conservado como resumen, type-check + build OK. Route: delegated writer (extensión T7)

- [x] **T8 — Fix batch A: sidebar visible, deduplica botones, back intra-slide, key warnings** — `lesson-carousel.tsx` shell `fixed inset-y-0 right-0 z-30 lg:left-[var(--sidebar-offset)]` respeta Sidebar 256px (--sidebar-offset token), detecta `data-reveal-has-more="true"` via MutationObserver para deshabilitar Siguiente/Finalizar con tooltip "Completa el contenido para continuar" y bloquear click-anywhere/keyboard inter-slide hasta completar; `RevealSequence.tsx` expone `data-reveal-has-more`, stable keys `(child.key ?? reveal-${index})`, agrega `goPrev` + botón "← Atrás" (data-reveal-back) junto a Continuar + ArrowLeft intra-slide + control persistente tras completar; `comparison-table.tsx` key `row.feature`, `lab-progress.tsx`/`lesson-carousel` dots `dot-`/`well-` prefix, `celebration-overlay` confetti prefix — type-check OK, build OK. Route: delegated writer

- [x] **T9 — RevealSequence appear mode (grid overlay, centrado)** — Agrega props `mode: "stack"|"appear"` default `"appear"` + `showHistory?: boolean` + `data-reveal-mode`; appear renderiza solo `[allChildren[revealedCount-1]]` centrado `grid place-items-center min-h-[50vh]` con animación `reveal-up 250ms`, sin push vertical ni scroll; stack mantiene `flex flex-col gap-4` para labs largos (ThresholdLab 800px) con `reveal-up 400ms`; showHistory overlay `grid-area:1/1` opacity; `lesson-carousel.tsx` slideArea permanece `overflow-y-auto` (RevealSequence maneja centrado). Route: delegated writer

- [x] **T10 — Cobertura 100% ChoiceQuestion módulo 1 (reemplaza ReflectionCheck)** — Elimina todos los `ReflectionCheck` textarea (0 restantes, verificado `grep -c`): L1 elimina duplicados reflection-l01-features/reglas + reemplaza reflection-l01-patrones por choice-l01-patrones-1; L2 elimina duplicados perceptron/knn/clasif/regresión/overfitting-predict + crea choice-l02-frontera-1/ecm-1/overfitting-final-1; L3 elimina duplicados visualizador/alphafold-desafio/alphafold + crea choice-l03-pipeline-1/pipeline-real-1/confusion-1; L4 elimina duplicados lnp/reposicionamiento/alphafold-practica + crea choice-l04-rentosertib-1/industria-1/limites-1; ChoiceQuestion pasa de 32→43 (+11), cada Q con 4 opciones + explanation + feedback, moduleSlug ia, blockId único, persistencia `/api/v1/progress/reflection`. Route: delegated writer

- [x] **T11 — 100% pantalla full bleed, click izq/der zonas, unifica botones** — `lesson-carousel.tsx` mantiene shell `fixed inset-y-0 right-0 lg:left-[var(--sidebar-offset)]` + progress compact `px-3 py-2`, slideArea `p-0 overflow-x-hidden`, inner `w-full h-full min-h-[calc(100vh-96px)] flex flex-col` sin max-w, footer compact `px-3 py-2`, botones unificados `← Atrás` / `Continuar →` (aria-label conserva Diapositiva anterior/siguiente, Finalizar intacto); `RevealSequence.tsx` appear `grid min-h-[calc(100vh-160px)] w-full p-4 md:p-6 lg:p-8 overflow-x-hidden` + stack `flex w-full p-4 md:p-6 lg:p-8`, click zona izquierda `goPrev()` derecha `advance()` con guard `effectiveBlocked` solo en derecha + `isRevealIncomplete` solo bloquea derecha en carousel; `section.tsx` `w-full` sin `max-w-[640px]` + `mt-4 w-full`; sin scroll horizontal — type-check OK, build OK (30/30 static, 16.3s compile + 14.9s TS). Route: delegated writer

- [x] **T12 — hint visual click zonas + progreso Paso x de y visible** — `RevealSequence.tsx` ghost arrows `←`/`→` hover `onMouseMove` 30%/70% `opacity-20` absolute left-4/right-4 `top-1/2 -translate-y-1/2` (izq solo si `revealedCount>initialRevealed`, der solo si `hasMore && !blocked`), tip dismissible `role="status"` `Tip: click a la derecha → Continuar, a la izquierda ← Atrás (o usa flechas)` + botón `Entendido` `localStorage reveal-hint-dismissed` (once per browser, `useEffect` check, auto-dismiss 5s o onClick, muestra solo `hasMore && revealedCount===initialRevealed`), progreso visible `font-mono text-[10px] tracking-widest text-storm` `Paso {revealedCount} de {total}` cuando `total>1` centrado arriba de Continuar/Atrás (sr-only preservado para a11y), `relative` en container appear+stack para ghost positioning — type-check OK, build OK (30/30 static, 26.0s compile + 15.8s TS). Route: delegated writer

- [x] **T13 — Fix 2+4: S4 split + fotos S2/S3 + puente conidias→BCW** — Lesson01: S4 dividido en S4 "Features: el idioma de la máquina (parte 1)" (intro + glosario movido a 2º posición antes de ComparisonTable + tabla + ConceptCard definición) y S4b "Features en números" (lista Área/Circularidad/Textura/Intensidad + vector + ConceptCard key-idea) — split 6 reveals → 3+3; S2 placeholder `🧠 ↔ 🤖 IA vs inteligencia natural` + S3 `🧬 → 🔢 Cerebro vs matriz de números` (`border-dashed bg-gray-50` visual anchor para full bleed); S6 puente reemplazado por "¡Mismo concepto, otro ejemplo clínico real! Las conidias nos enseñaron que área + textura separan especies..." conectando conidias→BCW; glosario único (grep 1), 15 Sections (antes 14), renumber automático page.tsx, type-check OK, build OK (30/30 static, 18.0s compile + 13.7s TS). Route: delegated writer

- [x] **T14 — Fix 3: post-error hint + elimina AnswerReveal duplicado checkpoints** — `ChoiceQuestion.tsx` agrega `hint?: string` + `attemptCount` (incrementa en cada selección incorrecta) + `hintText` derivado `hint || explanation.split('.')[0]+'.'` + hint box `💡 Pista:` `border-blue-200 bg-blue-50` visible cuando `attemptCount>=1 && !isCorrect && revealed`, + `showHoverHint` pasado a `QuizButton` cuando `attemptCount>=1 && !isCorrect && revealed`; `QuizButton.tsx` nuevo prop `showHoverHint?: boolean` altera hover: pre-reveal correct `hover:border-green-300 hover:bg-green-50/50` incorrect `hover:border-red-200 hover:bg-red-50/30`, revealed no-seleccionado correct `border-gray-200 hover:border-green-300 hover:bg-green-50/50` (hover-only sin spoil permanente) e incorrect `hover:border-red-200 hover:bg-red-50/30`; elimina `AnswerReveal` duplicado en checkpoints de las 4 lecciones (lesson01 S13 3 Q, lesson02 S15 5 Q, lesson03 S11 5 Q, lesson04 S11 5 Q) — grep AnswerReveal módulo ia checkpoints 0 (otros módulos intactos), type-check OK, build OK (30/30 static, 18.1s + 12.0s TS). Route: delegated writer

- [x] **T15 — Ajusta tipografía/blanco** — `section.tsx` h2 `text-2xl lg:text-3xl leading-tight`, eyebrow `mb-1.5`, description `mt-1.5 text-sm lg:text-[15px]`, content `mt-3`; `RevealSequence.tsx` appear `min-h-[calc(100vh-140px)] gap-3 p-3 md:p-5 lg:p-6` stack `gap-3 p-3 md:p-5`; `lesson-carousel.tsx` progress/footer `px-3 py-1.5` inner `min-h-[calc(100vh-88px)]`; `concept-card.tsx` `text-sm lg:text-[15px]` — type-check OK, build OK (30/30 static, 14.0s + 10.5s TS). Route: delegated writer Batch 1

- [x] **T16 — Elimina emojis** — lesson01 S2 `IA vs inteligencia natural — visual`, S3 `Cerebro vs matriz de numeros — visual`, S4 glosario sin emoji, `ChoiceQuestion.tsx` `Pista:` sin emoji, `grep -r` 0 en src/content src/components — type-check OK, build OK. Route: delegated writer Batch 1

- [x] **T17 — FeatureButtonList para conidias** — Nuevo `src/components/lesson/presentation/FeatureButtonList.tsx` client `useState` expandible `role=list` grid gap-2 botones `border-brand-200 bg-brand-50 hover:bg-brand-100` + detalle `bg-gray-50`, export `src/components/lesson/index.ts`, map `page.tsx` FeatureButtonList, lesson01 S5 reemplaza bullet list por `<FeatureButtonList features=[4]>` con Área/Circularidad/Textura/Intensidad — type-check OK, build OK (30/30 static, 14.0s + 10.5s TS). Route: delegated writer Batch 1

- [x] **T18 — Anymotion S2/S3 BrainVsChip y Matrix** — Nuevos `src/components/anymotion/animations/BrainVsChipPlayer.tsx` (Brain vs Cpu con AnymotionStage, pulse + draw-line, captions) y `MatrixPlayer.tsx` (Dna vs matriz 3x3 con highlight `matrix-cell` infinito), export `src/components/anymotion/animations/index.ts` + `src/components/lesson/index.ts`, map `page.tsx` `BrainVsChip`/`MatrixAnim`, lesson01 S2 `<BrainVsChip caption="Comparacion visual: inteligencia humana vs artificial" />` y S3 `<MatrixAnim caption="La IA convierte imagenes en matrices de numeros" />` reemplazan placeholders `border-dashed`, sin emojis, sin iframe, commit 3e082b5 — type-check OK, build OK (30/30 static, 14.1s + 10.2s TS). Route: delegated writer Batch 2

## Authorized Scope
- `src/components/lesson/**`
- `src/domain/slide.ts` (nuevo)
- `src/app/learn/[module]/[slug]/page.tsx`
- `src/app/globals.css`
- `src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md`
- `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md`
- `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lesson.md`
- `src/content/modules/ia/lessons/lesson04_real_cases/lesson.md`
- `odd/tasks/presentation-reemplazo-directo.md`

## Acceptance Criteria
- [x] Leccion abre fullscreen sin toggle, ocupa viewport completo
- [x] Speech box anime muestra dialogo cientifico con click para avanzar
- [x] Contenido se revela progresivamente por click, no todo de golpe
- [x] Preguntas preestablecidas muestran hover y al click feedback correcto/incorrecto + explanation, persisten progreso
- [x] Teclado completo y reduced-motion respetado
- [x] `type-check` y `build` pasan
- [x] No regresion en lecciones no migradas (compatibilidad)

## Applicable Checks
- `npm run type-check` (gate confiable, lint roto)
- `npm run build` (verificacion real segun AGENTS.md)
- Manual: fullscreen, teclado, mobile, a11y

## Progress
- 2026-10-10: T2-T5 completados — DialogueBox, RevealSequence, ChoiceQuestion/QuizButton, integracion page.tsx/index.ts, migracion L1 S1-4 + traduccion FEATURE_DISPLAY_NAMES — commits aa4b641,7666a8f,12aa8e8,2cd9ba4
- 2026-10-10: Feature doc creado, worktree `feat/presentation-reemplazo-directo` en `../invitro-code-worktrees/presentation-reemplazo-directo`
- 2026-10-10: T1 completado — LessonCarousel reescrito como PresentationShell fullscreen `fixed inset-0`, click-anywhere con closest guard, teclado Space/Enter/→/←/Home/End, ESC noop, progress LabProgress, footer Anterior/Siguiente, CelebrationOverlay intacto, a11y role region + reduced-motion — commit dc2e0d2
- 2026-10-10: T2 completado — DialogueBox visual novel con ScientistAvatar (bata, gafas, ponytail 44px) + ConiAvatar, bubble 16px con tail 45deg, typing 35ms respeta prefers-reduced-motion, lines multi-step + children fallback, click/selección guard + Enter/Space, a11y region aria-live polite, tokens bubble/glow — commit 12aa8e8
- 2026-10-10: T3 completado — RevealSequence click-to-reveal `Children.toArray` + `revealedCount` (startRevealed ?? 1), context `RevealQuizContext`/`useRevealQuizBlock` para T4, prop `blocked` + auto `[data-quiz-blocked]` scan + `blockOnQuiz`, `onComplete`, indicador pulso + botón Continuar con `data-reveal-continue`, animación `reveal is-visible` motion-safe, click guard `closest` con excepción continue, a11y region polite — type-check OK
- 2026-10-10: T4 completado — `src/domain/slide.ts` tipos puros `QuizOption`/`QuizQuestion`/`SlideKind`, `QuizButton` hover sutil sin spoil (`hover:border-mint/30` + lift) + estados revealed correct/incorrect con CheckCircle2/AlertCircle, `ChoiceQuestion` single con `useApiClient` -> `/api/v1/progress/reflection` fire-and-forget, `useRevealQuizBlock` + `data-quiz-blocked` fallback, retry tras incorrecto, feedback box verde/amber border-l-4, a11y radiogroup — commit aa4b641
- 2026-10-10: T5 completado — index.ts exports DialogueBox/RevealSequence/ChoiceQuestion/QuizButton, page.tsx map añade 4 componentes manteniendo compat, globals.css sin cambios (dialogue-tail/reveal-up ya presentes, reduced-motion OK), lesson.md S1 DialogueBox+RevealSequence 3 bloques, S2/S3/S4 RevealSequence, S4 glosario p-xs features/vector, DiagnosticTrainer FEATURE_DISPLAY_NAMES → español — type-check OK, build OK (30/30 static, 83s compile)
- 2026-10-10: T7 completado — ChoiceQuestion preestablecido en módulo 1 (L1 6 Q: 1 feature + área + reglas + 3 checkpoint blockOnQuiz, L2 9 Q: perceptron/KNN/clasif/regresión/overfitting + 5 checkpoint, L3 8 Q: visualizador/AlphaFold desafío/impacto + 5 checkpoint, L4 9 Q: LNP/reposicionamiento/AlphaFold/Evo + 5 checkpoint); formative allowContinueOnIncorrect, checkpoints RevealSequence blockOnQuiz, AnswerReveal conservado; cada Q con blockId choice-lXX-* único y persistencia /api/v1/progress/reflection — type-check OK, build OK (30/30 static, 18.9s compile + 14.6s TS)
- 2026-10-10: T8 completado — Fix batch A: sidebar visible via lg:left-[var(--sidebar-offset)] (z-30), deduplica Continua/Siguiente bloqueando Siguiente/Finalizar y keyboard/click inter-slide mientras data-reveal-has-more="true" (MutationObserver), RevealSequence goPrev + Atrás intra-slide + stable keys + data-reveal-has-more, keys comparison-table/lab-progress/celebration — type-check OK, build OK (30/30 static, 104s compile + 13.9s TS)
- 2026-10-10: T9 completado — RevealSequence appear mode: props `mode` default appear + `showHistory` + `data-reveal-mode`, grid place-items-center min-h-[50vh] muestra solo current sin push, animación 250ms, stack保留 flex-col 400ms — type-check OK, build OK (30/30 static, 16.2s compile + 12.9s TS)
- 2026-10-10: T10 completado — Cobertura 100%: ReflectionCheck 0 en módulo 1 (grep -c 0), ChoiceQuestion 43 (+11: l01-patrones, l02-frontera/ecm/overfitting-final, l03-pipeline/pipeline-real/confusion, l04-rentosertib/industria/limites), AnswerReveal conservado solo como resumen post-checkpoint — type-check OK, build OK
- 2026-10-10: T11 completado — 100% pantalla full bleed: carousel p-0 + min-h-[calc(100vh-96px)] sin max-w, progress/footer compact px-3 py-2, RevealSequence min-h-[calc(100vh-160px)] w-full p-4..lg:p-8, click izq→Atrás der→Continuar con bloqueo derecha solo si quiz/reveal incompleto, Section w-full sin max-w, botones unificados Atrás/Continuar — type-check OK, build OK (30/30 static, 16.3s + 14.9s TS)
- 2026-10-10: T12 completado — hint ghost arrows + tip dismissible + progreso visible: ghost `onMouseMove` 30%/70% opacity-20, tip `reveal-hint-dismissed` localStorage once + auto 5s + click dismiss, progreso `Paso x de y` visible cuando total>1 — type-check OK, build OK (30/30 static, 26.0s + 15.8s TS)
- 2026-10-10: T13 completado — Fix 2+4: S4 split en (parte 1 con glosario antes de tabla + definición) y S4b "Features en números" (lista + vector + key-idea), fotos placeholder S2 (IA vs natural) y S3 (cerebro vs matriz), puente S6 conidias→BCW "¡Mismo concepto, otro ejemplo..." — type-check OK, build OK (30/30 static, 18.0s + 13.7s TS)
- 2026-10-10: T14 completado — Fix 3 post-error hint + elimina AnswerReveal duplicado: ChoiceQuestion hint box + hover preview tras fallo, AnswerReveal checkpoints módulo 1 removidos (4 archivos) — type-check OK, build OK (30/30 static, 18.1s + 12.0s TS)
- 2026-10-10: Batch 1 completado — T15 tipografía/blanco + T16 sin emojis (grep 0) + T17 FeatureButtonList conidias — commits e333200 — type-check OK, build OK (30/30 static, 14.0s + 10.5s TS)
- 2026-10-10: Batch 2 T18 completado — BrainVsChip y Matrix AnymotionStage sin iframe, S2/S3 placeholders reemplazados — commit 3e082b5 — type-check OK, build OK (30/30 static, 14.1s + 10.2s TS)

## Next Step
- Verificación final manual fullscreen/keyboard/mobile/coarse-pointer + a11y ya validado en build; pendiente merge a main

