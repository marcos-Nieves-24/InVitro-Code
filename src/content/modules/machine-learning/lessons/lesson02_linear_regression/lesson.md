---
Module: 4
Lesson Number: 2
Lesson Title: Regresión Lineal
Estimated Duration: 90 minutos
Prerequisites: L1 (Fundamentos de ML), Módulo 3 estadística (varianza, covarianza, correlación)
Learning Objectives:
  - Explicar la formulación matemática de la regresión lineal simple y múltiple
  - Implementar regresión lineal con scikit-learn
  - Interpretar coeficientes de regresión en contexto
  - Evaluar modelos de regresión usando R², MSE y RMSE
  - Describir cómo el descenso por gradiente optimiza los parámetros del modelo
Keywords: regresión lineal, OLS, descenso por gradiente, R-cuadrado, MSE, coeficiente, intersección
Difficulty: Principiante
Programming Concepts: sklearn.linear_model.LinearRegression, álgebra lineal con numpy
Mathematical Concepts: Mínimos Cuadrados Ordinarios, descenso por gradiente, R², MSE, RMSE
Machine Learning Concepts: regresión, ponderación de características, residuales
Datasets Used: scikit-learn diabetes, California Housing, sintético
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Regresión Lineal

## Motivación

Una empresa de biotecnología quiere predecir la solubilidad de fármacos a partir de propiedades moleculares. Una empresa SaaS quiere pronosticar los ingresos recurrentes mensuales. Ambos son problemas de *regresión* — predecir un número continuo. La regresión lineal es el algoritmo de regresión más simple e interpretable. Entenderlo a fondo es esencial porque muchos modelos avanzados (regresión regularizada, redes neuronales) se basan en sus ideas.

## Panorama general

**Anterior:** Fundamentos de ML te dio el modelo mental. **Esta lección:** Tu primer algoritmo real — Regresión Lineal. **Siguiente:** Clasificación — predecir categorías en lugar de números.

## Teoría

### Regresión Lineal Simple

La relación entre una característica $x$ y el objetivo $y$:

$$y = \beta_0 + \beta_1 x + \varepsilon$$

- $\beta_0$: intersección (valor de y cuando x = 0)
- $\beta_1$: pendiente (cambio en y por cambio unitario en x)
- $\varepsilon$: residual (término de error)

### Regresión Lineal Múltiple

Con $p$ características:

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p + \varepsilon$$

En forma matricial: $\mathbf{y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\varepsilon}$

### Mínimos Cuadrados Ordinarios (OLS)

Elegimos $\boldsymbol{\beta}$ para minimizar la suma de residuales al cuadrado:

$$\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$$

La solución de forma cerrada:

$$\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$$

### Intuición del descenso por gradiente

Cuando $p$ es grande, la solución de forma cerrada es lenta. El descenso por gradiente ajusta $\boldsymbol{\beta}$ iterativamente:

1. Iniciá con $\boldsymbol{\beta}$ aleatorio
2. Calculá el gradiente del MSE con respecto a $\boldsymbol{\beta}$
3. Actualizá: $\boldsymbol{\beta} := \boldsymbol{\beta} - \alpha \nabla \text{MSE}$
4. Repetí hasta converger

$\alpha$ es la **tasa de aprendizaje** — qué tan grande es cada paso.

### Métricas de evaluación

**MSE (Error Cuadrático Medio):** $\frac{1}{n}\sum(y_i - \hat{y}_i)^2$
- Sensible a valores atípicos (eleva al cuadrado errores grandes)

**RMSE (Raíz del Error Cuadrático Medio):** $\sqrt{\text{MSE}}$
- Mismas unidades que la variable objetivo

**R² (Coeficiente de Determinación):** $1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}$
- Proporción de varianza explicada por el modelo
- Varía de $-\infty$ a 1
- R² = 1: ajuste perfecto
- R² = 0: el modelo siempre predice la media

## Fundamento matemático

### Derivación de OLS

Minimizamos $L(\boldsymbol{\beta}) = (\mathbf{y} - \mathbf{X}\boldsymbol{\beta})^\top(\mathbf{y} - \mathbf{X}\boldsymbol{\beta})$

