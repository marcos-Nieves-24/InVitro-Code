---
Module: 3
Lesson Number: 4
Lesson Title: Distribuciones Estadísticas
Estimated Duration: 75 minutos
Prerequisites: Lección 3 (Fundamentos de Probabilidad)
Learning Objectives:
  - Describir las distribuciones Bernoulli, Binomial, Poisson y Normal
  - Calcular probabilidades usando PMF, PDF y CDF con scipy.stats
  - Estandarizar una distribución normal a puntajes Z
  - Elegir la distribución adecuada para un escenario de datos dado
Keywords: Bernoulli, Binomial, Poisson, Normal, Gaussiana, puntaje Z, estandarización, scipy.stats, PMF, PDF, CDF
Difficulty: Intermedio
Programming Concepts: scipy.stats, numpy, matplotlib
Mathematical Concepts: PMF, PDF, CDF, estandarización, teorema central del límite
Machine Learning Concepts: normalización de features, supuestos de distribución
Datasets Used: Datos sintéticos, dataset iris
Notebook: 04_statistical_distributions.ipynb
Assignment: statistical_distributions_assignment.md
Quiz: statistical_distributions_quiz.md
---

<Section number={1} title="Las distribuciones con nombre y apellido" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un paciente llega y, bajo el microscopio, miles de genes se expresan a la vez.",
    "En la Lección 3 aprendiste el lenguaje general de la probabilidad.",
    "Ahora conocerás las distribuciones con nombre que más aparecen en machine learning: Bernoulli, Binomial, Poisson y Normal.",
    "Cada una modela un tipo distinto de fenómeno, y elegirla bien define la calidad del modelo.",
  ]}
/>

<MascotMessage mood="thinking">
Todo proceso generador de datos en la naturaleza sigue alguna distribución de probabilidad. La expresión génica es log-normal, las llegadas de clientes son Poisson, los resultados binarios son Bernoulli. Conocer estas distribuciones con nombre te permite modelar datos de forma realista.
</MascotMessage>

</RevealSequence>

</Section>

<Section number={2} title="Bernoulli: éxito o fracaso" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Imaginá un único ensayo: ¿el paciente responde o no?",
    "La distribución Bernoulli modela exactamente ese resultado binario (1/0).",
    "Es el bloque de construcción de la Binomial y de otras distribuciones discretas.",
  ]}
/>

<ConceptCard variant="definition">
**Distribución Bernoulli**: Modela un único resultado binario (éxito/fracaso, 1/0).
- Parámetro: $p$ (probabilidad de éxito)
- PMF: $P(X = 1) = p$, $P(X = 0) = 1 - p$
- Media: $E[X] = p$, Varianza: $\text{Var}(X) = p(1-p)$
</ConceptCard>

<EquationTour caption="Bernoulli: un solo ensayo binario gobernado por p.">
  <EquationStep label="Parámetro">
    $p$
    Probabilidad de éxito en el único ensayo.
  </EquationStep>
  <EquationStep label="PMF">
    $P(X = 1) = p,\ P(X = 0) = 1 - p$
    Toda la probabilidad se reparte entre éxito y fracaso.
  </EquationStep>
  <EquationStep label="Media y varianza">
    $E[X] = p,\ \text{Var}(X) = p(1-p)$
    El promedio es p; la dispersión es máxima cuando p=1/2.
  </EquationStep>
</EquationTour>

<ConceptCard variant="key-idea">
Intuición:
- Un solo lanzamiento de moneda.
- Cada paciente responde al tratamiento o no.
- La Bernoulli es el bloque de construcción de distribuciones más complejas.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="Binomial: contar éxitos" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Si Bernoulli es un ensayo, la Binomial cuenta éxitos en muchos.",
    "Lanzar una moneda 10 veces y contar caras equivale a sumar 10 Bernoullis independientes.",
    "De 100 pacientes tratados, ¿cuántos responden? Esa respuesta ya es Binomial.",
  ]}
/>

