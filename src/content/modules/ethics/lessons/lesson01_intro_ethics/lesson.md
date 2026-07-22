---
Module: 5
Lesson Number: 1
Lesson Title: Introducción a la Ética en IA
Estimated Duration: 60 minutos
Prerequisites: Módulo 4 (Machine Learning)
Learning Objectives:
  - Definir la ética en el contexto de la inteligencia artificial
  - Explicar por qué la ética en IA es importante para biotecnología y aplicaciones SaaS
  - Identificar los cinco principios éticos clave para IA: beneficencia, no maleficencia, autonomía, justicia, explicabilidad
  - Analizar casos reales donde fallas éticas en IA causaron daño
  - Evaluar las compensaciones entre principios éticos en conflicto en el diseño de sistemas
Keywords: ética, beneficencia, no maleficencia, autonomía, justicia, explicabilidad, equidad, rendición de cuentas
Difficulty: Introductory
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno
Machine Learning Concepts: Evaluación de modelos, clasificación, regresión (repaso)
Datasets Used: Ninguno
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Introducción a la Ética en IA

## Objetivos de Aprendizaje

Al finalizar esta lección, los estudiantes podrán:

1. **Definir** la ética en IA y su alcance dentro del ciclo de vida del ML
2. **Explicar** por qué las consideraciones éticas son críticas al desplegar IA en salud y SaaS
3. **Identificar** los cinco principios fundamentales de la ética en IA
4. **Analizar** un caso real de daño algorítmico usando principios éticos
5. **Evaluar** compensaciones éticas en un escenario concreto de diseño de sistemas

## Motivación

Imaginá que construís un modelo de machine learning que predice qué pacientes desarrollarán diabetes. Tu modelo alcanza un 94% de precisión en el conjunto de prueba. Lo desplegás en un hospital. Meses después, descubrís que el modelo subdiagnostica sistemáticamente la diabetes en mujeres de color — justamente la población que más necesita detección temprana.

Tu modelo es preciso en promedio. Pero causa daño real.

Esto no es un escenario hipotético. Sucedió. En 2019, investigadores descubrieron que un algoritmo de salud ampliamente usado en hospitales de Estados Unidos estaba sistemáticamente sesgado contra pacientes negros, clasificándolos falsamente como más saludables que pacientes blancos igualmente enfermos (Obermeyer et al., 2019). El algoritmo estaba desplegado en hospitales que atienden a millones de pacientes. El daño fue real, medible y totalmente prevenible.

La ética en IA no es un ejercicio filosófico abstracto. Es una disciplina de ingeniería que pregunta: *¿Qué deberíamos construir? ¿Cómo deberíamos construirlo? ¿Quién podría resultar dañado? ¿Qué responsabilidades tenemos hacia las personas afectadas por nuestros sistemas?*

Si trabajás en biotecnología, salud o SaaS, casi con certeza vas a desplegar modelos que afectan a personas reales. Entender la ética es tan esencial como entender el gradiente descendente.

## Panorama General

| Módulo Anterior | Lección Actual | Próxima Lección |
|---|---|---|
| Módulo 4: Introducción al ML (entrenamiento de modelos, evaluación) | L1: Introducción a la Ética en IA (principios, por qué importa la ética) | L2: Sesgo y Equidad (tipos de sesgo, métricas de equidad) |

Esta lección sienta la base filosófica y práctica. Cada lección subsiguiente — sesgo, transparencia, privacidad, impacto social, regulación, casos de estudio — se construye sobre estos cinco principios.

## Teoría

### ¿Qué es la Ética en IA?

La ética es la rama de la filosofía que se ocupa de los principios morales — lo que está bien y mal, lo bueno y lo malo. La ética en IA aplica estos principios al diseño, desarrollo, despliegue y gobernanza de sistemas de inteligencia artificial.

La ética en IA plantea preguntas como:

- ¿Quién es responsable cuando un vehículo autónomo atropella a un peatón?
- ¿Debería un modelo de ML denegar una solicitud de préstamo basándose en el código postal?
- ¿Es aceptable entrenar un modelo de diagnóstico sin el consentimiento del paciente?
- ¿Qué tan transparente debería ser un sistema de IA sobre su proceso de decisión?

Estas no son preguntas que podamos responder con una función de pérdida. Requieren valores, deliberación y compensaciones.

### Por Qué Importa

Hay cuatro razones convincentes para ocuparse de la ética en IA:

1. **Prevención de daños.** Los sistemas de ML pueden y causan daño — predicciones sesgadas, violaciones de privacidad, desplazamiento laboral. Entender la ética nos ayuda a minimizar el daño.

2. **Confianza.** Los usuarios, pacientes y reguladores exigen sistemas confiables. Una sola falla ética puede destruir la credibilidad.

3. **Cumplimiento legal.** La regulación se está acelerando. La Ley de IA de la UE, el GDPR y la HIPAA imponen requisitos legales a los sistemas de IA. La ignorancia no es una defensa.

4. **Mejor ciencia.** La reflexión ética mejora el rigor científico. Considerar quién está incluido en tu conjunto de datos, cómo se construyen tus características y para qué optimiza tu modelo conduce a modelos más robustos y mejores.

### Los Cinco Principios Clave

Floridi y Cowls (2019) sintetizaron más de 50 guías de ética en IA a nivel mundial en cinco principios centrales:

#### 1. Beneficencia

*Hacer el bien. Promover el bienestar.*

Los sistemas de IA deberían diseñarse para beneficiar a la humanidad. Esto significa:

- Maximizar resultados positivos (mejores diagnósticos, mayor productividad, mejor acceso)
- Considerar quién se beneficia y quién queda excluido
- Construir sistemas que sirvan al bien público, no solo a las ganancias corporativas

**Ejemplo:** Una IA de diagnóstico debería evaluarse no solo por su precisión sino por si mejora los resultados de los pacientes en la práctica.

#### 2. No Maleficencia

*No hacer daño. Prevenir el daño.*

Los sistemas de IA no deben causar daño previsible. Esto incluye:

- Daño directo (diagnóstico erróneo, accidentes)
- Daño indirecto (sesgo, discriminación, violaciones de privacidad)
- Daño a largo plazo (daño ambiental, desigualdad social)

**Ejemplo:** Antes de desplegar un sistema de contratación automatizado, evaluá si rechaza desproporcionadamente a candidatos de ciertos grupos demográficos.

#### 3. Autonomía

*Respetar la agencia humana. Mantener a los humanos en control.*

Los humanos deben retener un control significativo sobre los sistemas de IA. Esto significa:

- Consentimiento informado al usar los datos de las personas
- El derecho a optar por no participar en decisiones automatizadas
- Supervisión humana significativa para decisiones de alto impacto

**Ejemplo:** Se le debe informar a un paciente cuando una recomendación de diagnóstico proviene de una IA, y el clínico debe tener la última palabra.

#### 4. Justicia

*Ser equitativo. Distribuir beneficios y cargas de manera justa.*

Los sistemas de IA no deben reforzar las desigualdades existentes. Esto significa:

- Distribución equitativa de los beneficios de la IA entre las poblaciones
- Protección de grupos vulnerables
- Acceso a reparación cuando los sistemas causan daño

**Ejemplo:** Si un sistema de IA predice riesgo de enfermedad, asegurate de que funcione igual de bien en todos los grupos demográficos, no solo en la mayoría.

#### 5. Explicabilidad

*Ser transparente y responsable.*

Los sistemas de IA deberían ser comprensibles y responsables ante quienes afectan. Esto incluye:

- Transparencia: explicar cómo se toman las decisiones
- Interpretabilidad: hacer comprensible el comportamiento del modelo
- Rendición de cuentas: asignar claramente la responsabilidad por los resultados

**Ejemplo:** Un modelo de puntuación crediticia debería poder explicar por qué se denegó un préstamo en términos que el solicitante pueda entender.

### Compensaciones Éticas

