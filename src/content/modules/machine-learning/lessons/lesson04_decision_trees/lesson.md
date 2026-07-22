---
Module: 4
Lesson Number: 4
Lesson Title: Árboles de Decisión
Estimated Duration: 75 minutos
Prerequisites: L1 (Fundamentos de ML)
Learning Objectives:
  - Explicar cómo los árboles de decisión hacen predicciones mediante particionamiento recursivo
  - Describir la impureza de Gini y la entropía como criterios de división
  - Entrenar y visualizar árboles de decisión con scikit-learn
  - Diagnosticar sobreajuste en árboles de decisión y aplicar poda
  - Comparar árboles de decisión con modelos lineales
Keywords: árbol de decisión, impureza de Gini, entropía, ganancia de información, poda, sobreajuste
Difficulty: Intermedio
Programming Concepts: sklearn.tree.DecisionTreeClassifier, sklearn.tree.plot_tree
Mathematical Concepts: impureza de Gini, entropía, ganancia de información
Machine Learning Concepts: particionamiento recursivo, profundidad del árbol, poda
Datasets Used: iris, breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Árboles de Decisión

## Motivación

Un médico diagnostica pacientes haciendo una serie de preguntas: "¿El tumor mide más de 2 cm?" → "¿Los ganglios linfáticos están involucrados?" → "¿El paciente tiene más de 50 años?" Así exactamente funcionan los árboles de decisión. Son intuitivos — podés explicárselos a un interesado no técnico — y manejan relaciones no lineales de forma natural. En biotecnología se usan para estratificación de pacientes. En SaaS, para puntuación de leads.

## Panorama general

**Anterior:** La regresión logística nos dio fronteras de decisión lineales. **Esta lección:** Los árboles de decisión capturan patrones no lineales sin ingeniería de características. **Siguiente:** Los bosques aleatorios combinan muchos árboles para un rendimiento aún mejor.

## Teoría

### Estructura del árbol

Un árbol de decisión consta de:
- **Nodo raíz:** primera división en la característica más informativa
- **Nodos internos:** decisiones basadas en valores de características
- **Nodos hoja:** predicciones (etiqueta de clase o valor)
- **Ramas:** resultados de las decisiones

### Cómo fluyen las predicciones

Una muestra comienza en la raíz y atraviesa el árbol hacia abajo según comparaciones de características hasta llegar a una hoja. La clase mayoritaria de la hoja (clasificación) o el valor medio (regresión) es la predicción.

### Criterios de división

**Impureza de Gini:** Mide qué tan seguido un elemento elegido al azar sería clasificado incorrectamente.

$$\text{Gini}(t) = 1 - \sum_{i=1}^{c} p_i^2$$

Donde $p_i$ es la proporción de la clase $i$ en el nodo $t$.

- Gini = 0: nodo puro (todos de la misma clase)
- Gini máximo: $1 - 1/c$

**Entropía:**

$$\text{Entropía}(t) = -\sum_{i=1}^{c} p_i \log_2(p_i)$$

- Entropía = 0: nodo puro
- Entropía más alta → más desorden

**Ganancia de información:** Reducción en la impureza después de una división.

$$\text{IG} = \text{Impureza}_{\text{padre}} - \sum_{j} \frac{n_j}{n} \text{Impureza}_{\text{hijo}_j}$$

El algoritmo selecciona la división que maximiza la ganancia de información.

### Poda

Los árboles de decisión tienden al sobreajuste — pueden crecer hasta que cada hoja sea pura. La **poda** elimina ramas innecesarias:

- **Pre-poda:** Dejar de crecer cuando no hay ganancia significativa de información (max_depth, min_samples_split)
- **Post-poda:** Crecer el árbol completo, luego eliminar ramas

## Fundamento matemático

### Encontrar la mejor división

Para una característica numérica, el algoritmo:
1. Ordena todos los valores
2. Considera los puntos medios entre valores consecutivos como umbrales candidatos
3. Calcula la impureza ponderada para cada división
4. Selecciona el umbral con mayor ganancia de información

### Profundidad del árbol y sobreajuste

Un árbol con profundidad 1 (stump) tiene sesgo alto. Un árbol con profundidad 20 tiene varianza extremadamente alta. La profundidad óptima se encuentra mediante validación cruzada.

## Explicación visual

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.datasets import load_iris

iris = load_iris()
X, y = iris.data[:, [0, 2]], iris.target  # sepal length, petal length

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X, y)

plt.figure(figsize=(16, 8))
plot_tree(tree, feature_names=['sepal_length', 'petal_length'],
          class_names=iris.target_names, filled=True, rounded=True)
plt.savefig('figures/decision_tree_iris.png', dpi=150)
plt.show()
```

## Implementación en Python

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import load_breast_cancer
import matplotlib.pyplot as plt

data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Compare depths
for depth in [1, 3, 5, 10, None]:
    tree = DecisionTreeClassifier(max_depth=depth, random_state=42)
    tree.fit(X_train, y_train)
    train_acc = accuracy_score(y_train, tree.predict(X_train))
    test_acc = accuracy_score(y_test, tree.predict(X_test))
    print(f"Depth {depth}: Train = {train_acc:.3f}, Test = {test_acc:.3f}")

# Best tree with pruning
best_tree = DecisionTreeClassifier(max_depth=4, min_samples_split=10, random_state=42)
best_tree.fit(X_train, y_train)

plt.figure(figsize=(18, 8))
plot_tree(best_tree, feature_names=data.feature_names,
          class_names=data.target_names, filled=True, rounded=True,
          max_depth=3)
plt.show()

print(classification_report(y_test, best_tree.predict(X_test)))
```

