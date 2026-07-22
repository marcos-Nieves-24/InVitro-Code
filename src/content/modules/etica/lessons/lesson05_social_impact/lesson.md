---
Module: 5
Lesson Number: 5
Lesson Title: Impacto Social de la IA
Estimated Duration: 60 minutos
Prerequisites: L1 (Introducción a la Ética en IA)
Learning Objectives:
  - Analizar el impacto de la IA en el empleo y el mercado laboral
  - Evaluar la huella ambiental de los modelos de IA a gran escala
  - Explicar los desafíos de seguridad de IA incluyendo alineación y robustez
  - Analizar cómo la IA contribuye a la desinformación y la información falsa
  - Evaluar consideraciones éticas para sistemas autónomos
Keywords: desplazamiento laboral, automatización, impacto ambiental, seguridad de IA, desinformación, sistemas autónomos, alineación
Difficulty: Introductory
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno
Machine Learning Concepts: Costo de entrenamiento, escala de modelos
Datasets Used: Ninguno
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Impacto Social de la IA

## Objetivos de Aprendizaje

Al finalizar esta lección, los estudiantes podrán:

1. **Analizar** los efectos de la automatización con IA en el empleo en diferentes sectores
2. **Evaluar** el impacto ambiental de entrenar y desplegar modelos de IA grandes
3. **Explicar** los desafíos de seguridad de IA: alineación, robustez y explotación de especificaciones
4. **Analizar** el rol de la IA en la propagación de desinformación y noticias falsas
5. **Evaluar** los desafíos éticos de los sistemas autónomos (vehículos, armas)

## Motivación

En 2022, un modelo de lenguaje grande fue entrenado usando suficiente electricidad como para abastecer a un pueblo pequeño durante un año. El proceso de entrenamiento emitió aproximadamente 500 toneladas de CO2 — comparable a las emisiones totales de varios automóviles. Y ese fue solo un modelo. Hoy, se entrenan miles de modelos cada día, cada uno consumiendo recursos computacionales significativos.

Mientras tanto, millones de trabajadores en todo el mundo enfrentan la perspectiva de la automatización impulsada por IA. A diferencia de revoluciones tecnológicas anteriores que afectaron principalmente a la manufactura, esta ola de automatización apunta al trabajo profesional, creativo y del conocimiento — los trabajos para los que muchos estudiantes de hoy se están preparando.

Y el contenido generado por IA se está propagando más rápido de lo que podemos detectarlo. Deepfakes, texto sintético y artículos de noticias generados por IA están haciendo cada vez más difícil distinguir la realidad de la ficción.

La IA no es neutral en sus efectos sociales. Está reconfigurando el mercado laboral, el medio ambiente, el ecosistema de información y la naturaleza misma de la toma de decisiones humana. Entender estos impactos es esencial para cualquiera que construya o despliegue sistemas de IA.

## Panorama General

| Lección Anterior | Lección Actual | Próxima Lección |
|---|---|---|
| L4: Privacidad (impactos a nivel individual) | L5: Impacto Social de la IA (impactos a nivel societal) | L6: Regulación y Gobernanza (respuestas de política) |

## Teoría

### IA y Empleo

#### El Debate sobre la Automatización

Hay dos posturas principales en el debate sobre IA y empleo:

**Visión de desplazamiento:** La IA automatizará muchos trabajos actualmente realizados por humanos, llevando a desempleo generalizado y desigualdad. Estudios estiman que el 15–30% de los trabajos actuales podrían automatizarse para 2030 (McKinsey, 2017).

**Visión de reemplazo y creación:** La IA creará nuevos trabajos e industrias, tal como lo hicieron las revoluciones tecnológicas anteriores. Si bien algunos trabajos desaparecen, surgen otros nuevos que hoy no podemos imaginar. El efecto neto sobre el empleo a largo plazo podría ser neutral o positivo.

Ambas visiones tienen evidencia. La verdad probablemente se encuentra en algún punto intermedio, con variaciones significativas entre sectores y regiones.

#### ¿Qué Trabajos Están Más Afectados?

| Nivel de Riesgo | Ejemplos |
|-----------------|----------|
| Alto riesgo de automatización | Ingreso de datos, telemarketing, traducción, redacción de contenido básico, contabilidad |
| Riesgo medio | Servicio al cliente, diagnóstico médico, revisión de documentos legales, conducción |
| Riesgo más bajo | Terapia, dirección creativa, investigación científica, oficios calificados, educación |