Los principios a menudo entran en conflicto. Considerá una compensación entre:

- **Autonomía vs. Beneficencia:** Una IA médica que siempre recomienda el mejor tratamiento (beneficencia) podría anular las preferencias del paciente (autonomía).
- **Privacidad vs. Transparencia:** Hacer que una IA sea completamente transparente podría requerir compartir datos de entrenamiento privados (violación de privacidad).
- **Justicia vs. Eficiencia:** Lograr equidad perfecta entre grupos podría reducir la precisión general (pérdida de eficiencia).

No existe una fórmula universal para resolver estos conflictos. El diseño ético de IA requiere deliberación cuidadosa, aporte de las partes interesadas y experiencia en el dominio.

## Ejemplo Guiado

### Caso: Policía Predictiva

Considerá un sistema de policía predictiva que usa datos históricos de delitos para pronosticar dónde es probable que ocurran crímenes. Los departamentos de policía usan estas predicciones para asignar patrullajes.

**Análisis ético usando nuestros cinco principios:**

| Principio | Pregunta | Análisis |
|-----------|----------|----------|
| Beneficencia | ¿Produce buenos resultados? | Podría reducir las tasas de criminalidad y mejorar la seguridad pública |
| No maleficencia | ¿Causa daño? | Los datos históricos reflejan vigilancia sesgada; las predicciones pueden perpetuar el sobrepatrullaje de barrios minoritarios |
| Autonomía | ¿Respeta la agencia humana? | Los oficiales pueden delegar en el algoritmo en lugar de usar su criterio |
| Justicia | ¿Es equitativo? | Si los datos históricos están sesgados, el sistema apunta injustamente a comunidades ya sobrevigiladas |
| Explicabilidad | ¿Es transparente? | Los ciudadanos pueden no saber que están siendo vigilados según un algoritmo |

**Conclusión:** El sistema podría producir buenos resultados solo si los datos, el despliegue y la supervisión se diseñan cuidadosamente para prevenir daños y garantizar equidad.

## Ejemplo de Biotecnología

### IA en Descubrimiento de Fármacos

Se entrena un modelo de ML para predecir qué compuestos químicos se unirán a una proteína objetivo para un nuevo medicamento contra el cáncer. Los datos de entrenamiento provienen de bases de datos públicas que contienen principalmente compuestos probados en líneas celulares de origen europeo.

**Preocupaciones éticas:**

- **Justicia:** El medicamento resultante podría ser menos efectivo para poblaciones no europeas porque el modelo nunca aprendió su variabilidad biológica.
- **Beneficencia:** El medicamento podría salvar vidas, pero solo para un subconjunto de pacientes.
- **Autonomía:** ¿Los pacientes cuyas líneas celulares se usaron en el entrenamiento fueron informados? ¿Dieron su consentimiento?

**Lección:** La composición del conjunto de datos es una decisión ética, no solo técnica.

## Ejemplo SaaS

### Suscripción de Préstamos con IA

Una plataforma SaaS de préstamos usa ML para aprobar o denegar préstamos a pequeñas empresas. El modelo usa características que incluyen historial crediticio, ingresos y código postal.

**Preocupaciones éticas:**

- **Justicia:** El código postal se correlaciona con la raza debido a la discriminación histórica en vivienda. El modelo puede perpetuar la discriminación habitacional.
- **Explicabilidad:** Los solicitantes a quienes se les deniega un préstamo merecen una explicación. "El modelo dijo que no" es insuficiente.
- **No maleficencia:** Denegar préstamos a negocios de minorías profundiza la desigualdad económica.

**Lección:** Las características que son predictivas no siempre son éticamente aceptables.

## Errores Comunes

