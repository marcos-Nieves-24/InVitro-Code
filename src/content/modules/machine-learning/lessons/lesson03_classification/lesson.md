---
Module: 4
Lesson Number: 3
Lesson Title: Clasificación
Estimated Duration: 90 minutos
Prerequisites: L1 (Fundamentos de ML)
Learning Objectives:
  - Explicar la clasificación binaria y la función logística
  - Entrenar y evaluar modelos de regresión logística con scikit-learn
  - Interpretar una matriz de confusión y derivar precisión, recall, F1
  - Graficar e interpretar curvas ROC y puntajes AUC
  - Comparar métricas de clasificación para diferentes contextos de negocio
Keywords: clasificación binaria, regresión logística, matriz de confusión, precisión, recall, F1, ROC, AUC, frontera de decisión
Difficulty: Principiante
Programming Concepts: sklearn.linear_model.LogisticRegression, sklearn.metrics
Mathematical Concepts: función sigmoide, log-odds, pérdida de entropía cruzada
Machine Learning Concepts: frontera de decisión, umbral, curva ROC, AUC
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Clasificación

<Section number={1} title="Predecir categorías, no números" eyebrow="INICIO">

<RevealSequence mode="appear">

<MascotMessage mood="celebrating">
¿Spam o no spam? ¿Cáncer o benigno? ¿Se va a dar de baja o se queda? La clasificación es el tipo de ML más usado en el mundo real. Hoy aprendes a separar el sí del no con matemática.
</MascotMessage>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "¿Cáncer o benigno? La clasificación es el ML más usado en el mundo real.",
    "Regresión lineal predice números; muchos problemas piden categorías.",
    "La regresión logística separa el sí del no con matemática.",
  ]}
/>

<ConceptCard variant="key-idea">
La regresión logística toma una combinación lineal de features, la pasa por una función sigmoide, y produce una probabilidad entre 0 y 1. Con un umbral (típicamente 0.5), decides la clase.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="La sigmoide: de números a probabilidades" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La regresión logística primero calcula una combinación lineal z.",
    "Luego la sigmoide comprime z a una probabilidad entre 0 y 1.",
    "La frontera de decisión es el hiperplano donde p̂ = 0.5.",
  ]}
/>

La regresión logística calcula primero una combinación lineal:

$$z = \beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p$$

Luego aplica la **función sigmoide** para convertir $z$ en una probabilidad:

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

<CalloutInfo>
La sigmoide tiene forma de S: comprime $(-\infty, +\infty)$ al rango $(0, 1)$. Valores grandes de $z$ → probabilidad cercana a 1. Valores muy negativos → probabilidad cercana a 0. En $z=0$, la probabilidad es exactamente 0.5.
</CalloutInfo>

**Regla de decisión:** si $\hat{p} \geq 0.5$, predices clase 1. Si $\hat{p} < 0.5$, clase 0. La **frontera de decisión** es el hiperplano donde $\hat{p} = 0.5$, es decir, $z = 0$.

<ConceptCard variant="definition">
**Log Loss (Entropía Cruzada):** La función de pérdida que optimiza la regresión logística. Penaliza fuertemente las predicciones incorrectas con alta confianza — si el modelo dice "99% seguro que es clase 1" y resulta ser clase 0, el castigo es enorme.

$$L = -\frac{1}{n}\sum_{i=1}^{n}[y_i\log(\hat{p}_i) + (1-y_i)\log(1-\hat{p}_i)]$$
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="La matriz de confusión: tu mejor amiga" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

{/* candidate-player: comparison-matriz-confusion */}
<ConceptCard variant="key-idea">
**Matriz de confusión**
- Real Positivo × Predicho Positivo → VP (Verdadero Positivo).
- Real Positivo × Predicho Negativo → FN (Falso Negativo).
- Real Negativo × Predicho Positivo → FP (Falso Positivo).
- Real Negativo × Predicho Negativo → VN (Verdadero Negativo).
</ConceptCard>

De la matriz salen todas las métricas:

