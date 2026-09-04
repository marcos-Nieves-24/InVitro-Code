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
import numpy as np                         # Numeros y operaciones matematicas
from sklearn.datasets import load_diabetes # Dataset de 10 features medicas
from sklearn.model_selection import train_test_split  # Division train/test

np.random.seed(42)                         # Fijar semilla para reproducibilidad
data = load_diabetes()                     # Cargar dataset (442 muestras, 10 features)
X, y = data.data, data.target              # X=features, y=progresion de la enfermedad
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)  # 80% entrenamiento, 20% prueba
print(f"PASO 1 - Entrenamiento: {X_train.shape[0]} muestras, "
      f"Prueba: {X_test.shape[0]} muestras")

# PASO 2: Entrenamos el modelo de referencia (regresion lineal).
# Evaluamos en entrenamiento y en prueba para detectar sobreajuste.
from sklearn.linear_model import LinearRegression  # Modelo de regresion lineal
from sklearn.metrics import mean_squared_error, r2_score  # Metricas de evaluacion

modelo = LinearRegression()                # Crear el modelo
modelo.fit(X_train, y_train)               # Entrenar con datos de entrenamiento

mse_train = mean_squared_error(y_train, modelo.predict(X_train))  # Error en train
mse_test = mean_squared_error(y_test, modelo.predict(X_test))    # Error en test
r2_train = r2_score(y_train, modelo.predict(X_train))  # R2 en train (0-1, mayor=mejor)
r2_test = r2_score(y_test, modelo.predict(X_test))      # R2 en test
print("PASO 2 - Metricas del modelo")
print(f"MSE entrenamiento: {mse_train:.2f} | MSE prueba: {mse_test:.2f}")
print(f"R2 entrenamiento: {r2_train:.3f} | R2 prueba: {r2_test:.3f}")

# PASO 3: Predicciones contra valores reales.
# Si el modelo fuera perfecto, todos los puntos caerian sobre la diagonal.
import plotly.express as px                # Graficos interactivos

y_pred = modelo.predict(X_test)            # Predecir sobre el conjunto de prueba
fig = px.scatter(x=y_test, y=y_pred, opacity=0.6,  # Scatter: real vs predicho
                 labels={"x": "Valor real", "y": "Prediccion"},
                 title="Predicciones vs valores reales (diabetes)")
fig.add_shape(type="line", x0=y_test.min(), y0=y_test.min(),  # Diagonal de referencia
              x1=y_test.max(), y1=y_test.max(),
              line=dict(color="red", dash="dash"))
fig.show()                                 # Mostrar grafico interactivo
print("PASO 3 - Los puntos se agrupan alrededor de la diagonal.")

# PASO 4: Interpretacion del diagnostico.
print("PASO 4 - Diagnostico del ajuste")
print("R2 de prueba ~0.45: el modelo captura el 45% de la variabilidad.")
print("La brecha entre R2 de entrenamiento y de prueba mide el sobreajuste.")
```