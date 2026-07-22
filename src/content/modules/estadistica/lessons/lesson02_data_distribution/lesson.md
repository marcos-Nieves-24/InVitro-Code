---
Module: 3
Lesson Number: 2
Lesson Title: Distribución de Datos
Estimated Duration: 60 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  - Construir histogramas y gráficos de densidad usando matplotlib y seaborn
  - Interpretar valores de asimetría y curtosis
  - Distinguir entre distribuciones simétricas, con asimetría izquierda y con asimetría derecha
  - Elegir el ancho de bin adecuado para histogramas
  - Explicar cómo la forma de la distribución afecta la elección de estadísticos de resumen
Keywords: histograma, gráfico de densidad, asimetría, curtosis, KDE, forma de distribución
Difficulty: Principiante
Programming Concepts: matplotlib, seaborn, numpy, pandas
Mathematical Concepts: asimetría, curtosis, función de densidad de probabilidad
Machine Learning Concepts: comprensión de la distribución de datos
Datasets Used: Datos sintéticos, dataset de pingüinos
Notebook: 02_data_distribution.ipynb
Assignment: data_distribution_assignment.md
Quiz: data_distribution_quiz.md
---

# Lección 2: Distribución de Datos

## Motivación

En la Lección 1, aprendiste a resumir datos con un puñado de números. Pero dos conjuntos de datos muy diferentes pueden tener medias y desviaciones estándar idénticas. Visualizar la distribución revela patrones que los estadísticos de resumen no muestran: multimodalidad, huecos, agrupaciones y valores extremos. Entender la distribución de los datos es crítico antes de aplicar cualquier modelo de machine learning, ya que muchos algoritmos asumen que las features siguen una distribución normal.

En biotecnología, las formas de las distribuciones revelan si la expresión génica sigue un patrón normal o log-normal. En SaaS, los datos de actividad de usuarios suelen seguir una distribución de ley de potencias, lo que afecta cómo calculamos promedios y detectamos anomalías.

## Panorama General

La Lección 1 enseñó resúmenes numéricos; esta lección enseña resúmenes visuales. Aprenderás a ver la forma de tus datos. Esto te prepara para la Lección 3 (Probabilidad), donde las distribuciones se convierten en objetos matemáticos formales, y para la Lección 4 (Distribuciones Estadísticas), donde encontrarás distribuciones con nombre como la normal y la binomial.

## Teoría

### Histogramas

Un histograma particiona los datos en intervalos (bins) y cuenta cuántas observaciones caen en cada uno.

**Intuición**: El histograma aproxima la distribución de probabilidad subyacente de los datos. El área de cada barra representa la proporción de datos en ese intervalo.

**Elección del Ancho de Bin**: La cantidad de bins afecta drásticamente la interpretación. Muy pocos bins ocultan detalles; demasiados crean ruido.

- Regla de Sturges: \(k = \lceil \log_2 n + 1 \rceil\)
- Regla de la raíz cuadrada: \(k = \lceil \sqrt{n} \rceil\)
- Regla de Freedman-Diaconis: \(h = 2 \times \text{IQR} \times n^{-1/3}\)

### Gráficos de Densidad (KDE)

Una estimación de densidad por kernel (KDE) traza una versión suavizada del histograma.

$$\hat{f}(x) = \frac{1}{nh} \sum_{i=1}^{n} K\left(\frac{x - x_i}{h}\right)$$

Intuición: Colocá un pequeño "bache" (kernel) en cada punto de datos, luego sumá todos los baches para crear una curva suave. El ancho de banda \(h\) controla la suavidad.

### Asimetría (Skewness)

La asimetría mide la falta de simetría de la distribución.

$$\text{Asimetría} = \frac{1}{n} \sum_{i=1}^{n} \left(\frac{x_i - \bar{x}}{\sigma}\right)^3$$

- **Asimetría = 0**: Simétrica (ej., distribución normal)
- **Asimetría > 0**: Asimétrica a la derecha (cola larga a la derecha)
- **Asimetría < 0**: Asimétrica a la izquierda (cola larga a la izquierda)

Intuición: En una distribución con asimetría a la derecha, la media es mayor que la mediana porque los valores extremos altos jalan la media hacia la derecha.

