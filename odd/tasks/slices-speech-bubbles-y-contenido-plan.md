# Propuesta: Slices con speech bubbles, migración de contenido, AnyMotion y ejercicio interactivo

**Worktree:** `presentation-reemplazo-directo` @ `dd95eae` · **Fecha:** 2026-10-11
**Naturaleza:** propuesta. **Ningún cambio de código en este documento.**
**Precedente:** `odd/tasks/presentation-reemplazo-directo.md` (21/21 tareas cerradas),
`odd/tasks/expediciones-ux-audit.md` (24 hallazgos).

---

## 1. Corrección de partida: cuatro supuestos que hay que ajustar con evidencia

Antes de planear, corrijo lo que la petición asumía. Ninguna de estas correcciones es opinión.

### 1.1 El sistema de presentación ya existe y está terminado. Falta migrar contenido.

`odd/tasks/presentation-reemplazo-directo.md` tiene **21 tareas, todas `[x]`**, con `type-check` y `build`
verificados commit por commit. `PresentationShell` (reescrito dentro de `lesson-carousel.tsx`), `DialogueBox`,
`RevealSequence`, `ChoiceQuestion`, `QuizButton`, `FeatureButtonList` y 4 players de animación están
**integrados y registrados** en `components/lesson/index.ts:22-30` y en el mapa MDX de
`app/learn/[module]/[slug]/page.tsx:166-174`.

Lo que falta no es el sistema: es **el contenido**. De 41 lecciones, **una** usa el sistema completo.

| Módulo | Lecciones | Slices | `RevealSequence` | `ChoiceQuestion` | Animaciones | `DialogueBox` |
|---|---|---|---|---|---|---|
| `ia` | 4 | 54 | 18 | 43 | 2 | **1** (sólo L1) |
| `python` | 17 | 126 | 0 | 0 | 0 | 0 |
| `estadistica` | 10 | 107 | 0 | 0 | 0 | 0 |
| `machine-learning` | 10 | 95 | 0 | 0 | 0 | 0 |
| **Total** | **41** | **~390** | **18** | **43** | **2** | **1** |

### 1.2 "Reducir textos" no es lo que hace el sistema — y hay que decirlo con números

Pediste reducir textos con videos o animaciones. El dato:

- Las 41 lecciones suman **65.390 palabras** en **~390 slices** → **168 palabras/slice** de media.
- La única lección migrada (`ia/lesson01_what_is_ai`): **2.328 palabras / 14 slices = 166 palabras/slice**.

**La densidad es idéntica.** El sistema **no quita palabras**: las reparte en pasos que se revelan de a uno
(`RevealSequence` `appear`), con `Paso x de y` visible. La percepción de "menos texto" viene de la
**simultaneidad**, no del volumen.

Consecuencia para el plan: el objetivo correcto es **"menos texto en pantalla a la vez"**, y la métrica
correcta es *palabras visibles por sliceRendered*, no *palabras por lección*. Bajar palabras sin repartirlas
sería una pérdida de contenido sin ganancia real.

### 1.3 No hay ningún módulo con 404 de contenido

Los 41 directorios de lección tienen `lesson.md`, `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb` y
`references.bib`. No hay placeholders, ni "en construcción", ni lecciones por debajo de 200 palabras
(mínima: 791, en `machine-learning/lesson09`). **Ningún lesson 404ea.**

El **único 404 real y reproducible** es otro:

> **`src/app/learn/[module]/page.tsx` no existe.** El directorio `src/app/learn/[module]/` contiene sólo
> `[slug]/`. Por lo tanto `/learn/ia`, `/learn/python`, `/learn/estadistica` y `/learn/machine-learning`
> devuelven **HTTP 404**.

Hoy es **latente**, no visible: los tres call sites construyen el href con
`mod.firstLesson ? /learn/${slug}/${firstLesson} : /learn/${slug}` (`landing/Modules.tsx:11`,
`learn/page.tsx:25`, `preview/cards/page.tsx:32`) y `firstLesson` siempre existe, así que el fallback nunca
dispara. Se alcanza por URL directa, bookmark o búsqueda.

