---
Module: 4
Lesson Number: 8
Lesson Title: Gradient Boosting
Estimated Duration: 90 minutos
Prerequisites: L4 (Árboles de Decisión), L5 (Bosque Aleatorio)
Learning Objectives:
  - Explicar el paradigma de boosting y cómo difiere del bagging
  - Describir el algoritmo de Gradient Boosting
  - Entrenar modelos de Gradient Boosting con scikit-learn
  - "Ajustar hiperparámetros: learning_rate, n_estimators, max_depth"
  - Describir cómo XGBoost y LightGBM mejoran el gradient boosting básico
Keywords: boosting, gradient boosting, XGBoost, LightGBM, tasa de aprendizaje, modelo aditivo, residual
Difficulty: Avanzado
Programming Concepts: sklearn.ensemble.GradientBoostingClassifier, learning_rate, early_stopping
Mathematical Concepts: descenso por gradiente en el espacio de funciones, modelado aditivo
Machine Learning Concepts: boosting, aprendices débiles, ensemble secuencial
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Aprender de los errores, uno por uno" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "¿Bosque vs potenciación? Random Forest promedia en paralelo; Gradient Boosting corrige en serie.",
    "Cada árbol nuevo se enfoca en corregir los errores del anterior.",
    "Así se entrena como un estudiante que estudia solo lo que falló.",
  ]}
/>

<ConceptCard variant="key-idea">
**Boosting (secuencial) vs Bagging (paralelo)**
- Paradigma: bagging paralelo vs boosting secuencial
- Árboles: independientes, profundos, alta varianza vs dependientes, shallow, alta precisión incremental
- Corrección de errores: el promedio reduce la varianza vs cada árbol corrige residuales del anterior
- Riesgo: sobreajuste por árboles profundos vs sobreajuste si learning_rate muy alto o demasiados árboles
</ConceptCard>

{/* candidate-player: comparison-bagging-vs-boosting */}
<ConceptCard variant="key-idea">
Gradient Boosting entrena árboles en **serie**: cada árbol nuevo se enfoca en corregir los errores del anterior. Es como un estudiante que después de cada examen revisa qué preguntas falló y estudia específicamente eso.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="El algoritmo: árboles que corrigen árboles" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Cada nuevo árbol predice los **residuales** (errores) del ensemble actual, no la variable objetivo directamente.",
    "Luego se suma al ensemble con un peso controlado por la tasa de aprendizaje.",
    "Empieza con el promedio, calcula residuales, entrena el árbol corrector y repite.",
  ]}
/>

<ConceptCard variant="definition">
Cada nuevo árbol no predice la variable objetivo directamente — predice los **residuales** (errores) del ensemble actual. Luego se suma al ensemble con un peso controlado por la **tasa de aprendizaje** (learning rate).

**Flujo del algoritmo**
- Empieza con una predicción constante (el promedio)
- Calcula los residuales (error = real − predicción actual)
- Entrena un árbol para predecir esos residuales
- Actualiza: nueva predicción = predicción anterior + learning_rate × predicción del árbol
- Repite 2-4 para n_estimators árboles
</ConceptCard>

<CalloutInfo>
El **learning rate** (típicamente 0.01–0.1) es el hiperparámetro más importante. Controla cuánto contribuye cada árbol. LR bajo + muchos árboles = mejor generalización pero más lento. LR alto + pocos árboles = rápido pero riesgo de sobreajuste.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={3} title="Los 3 hiperparámetros que importan" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Tres perillas: n_estimators, learning_rate y max_depth.",
    "LR bajo + early stopping es la receta para la mejor generalización.",
    "Los árboles shallow son los aprendices débiles que el boosting necesita.",
  ]}
/>

<ConceptCard variant="key-idea">
**n_estimators:** Cuántos árboles. Más = mejor (hasta cierto punto). Con early stopping, dejas que crezca y paras cuando la validación deja de mejorar.

**learning_rate:** Cuánto aporta cada árbol (0.01–0.3). Valores bajos necesitan más árboles pero generalizan mejor. Es la perilla fina del modelo.

**max_depth:** Profundidad de cada árbol. En boosting, típicamente 3–5, mucho menor que en un Random Forest. Árboles shallow = aprendices débiles, que es justo lo que quieres.
</ConceptCard>

