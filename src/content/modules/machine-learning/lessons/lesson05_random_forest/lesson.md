---
Module: 4
Lesson Number: 5
Lesson Title: Bosque Aleatorio
Estimated Duration: 75 minutos
Prerequisites: L4 (Árboles de Decisión)
Learning Objectives:
  - Explicar cómo el bagging reduce la varianza en modelos ensemble
  - Entrenar y evaluar clasificadores de Bosque Aleatorio con scikit-learn
  - Calcular e interpretar la importancia de características de Bosques Aleatorios
  - Comparar el rendimiento del Bosque Aleatorio con árboles de decisión individuales
  - Ajustar hiperparámetros del Bosque Aleatorio
Keywords: bosque aleatorio, ensemble, bagging, bootstrap, importancia de características, out-of-bag
Difficulty: Intermedio
Programming Concepts: sklearn.ensemble.RandomForestClassifier, n_estimators, oob_score
Mathematical Concepts: bagging, muestreo bootstrap, votación mayoritaria
Machine Learning Concepts: aprendizaje ensemble, reducción de varianza, importancia de características
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="100 médicos piensan mejor que uno" eyebrow="INICIO">

<MascotMessage mood="celebrating">
El Bosque Aleatorio es uno de los algoritmos más usados en la industria. ¿La razón? Funciona bien casi siempre, sin requerir mucho ajuste. Es el "caballo de batalla" del ML supervisado.
</MascotMessage>

Un árbol de decisión solo es inestable y sobreajusta. Pero si entrenás 100 árboles con variaciones aleatorias de los datos y los ponés a votar, el resultado es sorprendentemente robusto. Esto es un **ensemble**: combinar modelos débiles para crear uno fuerte.

<ConceptCard variant="key-idea">
**Bagging (Bootstrap Aggregating):** Tomás muchas muestras bootstrap de tus datos, entrenás un árbol en cada una, y promediás (regresión) o hacés votación mayoritaria (clasificación). La magia: cada árbol tiene varianza alta, pero el promedio de B árboles reduce la varianza ~B veces sin aumentar el sesgo.
</ConceptCard>

</Section>

<Section number={2} title="Dos fuentes de aleatoriedad" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Aleatoriedad 1", left: "Cada árbol se entrena con una muestra bootstrap diferente (~63% de los datos, con reemplazo)" },
    { feature: "Aleatoriedad 2", left: "En cada división del árbol, solo se considera un subconjunto aleatorio de features (√p para clasificación, p/3 para regresión)" },
    { feature: "¿Por qué dos?", left: "Si solo usáramos bootstrap, los árboles todavía estarían correlacionados (las features más fuertes dominarían). La segunda aleatoriedad fuerza diversidad real." },
    { feature: "Resultado", left: "Árboles descorrelacionados que cometen errores en distintas direcciones → el promedio es mucho mejor que cualquiera individual." },
  ]}
/>

<ConceptCard variant="definition">
**OOB (Out-of-Bag):** Cada muestra bootstrap deja fuera ~37% de los datos. Esas muestras "out-of-bag" sirven como conjunto de validación gratuito. Con `oob_score=True` en sklearn, obtenés una estimación de rendimiento sin necesidad de dividir train/test.
</ConceptCard>

</Section>

<Section number={3} title="Importancia de características: el superpoder del RF" eyebrow="CONCEPTO">

El Bosque Aleatorio no solo predice — te dice **qué features importan**. Calcula cuánto empeora el modelo cuando mezclás aleatoriamente cada feature:

<CalloutCheck>
La importancia por permutación del RF es más confiable que la importancia de un solo árbol porque promedia sobre cientos de árboles. Si una feature sale consistentemente como top-3 en 100 árboles distintos, podés confiar en que realmente importa.
</CalloutCheck>

<ReflectionCheck
  blockId="reflection-l05-feature-importance"
  moduleSlug="machine-learning"
  lessonSlug="lesson05_random_forest"
  prompt="Dos features tienen importancia similar según el RF. ¿Significa que son igualmente importantes para tu problema?"
  answer="No necesariamente. Si están correlacionadas, el RF reparte la importancia entre ambas y ninguna parece dominante. Para saberlo, eliminá una y reentrená: si la otra captura toda la importancia, son redundantes. Además, la importancia mide utilidad predictiva, no causalidad."
/>

</Section>

<Section number={4} title="Tu primer Bosque Aleatorio" eyebrow="CÓDIGO">

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.datasets import load_breast_cancer
import pandas as pd
import numpy as np

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=100, oob_score=True, random_state=42)
rf.fit(X_train, y_train)

print(f"OOB Score: {rf.oob_score_:.3f}")
print(f"Test Accuracy: {rf.score(X_test, y_test):.3f}")

