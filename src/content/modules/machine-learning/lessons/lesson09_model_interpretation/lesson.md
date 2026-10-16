---
Module: 4
Lesson Number: 9
Lesson Title: Interpretación de Modelos
Estimated Duration: 75 minutos
Prerequisites: L5 (Bosque Aleatorio), L8 (Gradient Boosting)
Learning Objectives:
  - Explicar por qué la interpretabilidad es importante en aplicaciones de alto riesgo
  - Calcular e interpretar la importancia por permutación
  - Generar e interpretar gráficos de dependencia parcial (PDP)
  - Comparar importancia por impureza vs. importancia por permutación
Keywords: interpretabilidad, importancia por permutación, dependencia parcial, SHAP, LIME, caja negra
Difficulty: Avanzado
Programming Concepts: sklearn.inspection.permutation_importance, PartialDependenceDisplay
Mathematical Concepts: importancia por permutación, dependencia parcial, valores SHAP
Machine Learning Concepts: interpretabilidad del modelo, explicabilidad, importancia de características
Datasets Used: breast cancer, California Housing
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="No basta con predecir bien — hay que explicar por qué" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un modelo de 99% de accuracy que no puedes explicar es inútil en medicina o finanzas.",
    "La interpretabilidad es un requisito ético y legal, no un lujo.",
    "Modelos complejos son cajas negras: funcionan bien pero no dicen por qué.",
  ]}
/>

<ConceptCard variant="key-idea">
Los modelos complejos (Random Forest, Gradient Boosting) son cajas negras: funcionan muy bien pero no te dicen por qué. En biotecnología necesitas saber qué genes predicen una enfermedad. En SaaS necesitas saber qué comportamientos predicen abandono. La **interpretabilidad** cierra esa brecha.
</ConceptCard>

<ConceptCard variant="key-idea">
Interpretar no es solo mirar feature importance del modelo. Es responder: ¿qué features importan? ¿en qué dirección? ¿el efecto es lineal o no lineal? ¿esta predicción individual por qué se hizo?
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="Importancia por permutación: la que te puedes creer" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La importancia por impureza favorece features con muchos valores únicos y correlacionadas.",
    "La permutación mezcla una feature y mide cuánto empeora el modelo.",
    "Si era importante, el rendimiento cae; si no, no cambia nada. Mucho más confiable.",
  ]}
/>

<ConceptCard variant="definition">
**Importancia por impureza:** Cuánto reduce Gini/Entropía cada feature durante el entrenamiento. Rápida pero sesgada — favorece features con muchos valores únicos y features correlacionadas.

**Importancia por permutación:** Mezcla aleatoriamente una feature y mide cuánto empeora el modelo. Si la feature era importante, el rendimiento cae. Si era irrelevante, no cambia nada. Mucho más confiable.
</ConceptCard>

{/* candidate-player: comparison-impurity-vs-permutation */}
<ConceptCard variant="key-idea">
**Impureza vs Permutación**
- Basada en: datos de entrenamiento (cómo se construyó el árbol) vs datos de validación (cómo se comporta el modelo terminado)
- Sesgo: favorece features con alta cardinalidad vs sin ese sesgo
- Costo: gratis (viene con el modelo) vs costoso (re-evaluar el modelo N veces)
</ConceptCard>

