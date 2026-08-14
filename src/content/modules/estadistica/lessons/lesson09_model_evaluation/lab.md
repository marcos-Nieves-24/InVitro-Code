# Lab: Evaluación de modelos

## Objetivo

Entrená y evaluá un modelo de regresión usando múltiples métricas y validación cruzada.

## Duración

60 minutos

## Dataset

California Housing de sklearn.

## Instrucciones

### Parte 1: División entrenamiento/prueba (10 min)
1. Cargá el dataset de California housing
2. Dividí en 80% entrenamiento, 20% prueba
3. Entrená un modelo LinearRegression
4. Predicí sobre el set de prueba

### Parte 2: Métricas de rendimiento (15 min)
1. Calculá MAE, MSE, RMSE, R² sobre el set de prueba
2. Calculá también el R² del set de entrenamiento
3. ¿Hay evidencia de sobreajuste? Compará el R² de entrenamiento vs prueba

### Parte 3: Validación cruzada (15 min)
1. Realizá validación cruzada de 5 folds
2. Informá la media y la desviación estándar del R²
3. Realizá validación cruzada de 10 folds y comparala con la de 5 folds
4. Interpretá: ¿es estable el modelo entre los folds?

### Parte 4: Análisis de residuos (10 min)
1. Graficá los residuos vs los valores predichos
2. Graficá un histograma de los residuos
3. ¿Los residuos están centrados en 0? ¿Dispersos al azar?
4. ¿Qué te dicen los patrones de residuos?

### Parte 5: Importancia de features (10 min)
1. Extraé los coeficientes del modelo
2. Ordenalos por valor absoluto
3. ¿Qué features son las más influyentes?
4. Interpretá las 2 features principales

## Entregables

- Notebook de Jupyter con código, gráficos e interpretaciones

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| División entrenamiento/prueba y métricas | 3 |
| Validación cruzada | 2 |
| Análisis de residuos | 2 |
| Interpretación de la importancia de features | 3 |
Total: 10 puntos
