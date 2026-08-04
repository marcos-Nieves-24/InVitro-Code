# Lab: Entrenamiento, validación y fronteras de decisión

## Objetivo

Aplicar los conceptos centrales de aprendizaje supervisado: *train/test split*, KNN, fronteras de decisión, regresión lineal y sobreajuste. Vas a usar dos datasets reales de scikit-learn —Iris y Breast Cancer Wisconsin— para ver cómo un modelo aprende patrones generales y cómo detectar cuando memoriza en lugar de generalizar.

## Duración

75 minutos (60-90 min según tu ritmo)

## Datasets

- **Iris**: 150 flores de tres especies con 4 features numéricas. En este lab usamos solo 2 features para poder visualizar en 2D.
- **Breast Cancer Wisconsin**: 569 casos reales de biopsias con 30 features y un target binario (maligno/benigno).

```python
from sklearn.datasets import load_iris, load_breast_cancer

iris = load_iris()
bcw = load_breast_cancer()
```

## Instrucciones

### Parte 1: Cargar Iris y reducir a 2 features (10 min)

Cargá el dataset Iris, seleccioná 2 features y visualizá la distribución de clases.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

plt.style.use('seaborn-v0_8-whitegrid')

# Usamos las dos últimas features: longitud y ancho del pétalo
iris = load_iris()
X = iris.data[:, [2, 3]]
y = iris.target
target_names = iris.target_names
feature_names = [iris.feature_names[2], iris.feature_names[3]]

print(f"Muestras: {X.shape[0]}")
print(f"Features: {X.shape[1]}")
print(f"Especies: {target_names}")

unique, counts = np.unique(y, return_counts=True)
for name, count in zip(target_names, counts):
    print(f"  {name}: {count} ({count/len(y)*100:.1f}%)")
```

**Preguntas para reflexionar:**
- ¿Cuántas muestras tiene cada especie?
- ¿Por qué elegimos solo 2 features para el resto del lab?

### Parte 2: División en entrenamiento y prueba (15 min)

Separá los datos en entrenamiento (*train*) y prueba (*test*) para poder medir si el modelo generaliza a datos no vistos.

```python
from sklearn.model_selection import train_test_split

# Stratify mantiene la proporción de clases en ambos conjuntos
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

print(f"Train: {X_train.shape[0]} muestras")
print(f"Test: {X_test.shape[0]} muestras")
print(f"Clases en train: {np.bincount(y_train)}")
print(f"Clases en test: {np.bincount(y_test)}")
```

**Preguntas para reflexionar:**
- ¿Qué proporción quedó para entrenamiento y qué proporción para prueba?
- ¿Por qué es importante que el modelo nunca vea los datos de prueba durante el entrenamiento?

### Parte 3: KNN con diferentes valores de k (15 min)

Entrená un clasificador KNN con varios valores de `k` y compará el *accuracy* en entrenamiento y prueba.

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

k_values = [1, 3, 5, 10, 15, 20, 30]
results = []

for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)

    train_acc = accuracy_score(y_train, knn.predict(X_train))
    test_acc = accuracy_score(y_test, knn.predict(X_test))
    results.append((k, train_acc, test_acc))

print(f"{'k':>3} | {'Train acc':>10} | {'Test acc':>10}")
print("-" * 32)
for k, train_acc, test_acc in results:
    print(f"{k:>3} | {train_acc:>10.3f} | {test_acc:>10.3f}")
```

**Preguntas para reflexionar:**
- ¿Qué valor de `k` da el mejor *accuracy* en prueba?
- ¿Qué pasa con `k=1`? ¿Por qué el *accuracy* de entrenamiento es tan alto?

### Parte 4: Visualización de la frontera de decisión (20 min)

Creamos una malla de puntos y predecimos su clase para visualizar cómo KNN divide el espacio de features.

