---
Module: 3
Lesson Number: 7
Lesson Title: Reducción de Dimensionalidad (PCA)
Estimated Duration: 90 minutos
Prerequisites: Lección 5 (Relaciones)
Learning Objectives:
  - Explicar la intuición detrás del Análisis de Componentes Principales
  - Interpretar las proporciones de varianza explicada
  - Aplicar PCA usando sklearn.decomposition.PCA
  - Visualizar datos de alta dimensionalidad en 2D usando PCA
  - Determinar el número óptimo de componentes principales
Keywords: PCA, reducción de dimensionalidad, varianza explicada, autovectores, gráfico de sedimentación, reducción de features
Difficulty: Intermedio
Programming Concepts: sklearn.decomposition.PCA, numpy, matplotlib
Mathematical Concepts: matriz de covarianza, autovalores, autovectores, transformación ortogonal
Machine Learning Concepts: reducción de dimensionalidad, extracción de features, preservación de varianza
Datasets Used: iris, wine, digits
Notebook: 07_dimensionality_reduction.ipynb
Assignment: pca_assignment.md
Quiz: pca_quiz.md
---

# Lección 7: Reducción de Dimensionalidad (PCA)

## Motivación

La biología moderna y SaaS generan datasets con cientos, miles o incluso millones de features. Un solo experimento de RNA-seq mide 20.000+ genes. Una plataforma SaaS rastrea cientos de métricas de usuarios. Trabajar con datos de alta dimensionalidad es desafiante: los modelos sobreajustan, el cálculo se vuelve lento y la visualización se vuelve imposible. El Análisis de Componentes Principales (PCA) resuelve esto encontrando una representación de menor dimensionalidad que preserva la estructura más importante de los datos.

## Panorama General

Esta lección se basa en la Lección 5 (covarianza y correlación). PCA está construida directamente sobre la matriz de covarianza. Se conecta con la Lección 8 (Clustering) — PCA se usa a menudo para visualizar clusters. También se conecta con la Lección 9 (Evaluación de Modelos) — reducir dimensiones puede mejorar el rendimiento del modelo.

## Teoría

### Intuición de PCA

PCA encuentra nuevos ejes (componentes principales) que capturan la máxima varianza en los datos.

1. El primer componente principal (PC1) es la dirección de máxima varianza
2. PC2 es la dirección de máxima varianza restante, ortogonal a PC1
3. Y así sucesivamente para PC3, PC4, ...

Pensá en PCA como rotar los datos para alinearlos con sus ejes naturales de variación.

### Fundamento Matemático

Dada una matriz de datos \(X\) (centrada, \(n\) muestras × \(p\) features):

1. Calcular la matriz de covarianza: \(\Sigma = \frac{1}{n} X^T X\)
2. Calcular autovectores y autovalores: \(\Sigma v_i = \lambda_i v_i\)
3. Ordenar autovectores por autovalores decrecientes
4. Proyectar los datos sobre los \(k\) autovectores principales: \(Z = X V_k\)

**Proporción de varianza explicada**: \(\frac{\lambda_i}{\sum_{j=1}^{p} \lambda_j}\) — la proporción de la varianza total capturada por cada CP.

### Elección del Número de Componentes

- **Gráfico de sedimentación (scree plot)**: Trazar autovalores y buscar el "codo"
- **Varianza explicada acumulada**: Elegir suficientes CP para explicar el 70-95% de la varianza
- **Criterio de Kaiser**: Conservar componentes con autovalor > 1

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import seaborn as sns

# Cargar dataset iris
iris = sns.load_dataset('iris')
X = iris.drop('species', axis=1)
y = iris['species']

# Estandarizar (crucial para PCA)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Aplicar PCA
pca = PCA()
X_pca = pca.fit_transform(X_scaled)

# Varianza explicada
print("Proporción de varianza explicada:", pca.explained_variance_ratio_)
print("Acumulada:", np.cumsum(pca.explained_variance_ratio_))

