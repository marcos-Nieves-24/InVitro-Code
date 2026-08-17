```python
# =========================================================================
# LAB 2: Como aprende la IA - entrenamiento, validacion y generalizacion
# -------------------------------------------------------------------------
# Aplicamos la division train/test y medimos si un modelo generaliza o
# memoriza comparando el accuracy de entrenamiento con el de prueba.
# =========================================================================

# PASO 1: Cargar los datasets Iris y Breast Cancer Wisconsin.
# Iris clasifica 150 flores en 3 especies y BCW clasifica biopsias en
# maligno/benigno. Visualizamos Iris con un scatter por especie.
import numpy as np
import pandas as pd
import plotly.express as px
from sklearn.datasets import load_iris, load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

iris = load_iris()
bcw = load_breast_cancer()

print(f"Iris: {iris.data.shape[0]} muestras, {iris.data.shape[1]} features")
print(f"BCW:  {bcw.data.shape[0]} muestras, {bcw.data.shape[1]} features")

df_iris = pd.DataFrame(iris.data, columns=iris.feature_names)
df_iris["species"] = iris.target_names[iris.target]

fig = px.scatter(df_iris, x="sepal length (cm)", y="petal length (cm)",
                 color="species",
                 title="Dataset Iris: especies por sepalo y petalo",
                 labels={"sepal length (cm)": "Largo sepalo (cm)",
                         "petal length (cm)": "Largo petalo (cm)"})
fig.show()

# PASO 2: Division en entrenamiento y prueba (estratificada).
# El modelo solo ve datos de train; el accuracy en test mide si
# generaliza a datos que nunca vio durante el entrenamiento.
X_tr, X_te, y_tr, y_te = train_test_split(
    iris.data, iris.target, test_size=0.3, random_state=42, stratify=iris.target)
print(f"\nIris -> Train: {X_tr.shape[0]}, Test: {X_te.shape[0]}")

Xb_tr, Xb_te, yb_tr, yb_te = train_test_split(
    bcw.data, bcw.target, test_size=0.3, random_state=42, stratify=bcw.target)
print(f"BCW  -> Train: {Xb_tr.shape[0]}, Test: {Xb_te.shape[0]}")

# PASO 3: Bucle de entrenamiento y evaluacion con LogisticRegression.
# Entrenamos el mismo modelo sobre ambos datasets y comparamos el accuracy
# de entrenamiento con el de prueba para detectar sobreajuste.
results = []
for nombre, Xtr, Xte, ytr, yte in [
        ("Iris", X_tr, X_te, y_tr, y_te),
        ("BCW", Xb_tr, Xb_te, yb_tr, yb_te)]:
    model = LogisticRegression(max_iter=2000, random_state=42)
    model.fit(Xtr, ytr)
    train_acc = accuracy_score(ytr, model.predict(Xtr))
    test_acc = accuracy_score(yte, model.predict(Xte))
    results.append({"dataset": nombre, "train_acc": train_acc,
                    "test_acc": test_acc})
    print(f"\n{nombre}: train_acc={train_acc:.3f}, test_acc={test_acc:.3f}")

# PASO 4: Comparar el accuracy en un grafico de barras.
# Una brecha pequena entre train y test indica buena generalizacion.
print("\nResumen de accuracies por dataset y conjunto.")
df_res = pd.DataFrame(results)
fig = px.bar(df_res, x="dataset", y=["train_acc", "test_acc"],
             barmode="group",
             title="Accuracy de entrenamiento vs prueba por dataset",
             labels={"dataset": "Dataset", "value": "Accuracy",
                     "variable": "Conjunto"})
fig.show()

# PASO 5: Resumen del laboratorio.
print("\n--- RESUMEN ---")
print("El modelo se entrena solo con datos de train.")
print("La brecha train-test pequena indica buena generalizacion.")
print("Una brecha grande indica sobreajuste (memorizar, no aprender).")
```