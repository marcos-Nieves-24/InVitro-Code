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

