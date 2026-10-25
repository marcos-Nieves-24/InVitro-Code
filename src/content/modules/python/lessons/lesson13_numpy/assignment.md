# Assignment: Operaciones con matrices en NumPy

## Objetivos

- Crear y manipular arrays de NumPy
- Realizar operaciones con matrices usando código vectorizado
- Implementar normalización y transformación de datos
- Aplicar correctamente las reglas de broadcasting

## Instrucciones

Crea un script de Python `numpy_ops.py` que implemente las siguientes funciones **usando solo NumPy** (sin bucles explícitos de Python):

1. `create_design_matrix(X)` — dado un vector de características N×1, crea una matriz de diseño N×2 con [X, 1] (para regresión lineal con intersección)

2. `standardize(X)` — centra y escala cada columna para que tenga media=0, desviación estándar=1

3. `covariance_matrix(X)` — calcula la matriz de covarianza (N características × N características)

4. `pairwise_distance(X)` — calcula la distancia euclidiana entre todos los pares de filas de X (devuelve una matriz de distancias N×N)

5. `ridge_regression(X, y, lambda_)` — implementa la regresión ridge: β = (XᵀX + λI)⁻¹ Xᵀy

6. `mse(y_true, y_pred)` — calcula el error cuadrático medio

## Datos iniciales

```python
np.random.seed(42)
X = np.random.randn(100, 5)
y = X @ np.array([1.5, -2.0, 0.5, 3.0, -1.0]) + np.random.randn(100) * 0.1
```