<ConceptCard variant="definition">
**Distribución Binomial**: Cantidad de éxitos en $n$ ensayos Bernoulli independientes.
- Parámetros: $n$ (ensayos), $p$ (probabilidad de éxito)
- PMF: $P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$
- Media: $E[X] = np$, Varianza: $\text{Var}(X) = np(1-p)$
</ConceptCard>

<EquationTour caption="Binomial: n ensayos Bernoulli independientes con probabilidad p.">
  <EquationStep label="Ensayos">
    $n$
    Cantidad total de ensayos independientes.
  </EquationStep>
  <EquationStep label="Éxitos">
    $k$
    Cantidad de éxitos observados (0 a n).
  </EquationStep>
  <EquationStep label="Probabilidad">
    $p$
    Probabilidad de éxito en cada ensayo.
  </EquationStep>
  <EquationStep label="PMF">
    $\binom{n}{k} p^k (1-p)^{n-k}$
    Combina cuántas formas con la probabilidad de cada una.
  </EquationStep>
</EquationTour>

<ConceptCard variant="key-idea">
Intuición:
- Lanzar una moneda 10 veces y contar caras.
- De 100 pacientes tratados, ¿cuántos responden?
- La Binomial es una suma de $n$ Bernoullis independientes.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Poisson: eventos en el tiempo" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Ahora cuento eventos en un intervalo fijo de tiempo o espacio.",
    "Llegadas de clientes por hora, mutaciones por gen, llamadas al call center.",
    "La Poisson asume que los eventos son independientes a tasa constante λ.",
  ]}
/>

<ConceptCard variant="definition">
**Distribución Poisson**: Cantidad de eventos qué ocurren en un intervalo fijo de tiempo o espacio.
- Parámetro: $\lambda$ (tasa promedio)
- PMF: $P(X = k) = \frac{e^{-\lambda} \lambda^k}{k!}$
- Media: $E[X] = \lambda$, Varianza: $\text{Var}(X) = \lambda$
</ConceptCard>

<EquationTour caption="Poisson: eventos por intervalo con tasa constante λ.">
  <EquationStep label="Tasa">
    $\lambda$
    Promedio de eventos en el intervalo (tiempo o espacio).
  </EquationStep>
  <EquationStep label="Eventos">
    $k$
    Cantidad de eventos ocurridos.
  </EquationStep>
  <EquationStep label="PMF">
    $\frac{e^{-\lambda} \lambda^k}{k!}$
    Decaimiento exponencial por la tasa elevada y ajustada por factorial.
  </EquationStep>
  <EquationStep label="Media = varianza">
    $E[X] = \lambda,\ \text{Var}(X) = \lambda$
    La igualdad entre media y varianza es el sello de Poisson.
  </EquationStep>
</EquationTour>

<ConceptCard variant="key-idea">
Lo fascinante de Poisson es qué la media y la varianza son iguales ($\lambda$). Si tus datos de conteo tienen varianza mucho mayor qué la media, hay sobredispersión — necesitas un modelo más complejo.
</ConceptCard>

<ConceptCard variant="key-idea">
Ejemplos:
- Mutaciones en una secuencia de ADN.
- Llegadas de clientes por hora.
- Llamadas a un call center por minuto.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={5} title="Normal: la reina de las distribuciones" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La normal es la reina de las distribuciones y aparece por todas partes.",
    "El Teorema Central del Límite lo explica: la suma de muchas variables independientes converge a una normal.",
    "Incluso si tus datos no son normales, los promedios de muestras grandes sí lo son.",
  ]}
/>

<ConceptCard variant="definition">
**Distribución Normal (Gaussiana)**: La distribución más importante en estadística.
- Parámetros: $\mu$ (media), $\sigma^2$ (varianza)
- PDF: $f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$
</ConceptCard>

