# Lab: Pipeline completo de clasificación con Breast Cancer Wisconsin

## Objetivo

Construir un pipeline completo de machine learning para clasificar biopsias de mama en benignas o malignas usando el dataset Breast Cancer Wisconsin. Vas a entrenar dos modelos, comparar sus métricas y justificar cuál elegirías en un contexto de diagnóstico médico.

## Duración

75 minutos (60-90 min según tu ritmo)

## Dataset

Usamos el dataset **Breast Cancer Wisconsin** de scikit-learn. Contiene 569 casos reales con 30 features numéricas y una etiqueta binaria (maligno o benigno).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42, stratify=data.target
)
```

## Instrucciones

### Parte 1: Cargar datos y entrenar un clasificador KNN (15 min)

Cargá el dataset, separá en entrenamiento y prueba, y entrená un KNN con `k=5`. Predice sobre el conjunto de prueba.

```python
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42, stratify=data.target
)

# Escala las features para que KNN no se sesgue por magnitudes
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_s, y_train)
y_pred_knn = knn.predict(X_test_s)

print(f"Train size: {X_train_s.shape}")
print(f"Test size: {X_test_s.shape}")
print(f"KNN accuracy: {knn.score(X_test_s, y_test):.3f}")
```

**Preguntas para reflexionar:**
- ¿Por qué escalamos los datos antes de usar KNN?
- ¿Qué significa `stratify` en `train_test_split`?

### Parte 2: Calcular la matriz de confusión y métricas derivadas (15 min)

A partir de las predicciones de KNN, calculá la matriz de confusión y las métricas: accuracy, precision, recall y F1.

```python
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score

labels = data.target_names
cm = confusion_matrix(y_test, y_pred_knn)
print("Confusion matrix (KNN):")
print(cm)

acc = accuracy_score(y_test, y_pred_knn)
pre = precision_score(y_test, y_pred_knn)
rec = recall_score(y_test, y_pred_knn)
f1 = f1_score(y_test, y_pred_knn)

print(f"\nAccuracy:  {acc:.3f}")
print(f"Precision: {pre:.3f}")
print(f"Recall:    {rec:.3f}")
print(f"F1-score:  {f1:.3f}")

# Interpretación por clase
print("\nMétricas por clase:")
print(f"  Maligno (0): TP={cm[0,0]}, FN={cm[0,1]}")
print(f"  Benigno (1): TN={cm[1,1]}, FP={cm[1,0]}")
```

**Preguntas para reflexionar:**
- ¿Qué representa un falso negativo en este problema? ¿Por qué es peligroso?
- ¿Cuál es más importante en este contexto: precision o recall?

### Parte 3: Comparar KNN con LogisticRegression en el mismo dataset (15 min)

Entrená una regresión logística y compará sus predicciones con las de KNN. Recordá escalar los datos también para este modelo.

```python
from sklearn.linear_model import LogisticRegression

logreg = LogisticRegression(max_iter=1000, random_state=42)
logreg.fit(X_train_s, y_train)
y_pred_lr = logreg.predict(X_test_s)

print(f"Logistic Regression accuracy: {logreg.score(X_test_s, y_test):.3f}")

print("\nConfusion matrix (Logistic Regression):")
print(confusion_matrix(y_test, y_pred_lr))
```

**Preguntas para reflexionar:**
- ¿Qué diferencia hay en la interpretación de LogisticRegression vs KNN?
- ¿LogisticRegression requiere escalado de features? ¿Por qué?

### Parte 4: Tabla comparativa de métricas (15 min)

Creá una tabla que compare accuracy, precision, recall y F1 para ambos modelos.

```python
import pandas as pd

metrics = {
    "Metric": ["Accuracy", "Precision", "Recall", "F1-score"],
    "KNN": [
        accuracy_score(y_test, y_pred_knn),
        precision_score(y_test, y_pred_knn),
        recall_score(y_test, y_pred_knn),
        f1_score(y_test, y_pred_knn),
    ],
    "LogisticRegression": [
        accuracy_score(y_test, y_pred_lr),
        precision_score(y_test, y_pred_lr),
        recall_score(y_test, y_pred_lr),
        f1_score(y_test, y_pred_lr),
    ],
}

df_metrics = pd.DataFrame(metrics)
df_metrics["KNN"] = df_metrics["KNN"].round(3)
df_metrics["LogisticRegression"] = df_metrics["LogisticRegression"].round(3)
print(df_metrics)

# Visualización comparativa
fig, ax = plt.subplots(figsize=(8, 5))
x = np.arange(len(df_metrics))
width = 0.35

ax.bar(x - width/2, df_metrics["KNN"], width, label="KNN", color="#3498db")
ax.bar(x + width/2, df_metrics["LogisticRegression"], width, label="LogisticRegression", color="#2ecc71")

ax.set_ylabel("Score")
ax.set_title("Comparación de métricas: KNN vs LogisticRegression")
ax.set_xticks(x)
ax.set_xticklabels(df_metrics["Metric"], rotation=15)
ax.legend()
ax.set_ylim(0, 1.05)

plt.tight_layout()
plt.savefig("metrics_comparison.png", dpi=100, bbox_inches="tight")
plt.show()
```

**Preguntas para reflexionar:**
- ¿Qué modelo tiene mejor F1-score?
- ¿Hay una métrica donde la diferencia entre modelos sea más grande?
- ¿Qué modelo elegirías para un screening de cáncer de mama?

### Parte 5: Resumen del pipeline y justificación de selección de modelo (15 min)

Escribí un resumen ejecutivo del pipeline completo y justificá tu elección de modelo final.

```python
# Elegí el modelo con mejor recall (minimizar falsos negativos)
from sklearn.metrics import recall_score

recall_knn = recall_score(y_test, y_pred_knn)
recall_lr = recall_score(y_test, y_pred_lr)

selected = "KNN" if recall_knn > recall_lr else "LogisticRegression"
print(f"Mejor recall: {max(recall_knn, recall_lr):.3f} ({selected})")

print("\n--- RESUMEN DEL PIPELINE ---")
print(f"1. Dataset: Breast Cancer Wisconsin ({data.data.shape[0]} muestras, {data.data.shape[1]} features)")
print("2. Preprocesamiento: StandardScaler para igualar escalas")
print("3. Modelos evaluados: KNN (k=5) y LogisticRegression")
print(f"4. Selección: {selected} basado en mejor recall")
print("5. Métricas reportadas: accuracy, precision, recall, F1-score")
print("6. Validación: train_test_split estratificado con 20% de prueba")
```

**Preguntas para reflexionar:**
- ¿Qué pasos del pipeline son reutilizables para otros datasets?
- ¿Por qué usamos una métrica específica (recall) en lugar de quedarnos solo con accuracy?
- ¿Qué harías si el modelo seleccionado tuviera muchos falsos positivos?

## Entregables

Entregá un notebook Jupyter (`.ipynb`) o script Python (`.py`) que contenga:
- Todo el código con comentarios en inglés
- Respuestas a las preguntas de reflexión de cada parte
- La tabla comparativa de métricas
- La gráfica de comparación (archivo PNG)
- Un resumen final que justifique la selección del modelo

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Carga y división correcta del dataset | 2 |
| Entrenamiento de KNN y cálculo de métricas | 3 |
| Comparación con LogisticRegression | 2 |
| Tabla comparativa de métricas y visualización | 2 |
| Resumen del pipeline y justificación de modelo | 1 |

**Total: 10 puntos**
