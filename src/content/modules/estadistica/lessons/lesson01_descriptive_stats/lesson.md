---
Module: 3
Lesson Number: 1
Lesson Title: Estadística Descriptiva
Estimated Duration: 75 minutos
Prerequisites: Módulo 2 (Fundamentos de Programación en Python)
Learning Objectives:
  - Explicar la diferencia entre medidas de tendencia central y medidas de dispersión
  - Calcular media, mediana, moda, varianza, desviación estándar, rango e IQR usando Python
  - Interpretar estadísticas descriptivas para resumir un conjunto de datos
  - Elegir la medida de tendencia central adecuada según la distribución de los datos
  - Identificar valores atípicos usando el método del IQR
Keywords: media, mediana, moda, varianza, desviación estándar, rango, IQR, diagrama de caja, estadística descriptiva
Difficulty: Principiante
Programming Concepts: numpy, pandas, matplotlib
Mathematical Concepts: media, varianza, desviación estándar, cuartiles, percentiles
Machine Learning Concepts: resumen de datos, comprensión de features
Datasets Used: Puntajes de examen sintéticos de estudiantes, dataset de diabetes
Notebook: 01_descriptive_statistics.ipynb
Assignment: descriptive_statistics_assignment.md
Quiz: descriptive_statistics_quiz.md
---

# Lección 1: Estadística Descriptiva

## Motivación

Imaginá que acabás de secuenciar 10.000 genes de una muestra de un paciente. Necesitás comunicar qué genes se expresan de forma consistente y cuáles varían drásticamente entre pacientes. Sin estadística descriptiva, tendrías que leer 10.000 números uno por uno. La estadística descriptiva condensa conjuntos de datos enteros en un puñado de números significativos, permitiendo a científicos y analistas entender los datos de un vistazo.

En biotecnología, la estadística descriptiva ayuda a responder preguntas como: ¿Cuál es el nivel de expresión promedio de un gen en una población? ¿Qué tan variable es la respuesta a un fármaco? En SaaS, la estadística descriptiva resume métricas de engagement de usuarios como usuarios activos diarios o duración de sesiones.

## Panorama General

En el módulo anterior, aprendiste a manipular datos usando Python, NumPy y Pandas. Ahora aprenderás a describir datos numéricamente. Esta lección sienta las bases para todas las lecciones de estadística subsiguientes. En la Lección 2, visualizarás estos mismos conceptos descriptivos usando histogramas y gráficos de densidad.

## Teoría

### Medidas de Tendencia Central

Las medidas de tendencia central indican dónde se encuentra el "centro" de un conjunto de datos.

**Media (Promedio)**

La media aritmética es la suma de todos los valores dividida por la cantidad de valores.

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

Intuición: La media es el punto de equilibrio de los datos. Si colocaras cada punto de datos en una recta numérica con pesos iguales, la media es donde se equilibraría el fulcro.

**Mediana**

La mediana es el valor del medio cuando los datos están ordenados de forma ascendente.

$$\text{mediana} = \begin{cases} x_{(n+1)/2} & \text{si } n \text{ es impar} \\ \frac{x_{n/2} + x_{(n/2)+1}}{2} & \text{si } n \text{ es par} \end{cases}$$

Intuición: La mediana divide el conjunto de datos en dos mitades iguales. A diferencia de la media, no se ve afectada por valores extremos.

**Moda**

La moda es el valor más frecuente en un conjunto de datos. Un conjunto puede tener una moda (unimodal), dos modas (bimodal) o más.

Intuición: La moda indica la categoría o el valor más común.

### Medidas de Dispersión

Las medidas de dispersión indican qué tan dispersos están los datos.

**Rango**

$$\text{Rango} = \max(x) - \min(x)$$

Intuición: El rango da el recorrido total de los datos. Es muy sensible a valores atípicos.

**Varianza**

$$\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2$$

Intuición: La varianza mide la distancia cuadrática promedio desde la media. Una varianza más grande significa que los puntos están más dispersos.

**Desviación Estándar**

$$\sigma = \sqrt{\sigma^2}$$

Intuición: La desviación estándar es la distancia típica de un punto de datos respecto a la media. Como está en las mismas unidades que los datos originales, es más interpretable que la varianza.

**Rango Intercuartílico (IQR)**

$$\text{IQR} = Q_3 - Q_1$$

Donde \(Q_1\) es el percentil 25 y \(Q_3\) es el percentil 75.

