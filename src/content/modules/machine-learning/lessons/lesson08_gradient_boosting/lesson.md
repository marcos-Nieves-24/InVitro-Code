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
  - Ajustar hiperparámetros: learning_rate, n_estimators, max_depth
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

<MascotMessage mood="excited">
Gradient Boosting es el algoritmo que domina las competencias de ML. XGBoost y LightGBM (sus implementaciones optimizadas) ganan Kaggle una y otra vez. Entender cómo funciona es entrar a la liga mayor.
</MascotMessage>

El Bosque Aleatorio entrena árboles en **paralelo** y los promedia. Gradient Boosting entrena árboles en **serie**: cada árbol nuevo se enfoca en corregir los errores del anterior. Es como un estudiante que después de cada examen revisa qué preguntas falló y estudia específicamente eso.

<ComparisonTable
  rows={[
    { feature: "Paradigma", left: "Bagging (paralelo)", right: "Boosting (secuencial)" },
    { feature: "Árboles", left: "Independientes, profundos, alta varianza", right: "Dependientes, shallow, alta precisión incremental" },
    { feature: "Corrección de errores", left: "Promedio reduce varianza", right: "Cada árbol corrige residuales del anterior" },
    { feature: "Riesgo", left: "Sobreajuste por árboles profundos", right: "Sobreajuste si learning_rate muy alto o demasiados árboles" },
  ]}
/>

</Section>

<Section number={2} title="El algoritmo: árboles que corrigen árboles" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Cada nuevo árbol no predice la variable objetivo directamente — predice los **residuales** (errores) del ensemble actual. Luego se suma al ensemble con un peso controlado por la **tasa de aprendizaje** (learning rate).
</ConceptCard>

1. Empezá con una predicción constante (el promedio)
2. Calculá los residuales (error = real − predicción actual)
3. Entrená un árbol para predecir esos residuales
4. Actualizá: nueva predicción = predicción anterior + learning_rate × predicción del árbol
5. Repetí 2-4 para n_estimators árboles

<CalloutInfo>
El **learning rate** (típicamente 0.01–0.1) es el hiperparámetro más importante. Controla cuánto contribuye cada árbol. LR bajo + muchos árboles = mejor generalización pero más lento. LR alto + pocos árboles = rápido pero riesgo de sobreajuste.
</CalloutInfo>

</Section>

<Section number={3} title="Los 3 hiperparámetros que importan" eyebrow="CONCEPTO">

<ConceptCard variant="key-idea">
**n_estimators:** Cuántos árboles. Más = mejor (hasta cierto punto). Con early stopping, dejás que crezca y parás cuando la validación deja de mejorar.

**learning_rate:** Cuánto aporta cada árbol (0.01–0.3). Valores bajos necesitan más árboles pero generalizan mejor. Es la perilla fina del modelo.

**max_depth:** Profundidad de cada árbol. En boosting, típicamente 3–5 (¡mucho menor que en Random Forest!). Árboles shallow = aprendices débiles, que es justo lo que querés.
</ConceptCard>

<CalloutCheck>
En la práctica: learning_rate=0.1, max_depth=3, y n_estimators con early stopping. Esta combinación funciona sorprendentemente bien en la mayoría de problemas tabulares sin necesidad de mucho ajuste.
</CalloutCheck>

</Section>

<Section number={4} title="XGBoost y LightGBM: la evolución" eyebrow="CONCEPTO">

El Gradient Boosting de sklearn es la versión académica. En producción se usan implementaciones optimizadas:

<ComparisonTable
  rows={[
    { feature: "XGBoost", left: "Regularización L1/L2 incorporada, manejo de valores nulos, paralelización por feature. El estándar de facto en competencias." },
    { feature: "LightGBM", left: "Entrena con histogramas (no ordena todos los datos), crece por hoja (no por nivel). Más rápido y menos memoria que XGBoost en datasets grandes." },
    { feature: "CatBoost", left: "Maneja variables categóricas nativamente sin one-hot encoding. Bueno cuando tenés muchas features categóricas." },
  ]}
/>

<CalloutInfo>
Para datasets <10,000 filas, sklearn GradientBoosting es suficiente. Para datasets más grandes o competitivos, XGBoost o LightGBM. La diferencia en accuracy suele ser pequeña (1-3%), pero en tiempo de entrenamiento puede ser 10x.
</CalloutInfo>

</Section>

<Section number={5} title="Gradient Boosting en código" eyebrow="CÓDIGO">

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

</Section>

<Section number={6} title="Resumen" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
Gradient Boosting entrena árboles secuencialmente, cada uno corrigiendo los errores del anterior. Learning rate bajo + early stopping es la receta para la mejor generalización. XGBoost/LightGBM son las implementaciones de producción. Es el algoritmo dominante en datos tabulares.
</ConceptCard>

</Section>
