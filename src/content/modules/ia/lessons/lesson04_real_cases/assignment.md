# Assignment: Pipeline completo de clasificación

## Objetivos

- Construir un pipeline completo de clasificación usando el dataset Breast Cancer Wisconsin
- Entrenar y evaluar al menos dos modelos distintos
- Interpretar métricas de clasificación en el contexto de diagnóstico médico
- Discutir los tradeoffs de selección de modelo en biotecnología

## Instrucciones

### Tarea 1: Construir el pipeline completo

Implementá un notebook que ejecute el siguiente flujo:

1. **Carga de datos**: usar `sklearn.datasets.load_breast_cancer()`.
2. **División**: separar en `train` y `test` con `train_test_split` (20% de prueba, `stratify` por clase, `random_state=42`).
3. **Preprocesamiento**: escalar las features con `StandardScaler`.
4. **Entrenamiento**: entrenar dos modelos:
   - `KNeighborsClassifier(n_neighbors=5)`
   - `LogisticRegression(max_iter=1000, random_state=42)`
5. **Evaluación**: para cada modelo, calcular:
   - Matriz de confusión
   - Accuracy, precision, recall, F1-score
6. **Comparación**: crear una tabla comparativa con las métricas de ambos modelos.

### Tarea 2: Escribir un reporte de análisis

Incluí una celda de markdown con las siguientes secciones:

- **Resumen ejecutivo**: qué hiciste, con qué datos y qué modelos probaste.
- **Interpretación de métricas**: explicá qué significa cada métrica en este contexto médico.
- **Análisis de errores**: identificá cuántos falsos positivos y falsos negativos tuvo cada modelo.
- **Recomendación final**: elegí un modelo y justificá por qué es el más adecuado para un screening de cáncer de mama.

### Tarea 3: Tradeoffs de selección de modelo

Respondé en una celda de markdown:

- ¿Por qué accuracy puede ser una métrica engañosa en problemas médicos?
- ¿Qué ventaja tiene LogisticRegression sobre KNN en términos de interpretabilidad?
- ¿En qué situación preferirías KNN sobre LogisticRegression?
- ¿Cómo cambiaría tu elección si el costo de un falso positivo fuera muy alto (por ejemplo, derivar a biopsias innecesarias)?

## Entregables

- Un notebook Jupyter (`.ipynb`) con todo el código ejecutado, outputs y respuestas
- Código en inglés, análisis en español

## Rúbrica de Evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Insuficiente (1 pt) |
|----------|-------------------|---------------|-------------------|---------------------|
| Pipeline completo | Todos los pasos (carga, split, escalado, entrenamiento, evaluación, comparación) están implementados y ejecutan sin errores | Faltan detalles menores, pero el pipeline es funcional | Falta algún paso importante (por ejemplo, escalado o comparación) | Pipeline incompleto o con errores graves |
| Interpretación de métricas | Explica con precisión qué representa cada métrica en el contexto médico y conecta con falsos positivos/negativos | Interpretación correcta pero poco profunda | Interpretación parcial o con errores conceptuales | Sin interpretación o incorrecta |
| Reporte de análisis | Reporte claro, bien estructurado, con recomendación justificada y análisis de errores completo | Buen reporte con recomendación razonable | Reporte superficial o con recomendación poco justificada | Sin reporte o sin recomendación |
| Tradeoffs de selección de modelo | Discute múltiples escenarios (costo de FP, costo de FN, interpretabilidad, escalabilidad) | Discute los tradeoffs principales | Menciona tradeoffs sin profundizar | No discute tradeoffs |

**Total: 16 puntos**

## Tiempo Estimado

2 horas
