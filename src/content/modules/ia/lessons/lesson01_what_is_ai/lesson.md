
Module: 1
Lesson Number: 1
Lesson Title: ¿Qué es la Inteligencia Artificial?
Estimated Duration: 60 minutos
Prerequisites: Ninguno
Learning Objectives:
  Definir inteligencia artificial y distinguirla de la inteligencia natural
  Explicar el concepto de "características" (features) en datos
  Comprender cómo las máquinas reconocen patrones a partir de datos numéricos
  Identificar las limitaciones de las reglas fijas frente al aprendizaje automático
Keywords: inteligencia artificial, features, patrones, clasificación, conidias, *Aspergillus*, *Penicillium*
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno
Machine Learning Concepts: Features, clasificación, reconocimiento de patrones
Datasets Used: module01_ai_cell_features.csv


<Section number={1} title="El microscopio y la conidia" eyebrow="INICIO">

<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  typing={true}
  lines={[
    "Bienvenido al laboratorio.",
    "Hoy vamos a entender qué es la inteligencia artificial.",
    "Y cómo puede ayudar a clasificar microorganismos.",
    "Trabajaremos con un ejemplo muy concreto.",
    "Vas a ver que la máquina aprende de los datos, no de reglas mágicas.",
    "Empecemos.",
  ]}
/>

<ConceptCard variant="key idea">
Imagina que eres microbióloga/o y estás mirando al microscopio una muestra de un paciente inmunocomprometido. Ves cientos de conidias (esporas fúngicas) y necesitas identificar rápidamente si pertenecen al género *Aspergillus* o *Penicillium*. La diferencia es crítica: *Aspergillus* puede causar infecciones invasivas graves en pacientes neutropénicos.

Tradicionalmente, esto requiere un ojo entrenado y tiempo. ¿Y si una computadora pudiera aprender a hacer esta clasificación por ti, en segundos, con la misma precisión que un especialista? Eso es la inteligencia artificial aplicada a la biotecnología.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="¿Qué es la Inteligencia Artificial?" eyebrow="CONCEPTO">

<RevealSequence>

<ConceptCard variant="definition">
**Definición**: La inteligencia artificial (IA) es la rama de la computación que se ocupa de crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana.
</ConceptCard>

<ConceptCard variant="key idea">
**Intuición**: Cuando ves una foto y reconoces que es un gato, tu cerebro está haciendo un procesamiento increíblemente complejo en milisegundos. La IA intenta que las computadoras hagan ese mismo tipo de procesamiento.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="IA no piensa" eyebrow="CONCEPTO">

<RevealSequence>

<ConceptCard variant="key idea">
La IA no "piensa" como nosotros. No tiene conciencia, emociones ni entendimiento real. **Procesa datos numéricos y encuentra patrones estadísticos.** Eso es todo. Y es suficiente para ser extraordinariamente útil.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Features: el idioma de la máquina" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space y 3">
<p className="m 0 text base text gray 700">Vamos a usar un ejemplo concreto que nos va a acompañar todo el módulo. Las conidias de <em>Aspergillus</em> y <em>Penicillium</em> tienen diferencias sutiles:</p>
<div className="rounded lg border border blue 200 bg blue 50 p 3 text sm text gray 700">
<strong>Glosario:</strong> <em>feature</em> = propiedad medible de un dato que la IA usa para aprender (ej. área, textura) | <em>vector</em> = lista ordenada de números que representa una muestra (ej. [área, circularidad, textura, intensidad])
</div>
</div>

<SpeciesCompare
  leftLabel="*Aspergillus*"
  rightLabel="*Penicillium*"
  caption="Cada atributo se resalta sobre las dos conidias a la vez"
  rows={[
    { feature: "Forma", left: "Más redondeada", right: "Más alargada" },
    { feature: "Textura superficial", left: "Rugosa (verrugosa)", right: "Más lisa" },
    { feature: "Color", left: "Verde azulado", right: "Verde" },
    { feature: "Tamaño", left: "~3 a 6 µm", right: "~2.5 a 5 µm" },
  ]}
/>

