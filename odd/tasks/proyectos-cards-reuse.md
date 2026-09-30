# Feature: proyectos-cards-reuse

## Objective
Replicar grid LabHistoryCard de laboratorios en proyectos/[module] reutilizando mismo componente.

## Problem
Proyectos muestra pills recortadas slice(0,6) sin fecha ni in_progress; no lee lab_progress.

## Why
Paridad visual y lógica con laboratorios, reutilizando componente.

## Scope
- src/app/(dashboard)/proyectos/[module]/page.tsx
- src/lib/content/modules.ts (getLabResumeTarget already exists)

## Tasks
### T1 — Fetch lab_progress + progressMap [done]
### T2 — CTA inteligente + grid LabHistoryCard [done]

## Verification
- type-check, build, Playwright proyectos/ia y proyectos/python

## Progress
- 2026-09-29: creada
- 2026-09-30: T1+T2 implementados — lab_progress fetch + progressMap + smart CTA + LabHistoryCard grid (paridad laboratorios). type-check y build OK.
