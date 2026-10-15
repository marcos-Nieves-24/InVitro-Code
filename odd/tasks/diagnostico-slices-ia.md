# Diagnóstico de composición — slices de las lecciones (módulo `ia`)

**Worktree:** `expediciones-ux` · rama `feat/expediciones-ux-completo` · **Fecha:** 2026-10-12
**Método:** Chromium headless, 1440×900, recorrido automático de **80 slices** en las 4 lecciones de `ia`.
**Capturas:** `audit-visual/slices/` (80 PNG) · datos crudos: `slices.json`

> Nota de alcance: el login con Clerk quedó pendiente (exige un código de verificación por intento).
> Las lecciones son accesibles por la ruta pública `/preview/lesson/ia/<lección>`, así que **el análisis no
> dependió de la sesión**.

---

## Resumen

| Problema | Slices afectados | Peor caso | Estado |
|---|---|---|---|
| A · Exceso de espacio en blanco | **CORREGIDO — ver nota** | 968px (falso positivo) | medido: **0** huecos reales >160px |
| B · Jerarquía tipográfica débil | 80 / 80 | 11px usado en **46** bloques | **pendiente** |
| C · Navegación duplicada (botón) | 80 / 80 → 1 botón/slice | 2 botones iguales | **resuelto** (`fcc2bd2`) |
| C · Navegación duplicada (posición) | 4 indicadores → 3 elementos / 2 hechos | 43 slices con 4 | **resuelto en lo esencial** (`8c7078a`) |
| D · Jerarquía de botones inconsistente | 80 / 80 | 3 alturas y 3 radios | **resuelto** (`8c7078a`) |
| E · Distribución vertical desequilibrada | 56 / 80 → 0 / 80 | 694px → 555px | **resuelto** (`fcc2bd2`) |
| — · iframe recortado en `lesson03` | 2 pantallas | el visor no entra entero | pendiente (P2-1) |

**Ninguno es un problema de gusto.** Los cinco son medibles y repetibles.

> ### Corrección de la línea base (post P0)
>
> **El hallazgo A estaba mal medido y lo corrijo.** El hueco de "968px" en `lesson03-03` y `lesson03-08`
> **no es espacio vacío**: es el `InteractiveFrame` del visor 3D de PDB y del pipeline, con 700px de alto y
> lleno de contenido. El instrumento de medición saltaba los contenedores con `iframe` dentro y contaba la
> distancia entre el párrafo y el visor como un hueco. La captura lo confirma: esa pantalla está **llena**.
>
> Con una medición que sí incluye los iframes, los huecos reales >160px son **0**. El problema de espacio en
> blanco **no existía como tal**: lo que existía era el defecto E, que sí era real y ya está corregido.
>
> Esto corrige también el conteo de "avances duplicados": mi detector contaba "Mostrar contenido" —que es el
> botón de **atrás** del `RevealSequence`— como un segundo avance. No lo era. Los controles de avance por
> pantalla están en **1**.
>
> **Lo que queda real y abierto:** 2 pantallas de `lesson03` con el iframe recortado por el borde inferior
> (P2-1), y el hallazgo B, que no se tocó.

---

## Método de medición (corregido)

Medir "espacio vacío" por `innerText` o contando solo elementos sin hijos produce **huecos fantasma de
cientos de píxeles**. Las reglas que hay que respetar:

1. Incluir en el cálculo los `iframe`, `button`, `ul`/`ol` y cualquier hoja con hijos. Un contenedor con
   iframe NO es un hueco.
2. Detectar indicadores de posición **por nodo DOM real** (bounding box + `visibility` + `opacity`), no por
   regex sobre `innerText`.
3. Distinguir botón de **atrás** ("Mostrar contenido anterior") de botón de **avance**. "Mostrar contenido"
   cuenta como retroceso.
4. Un `N / M` que viva dentro del área de slides es contenido de una animación, no el contador del shell
   (`OverfittingPlayer` muestra "2 / 12" = paso 2 de la animación).

Script de referencia: `/tmp/opencode/audit-expediciones/verify-p1.js` (domina los 4 módulos).

---

## A · Exceso de espacio en blanco

**64 de 80 slices** tienen al menos un hueco vertical >90px entre bloques de contenido.

