
Module: 1
Lesson Number: 4
Lesson Title: Casos Reales y Futuro
Estimated Duration: 60 minutos
Prerequisites: Lección 3   IA en Biotecnología
Learning Objectives:
  Analizar cómo se aplicó ML en el desarrollo de la vacuna mRNA del COVID 19
  Comprender el reposicionamiento de fármacos mediante modelos predictivos
  Evaluar las limitaciones actuales de la IA en biotecnología
  Discutir el futuro de la IA en el laboratorio
Keywords: mRNA, vacunas, reposicionamiento, ARN, nanolípidos, docking, DeepMind, Isomorphic Labs
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno nuevos
Machine Learning Concepts: Aplicaciones, limitaciones, pipeline completo
Datasets Used: Ninguno específico


<Section number={1} title="De los fundamentos a las aplicaciones" eyebrow="INICIO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  typing={true}
  lines={[
    "¡Llegamos a la estación final del Módulo 1!",
    "En las tres lecciones previas recorrimos el camino metodológico: features, algoritmos supervisados, métricas y pipelines.",
    "Ahora veremos dónde esta maquinaria computacional se encuentra con la salud pública y la biotecnología global.",
    "Desde el diseño de las vacunas de ARN mensajero hasta el descubrimiento acelerado de nuevos fármacos.",
    "Y reflexionaremos sobre las limitaciones infranqueables donde la presencia del científico sigue siendo insustituible.",
  ]}
/>

<div>
En tres etapas construimos los cimientos:
<br />
1. **Features y frontera**: Describir microorganismos numéricamente y superar las reglas rígidas.
<br />
2. **Modelos y sobreajuste**: Entender cómo aprenden perceptrones, KNN y regresión sin memorizar ruido.
<br />
3. **Estructuras y pipelines**: La revolución 3D de AlphaFold y la rigurosidad de las matrices de confusión.
</div>

<ConceptCard variant="key idea">
En esta lección cerramos el módulo analizando casos reales donde los modelos predictivos y generativos salvaron vidas, recortaron años de desarrollo preclínico y sentaron las bases del laboratorio autónomo del futuro.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="El problema: COVID 19 y la urgencia global" eyebrow="CONTEXTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "A inicios de 2020 el mundo se enfrentó a una emergencia sanitaria inédita.",
    "El desarrollo estándar de una vacuna toma históricamente entre 5 y 10 años.",
    "En menos de 12 meses dispusimos de vacunas de ARN mensajero altamente eficaces.",
    "La inteligencia artificial fue uno de los motores decisivos detrás de esa velocidad récord.",
  ]}
/>

<ConceptCard variant="definition">
El principio de una **vacuna de ARN mensajero (mRNA)**: En vez de inocular un virus inactivado o una proteína recombinante purificada, se introduce la instrucción genética transitoria para que nuestras propias células expresen la proteína espícula (Spike) del virus, desencadenando una respuesta inmune neutralizante.
</ConceptCard>

<div>
Sin embargo, el ARN es una molécula químicamente inestable que el sistema inmune degrada de inmediato si viaja desnuda en el torrente sanguíneo. Requería un vehículo de transporte biológico de alta ingeniería.
</div>

</RevealSequence>

</Section>

<Section number={3} title="IA en las nanopartículas lipídicas (LNPs)" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  lines={[
    "Las nanopartículas lipídicas (LNPs) son esferas microscópicas de lípidos diseñadas para proteger el mRNA y facilitar su entrada a la célula.",
    "Formular una LNP óptima requiere equilibrar lípidos ionizables, colesterol, fosfolípidos y polietilenglicol (PEG).",
    "El espacio combinatorio cuenta con miles de proporciones fisicoquímicas posibles.",
  ]}
/>

<ChoiceQuestion
  question="Diseñar la LNP óptima implica miles de formulaciones. ¿Cómo acelera la IA ese proceso?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 lnp 1"
  allowContinueOnIncorrect
  explanation="La IA entrena con formulaciones previas y predice las 50 más prometedoras, evitando probar 1.000 al azar y ahorrando meses."
  options={[
    { id: "a", label: "Probando todas las combinaciones al azar en el laboratorio sin usar datos", correct: false, feedback: "Eso es lo que hacía el método tradicional lento, la IA justamente evita eso." },
    { id: "b", label: "Entrenando un modelo con formulaciones previas para predecir las más efectivas y priorizarlas", correct: true, feedback: "¡Correcto! El modelo aprende composición  rendimiento y guía los experimentos." },
    { id: "c", label: "Reemplazando por completo los experimentos de laboratorio", correct: false, feedback: "La IA no reemplaza el laboratorio, lo hace más inteligente y enfocado." },
    { id: "d", label: "Eligiendo lípidos solo por su precio más barato", correct: false, feedback: "El costo no determina eficacia ni estabilidad, importan las propiedades químicas." },
  ]}
