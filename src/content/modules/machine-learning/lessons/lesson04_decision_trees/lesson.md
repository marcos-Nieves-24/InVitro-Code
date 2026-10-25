
Module: 4
Lesson Number: 4
Lesson Title: Árboles de Decisión
Estimated Duration: 75 minutos
Prerequisites: L1 (Fundamentos de ML)
Learning Objectives:
  Explicar cómo los árboles de decisión hacen predicciones mediante particionamiento recursivo
  Describir la impureza de Gini y la entropía como criterios de división
  Entrenar y visualizar árboles de decisión con scikit learn
  Diagnosticar sobreajuste en árboles de decisión y aplicar poda
  Comparar árboles de decisión con modelos lineales
Keywords: árbol de decisión, impureza de Gini, entropía, ganancia de información, poda, sobreajuste
Difficulty: Intermedio
Programming Concepts: sklearn.tree.DecisionTreeClassifier, sklearn.tree.plot_tree
Mathematical Concepts: impureza de Gini, entropía, ganancia de información
Machine Learning Concepts: particionamiento recursivo, profundidad del árbol, poda
Datasets Used: iris, breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md


# Árboles de Decisión

<Section number={1} title="El algoritmo que piensa como un médico" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un patólogo mira una muestra y hace preguntas sí/no hasta diagnosticar.",
    "¿El tumor mide más de 2 cm? ¿Los ganglios están comprometidos?",
    "El árbol de decisión automatiza esas preguntas y aprende el orden.",
    "Es el algoritmo más intuitivo del ML y puedes dibujarlo para explicarlo.",
  ]}
/>

<MascotMessage mood="thinking">
Los árboles de decisión son el algoritmo más intuitivo del ML. Hacen exactamente lo que harías tú: una serie de preguntas de sí/no hasta llegar a una conclusión. Y lo mejor: puedes dibujar el resultado y explicárselo a cualquiera.
</MascotMessage>

<ConceptCard variant="key idea">
A diferencia de la regresión logística (fronteras lineales), los árboles crean **fronteras en forma de escalera** alineadas a los ejes. Esto los hace naturales para datos donde las relaciones no son lineales y los thresholds importan más que las pendientes.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="Anatomía de un árbol" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Como un diagnóstico clínico: primero la pregunta más informativa, luego las demás.",
    "El nodo raíz abre el camino y las hojas emiten la predicción.",
    "Un árbol de profundidad 1 se llama stump y es tu línea base mínima.",
  ]}
/>

- **Nodo raíz:** La primera pregunta   la feature más informativa del dataset
- **Nodos internos:** Preguntas basadas en thresholds de features
- **Ramas:** Los caminos que siguen las respuestas (sí / no)
- **Hojas:** Donde se detiene el árbol y se hace la predicción final

El proceso de predicción es simple: una muestra entra por la raíz, sigue las ramas según sus valores, y cuando llega a una hoja, la clase mayoritaria de esa hoja es la predicción.

<CalloutInfo>
Un árbol con profundidad 1 se llama **stump** (tocón). Hace una sola pregunta. Es el modelo más simple posible y sirve como excelente línea base. Si tu Random Forest con 100 árboles no le gana a un stump, algo anda muy mal.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={3} title="¿Cómo decide el árbol dónde dividir?" eyebrow="MATEMÁTICA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En cada nodo se evalúan todas las features y todos los thresholds.",
    "Se elige la división que maximiza la ganancia de información.",
    "Gini y Entropía miden la impureza de un nodo.",
  ]}
/>

En cada nodo, el algoritmo evalúa todas las features y todos los thresholds posibles, y elige la división que maximiza la **ganancia de información**.

<ConceptCard variant="definition">
**Impureza de Gini:** $\text{Gini}(t) = 1 \sum_{i=1}^{c} p_i^2$

Mide la probabilidad de clasificar mal un elemento al azar. Gini = 0 → nodo puro (todas las muestras son de la misma clase). Gini alto → mezcla de clases.
</ConceptCard>

<ConceptCard variant="definition">
**Entropía:** $\text{Entropía}(t) = -\sum_{i=1}^{c} p_i \log_2(p_i)$

Otra medida de "desorden". Entropía = 0 → pureza total. La entropía penaliza más la incertidumbre que Gini cuando hay muchas clases.
</ConceptCard>

**Ganancia de información:** Reducción en impureza después de dividir:

$$\text{IG} = \text{Impureza}_{\text{padre}} \sum_{j} \frac{n_j}{n} \text{Impureza}_{\text{hijo}_j}$$

<CalloutCheck>
En la práctica, Gini y Entropía rara vez dan árboles muy diferentes. Gini es más rápido computacionalmente y es el default de scikit learn. Usa Entropía solo si tienes razones teóricas para preferirla.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={4} title="Podar para no sobreajustar" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un árbol sin límite memoriza cada paciente y sobreajusta.",
    "La poda controla la profundidad para que generalice.",
    "Pre poda pone barreras antes de crecer; post poda recorta ramas inútiles.",
  ]}
