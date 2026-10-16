---
Module: 3
Lesson Number: 2
Lesson Title: Distribución de Datos
Estimated Duration: 60 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  - Construir histogramas y gráficos de densidad usando matplotlib y seaborn
  - Interpretar valores de asimetría y curtosis
  - Distinguir entre distribuciones simétricas, con asimetría izquierda y con asimetría derecha
  - Elegir el ancho de bin adecuado para histogramas
  - Explicar cómo la forma de la distribución afecta la elección de estadísticos de resumen
Keywords: histograma, gráfico de densidad, asimetría, curtosis, KDE, forma de distribución
Difficulty: Principiante
Programming Concepts: matplotlib, seaborn, numpy, pandas
Mathematical Concepts: asimetría, curtosis, función de densidad de probabilidad
Machine Learning Concepts: comprensión de la distribución de datos
Datasets Used: Datos sintéticos, dataset de pingüinos
Notebook: 02_data_distribution.ipynb
Assignment: data_distribution_assignment.md
Quiz: data_distribution_quiz.md
---

<Section number={1} title="Más allá de los números" eyebrow="INICIO">

<MascotMessage mood="thinking">
En la Lección 1 aprendiste a resumir datos con números. Pero dos datasets con idéntica media y desviación estándar pueden ser completamente diferentes. Hoy vamos a ver la forma de los datos.
</MascotMessage>

Dos conjuntos de datos muy diferentes pueden tener medias y desviaciones estándar idénticas. Visualizar la distribución revela patrones qué los estadísticos de resumen no muestran: multimodalidad, huecos, agrupaciones y valores extremos.

En biotecnología, las formas de las distribuciones revelan si la expresión génica sigue un patrón normal o log-normal. En SaaS, los datos de actividad de usuarios suelen seguir una distribución de ley de potencias, lo qué afecta cómo calculamos promedios y detectamos anomalías.

</Section>

<Section number={2} title="¿Dónde estamos?" eyebrow="CONCEPTO">

La Lección 1 enseñó resúmenes numéricos; esta lección enseña resúmenes visuales. Aprenderás a **ver** la forma de tus datos.

<ConceptCard variant="key-idea">
Entender la distribución de los datos es crítico antes de aplicar cualquier modelo de machine learning, ya qué muchos algoritmos asumen qué las features siguen una distribución normal.
</ConceptCard>

Esto te prepara para la Lección 3 (Probabilidad) y la Lección 4 (Distribuciones Estadísticas con nombre cómo la normal y binomial).

</Section>

<Section number={3} title="Histogramas: la primera mirada" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Un histograma particiona los datos en intervalos (bins) y cuenta cuántas observaciones caen en cada uno. El área de cada barra representa la proporción de datos en ese intervalo.
</ConceptCard>

La cantidad de bins afecta drásticamente la interpretación:

- Regla de Sturges: $k = \lceil \log_2 n + 1 \rceil$
- Regla de la raíz cuadrada: $k = \lceil \sqrt{n} \rceil$
- Regla de Freedman-Diaconis: $h = 2 \times \text{IQR} \times n^{-1/3}$

<ConceptCard variant="warning">
Muy pocos bins ocultan detalles importantes. Demasiados bins crean ruido qué parece estructura pero no lo es. Probar varios anchos es parte del análisis exploratorio.
</ConceptCard>

</Section>

<Section number={4} title="KDE: la curva suave" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Una estimación de densidad por kernel (KDE) traza una versión suavizada del histograma colocando un "bache" (kernel) en cada punto de datos y sumándolos.
</ConceptCard>

$$\hat{f}(x) = \frac{1}{nh} \sum_{i=1}^{n} K\left(\frac{x - x_i}{h}\right)$$

El ancho de banda $h$ controla la suavidad: $h$ grande → curva más suave, $h$ chico → más detalle.

</Section>

<Section number={5} title="Asimetría: la cola manda" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
La asimetría mide la falta de simetría de la distribución:

