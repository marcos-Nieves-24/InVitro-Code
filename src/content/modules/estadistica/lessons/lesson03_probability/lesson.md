
Module: 3
Lesson Number: 3
Lesson Title: Fundamentos de Probabilidad
Estimated Duration: 90 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  Enunciar los tres axiomas de Kolmogorov de la probabilidad
  Calcular probabilidades condicionales usando el teorema de Bayes
  Aplicar la ley de probabilidad total a problemas de partición
  Distinguir entre variables aleatorias discretas y continuas
  Resolver problemas de probabilidad con datos del mundo real
Keywords: probabilidad, axiomas de Kolmogorov, probabilidad condicional, teorema de Bayes, variables aleatorias, ley de probabilidad total
Difficulty: Intermedio
Programming Concepts: numpy, scipy.stats, matplotlib
Mathematical Concepts: axiomas de probabilidad, probabilidad condicional, regla de Bayes, esperanza, varianza
Machine Learning Concepts: pensamiento probabilístico, cuantificación de incertidumbre
Datasets Used: Datos sintéticos, datos de pruebas médicas
Notebook: 03_probability.ipynb
Assignment: probability_assignment.md
Quiz: probability_quiz.md


<Section number={1} title="La ciencia de la incertidumbre" eyebrow="INICIO">
<RevealSequence mode="appear">

<MascotMessage mood="thinking">
Todo modelo de machine learning hace predicciones bajo incertidumbre. Un clasificador nunca sabe con 100% de certeza. La probabilidad es el lenguaje matemático para expresar esa incertidumbre. Sin ella, no puedes interpretar la confianza de un modelo ni evaluar métodos bayesianos.
</MascotMessage>

En biotecnología, la probabilidad cuantifica la precisión de tests diagnósticos: "Si un paciente da positivo, ¿cuál es la probabilidad de qué realmente tenga la enfermedad?" En SaaS, modelos de probabilidad predicen la deserción: "¿Cuál es la probabilidad de qué este usuario cancele en 30 días?"

<ConceptCard variant="key idea">
La probabilidad no elimina la incertidumbre   la mide. Y medirla es el primer paso para tomar decisiones informadas.
</ConceptCard>

</RevealSequence>
</Section>

<Section number={2} title="Los tres axiomas de Kolmogorov" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

Andrey Kolmogorov formalizó la probabilidad con tres axiomas qué son la base de TODO:

<ConceptCard variant="definition">
**Axioma 1 (No negatividad)**: Para cualquier evento $A$, $P(A) \geq 0$.

**Axioma 2 (Normalización)**: $P(S) = 1$ dónde $S$ es el espacio muestral completo.

**Axioma 3 (Aditividad)**: Para eventos mutuamente excluyentes:

$$P\left(\bigcup_{i=1}^{\infty} A_i\right) = \sum_{i=1}^{\infty} P(A_i)$$
</ConceptCard>

<ConceptCard variant="key idea">
Las probabilidades siempre están entre 0 y 1. Algo debe ocurrir (total = 1). Si dos eventos no pueden ocurrir juntos, la probabilidad de uno u otro es la suma.
</ConceptCard>

</RevealSequence>
</Section>

<Section number={3} title="Probabilidad Condicional" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<ConceptCard variant="definition">
La probabilidad condicional responde: "Sabiendo qué B ocurrió, ¿cuál es la probabilidad de A?"

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$
</ConceptCard>

Intuición: Si sabemos qué B ocurrió, restringimos nuestra atención al "mundo" dónde B es cierto. La probabilidad de A en ese mundo es la porción de A qué se superpone con B, renormalizada.

<ConceptCard variant="warning">
**Error clásico**: confundir $P(A|B)$ con $P(B|A)$. La probabilidad de tener cáncer dado un test positivo NO es igual a la probabilidad de un test positivo dado qué tienes cáncer. Esto se llama la "falacia del fiscal".
</ConceptCard>

</RevealSequence>
</Section>

<Section number={4} title="Teorema de Bayes: la regla qué cambia todo" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<ConceptCard variant="definition">
El Teorema de Bayes actualiza nuestras creencias cuándo observamos evidencia:

$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)} = \frac{P(B \mid A) \cdot P(A)}{\sum_{i} P(B \mid A_i) \cdot P(A_i)}$$
</ConceptCard>

<EquationTour caption="Bayes actualiza la creencia inicial con la evidencia observada.">
  <EquationStep label="Prior">
    $P(A)$
    Creencia inicial antes de ver la evidencia.
  </EquationStep>
  <EquationStep label="Verosimilitud">
    $P(B \mid A)$
    Probabilidad de la evidencia si A es cierto.
  </EquationStep>
  <EquationStep label="Denominador">
    $P(B)$
    Probabilidad total de la evidencia en todos los casos.
  </EquationStep>
  <EquationStep label="Posterior">
    $P(A \mid B)$
    Creencia actualizada después de observar B.
  </EquationStep>
