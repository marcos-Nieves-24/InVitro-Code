---
Module: 3
Lesson Number: 9
Lesson Title: Evaluación de Modelos
Estimated Duration: 75 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  - Dividir datos en conjuntos de entrenamiento y prueba usando train_test_split
  - Implementar validación cruzada k-fold
  - Calcular e interpretar MAE, MSE, RMSE y R²
  - Elegir métricas de evaluación adecuadas para problemas de regresión
  - Diagnosticar sobreajuste usando validación cruzada
Keywords: división train-test, validación cruzada, MAE, MSE, RMSE, R², sobreajuste, sklearn.metrics
Difficulty: Intermedio
Programming Concepts: sklearn.model_selection, sklearn.metrics, numpy, pandas
Mathematical Concepts: error absoluto medio, error cuadrático medio, raíz del error cuadrático medio, coeficiente de determinación
Machine Learning Concepts: evaluación de modelos, sobreajuste, generalización, validación cruzada
Datasets Used: diabetes, California housing
Notebook: 09_model_evaluation.ipynb
Assignment: model_evaluation_assignment.md
Quiz: model_evaluation_quiz.md
---

# Lección 9: Evaluación de Modelos

## Motivación

Construir un modelo es solo la mitad del trabajo. La pregunta crítica es: ¿qué tan bien funciona este modelo con datos nuevos no vistos? Un modelo que memoriza los datos de entrenamiento pero falla con datos nuevos es inútil — esto es sobreajuste. Las métricas de evaluación de modelos y la validación cruzada nos dan estimaciones confiables del rendimiento en el mundo real.

En biotecnología, evaluar un modelo de predicción de respuesta a fármacos determina si puede guiar decisiones de tratamiento. En SaaS, evaluar un modelo de predicción de deserción determina si vale la pena implementarlo para retener clientes.

## Panorama General

Esta lección introduce los conceptos centrales de evaluación de modelos que sustentan todo el machine learning. Se conecta con la Lección 6 (EDA) — una buena evaluación comienza con datos limpios. Te prepara para el Módulo 4, donde entrenarás, evaluarás y compararás muchos tipos de modelos.

## Teoría

### División Entrenamiento/Prueba

Dividir los datos en un conjunto de entrenamiento (usado para ajustar el modelo) y un conjunto de prueba (usado para evaluar el rendimiento).

- División típica: 70-80% entrenamiento, 20-30% prueba
- El conjunto de prueba nunca debe usarse durante el entrenamiento
- Sin un conjunto de prueba, las estimaciones de rendimiento están sesgadas de forma optimista

### Validación Cruzada

La validación cruzada k-fold divide los datos en k pliegues, entrena en k-1 pliegues y prueba en el pliegue restante. Esto se repite k veces.

**Ventajas**:
- Estimación de rendimiento más estable que una única división
- Todos los datos se usan tanto para entrenar como para probar
- Reduce la varianza de la estimación de rendimiento

### Métricas de Regresión

**Error Absoluto Medio (MAE)**

$$\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|$$

Intuición: Error de predicción absoluto promedio. Interpretable en las unidades originales.

**Error Cuadrático Medio (MSE)**

$$\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$$

Intuición: Error cuadrático promedio. Penaliza errores grandes más fuertemente.

**Raíz del Error Cuadrático Medio (RMSE)**

$$\text{RMSE} = \sqrt{\text{MSE}}$$

Intuición: Error de predicción típico en las unidades originales (como la desviación estándar de los errores).

**R² (Coeficiente de Determinación)**

$$R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$$

Intuición: Proporción de la varianza del objetivo explicada por el modelo. Va de (-∞, 1], donde 1 es predicción perfecta y 0 significa que el modelo no funciona mejor que predecir la media.

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Cargar datos
diabetes = load_diabetes()
X, y = diabetes.data, diabetes.target

# División entrenamiento/prueba
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Entrenar modelo
model = LinearRegression()
model.fit(X_train, y_train)

# Predecir
y_pred = model.predict(X_test)

# Métricas
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("Rendimiento en conjunto de prueba:")
print(f"MAE:  {mae:.2f}")
print(f"MSE:  {mse:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R²:   {r2:.3f}")

