---
Module: 3
Lesson Number: 1
Lesson Title: Estadística Descriptiva
Estimated Duration: 75 minutos
Prerequisites: Módulo 2 (Fundamentos de Programación en Python)
Learning Objectives:
  - Explicar la diferencia entre medidas de tendencia central y medidas de dispersión
  - Calcular media, mediana, moda, varianza, desviación estándar, rango e IQR usando Python
  - Interpretar estadísticas descriptivas para resumir un conjunto de datos
  - Elegir la medida de tendencia central adecuada según la distribución de los datos
  - Identificar valores atípicos usando el método del IQR
Keywords: media, mediana, moda, varianza, desviación estándar, rango, IQR, diagrama de caja, estadística descriptiva
Difficulty: Principiante
Programming Concepts: numpy, pandas, matplotlib
Mathematical Concepts: media, varianza, desviación estándar, cuartiles, percentiles
Machine Learning Concepts: resumen de datos, comprensión de features
Datasets Used: Puntajes de examen sintéticos de estudiantes, dataset de diabetes
Notebook: 01_descriptive_statistics.ipynb
Assignment: descriptive_statistics_assignment.md
Quiz: descriptive_statistics_quiz.md
---

<Section number={1} title="El problema de los 10.000 genes" eyebrow="INICIO">

<MascotMessage mood="thinking">
Bienvenido al Laboratorio de Datos. Hoy vamos a aprender cómo resumir miles de números en un puñado de medidas significativas. Es la primera herramienta de todo científico de datos.
</MascotMessage>

Imagina qué acabas de secuenciar 10.000 genes de una muestra de un paciente. Necesitas comunicar qué genes se expresan de forma consistente y cuáles varían drásticamente entre pacientes. Sin estadística descriptiva, tendrías qué leer 10.000 números uno por uno.

La estadística descriptiva condensa conjuntos de datos enteros en un puñado de números significativos, permitiendo a científicos y analistas entender los datos de un vistazo.

En biotecnología, la estadística descriptiva ayuda a responder preguntas como: ¿Cuál es el nivel de expresión promedio de un gen en una población? ¿Qué tan variable es la respuesta a un fármaco? En SaaS, resume métricas de engagement cómo usuarios activos diarios o duración de sesiones.

</Section>

<Section number={2} title="¿Dónde estamos parados?" eyebrow="CONCEPTO">

En el módulo anterior aprendiste a manipular datos usando Python, NumPy y Pandas. Ahora aprenderás a **describir** datos numéricamente.

<ConceptCard variant="key-idea">
La estadística descriptiva es el primer paso de cualquier análisis de datos. Antes de modelar, antes de predecir, antes de sacar conclusiones: hay qué describir.
</ConceptCard>

Esta lección sienta las bases para todo el módulo:

- **Hoy**: Describir datos con números (tendencia central + dispersión)
- **Lección 2**: Visualizar distribuciones con histogramas y densidades
- **Lección 3**: Fundamentos de probabilidad
- **Y más**: Distribuciones, correlaciones, clustering, y evaluación de modelos

</Section>

<Section number={3} title="Medidas de Tendencia Central" eyebrow="CONCEPTO">

Las medidas de tendencia central indican dónde se encuentra el "centro" de un conjunto de datos.

### Media (Promedio)

<ConceptCard variant="definition">
La media aritmética es la suma de todos los valores dividida por la cantidad de valores.
</ConceptCard>

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

**Intuición**: La media es el punto de equilibrio de los datos. Si colocaras cada punto de datos en una recta numérica con pesos iguales, la media es dónde se equilibraría el fulcro.

### Mediana

<ConceptCard variant="definition">
La mediana es el valor del medio cuándo los datos están ordenados de forma ascendente.
</ConceptCard>

$$\text{mediana} = \begin{cases} x_{(n+1)/2} & \text{si } n \text{ es impar} \\ \frac{x_{n/2} + x_{(n/2)+1}}{2} & \text{si } n \text{ es par} \end{cases}$$

### Moda

<ConceptCard variant="definition">
La moda es el valor más frecuente en un conjunto de datos.
</ConceptCard>

Un conjunto puede tener una moda (unimodal), dos modas (bimodal) o más. En datos continuos, cada valor puede aparecer una sola vez — se usa agrupamiento para encontrar modas significativas.

</Section>

<Section number={4} title="Media vs Mediana: ¿cuál usar?" eyebrow="CONCEPTO">

