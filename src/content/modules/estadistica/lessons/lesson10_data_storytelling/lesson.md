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

<Section number={1} title="El analisis que nadie lee" eyebrow="INICIO">

<MascotMessage mood="curious">
Hiciste el EDA, corriste PCA, evaluaste tu modelo con validacion cruzada... y ahora que? Si no podes comunicar tus resultados, es como si no hubieras hecho nada. La narracion de datos convierte analisis en accion.
</MascotMessage>

El mejor analisis del mundo es inutil si no convence a quien toma decisiones. Un medico necesita entender por que tu modelo recomienda un tratamiento. Un CEO necesita ver el ROI, no el RMSE. La narracion de datos es el puente entre el analisis tecnico y la decision humana.

<ConceptCard variant="key-idea">
Datos sin historia son numeros. Datos con historia son evidencia. Datos con historia y contexto son persuasion.
</ConceptCard>

</Section>

<Section number={2} title="El arco narrativo de los datos" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Toda historia de datos efectiva sigue una estructura:

1. **Contexto**: Por que esto importa? Que problema resolvemos?
2. **Conflicto**: Que muestran los datos que es sorprendente o contraintuitivo?
3. **Resolucion**: Que accion recomendamos basada en la evidencia?
</ConceptCard>

Ejemplo biotecnologico: "Este nuevo farmaco reduce tumores en el 60% de pacientes (contexto), PERO descubrimos que solo funciona en pacientes con la mutacion BRCA1 (conflicto/sorpresa). Recomendamos test genetico antes de recetar (resolucion)."

</Section>

<Section number={3} title="Visualizaciones que comunican" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Mostrar tendencias", left: "Grafico de lineas", right: "Facil de leer, tiempo en eje X" },
    { feature: "Comparar categorias", left: "Grafico de barras", right: "Ordenar por valor, no alfabeticamente" },
    { feature: "Mostrar distribucion", left: "Histograma o boxplot", right: "Mejor que tabla de frecuencias" },
    { feature: "Relacion entre variables", left: "Scatter plot", right: "Agregar linea de tendencia si hay correlacion" },
    { feature: "Partes de un todo", left: "Grafico de barras apiladas", right: "EVITAR graficos de torta" },
    { feature: "Matriz de correlacion", left: "Heatmap", right: "Anotar con valores para referencia rapida" },
  ]}
/>

<ConceptCard variant="warning">
Errores clasicos de visualizacion: ejes truncados que exageran diferencias, 3D innecesario que distorsiona, demasiados colores, graficos de torta para mas de 3 categorias, falta de etiquetas y titulos.
</ConceptCard>

</Section>

<Section number={4} title="Menos es mas: el dashboard efectivo" eyebrow="CONCEPTO">

<CalloutInfo>
**Reglas de oro del dashboard**:
- 3-5 visualizaciones maximo. Si necesitas mas, hace dos dashboards
- La visualizacion mas importante arriba a la izquierda (patron de lectura F)
- Cada grafico responde UNA pregunta
- Colores con significado: rojo = problema, verde = bien, azul = neutral
- Etiquetas claras: titulos que son conclusiones, no descripciones
</CalloutInfo>

<ReflectionCheck
  blockId="reflection-l10-dashboard"
  moduleSlug="estadistica"
  lessonSlug="lesson10_data_storytelling"
  prompt="Un dashboard tiene 12 graficos y ocupa 3 pantallas de scroll. Cual es el problema y como lo arreglarias?"
  answer="Nadie mira 12 graficos. La atencion es el recurso mas escaso. Solucion: (1) elegi los 3 KPIs que realmente importan, (2) ponelos en la primera pantalla sin scroll, (3) los otros 9 graficos movelos a una pagina secundaria. La regla: si el CEO no puede entender el dashboard en 10 segundos, fallaste."
/>

</Section>

<Section number={5} title="Comunicando a no-tecnicos" eyebrow="INTERACTIVA">