# Validación cruzada
cv = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(LinearRegression(), X, y, cv=cv, scoring='r2')

print(f"\nValidación Cruzada de 5 Pliegues R²:")
print(f"Puntajes: {cv_scores}")
print(f"Media:   {cv_scores.mean():.3f} (±{cv_scores.std():.3f})")

# Visualizar predicciones
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--', lw=2)
plt.xlabel('Valores Reales')
plt.ylabel('Predicciones')
plt.title(f'Progresión de Diabetes: Predicciones vs Reales (R² = {r2:.3f})')
plt.tight_layout()
plt.show()
```

## Ejemplo Guiado

California Housing: evaluar un modelo de regresión lineal de forma exhaustiva.

```python
from sklearn.datasets import fetch_california_housing

housing = fetch_california_housing(as_frame=True)
X, y = housing.data, housing.target

# Dividir
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Entrenar
model = LinearRegression()
model.fit(X_train, y_train)

# Predicciones
y_pred = model.predict(X_test)

# Métricas
def regression_report(y_true, y_pred):
    print("Reporte de Rendimiento de Regresión")
    print("=" * 35)
    print(f"MAE:  ${mean_absolute_error(y_true, y_pred):.3f}k")
    print(f"MSE:  ${mean_squared_error(y_true, y_pred):.3f}k")
    print(f"RMSE: ${np.sqrt(mean_squared_error(y_true, y_pred)):.3f}k")
    print(f"R²:   {r2_score(y_true, y_pred):.4f}")

regression_report(y_test, y_pred)

# Validación cruzada
cv_scores = cross_val_score(
    LinearRegression(), X, y, cv=10, scoring='r2'
)
print(f"\nVC 10-Pliegues R²: {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")

# Residuales
residuals = y_test - y_pred
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.scatter(y_pred, residuals, alpha=0.6)
plt.axhline(0, color='red', linestyle='--')
plt.xlabel('Predicho')
plt.ylabel('Residuales')
plt.title('Gráfico de Residuales')

plt.subplot(1, 2, 2)
plt.hist(residuals, bins=30, edgecolor='black')
plt.xlabel('Residual')
plt.title('Distribución de Residuales')
plt.tight_layout()
plt.show()

print(f"Media residual: {np.mean(residuals):.4f}")
print(f"Desviación estándar residual: {np.std(residuals):.4f}")
```

## Ejemplo de Biotecnología

Predecir respuesta a fármacos basada en features moleculares.

```python
np.random.seed(42)
n_samples = 200
n_features = 20

X_drug = np.random.randn(n_samples, n_features)
true_coeffs = np.random.randn(n_features)
y_drug = X_drug @ true_coeffs + np.random.randn(n_samples) * 2

