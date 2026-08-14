# Quiz: Fundamentos de ML

## Opción múltiple (5 preguntas)

**Q1.** ¿Qué distingue al Machine Learning de la programación tradicional?

a) El ML requiere más código que la programación tradicional
b) En el ML, la computadora aprende reglas a partir de los datos en lugar de seguir reglas explícitas
c) El ML solo funciona con imágenes
d) El ML no requiere una computadora

<details><summary>Respuesta</summary>b) En el ML, la computadora aprende reglas a partir de los datos en lugar de seguir reglas explícitas</details>

**Q2.** En la terminología de ML, ¿qué es una "feature"?

a) La variable de salida que queremos predecir
b) Una variable de entrada que se usa para hacer predicciones
c) Una propiedad especial de las redes neuronales
d) El puntaje de exactitud del modelo

<details><summary>Respuesta</summary>b) Una variable de entrada que se usa para hacer predicciones</details>

**Q3.** Un modelo alcanza 99% de exactitud en los datos de entrenamiento pero solo 62% en los datos de prueba. Lo más probable es que sea:

a) Subajuste
b) Generalización óptima
c) Sobreajuste
d) Fuga de datos en el set de prueba

<details><summary>Respuesta</summary>c) Sobreajuste</details>

**Q4.** El tradeoff sesgo-varianza establece que:

a) Un sesgo alto siempre lleva a una varianza alta
b) A medida que aumenta la complejidad del modelo, el sesgo tiende a disminuir y la varianza tiende a aumentar
c) El sesgo y la varianza no están relacionados
d) Los modelos simples siempre superan a los complejos

<details><summary>Respuesta</summary>b) A medida que aumenta la complejidad del modelo, el sesgo tiende a disminuir y la varianza tiende a aumentar</details>

**Q5.** ¿Cuál de los siguientes es un ejemplo de aprendizaje no supervisado?

a) Predecir precios de casas a partir de la cantidad de dormitorios y los metros cuadrados
b) Agrupar patrones de compra de clientes sin categorías predefinidas
c) Clasificar correos como spam o no spam
d) Predecir si un paciente tiene una enfermedad

<details><summary>Respuesta</summary>b) Agrupar patrones de compra de clientes sin categorías predefinidas</details>

## Respuesta corta (2 preguntas)

**Q6.** Explicá la diferencia entre entrenamiento y predicción en el Machine Learning.

<details><summary>Respuesta</summary>El entrenamiento es el proceso en el que el modelo aprende patrones a partir de datos etiquetados ajustando sus parámetros internos. La predicción consiste en aplicar el modelo entrenado a datos nuevos, nunca vistos, para generar salidas. El entrenamiento requiere datos etiquetados y esfuerzo computacional; la predicción es rápida y puede aplicarse a datos sin etiquetar.</details>

**Q7.** Un colega te dice: "Mi modelo tiene R² = 0.95 en el set de entrenamiento, así que es excelente". ¿Por qué esto podría ser engañoso?

<details><summary>Respuesta</summary>Un R² alto en entrenamiento no garantiza una buena generalización. El modelo podría estar sobreajustado — memorizando el ruido de los datos de entrenamiento en lugar de aprender patrones verdaderos. El R² del set de prueba es la medida confiable del rendimiento. El colega debería evaluar en un set de prueba reservado o usar validación cruzada.</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribí una función en Python `bias_variance_demo(degree)` que:
1. Genere datos sinusoidales sintéticos con ruido (20 puntos, `np.sin(2πx) + N(0, 0.2)`)
2. Ajuste una regresión polinómica del grado dado
3. Devuelva el MSE de entrenamiento y el MSE de prueba

Probá tu función con degree=1, degree=4 y degree=15.

<details><summary>Respuesta</summary>

```python
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

def bias_variance_demo(degree):
    np.random.seed(42)
    X = np.linspace(0, 1, 20).reshape(-1, 1)
    y = np.sin(2 * np.pi * X.ravel()) + np.random.normal(0, 0.2, 20)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )

    poly = PolynomialFeatures(degree=degree)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)

    model = LinearRegression()
    model.fit(X_train_poly, y_train)

    train_pred = model.predict(X_train_poly)
    test_pred = model.predict(X_test_poly)

    train_mse = mean_squared_error(y_train, train_pred)
    test_mse = mean_squared_error(y_test, test_pred)

    return train_mse, test_mse

for deg in [1, 4, 15]:
    tr, te = bias_variance_demo(deg)
    print(f"Degree {deg}: Train MSE = {tr:.4f}, Test MSE = {te:.4f}")
```
</details>
</details>
