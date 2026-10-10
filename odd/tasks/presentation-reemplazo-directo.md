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

- [ ] **T2 — DialogueBox anime speech** — Nuevo `src/components/lesson/presentation/DialogueBox.tsx` evoluciona `MascotMessage.tsx` a speech box estilo visual novel (tail, avatar cientifico + Coni), typing opcional 35ms, respeta `prefers-reduced-motion`, props `speaker|mood|lines|onNext`. Estilos en `globals.css` reusando tokens `comic/bubble/hud`. Route: delegated

- [ ] **T3 — RevealSequence click-to-reveal** — Nuevo `src/components/lesson/presentation/RevealSequence.tsx` wrapper que revela `children` 1 a 1 con click, animacion `reveal-up` + indicador pulso "Click para continuar", prop `blockOnQuiz` pausa hasta `onCorrect`, respeta reduced-motion. Route: delegated

- [ ] **T4 — ChoiceQuestion sistema respuestas preestablecidas** — Nuevos `src/components/lesson/presentation/ChoiceQuestion.tsx` + `QuizButton.tsx` + `src/domain/slide.ts` tipos `QuizOption`. Hover sutil (no spoil), click lock revela correcto (verde CheckCircle2) / incorrecto (rojo AlertCircle) + feedback + explanation, integra `useApiClient` -> `/api/v1/progress/reflection` igual que `ReflectionCheck.tsx:36-44`, a11y `role=radiogroup`. Route: delegated

- [ ] **T5 — Integracion + migracion contenido L1 + estilos** — Exportar en `src/components/lesson/index.ts`, mapear en `page.tsx:138-161` `components` map (mantener compatibilidad `MascotMessage`/`ReflectionCheck`/`AnswerReveal`), extender `globals.css` con `.dialogue-tail` etc., migrar `src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md` secciones 1-4 a nuevo formato + glosario hover + traducir `FEATURE_DISPLAY_NAMES` a espanol. Route: delegated

- [ ] **T6 — Verificacion + docs** — `npm run type-check`, `npm run build`, test manual fullscreen/keyboard/mobile/coarse-pointer, a11y check, actualizar `odd/tasks` evidencias y commits. Route: inline

## Authorized Scope
- `src/components/lesson/**`
- `src/domain/slide.ts` (nuevo)
- `src/app/learn/[module]/[slug]/page.tsx`
- `src/app/globals.css`
- `src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md`
- `odd/tasks/presentation-reemplazo-directo.md`

## Acceptance Criteria
- [ ] Leccion abre fullscreen sin toggle, ocupa viewport completo
- [ ] Speech box anime muestra dialogo cientifico con click para avanzar
- [ ] Contenido se revela progresivamente por click, no todo de golpe
- [ ] Preguntas preestablecidas muestran hover y al click feedback correcto/incorrecto + explanation, persisten progreso
- [ ] Teclado completo y reduced-motion respetado
- [ ] `type-check` y `build` pasan
- [ ] No regresion en lecciones no migradas (compatibilidad)

## Applicable Checks
- `npm run type-check` (gate confiable, lint roto)
- `npm run build` (verificacion real segun AGENTS.md)
- Manual: fullscreen, teclado, mobile, a11y

## Progress
- 2026-10-10: Feature doc creado, worktree `feat/presentation-reemplazo-directo` en `../invitro-code-worktrees/presentation-reemplazo-directo`
- 2026-10-10: T1 completado — LessonCarousel reescrito como PresentationShell fullscreen `fixed inset-0`, click-anywhere con closest guard, teclado Space/Enter/→/←/Home/End, ESC noop, progress LabProgress, footer Anterior/Siguiente, CelebrationOverlay intacto, a11y role region + reduced-motion — commit dc2e0d2

## Next Step
- Ejecutar T2 DialogueBox delegated writer en worktree

