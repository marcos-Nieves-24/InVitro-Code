# Proposal: Lecciones Interactivas — Módulo Estadística

## Intent

Convertir las 10 lecciones del Módulo 3 (Estadística y Probabilidad) de Markdown plano a MDX interactivo, usando el mismo sistema de componentes React que los módulos 1 (IA) y 2 (Python). Esto habilita el carrusel de slides, mejora la experiencia de aprendizaje con componentes interactivos, y alinea el módulo con el estándar de calidad del resto de la plataforma.

## Problem Statement

El módulo de estadística tiene contenido sólido pero sufre de dos deficiencias críticas:

1. **Sin carrusel de slides**: La app renderiza lecciones como slides cuando detecta bloques `<Section>` en el MDX. Como las 10 lecciones de estadística son Markdown plano, el LessonCarousel no se activa y los estudiantes ven texto corrido sin estructura visual.

2. **Sin componentes interactivos**: Los módulos 1 y 2 usan `ConceptCard`, `MascotMessage`, `ComparisonTable`, `InteractiveTable`, `ReflectionCheck`, `AnswerReveal`, `CalloutInfo`, y `CalloutCheck` para reforzar conceptos. Estadística usa cero de estos componentes, resultando en una experiencia plana comparada con los otros módulos.

## Scope

### In Scope (Change 1 — Pilot)
- **Lección 1: Estadística Descriptiva** — conversión completa a MDX con todos los componentes aplicables
- Eliminación del archivo `slides.md` (es un artefacto de planificación no usado en runtime)
- Reaprovechamiento de contenido útil de slides.md dentro de la lección

### In Scope (Subsequent Changes)
- Lecciones 2-10: misma conversión MDX, iterando sobre el patrón establecido en la Lección 1

### Out of Scope
- Cambios a quizzes, labs, assignments, o notebooks (solo se toca lesson.md y se elimina slides.md)
- Nuevos datasets o ejercicios (el contenido existente se mejora pero no se expande significativamente)
- Cambios a la infraestructura de componentes (los componentes ya existen y funcionan)

## Approach

### Patrón de conversión

Cada lección se estructura con bloques `<Section>` que definen los slides del carrusel:

```
<Section number={1} title="Motivación" eyebrow="INICIO">
  <MascotMessage>...</MascotMessage>
  ...contenido narrativo...
</Section>

<Section number={2} title="Concepto clave" eyebrow="CONCEPTO">
  <ConceptCard variant="definition">...</ConceptCard>
  ...explicación...
</Section>

<Section number={3} title="Datos en acción" eyebrow="INTERACTIVA">
  <InteractiveTable headers={...} rows={...} searchable />
  ...análisis guiado...
</Section>
```

### Componentes por tipo de contenido

| Contenido | Componente |
|---|---|
| Definiciones formales | `ConceptCard variant="definition"` |
| Ideas clave / intuiciones | `ConceptCard variant="key-idea"` |
| Advertencias / errores comunes | `ConceptCard variant="warning"` |
| Narrativa / motivación inicial | `MascotMessage` |
| Tablas de datos (búsqueda/orden) | `InteractiveTable` |
| Comparaciones A vs B | `ComparisonTable` |
| Preguntas de reflexión | `ReflectionCheck` |
| Respuestas reveladas | `AnswerReveal` |
| Callouts informativos | `CalloutInfo` |
| Checkpoints de comprensión | `CalloutCheck` |
| Bloques de código Python | `CodeBlock` (via `pre`) |

### Guías de mejora de contenido

- Agregar `MascotMessage` al inicio de cada lección con una introducción narrativa estilo "laboratorio"
- Convertir tablas Markdown existentes a `InteractiveTable` (con searchable=true cuando tengan >5 filas)
- Agregar `ReflectionCheck` en puntos clave donde el estudiante debe procesar un concepto
- Usar `ConceptCard` para encapsular definiciones, intuiciones y advertencias
- Mantener el formato LaTeX con `$$...$$` para ecuaciones (remark-math + rehype-katex)
- Todo el contenido en español

### Eliminación de slides.md

- Los archivos `slides.md` existen en las 10 lecciones pero NO son leídos por el runtime
- Su contenido (bullet points de conceptos) puede reaprovecharse como base para los bloques `<Section>`
- Después de la conversión, cada `slides.md` se elimina

## Tradeoffs

| Decisión | Pro | Contra |
|---|---|---|
| Convertir todo a MDX con Section | Habilita carrusel, mejora UX dramáticamente | Pierde renderizado "continuo" (scroll infinito) — pero ese modo es peor UX |
| Eliminar slides.md | Reduce clutter, una sola fuente de verdad | Si alguien los usaba como referencia offline, se pierde |
| Pilot con Lección 1 | Riesgo controlado, patrón reusable | Las 9 lecciones restantes quedan desactualizadas hasta su turno |
| No tocar quizzes/labs | Minimiza scope, riesgo bajo | La experiencia del módulo queda parcialmente mejorada |

## Rollback Plan

- Cada lección convertida es un commit independiente
- `git revert` de cualquier lección problemática sin afectar las demás
- La Lección 1 como piloto permite validar el approach antes de escalar

## Success Criteria

- La Lección 1 renderiza correctamente en el LessonCarousel (slides con navegación)
- Todos los componentes interactivos funcionan (InteractiveTable busca/ordena, ReflectionCheck valida, AnswerReveal expande)
- El contenido mantiene precisión académica
- El build de Next.js pasa sin errores
