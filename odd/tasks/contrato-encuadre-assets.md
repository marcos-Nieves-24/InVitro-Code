# Contrato de encuadre para SVGs servidos

## Objective
Eliminar la clase de bug "asset con viewBox mal encuadrado" (cabeza del científico cortada): el repo impone el encuadre, el build lo verifica, y ningún asset sin curar entra a producción.

## Problem / Why
`dashboard/cientifico-1.svg` declara viewBox `128.6 69.52 762.01 884.97` pero su contenido mide `y=0 → 1024` (medido con Playwright + getBBox): ~70 unidades cortadas arriba = la cabeza. El fix del PR #69 parcheó el contenedor; el asset seguía roto. Los checks verdes (type-check/tests/build) nunca validan assets. Mismo riesgo para los 9 SVGs restantes.

## Alcance (autorizado)
- Crear: `scripts/hero-assets.json` (manifiesto), `scripts/check-hero-assets.mjs` (gate sin dependencias), `scripts/normalize-hero-assets.mjs` (curador con Playwright, on-demand).
- Cablear `prebuild` en package.json.
- Curar `dashboard/cientifico-1.svg` (viewBox envolvente + padding).
- Documentar en AGENTS.md.
- NO tocar código de componentes ni otros assets sanos.

## Arquitectura (3 capas, acordada con el usuario)
1. **Curación (on-demand, con browser)**: `assets:normalize` mide getBBox real y propone viewBox envolvente + 2% de padding, deriva width/height. El humano aplica.
2. **Contrato (datos)**: `scripts/hero-assets.json` declara viewBox/width/height canónicos por asset. Fuente de verdad versionada.
3. **Gate (build, sin deps)**: `check-hero-assets.mjs` corre en `prebuild`; falla si (a) un asset difiere del manifiesto (>0.5 u de tolerancia), o (b) un SVG con viewBox no está en el manifiesto. Testeable vía `--public-dir` contra fixtures.

## Decisiones de diseño
- **Envolvente, no reencuadre**: curar el masculino con viewBox envolvente (`172.8 0 673.6 1024` + padding → viewBox ~`160 -20 700 1065`, width 440, height ~669). Cambia la proporción vs la femenina (decisión consciente: nada se pierde; el reencuadre estético es decisión posterior del humano).
- El gate NO depende de Playwright: parseo por regex del tag `<svg>`.
- SVGs sin viewBox declarado (iconos planos) no aplican al contrato.
- Tolerancia 0.5 unidades para absorber redondeos de autores.

## Tasks
- [ ] T1 — `scripts/hero-assets.json` con los 10 assets (9 sanos tal cual, masculino curado). Ver bounds medidos en /tmp/opencode/assets-measured.json.
- [ ] T2 — `scripts/check-hero-assets.mjs`: gate con `--public-dir` opcional, exit 1 + mensajes claros.
- [ ] T3 — `scripts/normalize-hero-assets.mjs`: curador Playwright (import dinámico, error amigable si falta), `--write` para aplicar.
- [ ] T4 — Cablear `prebuild` + `assets:check` + `assets:normalize` en package.json.
- [ ] T5 — Test del gate: fixture temporal con viewBox roto → check falla; fixture sano → pasa. (vitest o script de verificación)
- [ ] T6 — Aplicar viewBox curado a `public/dashboard/cientifico-1.svg`.
- [ ] T7 — Verificación: `npm run assets:check` OK, `npm run build` OK, re-medir con Playwright (0 recorte), y probar que el build FALLA si se corrompe un viewBox.
- [ ] T8 — Documentar contrato en AGENTS.md (sección breve).

## Acceptance criteria
- `npm run build` falla si un SVG servido declara viewBox fuera del contrato o no está curado.
- `dashboard/cientifico-1.svg` renderiza sin recorte (verificado por getBBox: contenido ⊂ viewBox).
- El gate corre sin dependencias externas y es testeable con fixtures.
- Los otros 9 SVGs no cambian un byte.

## Route declaration
T1-T6: delegated writer (3 archivos nuevos no triviales + 1 edición). T7: comandos delegados + verificación del orchestrator (probe de fallo del gate incluida).
