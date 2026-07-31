---
Module: 3
Lesson Number: 3
Lesson Title: Fundamentos de Probabilidad
Estimated Duration: 90 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  - Enunciar los tres axiomas de Kolmogorov de la probabilidad
  - Calcular probabilidades condicionales usando el teorema de Bayes
  - Aplicar la ley de probabilidad total a problemas de partición
  - Distinguir entre variables aleatorias discretas y continuas
  - Resolver problemas de probabilidad con datos del mundo real
Keywords: probabilidad, axiomas de Kolmogorov, probabilidad condicional, teorema de Bayes, variables aleatorias, ley de probabilidad total
Difficulty: Intermedio
Programming Concepts: numpy, scipy.stats, matplotlib
Mathematical Concepts: axiomas de probabilidad, probabilidad condicional, regla de Bayes, esperanza, varianza
Machine Learning Concepts: pensamiento probabilístico, cuantificación de incertidumbre
Datasets Used: Datos sintéticos, datos de pruebas médicas
Notebook: 03_probability.ipynb
Assignment: probability_assignment.md
Quiz: probability_quiz.md
---

<Section number={1} title="La ciencia de la incertidumbre" eyebrow="INICIO">

<MascotMessage mood="curious">
Todo modelo de machine learning hace predicciones bajo incertidumbre. Un clasificador nunca sabe con 100% de certeza. La probabilidad es el lenguaje matemático para expresar esa incertidumbre. Sin ella, no podés interpretar la confianza de un modelo ni evaluar métodos bayesianos.
</MascotMessage>

En biotecnología, la probabilidad cuantifica la precisión de tests diagnósticos: "Si un paciente da positivo, ¿cuál es la probabilidad de qué realmente tenga la enfermedad?" En SaaS, modelos de probabilidad predicen la deserción: "¿Cuál es la probabilidad de qué este usuario cancele en 30 días?"

<ConceptCard variant="key-idea">
La probabilidad no elimina la incertidumbre — la mide. Y medirla es el primer paso para tomar decisiones informadas.
</ConceptCard>

</Section>

<Section number={2} title="Los tres axiomas de Kolmogorov" eyebrow="CONCEPTO">

Andrey Kolmogorov formalizó la probabilidad con tres axiomas qué son la base de TODO:

<ConceptCard variant="definition">
**Axioma 1 (No negatividad)**: Para cualquier evento $A$, $P(A) \geq 0$.

**Axioma 2 (Normalización)**: $P(S) = 1$ dónde $S$ es el espacio muestral completo.

**Axioma 3 (Aditividad)**: Para eventos mutuamente excluyentes:

$$P\left(\bigcup_{i=1}^{\infty} A_i\right) = \sum_{i=1}^{\infty} P(A_i)$$
</ConceptCard>

<ConceptCard variant="key-idea">
Las probabilidades siempre están entre 0 y 1. Algo debe ocurrir (total = 1). Si dos eventos no pueden ocurrir juntos, la probabilidad de uno u otro es la suma.
</ConceptCard>

</Section>

<Section number={3} title="Probabilidad Condicional" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
La probabilidad condicional responde: "Sabiendo qué B ocurrió, ¿cuál es la probabilidad de A?"

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$
</ConceptCard>

Intuición: Si sabemos qué B ocurrió, restringimos nuestra atención al "mundo" dónde B es cierto. La probabilidad de A en ese mundo es la porción de A qué se superpone con B, renormalizada.

<ConceptCard variant="warning">
**Error clásico**: confundir $P(A|B)$ con $P(B|A)$. La probabilidad de tener cáncer dado un test positivo NO es igual a la probabilidad de un test positivo dado qué tenés cáncer. Esto se llama la "falacia del fiscal".
</ConceptCard>

</Section>

<Section number={4} title="Teorema de Bayes: la regla qué cambia todo" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
El Teorema de Bayes actualiza nuestras creencias cuándo observamos evidencia:

$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)} = \frac{P(B \mid A) \cdot P(A)}{\sum_{i} P(B \mid A_i) \cdot P(A_i)}$$
</ConceptCard>

<ConceptCard variant="key-idea">
$P(A)$ es la **probabilidad a priori** (lo qué creíamos antes). $P(A|B)$ es la **probabilidad a posteriori** (lo qué creemos después de ver la evidencia B). Bayes nos dice exactamente cuánto actualizar nuestras creencias.
</ConceptCard>

