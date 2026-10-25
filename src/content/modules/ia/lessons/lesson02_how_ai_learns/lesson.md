Module: 1
Lesson Number: 2
Lesson Title: ¿Cómo aprende la IA?
Estimated Duration: 60 minutos
Prerequisites: Lección 1 — ¿Qué es la IA?
Learning Objectives:
  - Comprender el concepto de frontera de decisión en clasificación binaria
  - Explicar cómo funciona el algoritmo KNN (K-Nearest Neighbors)
  - Distinguir entre regresión y clasificación como problemas de aprendizaje
  - Reconocer el sobreajuste (overfitting) y por qué es problemático
Keywords: frontera de decisión, KNN, regresión lineal, clasificación, overfitting, perceptrón
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Concepto de distancia, promedios
Machine Learning Concepts: Clasificación binaria, regresión, KNN, perceptrón, overfitting, train/test
Datasets Used: module01_ai_cell_features.csv
---

<Section number={1} title="De reglas fijas a aprendizaje" eyebrow="INICIO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  typing={true}
  lines={[
    "¡Hola de nuevo en el laboratorio!",
    "En la lección anterior vimos que las reglas manuales tienen un límite infranqueable.",
    "La variabilidad biológica de las conidias desborda cualquier conjunto de reglas 'if/else'.",
    "Hoy vamos a descubrir cómo una máquina aprende directamente a partir de datos empíricos.",
    "Exploraremos tres algoritmos esenciales: Perceptrón, KNN y Regresión Lineal.",
    "Y conoceremos a nuestro mayor adversario en bioinformática: el sobreajuste.",
  ]}
/>

<div>
En lugar de que un investigador programe manualmente cada condición, en el **aprendizaje automático** (machine learning) le mostramos ejemplos a la máquina para que ella misma descubra los patrones subyacentes.
</div>

<ConceptCard variant="key-idea">
Aprender de los datos no es memorizar respuestas: es descubrir la estructura matemática que vincula las características medidas (features) con la realidad biológica.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="Aprendizaje supervisado" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "Todo comienza con ejemplos ya etiquetados por especialistas.",
    "A este paradigma lo denominamos 'aprendizaje supervisado'.",
    "Cada muestra viene acompañada de su diagnóstico comprobado.",
  ]}
/>

<div>
El flujo de trabajo supervisado sigue cuatro momentos clave:

1. **Ejemplos de entrenamiento etiquetados**: Conidias identificadas mediante cultivo microbiológico como *Aspergillus* o *Penicillium*.
2. **Features numéricas**: Propiedades cuantificables de cada espora (área, circularidad, rugosidad).
3. **Optimización del algoritmo**: El algoritmo busca las relaciones matemáticas entre las features y la etiqueta.
4. **Generalización**: El modelo aplica esos patrones aprendidos para clasificar muestras nuevas nunca antes analizadas.
</div>

<ConceptCard variant="definition">
**Modelo**: Es el resultado del proceso de aprendizaje. Una representación matemática (pesos, ecuaciones o geometrías) de las regularidades que el algoritmo encontró en los datos.
</ConceptCard>

<div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3 text-xs text-gray-700">
<strong>La analogía del estudiante de laboratorio:</strong>
<br />
• Los <strong>datos de entrenamiento</strong> son los protocolos y ejercicios resueltos de una guía práctica.
<br />
• El <strong>algoritmo</strong> es el estudiante procesando y deduciendo principios.
<br />
• El <strong>modelo</strong> es el conocimiento consolidado en su memoria.
<br />
• Las <strong>predicciones</strong> son los diagnósticos de nuevas muestras que el estudiante resuelve con ese conocimiento.
</div>

</RevealSequence>

</Section>

<Section number={3} title="Frontera de decisión y el Perceptrón" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  lines={[
    "Empecemos por el algoritmo de clasificación lineal más clásico: el perceptrón.",
    "Su meta es trazar una recta que divida limpiamente dos poblaciones en el plano de features.",
  ]}
/>

<ConceptCard variant="key-idea">
La **frontera de decisión** es la línea (o hiperplano) que separa diferentes clases en el espacio de características. De un lado predice una clase (ej. *Aspergillus* o benigno), del otro, la clase contraria (ej. *Penicillium* o maligno).
</ConceptCard>

