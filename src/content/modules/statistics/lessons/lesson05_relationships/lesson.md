---
Module: 3
Lesson Number: 5
Lesson Title: Relaciones Entre Variables
Estimated Duration: 60 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  - Calcular e interpretar la covarianza entre dos variables
  - Distinguir entre correlación de Pearson y de Spearman
  - Crear e interpretar un mapa de calor de matriz de correlación
  - Elegir el coeficiente de correlación adecuado según las características de los datos
  - Identificar correlaciones espurias
Keywords: covarianza, correlación de Pearson, correlación de Spearman, matriz de correlación, mapa de calor, relación monótona
Difficulty: Principiante
Programming Concepts: numpy, pandas, matplotlib, seaborn
Mathematical Concepts: covarianza, coeficiente de correlación, correlación por rangos
Machine Learning Concepts: relaciones entre features, multicolinealidad, selección de features
Datasets Used: dataset iris, datos sintéticos, dataset de pingüinos
Notebook: 05_relationships.ipynb
Assignment: relationships_assignment.md
Quiz: relationships_quiz.md
---

# Lección 5: Relaciones Entre Variables

## Motivación

En machine learning, raramente trabajamos con variables aisladas. La relación entre las features — y entre las features y el objetivo — determina qué algoritmos funcionarán bien. Dos genes pueden estar co-expresados (niveles de expresión correlacionados). La edad del cliente y la duración de la suscripción pueden estar correlacionados. Entender estas relaciones te ayuda a seleccionar features, detectar multicolinealidad y obtener conocimiento del sistema subyacente.

## Panorama General

Ya sabés cómo describir variables individuales (Lecciones 1-2). Ahora aprenderás a cuantificar relaciones entre pares de variables. Esto es esencial para:
- Lección 6 (EDA): las relaciones son una parte clave de la exploración
- Lección 7 (PCA): PCA está construida sobre la matriz de covarianza
- Todo el Módulo 4: la correlación informa la selección de features y la elección del modelo

## Teoría

### Covarianza

La covarianza mide cómo dos variables varían juntas.

$$\text{Cov}(X, Y) = \frac{1}{n} \sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})$$

Intuición: Cuando X está por encima de su media, ¿Y también está por encima de su media? Si sí, la covarianza es positiva. Si es al revés, negativa. Si no hay patrón, cercana a cero.

**Limitación**: La covarianza depende de la escala de las variables. Dos variables medidas en distintas unidades no se pueden comparar solo por su covarianza.

### Coeficiente de Correlación de Pearson

$$\rho_{X,Y} = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y}$$

Esto normaliza la covarianza a una escala de [-1, 1].

- +1: relación lineal positiva perfecta
- 0: no hay relación lineal
- -1: relación lineal negativa perfecta

Intuición: La correlación de Pearson mide la fuerza y dirección de una relación lineal. Asume que las variables tienen distribución aproximadamente normal y que la relación es lineal.

**Supuestos**: Linealidad, normalidad (para inferencia), homocedasticidad, sin valores atípicos.

### Correlación por Rangos de Spearman

La correlación de Spearman usa rangos en lugar de valores originales.

$$\rho_s = \frac{\text{Cov}(R(X), R(Y))}{\sigma_{R(X)} \sigma_{R(Y)}}$$

Donde \(R(X)\) son los rangos de \(X\).

Intuición: Spearman mide relaciones monótonas (no solo lineales). Si Y aumenta consistentemente a medida que X aumenta, Spearman es alto, incluso si la relación es curvada.

**Ventajas**: No requiere supuesto de normalidad, es robusta a valores atípicos, captura cualquier tendencia monótona.

### Matriz de Correlación

Una matriz cuadrada que muestra las correlaciones por pares entre todas las variables.

$$R = \begin{bmatrix} 1 & \rho_{12} & \cdots & \rho_{1p} \\ \rho_{21} & 1 & \cdots & \rho_{2p} \\ \vdots & \vdots & \ddots & \vdots \\ \rho_{p1} & \rho_{p2} & \cdots & 1 \end{bmatrix}$$

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Generar datos con diferentes relaciones
np.random.seed(42)
n = 200
x = np.random.normal(0, 1, n)