X_train, X_test, y_train, y_test = train_test_split(
    X_drug, y_drug, test_size=0.25, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Modelo de Predicción de Respuesta a Fármacos")
print(f"R²: {r2_score(y_test, y_pred):.3f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.3f}")

# Features más predictivas
feature_importance = pd.Series(
    np.abs(model.coef_), index=[f'Feature_{i}' for i in range(n_features)]
).sort_values(ascending=False)
print("\nTop 5 features predictivas:")
print(feature_importance.head(5))
```

## Ejemplo SaaS

Predecir el valor de vida del cliente (LTV).

```python
np.random.seed(42)
n_customers = 1000
ltv_data = pd.DataFrame({
    'logins_per_week': np.random.poisson(3, n_customers),
    'avg_session_min': np.random.exponential(15, n_customers),
    'features_used': np.random.poisson(5, n_customers),
    'support_tickets': np.random.poisson(0.5, n_customers),
    'referrals': np.random.poisson(1, n_customers)
})

# Simular LTV
ltv_data['ltv'] = (
    10 * ltv_data['logins_per_week']
    + 2 * ltv_data['avg_session_min']
    + 15 * ltv_data['features_used']
    - 20 * ltv_data['support_tickets']
    + 30 * ltv_data['referrals']
    + np.random.randn(n_customers) * 20
)

X = ltv_data.drop('ltv', axis=1)
y = ltv_data['ltv']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Predicción de LTV de Clientes")
regression_report(y_test, y_pred)

# Validación cruzada
cv_scores = cross_val_score(LinearRegression(), X, y, cv=5, scoring='r2')
print(f"\nVC R²: {cv_scores.mean():.3f} (±{cv_scores.std():.3f})")
```

## Errores Comunes

1. **Evaluar en datos de entrenamiento**: Da una estimación excesivamente optimista. Usá siempre un conjunto de prueba reservado.
2. **Data leakage**: Usar información del conjunto de prueba durante el entrenamiento (ej., escalar antes de dividir).
3. **Reportar solo R²**: Reportá múltiples métricas (MAE, RMSE, R²) para tener una imagen completa.
4. **Ignorar patrones en los residuales**: Los residuales deberían estar dispersos aleatoriamente alrededor de 0; los patrones indican mala especificación del modelo.
5. **Usar una única división entrenamiento/prueba**: El rendimiento depende de la división aleatoria; usá validación cruzada para estimaciones más confiables.

## Mejores Prácticas

- Dividí siempre antes de cualquier preprocesamiento (evitá data leakage)
- Usá validación cruzada para selección de modelos y ajuste de hiperparámetros
- Reportá múltiples métricas (MAE es más interpretable, MSE penaliza más los valores atípicos)
- Verificá los gráficos de residuales para los supuestos del modelo
- Compará el rendimiento del modelo contra una línea de base simple

## Resumen

- La división entrenamiento/prueba simula el rendimiento del modelo en datos no vistos
- La validación cruzada provee estimaciones de rendimiento más confiables
- MAE: error absoluto promedio (interpretable)
- MSE: error cuadrático promedio (penaliza errores grandes)
- RMSE: error típico en unidades originales
- R²: proporción de la varianza explicada
- Nunca evaluar en datos de entrenamiento

## Términos Clave

| Término | Definición |
|---------|------------|
| Conjunto de Entrenamiento | Datos usados para ajustar el modelo |
| Conjunto de Prueba | Datos usados para evaluar el modelo |
| Validación Cruzada | Divisiones entrenamiento/prueba repetidas en diferentes pliegues |
| MAE | Error Absoluto Medio |
| MSE | Error Cuadrático Medio |
| RMSE | Raíz del Error Cuadrático Medio |
| R² | Coeficiente de Determinación |
| Sobreajuste | El modelo memoriza los datos de entrenamiento, falla en datos nuevos |
| Data Leakage | Usar información del conjunto de prueba durante el entrenamiento |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. ¿Cuál es la diferencia entre MAE y MSE? ¿Cuándo preferirías uno sobre el otro?
2. ¿Por qué la validación cruzada es mejor que una única división entrenamiento/prueba?

**Nivel 2: Implementación**

3. Cargá el dataset de diabetes. Compará el R² de VC de 5 pliegues de LinearRegression con un modelo que siempre predice la media.
4. Escribí una función `evaluate_model(model, X, y, cv_folds=5)` que devuelva MAE, RMSE y R² usando validación cruzada.

**Nivel 3: Pensamiento Crítico**

5. Un modelo logra R² = 0.95 en el conjunto de entrenamiento pero R² = 0.45 en el conjunto de prueba. ¿Qué está pasando? ¿Qué pasos deberían tomarse?
6. En un problema de predicción de respuesta a fármacos en biotecnología, ¿qué métrica (MAE, MSE, RMSE o R²) es más significativa clínicamente? Justificá tu respuesta.

## Desafío de Programación

Escribí un script en Python que:
1. Cargue el dataset California housing
2. Divida en entrenamiento (80%) y prueba (20%)
3. Entrene un modelo LinearRegression
4. Calcule e imprima MAE, MSE, RMSE y R² en los conjuntos de entrenamiento y prueba
5. Realice validación cruzada de 10 pliegues y reporte la media ± desviación estándar de R²
6. Cree un gráfico lado a lado: predicciones vs reales (dispersión) y residuales (histograma)
7. Determine qué feature tiene el coeficiente absoluto más grande e interprete su significado
