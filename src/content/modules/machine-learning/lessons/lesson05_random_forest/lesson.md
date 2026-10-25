
Module: 4
Lesson Number: 5
Lesson Title: Bosque Aleatorio
Estimated Duration: 75 minutos
Prerequisites: L4 (Árboles de Decisión)
Learning Objectives:
  Explicar cómo el bagging reduce la varianza en modelos ensemble
  Entrenar y evaluar clasificadores de Bosque Aleatorio con scikit learn
  Calcular e interpretar la importancia de características de Bosques Aleatorios
  Comparar el rendimiento del Bosque Aleatorio con árboles de decisión individuales
  Ajustar hiperparámetros del Bosque Aleatorio
Keywords: bosque aleatorio, ensemble, bagging, bootstrap, importancia de características, out of bag
Difficulty: Intermedio
Programming Concepts: sklearn.ensemble.RandomForestClassifier, n_estimators, oob_score
Mathematical Concepts: bagging, muestreo bootstrap, votación mayoritaria
Machine Learning Concepts: aprendizaje ensemble, reducción de varianza, importancia de características
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md


# Bosque Aleatorio

<Section number={1} title="100 médicos piensan mejor que uno" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un árbol solo es inestable y sobreajusta.",
    "Si entrenas 100 árboles con variaciones aleatorias y los pones a votar, el resultado es robusto.",
    "Esto es un ensemble: combinar modelos débiles para crear uno fuerte.",
    "Es el caballo de batalla del ML supervisado.",
  ]}
/>

<MascotMessage mood="celebrating">
El Bosque Aleatorio es uno de los algoritmos más usados en la industria. ¿La razón? Funciona bien casi siempre, sin requerir mucho ajuste. Es el "caballo de batalla" del ML supervisado.
</MascotMessage>

<ConceptCard variant="key idea">
**Bagging (Bootstrap Aggregating):** Tomas muchas muestras bootstrap de tus datos, entrenas un árbol en cada una, y promedias (regresión) o haces votación mayoritaria (clasificación). La magia: cada árbol tiene varianza alta, pero el promedio de B árboles reduce la varianza ~B veces sin aumentar el sesgo.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="Dos fuentes de aleatoriedad" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El bosque mezcla dos fuentes de azar para descorrelacionar árboles.",
    "Bootstrap cambia los datos; la selección aleatoria de features cambia las preguntas.",
    "Así los árboles cometen errores en direcciones distintas.",
  ]}
/>

{/* candidate player: comparison fuentes aleatoriedad */}
<ConceptCard variant="key idea">
**Dos fuentes de aleatoriedad**
- Aleatoriedad 1: cada árbol se entrena con una muestra bootstrap diferente (~63% de los datos, con reemplazo).
- Aleatoriedad 2: en cada división del árbol, solo se considera un subconjunto aleatorio de features (√p para clasificación, p/3 para regresión).
- ¿Por qué dos?: si solo usáramos bootstrap, los árboles todavía estarían correlacionados (las features más fuertes dominarían). La segunda aleatoriedad fuerza diversidad real.
- Resultado: árboles descorrelacionados que cometen errores en distintas direcciones  el promedio es mucho mejor que cualquiera individual.
</ConceptCard>

<ConceptCard variant="definition">
**OOB (Out of Bag):** Cada muestra bootstrap deja fuera ~37% de los datos. Esas muestras "out of bag" sirven como conjunto de validación gratuito. Con `oob_score=True` en sklearn, obtienes una estimación de rendimiento sin necesidad de dividir train/test.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="Importancia de características: el superpoder del RF" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El bosque no solo predice: te dice qué features importan.",
    "Consistencia en cientos de árboles da confianza a la importancia.",
    "Cuidado con features correlacionadas: la importancia se reparte.",
  ]}
/>

El Bosque Aleatorio no solo predice   te dice **qué features importan**. Calcula cuánto empeora el modelo cuando mezclas aleatoriamente cada feature:

<CalloutCheck>
La importancia por permutación del RF es más confiable que la importancia de un solo árbol porque promedia sobre cientos de árboles. Si una feature sale consistentemente como top 3 en 100 árboles distintos, puedes confiar en que realmente importa.
</CalloutCheck>