### Curtosis

La curtosis mide el "peso de las colas" de la distribución.

$$\text{Curtosis} = \frac{1}{n} \sum_{i=1}^{n} \left(\frac{x_i - \bar{x}}{\sigma}\right)^4 - 3$$

(El "-3" hace que la distribución normal tenga curtosis = 0, llamada curtosis en exceso.)

- **Curtosis = 0**: Mesocúrtica (similar a la normal)
- **Curtosis > 0**: Leptocúrtica (colas pesadas, más valores atípicos)
- **Curtosis < 0**: Platicúrtica (colas livianas, menos valores atípicos)

Intuición: Una curtosis alta significa que los valores extremos son más probables que en una distribución normal. Esto importa para la evaluación de riesgos en finanzas y la detección de valores atípicos en genómica.

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Generar datos con diferentes distribuciones
np.random.seed(42)
symmetric = np.random.normal(loc=50, scale=10, size=1000)
right_skewed = np.random.exponential(scale=10, size=1000)
left_skewed = -np.random.exponential(scale=10, size=1000) + 100

# Histogramas
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

axes[0].hist(symmetric, bins=20, edgecolor='black', color='steelblue')
axes[0].set_title('Simétrica (Normal)')

axes[1].hist(right_skewed, bins=20, edgecolor='black', color='coral')
axes[1].set_title('Asimétrica a la Derecha')

axes[2].hist(left_skewed, bins=20, edgecolor='black', color='seagreen')
axes[2].set_title('Asimétrica a la Izquierda')

plt.tight_layout()
plt.show()

# Gráficos de densidad con seaborn
plt.figure(figsize=(10, 5))
sns.kdeplot(symmetric, label='Simétrica', fill=True)
sns.kdeplot(right_skewed, label='Asimétrica a la Derecha', fill=True)
sns.kdeplot(left_skewed, label='Asimétrica a la Izquierda', fill=True)
plt.title('Comparación de Gráficos de Densidad')
plt.legend()
plt.show()

# Calcular asimetría y curtosis
from scipy.stats import skew, kurtosis

print(f"Simétrica - Asimetría: {skew(symmetric):.3f}, Curtosis: {kurtosis(symmetric):.3f}")
print(f"Asimétrica a la Derecha - Asimetría: {skew(right_skewed):.3f}, Curtosis: {kurtosis(right_skewed):.3f}")
print(f"Asimétrica a la Izquierda - Asimetría: {skew(left_skewed):.3f}, Curtosis: {kurtosis(left_skewed):.3f}")
```

## Ejemplo Guiado

Analizar la distribución de la masa corporal en pingüinos.

```python
import seaborn as sns
penguins = sns.load_dataset('penguins')
penguins = penguins.dropna()

# Histograma con KDE
plt.figure(figsize=(10, 5))
sns.histplot(penguins['body_mass_g'], bins=25, kde=True, edgecolor='black')
plt.title('Distribución de la Masa Corporal de Pingüinos')
plt.xlabel('Masa Corporal (g)')
plt.tight_layout()
plt.show()

# Calcular estadísticos de forma
print(f"Asimetría: {skew(penguins['body_mass_g']):.3f}")
print(f"Curtosis: {kurtosis(penguins['body_mass_g']):.3f}")
print(f"Media: {penguins['body_mass_g'].mean():.0f} g")
print(f"Mediana: {penguins['body_mass_g'].median():.0f} g")
```

Interpretación: La distribución de la masa corporal es aproximadamente simétrica (asimetría cercana a 0). La media y la mediana están próximas. Puede haber múltiples picos reflejando diferentes especies de pingüinos.

## Ejemplo de Biotecnología

Los datos de expresión génica suelen seguir una distribución log-normal. Aplicar el logaritmo los vuelve aproximadamente normales.

```python
np.random.seed(42)
gene_expression = np.random.lognormal(mean=2.0, sigma=0.8, size=1000)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].hist(gene_expression, bins=30, edgecolor='black', color='steelblue')
axes[0].set_title('Expresión Génica Original (Log-Normal)')
axes[0].set_xlabel('Nivel de Expresión')

