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

<Section number={1} title="La fase más importante del ML" eyebrow="INICIO">

<MascotMessage mood="thinking">
El 80% del trabajo de un científico de datos es entender y limpiar los datos. Sólo el 20% es modelar. El Análisis Exploratorio de Datos (EDA) es dónde realmente conoces tus datos — y dónde se evitan los errores más costosos.
</MascotMessage>

EDA es el proceso de examinar datos antes de modelar: detectar patrones, valores faltantes, outliers, y relaciones entre variables. Un buen EDA puede ahorrarte semanas de debugging de modelos mal alimentados.

<ConceptCard variant="key-idea">
EDA no es un paso opcional. Es la diferencia entre un modelo qué funciona en producción y uno qué falla silenciosamente con datos qué nunca entendiste.
</ConceptCard>

</Section>

<Section number={2} title="El flujo de trabajo EDA" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Un EDA sistemático sigue estos pasos:

1. **Comprensión de la estructura**: shape, dtypes, valores únicos
2. **Calidad de datos**: valores faltantes, duplicados, inconsistencias
3. **Estadísticas univariadas**: distribuciones, outliers por variable
4. **Relaciones bivariadas**: correlaciones, scatter plots
5. **Visualización**: histogramas, boxplots, heatmaps
</ConceptCard>

<CalloutInfo>
`df.info()`, `df.describe()`, `df.isnull().sum()` son tus tres primeros comandos en cualquier EDA. Nunca los saltees.
</CalloutInfo>

</Section>

<Section number={3} title="Valores faltantes: el enemigo silencioso" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Los valores faltantes (NaN) son datos ausentes. Pueden ser **MCAR** (Missing Completely At Random), **MAR** (Missing At Random) o **MNAR** (Missing Not At Random).
</ConceptCard>

**Estrategias de manejo**:
- **Eliminar** filas/columnas con muchos faltantes (>50%)
- **Imputar**: media/mediana para numéricas, moda para categóricas
- **Indicador**: crear columna binaria "estaba_faltante"
- **Modelar**: predecir el valor faltante con otros features

<ConceptCard variant="warning">
Nunca imputes sin entender POR QUÉ faltan los datos. Si los valores faltan por una razón sistemática (ej. pacientes graves qué abandonan el estudio), imputar introduce sesgo.
</ConceptCard>

</Section>

<Section number={4} title="Outliers desde múltiples ángulos" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Método", left: "IQR (1.5×)", right: "Z-Score (|Z| > 3)" },
    { feature: "Robustez", left: "Robusto a distribución no normal", right: "Asume distribución normal" },
    { feature: "Cuándo usar", left: "Datos sesgados, desconocidos", right: "Datos aproximadamente normales" },
    { feature: "Cálculo", left: "Q1 − 1.5×IQR, Q3 + 1.5×IQR", right: "|x − μ| / σ > 3" },
  ]}
/>

<ConceptCard variant="warning">
Un outlier NO siempre es basura. En genómica, un outlier puede ser el descubrimiento del año. En SaaS, puede ser tu cliente más valioso. Investiga antes de eliminar.
</ConceptCard>

</Section>

<Section number={5} title="Visualizaciones EDA clave" eyebrow="INTERACTIVA">

<InteractiveTable
  headers={["Visualización", "¿Qué muestra?", "¿Cuándo usarla?"]}
  rows={[
    ["Histograma", "Distribución de una variable", "Siempre — primer paso del EDA"],
    ["Boxplot", "Mediana, IQR, outliers", "Comparar distribuciones entre grupos"],
    ["Scatter plot", "Relación entre dos variables numéricas", "Buscar correlaciones/patrones"],
    ["Heatmap de correlación", "Matriz de correlaciones", "Identificar multicolinealidad"],
    ["Pairplot", "Todos los scatter plots posibles", "EDA inicial en datasets pequeños"],
    ["Bar plot", "Frecuencias de categorías", "Variables categóricas"],
  ]}
  searchable={true}
  caption="Visualizaciones esenciales para EDA"
/>

</Section>

<Section number={6} title="Manos a la obra: EDA del Titanic" eyebrow="INTERACTIVA">