<EquationTour caption="Normal: campana simétrica gobernada por μ y σ.">
  <EquationStep label="Centro">
    $\mu$
    Media: ubica el centro de la campana.
  </EquationStep>
  <EquationStep label="Dispersión">
    $\sigma$
    Desviación estándar: ancho de la campana.
  </EquationStep>
  <EquationStep label="Normalización">
    $\frac{1}{\sigma \sqrt{2\pi}}$
    Asegura que el área total bajo la curva sea 1.
  </EquationStep>
  <EquationStep label="Exponente">
    $\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$
    Penaliza cuadráticamente la distancia a la media.
  </EquationStep>
</EquationTour>

**Regla 68-95-99.7**: ~68% de los datos dentro de 1σ, ~95% dentro de 2σ, ~99.7% dentro de 3σ.

**Estandarización** (puntaje Z): $Z = \frac{X - \mu}{\sigma}$ transforma cualquier normal a $N(0, 1)$.

<ConceptCard variant="key-idea">
El **Teorema Central del Límite** explica por qué la normal es ubicua: la suma de muchas variables independientes converge a una normal, sin importar la distribución original. Incluso si tus datos no son normales, los promedios de muestras grandes sí lo son.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="Comparación visual de las cuatro" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Llegó el momento de ponerlas lado a lado.",
    "Comparar tipo, parámetros, media, varianza y ejemplo típico evita elegir la distribución incorrecta en un caso real.",
    "En pacientes y clientes, elegir mal cambia por completo la inferencia posterior.",
  ]}
/>

<ConceptCard variant="key-idea">
Comparativa rápida:
- **Bernoulli** — discreta (0 o 1), parámetro $p$, media $p$, varianza $p(1-p)$, ejemplo: ¿responde al tratamiento? — `scipy.stats.bernoulli(p)`.
- **Binomial** — discreta (0 a n), parámetros $n, p$, media $np$, varianza $np(1-p)$, ejemplo: ¿cuántos de 50 responden? — `scipy.stats.binom(n, p)`.
- **Poisson** — discreta (0 a ∞), parámetro $\lambda$, media $\lambda$, varianza $\lambda$, ejemplo: mutaciones por gen — `scipy.stats.poisson(lam)`.
- **Normal** — continua ($-\infty$ a $\infty$), parámetros $\mu, \sigma^2$, media $\mu$, varianza $\sigma^2$, ejemplo: altura de personas — `scipy.stats.norm(mu, sigma)`.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={7} title="Manos a la obra con scipy.stats" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Ahora toca calcular, no solo memorizar.",
    "Con scipy.stats pasamos de definiciones a PMF, CDF y rangos concretos.",
    "Probá cada bloque en tu notebook y compará probabilidades.",
  ]}
/>

```python
import numpy as np
from scipy import stats

# Bernoulli: paciente responde (p=0.3)
ber = stats.bernoulli(0.3)
print(f"P(responde) = {ber.pmf(1):.2f}")

# Binomial: de 10 pacientes, ¿cuántos responden?
bin = stats.binom(n=10, p=0.3)
print(f"P(exactamente 3) = {bin.pmf(3):.3f}")
print(f"P(al menos 5) = {1 - bin.cdf(4):.3f}")

# Poisson: mutaciones por gen (λ=3)
poi = stats.poisson(3)
print(f"P(2 mutaciones) = {poi.pmf(2):.3f}")

# Normal: expresión génica (μ=50, σ=10)
norm = stats.norm(50, 10)
print(f"P(X < 60) = {norm.cdf(60):.3f}")
print(f"P(40 < X < 60) = {norm.cdf(60) - norm.cdf(40):.3f}")
```

<CalloutInfo>
**PMF** (discretas): probabilidad puntual. **PDF** (continuas): densidad (integrar para probabilidad). **CDF** (ambas): $P(X \leq x)$ — siempre usa CDF para rangos.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={8} title="Biotecnología: modelando eventos raros" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Las mutaciones en secuencias de ADN son el ejemplo clásico de eventos raros.",
    "Si la tasa promedio es 2.5 mutaciones por gen, Poisson responde preguntas concretas.",
    "Compará la probabilidad de un gen intacto versus uno muy dañado.",
  ]}
/>