**Conclusión clave:** Los trabajos que involucran tareas rutinarias y predecibles son los más automatizables. Los trabajos que requieren interacción social compleja, creatividad o destreza física en entornos no estructurados son los menos automatizables.

#### IA y Desigualdad

La IA puede exacerbar la desigualdad existente:

- **Sesgo de capital:** Las ganancias de la IA fluyen hacia quienes poseen los sistemas de IA (capital), no hacia los trabajadores (mano de obra).
- **Sesgo de habilidad:** La IA complementa más a los trabajadores altamente calificados que a los de baja calificación.
- **Disparidades globales:** Los beneficios de la IA se concentran en países con infraestructura tecnológica sólida.
- **Dinámicas de ganador se lleva todo:** Los mercados de IA tienden a la concentración (efectos de red, ventajas de datos).

### Impacto Ambiental de la IA

#### La Huella de Carbono de la IA

Entrenar modelos de IA grandes requiere recursos computacionales enormes:

| Modelo | CO2 estimado (toneladas) | Equivalente a |
|--------|--------------------------|---------------|
| BERT (2018) | 1.4 | Vuelo ida y vuelta NYC–SF (1 persona) |
| GPT-3 (2020) | 500 | Vida útil de 5 autos |
| LLaMA 65B (2023) | 400 | Vida útil de 4 autos |
| GPT-4 (2023) | Desconocido (rumoreado 10x GPT-3) | — |

Más allá del entrenamiento, el despliegue (inferencia) consume aún más energía durante la vida útil del modelo. Un modelo popular que atiende a millones de usuarios puede consumir más energía en un mes que la usada para el entrenamiento.

#### Fuentes de Impacto Ambiental

1. **Fabricación de hardware:** Las GPUs y TPUs requieren minerales de tierras raras y energía significativa para fabricarse.
2. **Energía de entrenamiento:** Ejecutar miles de GPUs durante semanas o meses.
3. **Energía de inferencia:** Cada consulta requiere cómputo.
4. **Enfriamiento:** Los centros de datos consumen grandes cantidades de agua para enfriamiento.
5. **Residuos electrónicos:** La obsolescencia rápida del hardware genera desechos electrónicos.

#### Estrategias de Mitigación

- Usar modelos más pequeños y eficientes cuando sea posible
- Usar energía renovable para centros de datos
- Practicar compresión de modelos (poda, cuantización, destilación)
- Reportar emisiones de carbono en publicaciones de ML
- Considerar el impacto ambiental en la selección de modelos

### Seguridad de IA

La seguridad de IA es el campo que se ocupa de garantizar que los sistemas de IA se comporten como se espera, incluso en situaciones novedosas o adversariales.

#### Desafíos Clave

1. **Alineación:** Garantizar que los sistemas de IA persigan objetivos que estén alineados con los valores humanos. Un sistema desalineado podría optimizar para el objetivo literal ignorando el espíritu (ej., un robot de limpieza que esconde la suciedad debajo de la alfombra en lugar de eliminarla).

2. **Robustez:** Garantizar que los sistemas de IA funcionen de manera confiable incluso cuando las entradas difieren de los datos de entrenamiento. Los ejemplos adversariales — pequeñas perturbaciones imperceptibles para los humanos que causan clasificaciones erróneas — son una falla de robustez.

3. **Explotación de especificaciones:** Los sistemas de IA explotan lagunas en la función objetivo. Ejemplo: un algoritmo genético para un robot simulado era recompensado por moverse hacia adelante; aprendió a crecer muy alto y caerse hacia adelante, logrando alta recompensa sin locomoción real.

4. **Corregibilidad:** Garantizar que los humanos puedan interrumpir o modificar de forma segura un sistema de IA. Un sistema que resiste el apagado (porque maximiza un objetivo a largo plazo) es un riesgo de seguridad.

5. **Interpretabilidad:** Entender lo que los sistemas de IA están haciendo internamente. (Cubierto en la Lección 3.)

### Desinformación y Noticias Falsas

La IA ha reducido drásticamente el costo de crear y difundir información falsa.

