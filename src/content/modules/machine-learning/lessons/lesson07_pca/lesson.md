---
Module: 4
Lesson Number: 7
Lesson Title: Análisis de Componentes Principales (PCA)
Estimated Duration: 75 minutos
Prerequisites: L1 (Fundamentos de ML), Módulo 3 (covarianza, valores propios)
Learning Objectives:
  - Explicar la intuición de PCA: encontrar direcciones de máxima varianza
  - Aplicar PCA para reducción de dimensionalidad con scikit-learn
  - Interpretar la proporción de varianza explicada y el gráfico de varianza acumulada
  - Usar PCA para visualización 2D de datos de alta dimensionalidad
  - Describir la relación entre vectores propios y componentes principales
Keywords: PCA, reducción de dimensionalidad, valores propios, vectores propios, varianza explicada, extracción de características
Difficulty: Intermedio
Programming Concepts: sklearn.decomposition.PCA, fit_transform, explained_variance_ratio_
Mathematical Concepts: matriz de covarianza, descomposición en valores propios, proyección ortogonal
Machine Learning Concepts: reducción de dimensionalidad, extracción de características, visualización de datos
Datasets Used: iris, breast cancer, make_blobs
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Análisis de Componentes Principales (PCA)

## Motivación

Un citómetro de flujo mide 50+ marcadores por célula. Un microarray mide 20,000+ niveles de expresión génica. Los datos de alta dimensionalidad están en todas partes en biotecnología, pero los humanos solo podemos visualizar 2-3 dimensiones. PCA reduce cientos de dimensiones a unas pocas mientras preserva los patrones más importantes. En SaaS, PCA ayuda a visualizar segmentos de clientes e identificar factores ocultos que impulsan el comportamiento del usuario.

## Panorama general

**Anterior:** K-Means (no supervisado — agrupamiento). **Esta lección:** PCA (no supervisado — reducción de dimensionalidad). **Siguiente:** Gradient Boosting (de vuelta a supervisado, pero con un nuevo paradigma).

## Teoría

### La Maldición de la Dimensionalidad

A medida que las dimensiones aumentan:
- Los datos se vuelven dispersos
- Las distancias pierden sentido
- La visualización se vuelve imposible
- Los modelos se sobreajustan más fácilmente

PCA resuelve esto encontrando una representación de menor dimensión que captura la mayor parte de la varianza.

### Intuición de PCA

PCA encuentra nuevos ejes (componentes principales) que:
1. Son direcciones de máxima varianza en los datos
2. Son ortogonales entre sí (no correlacionados)
3. Capturan cantidades decrecientes de varianza

**Pensalo como:** rotar los datos para alinearlos con sus ejes naturales de variación.

### Fundamento matemático

1. **Centrar los datos:** restar la media de cada característica
2. **Calcular la matriz de covarianza:** $\mathbf{\Sigma} = \frac{1}{n-1}\mathbf{X}^\top\mathbf{X}$
3. **Descomposición en valores propios:** $\mathbf{\Sigma}\mathbf{v} = \lambda\mathbf{v}$
4. **Seleccionar los K vectores propios principales:** estos son los componentes principales
5. **Proyectar los datos:** $\mathbf{X}_{\text{PCA}} = \mathbf{X}\mathbf{W}$ donde $\mathbf{W}$ contiene los K vectores propios principales

**Valores propios ($\lambda$):** cantidad de varianza explicada por cada componente
**Vectores propios ($\mathbf{v}$):** dirección de cada componente (cargas de características)

### Proporción de varianza explicada

$$\text{Proporción de varianza explicada}_k = \frac{\lambda_k}{\sum_{j=1}^{p}\lambda_j}$$

Esto nos dice qué fracción de la varianza total captura cada componente.

## Explicación visual

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

iris = load_iris()
X = iris.data

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=iris.target, cmap='viridis', alpha=0.7)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%} variance)')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%} variance)')
plt.title('PCA of Iris Dataset (2 Components)')
plt.colorbar(scatter, label='Species')
plt.savefig('figures/pca_iris.png', dpi=150)
plt.show()

print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
print(f"Cumulative: {np.cumsum(pca.explained_variance_ratio_)}")
```

## Implementación en Python

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X = StandardScaler().fit_transform(data.data)

# Full PCA
pca = PCA()
X_pca = pca.fit_transform(X)

# Explained variance
cumulative = np.cumsum(pca.explained_variance_ratio_)

plt.figure(figsize=(8, 5))
plt.bar(range(1, len(cumulative) + 1), pca.explained_variance_ratio_, alpha=0.7, label='Individual')
plt.step(range(1, len(cumulative) + 1), cumulative, where='mid', label='Cumulative')
plt.axhline(y=0.9, color='r', linestyle='--', label='90% threshold')
plt.xlabel('Principal Component')
plt.ylabel('Explained Variance Ratio')
plt.title('PCA: Explained Variance')
plt.legend()
plt.grid(True)
plt.savefig('figures/pca_variance.png', dpi=150)
plt.show()

# Number of components for 90% variance
n_90 = np.argmax(cumulative >= 0.9) + 1
print(f"Components needed for 90% variance: {n_90}")

# PCA with 2 components for visualization
pca2 = PCA(n_components=2)
X_pca2 = pca2.fit_transform(X)

plt.figure(figsize=(8, 6))
plt.scatter(X_pca2[:, 0], X_pca2[:, 1], c=data.target, cmap='RdBu', alpha=0.6)
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.title(f'Breast Cancer: 2D PCA ({pca2.explained_variance_ratio_.sum():.1%} variance)')
plt.colorbar(label='Malignant')
plt.savefig('figures/pca_breast_cancer.png', dpi=150)
plt.show()
```