## Ejemplo guiado: Clasificación de Iris

**Problema:** Clasificar flores Iris en 3 especies.

**Conjunto de datos:** 150 muestras, 4 características (largo/ancho de sépalo, largo/ancho de pétalo).

**Estructura del árbol:**
- Raíz: largo de pétalo ≤ 2.45 → Setosa (hoja pura)
- Rama derecha: largo de pétalo > 2.45 → más divisiones en ancho de pétalo
- Profundidad 2: ancho de pétalo ≤ 1.75 → Versicolor vs. Virginica

**Interpretación:** El árbol identificó automáticamente las medidas de los pétalos como las más discriminativas.

## Ejemplo en biotecnología: Estratificación de pacientes

Un hospital quiere identificar pacientes de alto riesgo para un ensayo clínico basándose en biomarcadores.

```python
np.random.seed(42)
n = 300

bio_data = pd.DataFrame({
    'biomarker_1': np.random.normal(0, 1, n),
    'biomarker_2': np.random.normal(0, 1, n),
    'age': np.random.randint(20, 80, n),
    'gene_mutation_count': np.random.poisson(3, n),
})

risk = (
    0.3 * bio_data['biomarker_1']
    - 0.2 * bio_data['biomarker_2']
    + 0.01 * bio_data['age']
    + 0.1 * bio_data['gene_mutation_count']
    + np.random.normal(0, 0.3, n)
)
bio_data['high_risk'] = (risk > risk.median()).astype(int)

X_bio = bio_data.drop('high_risk', axis=1)
y_bio = bio_data['high_risk']

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_bio, y_bio)

print(f"Feature importances: {dict(zip(X_bio.columns, tree.feature_importances_))}")
```

**Interpretación:** El árbol revela que gene_mutation_count es el factor de riesgo más importante.

## Ejemplo en SaaS: Puntuación de leads

```python
np.random.seed(42)
n = 500

lead_data = pd.DataFrame({
    'pages_visited': np.random.poisson(5, n),
    'time_on_site_min': np.random.exponential(10, n),
    'email_opens': np.random.poisson(2, n),
    'demo_requested': np.random.binomial(1, 0.2, n),
})

conversion_prob = (
    0.05 * lead_data['pages_visited']
    + 0.02 * lead_data['time_on_site_min']
    + 0.1 * lead_data['email_opens']
    + 0.3 * lead_data['demo_requested']
    + np.random.normal(0, 0.1, n)
)
lead_data['converted'] = (conversion_prob > 0.5).astype(int)

X_lead = lead_data.drop('converted', axis=1)
y_lead = lead_data['converted']

tree = DecisionTreeClassifier(max_depth=4, min_samples_leaf=10, random_state=42)
tree.fit(X_lead, y_lead)

print(f"Importance: {dict(zip(X_lead.columns, tree.feature_importances_))}")
```

**Interpretación:** Las solicitudes de demo son la señal más fuerte de intención de conversión.

## Errores comunes

1. **Sin límite de profundidad** — los árboles crecen hasta ser puros, causando sobreajuste severo.
2. **Ignorar la importancia de características** — los árboles proveen puntajes de importancia incorporados.
3. **Árboles desbalanceados** — una rama mucho más profunda que las otras.
4. **No verificar la inestabilidad** — pequeños cambios en los datos pueden producir árboles muy diferentes.

## Buenas prácticas

- Limitá siempre la profundidad del árbol (max_depth, min_samples_leaf)
- Usá validación cruzada para encontrar la profundidad óptima
- Compará el árbol con un modelo de línea base
- Visualizá el árbol para comunicación
- Usá la importancia de características para identificar factores clave

## Resumen

- Los árboles de decisión dividen los datos recursivamente según valores de características
- La impureza de Gini y la entropía miden la pureza de los nodos
- La ganancia de información guía la selección de divisiones
- Los árboles más profundos se sobreajustan; la poda lo previene
- Los árboles son interpretables pero inestables
- La importancia de características es un resultado clave

## Términos clave

| Término | Definición |
|---------|------------|
| Impureza de Gini | Probabilidad de clasificación incorrecta en un nodo |
| Entropía | Medida de desorden en un nodo |
| Ganancia de información | Reducción en impureza después de una división |
| Nodo raíz | Primera división en el árbol |
| Nodo hoja | Nodo terminal con predicción |
| Poda | Reducir la profundidad del árbol para evitar sobreajuste |
| Frontera de decisión | Divisiones alineadas a los ejes en el espacio de características |

## Ejercicios

**Nivel 1 — Básico:** ¿Cuál es la diferencia entre impureza de Gini y entropía? ¿Cuándo darían divisiones diferentes?

**Nivel 2 — Implementación:** Entrená árboles de decisión con max_depth = 2, 4, 6, 8, 10 en el dataset breast cancer. Graficá las precisiones de entrenamiento y prueba resultantes. ¿Cuál es la profundidad óptima?

**Nivel 3 — Pensamiento crítico:** Un árbol de decisión con max_depth = None alcanza 100% de precisión en entrenamiento pero 60% en prueba. ¿Qué tres estrategias usarías para mejorar el rendimiento en prueba?

## Desafío de programación

Escribí una función `tree_depth_tuner(X_train, X_val, y_train, y_val, max_depths)` que entrene árboles de decisión para cada profundidad en max_depths, evalúe la precisión en validación, y devuelva la profundidad óptima y el árbol entrenado.
