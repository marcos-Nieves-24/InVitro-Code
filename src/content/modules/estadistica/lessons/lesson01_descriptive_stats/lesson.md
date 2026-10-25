
Module: 3
Lesson Number: 1
Lesson Title: Estadística Descriptiva
Estimated Duration: 75 minutos
Prerequisites: Módulo 2 (Fundamentos de Programación en Python)
Learning Objectives:
  Explicar la diferencia entre medidas de tendencia central y medidas de dispersión
  Calcular media, mediana, moda, varianza, desviación estándar, rango e IQR usando Python
  Interpretar estadísticas descriptivas para resumir un conjunto de datos
  Elegir la medida de tendencia central adecuada según la distribución de los datos
  Identificar valores atípicos usando el método del IQR
Keywords: media, mediana, moda, varianza, desviación estándar, rango, IQR, diagrama de caja, estadística descriptiva
Difficulty: Principiante
Programming Concepts: numpy, pandas, matplotlib
Mathematical Concepts: media, varianza, desviación estándar, cuartiles, percentiles
Machine Learning Concepts: resumen de datos, comprensión de features
Datasets Used: Puntajes de examen sintéticos de estudiantes, dataset de diabetes
Notebook: 01_descriptive_statistics.ipynb
Assignment: descriptive_statistics_assignment.md
Quiz: descriptive_statistics_quiz.md


<Section number={1} title="El problema de los 10.000 genes" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un paciente llega con una muestra y, bajo el microscopio, miles de genes se expresan a la vez.",
    "¿Cómo comunicar esa avalancha de números sin leerlos uno por uno?",
    "La estadística descriptiva condensa el conjunto entero en un puñado de medidas.",
  ]}
/>

<ConceptCard variant="key idea">
Resume un conjunto de datos completo en pocas medidas: centro (media, mediana) y variación (desviación estándar, IQR). Un puñado de números, la historia entera.
</ConceptCard>

<ChoiceQuestion
  question="Antes de calcular nada: si un gen se expresa mucho en unos pacientes y casi nada en otros, ¿qué importa más?"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  blockId="choice estadistica l01 s1 a 1"
  allowContinueOnIncorrect
  explanation="Hay que reportar centro y variación juntos: la medida típica (mediana o media) más el rango de dispersión (IQR o desviación estándar)."
  options={[
    { id: "a", label: "Solo el valor típico", correct: false, feedback: "Insuficiente: no dice cuánto varían los datos entre pacientes." },
    { id: "b", label: "Solo cuánto varían", correct: false, feedback: "Insuficiente: falta saber cuál es el valor esperado." },
    { id: "c", label: "Ambos: valor típico + variación", correct: true, feedback: "¡Bien! Centro y dispersión juntos cuentan la historia real." },
    { id: "d", label: "El máximo absoluto", correct: false, feedback: "El máximo es un extremo, no resume el conjunto." },
  ]}
/>

</RevealSequence>
</Section>

<Section number={2} title="¿Dónde estamos parados?" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

En el módulo anterior aprendiste a manipular datos usando Python, NumPy y Pandas. Ahora aprenderás a **describir** datos numéricamente.

<ConceptCard variant="key idea">
La estadística descriptiva es el primer paso de cualquier análisis de datos. Antes de modelar, antes de predecir, antes de sacar conclusiones: hay qué describir.
</ConceptCard>

Esta lección sienta las bases para todo el módulo:

- **Hoy**: Describir datos con números (tendencia central + dispersión)
- **Lección 2**: Visualizar distribuciones con histogramas y densidades
- **Lección 3**: Fundamentos de probabilidad
- **Y más**: Distribuciones, correlaciones, clustering, y evaluación de modelos

</RevealSequence>
</Section>

<Section number={3} title="Medidas de Tendencia Central" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

Las medidas de tendencia central indican dónde se encuentra el "centro" de un conjunto de datos.

**Media (Promedio)**

<ConceptCard variant="definition">
La media aritmética es la suma de todos los valores dividida por la cantidad de valores.
</ConceptCard>

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

<EquationTour caption="La media suma todos los valores y los divide por n para ubicar el centro.">
  <EquationStep label="Suma">
    $\sum_{i=1}^{n} x_i$
    Suma de todos los valores del conjunto.
  </EquationStep>
  <EquationStep label="Dividir">
    $\frac{1}{n}$
    Divide la suma por la cantidad de datos.
  </EquationStep>
  <EquationStep label="Centro">
    $\bar{x}$
    El punto de equilibrio: donde se balancean los datos.
  </EquationStep>
