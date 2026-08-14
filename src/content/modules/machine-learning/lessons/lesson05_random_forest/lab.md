# Lab 5: Bosque Aleatorio

## Objetivos

- Compará árboles individuales vs. bosques aleatorios
- Usá el OOB score para evaluar el modelo
- Analizá la importancia de características
- Ajustá los hiperparámetros

## Parte 1: Árbol vs. bosque

En el dataset de breast cancer, entrená:
1. Un árbol de decisión individual (max_depth=5)
2. Un bosque aleatorio (n_estimators=100, max_depth=5)

Compará la exactitud de entrenamiento y de prueba.

**Pregunta:** ¿Qué mejora aporta el bosque?

## Parte 2: El OOB score como validación

Entrená un bosque aleatorio con `oob_score=True`. Compará el OOB score con la exactitud del set de prueba para n_estimators = [10, 25, 50, 100, 200].

**Pregunta:** ¿Es el OOB score un proxy confiable de la exactitud de prueba?

## Parte 3: Importancia de características

Entrená un bosque aleatorio con n_estimators=200. Graficá las 10 importancias de características principales. Compará con la importancia de un árbol individual (profundidad 5).

**Pregunta:** ¿Son las mismas las features principales? Si no lo son, ¿por qué?

## Parte 4: n_estimators y rendimientos decrecientes

Graficá el OOB score vs. n_estimators desde 1 hasta 500 en pasos de 10.

**Pregunta:** ¿En qué n los rendimientos empiezan a decrecer? ¿Cuál es el punto óptimo costo-beneficio?

## Parte 5: Bosque aleatorio con datos desbalanceados

Usá `make_classification(weights=[0.9, 0.1])` para crear datos desbalanceados. Compará:
1. Bosque aleatorio por defecto
2. Bosque aleatorio con `class_weight='balanced'`

Reportá la precisión y la sensibilidad para la clase minoritaria.

## Entregables

- Notebook con las 5 partes
- Gráfico de OOB vs. n_estimators
- Gráfico de comparación de importancia de características
- Comparación de precisión/sensibilidad para datos desbalanceados

## Tiempo estimado: 45 minutos