<CalloutCheck>
En la práctica: learning_rate=0.1, max_depth=3, y n_estimators con early stopping. Esta combinación funciona sorprendentemente bien en la mayoría de problemas tabulares sin necesidad de mucho ajuste.
</CalloutCheck>

<ChoiceQuestion
  question="Estás eligiendo el learning_rate. ¿Qué combinación ofrece la mejor generalización y con qué contraparte?"
  moduleSlug="machine-learning"
  lessonSlug="lesson08_gradient_boosting"
  blockId="choice-ml-l08-e2-1"
  allowContinueOnIncorrect
  explanation="Un learning_rate bajo (por ejemplo 0.01–0.05) reduce la contribución de cada árbol y requiere más árboles, pero generaliza mejor; aceleras con early stopping. Un LR alto entrena rápido pero sobreajusta más fácil."
  options={[
    { id: "a", label: "Learning_rate bajo + muchos árboles con early stopping", correct: true, feedback: "¡Correcto! Más árboles de aportes pequeños generalizan mejor." },
    { id: "b", label: "Learning_rate alto + pocos árboles para velocidad", correct: false, feedback: "Falso: rápido pero más riesgo de sobreajuste." },
    { id: "c", label: "El learning_rate no afecta la generalización", correct: false, feedback: "Falso: es el hiperparámetro más importante del boosting." },
    { id: "d", label: "Usar max_depth alto compensa un learning_rate bajo", correct: false, feedback: "Falso: en boosting conviene árboles shallow (3–5)." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={4} title="XGBoost y LightGBM: la evolución" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "sklearn es la versión académica; en producción se usan implementaciones optimizadas.",
    "XGBoost añade regularización y manejo de nulos; LightGBM entrena con histogramas.",
    "CatBoost maneja variables categóricas sin one-hot encoding.",
  ]}
/>

<ConceptCard variant="key-idea">
**Implementaciones optimizadas**
- XGBoost: regularización L1/L2 incorporada, manejo de valores nulos, paralelización por feature. El estándar de facto en competencias.
- LightGBM: entrena con histogramas (no ordena todos los datos), crece por hoja (no por nivel). Más rápido y menos memoria que XGBoost en datasets grandes.
- CatBoost: maneja variables categóricas nativamente sin one-hot encoding. Bueno cuando tienes muchas features categóricas.
</ConceptCard>

{/* candidate-player: comparison-boosting-implementations */}
<CalloutInfo>
Para datasets menores a 10,000 filas, sklearn GradientBoosting es suficiente. Para datasets más grandes o competitivos, XGBoost o LightGBM. La diferencia en accuracy suele ser pequeña (1-3%), pero en tiempo de entrenamiento puede ser 10x.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={5} title="Gradient Boosting en código" eyebrow="CÓDIGO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Entrena con breast cancer y observa train vs test.",
    "staged_predict te muestra el aprendizaje incremental por número de árboles.",
    "Grafica curvas de aprendizaje para detectar cuándo parar.",
  ]}
/>

```python
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer
import matplotlib.pyplot as plt

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

gb = GradientBoostingClassifier(
    n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
gb.fit(X_train, y_train)

print(f"Train: {gb.score(X_train, y_train):.3f}")
print(f"Test:  {gb.score(X_test, y_test):.3f}")

# Learning curves via staged_predict
from sklearn.metrics import accuracy_score
train_scores = [accuracy_score(y_train, y_pred)
                for y_pred in gb.staged_predict(X_train)]
test_scores = [accuracy_score(y_test, y_pred)
               for y_pred in gb.staged_predict(X_test)]

plt.plot(train_scores, label='Train')
plt.plot(test_scores, label='Test')
plt.xlabel('N° de árboles'); plt.ylabel('Accuracy')
plt.legend(); plt.title('Curvas de aprendizaje — Gradient Boosting')
plt.show()
```

</RevealSequence>

</Section>

<Section number={6} title="Resumen y glosario" eyebrow="RESUMEN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Gradient Boosting corrige errores en serie, controlado por el learning rate.",
    "LR bajo + early stopping es la receta para la mejor generalización.",
    "XGBoost/LightGBM son las implementaciones de producción y dominan los datos tabulares.",
  ]}