$$\text{Asimetría} = \frac{1}{n} \sum_{i=1}^{n} \left(\frac{x_i - \bar{x}}{\sigma}\right)^3$$
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Valor", left: "Asimetría = 0", right: "Distribución simétrica (ej. normal)" },
    { feature: "Dirección", left: "Asimetría > 0", right: "Cola larga a la derecha → media > mediana" },
    { feature: "Caso típico", left: "Asimetría < 0", right: "Cola larga a la izquierda → media < mediana" },
    { feature: "Ejemplo", left: "Precios de casas (cola derecha)", right: "Notas de examen fácil (cola izquierda)" },
  ]}
/>

<ConceptCard variant="key-idea">
En una distribución con asimetría a la derecha, la media es mayor que la mediana, porque los valores extremos altos arrastran la media. Por eso, en estos casos conviene reportar también la mediana, que es más robusta a los valores atípicos.
</ConceptCard>

</Section>

<Section number={6} title="Curtosis: ¿qué tan extremos son los extremos?" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
La curtosis mide el "peso de las colas" — qué tan probables son los valores extremos:

$$\text{Curtosis} = \frac{1}{n} \sum_{i=1}^{n} \left(\frac{x_i - \bar{x}}{\sigma}\right)^4 - 3$$
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Curtosis = 0", left: "Mesocúrtica", right: "Similar a la distribución normal" },
    { feature: "Curtosis > 0", left: "Leptocúrtica", right: "Colas pesadas → más outliers. Ej: retornos financieros" },
    { feature: "Curtosis < 0", left: "Platicúrtica", right: "Colas livianas → menos outliers. Ej: distribución uniforme" },
  ]}
/>

<CalloutInfo>
Una curtosis alta significa qué los valores extremos son más probables qué en una normal. Esto importa para evaluación de riesgos y detección de outliers en genómica.
</CalloutInfo>

</Section>

<Section number={7} title="Manos a la obra: tres distribuciones" eyebrow="INTERACTIVA">

Visualicemos distribuciones simétricas, asimétricas a la derecha y a la izquierda:

```python
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis

np.random.seed(42)
symmetric = np.random.normal(loc=50, scale=10, size=1000)
right_skewed = np.random.exponential(scale=10, size=1000)
left_skewed = -np.random.exponential(scale=10, size=1000) + 100

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
axes[0].hist(symmetric, bins=20, edgecolor='black', color='steelblue')
axes[0].set_title('Simétrica (Normal)')
axes[1].hist(right_skewed, bins=20, edgecolor='black', color='coral')
axes[1].set_title('Asimétrica a la Derecha')
axes[2].hist(left_skewed, bins=20, edgecolor='black', color='seagreen')
axes[2].set_title('Asimétrica a la Izquierda')
plt.tight_layout()
plt.show()

print(f"Simétrica - Asimetría: {skew(symmetric):.3f}, Curtosis: {kurtosis(symmetric):.3f}")
print(f"Der. - Asimetría: {skew(right_skewed):.3f}, Curtosis: {kurtosis(right_skewed):.3f}")
print(f"Izq. - Asimetría: {skew(left_skewed):.3f}, Curtosis: {kurtosis(left_skewed):.3f}")
```

</Section>

<Section number={8} title="Caso real: pingüinos" eyebrow="INTERACTIVA">

Analicemos la masa corporal de pingüinos — ¿es simétrica?

```python
import seaborn as sns
penguins = sns.load_dataset('penguins').dropna()

plt.figure(figsize=(10, 5))
sns.histplot(penguins['body_mass_g'], bins=25, kde=True, edgecolor='black')
plt.title('Distribución de la Masa Corporal de Pingüinos')
plt.xlabel('Masa Corporal (g)')
plt.tight_layout()
plt.show()

print(f"Asimetría: {skew(penguins['body_mass_g']):.3f}")
print(f"Curtosis: {kurtosis(penguins['body_mass_g']):.3f}")
print(f"Media: {penguins['body_mass_g'].mean():.0f} g")
print(f"Mediana: {penguins['body_mass_g'].median():.0f} g")
```