# Gráfico de sedimentación
plt.figure(figsize=(8, 4))
plt.subplot(1, 2, 1)
plt.bar(range(1, len(pca.explained_variance_ratio_) + 1),
        pca.explained_variance_ratio_, color='steelblue')
plt.plot(range(1, len(pca.explained_variance_ratio_) + 1),
         np.cumsum(pca.explained_variance_ratio_), 'ro-')
plt.xlabel('Componente Principal')
plt.ylabel('Proporción de Varianza Explicada')
plt.title('Gráfico de Sedimentación')

# Proyección 2D
plt.subplot(1, 2, 2)
species_codes = {'setosa': 'red', 'versicolor': 'blue', 'virginica': 'green'}
for species, color in species_codes.items():
    mask = y == species
    plt.scatter(X_pca[mask, 0], X_pca[mask, 1], c=color, label=species, alpha=0.7)
plt.xlabel('CP1 ({:.1f}%)'.format(pca.explained_variance_ratio_[0] * 100))
plt.ylabel('CP2 ({:.1f}%)'.format(pca.explained_variance_ratio_[1] * 100))
plt.title('PCA del Dataset Iris')
plt.legend()
plt.tight_layout()
plt.show()

# Cargas (contribución de las features a los CP)
loadings = pd.DataFrame(
    pca.components_.T,
    columns=[f'CP{i+1}' for i in range(4)],
    index=iris.columns[:4]
)
print("\nCargas de PCA (contribución de features):")
print(loadings)
```

## Ejemplo Guiado

PCA en el dataset Wine para distinguir cultivares de vino.

```python
from sklearn.datasets import load_wine
wine = load_wine()
X = wine.data
y = wine.target
feature_names = wine.feature_names

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

print(f"Varianza explicada (2 componentes): {pca.explained_variance_ratio_.sum():.3f}")

plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', alpha=0.7)
plt.xlabel(f'CP1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'CP2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.colorbar(scatter, label='Cultivar')
plt.title('PCA del Dataset Wine')
plt.show()

# Contribución de features a CP1
loadings = pd.Series(pca.components_[0], index=feature_names)
top_features = loadings.abs().sort_values(ascending=False).head(5)
print("\nTop 5 features que contribuyen a CP1:")
print(top_features)
```

Interpretación: Los cultivares de vino se separan bien en los dos primeros componentes principales. CP1 está impulsado por prolina, flavonoides y OD280 (compuestos fenólicos).

## Ejemplo de Biotecnología

PCA de datos de expresión génica para muestras de cáncer vs normales.

```python
np.random.seed(42)
n_genes = 1000
n_samples = 60

# Simular expresión génica
expression = np.random.randn(n_samples, n_genes)
# Crear diferencias de grupo
expression[:30, :50] += 1.5  # cancer group / grupo cáncer
labels = ['cancer'] * 30 + ['normal'] * 30

scaler = StandardScaler()
expr_scaled = scaler.fit_transform(expression)

pca = PCA(n_components=2)
expr_pca = pca.fit_transform(expr_scaled)

plt.figure(figsize=(8, 6))
colors = {'cancer': 'red', 'normal': 'blue'}
for label in ['cancer', 'normal']:
    mask = np.array(labels) == label
    plt.scatter(expr_pca[mask, 0], expr_pca[mask, 1], c=colors[label],
                label=label, alpha=0.7)
plt.xlabel(f'CP1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'CP2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.title('PCA de Expresión Génica: Cáncer vs Normal')
plt.legend()
plt.show()
```

## Ejemplo SaaS

PCA de métricas de comportamiento de clientes para segmentación.

```python
np.random.seed(42)
n_customers = 500
saas_features = pd.DataFrame({
    'session_frequency': np.random.poisson(15, n_customers),
    'avg_session_duration': np.random.exponential(20, n_customers),
    'pages_per_session': np.random.poisson(6, n_customers),
    'feature_usage_count': np.random.poisson(8, n_customers),
    'support_tickets': np.random.poisson(1, n_customers),
    'days_since_signup': np.random.exponential(100, n_customers),
    'revenue': np.random.exponential(30, n_customers)
})

scaler = StandardScaler()
saas_scaled = scaler.fit_transform(saas_features)

pca = PCA(n_components=3)
saas_pca = pca.fit_transform(saas_scaled)

print("Proporciones de varianza explicada:", pca.explained_variance_ratio_)
print(f"Acumulada (3 componentes): {pca.explained_variance_ratio_.sum():.3f}")

# Dispersión 3D si es posible, sino 2D
plt.figure(figsize=(8, 6))
plt.scatter(saas_pca[:, 0], saas_pca[:, 1], alpha=0.6, c=saas_features['revenue'], cmap='viridis')
plt.colorbar(label='Ingresos')
plt.xlabel('CP1')
plt.ylabel('CP2')
plt.title('PCA de Métricas de Clientes SaaS')
plt.show()
```

## Errores Comunes

1. **No estandarizar los datos antes de PCA**: PCA es sensible a las escalas de las variables. Estandarizá siempre.
2. **Interpretar las direcciones de PCA como causales**: PCA encuentra estructura correlacional, no mecanismos causales.
3. **Forzar la interpretación de todos los componentes**: Los componentes superiores suelen capturar ruido.
4. **Usar PCA en datos categóricos**: PCA está diseñada para variables continuas.
5. **Conservar muy pocos componentes**: Puede descartar señal importante.

## Mejores Prácticas

- Estandarizá siempre (puntaje Z) las features antes de PCA
- Usá el gráfico de sedimentación + varianza acumulada para elegir componentes
- Examiná las cargas (loadings) para interpretar los componentes
- Considerá el conocimiento del dominio al interpretar los CP
- Recordá: PCA es no supervisado — no usa etiquetas

## Resumen

- PCA encuentra direcciones ortogonales de máxima varianza
- Construida sobre la descomposición en autovalores de la matriz de covarianza
- La proporción de varianza explicada indica cuánta información captura cada CP
- Estandarizá siempre los datos antes de PCA
- PCA se usa para visualización, eliminación de ruido y preprocesamiento

## Términos Clave

| Término | Definición |
|---------|------------|
| Componente Principal | Nueva variable que captura la máxima varianza |
| Autovalor | Cantidad de varianza capturada por un CP |
| Autovector | Dirección de un CP (cargas) |
| Proporción de Varianza Explicada | Proporción de la varianza total por CP |
| Gráfico de Sedimentación | Gráfico de autovalores por número de componente |
| Carga | Contribución de una feature original a un CP |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. ¿Por qué debemos estandarizar los datos antes de PCA? ¿Qué pasa si no lo hacemos?
2. Si los primeros dos CP explican el 90% de la varianza, ¿qué significa esto sobre los datos?

**Nivel 2: Implementación**

3. Cargá el dataset digits de sklearn. Aplicá PCA y trazá los dos primeros componentes coloreados por dígito.
4. Determiná el número mínimo de CP necesarios para explicar el 95% de la varianza en el dataset wine.

**Nivel 3: Pensamiento Crítico**

5. Un bioinformático aplica PCA a datos de RNA-seq y encuentra que CP1 separa lotes (diferentes corridas de secuenciación) en lugar de condiciones biológicas. ¿Qué significa esto? ¿Cómo debería proceder?
6. En un contexto SaaS, CP1 carga fuertemente en "cantidad de sesiones" y "páginas por sesión" con coeficientes similares. ¿Cómo interpretarías este componente?

## Desafío de Programación

Escribí un script en Python que:
1. Cargue el dataset de cáncer de mama de sklearn
2. Estandarice las features
3. Aplique PCA y trace la varianza explicada acumulada
4. Encuentre el número mínimo de componentes para 90% de varianza explicada
5. Cree un gráfico PCA 2D coloreado por diagnóstico (maligno vs benigno)
6. Interprete qué features originales contribuyen más a CP1