<ChoiceQuestion
  question="¿Para cuál de estos casos la importancia por permutación es preferible a la de impureza, y por qué?"
  moduleSlug="machine-learning"
  lessonSlug="lesson09_model_interpretation"
  blockId="choice-ml-l09-e2-1"
  allowContinueOnIncorrect
  explanation="La importancia por impureza se calcula durante el entrenamiento y sesga hacia features de alta cardinalidad o correlacionadas. La permutación evalúa el modelo terminado sobre datos de validación, por lo que es menos sesgada y más confiable cuando las features están correlacionadas o son categóricas de alta cardinalidad."
  options={[
    { id: "a", label: "Cuando tienes features correlacionadas o de alta cardinalidad", correct: true, feedback: "¡Correcto! La permutación evita el sesgo de la impureza." },
    { id: "b", label: "Cuando necesitas importancia instantánea sin costo adicional", correct: false, feedback: "Falso: eso es mejor con impureza; la permutación cuesta N re-evaluaciones." },
    { id: "c", label: "Siempre porque la impureza es engañosa", correct: false, feedback: "Falso: la impureza sirve como proxy rápido y barato." },
    { id: "d", label: "Solo con modelos lineales", correct: false, feedback: "Falso: la permutación es agnóstica al modelo." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={3} title="Dependencia parcial: el efecto de una feature aislada" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un PDP muestra cómo cambia la predicción promedio al variar una feature.",
    "Responde: si todo lo demás sigue igual, ¿subir edad aumenta o disminuye el riesgo?",
    "La limitación: asume independencia. Para correlaciones, usa ALE o SHAP.",
  ]}
/>

<ConceptCard variant="definition">
Un **Partial Dependence Plot (PDP)** muestra cómo cambia la predicción promedio cuando varías una feature, manteniendo todas las demás constantes. Responde: "si todo lo demás sigue igual, ¿subir la edad del paciente aumenta o disminuye el riesgo predicho?"
</ConceptCard>

```python
from sklearn.inspection import PartialDependenceDisplay

fig, ax = plt.subplots(figsize=(8, 5))
PartialDependenceDisplay.from_estimator(
    rf, X_test, ['worst radius', 'worst concave points'],
    feature_names=[str(f) for f in data.feature_names],
    grid_resolution=20, ax=ax)
plt.show()
```

<CalloutInfo>
Limitación del PDP: asume que las features son independientes. Si "edad" y "años de experiencia" están correlacionadas, el PDP puede mostrar combinaciones irreales (mucha edad + poca experiencia). Para eso existen ALE plots y SHAP.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={4} title="SHAP y LIME: explicaciones locales" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "SHAP asigna un aporte de teoría de juegos a cada feature y garantiza que sumen.",
    "LIME entrena un modelo simple local alrededor de una predicción para explicarla.",
    "SHAP es más preciso; LIME más rápido. Ambos explican predicciones individuales.",
  ]}
/>

<ConceptCard variant="key-idea">
**SHAP (SHapley Additive exPlanations):** Basado en teoría de juegos cooperativos. Asigna a cada feature un "aporte" a la predicción, garantizando que los aportes sumen exactamente la diferencia entre la predicción y el promedio. Explica predicciones individuales.

**LIME (Local Interpretable Model-agnostic Explanations):** Entrena un modelo simple y local alrededor de una predicción específica para explicarla. Más rápido que SHAP pero menos preciso.
</ConceptCard>

<CalloutCheck>
En medicina: "Este paciente fue clasificado como alto riesgo porque tiene biomarker_1 elevado (+30% riesgo), age > 65 (+15%), y gene_mutation_count = 5 (+20%)." Eso es lo que SHAP te permite decir. Es la diferencia entre "confía en mí" y "aquí está la evidencia."
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={5} title="Resumen y glosario" eyebrow="RESUMEN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La permutación es más confiable que la impureza.",
    "Los PDP muestran el efecto marginal de cada feature.",
    "SHAP explica predicciones individuales con fundamentos de juegos.",
  ]}
/>

