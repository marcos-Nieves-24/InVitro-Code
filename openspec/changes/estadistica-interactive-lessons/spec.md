# Spec: Lecciones Interactivas — Módulo Estadística

## Overview

Este spec define los requisitos para convertir las lecciones del Módulo 3 (Estadística y Probabilidad) de Markdown plano a MDX interactivo con componentes React, alineándolas con la experiencia de los módulos 1 y 2.

## Requirements

### REQ-001: Estructura de Slides con Section

Cada lección DEBE dividirse en bloques `<Section>` que definen los slides del carrusel.

**Given** un archivo lesson.md convertido a MDX
**When** la app renderiza la lección en `/learn/estadistica/{lesson-slug}`
**Then** el LessonCarousel DEBE mostrar los slides en orden
**And** cada slide DEBE tener un `eyebrow` que indique la fase (INICIO, CONCEPTO, INTERACTIVA, EVALUACIÓN, CIERRE)

### REQ-002: Componente MascotMessage en apertura

Cada lección DEBE abrir con un `<MascotMessage>` que presente el tema de forma narrativa y motive al estudiante.

**Given** el primer slide de cada lección
**When** el estudiante abre la lección
**Then** DEBE ver un mensaje del mascot en estilo "laboratorio" que contextualice el tema
**And** el mensaje DEBE conectar con aplicaciones reales de biotecnología

### REQ-003: ConceptCard para definiciones e intuiciones

Toda definición formal, intuición clave, o advertencia DEBE usar `<ConceptCard>`.

**Given** contenido conceptual en la lección
**When** se encuentra una definición, idea clave o advertencia
**Then** DEBE envolverse en `<ConceptCard variant="definition|key-idea|warning">`
**And** el texto DEBE mantenerse conciso (máximo un párrafo)

### REQ-004: InteractiveTable para datos tabulares

Toda tabla con datos que se beneficie de búsqueda u ordenamiento DEBE usar `<InteractiveTable>`.

**Given** una tabla en el contenido original con 3+ filas de datos
**When** se convierte la lección
**Then** la tabla DEBE usar `<InteractiveTable>` con `headers` y `rows` como arrays
**And** si la tabla tiene más de 5 filas, DEBE tener `searchable={true}`

### REQ-005: ComparisonTable para comparaciones

Toda comparación lado a lado DEBE usar `<ComparisonTable>`.

**Given** contenido que compara dos conceptos/entidades
**When** se estructura la lección
**Then** DEBE usar `<ComparisonTable rows={[{feature, left, right}]}>`
**And** cada fila DEBE tener `feature` como nombre descriptivo

### REQ-006: ReflectionCheck para preguntas de procesamiento

Puntos clave donde el estudiante debe procesar activamente un concepto DEBEN incluir `<ReflectionCheck>`.

**Given** un concepto que requiere comprensión profunda (no memorización)
**When** se diseña la lección
**Then** DEBE incluir al menos un `<ReflectionCheck>` con:
  - `blockId` único por lección
  - `moduleSlug="estadistica"`
  - `lessonSlug` correspondiente
  - `prompt` con pregunta de reflexión
  - `answer` con respuesta correcta y explicación

### REQ-007: AnswerReveal para soluciones

Soluciones de ejercicios o respuestas a preguntas DEBEN usar `<AnswerReveal>`.

**Given** un checkpoint o ejercicio con respuesta
**When** el estudiante quiere verificar su respuesta
**Then** DEBE poder expandir `<AnswerReveal summary="Ver respuesta">` para ver la solución

### REQ-008: CalloutInfo y CalloutCheck para énfasis

Información complementaria o checkpoints DEBEN usar `<CalloutInfo>` o `<CalloutCheck>`.

**Given** tips, datos curiosos o verificaciones rápidas
**When** se estructura la lección
**Then** tips DEBEN usar `<CalloutInfo>`
**And** verificaciones DEBEN usar `<CalloutCheck>`

### REQ-009: Preservación de contenido matemático

Todo el contenido LaTeX DEBE preservarse con sintaxis `$$...$$` para ecuaciones display y `$...$` para inline.

