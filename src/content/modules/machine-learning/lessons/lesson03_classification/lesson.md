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

<Section number={1} title="Predecir categorías, no números" eyebrow="INICIO">

<MascotMessage mood="excited">
¿Spam o no spam? ¿Cáncer o benigno? ¿Se va a dar de baja o se queda? La clasificación es el tipo de ML más usado en el mundo real. Hoy aprendés a separar el sí del no con matemática.
</MascotMessage>

La regresión lineal predice números. Pero muchos problemas del mundo real requieren predecir **categorías**. La clasificación binaria — dos clases posibles — es el punto de partida. Biotecnología: diagnóstico de enfermedades. SaaS: predicción de abandono. Finanzas: detección de fraude. Todo es clasificación.

<ConceptCard variant="key-idea">
La regresión logística toma una combinación lineal de features, la pasa por una función sigmoide, y produce una probabilidad entre 0 y 1. Con un umbral (típicamente 0.5), decidís la clase.
</ConceptCard>

</Section>

<Section number={2} title="La sigmoide: de números a probabilidades" eyebrow="CONCEPTO">

La regresión logística calcula primero una combinación lineal:

$$z = \beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p$$

Luego aplica la **función sigmoide** para convertir $z$ en una probabilidad:

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

<CalloutInfo>
La sigmoide tiene forma de S: comprime $(-\infty, +\infty)$ al rango $(0, 1)$. Valores grandes de $z$ → probabilidad cercana a 1. Valores muy negativos → probabilidad cercana a 0. En $z=0$, la probabilidad es exactamente 0.5.
</CalloutInfo>

**Regla de decisión:** si $\hat{p} \geq 0.5$, predecís clase 1. Si $\hat{p} < 0.5$, clase 0. La **frontera de decisión** es el hiperplano donde $\hat{p} = 0.5$, es decir, $z = 0$.

<ConceptCard variant="definition">
**Log Loss (Entropía Cruzada):** La función de pérdida que optimiza la regresión logística. Penaliza fuertemente las predicciones incorrectas con alta confianza — si el modelo dice "99% seguro que es clase 1" y resulta ser clase 0, el castigo es enorme.

$$L = -\frac{1}{n}\sum_{i=1}^{n}[y_i\log(\hat{p}_i) + (1-y_i)\log(1-\hat{p}_i)]$$
</ConceptCard>

</Section>

<Section number={3} title="La matriz de confusión: tu mejor amiga" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "", left: "Predicho Positivo", right: "Predicho Negativo" },
    { feature: "Real Positivo", left: "✅ VP (Verdadero Positivo)", right: "❌ FN (Falso Negativo)" },
    { feature: "Real Negativo", left: "❌ FP (Falso Positivo)", right: "✅ VN (Verdadero Negativo)" },
  ]}
/>

De la matriz salen todas las métricas:

<ConceptCard variant="definition">
**Exactitud (Accuracy):** $\frac{VP + VN}{\text{Total}}$ — ¿qué porcentaje acerté? 🚨 No uses accuracy solo si las clases están desbalanceadas.

**Precisión (Precision):** $\frac{VP}{VP + FP}$ — de todo lo que dije que era positivo, ¿cuánto era realmente positivo?

**Recall (Sensibilidad):** $\frac{VP}{VP + FN}$ — de todos los positivos reales, ¿cuántos detecté?

**F1:** $2 \times \frac{P \times R}{P + R}$ — media armónica de precisión y recall. El equilibrio cuando ambas importan.
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Priorizás Precisión cuando", left: "El costo de un falso positivo es alto. Ej: enviar una notificación push molesta a un usuario que no iba a abandonar." },
    { feature: "Priorizás Recall cuando", left: "El costo de un falso negativo es alto. Ej: no detectar un tumor maligno porque pensaste que era benigno." },
  ]}
/>

</Section>

<Section number={4} title="Curva ROC: más allá de un solo número" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
La **curva ROC** grafica TPR (Recall) vs FPR (1 − Especificidad) mientras variás el umbral de decisión de 0 a 1. Cada punto de la curva es un umbral diferente.

**AUC (Área Bajo la Curva):** Un solo número que resume la curva. AUC = 1.0 → clasificador perfecto. AUC = 0.5 → no mejor que tirar una moneda. AUC < 0.5 → estás haciendo todo al revés.
</ConceptCard>

<CalloutCheck>
La curva ROC es independiente del umbral — te dice qué tan bien separa el modelo las clases sin importar dónde pongas la línea. Es la métrica preferida para comparar modelos de clasificación.
</CalloutCheck>

</Section>

<Section number={5} title="Visualizá la frontera de decisión" eyebrow="INTERACTIVA">

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

</Section>

<Section number={6} title="Clasificación con datos reales: cáncer de mama" eyebrow="CÓDIGO">

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

<ReflectionCheck
  blockId="reflection-l03-metrics-tradeoff"
  moduleSlug="machine-learning"
  lessonSlug="lesson03_classification"
  prompt="En detección de cáncer, ¿preferirías un modelo con alta precisión o alto recall? ¿Por qué?"
  answer="Alto recall. En diagnóstico médico, un falso negativo (decir que no hay cáncer cuando sí lo hay) puede ser fatal. Prefiero detectar todos los casos posibles aunque algunos resulten ser falsas alarmas (falsos positivos) que se pueden descartar con más estudios. En cambio, en un sistema de recomendación de contenido, preferirías alta precisión para no recomendar cosas irrelevantes."
/>

</Section>

