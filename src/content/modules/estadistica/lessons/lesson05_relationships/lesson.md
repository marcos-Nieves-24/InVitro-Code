
Module: 3
Lesson Number: 5
Lesson Title: Relaciones Entre Variables
Estimated Duration: 60 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  Calcular e interpretar la covarianza entre dos variables
  Distinguir entre correlación de Pearson y de Spearman
  Crear e interpretar un mapa de calor de matriz de correlación
  Elegir el coeficiente de correlación adecuado según las características de los datos
  Identificar correlaciones espurias
Keywords: covarianza, correlación de Pearson, correlación de Spearman, matriz de correlación, mapa de calor, relación monótona
Difficulty: Principiante
Programming Concepts: numpy, pandas, matplotlib, seaborn
Mathematical Concepts: covarianza, coeficiente de correlación, correlación por rangos
Machine Learning Concepts: relaciones entre features, multicolinealidad, selección de features
Datasets Used: dataset iris, datos sintéticos, dataset de pingüinos
Notebook: 05_relationships.ipynb
Assignment: relationships_assignment.md
Quiz: relationships_quiz.md


<Section number={1} title="Nada ocurre en aislamiento" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En machine learning raramente trabajamos con variables aisladas.",
    "Dos genes pueden estar co expresados y, en clientes, la edad correlaciona con la duración de suscripción.",
    "Entender estas relaciones te ayuda a seleccionar features y detectar multicolinealidad.",
  ]}
/>

<MascotMessage mood="thinking">
En machine learning, raramente trabajamos con variables aisladas. Dos genes pueden estar co expresados, la edad del cliente y la duración de suscripción correlacionan. Entender estas relaciones te ayuda a seleccionar features y detectar multicolinealidad.
</MascotMessage>

Ya sabes describir variables individuales. Ahora aprenderás a cuantificar relaciones entre pares de variables. Esto es esencial para EDA (Lección 6), PCA (Lección 7), y todo el Módulo 4 de Machine Learning.

</RevealSequence>

</Section>

<Section number={2} title="Covarianza: ¿se mueven juntas?" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La covarianza responde una pregunta simple: ¿cuando X sube, Y sube o baja?",
    "Pero cuidado: depende de la escala de las variables.",
    "Comparar metros con kilos por covarianza no tiene sentido sin normalizar.",
  ]}
/>

<ConceptCard variant="definition">
La covarianza mide cómo dos variables varían juntas:

$$\text{Cov}(X, Y) = \frac{1}{n} \sum_{i=1}^{n} (x_i \bar{x})(y_i \bar{y})$$
</ConceptCard>

<EquationTour caption="Covarianza: qué mide cada término del movimiento conjunto.">
  <EquationStep label="Desvío X">
    $(x_i \bar{x})$
    Cuánto se aleja el valor de X de su media.
  </EquationStep>
  <EquationStep label="Desvío Y">
    $(y_i \bar{y})$
    Cuánto se aleja el valor de Y de su media.
  </EquationStep>
  <EquationStep label="Producto">
    $(x_i \bar{x})(y_i \bar{y})$
    Positivo si ambos suben o ambos bajan juntos.
  </EquationStep>
  <EquationStep label="Promedio">
    $\frac{1}{n}\sum_{i=1}^{n}(x_i-\bar{x})(y_i-\bar{y})$
    Promedio de los productos: signo y magnitud conjunta.
  </EquationStep>
</EquationTour>

Cuando X está por encima de su media, ¿Y también?  **covarianza positiva**. ¿Y está por debajo?  **covarianza negativa**. ¿Sin patrón?  cercana a cero.

<ConceptCard variant="warning">
**Limitación clave**: La covarianza depende de la escala. Dos variables en distintas unidades (metros vs kilos) no son comparables por covarianza. Necesitamos normalizarla.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="Pearson: la correlación clásica" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Pearson es la covarianza normalizada a [-1, 1].",
    "Mide relaciones lineales perfectas y falla cuando la relación es curva pero monótona.",
    "Para esos casos existe Spearman, que veremos enseguida.",
  ]}
