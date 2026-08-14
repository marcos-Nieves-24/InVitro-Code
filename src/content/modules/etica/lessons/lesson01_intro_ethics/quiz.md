# Quiz: Introducción a la ética de la IA

## Opción múltiple (5 preguntas)

**Q1.** ¿Cuál de las siguientes define mejor la ética de la IA?

A. El estudio de cómo hacer que los sistemas de IA sean más rentables
B. La aplicación de principios morales al diseño, desarrollo e implementación de sistemas de IA
C. Un conjunto de leyes que todos los sistemas de IA deben seguir
D. El análisis matemático de la equidad algorítmica

**Q2.** Según Floridi y Cowls (2019), ¿cuántos principios éticos centrales sintetizan la mayoría de las guías de ética de la IA en el mundo?

A. Tres
B. Cinco
C. Siete
D. Diez

**Q3.** Un hospital implementa un sistema de diagnóstico con IA que es 96% preciso en general pero diagnostica mal de forma sistemática una enfermedad rara que afecta desproporcionadamente a un grupo étnico específico. ¿Qué principio viola principalmente?

A. Beneficencia
B. Autonomía
C. Justicia
D. Explicabilidad

**Q4.** El principio de explicabilidad en la ética de la IA exige que:

A. El sistema de IA deba ser de código abierto
B. Las decisiones del sistema de IA deban ser comprensibles y que rindan cuentas a los afectados
C. El sistema de IA deba explicarse en lenguaje natural todo el tiempo
D. Los datos de entrenamiento deban estar disponibles públicamente

**Q5.** ¿Cuál de los siguientes NO es uno de los cinco principios identificados por Floridi y Cowls?

A. Beneficencia
B. No maleficencia
C. Rentabilidad
D. Autonomía

## Respuesta corta (2 preguntas)

**Q6.** Explicá por qué un modelo de machine learning que logra alta precisión promedio puede seguir siendo éticamente problemático. Proporcioná un ejemplo concreto.

**Q7.** Describí una concesión ética entre los principios de privacidad y transparencia. ¿Cómo podría un diseñador de sistemas resolver este conflicto?

## Pregunta de código (1 pregunta)

**Q8.** (Conceptual — sin código) Estás diseñando un sistema de IA para ayudar a los comités de admisión universitarios a evaluar solicitudes. Escribí un análisis breve (aproximadamente 150 palabras) explicando cómo se aplica cada uno de los cinco principios éticos a este sistema. Identificá al menos un conflicto potencial entre principios.

---

## Clave de respuestas

**Q1.** B — La aplicación de principios morales al diseño, desarrollo e implementación de sistemas de IA.

**Q2.** B — Cinco principios: beneficencia, no maleficencia, autonomía, justicia, explicabilidad.

**Q3.** C — Justicia, porque el sistema distribuye beneficios (diagnóstico preciso) y cargas (diagnóstico erróneo) de manera inequitativa entre los grupos.

**Q4.** B — Las decisiones del sistema de IA deben ser comprensibles y rendir cuentas a los afectados.

**Q5.** C — La rentabilidad no es uno de los cinco principios.

**Q6.** Un modelo puede ser preciso en promedio pero rendir mal para subgrupos específicos. Ejemplo: un clasificador de cáncer de piel entrenado mayormente con imágenes de piel clara logra 95% de precisión en general pero solo 70% en piel oscura. El promedio oculta la disparidad. Esto viola el principio de justicia.

**Q7.** La privacidad exige proteger los datos personales; la transparencia exige explicar cómo se toman las decisiones. Si una IA niega un préstamo, la transparencia exige una explicación, pero la explicación podría revelar patrones sensibles de los datos de entrenamiento. Un diseñador podría usar métodos de explicabilidad post-hoc (como LIME o SHAP) que brindan explicaciones sin exponer los datos en bruto.

**Q8.** (Respuesta de ejemplo) Beneficencia: el sistema podría reducir el bias humano en las admisiones e identificar candidatos calificados que de otro modo podrían pasar desapercibidos. No maleficencia: el sistema no debe perjudicar sistemáticamente a los postulantes de escuelas con menos recursos ni a grupos demográficos específicos. Autonomía: los postulantes deben saber que una IA participa en la decisión y tener derecho a apelar. Justicia: el sistema debe probarse para verificar la equidad entre grupos socioeconómicos, raciales y geográficos antes de su implementación. Explicabilidad: los postulantes rechazados merecen explicaciones significativas, no solo un puntaje. Conflicto: maximizar la precisión predictiva (beneficencia) puede requerir usar features que se correlacionan con características demográficas (violando la justicia); el diseñador debe decidir qué features excluir incluso si mejoran el desempeño.