**Pregunta abierta para vos:** ¿qué URL viste dar 404? Si no es `/learn/{module}`, decime cuál y lo
reproduzco — puede haber un caso que los dos exploradores no encontraron y que sí te afecte.

### 1.4 AnyMotion: 11 animaciones generadas están huérfanas; 2 en uso son hechas a mano

- `scripts/animations.json`: **11 entradas, todas `generated: true`, todas `inLesson: false`**.
  Todas tienen su `index.html` en disco (por eso `anim:verify` pasa), y **ninguna se carga desde una ruta renderizada**.
- Las 2 que sí se usan (`ConidiaToVector`, `FeatureSpace2D`) son **SVG inline** escritos a mano con
  `useAnymotionTimeline`. **No leen `public/animations/`.**
- `BrainVsChipPlayer` y `MatrixPlayer` están **registrados en el mapa MDX** (`:171-174`) pero **ninguna lección
  los invoca** — se quitaron en `c55eb0c` ("placeholders no aportan") y el registro quedó.
- El comando `generate` **no es offline**: invoca el CLI global `anymotion` con `Authorization: Bearer`
  a un proveedor LLM (`scripts/anymotion-patch.sh:125-145`). `list/import/convert/verify` sí son fs puro.
- Peso muerto: `hero-lab-bg/landing-background.png` **1.88 MB**, `neural-network-intro/timeline.js` 11.8 KB,
  `hero-lab-bg/timeline.js` 22.4 KB, más un `neural-network-feedforward.mp4` de 509 KB sin referencias.

**Conclusión:** el camino que funcionó en la práctica fue **SVG explicativo escrito a mano**, no la generación
automática. El plan sigue esa vía y deja fuera lo que no sirve.

---

## 2. Diagnóstico de bloqueos del sistema (por qué "terminar" no es sólo migrar texto)

Cinco defectos hacen que el sistema, aun migrado a 41 lecciones, se comporte peor de lo que aparenta.

### B1 — El `DialogueBox` está **inerte** en producción · **Crítico**

`DialogueBox` soporta `lines[]`, typing a 35ms, contador `n/m`, botón "Continuar", `onNext` y avance por
click/Enter/Space (`DialogueBox.tsx:109-119,164-175,189-229,291-320`). Pero la **única** invocación del repo
(`ia/lesson01_what_is_ai/lesson.md:26`) pasa `children` **sin `lines` ni `onNext`** → `hasLines = false` y
`showContinueResolved = Boolean(onNext) = false` (`:187`).

Consecuencia: **el typewriter, el contador, el botón Continuar y el avance propio están muertos**. Todo el
avance delega en el `RevealSequence` padre. Es decir: el "speech bubble anime" que describe el objetivo del
feature doc **no es lo que el usuario ve hoy**.

### B2 — `RevealSequence` no tiene `ArrowRight` · **Alto**

Sólo maneja `ArrowLeft` (`:258-267`). El avance intra-slide por teclado depende del listener de nivel ventana
del carousel, y ese queda bloqueado mientras `isRevealIncomplete` (`lesson-carousel.tsx:138-142,155-159`).
Resultado: **con teclado, un paso advanced puede ser inalcanzable** si el estudiante ya está dentro de la slide.

### B3 — No hay persistencia de posición · **Alto**

Ningún `localStorage` ni escritura a Supabase del slide actual o del `revealedCount`. El único `localStorage`
es la bandera one-shot del hint (`RevealSequence.tsx:107`). Si el estudiante recarga o vuelve del navegador,
**pierde todo el avance dentro de la lección**. Para "expediciones" esto es gravísimo: la pérdida de lugar no es el
último `Section` alcanzado sino que se reconstruya desde cero, slice por slice.

### B4 — Superficie muerta y registro limpio · **Media**

`src/domain/slide.ts` sólo aporta `QuizOption`; `QuizQuestion` y `SlideKind` **no los consume nadie**.
Props declaradas y nunca ejercitadas por contenido: `onComplete`, `mode`, `startRevealed`, `blocked`.
`mode="stack"` y `onComplete` aparecen como soportadas en el feature doc pero ningún archivo las usa.

### B5 — Cero pruebas y cero documentación · **Media**