### Ley de Probabilidad Total

$$P(A) = \sum_{i=1}^{k} P(A \mid B_i) \cdot P(B_i)$$

Para encontrar la probabilidad total de A, considerás todas las formas en qué A puede ocurrir, ponderadas por la probabilidad de cada escenario.

</Section>

<Section number={5} title="Variables Aleatorias" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Una variable aleatoria es una función qué asigna un número real a cada resultado del espacio muestral.
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Valores", left: "Contables (0, 1, 2, ...)", right: "Cualquier valor en un intervalo" },
    { feature: "Probabilidad", left: "PMF: $p(x) = P(X = x)$", right: "PDF: $P(a \\leq X \\leq b) = \\int_a^b f(x)dx$" },
    { feature: "Esperanza", left: "$E[X] = \\sum x \\cdot P(X=x)$", right: "$E[X] = \\int x f(x)dx$" },
    { feature: "Ejemplo", left: "Cantidad de usuarios qué cancelan", right: "Nivel de expresión génica" },
    { feature: "Varianza", left: "$\\text{Var}(X) = E[X^2] - E[X]^2$", right: "Misma fórmula" },
  ]}
/>

<CalloutInfo>
**CDF** (Función de Distribución Acumulada): $F(x) = P(X \leq x)$. La CDF responde "¿cuál es la probabilidad de qué X sea menor o igual a x?" y funciona tanto para discretas cómo continuas.
</CalloutInfo>

</Section>

<Section number={6} title="Bayes en acción: test de diagnóstico" eyebrow="INTERACTIVA">

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
    p_pos_given_disease * p_disease + p_pos_given_no_disease * (1 - p_disease)
)

print(f"P(enfermedad | positivo) = {p_disease_given_pos:.3f}")
print(f"¡Sólo {p_disease_given_pos*100:.1f}%!")
```

<ReflectionCheck
  blockId="reflection-l03-bayes-rare"
  moduleSlug="estadistica"
  lessonSlug="lesson03_probability"
  prompt="El test tiene 95% de sensibilidad, pero un resultado positivo sólo implica 8.8% de probabilidad de tener la enfermedad. ¿Cómo es posible? ¿El test es malo?"
  answer="No, el test no es malo — ¡la enfermedad es rara! Con prevalencia del 1%, de 1000 personas sólo 10 tienen la enfermedad. El test detecta ~9.5 de esas 10 (95% sensibilidad), pero también marca falsamente ~99 de las 990 sanas (10% falsos positivos). De ~108 tests positivos, sólo ~9.5 son reales → ~8.8%. Esto se llama la paradoja de la tasa base: cuándo la condición es rara, la mayoría de los positivos son falsos positivos."
/>

</Section>

<Section number={7} title="Caso biotecnológico: variantes génicas" eyebrow="INTERACTIVA">

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
Incluso con 95% de precisión, una variante marcada cómo patogénica tiene sólo ~4.5% de probabilidad de serlo realmente. Esto explica por qué los genetistas siempre validan con estudios funcionales antes de diagnosticar.
</CalloutInfo>

</Section>

<Section number={8} title="Predicción de deserción en SaaS" eyebrow="INTERACTIVA">

```python
# 10% de clientes cancelan cada mes
# Modelo: 80% precisión para los qué cancelan
#         15% falsas alarmas para los qué se quedan

p_churn = 0.10
p_pred_churn_given_churn = 0.80
p_pred_churn_given_stay = 0.15

