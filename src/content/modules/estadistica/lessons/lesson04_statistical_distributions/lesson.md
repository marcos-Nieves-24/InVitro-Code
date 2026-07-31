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

<MascotMessage mood="thinking">
Todo proceso generador de datos en la naturaleza sigue alguna distribución de probabilidad. La expresión génica es log-normal, las llegadas de clientes son Poisson, los resultados binarios son Bernoulli. Conocer estas distribuciones con nombre te permite modelar datos de forma realista.
</MascotMessage>

En la Lección 3 aprendiste el lenguaje general de la probabilidad. Ahora vas a conocer las distribuciones específicas qué aparecen con más frecuencia en machine learning: **Bernoulli, Binomial, Poisson y Normal**. Cada una modela un tipo distinto de fenómeno.

</Section>

<Section number={2} title="Bernoulli: éxito o fracaso" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Distribución Bernoulli**: Modela un único resultado binario (éxito/fracaso, 1/0).
- Parámetro: $p$ (probabilidad de éxito)
- PMF: $P(X = 1) = p$, $P(X = 0) = 1 - p$
- Media: $E[X] = p$, Varianza: $\text{Var}(X) = p(1-p)$
</ConceptCard>

Intuición: Un sólo lanzamiento de moneda. Cada paciente responde al tratamiento o no. La Bernoulli es el bloque de construcción de distribuciones más complejas.

</Section>

<Section number={3} title="Binomial: contar éxitos" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Distribución Binomial**: Cantidad de éxitos en $n$ ensayos Bernoulli independientes.
- Parámetros: $n$ (ensayos), $p$ (probabilidad de éxito)
- PMF: $P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$
- Media: $E[X] = np$, Varianza: $\text{Var}(X) = np(1-p)$
</ConceptCard>

Intuición: Lanzar una moneda 10 veces y contar caras. De 100 pacientes tratados, ¿cuántos responden? La Binomial es una suma de $n$ Bernoullis independientes.

</Section>

<Section number={4} title="Poisson: eventos en el tiempo" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Distribución Poisson**: Cantidad de eventos qué ocurren en un intervalo fijo de tiempo o espacio.
- Parámetro: $\lambda$ (tasa promedio)
- PMF: $P(X = k) = \frac{e^{-\lambda} \lambda^k}{k!}$
- Media: $E[X] = \lambda$, Varianza: $\text{Var}(X) = \lambda$
</ConceptCard>

<ConceptCard variant="key-idea">
Lo fascinante de Poisson es qué la media y la varianza son iguales ($\lambda$). Si tus datos de conteo tienen varianza mucho mayor qué la media, hay sobredispersión — necesitás un modelo más complejo.
</ConceptCard>

Ejemplos: mutaciones en una secuencia de ADN, llegadas de clientes por hora, llamadas a un call center por minuto.

</Section>

<Section number={5} title="Normal: la reina de las distribuciones" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Distribución Normal (Gaussiana)**: La distribución más importante en estadística.
- Parámetros: $\mu$ (media), $\sigma^2$ (varianza)
- PDF: $f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$
</ConceptCard>

**Regla 68-95-99.7**: ~68% de los datos dentro de 1σ, ~95% dentro de 2σ, ~99.7% dentro de 3σ.

**Estandarización** (puntaje Z): $Z = \frac{X - \mu}{\sigma}$ transforma cualquier normal a $N(0, 1)$.

<ConceptCard variant="key-idea">
El **Teorema Central del Límite** explica por qué la normal es ubicua: la suma de muchas variables independientes converge a una normal, sin importar la distribución original. Incluso si tus datos no son normales, los promedios de muestras grandes sí lo son.
</ConceptCard>

</Section>

<Section number={6} title="Comparación visual de las cuatro" eyebrow="INTERACTIVA">

<ComparisonTable
  rows={[
    { feature: "Tipo", left: "Discreta (0 o 1)", right: "Discreta (0 a n)" },
    { feature: "Parámetros", left: "p", right: "n, p" },
    { feature: "Media", left: "p", right: "np" },
    { feature: "Varianza", left: "p(1-p)", right: "np(1-p)" },
    { feature: "Ejemplo", left: "¿Responde al tratamiento?", right: "¿Cuántos de 50 responden?" },
    { feature: "scipy.stats", left: "bernoulli(p)", right: "binom(n, p)" },
  ]}
/>