<ConceptCard variant="definition">
**Exactitud (Accuracy):** $\frac{VP + VN}{\text{Total}}$ — ¿qué porcentaje acerté? No uses accuracy solo si las clases están desbalanceadas.

**Precisión (Precision):** $\frac{VP}{VP + FP}$ — de todo lo que dije que era positivo, ¿cuánto era realmente positivo?

**Recall (Sensibilidad):** $\frac{VP}{VP + FN}$ — de todos los positivos reales, ¿cuántos detecté?

**F1:** $2 \times \frac{P \times R}{P + R}$ — media armónica de precisión y recall. El equilibrio cuando ambas importan.
</ConceptCard>

{/* candidate-player: comparison-precision-vs-recall */}
<ConceptCard variant="key-idea">
**Precisión vs Recall: cuándo priorizar**
- Priorizas precisión cuando el costo del falso positivo es alto (notificación push molesta a quien no iba a abandonar).
- Priorizas recall cuando el costo del falso negativo es alto (no detectar un tumor maligno).
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Curva ROC: más allá de un solo número" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<ConceptCard variant="definition">
La **curva ROC** grafica TPR (Recall) vs FPR (1 − Especificidad) mientras varías el umbral de decisión de 0 a 1. Cada punto de la curva es un umbral diferente.

**AUC (Área Bajo la Curva):** Un solo número que resume la curva. AUC = 1.0 → clasificador perfecto. AUC = 0.5 → no mejor que tirar una moneda. AUC < 0.5 → estás haciendo todo al revés.
</ConceptCard>

<CalloutCheck>
La curva ROC es independiente del umbral — te dice qué tan bien separa el modelo las clases sin importar dónde pongas la línea. Es la métrica preferida para comparar modelos de clasificación.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={5} title="Visualiza la frontera de decisión" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression

np.random.seed(42)
X = np.random.randn(200, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = LogisticRegression()
model.fit(X, y)

xx, yy = np.meshgrid(np.linspace(-3, 3, 100), np.linspace(-3, 3, 100))
Z = model.predict_proba(np.c_[xx.ravel(), yy.ravel()])[:, 1]
Z = Z.reshape(xx.shape)

plt.figure(figsize=(8, 6))
plt.contourf(xx, yy, Z, alpha=0.3, levels=np.linspace(0, 1, 11), cmap='RdBu')
plt.contour(xx, yy, Z, levels=[0.5], colors='k', linewidths=2)
plt.scatter(X[:, 0], X[:, 1], c=y, cmap='RdBu', edgecolors='k', alpha=0.7)
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('Frontera de Decisión — Regresión Logística')
plt.colorbar(label='Probabilidad')
plt.show()
```

<CalloutInfo>
La línea negra es la frontera de decisión ($\hat{p} = 0.5$). A la izquierda, el modelo predice clase 0 (azul). A la derecha, clase 1 (rojo). Los colores degradados muestran la confianza: cuanto más intenso, más seguro está el modelo.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={6} title="Clasificación con datos reales: cáncer de mama" eyebrow="CÓDIGO">

<RevealSequence mode="appear">

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, classification_report,
                             roc_curve, auc, accuracy_score)

data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = LogisticRegression(max_iter=5000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print("Matriz de Confusión:")
print(confusion_matrix(y_test, y_pred))
print("\nReporte de Clasificación:")
print(classification_report(y_test, y_pred))

# ROC Curve
fpr, tpr, _ = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(6, 5))
plt.plot(fpr, tpr, label=f'ROC (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', label='Aleatorio')
plt.xlabel('Tasa de Falsos Positivos')
plt.ylabel('Tasa de Verdaderos Positivos (Recall)')
plt.title('Curva ROC — Cáncer de Mama')
plt.legend()
plt.show()
```

<ChoiceQuestion
  question="En detección de cáncer, ¿preferirías un modelo con alta precisión o alto recall? ¿Por qué?"
  moduleSlug="machine-learning"
  lessonSlug="lesson03_classification"
  blockId="reflection-l03-metrics-tradeoff"
  allowContinueOnIncorrect
  explanation="Alto recall: en diagnóstico médico, un falso negativo (cáncer no detectado) puede ser fatal. Se prefieren falsas alarmas descartables con más estudios. En recomendación de contenido, en cambio, conviene alta precisión."
  options={[
    { id: "a", label: "Alto recall, para no dejar sin detectar casos reales", correct: true, feedback: "¡Correcto! Los falsos negativos son los costosos en medicina." },
    { id: "b", label: "Alta precisión, para evitar falsas alarmas", correct: false, feedback: "Falso: optimizar precisión dispararía los falsos negativos." },
    { id: "c", label: "Da igual: ambas métricas siempre coinciden", correct: false, feedback: "Falso: precisión y recall suelen tensionarse en el umbral." },
    { id: "d", label: "Máxima accuracy global por encima de las otras", correct: false, feedback: "Falso: el contexto dictate qué error es más costoso." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={7} title="Biotecnología: respuesta a fármacos" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Una farmacéutica entrena un clasificador para predecir respuesta a inmunoterapia.",
    "Las features son niveles de 50 proteínas en sangre.",
    "La prioridad es alto recall: no dejar sin tratamiento a un respondedor.",
  ]}
/>

- **Features:** niveles de 50 proteínas en sangre
- **Etiqueta:** respondedor (1) o no respondedor (0)
- **Prioridad:** Alto recall — no quieres dejar a ningún paciente que podría beneficiarse sin tratamiento

<CalloutInfo>
En medicina personalizada, la clasificación permite evitar tratamientos costosos e invasivos en pacientes que no se beneficiarían. Un modelo con AUC > 0.85 se considera clínicamente útil.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={8} title="SaaS: predicción de abandono" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un clasificador predice qué usuarios cancelarán su suscripción.",
    "Las features son comportamientos de uso del producto.",
    "La prioridad es alta precisión: no molestar con descuentos a no abandonadores.",
  ]}
