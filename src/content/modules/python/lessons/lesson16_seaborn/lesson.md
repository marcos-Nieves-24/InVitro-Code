---
Module: 2
Lesson Number: 16
Lesson Title: Seaborn
Estimated Duration: 60 minutos
Prerequisites: L15 — Matplotlib
Learning Objectives:
  - Crear visualizaciones estadísticas usando Seaborn
  - Usar pairplot y heatmap para exploración multivariable
  - Crear box plots y violin plots para comparación de distribuciones
  - Aplicar temas y paletas de colores de Seaborn
  - Personalizar gráficos de Seaborn con integración de Matplotlib
Keywords: Seaborn, pairplot, heatmap, boxplot, violinplot, paleta, tema
Difficulty: Beginner-Intermediate
Programming Concepts: Visualización estadística, exploración de datos
Datasets Used: None (datos sintéticos)
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Seaborn

## Motivación

Seaborn es una librería de visualización estadística construida sobre Matplotlib que facilita crear gráficos informativos y atractivos con código mínimo. Está diseñada específicamente para explorar y entender datos. Mientras Matplotlib te da control total, Seaborn te da valores predeterminados inteligentes y tipos de gráficos estadísticos. En biotecnología, Seaborn crea heatmaps de expresión génica listos para publicación, box plots que comparan grupos de tratamiento y pair plots para descubrimiento de biomarcadores. En SaaS, visualiza segmentos de clientes, análisis de correlación y resultados de tests A/B.

## Panorama General

En la lección anterior aprendiste Matplotlib — la base para la visualización en Python. Seaborn se basa en Matplotlib para proporcionar gráficos de más alto nivel enfocados en estadística. Combinado con Pandas para manipulación de datos, estas tres librerías (Pandas, Matplotlib, Seaborn) forman el kit de herramientas esencial de ciencia de datos. A lo largo de los módulos de ML, vas a usar Seaborn para EDA y visualización de resultados.

## Teoría

### ¿Qué es Seaborn?

Seaborn provee:
- **Tipos de gráficos estadísticos**: box, violin, swarm, pair, heatmap
- **Agregación automática**: calcula estadísticas por vos
- **Mapeo de colores inteligente**: paletas categóricas y continuas
- **Temas**: Estilos profesionales predeterminados
- **Integración con Pandas**: Funciona directamente con DataFrames

### Instalación e Importación

```bash
pip install seaborn
```

```python
import seaborn as sns
```

### Seaborn vs Matplotlib

| Característica | Matplotlib | Seaborn |
|------------|------------|---------|
| Nivel | Bajo nivel | Alto nivel |
| Estilo por defecto | Básico | Profesional |
| Soporte Pandas | Manual | Nativo |
| Gráficos estadísticos | Manual | Incorporados |
| Personalización | Completa | Buena, con acceso a Matplotlib |

### Tipos de Gráficos Clave

```python
sns.scatterplot(data=df, x="col1", y="col2", hue="category")
sns.lineplot(data=df, x="x", y="y")
sns.barplot(data=df, x="cat", y="value")
sns.boxplot(data=df, x="cat", y="value")
sns.violinplot(data=df, x="cat", y="value")
sns.histplot(data=df, x="col")
sns.kdeplot(data=df, x="col")
sns.pairplot(data=df, hue="category")
sns.heatmap(data=correlation_matrix, annot=True)
sns.clustermap(data)
```

### Temas y Paletas

```python
sns.set_theme()  # Tema predeterminado de Seaborn
sns.set_style("whitegrid")  # Estilos: darkgrid, whitegrid, dark, white, ticks
sns.set_palette("viridis")  # Paletas: deep, muted, pastel, bright, dark, colorblind
sns.color_palette("husl", 8)  # Paleta personalizada
```

## Explicación Visual

