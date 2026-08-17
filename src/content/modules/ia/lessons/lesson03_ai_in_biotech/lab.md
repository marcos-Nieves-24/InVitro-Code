```python
# =========================================================================
# LAB 3: La IA en biotecnologia - analisis local de proteinas
# -------------------------------------------------------------------------
# Simulamos el analisis de una proteina SIN conexion a internet: secuencia,
# composicion de aminoacidos, hidrofobicidad y un modelo de ML que predice
# si un residuo esta enterrado (buried) o expuesto (exposed).
# =========================================================================
# PASO 1: Secuencia de proteina y composicion de aminoacidos.
# Un fragmento peptidico corto como cadena de aminoacidos. Un diccionario
# cuenta cuantas veces aparece cada residuo y luego calculamos porcentajes.
import numpy as np
import pandas as pd
import plotly.express as px
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
sequence = "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQ"
amino_acids = list("ACDEFGHIKLMNPQRSTVWY")
comp = {aa: sequence.count(aa) for aa in amino_acids}
total = len(sequence)
print(f"Secuencia de {total} residuos")
print("Composicion (recuento por aminoacido):")
for aa, count in sorted(comp.items(), key=lambda t: -t[1]):
    print(f"  {aa}: {count} ({count / total * 100:.1f}%)")
# PASO 2: Visualizar la composicion de aminoacidos.
# Un grafico de barras resume que residuos abundan mas en la secuencia.
df_comp = pd.DataFrame({"aminoacido": list(comp.keys()),
                        "cantidad": list(comp.values())})
df_comp["porcentaje"] = (df_comp["cantidad"] / total * 100).round(1)
print("\nGraficando la composicion de aminoacidos.")
fig = px.bar(df_comp, x="aminoacido", y="cantidad",
             title="Composicion de aminoacidos de la secuencia",
             labels={"aminoacido": "Aminoacido", "cantidad": "Cantidad"})
fig.show()
# PASO 3: Hidrofobicidad de ejemplo (escala de Kyte-Doolittle).
# La hidrofobicidad ayuda a predecir si un residuo tiende a estar en el
# interior (enterrado) o en la superficie (expuesto) de la proteina.
hydro = {"A": 1.8, "I": 4.5, "L": 3.8, "V": 4.2, "F": 2.8, "W": -0.9,
         "M": 1.9, "Y": -1.3, "S": -0.8, "T": -0.7, "D": -3.5, "E": -3.5,
         "N": -3.5, "Q": -3.5, "H": -3.2, "K": -3.9, "R": -4.5, "C": 2.5,
         "G": -0.4, "P": -1.6}
print("\nHidrofobicidad (Kyte-Doolittle) de 5 residuos:")
for aa in ["I", "L", "V", "E", "K"]:
    print(f"  {aa}: {hydro[aa]:+.2f} (positivo = hidrofobico)")
df_hydro = pd.DataFrame({"aminoacido": list(hydro.keys()),
                         "hidrofobicidad": list(hydro.values())})
fig = px.bar(df_hydro, x="aminoacido", y="hidrofobicidad",
             title="Escala de hidrofobicidad de Kyte-Doolittle",
             labels={"aminoacido": "Aminoacido",
                     "hidrofobicidad": "Hidrofobicidad"})
fig.show()
# PASO 4: ML aplicado a biologia estructural (simulado).
# Generamos features sinteticas por residuo (hidrofobicidad, peso y
# frecuencia) y entrenamos una regresion logistica que predice si el
# residuo esta enterrado (1) o expuesto (0).
np.random.seed(42)
n = 200
residues = np.random.choice(list(hydro.keys()), size=n)
noise = np.random.normal(0, 0.3, size=n)
X_syn = np.column_stack([
    np.array([hydro[a] for a in residues]),   # hidrofobicidad del residuo
    np.random.uniform(20, 180, size=n),        # peso molecular aproximado
    np.random.uniform(0, 1, size=n),           # frecuencia normalizada
])
y_syn = ((X_syn[:, 0] + noise) > 1.5).astype(int)
print(f"\nResiduos simulados: enterrados={(y_syn == 1).sum()}, "
      f"expuestos={(y_syn == 0).sum()}")
Xtr, Xte, ytr, yte = train_test_split(
    X_syn, y_syn, test_size=0.3, random_state=42, stratify=y_syn)
model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(Xtr, ytr)
train_acc = accuracy_score(ytr, model.predict(Xtr))
test_acc = accuracy_score(yte, model.predict(Xte))
print(f"LogisticRegression -> train_acc={train_acc:.3f}, test_acc={test_acc:.3f}")
df_acc = pd.DataFrame({"conjunto": ["train", "test"],
                       "accuracy": [train_acc, test_acc]})
fig = px.bar(df_acc, x="conjunto", y="accuracy",
             title="Accuracy del modelo de biologia estructural",
             labels={"conjunto": "Conjunto", "accuracy": "Accuracy"})
fig.show()
# PASO 5: Resumen del laboratorio.
print("\n--- RESUMEN ---")
print("Sin conexion a internet analizamos secuencia y composicion.")
print("La hidrofobicidad es una feature clave de la estructura.")
print("El ML predice el entorno del residuo a partir de sus features.")
```