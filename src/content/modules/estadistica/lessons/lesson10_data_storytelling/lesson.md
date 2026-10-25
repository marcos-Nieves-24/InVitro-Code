
Module: 3
Lesson Number: 10
Lesson Title: Narración de Datos
Estimated Duration: 60 minutos
Prerequisites: Lecciones 1 a 6
Learning Objectives:
  Estructurar una historia de datos con arco narrativo
  Aplicar mejores prácticas de visualización para una comunicación efectiva
  Diseñar dashboards informativos
  Comunicar hallazgos estadísticos a audiencias no técnicas
  Evitar errores comunes de visualización
Keywords: narración de datos, visualización, dashboard, comunicación, narrativa, periodismo de datos
Difficulty: Intermedio
Programming Concepts: matplotlib, plotly, seaborn, dashboards
Mathematical Concepts: Ninguno (orientado a la aplicación)
Machine Learning Concepts: comunicación de resultados, interpretación de modelos
Datasets Used: pingüinos, mpg, sintético
Notebook: 10_data_storytelling.ipynb
Assignment: data_storytelling_assignment.md
Quiz: data_storytelling_quiz.md


<Section number={1} title="El análisis que nadie lee" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Analicé todo: EDA, PCA, validación cruzada.",
    "Pero si no comunico los resultados, es como si no hubiera hecho nada.",
    "La narración de datos convierte el análisis en acción para quien decide.",
    "El mejor análisis del mundo no convence solo por existir.",
  ]}
/>

<MascotMessage mood="thinking">
Realizaste el EDA, corriste PCA, evaluaste tu modelo con validación cruzada... y ahora, ¿qué? Si no puedes comunicar tus resultados, es como si no hubieras hecho nada. La narración de datos convierte el análisis en acción.
</MascotMessage>

El mejor análisis del mundo resulta inútil si no convence a quien toma las decisiones. Un médico necesita entender por qué el modelo recomienda un tratamiento. Un director ejecutivo necesita ver el retorno sobre la inversión, no el error cuadrático medio. La narración de datos es el puente entre el análisis técnico y la decisión humana.

<ConceptCard variant="key idea">
Los datos, en sí mismos, no producen decisiones. Quien decide necesita contexto, comparación y una explicación de por qué el hallazgo importa. La narración de datos aporta ese contexto.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="El arco narrativo de los datos" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Toda historia de datos efectiva sigue un arco narrativo.",
    "Primero el contexto: por qué importa el análisis.",
    "Luego el conflicto: lo inesperado que muestran los datos.",
    "Y la resolución: la acción recomendada a partir de la evidencia.",
  ]}
/>

<ConceptCard variant="definition">
Toda historia de datos efectiva sigue una estructura:

1. **Contexto**: ¿Por qué importa este análisis? ¿Qué problema resolvemos?
2. **Conflicto**: ¿Qué muestran los datos que resulta inesperado o contrario a la intuición?
3. **Resolución**: ¿Qué acción recomendamos a partir de la evidencia?
</ConceptCard>

Ejemplo biotecnológico: "Este nuevo fármaco reduce tumores en el 60 % de los pacientes (contexto), pero descubrimos que solo es eficaz en pacientes con la mutación BRCA1 (conflicto o sorpresa). Se recomienda un test genético previo a la prescripción (resolución)."

</RevealSequence>

</Section>

<Section number={3} title="Visualizaciones qué comunican" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El gráfico debe responder una pregunta, no adornar una slide.",
    "Líneas para tendencias, barras para categorías, scatter para relaciones.",
    "Evitar tortas con más de tres categorías y ejes truncados.",
    "El ojo compara longitudes, no ángulos ni 3D.",
  ]}
/>

<ConceptCard variant="key idea">
Visualización por objetivo:
- **Tendencias**  gráfico de líneas (fácil de leer, tiempo en eje X)
- **Comparar categorías**  gráfico de barras (ordenar por valor, no alfabéticamente)
- **Mostrar distribución**  histograma o boxplot (mejor que tabla de frecuencias)
- **Relación entre variables**  scatter plot (agregar línea de tendencia si hay correlación)
- **Partes de un todo**  gráfico de barras apiladas (evitar gráficos de torta)
- **Matriz de correlación**  heatmap (anotar con valores para referencia rápida)
</ConceptCard>

<ConceptCard variant="warning">
Errores clásicos de visualización: ejes truncados que exageran las diferencias, uso innecesario de 3D que distorsiona las magnitudes, exceso de color, gráficos de torta para más de tres categorías y falta de etiquetas y títulos.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Menos es mas: el dashboard efectivo" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La atención es un recurso escaso: menos gráficos, más decisión.",
    "Entre 3 y 5 visualizaciones por vista, nunca más.",
    "Lo más importante arriba a la izquierda: el patrón de lectura F.",
    "Cada gráfico responde una sola pregunta y cada color tiene significado.",
  ]}