Igualamos el gradiente a cero:
$$\frac{\partial L}{\partial \boldsymbol{\beta}} = -2\mathbf{X}^\top(\mathbf{y} - \mathbf{X}\boldsymbol{\beta}) = 0$$

$$\mathbf{X}^\top\mathbf{X}\boldsymbol{\beta} = \mathbf{X}^\top\mathbf{y}$$

$$\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$$

### Supuestos de la regresión lineal

1. **Linealidad:** La relación entre X e y es lineal
2. **Independencia:** Las observaciones son independientes
3. **Homocedasticidad:** Varianza constante de los residuales
4. **Normalidad:** Los residuales se distribuyen normalmente (para inferencia)
5. **Sin multicolinealidad:** Las características no están altamente correlacionadas

## Explicación visual

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

np.random.seed(42)
X = np.random.rand(50, 1) * 10
y = 2.5 * X.ravel() + 1.3 + np.random.normal(0, 1.5, 50)

model = LinearRegression()
model.fit(X, y)

X_line = np.linspace(0, 10, 100).reshape(-1, 1)
y_line = model.predict(X_line)

plt.figure(figsize=(8, 5))
plt.scatter(X, y, alpha=0.6, label='Data')
plt.plot(X_line, y_line, 'r-', linewidth=2, label=f'y = {model.coef_[0]:.2f}x + {model.intercept_:.2f}')
plt.xlabel('Feature (x)')
plt.ylabel('Target (y)')
plt.legend()
plt.title('Simple Linear Regression')
plt.savefig('figures/simple_linear_regression.png', dpi=150)
plt.show()
```

## Implementación en Python

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import load_diabetes

data = load_diabetes()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Intercept:", model.intercept_)
print("Coefficients:")
for name, coef in zip(data.feature_names, model.coef_):
    print(f"  {name}: {coef:.4f}")
print(f"\nMSE:  {mean_squared_error(y_test, y_pred):.1f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.1f}")
print(f"R²:   {r2_score(y_test, y_pred):.3f}")
```

## Ejemplo guiado: California Housing

```python
from sklearn.datasets import fetch_california_housing

housing = fetch_california_housing()
X_h = pd.DataFrame(housing.data, columns=housing.feature_names)
y_h = housing.target

X_train, X_test, y_train, y_test = train_test_split(X_h, y_h, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

print(f"R²: {model.score(X_test, y_test):.3f}")

# Feature importance
coef_df = pd.DataFrame({
    'feature': housing.feature_names,
    'coefficient': model.coef_
}).sort_values('coefficient', key=abs, ascending=False)
print(coef_df)
```

**Interpretación:** MedInc (ingreso mediano) tiene el coeficiente positivo más grande — mayor ingreso predice precios de vivienda más altos.

## Ejemplo en biotecnología: Predicción de solubilidad de proteínas

Una empresa farmacéutica quiere predecir si una proteína será soluble en agua basándose en descriptores moleculares.

```python
np.random.seed(42)
n_proteins = 200

solubility_data = pd.DataFrame({
    'molecular_weight': np.random.normal(50000, 10000, n_proteins),
    'hydrophobicity': np.random.uniform(-2, 2, n_proteins),
    'charge': np.random.normal(0, 5, n_proteins),
    'helix_fraction': np.random.uniform(0, 1, n_proteins),
})

# Simulate solubility score
solubility_data['solubility'] = (
    0.5
    - 0.3 * solubility_data['hydrophobicity']
    + 0.1 * solubility_data['charge']
    + 0.2 * solubility_data['helix_fraction']
    + np.random.normal(0, 0.1, n_proteins)
)

X_s = solubility_data.drop('solubility', axis=1)
y_s = solubility_data['solubility']

model_s = LinearRegression()
model_s.fit(X_s, y_s)

for col, coef in zip(X_s.columns, model_s.coef_):
    print(f"{col}: {coef:.4f}")
print(f"R²: {model_s.score(X_s, y_s):.3f}")
```