p_churn_given_pred = (p_pred_churn_given_churn * p_churn) / (
    p_pred_churn_given_churn * p_churn + p_pred_churn_given_stay * (1 - p_churn)
)
print(f"P(deserción | predicho) = {p_churn_given_pred:.3f}")
```

<ReflectionCheck
  blockId="reflection-l03-churn-bayes"
  moduleSlug="estadistica"
  lessonSlug="lesson03_probability"
  prompt="De los clientes marcados cómo 'en riesgo de cancelar', sólo el 37% realmente cancela. ¿Debería el equipo de retención contactar a todos los marcados? ¿Qué trade-off enfrentan?"
  answer="Depende del costo de contactar vs el costo de perder un cliente. Si contactar es barato (email automático), conviene contactar a todos — rescatás al 80% de los qué iban a cancelar. Si contactar es caro (llamada de un account manager), quizás querés un modelo más preciso. Es un trade-off clásico entre recall (detectar todos los qué cancelan) y precision (no molestar a los qué no van a cancelar)."
/>

</Section>

<Section number={9} title="Errores comunes" eyebrow="CONCEPTO">

<ConceptCard variant="warning">
**Cuatro trampas probabilísticas:**

1. **Confundir $P(A|B)$ con $P(B|A)$** — la falacia del fiscal. Son cosas completamente diferentes.
2. **Ignorar la tasa base** — Bayes muestra qué eventos raros siguen siendo raros incluso con evidencia positiva.
3. **Asumir independencia sin verificar** — multiplicar probabilidades sólo funciona si los eventos son independientes.
4. **Malinterpretar el valor p** — un valor p NO es la probabilidad de qué la hipótesis nula sea verdadera.
</ConceptCard>

<CalloutInfo>
**Mejores prácticas:**
- Escribí siempre la probabilidad a priori antes de actualizar con evidencia
- Usá simulación para verificar cálculos de probabilidad (es más fácil qué el álgebra)
- Visualizá distribuciones cuándo sea posible — una imagen vale más qué mil fórmulas
- La probabilidad cuantifica incertidumbre, no la elimina — no busques certezas dónde no las hay
</CalloutInfo>

</Section>

<Section number={10} title="Checkpoint" eyebrow="EVALUACIÓN">

<ReflectionCheck
  blockId="reflection-l03-axioms"
  moduleSlug="estadistica"
  lessonSlug="lesson03_probability"
  prompt="¿Por qué el Axioma 2 de Kolmogorov (P(S) = 1) es necesario? ¿Qué pasaría si la probabilidad total no fuera 1?"
  answer="Si la probabilidad total no fuera 1, las probabilidades no serían interpretables cómo frecuencias o grados de creencia. El axioma garantiza qué 'algo tiene qué ocurrir'. Sin él, podríamos tener escenarios dónde ningún resultado posible ocurre, lo cuál es lógicamente inconsistente. Es el equivalente probabilístico de 'el todo es la suma de las partes'."
/>

<AnswerReveal summary="Ver respuestas adicionales">
<p><strong>Se lanza un dado justo. ¿P(sacar 3)? ¿P(número par)?</strong> P(3) = 1/6 (un resultado de seis igualmente probables). P(par) = 3/6 = 1/2 (tres resultados pares: 2, 4, 6).</p>
<p><strong>¿Por qué es esencial entender probabilidad condicional para interpretar puntajes de confianza de ML?</strong> Porque un clasificador qué dice "95% confianza" está dando P(clase | features), no P(features | clase). Sin entender la diferencia, podés sobreestimar peligrosamente la precisión del modelo, especialmente con clases desbalanceadas.</p>
</AnswerReveal>

</Section>

<Section number={11} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["Espacio Muestral", "Conjunto de todos los resultados posibles de un experimento"],
    ["Evento", "Subconjunto del espacio muestral"],
    ["Probabilidad Condicional", "P(A|B): probabilidad de A sabiendo qué B ocurrió"],
    ["Teorema de Bayes", "Fórmula para actualizar probabilidades con nueva evidencia"],
    ["Probabilidad a Priori", "Creencia inicial antes de observar evidencia"],
    ["Probabilidad a Posteriori", "Creencia actualizada después de la evidencia"],
    ["Variable Aleatoria", "Función qué asigna un número a cada resultado"],
    ["Valor Esperado", "Promedio a largo plazo de una variable aleatoria"],
  ]}
  searchable={true}
  caption="Términos clave de probabilidad"
/>

</Section>

<Section number={12} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
¡Bayes es poderoso! Acabás de aprender la herramienta matemática más importante para razonar bajo incertidumbre. Todo el machine learning moderno — desde clasificadores naive Bayes hasta redes neuronales bayesianas — se construye sobre estas ideas.
</MascotMessage>

**¿Qué aprendiste hoy?**
- Los tres axiomas de Kolmogorov son los cimientos de la probabilidad
- $P(A|B) \neq P(B|A)$ — la falacia del fiscal se cobra víctimas todos los días
- Bayes actualiza creencias: a priori → evidencia → a posteriori
- Las variables aleatorias discretas y continuas se manejan con PMF y PDF

**En la Lección 4** vamos a conocer las distribuciones con nombre y apellido: Bernoulli, Binomial, Poisson y la famosísima distribución Normal. Porque hasta ahora hablamos de probabilidad en abstracto — es hora de ponerle nombres a las curvas.

</Section>