1. **Equiparar precisión con éxito ético.** Un modelo puede ser preciso en promedio pero sistemáticamente incorrecto para grupos específicos.
2. **Ignorar la procedencia de los datos.** Las propiedades éticas de un conjunto de datos importan tanto como sus propiedades estadísticas.
3. **Tratar la ética como opcional.** La ética no es una casilla para marcar después de construir el modelo. Debe integrarse a lo largo de todo el ciclo de vida del ML.
4. **Asumir neutralidad.** Los sistemas de ML no son neutrales en cuanto a valores. Cada decisión de diseño refleja valores.
5. **Olvidar a la persona.** Detrás de cada punto de datos hay una persona que puede verse afectada por el sistema.

## Mejores Prácticas

1. **Empezar temprano.** Considerá las implicaciones éticas durante la formulación del problema, no después del despliegue.
2. **Equipos diversos.** Los equipos con antecedentes diversos identifican más riesgos éticos.
3. **Participación de las partes interesadas.** Hablá con las personas que se verán afectadas por tu sistema.
4. **Documentar decisiones.** Anotá por qué elegiste ciertas características, conjuntos de datos y umbrales.
5. **Asumir responsabilidad.** Si tu sistema causa daño, reconocelo y corregilo.

## Resumen

- La ética en IA aplica principios morales al diseño, desarrollo y despliegue de sistemas de IA.
- Hay cinco principios clave: beneficencia, no maleficencia, autonomía, justicia y explicabilidad.
- Estos principios a menudo entran en conflicto; no existe una resolución universal.
- La composición del conjunto de datos, la selección de características y el diseño del modelo son decisiones éticas.
- La ética no es opcional — es una responsabilidad central de la ingeniería.

## Términos Clave

| Término | Definición |
|---------|------------|
| Beneficencia | El principio de diseñar IA para promover el bienestar y producir buenos resultados |
| No maleficencia | El principio de prevenir el daño causado por sistemas de IA |
| Autonomía | El principio de respetar la agencia humana y mantener a los humanos en control |
| Justicia | El principio de distribuir los beneficios y cargas de la IA de manera equitativa |
| Explicabilidad | El principio de hacer que la IA sea transparente, interpretable y responsable |
| Ética en IA | El campo que se ocupa de los principios morales en el diseño y despliegue de IA |
| Compensación ética | Una situación donde satisfacer un principio ético entra en conflicto con otro |

## Ejercicios

### Nivel 1: Comprensión Básica

1. Enumerá los cinco principios éticos de la IA según Floridi y Cowls (2019). Proporcioná una definición de una oración para cada uno.
2. Explicá por qué un modelo con 95% de precisión puede seguir siendo éticamente problemático.

### Nivel 2: Análisis

3. Elegí un sistema de IA real o hipotético. Analizalo usando los cinco principios éticos. Identificá al menos una posible violación ética.
4. Dá un ejemplo de una compensación ética entre autonomía y no maleficencia en un contexto de IA en salud.

### Nivel 3: Pensamiento Crítico

5. Un sistema de IA predice el rendimiento estudiantil para asignar recursos educativos. Escribí un breve análisis ético (200 palabras) que cubra los cinco principios. ¿Qué compensaciones existen? ¿Cómo las resolverías?
6. ¿Por qué podría ser insuficiente confiar únicamente en la "equidad por desconocimiento" (excluir atributos protegidos del modelo)? ¿Qué principio ético se viola?

## Desafío de Programación

No hay desafío de programación para esta lección introductoria. Los ejercicios de implementación comienzan en la Lección 2.

## Referencias

Floridi, L., & Cowls, J. (2019). A unified framework of five principles for AI in society. *Harvard Data Science Review*, 1(1). https://doi.org/10.1162/99608f92.8cd550d1

Jobin, A., Ienca, M., & Vayena, E. (2019). The global landscape of AI ethics guidelines. *Nature Machine Intelligence*, 1, 389–399. https://doi.org/10.1038/s42256-019-0088-2

Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. *Science*, 366(6464), 447–453. https://doi.org/10.1126/science.aax2342

O'Neil, C. (2016). *Weapons of math destruction: How big data increases inequality and threatens democracy*. Crown Publishing Group.

Russell, S., & Norvig, P. (2020). *Artificial intelligence: A modern approach* (4th ed.). Pearson.