log_transformed = np.log1p(gene_expression)
axes[1].hist(log_transformed, bins=30, edgecolor='black', color='coral')
axes[1].set_title('Transformación Logarítmica (Aprox. Normal)')
axes[1].set_xlabel('Log(Expresión)')

plt.tight_layout()
plt.show()

print(f"Asimetría original: {skew(gene_expression):.3f}")
print(f"Asimetría con log: {skew(log_transformed):.3f}")
```

## Ejemplo SaaS

Duración de sesiones de usuarios en un producto SaaS.

```python
np.random.seed(42)
session_duration = np.random.exponential(scale=300, size=2000)  # en segundos

plt.figure(figsize=(10, 4))
sns.histplot(session_duration, bins=40, kde=True, edgecolor='black')
plt.title('Distribución de Duraciones de Sesión')
plt.xlabel('Duración (segundos)')
plt.axvline(np.mean(session_duration), color='red', linestyle='--', label=f'Media: {np.mean(session_duration):.0f}s')
plt.axvline(np.median(session_duration), color='blue', linestyle='-', label=f'Mediana: {np.median(session_duration):.0f}s')
plt.legend()
plt.show()
```

## Errores Comunes

1. **Usar muy pocos bins**: Oculta la forma de la distribución.
2. **Ignorar la multimodalidad**: Múltiples picos sugieren subgrupos (ej., diferentes especies, tipos de usuarios).
3. **Asumir normalidad**: Muchos conjuntos de datos del mundo real son asimétricos.
4. **Confundir la dirección de la asimetría**: Asimetría a la derecha = cola a la derecha, media > mediana.

## Mejores Prácticas

- Visualizá siempre tus datos antes de calcular estadísticos
- Probá múltiples anchos de bin para ver diferentes niveles de detalle
- Usá gráficos KDE junto con histogramas
- Reportá asimetría y curtosis junto con media y desviación estándar para datos no normales
- Aplicá transformación logarítmica a datos con asimetría derecha cuando sea necesario para modelos de ML

## Resumen

- Los histogramas muestran la distribución de frecuencias de los datos
- Los gráficos de densidad proveen una estimación suave de la distribución
- La asimetría mide la falta de simetría (0 = simétrico)
- La curtosis mide el peso de las colas (0 = similar a la normal)
- La forma de la distribución guía la elección de estadísticos de resumen y preprocesamiento

## Términos Clave

| Término | Definición |
|---------|------------|
| Histograma | Gráfico de barras de frecuencias de datos agrupados en bins |
| Estimación de Densidad por Kernel | Estimación suave de la densidad de probabilidad |
| Asimetría | Medida de la falta de simetría de la distribución |
| Curtosis | Medida del peso de las colas |
| Leptocúrtica | Distribución de colas pesadas |
| Platicúrtica | Distribución de colas livianas |
| Multimodal | Distribución con múltiples picos |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. Un histograma de precios de casas muestra una cola larga a la derecha. ¿Esta distribución es simétrica, asimétrica a la izquierda o a la derecha? ¿Qué implica sobre la media vs la mediana?
2. ¿Qué valor de curtosis esperarías para una distribución normal?

**Nivel 2: Implementación**

3. Generá 500 muestras de una distribución normal con media=0 y desviación estándar=1. Trazá un histograma con superposición KDE y calculá asimetría y curtosis.
4. Cargá el dataset `tips` de seaborn. Trazá histogramas de `total_bill` para cada día y compará sus formas.

**Nivel 3: Pensamiento Crítico**

5. Un investigador encuentra que los datos de expresión génica tienen curtosis alta. ¿Qué implica esto sobre la biología? ¿Cómo podría afectar al análisis posterior?
6. ¿Por qué una empresa SaaS podría preferir la mediana sobre la media al reportar el valor de vida del cliente (LTV)?

## Desafío de Programación

Escribí un script que:
1. Genere datos de cuatro distribuciones: normal, exponencial, uniforme y binomial (n=10, p=0.5)
2. Cree una cuadrícula de 2x2 de histogramas con superposición KDE
3. Imprima asimetría y curtosis para cada una
4. Incluya una breve interpretación de cada forma