</EquationTour>

**Mediana**

<ConceptCard variant="definition">
La mediana es el valor del medio cuándo los datos están ordenados de forma ascendente.
</ConceptCard>

$$\text{mediana} = \begin{cases} x_{(n+1)/2} & \text{si } n \text{ es impar} \\ \frac{x_{n/2} + x_{(n/2)+1}}{2} & \text{si } n \text{ es par} \end{cases}$$

**Moda**

<ConceptCard variant="definition">
La moda es el valor más frecuente en un conjunto de datos.
</ConceptCard>

Un conjunto puede tener una moda (unimodal), dos modas (bimodal) o más. En datos continuos, cada valor puede aparecer una sola vez   se usa agrupamiento para encontrar modas significativas.

</RevealSequence>
</Section>

<Section number={4} title="Media vs Mediana: ¿cuál usar?" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<ConceptCard variant="key idea">
La mediana divide el conjunto en dos mitades iguales. A diferencia de la media, **no se ve afectada por valores extremos**. Por eso es la medida preferida para datos sesgados.
</ConceptCard>

<ConceptCard variant="key idea">
- **Definición**: Punto de equilibrio (suma / n)  Valor central (mitad arriba, mitad abajo)
- **Robustez a outliers**: Muy sensible   un valor extremo la desplaza  Robusta   los outliers no la afectan
- **Cuándo usarla**: Datos simétricos (ej. altura, peso, temperatura corporal)  Datos sesgados (ej. ingresos, precios, expresión génica con outliers)
- **Ejemplo**: Notas de un examen bien diseñado  Ingresos de una población (dónde algunos ganan 100× más)
</ConceptCard>

</RevealSequence>
</Section>

<Section number={5} title="Manos a la obra: análisis de puntajes" eyebrow="INTERACTIVA">
<RevealSequence mode="appear">

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

<ChoiceQuestion
  question="En este conjunto de puntajes, la media (84.53) y la mediana (84.50) son casi idénticas. ¿Qué nos dice esto sobre la distribución de los puntajes?"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  blockId="reflection l01 mean median scores"
  allowContinueOnIncorrect
  explanation="La distribución es aproximadamente simétrica: no hay valores extremos que desplacen la media; en una distribución simétrica media ≈ mediana. Si difiriesen mucho, indicaría sesgo u outliers."
  options={[
    { id: "a", label: "La distribución es aproximadamente simétrica, sin extremos que sesguen la media", correct: true, feedback: "Correcto: media ≈ mediana indica simetría sin outliers influyentes." },
    { id: "b", label: "Hay asimetría positiva con outliers altos", correct: false, feedback: "Falso: la asimetría positiva elevaría la media por encima de la mediana." },
    { id: "c", label: "Los datos son perfectamente uniformes", correct: false, feedback: "No necesariamente: media y mediana casi iguales no implican uniformidad exacta." },
    { id: "d", label: "No se puede concluir nada sin conocer la moda", correct: false, feedback: "La moda complementa, pero media y mediana ya revelan simetría." },
  ]}
/>

</RevealSequence>
</Section>

<Section number={6} title="Medidas de Dispersión" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

Las medidas de dispersión indican qué tan dispersos están los datos. No basta con saber el centro   necesitamos saber cuánto varían.

<ConceptCard variant="definition">
**Rango**: Diferencia entre el máximo y el mínimo.

$$\text{Rango} = \max(x) \min(x)$$

Es muy sensible a valores atípicos: un solo valor extremo duplica el rango.
</ConceptCard>

<ConceptCard variant="definition">
**Varianza**: Distancia cuadrática promedio desde la media.

$$\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i \bar{x})^2$$

Mide dispersión, pero en unidades al cuadrado (difícil de interpretar).
</ConceptCard>

<ConceptCard variant="definition">
**Desviación Estándar**: Raíz cuadrada de la varianza.

$$\sigma = \sqrt{\sigma^2}$$

Está en las mismas unidades qué los datos originales   es la medida de dispersión más reportada.
</ConceptCard>

</RevealSequence>
</Section>

<Section number={7} title="IQR: la medida robusta" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<ConceptCard variant="definition">
**Rango Intercuartílico (IQR)**:

$$\text{IQR} = Q_3 Q_1$$

Donde $Q_1$ es el percentil 25 y $Q_3$ es el percentil 75.
</ConceptCard>

<ConceptCard variant="key idea">
El IQR contiene el 50% central de los datos. Es **robusto frente a valores atípicos** por qué ignora los extremos. Junto con la mediana, forma la pareja ideal para datos sesgados.
</ConceptCard>

