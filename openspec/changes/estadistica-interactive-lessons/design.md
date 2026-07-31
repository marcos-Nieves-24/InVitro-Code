# Design: Lecciones Interactivas — Módulo Estadística

## Architecture Overview

El cambio es puramente de contenido (MDX), no de infraestructura. No se toca ningún componente React ni lógica de la app.

```
src/content/modules/estadistica/lessons/
├── lesson01_descriptive_stats/
│   ├── lesson.md          ← CONVERTIR: MD plano → MDX con <Section>
│   ├── slides.md          ← ELIMINAR post-conversión
│   ├── quiz.md            ← SIN CAMBIOS
│   ├── lab.md             ← SIN CAMBIOS
│   ├── assignment.md      ← SIN CAMBIOS
│   ├── notebook.ipynb     ← SIN CAMBIOS
│   └── references.bib     ← SIN CAMBIOS
├── lesson02_data_distribution/ ...
└── ... (8 lecciones más)
```

## Data Flow

```
lesson.md (MDX con <Section>) 
    → page.tsx lee el archivo
    → matter() extrae frontmatter + contenido
    → split por /(?=<Section )/ para crear slide blocks
    → compileMDX() compila cada bloque con components map
    → LessonCarousel renderiza los slides compilados
```

**Punto crítico**: El split en `page.tsx` (línea 157) usa regex `/(?=<Section )/`. Esto significa que:
- Todo lo que NO esté dentro de un `<Section>` se ignora en el carrusel
- Los bloques `<Section>` DEBEN ser el contenedor top-level del contenido de cada slide
- El contenido entre sections (si existe) no se renderiza en el carrusel

## Decision: Template de Lección

Cada lección convertida sigue esta estructura:

```mdx
---
Module: 3
Lesson Number: N
Lesson Title: ...
... (frontmatter sin cambios)
---

<Section number={1} title="Título narrativo" eyebrow="INICIO">
  <MascotMessage mood="curious">
    Mensaje del mascot contextualizando el tema con biotecnología...
  </MascotMessage>
  
  Narrativa de motivación con problema concreto...
</Section>

<Section number={2} title="Concepto principal" eyebrow="CONCEPTO">
  <ConceptCard variant="definition">
    Definición formal del concepto...
  </ConceptCard>
  
  Explicación detallada...
  
  <ConceptCard variant="key-idea">
    Intuición clave: analogía o regla mental...
  </ConceptCard>
</Section>

<Section number={3} title="Nombre de sección interactiva" eyebrow="INTERACTIVA">
  <InteractiveTable 
    headers={["Col1", "Col2"]}
    rows={[["val1", "val2"], ...]}
    searchable={true}
    caption="Descripción de la tabla"
  />
  
  Análisis guiado de los datos...
  
  <ReflectionCheck
    blockId="reflection-lXX-concepto"
    moduleSlug="estadistica"
    lessonSlug="lessonXX_slug"
    prompt="Pregunta de reflexión..."
    answer="Respuesta correcta con explicación..."
  />
</Section>

<!-- Más sections de CONCEPTO, INTERACTIVA, etc. -->

<Section number={X} title="Resumen" eyebrow="CIERRE">
  <InteractiveTable headers={["Concepto", "Idea clave"]} rows={[...]} />
</Section>

<Section number={Y} title="Para la próxima lección" eyebrow="CIERRE">
  <MascotMessage mood="celebrating">
    Cierre motivacional...
  </MascotMessage>
  
  Adelanto de la siguiente lección...
</Section>
```

## Decision: Mapping de Contenido a Componentes

### Reglas de conversión

