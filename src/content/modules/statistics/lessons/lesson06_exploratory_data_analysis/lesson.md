---
Module: 3
Lesson Number: 6
Lesson Title: Análisis Exploratorio de Datos (EDA)
Estimated Duration: 90 minutos
Prerequisites: Lecciones 1-5
Learning Objectives:
  - Detectar y manejar valores faltantes en un conjunto de datos
  - Identificar valores atípicos usando múltiples métodos
  - Crear visualizaciones efectivas para la exploración de datos
  - Generar reportes EDA automatizados con pandas-profiling
  - Diseñar un flujo de trabajo EDA sistemático
Keywords: EDA, valores faltantes, valores atípicos, visualización, pandas profiling, exploración de features
Difficulty: Intermedio
Programming Concepts: pandas, matplotlib, seaborn, pandas-profiling
Mathematical Concepts: IQR, puntajes Z, análisis de distribución
Machine Learning Concepts: calidad de datos, comprensión de features, preprocesamiento
Datasets Used: pingüinos, titanic, California housing
Notebook: 06_exploratory_data_analysis.ipynb
Assignment: eda_assignment.md
Quiz: eda_quiz.md
---

# Lección 6: Análisis Exploratorio de Datos (EDA)

## Motivación

Antes de construir cualquier modelo de machine learning, debés entender tus datos. El EDA es el proceso sistemático de examinar datos para detectar problemas, descubrir patrones y generar hipótesis. La mitad del tiempo en cualquier proyecto real de ML se gasta en EDA y limpieza de datos. Saltarse el EDA lleva a modelos basura, conclusiones sesgadas y errores vergonzosos.

En biotecnología, el EDA revela efectos de lote, datos genéticos faltantes y contaminación de muestras. En SaaS, el EDA descubre errores de tracking, comportamiento anómalo de usuarios y patrones estacionales.

## Panorama General

Esta lección integra todo lo que aprendiste en las Lecciones 1-5: estadística descriptiva, distribuciones y relaciones. Vas a aplicar todo de forma sistemática para explorar un nuevo dataset. Esto te prepara para las lecciones restantes (PCA, clustering, evaluación de modelos) y para todo el Módulo 4.

## Teoría

### El Flujo de Trabajo EDA

1. **Vista general de datos**: forma, columnas, tipos, uso de memoria
2. **Análisis de valores faltantes**: conteo, porcentaje, patrones
3. **Análisis univariado**: estadística descriptiva, distribuciones
4. **Análisis bivariado**: relaciones, correlaciones
5. **Análisis multivariado**: interacciones, agrupaciones
6. **Detección de valores atípicos**: métodos estadísticos y visuales
7. **Resumen y plan de acción**: qué limpiar, transformar o investigar

### Análisis de Valores Faltantes

Tipos de datos faltantes:
- **MCAR** (Missing Completely At Random): Sin razón sistemática (ej., pérdida accidental de datos)
- **MAR** (Missing At Random): El dato faltante depende de datos observados (ej., pacientes mayores tienen más probabilidad de saltarse un test)
- **MNAR** (Missing Not At Random): El dato faltante depende de datos no observados (ej., pacientes con síntomas graves no los reportan)

Estrategias de manejo:
- Eliminar filas/columnas con demasiados valores faltantes
- Imputar con media, mediana, moda
- Usar imputación basada en modelos (ej., KNN, MICE)

### Métodos de Detección de Valores Atípicos

1. **Método del puntaje Z**: Marcar puntos con |Z| > 3
2. **Método del IQR**: Marcar puntos más allá de 1.5×IQR desde los cuartiles
3. **Isolation Forest**: Detección de valores atípicos basada en ML
4. **Métodos visuales**: Diagramas de caja, gráficos de dispersión

### EDA Automatizado

`pandas-profiling` (ahora `ydata-profiling`) genera un reporte EDA completo:

```python
# from ydata_profiling import ProfileReport
# profile = ProfileReport(df, title="Reporte EDA")
# profile.to_file("eda_report.html")
```

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Cargar dataset con valores faltantes
titanic = sns.load_dataset('titanic')

# 1. Vista general de datos
print("Forma:", titanic.shape)
print("\nInfo:")
titanic.info()
print("\nPrimeras 5 filas:")
print(titanic.head())

# 2. Valores faltantes
missing = titanic.isnull().sum()
missing_pct = (missing / len(titanic)) * 100
missing_df = pd.DataFrame({'Faltantes': missing, 'Porcentaje': missing_pct})
print("\nValores Faltantes:")
print(missing_df[missing_df['Faltantes'] > 0])

