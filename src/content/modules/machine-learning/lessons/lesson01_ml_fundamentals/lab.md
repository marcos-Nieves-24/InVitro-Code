# Lab 1: Fundamentos de ML — Diagnóstico del ajuste del modelo

## Objetivos

- Implementá la división entrenamiento/prueba con scikit-learn
- Entrená un modelo de regresión lineal y evaluá su rendimiento
- Diagnosticá el sobreajuste y el subajuste usando curvas de aprendizaje
- Visualizá el tradeoff entre sesgo y varianza

## Configuración

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import load_diabetes

plt.style.use('seaborn-v0_8-whitegrid')
np.random.seed(42)
```

## Parte 1: División entrenamiento/prueba

Cargá el dataset de diabetes, dividilo en entrenamiento (80%) y prueba (20%), entrená un `LinearRegression` e imprimí el R² de entrenamiento y de prueba.

```python
data = load_diabetes()
X, y = data.data, data.target
# YOUR CODE HERE
```

**Verificación:** El R² de prueba debería ser de aproximadamente 0.45.

## Parte 2: Curvas de aprendizaje

Usá regresión polinómica con grados variables [1, 2, 3, 5, 10, 15] sobre una onda senoidal sintética. Para cada grado, registrá el MSE de entrenamiento y el MSE de prueba. Graficá ambos contra el grado en una escala logarítmica.

**Pregunta:** ¿A partir de qué grado comienza el sobreajuste?

## Parte 3: Diagnóstico de un modelo misterioso

Te dan tres modelos pre-entrenados (A, B, C) con estos rendimientos:

| Modelo | R² entrenamiento | R² prueba |
|-------|----------|---------|
| A | 0.32 | 0.28 |
| B | 0.99 | 0.99 |
| C | 0.99 | 0.55 |

Clasificá cada uno como subajuste, ajuste correcto, sobreajuste o sospechoso.

## Parte 4: Validación cruzada

Usá validación cruzada de 5 pliegues sobre el dataset de diabetes con `LinearRegression`. Informá la media y la desviación estándar de los 5 puntajes de R².

```python
scores = cross_val_score(LinearRegression(), X, y, cv=5)
print(f"CV R²: {scores.mean():.3f} ± {scores.std():.3f}")
```

## Entregables

- Un único notebook o script de Python con todas las partes completas
- Gráficos claramente etiquetados
- Respuestas escritas para la Parte 3

## Tiempo estimado: 45 minutos