```python
import pandas as pd
import seaborn as sns

df = sns.load_dataset('titanic')

# 1. Estructura
print(df.info())
print(df.describe())

# 2. Valores faltantes
print(df.isnull().sum())

# 3. Visualización de faltantes
sns.heatmap(df.isnull(), cbar=False, cmap='viridis')
plt.title('Patrón de Valores Faltantes - Titanic')
plt.show()

# 4. Distribuciones
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
sns.histplot(df['age'].dropna(), bins=30, ax=axes[0,0])
axes[0,0].set_title('Edad')
sns.countplot(data=df, x='survived', ax=axes[0,1])
axes[0,1].set_title('Supervivencia')
sns.boxplot(data=df, x='pclass', y='fare', ax=axes[1,0])
axes[1,0].set_title('Tarifa por Clase')
sns.countplot(data=df, x='sex', hue='survived', ax=axes[1,1])
axes[1,1].set_title('Supervivencia por Sexo')
plt.tight_layout()
plt.show()
```

</Section>

<Section number={7} title="Biotecnología: EDA de expresión génica" eyebrow="INTERACTIVA">

```python
# Simular datos de expresión génica con valores faltantes
np.random.seed(42)
n_genes, n_samples = 100, 50
expression = pd.DataFrame(
    np.random.lognormal(mean=2, sigma=0.8, size=(n_samples, n_genes)),
    columns=[f'gene_{i}' for i in range(n_genes)]
)
# Introducir valores faltantes (5% MAR)
mask = np.random.random(expression.shape) < 0.05
expression = expression.mask(mask)

print(f"Valores faltantes totales: {expression.isnull().sum().sum()}")
print(f"% de genes con faltantes: {(expression.isnull().any().sum() / n_genes) * 100:.1f}%")

# Imputación con mediana
expression_filled = expression.fillna(expression.median())
```

<ReflectionCheck
  blockId="reflection-l06-gene-missing"
  moduleSlug="estadistica"
  lessonSlug="lesson06_exploratory_data_analysis"
  prompt="¿Cuándo es seguro imputar con la mediana y cuándo es peligroso? Da un ejemplo de cada caso en biotecnología."
  answer="Seguro: cuándo los valores faltantes son MCAR (Missing Completely At Random), cómo errores aleatorios de medición. La mediana es representativa de la distribución subyacente. Peligroso: cuándo son MNAR (Missing Not At Random). Ejemplo: genes con expresión extremadamente baja o alta qué el secuenciador no puede medir. Imputar con la mediana enmascara los casos más interesantes (expresión anormal = posible cáncer). Ahí necesitas un indicador de 'estaba faltante' o un modelo específico."
/>

</Section>

<Section number={8} title="Checkpoint" eyebrow="EVALUACIÓN">

<ReflectionCheck
  blockId="reflection-l06-eda-flow"
  moduleSlug="estadistica"
  lessonSlug="lesson06_exploratory_data_analysis"
  prompt="¿Por qué haces EDA ANTES de modelar y no después? ¿Qué podría salir mal si modelas primero?"
  answer="Porque los modelos asumen cosas sobre tus datos (normalidad, no multicolinealidad, sin outliers extremos) qué sólo puedes verificar con EDA. Si modelas primero, podrías: (1) entrenar con datos sucios y obtener métricas falsamente optimistas, (2) no darte cuenta de qué necesitas transformar variables, (3) incluir features redundantes qué inestabilizan el modelo. EDA primero, modelo después. Siempre."
/>

</Section>

<Section number={9} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["EDA", "Análisis Exploratorio de Datos: entender datos antes de modelar"],
    ["Valor Faltante (NaN)", "Dato ausente — clasificado cómo MCAR, MAR o MNAR"],
    ["Imputación", "Reemplazar valores faltantes con estimaciones"],
    ["Outlier", "Valor atípico — detectado con IQR o Z-Score"],
    ["MCAR", "Missing Completely At Random — falta totalmente al azar"],
    ["MNAR", "Missing Not At Random — la ausencia es informativa"],
    ["df.describe()", "Resumen estadístico rápido de todas las columnas numéricas"],
    ["df.isnull().sum()", "Conteo de valores faltantes por columna"],
  ]}
  searchable={true}
  caption="Términos clave de EDA"
/>

</Section>

<Section number={10} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
¡EDA dominado! Ahora tienes el superpoder de entender cualquier dataset antes de tocarlo. Esto te diferencia del 90% de los principiantes qué corren `.fit()` sin mirar los datos.
</MascotMessage>

**En la Lección 7** vamos a entrar en una de las técnicas más elegantes del ML: **PCA (Análisis de Componentes Principales)**. ¿Cómo reducir 100 dimensiones a 2 sin perder la información importante? Te va a volar la cabeza.

</Section>
