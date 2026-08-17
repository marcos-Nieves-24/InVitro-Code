```python
# =========================================================================
# LAB 4: Casos reales - pipeline de clasificacion en diagnostico medico
# -------------------------------------------------------------------------
# Comparamos dos modelos (regresion logistica y bosque aleatorio) sobre el
# dataset Breast Cancer Wisconsin y elegimos el mejor para el contexto.
# =========================================================================

# PASO 1: Cargar el dataset y dividir en train/test estratificado.
import numpy as np
import pandas as pd
import plotly.express as px
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, confusion_matrix,
                             classification_report,
                             precision_score, recall_score, f1_score)

data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)
print(f"Dataset: {X.shape[0]} muestras, {X.shape[1]} features")
print(f"Train: {X_train.shape[0]} | Test: {X_test.shape[0]}")

# PASO 2: Entrenar ambos modelos sobre los mismos datos.
# LogisticRegression es interpretable; RandomForest captura relaciones
# no lineales. Entrenamos ambos y guardamos las predicciones.
lr = LogisticRegression(max_iter=1000, random_state=42)
lr.fit(X_train, y_train)
y_pred_lr = lr.predict(X_test)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
y_pred_rf = rf.predict(X_test)

print(f"\nLogisticRegression train_acc: {accuracy_score(y_train, lr.predict(X_train)):.3f}")
print(f"RandomForest train_acc:       {accuracy_score(y_train, rf.predict(X_train)):.3f}")

# PASO 3: Metricas de evaluacion para cada modelo.
# La matriz de confusion muestra los errores; el reporte resume precision,
# recall y f1 por clase. En diagnostico, el recall evita falsos negativos.
print("\n--- LogisticRegression ---")
print(confusion_matrix(y_test, y_pred_lr))
print(classification_report(y_test, y_pred_lr, target_names=data.target_names))

print("\n--- RandomForest ---")
print(confusion_matrix(y_test, y_pred_rf))
print(classification_report(y_test, y_pred_rf, target_names=data.target_names))

# PASO 4: Comparar metricas en un grafico de barras.
# Construimos una tabla con accuracy, precision, recall y f1 por modelo.
rows = []
for nombre, y_pred in [("LogisticRegression", y_pred_lr),
                       ("RandomForest", y_pred_rf)]:
    for metrica, valor in zip(
            ["accuracy", "precision", "recall", "f1"],
            [accuracy_score(y_test, y_pred),
             precision_score(y_test, y_pred),
             recall_score(y_test, y_pred),
             f1_score(y_test, y_pred)]):
        rows.append({"modelo": nombre, "metrica": metrica,
                     "valor": round(valor, 3)})

df_metrics = pd.DataFrame(rows)
print("\nTabla de metricas:")
print(df_metrics.pivot(index="metrica", columns="modelo",
                       values="valor").to_string())

fig = px.bar(df_metrics, x="metrica", y="valor", color="modelo",
             barmode="group",
             title="Comparacion: LogisticRegression vs RandomForest",
             labels={"metrica": "Metrica", "valor": "Valor",
                     "modelo": "Modelo"})
fig.show()

# PASO 5: Seleccion del modelo y resumen final.
# En un screening de cancer priorizamos el recall (menos falsos negativos).
best = max([("LogisticRegression", lr.score(X_test, y_test)),
            ("RandomForest", rf.score(X_test, y_test))], key=lambda t: t[1])
print("\n--- RESUMEN ---")
print(f"Mejor accuracy en test: {best[0]} ({best[1]:.3f})")
print("En diagnostico conviene revisar recall y matriz de confusion.")
print("El pipeline completo es reutilizable para otros datasets.")
```