`src/__tests__/` tiene **un** archivo (`requestId-descarte.test.mjs`). Cobertura de `presentation/*`: **0**.
`AGENTS.md` y `DESIGN.md` no mencionan `DialogueBox`, `RevealSequence`, `ChoiceQuestion` ni la geometría
fullscreen. La propuesta archivada de Figma ya lo señaló como bloqueante (`proposal.md:10`): sin doc, el
siguiente que escriba contenido no sabe qué escribir.

---

## 3. Plan propuesto

Cinco workstreams. **W0 es la decisión previa que puede invalidar todo lo demás.**

### W0 — Decisiones previas (bloquean el resto) · sin código

| # | Decisión | Por qué bloquea | Opciones |
|---|---|---|---|
| D1 | ¿Se mergea `feat/presentation-reemplazo-directo` a `main` antes de migrar contenido? | Migrar 37 lecciones sobre una base no mergeada significa mantener dos fuentes de verdad. El feature doc dice "pendiente merge a main" y ya no bloquea trabajo nuevo. | (a) mergeear ya; (b) seguir en la rama y mergear todo junto. |
| D2 | ¿Qué es la fuente de verdad de la paleta: `globals.css` o `DESIGN.md`? | Hay un change **abierto** `design-system-rollout` que propone reemplazar la paleta global por los tokens de `DESIGN.md`, mientras `globals.css` ya declara la paleta "scientific gradient" que los contradice. La auditoría de Expediciones (EXP-015) ya había detectado la deriva del teal `#0AAE9A`, confinado a 3 archivos. Si ese change avanza durante la migración, el contraste y los tokens que arreglemos se mueven debajo. | (a) `globals.css` manda y se actualiza `DESIGN.md`; (b) `DESIGN.md` manda y se acepta el recolor de toda la plataforma. |
| D3 | ¿Se conserva la generación automática de AnyMotion? | `generate` no es offline ni CI-safe, y sus 11 salidas están huérfanas. Lo que funciona es SVG a mano. | (a) estandarizar en SVG a mano y archivar lo huérfano; (b) invertir en arreglar el pipeline de generación. |

### W1 — Desbloquear el sistema antes de escalar · **P0** · sin migración

Nada de esto es contenido: es hacer que el sistema cumpla lo que el feature doc promete.

| # | Tarea | Hallazgo | Archivos | Riesgo otros | Verificación | Tamaño |
|---|---|---|---|---|---|---|
| W1.1 | Conectar `lines` + `onNext` en el uso real y decidir si el avance es del bubble o del `RevealSequence` (**una sola respuesta**) | B1 | `lesson01…/lesson.md`, `DialogueBox.tsx` | Bajo | Typewriter + contador `n/m` visibles en runtime | Media |
| W1.2 | Añadir `ArrowRight` (y `Space`/`Enter`) a `RevealSequence` | B2 | `RevealSequence.tsx:258-267` | Bajo | Avance intra-slide por teclado | Pequeña |
| W1.3 | Persistir `slideIndex` + `revealedCount`; restaurar al volver | B3 | `lesson-carousel.tsx`, `RevealSequence.tsx` | Medio (toca escritura de datos) | Recargar a mitad de lección restaura el paso | Media |
| W1.4 | **Crear `src/app/learn/[module]/page.tsx`** — el único 404 real | §1.3 | nuevo | Bajo | Las 4 rutas devuelven 200 | Pequeña |
| W1.5 | Quitar registros muertos (`BrainVsChip`, `MatrixAnim`) o volver a usarlos | B4 | `page.tsx:171-174` | Bajo | Cero referencias sin uso | Pequeña |
| W1.6 | Eliminar o archivar las 11 animaciones huérfanas (recupera ~2.9 MB) | §1.4 | `public/animations/`, `scripts/animations.json` | Bajo | `anim:verify` coherente | Pequeña |
| W1.7 | Documentar el sistema en `DESIGN.md` §2.8 + `AGENTS.md` | B5 | docs | Bajo | Un dev puede escribir una slice nueva leyendo el doc | Media |

**W1.7 no es cosmético:** es lo que convierte "migrar 37 lecciones" de artesanía oral en procedimiento.

### W2 — Migración de contenido · **P1** · el grueso del trabajo