</EquationTour>

**Ley de Probabilidad Total**

$$P(A) = \sum_{i=1}^{k} P(A \mid B_i) \cdot P(B_i)$$

Para encontrar la probabilidad total de A, consideras todas las formas en qué A puede ocurrir, ponderadas por la probabilidad de cada escenario.

</RevealSequence>
</Section>

<Section number={5} title="Variables Aleatorias" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<ConceptCard variant="definition">
Una variable aleatoria es una función qué asigna un número real a cada resultado del espacio muestral.
</ConceptCard>

<ConceptCard variant="key idea">
- **Valores**: Contables (0, 1, 2, ...) → Cualquier valor en un intervalo
- **Probabilidad**: PMF: $p(x) = P(X = x)$ → PDF: $P(a \leq X \leq b) = \int_a^b f(x)dx$
- **Esperanza**: $E[X] = \sum x \cdot P(X=x)$ → $E[X] = \int x f(x)dx$
- **Ejemplo**: Cantidad de usuarios qué cancelan → Nivel de expresión génica
- **Varianza**: $\text{Var}(X) = E[X^2] E[X]^2$ → Misma fórmula
</ConceptCard>

<CalloutInfo>
**CDF** (Función de Distribución Acumulada): $F(x) = P(X \leq x)$. La CDF responde "¿cuál es la probabilidad de qué X sea menor o igual a x?" y funciona tanto para discretas cómo continuas.
</CalloutInfo>

</RevealSequence>
</Section>

<Section number={6} title="Bayes en acción: test de diagnóstico" eyebrow="INTERACTIVA">
<RevealSequence mode="appear">

Apliquemos Bayes a un caso médico real. Una enfermedad rara y un test imperfecto:

```python
import numpy as np

# Prevalencia: 1% de la población
# Sensibilidad: 95% (detecta 95% de los casos reales)
# Especificidad: 90% (identifica 90% de los sanos)

p_disease = 0.01
p_pos_given_disease = 0.95
p_pos_given_no_disease = 0.10  # 10% falsos positivos

# Bayes: P(enfermedad | positivo)
p_disease_given_pos = (p_pos_given_disease * p_disease) / (
    p_pos_given_disease * p_disease + p_pos_given_no_disease * (1 p_disease)
)

print(f"P(enfermedad | positivo) = {p_disease_given_pos:.3f}")
print(f"¡Sólo {p_disease_given_pos*100:.1f}%!")
```

<BayesUpdate caption="Recorrí los pasos con estos mismos números  prevalencia 1%, sensibilidad 95%, especificidad 90%  y después subí la prevalencia para ver cómo el positivo deja de ser engañoso." />

<ChoiceQuestion
  question="El test tiene 95% de sensibilidad, pero un resultado positivo solo implica 8.8% de probabilidad de tener la enfermedad. ¿Cómo es posible? ¿El test es malo?"
  moduleSlug="estadistica"
  lessonSlug="lesson03_probability"
  blockId="reflection l03 bayes rare"
  allowContinueOnIncorrect
  explanation="No es malo: con prevalencia del 1%, de 1000 sólo 10 están enfermos; el test detecta ~9.5 y genera ~99 falsos positivos entre 990 sanos. De ~108 positivos sólo ~9.5 son reales (~8.8%). Paradoja de la tasa base: condición rara → la mayoría de los positivos son falsos."
  options={[
    { id: "a", label: "El test no es malo; la enfermedad es rara: los falsos positivos dominan los positivos", correct: true, feedback: "Correcto: baja prevalencia hace que falsos positivos superen a verdaderos positivos." },
    { id: "b", label: "El test es malo por falta de especificidad (10% FP)", correct: false, feedback: "Especificidad ~90% es razonable; el cuello de botella es la prevalencia del 1%." },
    { id: "c", label: "95% de sensibilidad es insuficiente", correct: false, feedback: "95% es alta; el problema es la baja prevalencia del 1%." },
    { id: "d", label: "Un positivo implica ~95% de tener la enfermedad", correct: false, feedback: "Confunde P(positivo|enfermedad) con P(enfermedad|positivo): error de tasa base." },
  ]}
/>

</RevealSequence>
</Section>

<Section number={7} title="Caso biotecnológico: variantes génicas" eyebrow="INTERACTIVA">
<RevealSequence mode="appear">

Clasificación de mutaciones en ADN. Una herramienta bioinformática analiza variantes:

```python
# Sólo 0.1% de variantes son patogénicas
p_pathogenic = 0.001
p_benign = 0.999

# Herramienta: 95% sensibilidad, 2% falsos positivos
p_detect_given_pathogenic = 0.95
p_detect_given_benign = 0.02

p_pathogenic_given_detect = (p_detect_given_pathogenic * p_pathogenic) / (
    p_detect_given_pathogenic * p_pathogenic + p_detect_given_benign * p_benign
)
print(f"P(patogénica | detectada) = {p_pathogenic_given_detect:.3f}")
```

<CalloutInfo>
Incluso con 95% de precisión, una variante marcada cómo patogénica tiene solo ~4.5% de probabilidad de serlo realmente. Esto explica por qué los genetistas siempre validan con estudios funcionales antes de diagnosticar.
</CalloutInfo>

</RevealSequence>
</Section>

<Section number={8} title="Predicción de deserción en SaaS" eyebrow="INTERACTIVA">
<RevealSequence mode="appear">

```python
# 10% de clientes cancelan cada mes
# Modelo: 80% precisión para los qué cancelan
#         15% falsas alarmas para los qué se quedan

p_churn = 0.10
p_pred_churn_given_churn = 0.80
p_pred_churn_given_stay = 0.15

p_churn_given_pred = (p_pred_churn_given_churn * p_churn) / (
    p_pred_churn_given_churn * p_churn + p_pred_churn_given_stay * (1 p_churn)
)
print(f"P(deserción | predicho) = {p_churn_given_pred:.3f}")
```

<ChoiceQuestion
  question="De los clientes marcados cómo 'en riesgo de cancelar', solo el 37% realmente cancela. ¿Debería el equipo de retención contactar a todos los marcados? ¿Qué trade off enfrentan?"
  moduleSlug="estadistica"
  lessonSlug="lesson03_probability"
  blockId="reflection l03 churn bayes"
  allowContinueOnIncorrect
  explanation="Depende del costo de contactar vs perder cliente: contacto barato (email) → contactar todos y rescatar ~80% de los que cancelarían; contacto caro → modelo más preciso. Trade off entre recall (detectar canceladores) y precision (no molestar no canceladores)."
  options={[
    { id: "a", label: "Depende del costo: si contactar es barato, sí (rescata ~80% de canceladores); trade off recall vs precision", correct: true, feedback: "Correcto: el contacto barato justifica rescatar la mayoría de canceladores." },
    { id: "b", label: "Contactar a todos siempre, sin importar el costo", correct: false, feedback: "Si contactar es caro (account manager), el beneficio puede no cubrir el costo." },
    { id: "c", label: "No contactar hasta tener precisión perfecta", correct: false, feedback: "Esperar precisión perfecta deja escapar la mayoría de canceladores." },
    { id: "d", label: "El 37% de precisión hace el modelo inútil", correct: false, feedback: "Con contacto barato, rescatar ~80% de canceladores ya justifica usarlo." },
  ]}
/>

</RevealSequence>
</Section>

<Section number={9} title="Errores comunes" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<ConceptCard variant="warning">
**Cuatro trampas probabilísticas:**

1. **Confundir $P(A|B)$ con $P(B|A)$**   la falacia del fiscal. Son cosas completamente diferentes.
2. **Ignorar la tasa base**   Bayes muestra qué eventos raros siguen siendo raros incluso con evidencia positiva.
3. **Asumir independencia sin verificar**   multiplicar probabilidades solo funciona si los eventos son independientes.
4. **Malinterpretar el valor p**   un valor p NO es la probabilidad de qué la hipótesis nula sea verdadera.
</ConceptCard>

<CalloutInfo>
**Mejores prácticas:**
- Escribe siempre la probabilidad a priori antes de actualizar con evidencia
- Usa simulación para verificar cálculos de probabilidad (es más fácil qué el álgebra)
- Visualiza distribuciones cuándo sea posible   una imagen vale más qué mil fórmulas
- La probabilidad cuantifica incertidumbre, no la elimina   no busques certezas dónde no las hay
</CalloutInfo>

</RevealSequence>
</Section>

<Section number={10} title="Checkpoint" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Por qué el Axioma 2 de Kolmogorov (P(S) = 1) es necesario? ¿Qué pasaría si la probabilidad total no fuera 1?"
  moduleSlug="estadistica"
  lessonSlug="lesson03_probability"
  blockId="reflection l03 axioms"
  allowContinueOnIncorrect
  explanation="P(S)=1 garantiza que 'algo ocurre' y que las probabilidades sean interpretables como frecuencias o grados de creencia. Sin él, ningún resultado podría ocurrir: inconsistencia lógica. Es 'el todo es la suma de las partes'."
  options={[
    { id: "a", label: "Garantiza que 'algo ocurre' y hace interpretables las probabilidades como frecuencias o grados de creencia", correct: true, feedback: "Correcto: sin probabilidad total 1, la interpretación frecuentista se rompe." },
    { id: "b", label: "Es solo una convención de escala al 100%", correct: false, feedback: "No es solo escala: sin total 1, ninguna 'certeza' se representaría." },
    { id: "c", label: "Se requiere para la independencia entre eventos", correct: false, feedback: "La independencia se define por producto de probabilidades, no por este axioma." },
    { id: "d", label: "Podría fijarse en otra constante sin problema", correct: false, feedback: "Otra constante rompería la interpretación frecuentista y la consistencia lógica." },
  ]}
