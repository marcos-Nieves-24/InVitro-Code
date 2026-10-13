# LabOfflineNotice — aviso offline para labs Pyodide

**Objetivo:** Componente MDX que avisa cuando el lab no puede correr (offline / worker error) usando design tokens. Demo del harness Fase 1-3.

**Problema:** Hoy `ThresholdLab` y otros labs fallan silenciosamente sin red (Pyodide CDN requiere internet). No hay feedback visual determinístico.

**Scope autorizado:** Solo 1 componente + registro MDX + test + doc breve. No tocar lógica de Pyodide worker, no tocar contenido existente.

**Skills a ejercitar:**
- `pyodide-lab-contract` — detección offline + protocolo worker
- `mdx-lesson-authoring` — registro en `src/components/lesson/index.ts` + `page.tsx` map
- `react-best-practices` — perf, sin waterfalls
- `design.tokens.json` — colores warning/muted, spacing, radius

**Forecast:** ~70 líneas autoras. Estrategia: `single-pr` (demo en branch actual).

## Tasks

- [x] **T1 — Componente** — Crear `src/components/lesson/LabOfflineNotice.tsx`:
  - Props: `message?: string` (default: "Este lab requiere conexión a internet para cargar Python")
  - Usa `navigator.onLine` + listener `online/offline` + opcional prop `forcedOffline` para tests
  - Si offline, renderiza card con `design.tokens.json` colors (warning bg/border, muted text, radius md, spacing 4)
  - Accesible: `role="alert"`, `aria-live="polite"`, ícono lucide `WifiOff`
  - Sin dependencias nuevas, solo `lucide-react` ya instalada y tokens existentes
  - Client component (`"use client"`)

- [x] **T2 — Registro MDX** — Exportar en `src/components/lesson/index.ts` y mapear en `src/app/learn/[module]/[slug]/page.tsx` components map si existe. Verificar que `lesson.md` puede usar `<LabOfflineNotice />`.

- [x] **T3 — Test** — Crear `src/components/lesson/LabOfflineNotice.test.tsx` (vitest node env, sin jsdom):
  - Testea render offline vs online (mock `navigator.onLine`)
  - No requiere DOM real — testea lógica de props y mensaje default

- [x] **T4 — Verification** — `npm run type-check` + `npm run test` verdes. Verificar que no rompe `design.tokens.json` ni `design-guide.yaml`.

## Criterios de aceptación

- [x] Componente renderiza offline/online correctamente
- [x] Registrado como MDX component
- [x] Test verde (node env)
- [x] type-check + 192+ tests verde (ahora 193+ con nuevo test)
- [x] Usa design tokens, no hardcodea colores

## Progreso

- 2026-10-12: Creado. Branch feat/presentation-reemplazo-directo.
- 2026-10-12: T1-T4 completas. `LabOfflineNotice.tsx` (+ helper `resolveOffline`/`getOfflineMessage`), registro en `index.ts` + `page.tsx` map, test node-env `LabOfflineNotice.test.ts` (7 tests). `npm run type-check` limpio; suite completa 21 archivos / 199 tests verde.

## Evidencia

- Commits: (pendiente)
- `npx vitest run src/components/lesson/LabOfflineNotice.test.ts` → 1 file, 7 tests passed
- `npm run test` → 21 files / 199 tests passed
- `npm run type-check` → sin errores

## Siguiente paso

- Commit del work unit. Sin trabajo pendiente en esta feature.