/>

<CalloutInfo>
**Reglas de oro del dashboard**:
- 3 a 5 visualizaciones máximo. Si necesitas mas, hace dos dashboards
- La visualizacion más importante arriba a la izquierda (patron de lectura F)
- Cada gráfico responde UNA pregunta
- Colores con significado: rojo = problema, verde = bien, azul = neutral
- Etiquetas claras: titulos qué son conclusiones, no descripciones
</CalloutInfo>

<ChoiceQuestion
  question="Un dashboard tiene 12 graficos y ocupa 3 pantallas de scroll. Cuál es el problema y cómo lo arreglarias?"
  moduleSlug="estadistica"
  lessonSlug="lesson10_data_storytelling"
  blockId="reflection l10 dashboard"
  allowContinueOnIncorrect
  explanation="La atención es escasa: elige los 3 KPIs clave para la primera pantalla sin scroll y mueve los otros 9 a una página secundaria; la prueba es que el CEO lo entienda en 10 segundos."
  options={[
    { id: "a", label: "Más gráficos aportan más información, así que 12 es mejor que 3", correct: false, feedback: "Nadie analiza 12 gráficos; la sobrecarga reduce la atención." },
    { id: "b", label: "Elegir los 3 KPIs clave en la primera pantalla sin scroll y mover los otros 9 a una página secundaria", correct: true, feedback: "¡Exacto! La jerarquía visual prioriza la decisión." },
    { id: "c", label: "El scroll de 3 pantallas es aceptable porque todos leen todos los gráficos", correct: false, feedback: "Si necesita scroll, la decisión clave no está a la vista." },
    { id: "d", label: "Los gráficos secundarios deben ocupar la primera pantalla y los KPIs ir abajo", correct: false, feedback: "La visualización principal debe estar arriba a la izquierda, no enterrada." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={5} title="Comunicando a audiencias no técnicas" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Los técnicos hablamos de RMSE y R²; los directivos, de dinero y pacientes.",
    "Traduce métricas a unidades humanas y decisiones concretas.",
    "Una analogía visual vale más que una definición estadística.",
    "Significancia estadística no es lo mismo que significancia práctica.",
  ]}
/>

<ConceptCard variant="key idea">
Traducir estadística a decisiones:
- **"El RMSE fue 3.4 con R² de 0.72"**  "El modelo predice el precio con un error típico de $3,400 y captura el 72 % de la variación" (unidades y contexto humano)
- **"Realizamos PCA con 3 componentes que explican el 85 % de la varianza"**  "Redujimos 50 variables a 3 dimensiones principales sin perder casi información" (analogía visual intuitiva)
- **"El p valor fue 0.03, rechazamos H₀"**  "Hay solo un 3 % de probabilidad de que este resultado sea casualidad" (traducir la significancia estadística a lenguaje común)
- **"K Means con k=4, silueta 0.65"**  "Encontramos 4 grupos naturales de clientes con comportamientos muy distintos" (resultado accionable, no parámetro técnico)
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="Plotly: visualizaciones interactivas" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Los gráficos estáticos son una foto; Plotly es una conversación.",
    "Zoom, tooltips y selección permiten explorar los datos por cuenta propia.",
    "Son ideales para dashboards y reportes con usuario activo.",
    "Permiten pasar de observar a entender en segundos.",
  ]}
/>

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
Plotly genera gráficos interactivos: zoom, tooltips con datos y selección. Son ideales para dashboards y reportes en los que el usuario explora los datos. Resultan mucho más efectivos que las imágenes estáticas.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={7} title="Checkpoint final del modulo" eyebrow="EVALUACION">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El checkpoint final mezcla métricas, comunicación y decisión clínica.",
    "Una métrica abstracta no comunica a quién se le niega tratamiento.",
    "Hay que traducir la exactitud en errores, tipos y consecuencias.",
    "Y siempre las barras ganan a las tortas para comparar grupos.",
  ]}
/>

