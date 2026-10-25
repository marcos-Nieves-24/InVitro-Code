# Quiz: Gradient Boosting

## Opción múltiple (5 preguntas)

**Q1.** ¿Cuál es la diferencia clave entre bagging y boosting?

a) El bagging usa árboles profundos; el boosting usa árboles poco profundos
b) El bagging entrena los árboles de forma independiente; el boosting los entrena secuencialmente
c) El bagging es para regresión; el boosting es para clasificación
d) Son el mismo algoritmo con diferentes nombres

<details><summary>Respuesta</summary>b) El bagging entrena los árboles de forma independiente en paralelo; el boosting los entrena secuencialmente, cada uno corrigiendo los errores del conjunto anterior</details>

**Q2.** En gradient boosting, cada árbol nuevo se entrena para predecir:

a) La variable objetivo original
b) Los residuales (errores) del conjunto actual
c) El promedio de todos los árboles anteriores
d) Ruido aleatorio

<details><summary>Respuesta</summary>b) Los residuales (errores) del conjunto actual</details>

**Q3.** Una tasa de aprendizaje más baja en gradient boosting normalmente requiere:

a) Menos árboles
b) Más árboles
c) Árboles más profundos
d) Ningún cambio en la configuración de los árboles

<details><summary>Respuesta</summary>b) Más árboles. Una tasa de aprendizaje más baja reduce la contribución de cada árbol, así que se necesitan más árboles para alcanzar el mismo nivel de ajuste.</details>

**Q4.** ¿Cuál de las siguientes afirmaciones es VERDADERA sobre los árboles en gradient boosting?

a) Los árboles deberían ser profundos (profundidad 10+) para capturar patrones complejos
b) Los árboles suelen ser poco profundos (profundidad 2-5), actuando como weak learners
c) En boosting solo se usa un árbol
d) Los árboles siempre son más profundos que en el bosque aleatorio

<details><summary>Respuesta</summary>b) Los árboles suelen ser poco profundos (profundidad 2-5). El boosting funciona combinando muchos weak learners, no usando árboles individuales fuertes.</details>

**Q5.** XGBoost mejora el gradient boosting básico agregando:

a) Regularización para prevenir el sobreajuste
b) Selección automática de features
c) Soporte para datos de imágenes
d) El reemplazo de los árboles por redes neuronales

<details><summary>Respuesta</summary>a) Regularización para prevenir el sobreajuste (regularización L1 y L2 sobre los pesos de los árboles)</details>

## Respuesta corta (2 preguntas)

**Q6.** Explica cómo funciona el early stopping en gradient boosting y por qué es importante.

<details><summary>Respuesta</summary>El early stopping monitorea el rendimiento en un set de validación después de agregar cada árbol. Cuando el rendimiento de validación deja de mejorar (o empieza a decrecer) durante un número especificado de iteraciones, el entrenamiento se detiene. Esto previene el sobreajuste al encontrar el número óptimo de árboles sin ajuste manual. Es importante porque el boosting puede sobreajustarse si se agregan demasiados árboles, especialmente con una tasa de aprendizaje baja.</details>

**Q7.** Compara los roles de la tasa de aprendizaje y n_estimators en gradient boosting. ¿Cuál es la relación entre ellos?

<details><summary>Respuesta</summary>La tasa de aprendizaje (η) reduce la contribución de cada árbol al conjunto. Un η más bajo significa que cada árbol tiene menos impacto, requiriendo más árboles (n_estimators más alto) para lograr un buen rendimiento. La relación es aproximadamente: n_estimators óptimo × 1 / tasa de aprendizaje. Una estrategia común: establece learning_rate = 0.01-0.1 y usa early stopping para determinar n_estimators. Las tasas de aprendizaje más bajas con más árboles generalmente generalizan mejor que las tasas más altas con menos árboles.</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribe una función en Python `compare_boosting_vs_bagging(X, y)` que entrene un GradientBoostingClassifier y un RandomForestClassifier (ambos con 100 estimators, max_depth=3) y devuelva un DataFrame comparando sus exactitudes de entrenamiento y de prueba.

<details><summary>Respuesta</summary>

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score

def compare_boosting_vs_bagging(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    models = {
        'GradientBoosting': GradientBoostingClassifier(
            n_estimators=100, max_depth=3, random_state=42
        ),
        'RandomForest': RandomForestClassifier(
            n_estimators=100, max_depth=3, random_state=42
        ),
    }

    results = []
    for name, model in models.items():
        model.fit(X_train, y_train)
        results.append({
            'Model': name,
            'Train': accuracy_score(y_train, model.predict(X_train)),
            'Test': accuracy_score(y_test, model.predict(X_test)),
        })

    return pd.DataFrame(results)

from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
print(compare_boosting_vs_bagging(data.data, data.target).to_string(index=False))
```
</details>
