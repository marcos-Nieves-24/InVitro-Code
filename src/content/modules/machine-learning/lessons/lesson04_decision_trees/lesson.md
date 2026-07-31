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

<Section number={1} title="El algoritmo que piensa como un médico" eyebrow="INICIO">

<MascotMessage mood="curious">
Los árboles de decisión son el algoritmo más intuitivo del ML. Hacen exactamente lo que harías vos: una serie de preguntas de sí/no hasta llegar a una conclusión. Y lo mejor: podés dibujar el resultado y explicárselo a cualquiera.
</MascotMessage>

Un médico diagnostica pacientes así: "¿El tumor mide más de 2 cm? Sí → ¿Los ganglios están comprometidos? No → ¿Edad > 50? Sí → Alto riesgo." Un árbol de decisión automatiza exactamente este proceso, aprendiendo de los datos qué preguntas hacer y en qué orden.

<ConceptCard variant="key-idea">
A diferencia de la regresión logística (fronteras lineales), los árboles crean **fronteras en forma de escalera** alineadas a los ejes. Esto los hace naturales para datos donde las relaciones no son lineales y los thresholds importan más que las pendientes.
</ConceptCard>

</Section>

<Section number={2} title="Anatomía de un árbol" eyebrow="CONCEPTO">

Un árbol de decisión tiene cuatro partes:

- **Nodo raíz:** La primera pregunta — la feature más informativa del dataset
- **Nodos internos:** Preguntas basadas en thresholds de features
- **Ramas:** Los caminos que siguen las respuestas (sí / no)
- **Hojas:** Donde se detiene el árbol y se hace la predicción final

El proceso de predicción es simple: una muestra entra por la raíz, sigue las ramas según sus valores, y cuando llega a una hoja, la clase mayoritaria de esa hoja es la predicción.

<CalloutInfo>
Un árbol con profundidad 1 se llama **stump** (tocón). Hace una sola pregunta. Es el modelo más simple posible y sirve como excelente línea base. Si tu Random Forest con 100 árboles no le gana a un stump, algo anda muy mal.
</CalloutInfo>

</Section>

<Section number={3} title="¿Cómo decide el árbol dónde dividir?" eyebrow="MATEMÁTICA">

En cada nodo, el algoritmo evalúa todas las features y todos los thresholds posibles, y elige la división que maximiza la **ganancia de información**.

<ConceptCard variant="definition">
**Impureza de Gini:** $\text{Gini}(t) = 1 - \sum_{i=1}^{c} p_i^2$

Mide la probabilidad de clasificar mal un elemento al azar. Gini = 0 → nodo puro (todas las muestras son de la misma clase). Gini alto → mezcla de clases.
</ConceptCard>

<ConceptCard variant="definition">
**Entropía:** $\text{Entropía}(t) = -\sum_{i=1}^{c} p_i \log_2(p_i)$

Otra medida de "desorden". Entropía = 0 → pureza total. La entropía penaliza más la incertidumbre que Gini cuando hay muchas clases.
</ConceptCard>

**Ganancia de información:** Reducción en impureza después de dividir:

$$\text{IG} = \text{Impureza}_{\text{padre}} - \sum_{j} \frac{n_j}{n} \text{Impureza}_{\text{hijo}_j}$$

<CalloutCheck>
En la práctica, Gini y Entropía rara vez dan árboles muy diferentes. Gini es más rápido computacionalmente y es el default de scikit-learn. Usá Entropía solo si tenés razones teóricas para preferirla.
</CalloutCheck>

</Section>

<Section number={4} title="Podar para no sobreajustar" eyebrow="CONCEPTO">

Los árboles sin límites crecen hasta que cada hoja es 100% pura — memorizan los datos de entrenamiento. La **poda** es el mecanismo para controlar esto:

<ComparisonTable
  rows={[
    { feature: "Cuándo", left: "Durante el crecimiento del árbol", right: "Después de que el árbol creció completo" },
    { feature: "Cómo", left: "Parámetros: max_depth, min_samples_split, min_samples_leaf", right: "Eliminar ramas que no mejoran la validación" },
    { feature: "Ventaja", left: "Más rápido, menos cómputo", right: "Puede encontrar interacciones sutiles que la pre-poda perdería" },
    { feature: "En sklearn", left: "max_depth=5, min_samples_leaf=10", right: "ccp_alpha (Cost Complexity Pruning)" },
  ]}
/>

<ReflectionCheck
  blockId="reflection-l04-depth-overfit"
  moduleSlug="machine-learning"
  lessonSlug="lesson04_decision_trees"
  prompt="Un árbol con max_depth=None alcanza 100% de precisión en entrenamiento pero 60% en prueba. ¿Qué está pasando y cómo lo arreglás?"
  answer="Sobreajuste clásico: el árbol creció hasta memorizar cada muestra. Tres estrategias: (1) limitar max_depth con validación cruzada para encontrar el punto óptimo, (2) aumentar min_samples_split para forzar hojas con más muestras, (3) usar ccp_alpha para poda por costo-complejidad que elimina ramas con poca ganancia."
/>

</Section>

<Section number={5} title="Visualizá tu primer árbol" eyebrow="INTERACTIVA">

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.datasets import load_iris

iris = load_iris()
X, y = iris.data[:, [0, 2]], iris.target

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X, y)

plt.figure(figsize=(16, 8))
plot_tree(tree, feature_names=['sepal_length', 'petal_length'],
          class_names=iris.target_names, filled=True, rounded=True)
plt.show()
```

<CalloutInfo>
Cada nodo muestra: la feature y threshold de división, la impureza de Gini, cuántas muestras llegaron, y la distribución de clases. Los colores indican la clase predominante — cuanto más intenso, más puro es el nodo.
</CalloutInfo>

</Section>

<Section number={6} title="Comparando profundidades" eyebrow="CÓDIGO">

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

for depth in [1, 3, 5, 10, None]:
    tree = DecisionTreeClassifier(max_depth=depth, random_state=42)
    tree.fit(X_train, y_train)
    train_acc = accuracy_score(y_train, tree.predict(X_train))
    test_acc = accuracy_score(y_test, tree.predict(X_test))
    print(f"Depth {str(depth):>4s}: Train = {train_acc:.3f}, Test = {test_acc:.3f}")
```

<CalloutCheck>
El mejor árbol no es el más profundo — es el que tiene el menor gap entre train y test. Cuando la precisión de entrenamiento sigue subiendo pero la de prueba se estanca (o empeora), ya estás sobreajustando.
</CalloutCheck>

</Section>

<Section number={7} title="Biotecnología: estratificación de pacientes" eyebrow="APLICACIÓN">

Un hospital identifica pacientes de alto riesgo para un ensayo clínico:

```python
np.random.seed(42)
n = 300
bio_data = pd.DataFrame({
    'biomarker_1': np.random.normal(0, 1, n),
    'biomarker_2': np.random.normal(0, 1, n),
    'age': np.random.randint(20, 80, n),
    'gene_mutation_count': np.random.poisson(3, n),
})
risk = (0.3 * bio_data['biomarker_1'] - 0.2 * bio_data['biomarker_2']
        + 0.01 * bio_data['age'] + 0.1 * bio_data['gene_mutation_count']
        + np.random.normal(0, 0.3, n))
bio_data['high_risk'] = (risk > risk.median()).astype(int)

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(bio_data.drop('high_risk', axis=1), bio_data['high_risk'])
print(f"Importancias: {dict(zip(bio_data.columns[:-1], tree.feature_importances_))}")
```

<ConceptCard variant="key-idea">
La ventaja del árbol en medicina: es **explicable**. Podés mostrarle al médico el diagrama y decirle "el modelo decidió alto riesgo porque biomarker_1 > 0.5 Y edad > 60". Con una red neuronal, no podrías.
</ConceptCard>

</Section>

<Section number={8} title="SaaS: scoring de leads" eyebrow="APLICACIÓN">

