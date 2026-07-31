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

<MascotMessage mood="curious">
En la Lección 1 aprendiste a resumir datos con números. Pero dos datasets con idéntica media y desviación estándar pueden ser completamente diferentes. Hoy vamos a ver la forma de los datos.
</MascotMessage>

Dos conjuntos de datos muy diferentes pueden tener medias y desviaciones estándar idénticas. Visualizar la distribución revela patrones que los estadísticos de resumen no muestran: multimodalidad, huecos, agrupaciones y valores extremos.

En biotecnología, las formas de las distribuciones revelan si la expresión génica sigue un patrón normal o log-normal. En SaaS, los datos de actividad de usuarios suelen seguir una distribución de ley de potencias, lo que afecta cómo calculamos promedios y detectamos anomalías.

</Section>

<Section number={2} title="¿Dónde estamos?" eyebrow="CONCEPTO">

La Lección 1 enseñó resúmenes numéricos; esta lección enseña resúmenes visuales. Aprenderás a **ver** la forma de tus datos.

<ConceptCard variant="key-idea">
Entender la distribución de los datos es crítico antes de aplicar cualquier modelo de machine learning, ya que muchos algoritmos asumen que las features siguen una distribución normal.
</ConceptCard>

Esto te prepara para la Lección 3 (Probabilidad) y la Lección 4 (Distribuciones Estadísticas con nombre como la normal y binomial).

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
Muy pocos bins ocultan detalles importantes. Demasiados bins crean ruido que parece estructura pero no lo es. Probar varios anchos es parte del análisis exploratorio.
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
En una distribución con asimetría a la derecha, la media es mayor que la mediana porque los valores extremos altos jalan la media. ¡Siempre reportá la mediana en estos casos!
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
Una curtosis alta significa que los valores extremos son más probables que en una normal. Esto importa para evaluación de riesgos y detección de outliers en genómica.
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

<ReflectionCheck
  blockId="reflection-l02-penguins"
  moduleSlug="estadistica"
  lessonSlug="lesson02_data_distribution"
  prompt="La masa corporal de los pingüinos muestra múltiples picos en el histograma. ¿Qué podría explicar esto biológicamente?"
  answer="Probablemente hay múltiples especies de pingüinos en el dataset (Adelie, Gentoo, Chinstrap), cada una con un rango de masa corporal diferente. Esto se llama multimodalidad — la distribución general es una mezcla de distribuciones por especie. Es una señal de que necesitamos segmentar los datos por especie antes de analizar."
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

<ReflectionCheck
  blockId="reflection-l02-session-skew"
  moduleSlug="estadistica"
  lessonSlug="lesson02_data_distribution"
  prompt="La distribución de duraciones de sesión es asimétrica a la derecha. ¿Qué métrica reportarías al equipo de producto: media o mediana? ¿Por qué?"
  answer="Reportaría la mediana. Unas pocas sesiones extremadamente largas inflan la media. La mediana refleja mejor la duración 'típica' de una sesión. Además, con datos tan sesgados, el equipo debería segmentar por tipo de usuario — los power users y los usuarios casuales tienen distribuciones muy diferentes."
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
- Visualizá siempre tus datos antes de calcular estadísticos
- Probá múltiples anchos de bin para ver diferentes niveles de detalle
- Usá gráficos KDE junto con histogramas
- Reportá asimetría y curtosis junto con media y desviación estándar
- Aplicá transformación logarítmica a datos con asimetría derecha para ML
</CalloutInfo>

</Section>

<Section number={12} title="Checkpoint" eyebrow="EVALUACIÓN">

<ReflectionCheck
  blockId="reflection-l02-checkpoint"
  moduleSlug="estadistica"
  lessonSlug="lesson02_data_distribution"
  prompt="Un histograma de precios de casas muestra una cola larga a la derecha. ¿Esta distribución es simétrica, asimétrica a la izquierda o a la derecha? ¿Qué implica sobre la media vs la mediana?"
  answer="Es asimétrica a la derecha (cola a la derecha). En esta distribución, la media es mayor que la mediana porque las casas muy caras jalan la media hacia arriba. Para reportar un precio 'típico', usá la mediana. La media puede ser engañosa porque está distorsionada por un puñado de mansiones."
/>

<AnswerReveal summary="Ver más respuestas">
<p><strong>¿Qué valor de curtosis esperarías para una distribución normal?</strong> Curtosis = 0 (usando curtosis en exceso, que resta 3). La distribución normal es el punto de referencia: ni colas pesadas ni livianas.</p>
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
¡Ya sabés ver la forma de los datos! Esto es fundamental: si no entendés la distribución, no podés elegir el modelo correcto.
</MascotMessage>

**¿Qué aprendiste hoy?**
- Histogramas y KDE revelan la forma de la distribución
- Asimetría ≠ 0 significa que los datos no son simétricos
- Curtosis alta = riesgo de outliers extremos
- La transformación logarítmica normaliza datos con cola derecha

**En la Lección 3** vamos a formalizar todo esto con la teoría de probabilidad: axiomas, Bayes, y variables aleatorias. Porque hasta ahora describimos datos del pasado — la probabilidad nos permite razonar sobre el futuro.

</Section>