# Lineal positiva
y_linear = 2 * x + np.random.normal(0, 0.5, n)

# No lineal monótona
y_nonlinear = x**3 + np.random.normal(0, 1, n)

# Sin relación
y_none = np.random.normal(0, 1, n)

# Pearson vs Spearman
from scipy.stats import pearsonr, spearmanr

print("Relación lineal:")
print(f"  Pearson: {pearsonr(x, y_linear)[0]:.3f}, Spearman: {spearmanr(x, y_linear)[0]:.3f}")

print("\nNo lineal monótona:")
print(f"  Pearson: {pearsonr(x, y_nonlinear)[0]:.3f}, Spearman: {spearmanr(x, y_nonlinear)[0]:.3f}")

print("\nSin relación:")
print(f"  Pearson: {pearsonr(x, y_none)[0]:.3f}, Spearman: {spearmanr(x, y_none)[0]:.3f}")

# Visualizar
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
axes[0].scatter(x, y_linear, alpha=0.6)
axes[0].set_title(f'Lineal (Pearson={pearsonr(x, y_linear)[0]:.2f})')
axes[1].scatter(x, y_nonlinear, alpha=0.6)
axes[1].set_title(f'No lineal (Spearman={spearmanr(x, y_nonlinear)[0]:.2f})')
axes[2].scatter(x, y_none, alpha=0.6)
axes[2].set_title('Sin Relación')
plt.tight_layout()
plt.show()
```

### Matriz de Correlación con Mapa de Calor

```python
# Cargar dataset iris
iris = sns.load_dataset('iris')
numeric_cols = iris.select_dtypes(include=[np.number])

# Calcular matriz de correlación
corr_matrix = numeric_cols.corr()

# Visualizar con mapa de calor
plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='RdBu_r', center=0,
            square=True, linewidths=1, fmt='.2f')
plt.title('Dataset Iris - Matriz de Correlación')
plt.tight_layout()
plt.show()
```

## Ejemplo Guiado

Analizar relaciones en el dataset de pingüinos.

```python
penguins = sns.load_dataset('penguins').dropna()

# Calcular correlaciones por pares
numeric_cols = penguins.select_dtypes(include=[np.number])
corr = numeric_cols.corr()
print("Matriz de Correlación:")
print(corr)

# Mapa de calor
plt.figure(figsize=(8, 6))
sns.heatmap(corr, annot=True, cmap='coolwarm', center=0, square=True, fmt='.2f')
plt.title('Medidas de Pingüinos - Matriz de Correlación')
plt.tight_layout()
plt.show()

# Pairplot
sns.pairplot(penguins, hue='species')
plt.show()
```

Interpretación: La longitud de la aleta y la masa corporal están altamente correlacionadas (r ≈ 0.87). La longitud del pico y la profundidad del pico tienen correlación negativa moderada en algunas especies.

## Ejemplo de Biotecnología

Análisis de co-expresión génica.

```python
np.random.seed(42)
n_genes = 1000
n_samples = 50

# Simular matriz de expresión génica
expression = np.random.randn(n_samples, n_genes)
gene_names = [f'GENE_{i}' for i in range(n_genes)]
df_expr = pd.DataFrame(expression, columns=gene_names)

# Hacer que algunos genes estén co-expresados
df_expr['GENE_0'] = df_expr['GENE_1'] * 0.9 + np.random.randn(n_samples) * 0.1
df_expr['GENE_2'] = -df_expr['GENE_3'] * 0.8 + np.random.randn(n_samples) * 0.2

# Encontrar pares de genes altamente correlacionados
corr_matrix = df_expr.corr()
high_corr = np.where(np.abs(corr_matrix) > 0.8)
high_corr_pairs = [(gene_names[i], gene_names[j], corr_matrix.iloc[i, j])
                   for i, j in zip(*high_corr) if i < j]
print(f"Pares altamente correlacionados (|r| > 0.8):")
for g1, g2, r in high_corr_pairs[:5]:
    print(f"  {g1} - {g2}: r = {r:.3f}")