<ChoiceQuestion
  question="¿Qué ajusta el perceptrón para trazar la frontera que separa dos clases?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-perceptron-1"
  allowContinueOnIncorrect
  explanation="La recta se define como w₁·x₁ + w₂·x₂ + b = 0. El perceptrón aprende corrigiendo w₁, w₂ y b solo cuando se equivoca."
  options={[
    { id: "a", label: "Dos pesos (w₁, w₂) y un sesgo (b) que definen la recta", correct: true, feedback: "¡Correcto! Esos tres números determinan la posición y orientación de la frontera." },
    { id: "b", label: "El número de datos de entrenamiento", correct: false, feedback: "El tamaño del dataset no se aprende, son los parámetros de la frontera los que se ajustan." },
    { id: "c", label: "Los colores que usa el gráfico para pintar cada clase", correct: false, feedback: "Los colores son visualización, el aprendizaje es matemático, no estético." },
    { id: "d", label: "La velocidad del procesador de la computadora", correct: false, feedback: "El hardware no forma parte de los parámetros del modelo." },
  ]}
/>

<div className="rounded-lg border border-teal-200 bg-teal-50/80 p-3 text-xs text-gray-700">
<strong>Próximo paso en el laboratorio interactivo:</strong> En la siguiente pantalla vas a controlar un perceptrón entrenando con biopsias reales de tejido mamario (Wisconsin Breast Cancer). Observa cómo ajusta sus pesos únicamente tras cometer un error.
</div>

</RevealSequence>

</Section>

<Section number={4} title="Laboratorio: Perceptrón en acción" eyebrow="ENTRENADOR">
<RevealSequence showHistory>
<div className="mb-2 text-xs text-gray-500">
<strong>Objetivo:</strong> Ajusta la tasa de aprendizaje con el slider y presiona <em>Entrenar</em> o <em>Paso</em> para observar cómo el perceptrón ajusta los pesos de la recta ante cada equivocación. Haz clic en el plano para predecir una muestra nueva.
</div>

<PerceptronTrainer />
</RevealSequence>
</Section>

<Section number={5} title="Límites de la frontera lineal" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<ConceptCard variant="key-idea">
El perceptrón aprende **corrigiendo sus errores**: solo actualiza sus pesos cuando clasifica mal una muestra, desplazando y rotando la frontera de decisión hacia la orientación correcta.
</ConceptCard>

<ChoiceQuestion
  question="¿Qué pasa si las clases no son separables linealmente y por qué el accuracy no llega al 100%?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-frontera-1"
  allowContinueOnIncorrect
  explanation="Si no hay separación lineal, la frontera debe ser curva. El accuracy no llega al 100% por solapamiento natural: conidias atípicas, ruido y variabilidad biológica."
  options={[
    { id: "a", label: "La frontera seguiría siendo recta y el accuracy llegaría al 100% ajustando bien", correct: false, feedback: "No: ninguna recta separa poblaciones que se mezclan." },
    { id: "b", label: "La frontera sería curva y ninguna recta separa perfectamente por solapamiento natural", correct: true, feedback: "¡Exacto! Necesitas modelos más flexibles cuando las clases se mezclan." },
    { id: "c", label: "Hay que eliminar todos los datos atípicos para que sea lineal", correct: false, feedback: "Eliminar atípicos esconde el problema, la variabilidad es real." },
    { id: "d", label: "El accuracy siempre llega al 100% si aumentas los datos", correct: false, feedback: "Más datos no eliminan el solapamiento inherente entre clases." },
  ]}
/>

<ConceptCard variant="warning">
No todos los problemas de la naturaleza se pueden segmentar con una línea recta. Cuando las poblaciones celulares se solapan en sus características, requerimos algoritmos no lineales capaces de trazar fronteras flexibles.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="KNN: clasificar por cercanía" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "¿Y si en vez de calcular una fórmula rígida simplemente consultamos a los vecinos más próximos?",
    "Ese es el principio de KNN (K-Nearest Neighbors).",
    "KNN no calcula coeficientes en una fase de entrenamiento: memoriza los datos y consulta el vecindario cuando llega un caso nuevo.",
  ]}
/>

<ConceptCard variant="definition">
**KNN (K-Nearest Neighbors)**: Al recibir una muestra desconocida, el algoritmo calcula la distancia a todos los puntos registrados, identifica los **k** vecinos más cercanos y le adjudica la clase mayoritaria entre ellos.
</ConceptCard>