**Interpretación:** La hidrofobicidad tiene el efecto negativo más grande — las proteínas más hidrofóbicas tienden a ser menos solubles.

## Ejemplo en SaaS: Pronóstico de ingresos mensuales

Una startup SaaS quiere pronosticar el MRR (Ingreso Recurrente Mensual) del próximo mes.

```python
np.random.seed(42)
n_months = 36

revenue_data = pd.DataFrame({
    'active_users': np.random.poisson(1000, n_months) + np.arange(n_months) * 10,
    'new_signups': np.random.poisson(50, n_months) + np.arange(n_months) * 2,
    'churn_rate': np.random.uniform(0.02, 0.08, n_months),
    'avg_revenue_per_user': np.random.uniform(20, 30, n_months),
})

true_mrr = (
    0.5 * revenue_data['active_users']
    + 2.0 * revenue_data['new_signups']
    - 500 * revenue_data['churn_rate']
    + revenue_data['avg_revenue_per_user'] * revenue_data['active_users'] * 0.01
    + np.random.normal(0, 100, n_months)
)

revenue_data['mrr'] = true_mrr

X_r = revenue_data.drop('mrr', axis=1)
y_r = revenue_data['mrr']

model_r = LinearRegression()
model_r.fit(X_r, y_r)

print(f"R²: {model_r.score(X_r, y_r):.3f}")
for col, coef in zip(X_r.columns, model_r.coef_):
    print(f"{col}: {coef:.2f}")
```

## Errores comunes

1. **Interpretar coeficientes de forma causal** — correlación ≠ causalidad
2. **Ignorar la multicolinealidad** — características correlacionadas inflan la varianza de los coeficientes
3. **No revisar los patrones de residuales** — residuales curvos sugieren no linealidad
4. **Usar R² solamente** — revisá siempre también los gráficos de residuales y el MSE
5. **Olvidar escalar las características** — los coeficientes no son comparables cuando las características tienen diferentes unidades

## Buenas prácticas

- Visualizá siempre los datos primero
- Revisá los gráficos de residuales (residuales vs. ajustados, Q-Q plot)
- Usá RMSE en lugar de MSE para interpretabilidad
- Compará el rendimiento del modelo contra una línea base (predictor medio)
- Considerá regularización (Ridge, Lasso) cuando haya muchas características

## Resumen

- La regresión lineal modela el objetivo como una suma ponderada de características
- OLS encuentra coeficientes que minimizan el MSE
- R² mide la proporción de varianza explicada
- El descenso por gradiente es una alternativa iterativa a OLS para conjuntos grandes
- Revisá siempre los supuestos y los gráficos de residuales

## Términos clave

| Término | Definición |
|---------|------------|
| Mínimos Cuadrados Ordinarios | Método que minimiza los residuales al cuadrado |
| Coeficiente | Peso asignado a una característica |
| Intersección | Predicción cuando todas las características son 0 |
| Residual | Diferencia entre el valor real y el predicho |
| R² | Proporción de varianza explicada |
| MSE | Error de predicción cuadrático promedio |
| RMSE | Raíz cuadrada del MSE, en unidades originales |
| Descenso por gradiente | Algoritmo de optimización iterativo |

## Ejercicios

**Nivel 1 — Básico:** ¿Qué significan en la práctica R² = 1, R² = 0 y R² = -0.5?

**Nivel 2 — Implementación:** Usá `fetch_california_housing()`, entrená una regresión lineal con las 8 características y creá un gráfico de barras de los coeficientes (en valor absoluto).

**Nivel 3 — Pensamiento crítico:** Tenés un conjunto de datos con 5 características. Después de entrenar, 3 características tienen coeficientes muy grandes y 2 tienen coeficientes muy pequeños. ¿Significa eso que las 2 características no son importantes? ¿Por qué o por qué no?

## Desafío de programación

Escribí una función `linear_regression_from_scratch(X, y)` que implemente OLS usando la solución de forma cerrada. Compará tus coeficientes con `sklearn.linear_model.LinearRegression`. Devolvé los coeficientes, la intersección y R².