Intuición: El IQR contiene el 50% central de los datos. Es robusto frente a valores atípicos.

### Detección de Valores Atípicos Usando IQR

Una regla común: cualquier punto por debajo de \(Q_1 - 1.5 \times \text{IQR}\) o por encima de \(Q_3 + 1.5 \times \text{IQR}\) se considera un valor atípico.

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Datos de ejemplo: puntajes de examen para 30 estudiantes
# Datos de ejemplo: puntajes de examen para 30 estudiantes
scores = [78, 85, 92, 67, 88, 95, 73, 81, 90, 76,
          84, 91, 69, 87, 93, 75, 82, 89, 96, 71,
          79, 86, 94, 68, 83, 97, 77, 80, 99, 100]

# Convertir a array de numpy
# Convertir a array de numpy
scores = np.array(scores)

# Tendencia central
# Tendencia central
mean = np.mean(scores)
median = np.median(scores)
mode = pd.Series(scores).mode().values

print(f"Media: {mean:.2f}")
print(f"Mediana: {median:.2f}")
print(f"Moda: {mode}")

# Dispersión
# Dispersión
variance = np.var(scores, ddof=0)  # varianza poblacional
std_dev = np.std(scores, ddof=0)
data_range = np.ptp(scores)  # rango (pico a pico)
q1 = np.percentile(scores, 25)
q3 = np.percentile(scores, 75)
iqr = q3 - q1

print(f"\nVarianza: {variance:.2f}")
print(f"Desviación Estándar: {std_dev:.2f}")
print(f"Rango: {data_range}")
print(f"Q1: {q1:.2f}, Q3: {q3:.2f}, IQR: {iqr:.2f}")

# Detección de valores atípicos
# Detección de valores atípicos
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr
outliers = scores[(scores < lower_bound) | (scores > upper_bound)]
print(f"\nLímites de valores atípicos: [{lower_bound:.2f}, {upper_bound:.2f}]")
print(f"Valores atípicos: {outliers}")

# Visualización con diagrama de caja
# Visualización con diagrama de caja
plt.figure(figsize=(8, 4))
plt.boxplot(scores, vert=False, patch_artist=True)
plt.title('Distribución de Puntajes de Examen')
plt.xlabel('Puntaje')
plt.tight_layout()
plt.show()
```

## Ejemplo Guiado

**Problema**: Una empresa biotecnológica está probando un nuevo fármaco. Midieron la reducción del tamaño del tumor (mm) en 20 pacientes.

```python
tumor_reduction = [12, 15, 8, 14, 16, 11, 13, 9, 17, 10,
                   14, 13, 15, 12, 11, 16, 10, 14, 13, 45]

reduction = np.array(tumor_reduction)

print("Estadística Descriptiva de Reducción Tumoral")
print(f"Media: {np.mean(reduction):.2f} mm")
print(f"Mediana: {np.median(reduction):.2f} mm")
print(f"Desvío Estándar: {np.std(reduction, ddof=0):.2f} mm")
print(f"IQR: {np.percentile(reduction, 75) - np.percentile(reduction, 25):.2f} mm")

# El valor 45 es probablemente un valor atípico — quizás error de medición o caso excepcional
# El valor 45 es probablemente un valor atípico — quizás error de medición o caso excepcional
q1 = np.percentile(reduction, 25)
q3 = np.percentile(reduction, 75)
iqr = q3 - q1
outliers = reduction[(reduction < q1 - 1.5*iqr) | (reduction > q3 + 1.5*iqr)]
print(f"Valores atípicos potenciales: {outliers}")
```

**Interpretación**: La mediana (13 mm) es más representativa que la media (14.5 mm) porque el valor atípico 45 infla la media. El IQR (4 mm) nos dice que el 50% central de los pacientes experimentó una reducción tumoral de 11 a 15 mm.

## Ejemplo de Biotecnología

Analizar datos de expresión génica de 50 muestras de pacientes. Cada muestra mide el nivel de expresión del gen supresor de tumores TP53.

```python
np.random.seed(42)
tp53_expression = np.random.normal(loc=8.5, scale=2.0, size=50)

df = pd.DataFrame({'TP53_expression': tp53_expression})
summary = df.describe()
print(summary)