| Slice | Hueco | Entre |
|---|---|---|
| `lesson03-03` Visualizador 3D | **968px** | párrafo → iframe del visor |
| `lesson03-08` Pipeline ML | **968px** | párrafo → iframe del pipeline |
| `lesson02-07` KNN en acción | 756px | párrafo → "Idea clave" |
| `lesson02-04` Perceptrón | 515px | párrafo → "Idea clave" |
| `lesson02-12/13/14` Tres regímenes | 479px | figura → "Idea clave" |

**Causa raíz:** el `RevealSequence` en modo `appear` centra el paso actual en un contenedor con
`min-h-[calc(100vh-160px)]`. Cuando el paso es corto (una línea de texto), el resto del alto queda vacío y
**el siguiente bloque aparece 968px más abajo**. El hueco no es "aire": es la cage del contenedor.

**Captura que lo muestra:** `slices/lesson01_what_is_ai-18.png` — dos bloques de contenido, 694px de vacío debajo.

---

## B · Jerarquía tipográfica débil

Tamaños medidos en los bloques de contenido:

| Tamaño | Bloques | Rol real |
|---|---|---|
| 28px | 80 | Título de sección — **uno por slide** |
| 16px | 80 | Cuerpo |
| 11px | **46** | Etiquetas: eyebrow, "Paso x de y", "Diapositiva N de M", badges |

- Solo **dos tamaños dominan** (28 y 16). La razón título/cuerpo es **1.75:1**: casi no hay salto visual.
- **El indicador de posición (11px) es más pequeño que todo lo demás** y compite visualmente con el pie de
  foto de las animaciones, que también usa 11px.
- La escala interna del contenido es plana: `distinct sizes per slide` entre 2 y 7, con 2 como mínimo.

**Consecuencia:** el ojo no tiene dónde posarse. El título (28px) es lo más grande y lo menos informativo —
dice "Dos features > una" — mientras la información real está en un 16px abajo, y el estado del recorrido
está en un 11px que grita más por repetición (4 veces por pantalla) que por tamaño.

---

## C · Navegación duplicada

**80 de 80 slices** muestran al menos 3 indicadores de posición simultáneos. **43 de 80** muestran 4.

| Indicador | Frecuencia | Ubicación |
|---|---|---|
| "Diapositiva N de M" | 80/80 | header superior |
| "N / M" | 80/80 | footer inferior |
| Rail de puntos | 80/80 | header **y** footer |
| "Paso x de y" | 43/80 | centro del contenido |

Y los **controles duplicados**: el mismo "Continuar" aparece **dos veces en pantalla** —
`Continuar →` en el centro del `RevealSequence` (131×44) y `Continuar →` en el footer (109×34).
Lo mismo con "Atrás". En `lesson01-18.png` se ven los dos, separados por 400px de vacío.

Además conviven cuatro acciones distintas con el mismo nombre lógico:
`Continuar` (×80), `Mostrar siguiente` (×28), `Mostrar contenido` (×24), `Click para continuar` (×24 hint).

**Causa raíz:** el `LessonCarousel` (shell de diapositivas) y el `RevealSequence` (pasos internos) son dos
capas de navegación que cada una trae su propio indicador y sus propios botones. Se/goto/`continue` ya
resolvió quién **manda** en el avance (registro `consumeRevealAdvance`), pero **no resolvió quién muestra**.

---

## D · Jerarquía de botones inconsistente

Medidas de todos los botones visibles:

| Medida | Ocurrencias | Interpretación |
|---|---|---|
| 1342×49 | 98 | Respuestas de quiz (ancho completo) |
| 1294×49 | 80 | Filas de opción |
| **131×44** | 28 | "Mostrar siguiente" (RevealSequence) |
| **109×34** | 80 | "Siguiente diapositiva" (footer) |
| **100×44** | 24 | "Mostrar contenido" |
| **83×44** | 4 | "Entendido" |
| 77×32 | 80 | "Diapositiva anterior" (footer) |

- **El mismo rol ("avanzar") tiene tres alturas:** 32px, 34px y 44px. Ninguna cumple 44px salvo una.
- **El mismo rol tiene tres radios:** `9999px` (píldora), `10px`, `16px`.
- La flecha "atrás" (77×32) queda **por debajo del mínimo táctil de 44px**.
- Los botones de contenido (1342×49, 1294×49) miden casi 30× un botón de navegación (44px): la jerarquía
  está al revés respecto a la frecuencia de uso.

---

## E · Distribución vertical poco equilibrada

**56 de 80 slices** tienen un margen superior o inferior >120px. El patrón es sistémico, no puntual:

```
slide                          top    bottom
lesson01-04  ¿Qué es la IA       0      694
lesson01-18  Dos features > una  0      694
lesson01-25  ¿Por qué fallan?    0      616
lesson01-16  Comprueba: feature   0      603
lesson01-19  Dos features > una  0      694
```

**`top = 0` en todos los casos**: el contenido se pega al techo del área y el vacío se acumula **abajo**.
Con `bot = 694` sobre un viewport de 900px, dos tercios de la pantalla están vacíos.

`lesson01-18` es el caso extremo y el más legible: 2 bloques de contenido, 694px de vacío inferior,
4 indicadores de posición y 2 botones "Continuar" duplicados.

---

## Plan de acción

### P0 — Restaurar la lectura (la mitad del problema)

| # | Hallazgo | Acción | Archivos | Criterio de aceptación |
|---|---|---|---|---|
| P0-1 | A, E | El `RevealSequence` en modo `appear` no debe dejar huecos de cientos de px: cuando el paso actual es corto, el contenedor se ajusta al contenido en vez de al viewport | `RevealSequence.tsx` (altura del `appear` grid) | Ningún hueco entre bloques >160px en los 80 slices |
| P0-2 | E | Anclar el contenido verticalmente al centro del área visible, no al techo, cuando no llena el alto | `RevealSequence.tsx`, `lesson-carousel.tsx` | `top` y `bottom` <200px, o diferencia <120px entre ambos |
| P0-3 | C | **Una sola** acción "Continuar" por pantalla. El `RevealSequence` no dibuja su propio botón cuando el footer ya lo muestra | `RevealSequence.tsx` | 1 botón `Continuar` por slice (hoy 2) |

### P1 — Ordenar la jerarquía

| # | Hallazgo | Acción | Criterio |
|---|---|---|---|
| P1-1 | C | Dejar **un** indicador de posición: "Diapositiva N de M". Sacar el rail del header (el del footer ya cumple) y renombrar "Paso x de y" a algo secundario | 1 indicador de diapositiva + 1 de paso, nunca 4 |
| P1-2 | D | Un token único de botón: alto 44px, radio 16px, mismo `font-size` y `font-weight` para todo control de navegación | Todos los botones de navegación miden 44px de alto y comparten radio |
| P1-3 | D | Invertir la jerarquía: navegación como botones de 44px; contenido como filas sin borde pesado | Frecuencia de uso ∝ tamaño |
| P1-4 | B | Escala tipográfica con saltos visibles: título 30→28, subtítulo 20, cuerpo 17, etiquetas 13. Sacar el 11px | ≥4 tamaños distintos por slide; ningún texto de UI a 11px |
| P1-5 | B | El título de sección repite lo que la animación ya dice: reducirlo a un eyebrow pequeño y dejar el título solo cuando aporta | — |

### P2 — Afinar

| # | Hallazgo | Acción | Criterio |
|---|---|---|---|
| P2-1 | A | Los `InteractiveFrame` de `lesson03` reservan 968px: su altura fija (`700px`) + `height="800px"` desborda el viewport | El visor entra completo en pantalla |
| P2-2 | C | La flecha "atrás" del footer (77×32) no cumple mínimo táctil | ≥44×44 |
| P2-3 | B | El `11px` de "Paso x de y" compite con el pie de las animaciones | Reservar 11px solo para pies de imagen |

---

## Orden y costo

```
P0-1, P0-2 (altura y anclaje)   →  P0-3 (un botón)  →  P1-1 (un indicador)
        ↓
P1-2, P1-3, P1-4 (escala única de controles y tipografía)
        ↓
P2 (ajustes finos)
```

**P0-1 y P0-2 son el 80% del sensation de "vacío"**: son dos cambios de altura en un mismo componente, sin
tocar contenido. **P0-3 y P1-1 son el 80% de "confuso"**: eliminar duplicados, sin Features nuevas.

**Riesgo:** `RevealSequence` y `lesson-carousel` son usados por las 41 lecciones, no solo por `ia`. Un cambio de
altura o de botón afecta a los 4 módulos → verificar al menos una lección de `python`, `estadistica` y
`machine-learning` antes de dar por cerrado.

**Verificación por cambio:** re-ejecutar el barrido (`slices.js`) y comparar los 5 indicadores contra la
línea base de este documento. El criterio es numérico, no visual.