# 3. Visualizar datos faltantes
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
sns.heatmap(titanic.isnull(), cbar=False, yticklabels=False, cmap='viridis')
plt.title('Mapa de Calor de Valores Faltantes')

plt.subplot(1, 2, 2)
missing_pct[missing_pct > 0].plot(kind='bar', color='coral')
plt.title('Porcentaje de Valores Faltantes')
plt.ylabel('Porcentaje')
plt.tight_layout()
plt.show()

# 4. Análisis univariado
print("\nEstadística descriptiva:")
print(titanic.describe())

# Distribución de edad
plt.figure(figsize=(12, 4))
plt.subplot(1, 3, 1)
sns.histplot(titanic['age'].dropna(), bins=30, kde=True)
plt.title('Distribución de Edad')

plt.subplot(1, 3, 2)
titanic['sex'].value_counts().plot(kind='bar', color='steelblue')
plt.title('Distribución por Sexo')

plt.subplot(1, 3, 3)
titanic['pclass'].value_counts().sort_index().plot(kind='bar', color='seagreen')
plt.title('Clase de Pasajero')
plt.tight_layout()
plt.show()

# 5. Análisis bivariado
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
sns.boxplot(x='pclass', y='age', data=titanic)
plt.title('Edad por Clase de Pasajero')

plt.subplot(1, 2, 2)
sns.countplot(x='pclass', hue='survived', data=titanic)
plt.title('Supervivencia por Clase de Pasajero')
plt.tight_layout()
plt.show()

# 6. Detección de valores atípicos en tarifa
q1 = titanic['fare'].quantile(0.25)
q3 = titanic['fare'].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
outliers = titanic[(titanic['fare'] < lower) | (titanic['fare'] > upper)]
print(f"\nValores atípicos en tarifa: {len(outliers)} filas")
print(f"Rango de tarifas: ${titanic['fare'].min():.2f} - ${titanic['fare'].max():.2f}")
print(f"Límites IQR: [${lower:.2f}, ${upper:.2f}]")
```

## Ejemplo Guiado

EDA completo del dataset Titanic.

```python
# EDA sistemático
def eda_summary(df):
    summary = {
        'filas': df.shape[0],
        'columnas': df.shape[1],
        'celdas_faltantes': df.isnull().sum().sum(),
        'porcentaje_faltante': (df.isnull().sum().sum() / (df.shape[0] * df.shape[1])) * 100,
        'filas_duplicadas': df.duplicated().sum(),
        'columnas_numericas': df.select_dtypes(include=[np.number]).shape[1],
        'columnas_categoricas': df.select_dtypes(include=['object', 'category']).shape[1]
    }
    return summary

print(eda_summary(titanic))

# Manejar valores faltantes
titanic_clean = titanic.copy()
titanic_clean['age'].fillna(titanic_clean['age'].median(), inplace=True)
titanic_clean['embarked'].fillna(titanic_clean['embarked'].mode()[0], inplace=True)
titanic_clean.drop(columns=['deck'], inplace=True)  # too many missing / demasiados faltantes

# Correlación con el objetivo
numeric = titanic_clean.select_dtypes(include=[np.number])
corr_with_survived = numeric.corr()['survived'].sort_values(ascending=False)
print("\nCorrelación con Supervivencia:")
print(corr_with_survived)
```

## Ejemplo de Biotecnología

EDA de un dataset sintético de expresión génica.

```python
np.random.seed(42)
n_genes = 100
n_samples = 50

# Crear datos de expresión sintéticos
expression_data = pd.DataFrame(
    np.random.randn(n_samples, n_genes),
    columns=[f'Gene_{i}' for i in range(n_genes)]
)
expression_data['condition'] = ['control'] * 25 + ['treatment'] * 25

# Agregar algunos valores faltantes
mask = np.random.random(expression_data.shape) < 0.02
expression_data = expression_data.mask(mask)

# Agregar valores atípicos
expression_data.iloc[0, 0] = 50  # extreme outlier / valor atípico extremo

print(f"Forma: {expression_data.shape}")
print(f"Valores faltantes: {expression_data.isnull().sum().sum()}")

# Verificar efectos de lote
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
expression_data.iloc[:, :10].boxplot()
plt.title('Expresión de los Primeros 10 Genes')
plt.xticks(rotation=45)

plt.subplot(1, 2, 2)
expression_data.groupby('condition').mean().T.plot(kind='kde')
plt.title('Densidad de Expresión por Condición')
plt.tight_layout()
plt.show()
```

## Ejemplo SaaS

EDA de datos de engagement de usuarios.

```python
np.random.seed(42)
n_users = 1000
saas_data = pd.DataFrame({
    'user_id': range(n_users),
    'signup_date': pd.date_range('2024-01-01', periods=n_users, freq='h'),
    'plan': np.random.choice(['free', 'basic', 'premium'], n_users, p=[0.5, 0.3, 0.2]),
    'session_count': np.random.poisson(10, n_users),
    'revenue': np.random.exponential(50, n_users),
    'churned': np.random.choice([0, 1], n_users, p=[0.8, 0.2])
})

