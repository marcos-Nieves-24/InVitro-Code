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

<Section number={1} title="¿Por qué Seaborn?" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Seaborn añade visualización estadística de alto nivel sobre Matplotlib: heatmap, box plot y pair plot con pocas líneas.",
    "Mientras Matplotlib da control total, Seaborn da defaults inteligentes y agregaciones automáticas.",
    "En biotecnología: heatmaps de expresión génica, box plots por tratamiento y pair plots para biomarcadores.",
    "En SaaS: segmentación de clientes, análisis de correlación y resultados de tests A/B.",
    "Es el atajo estadístico que construye sobre el motor que ya aprendiste en la lección anterior.",
  ]}
/>

<ConceptCard variant="key-idea">
Seaborn es una librería de visualización estadística construida sobre Matplotlib que facilita crear gráficos informativos y atractivos con código mínimo. Está diseñada específicamente para explorar y entender datos.

En la lección anterior aprendiste Matplotlib — la base para la visualización en Python. Seaborn se basa en Matplotlib para proporcionar gráficos de más alto nivel enfocados en estadística. Combinado con Pandas para manipulación de datos, estas tres librerías (Pandas, Matplotlib, Seaborn) forman el kit de herramientas esencial de ciencia de datos. A lo largo de los módulos de ML, vas a usar Seaborn para EDA y visualización de resultados.
</ConceptCard>

- Seaborn facilita gráficos estadísticos con código mínimo.
- Matplotlib da control; Seaborn da defaults y agregaciones.
- Pandas + Matplotlib + Seaborn = kit esencial de ciencia de datos.

</RevealSequence>
</Section>

<Section number={2} title="Conceptos Básicos de Seaborn" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Seaborn provee tipos de gráficos estadísticos, agregación automática, mapeo de colores y temas profesionales.",
    "Todo trabaja directamente con DataFrames de Pandas, sin rodeos.",
    "Primer paso: instalar seaborn y configurar el tema global antes de graficar.",
  ]}
/>

**¿Qué es Seaborn?**

<ConceptCard variant="definition">
Seaborn provee:
- **Tipos de gráficos estadísticos**: box, violin, swarm, pair, heatmap
- **Agregación automática**: calcula estadísticas por ti
- **Mapeo de colores inteligente**: paletas categóricas y continuas
- **Temas**: estilos profesionales predeterminados
- **Integración con Pandas**: funciona directamente con DataFrames
</ConceptCard>

**Instalación e importación**

```bash
pip install seaborn
```

```python
import seaborn as sns
```

**Seaborn vs Matplotlib** (candidato a tabla → ConceptCard+bullets):

<ConceptCard variant="key-idea">
- **Nivel**: Matplotlib bajo nivel, Seaborn alto nivel
- **Estilo por defecto**: Matplotlib básico, Seaborn profesional
- **Soporte Pandas**: Matplotlib manual, Seaborn nativo
- **Gráficos estadísticos**: Matplotlib manual, Seaborn incorporados
- **Personalización**: Matplotlib completa; Seaborn buena, con acceso a Matplotlib
</ConceptCard>

**Tipos de gráficos clave**

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

**Temas y paletas**

```python
sns.set_theme()
sns.set_style("whitegrid")  # Estilos: darkgrid, whitegrid, dark, white, ticks
sns.set_palette("viridis")  # Paletas: deep, muted, pastel, bright, dark, colorblind
sns.color_palette("husl", 8)
```

**Visualización de tipos de gráficos de Seaborn** (candidato a player visual):

```text
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

</RevealSequence>
</Section>

<Section number={3} title="Implementación en Python" eyebrow="IMPLEMENTACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "De la teoría a la práctica: carga un dataset incorporado y grafica paso a paso.",
    "Cada snippet es independiente; ejecútalo y observa el resultado.",
    "El dataset tips es ideal para experimentar con hue, size y facetas.",
  ]}
/>

**Cargar dataset incorporado**

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

tips = sns.load_dataset("tips")
print(tips.head())
```

**Scatter plot con hue y size**

```python
sns.scatterplot(data=tips, x="total_bill", y="tip", hue="time", size="size")
plt.title("Propinas por Cuenta Total")
plt.show()
```

**Box plot por día y sexo**

```python
sns.boxplot(data=tips, x="day", y="total_bill", hue="sex")
plt.title("Distribución de Cuentas por Día y Sexo")
plt.show()
```

