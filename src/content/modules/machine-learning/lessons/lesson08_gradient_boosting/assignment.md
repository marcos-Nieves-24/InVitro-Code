# Assignment 8: Gradient Boosting

## Objetivos

- Aplicá gradient boosting a un problema de regresión
- Ajustá los hiperparámetros de forma sistemática
- Compará múltiples métodos de conjunto
- Escribí una recomendación de selección de modelo

## Dataset

Usá el dataset de **California Housing**.

```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
```

## Escenario

Una empresa de análisis inmobiliario necesita un modelo para predecir precios de casas. Tenés que comparar múltiples métodos de conjunto y recomendar el mejor.

## Instrucciones

1. **Dividí** en entrenamiento (70%), validación (15%) y prueba (15%)
2. **Entrená los siguientes modelos** (usá el set de validación para el ajuste):
   - DecisionTreeRegressor (ajustá max_depth)
   - RandomForestRegressor (ajustá n_estimators, max_depth)
   - GradientBoostingRegressor (ajustá learning_rate, n_estimators, max_depth)
3. **Compará los modelos** en el set de validación usando R² y RMSE
4. **Seleccioná el mejor modelo** y evaluálo en el set de prueba
5. **Creá una curva de aprendizaje** para el mejor modelo (R² vs. n_estimators)

## Entregables

- Notebook con todos los pasos
- Tabla que compare todos los modelos (R², RMSE en entrenamiento/validación)
- Curva de aprendizaje del mejor modelo
- Informe (máx. 300 palabras):
  - ¿Qué modelo rindió mejor y por qué?
  - ¿Cuáles fueron los hiperparámetros óptimos?
  - ¿Cómo se compara boosting con bagging para este problema?
  - ¿Usarías este modelo en producción? ¿Por qué sí o por qué no?

## Rúbrica

| Criterio | Excelente (4) | Bueno (3) | Adecuado (2) | Deficiente (1) |
|----------|--------------|----------|-------------|----------------|
| Comparación de modelos | 3+ modelos con ajuste | 2 modelos | 1 modelo | Faltante |
| Ajuste de hiperparámetros | Búsqueda sistemática | Parcial | Mínimo | Faltante |
| Evaluación | R² + RMSE con interpretación | Ambas métricas | Una métrica | Faltante |
| Curva de aprendizaje | Clara, anotada | Presente | Poco clara | Faltante |
| Recomendación | Con insights, consciente de producción | Clara | Básica | Faltante |

## Tiempo estimado: 2 horas