/>

<ConceptCard variant="key idea">
La IA actuó como un filtro de alta eficiencia: en lugar de testear 1.000 formulaciones al azar en placas de cultivo, los algoritmos predijeron qué 50 mezclas tenían mayor estabilidad térmica y afinidad de transfección celular, ahorrando meses críticos de desarrollo.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Reposicionamiento de fármacos" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "Diseñar una molécula farmacológica de novo tarda más de una década.",
    "Por eso, durante una pandemia, la estrategia más veloz es el reposicionamiento farmacológico.",
    "Buscamos si un fármaco ya aprobado para otra patología puede bloquear al nuevo virus.",
  ]}
/>

<ConceptCard variant="definition">
**Reposicionamiento de fármacos**: Empleo de modelos computacionales predictivos para identificar nuevas indicaciones terapéuticas en compuestos que ya superaron rigurosas fases de seguridad y toxicología en humanos.
</ConceptCard>

<ChoiceQuestion
  question="Si tienes datos de qué fármacos se unen a qué proteínas virales, ¿cómo modelas el reposicionamiento y qué métrica priorizas?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 reposition 1"
  allowContinueOnIncorrect
  explanation="Es clasificación binaria (se une/no se une). En clínica priorizas sensibilidad/recall para no descartar fármacos útiles, balanceando con especificidad para no generar falsos positivos costosos."
  options={[
    { id: "a", label: "Regresión para predecir concentración, métrica principal R²", correct: false, feedback: "No es predecir número continuo, sino decidir si hay unión o no." },
    { id: "b", label: "Clasificación binaria se une/no se une, priorizar sensibilidad para minimizar falsos negativos", correct: true, feedback: "¡Exacto! Un falso negativo descarta un fármaco que podría salvar vidas." },
    { id: "c", label: "Clustering sin etiquetas, no hay métrica clínica", correct: false, feedback: "Tenemos etiquetas (se une/no), así que es supervisado, no clustering." },
    { id: "d", label: "Clasificación pero priorizar accuracy sin distinguir errores", correct: false, feedback: "Accuracy solo oculta la diferencia entre falso positivo y falso negativo, crítica en clínica." },
  ]}
/>

<div>
Ejemplos históricos de la pandemia:
<br />
• **Baricitinib**: Fármaco aprobado para artritis reumatoide, identificado por algoritmos de grafos biomédicos como inhibidor de la tormenta de citoquinas en COVID 19.
<br />
• **Remdesivir**: Antiviral originalmente evaluado para Ébola, priorizado mediante simulaciones computacionales de acoplamiento molecular.
</div>

</RevealSequence>

</Section>

<Section number={5} title="Caso real: Rentosertib y el descubrimiento acelerado" eyebrow="CASO DE ESTUDIO">

<RevealSequence showHistory>

<CalloutInfo>
<strong>Rentosertib (INS018_055):</strong> La compañía Insilico Medicine diseñó y descubrió este candidato a fármaco antifibrótico usando modelos generativos en solo <strong>18 meses</strong> desde la identificación del blanco biológico hasta la nominación del candidato preclínico (PCC). La media de la industria farmacéutica tradicional para esa fase oscila entre 4 y 6 años.
</CalloutInfo>