Las mutaciones en secuencias de ADN siguen Poisson. Si la tasa promedio es 2.5 mutaciones por gen:

```python
lam = 2.5
poi = stats.poisson(lam)
print(f"P(0 mutaciones) = {poi.pmf(0):.3f}")  # gen intacto
print(f"P(más de 5 mutaciones) = {1 - poi.cdf(5):.3f}")  # gen muy dañado
```

<ChoiceQuestion
  question="¿Por qué Poisson modela bien las mutaciones genéticas? ¿Qué supuestos hace?"
  moduleSlug="estadistica"
  lessonSlug="lesson04_statistical_distributions"
  blockId="reflection-l04-poisson-genes"
  allowContinueOnIncorrect
  explanation="Poisson asume eventos independientes a tasa constante λ; en ADN cada posición muta independientemente con tasa ≈ constante por región. En hotspots (λ variable) subestima la varianza y se prefiere binomial negativa."
  options={[
    { id: "a", label: "Porque cada mutación es independiente a tasa constante λ por región; si la tasa varía (hotspots), Poisson subestima la varianza", correct: true, feedback: "¡Exacto! La constancia de λ por región es el supuesto clave; en hotspots falla." },
    { id: "b", label: "Porque las mutaciones ocurren en clusters (hotspots) y Poisson los captura automáticamente", correct: false, feedback: "Al revés: hotspots rompen la tasa constante y Poisson subestima la varianza (→ binomial negativa)." },
    { id: "c", label: "Porque en genética λ cambia por generación pero Poisson se adapta automáticamente", correct: false, feedback: "Poisson asume λ constante en el intervalo; no se adapta a tasas variables." },
    { id: "d", label: "Porque media y varianza iguales son garantía en mutaciones, no supuesto", correct: false, feedback: "Media=varianza es supuesto, no garantía; sobredispersión señala que el supuesto falla." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={9} title="Checkpoint" eyebrow="EVALUACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Buen momento para verificar la elegibilidad de cada distribución.",
    "No se trata de memorizar fórmulas, sino de emparejar escenario con modelo.",
    "Resolvé las preguntas antes de seguir con los términos clave.",
  ]}
/>

<ChoiceQuestion
  question="Tienes datos de cantidad de clientes qué entran a un sitio web por minuto. La media es 5. ¿Qué distribución usarías y por qué?"
  moduleSlug="estadistica"
  lessonSlug="lesson04_statistical_distributions"
  blockId="reflection-l04-choose-dist"
  allowContinueOnIncorrect
  explanation="Poisson con λ=5: llegadas por unidad de tiempo son caso clásico Poisson. Verificar: si varianza empírica ≫ 5 (sobredispersión) → binomial negativa; si hay patrones temporales (hora pico) → Poisson no homogéneo λ(t)."
  options={[
    { id: "a", label: "Poisson con λ=5, porque son llegadas por unidad de tiempo; verificar sobredispersión (varianza ≫ 5) y patrones temporales", correct: true, feedback: "¡Exacto! Poisson clásico; con sobredispersión o peaks temporales se ajusta." },
    { id: "b", label: "Normal N(μ=5, σ²=5), porque todo conteo converge a normal por el TCL", correct: false, feedback: "Llegadas por intervalo son caso Poisson discreto; Normal aproxima pero no modela el conteo real." },
    { id: "c", label: "Binomial con n=60, p=1/12, porque son 60 segundos por minuto", correct: false, feedback: "Modelo de Bernoulli fijo innecesario; la llegada por intervalo es caso Poisson directo." },
    { id: "d", label: "Bernoulli con p=5/60, porque cada segundo es éxito/fracaso de llegada", correct: false, feedback: "Bernoulli sirve para un evento único; para contar llegadas por intervalo se usa Poisson." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuándo usarías Bernoulli vs Binomial?"
  moduleSlug="estadistica"
  lessonSlug="lesson04_statistical_distributions"
  blockId="choice-estadistica-l04-rev-1"
  allowContinueOnIncorrect
  explanation="Bernoulli modela UN evento (¿este paciente responde?); Binomial cuenta éxitos en n eventos (de 50 pacientes, ¿cuántos responden?) y es la suma de n Bernoullis."
  options={[
    { id: "a", label: "Bernoulli para un evento y Binomial para contar éxitos en n eventos", correct: true, feedback: "¡Correcto! La Binomial suma n Bernoullis." },
    { id: "b", label: "Bernoulli cuenta éxitos en n ensayos y Binomial modela uno", correct: false, feedback: "Los roles están invertidos." },
    { id: "c", label: "Son idénticas cuando n=1, por eso no hay diferencia práctica", correct: false, feedback: "Bernoulli es el caso n=1 de la Binomial, pero el uso se distingue por pregunta." },
    { id: "d", label: "Bernoulli se usa para contar y Binomial para probabilidad individual", correct: false, feedback: "Es al revés: Bernoulli es individual, Binomial es conteo." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué hace el puntaje Z? ($Z = (X - \mu) / \sigma$)"
  moduleSlug="estadistica"
  lessonSlug="lesson04_statistical_distributions"
  blockId="choice-estadistica-l04-rev-2"
  allowContinueOnIncorrect
  explanation="$Z = (X - \mu) / \sigma$ estandariza cualquier normal a N(0,1); un Z=2 indica 2 desviaciones estándar de la media y permite comparar valores de distintas distribuciones."
  options={[
    { id: "a", label: "Estandariza cualquier normal a N(0,1): Z=2 significa a 2 desviaciones estándar de la media", correct: true, feedback: "¡Correcto! Facilita comparar valores de distintas distribuciones." },
    { id: "b", label: "Traslada la media a cero pero deja la varianza original", correct: false, feedback: "También divide por sigma: la varianza resultante es 1." },
    { id: "c", label: "Iguala la varianza a cero y ajusta solo la media", correct: false, feedback: "La varianza resultante es 1, no 0." },
    { id: "d", label: "Convierte datos categóricos a valores numéricos", correct: false, feedback: "El puntaje Z es para variables numéricas continuas, no categóricas." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={10} title="Términos clave" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Estos términos son la base del resto del módulo.",
    "Guardalos como tu vocabulario de distribuciones.",
    "Volveremos a ellos al elegir features y calcular Z-Scores.",
  ]}
/>

<ConceptCard variant="key-idea">
Términos clave:
- **Bernoulli**: un ensayo binario con probabilidad $p$ de éxito.
- **Binomial**: cantidad de éxitos en $n$ ensayos Bernoulli independientes.
- **Poisson**: cantidad de eventos en un intervalo fijo, tasa constante $\lambda$.
- **Normal (Gaussiana)**: distribución campana simétrica $N(\mu, \sigma^2)$.
- **Puntaje Z**: estandarización: $Z = (X - \mu) / \sigma \sim N(0,1)$.
- **PMF**: Probability Mass Function — para variables discretas.
- **PDF**: Probability Density Function — para variables continuas.
- **CDF**: Cumulative Distribution Function — $F(x) = P(X \leq x)$.
- **TCL**: Teorema Central del Límite: promedios convergen a normal.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={11} title="Para la próxima lección" eyebrow="CIERRE">

<RevealSequence mode="appear">

<MascotMessage mood="celebrating">
Cuatro distribuciones fundamentales cubiertas: Bernoulli, Binomial, Poisson y Normal. Con estas cuatro ya puedes modelar una enorme variedad de fenómenos reales.
</MascotMessage>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En la Lección 5 estudiaremos cómo se relacionan las variables entre sí.",
    "Covarianza, correlación de Pearson y Spearman, y matrices de correlación.",
    "Porque en el mundo real nada ocurre en aislamiento: todo está conectado.",
  ]}
/>

**En la Lección 5** vamos a estudiar cómo se relacionan las variables entre sí: covarianza, correlación de Pearson y Spearman, y matrices de correlación. Porque en el mundo real, nada ocurre en aislamiento — todo está conectado.

</RevealSequence>

</Section>