<ConceptCard variant="key idea">
Un micólogo entrenado reconoce estas diferencias visualmente. Pero una computadora solo entiende **números**. Necesitamos convertir esas características en datos numéricos.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={5} title="De la imagen a los números" eyebrow="CONCEPTO">

<RevealSequence>

<ConceptCard variant="definition">
En IA, llamamos **features** (características o atributos) a las propiedades medibles de los datos que usamos para hacer predicciones.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "area", label: "Área (µm²)", detail: "Qué tan grande es la conidia" },
    { id: "circularidad", label: "Circularidad (0 a 1)", detail: "Qué tan redonda es (1 = círculo perfecto)" },
    { id: "textura", label: "Textura (índice)", detail: "Qué tan rugosa es la superficie" },
    { id: "intensidad", label: "Intensidad (0 a 255)", detail: "Qué tan clara u oscura es al microscopio" },
  ]}
/>

</RevealSequence>

</Section>

<Section number={6} title="Cada conidia es un vector" eyebrow="CONCEPTO">

<RevealSequence>

<ConidiaToVector caption="De imagen a números: así habla la máquina" />

<ConceptCard variant="key idea">
Cada conidia se convierte en un **vector de números**. La IA no "ve" imágenes como nosotros: ve matrices de números, y cada número es una pista que ayuda a clasificar.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={7} title="Comprueba: ¿qué es una feature?" eyebrow="EVALUACIÓN">

<RevealSequence>

