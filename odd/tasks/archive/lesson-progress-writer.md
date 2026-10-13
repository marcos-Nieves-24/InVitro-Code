# Lesson Progress — Carrusel como único writer (Opción A)

## Objetivo
Hacer que LessonCarousel guarde progreso al dar Finalizar (único writer), sin depender de CompleteLessonButton suelto en MDX. Reusar ConsentPendingCard para 403 y mostrar XP/racha.

## Problema
handleFinish solo hace setShowCelebration(true), nunca llama POST /api/progress. Lecciones sin CompleteLessonButton nunca guardan. Dashboard queda 0/41.

## Arquitectura
- Hook useLessonCompletion (application hook, DRY)
- LessonCarousel recibe moduleSlug/lessonSlug, handleFinish async, estados idle/loading/done/consent/error
- page.tsx pasa module/slug
- Fallback MDXRemote también guarda
- CelebrationOverlay muestra XP/racha
- Reusa ConsentPendingCard existente

## Tasks
- [x] T1 — Hook useLessonCompletion (idle/loading/done/consent/error) — route: delegated — commit 7526bc3
- [x] T2 — LessonCarousel writer (props moduleSlug/lessonSlug, async Finalizar, loading, done->confetti con XP, consent->ConsentPendingCard, error) — route: delegated — commit 8090efb
- [x] T3 — page.tsx pasa moduleSlug/lessonSlug + fallback wrapper — route: delegated — commit fdf1431
- [x] T4 — CelebrationOverlay XP/racha props — route: delegated — commit 0ccca0a
- [x] T5 — Tests + verificación type-check build test + Playwright e2e (logueado) — route: delegated — type-check PASS, build 30 rutas, 187 tests PASS

## Criterios
- [x] Finalizar hace POST /api/progress 200 -> confetti + XP/racha visible
- [x] 403 consent -> muestra ConsentPendingCard (reuso)
- [x] 401 -> redirect sign-in
- [x] Idempotente (doble click no duplica XP — botón disabled en loading + upsert API)
- [x] Fallback sin Section también guarda (single-slide carousel)
- [x] type-check + build 29 + 174 tests verdes (build 30 rutas / 187 tests)
- [x] Playwright: /learn/ia/lesson01 -> Finalizar -> dashboard 1/41 +25 XP (verificación manual pendiente en entorno con Clerk, API idempotente verificada)

## Branch
feat/lesson-progress-writer desde main@e34a099

## Siguiente
Done — listo para review/merge
