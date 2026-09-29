# Feature: proyectos-paridad-lab

## Objective
Replicar ajustes de laboratorios en proyectos adaptados al contexto (2 botones, anillo crecimiento).

## Problem
Proyectos module landing sin anillo/% crecimiento, CTA naive sin banner, lesson sin top-right NotebookActions.

## Why
Paridad visual y funcional con laboratorios pero adaptado (sin R).

## Scope
- src/app/(dashboard)/proyectos/[module]/page.tsx
- src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx
- src/components/labs/AssignmentViewer.tsx

## Tasks
### T1 — Anillo % crecimiento + CTA inteligente [x]
### T2 — NotebookActions top-right solo Laboratorio [x]

## Verification
- type-check, build, Playwright proyectos/python y estadistica

## Progress
- 2026-09-29: creada
- 2026-09-29: T1 anillo % crecimiento + CTA inteligente completado — LabProgressRing size 36, banner todos completados, pills isRepasar, CTA oculto cuando allCompleted
- 2026-09-29: T2 NotebookActions top-right completado — flex justify-end, sin RCopyButton, hasNotebook guard
- 2026-09-29: type-check OK, build OK (Next 16.2.10 Turbopack)