<ConceptCard variant="key idea">
- **Mide**: Recorrido total (max − min)  Dispersión del 50% central (Q3 − Q1)
- **Robustez**: Muy sensible a outliers  Robusto   ignora extremos
- **Unidad**: Misma qué los datos  Misma qué los datos
- **Se usa con**: Media y desviación estándar  Mediana
- **Cuándo**: Datos simétricos, sin outliers  Datos sesgados o con outliers
</ConceptCard>

</RevealSequence>
</Section>

<Section number={8} title="Caso real: reducción tumoral" eyebrow="INTERACTIVA">
<RevealSequence mode="appear">

Una empresa biotecnológica prueba un nuevo fármaco. Midieron la reducción del tamaño del tumor (mm) en 20 pacientes:

```python
tumor_reduction = [12, 15, 8, 14, 16, 11, 13, 9, 17, 10,
                   14, 13, 15, 12, 11, 16, 10, 14, 13, 45]

reduction = np.array(tumor_reduction)

print("Estadística Descriptiva de Reducción Tumoral")
print(f"Media: {np.mean(reduction):.2f} mm")
print(f"Mediana: {np.median(reduction):.2f} mm")
print(f"Desvío Estándar: {np.std(reduction, ddof=0):.2f} mm")
print(f"IQR: {np.percentile(reduction, 75) np.percentile(reduction, 25):.2f} mm")
```

**¿Qué observamos?** El paciente 20 tuvo una reducción de 45 mm   mucho mayor qué el resto.

<ChoiceQuestion
  question="La media de reducción tumoral es 14.5 mm pero la mediana es 13 mm. ¿Cuál reportarías al equipo médico y por qué?"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  blockId="reflection l01 tumor outlier"
  allowContinueOnIncorrect
  explanation="Reporta la mediana (13 mm): el valor 45 mm es un outlier que infla la media a 14.5 mm. La mediana refleja la experiencia típica; complementa con IQR (4 mm), cuyo 50% central estuvo entre 11 y 15 mm."
  options={[
    { id: "a", label: "La mediana (13 mm), porque el 45 mm es outlier que infla la media", correct: true, feedback: "Correcto: la mediana es robusta al outlier y representa la experiencia típica." },
    { id: "b", label: "La media (14.5 mm), porque usa toda la información disponible", correct: false, feedback: "La usa, pero el outlier de 45 mm la distorsiona artificialmente." },
    { id: "c", label: "La media, porque al ser mayor da un panorama más favorable", correct: false, feedback: "Mayor por el outlier no significa mejor representación típica." },
    { id: "d", label: "Solo el IQR (4 mm), sin reportar centro", correct: false, feedback: "El IQR mide dispersión; falta una medida de centro como la mediana." },
  ]}
/>

</RevealSequence>
</Section>

<Section number={9} title="El IQR cómo detector de outliers" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<EquationTour caption="La regla 1.5×IQR marca el límite más allá del cual un dato es atípico.">
  <EquationStep label="Límite inferior">
    $Q_1 1.5 \times \text{IQR}$
    Valores menores son atípicos bajos.
  </EquationStep>
  <EquationStep label="Centro protegido">
    $Q_1,\ Q_3$
    Delimitan el 50% central de los datos.
  </EquationStep>
  <EquationStep label="Límite superior">
    $Q_3 + 1.5 \times \text{IQR}$
    Valores mayores son atípicos altos.
  </EquationStep>
</EquationTour>

```python
q1 = np.percentile(reduction, 25)
q3 = np.percentile(reduction, 75)
iqr = q3 q1
lower_bound = q1 1.5 * iqr
upper_bound = q3 + 1.5 * iqr
outliers = reduction[(reduction < lower_bound) | (reduction > upper_bound)]

print(f"Límites: [{lower_bound:.2f}, {upper_bound:.2f}]")
print(f"Outliers detectados: {outliers}")
#  Outliers detectados: [45]
```

<ConceptCard variant="warning">
Un outlier no siempre es un error. Puede serlo, pero también puede ser un caso excepcional, incluso el descubrimiento más importante del dataset. Nunca elimines valores atípicos sin investigar su causa.
</ConceptCard>

</RevealSequence>
</Section>