/>

Los árboles sin límites crecen hasta que cada hoja es 100% pura   memorizan los datos de entrenamiento. La **poda** es el mecanismo para controlar esto:

{/* candidate player: comparison poda pre vs post */}
<ConceptCard variant="key idea">
**Pre poda vs post poda**
- Cuándo: pre poda durante el crecimiento del árbol; post poda después de que el árbol creció completo.
- Cómo: pre poda con parámetros `max_depth`, `min_samples_split`, `min_samples_leaf`; post poda eliminando ramas que no mejoran la validación.
- Ventaja: pre poda más rápido y menos cómputo; post poda puede encontrar interacciones sutiles que la pre poda perdería.
- En sklearn: pre poda `max_depth=5`, `min_samples_leaf=10`; post poda `ccp_alpha` (Cost Complexity Pruning).
</ConceptCard>

<ChoiceQuestion
  question="Un árbol con max_depth=None alcanza 100% de precisión en entrenamiento pero 60% en prueba. ¿Qué está pasando y cómo lo arreglas?"
  moduleSlug="machine learning"
  lessonSlug="lesson04_decision_trees"
  blockId="reflection l04 depth overfit"
  allowContinueOnIncorrect
  explanation="Sobreajuste clásico: el árbol creció hasta memorizar cada muestra. Estrategias: (1) limitar max_depth con CV, (2) aumentar min_samples_split, (3) poda por costo complejidad (ccp_alpha)."
  options={[
    { id: "a", label: "Sobreajuste: limitar max_depth, subir min_samples_split y podar (ccp_alpha)", correct: true, feedback: "¡Correcto! Es la receta clásica para árboles sobreajustados." },
    { id: "b", label: "Subajuste: conviene profundizar más el árbol", correct: false, feedback: "Falso: train 100% indica que ya es demasiado profundo." },
    { id: "c", label: "Es ruido en los datos: conviene eliminar features", correct: false, feedback: "Falso: la causa es la complejidad del árbol, no las features." },
    { id: "d", label: "Con más profundidad mejora la generalización", correct: false, feedback: "Falso: más profundidad empeora el gap train/test." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={5} title="Visualiza tu primer árbol" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Verás cómo el árbol parte el espacio de features en regiones.",
    "Cada nodo muestra Gini, muestras y distribución de clases.",
    "Los colores indican la clase predominante del nodo.",
  ]}
/>

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
Cada nodo muestra: la feature y threshold de división, la impureza de Gini, cuántas muestras llegaron, y la distribución de clases. Los colores indican la clase predominante   cuanto más intenso, más puro es el nodo.
</CalloutInfo>

<TreeSplit caption="Elegí la feature y el umbral vos mismo: mirá cómo la impureza de Gini baja en los dos hijos, y usá Dividir para hacer crecer el árbol." />

</RevealSequence>

</Section>

<Section number={6} title="Comparando profundidades" eyebrow="CÓDIGO">

<RevealSequence mode="appear">

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
El mejor árbol no es el más profundo   es el que tiene el menor gap entre train y test. Cuando la precisión de entrenamiento sigue subiendo pero la de prueba se estanca (o empeora), ya estás sobreajustando.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={7} title="Biotecnología: estratificación de pacientes" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un hospital identifica pacientes de alto riesgo para un ensayo clínico.",
    "El árbol prioriza biomarcadores y edad para estratificar riesgo.",
    "Al final te dice qué features importaron más.",
  ]}
/>

```python
np.random.seed(42)
n = 300
bio_data = pd.DataFrame({
    'biomarker_1': np.random.normal(0, 1, n),
    'biomarker_2': np.random.normal(0, 1, n),
    'age': np.random.randint(20, 80, n),
    'gene_mutation_count': np.random.poisson(3, n),
})
risk = (0.3 * bio_data['biomarker_1'] 0.2 * bio_data['biomarker_2']
        + 0.01 * bio_data['age'] + 0.1 * bio_data['gene_mutation_count']
        + np.random.normal(0, 0.3, n))
bio_data['high_risk'] = (risk > risk.median()).astype(int)

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(bio_data.drop('high_risk', axis=1), bio_data['high_risk'])
print(f"Importancias: {dict(zip(bio_data.columns[:-1], tree.feature_importances_))}")
```

<ConceptCard variant="key idea">
La ventaja del árbol en medicina: es **explicable**. Puedes mostrarle al médico el diagrama y decirle "el modelo decidió alto riesgo porque biomarker_1 > 0.5 Y edad > 60". Con una red neuronal, no podrías.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={8} title="SaaS: scoring de leads" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

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

</RevealSequence>

</Section>

<Section number={9} title="Errores y buenas prácticas" eyebrow="PELIGROS">

<RevealSequence mode="appear">

<CalloutInfo>
1. **Sin límite de profundidad.** El árbol crece hasta pureza total y sobreajusta catastróficamente. Siempre pon max_depth.