<ComparisonTable
  rows={[
    { feature: "Tipo", left: "Discreta (0 a ∞)", right: "Continua (−∞ a ∞)" },
    { feature: "Parámetros", left: "λ", right: "μ, σ²" },
    { feature: "Media", left: "λ", right: "μ" },
    { feature: "Varianza", left: "λ", right: "σ²" },
    { feature: "Ejemplo", left: "Mutaciones por gen", right: "Altura de personas" },
    { feature: "scipy.stats", left: "poisson(lam)", right: "norm(mu, sigma)" },
  ]}
/>

</Section>

<Section number={7} title="Manos a la obra con scipy.stats" eyebrow="INTERACTIVA">

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
**PMF** (discretas): probabilidad puntual. **PDF** (continuas): densidad (integrar para probabilidad). **CDF** (ambas): $P(X \leq x)$ — siempre usá CDF para rangos.
</CalloutInfo>

</Section>

<Section number={8} title="Biotecnología: modelando eventos raros" eyebrow="INTERACTIVA">

Las mutaciones en secuencias de ADN siguen Poisson. Si la tasa promedio es 2.5 mutaciones por gen:

```python
lam = 2.5
poi = stats.poisson(lam)
print(f"P(0 mutaciones) = {poi.pmf(0):.3f}")  # gen intacto
print(f"P(más de 5 mutaciones) = {1 - poi.cdf(5):.3f}")  # gen muy dañado
```

<ReflectionCheck
  blockId="reflection-l04-poisson-genes"
  moduleSlug="estadistica"
  lessonSlug="lesson04_statistical_distributions"
  prompt="¿Por qué Poisson modela bien las mutaciones genéticas? ¿Qué supuestos hace?"
  answer="Poisson asume qué los eventos ocurren independientemente a una tasa constante λ. En genética, cada posición del ADN puede mutar independientemente, y la tasa es aproximadamente constante por región. Pero ojo: en regiones genómicas inestables (hotspots), la tasa no es constante y Poisson subestima la varianza — ahí necesitamos modelos más complejos cómo binomial negativa."
/>

</Section>

<Section number={9} title="Checkpoint" eyebrow="EVALUACIÓN">

<ReflectionCheck
  blockId="reflection-l04-choose-dist"
  moduleSlug="estadistica"
  lessonSlug="lesson04_statistical_distributions"
  prompt="Tenés datos de cantidad de clientes qué entran a un sitio web por minuto. La media es 5. ¿Qué distribución usarías y por qué?"
  answer="Poisson con λ=5. La cantidad de llegadas por unidad de tiempo es el caso de uso clásico de Poisson. Pero siempre verificá: si la varianza empírica es mucho mayor qué 5 (sobredispersión), considerá binomial negativa. Si hay patrones temporales (hora pico), necesitás un Poisson no homogéneo con λ(t) variable."
/>

<AnswerReveal summary="Ver respuestas">
<p><strong>¿Cuándo usarías Bernoulli vs Binomial?</strong> Bernoulli para UN evento (¿este paciente responde?). Binomial para contar éxitos en n eventos (de 50 pacientes, ¿cuántos responden?). La Binomial es la suma de n Bernoullis.</p>
<p><strong>¿Qué hace el puntaje Z?</strong> $Z = (X - \mu) / \sigma$ transforma cualquier normal a N(0,1). Un Z=2 significa "a 2 desviaciones estándar de la media". Permite comparar valores de distintas distribuciones.</p>
</AnswerReveal>

</Section>

<Section number={10} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["Bernoulli", "Un ensayo binario con probabilidad p de éxito"],
    ["Binomial", "Cantidad de éxitos en n ensayos Bernoulli independientes"],
    ["Poisson", "Cantidad de eventos en un intervalo fijo, tasa constante λ"],
    ["Normal (Gaussiana)", "Distribución campana simétrica N(μ, σ²)"],
    ["Puntaje Z", "Estandarización: $Z = (X - \\mu)/\\sigma \\sim N(0,1)$"],
    ["PMF", "Probability Mass Function — para variables discretas"],
    ["PDF", "Probability Density Function — para variables continuas"],
    ["CDF", "Cumulative Distribution Function — $F(x) = P(X \\leq x)$"],
    ["TCL", "Teorema Central del Límite: promedios convergen a normal"],
  ]}
  searchable={true}
  caption="Distribuciones estadísticas — referencia rápida"
/>

</Section>

<Section number={11} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
¡Cuatro distribuciones fundamentales dominadas! Bernoulli, Binomial, Poisson, Normal — con estas cuatro ya podés modelar una enorme variedad de fenómenos reales.
</MascotMessage>

**En la Lección 5** vamos a estudiar cómo se relacionan las variables entre sí: covarianza, correlación de Pearson y Spearman, y matrices de correlación. Porque en el mundo real, nada ocurre en aislamiento — todo está conectado.

</Section>