**Violin plot partido**

```python
sns.violinplot(data=tips, x="day", y="total_bill", hue="sex", split=True)
plt.title("Violin Plot de Cuentas")
plt.show()
```

**Pairplot**

```python
sns.pairplot(data=tips, hue="sex", diag_kind="kde")
plt.show()
```

**Heatmap de correlaciones**

```python
numeric_cols = tips.select_dtypes(include=[np.number])
corr = numeric_cols.corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)
plt.title("Mapa de Calor de Correlaciones")
plt.show()
```

**Histograma con KDE**

```python
sns.histplot(data=tips, x="total_bill", hue="time", kde=True)
plt.show()
```

**Count plot**

```python
sns.countplot(data=tips, x="day", hue="sex")
plt.title("Cantidad de Comensales por Día")
plt.show()
```

</RevealSequence>
</Section>

<Section number={4} title="Aplicaciones Prácticas" eyebrow="APLICACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Dos casos end to end: expresión génica por condición y dashboard de métricas SaaS.",
    "Observa cómo Seaborn construye heatmaps y box plots sobre el mismo DataFrame.",
    "El truco es preparar bien los datos antes de graficar.",
  ]}
/>

**Ejemplo de biotecnología**

**Escenario**: visualizando datos de expresión génica de un experimento.

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
genes = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"] * 20
conditions = np.random.choice(["Control", "Drug_A", "Drug_B"], 100)
expression = np.random.randn(100) * 2 + 5

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

plt.figure(figsize=(12, 6))
sns.boxplot(data=df, x="Gene", y="Expression", hue="Condition")
plt.title("Expresión Génica por Condición")
plt.show()

pivot = df.pivot_table(index="Gene", columns="Condition", values="Expression", aggfunc="mean")
plt.figure(figsize=(8, 6))
sns.heatmap(pivot, annot=True, cmap="viridis", fmt=".1f")
plt.title("Niveles de Expresión Promedio")
plt.show()
```

**Ejemplo SaaS**

**Escenario**: analizando métricas de engagement de clientes.

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

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

sns.pairplot(data=df, hue="Churned", vars=["Tenure", "Monthly_Spend", "Satisfaction"])
plt.show()

plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x="Plan", y="Monthly_Spend", hue="Churned")
plt.title("Gasto Mensual por Plan y Estado de Churn")
plt.show()

plt.figure(figsize=(8, 6))
numeric = df.select_dtypes(include=[np.number])
sns.heatmap(numeric.corr(), annot=True, cmap="coolwarm", center=0)
plt.title("Correlación de Métricas de Clientes")
plt.show()
```

</RevealSequence>
</Section>

<Section number={5} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Los errores típicos de Seaborn son de flujo: olvidar plt.show(), sobrescribir estilos o usar arrays crudos.",
    "Hue y style son el superpoder de Seaborn: exprímelos.",
    "Combina con plt.subplots() cuando el diseño se pone complejo.",
  ]}
/>

**Errores comunes**

- **Olvidar importar matplotlib**: Seaborn necesita `plt.show()` para mostrar gráficos
- **Sobrescribir los estilos de Seaborn**: configurar estilos de Matplotlib después de importar seaborn causa conflictos
- **Usar Seaborn para todo**: algunos gráficos (líneas con muchas series) son mejores con Matplotlib puro
- **Ignorar los parámetros `hue` y `style`**: son los que potencian a Seaborn
- **No usar DataFrames de Pandas**: Seaborn funciona mejor con DataFrames; usar arrays crudos pierde funcionalidad

**Buenas prácticas**

- Usa `sns.set_theme()` al inicio para estilo consistente
- Usa `hue` para coloración categórica y `size` para valores continuos
- Usa los parámetros `col` y `row` para gráficos facetados
- Usa `sns.color_palette()` para esquemas personalizados
- Combina gráficos de Seaborn con `plt.subplots()` de Matplotlib para diseños complejos
- Usa `sns.heatmap()` con `annot=True` para matrices de correlación

</RevealSequence>
</Section>

<Section number={6} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Seaborn es el atajo estadístico de Matplotlib: menos código, más insight.",
    "Pairplot y heatmap son tus herramientas de EDA multivariable.",
    "Fixa el tema y la paleta al inicio para consistencia visual.",
  ]}
/>

