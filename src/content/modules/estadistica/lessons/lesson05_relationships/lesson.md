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

<Section number={1} title="Nada ocurre en aislamiento" eyebrow="INICIO">

<MascotMessage mood="curious">
En machine learning, raramente trabajamos con variables aisladas. Dos genes pueden estar co-expresados, la edad del cliente y la duración de suscripción correlacionan. Entender estas relaciones te ayuda a seleccionar features y detectar multicolinealidad.
</MascotMessage>

Ya sabés describir variables individuales. Ahora aprenderás a cuantificar relaciones entre pares de variables. Esto es esencial para EDA (Lección 6), PCA (Lección 7), y todo el Módulo 4 de Machine Learning.

</Section>

<Section number={2} title="Covarianza: ¿se mueven juntas?" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
La covarianza mide cómo dos variables varían juntas:

$$\text{Cov}(X, Y) = \frac{1}{n} \sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})$$
</ConceptCard>

Cuando X está por encima de su media, ¿Y también? → **covarianza positiva**. ¿Y está por debajo? → **covarianza negativa**. ¿Sin patrón? → cercana a cero.

<ConceptCard variant="warning">
**Limitación clave**: La covarianza depende de la escala. Dos variables en distintas unidades (metros vs kilos) no son comparables por covarianza. Necesitamos normalizarla.
</ConceptCard>

</Section>

<Section number={3} title="Pearson: la correlación clásica" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
El coeficiente de correlación de Pearson normaliza la covarianza a [-1, 1]:

$$\rho_{X,Y} = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y}$$

- $+1$: relación lineal positiva perfecta
- $0$: sin relación lineal
- $-1$: relación lineal negativa perfecta
</ConceptCard>

**Supuestos de Pearson**: linealidad, normalidad (para inferencia), homocedasticidad, sin outliers extremos.

<ConceptCard variant="key-idea">
Pearson mide relaciones LINEALES. Si la relación es curva pero monótona (siempre creciente), Pearson puede ser bajo aunque exista una relación fuerte. Para eso existe Spearman.
</ConceptCard>

</Section>

<Section number={4} title="Spearman: basado en rangos" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
La correlación de Spearman usa rangos en lugar de valores originales:

$$\rho_s = \frac{\text{Cov}(R(X), R(Y))}{\sigma_{R(X)} \sigma_{R(Y)}}$$

Donde $R(X)$ son los rangos (1°, 2°, 3°...).
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Qué mide", left: "Relación lineal", right: "Relación monótona (siempre creciente o decreciente)" },
    { feature: "Supuestos", left: "Normalidad, linealidad", right: "Ninguno (no paramétrico)" },
    { feature: "Outliers", left: "Muy sensible", right: "Robusto (usa rangos)" },
    { feature: "Cuándo usar", left: "Datos normales, relación lineal", right: "Datos sesgados, relación no lineal, outliers" },
    { feature: "Ejemplo", left: "Peso vs altura", right: "Ingresos vs gastos (sesgados)" },
  ]}
/>

</Section>

<Section number={5} title="Pearson vs Spearman en código" eyebrow="INTERACTIVA">

```python
import numpy as np
from scipy.stats import pearsonr, spearmanr

np.random.seed(42)
x = np.random.normal(0, 1, 200)

# Lineal positiva
y_linear = 2 * x + np.random.normal(0, 0.5, 200)
# No lineal monótona (cúbica)
y_nonlinear = x**3 + np.random.normal(0, 1, 200)
# Sin relación
y_none = np.random.normal(0, 1, 200)

print("Lineal:    ", f"Pearson={pearsonr(x, y_linear)[0]:.3f}", f"Spearman={spearmanr(x, y_linear)[0]:.3f}")
print("No lineal: ", f"Pearson={pearsonr(x, y_nonlinear)[0]:.3f}", f"Spearman={spearmanr(x, y_nonlinear)[0]:.3f}")
print("Sin relac: ", f"Pearson={pearsonr(x, y_none)[0]:.3f}", f"Spearman={spearmanr(x, y_none)[0]:.3f}")
```