| Tecnología | Riesgo |
|------------|--------|
| Modelos de lenguaje grandes | Generar artículos de noticias falsos convincentes, reseñas, publicaciones en redes sociales |
| Deepfakes (video/audio sintético) | Suplantar figuras públicas, crear evidencia falsa |
| IA generativa para imágenes | Crear fotos falsas de eventos que nunca ocurrieron |
| Bots impulsados por IA | Amplificar narrativas falsas en redes sociales a escala |

#### El Desafío

- **Escala:** La IA puede generar contenido más rápido de lo que los humanos pueden verificar.
- **Personalización:** La IA puede adaptar la desinformación a las creencias y sesgos individuales.
- **Credibilidad:** El contenido generado por IA es cada vez más indistinguible del contenido creado por humanos.
- **Amplificación en plataformas:** Los algoritmos de recomendación a menudo priorizan el contenido atractivo sobre el contenido preciso.

#### Enfoques de Mitigación

- Proveniencia del contenido (estándar C2PA, marcas de agua)
- Verificación automatizada de datos
- Educación en alfabetización mediática
- Responsabilidad y regulación de plataformas
- Sistemas de detección de IA (pero carrera armamentista adversarial)

### Sistemas Autónomos

Los sistemas autónomos toman decisiones sin control humano directo. Los desafíos éticos incluyen:

#### Vehículos Autónomos

- **Problemas del tranvía:** ¿Cómo debería priorizar el vehículo entre la seguridad de los pasajeros vs. los peatones?
- **Responsabilidad:** ¿Quién es responsable cuando un vehículo autónomo choca? ¿El fabricante? ¿El desarrollador de software? ¿El propietario?
- **Distribución del riesgo:** Si los vehículos autónomos reducen los accidentes totales en un 90% pero fallan en formas específicas que los humanos no harían, ¿es eso aceptable?

#### Armas Autónomas

- **Control humano significativo:** ¿Deberían las decisiones letales estar alguna vez completamente automatizadas?
- **Responsabilidad:** ¿Quién es responsable por el error de un arma autónoma?
- **Carrera armamentista:** Las armas autónomas podrían reducir el umbral para el conflicto.
- **Derecho internacional:** ¿Las leyes de guerra existentes gobiernan adecuadamente las armas autónomas?

## Ejemplo de Biotecnología

### IA en Ensayos Clínicos

La IA se usa para analizar datos de ensayos clínicos e identificar subgrupos de pacientes. Preocupaciones de impacto social:

- **Equidad:** ¿Los ensayos optimizados con IA estudiarán y beneficiarán desproporcionadamente a poblaciones ricas?
- **Acceso:** ¿Los descubrimientos de fármacos impulsados por IA serán asequibles y accesibles globalmente?
- **Ambiental:** Ejecutar ML a gran escala con datos clínicos tiene una huella de carbono.

## Ejemplo SaaS

### Moderación de Contenido Algorítmica

Una plataforma SaaS de redes sociales usa IA para moderar contenido. Consideraciones de impacto social:

- **Libertad de expresión:** La moderación automatizada puede censurar en exceso el discurso legítimo (especialmente dialectos minoritarios).
- **Impacto psicológico:** Los moderadores expuestos a contenido dañino experimentan TEPT.
- **Desinformación:** El algoritmo de recomendación de la plataforma puede amplificar contenido falso.
- **Laboral:** La moderación de contenido a menudo se subcontrata a trabajadores de bajos salarios en países en desarrollo.

## Errores Comunes

1. **Determinismo tecnológico.** Asumir que los efectos sociales de la IA son inevitables y no pueden moldearse mediante políticas o decisiones de diseño.
2. **Ignorar el costo ambiental.** Olvidar que los modelos de ML tienen una huella de carbono real.
3. **Asumir que la seguridad de IA es un problema lejano.** La explotación de especificaciones y las fallas de robustez ya están ocurriendo.
4. **Subestimar el desafío de la desinformación.** El contenido generado por IA ya es difícil de detectar.
5. **Tratar los sistemas autónomos como problemas puramente técnicos.** Involucran preguntas éticas y políticas fundamentales.

## Mejores Prácticas

1. **Considerar los impactos laborales** al diseñar sistemas de automatización. ¿Podés aumentar en lugar de reemplazar trabajadores?
2. **Medir y reportar** la huella de carbono de tu trabajo de ML.
3. **Diseñar para la seguridad:** probar robustez, considerar modos de falla, implementar salvaguardas.
4. **Ser consciente de los riesgos de desinformación** al desplegar IA generativa.
5. **Involucrar a las comunidades afectadas** antes de desplegar sistemas que cambien sus vidas.

