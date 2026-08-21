# Quiz: Evaluación de modelos

## Opción múltiple (5 preguntas)

**1. ¿Qué significa RMSE?**

a) Error cuadrático medio regularizado
b) Raíz del error cuadrático medio
c) Error estándar medio relativo
d) Error de selección del modelo de regresión

**2. R² = 0 significa:**

a) El modelo predice perfectamente
b) El modelo no rinde mejor que predecir la media
c) El modelo está sobreajustado
d) El modelo tiene un rendimiento negativo

**3. En la validación cruzada de k folds, cada punto de datos se usa para la prueba exactamente:**

a) 0 veces
b) 1 vez
c) k veces
d) k-1 veces

**4. ¿Qué métrica penaliza más fuertemente los errores grandes?**

a) MAE
b) MSE
c) R²
d) RMSE

**5. La fuga de datos (data leakage) ocurre cuando:**

a) El set de prueba es demasiado pequeño
b) Se usa información de fuera del set de entrenamiento durante el entrenamiento
c) El modelo es demasiado complejo
d) No se usa validación cruzada

## Respuesta corta (2 preguntas)

**6.** Explica por qué es un error evaluar un modelo con los mismos datos con los que se entrenó.

**7.** Un modelo de regresión tiene MAE = $5,000 y RMSE = $12,000 para la predicción de precios de casas. ¿Qué te dice la diferencia entre MAE y RMSE?

## Pregunta de código (1 pregunta)

**8.** Escribe código en Python usando sklearn que:
- Divida el dataset de diabetes en entrenamiento (80%) y prueba (20%)
- Entrene un LinearRegression
- Calcule e imprima MAE, RMSE y R² sobre el set de prueba

---

# Clave de respuestas

1. b) Raíz del error cuadrático medio
2. b) El modelo no rinde mejor que predecir la media
3. b) 1 vez
4. b) MSE
5. b) Se usa información de fuera del set de entrenamiento durante el entrenamiento

6. Un modelo puede memorizar los datos de entrenamiento (overfitting) y parecer que rinde bien. Pero el objetivo es la generalización: el rendimiento sobre datos nuevos, no vistos. El set de prueba simula este escenario. El rendimiento en entrenamiento siempre es optimista.

7. RMSE es mucho más grande que MAE (más del doble), lo que significa que hay algunas predicciones con errores muy grandes. El término al cuadrado en MSE/RMSE amplifica los errores grandes. Algunas casas tienen errores de predicción mucho mayores que los $5,000 típicos.

8. 
```python
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np
X, y = load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression().fit(X_train, y_train)
y_pred = model.predict(X_test)
print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
print(f"R²: {r2_score(y_test, y_pred):.3f}")
```
