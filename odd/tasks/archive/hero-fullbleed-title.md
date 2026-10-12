# Feature: hero-fullbleed-title

## Objective
Full-bleed heroes y eliminar título python invitro-code --lab hub.

## Problem
Proyectos hero dentro de max-w-screen-2xl se ve encogido vs Laboratorios full-bleed; HubConsole muestra título no deseado.

## Scope
- src/components/labs/consoles/HubConsole.tsx
- src/app/(dashboard)/proyectos/page.tsx
- src/components/shared/HeroWithConsole.tsx (verificar, no tocar si no hace falta)

## Tasks
### T1 — Quitar título [done]
- HubConsole.tsx:31 `title=""` (empty string, TerminalChrome handles span correctly)
### T2 — Proyectos full-bleed [done]
- proyectos/page.tsx: HeroWithConsole moved outside `max-w-screen-2xl` container to full-bleed parity with laboratorios/page.tsx:104 (`InVitroShell > HeroWithConsole + mx-auto container > #hub`); kept `min-h-[480px]` unchanged

## Verification
- type-check, build, Playwright /laboratorios y /proyectos hero full-bleed
- 2026-09-29: `npm run type-check` PASS, `npm run build` PASS (Next 16.2.10 Turbopack, 21/21 pages)

## Progress
- 2026-09-29: creada
- 2026-09-29: T1+T2 implementados en `odd/lab-heroes-restore` — feat(heroes): full-bleed proyectos hero and remove HubConsole title