<Section number={7} title="Biotecnología: respuesta a fármacos" eyebrow="APLICACIÓN">

Una farmacéutica entrena un clasificador para predecir si un paciente responderá a una inmunoterapia basándose en 50 biomarcadores sanguíneos:

- **Features:** niveles de 50 proteínas en sangre
- **Etiqueta:** respondedor (1) o no respondedor (0)
- **Prioridad:** Alto recall — no querés dejar a ningún paciente que podría beneficiarse sin tratamiento

<CalloutInfo>
En medicina personalizada, la clasificación permite evitar tratamientos costosos e invasivos en pacientes que no se beneficiarían. Un modelo con AUC > 0.85 se considera clínicamente útil.
</CalloutInfo>

</Section>

<Section number={8} title="SaaS: predicción de abandono" eyebrow="APLICACIÓN">

Un clasificador predice qué usuarios cancelarán su suscripción:

- **Features:** días desde último login, tickets de soporte, uso de features premium, tipo de plan
- **Etiqueta:** abandonó (1) o se quedó (0)
- **Prioridad:** Alta precisión — no querés molestar con descuentos a usuarios que no iban a abandonar

<ConceptCard variant="key-idea">
El mismo algoritmo, métricas distintas según el contexto. En salud priorizás recall (no dejar escapar ningún caso). En negocio priorizás precisión (no gastar recursos en falsas alarmas). El ML es la misma herramienta — la estrategia cambia según el problema.
</ConceptCard>

</Section>

<Section number={9} title="Errores comunes" eyebrow="PELIGROS">

<CalloutInfo>
1. **Usar accuracy con clases desbalanceadas.** Si el 95% de tus muestras son negativas, un modelo que siempre predice "negativo" tiene 95% de accuracy. Es un mal modelo, pero la métrica no te lo dice.

2. **Elegir el umbral 0.5 sin pensar.** El umbral óptimo depende del costo relativo de FP vs FN. En detección de fraude quizás querés umbral 0.3 para ser más sensible.

3. **Interpretar coeficientes como en regresión lineal.** En regresión logística, un coeficiente $\beta$ significa que por cada unidad de aumento en $x$, los *log-odds* aumentan en $\beta$. No es un efecto directo sobre la probabilidad.

4. **Confiar en AUC sin ver la curva.** Dos curvas ROC pueden tener el mismo AUC pero comportarse muy distinto en diferentes regiones.
</CalloutInfo>

</Section>

<Section number={10} title="Buenas prácticas" eyebrow="BUENAS PRÁCTICAS">

<CalloutCheck>
Siempre mirá la matriz de confusión, no solo un número. Accuracy = 0.92 suena bien hasta que ves que todos los falsos negativos son casos de cáncer.

Elegí tu métrica principal según el problema de negocio. No existe "la mejor métrica" — existe la métrica correcta para tu contexto.

Graficá la curva ROC y reportá AUC. Es independiente del umbral y del balance de clases.

Ajustá el umbral de decisión según el costo de cada tipo de error. No tiene por qué ser 0.5.

Con clases desbalanceadas, usá `class_weight='balanced'` en scikit-learn para que el modelo preste atención a la clase minoritaria.
</CalloutCheck>

</Section>

<Section number={11} title="Resumen y glosario" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
La regresión logística convierte una combinación lineal en una probabilidad mediante la sigmoide. La matriz de confusión es la base de precisión, recall y F1. La curva ROC con AUC es la métrica estándar para comparar clasificadores. Elegí tu métrica según el costo de equivocarte en cada dirección.
</ConceptCard>

<InteractiveTable
  columns={[
    { key: "term", label: "Término" },
    { key: "def", label: "Definición" },
  ]}
  rows={[
    { term: "Sigmoide", def: "Función que comprime cualquier real a (0,1): σ(z) = 1/(1+e⁻ᶻ)" },
    { term: "VP (TP)", def: "Positivo real clasificado como positivo" },
    { term: "FP", def: "Negativo real clasificado como positivo — falsa alarma" },
    { term: "FN", def: "Positivo real clasificado como negativo — omisión" },
    { term: "Precisión", def: "VP/(VP+FP) — pureza de las predicciones positivas" },
    { term: "Recall", def: "VP/(VP+FN) — cobertura de los positivos reales" },
    { term: "F1", def: "Media armónica de precisión y recall: 2PR/(P+R)" },
    { term: "AUC", def: "Área bajo la curva ROC. 1 = perfecto, 0.5 = aleatorio" },
  ]}
/>

</Section>

<Section number={12} title="Ejercicios y desafío" eyebrow="EJERCICIOS">

<ReflectionCheck
  blockId="reflection-l03-accuracy-trap"
  moduleSlug="machine-learning"
  lessonSlug="lesson03_classification"
  prompt="Nivel 1 — Tenés 1000 emails: 950 son normales, 50 son spam. Un modelo que siempre dice 'no es spam' tiene 95% de accuracy. ¿Es buen modelo?"
  answer="No. Tiene 95% de accuracy pero 0% de recall para spam — no detecta ningún spam. En datasets desbalanceados, accuracy es engañosa. Necesitás mirar precisión y recall por clase. Este modelo es inútil: es equivalente a no tener filtro de spam."
/>

<ConceptCard variant="key-idea">
**Desafío:** Escribí `logistic_regression_from_scratch(X, y, lr=0.01, epochs=1000)` que implemente regresión logística con descenso por gradiente. Usá la sigmoide y la log loss. Compará tus predicciones con `sklearn.linear_model.LogisticRegression`.
</ConceptCard>

</Section>
