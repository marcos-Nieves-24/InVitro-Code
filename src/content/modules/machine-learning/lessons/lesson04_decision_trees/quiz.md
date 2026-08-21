# Quiz: Árboles de Decisión

## Opción múltiple (5 preguntas)

**Q1.** La impureza de Gini mide:

a) La profundidad de un árbol de decisión
b) La probabilidad de clasificación incorrecta en un nodo
c) El número de muestras en un nodo
d) La exactitud del modelo

<details><summary>Respuesta</summary>b) La probabilidad de clasificación incorrecta en un nodo (Gini = 1 - Σ(pᵢ²))</details>

**Q2.** Un nodo contiene 60 muestras de la clase A y 40 de la clase B. ¿Cuál es la impureza de Gini?

a) 0.50
b) 0.48
c) 0.52
d) 0.60

<details><summary>Respuesta</summary>b) 0.48. Gini = 1 - (0.6² + 0.4²) = 1 - (0.36 + 0.16) = 0.48</details>

**Q3.** La ganancia de información es:

a) La exactitud de una división
b) La reducción de la impureza después de una división
c) El número de muestras en una hoja
d) La profundidad del árbol

<details><summary>Respuesta</summary>b) La reducción de la impureza después de una división (impureza del nodo padre menos las impurezas ponderadas de los hijos)</details>

**Q4.** Un árbol de decisión que crece hasta que cada hoja es pura probablemente sufre de:

a) Subajuste
b) Sobreajuste
c) Multicolinealidad
d) Desbalance de clases

<details><summary>Respuesta</summary>b) Sobreajuste — el árbol memorizó los datos de entrenamiento, incluido el ruido</details>

**Q5.** ¿Cuál de los siguientes NO es una forma válida de prevenir el sobreajuste en los árboles de decisión?

a) Limitar max_depth
b) Poner min_samples_split en un valor más alto
c) Aumentar el número de features
d) Podar el árbol después del entrenamiento

<details><summary>Respuesta</summary>c) Aumentar el número de features (más features en realidad pueden aumentar el riesgo de sobreajuste)</details>

## Respuesta corta (2 preguntas)

**Q6.** Explica por qué se considera que los árboles de decisión son clasificadores "inestables". ¿Qué significa esto en la práctica?

<details><summary>Respuesta</summary>Los árboles de decisión son inestables porque pequeños cambios en los datos de entrenamiento pueden llevar a árboles muy diferentes. Unos pocos samples distintos en la parte superior del árbol cambian toda la estructura. En la práctica, esto significa que la varianza es alta — árboles de diferentes divisiones de datos pueden dar distintos rankings de importancia de features y distintas predicciones. Los bosques aleatorios (Random Forests) abordan esto promediando muchos árboles.</details>

**Q7.** Compara la impureza de Gini y la entropía como criterios de división. ¿Cuándo elegirías una sobre la otra?

<details><summary>Respuesta</summary>Ambas miden la impureza de un nodo y producen árboles similares en la práctica. Gini va de 0 a 0.5 (binario), la entropía de 0 a 1. Gini es ligeramente más rápido de calcular (sin log). La entropía es más sensible a los cambios en la probabilidad cerca de 0.5. scikit-learn usa Gini por defecto. La diferencia práctica es mínima — ambas encontrarán las mismas divisiones en la mayoría de los casos.</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribe una función en Python `compute_gini(y)` que calcule la impureza de Gini a partir de un array de etiquetas de clase. Después, escribe `find_best_split(X, y, feature_idx)` que encuentre el mejor umbral para una feature dada (maximizando la ganancia de información usando Gini).

<details><summary>Respuesta</summary>

```python
import numpy as np

def compute_gini(y):
    classes, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return 1 - np.sum(probs ** 2)

def find_best_split(X, y, feature_idx):
    values = X[:, feature_idx]
    sorted_idx = np.argsort(values)
    X_sorted = values[sorted_idx]
    y_sorted = y[sorted_idx]

    best_gain, best_threshold = 0, None
    parent_gini = compute_gini(y)

    for i in range(1, len(y_sorted)):
        if X_sorted[i] == X_sorted[i - 1]:
            continue
        threshold = (X_sorted[i] + X_sorted[i - 1]) / 2
        y_left = y_sorted[:i]
        y_right = y_sorted[i:]
        n_left, n_right = len(y_left), len(y_right)
        weighted_gini = (n_left * compute_gini(y_left) + n_right * compute_gini(y_right)) / len(y)
        gain = parent_gini - weighted_gini
        if gain > best_gain:
            best_gain = gain
            best_threshold = threshold

    return best_threshold, best_gain

from sklearn.datasets import load_iris
iris = load_iris()
th, gain = find_best_split(iris.data, iris.target, 2)
print(f"Best threshold for petal length: {th:.2f}, info gain: {gain:.4f}")
```
</details>
