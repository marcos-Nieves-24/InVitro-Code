# Diagnóstico visual — Lección en modo presentación

**Rama:** `feat/presentation-reemplazo-directo` @ `2f03e1d` · **Fecha:** 2026-10-12
**Método:** Playwright/Chromium headless sobre `/preview/lesson/ia/lesson01_what_is_ai`, 1440×900.
**Capturas:** `audit-visual/` (26 pasos + `featspace-antes/ despues.png`).

> La ruta `/preview/lesson/[module]/[slug]` se agregó para esta auditoría: renderiza el `LessonPage` real
> sin auth (la lección no usa Clerk, cookies ni Supabase). Sigue el precedente de `/preview/cards`.
> **Está sin commitear y es removible con un `rm`.**

---

## V-01 · El contenido de la animación es inalcanzable · **CRÍTICA** · Confirmada

**Medición (`1440×900`):**

| Métrica | Valor |
|---|---|
| Viewport | 1440 × **900** |
| Escenario (`aspect-video` 16:9) | top **483**, alto **775**, bottom **1258** |
| Puntos de datos en pantalla | **0 de 24** |
| Puntos de datos bajo el borde | **24 de 24** |
| ¿La página scrollea? | **NO** — `scrollHeight === clientHeight === 900` |

**El escenario mide 1377px de ancho → 775px de alto por su relación 16:9.** Con el encabezado (~150px) y el
texto (~330px) que lo preceden, el escenario arranca en `top: 483` y termina en `bottom: 1258`: **358px por
debajo del viewport**. Y como el shell es `fixed inset-y-0` con `overflow-hidden`, el desborde queda
**atrapado e inalcanzable**: no hay scroll.

**Resultado para el estudiante:** un rectángulo negro vacío. La animación corre (verificado: scrubber en
`0.44/2`, 68 elementos con opacidad > 0.05) pero **nada de eso se ve**.

Capturas: `audit-visual/step-19.png`, `audit-visual/featspace-despues.png` (idénticas pese a estar la
animación en marcha).

**Causa:** `AnymotionStage` fija la proporción 16:9 y el ancho completo del contenedor. No hay ningún tope
relacionado con la altura disponible.

**Solución:** el escenario debe dimensionarse contra el alto disponible (`max-h` derivado de `vh`), no contra
su ancho. El SVG ya usa `viewBox`, así que escala sin pérdida.

**Criterio de aceptación:** en 1440×900 y en 1280×720, `stage.bottom <= viewport height` y los 24 puntos
quedan dentro del viewport.

---

## V-02 · Texto cortado contra el borde izquierdo · **ALTA** · Confirmada

`shellRect.left === 0`. El shell ocupa el ancho completo sin margen lateral.

Visible en todas las capturas: el eyebrow `"04 — CONCEPTO"` aparece como `"04 — CONCEPTO"` con el primer
carácter pegado al borde (x=0) y el título de sección arranca en x=0. En `step-08.png` se lee `04 — CONCEPTO`
con el `0` a medio cortar; en `step-19.png`, `07 — CONCEPTO` igual.

**Causa:** el `Section` y su encabezado se renderizan sin padding horizontal, dentro de un contenedor que
ahora es full-bleed.

**Criterio de aceptación:** ningún texto queda a menos de 16px del borde izquierdo ni del derecho.

---

## V-03 · Controles "Atrás / Continuar" cortados por el pie · **ALTA** · Confirmada

En `step-08.png` los botones `Atrás` y `Continuar →` de `RevealSequence` aparecen a `y≈848` **cortados por
la banda inferior** (`Paso 4 de 10`, footer `4 / 13`). Se leen a medias.

**Causa:** el footer fijo y los controles de la reveal compiten por el mismo borde inferior.

**Criterio de aceptación:** los botones son completamente visibles y con área de contacto ≥44px.

---

## V-04 · Error de hidratación por `<p>` anidado · **ALTA** · Confirmada

```
In HTML, <p> cannot be a descendant of <p>. This will cause a hydration error.
> <p> > <p>   (MDXContent > Section > RevealSequence > div)
```

Un párrafo dentro de otro párrafo en el contenido MDX. Next lo auto-corrige en el cliente, pero provoca
re-render y warning en cada carga.

**Causa:** el markdown de la lección escribe prosa que al renderizarse queda dentro de un `<p>` ya abierto.

**Criterio de aceptación:** consola sin el warning en cualquier paso de la lección.

---

## V-05 · La navegación rebota entre dos diapositivas · **ALTA** · Confirmada

Al avanzar con `Continuar` desde "¿Por qué fallan las reglas fijas?", la secuencia oscila:

```
Checkpoint de conceptos → ¿Por qué fallan las reglas fijas? → Checkpoint → Reglas → Checkpoint → …
```

Reproducible en 7 ciclos consecutivos. `Checkpoint de conceptos` nunca queda seleccionado.

**Causa:** el `Continuar` del footer y el `Continuar` de `RevealSequence` se disparan para la misma
dirección; uno avanza la reveal y el otro la diapositiva, y con `hasMore` en `false` ambos escriben sobre el
mismo estado.

