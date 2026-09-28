# Platform Setup Specification

## Purpose

Scaffold the Next.js 15 project with App Router, TypeScript, Tailwind CSS, shadcn/ui, and Vercel deployment config — the foundation all other capabilities build on.

## Requirements

### Requirement: Project Scaffold

El sistema MUST proveer un scaffold Next.js 16 App Router con TypeScript strict, Tailwind CSS v4 y componentes shadcn/ui instalados. El scaffold MUST incluir la capa `@theme` base existente (`ink`, `graphite`, `slate`, `storm`, `fog`, `mint`, `surface`, sombras, duraciones) y la nueva capa de tokens gaming (`--color-comic-*`, `--color-bubble-*`, `--color-hud-*`, `--motion-*`, `--radius-bubble`) documentada como parte del scaffold. El build y el dev server MUST seguir operativos con los nuevos tokens sin regresión.
(Previously: describía solo el scaffold base sin capa de tokens gaming.)

#### Scenario: Build succeeds

- GIVEN un checkout limpio con `npm install` y la nueva capa de tokens presente
- WHEN `npm run build` ejecuta
- THEN el build termina con código 0 y produce `.next/`
- AND no hay errores de Tailwind/Turbopack por tokens desconocidos

#### Scenario: Dev server starts

- GIVEN dependencias instaladas con tokens gaming
- WHEN `npm run dev` inicia
- THEN el servidor escucha en `localhost:3000` y sirve la página del dashboard con los nuevos estilos

### Requirement: Deployment Configuration

The system MUST include Vercel configuration and scripts for production deployment.

#### Scenario: Deploy to Vercel

- GIVEN the repo is linked to Vercel
- WHEN a push to `main` triggers a deploy
- THEN the app is available at the production URL with all routes working

#### Scenario: Missing env vars blocks build

- GIVEN required env vars (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL) are not set
- WHEN `npm run build` executes
- THEN the build fails with a clear missing-env error message
### Requirement: Capa de tokens gaming para hero, burbujas y HUD

El sistema MUST añadir en `src/app/globals.css` una capa `@theme` de tokens gaming: `--color-comic-*` (bg, border, text), `--color-bubble-*` (bubble, highlight), `--color-hud-*` (bg, border), `--motion-bubble-*`, `--motion-hero-*`, `--radius-bubble`, y sus overrides para `prefers-reduced-motion: reduce` que desactiven o reduzcan animaciones de hero y burbujas. Ningún componente nuevo MUST usar hex hardcodeado en lugar de estos tokens; la validación con `validate-tokens.cjs` SHOULD pasar para `src/components/dashboard/*` y `src/components/gamification/*`.

#### Scenario: Tokens gaming disponibles en CSS

- GIVEN `src/app/globals.css` se inspecciona
- WHEN se buscan definiciones `@theme`
- THEN existen `--color-comic-bg`, `--color-comic-border`, `--color-bubble`, `--color-hud-bg`, `--motion-bubble-duration`, `--motion-hero-enter`, `--radius-bubble` (o equivalentes documentados en design.md)

#### Scenario: Componentes usan tokens en lugar de hex

- GIVEN se ejecuta `node .opencode/skills/design-system/scripts/validate-tokens.cjs --dir src/components/dashboard`
- WHEN se reportan valores hardcodeados
- THEN no hay hex literales en `HeroBanner`, `ComicBubble`, `ScientistFigure`, `BioreactorProgress` ni `InVitroShell` HUD

#### Scenario: Modo movimiento reducido mata animaciones gaming

- GIVEN `prefers-reduced-motion: reduce` activo
- WHEN se aplica el CSS
- THEN las animaciones de burbujas y transiciones del hero se reducen a `0s` o se desactivan vía `@media (prefers-reduced-motion: reduce)`
- AND el contenido permanece legible sin movimiento

#### Scenario: Tokens no rompen dark mode existente

- GIVEN el sitio alterna a dark mode
- WHEN los tokens gaming se resuelven
- THEN no hay regresión visual en superficies existentes y los nuevos tokens mantienen contraste WCAG AA