## Ejemplo guiado: PCA de Iris

**Problema:** Visualizar datos de Iris 4D en 2D.

**Resultados:**
- PC1 captura ~92% de la varianza (principalmente medidas de pétalos)
- PC2 captura ~5% (principalmente medidas de sépalos)
- Juntos: ~97% de la varianza en 2 dimensiones

**Interpretación:** Setosa está claramente separada. Versicolor y Virginica se superponen ligeramente pero son distinguibles.

## Ejemplo en biotecnología: Visualización de expresión génica

```python
np.random.seed(42)
n_samples, n_genes = 200, 1000

X_expr = np.random.randn(n_samples, n_genes)
X_expr[:70, :50] += 0.5
X_expr[70:130, 50:100] += 0.5
X_expr[130:, 100:150] += 0.5
y_true = np.array([0]*70 + [1]*60 + [2]*70)

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_expr)

plt.figure(figsize=(8, 6))
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y_true, cmap='viridis', alpha=0.7)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.title('Gene Expression: PCA Visualization')
plt.colorbar(label='Subtype')
plt.show()

print(f"2 components capture {pca.explained_variance_ratio_.sum():.1%} of variance")
```

**Interpretación:** PCA revela tres subgrupos distintos de pacientes correspondientes a los subtipos simulados.

## Ejemplo en SaaS: Factores de comportamiento de usuarios

```python
np.random.seed(42)
n_users = 500

user_data = pd.DataFrame({
    'pages_per_session': np.random.poisson(4, n_users),
    'session_duration': np.random.exponential(10, n_users),
    'features_used': np.random.poisson(8, n_users),
    'support_tickets': np.random.poisson(1, n_users),
    'days_active_per_month': np.random.randint(1, 30, n_users),
    'referrals': np.random.poisson(2, n_users),
})

X_user = StandardScaler().fit_transform(user_data)
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_user)

loadings = pd.DataFrame(
    pca.components_.T,
    columns=['PC1', 'PC2', 'PC3'],
    index=user_data.columns
)
print("Component Loadings:")
print(loadings.round(3))
print(f"\nExplained variance: {pca.explained_variance_ratio_.cumsum()}")
```

**Interpretación:** PC1 podría representar "compromiso" (páginas, duración, características), PC2 "necesidades de soporte" (tickets), PC3 "crecimiento" (referidos, días activo).

## Errores comunes

1. **No escalar los datos** — las características con mayor varianza dominan el primer PC
2. **Interpretar las direcciones de PCA como causales** — los componentes son matemáticos, no biológicos
3. **Usar PCA para selección de características** — PCA crea nuevas características, no selecciona las originales
4. **Asumir que PCA siempre ayuda** — si la señal está en direcciones de baja varianza, PCA podría descartarla
5. **Ignorar las cargas** — revisá siempre qué características originales contribuyen a cada componente

## Buenas prácticas

- Escalá siempre los datos antes de PCA (StandardScaler)
- Usá el gráfico de varianza explicada acumulada para elegir la cantidad de componentes
- Buscá el "codo" en el gráfico de scree (varianza vs. número de componente)
- Para visualización, 2-3 componentes suelen ser suficientes
- Examiná las cargas de los componentes para interpretar qué representa cada PC
- Considerá t-SNE o UMAP para visualización no lineal si PCA falla

## Resumen

- PCA encuentra direcciones ortogonales de máxima varianza
- Vectores propios = componentes principales; valores propios = varianza explicada
- PCA reduce dimensiones mientras preserva estructura
- Escalá siempre los datos antes de PCA
- Usá la proporción de varianza explicada para elegir la cantidad de componentes
- PCA es esencial para visualizar datos de alta dimensionalidad

## Términos clave

| Término | Definición |
|---------|------------|
| Componente Principal | Nuevo eje alineado con la máxima varianza |
| Valor propio | Cantidad de varianza capturada por un componente |
| Vector propio | Dirección de un componente principal |
| Proporción de varianza explicada | Fracción de la varianza total por componente |
| Cargas | Contribución de las características originales a cada PC |
| Reducción de dimensionalidad | Reducir la cantidad de características preservando información |

## Ejercicios

**Nivel 1 — Básico:** Si el 95% de la varianza es capturada por 3 componentes de 30 características originales, ¿qué significa esto?

**Nivel 2 — Implementación:** Aplicá PCA al dataset breast cancer (30 características). Graficá la varianza explicada acumulada y determiná cuántos componentes capturan el 95% de la varianza.

**Nivel 3 — Pensamiento crítico:** Aplicás PCA a datos de expresión génica y PC1 separa a los pacientes por edad en lugar de por estado de enfermedad. ¿Qué pasó? ¿Cómo lo arreglarías?

## Desafío de programación

Escribí una función `pca_analysis(X, n_components)` que:
1. Escale los datos
2. Ajuste PCA
3. Devuelva los datos transformados, las proporciones de varianza explicada y las cargas
4. Imprima cuántos componentes se necesitan para el 90% de la varianza