<ChoiceQuestion
  question="Si k=1 usamos el vecino más cercano y si subimos a k=15, ¿qué crees que pasa con la frontera de KNN?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-knn-1"
  allowContinueOnIncorrect
  explanation="k grande suaviza la frontera y la hace menos sensible al ruido, pero puede ignorar patrones locales. Es un balance sesgo-varianza."
  options={[
    { id: "a", label: "La frontera se vuelve más suave y menos sensible al ruido", correct: true, feedback: "¡Exacto! k grande promedia más vecinos y diluye el efecto de datos atípicos." },
    { id: "b", label: "El accuracy de prueba siempre mejora, sin importar cuánto suba k", correct: false, feedback: "No: k demasiado grande pierde detalle local y puede empeorar." },
    { id: "c", label: "El modelo empieza a trazar una línea recta como el perceptrón", correct: false, feedback: "KNN no aprende rectas, su frontera siempre depende de la votación local." },
    { id: "d", label: "La frontera se vuelve más rugosa y sobreajustada", correct: false, feedback: "Al revés: la rugosidad es de k pequeño. k grande suaviza." },
  ]}
/>

<div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3 text-xs text-gray-700">
<strong>En el laboratorio interactivo:</strong> Vas a poder variar <em>k</em> desde 1 hasta 15 sobre 569 biopsias reales y hacer clic en cualquier sector del gráfico para clasificar una muestra hipotética.
</div>

</RevealSequence>

</Section>

<Section number={7} title="Laboratorio: KNN en acción" eyebrow="ENTRENADOR">
<RevealSequence showHistory>
<div className="mb-2 text-xs text-gray-500">
<strong>Objetivo:</strong> Modifica el valor de <em>k</em> con el slider y haz clic en el plano para posicionar un punto de prueba. Observa la votación de los vecinos más cercanos, la frontera sombreada y la curva de accuracy vs <em>k</em>.
</div>

<KnnTrainer />
</RevealSequence>
</Section>

<Section number={8} title="Clasificación vs regresión" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  lines={[
    "Hasta aquí hemos clasificado en categorías discretas: Aspergillus o Penicillium, benigno o maligno.",
    "Pero en biotecnología a menudo necesitamos predecir una cantidad continua.",
    "Por ejemplo: ¿qué halo de inhibición en milímetros generará una dosis de antifúngico?",
  ]}
/>

<ConceptCard variant="definition">
• **Clasificación**: Predice etiquetas discretas y cualitativas (ej. especie fúngica, estado infectado/sano).
<br />
• **Regresión**: Predice magnitudes numéricas continuas (ej. concentración molar, diámetro en mm, temperatura óptima).
</ConceptCard>

<ChoiceQuestion
  question="Clasificar un patógeno por similitud con aislamientos previos, ¿es clasificación o regresión? ¿Qué riesgo tiene k=1 con datos ruidosos?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-clasif-1"
  allowContinueOnIncorrect
  explanation="Es clasificación (categoría discreta). k=1 es muy sensible al ruido: un dato mal medido decide la clase. k grande diluye el ruido."
  options={[
    { id: "a", label: "Es clasificación, k=1 puede fallar por un vecino ruidoso, k=20 diluye el ruido", correct: true, feedback: "¡Correcto! k controla el balance entre detalle local y robustez al ruido." },
    { id: "b", label: "Es regresión, k no importa porque KNN siempre es regresión", correct: false, feedback: "Regresión predice números continuos, acá predecimos especie (categoría) → clasificación." },
    { id: "c", label: "Es clasificación, k=1 siempre es más preciso que k=20", correct: false, feedback: "No siempre: k=1 sobreajusta. k grande generaliza mejor aunque pierda algo de detalle." },
    { id: "d", label: "Son lo mismo, clasificación y regresión son sinónimos", correct: false, feedback: "No: clasificación = categorías discretas, regresión = valores continuos." },
  ]}
/>