# Introducir valores faltantes
saas_data.loc[np.random.random(n_users) < 0.05, 'revenue'] = np.nan

print("Vista General de Datos SaaS:")
print(saas_data.info())
print(f"\nIngresos faltantes: {saas_data['revenue'].isnull().sum()}")

# Análisis de deserción
plt.figure(figsize=(12, 4))
plt.subplot(1, 3, 1)
sns.boxplot(x='churned', y='session_count', data=saas_data)
plt.title('Sesiones por Deserción')

plt.subplot(1, 3, 2)
sns.boxplot(x='plan', y='revenue', data=saas_data)
plt.title('Ingresos por Plan')

plt.subplot(1, 3, 3)
saas_data['churned'].value_counts().plot(kind='bar', color=['steelblue', 'coral'])
plt.title('Distribución de Deserción')
plt.tight_layout()
plt.show()
```

## Errores Comunes

1. **Saltarse el EDA por completo**: El error más común y costoso. Explorá siempre primero.
2. **No visualizar**: Solo los estadísticos de resumen no pueden revelar distribuciones multimodales o patrones inusuales.
3. **Ignorar los patrones de datos faltantes**: Los datos faltantes raramente son aleatorios. Analizá por qué faltan valores.
4. **Eliminar todos los valores atípicos sin investigación**: Los valores atípicos pueden ser los puntos de datos más interesantes.
5. **Data leakage**: Limpiar datos usando información del dataset completo antes de dividir.

## Mejores Prácticas

- Establecé siempre una semilla aleatoria para reproducibilidad
- Documentá cada decisión de limpieza
- Creá funciones EDA reutilizables
- Usá profiling automatizado para la exploración inicial
- Investigá los valores faltantes antes de decidir cómo manejarlos
- Mantené los datos originales intactos; trabajá sobre copias

## Resumen

- El EDA es la exploración sistemática de los datos antes del modelado
- Análisis de valores faltantes: identificar, visualizar, manejar
- Detección de valores atípicos: IQR, puntaje Z, visualización
- Profiling automatizado: pandas-profiling para reportes rápidos
- Combiná siempre resúmenes numéricos con visualizaciones

## Términos Clave

| Término | Definición |
|---------|------------|
| EDA | Análisis Exploratorio de Datos — exploración sistemática de datos |
| MCAR | Missing Completely At Random (falta completamente al azar) |
| MAR | Missing At Random (falta al azar) |
| MNAR | Missing Not At Random (falta no al azar) |
| Imputación | Completar valores faltantes con estimaciones |
| Isolation Forest | Algoritmo de ML para detección de valores atípicos |
| Efecto de Lote | Variación técnica sistemática entre lotes experimentales |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. ¿Cuáles son los tres tipos de datos faltantes? Da un ejemplo de cada uno en el contexto de un ensayo clínico.
2. ¿Por qué no deberíamos eliminar todos los valores atípicos sin investigación?

**Nivel 2: Implementación**

3. Cargá el dataset `tips` de seaborn. Realizá un EDA completo incluyendo valores faltantes, estadística descriptiva y visualizaciones.
4. Escribí una función `outlier_report(df, column)` que devuelva la cantidad y el porcentaje de valores atípicos usando los métodos IQR y puntaje Z.

**Nivel 3: Pensamiento Crítico**

5. En un dataset de expresión génica, notás que falta el 15% de los valores en el grupo de tratamiento pero solo el 2% en el grupo de control. ¿Qué tipo de datos faltantes es este? ¿Cómo lo manejarías?
6. El EDA de una empresa SaaS revela que los usuarios que se dan de baja tienen duraciones de sesión más cortas. ¿Podemos concluir que las sesiones cortas causan la deserción? ¿Qué otras explicaciones existen?

## Desafío de Programación

Escribí un script en Python que realice un EDA completo del dataset `mpg` de seaborn:
1. Imprima forma, tipos de columnas, valores faltantes
2. Calcule estadística descriptiva para todas las columnas numéricas
3. Cree una cuadrícula de 2×3 de histogramas
4. Cree un mapa de calor de matriz de correlación
5. Identifique valores atípicos en `mpg` usando los métodos IQR y puntaje Z
6. Genere un reporte de pandas-profiling
7. Escriba un resumen de 1 párrafo con los hallazgos