- Seaborn provee visualizaciones estadísticas de alto nivel
- Gráficos clave: scatterplot, boxplot, violinplot, pairplot, heatmap
- Integración nativa con Pandas — funciona directamente con DataFrames
- Temas profesionales y paletas de colores predeterminados
- Agregación estadística incorporada (intervalos de confianza, etc.)
- Fácilmente personalizable con funciones de Matplotlib

**Términos clave**

- **Seaborn**: librería de visualización estadística de datos
- **Hue**: variable categórica codificada por color
- **Pairplot**: matriz de gráficos de dispersión para todos los pares de variables
- **Heatmap**: matriz de valores codificada por color
- **Box plot**: resumen estadístico de distribución (cuartiles, outliers)
- **Violin plot**: box plot + estimación de densidad kernel
- **Facet**: subgráfico basado en valores de variables
- **Paleta**: esquema de colores para datos categóricos o continuos

</RevealSequence>
</Section>

<Section number={7} title="Evaluación" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

**Ejercicios**

**Nivel 1: Básico**

1. ¿Cuál es la principal ventaja de Seaborn sobre Matplotlib?
2. ¿Cómo agregas codificación de color para una variable categórica en un gráfico de Seaborn?
3. ¿Qué muestra `sns.pairplot()`?

**Nivel 2: Implementación**

4. Usando el dataset tips, crea un box plot de total_bill agrupado por día y sexo.
5. Crea un heatmap de la matriz de correlación de las columnas numéricas de cualquier dataset.

**Nivel 3: Pensamiento Crítico**

6. ¿Cuándo elegirías un violin plot sobre un box plot? ¿Qué información adicional proporciona el violin plot?
7. ¿Cómo personalizarías un gráfico de Seaborn (ej. cambiar título, etiquetas de ejes, tamaño de figura) que no tiene esos parámetros directamente?

**Desafío de código**

Crea un **reporte EDA integral** de un dataset sintético de clientes usando Seaborn:
1. Genera un dataset con 300 clientes y características: `age`, `income`, `spending_score` (1-100), `membership_years`, `num_purchases`, `avg_order_value`, `region` (4 regiones), `segment` (Low/Medium/High)
2. Crea las siguientes visualizaciones: pairplot de variables numéricas coloreado por segment; heatmap de correlaciones entre todas las variables numéricas; box plots de spending_score por región; violin plot de income por segment; count plot de segments por región; histograma de age con superposición KDE coloreado por segment
3. Aplica un tema profesional de Seaborn y una paleta de colores personalizada
4. Organiza múltiples gráficos en una sola figura usando `plt.subplots()` con ejes de Seaborn
5. Guarda la figura final como `eda_report.png`

</RevealSequence>
</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Cuál es la principal ventaja de Seaborn sobre Matplotlib?"
  moduleSlug="python"
  lessonSlug="lesson16_seaborn"
  blockId="choice-python-l16-tema-1"
  allowContinueOnIncorrect
  explanation="Seaborn añade visualizaciones estadísticas de alto nivel y defaults inteligentes sobre el motor de Matplotlib."
  options={[
    { id: "a", label: "Gráficos estadísticos de alto nivel y defaults inteligentes", correct: true, feedback: "¡Correcto! Menos código, más insight." },
    { id: "b", label: "Control total píxel a píxel del lienzo", correct: false, feedback: "Eso es Matplotlib puro, no Seaborn." },
    { id: "c", label: "Mayor velocidad de renderizado", correct: false, feedback: "La velocidad no es su ventaja principal." },
    { id: "d", label: "No depende de Matplotlib", correct: false, feedback: "Seaborn se construye sobre Matplotlib." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué muestra sns.pairplot()?"
  moduleSlug="python"
  lessonSlug="lesson16_seaborn"
  blockId="choice-python-l16-tema-2"
  allowContinueOnIncorrect
  explanation="Pairplot genera una matriz de dispersión para todos los pares de variables, con diagonal KDE o histograma."
  options={[
    { id: "a", label: "Una matriz de dispersión de todos los pares de variables", correct: true, feedback: "¡Exacto!" },
    { id: "b", label: "Un solo gráfico de líneas", correct: false, feedback: "No: es una grilla de gráficos." },
    { id: "c", label: "Un heatmap de correlación", correct: false, feedback: "Eso corresponde a heatmap/corr." },
    { id: "d", label: "Solo variables categóricas", correct: false, feedback: "Trabaja con variables numéricas (y hue categórico)." },
  ]}
/>

</RevealSequence>
</Section>