<ChoiceQuestion
  question="¿Por qué es revolucionario descubrir un fármaco en 18 meses y qué validaciones siguen siendo obligatorias?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 rentosertib 1"
  allowContinueOnIncorrect
  explanation="Ahorra años y costos vs 4 a 6 años tradicionales, pero no reemplaza toxicología, seguridad y fases clínicas en humanos."
  options={[
    { id: "a", label: "Porque reemplaza todos los ensayos y ya se puede usar en humanos", correct: false, feedback: "No: sigue requiriendo validación clínica completa." },
    { id: "b", label: "Acelera el acceso pero siguen siendo obligatorias toxicología y fases clínicas", correct: true, feedback: "¡Exacto! IA acelera, validación confirma." },
    { id: "c", label: "No es revolucionario, siempre se descubren fármacos en 18 meses", correct: false, feedback: "Tradicional lleva 4 a 6 años, 18 meses es un salto enorme." },
    { id: "d", label: "Solo importa el costo, no la seguridad", correct: false, feedback: "Seguridad y eficacia son prioritarias, no solo el costo." },
  ]}
/>

<ConceptCard variant="key idea">
La inteligencia artificial comprime drásticamente la fase de diseño y cribado virtual, pero los ensayos de toxicología animal y las tres fases de ensayos clínicos en pacientes humanos son pasos regulatorios obligatorios e irremplazables.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="AlphaFold en la práctica clínica" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="neutral"
  lines={[
    "En la competencia CASP14 de 2020, AlphaFold 2 alcanzó una puntuación mediana de 92.4 GDT.",
    "Ese número demostró que sus predicciones rivalizaban con las obtenidas experimentalmente por cristalografía.",
    "Pero llevar esas estructuras al diseño de fármacos exige cautela metodológica.",
  ]}
/>

<ChoiceQuestion
  question="AlphaFold predice estructuras para docking de fármacos. ¿Qué limitación puede causar falsos positivos si te basas solo en la predicción?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 alphafold 1"
  allowContinueOnIncorrect
  explanation="AlphaFold da la conformación más probable, pero las proteínas son dinámicas y cambian al unirse. Validar experimentalmente sigue siendo obligatorio."
  options={[
    { id: "a", label: "Las proteínas son dinámicas, la predicción es estática y puede no reflejar el estado activo", correct: true, feedback: "¡Correcto! Por eso una predicción útil sigue necesitando confirmación experimental." },
    { id: "b", label: "AlphaFold solo predice proteínas humanas, no virales", correct: false, feedback: "Predice cualquier secuencia, incluidas proteínas virales." },
    { id: "c", label: "Las predicciones son siempre incorrectas por definición", correct: false, feedback: "No: CASP14 alcanzó 92.4 GDT, comparable a métodos experimentales en muchos casos." },
    { id: "d", label: "El docking no se puede simular con computadoras", correct: false, feedback: "Sí se puede simular, justamente la estructura predicha permite el screening virtual." },
  ]}
/>

<ConceptCard variant="warning">
Las proteínas en solución fisiológica se mueven e inducen ajustes conformacionales al acoplar un ligando (ajuste inducido). Si el cribado virtual asume una estructura rígida e inmutable, puede descartar candidatos prometedores o generar falsos positivos.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={7} title="AlphaFold en la industria y enfermedades desatendidas" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="celebrating"
  lines={[
    "Una de las mayores victorias de la IA estructural ha sido democratizar el acceso a la ciencia.",
    "Laboratorios de países en desarrollo ahora cuentan con estructuras 3D que antes requerían sincrotrones millonarios.",
  ]}
/>

<div className="grid gap 2.5 sm:grid cols 3 my 2 text xs">
  <div className="rounded lg border border teal 200 bg teal 50/80 p 3">
    <strong className="text teal 900 block mb 1">Enfermedades parasitarias</strong>
    Predicción de proteínas diana en parásitos como <em>Trypanosoma</em> y <em>Leishmania</em>, históricamente postergados por falta de financiamiento para cristalografía.
  </div>
  <div className="rounded lg border border rose 200 bg rose 50/80 p 3">
    <strong className="text rose 900 block mb 1">Resistencia antimicrobiana</strong>
    Modelado predictivo de cómo las mutaciones en betalactamasas bacterianas alteran el bolsillo de unión y eluden los antibióticos actuales.
  </div>
  <div className="rounded lg border border blue 200 bg blue 50/80 p 3">
    <strong className="text blue 900 block mb 1">Enfermedades raras</strong>
    Simulación del impacto estructural provocado por variantes genéticas individuales en pacientes pediátricos con patologías de baja prevalencia.
  </div>
</div>

