
Module: 1
Lesson Number: 3
Lesson Title: IA en Biotecnología
Estimated Duration: 60 minutos
Prerequisites: Lección 2   ¿Cómo aprende la IA?
Learning Objectives:
  Reconocer las etapas de un pipeline de machine learning en biotecnología
  Entender cómo AlphaFold predice estructuras de proteínas
  Experimentar con visualización 3D de moléculas
  Identificar fuentes y limitaciones de datos biológicos (PDB)
Keywords: pipeline ML, AlphaFold, PDB, proteínas, estructura terciaria, RMSD, folding
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Espacio tridimensional, distancias
Machine Learning Concepts: Pipeline ML, datos de entrenamiento, embeddings, PDB como dataset, RMSD como métrica de error
Datasets Used: PDB (Protein Data Bank), AF2, "module01_predict_effect.parquet"


<Section number={1} title="De la teoría a la práctica" eyebrow="INICIO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  typing={true}
  lines={[
    "¡Te damos la bienvenida a la mesa de trabajo de biotecnología computacional!",
    "En la lección anterior exploramos la teoría: fronteras de decisión, KNN, regresión y el fantasma del sobreajuste.",
    "Ahora vamos a aplicar estas herramientas a problemas biológicos reales y de frontera.",
    "Analizaremos cómo AlphaFold resolvió el enigma del plegamiento de proteínas.",
    "Aprenderemos a navegar estructuras tridimensionales del Protein Data Bank (PDB).",
    "Y construiremos un pipeline completo de machine learning para el diagnóstico fúngico.",
  ]}
/>

<div>
La biotecnología moderna genera cantidades astronómicas de datos: secuencias masivas de ADN, micrografías electrónicas de alta resolución y mapas conformacionales. El aprendizaje automático es el microscopio digital que nos permite descifrar patrones que escapan a la vista humana.
</div>

<ConceptCard variant="key idea">
En biotecnología computacional, la computación no reemplaza al ensayo de laboratorio: convierte meses de ensayo y error empírico en predicciones enfocadas y verificables.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="Proteínas en 3D: La forma determina la función" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "Una proteína no es solo una cadena alfabética de aminoácidos.",
    "Para cumplir su función enzimática, estructural o de señalización, la cadena debe plegarse en el espacio 3D.",
    "Su arquitectura tridimensional exacta determina qué bolsillos activos interactúan con otras moléculas.",
  ]}
/>

<ConceptCard variant="definition">
La **estructura terciaria** de una proteína es su conformación espacial final, estabilizada por puentes disulfuro, interacciones electrostáticas y enlaces de hidrógeno. Esta geometría tridimensional define su función catalítica y sus blancos farmacológicos.
</ConceptCard>

<div>
Tradicionalmente, resolver la estructura 3D exigía meses o años de cristalografía de rayos X o criomicroscopía electrónica. El **Protein Data Bank (PDB)** es el archivo global que custodia estas estructuras validadas experimentalmente.
</div>

<ConceptCard variant="warning">
El cuello de botella experimental: Mientras que secuenciar ADN o aminoácidos es hoy rápido y económico, resolver una sola estructura experimentalmente puede costar decenas de miles de dólares. De cientos de millones de proteínas conocidas, solo ~200.000 poseen estructura resuelta en el PDB.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="Laboratorio: Exploración molecular 3D" eyebrow="INTERACTIVA">
<RevealSequence showHistory>
<div className="mb 2 text xs text gray 500">
<strong>Explora:</strong> Rota la molécula arrastrando con el cursor. Alterna entre vistas de cintas (ribbon) y esferas para reconocer hélices alfa, láminas beta y loops desordenados.
</div>

<InteractiveFrame src="/interactives/demo_07_protein_3d.html" height="480px" caption="Visualización interactiva de coordenadas reales del Protein Data Bank (PDB)" />
</RevealSequence>
</Section>