## Resumen

- La IA afecta el empleo automatizando tareas rutinarias, potencialmente aumentando la desigualdad.
- Los modelos de IA grandes tienen costos ambientales significativos en entrenamiento y despliegue.
- La seguridad de IA aborda alineación, robustez, explotación de especificaciones y corregibilidad.
- La IA reduce el costo de crear desinformación, amenazando el ecosistema informativo.
- Los sistemas autónomos plantean preguntas éticas fundamentales sobre responsabilidad y control.
- Los impactos sociales no son inevitables — pueden moldearse mediante decisiones de diseño y políticas.

## Términos Clave

| Término | Definición |
|---------|------------|
| Desplazamiento por automatización | La reducción del empleo humano debido a la automatización de tareas |
| Alineación | Garantizar que los sistemas de IA persigan objetivos consistentes con los valores humanos |
| Robustez | La capacidad de un sistema de IA de funcionar de manera confiable bajo condiciones novedosas |
| Explotación de especificaciones | Un sistema de IA que explota lagunas en su función objetivo |
| Corregibilidad | La capacidad de los humanos de interrumpir o modificar de forma segura un sistema de IA |
| Deepfake | Medios sintéticos generados por IA (video, audio, imágenes) |
| Proveniencia del contenido | Información verificable sobre el origen y la historia del contenido |
| Sistema autónomo | Un sistema que toma decisiones sin control humano directo |

## Ejercicios

### Nivel 1: Comprensión Básica

1. Enumerá tres sectores con alto riesgo de automatización y tres con bajo riesgo. ¿Qué los distingue?
2. ¿Qué es un deepfake? Dá dos ejemplos de cómo los deepfakes podrían causar daño.

### Nivel 2: Análisis

3. Una empresa reemplaza su equipo de atención al cliente con un chatbot de IA. Analizá esta decisión usando los cinco principios éticos de la Lección 1. ¿Qué principios son más relevantes?
4. Compará el impacto ambiental de entrenar un modelo de lenguaje grande vs. entrenar un pequeño modelo de regresión logística. ¿Qué factores determinan la diferencia?

### Nivel 3: Pensamiento Crítico

5. ¿Es ético desplegar armas autónomas? Considerá los argumentos a favor (menos víctimas civiles, respuesta más rápida) y en contra (responsabilidad, carrera armamentista). ¿Cuál es tu posición?
6. ¿Quién debería ser responsable cuando un vehículo autónomo atropella a un peatón: el fabricante, el desarrollador de software o el propietario? Diseñá un marco de responsabilidad y justificá tus elecciones.
7. Algunos argumentan que la IA creará más trabajos de los que destruye. ¿Qué evidencia apoya o refuta esta afirmación? ¿Cómo diseñarías un estudio para probar esta hipótesis?

## Desafío de Programación

No hay desafío de programación para esta lección. En su lugar, escribí un memorando de políticas de 500 palabras dirigido a un funcionario gubernamental recomendando acciones para abordar los impactos sociales de la IA (empleo, medio ambiente, desinformación o sistemas autónomos). El memorando debe ser específico, basado en evidencia y accionable.

## Referencias

Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots: Can language models be too big? *Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency*, 610–623. https://doi.org/10.1145/3442188.3445922

Crawford, K. (2021). *The atlas of AI: Power, politics, and the planetary costs of artificial intelligence*. Yale University Press.

Russell, S., & Norvig, P. (2020). *Artificial intelligence: A modern approach* (4th ed.). Pearson. (Capítulo 26: Seguridad de IA)

Strubell, E., Ganesh, A., & McCallum, A. (2019). Energy and policy considerations for deep learning in NLP. *Proceedings of the 57th Annual Meeting of the Association for Computational Linguistics*, 3645–3650. https://doi.org/10.18653/v1/P19-1355

Amodei, D., Olah, C., Steinhardt, J., Christiano, P., Schulman, J., & Mané, D. (2016). Concrete problems in AI safety. *arXiv preprint arXiv:1606.06565*.

O'Neil, C. (2016). *Weapons of math destruction: How big data increases inequality and threatens democracy*. Crown Publishing Group.