<ChoiceQuestion
  question="La masa corporal de los pingüinos muestra múltiples picos en el histograma. ¿Qué podría explicar esto biológicamente?"
  moduleSlug="estadistica"
  lessonSlug="lesson02_data_distribution"
  blockId="reflection-l02-penguins"
  allowContinueOnIncorrect
  explanation="Múltiples especies (Adelie, Gentoo, Chinstrap) con rangos de masa distintos generan multimodalidad: la distribución general es una mezcla por especie. Es señal para segmentar por especie antes de analizar."
  options={[
    { id: "a", label: "Varias especies con rangos de masa distintos (multimodalidad); conviene segmentar", correct: true, feedback: "Correcto: la mezcla de especies explica los múltiples picos." },
    { id: "b", label: "Ruido de muestreo; con más datos habría un solo pico", correct: false, feedback: "Los picos persistentes por especie no desaparecen con más datos." },
    { id: "c", label: "Una sola especie con variabilidad extrema", correct: false, feedback: "Una sola especie suele ser unimodal, no multimodal." },
    { id: "d", label: "Bins mal elegidos generan picos artificiales", correct: false, feedback: "El ancho de bin suaviza, no crea multimodalidad entre especies." },
  ]}
/>

</Section>

<Section number={9} title="Biotecnología: expresión génica log-normal" eyebrow="INTERACTIVA">

Los datos de expresión génica suelen seguir una distribución log-normal. Una transformación logarítmica los vuelve aproximadamente normales:

```python
np.random.seed(42)
gene_expression = np.random.lognormal(mean=2.0, sigma=0.8, size=1000)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].hist(gene_expression, bins=30, edgecolor='black', color='steelblue')
axes[0].set_title('Expresión Génica Original (Log-Normal)')
log_transformed = np.log1p(gene_expression)
axes[1].hist(log_transformed, bins=30, edgecolor='black', color='coral')
axes[1].set_title('Transformación Logarítmica (Aprox. Normal)')
plt.tight_layout()
plt.show()

print(f"Asimetría original: {skew(gene_expression):.3f}")
print(f"Asimetría con log: {skew(log_transformed):.3f}")
```

<CalloutInfo>
Muchos algoritmos de ML (regresión lineal, PCA, clustering) funcionan mejor con datos aproximadamente normales. La transformación logarítmica es una herramienta estándar en bioinformática para normalizar datos de expresión génica.
</CalloutInfo>

</Section>

<Section number={10} title="SaaS: duración de sesiones" eyebrow="INTERACTIVA">

Las duraciones de sesión en productos SaaS suelen seguir una distribución exponencial:

```python
np.random.seed(42)
session_duration = np.random.exponential(scale=300, size=2000)

plt.figure(figsize=(10, 4))
sns.histplot(session_duration, bins=40, kde=True, edgecolor='black')
plt.title('Distribución de Duraciones de Sesión')
plt.xlabel('Duración (segundos)')
plt.axvline(np.mean(session_duration), color='red', linestyle='--', label=f'Media: {np.mean(session_duration):.0f}s')
plt.axvline(np.median(session_duration), color='blue', linestyle='-', label=f'Mediana: {np.median(session_duration):.0f}s')
plt.legend()
plt.show()
```

<ChoiceQuestion
  question="La distribución de duraciones de sesión es asimétrica a la derecha. ¿Qué métrica reportarías al equipo de producto: media o mediana? ¿Por qué?"
  moduleSlug="estadistica"
  lessonSlug="lesson02_data_distribution"
  blockId="reflection-l02-session-skew"
  allowContinueOnIncorrect
  explanation="Reporta mediana: pocas sesiones extremadamente largas inflan la media. La mediana refleja la duración típica; además, segmenta por tipo de usuario (power vs casual), cuyas distribuciones difieren."
  options={[
    { id: "a", label: "La mediana, porque sesiones extremas inflan la media; además segmentar por tipo de usuario", correct: true, feedback: "Correcto: mediana robusta al sesgo; la segmentación revela patrones distintos." },
    { id: "b", label: "La media, porque usa toda la información disponible", correct: false, feedback: "La usa, pero las sesiones extremadamente largas la inflan." },
    { id: "c", label: "La media, porque al ser mayor parece mejor engagement", correct: false, feedback: "Mayor por outliers no refleja la experiencia típica." },
    { id: "d", label: "La mediana, siempre menor y por eso más conservadora", correct: false, feedback: "La mediana no se elige por ser menor, sino por robustez al sesgo." },
  ]}
/>

</Section>

<Section number={11} title="Errores comunes y mejores prácticas" eyebrow="CONCEPTO">

<ConceptCard variant="warning">
**Cuatro errores frecuentes:**

