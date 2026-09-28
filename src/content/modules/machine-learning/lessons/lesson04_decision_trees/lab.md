```python
# =========================================================================
# LAB 4: Árboles de decision
# -------------------------------------------------------------------------
# Entrenamos un DecisionTreeClassifier sobre iris, imprimimos su estructura
# textual (nodos, umbrales, impurezas y hojas) y analizamos la importancia
# de cada feature junto con el efecto de la profundidad.
# =========================================================================

# PASO 1: Datos y entrenamiento del árbol.
# Limitamos la profundidad a 3 para obtener un árbol interpretable.
import numpy as np                         # Operaciones matemáticas
from sklearn.datasets import load_iris  # Cargar datasets de ejemplo
from sklearn.tree import DecisionTreeClassifier  # Árboles de decision
from sklearn.model_selection import train_test_split  # División train/test y validación
from sklearn.metrics import accuracy_score  # Métricas de evaluación

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.3, random_state=42)

árbol = DecisionTreeClassifier(max_depth=3, random_state=42)
árbol.fit(X_train, y_train)
y_pred = árbol.predict(X_test)
print("PASO 1 - Árbol entrenado")
print(f"Exactitud en prueba: {accuracy_score(y_test, y_pred):.3f}")

# PASO 2: Estructura textual del árbol.
# Recorremos el árbol en preorden imprimiendo feature, umbral y muestras.
def imprimir_nodo(clf, nombres, nodo=0, nivel=0):
    tree = clf.tree_
    muestras = tree.n_node_samples[nodo]
    impureza = tree.impurity[nodo]
    if tree.children_left[nodo] == tree.children_right[nodo]:
        clase = int(np.argmax(tree.value[nodo][0]))
        print(f"{'  ' * nivel}Hoja -> clase {clase} "
              f"(muestras {muestras}, impureza {impureza:.3f})")
    else:
        feat = nombres[tree.feature[nodo]]
        umbral = tree.threshold[nodo]
        print(f"{'  ' * nivel}Nodo -> {feat} < {umbral:.2f} "
              f"(muestras {muestras}, impureza {impureza:.3f})")
        imprimir_nodo(clf, nombres, tree.children_left[nodo], nivel + 1)
        imprimir_nodo(clf, nombres, tree.children_right[nodo], nivel + 1)

print("PASO 2 - Estructura textual del árbol")
imprimir_nodo(árbol, iris.feature_names)

# PASO 3: Importancia de las features.
# Mide cuanta impureza reduce cada feature en las divisiónes del árbol.
import plotly.express as px                # Gráficos interactivos

importancias = árbol.feature_importances_
fig = px.bar(x=iris.feature_names, y=importancias,
             labels={"x": "Feature", "y": "Importancia"},
             title="Importancia de features - DecisionTreeClassifier")
fig.show()                                 # Mostrar gráfico interactivo
print("PASO 3 - Feature mas importante:",
      iris.feature_names[int(np.argmax(importancias))])

# PASO 4: Profundidad y sobreajuste.
# Un árbol profundo memoriza los datos y degrada su rendimiento en prueba.
from sklearn.datasets import load_breast_cancer  # Cargar datasets de ejemplo

cancer = load_breast_cancer()
Xc_train, Xc_test, yc_train, yc_test = train_test_split(
    cancer.data, cancer.target, test_size=0.3, random_state=42)

profundidades = list(range(1, 11))
acc_train, acc_test = [], []
for p in profundidades:
    clf = DecisionTreeClassifier(max_depth=p, random_state=42)
    clf.fit(Xc_train, yc_train)
    acc_train.append(accuracy_score(yc_train, clf.predict(Xc_train)))
    acc_test.append(accuracy_score(yc_test, clf.predict(Xc_test)))

fig = px.line(x=profundidades, y=acc_test,
              labels={"x": "Profundidad", "y": "Exactitud"},
              title="Exactitud según profundidad")
fig.add_scatter(x=profundidades, y=acc_train, mode="lines",
                name="Entrenamiento")
fig.show()                                 # Mostrar gráfico interactivo
print("PASO 4 - Profundidad óptima en prueba:",
      profundidades[int(np.argmax(acc_test))])
```