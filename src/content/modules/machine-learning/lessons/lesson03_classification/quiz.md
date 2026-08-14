# Quiz: Clasificación

## Opción múltiple (5 preguntas)

**Q1.** ¿Qué hace la función sigmoide en la regresión logística?

a) Transforma las features para que se distribuyan normalmente
b) Mapea cualquier valor real a una probabilidad entre 0 y 1
c) Selecciona las features más importantes
d) Calcula el error cuadrático medio

<details><summary>Respuesta</summary>b) Mapea cualquier valor real a una probabilidad entre 0 y 1</details>

**Q2.** Un modelo predice 100 muestras como positivas. De estas, 80 son realmente positivas. De los 900 negativos reales, 20 fueron predichos como positivos. ¿Cuál es la precisión?

a) 80/100 = 0.80
b) 80/900 = 0.089
c) 80/(80+20) = 0.80
d) 80/(80+900) = 0.082

<details><summary>Respuesta</summary>c) 80/(80+20) = 0.80. Precisión = TP / (TP + FP) = 80 / (80 + 20)</details>

**Q3.** ¿En qué escenario es más importante la sensibilidad (recall) que la precisión?

a) Detección de spam (marcar un correo normal como spam es malo)
b) Detección de cáncer (perderse un caso de cáncer es mortal)
c) Recomendación de productos (mostrar productos irrelevantes perjudica la experiencia de usuario)
d) Detección de fraude con tarjetas (los falsos positivos bloquean compras legítimas)

<details><summary>Respuesta</summary>b) Detección de cáncer — los falsos negativos (perderse un caso de cáncer) tienen un costo mucho mayor que los falsos positivos</details>

**Q4.** ¿Qué significa un AUC de 0.50?

a) El modelo hace predicciones perfectas
b) El modelo no es mejor que adivinar al azar
c) Todas las predicciones son correctas
d) El modelo siempre predice la clase mayoritaria

<details><summary>Respuesta</summary>b) El modelo no es mejor que adivinar al azar</details>

**Q5.** El puntaje F1 es:

a) La media aritmética de la precisión y la sensibilidad
b) La media armónica de la precisión y la sensibilidad
c) La media geométrica de la precisión y la sensibilidad
d) La suma de la precisión y la sensibilidad

<details><summary>Respuesta</summary>b) La media armónica de la precisión y la sensibilidad</details>

## Respuesta corta (2 preguntas)

**Q6.** Explicá por qué la exactitud es una métrica pobre para problemas de clasificación desbalanceados. Dá un ejemplo concreto.

<details><summary>Respuesta</summary>La exactitud es engañosa cuando las clases están desbalanceadas porque un modelo que siempre predice la clase mayoritaria logra una exactitud alta sin aprender nada. Ejemplo: detección de cáncer con 1% de prevalencia — un modelo que siempre predice "sin cáncer" logra 99% de exactitud pero se pierde todos los casos de cáncer. La precisión, la sensibilidad y el F1 ofrecen una evaluación más honesta.</details>

**Q7.** Un modelo de regresión logística da coeficientes: β₁ = 2.5 (feature A), β₂ = -0.8 (feature B). ¿Cómo interpretás estos valores?

<details><summary>Respuesta</summary>Los coeficientes están en unidades de log-odds. Un aumento de una unidad en la feature A multiplica las probabilidades (odds) de ser positivo por exp(2.5) ≈ 12.2 (efecto positivo fuerte). Un aumento de una unidad en la feature B multiplica las probabilidades por exp(-0.8) ≈ 0.45 (efecto negativo). Como están en log-odds, no en probabilidad, la magnitud no es directamente interpretable como un cambio en la probabilidad.</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribí una función en Python `plot_precision_recall_vs_threshold(model, X_val, y_val)` que grafique las curvas de precisión y sensibilidad en función del umbral de decisión (0.0 a 1.0). El gráfico debe mostrar ambas curvas en los mismos ejes con una leyenda.

<details><summary>Respuesta</summary>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import precision_score, recall_score

def plot_precision_recall_vs_threshold(model, X_val, y_val):
    y_proba = model.predict_proba(X_val)[:, 1]
    thresholds = np.linspace(0, 1, 101)

    precisions, recalls = [], []
    for t in thresholds:
        y_pred = (y_proba >= t).astype(int)
        precisions.append(precision_score(y_val, y_pred, zero_division=0))
        recalls.append(recall_score(y_val, y_pred))

    plt.figure(figsize=(8, 5))
    plt.plot(thresholds, precisions, 'b-', label='Precision')
    plt.plot(thresholds, recalls, 'r-', label='Recall')
    plt.xlabel('Threshold')
    plt.ylabel('Score')
    plt.title('Precision and Recall vs. Threshold')
    plt.legend()
    plt.grid(True)
    plt.show()

from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
data = load_breast_cancer()
X_tr, X_te, y_tr, y_te = train_test_split(data.data, data.target, test_size=0.2, random_state=42)
model = LogisticRegression(max_iter=5000).fit(X_tr, y_tr)
plot_precision_recall_vs_threshold(model, X_te, y_te)
```
</details>