```python
from sklearn.neighbors import KNeighborsClassifier
import numpy as np
import matplotlib.pyplot as plt

def plot_decision_boundary(X, y, k, title, ax):
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X, y)

    # Malla que cubre el rango de los datos
    x_min, x_max = X[:, 0].min() - 0.5, X[:, 0].max() + 0.5
    y_min, y_max = X[:, 1].min() - 0.5, X[:, 1].max() + 0.5
    xx, yy = np.meshgrid(
        np.linspace(x_min, x_max, 200),
        np.linspace(y_min, y_max, 200)
    )

    Z = knn.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    ax.contourf(xx, yy, Z, alpha=0.3, cmap=plt.cm.Set2)

    for cls, color, name in zip([0, 1, 2], ['#e74c3c', '#2ecc71', '#3498db'], iris.target_names):
        ax.scatter(X[y == cls, 0], X[y == cls, 1],
                   c=color, label=name, edgecolors='k', s=40, alpha=0.8)

    ax.set_xlabel(feature_names[0])
    ax.set_ylabel(feature_names[1])
    ax.set_title(title)
    ax.legend()

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

plot_decision_boundary(X_train, y_train, k=1, title='KNN (k=1) - frontera muy irregular', ax=axes[0])
plot_decision_boundary(X_train, y_train, k=15, title='KNN (k=15) - frontera más suave', ax=axes[1])

plt.tight_layout()
plt.savefig('knn_decision_boundaries.png', dpi=100, bbox_inches='tight')
plt.show()
```

**Preguntas para reflexionar:**
- ¿Cómo cambia la frontera cuando aumentamos `k`?
- ¿Qué versión parece más propenso a memorizar ruido?

### Parte 5: Regresión lineal y sobreajuste con Breast Cancer Wisconsin (25 min)

Regresión lineal para predecir el target del BCW usando una sola feature, y luego una demostración de sobreajuste ajustando polinomios de distinto grado.

```python
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer

# Usamos una feature: mean radius
bcw = load_breast_cancer()
X_bcw = bcw.data[:, 0].reshape(-1, 1)
y_bcw = bcw.target

X_train_b, X_test_b, y_train_b, y_test_b = train_test_split(
    X_bcw, y_bcw, test_size=0.3, random_state=42, stratify=y_bcw
)

# Regresión lineal simple
lin = LinearRegression()
lin.fit(X_train_b, y_train_b)

print(f"MSE train (lineal): {mean_squared_error(y_train_b, lin.predict(X_train_b)):.4f}")
print(f"MSE test  (lineal): {mean_squared_error(y_test_b, lin.predict(X_test_b)):.4f}")

# Demostración de sobreajuste con polinomios
degrees = range(1, 13)
train_errors, test_errors = [], []

for d in degrees:
    model = make_pipeline(PolynomialFeatures(d), LinearRegression())
    model.fit(X_train_b, y_train_b)

    train_errors.append(mean_squared_error(y_train_b, model.predict(X_train_b)))
    test_errors.append(mean_squared_error(y_test_b, model.predict(X_test_b)))

# Gráfico
fig, ax = plt.subplots(figsize=(8, 6))
ax.plot(degrees, train_errors, 'o-', label='Error de entrenamiento', color='#e74c3c')
ax.plot(degrees, test_errors, 's-', label='Error de prueba', color='#2ecc71')
ax.set_xlabel('Grado del polinomio')
ax.set_ylabel('Error cuadrático medio (MSE)')
ax.set_title('Subajuste vs. sobreajuste en BCW')
ax.legend()
ax.set_yscale('log')

plt.tight_layout()
plt.savefig('overfitting_polynomial.png', dpi=100, bbox_inches='tight')
plt.show()
```

**Preguntas para reflexionar:**
- ¿Qué pasa con el error de entrenamiento a medida que aumenta el grado del polinomio?
- ¿En qué punto el error de prueba empieza a empeorar? ¿Qué significa eso?
- ¿Por qué no queremos el modelo con el menor error de entrenamiento?

## Entregables

Entregá un notebook Jupyter (`.ipynb`) o un script Python (`.py`) que contenga:
- Todo el código con comentarios
- Respuestas a las preguntas de reflexión de cada parte
- Los gráficos generados (o los archivos PNG)
- Una conclusión final sobre cómo elegir el valor de `k` y cómo detectar sobreajuste

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Carga correcta de Iris y reducción a 2 features | 2 |
| División train/test con estratificación | 2 |
| KNN con varios valores de k y comparación de accuracy | 3 |
| Visualización de fronteras de decisión | 2 |
| Regresión lineal y demostración de sobreajuste | 3 |
| Conclusiones y respuestas a reflexiones | 1 |

**Total: 13 puntos**
