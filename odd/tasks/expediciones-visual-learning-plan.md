# Propuesta: Aprendizaje visual por slices — Expediciones

**Rama:** `feat/presentation-reemplazo-directo` · **Fecha:** 2026-10-11
**Naturaleza:** plan + inicio de implementación. Documento de trabajo.

---

## 1. Lo que pide el usuario, traducido a técnico

| Pedido | Estado real | Gap |
|---|---|---|
| Nada de scroll, slices con click progresivo | **Ya es el runtime**: shell `fixed inset-y-0`, `RevealSequence` con revelado por click y `Paso x de y` | El motor funciona; el contenido no lo aprovecha |
| No quiero markdown | El contenido **es** MDX (`lesson.md`) | Decisión de arquitectura, ver §3 |
| Texto interactivo | `DialogueBox` existe con `lines[]`, typewriter, contador `n/m` | **Inerte**: el único uso pasa `children` sin `lines`/`onNext` |
| Animaciones explicativas | 2 players SVG funcionando | **Inertes**: ver §2 |
| Video | `LessonVideo` **ya existe** en `src/components/lesson/lesson-video.tsx` | **No exportado, no en el mapa MDX, 0 usos** |

**El insight central: tres de las cuatro capacidades ya están construidas y desconectadas.** El trabajo no es
crear un sistema nuevo; es conectarlo y cambiar la gramática de una slice.

---

## 2. Por qué las animaciones no son explicativas (diagnóstico con evidencia)

El motor `useAnymotionTimeline` (`src/components/anymotion/hooks/useAnymotionTimeline.ts`) expone una API
completa y determinista:

```
play() · pause() · toggle() · seek(t) · reset() · isPlaying · time · progress
```

Y su docstring dice textualmente: *"the animation is deterministic — scrubbing to any t renders that exact frame"*.

**Nada de eso se usa.** Verificado:

| Player | Duración | Usa del hook | Controles |
|---|---|---|---|
| `ConidiaToVectorPlayer` (`:25`) | 2,5 s | **sólo `progress`** | ninguno |
| `FeatureSpace2DPlayer` (`:43`) | 2,0 s | **sólo `progress`** | ninguno |

- `autoPlay = true` por defecto en ambos (`:24` y `:42`): se reproduce **una vez** y desaparece.
- **Ningún player respeta `prefers-reduced-motion`** (solo `MatrixPlayer`, que además no se usa, y solo por CSS).
- `AnymotionControls` (play/pause + scrubber) se eliminó en `68d1d51` y **nunca se reemplazó** en estos dos.

**Consecuencia pedagógica:** el estudiante ve una película de 2 segundos que no puede pausar, repetir ni recorrer.
Un concepto no se explicaMostrando una vez: se explicaanthoniendo停在 el momento clave y manipulando.

**No es problema de diseño visual.** Los SVG están bien construidos. Es un problema de **control**.

---

## 3. La decisión grande: ¿fuera del markdown?

### Lo que NO propongo

Arrancar MDX y reescribir 41 lecciones en un formato nuevo (TS/JSON/YAML). Costos: se pierde el versionado
diffable del contenido, el flujo de escritura ligero, y las 41 lecciones quedarían inconsistentes durante el
tránsito.

### Lo que propongo: cambiar qué contiene una slice, no el contenedor

MDX queda como **formato de archivo**, pero una `<Section>` deja de ser un párrafo y pasa a ser una
**composición de presentation primitives**. Regla de authoring:

> Una slice puede contener: `<DialogueBox>`, `<RevealSequence>`, un player de animación, `<LessonVideo>`,
> `<ChoiceQuestion>`, y tablas/diagramas. **No puede contener prosa corrida.**
> El texto explicativo vive en los `lines[]` del `DialogueBox` (narrado por el científico), no en párrafos.

Consecuencias medibles:

- El texto pasa de "párrafo que se lee" a "frase que se avanza", uno a uno.
- Se elimina el bloque de texto largo → entra la animación que lo reemplazaba.
- El presupuesto de texto por slice baja de ~168 palabras a frases de 1–2 líneas por paso.

**Esto es incremental, verificable y reversible slice por slice.** Un formato TS completo puede evaluarse
después sobre la evidencia de las 4 lecciones piloto, no antes.

---

## 4. Plan

### Fase A — Conectar lo que ya existe · **P0** · sin contenido nuevo

