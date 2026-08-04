# Lab: Matriz de confusión, PDB y pipeline de ML en biotecnología

## Objetivo

Aplicar métricas de evaluación de clasificación (matriz de confusión, precisión, recall y F1-score) en un problema médico real, y conectar el pipeline de ML con datos estructurales de proteínas del PDB. Al finalizar vas a saber interpretar qué tipo de errores comete un clasificador y por qué eso importa en biotecnología.

## Duración

80 minutos (60-90 min según tu ritmo)

## Datasets

- **Breast Cancer Wisconsin (BCW)**: 569 casos de biopsias con 30 features numéricas y target binario (maligno/benigno).
- **1UBQ (ubiquitina)**: estructura de proteína del PDB. Se descarga vía Biopython o se usa un fallback CSV con coordenadas Cα.

```python
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target
```

## Instrucciones

### Parte 1: Matriz de confusión desde cero con BCW + KNN (15 min)

Entrená un clasificador KNN y construí la matriz de confusión comparando predicciones con valores reales.

```python
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import confusion_matrix

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
y_pred = knn.predict(X_test)

cm = confusion_matrix(y_test, y_pred)
print("Matriz de confusión:")
print(cm)

tn, fp, fn, tp = cm.ravel()
print(f"TP={tp}, FP={fp}, FN={fn}, TN={tn}")
```

**Preguntas para reflexionar:**
- ¿Qué representa cada celda de la matriz?
- ¿Cuántos falsos negativos obtuvo el modelo? ¿Qué significa clínicamente un falso negativo en este dataset?

### Parte 2: Precisión, recall y F1-score (15 min)

Calculá las métricas derivadas manualmente y con scikit-learn.

```python
from sklearn.metrics import precision_score, recall_score, f1_score, classification_report

precision = tp / (tp + fp)
recall = tp / (tp + fn)
f1 = 2 * (precision * recall) / (precision + recall)

print(f"Manual  -> precision: {precision:.3f}, recall: {recall:.3f}, f1: {f1:.3f}")
print(f"sklearn -> precision: {precision_score(y_test, y_pred):.3f}, "
      f"recall: {recall_score(y_test, y_pred):.3f}, "
      f"f1: {f1_score(y_test, y_pred):.3f}")

print("\nReporte completo:")
print(classification_report(y_test, y_pred, target_names=data.target_names))
```

**Preguntas para reflexionar:**
- ¿Por qué precision y recall no siempre aumentan juntas?
- Si este modelo se usara para triage médico, ¿preferirías maximizar precision o recall? ¿Por qué?

### Parte 3: Descarga de una estructura del PDB (15 min)

Intentá obtener la estructura de la ubiquitina (1UBQ) con Biopython. Si no está disponible, usá el fallback CSV.

```python
import urllib.request

pdb_id = "1UBQ"
structure = None

try:
    from Bio.PDB import PDBList, PDBParser

    pdbl = PDBList()
    pdb_file = pdbl.retrieve_pdb_file(pdb_id, pdir=".", file_format="pdb")
    parser = PDBParser(QUIET=True)
    structure = parser.get_structure(pdb_id, pdb_file)
    print(f"Estructura {pdb_id} cargada con Biopython")
except Exception as e:
    print(f"Biopython no disponible o falló: {e}")
    print("Usando fallback: descarga directa del PDB...")

    url = f"https://files.rcsb.org/download/{pdb_id}.pdb"
    pdb_text = urllib.request.urlopen(url, timeout=20).read().decode("utf-8")
    structure = pdb_text  # se parsea en la siguiente parte
    print(f"Texto PDB descargado: {len(pdb_text)} caracteres")
```

**Preguntas para reflexionar:**
- ¿Qué ventajas tiene usar una fuente de datos estructurales como el PDB?
- ¿Por qué es importante tener un fallback cuando trabajamos con APIs o redes externas?

### Parte 4: Coordenadas Cα y distancias (15 min)

Extraé las coordenadas de los átomos Cα y calculá distancias entre residuos.

```python
import numpy as np

def parse_ca_from_text(pdb_text):
    coords = []
    for line in pdb_text.splitlines():
        if line.startswith("ATOM") and line[12:16].strip() == "CA":
            resi = int(line[22:26])
            x = float(line[30:38])
            y = float(line[38:46])
            z = float(line[46:54])
            coords.append((resi, x, y, z))
    return coords

if isinstance(structure, str):
    ca_coords = parse_ca_from_text(structure)
else:
    ca_coords = []
    for model in structure:
        for chain in model:
            for residue in chain:
                if residue.has_id("CA"):
                    atom = residue["CA"]
                    ca_coords.append((residue.id[1], atom.coord[0], atom.coord[1], atom.coord[2]))

print(f"Cantidad de residuos Cα: {len(ca_coords)}")
print("Primeros 3:", ca_coords[:3])

# Distancia entre el primer y el último Cα
first = np.array(ca_coords[0][1:])
last = np.array(ca_coords[-1][1:])
distance = np.linalg.norm(first - last)
print(f"Distancia Cα(1) -> Cα({ca_coords[-1][0]}): {distance:.2f} Å")
```

**Preguntas para reflexionar:**
- ¿Por qué el Cα es un buen representante de cada residuo?
- ¿Qué tipo de información perdemos al reducir una proteína a una lista de coordenadas Cα?

### Parte 5: Resumen del pipeline de ML con métricas (20 min)

Uní todo en una tabla que resuma el pipeline y sus resultados.

```python
import pandas as pd

pipeline_summary = pd.DataFrame([
    {"Etapa": "Datos", "Descripción": "Cargar BCW (569 muestras, 30 features)", "Herramienta": "sklearn.datasets"},
    {"Etapa": "Split", "Descripción": "Separar 70% train / 30% test estratificado", "Herramienta": "train_test_split"},
    {"Etapa": "Modelo", "Descripción": "Entrenar KNN con k=5", "Herramienta": "KNeighborsClassifier"},
    {"Etapa": "Evaluación", "Descripción": "Matriz de confusión + precision/recall/F1", "Herramienta": "sklearn.metrics"},
    {"Etapa": "Datos estructurales", "Descripción": "Cargar Cα de 1UBQ", "Herramienta": "Bio.PDB / urllib"},
])

print(pipeline_summary.to_string(index=False))

# Métricas finales
print(f"\nAccuracy : {(tp + tn) / (tp + tn + fp + fn):.3f}")
print(f"Precision: {precision:.3f}")
print(f"Recall   : {recall:.3f}")
print(f"F1-score : {f1:.3f}")
```

**Preguntas para reflexionar:**
- ¿Qué etapa del pipeline consume más tiempo en un proyecto real?
- ¿Qué métrica elegirías para reportar si el costo de un falso negativo es alto?

## Entregables

Entregá un notebook Jupyter (`.ipynb`) o script Python (`.py`) que contenga:
- Todo el código con comentarios
- Respuestas a las preguntas de reflexión de cada parte
- La matriz de confusión y las métricas calculadas
- Las coordenadas Cα de 1UBQ y al menos una distancia calculada
- Un resumen del pipeline con la métrica más relevante para el contexto biotecnológico

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Matriz de confusión manual con BCW + KNN | 3 |
| Cálculo correcto de precision, recall y F1 | 3 |
| Descarga o fallback del PDB para 1UBQ | 2 |
| Parseo de Cα y cálculo de distancias | 2 |
| Resumen del pipeline con interpretación de métricas | 2 |

**Total: 12 puntos**
