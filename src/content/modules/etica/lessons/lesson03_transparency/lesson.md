---
Module: 5
Lesson Number: 3
Lesson Title: Transparencia y Explicabilidad
Estimated Duration: 60 minutos
Prerequisites: L1 (Introducción a la Ética en IA)
Learning Objectives:
  - Diferenciar transparencia, explicabilidad e interpretabilidad
  - Explicar por qué la explicabilidad es crítica en salud y SaaS
  - Implementar SHAP y LIME para explicar predicciones de modelos
  - Comparar explicaciones globales vs locales
Keywords: transparencia, explicabilidad, interpretabilidad, XAI, SHAP, LIME, caja negra
Difficulty: Intermedio
Programming Concepts: shap, lime, sklearn.inspection
Mathematical Concepts: valores Shapley, explicaciones aditivas
Machine Learning Concepts: feature importance, dependencia parcial, explicaciones contrafactuales
Datasets Used: breast cancer, datos de crédito sintéticos
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="No alcanza con decir 'confía en mí'" eyebrow="INICIO">

<MascotMessage mood="neutral">
Un modelo de crédito te rechaza. Preguntas por qué. "El algoritmo decidió." Eso no es una respuesta. La transparencia no es un lujo — es un derecho. Y en medicina, puede ser la diferencia entre confianza y abandono del tratamiento.
</MascotMessage>

Los modelos complejos (Random Forest, Gradient Boosting, redes neuronales) son **cajas negras**: funcionan muy bien pero no te dicen por qué decidieron algo. En aplicaciones de alto impacto —diagnóstico médico, concesión de crédito, justicia penal— necesitas poder explicar cada decisión.

<ConceptCard variant="key-idea">
**Transparencia:** ¿Puedo ver cómo funciona el sistema? **Explicabilidad:** ¿Puedo entender por qué tomó esta decisión? **Interpretabilidad:** ¿Puedo entender el modelo en sí mismo? Son conceptos relacionados pero distintos.
</ConceptCard>

</Section>

<Section number={2} title="SHAP: teoría de juegos para explicar ML" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**SHAP (SHapley Additive exPlanations)** asigna a cada feature un "aporte" a la predicción, basado en la teoría de juegos cooperativos de Shapley. La suma de todos los aportes más un valor base es exactamente la predicción del modelo.
</ConceptCard>

Ventajas de SHAP:
- **Aditivo:** los aportes suman la predicción (propiedad de eficiencia)
- **Consistente:** si una feature se vuelve más importante, su valor SHAP no disminuye
- **Local y global:** explicas predicciones individuales y promedias para entender el modelo completo

<ComparisonTable
  rows={[
    { feature: "SHAP", left: "Fundamento teórico sólido (Shapley). Explicaciones precisas pero costosas computacionalmente. Mejor para análisis profundo." },
    { feature: "LIME", left: "Entrena un modelo simple alrededor de cada predicción. Más rápido que SHAP pero aproximado. Mejor para prototipado rápido." },
  ]}
/>

</Section>

<Section number={3} title="Explicando una predicción individual" eyebrow="CÓDIGO">

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Permutation importance — global
from sklearn.inspection import permutation_importance
result = permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=42)
importance_df = pd.DataFrame({
    'feature': data.feature_names,
    'importance': result.importances_mean
}).sort_values('importance', ascending=False).head(10)
print("Top 10 features globales:")
print(importance_df.to_string(index=False))
```

<CalloutInfo>
La importancia por permutación te dice qué features importan **en general**. Pero para un paciente específico, necesitas una explicación **local**: ¿por qué a ESTE paciente el modelo le dio alto riesgo? Para eso existen SHAP y LIME.
</CalloutInfo>

</Section>

<Section number={4} title="El espectro de explicabilidad" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Global", left: "¿Qué features importan en todo el modelo? Permutation importance, feature importance de RF. Ideal para entender el sistema." },
    { feature: "Local", left: "¿Por qué esta predicción específica? SHAP waterfall, LIME. Ideal para explicar decisiones individuales a un usuario." },
    { feature: "Contrafactual", left: "¿Qué tendría que cambiar para obtener otro resultado? 'Si tu ingreso fuera $5000 más alto, el préstamo se aprobaría.' Ideal para recomendaciones accionables." },
  ]}
/>

<ReflectionCheck
  blockId="reflection-e03-explain-medical"
  moduleSlug="etica"
  lessonSlug="lesson03_transparency"
  prompt="Un hospital usa ML para priorizar pacientes en lista de espera. ¿Qué tipo de explicación necesitan: (a) el médico, (b) el paciente, (c) el regulador?"
  answer="(a) Médico: explicación local (¿por qué este paciente está en posición 3 y no 15?) + contrafactual (¿qué cambiaría su prioridad?). (b) Paciente: explicación comprensible en lenguaje natural, no técnica — 'su prioridad es media porque sus valores de laboratorio son estables'. (c) Regulador: explicación global (¿el sistema trata igual a todos los grupos demográficos?) + documentación del proceso de desarrollo. Tres audiencias, tres tipos de explicación."
/>

</Section>

<Section number={5} title="Resumen" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
La transparencia no es binaria — es un espectro. Las explicaciones globales (todo el modelo) y locales (una predicción) sirven para audiencias distintas. SHAP tiene fundamento matemático sólido pero es costoso; LIME es rápido pero aproximado. La explicabilidad no es opcional cuando tus modelos afectan la vida de personas.
</ConceptCard>

</Section>