<ChoiceQuestion
  question="Tu modelo de ML predice que el 85 % de los pacientes responde a un tratamiento. El director médico te pregunta si deben usarlo en el hospital. ¿Qué le respondes?"
  moduleSlug="estadistica"
  lessonSlug="lesson10_data_storytelling"
  blockId="reflection l10 storytelling"
  allowContinueOnIncorrect
  explanation="Del 85 % de aciertos, los 15 errores se dividen en falsos negativos (pacientes que perderían tratamiento) y falsos positivos (tratamiento sin beneficio + efectos secundarios); la respuesta debe convertir la métrica en un dilema clínico."
  options={[
    { id: "a", label: "Reportar solo el 85 % de exactitud y recomendar usarlo tal cual", correct: false, feedback: "Una métrica abstracta no comunica a quién se le niega o se le da tratamiento inútil." },
    { id: "b", label: "Traducir a 85 correctos y 15 errores, separando falsos negativos y falsos positivos para que el director compare su gravedad", correct: true, feedback: "¡Exacto! Ese dilema clínico es lo que un decisor necesita." },
    { id: "c", label: "Descartar el modelo porque no alcanza el 100 % de exactitud", correct: false, feedback: "Ningún modelo clínico es perfecto; la decisión depende del costo de cada error." },
    { id: "d", label: "Implementarlo automáticamente sin discutir los errores con el director", correct: false, feedback: "Desplegar sin evaluar los tipos de error puede dañar pacientes." },
  ]}
/>

<ChoiceQuestion
  question="Gráfico de torta o de barras para mostrar participación de mercado de 5 competidores?"
  moduleSlug="estadistica"
  lessonSlug="lesson10_data_storytelling"
  blockId="choice estadistica l10 rev 1"
  allowContinueOnIncorrect
  explanation="Barras, siempre: las tortas son difíciles de comparar (el ojo humano es malo comparando ángulos). Con barras ordenadas de mayor a menor, en 2 segundos entendés quién lidera y por cuánto."
  options={[
    { id: "a", label: "Barras ordenadas de mayor a menor: son más fáciles de comparar que una torta", correct: true, feedback: "¡Exacto! El ojo compara longitudes, no ángulos." },
    { id: "b", label: "Torta, porque muestra proporciones mejor que cualquier otro gráfico", correct: false, feedback: "Las tortas dificultan comparar ángulos; mejor barras." },
    { id: "c", label: "Torta si son 5 categorías o menos; barras sólo para más", correct: false, feedback: "La cantidad de categorías no cambia que las barras sean más legibles." },
    { id: "d", label: "Barras sólo si hay más de 10 competidores", correct: false, feedback: "Barras ayudan incluso con pocas categorías; no es un umbral rígido." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={8} title="Terminos clave" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Cerramos el bloque de términos esenciales para narrar datos.",
    "Narración, arco, dashboard, Plotly, KPI y audiencia.",
    "Cada concepto refuerza el puente entre análisis y decisión.",
    "Con esto el módulo de estadística queda completo.",
  ]}
/>

<ConceptCard variant="key idea">
Términos clave:
- **Narración de Datos**: Comunicar hallazgos con contexto, narrativa y visualizaciones
- **Arco Narrativo**: Estructura: contexto, conflicto, resolución
- **Dashboard**: Panel de visualizaciones clave en una sola vista
- **Plotly**: Librería de gráficos interactivos para Python
- **KPI**: Key Performance Indicator: métrica que guía decisiones
- **Audiencia**: A quién le hablas: adapta el lenguaje técnico a su nivel
</ConceptCard>

</RevealSequence>

</Section>

<Section number={9} title="Cerrando el modulo" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Felicitaciones: cerraste el Módulo 3 de Estadística y Probabilidad.",
    "De estadística descriptiva a narración, construiste la base que todo científico necesita.",
    "El siguiente módulo aplica todo esto para construir modelos predictivos reales.",
    "Comunicar lo que construiste es parte del trabajo, no un extra.",
  ]}
/>

<MascotMessage mood="celebrating">
Felicitaciones por completar el Módulo 3 de Estadística y Probabilidad. De estadística descriptiva a narración de datos, construiste la base estadística que todo científico de datos necesita. Ahora estás preparado para Machine Learning.
</MascotMessage>

**Qué aprendiste en este módulo:**
- Estadística descriptiva: resumir datos con números
- Distribuciones: ver la forma de los datos
- Probabilidad: razonar bajo incertidumbre con Bayes
- Distribuciones estadísticas: Bernoulli, Binomial, Poisson, Normal
- Relaciones: Pearson, Spearman, correlación vs. causalidad
- EDA: el flujo de trabajo del científico de datos
- PCA: reducir dimensionalidad sin perder información
- Clustering: encontrar grupos naturales con K Means
- Evaluación: medir qué tan bueno es el modelo
- Narración de datos: comunicar resultados para generar acción

En el **Módulo 4 (Machine Learning)** aplicarás todo esto para construir modelos predictivos reales.

</RevealSequence>

</Section>
