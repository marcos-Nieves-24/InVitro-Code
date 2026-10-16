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

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Llegan mil muestras de un ensayo clínico con datos faltantes y valores extraños.",
    "Antes de modelar, hay que conocer cada columna y su calidad.",
    "El Análisis Exploratorio de Datos examina los datos antes del modelo.",
  ]}
/>

<ConceptCard variant="key-idea">
El EDA revisa estructura, calidad, distribuciones y relaciones antes de modelar; evita que el modelo aprenda de datos sucios.
</ConceptCard>

<ChoiceQuestion
  question="¿Qué harías primero al recibir un dataset nuevo de un hospital?"
  moduleSlug="estadistica"
  lessonSlug="lesson06_exploratory_data_analysis"
  blockId="choice-estadistica-l06-s1-1"
  allowContinueOnIncorrect
  explanation="Explorar los datos primero detecta faltantes, outliers y sesgos antes de entrenar cualquier modelo."
  options={[
    { id: "a", label: "Entrenar un modelo de inmediato", correct: false, feedback: "Riesgoso: no sabes si los datos son confiables." },
    { id: "b", label: "Explorar los datos (EDA)", correct: true, feedback: "¡Bien! Conocer los datos antes de modelar evita errores costosos." },
    { id: "c", label: "Borrar todos los outliers", correct: false, feedback: "Primero investiga por qué aparecen; pueden ser hallazgos." },
    { id: "d", label: "Elegir el algoritmo final", correct: false, feedback: "La elección depende de lo que el EDA revele." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={2} title="El flujo de trabajo EDA" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un EDA sistemático evita improvisar análisis.",
    "Primero estructura y calidad, después univariado, bivariado y visualización.",
    "Ese orden convierte un dataset nuevo en una historia legible.",
  ]}
/>

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

</RevealSequence>

</Section>

<Section number={3} title="Valores faltantes: el enemigo silencioso" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Los datos faltantes no son solo ceros que rellenar.",
    "Pueden ser MCAR, MAR o MNAR, y cada patrón pide un tratamiento diferente.",
    "Imputar sin entender por qué faltan introduce sesgo silencioso.",
  ]}
/>

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

</RevealSequence>

</Section>

<Section number={4} title="Outliers desde múltiples ángulos" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un outlier puede ser un error o el descubrimiento del año.",
    "IQR y Z-Score miran los extremos desde ángulos distintos.",
    "Investigar antes de eliminar es parte de un EDA responsable.",
  ]}
/>

<ConceptCard variant="key-idea">
Comparación de métodos de detección:
- **IQR (1.5×)**: robusto a distribución no normal; datos sesgados o desconocidos; $Q_1 - 1.5\times\text{IQR}$, $Q_3 + 1.5\times\text{IQR}$.
- **Z-Score ($|Z| > 3$)**: asume distribución normal; datos aproximadamente normales; $|x - \mu| / \sigma > 3$.
</ConceptCard>

<ConceptCard variant="warning">
Un outlier NO siempre es basura. En genómica, un outlier puede ser el descubrimiento del año. En SaaS, puede ser tu cliente más valioso. Investiga antes de eliminar.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={5} title="Visualizaciones EDA clave" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Antes de modelar, hay que mirar.",
    "Cada visualización responde una pregunta distinta del dataset.",
    "Elegí la herramienta según el tipo de variable y el propósito.",
  ]}
/>

<ConceptCard variant="key-idea">
Visualizaciones esenciales para EDA:
- **Histograma**: distribución de una variable — siempre, primer paso del EDA.
- **Boxplot**: mediana, IQR, outliers — comparar distribuciones entre grupos.
- **Scatter plot**: relación entre dos variables numéricas — buscar correlaciones/patrones.
- **Heatmap de correlación**: matriz de correlaciones — identificar multicolinealidad.
- **Pairplot**: todos los scatter plots posibles — EDA inicial en datasets pequeños.
- **Bar plot**: frecuencias de categorías — variables categóricas.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="Manos a la obra: EDA del Titanic" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El Titanic es un caso real para practicar EDA.",
    "Estructura, faltantes, visualización y distribuciones en un solo flujo.",
    "No salteés pasos: los patrones aparecen al mirar con cuidado.",
  ]}
/>

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

</RevealSequence>

</Section>

<Section number={7} title="Biotecnología: EDA de expresión génica" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En genómica el EDA revela problemas de medición antes de modelar.",
    "Simulamos expresión génica con un 5% de valores faltantes.",
    "Imputar con la mediana es seguro o peligroso según el patrón de faltantes.",
  ]}
/>

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

