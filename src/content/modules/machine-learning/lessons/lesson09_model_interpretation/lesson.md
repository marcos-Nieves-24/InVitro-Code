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

<MascotMessage mood="thinking">
Un modelo que predice con 99% de accuracy pero no puedes explicar por qué decidió algo es inútil en medicina, finanzas o justicia. La interpretabilidad no es un lujo — es un requisito ético y legal.
</MascotMessage>

Los modelos complejos (Random Forest, Gradient Boosting) son cajas negras: funcionan muy bien pero no te dicen por qué. En biotecnología necesitas saber qué genes predicen una enfermedad. En SaaS necesitas saber qué comportamientos predicen abandono. La **interpretabilidad** cierra esa brecha.

<ConceptCard variant="key-idea">
Interpretar no es solo mirar feature importance del modelo. Es responder: ¿qué features importan? ¿en qué dirección? ¿el efecto es lineal o no lineal? ¿esta predicción individual por qué se hizo?
</ConceptCard>

</Section>

<Section number={2} title="Importancia por permutación: la que te puedes creer" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Importancia por impureza:** Cuánto reduce Gini/Entropía cada feature durante el entrenamiento. Rápida pero sesgada — favorece features con muchos valores únicos y features correlacionadas.

**Importancia por permutación:** Mezcla aleatoriamente una feature y mide cuánto empeora el modelo. Si la feature era importante, el rendimiento cae. Si era irrelevante, no cambia nada. Mucho más confiable.
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Basada en", left: "Datos de entrenamiento (cómo se construyó el árbol)", right: "Datos de validación (cómo se comporta el modelo terminado)" },
    { feature: "Sesgo", left: "Favorece features con alta cardinalidad", right: "No tiene ese sesgo" },
    { feature: "Costo", left: "Gratis (viene con el modelo)", right: "Costoso (requiere re-evaluar el modelo N veces)" },
  ]}
/>

</Section>

<Section number={3} title="Dependencia parcial: el efecto de una feature aislada" eyebrow="CONCEPTO">

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

</Section>

<Section number={4} title="SHAP y LIME: explicaciones locales" eyebrow="CONCEPTO">

<ConceptCard variant="key-idea">
**SHAP (SHapley Additive exPlanations):** Basado en teoría de juegos cooperativos. Asigna a cada feature un "aporte" a la predicción, garantizando que los aportes sumen exactamente la diferencia entre la predicción y el promedio. Explica predicciones individuales.

**LIME (Local Interpretable Model-agnostic Explanations):** Entrena un modelo simple y local alrededor de una predicción específica para explicarla. Más rápido que SHAP pero menos preciso.
</ConceptCard>

<CalloutCheck>
En medicina: "Este paciente fue clasificado como alto riesgo porque tiene biomarker_1 elevado (+30% riesgo), age > 65 (+15%), y gene_mutation_count = 5 (+20%)." Eso es lo que SHAP te permite decir. Es la diferencia entre "confía en mí" y "aquí está la evidencia."
</CalloutCheck>

</Section>

<Section number={5} title="Resumen" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
La importancia por permutación es más confiable que la de impureza. Los PDP muestran el efecto marginal de cada feature. SHAP explica predicciones individuales con fundamentos de teoría de juegos. En aplicaciones de alto riesgo (medicina, finanzas, justicia), interpretar el modelo no es opcional.
</ConceptCard>

</Section>

<Section number={6} title="Ejercicios" eyebrow="EJERCICIOS">

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

</Section>