1. **Usar muy pocos bins** — oculta la forma real de la distribución.
2. **Ignorar la multimodalidad** — múltiples picos sugieren subgrupos (diferentes especies, tipos de usuarios).
3. **Asumir normalidad sin verificar** — muchos datasets del mundo real son asimétricos.
4. **Confundir la dirección de la asimetría** — asimetría derecha = cola a la derecha, media > mediana.
</ConceptCard>

<CalloutInfo>
**Mejores prácticas:**
- Visualiza siempre tus datos antes de calcular estadísticos
- Prueba múltiples anchos de bin para ver diferentes niveles de detalle
- Usa gráficos KDE junto con histogramas
- Reporta asimetría y curtosis junto con media y desviación estándar
- Aplica transformación logarítmica a datos con asimetría derecha para ML
</CalloutInfo>

</Section>

<Section number={12} title="Checkpoint" eyebrow="EVALUACIÓN">

<ChoiceQuestion
  question="Un histograma de precios de casas muestra una cola larga a la derecha. ¿Esta distribución es simétrica, asimétrica a la izquierda o a la derecha? ¿Qué implica sobre la media vs la mediana?"
  moduleSlug="estadistica"
  lessonSlug="lesson02_data_distribution"
  blockId="reflection-l02-checkpoint"
  allowContinueOnIncorrect
  explanation="Asimétrica a la derecha: las casas muy caras jalan la media por encima de la mediana. Para un precio típico usa la mediana; la media se distorsiona por un puñado de mansiones."
  options={[
    { id: "a", label: "Asimétrica a la derecha: media > mediana (casas caras jalan la media); reporta mediana", correct: true, feedback: "Correcto: cola a la derecha implica media por encima de la mediana." },
    { id: "b", label: "Simétrica: media = mediana", correct: false, feedback: "Una cola larga a la derecha rompe la simetría." },
    { id: "c", label: "Asimétrica a la izquierda: media < mediana", correct: false, feedback: "Eso corresponde a cola a la izquierda, no a la derecha." },
    { id: "d", label: "Media, porque al ser mayor refleja mejor el mercado", correct: false, feedback: "Mayor por mansiones no es precio típico; usa mediana." },
  ]}
/>

<AnswerReveal summary="Ver más respuestas">
<p><strong>¿Qué valor de curtosis esperarías para una distribución normal?</strong> Curtosis = 0 (usando curtosis en exceso, qué resta 3). La distribución normal es el punto de referencia: ni colas pesadas ni livianas.</p>
<p><strong>¿Por qué una empresa SaaS preferiría la mediana sobre la media para reportar LTV?</strong> Porque el Lifetime Value suele tener cola derecha — unos pocos clientes enterprise con LTV enorme inflan la media. La mediana refleja mejor el valor de un cliente 'típico'.</p>
</AnswerReveal>

</Section>

<Section number={13} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["Histograma", "Gráfico de barras de frecuencias de datos agrupados en bins"],
    ["KDE", "Estimación suave de la densidad de probabilidad usando kernels"],
    ["Asimetría", "Medida de la falta de simetría (0 = simétrico)"],
    ["Curtosis", "Medida del peso de las colas (0 = similar a la normal)"],
    ["Leptocúrtica", "Distribución con colas pesadas (más outliers de lo esperado)"],
    ["Platicúrtica", "Distribución con colas livianas (menos outliers)"],
    ["Multimodal", "Distribución con múltiples picos — sugiere subgrupos"],
  ]}
  searchable={true}
  caption="Términos clave de distribución de datos"
/>

</Section>

<Section number={14} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
Ya sabes leer la forma de los datos. Esto es fundamental: sin entender la distribución, no es posible elegir el modelo correcto.
</MascotMessage>

**¿Qué aprendiste hoy?**
- Histogramas y KDE revelan la forma de la distribución
- Asimetría ≠ 0 significa qué los datos no son simétricos
- Curtosis alta = riesgo de outliers extremos
- La transformación logarítmica normaliza datos con cola derecha

**En la Lección 3** vamos a formalizar todo esto con la teoría de probabilidad: axiomas, Bayes, y variables aleatorias. Porque hasta ahora describimos datos del pasado — la probabilidad nos permite razonar sobre el futuro.

</Section>
