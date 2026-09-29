# Feature: lab-workspace-top-actions

## Objective
Mover CTAs de Cuestionario arriba-derecha y unificar botones a 2 primitivas (SlideArrowButton + Button).

## Problem
CTAs de quiz (Verificar/Ver respuestas) estaban abajo con border-t, Recursos saltaba de columna según hasExecutableBlock, 6 lenguajes de botón coexistían.

## Why
Congruencia visual y scan path consistente; acciones visibles sin scroll.

## Scope
- src/components/labs/workspace/LabWorkspace.tsx
- src/components/labs/QuizRunner.tsx
- src/components/labs/NotebookActions.tsx
- src/components/labs/RCopyButton.tsx
- src/components/ui/Button.tsx (referencia, no tocar si no hace falta)

## Tasks
### T1 — Quiz CTAs arriba-derecha sticky [x]
### T2 — Unificar Recursos posición fija [x]
### T3 — Migrar a 2 primitivas [x]

## Verification
- type-check, build, Playwright /laboratorios/machine-learning/lesson01_ml_fundamentals pestaña Cuestionario