**Criterio de aceptación:** avanzar desde cualquier diapositiva recorre las 13 en orden, sin repetir ni
volver.

---

## V-06 · Granularidad inconsistente entre diapositivas · **MEDIA** · Confirmada

| Diapositiva | Pasos |
|---|---|
| 1 — El microscopio y la conidia | 2 |
| 2 — ¿Qué es la IA? | 2 |
| 3 — IA no piensa | 1 |
| **4 — Features: el idioma de la máquina** | **10** |
| 7 — Dos features > una | 4 |
| 12 — Checkpoint de conceptos | 4 |

Diez clicks para una sola diapositiva (que además contiene glosario, tabla de 4 filas, `FeatureButtonList` y
dos animaciones) frente a un click en otra. La sensación de "vacío" y de "lento" sale de acá, no del diseño.

**Causa:** el número de pasos depende de cuántos hijos imediatos tenga el `RevealSequence`, no de una decisión
pedagógica.

**Criterio de aceptación:** ninguna diapositiva supera 5 pasos; las que mezclan tabla + animación +
acordeón se parten en más de una diapositiva.

---

## V-07 · El "full bleed" no es real: el contenido desborda sin salida · **MEDIA** · Confirmada

`scrollHeight === clientHeight` significa que **no hay scroll posible**, pese a que el contenido excede el
viewport. El diseño promete "sin scroll" y lo cumple por la vía equivocada: recortando en vez de ajustar.

Consecuencia compuesta con V-01: el estudiante ve el recuadro negro y no tiene ni scroll ni contenido.

**Criterio de aceptación:** el contenido se ajusta al viewport (V-01) **o** el área de slides scrollea con
claramente. Nunca ambas rotas.

---

## Lo que **no** está roto (verificado, no asumido)

- ✅ **El bocadillo funciona**: contador `1 / 6` y avance frase por frase. El `DialogueBox` quedó operativo.
- ✅ **Las animaciones tienen controles reales**: `Pausar animación`, `Repetir desde el inicio` y scrubber
  (`range` 0 → 2 s) presentes y respondiendo.
- ✅ **La tabla tiene formato**: encabezado, bordes y cebra. No es "tabla sin formato"; sí tiene las celdas
  muy aireadas y las columnas desproporcionadas (`step-08.png`).
- ✅ **Sin scroll horizontal** ni desbordes laterales de página.
- ✅ La jerarquía de títulos y el rail de puntos son consistentes entre diapositivas.

---

## Plan de acción

### P0 — Bloquean que el estudiante vea el contenido

| # | Hallazgo | Acción | Archivos | Verificación |
|---|---|---|---|---|
| P0-1 | V-01 | Dimensionar el escenario contra la altura disponible en vez de contra su ancho | `AnymotionStage.tsx` | `stage.bottom <= innerHeight` en 1440×900 y 1280×720 |
| P0-2 | V-02 | Padding lateral del contenido de la diapositiva | `section.tsx` / `lesson-carousel.tsx` | texto a ≥16px de cada borde |
| P0-3 | V-03 | Reservar espacio para que los controles de la reveal no queden bajo el footer | `RevealSequence.tsx`, `lesson-carousel.tsx` | botones 100% visibles |
| P0-4 | V-04 | Quitar el `<p>` anidado | `lesson01…/lesson.md` | consola limpia |

### P1 — Navegación y ritmo

| # | Hallazgo | Acción | Archivos | Verificación |
|---|---|---|---|---|
| P1-1 | V-05 | Un solo dueño del avance: el footer no debe competir con `RevealSequence` | `lesson-carousel.tsx` | recorrido lineal de 13 sin rebote |
| P1-2 | V-06 | Partir la diapositiva 4 (10 pasos) en 2–3 diapositivas | `lesson01…/lesson.md` | ninguna diapositiva >5 pasos |

### P2 — Composición y densidad

| # | Hallazgo | Acción | Verificación |
|---|---|---|---|
| P2-1 | V-07 | Decidir la política: ajustar al viewport **o** permitir scroll en la zona de slides | una sola política, consistente |
| P2-2 | Tabla | Ajustar anchos de columna y densidad de celdas | tabla legible a 1280 |
| P2-3 | Vacío vertical | Reducir el hueco entre título y contenido | sin bandas >120px sin contenido |

### P3 — Storyline educativo

No es un defecto, es la pregunta de fondo que planteaste: hoy la lección **explica**, no **narra**. El
`DialogueBox` ya puede llevar la voz de la científica; el plan de aprendizaje visual
(`odd/tasks/expediciones-visual-learning-plan.md`, Fase B) cubre convertir prosa en frases + animación.

**Prerrequisito real:** P0-1 y P1-2 primero. Poner animaciones sobre un layout que recorta el 100% del
contenido refuerza el problema en vez de resolverlo.

---

## Secuencia

```
P0-1 (escenario)  →  P0-2/P0-3 (bordes)  →  P0-4 (hidratación)
       ↓
P1-1 (avance)     →  P1-2 (ritmo)
       ↓
P2 (composición)  →  P3 (storyline)
```
