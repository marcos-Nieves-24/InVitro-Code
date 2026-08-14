# Lab 8: Gradient Boosting

## Objetivos

- Entrená modelos de gradient boosting y entendé el efecto de la tasa de aprendizaje
- Usá predicciones por etapas para monitorear el entrenamiento
- Compará boosting con el bosque aleatorio
- Ajustá los hiperparámetros

## Parte 1: Experimento de tasa de aprendizaje

En el dataset de breast cancer, entrená `GradientBoostingClassifier` con learning_rates = [0.01, 0.05, 0.1, 0.5, 1.0] y n_estimators=100. Graficá la exactitud de prueba vs. la tasa de aprendizaje.

**Pregunta:** ¿Cuál es la tasa de aprendizaje óptima?

## Parte 2: Predicciones por etapas

Entrená un modelo GB con n_estimators=200, learning_rate=0.1. Usá `staged_score()` para obtener los scores de entrenamiento y de prueba en cada etapa. Graficá ambas curvas.

**Pregunta:** ¿En qué n_estimators se estabiliza la exactitud de prueba?

## Parte 3: Boosting vs. bosque aleatorio

Compará GradientBoostingClassifier (lr=0.1, n=100, depth=3) con RandomForestClassifier (n=100, depth=3) en breast cancer.

**Pregunta:** ¿Cuál rinde mejor en este dataset?

## Parte 4: Efecto de max_depth

Entrená modelos GB con max_depth = [2, 3, 5, 10] (learning_rate=0.1, n_estimators=100). Compará la exactitud de prueba.

**Pregunta:** ¿Por qué la profundidad 10 rinde peor que la 3?

## Parte 5: Subsample (boosting estocástico)

Entrená GB con subsample = [0.5, 0.8, 1.0] (learning_rate=0.1, n_estimators=100, max_depth=3). Compará la exactitud de prueba.

**Pregunta:** ¿Ayuda la estocasticidad a la generalización?

## Entregables

- Notebook con las 5 partes
- Gráfico de tasa de aprendizaje (Parte 1)
- Curvas de aprendizaje (Parte 2)
- Tabla de comparación de modelos (Parte 3)

## Tiempo estimado: 45 minutos
