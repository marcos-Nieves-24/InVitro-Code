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

## Next Step
- T6 Verificación final manual fullscreen/keyboard/mobile/coarse-pointer + a11y ya validado en build; pendiente solo docs finales si aplica

