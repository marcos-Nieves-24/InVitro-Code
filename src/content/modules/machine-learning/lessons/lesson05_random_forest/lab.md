```python
# =========================================================================
# LAB 5: Bosque aleatorio
# -------------------------------------------------------------------------
# Comparamos un arbol individual contra un bosque aleatorio, analizamos la
# importancia de las features y evaluamos un escenario desbalanceado donde
# la exactitud es enganosa y conviene mirar el recall.
# =========================================================================

# PASO 1: Datos sinteticos con 6 features (2 redundantes).
# Varias features son informativas y otras aportan ruido.
import numpy as np                         # Operaciones matematicas
from sklearn.datasets import make_classification  # Cargar datasets de ejemplo
from sklearn.model_selection import train_test_split  # Division train/test y validacion
from sklearn.tree import DecisionTreeClassifier  # Arboles de decision
from sklearn.ensemble import RandomForestClassifier  # Ensembles (Random Forest, etc.)
from sklearn.metrics import accuracy_score, recall_score  # Metricas de evaluacion

np.random.seed(42)                         # Fijar semilla para reproducibilidad
X, y = make_classification(n_samples=800, n_features=6, n_informative=4,
                           n_redundant=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42)

arbol = DecisionTreeClassifier(max_depth=5, random_state=42)
arbol.fit(X_train, y_train)
bosque = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
bosque.fit(X_train, y_train)
print("PASO 1 - Arbol individual vs bosque")
print(f"Arbol  - exactitud prueba: {accuracy_score(y_test, arbol.predict(X_test)):.3f}")
print(f"Bosque - exactitud prueba: {accuracy_score(y_test, bosque.predict(X_test)):.3f}")

# PASO 2: Importancia de features de ambos modelos.
# El bosque promedia muchos arboles y estabiliza las importancias.
import plotly.express as px                # Graficos interactivos

nombres = [f"f{i}" for i in range(6)]
fig = px.bar(x=nombres, y=bosque.feature_importances_,
             labels={"x": "Feature", "y": "Importancia"},
             title="Importancia de features: arbol vs bosque")
fig.add_bar(x=nombres, y=arbol.feature_importances_, name="Arbol")
fig.update_layout(barmode="group")
fig.show()                                 # Mostrar grafico interactivo
print("PASO 2 - El bosque reparte mejor la importancia entre features utiles.")

# PASO 3: Escenario desbalanceado.
# Con 90% de clase 0, predecir siempre 0 daria 90% de exactitud.
X_imb, y_imb = make_classification(n_samples=1000, weights=[0.9, 0.1],
                                   random_state=42)
Xi_tr, Xi_te, yi_tr, yi_te = train_test_split(
    X_imb, y_imb, test_size=0.25, random_state=42)

modelo_imb = RandomForestClassifier(n_estimators=100, random_state=42)
modelo_imb.fit(Xi_tr, yi_tr)
pred_imb = modelo_imb.predict(Xi_te)
print("PASO 3 - Datos desbalanceados")
print(f"Exactitud: {accuracy_score(yi_te, pred_imb):.3f}")
print(f"Recall clase minoritaria: {recall_score(yi_te, pred_imb):.3f}")

# PASO 4: Efecto del numero de arboles.
# Tras cierto n, el bosque se estabiliza: rendimientos decrecientes.
n_arboles = [10, 50, 100, 200, 400]
scores = []
for n in n_arboles:
    rf = RandomForestClassifier(n_estimators=n, random_state=42)
    rf.fit(X_train, y_train)
    scores.append(accuracy_score(y_test, rf.predict(X_test)))

fig = px.line(x=n_arboles, y=scores,
              labels={"x": "n_estimators", "y": "Exactitud prueba"},
              title="Exactitud segun numero de arboles")
fig.show()                                 # Mostrar grafico interactivo
print("PASO 4 - A partir de ~100 arboles la mejora es marginal.")
```