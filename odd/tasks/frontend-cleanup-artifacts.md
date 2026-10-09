# Frontend — Limpieza artefactos versiones viejas (PR-C)

## Objetivo
Eliminar código/estilos/assets muertos de versiones previas para reducir bundle, confusión y tokens duplicados.

## Artefactos
- `src/components/dashboard/HeroBanner.tsx:20` branch LegacyStatic + ENV `NEXT_PUBLIC_HERO_FALLBACK`
- `src/components/dashboard/DashboardHero3D.tsx` + `DashboardHero3DWrapper.tsx` (0 callers, legacy 3d-hero)
- `src/components/landing/OrbitalModules.tsx:16` hardcoded MOD-01..04 vs dinámico `getModules()`
- `src/components/gamification/BioreactorProgress.tsx` vs `src/components/dashboard/BioreactorProgress/BioreactorProgress.tsx` duplicado
- `public/favicon-modulo-*.png` duplicados con `.svg`, `public/dashboard/dashboard-fondo-anime.png` (solo LegacyStatic)
- `src/app/globals.css:693` `.command-palette-*` + `.floating-nav` muertos (CommandPalette usa Tailwind)

## Fuera de scope
- Consolidación `learn` vs `laboratorios` vs `proyectos` (requiere decisión producto)
- Trainers no registrados (requiere audit contenido)

## Tasks
- [x] C1 — Eliminar `LegacyStatic` branch + ENV flag + asset `dashboard-fondo-anime.png` si no usado — route: delegated
- [x] C2 — Borrar `DashboardHero3D*` huérfanos + `public/favicon-modulo-*.png` duplicados — route: delegated
- [x] C3 — Refactor `OrbitalModules` a dinámico `getModules()` — route: delegated
- [x] C4 — Podar `globals.css` clases muertas + consolidar Bioreactor a canónico — route: delegated
- [x] C5 — Verificación `type-check` `build` `test` — route: delegated

## Criterios
- [x] No queda referencia a `NEXT_PUBLIC_HERO_FALLBACK` ni `LegacyStatic`
- [x] `DashboardHero3D*` borrados, build sigue verde
- [x] Landing muestra módulos dinámicos (si añades `etica`, aparece)
- [x] `command-palette-*` no rompe UI (ya Tailwind)
- [x] `type-check` + `build` 28 + `test` 92 verdes (142 era forecast antiguo, suite actual 92)

## Branch
`feat/frontend-cleanup-artifacts` desde `main` (o stacked sobre retención si prefieres). Forecast ~150 líneas net -80.

## Siguiente
Done — PR-C completo (4 work-unit commits + verificación)

## Evidencia
- C1 715f470 feat(cleanup): remove LegacyStatic
- C2 64f2623 chore(frontend): remove DashboardHero3D+png
- C3 d13f65d feat(cleanup): OrbitalModules dinámico
- C4 501b56b chore(frontend): prune globals.css + Bioreactor canonical
- C5 type-check PASS, build 28 rutas PASS, test 92/92 PASS

## Heurística
Cada PR slice <400, PR-C es net deletion.