<ReflectionCheck
  blockId="reflection-l05-pearson-spearman"
  moduleSlug="estadistica"
  lessonSlug="lesson05_relationships"
  prompt="Para la relación cúbica (y = x³), Pearson da ~0.2 pero Spearman da ~0.95. ¿Por qué tanta diferencia? ¿Cuál es la correlación 'real'?"
  answer="Ambos tienen razón en lo que miden. Pearson mide relación LINEAL — como x³ no es lineal, da bajo. Spearman mide relación MONÓTONA — como x³ siempre crece cuando x crece, da alto. No hay una correlación 'más real': depende de qué te interese. Para selección de features en ML, Spearman suele ser más útil porque captura relaciones no lineales que algoritmos como árboles de decisión pueden aprovechar."
/>

</Section>

<Section number={6} title="Matriz de correlación y mapa de calor" eyebrow="INTERACTIVA">

```python
import seaborn as sns
iris = sns.load_dataset('iris')
numeric = iris.select_dtypes(include=[np.number])

corr_matrix = numeric.corr()

plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='RdBu_r', center=0,
            square=True, linewidths=1, fmt='.2f')
plt.title('Iris - Matriz de Correlación')
plt.show()
```

<ConceptCard variant="key-idea">
La diagonal siempre es 1 (una variable correlaciona perfectamente consigo misma). Buscá valores $|r| > 0.8$ fuera de la diagonal — indican multicolinealidad, que degrada la estabilidad de modelos lineales.
</ConceptCard>

</Section>

<Section number={7} title="Correlación ≠ Causalidad" eyebrow="CONCEPTO">

<ConceptCard variant="warning">
**El error más peligroso en estadística**: confundir correlación con causalidad.

- Ventas de helado ↑ y ahogamientos ↑ en verano. ¿El helado causa ahogamientos? No — ambos son causados por el calor (variable de confusión).
- Países con más consumo de chocolate tienen más premios Nobel. ¿Causalidad? No — ambos correlacionan con el PIB per cápita.
</ConceptCard>

<CalloutInfo>
Siempre preguntate: ¿hay una tercera variable que explique ambas? ¿Podría ser al revés la causalidad? ¿Es solo coincidencia? La correlación es una pista, no una conclusión.
</CalloutInfo>

</Section>

<Section number={8} title="Checkpoint" eyebrow="EVALUACIÓN">

<ReflectionCheck
  blockId="reflection-l05-causation"
  moduleSlug="estadistica"
  lessonSlug="lesson05_relationships"
  prompt="Encontraste que la cantidad de features usadas en un modelo correlaciona r=0.9 con el accuracy en training, pero r=−0.3 con el accuracy en test. ¿Qué está pasando?"
  answer="Overfitting clásico. Más features permiten al modelo memorizar el training set (r=0.9 positivo), pero dañan la generalización (r=−0.3). La alta correlación positiva en training NO implica que más features sean mejores. Es el ejemplo perfecto de por qué siempre evaluamos en test: la correlación training-test te cuenta historias diferentes."
/>

<AnswerReveal summary="Ver respuestas">
<p><strong>¿Por qué preferirías Spearman sobre Pearson para datos de ingresos?</strong> Los ingresos son extremadamente sesgados a la derecha (pocas personas ganan muchísimo). Pearson es sensible a esos outliers extremos, mientras que Spearman usa rangos y les da a todos el mismo peso relativo. Spearman te da la correlación 'real' entre la posición relativa de las personas, no entre sus valores absolutos.</p>
</AnswerReveal>

</Section>

<Section number={9} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["Covarianza", "Medida de variación conjunta (dependiente de escala)"],
    ["Correlación de Pearson", "Covarianza normalizada a [-1,1]; mide relación lineal"],
    ["Correlación de Spearman", "Correlación sobre rangos; mide relación monótona"],
    ["Matriz de Correlación", "Matriz cuadrada de correlaciones por pares entre variables"],
    ["Multicolinealidad", "Alta correlación entre features — inestabiliza modelos lineales"],
    ["Correlación Espuria", "Correlación sin relación causal (variable de confusión)"],
  ]}
  searchable={true}
  caption="Términos clave de relaciones entre variables"
/>

</Section>

<Section number={10} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
¡Correlación ≠ causalidad! Grabate eso a fuego. Ahora tenés las herramientas para explorar relaciones entre variables — una habilidad fundamental para el análisis exploratorio de datos.
</MascotMessage>

**En la Lección 6** vamos a juntar TODO lo aprendido hasta ahora en un Análisis Exploratorio de Datos (EDA) completo: valores faltantes, outliers, visualizaciones, y exploración de features. Vas a aplicar estadística descriptiva, distribuciones y correlaciones en un flujo de trabajo real de científico de datos.

</Section>