/>

- **Features:** días desde último login, tickets de soporte, uso de features premium, tipo de plan
- **Etiqueta:** abandonó (1) o se quedó (0)
- **Prioridad:** Alta precisión — no quieres molestar con descuentos a usuarios que no iban a abandonar

<ConceptCard variant="key-idea">
El mismo algoritmo, métricas distintas según el contexto. En salud priorizas recall (no dejar escapar ningún caso). En negocio priorizas precisión (no gastar recursos en falsas alarmas). El ML es la misma herramienta — la estrategia cambia según el problema.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={9} title="Errores comunes" eyebrow="PELIGROS">

<RevealSequence mode="appear">

<CalloutInfo>
1. **Usar accuracy con clases desbalanceadas.** Si el 95% de tus muestras son negativas, un modelo que siempre predice "negativo" tiene 95% de accuracy. Es un mal modelo, pero la métrica no te lo dice.

2. **Elegir el umbral 0.5 sin pensar.** El umbral óptimo depende del costo relativo de FP vs FN. En detección de fraude quizás quieres umbral 0.3 para ser más sensible.

3. **Interpretar coeficientes como en regresión lineal.** En regresión logística, un coeficiente $\beta$ significa que por cada unidad de aumento en $x$, los *log-odds* aumentan en $\beta$. No es un efecto directo sobre la probabilidad.

4. **Confiar en AUC sin ver la curva.** Dos curvas ROC pueden tener el mismo AUC pero comportarse muy distinto en diferentes regiones.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={10} title="Buenas prácticas" eyebrow="BUENAS PRÁCTICAS">

<RevealSequence mode="appear">

<CalloutCheck>
Siempre mira la matriz de confusión, no solo un número. Accuracy = 0.92 suena bien hasta que ves que todos los falsos negativos son casos de cáncer.

Elige tu métrica principal según el problema de negocio. No existe "la mejor métrica" — existe la métrica correcta para tu contexto.

Grafica la curva ROC y reporta AUC. Es independiente del umbral y del balance de clases.

Ajusta el umbral de decisión según el costo de cada tipo de error. No tiene por qué ser 0.5.