/>

<ConceptCard variant="definition">
El coeficiente de correlación de Pearson normaliza la covarianza a [-1, 1]:

$$\rho_{X,Y} = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y}$$

<EquationTour caption="Pearson: covarianza normalizada a [-1, 1].">
  <EquationStep label="Numerador">
    $\text{Cov}(X, Y)$
    Movimiento conjunto de X e Y.
  </EquationStep>
  <EquationStep label="Denominador">
    $\sigma_X \sigma_Y$
    Producto de dispersiones para hacerlo adimensional.
  </EquationStep>
  <EquationStep label="Cociente">
    $\rho_{X,Y} = \frac{\text{Cov}(X,Y)}{\sigma_X \sigma_Y}$
    Resultado en [-1,1]: signo y fuerza lineal.
  </EquationStep>
</EquationTour>

- $+1$: relación lineal positiva perfecta
- $0$: sin relación lineal
- $-1$: relación lineal negativa perfecta
</ConceptCard>

**Supuestos de Pearson**: linealidad, normalidad (para inferencia), homocedasticidad, sin outliers extremos.

<ConceptCard variant="key idea">
Pearson mide relaciones LINEALES. Si la relación es curva pero monótona (siempre creciente), Pearson puede ser bajo aunque exista una relación fuerte. Para eso existe Spearman.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Spearman: basado en rangos" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Spearman cambia los valores por sus rangos.",
    "Por eso resiste outliers y datos sesgados, y captura relaciones monótonas.",
    "Robusto cuando la distribución de ingresos, gastos o expresión génica tiene colas largas.",
  ]}
/>

<ConceptCard variant="definition">
La correlación de Spearman usa rangos en lugar de valores originales:

$$\rho_s = \frac{\text{Cov}(R(X), R(Y))}{\sigma_{R(X)} \sigma_{R(Y)}}$$

<EquationTour caption="Spearman: Pearson aplicado a rangos, resistente a outliers.">
  <EquationStep label="Rangos">
    $R(X),\ R(Y)$
    Reemplaza cada valor por su posición ordenada.
  </EquationStep>
  <EquationStep label="Covarianza">
    $\text{Cov}(R(X), R(Y))$
    Movimiento conjunto de los rangos, no de los valores originales.
  </EquationStep>
  <EquationStep label="Dispersión">
    $\sigma_{R(X)} \sigma_{R(Y)}$
    Normaliza por la dispersión de los rangos.
  </EquationStep>
  <EquationStep label="Coeficiente">
    $\rho_s$
    Resultado en [-1,1]: fuerza monotónica.
  </EquationStep>
</EquationTour>

Donde $R(X)$ son los rangos (1°, 2°, 3°...).
</ConceptCard>

<ConceptCard variant="key idea">
Comparación Pearson vs Spearman:
- **Pearson**: mide relación lineal; requiere normalidad y linealidad; muy sensible a outliers; usar en datos normales con relación lineal (ej. peso vs altura).
- **Spearman**: mide relación monótona (siempre creciente o decreciente); no paramétrico; robusto (usa rangos); usar en datos sesgados, relación no lineal y outliers (ej. ingresos vs gastos).
</ConceptCard>

</RevealSequence>

</Section>

<Section number={5} title="Pearson vs Spearman en código" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La teoría se aclara en la consola.",
    "Compara la relación lineal, la cúbica monotónica y el ruido sin relación.",
    "Observá cómo Pearson y Spearman se comportan distinto en la cúbica.",
  ]}
/>

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