<ChoiceQuestion
  question="Si solo conocemos el radio medio de una biopsia, ¿podemos predecir con precisión la textura media?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-regresion-1"
  allowContinueOnIncorrect
  explanation="No con gran precisión: R²≈0,10. La textura depende de muchos factores más, la recta es la mejor aproximación lineal, pero siempre tiene dispersión."
  options={[
    { id: "a", label: "Sí, con precisión casi perfecta porque la relación es fuerte", correct: false, feedback: "No: es una relación débil, los puntos están muy dispersos alrededor de la recta." },
    { id: "b", label: "No, la relación es débil (R²≈0,10), la textura depende de más factores que el radio", correct: true, feedback: "¡Exacto! Datos reales son ruidosos, la regresión da la mejor recta, no una predicción perfecta." },
    { id: "c", label: "Sí, moviendo los sliders de pendiente se logra R²=1", correct: false, feedback: "Ninguna recta puede pasar por todos los puntos con datos ruidosos reales." },
    { id: "d", label: "No, porque regresión solo funciona con clasificación", correct: false, feedback: "Regresión predice valores continuos como la textura, es diferente a clasificar." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={9} title="Laboratorio: Regresión lineal" eyebrow="ENTRENADOR">
<RevealSequence showHistory>
<div className="mb-2 text-xs text-gray-500">
<strong>Objetivo:</strong> Ajusta la pendiente y el intercepto con los sliders para minimizar la distancia a los 569 puntos reales del dataset de biopsias. Pulsa <em>Calcular mejor recta</em> para obtener la solución por mínimos cuadrados.
</div>

<RegressionTrainer />
</RevealSequence>
</Section>

<Section number={10} title="Mínimos cuadrados y dispersión biológica" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<ConceptCard variant="key-idea">
La regresión lineal encuentra la relación óptima entre una variable independiente (radio medio) y una dependiente (textura media). La mejor recta minimiza el **Error Cuadrático Medio (ECM)** mediante el método de **mínimos cuadrados**.
</ConceptCard>

<ChoiceQuestion
  question="¿Por qué elevamos al cuadrado los errores (ECM) y por qué el R² radio→textura es tan bajo (≈0,10)?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-ecm-1"
  allowContinueOnIncorrect
  explanation="Cuadrar penaliza errores grandes y evita cancelación. R² bajo porque la textura depende de muchos factores, no solo del radio: datos reales son ruidosos."
  options={[
    { id: "a", label: "Para que el gráfico se vea más bonito", correct: false, feedback: "No es estética: es matemática para evitar cancelación y penalizar errores grandes." },
    { id: "b", label: "Cuadrar evita cancelación y penaliza errores grandes, R² bajo porque faltan factores", correct: true, feedback: "¡Exacto! La regresión da la mejor recta, pero no explica toda la variabilidad." },
    { id: "c", label: "Porque sin cuadrado el ECM siempre es cero", correct: false, feedback: "Sin cuadrado puede cancelarse, pero no es cero, es engañoso." },
    { id: "d", label: "R² bajo significa que el modelo está mal programado", correct: false, feedback: "R² bajo refleja complejidad biológica, no un bug." },
  ]}
/>

<div>
En biología experimental, un coeficiente $R^2$ modesto no implica un fallo del modelo: refleja que los sistemas biológicos son intrínsecamente multifactoriales y poseen dispersión natural.
</div>

</RevealSequence>

</Section>

<Section number={11} title="El peligro del sobreajuste (overfitting)" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "Si un estudiante memoriza de memoria las preguntas exactas de un examen modelo, obtendrá un 100.",
    "Pero si en la prueba real cambiamos levemente los valores, reprobará estrepitosamente.",
    "En machine learning a este error crítico lo llamamos sobreajuste o overfitting.",
  ]}
/>

<ChoiceQuestion
  question="Un modelo con error cero en entrenamiento, ¿generalizará bien a datos nuevos?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-overfitting-1"
  allowContinueOnIncorrect
  explanation="Error cero en entrenamiento suele indicar que el modelo memorizó ruido, no el patrón general. Falla con datos nuevos."
  options={[
    { id: "a", label: "Sí, error cero garantiza rendimiento perfecto en datos nuevos", correct: false, feedback: "No: el modelo probablemente memorizó el ruido de entrenamiento y fallará en datos nuevos." },
    { id: "b", label: "No, es señal de sobreajuste: memorizó los datos y no generaliza", correct: true, feedback: "¡Correcto! Como un estudiante que memoriza el examen anterior sin entender los conceptos." },
    { id: "c", label: "Solo si el dataset es muy grande", correct: false, feedback: "Incluso con dataset grande, memorizar es sobreajuste, lo clave es generalizar, no recordar." },
    { id: "d", label: "Sí, porque entreno y prueba son siempre idénticos", correct: false, feedback: "Entreno y prueba son distintas muestras de la población, lo importante es rendir en datos no vistos." },
  ]}
/>

<ConceptCard variant="warning">
El objetivo del aprendizaje automático no es conseguir un error nulo memorizando los datos ya observados, sino maximizar la exactitud ante datos **nuevos y no vistos**.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={12} title="Laboratorio: Grados de ajuste polinomial" eyebrow="INTERACTIVA">
<RevealSequence showHistory>
<div className="mb-2 text-xs text-gray-500">
<strong>Explora:</strong> Arrastra el grado del polinomio y observa la brecha creciente entre el error en los datos de entrenamiento (azul) y el error en las muestras de validación (rojo).
</div>

<Overfitting caption="Ajuste polinomial: arrastra el grado y mira cómo el error de validación se separa del de entrenamiento" />
</RevealSequence>
</Section>

<Section number={13} title="Tres regímenes de complejidad" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-gray-800">
<strong>1. Subajuste (Underfitting, Grados 1–2):</strong>
El modelo es excesivamente rígido e incapaz de capturar la curva biológica. Tanto el error de entrenamiento como el de prueba son elevados.
</div>

<div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-gray-800">
<strong>2. Punto óptimo (Grados 3–6):</strong>
El modelo modela la tendencia estructural general sin copiar las perturbaciones aleatorias. Ambos errores se mantienen bajos y parejos.
</div>

<div className="rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-xs text-gray-800">
<strong>3. Sobreajuste (Overfitting, Grados 8–15):</strong>
El polinomio se retuerce para tocar cada punto azul de entrenamiento ($ECM \approx 0$), pero al evaluar datos nuevos de prueba, el error se dispara a valores desastrosos.
</div>

<ConceptCard variant="key-idea">
El equilibrio entre sesgo y varianza es el principio rector del machine learning: ni modelos ciegos a la señal, ni modelos esclavizados por el ruido.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={14} title="Analogía de laboratorio y defensas" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<ConceptCard variant="warning">
Un modelo sobreajustado es idéntico a un protocolo de PCR que solo amplifica en tu termociclador personal, con tus reactivos y tu pipeta: memorizó las particularidades de tu mesada y colapsa cuando otro laboratorio intenta replicarlo.
</ConceptCard>

<ChoiceQuestion
  question="Un modelo con 99% en entreno y 60% en test — ¿qué es y cuál preferirías para diagnosticar una infección?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-overfitting-final-1"
  allowContinueOnIncorrect
  explanation="Es sobreajuste. Soluciones: simplificar, más datos, regularización. Para diagnóstico, preferir el simple consistente (80%) que generaliza, el sobreajustado arriesga falsos negativos."
  options={[
    { id: "a", label: "Es subajuste, prefiero el complejo con 99% en train", correct: false, feedback: "No: 99% train / 60% test es sobreajuste clásico, no subajuste." },
    { id: "b", label: "Es sobreajuste, prefiero el simple 80% consistente que generaliza mejor", correct: true, feedback: "¡Correcto! Consistencia y generalización valen más que memorizar." },
    { id: "c", label: "Es sobreajuste pero no se puede mejorar", correct: false, feedback: "Sí se puede: simplificar, más datos o regularización." },
    { id: "d", label: "Ambos modelos son equivalentes, da igual cuál usar", correct: false, feedback: "No: el que generaliza es más seguro en clínica." },
  ]}
/>

<div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3 text-xs text-gray-700">
<strong>Tres salvaguardas metodológicas en bioinformática:</strong>
<br />
1. <strong>División Train/Test:</strong> Separar rigurosamente los datos antes de entrenar, nunca evaluar con el material de estudio.
<br />
2. <strong>Validación cruzada (Cross-validation):</strong> Iterar múltiples particiones para asegurar estabilidad frente a distintas réplicas biológicas.
<br />
3. <strong>Principio de parsimonia:</strong> Entre dos modelos con similar rendimiento, preferir siempre el más simple.
</div>

</RevealSequence>

</Section>

<Section number={15} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

<RevealSequence blockOnQuiz>

<div>Cinco preguntas para consolidar los fundamentos de aprendizaje de la IA. Responde correctamente cada una para avanzar.</div>

<ChoiceQuestion
  question="¿Qué es una frontera de decisión?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-1"
  explanation="En 2D es una línea, en 3D un plano, en más dimensiones, un hiperplano que separa clases."
  options={[
    { id: "a", label: "El límite ético de lo que la IA puede decidir", correct: false, feedback: "Esa es una frontera ética, no la técnica de ML." },
    { id: "b", label: "La línea (o superficie) que separa diferentes clases en el espacio de features", correct: true, feedback: "¡Exacto! Del lado azul predice una clase, del otro la otra." },
    { id: "c", label: "El momento en que el algoritmo deja de aprender", correct: false, feedback: "El aprendizaje termina por criterio de convergencia, no es la frontera." },
    { id: "d", label: "La máxima precisión que puede alcanzar un modelo", correct: false, feedback: "La precisión es una métrica, la frontera es el límite geométrico entre clases." },
  ]}
/>

<ChoiceQuestion
  question="En KNN, ¿qué significa que k sea muy grande (ej. k=20)?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-2"
  explanation="k grande reduce varianza y ruido, pero puede perder patrones locales, es un hiperparámetro a elegir."
  options={[
    { id: "a", label: "El modelo clasifica más rápido siempre", correct: false, feedback: "k grande implica más vecinos a consultar, no es más rápido." },
    { id: "b", label: "La frontera se vuelve más suave, pero puede perder patrones locales", correct: true, feedback: "¡Correcto! k controla el balance suavidad vs detalle." },
    { id: "c", label: "El modelo necesita más memoria para entrenar", correct: false, feedback: "KNN almacena los mismos datos sin importar k, k solo afecta la votación." },
    { id: "d", label: "El accuracy siempre mejora al aumentar k", correct: false, feedback: "No: existe un k óptimo. k demasiado grande subajusta." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la diferencia entre clasificación y regresión?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-3"
  explanation="Clasificación predice categorías discretas, regresión predice valores continuos."
  options={[
    { id: "a", label: "Clasificación es siempre más precisa que regresión", correct: false, feedback: "Precisión depende del problema y los datos, no del tipo de tarea." },
    { id: "b", label: "Clasificación predice categorías discretas, regresión predice valores continuos", correct: true, feedback: "¡Exacto! Aspergillus/Penicillium es clasificación, predecir concentración es regresión." },
    { id: "c", label: "No hay diferencia, son sinónimos", correct: false, feedback: "Son familias distintas de problemas con métricas diferentes." },
    { id: "d", label: "Regresión solo funciona con datos biológicos", correct: false, feedback: "Regresión es general, funciona en cualquier dominio con variable continua." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué diferencia al subajuste (underfitting) del sobreajuste (overfitting)?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-4"
  explanation="Subajuste: modelo demasiado simple (ambos errores altos). Sobreajuste: demasiado complejo (train bajo, test alto)."
  options={[
    { id: "a", label: "En subajuste ambos errores son altos, en sobreajuste train bajo pero test alto", correct: true, feedback: "¡Perfecto! Son los dos extremos del espectro de complejidad." },
    { id: "b", label: "En subajuste train bajo, en sobreajuste ambos altos", correct: false, feedback: "Al revés: subajuste alto en ambos, sobreajuste bajo en train y alto en test." },
    { id: "c", label: "Son lo mismo visto desde distintos ángulos", correct: false, feedback: "No: son diagnósticos opuestos con soluciones diferentes." },
    { id: "d", label: "El subajuste solo ocurre con KNN, el sobreajuste solo con regresión", correct: false, feedback: "Ambos pueden ocurrir en cualquier algoritmo." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué el overfitting es problemático?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-5"
  explanation="El modelo memoriza variaciones y ruido de entreno y falla en datos nuevos, la validación en test es la defensa."
  options={[
    { id: "a", label: "Porque el modelo tarda mucho en entrenar", correct: false, feedback: "El tiempo de entreno puede ser alto, pero el problema esencial es la mala generalización." },
    { id: "b", label: "Porque funciona bien en entreno pero mal en datos nuevos", correct: true, feedback: "¡Correcto! Ese es el problema más común en ML." },
    { id: "c", label: "Porque usa demasiada memoria RAM", correct: false, feedback: "El consumo de memoria no define el sobreajuste." },
    { id: "d", label: "Porque solo ocurre con redes neuronales", correct: false, feedback: "Puede ocurrir en cualquier modelo demasiado complejo, no solo redes." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={16} title="Para la próxima lección" eyebrow="CIERRE">
<RevealSequence showHistory>
<MascotMessage mood="celebrating">
¡Tres algoritmos dominados, el dilema del sobreajuste clarificado y las salvaguardas metodológicas listas! Ya entiendes los engranajes del aprendizaje automático.
</MascotMessage>

En la Lección 3 trasladaremos estos principios a aplicaciones biotecnológicas de vanguardia: cómo **AlphaFold** revolucionó la predicción estructural de proteínas en 3D a partir del PDB, cómo interpretar matrices de confusión en diagnóstico y cómo se estructura un pipeline de machine learning completo en un laboratorio real.
</RevealSequence>
</Section>