2. **Ignorar feature importance.** Los árboles te regalan un ranking de features. No lo desperdicies   es oro para entender tu problema.

3. **Inestabilidad.** Pequeños cambios en los datos pueden producir árboles muy distintos. Para eso existen Random Forests (próxima lección).

4. **No comparar con línea base.** Un stump (max_depth=1) es tu baseline mínimo. Si tu árbol profundo no lo supera significativamente, hay un problema.
</CalloutInfo>

<CalloutCheck>
Limita profundidad con validación cruzada. Visualiza el árbol para comunicar resultados. Usa feature importance para selección de variables. Compara siempre contra un stump.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={10} title="Resumen y glosario" eyebrow="RESUMEN">

<RevealSequence mode="appear">

<ConceptCard variant="key idea">
Los árboles dividen datos recursivamente usando Gini o Entropía. Son interpretables, manejan no linealidades naturalmente, pero tienden al sobreajuste. La poda (max_depth, min_samples_leaf) es obligatoria. La feature importance es uno de sus outputs más valiosos.
</ConceptCard>

{/* candidate player: interactive table glosario decision trees */}
<ConceptCard variant="key idea">
**Glosario**
- **Gini:** probabilidad de clasificar mal un elemento al azar en un nodo.
- **Entropía:** medida de desorden; penaliza más la incertidumbre que Gini.
- **Ganancia de información:** reducción de impureza tras una división.
- **Nodo hoja:** nodo terminal donde se emite la predicción.
- **Poda:** limitar la profundidad para evitar sobreajuste.
- **Stump:** árbol de profundidad 1   el clasificador más simple posible.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "division recursiva", label: "División recursiva", detail: "Parte los datos en ramas según una condición de una feature." },
    { id: "gini", label: "Índice Gini", detail: "Probabilidad de clasificar mal un elemento al azar en un nodo." },
    { id: "entropia", label: "Entropía", detail: "Medida de desorden; penaliza más la incertidumbre que Gini." },
    { id: "ganancia informacion", label: "Ganancia de información", detail: "Reducción de impureza tras una división." },
    { id: "poda", label: "Poda", detail: "Limitar la profundidad para evitar sobreajuste." },
    { id: "feature importance", label: "Importancia de features", detail: "Qué features más reducen la impureza en el árbol." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "gloss gini", label: "Gini", detail: "Probabilidad de clasificar mal un elemento al azar en un nodo." },
    { id: "gloss entropia", label: "Entropía", detail: "Medida de desorden; penaliza más la incertidumbre que Gini." },
    { id: "gloss ganancia", label: "Ganancia de información", detail: "Reducción de impureza tras una división." },
    { id: "gloss nodo hoja", label: "Nodo hoja", detail: "Nodo terminal donde se emite la predicción." },
    { id: "gloss poda", label: "Poda", detail: "Limitar la profundidad para evitar sobreajuste." },
    { id: "gloss stump", label: "Stump", detail: "Árbol de profundidad 1   el clasificador más simple posible." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué un árbol de decisión sin poda suele sobreajustar?"
  moduleSlug="machine learning"
  lessonSlug="lesson04_decision_trees"
  blockId="choice ml l04 resumen 1"
  allowContinueOnIncorrect
  explanation="Sin poda el árbol sigue dividiendo hasta que cada hoja es pura, memorizando el ruido del entrenamiento. La poda (max_depth, min_samples_leaf) obliga a generalizar y reduce la varianza."
  options={[
    { id: "a", label: "Porque divide hasta hojas puras, memorizando ruido del entrenamiento", correct: true, feedback: "¡Correcto! Eso es sobreajuste por falta de poda." },
    { id: "b", label: "Porque Gini siempre favorece árboles profundos", correct: false, feedback: "Falso: Gini mide impureza, no profundidad." },
    { id: "c", label: "Porque la entropía deja de funcionar en árboles grandes", correct: false, feedback: "Falso: la entropía funciona igual; el problema es la complejidad." },
    { id: "d", label: "Porque los árboles no pueden manejar no linealidades", correct: false, feedback: "Falso: los árboles manejan no linealidades de forma natural." },
  ]}
/>

<MascotMessage mood="celebrating">
Los árboles de decisión ya no te intimidan. El próximo bloque son los ensembles y los bosques.
</MascotMessage>

</RevealSequence>

</Section>

<Section number={11} title="Ejercicios y desafío" eyebrow="EJERCICIOS">

<RevealSequence mode="appear">

<ConceptCard variant="key idea">
**Desafío:** Encuentra la profundidad óptima para un árbol de decisión.
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

# Prueba con breast cancer
data = load_breast_cancer()
X, y = data.data, data.target
X_tr, X_val, y_tr, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

best_depth, scores = tree_depth_tuner(X_tr, X_val, y_tr, y_val, [1,2,3,5,7,10,15])
print()
print(f"Mejor profundidad: {best_depth}")
`}
  height="350px"
/>

</RevealSequence>

</Section>