<ChoiceQuestion
  question="¿Qué es una feature en el contexto de IA?"
  moduleSlug="ia"
  lessonSlug="lesson01_what_is_ai"
  blockId="choice l01 features 1"
  allowContinueOnIncorrect
  explanation="Una feature es una propiedad medible (como área, textura o intensidad) que convertimos en número para que el algoritmo pueda aprender patrones."
  options={[
    { id: "a", label: "Una característica del hardware de la computadora", correct: false, feedback: "El hardware no define la feature, hablamos de propiedades medibles de la muestra, no del equipo." },
    { id: "b", label: "Una propiedad medible de los datos que usamos para clasificar", correct: true, feedback: "¡Exacto! Área, circularidad, textura e intensidad son ejemplos de features." },
    { id: "c", label: "Un tipo de algoritmo de aprendizaje automático", correct: false, feedback: "No: los algoritmos usan features, pero no son la feature en sí." },
    { id: "d", label: "Un error que comete el modelo al predecir", correct: false, feedback: "Eso sería un error de predicción, no una feature." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={8} title="Diagnóstico visual con datos reales" eyebrow="INTERACTIVA">

<RevealSequence>

<div className="space y 3">
<p className="m 0 text sm leading relaxed text gray 700">Mismo concepto, otro ejemplo clínico real: las conidias nos enseñaron que área + textura separan especies. Los mismos features (área, textura, radio) se usan en medicina: el dataset Breast Cancer Wisconsin contiene 569 biopsias reales   cada una con 30 features numéricas extraídas de imágenes de núcleos celulares, igual que en nuestras conidias.</p>
<ChoiceQuestion
  question="Si medimos solo el área de una conidia, ¿podemos distinguir siempre *Aspergillus* de *Penicillium*?"
  moduleSlug="ia"
  lessonSlug="lesson01_what_is_ai"
  blockId="choice l01 area 1"
  allowContinueOnIncorrect
  explanation="Los rangos de área se superponen entre especies. Una sola feature rara vez separa bien, combinar varias (área + textura + circularidad) mejora la clasificación."
  options={[
    { id: "a", label: "Sí, el área por sí sola separa perfectamente ambas especies", correct: false, feedback: "No: hay superposición. Algunas conidias de *Aspergillus* son pequeñas y algunas de *Penicillium* son grandes." },
    { id: "b", label: "No, los rangos se superponen, necesitamos múltiples features", correct: true, feedback: "¡Correcto! Una sola dimensión no alcanza. El espacio de features multidimensional separa mejor." },
    { id: "c", label: "Solo si el microscopio está perfectamente calibrado", correct: false, feedback: "La calibración ayuda, pero no elimina la variabilidad biológica natural." },
    { id: "d", label: "Sí, porque *Penicillium* siempre es más grande", correct: false, feedback: "Falso: hay conidias pequeñas de *Aspergillus* y grandes de *Penicillium*. No es determinista." },
  ]}
/>
</div>

<div className="space y 2">
<DiagnosticTrainer />
<p className="m 0 text xs text gray 600">Cada punto en el gráfico es un caso real de biopsia. Cambia las features con el menú desplegable y nota cómo algunas combinaciones separan mejor tumores benignos de malignos.</p>
</div>

</RevealSequence>

</Section>

<Section number={9} title="Dos features > una" eyebrow="CONCEPTO">

<RevealSequence>

<FeatureSpace2D caption="Una dimensión no alcanza, dos separan" />

<div className="space y 3">
<div className="rounded lg border border gray 200 bg surface card p 4 text sm text gray 700">
<p className="m 0 mb 2 font semibold text gray 900">¿Qué observamos en la simulación?</p>
<ul className="m 0 list disc space y 1 pl 5">
<li>Si usamos solo una característica, hay superposición entre especies</li>
<li>Con dos o más características, la separación mejora</li>
<li>El &quot;espacio de características&quot; (feature space) es donde la IA trabaja</li>
</ul>
</div>
<ConceptCard variant="key idea">
Cada característica que agregamos es una nueva dimensión que ayuda a separar las clases. Pero tampoco sirve agregar cien features al azar   el arte está en elegir las correctas.
</ConceptCard>
</div>

</RevealSequence>

</Section>

<Section number={10} title="Tú como clasificador" eyebrow="INTERACTIVA">

<RevealSequence>

<div className="space y 3">
<p className="m 0 text sm text gray 700">Ahora vamos a hacer el ejercicio inverso: tú actúas como clasificador.</p>
<ChoiceQuestion
  question="¿Crees que un ojo humano entrenado clasifica mejor que un algoritmo simple?"
  moduleSlug="ia"
  lessonSlug="lesson01_what_is_ai"
  blockId="choice l01 patrones 1"
  allowContinueOnIncorrect
  explanation="Depende del problema: el humano es preciso en patrones visuales claros pero se cansa y es inconsistente. La IA es consistente, escalable y procesa miles de conidias por segundo."
  options={[
    { id: "a", label: "Sí, el humano siempre gana a cualquier algoritmo", correct: false, feedback: "No siempre: el humano se cansa y no escala a miles de muestras." },
    { id: "b", label: "Depende: humano preciso pero inconsistente, IA consistente y escalable", correct: true, feedback: "¡Exacto! El humano aporta intuición, la IA, consistencia y escala." },
    { id: "c", label: "El algoritmo siempre es peor que el humano", correct: false, feedback: "No: en volumen y consistencia, la IA supera al humano." },
    { id: "d", label: "Ninguno puede clasificar conidias correctamente", correct: false, feedback: "Ambos pueden, con enfoques y límites distintos." },
  ]}
/>
</div>

<div className="space y 2">
<ConidiaSortGame />
<p className="m 0 text xs text gray 600">Cada cuadrícula de 5×5 representa el patrón de una conidia simplificado. Clasifica cada una como <em>Aspergillus</em> o <em>Penicillium</em> basándote en el patrón visual.</p>
</div>

</RevealSequence>

</Section>

<Section number={11} title="Los humanos clasifican por patrones" eyebrow="CONCEPTO">

<RevealSequence>

<div className="rounded lg border border gray 200 bg surface card p 4 text sm text gray 700">
<p className="m 0 mb 2 font semibold text gray 900">¿Qué aprendemos de la simulación?</p>
<ul className="m 0 list disc space y 1.5 pl 5">
<li>Los humanos reconocemos patrones visuales intuitivamente</li>
<li>Pero no podemos explicar fácilmente <em>cómo</em> lo hacemos</li>
<li>La IA necesita convertir esos patrones en números para aprender</li>
</ul>
</div>

<ConceptCard variant="key idea">
Los humanos clasificamos por intuición visual. La IA clasifica con matemática. La intuición es poderosa pero difícil de programar. La matemática es fría pero se puede escalar a millones de datos.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={12} title="Reglas fijas vs ML" eyebrow="INTERACTIVA">

<RevealSequence>

<div className="space y 3">
<p className="m 0 text sm text gray 700">Antes de que existiera el machine learning, se usaban <strong>sistemas basados en reglas</strong>. Veamos por qué no son suficientes.</p>
<ChoiceQuestion
  question="Si creamos reglas manuales del tipo 'área > X y textura > Y', ¿podemos clasificar todas las conidias correctamente?"
  moduleSlug="ia"
  lessonSlug="lesson01_what_is_ai"
  blockId="choice l01 reglas 1"
  allowContinueOnIncorrect
  explanation="Por más que ajustes los umbrales, siempre hay conidias atípicas. La variabilidad biológica no se captura con reglas fijas, por eso usamos ML."
  options={[
    { id: "a", label: "Sí, basta con ajustar bien los umbrales para llegar al 100%", correct: false, feedback: "No: probarás que siempre quedan puntos mal clasificados por superposición natural." },
    { id: "b", label: "No, la variabilidad natural deja excepciones que ninguna regla simple captura", correct: true, feedback: "¡Exacto! Necesitarías cientos de reglas y aún así fallarías. El ML aprende la frontera flexible." },
    { id: "c", label: "Solo si usamos una única regla en lugar de dos", correct: false, feedback: "Una regla es aún más limitada que dos, empeora la separación." },
    { id: "d", label: "Sí, porque las conidias de cada especie son idénticas entre sí", correct: false, feedback: "Falso: hay variabilidad intra especie considerable." },
  ]}
/>
</div>

<div className="space y 2">
<ThresholdLab moduleSlug="ia" lessonSlug="lesson01_what_is_ai" blockId="lab l01 threshold" />
<p className="m 0 text xs text gray 600">Mueve los sliders para ajustar los umbrales. Fíjate cómo cambiar las reglas afecta la precisión: por más que ajustes, siempre hay puntos que se clasifican mal.</p>
</div>

</RevealSequence>

</Section>

<Section number={13} title="¿Por qué fallan las reglas fijas?" eyebrow="CONCEPTO">

<RevealSequence>

<ConceptCard variant="warning">
**La naturaleza es difusa, no binaria.** Las reglas fijas asumen que el mundo se puede partir con líneas rectas. La biología no funciona así.
</ConceptCard>

<div className="rounded lg border border gray 200 bg surface card p 4 text sm text gray 700">
<ul className="m 0 list disc space y 1.5 pl 5">
<li>Hay <strong>superposición natural</strong> entre especies: algunas conidias de <em>Aspergillus</em> se parecen a <em>Penicillium</em></li>
<li>Para capturar la complejidad, necesitaríamos <strong>cientos de reglas</strong>  imposible de mantener</li>
<li>Cada regla nueva puede contradecir a las anteriores</li>
<li><strong>Aquí entra el machine learning</strong>: en lugar de programar reglas, la máquina <em>aprende</em> los patrones de los datos</li>
</ul>
</div>

</RevealSequence>

</Section>

<Section number={14} title="Conceptos clave" eyebrow="CIERRE">

<RevealSequence>

<ConceptCard variant="definition">
**Inteligencia Artificial:** máquinas que realizan tareas que requieren inteligencia humana
</ConceptCard>

<ConceptCard variant="definition">
**Features (características):** propiedades medibles de los datos que usamos para clasificar
</ConceptCard>

<ConceptCard variant="definition">
**Espacio de características:** el universo multidimensional donde la IA busca patrones
</ConceptCard>

<ConceptCard variant="definition">
**Reglas fijas:** funcionan para problemas simples, fallan en la complejidad del mundo real
</ConceptCard>

<ConceptCard variant="definition">
**Aprendizaje automático:** la máquina encuentra patrones por sí misma a partir de ejemplos
</ConceptCard>

</RevealSequence>

</Section>

<Section number={15} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

<RevealSequence blockOnQuiz>

<div>Antes de cerrar, pon a prueba lo que viste. Responde correctamente cada pregunta para avanzar.</div>

<ChoiceQuestion
  allowContinueOnIncorrect
  question="¿Qué es una 'feature' en el contexto de IA?"
  moduleSlug="ia"
  lessonSlug="lesson01_what_is_ai"
  blockId="choice l01 check 1"
  explanation="Las features son los números que la IA usa para aprender, elegir buenas features es el primer paso del pipeline."
  options={[
    { id: "a", label: "Una característica del hardware de la computadora", correct: false, feedback: "No: el hardware es el equipo físico. La feature es una propiedad medible del dato." },
    { id: "b", label: "Una propiedad medible de los datos que usamos para clasificar", correct: true, feedback: "¡Correcto! Por ejemplo, área y textura de la conidia." },
    { id: "c", label: "Un tipo de algoritmo de aprendizaje", correct: false, feedback: "El algoritmo usa features, no es la feature." },
    { id: "d", label: "Un error en el modelo", correct: false, feedback: "Eso es un error de predicción, distinto a una feature." },
  ]}
/>

<ChoiceQuestion
  allowContinueOnIncorrect
  question="¿Por qué los sistemas basados en reglas fijas no son ideales para clasificar conidias?"
  moduleSlug="ia"
  lessonSlug="lesson01_what_is_ai"
  blockId="choice l01 check 2"
  explanation="La naturaleza tiene variabilidad, cualquier umbral fijo deja excepciones. El ML aprende fronteras flexibles."
  options={[
    { id: "a", label: "Porque las reglas son muy lentas de ejecutar", correct: false, feedback: "La velocidad no es el problema central, es la falta de flexibilidad." },
    { id: "b", label: "Porque la naturaleza tiene variabilidad que las reglas no capturan", correct: true, feedback: "¡Exacto! Siempre hay casos atípicos que rompen la regla." },
    { id: "c", label: "Porque las computadoras no entienden reglas", correct: false, feedback: "Las computadoras ejecutan reglas perfectamente, el problema es que no alcanzan." },
    { id: "d", label: "Porque las conidias cambian de forma constantemente", correct: false, feedback: "Cambian entre individuos, no de forma dinámica constante, pero esa variabilidad ya rompe reglas fijas." },
  ]}
/>

<ChoiceQuestion
  allowContinueOnIncorrect
  question="¿Qué significa que una máquina 'aprenda'?"
  moduleSlug="ia"
  lessonSlug="lesson01_what_is_ai"
  blockId="choice l01 check 3"
  explanation="Aprender es encontrar patrones estadísticos en los datos sin ser programada explícitamente para cada caso."
  options={[
    { id: "a", label: "Que entiende el significado de lo que clasifica", correct: false, feedback: "No hay conciencia ni comprensión real, solo correlaciones estadísticas." },
    { id: "b", label: "Que encuentra patrones estadísticos en los datos sin ser programada explícitamente", correct: true, feedback: "¡Correcto! Esa es la definición de machine learning." },
    { id: "c", label: "Que puede tener conversaciones como un humano", correct: false, feedback: "Conversar es otra capacidad (PLN), aprender en este contexto es clasificar por patrones." },
    { id: "d", label: "Que reemplaza completamente al científico", correct: false, feedback: "La IA asiste y acelera, pero no reemplaza el criterio del científico." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={16} title="Para la próxima lección" eyebrow="CIERRE">

<RevealSequence>

<MascotMessage mood="celebrating">
Excelente trabajo. Completaste la primera lección. Las reglas fijas no alcanzan, pero el machine learning puede aprender patrones de los datos.
</MascotMessage>

<ConceptCard variant="key idea">
Viste que las reglas fijas no alcanzan. En la Lección 2 vamos a ver *cómo* las máquinas realmente aprenden: desde la frontera de decisión más simple (el perceptrón) hasta algoritmos como KNN que clasifican por cercanía. También vamos a entender qué es el "sobreajuste" (overfitting) y por qué un modelo demasiado complejo puede ser peor que uno simple.
</ConceptCard>

</RevealSequence>

</Section>
