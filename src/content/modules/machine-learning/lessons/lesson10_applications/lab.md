```python
# =========================================================================
# LAB 10: Pipeline de extremo a extremo
# -------------------------------------------------------------------------
# Construimos un pipeline completo (StandardScaler + LogisticRegression)
# sobre cancer de mama: entrenamiento, metricas, matriz de confusion y un
# tablero final con make_subplots que resume el modelo.
# =========================================================================

# PASO 1: Pipeline con escalado y regresion logistica.
# El escalado es clave para la logistica: sin el, las features con mayor
# magnitud dominarian los coeficientes.
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.3, random_state=42)

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("logit", LogisticRegression(max_iter=1000))
])
pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
print("PASO 1 - Pipeline entrenado")
print(f"Exactitud en prueba: {accuracy_score(y_test, y_pred):.3f}")
print(f"AUC: {roc_auc_score(y_test, pipeline.predict_proba(X_test)[:, 1]):.3f}")

# PASO 2: Matriz de confusion.
# La diagonal concentra los aciertos; fuera de ella estan los errores.
matriz = confusion_matrix(y_test, y_pred)
print("PASO 2 - Matriz de confusion:")
print(matriz)

import plotly.express as px

fig = px.imshow(matriz, text_auto=True, color_continuous_scale="Blues",
                labels={"x": "Prediccion", "y": "Real"},
                x=["Benigno", "Maligno"], y=["Benigno", "Maligno"],
                title="Matriz de confusion")
fig.show()

# PASO 3: Importancia de features (coeficientes estandarizados).
# Con datos escalados, el coeficiente indica la direccion y el peso de
# cada feature en la decision.
coef = pipeline.named_steps["logit"].coef_[0]
importancias = np.abs(coef)
orden = np.argsort(importancias)[::-1][:10]
print("PASO 3 - Top 5 features por |coeficiente|:")
for i in orden[:5]:
    print(f"  {cancer.feature_names[i]}: {coef[i]:.3f}")

fig = px.bar(x=cancer.feature_names[orden], y=coef[orden],
             labels={"x": "Feature", "y": "Coeficiente"},
             title="Top 10 coeficientes de la regresion logistica")
fig.update_layout(xaxis_tickangle=-45)
fig.show()

# PASO 4: Tablero final con make_subplots.
# Combinamos la distribucion de probabilidades, la matriz de confusion y
# los coeficientes en un unico panel de control del modelo.
import plotly.graph_objects as go
from plotly.subplots import make_subplots

prob = pipeline.predict_proba(X_test)[:, 1]
fig = make_subplots(rows=1, cols=3,
                    subplot_titles=("Probabilidad predicha",
                                    "Matriz de confusion",
                                    "Coeficientes top 5"),
                    specs=[[{"type": "xy"}, {"type": "heatmap"}, {"type": "xy"}]])
fig.add_trace(go.Histogram(x=prob, nbinsx=25), row=1, col=1)
fig.add_trace(go.Heatmap(z=matriz, colorscale="Blues", showscale=False),
              row=1, col=2)
fig.add_trace(go.Bar(x=cancer.feature_names[orden[:5]],
                     y=coef[orden[:5]]), row=1, col=3)
fig.update_layout(height=420, width=1000, showlegend=False,
                  title_text="Dashboard del pipeline - cancer de mama")
fig.show()
print("PASO 4 - Tablero final generado con make_subplots.")
```