| Patrón en MD original | Componente MDX |
|---|---|
| `## Motivación` o primer párrafo narrativo | `<Section eyebrow="INICIO">` + `<MascotMessage>` |
| `### Medidas de Tendencia Central` | `<Section eyebrow="CONCEPTO">` |
| `**Definición**: ...` o definición formal | `<ConceptCard variant="definition">` |
| `Intuición: ...` | `<ConceptCard variant="key-idea">` |
| Tabla Markdown `\| Término \| Definición \|` | `<InteractiveTable>` |
| `## Implementación en Python` | `<Section eyebrow="INTERACTIVA">` |
| Bloque de código ```python | Se preserva, `pre` → `CodeBlock` automático |
| `## Errores Comunes` | `<ConceptCard variant="warning">` |
| `## Resumen` | `<Section eyebrow="CIERRE">` con `<InteractiveTable>` |
| `## Términos Clave` | `<Section eyebrow="CIERRE">` con `<InteractiveTable>` |
| Preguntas del checkpoint numeradas | `<ReflectionCheck>` o `<AnswerReveal>` |
| `## Mejores Prácticas` | `<CalloutInfo>` o `<ConceptCard variant="key-idea">` |

### Reglas de seccionamiento

1. **Máximo 15 slides por lección** — más de 15 cansa al estudiante
2. **Eyebrows rotativos**: INICIO → CONCEPTO → INTERACTIVA → CONCEPTO → ... → CIERRE
3. **Mínimo un componente interactivo cada 3 slides** para mantener engagement
4. **Cada slide debe ser autocontenido** — el carrusel muestra uno a la vez, no hay scroll entre slides

## Decision: Lección 1 — Estructura Propuesta

Basado en el contenido actual de `lesson01_descriptive_stats/lesson.md`:

| Slide | Eyebrow | Contenido principal |
|---|---|---|
| 1 | INICIO | MascotMessage + narrativa de secuenciación génica |
| 2 | CONCEPTO | Panorama general (dónde encaja en el módulo) |
| 3 | CONCEPTO | Medidas de tendencia central: media con LaTeX |
| 4 | CONCEPTO | Mediana y moda con ConceptCard |
| 5 | INTERACTIVA | Ejemplo guiado: reducción tumoral con código |
| 6 | CONCEPTO | Medidas de dispersión: varianza, std, IQR |
| 7 | INTERACTIVA | InteractiveTable comparando medidas de dispersión |
| 8 | CONCEPTO | ConceptCard warning: media vs mediana para datos sesgados |
| 9 | INTERACTIVA | ReflectionCheck: ¿cuándo usar media vs mediana? |
| 10 | CONCEPTO | Detección de outliers con IQR |
| 11 | INTERACTIVA | Ejemplo biotecnología: expresión génica TP53 |
| 12 | CONCEPTO | Errores comunes + mejores prácticas |
| 13 | EVALUACIÓN | Checkpoint de conceptos con AnswerReveal |
| 14 | CIERRE | InteractiveTable de términos clave (searchable) |
| 15 | CIERRE | MascotMessage + preview lección 2 |

## File Changes per Lesson

```
MODIFY:   src/content/modules/estadistica/lessons/lessonXX_slug/lesson.md
DELETE:   src/content/modules/estadistica/lessons/lessonXX_slug/slides.md
```

**No other files change.** Los componentes, la página de lección, y el layout permanecen intactos.

## Rollout Strategy

### Change 1: Pilot (Lección 1)
- Convertir lesson01_descriptive_stats
- Validar build, verificar carrusel
- PR #1: `feat: convert estadística lesson 1 to interactive MDX`

### Changes 2-N: Remaining Lessons
- Convertir lecciones 2-10 en batches de 2-3 según review budget
- Cada batch es un PR independiente
- Stacked a main: cada PR mergea directo a main

### Dependencies
- Ninguna — el cambio es autónomo (solo toca archivos de contenido)
- No requiere migraciones de DB, cambios de API, ni deploys

## Risks

| Riesgo | Mitigación |
|---|---|
| Build falla por MDX mal formado | Validar con `npm run build` post-conversión |
| Contenido LaTeX se rompe en Section | Mantener `$$...$$` fuera de JSX, usar bloques separados |
| InteractiveTable recibe datos mal formateados | Verificar que `rows` sea `string[][]` |
| ReflectionCheck no persiste respuestas | Usar blockId único por lección (ya validado en módulo IA) |
| Pérdida de precisión académica al reestructurar | Revisar contra el contenido original, preservar todas las fórmulas |
