# Assignment: Operaciones con matrices en NumPy

## Objetivos

- Crear y manipular arrays de NumPy
- Realizar operaciones con matrices usando código vectorizado
- Implementar normalización y transformación de datos
- Aplicar correctamente las reglas de broadcasting

## Instrucciones

Creá un script de Python `numpy_ops.py` que implemente las siguientes funciones **usando solo NumPy** (sin bucles explícitos de Python):

1. `create_design_matrix(X)` — dado un vector de características N×1, creá una matriz de diseño N×2 con [X, 1] (para regresión lineal con intersección)

2. `standardize(X)` — centrá y escalá cada columna para que tenga media=0, desviación estándar=1

3. `covariance_matrix(X)` — calculá la matriz de covarianza (N características × N características)

4. `pairwise_distance(X)` — calculá la distancia euclidiana entre todos los pares de filas de X (devolvé una matriz de distancias N×N)

5. `ridge_regression(X, y, lambda_)` — implementá la regresión ridge: β = (XᵀX + λI)⁻¹ Xᵀy

6. `mse(y_true, y_pred)` — calculá el error cuadrático medio

## Datos iniciales

```python
np.random.seed(42)
X = np.random.randn(100, 5)
y = X @ np.array([1.5, -2.0, 0.5, 3.0, -1.0]) + np.random.randn(100) * 0.1
```

## Entregables

- `numpy_ops.py` con todas las funciones
- Script de demostración que muestre que cada función funciona correctamente
- Comparación de tiempos: implementación vectorizada vs. basada en bucles para `pairwise_distance`

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Necesita mejorar (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Vectorización | Todas las funciones vectorizadas (sin bucles de Python) | La mayoría de las funciones vectorizadas | Basada en bucles |
| Operaciones con arrays | Broadcasting, indexado y reshape correctos | En su mayoría correctos | Hay errores |
| Álgebra lineal | Operaciones con matrices correctas (inversa, multiplicación, transpuesta) | En su mayoría correctas | Errores graves |
| Funciones | Las 6 implementadas correctamente | 4-5 implementadas | < 4 implementadas |
| Rendimiento | Incluye comparación de tiempos | El código corre pero es lento | No se midió |

## Tiempo estimado

90 minutos