<ChoiceQuestion
  question="Para la relación cúbica (y = x³), Pearson da ~0.2 pero Spearman da ~0.95. ¿Por qué tanta diferencia? ¿Cuál es la correlación 'real'?"
  moduleSlug="estadistica"
  lessonSlug="lesson05_relationships"
  blockId="reflection l05 pearson spearman"
  allowContinueOnIncorrect
  explanation="Pearson mide relación lineal (x³ no es lineal  bajo ~0.2); Spearman mide relación monotónica (x³ siempre crece  alto ~0.95). No hay correlación 'más real': depende del objetivo; Spearman suele ayudar en selección de features para árboles."
  options={[
    { id: "a", label: "Pearson mide lineal (x³ no es lineal  ~0.2) y Spearman mide monotónica (x³ siempre crece  ~0.95); no hay 'más real', depende del objetivo", correct: true, feedback: "¡Exacto! Tipo de relación (lineal vs monotónica) explica la diferencia." },
    { id: "b", label: "Spearman está mal: la verdadera correlación es el valor de Pearson (~0.2)", correct: false, feedback: "Pearson sólo mide linealidad; una monotónica fuerte puede dar Pearson bajo sin error de cálculo." },
    { id: "c", label: "Pearson es el correcto porque toda correlación real es lineal por definición", correct: false, feedback: "Pearson cuantifica linealidad, pero no toda relación real se reduce a una recta." },
    { id: "d", label: "El bajo Pearson indica outliers extremos en x³ que habría que eliminar", correct: false, feedback: "No hay outliers: la diferencia se explica por el tipo de relación, no por anomalías." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={6} title="Matriz de correlación y mapa de calor" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un dataset raramente tiene dos variables.",
    "La matriz de correlación resume todas las relaciones por pares en una sola vista.",
    "El mapa de calor hace visible la multicolinealidad antes de entrenar un modelo lineal.",
  ]}
/>

```python
import seaborn as sns
iris = sns.load_dataset('iris')
numeric = iris.select_dtypes(include=[np.number])

corr_matrix = numeric.corr()

plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='RdBu_r', center=0,
            square=True, linewidths=1, fmt='.2f')
plt.title('Iris Matriz de Correlación')
plt.show()
```

<ConceptCard variant="key idea">
La diagonal siempre es 1 (una variable correlaciona perfectamente consigo misma). Busca valores $|r| > 0.8$ fuera de la diagonal   indican multicolinealidad, qué degrada la estabilidad de modelos lineales.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={7} title="Correlación ≠ Causalidad" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El error más peligroso en estadística es confundir correlación con causalidad.",
    "Ventas de helado y ahogamientos suben en verano: ambos son causados por el calor.",
    "La correlación es una pista, nunca una conclusión causal.",
  ]}
/>

<ConceptCard variant="warning">
**El error más peligroso en estadística**: confundir correlación con causalidad.

- Ventas de helado ↑ y ahogamientos ↑ en verano. ¿El helado causa ahogamientos? No   ambos son causados por el calor (variable de confusión).
- Países con más consumo de chocolate tienen más premios Nobel. ¿Causalidad? No   ambos correlacionan con el PIB per cápita.
</ConceptCard>

<CalloutInfo>
Siempre pregúntate: ¿hay una tercera variable qué explique ambas? ¿Podría ser al revés la causalidad? ¿Es solo coincidencia? La correlación es una pista, no una conclusión.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={8} title="Checkpoint" eyebrow="EVALUACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    " Antes de cerrar, veamos dos casos de aplicación.",
    "Uno muestra overfitting disfrazado de correlación alta.",
    "El otro te obliga a elegir el coeficiente correcto para datos sesgados.",
  ]}
/>

