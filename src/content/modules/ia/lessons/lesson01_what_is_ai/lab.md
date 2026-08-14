# Lab: Exploración de Features con Breast Cancer Wisconsin

## Objetivo

Aplicar los conceptos de **features** y reconocimiento de patrones que viste en la lección («Features: el idioma de la máquina») para explorar un dataset real de diagnóstico médico. Al finalizar, vas a poder explicar por qué algunas features separan mejor las clases que otras.

## Duración

75 minutos (60-90 min según tu ritmo)

## Dataset

Usamos el dataset **Breast Cancer Wisconsin** incluido en scikit-learn. Contiene 569 casos reales de biopsias con 30 features numéricas extraídas de imágenes de núcleos celulares. Cada caso está etiquetado como **maligno** o **benigno**.

```python
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
```

## Instrucciones

### Parte 1: Carga y vista general del dataset (10 min)

Cargá el dataset y explorá su estructura básica.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()

print(f"Nombre del dataset: {data.DESCR.split(chr(10))[0]}")
print(f"Número de muestras: {data.data.shape[0]}")
print(f"Número de features: {data.data.shape[1]}")
print(f"Clases: {data.target_names}")
print(f"Distribución de clases:")
unique, counts = np.unique(data.target, return_counts=True)
for cls, count in zip(data.target_names, counts):
    print(f"  {cls}: {count} ({count/len(data.target)*100:.1f}%)")
```

**Preguntas para reflexionar:**
- ¿Cuántas muestras tiene el dataset?
- ¿Cuántas features se miden por cada muestra?
- ¿Las clases están balanceadas? ¿Por qué importa esto?

### Parte 2: Exploración de features (15 min)

Explorá la forma, los nombres de las features y la distribución de las clases.

```python
# Shape de los datos
X = data.data
y = data.target
feature_names = data.feature_names

print(f"Shape de X: {X.shape}")
print(f"Shape de y: {y.shape}")
print(f"\nPrimeras 10 features:")
for i, name in enumerate(feature_names[:10]):
    print(f"  {i+1}. {name}: mean={X[:, i].mean():.2f}, std={X[:, i].std():.2f}")

# Distribución de las clases
fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].bar(data.target_names, counts, color=['#e74c3c', '#2ecc71'])
axes[0].set_title('Distribución de clases')
axes[0].set_ylabel('Cantidad de muestras')

# Histograma de una feature
axes[1].hist(X[y == 0, 0], bins=20, alpha=0.7, label='malignant', color='#e74c3c')
axes[1].hist(X[y == 1, 0], bins=20, alpha=0.7, label='benign', color='#2ecc71')
axes[1].set_title(f'Distribución de: {feature_names[0]}')
axes[1].set_xlabel(feature_names[0])
axes[1].set_ylabel('Frecuencia')
axes[1].legend()

plt.tight_layout()
plt.savefig('part2_exploration.png', dpi=100, bbox_inches='tight')
plt.show()
```

**Preguntas para reflexionar:**
- ¿Qué representan los nombres de las features? (pista: "mean radius", "mean texture", etc.)
- ¿La feature "mean radius" muestra diferencias entre clases?

### Parte 3: Visualización 2D de features (20 min)

Creá un scatter plot 2D para visualizar cómo se separan las clases en el espacio de features.

```python
# Elegir 2 features para visualizar
feat_x = 0  # mean radius
feat_y = 1  # mean texture

fig, ax = plt.subplots(figsize=(8, 6))

malignant = y == 0
benign = y == 1

ax.scatter(X[malignant, feat_x], X[malignant, feat_y],
           c='#e74c3c', label='Malignant', alpha=0.6, edgecolors='k', s=40)
ax.scatter(X[benign, feat_x], X[benign, feat_y],
           c='#2ecc71', label='Benign', alpha=0.6, edgecolors='k', s=40)

ax.set_xlabel(feature_names[feat_x])
ax.set_ylabel(feature_names[feat_y])
ax.set_title(f'Scatter plot: {feature_names[feat_x]} vs {feature_names[feat_y]}')
ax.legend()

plt.tight_layout()
plt.savefig('part3_scatter_2d.png', dpi=100, bbox_inches='tight')
plt.show()

# Ahora probá con otras features
feat_x2 = 20  # mean area (worst)
feat_y2 = 21  # mean smoothness (worst)

fig, ax = plt.subplots(figsize=(8, 6))

ax.scatter(X[malignant, feat_x2], X[malignant, feat_y2],
           c='#e74c3c', label='Malignant', alpha=0.6, edgecolors='k', s=40)