**Given** fórmulas matemáticas en el contenido original
**When** se convierte a MDX
**Then** DEBEN mantener el formato LaTeX compatible con remark-math + rehype-katex
**And** NO DEBEN romperse al estar dentro de bloques `<Section>`

### REQ-010: Preservación de bloques de código

Los bloques de código Python DEBEN mantenerse funcionales y usar el componente `CodeBlock` automáticamente vía `pre`.

**Given** bloques de código Python en el contenido original
**When** se convierte a MDX
**Then** DEBEN usar triple backtick con lenguaje `python`
**And** el componente `CodeBlock` DEBE aplicarse automáticamente (el MDX provider mapea `pre` → `CodeBlock`)

### REQ-011: Eliminación de slides.md

El archivo `slides.md` de cada lección DEBE eliminarse después de la conversión.

**Given** una lección convertida exitosamente a MDX
**When** se verifica que el contenido está completo en lesson.md
**Then** el archivo `slides.md` DEBE eliminarse del directorio de la lección
**And** cualquier contenido útil de slides.md DEBE haberse incorporado al lesson.md

### REQ-012: Idioma español

Todo el contenido textual DEBE permanecer en español.

**Given** cualquier texto en la lección convertida
**When** se revisa el contenido
**Then** DEBE estar en español con tono profesional y accesible
**And** los términos técnicos en inglés DEBEN estar en inglés (mean, variance, IQR, etc.)

### REQ-013: Build sin errores

El build de Next.js DEBE pasar sin errores después de cada conversión.

**Given** una o más lecciones convertidas
**When** se ejecuta `npm run build`
**Then** DEBE completar exitosamente
**And** no DEBE haber warnings de MDX no resueltos

## Scenarios: Lección 1 — Estadística Descriptiva (Piloto)

### Scenario 1: Estructura de slides
**Given** el archivo lesson.md de lesson01_descriptive_stats convertido
**When** la app renderiza `/learn/estadistica/lesson01_descriptive_stats`
**Then** el LessonCarousel DEBE mostrar entre 8 y 15 slides
**And** el primer slide DEBE ser de tipo "INICIO" con MascotMessage
**And** el último slide DEBE ser de tipo "CIERRE" con resumen o vista previa

### Scenario 2: Definiciones con ConceptCard
**Given** el contenido sobre media, mediana y moda
**When** se renderiza la sección de tendencia central
**Then** DEBE haber al menos 3 ConceptCards: una definición (definition), una intuición (key-idea), y una advertencia sobre datos sesgados (warning)

### Scenario 3: Tabla de términos clave con InteractiveTable
**Given** la tabla de "Términos Clave" al final de la lección original
**When** se renderiza la lección convertida
**Then** DEBE usar `<InteractiveTable>` con searchable
**And** las columnas DEBEN ser ["Término", "Definición"]
**And** el ordenamiento DEBE funcionar en ambas columnas

### Scenario 4: ReflectionCheck sobre media vs mediana
**Given** el concepto de elegir media vs mediana para datos sesgados
**When** el estudiante llega a esa sección
**Then** DEBE haber un `<ReflectionCheck>` preguntando cuándo usar cada medida
**And** la respuesta DEBE explicar el impacto de los outliers

### Scenario 5: Código Python funcional
**Given** los bloques de código Python de la lección original
**When** se renderizan en la lección convertida
**Then** DEBEN mostrarse con syntax highlighting
**And** DEBEN ser ejecutables en el PyodideRunner si aplica

## Acceptance Criteria

- [ ] Lección 1 renderiza en LessonCarousel con slides navegables
- [ ] Todos los componentes se renderizan sin errores de consola
- [ ] InteractiveTable permite buscar y ordenar
- [ ] ReflectionCheck valida respuestas correctamente
- [ ] AnswerReveal expande/colapsa sin errores
- [ ] Contenido LaTeX se renderiza correctamente
- [ ] `npm run build` pasa sin errores
- [ ] `slides.md` de la lección 1 ha sido eliminado
- [ ] El contenido mantiene precisión académica y está en español