Con clases desbalanceadas, usa `class_weight='balanced'` en scikit-learn para que el modelo preste atención a la clase minoritaria.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={11} title="Resumen y glosario" eyebrow="RESUMEN">

<RevealSequence mode="appear">

<ConceptCard variant="key-idea">
La regresión logística convierte una combinación lineal en una probabilidad mediante la sigmoide. La matriz de confusión es la base de precisión, recall y F1. La curva ROC con AUC es la métrica estándar para comparar clasificadores. Elige tu métrica según el costo de equivocarte en cada dirección.
</ConceptCard>

{/* candidate-player: interactive-table-glosario-clasificacion */}
<ConceptCard variant="key-idea">
**Glosario**
- Sigmoide: función que comprime cualquier real a (0,1): σ(z) = 1/(1+e⁻ᶻ).
- VP (TP): positivo real clasificado como positivo.
- FP: negativo real clasificado como positivo — falsa alarma.
- FN: positivo real clasificado como negativo — omisión.
- Precisión: VP/(VP+FP) — pureza de las predicciones positivas.
- Recall: VP/(VP+FN) — cobertura de los positivos reales.
- F1: media armónica de precisión y recall: 2PR/(P+R).
- AUC: área bajo la curva ROC. 1 = perfecto, 0.5 = aleatorio.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={12} title="Ejercicios y desafío" eyebrow="EJERCICIOS">

<RevealSequence mode="appear">

<ChoiceQuestion
  question="Nivel 1 — Tienes 1000 emails: 950 son normales, 50 son spam. Un modelo que siempre dice 'no es spam' tiene 95% de accuracy. ¿Es buen modelo?"
  moduleSlug="machine-learning"
  lessonSlug="lesson03_classification"
  blockId="reflection-l03-accuracy-trap"
  allowContinueOnIncorrect
  explanation="No: 95% de accuracy pero 0% de recall para spam, no detecta ningún spam. En datasets desbalanceados la accuracy engaña; conviene mirar precisión y recall por clase, o promedio macro F1."
  options={[
    { id: "a", label: "No: 0% recall de spam hace inútil al modelo", correct: true, feedback: "¡Correcto! 95% accuracy engaña en datasets desbalanceados." },
    { id: "b", label: "Sí: 95% de accuracy ya es excelente", correct: false, feedback: "Falso: no detecta ningún spam, equivale a no tener filtro." },
    { id: "c", label: "Sí: la accuracy global alcanza para elegir modelo", correct: false, feedback: "Falso: con desbalance hay que mirar métricas por clase." },
    { id: "d", label: "Cualquier modelo supera a no tener filtro", correct: false, feedback: "Falso: este modelo es literalmente no tener filtro." },
  ]}
/>

<ConceptCard variant="key-idea">
**Desafío:** Implementa regresión logística con descenso por gradiente desde cero.
</ConceptCard>

<CodeEditor
  defaultValue={`import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def logistic_regression_from_scratch(X, y, lr=0.01, epochs=1000):
    X_b = np.c_[np.ones((X.shape[0], 1)), X]
    theta = np.zeros(X_b.shape[1])
    
    for _ in range(epochs):
        z = X_b @ theta
        h = sigmoid(z)
        gradient = X_b.T @ (h - y) / len(y)
        theta -= lr * gradient
    
    return theta[0], theta[1:]  # intercept, coefs

# Prueba con datos sintéticos
np.random.seed(42)
X = np.random.randn(200, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

intercept, coefs = logistic_regression_from_scratch(X, y, lr=0.1, epochs=500)
print(f"Intercept: {intercept:.4f}")
print(f"Coeficientes: {coefs}")

# Accuracy
X_b = np.c_[np.ones((X.shape[0], 1)), X]
preds = (sigmoid(X_b @ np.r_[intercept, coefs]) >= 0.5).astype(int)
print(f"Accuracy: {np.mean(preds == y):.3f}")`}
  height="350px"
/>

</RevealSequence>

</Section>
