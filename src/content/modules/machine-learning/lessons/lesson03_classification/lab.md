```python
# =========================================================================
# LAB 3: Clasificacion con regresion logistica
# -------------------------------------------------------------------------
# Entrenamos una regresion logistica sobre datos sinteticos y sobre
# breast_cancer, visualizamos el limite de decision, evaluamos con matriz
# de confusion, curva ROC/AUC, exploramos umbrales de clasificacion y
# cerramos con datos desbalanceados. Cada figura termina con fig.show().
# =========================================================================

# PASO 1: Datos sinteticos de dos features.
# Con n_redundant=0 ambas features aportan informacion para separar clases.
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from sklearn.datasets import make_classification, load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, confusion_matrix,
                             classification_report, precision_score,
                             recall_score, f1_score, roc_curve, auc)

X, y = make_classification(n_samples=300, n_features=2, n_redundant=0,
                           class_sep=1.0, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42)

modelo = LogisticRegression(max_iter=1000)
modelo.fit(X_train, y_train)
print("PASO 1 - Regresion logistica entrenada")
print(f"Coeficientes: {modelo.coef_[0]} | Intercepto: {modelo.intercept_[0]:.2f}")

# PASO 2: Limite de decision sobre una cuadricula.
# Predecimos sobre un grid denso y coloreamos cada punto segun su clase.
x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 80),
                     np.linspace(y_min, y_max, 80))
Z = modelo.predict(np.c_[xx.ravel(), yy.ravel()])

fig = go.Figure()
fig.add_trace(go.Scatter(x=xx.ravel(), y=yy.ravel(), mode="markers",
                         marker=dict(color=Z, opacity=0.2, size=5),
                         name="Prediccion del grid"))
fig.add_trace(go.Scatter(x=X[:, 0], y=X[:, 1], mode="markers",
                         marker=dict(color=y, colorscale="Viridis", size=8),
                         name="Datos reales"))
fig.update_layout(title="Limite de decision",
                  xaxis_title="Feature 1", yaxis_title="Feature 2")
fig.show()
print("PASO 2 - El limite de decision separa visualmente las dos clases.")

# PASO 3: Exactitud y matriz de confusion en el conjunto de prueba.
y_pred = modelo.predict(X_test)
print("PASO 3 - Metricas en prueba")
print(f"Exactitud: {accuracy_score(y_test, y_pred):.3f}")
print(f"Matriz de confusion:\n{confusion_matrix(y_test, y_pred)}")

# PASO 4: Clasificacion de cancer de mama con curva ROC.
# La curva ROC muestra el balance entre sensibilidad y especificidad; el
# AUC resume ese balance en un solo numero (1 = perfecto, 0.5 = azar).
cancer = load_breast_cancer()
Xc_tr, Xc_te, yc_tr, yc_te = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42, stratify=cancer.target)

mod_cancer = LogisticRegression(max_iter=5000)
mod_cancer.fit(Xc_tr, yc_tr)
pred_cancer = mod_cancer.predict(Xc_te)
print("\nPASO 4 - Breast cancer (regresion logistica)")
print(f"Exactitud: {accuracy_score(yc_te, pred_cancer):.3f}")
print(f"Matriz de confusion:\n{confusion_matrix(yc_te, pred_cancer)}")
print(classification_report(yc_te, pred_cancer, target_names=cancer.target_names))

prob = mod_cancer.predict_proba(Xc_te)[:, 1]
fpr, tpr, _ = roc_curve(yc_te, prob)
print(f"AUC: {auc(fpr, tpr):.4f}")

fig = px.line(x=fpr, y=tpr,
              title="Curva ROC - breast cancer",
              labels={"x": "Tasa de falsos positivos",
                      "y": "Tasa de verdaderos positivos"})
fig.add_scatter(x=[0, 1], y=[0, 1], mode="lines", name="Modelo aleatorio")
fig.show()

# PASO 5: Exploracion del umbral de clasificacion.
# Bajando el umbral ganamos sensibilidad (detectar mas positivos) pero
# perdemos precision (mas falsos positivos); subiendolo pasa al reves.
print("\nPASO 5 - Exploracion de umbrales")
print(f"{'Umbral':<8}{'Precision':>10}{'Sensibilidad':>14}{'F1':>8}")
for umbral in [0.1, 0.3, 0.5, 0.7, 0.9]:
    pred_umb = (prob >= umbral).astype(int)
    prec = precision_score(yc_te, pred_umb, zero_division=0)
    rec = recall_score(yc_te, pred_umb, zero_division=0)
    f1 = f1_score(yc_te, pred_umb, zero_division=0)
    print(f"{umbral:<8.1f}{prec:>10.3f}{rec:>14.3f}{f1:>8.3f}")

umbrales = np.arange(0.05, 1.0, 0.05)
precs = [precision_score(yc_te, (prob >= t).astype(int), zero_division=0) for t in umbrales]
recs = [recall_score(yc_te, (prob >= t).astype(int), zero_division=0) for t in umbrales]

fig = px.line(x=umbrales, y=[precs, recs],
              title="Precision y sensibilidad segun el umbral",
              labels={"x": "Umbral", "value": "Metrica", "variable": "Metrica"})
fig.update_layout(legend=dict(orientation="h", y=1.1))
fig.show()
print("Si los falsos negativos cuestan 10x mas, conviene un umbral BAJO.")

# PASO 6: Datos desbalanceados.
# Con 95% de clase 0, predecir siempre 0 da ~95% de exactitud: enganoso.
X_imb, y_imb = make_classification(n_samples=1000, weights=[0.95, 0.05],
                                   random_state=42)
Xi_tr, Xi_te, yi_tr, yi_te = train_test_split(
    X_imb, y_imb, test_size=0.25, random_state=42)
modelo_imb = LogisticRegression(max_iter=1000)
modelo_imb.fit(Xi_tr, yi_tr)
pred_imb = modelo_imb.predict(Xi_te)
print("\nPASO 6 - Datos desbalanceados")
print(f"Exactitud: {accuracy_score(yi_te, pred_imb):.3f}")
print(f"Recall clase minoritaria: {recall_score(yi_te, pred_imb):.3f}")
print(classification_report(yi_te, pred_imb, zero_division=0))
print("La exactitud es enganosa: el recall/F1 revelan el desempeno real.")
```