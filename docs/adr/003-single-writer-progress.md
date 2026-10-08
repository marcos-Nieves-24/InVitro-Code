# ADR 003 — Single Writer para Progress

- Fecha: 2026-04-08
- Estado: Accepted
- Revisión: 2027-04-08

## Contexto

Existían dos writers concurrentes para `progress`/`streaks`: Next.js (`/api/progress`) y FastAPI (`/api/v1/progress`). El cliente `CompleteLessonButton` enviaba `moduleSlug`/`lessonSlug` (camelCase) a Next.js vía `apiClient("/api/v1/progress")`, pero el schema de Next.js y FastAPI esperan `module_slug`/`lesson_slug` (snake_case). Resultado: 422 / validación fallida y riesgo de condiciones de carrera en `progress` + `streaks` (doble incremento, freezes inconsistentes).

## Decisión

Next.js como único writer canónico para progress:

- `src/components/CompleteLessonButton.tsx` usa `fetch("/api/progress")` con payload `snake_case` (`module_slug`, `lesson_slug`), normalizando `xp_earned`/`xpEarned` y `streak.current_streak` para el mensaje.
- `backend/app/feature_flags.py` marca `progress` como `RouteBackend.NEXTJS`.
- `backend/app/main.py` no registra `progress.router` cuando `is_migrated("progress")` es falso (`SINGLE-WRITER` comment). FastAPI deja de exponer `/api/v1/progress`.

No se modifica `src/lib/api-client-shared.ts` (usado por otros trainers).

## Consecuencias

Pros:
- Un solo camino de escritura → elimina race/duplicación y diverge de validación.
- Payload consistente `snake_case` → corrige 422.
- Menor superficie de mantenimiento (un schema, un test de contrato).

Contras:
- FastAPI progress queda deshabilitado hasta migración explícita (si se necesita proxy, reactivar flag + validación).
- Cliente deja de usar `useApiClient` en este botón (fetch nativo); leve inconsistencia hasta migrar resto.

## Alternativas consideradas

- Dual-writer con normalización camelCase↔snake_case en ambos backends: más complejidad, no resuelve race.
- Mantener FastAPI writer y deprecar Next.js: requiere mover toda la lógica de `advanceStreak`/`evaluateAchievements` y RLS Clerk; mayor churn.

## Verificación

- `npm run type-check` PASS
- `npm run build` PASS (28 rutas)