<ChoiceQuestion
  question="Encontraste qué la cantidad de features usadas en un modelo correlaciona r=0.9 con el accuracy en training, pero r=−0.3 con el accuracy en test. ¿Qué está pasando?"
  moduleSlug="estadistica"
  lessonSlug="lesson05_relationships"
  blockId="reflection l05 causation"
  allowContinueOnIncorrect
  explanation="Overfitting: más features memorizan el training (r=0.9) pero dañan generalización (r=−0.3). Correlación alta en training NO implica mejor modelo; evaluar siempre en test."
  options={[
    { id: "a", label: "Overfitting: más features memorizan el training (r=0.9) pero dañan la generalización (r=−0.3)", correct: true, feedback: "¡Exacto! La correlación train test cuenta historias distintas." },
    { id: "b", label: "Las features adicionales mejoran el modelo; la caída en test es solo azar", correct: false, feedback: "La correlación negativa en test (r=−0.3) muestra pérdida sistemática de generalización, no azar." },
    { id: "c", label: "Hay que eliminar todas las features; menos es siempre mejor", correct: false, feedback: "El problema es el overfitting, no la cantidad en sí; conviene selección/regularización, no eliminación ciega." },
    { id: "d", label: "El test set está mal etiquetado y por eso la correlación sale negativa", correct: false, feedback: "No hay evidencia de etiquetas erróneas; el patrón r=0.9 train vs r=−0.3 test es firma típica de overfitting." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué preferirías Spearman sobre Pearson para datos de ingresos?"
  moduleSlug="estadistica"
  lessonSlug="lesson05_relationships"
  blockId="choice estadistica l05 rev 1"
  allowContinueOnIncorrect
  explanation="Los ingresos son extremadamente sesgados a la derecha (pocas personas ganan muchísimo): Pearson es sensible a esos outliers extremos, mientras Spearman usa rangos y les da a todos el mismo peso relativo."
  options={[
    { id: "a", label: "Porque Spearman usa rangos y resiste los outliers extremos de ingresos", correct: true, feedback: "¡Correcto! Pearson se dispara con las colas largas de ingresos." },
    { id: "b", label: "Porque Pearson solo sirve para distribuciones discretas", correct: false, feedback: "Pearson sirve para relaciones lineales; el problema es su sensibilidad a outliers." },
    { id: "c", label: "Porque Spearman mide solo relaciones lineales, mejor para ingresos", correct: false, feedback: "Spearman mide relaciones monótonas, no solo lineales." },
    { id: "d", label: "Porque Pearson usa rangos y por eso es robusto a outliers", correct: false, feedback: "Es al revés: Spearman usa rangos, Pearson valores absolutos." },
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
    "La correlación no implica causalidad   ancla el glosario.",
    "Estos seis términos resumen todo lo trabajado hoy.",
    "Volvé a ellos cuando explores matrices en datasets reales.",
  ]}
/>

<ConceptCard variant="key idea">
Términos clave:
- **Covarianza**: medida de variación conjunta (dependiente de escala).
- **Correlación de Pearson**: covarianza normalizada a [-1,1]; mide relación lineal.
- **Correlación de Spearman**: correlación sobre rangos; mide relación monótona.
- **Matriz de Correlación**: matriz cuadrada de correlaciones por pares entre variables.
- **Multicolinealidad**: alta correlación entre features   inestabiliza modelos lineales.
- **Correlación Espuria**: correlación sin relación causal (variable de confusión).
</ConceptCard>

</RevealSequence>

</Section>

<Section number={10} title="Para la próxima lección" eyebrow="CIERRE">

<RevealSequence mode="appear">

<MascotMessage mood="celebrating">
Correlación no implica causalidad. Esta distinción debe guiar todo el análisis exploratorio. Ya tienes las herramientas para explorar relaciones entre variables, una habilidad esencial para el análisis exploratorio de datos.
</MascotMessage>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En la Lección 6 juntaremos TODO lo aprendido hasta ahora.",
    "EDA completo: valores faltantes, outliers, visualizaciones y flujo de trabajo de científico de datos.",
    "Vas a aplicar estadística descriptiva, distribuciones y correlaciones en un caso real.",
  ]}
/>

**En la Lección 6** vamos a juntar TODO lo aprendido hasta ahora en un Análisis Exploratorio de Datos (EDA) completo: valores faltantes, outliers, visualizaciones, y exploración de features. Vas a aplicar estadística descriptiva, distribuciones y correlaciones en un flujo de trabajo real de científico de datos.

</RevealSequence>

</Section>