importance = pd.DataFrame({
    'feature': data.feature_names,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False).head(10)
print(importance)
```

<CalloutInfo>
Ni siquiera necesitás un conjunto de validación separado: el OOB score te da una estimación honesta del rendimiento. Si OOB ≈ test accuracy, sabés que no hay fuga de datos y el modelo generaliza bien.
</CalloutInfo>

</Section>

<Section number={5} title="RF vs Árbol individual" eyebrow="INTERACTIVA">

```python
from sklearn.tree import DecisionTreeClassifier

# Single tree
tree = DecisionTreeClassifier(random_state=42)
tree.fit(X_train, y_train)

# Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

print(f"Árbol individual — Test: {tree.score(X_test, y_test):.3f}")
print(f"Bosque Aleatorio — Test: {rf.score(X_test, y_test):.3f}")

# Compare top features
tree_imp = pd.DataFrame({
    'feature': data.feature_names,
    'tree': tree.feature_importances_,
    'forest': rf.feature_importances_
}).set_index('feature')
print(tree_imp.sort_values('forest', ascending=False).head(10))
```

<ConceptCard variant="key-idea">
El RF casi siempre supera al árbol individual. La diferencia es más notable cuando hay mucho ruido en los datos. Si el RF no mejora significativamente al árbol, probablemente tus datos son muy simples o tenés pocas features.
</ConceptCard>

</Section>

<Section number={6} title="Biotecnología: genómica y biomarcadores" eyebrow="APLICACIÓN">

En descubrimiento de fármacos, tenés datos de expresión de miles de genes pero solo cientos de pacientes. El RF brilla en este escenario:

- **Maneja p >> n** (más features que muestras) mejor que la regresión
- **Selecciona features automáticamente** — identificás qué genes predicen respuesta al tratamiento
- **Robusto a features irrelevantes** — la aleatoriedad en cada split ignora features ruidosas

<CalloutInfo>
En estudios de asociación genómica (GWAS), los Bosques Aleatorios se usan para identificar variantes genéticas asociadas a enfermedades sin asumir linealidad. Un modelo lineal te dice "el gen A aumenta el riesgo en 20%". Un RF te dice "el gen A importa, pero su efecto depende de los genes B y C".
</CalloutInfo>

</Section>

<Section number={7} title="Errores comunes" eyebrow="PELIGROS">

<CalloutInfo>
1. **Pocos árboles.** Con n_estimators=10 dejás mucha varianza sin reducir. Empezá con 100 y subí si tenés recursos. Después de ~500 árboles, la mejora marginal es mínima.

2. **No usar OOB.** Estás desperdiciando validación gratis. Siempre `oob_score=True`.

3. **max_depth=None en RF.** Aunque el RF es más robusto al sobreajuste que un árbol solo, árboles sin podar dentro del bosque igual pueden sobreajustar sus muestras bootstrap.

4. **Ignorar max_features.** El default (sqrt(p)) suele funcionar, pero en datasets con muchas features ruidosas, reducirlo fuerza más diversidad.
</CalloutInfo>

</Section>

<Section number={8} title="Resumen y glosario" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
El Bosque Aleatorio entrena muchos árboles con bootstrap + selección aleatoria de features. Reduce la varianza drásticamente sin aumentar el sesgo. El OOB da validación gratis. La feature importance es confiable. Es el algoritmo "default" para problemas tabulares supervisados.
</ConceptCard>

<InteractiveTable
  columns={[
    { key: "term", label: "Término" },
    { key: "def", label: "Definición" },
  ]}
  rows={[
    { term: "Ensemble", def: "Combinar múltiples modelos para superar a cualquiera individual" },
    { term: "Bagging", def: "Bootstrap + agregación: entrenar en muestras bootstrap y promediar" },
    { term: "OOB", def: "Estimación de rendimiento con datos no usados en el bootstrap" },
    { term: "n_estimators", def: "Cantidad de árboles. Más = mejor (hasta cierto punto)" },
    { term: "max_features", def: "Cuántas features considerar por split. Clave para diversidad" },
  ]}
/>

</Section>

<Section number={9} title="Ejercicios" eyebrow="EJERCICIOS">

<ReflectionCheck
  blockId="reflection-l05-bagging-vs-single"
  moduleSlug="machine-learning"
  lessonSlug="lesson05_random_forest"
  prompt="¿Por qué un Bosque Aleatorio con 500 árboles de profundidad 3 puede tener mejor rendimiento que un solo árbol de profundidad 15?"
  answer="Porque el RF reduce la varianza promediando. Un árbol profundo (15) tiene varianza altísima — memoriza ruido. En cambio, 500 árboles shallow (profundidad 3), cada uno con sesgo alto pero poca varianza, al promediarse producen predicciones estables que capturan la señal real sin perseguir el ruido. Es mejor tener 500 estudiantes mediocres que votan que un solo genio inestable."
/>

<ConceptCard variant="key-idea">
**Desafío:** Analizá cómo mejora el OOB score al aumentar árboles. ¿Dónde deja de valer la pena?
</ConceptCard>

<CodeEditor
  defaultValue={`from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
import matplotlib.pyplot as plt

data = load_breast_cancer()
X, y = data.data, data.target

n_trees = [10, 50, 100, 200, 500]
oob_scores = []

for n in n_trees:
    rf = RandomForestClassifier(n_estimators=n, oob_score=True, 
                                 random_state=42, n_jobs=-1)
    rf.fit(X, y)
    oob_scores.append(rf.oob_score_)
    print(f"n_estimators={n:3d}: OOB = {rf.oob_score_:.4f}")

# Visualizá
plt.figure(figsize=(8, 5))
plt.plot(n_trees, oob_scores, 'bo-', linewidth=2)
plt.xlabel('Número de árboles')
plt.ylabel('OOB Score')
plt.title('¿Cuántos árboles necesito?')
plt.grid(True, alpha=0.3)
plt.show()

# ¿Dónde se aplana la mejora?
for i in range(1, len(oob_scores)):
    improvement = oob_scores[i] - oob_scores[i-1]
    print(f"{n_trees[i-1]} → {n_trees[i]}: mejora = {improvement:.5f}")`}
  height="380px"
/>

</Section>