# Verificando expresión anormalmente baja (posible deleción génica)
# Verificando expresión anormalmente baja (posible deleción génica)
q1 = df['TP53_expression'].quantile(0.25)
q3 = df['TP53_expression'].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
print(f"\nMuestras con expresión de TP53 inusualmente baja:")
print(df[df['TP53_expression'] < lower])
```

## Ejemplo SaaS

Analizar usuarios activos diarios (DAU) de un producto SaaS durante 90 días.

```python
np.random.seed(42)
dau = np.random.poisson(lam=1500, size=90) + np.random.randint(-50, 50, 90)

print("Usuarios Activos Diarios - Estadística Descriptiva")
print(f"Media: {np.mean(dau):.0f}")
print(f"Mediana: {np.median(dau):.0f}")
print(f"Desvío Estándar: {np.std(dau, ddof=0):.0f}")
print(f"Min: {np.min(dau)}, Max: {np.max(dau)}")

pd.Series(dau).plot(kind='hist', bins=15, edgecolor='black')
plt.title('Distribución de Usuarios Activos Diarios')
plt.xlabel('Usuarios')
plt.tight_layout()
plt.show()
```

## Errores Comunes

1. **Usar la media para datos sesgados**: La media es sensible a valores atípicos. Usá la mediana para ingresos, expresión génica con valores atípicos, o cualquier distribución sesgada.
2. **Confundir varianza muestral y poblacional**: `np.var(x)` calcula la varianza poblacional (ddof=0). Para varianza muestral, usá `np.var(x, ddof=1)`.
3. **Interpretar la desviación estándar sin contexto**: Una desviación estándar de 10 puede ser grande o chica dependiendo de la escala de los datos.
4. **Asumir que la moda es única**: En datos continuos, cada valor puede aparecer una sola vez. Usá agrupamiento o redondeo para encontrar modas significativas.

## Mejores Prácticas

- Calculá siempre juntas las medidas de tendencia central y dispersión
- Reportá mediana e IQR para distribuciones sesgadas
- Reportá media y desviación estándar para distribuciones simétricas
- Visualizá los datos con un diagrama de caja junto con los resúmenes numéricos
- Usá `df.describe()` para una visión rápida en pandas

## Resumen

- La estadística descriptiva resume datos con unos pocos números clave
- Tendencia central: media (punto de equilibrio), mediana (valor del medio), moda (más frecuente)
- Dispersión: rango (recorrido total), varianza (desviación cuadrática promedio), desviación estándar (desviación típica), IQR (dispersión del 50% central)
- La regla del IQR identifica valores atípicos como puntos más allá de 1.5×IQR desde los cuartiles
- Elegí media + desviación estándar para datos simétricos, mediana + IQR para datos sesgados

## Términos Clave

| Término | Definición |
|---------|------------|
| Media | Suma de valores dividida por la cantidad; el promedio aritmético |
| Mediana | El valor del medio cuando los datos están ordenados |
| Moda | El valor más frecuente |
| Varianza | Distancia cuadrática promedio desde la media |
| Desviación Estándar | Raíz cuadrada de la varianza; distancia típica desde la media |
| Rango | Diferencia entre el máximo y el mínimo |
| Rango Intercuartílico | Diferencia entre los percentiles 75 y 25 |
| Valor Atípico | Punto de datos que difiere significativamente del resto |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. Un conjunto de datos tiene valores [5, 7, 8, 8, 10, 100]. Calculá media, mediana y moda. ¿Qué medida representa mejor el centro?
2. ¿Cuál es la diferencia entre varianza y desviación estándar? ¿Por qué la desviación estándar se reporta con más frecuencia?

**Nivel 2: Implementación**

3. Usando pandas, cargá cualquier archivo CSV y calculá la media, mediana, desviación estándar, mínimo, máximo e IQR de todas las columnas numéricas.
4. Escribí una función `outlier_count(data)` que devuelva la cantidad de valores atípicos usando el método del IQR.

**Nivel 3: Pensamiento Crítico**

5. Una empresa farmacéutica reporta la efectividad media de un fármaco como 85%. Sin embargo, el 40% de los pacientes no mostró respuesta. Explicá cómo es posible esta contradicción y sugerí mejores estadísticos de resumen.
6. ¿Por qué una empresa SaaS podría rastrear la duración mediana de sesión en vez de la duración promedio de sesión?

## Desafío de Programación

Escribí un script en Python que:
1. Genere un conjunto de datos sintético de 200 valores a partir de una distribución normal con media=50 y desviación estándar=15
2. Calcule todas las estadísticas descriptivas cubiertas en esta lección
3. Identifique y elimine valores atípicos usando el método del IQR
4. Imprima un resumen comparando los conjuntos de datos original y limpio