<Section number={4} title="De coordenadas 3D a regresión espacial" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<ChoiceQuestion
  question="Al rotar la proteína en 3D, ¿cómo distingues hélices alfa de regiones desordenadas (loops)?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 visualizador 1"
  allowContinueOnIncorrect
  explanation="Las hélices alfa se ven como tirabuzones, las láminas beta como flechas planas y los loops como fideos sin estructura fija."
  options={[
    { id: "a", label: "Las hélices alfa se ven como tirabuzones, los loops como fideos desordenados", correct: true, feedback: "¡Exacto! La forma 3D refleja la función." },
    { id: "b", label: "No hay diferencia visible, todo se ve igual al rotar", correct: false, feedback: "Sí hay diferencias: hélices y láminas tienen patrones visuales distintivos." },
    { id: "c", label: "Las hélices alfa son las regiones que no aparecen en la visualización", correct: false, feedback: "Las hélices sí se visualizan, como cintas en tirabuzón." },
    { id: "d", label: "Los loops son siempre hélices perfectas", correct: false, feedback: "Al revés: los loops son las zonas sin estructura regular." },
  ]}
/>

<ConceptCard variant="key idea">
Cada átomo en el visualizador posee coordenadas continuas $(x, y, z)$ en ángstroms ($10^{-10}\text{ m}$). Para un sistema de inteligencia artificial, predecir la posición tridimensional de miles de átomos interconectados es un monumental problema de **regresión continua**.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={5} title="AlphaFold: El hito de los 50 años" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  lines={[
    "Durante 50 años, deducir la estructura 3D a partir exclusivamente de la secuencia lineal de aminoácidos fue considerado casi imposible.",
    "En 2020 y 2021, AlphaFold 2 (DeepMind) resolvió este reto histórico.",
  ]}
/>

<ChoiceQuestion
  question="AlphaFold predice la posición (x, y, z) de cada átomo. ¿Es clasificación o regresión y cómo se mide el error?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 alphafold desafio 1"
  allowContinueOnIncorrect
  explanation="Es regresión: coordenadas continuas. El error se mide con RMSD, que es el ECM en 3D: distancia promedio entre átomos equivalentes."
  options={[
    { id: "a", label: "Clasificación, se mide con accuracy", correct: false, feedback: "No: clasificar sería elegir una categoría. Acá predecimos números continuos." },
    { id: "b", label: "Regresión, se mide con RMSD (ECM en 3D) entre átomos equivalentes", correct: true, feedback: "¡Correcto! RMSD < 1Å es excelente, >3Å es poco confiable." },
    { id: "c", label: "Clasificación, se mide con RMSD como si fuera clasificación", correct: false, feedback: "RMSD es métrica de regresión, no de clasificación." },
    { id: "d", label: "Regresión, se mide contando cuántos aminoácidos coinciden", correct: false, feedback: "Coincidencia binaria sería clasificación, acá importan las coordenadas exactas." },
  ]}
/>

<ConceptCard variant="definition">
El **RMSD (Root Mean Square Deviation)** mide la distancia cuadrática media entre los átomos de la estructura predicha y los de la estructura experimental de referencia. Un RMSD inferior a $1\text{ Å}$ denota precisión a nivel atómico.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="AlphaFold: La arquitectura por dentro" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "AlphaFold no simula las fuerzas físicas newtonianas átomo por átomo, eso tomaría siglos de supercómputo.",
    "En su lugar, reformuló el plegamiento como un problema de aprendizaje estadístico profundo sobre 170.000 estructuras del PDB.",
  ]}
/>

<div className="grid gap 2.5 sm:grid cols 2 my 2 text xs">
  <div className="rounded lg border border blue 200 bg blue 50/70 p 3">
    <strong className="text blue 900 block mb 1">1. Embedding de secuencia</strong>
    Convierte las letras de los 20 aminoácidos estándar en vectores multidimensionales densos que capturan propiedades físico químicas.
  </div>
  <div className="rounded lg border border teal 200 bg teal 50/70 p 3">
    <strong className="text teal 900 block mb 1">2. Perfiles evolutivos (MSA)</strong>
    Compara miles de secuencias homólogas en distintas especies. Las mutaciones correlacionadas revelan qué aminoácidos deben tocarse en 3D para mantener la estabilidad.
  </div>
  <div className="rounded lg border border indigo 200 bg indigo 50/70 p 3">
    <strong className="text indigo 900 block mb 1">3. Atención espacial (Transformers)</strong>
    Calcula simultáneamente las interacciones espaciales entre pares de residuos, reconociendo que el aminoácido #5 y el #180 pueden estar en contacto directo al plegarse.
  </div>
  <div className="rounded lg border border emerald 200 bg emerald 50/70 p 3">
    <strong className="text emerald 900 block mb 1">4. Refinamiento iterativo</strong>
    Proyecta las rotaciones del esqueleto polipeptídico y ajusta ángulos diédricos en múltiples ciclos hasta minimizar las tensiones estéricas.
  </div>