```python
np.random.seed(42)
lead_data = pd.DataFrame({
    'pages_visited': np.random.poisson(5, 500),
    'time_on_site_min': np.random.exponential(10, 500),
    'email_opens': np.random.poisson(2, 500),
    'demo_requested': np.random.binomial(1, 0.2, 500),
})
conv = (0.05*lead_data['pages_visited'] + 0.02*lead_data['time_on_site_min']
        + 0.1*lead_data['email_opens'] + 0.3*lead_data['demo_requested']
        + np.random.normal(0, 0.1, 500))
lead_data['converted'] = (conv > 0.5).astype(int)

tree = DecisionTreeClassifier(max_depth=4, min_samples_leaf=10, random_state=42)
tree.fit(lead_data.drop('converted', axis=1), lead_data['converted'])
print(f"Importancias: {dict(zip(lead_data.columns[:-1], tree.feature_importances_))}")
```

</Section>

<Section number={9} title="Errores y buenas prácticas" eyebrow="PELIGROS">

<CalloutInfo>
1. **Sin límite de profundidad.** El árbol crece hasta pureza total y sobreajusta catastróficamente. Siempre poné max_depth.

2. **Ignorar feature importance.** Los árboles te regalan un ranking de features. No lo desperdicies — es oro para entender tu problema.

3. **Inestabilidad.** Pequeños cambios en los datos pueden producir árboles muy distintos. Para eso existen Random Forests (próxima lección).

4. **No comparar con línea base.** Un stump (max_depth=1) es tu baseline mínimo. Si tu árbol profundo no lo supera significativamente, hay un problema.
</CalloutInfo>

<CalloutCheck>
Limitá profundidad con validación cruzada. Visualizá el árbol para comunicar resultados. Usá feature importance para selección de variables. Compará siempre contra un stump.
</CalloutCheck>

</Section>

<Section number={10} title="Resumen y glosario" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
Los árboles dividen datos recursivamente usando Gini o Entropía. Son interpretables, manejan no-linealidades naturalmente, pero tienden al sobreajuste. La poda (max_depth, min_samples_leaf) es obligatoria. La feature importance es uno de sus outputs más valiosos.
</ConceptCard>

<InteractiveTable
  columns={[
    { key: "term", label: "Término" },
    { key: "def", label: "Definición" },
  ]}
  rows={[
    { term: "Gini", def: "Probabilidad de clasificar mal un elemento al azar en un nodo" },
    { term: "Entropía", def: "Medida de desorden; penaliza más la incertidumbre que Gini" },
    { term: "Ganancia de información", def: "Reducción de impureza tras una división" },
    { term: "Nodo hoja", def: "Nodo terminal donde se emite la predicción" },
    { term: "Poda", def: "Limitar la profundidad para evitar sobreajuste" },
    { term: "Stump", def: "Árbol de profundidad 1 — el clasificador más simple posible" },
  ]}
/>

</Section>

<Section number={11} title="Ejercicios y desafío" eyebrow="EJERCICIOS">

<ConceptCard variant="key-idea">
**Desafío:** Encontrá la profundidad óptima para un árbol de decisión.
</ConceptCard>

<CodeEditor
  defaultValue={`from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

def tree_depth_tuner(X_train, X_val, y_train, y_val, max_depths):
    best_depth, best_acc = None, 0
    scores = []
    for depth in max_depths:
        tree = DecisionTreeClassifier(max_depth=depth, random_state=42)
        tree.fit(X_train, y_train)
        acc = accuracy_score(y_val, tree.predict(X_val))
        scores.append(acc)
        if acc > best_acc:
            best_acc, best_depth = acc, depth
        print(f"Depth {str(depth):>3s}: val_acc = {acc:.3f}")
    return best_depth, scores

# Probá con breast cancer
data = load_breast_cancer()
X, y = data.data, data.target
X_tr, X_val, y_tr, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

best_depth, scores = tree_depth_tuner(X_tr, X_val, y_tr, y_val, [1,2,3,5,7,10,15])
print()
print(f"Mejor profundidad: {best_depth}")`}
  height="350px"
/>

</Section>