<Section number={10} title="Expresión génica de TP53" eyebrow="INTERACTIVA">
<RevealSequence mode="appear">

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
iqr = q3 q1
lower = q1 1.5 * iqr
print(f"\nMuestras con expresión de TP53 inusualmente baja:")
print(df[df['TP53_expression'] < lower])
```

<CalloutInfo>
TP53 es conocido cómo "el guardián del genoma". Una expresión anormalmente baja puede indicar una deleción del gen   un evento común en células cancerosas. La estadística descriptiva nos ayuda a identificar estas muestras para análisis más profundos.
</CalloutInfo>

</RevealSequence>
</Section>

<Section number={11} title="Ejemplo SaaS: usuarios activos diarios" eyebrow="INTERACTIVA">
<RevealSequence mode="appear">

La estadística descriptiva no es solo para biotecnología. Analicemos usuarios activos diarios (DAU) de un producto SaaS durante 90 días:

```python
np.random.seed(42)
dau = np.random.poisson(lam=1500, size=90) + np.random.randint(-50, 50, 90)

print("Usuarios Activos Diarios Estadística Descriptiva")
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

<ChoiceQuestion
  question="¿Por qué una empresa SaaS monitorearía la mediana de DAU además del promedio?"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  blockId="reflection l01 dau"
  allowContinueOnIncorrect
  explanation="La mediana es robusta a días atípicos (picos virales, caídas del servidor) y refleja un día típico; el promedio puede inflarse por un día excepcional. Monitorear ambas detecta anomalías: si la media se dispara pero la mediana no, hubo un pico puntual."
  options={[
    { id: "a", label: "La mediana refleja un día típico y, comparada con la media, revela picos puntuales", correct: true, feedback: "Correcto: mediana robusta a atípicos; divergencias detectan anomalías." },
    { id: "b", label: "La mediana reemplaza totalmente al promedio", correct: false, feedback: "No: conviene monitorear ambas para detectar anomalías." },
    { id: "c", label: "La mediana es más barata de calcular", correct: false, feedback: "El costo de cálculo no es el motivo; lo es la robustez." },
    { id: "d", label: "La mediana siempre es mayor que la media en DAU", correct: false, feedback: "No hay orden garantizado; depende del sesgo." },
  ]}
/>

</RevealSequence>
</Section>

<Section number={12} title="Errores comunes y mejores prácticas" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<ConceptCard variant="warning">
**Cuatro errores qué todo principiante comete:**

1. **Usar la media para datos sesgados**   la media se va con los outliers. Usa la mediana para ingresos, precios, o cualquier distribución con cola larga.
2. **Confundir varianza muestral y poblacional**   `np.var(x)` usa ddof=0 (poblacional). Para una muestra, usa `np.var(x, ddof=1)`.
3. **Interpretar la desviación estándar sin contexto**   una std de 10 puede ser enorme o insignificante según la escala.
4. **Asumir qué la moda es única**   en datos continuos, agrupa o redondea para encontrar modas significativas.
</ConceptCard>

<CalloutInfo>
**Mejores prácticas:**
- Calcula siempre juntas las medidas de tendencia central y dispersión
- Reporta **mediana + IQR** para distribuciones sesgadas
- Reporta **media + desviación estándar** para distribuciones simétricas
- Visualiza los datos con un diagrama de caja junto con los resúmenes numéricos
- Usa `df.describe()` para una visión rápida en pandas
</CalloutInfo>

</RevealSequence>
</Section>

<Section number={13} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

Pon a prueba lo qué aprendiste:

1. **Un conjunto de datos tiene valores [5, 7, 8, 8, 10, 100]. ¿Qué medida representa mejor el centro?**
2. **¿Cuál es la diferencia entre varianza y desviación estándar? ¿Por qué se reporta más la segunda?**
3. **Una farmacéutica reporta efectividad media del 85%, pero el 40% de pacientes no respondió. ¿Cómo es posible?**