</div>

<ConceptCard variant="key idea">
La gran innovación fue tratar el plegamiento como **reconocimiento de patrones evolutivos y geométricos**, logrando en segundos lo que la física clásica no podía simular en años.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={7} title="AlphaFold: Impacto y limitaciones" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<ChoiceQuestion
  question="AlphaFold predijo 200 millones de estructuras. ¿Qué aplicaciones desbloquea y cuál es su limitación principal?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 alphafold 1"
  allowContinueOnIncorrect
  explanation="Desbloquea docking, ingeniería de enzimas y estudio de malplegamiento. Limitación: predice la conformación más probable, pero las proteínas son dinámicas y no modela bien interacciones ni estados transitorios."
  options={[
    { id: "a", label: "Solo sirve para contar proteínas, sin aplicaciones reales", correct: false, feedback: "No: habilita diseño de fármacos, ingeniería de enzimas y estudio de enfermedades." },
    { id: "b", label: "Permite docking e ingeniería de enzimas, pero falla en dinámicas e interacciones", correct: true, feedback: "¡Exacto! Es una foto estática de la conformación más probable, no la dinámica completa." },
    { id: "c", label: "Reemplaza por completo los experimentos de laboratorio", correct: false, feedback: "No reemplaza validación experimental, la hace más enfocada." },
    { id: "d", label: "Solo funciona si la proteína ya tiene estructura en el PDB", correct: false, feedback: "Justamente predice las que no tienen estructura experimental resuelta." },
  ]}
/>

<ConceptCard variant="warning">
Las proteínas no son monumentos de piedra: oscilan, respiran conformacionalmente y adoptan estados alostéricos al interactuar con fármacos o sustratos. Una predicción estática es un mapa valiosísimo, pero no sustituye la cinética biológica real.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={8} title="Pipeline de ML en biotecnología" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  lines={[
    "Modelar proteínas o clasificar esporas fúngicas exige mucho más que elegir un algoritmo.",
    "Exige un pipeline de extremo a extremo: desde la preparación de la muestra biológica hasta la monitorización del modelo en clínica.",
  ]}
/>

<ConceptCard variant="definition">
Un **pipeline de machine learning** es la cadena secuencial estandarizada que transforma datos biológicos crudos en predicciones operativas: recolección, limpieza, extracción de features, entrenamiento, evaluación y despliegue.
</ConceptCard>

<PipelineStages caption="El token recorre las seis etapas en orden: cada una transforma la salida de la anterior" />

</RevealSequence>

</Section>

<Section number={9} title="Laboratorio: Simulación de pipeline" eyebrow="INTERACTIVA">
<RevealSequence showHistory>
<div className="mb 2 text xs text gray 500">
<strong>Explora:</strong> Modifica los parámetros de entrada y observa cómo las decisiones de calibración y preprocesamiento repercuten en el rendimiento final del modelo.
</div>

<InteractiveFrame src="/interactives/demo_10_pipeline.html" height="480px" caption="Simulación educativa: etapas de un pipeline de bioinformática" />
</RevealSequence>
</Section>

<Section number={10} title="Calibración y prevención de contaminación" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<ChoiceQuestion
  question="En un pipeline de conidias, ¿qué etapa consume más tiempo y cuál genera más errores silenciosos?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 pipeline 1"
  allowContinueOnIncorrect
  explanation="Limpieza consume >60% del tiempo. Feature engineering genera errores silenciosos: si el microscopio está mal calibrado, el modelo aprende el artefacto y falla al transferirse."
  options={[
    { id: "a", label: "Entrenamiento y despliegue son las etapas más largas y con más errores silenciosos", correct: false, feedback: "No: entrenar es rápido comparado con conseguir y limpiar datos." },
    { id: "b", label: "Limpieza consume más tiempo, feature engineering genera errores silenciosos de calibración", correct: true, feedback: "¡Exacto! Un error sistemático de calibración contamina todo el modelo." },
    { id: "c", label: "La elección del algoritmo es lo más costoso", correct: false, feedback: "Elegir algoritmo es rápido, lo caro es tener datos limpios y bien definidos." },
    { id: "d", label: "Ninguna etapa tiene errores silenciosos", correct: false, feedback: "Sí existen: errores que parecen correctos localmente pero arruinan la generalización." },
  ]}
/>