<ConceptCard variant="key-idea">
La mediana divide el conjunto en dos mitades iguales. A diferencia de la media, **no se ve afectada por valores extremos**. Por eso es la medida preferida para datos sesgados.
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Definición", left: "Punto de equilibrio (suma / n)", right: "Valor central (mitad arriba, mitad abajo)" },
    { feature: "Robustez a outliers", left: "Muy sensible — un valor extremo la desplaza", right: "Robusta — los outliers no la afectan" },
    { feature: "Cuándo usarla", left: "Datos simétricos (ej. altura, peso, temperatura corporal)", right: "Datos sesgados (ej. ingresos, precios, expresión génica con outliers)" },
    { feature: "Ejemplo", left: "Notas de un examen bien diseñado", right: "Ingresos de una población (dónde algunos ganan 100× más)" },
  ]}
/>

</Section>

<Section number={5} title="Manos a la obra: análisis de puntajes" eyebrow="INTERACTIVA">

Veamos cómo calcular estas medidas en Python con datos reales de 30 estudiantes:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Puntajes de examen para 30 estudiantes
scores = [78, 85, 92, 67, 88, 95, 73, 81, 90, 76,
          84, 91, 69, 87, 93, 75, 82, 89, 96, 71,
          79, 86, 94, 68, 83, 97, 77, 80, 99, 100]

scores = np.array(scores)

# Tendencia central
mean = np.mean(scores)
median = np.median(scores)
mode = pd.Series(scores).mode().values

print(f"Media: {mean:.2f}")
print(f"Mediana: {median:.2f}")
print(f"Moda: {mode}")
```

<CalloutInfo>
Ejecuta este código en tu notebook. ¿Están cerca la media y la mediana? Cuándo son similares, es una buena señal de qué los datos son simétricos. Si difieren mucho, hay sesgo.
</CalloutInfo>

<ReflectionCheck
  blockId="reflection-l01-mean-median-scores"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  prompt="En este conjunto de puntajes, la media (84.53) y la mediana (84.50) son casi idénticas. ¿Qué nos dice esto sobre la distribución de los puntajes?"
  answer="Que la distribución es aproximadamente simétrica — no hay valores extremos qué desplacen la media. En una distribución simétrica, media ≈ mediana. Si fueran muy diferentes, sabríamos qué hay sesgo o outliers."
/>

</Section>

<Section number={6} title="Medidas de Dispersión" eyebrow="CONCEPTO">

Las medidas de dispersión indican qué tan dispersos están los datos. No basta con saber el centro — necesitamos saber cuánto varían.

<ConceptCard variant="definition">
**Rango**: Diferencia entre el máximo y el mínimo.

$$\text{Rango} = \max(x) - \min(x)$$

Es muy sensible a valores atípicos: un sólo valor extremo duplica el rango.
</ConceptCard>

<ConceptCard variant="definition">
**Varianza**: Distancia cuadrática promedio desde la media.

$$\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2$$

Mide dispersión, pero en unidades al cuadrado (difícil de interpretar).
</ConceptCard>

<ConceptCard variant="definition">
**Desviación Estándar**: Raíz cuadrada de la varianza.

$$\sigma = \sqrt{\sigma^2}$$

Está en las mismas unidades qué los datos originales — es la medida de dispersión más reportada.
</ConceptCard>

</Section>

<Section number={7} title="IQR: la medida robusta" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Rango Intercuartílico (IQR)**:

$$\text{IQR} = Q_3 - Q_1$$

Donde $Q_1$ es el percentil 25 y $Q_3$ es el percentil 75.
</ConceptCard>

<ConceptCard variant="key-idea">
El IQR contiene el 50% central de los datos. Es **robusto frente a valores atípicos** por qué ignora los extremos. Junto con la mediana, forma la pareja ideal para datos sesgados.
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Mide", left: "Recorrido total (max − min)", right: "Dispersión del 50% central (Q3 − Q1)" },
    { feature: "Robustez", left: "Muy sensible a outliers", right: "Robusto — ignora extremos" },
    { feature: "Unidad", left: "Misma qué los datos", right: "Misma qué los datos" },
    { feature: "Se usa con", left: "Media y desviación estándar", right: "Mediana" },
    { feature: "Cuándo", left: "Datos simétricos, sin outliers", right: "Datos sesgados o con outliers" },
  ]}
/>

</Section>

<Section number={8} title="Caso real: reducción tumoral" eyebrow="INTERACTIVA">

Una empresa biotecnológica prueba un nuevo fármaco. Midieron la reducción del tamaño del tumor (mm) en 20 pacientes:

```python
tumor_reduction = [12, 15, 8, 14, 16, 11, 13, 9, 17, 10,
                   14, 13, 15, 12, 11, 16, 10, 14, 13, 45]