<ChoiceQuestion
  question="Dos features tienen importancia similar según el RF. ¿Significa que son igualmente importantes para tu problema?"
  moduleSlug="machine learning"
  lessonSlug="lesson05_random_forest"
  blockId="reflection l05 feature importance"
  allowContinueOnIncorrect
  explanation="No necesariamente: si están correlacionadas, el RF reparte la importancia entre ambas y ninguna parece dominante. Elimina una y reentrena para verificar. Además, importancia mide utilidad predictiva, no causalidad."
  options={[
    { id: "a", label: "No: correlación puede repartir importancia y nada parece dominante", correct: true, feedback: "¡Correcto! Hay que reentrenar sin una para confirmar redundancia." },
    { id: "b", label: "Sí: importancia similar implica igual importancia real", correct: false, feedback: "Falso: la correlación puede diluir la importancia." },
    { id: "c", label: "La importancia mide causalidad, no utilidad predictiva", correct: false, feedback: "Falso: mide utilidad predictiva, no causalidad." },
    { id: "d", label: "Siempre normalizar importancias evita el efecto", correct: false, feedback: "Falso: normalizar no resuelve la redundancia por correlación." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={4} title="Tu primer Bosque Aleatorio" eyebrow="CÓDIGO">

<RevealSequence mode="appear">

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
Ni siquiera necesitas un conjunto de validación separado: el OOB score te da una estimación honesta del rendimiento. Si OOB ≈ test accuracy, sabes que no hay fuga de datos y el modelo generaliza bien.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={5} title="RF vs Árbol individual" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

```python
from sklearn.tree import DecisionTreeClassifier

# Single tree
tree = DecisionTreeClassifier(random_state=42)
tree.fit(X_train, y_train)

# Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

print(f"Árbol individual   Test: {tree.score(X_test, y_test):.3f}")
print(f"Bosque Aleatorio   Test: {rf.score(X_test, y_test):.3f}")

# Compare top features
tree_imp = pd.DataFrame({
    'feature': data.feature_names,
    'tree': tree.feature_importances_,
    'forest': rf.feature_importances_
}).set_index('feature')
print(tree_imp.sort_values('forest', ascending=False).head(10))
```

<ConceptCard variant="key idea">
El RF casi siempre supera al árbol individual. La diferencia es más notable cuando hay mucho ruido en los datos. Si el RF no mejora significativamente al árbol, probablemente tus datos son muy simples o tienes pocas features.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="Biotecnología: genómica y biomarcadores" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En descubrimiento de fármacos tienes miles de genes y cientos de pacientes.",
    "El bosque maneja p >> n y selecciona features automáticamente.",
    "Un RF no asume linealidad: captura interacciones entre genes.",
  ]}
/>

En descubrimiento de fármacos, tienes datos de expresión de miles de genes pero solo cientos de pacientes. El RF brilla en este escenario:

- **Maneja p >> n** (más features que muestras) mejor que la regresión
- **Selecciona features automáticamente**   identificas qué genes predicen respuesta al tratamiento
- **Robusto a features irrelevantes**   la aleatoriedad en cada split ignora features ruidosas

<CalloutInfo>
En estudios de asociación genómica (GWAS), los Bosques Aleatorios se usan para identificar variantes genéticas asociadas a enfermedades sin asumir linealidad. Un modelo lineal te dice "el gen A aumenta el riesgo en 20%". Un RF te dice "el gen A importa, pero su efecto depende de los genes B y C".
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={7} title="Errores comunes" eyebrow="PELIGROS">

<RevealSequence mode="appear">

<CalloutInfo>
1. **Pocos árboles.** Con n_estimators=10 dejas mucha varianza sin reducir. Empieza con 100 y sube si tienes recursos. Después de ~500 árboles, la mejora marginal es mínima.

2. **No usar OOB.** Estás desperdiciando validación gratis. Siempre `oob_score=True`.

3. **max_depth=None en RF.** Aunque el RF es más robusto al sobreajuste que un árbol solo, árboles sin podar dentro del bosque igual pueden sobreajustar sus muestras bootstrap.

4. **Ignorar max_features.** El default (sqrt(p)) suele funcionar, pero en datasets con muchas features ruidosas, reducirlo fuerza más diversidad.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={8} title="Resumen y glosario" eyebrow="RESUMEN">

<RevealSequence mode="appear">

<ConceptCard variant="key idea">
El Bosque Aleatorio entrena muchos árboles con bootstrap + selección aleatoria de features. Reduce la varianza drásticamente sin aumentar el sesgo. El OOB da validación gratis. La feature importance es confiable. Es el algoritmo "default" para problemas tabulares supervisados.
</ConceptCard>

{/* candidate player: interactive table glosario random forest */}
<ConceptCard variant="key idea">
**Glosario**
- **Ensemble:** combinar múltiples modelos para superar a cualquiera individual.
- **Bagging:** bootstrap + agregación: entrenar en muestras bootstrap y promediar.
- **OOB:** estimación de rendimiento con datos no usados en el bootstrap.
- **n_estimators:** cantidad de árboles. Más = mejor (hasta cierto punto).
- **max_features:** cuántas features considerar por split. Clave para diversidad.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "bagging", label: "Bagging", detail: "Entrenar en muestras bootstrap y promediar o votar para reducir varianza." },
    { id: "bootstrap", label: "Bootstrap", detail: "Muestreo con reemplazo que deja ~63% de los datos en cada árbol." },
    { id: "oob", label: "OOB", detail: "Validación gratis con las muestras que quedaron fuera del bootstrap." },
    { id: "n estimators", label: "n_estimators", detail: "Cantidad de árboles del bosque; la mejora se estabiliza tras ~500." },
    { id: "max features", label: "max_features", detail: "Features candidatas por split: √p (clasificación) o p/3 (regresión)." },
    { id: "feature importance", label: "Importancia de features", detail: "Cuánto empeora el modelo al mezclar aleatoriamente una feature." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "gloss ensemble", label: "Ensemble", detail: "Combinar varios modelos para superar a cualquiera individual." },
    { id: "gloss bagging", label: "Bagging", detail: "Bootstrap + agregación: reduce varianza promediando." },
    { id: "gloss bootstrap", label: "Bootstrap", detail: "Muestreo con reemplazo de tamaño n." },
    { id: "gloss oob", label: "OOB", detail: "Muestras no usadas en el bootstrap de cada árbol." },
    { id: "gloss n estimators", label: "n_estimators", detail: "Número de árboles del ensemble." },
    { id: "gloss max features", label: "max_features", detail: "Subconjunto aleatorio de features considerado por split." },
    { id: "gloss feature importance", label: "Importancia de features", detail: "Medida de utilidad predictiva de una feature." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué porcentaje aproximado de los datos queda fuera del muestreo bootstrap en cada árbol de un Bosque Aleatorio?"
  moduleSlug="machine learning"
  lessonSlug="lesson05_random_forest"
  blockId="choice ml l05 resumen 1"
  allowContinueOnIncorrect
  explanation="El muestreo bootstrap con reemplazo deja fuera aproximadamente 1/e ≈ 37% de las muestras, que se usan como conjunto out of bag (OOB) para validar el árbol sin un split adicional."
  options={[
    { id: "a", label: "Aproximadamente el 37%", correct: true, feedback: "¡Correcto! Esas muestras out of bag sirven como validación gratuita." },
    { id: "b", label: "Aproximadamente el 63%", correct: false, feedback: "Ese es el porcentaje que entra al bootstrap, no el que queda fuera." },
    { id: "c", label: "Aproximadamente el 50%", correct: false, feedback: "El bootstrap no es un split 50/50; la fracción fuera es ~37%." },
    { id: "d", label: "Aproximadamente el 10%", correct: false, feedback: "Demasiado bajo; el bootstrap retiene ~63% y deja fuera ~37%." },
  ]}
/>

<MascotMessage mood="celebrating">
Bosque Aleatorio dominado. Ya puedes entrenar un ensemble robusto, validar con OOB y leer la importancia de cada feature.
</MascotMessage>

</RevealSequence>

</Section>

<Section number={9} title="Ejercicios" eyebrow="EJERCICIOS">

<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Por qué un Bosque Aleatorio con 500 árboles de profundidad 3 puede tener mejor rendimiento que un solo árbol de profundidad 15?"
  moduleSlug="machine learning"
  lessonSlug="lesson05_random_forest"
  blockId="reflection l05 bagging vs single"
  allowContinueOnIncorrect
  explanation="Porque el RF reduce la varianza promediando. Un árbol profundo (15) tiene varianza alta y memoriza ruido; 500 árboles shallow (profundidad 3) promedian para quedarse con la señal real. Es mejor tener 500 estudiantes mediocres que votan que un solo genio inestable."
  options={[
    { id: "a", label: "Porque promediar 500 árboles shallow reduce la varianza", correct: true, feedback: "¡Correcto! Bagging estabiliza predicciones con baja varianza." },
    { id: "b", label: "Porque 500 árboles son siempre más precisos que 1", correct: false, feedback: "Falso: depende de la varianza reducida, no de la cantidad." },
    { id: "c", label: "Porque árboles profundos ajustan mejor pero generalizan peor", correct: false, feedback: "Falso: confunde ajuste con reducción de varianza por promediado." },
    { id: "d", label: "La profundidad 15 basta para cualquier problema", correct: false, feedback: "Falso: profundidad alta memoriza ruido con varianza alta." },
  ]}
/>

<ConceptCard variant="key idea">
**Desafío:** Analiza cómo mejora el OOB score al aumentar árboles. ¿Dónde deja de valer la pena?
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

# Visualiza
plt.figure(figsize=(8, 5))
plt.plot(n_trees, oob_scores, 'bo-', linewidth=2)
plt.xlabel('Número de árboles')
plt.ylabel('OOB Score')
plt.title('¿Cuántos árboles necesito?')
plt.grid(True, alpha=0.3)
plt.show()

# ¿Dónde se aplana la mejora?
for i in range(1, len(oob_scores)):
    improvement = oob_scores[i] oob_scores[i 1]
    print(f"{n_trees[i 1]}  {n_trees[i]}: mejora = {improvement:.5f}")`}
  height="380px"
/>

</RevealSequence>

</Section>
