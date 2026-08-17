```python
# =========================================================================
# LAB 8: Gradient Boosting - regresion por etapas
# -------------------------------------------------------------------------
# Entrenamos un GradientBoostingRegressor sobre diabetes, monitoreamos el
# error de entrenamiento y prueba en cada etapa del boosting y comparamos
# el resultado con una regresion lineal de referencia.
# =========================================================================

# PASO 1: Datos y modelo de referencia (regresion lineal).
# La linea de base ayuda a medir la ganancia real del boosting.
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42)

lineal = LinearRegression()
lineal.fit(X_train, y_train)
pred_lineal = lineal.predict(X_test)
print("PASO 1 - Regresion lineal de referencia")
print(f"MSE prueba: {mean_squared_error(y_test, pred_lineal):.2f}")
print(f"R2 prueba: {r2_score(y_test, pred_lineal):.3f}")

# PASO 2: Entrenamiento del GradientBoostingRegressor.
# Cada arbol nuevo corrige los residuos del conjunto de etapas anteriores.
from sklearn.ensemble import GradientBoostingRegressor

gb = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1,
                               max_depth=3, random_state=42)
gb.fit(X_train, y_train)
print("PASO 2 - Boosting entrenado")
print(f"MSE prueba: {mean_squared_error(y_test, gb.predict(X_test)):.2f}")
print(f"R2 prueba: {r2_score(y_test, gb.predict(X_test)):.3f}")

# PASO 3: Error por etapas con staged_predict.
# Vemos como evoluciona el modelo con cada arbol que se agrega.
errores_train = []
errores_test = []
for p_train, p_test in zip(gb.staged_predict(X_train),
                           gb.staged_predict(X_test)):
    errores_train.append(mean_squared_error(y_train, p_train))
    errores_test.append(mean_squared_error(y_test, p_test))

print("PASO 3 - Error de prueba en algunas etapas:")
for n in [10, 50, 100, 150, 200]:
    print(f"  n_estimators={n}: MSE prueba {errores_test[n - 1]:.2f}")

import plotly.express as px

fig = px.line(x=list(range(1, 201)), y=errores_test,
              labels={"x": "n_estimators", "y": "MSE"},
              title="Error por etapa del boosting")
fig.add_scatter(x=list(range(1, 201)), y=errores_train, mode="lines",
                name="Entrenamiento")
fig.show()

# PASO 4: Importancia de las features del boosting.
# Las features mas usadas en los arboles reducen mas el error residual.
importancias = gb.feature_importances_
fig = px.bar(x=data.feature_names, y=importancias,
             labels={"x": "Feature", "y": "Importancia"},
             title="Importancia de features - GradientBoosting")
fig.show()
print("PASO 4 - Feature mas importante:",
      data.feature_names[int(np.argmax(importancias))])
```