reduction = np.array(tumor_reduction)

print("Estadística Descriptiva de Reducción Tumoral")
print(f"Media: {np.mean(reduction):.2f} mm")
print(f"Mediana: {np.median(reduction):.2f} mm")
print(f"Desvío Estándar: {np.std(reduction, ddof=0):.2f} mm")
print(f"IQR: {np.percentile(reduction, 75) - np.percentile(reduction, 25):.2f} mm")
```

**¿Qué observamos?** El paciente 20 tuvo una reducción de 45 mm — mucho mayor qué el resto.

<ReflectionCheck
  blockId="reflection-l01-tumor-outlier"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  prompt="La media de reducción tumoral es 14.5 mm pero la mediana es 13 mm. ¿Cuál reportarías al equipo médico y por qué?"
  answer="Reportaría la mediana (13 mm). El valor 45 mm es un outlier qué infla la media artificialmente. La mediana de 13 mm representa mejor la experiencia típica del paciente. Podría complementar con el IQR (4 mm) para indicar qué el 50% central de pacientes tuvo reducciones entre 11 y 15 mm."
/>

</Section>

<Section number={9} title="El IQR cómo detector de outliers" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Un valor es **atípico (outlier)** si está por debajo de $Q_1 - 1.5 \times \text{IQR}$ o por encima de $Q_3 + 1.5 \times \text{IQR}$.
</ConceptCard>

```python
q1 = np.percentile(reduction, 25)
q3 = np.percentile(reduction, 75)
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr
outliers = reduction[(reduction < lower_bound) | (reduction > upper_bound)]

print(f"Límites: [{lower_bound:.2f}, {upper_bound:.2f}]")
print(f"Outliers detectados: {outliers}")
# → Outliers detectados: [45]
```

<ConceptCard variant="warning">
Un outlier NO siempre es un error. Puede ser un error de medición, un caso excepcional... ¡o el descubrimiento más importante de tu dataset! Nunca elimines outliers sin investigar su causa.
</ConceptCard>

</Section>

<Section number={10} title="Expresión génica de TP53" eyebrow="INTERACTIVA">

Apliquemos todo lo aprendido a un caso real de biotecnología: análisis de expresión del gen supresor de tumores **TP53** en 50 muestras de pacientes.

```python
np.random.seed(42)
tp53_expression = np.random.normal(loc=8.5, scale=2.0, size=50)

df = pd.DataFrame({'TP53_expression': tp53_expression})
summary = df.describe()
print(summary)

# Verificando expresión anormalmente baja (posible deleción génica)
q1 = df['TP53_expression'].quantile(0.25)
q3 = df['TP53_expression'].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
print(f"\nMuestras con expresión de TP53 inusualmente baja:")
print(df[df['TP53_expression'] < lower])
```

<CalloutInfo>
TP53 es conocido cómo "el guardián del genoma". Una expresión anormalmente baja puede indicar una deleción del gen — un evento común en células cancerosas. La estadística descriptiva nos ayuda a identificar estas muestras para análisis más profundos.
</CalloutInfo>

</Section>

<Section number={11} title="Ejemplo SaaS: usuarios activos diarios" eyebrow="INTERACTIVA">

La estadística descriptiva no es sólo para biotecnología. Analicemos usuarios activos diarios (DAU) de un producto SaaS durante 90 días:

```python
np.random.seed(42)
dau = np.random.poisson(lam=1500, size=90) + np.random.randint(-50, 50, 90)

print("Usuarios Activos Diarios - Estadística Descriptiva")
print(f"Media: {np.mean(dau):.0f}")
print(f"Mediana: {np.median(dau):.0f}")
print(f"Desvío Estándar: {np.std(dau, ddof=0):.0f}")
print(f"Min: {np.min(dau)}, Max: {np.max(dau)}")