Estrategia deliberadamente **opuesta a "reescribir las 37 de una"**:

1. **Plantilla validada.** Documentar el patrón de slice (qué lleva `DialogueBox`, qué lleva `RevealSequence`,
   dónde va un `ChoiceQuestion`, dónde una animación) y verificarlo contra `ia/lesson01`.
2. **Piloto de 4 lecciones**, una por módulo, elegidas por contraste de dificultad:
   `machine-learning/lesson09` (6 slices, 791 palabras — la más corta), `estadistica/lesson01` (15 slices — la
   más densa), `python/lesson03` (7 slices, la más corta de python), `ia/lesson02` (16 slices, ya tiene 13 quizzes, falta
   la capa de diálogo).
3. **Lote por módulo**, después del piloto, en orden pedagógico: `python` (17) → `estadistica` (10) →
   `machine-learning` (10). `ia` se completa en paralelo con W2.2.

| Lote | Alcance | Slices | Depende | Riesgo | Verificación | Tamaño |
|---|---|---|---|---|---|---|
| W2.1 | Plantilla + convención de authoring | — | W1.7 | Bajo | Doc walkthrough | Pequeña |
| W2.2 | Piloto: 4 lecciones | ~44 | W2.1, W1.1-1.3 | Bajo | 4 lecciones navegables sólo con teclado y click | Media |
| W2.3 | `python` completo | 126 | Piloto aprobado | Medio (volumen) | Sin regressions de LaTeX ni tablas | **Grande** |
| W2.4 | `estadistica` completo | 107 | W2.3 | Medio | Ídem | **Grande** |
| W2.5 | `machine-learning` completo | 95 | W2.4 | Medio | Ídem | **Grande** |
| W2.6 | `ia` L2-L4: completar diálogo (tienen quiz pero no slices) | 40 | — | Bajo | Cobertura uniforme | Media |

**Restricción dura en cada lote:** preservar `$...$` LaTeX, registrar cualquier componente nuevo **en**
`components/lesson/index.ts` **y** en el mapa de `page.tsx`, no tocar `supabase-migration.sql`, auth ni Pyodide.

### W3 — Carga cognitiva: animaciones que enseñan · **P2**

Decisión D3 resuelta a favor de **SVG a mano**, con una regla dura para no llenar la UI de adorno:

> Una animación entra **sólo** si ocupa el lugar de un párrafo que hoy explica el concepto, y debe tener leyenda
> textual. Sin leyenda, no entra. (Es exactamente la razón por la que `BrainVsChip` y `Matrix` se quitaron.)

| # | Tarea | Verificación | Tamaño |
|---|---|---|---|
| W3.1 | Catálogo de 8-10 animaciones candidatas, priorizadas por **parrafo que reemplazan**, no por_MODULE | Lista con el slice que sustituye cada una | Pequeña |
| W3.2 | Construir las 3 de mayor retorno | Cada una reemplaza ≥25 palabras visibles de un slice | Media |
| W3.3 | Leyenda + reduced-motion + pausa en todas | Sin animación bajo `prefers-reduced-motion`; con `caption` obligatoria | Media |
| W3.4 | Medir el efecto: palabras visibles por slice antes/después | Métrica comparable en las 4 lecciones piloto | Pequeña |

### W4 — Hallazgos de la auditoría de Expediciones · **P1/P2** · track independiente

Es **independiente** de W1-W3 (toca `landing/` y `/learn`, no la lección). Ejecutable en paralelo.

| Fases | Tareas | Origen | Tamaño |
|---|---|---|---|
| Layout (P0) | T1 `visibleCount` real · T2 tarjeta móvil a ancho de pantalla · T3 contraste ≥4.5:1 | EXP-001/002/003/004 | Media |
| Layout (P0) | T3b puntos ≥3:1 · T3c `return` temprano antes de hooks | EXP-018, EXP-017 | Pequeña |
| Consistencia (P1) | T4 dots desde `ordered` · T5 `activeIndex=0` · T6 `aria-label` con título · T7 quitar offset 8px · T8 subtítulo ≥4.5:1 | EXP-005/006/008/009/010 | Pequeña |
| Datos (P2) | T9 badge "labs" honesto · T12 progreso real en `/learn` | EXP-012, EXP-013 | Media |
| A11y (P2/P3) | T8b `h1` en `/learn` · T8c enlace a `/learn` desde la landing · T12b foco al rotar | EXP-020, EXP-021, EXP-022 | Pequeña |