/>

<ChoiceQuestion
  question="Se lanza un dado justo. ¿Cuáles son P(sacar 3) y P(número par)?"
  moduleSlug="estadistica"
  lessonSlug="lesson03_probability"
  blockId="choice estadistica l03 rev 1"
  allowContinueOnIncorrect
  explanation="P(3) = 1/6 (un resultado favorable entre seis igualmente probables); P(par) = 3/6 = 1/2 (tres resultados pares: 2, 4, 6)."
  options={[
    { id: "a", label: "P(3) = 1/6 y P(par) = 1/2", correct: true, feedback: "¡Correcto! Un resultado para el 3 y tres resultados pares." },
    { id: "b", label: "P(3) = 1/3 y P(par) = 1/6", correct: false, feedback: "1/3 contaría dos caras, no el 3; 1/6 subestima los tres resultados pares." },
    { id: "c", label: "P(3) = 1/2 y P(par) = 1/6", correct: false, feedback: "1/2 sobreestima el resultado único del 3." },
    { id: "d", label: "P(3) = 1/6 y P(par) = 1/3", correct: false, feedback: "El número par tiene 3 resultados (2,4,6), por eso es 1/2, no 1/3." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué es esencial entender probabilidad condicional para interpretar puntajes de confianza de ML?"
  moduleSlug="estadistica"
  lessonSlug="lesson03_probability"
  blockId="choice estadistica l03 rev 2"
  allowContinueOnIncorrect
  explanation="Un clasificador con '95% confianza' entrega P(clase | features), no P(features | clase); confundirlas sobreestima la precisión, sobre todo con clases desbalanceadas."
  options={[
    { id: "a", label: "Porque 95% de confianza es P(clase | features), no P(features | clase)", correct: true, feedback: "¡Correcto! Confundirlas sobreestima la precisión del modelo." },
    { id: "b", label: "Porque la probabilidad condicional garantiza precisión del 100%", correct: false, feedback: "La probabilidad cuantifica, no elimina la incertidumbre." },
    { id: "c", label: "Porque P(features | clase) es lo mismo que P(clase | features)", correct: false, feedback: "Son direcciones distintas: causa vs evidencia." },
    { id: "d", label: "Porque el puntaje debe multiplicarse por el tamaño del dataset", correct: false, feedback: "El tamaño del dataset no corrige la confusión de dirección." },
  ]}
/>

</RevealSequence>
</Section>

<Section number={11} title="Términos clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<ConceptCard variant="key idea">
- **Espacio Muestral**: Conjunto de todos los resultados posibles de un experimento
- **Evento**: Subconjunto del espacio muestral
- **Probabilidad Condicional**: P(A|B): probabilidad de A sabiendo qué B ocurrió
- **Teorema de Bayes**: Fórmula para actualizar probabilidades con nueva evidencia
- **Probabilidad a Priori**: Creencia inicial antes de observar evidencia
- **Probabilidad a Posteriori**: Creencia actualizada después de la evidencia
- **Variable Aleatoria**: Función qué asigna un número a cada resultado
- **Valor Esperado**: Promedio a largo plazo de una variable aleatoria
</ConceptCard>

</RevealSequence>
</Section>

<Section number={12} title="Para la próxima lección" eyebrow="CIERRE">
<RevealSequence mode="appear">

<MascotMessage mood="celebrating">
Bayes es la herramienta matemática para razonar bajo incertidumbre. Todo el machine learning moderno  desde clasificadores naive Bayes hasta redes neuronales bayesianas  se construye sobre estas ideas.
</MascotMessage>

**¿Qué aprendiste hoy?**
- Los tres axiomas de Kolmogorov son los cimientos de la probabilidad
- $P(A|B) \neq P(B|A)$   la falacia del fiscal se cobra víctimas todos los días
- Bayes actualiza creencias: a priori → evidencia → a posteriori
- Las variables aleatorias discretas y continuas se manejan con PMF y PDF

**En la Lección 4** vamos a conocer las distribuciones con nombre y apellido: Bernoulli, Binomial, Poisson y la famosísima distribución Normal. Porque hasta ahora hablamos de probabilidad en abstracto   es hora de ponerle nombres a las curvas.

</RevealSequence>
</Section>