pd.Series(dau).plot(kind='hist', bins=15, edgecolor='black')
plt.title('Distribución de Usuarios Activos Diarios')
plt.xlabel('Usuarios')
plt.tight_layout()
plt.show()
```

<ReflectionCheck
  blockId="reflection-l01-dau"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  prompt="¿Por qué una empresa SaaS monitorearía la mediana de DAU además del promedio?"
  answer="Porque la mediana es robusta a días atípicos (ej. un pico por una campaña viral o una caída por una caída del servidor). El promedio puede estar inflado por un sólo día excepcional. La mediana refleja mejor un 'día típico'. Monitorear ambas permite detectar anomalías: si la media se dispara pero la mediana no, hubo un pico puntual."
/>

</Section>

<Section number={12} title="Errores comunes y mejores prácticas" eyebrow="CONCEPTO">

<ConceptCard variant="warning">
**Cuatro errores qué todo principiante comete:**

1. **Usar la media para datos sesgados** — la media se va con los outliers. Usa la mediana para ingresos, precios, o cualquier distribución con cola larga.
2. **Confundir varianza muestral y poblacional** — `np.var(x)` usa ddof=0 (poblacional). Para una muestra, usa `np.var(x, ddof=1)`.
3. **Interpretar la desviación estándar sin contexto** — una std de 10 puede ser enorme o insignificante según la escala.
4. **Asumir qué la moda es única** — en datos continuos, agrupa o redondea para encontrar modas significativas.
</ConceptCard>

<CalloutInfo>
**Mejores prácticas:**
- Calcula siempre juntas las medidas de tendencia central y dispersión
- Reporta **mediana + IQR** para distribuciones sesgadas
- Reporta **media + desviación estándar** para distribuciones simétricas
- Visualiza los datos con un diagrama de caja junto con los resúmenes numéricos
- Usa `df.describe()` para una visión rápida en pandas
</CalloutInfo>

</Section>

<Section number={13} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

Pon a prueba lo qué aprendiste:

1. **Un conjunto de datos tiene valores [5, 7, 8, 8, 10, 100]. ¿Qué medida representa mejor el centro?**
2. **¿Cuál es la diferencia entre varianza y desviación estándar? ¿Por qué se reporta más la segunda?**
3. **Una farmacéutica reporta efectividad media del 85%, pero el 40% de pacientes no respondió. ¿Cómo es posible?**

<AnswerReveal summary="Ver respuestas">
<p><strong>1.</strong> La mediana (8). La media es 23 — está totalmente distorsionada por el valor 100. La mediana ignora el outlier y refleja el valor típico. La moda es 8 (aparece dos veces).</p>

<p><strong>2.</strong> La varianza mide dispersión en unidades al cuadrado (difícil de interpretar: "la varianza es 25 puntos²"). La desviación estándar es la raíz cuadrada, devolviéndonos a las unidades originales ("la desviación estándar es 5 puntos"). Por eso se reporta más: es directamente interpretable.</p>

<p><strong>3.</strong> La media puede ser engañosa cuándo hay variabilidad extrema. Si el 60% de pacientes tuvo 100% de efectividad y el 40% tuvo 0%, la media es 60%... no 85%. Para llegar a 85% con 40% en cero, el 60% restante tendría qué tener ~142% de efectividad (imposible). Algo no cierra — probablemente están reportando la media de los respondedores nada más, excluyendo a los no respondedores. Mejores estadísticos: reportar la mediana y el porcentaje de respondedores por separado.</p>
</AnswerReveal>

</Section>

<Section number={14} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["Media", "Suma de valores dividida por la cantidad; el promedio aritmético"],
    ["Mediana", "El valor del medio cuándo los datos están ordenados"],
    ["Moda", "El valor más frecuente en el conjunto de datos"],
    ["Varianza", "Distancia cuadrática promedio desde la media (σ²)"],
    ["Desviación Estándar", "Raíz cuadrada de la varianza; distancia típica desde la media (σ)"],
    ["Rango", "Diferencia entre el valor máximo y el mínimo"],
    ["Rango Intercuartílico", "Diferencia entre Q3 (percentil 75) y Q1 (percentil 25)"],
    ["Valor Atípico (Outlier)", "Punto qué difiere significativamente del resto; detectado con la regla 1.5×IQR"],
  ]}
  searchable={true}
  caption="Términos clave de estadística descriptiva — usa la búsqueda para encontrar definiciones rápido"
/>

</Section>

<Section number={15} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
¡Excelente trabajo! Ya tienes las herramientas fundamentales para describir cualquier conjunto de datos. Media, mediana, IQR, outliers — son el pan de cada día de un científico de datos.
</MascotMessage>

**¿Qué aprendiste hoy?**
- La estadística descriptiva resume datasets enteros en un puñado de números
- Media + desviación estándar para datos simétricos
- Mediana + IQR para datos sesgados o con outliers
- El IQR detecta outliers con la regla de 1.5×

**En la Lección 2** vamos a complementar estos números con visualizaciones: histogramas, curvas de densidad, asimetría y curtosis. Porque un número te dice *qué*, pero un gráfico te muestra *por qué*.

</Section>
