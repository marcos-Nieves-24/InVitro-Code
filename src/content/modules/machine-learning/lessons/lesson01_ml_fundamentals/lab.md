```python
# =========================================================================
# LAB 1: Fundamentos de ML - Regresion lineal y diagnostico del ajuste
# -------------------------------------------------------------------------
# Cargamos el dataset de diabetes, dividimos en entrenamiento y prueba,
# entrenamos una regresion lineal de referencia y evaluamos MSE y R2.
# Cerramos comparando predicciones contra valores reales con un scatter.
# =========================================================================

# PASO 1: Cargamos diabetes y dividimos los datos en 80/20.
# La semilla fija la division para que los resultados sean reproducibles.
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

np.random.seed(42)
data = load_diabetes()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
print(f"PASO 1 - Entrenamiento: {X_train.shape[0]} muestras, "
      f"Prueba: {X_test.shape[0]} muestras")

# PASO 2: Entrenamos el modelo de referencia (regresion lineal).
# Evaluamos en entrenamiento y en prueba para detectar sobreajuste.
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

modelo = LinearRegression()
modelo.fit(X_train, y_train)

mse_train = mean_squared_error(y_train, modelo.predict(X_train))
mse_test = mean_squared_error(y_test, modelo.predict(X_test))
r2_train = r2_score(y_train, modelo.predict(X_train))
r2_test = r2_score(y_test, modelo.predict(X_test))
print("PASO 2 - Metricas del modelo")
print(f"MSE entrenamiento: {mse_train:.2f} | MSE prueba: {mse_test:.2f}")
print(f"R2 entrenamiento: {r2_train:.3f} | R2 prueba: {r2_test:.3f}")

# PASO 3: Predicciones contra valores reales.
# Si el modelo fuera perfecto, todos los puntos caerian sobre la diagonal.
import plotly.express as px

y_pred = modelo.predict(X_test)
fig = px.scatter(x=y_test, y=y_pred, opacity=0.6,
                 labels={"x": "Valor real", "y": "Prediccion"},
                 title="Predicciones vs valores reales (diabetes)")
fig.add_shape(type="line", x0=y_test.min(), y0=y_test.min(),
              x1=y_test.max(), y1=y_test.max(),
              line=dict(color="red", dash="dash"))
fig.show()
print("PASO 3 - Los puntos se agrupan alrededor de la diagonal.")

# PASO 4: Interpretacion del diagnostico.
print("PASO 4 - Diagnostico del ajuste")
print("R2 de prueba ~0.45: el modelo captura el 45% de la variabilidad.")
print("La brecha entre R2 de entrenamiento y de prueba mide el sobreajuste.")
```