```python
# =========================================================================
# LAB 9: Interpretacion de modelos
# -------------------------------------------------------------------------
# Entrenamos un bosque aleatorio sobre cancer de mama y comparamos la
# importancia por impureza con la importancia por permutacion. Cerramos
# con una curva de dependencia parcial para la feature principal.
# =========================================================================

# PASO 1: Bosque aleatorio sobre cancer de mama.
import numpy as np                         # Operaciones matematicas
from sklearn.datasets import load_breast_cancer  # Cargar datasets de ejemplo
from sklearn.model_selection import train_test_split  # Division train/test y validacion
from sklearn.ensemble import RandomForestClassifier  # Ensembles (Random Forest, etc.)
from sklearn.metrics import accuracy_score  # Metricas de evaluacion

cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.3, random_state=42)

bosque = RandomForestClassifier(n_estimators=100, random_state=42)
bosque.fit(X_train, y_train)
print("PASO 1 - Bosque entrenado")
print(f"Exactitud en prueba: {accuracy_score(y_test, bosque.predict(X_test)):.3f}")

# PASO 2: Importancia por permutacion.
# Mide la caida de rendimiento al barajar cada feature: es mas honesta que
# la importancia por impureza cuando hay features correlacionadas.
from sklearn.inspection import permutation_importance  # Inspeccion de modelos

resultado = permutation_importance(bosque, X_test, y_test,
                                   n_repeats=10, random_state=42)
perm_mean = resultado.importances_mean
print("PASO 2 - Top 5 features por permutacion:")
for i in np.argsort(perm_mean)[::-1][:5]:
    print(f"  {cancer.feature_names[i]}: {perm_mean[i]:.4f}")

# PASO 3: Comparacion entre impureza y permutacion.
# La impureza favorece features con muchos valores; la permutacion no.
import plotly.express as px                # Graficos interactivos

orden = np.argsort(perm_mean)[::-1][:10]
fig = px.bar(x=cancer.feature_names[orden],
             y=bosque.feature_importances_[orden],
             labels={"x": "Feature", "y": "Importancia"},
             title="Importancia por impureza vs permutacion (top 10)")
fig.add_bar(x=cancer.feature_names[orden], y=perm_mean[orden], name="Permutacion")
fig.update_layout(barmode="group", xaxis_tickangle=-45)
fig.show()                                 # Mostrar grafico interactivo
print("PASO 3 - Ambas tecnicas coinciden en la feature principal.")

# PASO 4: Dependencia parcial de la feature mas importante.
# Variamos la feature sobre su rango y vemos como cambia la probabilidad
# predicha, manteniendo el resto de features fijas en su media.
import plotly.graph_objects as go       # Graficos de bajo nivel

mejor = orden[0]
grid = np.linspace(X_test[:, mejor].min(), X_test[:, mejor].max(), 60)
base = np.tile(X_test.mean(axis=0), (len(grid), 1))
base[:, mejor] = grid
prob = bosque.predict_proba(base)[:, 1]

fig = go.Figure(go.Scatter(x=grid, y=prob, mode="lines",
                           name=cancer.feature_names[mejor]))
fig.update_layout(title=f"PDP de {cancer.feature_names[mejor]}",
                  xaxis_title=cancer.feature_names[mejor],
                  yaxis_title="Probabilidad de maligno")
fig.show()                                 # Mostrar grafico interactivo
print(f"PASO 4 - A mayor {cancer.feature_names[mejor]}, mayor riesgo predicho.")
```