**T1+T2+T3 son el 80% de lo que un usuario sufre hoy** y no tocan contenido: es el mejor retorno de la lista
entera. Nota: **T12 (progreso real en `/learn`) se vuelve más valioso después de W1.3**, porque ahí ya existe
posición persistida que mostrar.

### W5 — Ejercicio interactivo · **P2** · secuencial

Depende de W1 y W2: un ejercicio que use un componente que todavía no existe, o en lecciones sin migrar, es
inventar dos veces.

1. **W5.1** Arreglar el 404 (`/learn/{module}`) — es W1.4, y de paso **la ruta deja de ser un callejón**.
2. **W5.2** Convertir `/learn/{module}` en índice real: lista de slices de la lección, con el paso actual
   marcado, usando la posición persistida de W1.3. Ahí "el usuario ve por dónde va" sin abrir la lección.
3. **W5.3** Ejercicio de práctica por expedición, reutilizando `ChoiceQuestion`/`QuizButton` que **ya existen**
   y ya persisten en `POST /api/v1/progress/reflection` (verificado: `backend/app/routers/progress.py:120`).
   **No se crea un sistema de preguntas nuevo.**
4. **W5.4** Reutilizar el patrón en las lecciones que hoy son sólo lectura.

---

## 4. Secuencia recomendada

```
W0 (decisiones)  →  W1.1-W1.4 (desbloqueo + 404)  →  W2.1-W2.2 (piloto)
                                      │
                                      ├─►  W4 en paralelo (es track aparte, no bloquea)
                                      │
                                      └─►  W2.3 → W2.4 → W2.5   (lotes por módulo)
                                                        │
W1.3 + W2.2  ──────────────────────────────►  W5.1 → W5.2 → W5.3
W3.1 → W3.2 (puede arrancar ya, en cualquier momento)
```

**Qué haría yo primero, si hay que elegir:** W1.1 → W1.2 → W1.4 → W4/T1-T3. Son cuatro cambios chicos que
arreglan (a) el speech bubble que no funciona, (b) un bloqueo real de teclado, (c) el único 404, y (d) el
80% del dolor visual de la auditoría — sin tocar una sola línea de contenido.

---

## 5. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Migrar contenido antes de fixear el sistema | 37 lecciones escritas contra un modelo que va a cambiar | W1 completo antes del piloto |
| `design-system-rollout` (abierto) cambia tokens a mitad de camino | El contraste que arreglemos se invalida | Decisión D2 antes de W1.3/W3 |
| Volumen de contenido (390 slices) | Meses de trabajo invisible | Lotes por módulo, no por lección |
| Regresión en LaTeX/tablas al reescribir MDX | Contenido roto en 41 lecciones | Gate `npm run build` por lote + diff de `$...$` |
| `CardPrimitives.tsx` compartido | Un cambio de contraste afecta `/proyectos` y `/laboratorios` | Ya identificada en la auditoría; probar esas 2 rutas |
| Sin tests | Regresiones silenciosas en la progresión | Al menos un test de la máquina de estados de `RevealSequence` |

## 6. Lo que este plan NO hace

- No rediseña `ModuleCard` ni cambia la paleta de la sección (por decisión D2 pendiente).
- No toca `supabase-migration.sql`, auth, Clerk ni Pyodide.
- No borra contenido para "reducir texto": reparte el que ya existe.
- No crea un sistema de preguntas nuevo: reutiliza `ChoiceQuestion`.
- No introduce videos. La evidencia dice que el formato que funcionó es SVG explicativo con leyenda.

## 7. Pendiente de tu lado

1. **D1** — ¿mergeamos la rama antes de migrar?
2. **D2** — ¿`globals.css` o `DESIGN.md` manda?
3. **D3** — ¿SVG a mano y archivamos lo huérfano?
4. **La URL del 404 que viste**, si no es `/learn/{module}`.