<ChoiceQuestion
  question="Un conjunto de datos tiene valores [5, 7, 8, 8, 10, 100]. ¿Qué medida representa mejor el centro?"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  blockId="choice estadistica l01 rev 1"
  allowContinueOnIncorrect
  explanation="La mediana (8) ignora el outlier 100 y refleja el valor típico, mientras la media (23) queda totalmente distorsionada; la moda también es 8 (aparece dos veces)."
  options={[
    { id: "a", label: "La media (23), porque promedia todos los valores", correct: false, feedback: "La media se va con el outlier 100 y no refleja el valor típico." },
    { id: "b", label: "La mediana (8), que ignora el extremo 100", correct: true, feedback: "¡Correcto! La mediana refleja el centro real." },
    { id: "c", label: "La moda (8) únicamente", correct: false, feedback: "Aquí coincide, pero en general la moda no garantiza representar el centro mejor que la mediana." },
    { id: "d", label: "El rango (95), porque resume la dispersión", correct: false, feedback: "El rango mide dispersión, no el centro." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la diferencia entre varianza y desviación estándar? ¿Por qué se reporta más la segunda?"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  blockId="choice estadistica l01 rev 2"
  allowContinueOnIncorrect
  explanation="La varianza mide dispersión en unidades al cuadrado (difícil de interpretar); la desviación estándar es su raíz cuadrada y vuelve a las unidades originales, por eso se reporta más."
  options={[
    { id: "a", label: "La varianza es más fácil de interpretar porque está en unidades originales", correct: false, feedback: "Al revés: la varianza vive en unidades al cuadrado." },
    { id: "b", label: "La desviación estándar es la raíz cuadrada de la varianza, en unidades originales", correct: true, feedback: "¡Correcto! Por eso es directamente interpretable." },
    { id: "c", label: "Son equivalentes; se reporta la varianza porque usa todos los datos", correct: false, feedback: "No son equivalentes: se reporta la desviación estándar por legibilidad." },
    { id: "d", label: "La desviación estándar es siempre mayor que la varianza", correct: false, feedback: "La comparación depende de la escala; el punto es la unidad, no el tamaño." },
  ]}
/>

<ChoiceQuestion
  question="Una farmacéutica reporta efectividad media del 85%, pero el 40% de pacientes no respondió. ¿Cómo es posible?"
  moduleSlug="estadistica"
  lessonSlug="lesson01_descriptive_stats"
  blockId="choice estadistica l01 rev 3"
  allowContinueOnIncorrect
  explanation="La media puede ser engañosa con variabilidad extrema: si el 60% tuvo 100% efectividad y el 40% 0%, la media sería 60%, no 85%. Para llegar a 85% con 40% en cero haría falta ~142% en el resto (imposible). Probablemente reportan la media de respondedores excluyendo no respondedores; mejor: mediana + porcentaje de respondedores."
  options={[
    { id: "a", label: "Probablemente la media se calcula solo sobre los respondedores", correct: true, feedback: "¡Correcto! Excluir no respondedores infla artificialmente la media." },
    { id: "b", label: "La media es 85% porque el 60% respondió al 100% y el resto al 0%", correct: false, feedback: "Esa mezcla daría una media de 60%, no de 85%." },
    { id: "c", label: "La mediana es 85% porque la mitad respondió al 100%", correct: false, feedback: "La mediana no explicaría un promedio del 85% con 40% sin respuesta." },
    { id: "d", label: "Es válido: la varianza baja evita que los ceros afecten la media", correct: false, feedback: "Con 40% en cero la media no puede ignorarlos; el supuesto falla." },
  ]}
/>

</RevealSequence>
</Section>

<Section number={14} title="Términos clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<ConceptCard variant="key idea">
- **Media**: Suma de valores dividida por la cantidad; el promedio aritmético
- **Mediana**: El valor del medio cuándo los datos están ordenados
- **Moda**: El valor más frecuente en el conjunto de datos
- **Varianza**: Distancia cuadrática promedio desde la media (σ²)
- **Desviación Estándar**: Raíz cuadrada de la varianza; distancia típica desde la media (σ)
- **Rango**: Diferencia entre el valor máximo y el mínimo
- **Rango Intercuartílico**: Diferencia entre Q3 (percentil 75) y Q1 (percentil 25)
- **Valor Atípico (Outlier)**: Punto qué difiere significativamente del resto; detectado con la regla 1.5×IQR
</ConceptCard>

</RevealSequence>
</Section>

<Section number={15} title="Para la próxima lección" eyebrow="CIERRE">
<RevealSequence mode="appear">

<MascotMessage mood="celebrating">
Excelente trabajo: ya tienes las herramientas fundamentales para describir cualquier conjunto de datos. Media, mediana, rango intercuartílico y valores atípicos son el pan de cada día de un científico de datos.
</MascotMessage>

**¿Qué aprendiste hoy?**
- La estadística descriptiva resume datasets enteros en un puñado de números
- Media + desviación estándar para datos simétricos
- Mediana + IQR para datos sesgados o con outliers
- El IQR detecta outliers con la regla de 1.5×

**En la Lección 2** vamos a complementar estos números con visualizaciones: histogramas, curvas de densidad, asimetría y curtosis. Porque un número te dice *qué*, pero un gráfico te muestra *por qué*.

</RevealSequence>
</Section>
