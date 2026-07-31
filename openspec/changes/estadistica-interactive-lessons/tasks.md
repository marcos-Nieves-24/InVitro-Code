# Tasks: Lecciones Interactivas — Módulo Estadística

## Review Workload Forecast

| Métrica | Valor |
|---|---|
| Lecciones totales | 10 |
| Líneas estimadas por lección | ~300 (conversión de MD → MDX) |
| Líneas totales estimadas | ~3,000 |
| 400-line budget risk | **High** |
| Chained PRs recommended | **Yes** |
| Decision needed before apply | **Yes** |

### PR Chain Strategy

**10 PRs, stacked a main**. Una lección por PR. Cada PR es autónomo y mergea directo a `main`.

| PR | Lección | Líneas est. | Depende de |
|---|---|---|---|
| PR #1 | lesson01_descriptive_stats (pilot) | ~310 | — |
| PR #2 | lesson02_data_distribution | ~300 | PR #1 |
| PR #3 | lesson03_probability | ~300 | PR #2 |
| PR #4 | lesson04_statistical_distributions | ~300 | PR #3 |
| PR #5 | lesson05_relationships | ~300 | PR #4 |
| PR #6 | lesson06_exploratory_data_analysis | ~300 | PR #5 |
| PR #7 | lesson07_dimensionality_reduction | ~300 | PR #6 |
| PR #8 | lesson08_clustering | ~300 | PR #7 |
| PR #9 | lesson09_model_evaluation | ~300 | PR #8 |
| PR #10 | lesson10_data_storytelling | ~300 | PR #9 |

---

## Tasks

### Phase 1: Pilot — Lección 1

#### 1.1 Eliminar slides.md de la Lección 1
- **Archivo**: `src/content/modules/estadistica/lessons/lesson01_descriptive_stats/slides.md`
- **Acción**: Eliminar el archivo
- **Verificación**: El archivo ya no existe en el filesystem
- **Nota**: El contenido útil (estructura de conceptos) ya fue mapeado en el diseño

#### 1.2 Convertir lesson.md a MDX con estructura de Section
- **Archivo**: `src/content/modules/estadistica/lessons/lesson01_descriptive_stats/lesson.md`
- **Acción**: Reestructurar el contenido en 15 bloques `<Section>` según el diseño:
  1. INICIO: MascotMessage + narrativa de secuenciación génica
  2. CONCEPTO: Panorama general (dónde encaja en el módulo)
  3. CONCEPTO: Medidas de tendencia central — media con LaTeX
  4. CONCEPTO: Mediana y moda con ConceptCard
  5. INTERACTIVA: Ejemplo guiado — reducción tumoral con código
  6. CONCEPTO: Medidas de dispersión — varianza, std, IQR
  7. INTERACTIVA: ComparisonTable/InteractiveTable de medidas
  8. CONCEPTO: ConceptCard warning — media vs mediana
  9. INTERACTIVA: ReflectionCheck ¿cuándo usar media vs mediana?
  10. CONCEPTO: Detección de outliers con IQR
  11. INTERACTIVA: Ejemplo biotecnología — expresión génica TP53
  12. CONCEPTO: Errores comunes + mejores prácticas
  13. EVALUACIÓN: Checkpoint con AnswerReveal
  14. CIERRE: InteractiveTable de términos clave (searchable)
  15. CIERRE: MascotMessage + preview lección 2
- **Verificación**: Build pasa, carrusel muestra 15 slides

#### 1.3 Aplicar ConceptCards
- **Ubicación**: Slides 3, 4, 6, 8, 12
- **Variantes**: `definition` para definiciones formales, `key-idea` para intuiciones, `warning` para errores comunes
- **Verificación**: Cada ConceptCard se renderiza correctamente en el slide correspondiente

#### 1.4 Aplicar InteractiveTable
- **Ubicación**: Slide 14 (Términos Clave)
- **Configuración**: `headers={["Término", "Definición"]}`, `searchable={true}`, ~8 filas
- **Verificación**: Búsqueda y ordenamiento funcionan en ambas columnas

#### 1.5 Aplicar MascotMessage
- **Ubicación**: Slide 1 (apertura), Slide 15 (cierre)
- **Contenido**: Narrativa estilo laboratorio, conectando con biotecnología
- **Verificación**: Mensajes se renderizan con avatar y formato correcto