<ChoiceQuestion
  question="AlphaFold democratizó estructuras 3D: ¿qué oportunidades y riesgos crea para labs con menos recursos?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 industria 1"
  allowContinueOnIncorrect
  explanation="Oportunidad: investigación que antes requería equipamiento costoso ahora es accesible. Riesgo: confiar ciegamente sin validación y seleccionar una diana incorrecta, desperdiciando años."
  options={[
    { id: "a", label: "Solo Risiken: no sirve para nada en países con menos recursos", correct: false, feedback: "Al revés: abre puertas, pero exige criterio." },
    { id: "b", label: "Amplía acceso pero exige validar, confiar ciegamente puede desperdiciar años en una diana errónea", correct: true, feedback: "¡Exacto! Democratiza, pero no elimina la validación." },
    { id: "c", label: "Elimina la necesidad de validar experimentalmente", correct: false, feedback: "No: prioriza mejor la validación, no la elimina." },
    { id: "d", label: "Solo beneficia a laboratorios con criomicroscopía", correct: false, feedback: "Beneficia justamente a quienes no tienen esos equipos." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={8} title="El laboratorio del futuro: Más allá de la predicción" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "¿Hacia dónde se dirige la biotecnología en los próximos 10 años?",
    "La tendencia converge hacia el 'Closed Loop Lab': sistemas donde la IA no solo analiza resultados, sino que programa los robots de cultivo.",
  ]}
/>

<div className="space y 2 text xs">
  <div className="rounded lg border border gray 200 bg surface card p 2.5">
    <strong>1. Laboratorios autónomos (Self driving labs):</strong> Brazos robóticos que pipetean, incuban y secuencian guiados por algoritmos bayesianos 24/7.
  </div>
  <div className="rounded lg border border gray 200 bg surface card p 2.5">
    <strong>2. Gemelos digitales de bioprocesos:</strong> Simulaciones de biorreactores que anticipan el consumo de nutrientes antes de inocular las células.
  </div>
  <div className="rounded lg border border gray 200 bg surface card p 2.5">
    <strong>3. Visión computacional en tiempo real:</strong> Microscopios que identifican automáticamente conidias patógenas al momento de enfocar el campo.
  </div>
  <div className="rounded lg border border gray 200 bg surface card p 2.5">
    <strong>4. Diseño de novo de proteínas:</strong> Modelos generativos que inventan enzimas catalíticas que jamás existieron en la naturaleza.
  </div>
</div>

<ConceptCard variant="key idea">
La IA no sustituirá al científico: los científicos que utilicen IA reemplazarán a los que no la utilicen, liberando horas rutinarias para dedicarse a la formulación de hipótesis audaces.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={9} title="Evo: Modelos fundacionales para el lenguaje del ADN" eyebrow="CONCEPTO">

<RevealSequence showHistory>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  mood="thinking"
  lines={[
    "AlphaFold supuso una proeza para predecir la forma tridimensional de una proteína individual.",
    "Pero en 2024, el Arc Institute publicó en Science un enfoque aún más radical: Evo.",
    "Evo aprende el código genético completo a lo largo del árbol de la vida, tratando el ADN como un lenguaje generativo.",
  ]}
/>

<ConceptCard variant="definition">
<strong>Evo</strong> es un modelo fundacional para genómica entrenado sobre <strong>300.000 millones de pares de bases de ADN</strong> procariota y eucariota. Es capaz de modelar el impacto de variantes genéticas y generar secuencias biológicas completas de novo.
</ConceptCard>

<div className="grid gap 3 sm:grid cols 2 my 3">
  <div className="rounded xl border border blue 200 bg blue 50/80 p 4 flex flex col justify between">
    <div>
      <div className="flex items center justify between mb 2">
        <h4 className="font semibold text gray 900 text sm">AlphaFold</h4>
        <Badge variant="info">Estructural</Badge>
      </div>
      <p className="text-[11px] text gray 500 mb 3 font mono">DeepMind / EMBL EBI</p>

      <div className="space y 2 text xs">
        <div>
          <span className="font semibold text gray 700 block">Entrada:</span>
          <span className="text gray 600">Secuencia lineal de aminoácidos</span>
        </div>
        <div>
          <span className="font semibold text gray 700 block">Salida:</span>
          <span className="text gray 600">Coordenadas 3D (x, y, z) de la proteína</span>
        </div>
        <div>
          <span className="font semibold text gray 700 block">Capacidad Generativa:</span>
          <Badge variant="warning">No generativo</Badge>
        </div>
      </div>
    </div>

    <div className="mt 3 pt 2.5 border t border blue 200/70 text xs text blue 900">
      <strong>Impacto biológico:</strong> Resuelve la forma espacial y reduce la dependencia de cristalografía de rayos X.
    </div>
  </div>

  <div className="rounded xl border border teal 200 bg teal 50/80 p 4 flex flex col justify between">
    <div>
      <div className="flex items center justify between mb 2">
        <h4 className="font semibold text gray 900 text sm">Evo</h4>
        <Badge variant="success">Fundacional</Badge>
      </div>
      <p className="text-[11px] text gray 500 mb 3 font mono">Arc Institute / Science 2024</p>

      <div className="space y 2 text xs">
        <div>
          <span className="font semibold text gray 700 block">Entrada:</span>
          <span className="text gray 600">Genomas completos de ADN (codificante y no codificante)</span>
        </div>
        <div>
          <span className="font semibold text gray 700 block">Salida:</span>
          <span className="text gray 600">Predicción de variantes + secuencias de novo</span>
        </div>
        <div>
          <span className="font semibold text gray 700 block">Capacidad Generativa:</span>
          <Badge variant="success">Generativo (ADN y proteínas)</Badge>
        </div>
      </div>
    </div>

    <div className="mt 3 pt 2.5 border t border teal 200/70 text xs text teal 900">
      <strong>Impacto biológico:</strong> Pasa del análisis descriptivo al diseño biológico de novo a escala genómica.
    </div>
  </div>
</div>

</RevealSequence>

</Section>

<Section number={10} title="AlphaFold vs Evo: ¿En qué se diferencian?" eyebrow="EVALUACIÓN">

<RevealSequence showHistory>

<ChoiceQuestion
  question="¿En qué se diferencia Evo de AlphaFold?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 evo 1"
  allowContinueOnIncorrect
  explanation="AlphaFold predice coordenadas 3D a partir de aminoácidos. Evo es generativo sobre ADN completo (incluyendo no codificante) y puede diseñar secuencias novedosas."
  options={[
    { id: "a", label: "AlphaFold genera secuencias nuevas de ADN, Evo solo predice estructuras", correct: false, feedback: "Al revés: Evo genera, AlphaFold predice estructura." },
    { id: "b", label: "AlphaFold predice estructura 3D de proteínas, Evo genera y comprende secuencias genómicas completas", correct: true, feedback: "¡Perfecto! Son complementarios: forma vs secuencia generativa." },
    { id: "c", label: "No hay diferencia, son el mismo modelo con distinto nombre", correct: false, feedback: "Son arquitecturas y objetivos distintos, publicados por equipos diferentes." },
    { id: "d", label: "Ambos requieren cristalografía de rayos X para cada predicción", correct: false, feedback: "No requieren experimento nuevo, aprenden de datos previos." },
  ]}
/>

<ConceptCard variant="key idea">
Ambos modelos representan dos caras de la misma revolución: AlphaFold resuelve **qué arquitectura espacial** adopta una proteína, mientras que Evo predice **qué código de ADN** es capaz de generar funciones biológicas novedosas.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={11} title="Límites fundamentales de la IA en biología" eyebrow="CRÍTICO">

<RevealSequence showHistory>

<ChoiceQuestion
  question="Si un modelo predice con 95% que un fármaco funciona, ¿lo usarías directo en pacientes?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 limites 1"
  allowContinueOnIncorrect
  explanation="No: 95% del modelo no es probabilidad clínica. Puede esconder sesgos, falta de fisiología real y efectos no modelados. Validación clínica en fases es obligatoria."
  options={[
    { id: "a", label: "Sí, 95% del modelo equivale a 95% de éxito en humanos", correct: false, feedback: "No: esa confianza no incluye lo que el modelo no modeló (metabolismo, genética)." },
    { id: "b", label: "No, faltan sesgos, fisiología real y efectos no modelados, requiere validación clínica", correct: true, feedback: "¡Correcto! La incertidumbre real está fuera del 5% reportado." },
    { id: "c", label: "Sí, si es barato aunque no esté validado", correct: false, feedback: "Costo no sustituye seguridad clínica." },
    { id: "d", label: "No, pero basta con repetir el mismo modelo", correct: false, feedback: "Repetir el mismo sesgo no corrige la validación faltante." },
  ]}
/>

<ConceptCard variant="warning">
Las cinco limitaciones irreductibles de la IA en biología:
<br />
1. **Datos escasos y ruidosos**: Generar réplicas experimentales limpias es caro y lento frente a texto o imágenes de internet.
<br />
2. **Correlación no es causalidad**: Los algoritmos detectan regularidades estadísticas, pero no conocen los mecanismos moleculares subyacentes.
<br />
3. **Efecto de lote (Batch effects)**: Un modelo entrenado en un laboratorio suele fracasar al aplicarse a reactivos o microscopios de otra institución.
<br />
4. **Interpretabilidad (Cajas negras)**: En medicina se requiere justificar con bases biológicas por qué se recomienda u omite un tratamiento.
<br />
5. **Validación experimental obligatoria**: El veredicto final siempre pertenecerá al cultivo, al modelo animal y al ensayo clínico.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={12} title="Síntesis del Módulo 1" eyebrow="CIERRE">

<RevealSequence showHistory>

<MascotMessage mood="celebrating">
¡Hemos completado las cuatro expediciones del Módulo 1! Desde el reconocimiento numérico de esporas fúngicas hasta los modelos fundacionales de genómica.
</MascotMessage>

<div className="grid gap 2 sm:grid cols 2 my 3 text xs">
  <div className="rounded lg border border blue 200 bg blue 50/70 p 3">
    <strong className="text blue 900 block mb 0.5">Lección 1: Features y límites</strong>
    Las computadoras ven matrices de números, las reglas fijas se quiebran ante la variabilidad biológica.
  </div>
  <div className="rounded lg border border indigo 200 bg indigo 50/70 p 3">
    <strong className="text indigo 900 block mb 0.5">Lección 2: Algoritmos y sobreajuste</strong>
    Perceptrón, KNN y regresión lineal, la defensa del train/test split contra la memorización de ruido.
  </div>
  <div className="rounded lg border border teal 200 bg teal 50/70 p 3">
    <strong className="text teal 900 block mb 0.5">Lección 3: Biología 3D y Pipelines</strong>
    AlphaFold y el PDB, calibración rigurosa y matrices de confusión clínica (precisión, recall, F1).
  </div>
  <div className="rounded lg border border emerald 200 bg emerald 50/70 p 3">
    <strong className="text emerald 900 block mb 0.5">Lección 4: Casos reales y futuro</strong>
    Vacunas mRNA, nanopartículas lipídicas, reposicionamiento, modelo Evo y el criterio bioético ineludible.
  </div>
</div>

<ConceptCard variant="key idea">
Principio supremo: Sin datos limpios, features representativas y validación cruzada con criterio científico, ninguna arquitectura de inteligencia artificial es de utilidad.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={13} title="Checkpoint final del Módulo 1" eyebrow="EVALUACIÓN">

<RevealSequence blockOnQuiz>

<div>Checkpoint final del módulo. Valida las ideas maestras antes de obtener tu certificación de finalización del Módulo 1.</div>

<ChoiceQuestion
  question="¿Cómo ayudó la IA al desarrollo de la vacuna mRNA del COVID 19?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 check 1"
  explanation="Los modelos predijeron qué formulaciones de LNPs tenían más chance de funcionar, reduciendo meses de prueba al azar."
  options={[
    { id: "a", label: "Diseñó la secuencia genética del virus", correct: false, feedback: "La secuencia viral se obtuvo por secuenciación, no por diseño de IA." },
    { id: "b", label: "Predijo qué formulaciones de nanopartículas lipídicas serían más efectivas", correct: true, feedback: "¡Correcto! Priorizó 50 candidatas prometedoras sobre 1.000 posibles." },
    { id: "c", label: "Fabricó las vacunas en laboratorios autónomos sin humanos", correct: false, feedback: "Los laboratorios autónomos son tendencia futura, no lo usado en 2020." },
    { id: "d", label: "Reemplazó por completo los ensayos clínicos", correct: false, feedback: "Los ensayos clínicos siguen siendo obligatorios, la IA no los reemplaza." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué es el reposicionamiento de fármacos?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 check 2"
  explanation="Encontrar nuevos usos para fármacos aprobados usando ML predictivo, ahorra años porque ya pasaron pruebas de seguridad."
  options={[
    { id: "a", label: "Mover fármacos de un laboratorio a otro", correct: false, feedback: "No es logística, es predicción computacional de nuevas indicaciones." },
    { id: "b", label: "Usar modelos de ML para predecir si fármacos existentes pueden tratar nuevas enfermedades", correct: true, feedback: "¡Exacto! Baricitinib y remdesivir son ejemplos reales." },
    { id: "c", label: "Rediseñar la estructura química de un fármaco desde cero", correct: false, feedback: "Eso sería diseño de novo, no reposicionamiento." },
    { id: "d", label: "Almacenar fármacos en condiciones óptimas", correct: false, feedback: "Eso es logística de almacenamiento, no ML." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué una estructura predicha por AlphaFold no es suficiente para diseñar un fármaco?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 check 3"
  explanation="Es una foto estática de la conformación más probable, la proteína real es dinámica y puede adoptar otras conformaciones al unirse."
  options={[
    { id: "a", label: "Porque AlphaFold solo funciona con proteínas humanas", correct: false, feedback: "Funciona con cualquier secuencia, incluidas virales." },
    { id: "b", label: "Porque las proteínas son dinámicas y la predicción muestra un estado estático", correct: true, feedback: "¡Correcto! Por eso el docking basado solo en predicción puede dar falsos positivos." },
    { id: "c", label: "Porque las predicciones son siempre incorrectas", correct: false, feedback: "Muchas predicciones alcanzan 92.4 GDT, comparables a experimental." },
    { id: "d", label: "Porque requiere demasiado poder computacional para docking", correct: false, feedback: "El docking es factible, el límite es la dinámica, no el cómputo." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es una limitación FUNDAMENTAL de la IA en biotecnología?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 check 4"
  explanation="Datos escasos y caros, correlación sin causalidad, mala generalización entre laboratorios y cajas negras difíciles de interpretar."
  options={[
    { id: "a", label: "Es demasiado cara para usarla", correct: false, feedback: "El costo baja, el problema es la calidad y cantidad de datos biológicos." },
    { id: "b", label: "Los datos biológicos son escasos, caros, y el modelo no entiende mecanismos causales", correct: true, feedback: "¡Exacto! La IA encuentra correlaciones, no explica mecanismos biológicos." },
    { id: "c", label: "No hay suficientes científicos que sepan usarla", correct: false, feedback: "La brecha de formación existe, pero no es la limitación fundamental técnica." },
    { id: "d", label: "Las computadoras no tienen la potencia necesaria", correct: false, feedback: "El cómputo es mayormente suficiente, los datos siguen siendo el cuello de botella." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la idea más importante de este módulo?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice l04 check 5"
  explanation="Sin buenos datos, features relevantes, modelo adecuado y validación rigurosa, ningún modelo es confiable. No hay atajos."
  options={[
    { id: "a", label: "La IA reemplazará a los científicos", correct: false, feedback: "La IA aumenta la capacidad del científico, no la reemplaza." },
    { id: "b", label: "Sin buenos datos y validación rigurosa, ningún modelo es confiable", correct: true, feedback: "¡Ese es el hilo conductor del módulo!" },
    { id: "c", label: "Solo las redes neuronales profundas son útiles", correct: false, feedback: "Algoritmos simples como perceptrón y KNN ya son útiles y didácticos." },
    { id: "d", label: "La biotecnología no necesita IA", correct: false, feedback: "Al contrario: es uno de los campos con mayor impacto potencial de la IA." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={14} title="¡Fin del Módulo 1!" eyebrow="COMPLETADO">
<RevealSequence showHistory>
<MascotMessage mood="celebrating">
¡Felicidades por culminar el Módulo 1: Introducción a la Inteligencia Artificial! Has adquirido el pensamiento crítico necesario para navegar la bioinformática moderna.
</MascotMessage>

**¿Qué nos espera en el Módulo 2?**
<br />
• **Deep Learning y Redes Neuronales**: Arquitecturas profundas para procesar datos complejos.
<br />
• **Redes Convolucionales (CNNs)**: Clasificación y segmentación de imágenes de microscopía celular píxel por píxel.
<br />
• **Modelos Generativos**: Diseño computacional de péptidos y biomoléculas.

¡Excelente trabajo y nos vemos en la próxima expedición científica!
</RevealSequence>
</Section>