<InteractiveTable
  headers={["Decis esto...", "Mejor deci esto...", "Por que"]}
  rows={[
    ["El RMSE fue 3.4 con R2 de 0.72", "El modelo predice el precio con un error tipico de $3,400 y captura el 72% de la variacion", "Unidades y contexto humano"],
    ["Realizamos PCA con 3 componentes explicando 85% de varianza", "Redujimos 50 variables a 3 dimensiones principales sin perder casi informacion", "Analogia visual intuitiva"],
    ["El p-valor fue 0.03, rechazamos H0", "Hay solo 3% de probabilidad de que este resultado sea casualidad", "Traducir significancia estadistica a lenguaje comun"],
    ["K-Means con k=4, silhouette 0.65", "Encontramos 4 grupos naturales de clientes con comportamientos muy distintos", "Resultado accionable, no parametro tecnico"],
  ]}
  searchable={true}
  caption="Traduciendo estadistica a decisiones"
/>

</Section>

<Section number={6} title="Plotly: visualizaciones interactivas" eyebrow="INTERACTIVA">

```python
import plotly.express as px

penguins = px.data.penguins().dropna()

fig = px.scatter(penguins, x='flipper_length_mm', y='body_mass_g',
                 color='species', size='bill_length_mm',
                 hover_data=['island', 'sex'],
                 title='Pinguinos: Masa vs Longitud de Aleta')
fig.show()
```

<CalloutInfo>
Plotly genera graficos interactivos: zoom, hover con datos, seleccion. Son ideales para dashboards y reportes donde el usuario explora los datos. Mucho mas efectivo que imagenes estaticas.
</CalloutInfo>

</Section>

<Section number={7} title="Checkpoint final del modulo" eyebrow="EVALUACION">

<ReflectionCheck
  blockId="reflection-l10-storytelling"
  moduleSlug="estadistica"
  lessonSlug="lesson10_data_storytelling"
  prompt="Tu modelo de ML predice que pacientes responderan a un tratamiento con 85% de accuracy. El director medico te pregunta si deberian usarlo en el hospital. Que le decis?"
  answer="No le digas '85% accuracy'. Decile: 'De cada 100 pacientes, el modelo identifica correctamente a 85. Pero de los 15 que se equivoca, algunos son pacientes que SI responderian y el modelo dijo que no (pierden la oportunidad de tratarse). Otros son pacientes que NO responderian pero el modelo dijo que si (reciben un tratamiento inutil con efectos secundarios). Que error es mas grave para el hospital?' Esto convierte una metrica abstracta en un dilema medico real que el director puede evaluar."
/>

<AnswerReveal summary="Ver respuesta">
<p>Grafico de torta o de barras para mostrar participacion de mercado de 5 competidores? Barras, siempre. Las tortas son dificiles de comparar (el ojo humano es malo comparando angulos). Con barras ordenadas de mayor a menor, en 2 segundos entendes quien lidera y por cuanto.</p>
</AnswerReveal>

</Section>

<Section number={8} title="Terminos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Termino", "Definicion"]}
  rows={[
    ["Narracion de Datos", "Comunicar hallazgos con contexto, narrativa y visualizaciones"],
    ["Arco Narrativo", "Estructura: contexto, conflicto, resolucion"],
    ["Dashboard", "Panel de visualizaciones clave en una sola vista"],
    ["Plotly", "Libreria de graficos interactivos para Python"],
    ["KPI", "Key Performance Indicator: metrica que guia decisiones"],
    ["Audiencia", "A quien le hablas: adapta el lenguaje tecnico a su nivel"],
  ]}
  searchable={true}
  caption="Terminos clave de narracion de datos"
/>

</Section>

<Section number={9} title="Cerrando el modulo" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
Felicidades! Completaste el Modulo 3 de Estadistica y Probabilidad. De descriptive stats a data storytelling, construiste la base estadistica que todo cientifico de datos necesita. Ahora estas listo para Machine Learning.
</MascotMessage>

**Que aprendiste en este modulo:**
- Estadistica descriptiva: resumir datos con numeros
- Distribuciones: ver la forma de los datos
- Probabilidad: razonar bajo incertidumbre con Bayes
- Distribuciones estadisticas: Bernoulli, Binomial, Poisson, Normal
- Relaciones: Pearson, Spearman, correlacion vs causalidad
- EDA: el flujo de trabajo del cientifico de datos
- PCA: reducir dimensionalidad sin perder informacion
- Clustering: encontrar grupos naturales con K-Means
- Evaluacion: medir que tan bueno es tu modelo
- Storytelling: comunicar resultados para generar accion

En el **Modulo 4 (Machine Learning)** vas a aplicar todo esto para construir modelos predictivos reales.

</Section>