<ChoiceQuestion
  question="Con datos de 3 laboratorios con distintos microscopios, ¿dónde entrenas y pruebas para evitar sobreajuste al equipamiento?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 pipeline real 1"
  allowContinueOnIncorrect
  explanation="Entrenar con 2 laboratorios y probar en el 3° (validación cruzada por laboratorio). Mezclar todo hace que el modelo aprenda el microscopio en lugar de la conidia."
  options={[
    { id: "a", label: "Mezclar todo al azar y dividir 80/20 sin importar el laboratorio", correct: false, feedback: "Eso filtra ruido de laboratorio al entreno y da un optimismo falso." },
    { id: "b", label: "Entrenar con 2 labs y probar en el 3° para validar generalización real", correct: true, feedback: "¡Correcto! Separar por experimento evita contaminación." },
    { id: "c", label: "Entrenar y probar solo con el mejor microscopio", correct: false, feedback: "No generaliza a otros equipos y esconde la variabilidad real." },
    { id: "d", label: "No importa la separación, cualquier split funciona igual", correct: false, feedback: "La estrategia de split cambia drásticamente la evaluación." },
  ]}
/>

<ConceptCard variant="warning">
El error más común en bioinformática es el **data leakage** (fuga de datos): si mezclas aleatoriamente micrografías del mismo cultivo en entrenamiento y prueba, el modelo reconocerá la óptica del microscopio en lugar de la morfología del patógeno.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={11} title="Matriz de confusión: Anatomía de los 4 cuadrantes" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "Imagina que tu modelo anuncia con orgullo un 85% de exactitud (accuracy).",
    "En un laboratorio de diagnóstico, ese número global no dice nada: no sabemos qué clase de errores cometió.",
    "¿Generó falsas alarmas tolerables? ¿O dejó escapar a pacientes con infecciones fúngicas invasivas?",
    "La matriz de confusión desagrega con total transparencia los aciertos y las fallas.",
  ]}
/>

<div>
Evaluamos <strong>100 conidias</strong> analizadas por el clasificador, donde la etiqueta positiva es *Aspergillus* (patógeno de alto riesgo clínico) y la negativa es *Penicillium*:
</div>

<div className="my 3 grid grid cols 2 gap 3 max w xl mx auto">
  <div className="rounded xl border 2 border emerald 500/50 bg emerald 50/90 p 3.5 shadow xs">
    <div className="flex items center justify between mb 1">
      <span className="font mono text xs font bold text emerald 800 uppercase tracking wider">Verdadero Positivo (TP)</span>
      <span className="text 2xl font extrabold text emerald 700">35</span>
    </div>
    <div className="text xs text emerald 950 font medium leading relaxed">
      Real: <em>Aspergillus</em> | Predicción: <em>Aspergillus</em>
    </div>
    <span className="inline block mt 1 text-[11px] text emerald 700 font semibold">Diagnóstico certero del patógeno</span>
  </div>

  <div className="rounded xl border 2 border rose 500/60 bg rose 50/90 p 3.5 shadow xs">
    <div className="flex items center justify between mb 1">
      <span className="font mono text xs font bold text rose 800 uppercase tracking wider">Falso Negativo (FN)</span>
      <span className="text 2xl font extrabold text rose 700">10</span>
    </div>
    <div className="text xs text rose 950 font medium leading relaxed">
      Real: <em>Aspergillus</em> | Predicción: <em>Penicillium</em>
    </div>
    <span className="inline block mt 1 text-[11px] text rose 700 font bold">Peligro clínico: paciente infectado no tratado</span>
  </div>

  <div className="rounded xl border 2 border amber 500/50 bg amber 50/90 p 3.5 shadow xs">
    <div className="flex items center justify between mb 1">
      <span className="font mono text xs font bold text amber 800 uppercase tracking wider">Falso Positivo (FP)</span>
      <span className="text 2xl font extrabold text amber 700">5</span>
    </div>
    <div className="text xs text amber 950 font medium leading relaxed">
      Real: <em>Penicillium</em> | Predicción: <em>Aspergillus</em>
    </div>
    <span className="inline block mt 1 text-[11px] text amber 700 font semibold">Falsa alarma: medicación preventiva innecesaria</span>
  </div>

  <div className="rounded xl border 2 border blue 500/40 bg blue 50/90 p 3.5 shadow xs">
    <div className="flex items center justify between mb 1">
      <span className="font mono text xs font bold text blue 800 uppercase tracking wider">Verdadero Negativo (TN)</span>
      <span className="text 2xl font extrabold text blue 700">50</span>
    </div>
    <div className="text xs text blue 950 font medium leading relaxed">
      Real: <em>Penicillium</em> | Predicción: <em>Penicillium</em>
    </div>
    <span className="inline block mt 1 text-[11px] text blue 700 font semibold">Descarte correcto de patogenicidad</span>
  </div>
