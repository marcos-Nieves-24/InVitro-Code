# Expediciones — cierre UX/UI + tablas → animaciones + slices completas

**Worktree:** `invitro-code-worktrees/expediciones-ux` · rama `feat/expediciones-ux-completo`
**Servidor:** `:3001` (aislado del `:3000` de la otra sesión)
**Origen:** `odd/tasks/expediciones-ux-audit.md` (24 hallazgos) + `odd/tasks/diagnostico-visual-leccion.md`

## Objetivo

Dejar Expediciones sin bugs medidos, reemplazar las tablas por visualizaciones que expliquen el concepto,
y completar el modelo de slices en el módulo `ia` como referencia canónica.

## Línea base medida en este worktree (`:3001`, Chromium, `reducedMotion: no-preference`)

| Viewport | Tarjetas | Recorte izq/der | Flechas | Dots |
|---|---|---|---|---|
| 1440×900 | 4 (la 4ª a `opacity .6`) | **5px / 181px** | 56px | 24×24 ✓ |
| 768×1024 | 4 | **clipped** | 56px | 24×24 ✓ |
| 390×844 | 1 de **262px** | 0 | **40px** ✗ (<44) | 24×24 ✓ |

Consola: 0 errores. Sin overflow horizontal en los tres tamaños.

**Ya resuelto por otra sesión (no repetir):** `dots` a 24×24 (`cef461a`).

## Lote 1 — Expediciones P0/P1

| # | Hallazgo | Defecto medido | Criterio de aceptación |
|---|---|---|---|
| L1-1 | EXP-001/002 | 4ª tarjeta recortada 181px a 1440; 1ª recortada 5px | `clippedL === 0 && clippedR === 0` en 1440 y 768 |
| L1-2 | EXP-003 | Tarjeta móvil de 262px; flechas de 40px | Tarjeta ≥320px a 390; flechas ≥44px |
| L1-3 | EXP-004 | Descripción a `opacity .6` → contraste 2.14:1 | ≥4.5:1 en activa e inactivas |
| L1-4 | EXP-018 | Dots inactivos a 1.10:1 | ≥3:1 en los 4 estados |
| L1-5 | EXP-017 | `return` temprano `len===0` antes de 3 `useCallback` | Renderizar `[]` → con módulos no rompe |
| L1-6 | EXP-005 | Dots en orden `modules`, tarjetas en `ordered` | Punto activo bajo la tarjeta activa |
| L1-7 | EXP-006 | Abre en la última expedición | Abre en `order: 1` |
| L1-8 | EXP-008 | `aria-label="Ir a machine-learning"` | Cero slugs en `aria-label` |
| L1-9 | EXP-009 | `trackOffset` alterna −8px | `transform: none` siempre |
| L1-10 | EXP-007 | Arrastre móvil sin efecto (1 sola tarjeta) | Gesto avanza o `drag` se elimina |
| L1-11 | EXP-010 | Subtítulo de sección 3.97:1 | ≥4.5:1 |
| L1-12 | EXP-012 | Badge "N labs" muestra lecciones | Texto == métrica |
| L1-13 | EXP-020 | `/learn` sin `h1` | Un único `h1` |

**Riesgo de regresión:** `CardPrimitives.tsx` lo usa sólo `ModuleCard`, y `ModuleCard` sirve a `/learn`,
`/proyectos`, `/laboratorios/explorer` y `/preview/cards`. L1-3, L1-4 y L1-12 tocan esa cadena: verificar
esas tres rutas.

## Lote 2 — Tablas → animaciones

La tabla de `ia/lesson01` (Aspergillus vs Penicillium: forma, textura, color, tamaño) es una lista de
atributos que el estudiante debe comparar mentalmente. Un `FeatureComparePlayer` SVG interactivo donde el
estudiante recorre un atributo y ve las dos especies simultanément es estrictamente mejor para el objetivo
"visualizar el concepto".

Reglas:
1. La animación **reemplaza** la tabla, no se suma.
2. Leyenda obligatoria; control de tipo de atributo; determinista.
3. Registrada en los dos sitios obligatorios (barrel + mapa MDX).
4. Las tablas de otras lecciones se inventarían antes de tocarlas: sólo la de `ia/lesson01` en este lote.

## Lote 3 — Slices completas en `ia`

Completar L2, L3 y L4 con el modelo ya validado en L1: `DialogueBox` con `lines`, `RevealSequence`,
`ChoiceQuestion` y animación donde había párrafo.

Criterio: ninguna diapositiva >5 pasos, ninguna prosa corrida larga, 0 errores de consola.

## Verificación obligatoria por lote

1. `npm run type-check`
2. `npm run build`
3. Compilar cada `lesson.md` tocado con `@mdx-js/mdx` (la ruta es dinámica: el build **no** compila MDX)
4. Re-medir con Chromium sobre `:3001` y adjuntar números, no adjetivos
5. Captura de pantalla de cada superficie tocada

## Orden

```
Lote 1 (Expediciones)  →  Lote 2 (tabla → animación)  →  Lote 3 (slices ia)
```

Cada lote cierra con commit propio en `feat/expediciones-ux-completo`.