ax.scatter(X[benign, feat_x2], X[benign, feat_y2],
           c='#2ecc71', label='Benign', alpha=0.6, edgecolors='k', s=40)

ax.set_xlabel(feature_names[feat_x2])
ax.set_ylabel(feature_names[feat_y2])
ax.set_title(f'Scatter plot: {feature_names[feat_x2]} vs {feature_names[feat_y2]}')
ax.legend()

plt.tight_layout()
plt.savefig('part3_scatter_2d_v2.png', dpi=100, bbox_inches='tight')
plt.show()
```

**Preguntas para reflexionar:**
- ¿Qué combinación de features separa mejor las clases?
- ¿Hay superposición entre las clases? ¿Qué significa esto para un clasificador?
- Relacioná esto con lo que viste en la lección sobre "reglas fijas vs ML".

### Parte 4: Comparación de features entre benigno y maligno (15 min)

Compará estadísticamente las features entre las dos clases para identificar cuáles son más discriminativas.

```python
# Calcular estadísticas por clase
malignant_data = X[y == 0]
benign_data = X[y == 1]

print(f"{'Feature':<25} {'Malignant mean':>15} {'Benign mean':>15} {'Difference':>12}")
print("-" * 70)

differences = []
for i, name in enumerate(feature_names[:10]):
    mal_mean = malignant_data[:, i].mean()
    ben_mean = benign_data[:, i].mean()
    diff = mal_mean - ben_mean
    differences.append((name, abs(diff / ben_mean) * 100))
    print(f"{name:<25} {mal_mean:>15.2f} {ben_mean:>15.2f} {diff:>12.2f}")

# Identificar la feature con mayor diferencia relativa
differences.sort(key=lambda x: x[1], reverse=True)
print(f"\nTop 3 features con mayor diferencia relativa:")
for name, pct in differences[:3]:
    print(f"  {name}: {pct:.1f}% de diferencia")
```

**Preguntas para reflexionar:**
- ¿Cuáles features muestran la mayor diferencia entre clases?
- ¿Una sola feature es suficiente para clasificar perfectamente?
- ¿Por qué creés que algunas features son más discriminativas que otras?

### Parte 5: Reporte de estadísticas resumen (15 min)

Generá un reporte final con las estadísticas clave del dataset.

```python
# Tabla resumen de las primeras 10 features
print("=" * 80)
print("REPORTE: Breast Cancer Wisconsin - Estadísticas Resumen")
print("=" * 80)

print(f"\nDataset: {data.data.shape[0]} muestras, {data.data.shape[1]} features")
print(f"Clases: {data.target_names[0]} ({(y==0).sum()}), {data.target_names[1]} ({(y==1).sum()})")

print(f"\n{'Feature':<25} {'Mean':>8} {'Std':>8} {'Min':>8} {'Max':>8}")
print("-" * 60)
for i, name in enumerate(feature_names[:10]):
    col = X[:, i]
    print(f"{name:<25} {col.mean():>8.2f} {col.std():>8.2f} {col.min():>8.2f} {col.max():>8.2f}")

# Visualización final: boxplot comparativo de las 5 features más importantes
fig, axes = plt.subplots(1, 5, figsize=(20, 4))
top_features = [d[0] for d in differences[:5]]

for idx, fname in enumerate(top_features):
    feat_idx = list(feature_names).index(fname)
    axes[idx].boxplot([X[y == 0, feat_idx], X[y == 1, feat_idx]],
                      labels=['Malignant', 'Benign'])
    axes[idx].set_title(fname, fontsize=9, rotation=15)
    axes[idx].tick_params(labelsize=8)

plt.suptitle('Top 5 features más discriminativas', fontsize=12)
plt.tight_layout()
plt.savefig('part5_summary.png', dpi=100, bbox_inches='tight')
plt.show()

print("\n✓ Reporte completado. Las visualizaciones se guardaron como archivos PNG.")
```

## Entregables

Entregá un único notebook Jupyter (`.ipynb`) o script Python (`.py`) que contenga:
- Todo el código con comentarios
- Respuestas a las preguntas de reflexión de cada parte
- Las visualizaciones generadas (o los archivos PNG)
- Una conclusión final sobre qué features son más discriminativas y por qué

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Carga correcta del dataset y exploración de estructura | 2 |
| Exploración de features con estadísticas y visualizaciones | 3 |
| Scatter plot 2D con interpretación | 2 |
| Comparación estadística entre clases | 2 |
| Reporte resumen con conclusiones | 1 |

**Total: 10 puntos**