</div>

<ConceptCard variant="key idea">
Total aciertos: $35 + 50 = 85$ conidias correctas de 100 ($85\%$ accuracy). Sin embargo, los **10 falsos negativos** representan un riesgo clínico inaceptable en pacientes inmunodeprimidos.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={12} title="Métricas clínicas: Precisión, Recall y F1" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<div className="rounded lg border border teal 200 bg teal 50/80 p 3.5 text xs text gray 800">
<strong className="text teal 900 block mb 1">1. Precisión (Precision): Confiabilidad de las alertas</strong>
$$\text{Precisión} = \frac{\text{TP}}{\text{TP} + \text{FP}} = \frac{35}{35 + 5} = \frac{35}{40} = 0.875\ (87.5\%)$$
<em>De cada 100 conidias que el clasificador declaró como Aspergillus, 87.5 realmente lo eran y 12.5 fueron falsas alarmas.</em>
</div>

<div className="rounded lg border border rose 200 bg rose 50/80 p 3.5 text xs text gray 800">
<strong className="text rose 900 block mb 1">2. Recall o Sensibilidad: Capacidad de detección</strong>
$$\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}} = \frac{35}{35 + 10} = \frac{35}{45} \approx 0.778\ (77.8\%)$$
<em>De los 45 casos reales de Aspergillus existentes en la muestra, el modelo capturó el 77.8%, un 22.2% de infecciones escapó al radar.</em>
</div>

<div className="rounded lg border border blue 200 bg blue 50/80 p 3.5 text xs text gray 800">
<strong className="text blue 900 block mb 1">3. F1 Score: Media armónica de balance</strong>
$$\text{F1} = 2 \times \frac{\text{Precisión} \times \text{Recall}}{\text{Precisión} + \text{Recall}} = 2 \times \frac{0.875 \times 0.778}{0.875 + 0.778} \approx 0.824\ (82.4\%)$$
<em>La media armónica penaliza drásticamente los desbalances extremos entre falsos positivos y falsos negativos.</em>
</div>