<ChoiceQuestion
  question="¿Cuándo es seguro imputar con la mediana y cuándo es peligroso? Da un ejemplo de cada caso en biotecnología."
  moduleSlug="estadistica"
  lessonSlug="lesson06_exploratory_data_analysis"
  blockId="reflection-l06-gene-missing"
  allowContinueOnIncorrect
  explanation="Seguro cuándo MCAR (errores aleatorios): mediana representa la distribución. Peligroso cuándo MNAR: genes con expresión extrema no medible; imputar enmascara casos anormales (posible cáncer)."
  options={[
    { id: "a", label: "Seguro si MCAR (errores aleatorios, mediana representativa); peligroso si MNAR, p. ej. genes de expresión extrema no medibles", correct: true, feedback: "¡Exacto! El patrón de faltantes (MCAR vs MNAR) decide, no la robustez." },
    { id: "b", label: "Siempre seguro: la mediana es robusta a outliers, por lo que no importa el patrón de faltantes", correct: false, feedback: "La robustez no arregla MNAR; imputar enmascara precisamente los casos anómalos informativos." },
    { id: "c", label: "Siempre peligroso: conviene eliminar toda fila con valores faltantes", correct: false, feedback: "Con muchos faltantes imputar puede ser razonable si MCAR; eliminar filas pierde información." },
    { id: "d", label: "Seguro siempre que los datos sean normales; MCAR/MNAR no importa", correct: false, feedback: "La normalidad no decide; lo que importa es el patrón de faltantes (MCAR vs MNAR)." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={8} title="Checkpoint" eyebrow="EVALUACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El EDA no es opcional ni decorativo.",
    "Los modelos asumen propiedades que deben verificarse antes de entrenar.",
    "Hacerlo después de modelar es una trampa costosa.",
  ]}
/>

<ChoiceQuestion
  question="¿Por qué haces EDA ANTES de modelar y no después? ¿Qué podría salir mal si modelas primero?"
  moduleSlug="estadistica"
  lessonSlug="lesson06_exploratory_data_analysis"
  blockId="reflection-l06-eda-flow"
  allowContinueOnIncorrect
  explanation="Los modelos asumen normalidad, no multicolinealidad y sin outliers extremos, verificables sólo con EDA; modelar primero da métricas falsamente optimistas, transformaciones inadvertidas y features redundantes."
  options={[
    { id: "a", label: "Porque los modelos asumen normalidad, no multicolinealidad y sin outliers extremos, verificables sólo con EDA", correct: true, feedback: "¡Exacto! EDA primero, modelo después." },
    { id: "b", label: "EDA después del modelo también funciona; los modelos detectan solos los problemas", correct: false, feedback: "Los modelos asumen propiedades que deben verificarse antes; no detectan multicolinealidad ni outliers por sí solos." },
    { id: "c", label: "EDA es solo visualización estética y no cambia las métricas del modelo", correct: false, feedback: "EDA detecta problemas que sesgan métricas; ignorarla puede inflar la performance aparente." },
    { id: "d", label: "Modelar primero y luego EDA permite un EDA más dirigido por el modelo", correct: false, feedback: "El orden propuesto viola el flujo; los supuestos deben validarse con los datos antes de entrenar." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={9} title="Términos clave" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Con estos términos cerramos el ciclo de EDA.",
    "Son tu vocabulario para revisar cualquier dataset nuevo.",
    "La próxima lección reduce dimensiones con PCA.",
  ]}
/>

<ConceptCard variant="key-idea">
Términos clave del EDA:
- **EDA**: Análisis Exploratorio de Datos: entender datos antes de modelar.
- **Valor Faltante (NaN)**: dato ausente — clasificado cómo MCAR, MAR o MNAR.
- **Imputación**: reemplazar valores faltantes con estimaciones.
- **Outlier**: valor atípico — detectado con IQR o Z-Score.
- **MCAR**: Missing Completely At Random — falta totalmente al azar.
- **MNAR**: Missing Not At Random — la ausencia es informativa.
- **df.describe()**: resumen estadístico rápido de todas las columnas numéricas.
- **df.isnull().sum()**: conteo de valores faltantes por columna.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={10} title="Para la próxima lección" eyebrow="CIERRE">

<RevealSequence mode="appear">

<MascotMessage mood="celebrating">
EDA completado. Ahora tienes el hábito de comprender cualquier dataset antes de modelarlo. Esto te diferencia del principiante que ejecuta `.fit()` sin revisar los datos.
</MascotMessage>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En la Lección 7 entramos a una técnica elegante: PCA.",
    "¿Cómo reducir 100 dimensiones a 2 sin perder la información importante?",
    "Te va a volar la cabeza.",
  ]}
/>

**En la Lección 7** vamos a entrar en una de las técnicas más elegantes del ML: **PCA (Análisis de Componentes Principales)**. ¿Cómo reducir 100 dimensiones a 2 sin perder la información importante? Te va a volar la cabeza.

</RevealSequence>

</Section>
