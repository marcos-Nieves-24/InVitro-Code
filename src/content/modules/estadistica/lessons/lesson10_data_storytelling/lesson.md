---
Module: 3
Lesson Number: 10
Lesson Title: Narración de Datos
Estimated Duration: 60 minutos
Prerequisites: Lecciones 1-6
Learning Objectives:
  - Estructurar una historia de datos con arco narrativo
  - Aplicar mejores prácticas de visualización para una comunicación efectiva
  - Diseñar dashboards informativos
  - Comunicar hallazgos estadísticos a audiencias no técnicas
  - Evitar errores comunes de visualización
Keywords: narración de datos, visualización, dashboard, comunicación, narrativa, periodismo de datos
Difficulty: Intermedio
Programming Concepts: matplotlib, plotly, seaborn, dashboards
Mathematical Concepts: Ninguno (orientado a la aplicación)
Machine Learning Concepts: comunicación de resultados, interpretación de modelos
Datasets Used: pingüinos, mpg, sintético
Notebook: 10_data_storytelling.ipynb
Assignment: data_storytelling_assignment.md
Quiz: data_storytelling_quiz.md
---

<Section number={1} title="El análisis que nadie lee" eyebrow="INICIO">

<MascotMessage mood="thinking">
Hiciste el EDA, corriste PCA, evaluaste tu modelo con validación cruzada... y ahora que? Si no puedes comunicar tus resultados, es como si no hubieras hecho nada. La narración de datos convierte análisis en acción.
</MascotMessage>

El mejor análisis del mundo es inútil si no convence a quién toma decisiones. Un médico necesita entender porque tu modelo recomienda un tratamiento. Un CEO necesita ver el ROI, no el RMSE. La narración de datos es el puente entre el análisis técnico y la decisión humana.

<ConceptCard variant="key-idea">
Datos sin historia son números. Datos con historia son evidencia. Datos con historia y contexto son persuasion.
</ConceptCard>

</Section>

<Section number={2} title="El arco narrativo de los datos" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Toda historia de datos efectiva sigue una estructura:

1. **Contexto**: ¿Por qué esto importa? ¿Qué problema resolvemos?
2. **Conflicto**: ¿Qué muestran los datos que es sorprendente o contraintuitivo?
3. **Resolución**: ¿Qué acción recomendamos basada en la evidencia?
</ConceptCard>

Ejemplo biotecnológico: "Este nuevo fármaco reduce tumores en el 60% de pacientes (contexto), PERO descubrimos que solo funciona en pacientes con la mutación BRCA1 (conflicto/sorpresa). Recomendamos test genético antes de recetar (resolución)."

</Section>

<Section number={3} title="Visualizaciones que comunican" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Mostrar tendencias", left: "Gráfico de lineas", right: "Fácil de leer, tiempo en eje X" },
    { feature: "Comparar categorías", left: "Gráfico de barras", right: "Ordenar por valor, no alfabeticamente" },
    { feature: "Mostrar distribución", left: "Histograma o boxplot", right: "Mejor que tabla de frecuencias" },
    { feature: "Relacion entre variables", left: "Scatter plot", right: "Agregar linea de tendencia si hay correlación" },
    { feature: "Partes de un todo", left: "Gráfico de barras apiladas", right: "EVITAR gráficos de torta" },
    { feature: "Matriz de correlación", left: "Heatmap", right: "Anotar con valores para referencia rápida" },
  ]}
/>

<ConceptCard variant="warning">
Errores clásicos de visualización: ejes truncados que exageran diferencias, 3D innecesario que distorsiona, demasiados colores, gráficos de torta para más de 3 categorías, falta de etiquetas y títulos.
</ConceptCard>

</Section>

<Section number={4} title="Menos es más: el dashboard efectivo" eyebrow="CONCEPTO">

<CalloutInfo>
**Reglas de oro del dashboard**:
- 3-5 visualizaciones máximo. Si necesitas más, hace dos dashboards
- La visualización más importante arriba a la izquierda (patron de lectura F)
- Cada gráfico responde UNA pregunta
- Colores con significado: rojo = problema, verde = bien, azul = neutral
- Etiquetas claras: títulos que son conclusiones, no descripciones
</CalloutInfo>

<ReflectionCheck
  blockId="reflection-l10-dashboard"
  moduleSlug="estadistica"
  lessonSlug="lesson10_data_storytelling"
  prompt="Un dashboard tiene 12 gráficos y ocupa 3 pantallas de scroll. Cuál es el problema y como lo arreglarias?"
  answer="Nadie mira 12 gráficos. La atencion es el recurso más escaso. Solucion: (1) elige los 3 KPIs que realmente importan, (2) ponlos en la primera pantalla sin scroll, (3) los otros 9 gráficos muévelos a una pagina secundaria. La regla: si el CEO no puede entender el dashboard en 10 segundos, fallaste."
