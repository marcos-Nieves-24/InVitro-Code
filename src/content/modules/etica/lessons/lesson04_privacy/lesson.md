---
Module: 5
Lesson Number: 4
Lesson Title: Privacidad y Protección de Datos
Estimated Duration: 60 minutos
Prerequisites: L1 (Introducción a la Ética en IA)
Learning Objectives:
  - Explicar los principios fundamentales de privacidad de datos
  - Comparar anonimización, privacidad diferencial y aprendizaje federado
  - Identificar riesgos de re-identificación en datos biomédicos
  - Evaluar el cumplimiento con GDPR en flujos de trabajo de ML
Keywords: privacidad, GDPR, privacidad diferencial, aprendizaje federado, anonimización, re-identificación
Difficulty: Intermedio
Programming Concepts: None (conceptual)
Mathematical Concepts: privacidad diferencial (ε-differential privacy), presupuesto de privacidad
Machine Learning Concepts: federated learning, data minimization, consent management
Datasets Used: Ninguno
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Tus datos no son tuyos (y eso es un problema)" eyebrow="INICIO">

<MascotMessage mood="serious">
En 1997, investigadores de Harvard re-identificaron al gobernador de Massachusetts en una base de datos "anónima" de registros médicos usando solo su fecha de nacimiento, género y código postal. Tres datos. La anonimización es un mito.
</MascotMessage>

Los modelos de ML necesitan datos. Muchos datos. Pero en biotecnología y salud, esos datos son de pacientes reales con derecho a la privacidad. Cada dataset que usás es un riesgo potencial de exposición. Y "anonimizar" los datos no es suficiente.

<ConceptCard variant="key-idea">
La privacidad no es binaria (anónimo vs identificable). Es un espectro. La pregunta correcta no es "¿están anonimizados estos datos?" sino "¿cuál es el riesgo de re-identificación y qué protecciones existen?"
</ConceptCard>

</Section>

<Section number={2} title="El mito de la anonimización" eyebrow="CONCEPTO">

El caso del gobernador Weld (1997): investigadores del MIT compraron la base de datos "anónima" de registros hospitalarios del estado por \$20. La cruzaron con el registro de votantes (público, también \$20). Con solo **fecha de nacimiento + género + código postal**, identificaron al gobernador. Sus registros médicos completos quedaron expuestos.

<CalloutInfo>
El 87% de la población de EE.UU. es identificable de manera única con solo tres datos: código postal, fecha de nacimiento y género. En biotecnología, los datos genómicos son inherentemente identificables — tu ADN es tu identificador más único.
</CalloutInfo>

<ConceptCard variant="definition">
**Re-identificación:** Vincular datos "anónimos" con individuos reales cruzando múltiples fuentes. Cuantos más atributos tenés (quasi-identifiers), más fácil es identificar a alguien aunque hayas eliminado nombre, DNI y email.
</ConceptCard>

</Section>

<Section number={3} title="Privacidad diferencial: la solución matemática" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Privacidad diferencial (ε-differential privacy):** Agregar ruido calibrado a los datos o al modelo de manera que la presencia o ausencia de cualquier individuo no cambie significativamente el resultado. Garantía matemática: incluso si un atacante tiene toda la información del mundo menos UN dato tuyo, no puede inferir ese dato con confianza.
</ConceptCard>

- **ε (épsilon):** El presupuesto de privacidad. Valores más chicos = más privacidad, más ruido
- **Aplicación:** Google y Apple usan privacidad diferencial para recolectar estadísticas de uso sin exponer datos individuales
- **Limitación:** Agregar ruido reduce la precisión del modelo. Hay una compensación privacidad-utilidad

<CalloutCheck>
La privacidad diferencial no promete que tus datos sean secretos. Promete que incluirte o excluirte del dataset no cambia significativamente lo que un atacante puede aprender sobre vos. Es una garantía sobre el proceso, no sobre el resultado.
</CalloutCheck>

</Section>

<Section number={4} title="Aprendizaje federado: entrenar sin compartir" eyebrow="CONCEPTO">

<ConceptCard variant="key-idea">
**Federated Learning:** Los datos nunca salen de los dispositivos/hospitales. El modelo viaja a los datos, entrena localmente, y solo comparte las actualizaciones de los pesos (no los datos). Ideal para colaboración entre hospitales que no pueden compartir datos de pacientes por regulación.
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Tradicional", left: "Todos los datos se centralizan en un servidor. El modelo entrena con todos los datos juntos." },
    { feature: "Federado", left: "Los datos se quedan en el hospital. Cada hospital entrena una copia del modelo. Solo se comparten gradientes." },
    { feature: "Privacidad", left: "Riesgo de filtración masiva si el servidor central es comprometido." },
    { feature: "Limitación", left: "Requiere infraestructura coordinada. Los gradientes pueden filtrar información sobre los datos de entrenamiento." },
  ]}
/>

</Section>

<Section number={5} title="GDPR: lo que necesitás saber" eyebrow="REGULACIÓN">

<CalloutInfo>
El **GDPR (Reglamento General de Protección de Datos)** de la UE establece derechos que todo sistema de ML que procesa datos de europeos debe respetar:

1. **Derecho a explicación:** Decisiones automatizadas significativas deben poder explicarse
2. **Derecho al olvido:** Los usuarios pueden solicitar la eliminación de sus datos (incluyendo re-entrenar modelos sin esos datos)
3. **Minimización de datos:** Solo recolectar los datos estrictamente necesarios
4. **Consentimiento informado:** No basta un checkbox — el usuario debe entender para qué se usan sus datos
5. **Portabilidad:** El usuario puede llevarse sus datos a otro proveedor
</CalloutInfo>

<ReflectionCheck
  blockId="reflection-e04-right-to-be-forgotten"
  moduleSlug="etica"
  lessonSlug="lesson04_privacy"
  prompt="Un usuario ejerce su 'derecho al olvido' y pide eliminar sus datos. Pero tu modelo ya fue entrenado con esos datos. ¿Es suficiente con borrarlos de la base de datos? ¿Tenés que re-entrenar el modelo?"
  answers="El GDPR no es explícito sobre modelos ya entrenados, pero el espíritu de la ley sugiere que sí: si los datos de una persona influyeron en los pesos del modelo, el derecho al olvido debería extenderse a des-aprender esa influencia. Esto es 'machine unlearning', un área activa de investigación. En la práctica: (1) borrá los datos del dataset, (2) documentá la solicitud, (3) si es factible, re-entrená. Si no es factible (modelos muy grandes), documentá por qué y evaluá el riesgo residual."
/>

</Section>

<Section number={6} title="Resumen" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
La anonimización es frágil — tres datos pueden re-identificar al 87% de la población. La privacidad diferencial ofrece garantías matemáticas a costa de precisión. El aprendizaje federado permite colaborar sin compartir datos. El GDPR establece derechos que todo sistema de ML en salud/SaaS debe respetar. La privacidad se diseña, no se agrega al final.
</ConceptCard>

</Section>