```
Tipos de Gráficos de Seaborn para Diferentes Datos

Relación:                 Distribución:
┌──────────────────┐     ┌──────────────────┐
│ Scatterplot      │     │ Histplot         │
│ ·  ·    ·        │     │ ▓▓▓▓░░░░         │
│   ·  ·    ·  ·   │     │ ▓▓▓▓▓░░░         │
│     ·  ·   ·     │     │ ▓▓▓▓▓▓░░         │
└──────────────────┘     └──────────────────┘

Comparación:               Multivariable:
┌──────────────────┐     ┌──────────────────┐
│ Boxplot          │     │ Pairplot         │
│ ┌──┐  ┌──┐       │     │ ╔══╤══╤══╗       │
│ │  │  │  │       │     │ ║· │ │ │║       │
│ └──┘  └──┘       │     │ ╟──┼──┼──╢       │
└──────────────────┘     │ ║· │· │ │║       │
                         │ ╚══╧══╧══╝       │
Correlación:              └──────────────────┘
┌──────────────────┐
│ Heatmap          │
│ ████░░ ░░████    │
│ ░░████ ████░░    │
│ ████░░ ░░████    │
└──────────────────┘
```

## Implementación en Python

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Cargar un dataset incorporado
tips = sns.load_dataset("tips")
print(tips.head())
```

```python
# Scatter plot con hue
sns.scatterplot(data=tips, x="total_bill", y="tip", hue="time", size="size")
plt.title("Propinas por Cuenta Total")
plt.show()
```

```python
# Box plot
sns.boxplot(data=tips, x="day", y="total_bill", hue="sex")
plt.title("Distribución de Cuentas por Día y Sexo")
plt.show()
```

```python
# Violin plot
sns.violinplot(data=tips, x="day", y="total_bill", hue="sex", split=True)
plt.title("Violin Plot de Cuentas")
plt.show()
```

```python
# Pairplot
sns.pairplot(data=tips, hue="sex", diag_kind="kde")
plt.show()
```

```python
# Heatmap
numeric_cols = tips.select_dtypes(include=[np.number])
corr = numeric_cols.corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)
plt.title("Mapa de Calor de Correlaciones")
plt.show()
```

```python
# Gráfico de distribución
sns.histplot(data=tips, x="total_bill", hue="time", kde=True)
plt.show()
```

```python
# Gráfico de conteo
sns.countplot(data=tips, x="day", hue="sex")
plt.title("Cantidad de Comensales por Día")
plt.show()
```

## Ejemplo de Biotecnología

**Escenario**: Visualizando datos de expresión génica de un experimento.

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Simular datos de expresión génica
np.random.seed(42)
genes = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"] * 20
conditions = np.random.choice(["Control", "Drug_A", "Drug_B"], 100)
expression = np.random.randn(100) * 2 + 5

# Agregar algunos efectos de grupo
for i in range(len(expression)):
    if conditions[i] == "Drug_A":
        expression[i] += 1.5 if genes[i] in ["EGFR", "MYC"] else -1.0
    elif conditions[i] == "Drug_B":
        expression[i] += 2.0 if genes[i] in ["BRCA1", "TP53"] else -0.5

df = pd.DataFrame({
    "Gene": genes,
    "Condition": conditions,
    "Expression": expression
})

# Box plot
plt.figure(figsize=(12, 6))
sns.boxplot(data=df, x="Gene", y="Expression", hue="Condition")
plt.title("Expresión Génica por Condición")
plt.show()

# Heatmap (tabla dinámica)
pivot = df.pivot_table(index="Gene", columns="Condition", values="Expression", aggfunc="mean")
plt.figure(figsize=(8, 6))
sns.heatmap(pivot, annot=True, cmap="viridis", fmt=".1f")
plt.title("Niveles de Expresión Promedio")
plt.show()
```

## Ejemplo SaaS

**Escenario**: Analizando métricas de engagement de clientes.

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Simular datos de clientes
np.random.seed(42)
n_customers = 200

df = pd.DataFrame({
    "Plan": np.random.choice(["Basic", "Pro", "Enterprise"], n_customers, p=[0.5, 0.3, 0.2]),
    "Tenure": np.random.randint(1, 60, n_customers),
    "Monthly_Spend": np.random.uniform(10, 200, n_customers),
    "Support_Tickets": np.random.poisson(0.5, n_customers),
    "Satisfaction": np.random.uniform(1, 10, n_customers).round(1),
    "Churned": np.random.choice([0, 1], n_customers, p=[0.7, 0.3])
})

# Pairplot coloreado por churn
sns.pairplot(data=df, hue="Churned", vars=["Tenure", "Monthly_Spend", "Satisfaction"])
plt.show()