<ChoiceQuestion
  question="¿Por qué la matriz de confusión es más útil que solo el porcentaje de aciertos?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 confusion 1"
  allowContinueOnIncorrect
  explanation="Desagrega los errores: falso negativo (patógeno no detectado) y falso positivo (falso alarma) tienen costos clínicos distintos. Accuracy solo los oculta."
  options={[
    { id: "a", label: "Porque es más vistosa que un número solo", correct: false, feedback: "No es estética: revela tipos de error con distinto costo." },
    { id: "b", label: "Porque distingue falsos negativos vs falsos positivos con costos clínicos distintos", correct: true, feedback: "¡Exacto! En clínica, perder un patógeno no es lo mismo que una falsa alarma." },
    { id: "c", label: "Porque reemplaza al accuracy y lo hace innecesario", correct: false, feedback: "Complementa, no reemplaza: accuracy sigue siendo útil junto a precisión/recall." },
    { id: "d", label: "Solo sirve para regresión, no para clasificación", correct: false, feedback: "Es específica de clasificación, regresión usa ECM/R²." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={13} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

<RevealSequence blockOnQuiz>

<div>Cinco preguntas para consolidar los aprendizajes de IA en biotecnología. Responde correctamente cada una para avanzar.</div>

<ChoiceQuestion
  question="¿Qué mide el RMSD en el contexto de AlphaFold?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 check 1"
  explanation="RMSD es el ECM en 3D: distancia promedio entre átomos equivalentes. RMSD < 1Å es excelente."
  options={[
    { id: "a", label: "La cantidad de proteínas predichas por segundo", correct: false, feedback: "Eso sería velocidad de inferencia, no RMSD." },
    { id: "b", label: "La distancia promedio entre la estructura predicha y la estructura real", correct: true, feedback: "¡Correcto! Es la métrica clave para evaluar la predicción 3D." },
    { id: "c", label: "La velocidad de plegamiento de una proteína", correct: false, feedback: "No mide tiempo, sino error geométrico." },
    { id: "d", label: "La cantidad de aminoácidos en la proteína", correct: false, feedback: "Eso es longitud de secuencia, no calidad de la predicción." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué AlphaFold fue un avance tan significativo?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 check 2"
  explanation="Reformuló el plegamiento como aprendizaje a partir de 170k estructuras, sin simulaciones físicas costosas."
  options={[
    { id: "a", label: "Porque fue el primer modelo de deep learning", correct: false, feedback: "Hubo muchos antes, lo disruptivo fue el enfoque aplicado al plegamiento." },
    { id: "b", label: "Porque resolvió el plegamiento como aprendizaje sin simulaciones físicas costosas", correct: true, feedback: "¡Exacto! Aprendió de datos experimentales del PDB." },
    { id: "c", label: "Porque eliminó la necesidad de experimentos de laboratorio", correct: false, feedback: "Acelera, pero la validación experimental sigue siendo necesaria." },
    { id: "d", label: "Porque predice secuencias de ADN", correct: false, feedback: "Predice estructuras 3D a partir de secuencia de aminoácidos, no ADN." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la principal limitación del PDB como dataset para entrenar modelos como AlphaFold?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 check 3"
  explanation="Solo ~200k estructuras resueltas vs millones de secuencias conocidas, por eso predecir las faltantes era tan valioso."
  options={[
    { id: "a", label: "Es demasiado grande para descargarlo", correct: false, feedback: "El tamaño es manejable, el problema es la cobertura." },
    { id: "b", label: "Solo ~200.000 estructuras resueltas vs millones de proteínas conocidas", correct: true, feedback: "¡Correcto! Esa brecha hizo necesario AlphaFold." },
    { id: "c", label: "Los datos están en formato incorrecto", correct: false, feedback: "El formato PDB es estándar, no es el problema." },
    { id: "d", label: "No contiene proteínas humanas", correct: false, feedback: "Sí contiene miles de proteínas humanas, pero faltan muchas otras." },
  ]}
/>

<ChoiceQuestion
  question="En un pipeline de ML, ¿cuál etapa consume más tiempo en proyectos biotecnológicos?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 check 4"
  explanation="La limpieza y preparación de datos consume más del 60% del tiempo, además es donde aparecen errores silenciosos."
  options={[
    { id: "a", label: "El entrenamiento del modelo", correct: false, feedback: "El entreno es rápido comparado con conseguir y limpiar datos biológicos." },
    { id: "b", label: "La limpieza y preparación de datos", correct: true, feedback: "¡Exacto! Control de calidad, normalización entre lotes y corrección de artefactos llevan la mayor parte." },
    { id: "c", label: "El despliegue en producción", correct: false, feedback: "Desplegar es menor comparado con la preparación inicial." },
    { id: "d", label: "La elección del algoritmo", correct: false, feedback: "Elegir algoritmo es rápido, lo costoso es tener datos limpios." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué es un embedding de secuencia?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice l03 check 5"
  explanation="Convierte letras (aminoácidos) en vectores numéricos que el modelo puede procesar, es el paso inicial de AlphaFold."
  options={[
    { id: "a", label: "Una imagen de la proteína", correct: false, feedback: "No es visual, es una representación numérica." },
    { id: "b", label: "Una representación numérica de la secuencia que el modelo puede procesar", correct: true, feedback: "¡Correcto! Transforma secuencia en números para el aprendizaje." },
    { id: "c", label: "El archivo PDB de la proteína", correct: false, feedback: "El PDB almacena coordenadas, no es el embedding." },
    { id: "d", label: "El nombre de la proteína", correct: false, feedback: "El nombre es texto, no un vector procesable por el modelo." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={14} title="Para la próxima lección" eyebrow="CIERRE">
<RevealSequence showHistory>
<MascotMessage mood="celebrating">
¡Estructuras 3D conquistadas, pipelines dominados y matrices de confusión interpretadas con rigor clínico! Estás a las puertas de los casos del mundo real.
</MascotMessage>

En la última lección del módulo exploraremos aplicaciones reales que impactaron al planeta: cómo la IA aceleró la formulación de nanopartículas para la vacuna del COVID 19, el reposicionamiento exprés de moléculas terapéuticas y los nuevos modelos fundacionales de ADN como **Evo**.
</RevealSequence>
</Section>