/>

<ConceptCard variant="key-idea">
Gradient Boosting entrena árboles secuencialmente, cada uno corrigiendo los errores del anterior. Learning rate bajo + early stopping es la receta para la mejor generalización. XGBoost/LightGBM son las implementaciones de producción. Es el algoritmo dominante en datos tabulares.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "boosting", label: "Boosting", detail: "Entrenar árboles en serie, cada uno corrigiendo los errores del anterior." },
    { id: "learning-rate", label: "Learning rate", detail: "Peso de cada árbol; típicamente entre 0.01 y 0.1." },
    { id: "residuales", label: "Residuales", detail: "Errores del ensemble actual que el siguiente árbol predice." },
    { id: "early-stopping", label: "Early stopping", detail: "Parar cuando la validación deja de mejorar." },
    { id: "max-depth", label: "max_depth", detail: "Profundidad shallow (3–5) para aprendices débiles." },
    { id: "xgboost-lightgbm", label: "XGBoost / LightGBM", detail: "Implementaciones optimizadas para producción." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "gloss-boosting", label: "Boosting", detail: "Ensemble secuencial que corrige errores." },
    { id: "gloss-learning-rate", label: "Learning rate", detail: "Tasa de aprendizaje del boosting." },
    { id: "gloss-residual", label: "Residual", detail: "Diferencia entre valor real y predicción actual." },
    { id: "gloss-early-stopping", label: "Early stopping", detail: "Criterio de parada anticipada." },
    { id: "gloss-aditivo", label: "Modelo aditivo", detail: "Modelo que suma contribuciones de árboles." },
    { id: "gloss-xgboost", label: "XGBoost", detail: "Implementación optimizada con regularización." },
    { id: "gloss-lightgbm", label: "LightGBM", detail: "Boosting basado en histogramas, rápido y eficiente." },
  ]}
/>

<ChoiceQuestion
  question="En Gradient Boosting, ¿qué predice cada nuevo árbol?"
  moduleSlug="machine-learning"
  lessonSlug="lesson08_gradient_boosting"
  blockId="choice-ml-l08-resumen-1"
  allowContinueOnIncorrect
  explanation="Cada árbol nuevo no predice la variable objetivo directamente: predice los residuales (errores) del ensemble actual, y su aporte se suma ponderado por el learning rate."
  options={[
    { id: "a", label: "Los residuales (errores) del ensemble actual", correct: true, feedback: "¡Correcto! El boosting corrige errores en serie." },
    { id: "b", label: "La variable objetivo original directamente", correct: false, feedback: "Eso sería un modelo independiente, no boosting." },
    { id: "c", label: "El promedio de las predicciones anteriores", correct: false, feedback: "El promedio es la predicción inicial, no lo que predice cada árbol." },
    { id: "d", label: "Las features más importantes", correct: false, feedback: "Las features se usan como entrada, no como objetivo del árbol." },
  ]}
/>

<MascotMessage mood="celebrating">
Gradient Boosting dominado. Ya puedes entrenar modelos que aprenden de sus errores y controlar la generalización con el learning rate.
</MascotMessage>

</RevealSequence>

</Section>

<Section number={7} title="Ejercicios" eyebrow="EJERCICIOS">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Desafío: compara GB vs Random Forest y analiza el efecto del learning rate.",
    "Usa el código para probar distintos learning rates y observa el impacto en accuracy.",
    "La comparación con Random Forest deja visible la diferencia de enfoque.",
  ]}
/>

<ConceptCard variant="key-idea">
**Desafío:** Compara GB vs Random Forest y analiza el efecto del learning rate.
</ConceptCard>

<CodeEditor
  defaultValue={`from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

# Random Forest como baseline
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_tr, y_tr)
print(f"Random Forest: {rf.score(X_te, y_te):.3f}")

# Gradient Boosting con distintos learning rates
for lr in [0.01, 0.05, 0.1, 0.5]:
    gb = GradientBoostingClassifier(n_estimators=100, learning_rate=lr, max_depth=3, random_state=42)
    gb.fit(X_tr, y_tr)
    print(f"GB (lr={lr:.2f}): {gb.score(X_te, y_te):.3f}")`}
  height="350px"
/>

</RevealSequence>

</Section>