# Box plot de gasto por plan y churn
plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x="Plan", y="Monthly_Spend", hue="Churned")
plt.title("Gasto Mensual por Plan y Estado de Churn")
plt.show()

# Mapa de calor de correlaciones
plt.figure(figsize=(8, 6))
numeric = df.select_dtypes(include=[np.number])
sns.heatmap(numeric.corr(), annot=True, cmap="coolwarm", center=0)
plt.title("Correlación de Métricas de Clientes")
plt.show()
```

## Errores Comunes

1. **Olvidar importar matplotlib**: Seaborn necesita `plt.show()` para mostrar gráficos
2. **Sobrescribir los estilos de Seaborn**: Configurar estilos de Matplotlib después de importar seaborn puede causar conflictos
3. **Usar Seaborn para todo**: Algunos gráficos (como líneas con muchas series) son mejores con Matplotlib puro
4. **Ignorar los parámetros `hue` y `style`**: Estos hacen poderoso a Seaborn — ¡usalos!
5. **No usar DataFrames de Pandas**: Seaborn funciona mejor con DataFrames; usar arrays crudos pierde funcionalidad

## Buenas Prácticas

- Usá `sns.set_theme()` al inicio para estilo consistente
- Usá `hue` para coloración categórica y `size` para valores continuos
- Usá los parámetros `col` y `row` para gráficos facetados
- Usá `sns.color_palette()` para crear esquemas de colores personalizados
- Combiná gráficos de Seaborn con `plt.subplots()` de Matplotlib para diseños complejos
- Usá `sns.heatmap()` con `annot=True` para matrices de correlación

## Resumen

- Seaborn provee visualizaciones estadísticas de alto nivel
- Gráficos clave: scatterplot, boxplot, violinplot, pairplot, heatmap
- Integración nativa con Pandas — funciona directamente con DataFrames
- Temas profesionales y paletas de colores predeterminados
- Agregación estadística incorporada (intervalos de confianza, etc.)
- Fácilmente personalizable con funciones de Matplotlib

## Términos Clave

- **Seaborn**: Librería de visualización estadística de datos
- **Hue**: Variable categórica codificada por color
- **Pairplot**: Matriz de gráficos de dispersión para todos los pares de variables
- **Heatmap**: Matriz de valores codificada por color
- **Box plot**: Resumen estadístico de distribución (cuartiles, outliers)
- **Violin plot**: Box plot + estimación de densidad kernel
- **Facet**: Subgráfico basado en valores de variables
- **Paleta**: Esquema de colores para datos categóricos o continuos

## Ejercicios

### Nivel 1: Básico

1. ¿Cuál es la principal ventaja de Seaborn sobre Matplotlib?
2. ¿Cómo agregás codificación de color para una variable categórica en un gráfico de Seaborn?
3. ¿Qué muestra `sns.pairplot()`?

### Nivel 2: Implementación

4. Usando el dataset tips, creá un box plot de total_bill agrupado por día y sexo.
5. Creá un heatmap de la matriz de correlación de las columnas numéricas de cualquier dataset.

### Nivel 3: Pensamiento Crítico

6. ¿Cuándo elegirías un violin plot sobre un box plot? ¿Qué información adicional proporciona el violin plot?
7. ¿Cómo personalizarías un gráfico de Seaborn (ej. cambiar título, etiquetas de ejes, tamaño de figura) que no tiene esos parámetros directamente?

## Desafío de Código

Creá un **reporte EDA integral** de un dataset sintético de clientes usando Seaborn:

1. Generá un dataset con 300 clientes y características: `age`, `income`, `spending_score` (1-100), `membership_years`, `num_purchases`, `avg_order_value`, `region` (4 regiones), `segment` (Low/Medium/High)

2. Creá las siguientes visualizaciones:
   - Pairplot de variables numéricas coloreado por segment
   - Heatmap de correlaciones entre todas las variables numéricas
   - Box plots de spending_score por región
   - Violin plot de income por segment
   - Count plot de segments por región
   - Histograma de age con superposición KDE, coloreado por segment

3. Aplicá un tema profesional de Seaborn y una paleta de colores personalizada

4. Organizá múltiples gráficos en una sola figura usando `plt.subplots()` con ejes de Seaborn

5. Guardá la figura final como `eda_report.png`
