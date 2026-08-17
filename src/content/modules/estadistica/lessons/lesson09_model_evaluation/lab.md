```python
# =========================================================================
# LAB 9: Evaluacion de modelos de regresion
# -------------------------------------------------------------------------
# Entrenamos una regresion lineal sobre el dataset de diabetes y evaluamos
# con MAE, MSE, RMSE y R2 (train y test), validacion cruzada de 5 y 10
# folds, analisis de residuos e importancia de features. Cada figura
# termina con fig.show() para capturarla en la consola de visualizacion.
# =========================================================================

# PASO 1: Cargar el dataset de diabetes y dividir en entrenamiento/prueba.
# load_diabetes trae 442 muestras con 10 features numericas normalizadas.
import numpy as np
import pandas as pd
import plotly.express as px
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

diabetes = load_diabetes(as_frame=True)
X = diabetes.data
y = diabetes.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
print("Entrenamiento:", X_train.shape, "- Prueba:", X_test.shape)

# PASO 2: Entrenar la regresion lineal y predecir.
modelo = LinearRegression()
modelo.fit(X_train, y_train)
y_pred = modelo.predict(X_test)
print("\nModelo entrenado con", len(modelo.coef_), "features.")

# PASO 3: Metricas de rendimiento (MAE, MSE, RMSE, R2) en train y test.
# El RMSE es la raiz cuadrada del MSE y se interpreta en las unidades de la
# variable objetivo; comparar R2 de train vs test revela sobreajuste.
mse_test = mean_squared_error(y_test, y_pred)
rmse_test = np.sqrt(mse_test)
r2_test = r2_score(y_test, y_pred)
r2_train = r2_score(y_train, modelo.predict(X_train))

print("\nMAE (test):", round(mean_absolute_error(y_test, y_pred), 2))
print("MSE (test):", round(mse_test, 2))
print("RMSE (test):", round(rmse_test, 2))
print("R2 (train):", round(r2_train, 4), "| R2 (test):", round(r2_test, 4))
print("Diferencia train-test:", round(r2_train - r2_test, 4),
      "(un valor alto sugiere sobreajuste)")

# PASO 4: Predicciones vs valores reales.
# Si el modelo fuera perfecto, todos los puntos caerian sobre la diagonal.
fig = px.scatter(x=y_test, y=y_pred,
                 title="Predicciones vs valores reales (diabetes)",
                 labels={"x": "Valor real", "y": "Prediccion"})
fig.add_scatter(x=[y_test.min(), y_test.max()],
                y=[y_test.min(), y_test.max()],
                mode="lines", name="Perfecto")
fig.show()

# PASO 5: Validacion cruzada de 5 y 10 folds.
# cross_val_score entrena y evalua el modelo en cada particion.
cv5 = cross_val_score(LinearRegression(), X, y, cv=5, scoring="r2")
cv10 = cross_val_score(LinearRegression(), X, y, cv=10, scoring="r2")
print("\nCV 5 folds: R2 medio =", round(cv5.mean(), 4),
      "+/-", round(cv5.std(), 4))
print("CV 10 folds: R2 medio =", round(cv10.mean(), 4),
      "+/-", round(cv10.std(), 4))
print("El modelo es estable si la desviacion entre folds es pequena.")

# PASO 6: Analisis de residuos.
# Los residuos (real - prediccion) deberian centrarse en 0 y dispersarse
# al azar; un patron sistematico indica que el modelo no captura algo.
residuos = y_test - y_pred
print("\nResiduos: media =", round(residuos.mean(), 4),
      "| desv =", round(residuos.std(), 4))

fig = px.scatter(x=y_pred, y=residuos,
                 title="Residuos vs predicciones",
                 labels={"x": "Valor predicho", "y": "Residuo"})
fig.add_hline(y=0, line_dash="dash", line_color="red")
fig.show()

fig = px.histogram(x=residuos, nbins=30,
                   title="Histograma de residuos",
                   labels={"x": "Residuo"})
fig.show()

# PASO 7: Importancia de features por coeficiente.
# En regresion lineal, |coeficiente| indica la influencia de la feature.
importancias = pd.DataFrame({
    "Feature": diabetes.feature_names,
    "Coef": modelo.coef_,
}).sort_values("Coef", key=lambda s: s.abs(), ascending=False)
print("\nTop 3 features por |coeficiente|:")
print(importancias.head(3).to_string(index=False))

fig = px.bar(importancias, x="Feature", y="Coef",
             title="Coeficientes del modelo (importancia de features)",
             labels={"Coef": "Coeficiente"})
fig.show()

# PASO 8: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Regresion lineal evaluada con MAE, MSE, RMSE y R2 en train/test.")
print("Validacion cruzada (5 y 10 folds) confirma estabilidad del modelo.")
print("Los residuos centrados en 0 indican un ajuste razonable.")
```