#### 1.6 Aplicar ReflectionCheck
- **Ubicación**: Slide 9 (media vs mediana)
- **Configuración**: `blockId="reflection-l01-mean-vs-median"`, `moduleSlug="estadistica"`, `lessonSlug="lesson01_descriptive_stats"`
- **Verificación**: El input acepta texto, la validación funciona

#### 1.7 Aplicar AnswerReveal
- **Ubicación**: Slide 13 (checkpoint)
- **Contenido**: Respuestas a las preguntas de evaluación
- **Verificación**: Expande/colapsa correctamente

#### 1.8 Verificar build
- **Comando**: `npm run build`
- **Criterio**: Exit code 0, sin errores de MDX
- **Verificación**: La app compila y la lección es navegable

#### 1.9 Commit y PR #1
- **Mensaje**: `feat: convert estadística lesson 1 to interactive MDX`
- **Archivos**: Solo `lesson.md` (modificado) y `slides.md` (eliminado)
- **PR**: Crear PR apuntando a `main`

### Phase 2-10: Lecciones 2-10 (Iteración)

Cada fase sigue el mismo patrón que Phase 1, adaptado al contenido específico de cada lección:

#### 2.x Lección 2 — Distribución de Datos
- Slides estimados: 12-14
- Componentes clave: InteractiveTable para tipos de distribuciones, ComparisonTable para simetría/asimetría, ConceptCard para curtosis
- PR #2

#### 3.x Lección 3 — Probabilidad
- Slides estimados: 12-14
- Componentes clave: ConceptCard para Bayes, InteractiveTable para probabilidades condicionales, ReflectionCheck para independencia
- PR #3

#### 4.x Lección 4 — Distribuciones Estadísticas
- Slides estimados: 12-14
- Componentes clave: ComparisonTable para Bernoulli/Binomial/Poisson, ConceptCard para Normal, InteractiveTable para propiedades
- PR #4

#### 5.x Lección 5 — Relaciones entre Variables
- Slides estimados: 10-12
- Componentes clave: InteractiveTable para matriz de correlación, ConceptCard para Pearson vs Spearman, ReflectionCheck para correlación ≠ causalidad
- PR #5

#### 6.x Lección 6 — Análisis Exploratorio de Datos
- Slides estimados: 12-14
- Componentes clave: InteractiveTable para estadísticas de columnas, ConceptCard para missing values, CalloutInfo para visualizaciones
- PR #6

#### 7.x Lección 7 — Reducción de Dimensionalidad
- Slides estimados: 10-12
- Componentes clave: ConceptCard para PCA, InteractiveTable para varianza explicada, ReflectionCheck para elegir componentes
- PR #7

#### 8.x Lección 8 — Clustering
- Slides estimados: 12-14
- Componentes clave: ConceptCard para K-Means, InteractiveTable para elbow/silhouette, ComparisonTable para métodos
- PR #8

#### 9.x Lección 9 — Evaluación de Modelos
- Slides estimados: 12-14
- Componentes clave: InteractiveTable para métricas (MAE, MSE, RMSE, R²), ComparisonTable train/test, ConceptCard para overfitting
- PR #9

#### 10.x Lección 10 — Narración de Datos
- Slides estimados: 10-12
- Componentes clave: ConceptCard para storytelling, InteractiveTable para ejemplos de visualizaciones efectivas, CalloutInfo para mejores prácticas
- PR #10

## Task Dependencies

```
1.1 → 1.2 → 1.3-1.7 (paralelo) → 1.8 → 1.9 (PR #1)
                                       ↓
                                  2.x (PR #2) → 3.x (PR #3) → ... → 10.x (PR #10)
```

## Verification Checklist (por lección)

- [ ] `npm run build` pasa sin errores
- [ ] LessonCarousel muestra el número correcto de slides
- [ ] Navegación entre slides funciona (botones y teclado)
- [ ] InteractiveTable: búsqueda y ordenamiento funcionan
- [ ] ReflectionCheck: acepta input y valida
- [ ] AnswerReveal: expande/colapsa
- [ ] ConceptCard: se renderiza con el variant correcto
- [ ] MascotMessage: avatar y texto visibles
- [ ] LaTeX: ecuaciones se renderizan con KaTeX
- [ ] Código Python: syntax highlighting funciona
- [ ] slides.md ha sido eliminado
- [ ] Contenido en español, tono accesible
