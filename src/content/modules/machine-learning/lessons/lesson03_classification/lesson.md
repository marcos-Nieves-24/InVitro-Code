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

## Motivación

¿Este correo es spam o no? ¿Este paciente tiene cáncer? ¿Este cliente se va a dar de baja? Estos son problemas de *clasificación* — predecir una categoría discreta. La clasificación es el tipo de aplicación de ML más común tanto en biotecnología (diagnóstico de enfermedades, respuesta a fármacos) como en SaaS (predicción de abandono, puntuación de leads).

## Panorama general

**Anterior:** La regresión lineal predecía números continuos. **Esta lección:** La regresión logística predice categorías. **Siguiente:** Árboles de decisión — un enfoque no lineal para la clasificación.

## Teoría

### Clasificación Binaria

El objetivo $y$ toma dos valores: 0 (clase negativa) o 1 (clase positiva).

### Regresión Logística

A pesar del nombre, la regresión logística es un algoritmo de *clasificación*. En lugar de predecir un valor continuo, predice la *probabilidad* de que una muestra pertenezca a la clase positiva.

**Parte lineal:** $z = \beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p$

**Función logística (sigmoide):** $\sigma(z) = \frac{1}{1 + e^{-z}}$

La sigmoide comprime cualquier número real a [0, 1], dando una probabilidad válida:

$$\hat{p} = P(y=1 | \mathbf{x}) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p)}}$$

**Regla de decisión:** Predecir $y=1$ si $\hat{p} \geq 0.5$, sino $y=0$.

### Frontera de decisión

La línea (o hiperplano) donde $\hat{p} = 0.5$, es decir, $z = 0$.

### Función de pérdida: Log Loss (Entropía Cruzada)

$$L = -\frac{1}{n}\sum_{i=1}^{n}[y_i\log(\hat{p}_i) + (1-y_i)\log(1-\hat{p}_i)]$$

A diferencia del MSE en regresión lineal, la log loss penaliza fuertemente las predicciones incorrectas con alta confianza.

## Fundamento matemático

### Log-Odds

La transformación log-odds (logit):

$$\log\left(\frac{p}{1-p}\right) = \beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p$$

Esto muestra que la regresión logística es lineal en el espacio de *log-odds*.

### Matriz de confusión

| | Predicho Positivo | Predicho Negativo |
|-|-------------------|-------------------|
| **Real Positivo** | Verdadero Positivo (VP) | Falso Negativo (FN) |
| **Real Negativo** | Falso Positivo (FP) | Verdadero Negativo (VN) |

### Métricas derivadas

**Exactitud:** $\frac{VP + VN}{VP + VN + FP + FN}$

**Precisión:** $\frac{VP}{VP + FP}$ — "Cuando predecimos positivo, ¿qué tan seguido acertamos?"

**Recall (Sensibilidad):** $\frac{VP}{VP + FN}$ — "¿Qué fracción de positivos reales capturamos?"

**Puntaje F1:** $2 \times \frac{\text{Precisión} \times \text{Recall}}{\text{Precisión} + \text{Recall}}$ — Media armónica de precisión y recall.

**Especificidad:** $\frac{VN}{VN + FP}$ — "¿Qué fracción de negativos reales rechazamos correctamente?"

### Curva ROC y AUC

La curva ROC (Receiver Operating Characteristic) grafica TPR (recall) vs. FPR (1 - especificidad) a medida que varía el umbral.

**AUC (Área Bajo la Curva):** Probabilidad de que un positivo elegido al azar tenga un rango más alto que un negativo elegido al azar. AUC = 1 es perfecto, AUC = 0.5 es aleatorio.

## Explicación visual

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression

np.random.seed(42)
X = np.random.randn(200, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = LogisticRegression()
model.fit(X, y)

# Decision boundary
xx, yy = np.meshgrid(np.linspace(-3, 3, 100), np.linspace(-3, 3, 100))
Z = model.predict_proba(np.c_[xx.ravel(), yy.ravel()])[:, 1]
Z = Z.reshape(xx.shape)

plt.figure(figsize=(8, 6))
plt.contourf(xx, yy, Z, alpha=0.3, levels=np.linspace(0, 1, 11), cmap='RdBu')
plt.contour(xx, yy, Z, levels=[0.5], colors='k', linewidths=2)
plt.scatter(X[:, 0], X[:, 1], c=y, cmap='RdBu', edgecolors='k', alpha=0.7)
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('Logistic Regression Decision Boundary')
plt.colorbar(label='Probability')
plt.savefig('figures/decision_boundary.png', dpi=150)
plt.show()
```

## Implementación en Python

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
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=5000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")

# ROC Curve
fpr, tpr, _ = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(6, 5))
plt.plot(fpr, tpr, label=f'ROC (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate (Recall)')
plt.title('ROC Curve')
plt.legend()
plt.savefig('figures/roc_curve.png', dpi=150)
plt.show()
```

## Ejemplo guiado: Detección de cáncer de mama

**Problema:** Clasificar tumores de mama como malignos (1) o benignos (0).

**Conjunto de datos:** Wisconsin Breast Cancer (569 muestras, 30 características).

**Resultados:**
- Exactitud: ~97%
- Precisión: ~0.98 (cuando predecimos maligno, acertamos el 98% de las veces)
- Recall: ~0.96 (capturamos el 96% de las malignidades reales)
- AUC: ~0.99 (discriminación excelente)

## Ejemplo en biotecnología: Predicción de respuesta a fármacos

Una empresa farmacéutica evalúa si un fármaco es efectivo (respondedor = 1) basándose en biomarcadores del paciente.

```python
np.random.seed(42)
n_patients = 500

clinic_data = pd.DataFrame({
    'age': np.random.normal(55, 15, n_patients),
    'biomarker_A': np.random.normal(0, 1, n_patients),
    'biomarker_B': np.random.normal(0, 1, n_patients),
    'gene_X_expression': np.random.exponential(1, n_patients),
})

log_odds = (
    -2
    + 0.5 * clinic_data['biomarker_A']
    - 0.3 * clinic_data['biomarker_B']
    + 1.5 * clinic_data['gene_X_expression']
)
clinic_data['responder'] = (1 / (1 + np.exp(-log_odds)) > 0.5).astype(int)

X_c = clinic_data.drop('responder', axis=1)
y_c = clinic_data['responder']
X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_c, y_c, test_size=0.3)

model_c = LogisticRegression()
model_c.fit(X_train_c, y_train_c)

print(classification_report(y_test_c, model_c.predict(X_test_c)))
```

**Interpretación:** La expresión del gen X es el predictor más fuerte de respuesta al fármaco.

## Ejemplo en SaaS: Predicción de abandono

```python
np.random.seed(42)
n_users = 1000

saas_data = pd.DataFrame({
    'days_since_login': np.random.exponential(20, n_users),
    'support_tickets': np.random.poisson(2, n_users),
    'feature_usage_pct': np.random.uniform(0, 100, n_users),
    'account_age_months': np.random.exponential(12, n_users),
})

log_odds = (
    -1
    + 0.08 * saas_data['days_since_login']
    + 0.5 * saas_data['support_tickets']
    - 0.03 * saas_data['feature_usage_pct']
)
saas_data['churned'] = (1 / (1 + np.exp(-log_odds)) > 0.5).astype(int)

X_s = saas_data.drop('churned', axis=1)
y_s = saas_data['churned']

model_s = LogisticRegression(max_iter=1000)
model_s.fit(X_s, y_s)

for col, coef in zip(X_s.columns, model_s.coef_[0]):
    print(f"{col}: {coef:.4f}")

print(f"\nAUC: {roc_auc_score(y_s, model_s.predict_proba(X_s)[:, 1]):.3f}")
```

## Errores comunes

1. **Usar exactitud con datos desbalanceados** — si el 95% de las muestras son negativas, un modelo que predice "negativo" siempre obtiene 95% de exactitud pero es inútil.
2. **Fijar el umbral en 0.5 por defecto** — ajustalo según las necesidades del negocio (umbral más alto si los falsos positivos son costosos).
3. **Confundir precisión y recall** — precisión = exactitud de las predicciones positivas; recall = fracción de positivos encontrados.
4. **Interpretar coeficientes directamente** — los coeficientes están en unidades de log-odds, no en unidades de probabilidad.

## Buenas prácticas

- Revisá siempre el balance de clases antes de elegir métricas
- Usá AUC para comparar modelos, precisión/recall para decisiones de negocio
- Considerá matrices de costo: los falsos positivos y falsos negativos tienen costos diferentes
- Escalá las características para la regresión logística (usa descenso por gradiente)
- Usá división train/test estratificada para preservar las proporciones de clases

## Resumen

- La regresión logística predice probabilidades de clase mediante la función sigmoide
- La frontera de decisión separa las clases en el espacio de características
- La matriz de confusión resume los resultados de predicción
- Precisión, recall, F1 proveen una evaluación matizada
- El AUC de la curva ROC mide la calidad del ranking a través de umbrales
- La selección del umbral depende del contexto de negocio

## Términos clave

| Término | Definición |
|---------|------------|
| Sigmoide | Función en forma de S que comprime valores a [0, 1] |
| Frontera de decisión | Umbral donde la probabilidad = 0.5 |
| Matriz de confusión | Tabla de VP, FP, VN, FN |
| Precisión | VP / (VP + FP) |
| Recall (Sensibilidad) | VP / (VP + FN) |
| Puntaje F1 | Media armónica de precisión y recall |
| Curva ROC | TPR vs. FPR a varios umbrales |
| AUC | Área bajo la curva ROC, mide calidad del ranking |

## Ejercicios

**Nivel 1 — Básico:** Si un filtro de spam tiene precisión = 0.95 y recall = 0.60, ¿qué significa cada número? ¿Cuál es más importante para un filtro de spam?

**Nivel 2 — Implementación:** Cargá el dataset `breast_cancer`, entrená un modelo de regresión logística y graficá la curva ROC con el AUC mostrado en el gráfico.

**Nivel 3 — Pensamiento crítico:** Una prueba médica para una enfermedad rara (1% de prevalencia) alcanza un 99% de exactitud. ¿Es una buena prueba? Explicá por qué la exactitud es engañosa aquí.

## Desafío de programación

Escribí una función `find_optimal_threshold(model, X_val, y_val)` que encuentre el umbral de decisión (0.0 a 1.0) que maximice el puntaje F1 en datos de validación. Usá 100 umbrales espaciados uniformemente.