```

## Ejemplo SaaS

Correlación de métricas de engagement de usuarios.

```python
np.random.seed(42)
n_users = 500
saas_data = pd.DataFrame({
    'session_duration_min': np.random.exponential(20, n_users),
    'pages_per_session': np.random.poisson(5, n_users),
    'days_since_last_login': np.random.exponential(7, n_users),
    'support_tickets': np.random.poisson(0.5, n_users),
    'subscription_months': np.random.poisson(12, n_users)
})

plt.figure(figsize=(8, 6))
sns.heatmap(saas_data.corr(), annot=True, cmap='RdBu_r', center=0,
            square=True, fmt='.2f')
plt.title('Métricas de Usuarios SaaS - Matriz de Correlación')
plt.tight_layout()
plt.show()
```

## Errores Comunes

1. **Correlación ≠ causalidad**: Una correlación alta no implica que una variable cause la otra. Las ventas de helado y los ahogamientos están correlacionados (ambos aumentan en verano) pero no tienen relación causal.
2. **Solo verificar correlación lineal**: Dos variables pueden tener una relación no lineal perfecta (ej., un círculo) con correlación de Pearson cero.
3. **Ignorar valores atípicos**: Un solo valor atípico puede inflar o desinflar drásticamente la correlación de Pearson.
4. **Sobre-interpretar correlaciones pequeñas**: Con muestras grandes, incluso r = 0.05 puede ser estadísticamente significativo pero prácticamente irrelevante.

## Mejores Prácticas

- Visualizá siempre las relaciones con gráficos de dispersión junto con los coeficientes de correlación
- Usá Spearman para relaciones monótonas no lineales
- Verificá la presencia de valores atípicos antes de interpretar la correlación de Pearson
- Reportá tanto r como el valor p al discutir significancia estadística
- Usá matrices de correlación antes de construir modelos de ML para detectar multicolinealidad

## Resumen

- La covarianza mide la variabilidad conjunta pero depende de la escala
- Correlación de Pearson: relación lineal, [-1, 1], asume normalidad
- Correlación de Spearman: relación monótona, basada en rangos
- La matriz de correlación resume todas las relaciones por pares
- Correlación ≠ causalidad
- Visualizá las relaciones con gráficos de dispersión y mapas de calor

## Términos Clave

| Término | Definición |
|---------|------------|
| Covarianza | Medida de variabilidad conjunta |
| Correlación de Pearson | Coeficiente de correlación lineal (r) |
| Correlación de Spearman | Correlación monótona basada en rangos |
| Matriz de Correlación | Tabla de correlaciones por pares |
| Mapa de Calor | Representación visual de una matriz |
| Monótona | Consistentemente creciente o decreciente |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. ¿Cuál es la diferencia entre la correlación de Pearson y la de Spearman? ¿Cuándo usarías cada una?
2. Si dos variables tienen una correlación de Pearson de -0.9, ¿qué significa esto?

**Nivel 2: Implementación**

3. Cargá el dataset `mpg` de seaborn. Calculá la correlación de Pearson y Spearman entre `mpg` y `horsepower`. Interpretá la diferencia.
4. Generá un dataset donde X e Y tengan una relación cuadrática perfecta (Y = X²). Calculá las correlaciones de Pearson y Spearman. Explicá los resultados.

**Nivel 3: Pensamiento Crítico**

5. En un estudio de expresión génica, encontrás dos genes con una correlación de Pearson de 0.95. ¿Cuáles son tres explicaciones posibles? ¿Cuál es la más plausible biológicamente?
6. Una empresa SaaS encuentra que la cantidad de tickets de soporte y la deserción de clientes están correlacionados (r = 0.6). ¿Deberían concluir que los tickets de soporte causan la deserción? ¿Qué explicaciones alternativas existen?

## Desafío de Programación

Escribí un script en Python que:
1. Genere 5 datasets sintéticos diferentes: lineal positivo, lineal negativo, cuadrático (forma de U), exponencial y un círculo
2. Para cada uno, calcule e imprima las correlaciones de Pearson y Spearman
3. Cree una cuadrícula de 2×3 de gráficos de dispersión con los coeficientes de correlación en los títulos
4. Escriba una breve interpretación de por qué Pearson y Spearman difieren (o coinciden) para cada relación
