```python
# =========================================================================
# LAB 2: Regresión lineal simple y multiple
# -------------------------------------------------------------------------
# Ajustamos una regresión lineal sobre diabetes: primero con una sola
# feature y luego con dos. Interpretamos coeficientes e intercepto y
# evaluamos con MSE y R2. El scatter incluye la recta OLS con trendline.
# =========================================================================

# PASO 1: Datos y regresión simple con una sola feature.
# Usamos la feature 2 (nivel de colesterol) para predecir la progresion.
import numpy as np                         # Operaciones matemáticas
from sklearn.datasets import load_diabetes # Dataset de diabetes
from sklearn.model_selection import train_test_split  # División train/test
from sklearn.linear_model import LinearRegression  # Regresión lineal
from sklearn.metrics import mean_squared_error, r2_score  # Métricas

data = load_diabetes()                     # Cargar dataset
X = data.data[:, 2:3]                      # Solo la feature 2 (colesterol)
y = data.target                            # Target: progresion de enfermedad
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)  # 80/20 split

modelo1 = LinearRegression()               # Crear modelo con 1 feature
modelo1.fit(X_train, y_train)              # Entrenar
print("PASO 1 - Regresión simple")
print(f"Coeficiente: {modelo1.coef_[0]:.3f} | Intercepto: {modelo1.intercept_:.2f}")
print(f"R2 prueba: {r2_score(y_test, modelo1.predict(X_test)):.3f}")

# PASO 2: Scatter con la recta OLS dibujada manualmente.
# Plotly no incluye statsmodels en Pyodide, asi que dibujamos la recta
# de mínimos cuadrados con los coeficientes del modelo.
import plotly.express as px                # Gráficos interactivos

fig = px.scatter(x=X_test[:, 0], y=y_test, opacity=0.7,  # Scatter real vs predicho
                 labels={"x": "Colesterol (estandarizado)", "y": "Progresion"},
                 title="Regresión simple con recta OLS")
recta_x = np.array([X_test[:, 0].min(), X_test[:, 0].max()])  # Puntos de la recta
fig.add_scatter(x=recta_x, y=modelo1.predict(recta_x.reshape(-1, 1)),  # Recta OLS
                mode="lines", name="Recta OLS")
fig.show()                                 # Mostrar gráfico
print("PASO 2 - La recta OLS queda superpuesta al scatter.")

# PASO 3: Regresión multiple con dos features.
# Agregamos la feature 5 (BMI) para mejorar la predicción.
X2 = data.data[:, [2, 5]]                 # Features: colesterol + BMI
X_train2, X_test2, y_train2, y_test2 = train_test_split(
    X2, y, test_size=0.2, random_state=42)  # División 80/20

modelo2 = LinearRegression()               # Crear modelo con 2 features
modelo2.fit(X_train2, y_train2)            # Entrenar
y_pred2 = modelo2.predict(X_test2)         # Predecir
print("PASO 3 - Regresión multiple")
print(f"Coeficientes: {modelo2.coef_} | Intercepto: {modelo2.intercept_:.2f}")
print(f"MSE prueba: {mean_squared_error(y_test2, y_pred2):.2f}")
print(f"R2 prueba: {r2_score(y_test2, y_pred2):.3f}")

# PASO 4: Superficie del modelo multiple en 3D.
# Cada eje es una feature y el color representa el valor predicho.
fig = px.scatter_3d(x=X_test2[:, 0], y=X_test2[:, 1], z=y_test2,  # Scatter 3D
                    color=modelo2.predict(X_test2),  # Color = predicción
                    color_continuous_scale="Viridis",
                    labels={"x": "Colesterol", "y": "BMI", "z": "Progresion"},
                    title="Regresión multiple con dos features")
fig.show()                                 # Mostrar gráfico 3D
print("PASO 4 - El color del gráfico 3D muestra la predicción del modelo.")
```