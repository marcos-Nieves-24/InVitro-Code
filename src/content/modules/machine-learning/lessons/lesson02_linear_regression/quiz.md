# Quiz: Regresión Lineal

## Opción múltiple (5 preguntas)

**Q1.** En la regresión lineal simple, ¿qué representa el coeficiente $\beta_1$?

a) El valor predicho de y cuando x = 0
b) El cambio en y por un cambio de una unidad en x
c) La correlación entre x e y
d) El término de error

<details><summary>Respuesta</summary>b) El cambio en y por un cambio de una unidad en x</details>

**Q2.** ¿Qué significa R² = 0.70?

a) El modelo tiene 70% de probabilidad de ser correcto
b) El 70% de la varianza del target se explica por las features
c) El 30% de las predicciones son incorrectas
d) El coeficiente de correlación es 0.70

<details><summary>Respuesta</summary>b) El 70% de la varianza del target se explica por las features</details>

**Q3.** ¿Cuál de los siguientes NO es un supuesto de la regresión lineal?

a) Linealidad entre las features y el target
b) Independencia de las observaciones
c) Las features deben distribuirse normalmente
d) Homocedasticidad (varianza constante de los residuos)

<details><summary>Respuesta</summary>c) Las features deben distribuirse normalmente (solo los residuos necesitan normalidad para la inferencia)</details>

**Q4.** Se prefiere el descenso por gradiente sobre la solución OLS de forma cerrada cuando:

a) El número de features es muy grande
b) El dataset tiene menos de 100 muestras
c) Las features son categóricas
d) El R² es negativo

<details><summary>Respuesta</summary>a) El número de features es muy grande (el costo computacional de la inversión de matrices es O(n³))</details>

**Q5.** Un valor de R² negativo indica:

a) Que el modelo está sobreajustado
b) Que el modelo rinde peor que predecir la media
c) Que los datos no tienen varianza
d) Que los coeficientes son negativos

<details><summary>Respuesta</summary>b) Que el modelo rinde peor que predecir la media</details>

## Respuesta corta (2 preguntas)

**Q6.** Un colega ajusta una regresión lineal y obtiene R² = 0.92 en los datos de entrenamiento y R² = 0.15 en los de prueba. ¿Qué está pasando y cómo lo arreglarías?

<details><summary>Respuesta</summary>El modelo está sobreajustado — memoriza los datos de entrenamiento pero no logra generalizar. Posibles soluciones: reducir la complejidad del modelo (menos features, menor grado polinómico), aplicar regularización (Ridge/Lasso), obtener más datos de entrenamiento o simplificar el conjunto de features.</details>

**Q7.** Explica por qué la solución OLS de forma cerrada $\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$ es problemática cuando $\mathbf{X}^\top\mathbf{X}$ no es invertible. ¿Cuándo ocurre esto?

<details><summary>Respuesta</summary>Cuando $\mathbf{X}^\top\mathbf{X}$ es singular (determinante = 0), no tiene inversa. Esto ocurre cuando las features son perfectamente multicolineales (una feature es una combinación lineal de otras) o cuando hay menos muestras que features (n < p). Las soluciones incluyen eliminar features correlacionadas, usar la pseudoinversa o aplicar regularización (Ridge agrega $\lambda I$ haciendo la matriz invertible).</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribe una función en Python `ridge_regression_scratch(X, y, lambda_val)` que implemente la regresión Ridge (OLS con penalización L2) usando la solución de forma cerrada: $\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X} + \lambda\mathbf{I})^{-1}\mathbf{X}^\top\mathbf{y}$. Pruébalo contra `sklearn.linear_model.Ridge`.

<details><summary>Respuesta</summary>

```python
import numpy as np
from sklearn.linear_model import Ridge

def ridge_regression_scratch(X, y, lambda_val):
    X_with_intercept = np.c_[np.ones(X.shape[0]), X]
    n_features = X_with_intercept.shape[1]
    I = np.eye(n_features)
    I[0, 0] = 0  # Don't regularize intercept
    beta = np.linalg.inv(X_with_intercept.T @ X_with_intercept + lambda_val * I) @ X_with_intercept.T @ y
    return beta[0], beta[1:]

from sklearn.datasets import load_diabetes
data = load_diabetes()
X, y = data.data, data.target

int_s, coef_s = ridge_regression_scratch(X, y, lambda_val=1.0)
ridge = Ridge(alpha=1.0).fit(X, y)

print(f"Intercept match: {np.abs(int_s - ridge.intercept_) < 1e-8}")
print(f"Coefficients match: {np.allclose(coef_s, ridge.coef_, atol=1e-8)}")
```
</details>
