# Assignment 8: Gradient Boosting

## Objetivos

- Aplica gradient boosting a un problema de regresión
- Ajusta los hiperparámetros de forma sistemática
- Compara múltiples métodos de conjunto
- Escribe una recomendación de selección de modelo

## Dataset

Usa el dataset de **California Housing**.

```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
```

## Escenario

Una empresa de análisis inmobiliario necesita un modelo para predecir precios de casas. Tienes que comparar múltiples métodos de conjunto y recomendar el mejor.

## Instrucciones

1. **Divide** en entrenamiento (70%), validación (15%) y prueba (15%)
2. **Entrena los siguientes modelos** (usa el set de validación para el ajuste):
   - DecisionTreeRegressor (ajusta max_depth)
   - RandomForestRegressor (ajusta n_estimators, max_depth)
   - GradientBoostingRegressor (ajusta learning_rate, n_estimators, max_depth)
3. **Compara los modelos** en el set de validación usando R² y RMSE
4. **Selecciona el mejor modelo** y evalúalo en el set de prueba
5. **Crea una curva de aprendizaje** para el mejor modelo (R² vs. n_estimators)