| # | Tarea | Archivos | Verificación | Tamaño |
|---|---|---|---|---|
| A1 | **OverfittingPlayer** SVG con el patrón vivo + registrar en MDX; actualizar `lesson02:280` | nuevo `animations/OverfittingPlayer.tsx`, `animations/index.ts`, `components/lesson/index.ts`, `page.tsx:37-40` + `:171-174`, `lesson02…/lesson.md:280` | La lección carga el player, sin 404 | Media |
| A2 | **Controles en los players**: recrear un control pause/replay/seek y conectarlo a los 3 | nuevo `AnymotionControls.tsx`, `ConidiaToVectorPlayer`, `FeatureSpace2DPlayer`, `OverfittingPlayer` | Se puede pausar, repetir y recorrer la línea de tiempo | Media |
| A3 | **`prefers-reduced-motion` en el hook**: `autoPlay` a false y estado inicial fijo | `useAnymotionTimeline.ts` | Con reduced-motion no hay reproducción automática | Pequeña |
| A4 | **Registrar `LessonVideo`** en el barrel y en el mapa MDX | `components/lesson/index.ts`, `page.tsx` | `<LessonVideo>` usable desde `lesson.md` | Pequeña |
| A5 | **Conectar `lines`/`onNext`** en el DialogueBox de `ia` L1 y decidir quién controla el avance | `lesson01…/lesson.md`, `DialogueBox.tsx` | Typewriter, `n/m` y "Continuar" visibles | Media |

### Fase B — Que el texto deje de ser prosa · **P1**

| # | Tarea | Verificación | Tamaño |
|---|---|---|---|
| B1 | Gramática de slice documentada (§3) en `DESIGN.md` | Doc legible por un autor nuevo | Pequeña |
| B2 | Migrar `ia` L1 como referencia canónica del modelo | L1 100 % sin prosa corrida | Media |
| B3 | Piloto: `machine-learning/lesson09` (6 slices, la más corta) | Contraste de dificultad | Media |
| B4 | Migrar el resto de `ia` (L2–L4) | Cobertura uniforme | Media |
| B5 | Lotes `python` → `estadistica` → `machine-learning` | 431 slices | **Grande** |

### Fase C — Animaciones que enseñan · **P1/P2**

**Regla dura, para no llenar la UI de adorno:** una animación entra **sólo** si ocupa el lugar de un párrafo
existente, y además cumple:

1. **Controlable** — pause / replay / step (A2).
2. **Reducible** — muestra un frame clave estático bajo `prefers-reduced-motion` (A3).
3. **Interactiva** — el estudiante cambia algo y ve el efecto. Es el salto de "declarativo" a "explicativo".
4. **Con leyenda** — `caption` obligatorio.

La regla 3 es la que hoy falta en las 2 existentes y la razón real de tu observación.

| # | Tarea | Verificación | Tamaño |
|---|---|---|---|
| C1 | Catálogo priorizado por párrafo que reemplaza, no por módulo | Lista con el slice exacto | Pequeña |
| C2 | Las 3 de mayor retorno, con interactividad real | Cada una reemplaza ≥25 palabras visibles | Media |
| C3 | **OverfittingPlayer cuenta como C2**: es el ejemplo canónico de "cambiar el grado del polinomio y ver el error" | Interacción real, no reproducción | Media |

### Fase D — El ejercicio interactivo · **P2**

Depende de A y B. **Reutiliza `ChoiceQuestion`**, que ya persiste en
`POST /api/v1/progress/reflection`. No se crea un sistema de preguntas nuevo.

1. `src/app/learn/[module]/page.tsx` — cierra el único 404 real (`/learn/{module}`).
2. Convertirlo en índice con slices y posición actual.
3. Ejercicio de práctica por expedición.

---

## 5. Orden de ejecución

```
Fase A (A1-A5)  →  B1-B2 (referencia canónica)  →  C1-C3
        └──────────────── en paralelo ──────────────┘
Fase B (B3-B5)  →  Fase D
```

**Fase A completa es el 90% del valor.** Sin controles, `autoPlay` y sin registro MDX, las animaciones y el
video que existen son invisibles para el usuario final.

---

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| Recrear `AnymotionControls` después de borrarlo | Se recupera desde `68d1d51` (`git show 68d1d51^:src/components/anymotion/AnymotionControls.tsx`), no de memoria |
| 431 slices de migración | Lotes por módulo + módulo piloto |
| Animaciones decorativas de nuevo | Regla 4 puntos de §C, con el párrafo a reemplazar como criterio de admisión |
| Regresión en LaTeX/tablas al reescribir MDX | `npm run build` por lote + diff de `$...$` |

## 7. Pendiente de decisión

1. ¿Se acepta MDX como contenedor con gramática de slices (§3), o se quiere un formato TS/JSON real?
2. ¿El avance lo controla el `DialogueBox` (una frase = un click) o el `RevealSequence` (varias frases juntas)?
   Hoy están en conflicto y por eso el typewriter no se ve.