/>

</Section>

<Section number={5} title="Comunicando a no-técnicos" eyebrow="INTERACTIVA">

<InteractiveTable
  headers={["Decis esto...", "Mejor deci esto...", "Porque"]}
  rows={[
    ["El RMSE fue 3.4 con R2 de 0.72", "El modelo predice el precio con un error típico de $3,400 y captura el 72% de la variación", "Unidades y contexto humano"],
    ["Realizamos PCA con 3 componentes explicando 85% de varianza", "Redujimos 50 variables a 3 dimensiones principales sin perder casi información", "Analogia visual intuitiva"],
    ["El p-valor fue 0.03, rechazamos H0", "Hay solo 3% de probabilidad de que este resultado sea casualidad", "Traducir significancia estadística a lenguaje comun"],
    ["K-Means con k=4, silhouette 0.65", "Encontramos 4 grupos naturales de clientes con comportamientos muy distintos", "Resultado accionable, no parametro técnico"],
  ]}
  searchable={true}
  caption="Traduciendo estadística a decisiones"
/>

</Section>

<Section number={6} title="Plotly: visualizaciones interactivas" eyebrow="INTERACTIVA">

```python
import plotly.express as px

penguins = px.data.penguins().dropna()

fig = px.scatter(penguins, x='flipper_length_mm', y='body_mass_g',
                 color='species', size='bill_length_mm',
                 hover_data=['island', 'sex'],
                 title='Pingüinos: Masa vs Longitud de Aleta')
fig.show()
```

<CalloutInfo>
Plotly genera gráficos interactivos: zoom, hover con datos, seleccion. Son ideales para dashboards y reportes donde el usuario explora los datos. Mucho más efectivo que imagenes estaticas.
</CalloutInfo>

</Section>

<Section number={7} title="Checkpoint final del módulo" eyebrow="EVALUACIÓN">

<ReflectionCheck
  blockId="reflection-l10-storytelling"
  moduleSlug="estadistica"
  lessonSlug="lesson10_data_storytelling"
  prompt="Tu modelo de ML predice que pacientes responderan a un tratamiento con 85% de accuracy. El director médico te pregunta si deberian usarlo en el hospital. que le decis?"
  answer="No le digas '85% accuracy'. Dile: 'De cada 100 pacientes, el modelo identifica correctamente a 85. Pero de los 15 que se equivoca, algunos son pacientes que SI responderian y el modelo dijo que no (pierden la oportunidad de tratarse). Otros son pacientes que NO responderian pero el modelo dijo que si (reciben un tratamiento inútil con efectos secundarios). que error es más grave para el hospital?' Esto convierte una métrica abstracta en un dilema médico real que el director puede evaluar."
/>

<AnswerReveal summary="Ver respuesta">
<p>Gráfico de torta o de barras para mostrar participacion de mercado de 5 competidores? Barras, siempre. Las tortas son difíciles de comparar (el ojo humano es malo comparando angulos). Con barras ordenadas de mayor a menor, en 2 segundos entendes quién lidera y por cuanto.</p>
</AnswerReveal>

</Section>

<Section number={8} title="Terminos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Termino", "Definicion"]}
  rows={[
    ["Narración de Datos", "Comunicar hallazgos con contexto, narrativa y visualizaciones"],
    ["Arco Narrativo", "Estructura: contexto, conflicto, resolución"],
    ["Dashboard", "Panel de visualizaciones clave en una sola vista"],
    ["Plotly", "Libreria de gráficos interactivos para Python"],
    ["KPI", "Key Performance Indicator: métrica que guia decisiones"],
    ["Audiencia", "A quién le hablas: adapta el lenguaje técnico a su nivel"],
  ]}
  searchable={true}
  caption="Terminos clave de narración de datos"
/>

</Section>

<Section number={9} title="Cerrando el módulo" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
Felicidades! Completaste el Módulo 3 de Estadística y Probabilidad. De descriptive stats a data storytelling, construiste la base estadística que todo científico de datos necesita. Ahora estas listo para Machine Learning.
</MascotMessage>

**Que aprendiste en este módulo:**
- Estadística descriptiva: resumir datos con números
- Distribuciones: ver la forma de los datos
- Probabilidad: razonar bajo incertidumbre con Bayes
- Distribuciones estadísticas: Bernoulli, Binomial, Poisson, Normal
- Relaciones: Pearson, Spearman, correlación vs causalidad
- EDA: el flujo de trabajo del científico de datos
- PCA: reducir dimensionalidad sin perder información
- Clustering: encontrar grupos naturales con K-Means
- Evaluación: medir que tan bueno es tu modelo
- Storytelling: comunicar resultados para generar acción

En el **Módulo 4 (Machine Learning)** vas a aplicar todo esto para construir modelos predictivos reales.

</Section>