<ConceptCard variant="key-idea">
La importancia por permutación es más confiable que la de impureza. Los PDP muestran el efecto marginal de cada feature. SHAP explica predicciones individuales con fundamentos de teoría de juegos. En aplicaciones de alto riesgo (medicina, finanzas, justicia), interpretar el modelo no es opcional.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "impureza", label: "Importancia por impureza", detail: "Usa la reducción de Gini o entropía que aporta cada división del árbol." },
    { id: "permutacion", label: "Importancia por permutación", detail: "Mide cuánto cae el desempeño al barajar esa feature." },
    { id: "pdp", label: "Partial Dependence Plot", detail: "Efecto marginal de una feature sobre la predicción, promediando el resto." },
    { id: "ice", label: "Ice plots", detail: "PDP por instancia: una curva por muestra, para ver heterogeneidad." },
    { id: "shap", label: "SHAP", detail: "Descompone cada predicción en contribuciones de cada feature." },
    { id: "local-global", label: "Local vs global", detail: "SHAP explica una predicción; la importancia global explica el modelo entero." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "gloss-impureza", label: "Importancia por impureza", detail: "Métrica de árboles de decisión basada en Gini o entropía." },
    { id: "gloss-permutacion", label: "Importancia por permutación", detail: "Variación del desempeño al permutar una variable." },
    { id: "gloss-pdp", label: "PDP", detail: "Curva del efecto marginal promedio de una feature." },
    { id: "gloss-ice", label: "Ice plot", detail: "PDP individualizado por instancia." },
    { id: "gloss-shap", label: "Valor SHAP", detail: "Contribución de una feature a una predicción concreta." },
    { id: "gloss-local", label: "Explicación local", detail: "Razonamiento de una sola predicción." },
    { id: "gloss-global", label: "Explicación global", detail: "Comportamiento agregado del modelo." },
  ]}
/>

<ChoiceQuestion
  question="Un árbol tiene 2000 observaciones y 40 features. La importancia por impureza marca 'id_de_paciente' como la feature más importante. ¿Qué está pasando?"
  moduleSlug="machine-learning"
  lessonSlug="lesson09_model_interpretation"
  blockId="choice-ml-l09-resumen-1"
  allowContinueOnIncorrect
  explanation="La importancia por impureza premia las features con muchos valores distintos, porque cada una puede partir el nodo en grupos casi puros. Un id único por paciente parte el árbol perfectamente y no aporta nada. La importancia por permutación no sufre ese sesgo: al barajar el id, el desempeño no cae."
  options={[
    { id: "a", label: "Es un artefacto de la impureza: premia features con muchos valores distintos, que pueden partir el árbol aunque no informen", correct: true, feedback: "Correcto: el id único parte el árbol de forma perfecta y la impureza lo premia, aunque no tenga valor predictivo real." },
    { id: "b", label: "El id de paciente sí es la feature más relevante para predecir el resultado", correct: false, feedback: "Un identificador no predice nada: memoriza. Es sobreajuste, no señal." },
    { id: "c", label: "Hay que recalcular el árbol con menos features", correct: false, feedback: "El problema no es la cantidad de features sino el criterio con el que se mide la importancia." },
    { id: "d", label: "SHAP también marcaría el id como la feature más importante", correct: false, feedback: "SHAP también Suffriría el sesgo: parte de la importancia por impureza en árboles." },
  ]}
/>

<MascotMessage mood="celebrating">
Interpretación dominada. Ahora podés abrir un modelo y decir qué feature pesa y por qué, no solo qué predice.
</MascotMessage>

</RevealSequence>

</Section>

<Section number={6} title="Ejercicios" eyebrow="EJERCICIOS">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Desafío: compara importancia por impureza vs permutación en un Random Forest.",
    "Top 5 por cada método y analiza si coinciden.",
    "El código evalúa sobre test para la permutación.",
  ]}
/>

<ConceptCard variant="key-idea">
**Desafío:** Compara importancia por impureza vs permutación en un Random Forest.
</ConceptCard>

<CodeEditor
  defaultValue={`import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_tr, y_tr)

# Importancia por impureza (viene del modelo)
imp_impurity = rf.feature_importances_

# Importancia por permutación (más confiable)
result = permutation_importance(rf, X_te, y_te, n_repeats=10, random_state=42)
imp_permutation = result.importances_mean

# Comparar top 5 de cada método
features = [str(f) for f in data.feature_names]
df = pd.DataFrame({
    'feature': features,
    'impurity': imp_impurity,
    'permutation': imp_permutation
})

print("Top 5 — Impureza:")
print(df.sort_values('impurity', ascending=False).head(5)[['feature','impurity']])
print("\\nTop 5 — Permutación:")
print(df.sort_values('permutation', ascending=False).head(5)[['feature','permutation']])
`}
  height="380px"
/>

</RevealSequence>

</Section>
