---
Module: 4
Lesson Number: 10
Lesson Title: Aplicaciones
Estimated Duration: 90 minutos
Prerequisites: L1-L9 (todas las lecciones anteriores)
Learning Objectives:
  - Construir un pipeline de ML de extremo a extremo desde datos crudos hasta evaluación
  - Aplicar regresión a un problema de predicción de calidad de productos biotecnológicos
  - Aplicar clustering + clasificación a un problema de análisis de clientes SaaS
  - Seleccionar modelos y métricas apropiados para diferentes contextos de negocio
  - Comunicar resultados de ML a interesados no técnicos
Keywords: pipeline, extremo a extremo, biotecnología, SaaS, calidad de producto, segmentación de clientes, despliegue
Difficulty: Avanzado
Programming Concepts: Pipeline, ColumnTransformer, GridSearchCV
Mathematical Concepts: integración de múltiples conceptos de ML
Machine Learning Concepts: flujo de trabajo completo de ML, consideraciones de despliegue de modelos
Datasets Used: calidad biotecnológica sintética, datos SaaS de clientes sintéticos
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Todo junto: del dato a la decisión" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Has llegado a la lección final: nueve algoritmos después, es momento de integrarlos.",
    "Un ML Engineer toma datos crudos, los preprocesa, selecciona el modelo y comunica resultados.",
    "Los algoritmos son solo la etapa 3 de un pipeline real.",
  ]}
/>

<ConceptCard variant="key-idea">
Un pipeline de ML completo tiene 5 etapas: (1) entender el problema y los datos, (2) preprocesar y limpiar, (3) seleccionar y entrenar modelos, (4) evaluar con las métricas correctas, (5) comunicar resultados. Los algoritmos son solo la etapa 3.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={2} title="Caso 1: Calidad en biomanufactura" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Una empresa produce proteínas terapéuticas y mide variables del biorreactor.",
    "El objetivo: predecir el puntaje de calidad (0-100) para aprobar o descartar lotes.",
    "Features numéricas → StandardScaler; comparar LR, RF, GBR; métrica RMSE.",
  ]}
/>

<ConceptCard variant="key-idea">
**Pipeline biomanufactura**
- Caso: temperatura, pH, nutrientes, tiempo de fermentación, velocidad de agitación
- Features numéricas → `StandardScaler`
- Modelos a comparar: `LinearRegression`, `RandomForestRegressor`, `GradientBoostingRegressor`
- Métrica: RMSE (necesitas saber cuánto te equivocas en la escala de calidad)
- Hiperparámetros: `GridSearchCV` para encontrar la mejor combinación
</ConceptCard>

<CalloutCheck>
En manufactura real, cada lote descartado cuesta miles de dólares. Un modelo con RMSE de 3 puntos en una escala de 0-100 puede ahorrar millones al año evitando descartar lotes buenos o aprobar lotes malos. La métrica de negocio no es RMSE — es plata ahorrada.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={3} title="Caso 2: Segmentación de clientes SaaS" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Una empresa SaaS tiene datos de 5000 clientes y busca segmentos accionables.",
    "PCA reduce métricas a componentes; K-Means descubre segmentos; Random Forest predice churn.",
    "SHAP explica qué distingue a cada segmento.",
  ]}
/>

<ConceptCard variant="key-idea">
**Pipeline SaaS**
- 5000 clientes: frecuencia de uso, features utilizadas, tickets de soporte, MRR, antigüedad
- PCA para reducir 15 métricas de comportamiento a 3 componentes
- K-Means sobre las componentes para descubrir segmentos naturales
- Random Forest para clasificar riesgo de abandono dentro de cada segmento
- Interpretación con SHAP para entender qué distingue a cada segmento
</ConceptCard>

<ChoiceQuestion
  question="El modelo de abandono tiene 85% de accuracy. El CEO quiere saber: '¿cuánta plata nos ahorra esto?' ¿Cómo traducirías accuracy a impacto de negocio?"
  moduleSlug="machine-learning"
  lessonSlug="lesson10_applications"
  blockId="reflection-l10-metrics-business"
  allowContinueOnIncorrect
  explanation="Convertí predicciones en acciones y acciones en dinero: si el modelo identifica 100 en riesgo y contactás 50, retenés ~40% (20 clientes) × $500/mes = $10k/mes. La accuracy es irrelevante para el CEO; importa cuántos abandonos prevenís y cuánto vale cada uno."
  options={[
    { id: "a", label: "Contando abandonos prevenidos y su valor monetario", correct: true, feedback: "¡Correcto! La métrica clave para el CEO es impacto en dinero." },
    { id: "b", label: "Reportando directamente el 85% de accuracy", correct: false, feedback: "Falso: al CEO no le importa accuracy, sino dinero salvado." },
    { id: "c", label: "Maximizando la cantidad de predicciones correctas", correct: false, feedback: "Falso: optimizar accuracy no optimiza impacto." },
    { id: "d", label: "Extrapolando accuracy a revenue futuro sin acción", correct: false, feedback: "Falso: hace falta traducir a acciones y a dinero." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={4} title="El arte de elegir el modelo correcto" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La pregunta real: ¿qué modelo resuelve el problema de negocio con los datos que tengo?",
    "Un modelo simple bien implementado le gana a uno complejo mal ajustado. Siempre.",
    "El mejor balance combina accuracy, interpretabilidad y velocidad.",
  ]}
/>

{/* candidate-player: comparison-elegir-modelo */}
<ConceptCard variant="key-idea">
**Elegir el modelo correcto**
- ¿Interpretabilidad crítica?: Regresión lineal, Árbol de decisión, Regresión logística vs Random Forest, Gradient Boosting, XGBoost
- ¿Datos pequeños (menos de 1000 filas)?: Regresión lineal/logística, Árboles shallow vs cualquiera con regularización
- ¿Muchas features (más de 100)?: PCA + modelo lineal, Random Forest vs Red neuronal (si tienes MUCHOS datos)
- ¿Necesitas producir ya?: Random Forest con defaults vs Gradient Boosting con GridSearch
</ConceptCard>

<CalloutInfo>
La pregunta más importante no es "¿qué modelo es mejor?" sino "¿qué modelo resuelve el problema de negocio con los datos que tengo?" Un modelo simple bien implementado le gana a uno complejo mal ajustado. Siempre.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={5} title="Lo que sigue" eyebrow="RESUMEN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Completaste el módulo de Machine Learning.",
    "Sabes predecir números, clasificar, agrupar, reducir dimensiones y construir ensembles.",
    "El ML se aprende haciendo: elige un problema y cuénta la historia.",
  ]}
/>

<ConceptCard variant="key-idea">
Completaste el módulo de Machine Learning. Sabes predecir números (regresión), clasificar categorías (clasificación), agrupar sin etiquetas (clustering), reducir dimensiones (PCA), y construir ensembles (Random Forest, Gradient Boosting). Lo que sigue es practicar con datos reales. El ML se aprende haciendo.
</ConceptCard>

<CalloutCheck>
**Próximo paso:** Proyecto final donde apliques estos pipelines a un dataset de tu interés — biotecnología, SaaS, o lo que te apasione. Elige el problema, los datos, el modelo, y cuenta la historia. Eso es lo que hace un Data Scientist de verdad.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={6} title="Ejercicio final" eyebrow="EJERCICIOS">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Desafío final: construye un pipeline completo desde datos crudos hasta selección de modelo.",
    "Compara tres modelos con validación cruzada y reporta CV y test.",
    "Elige el mejor y justifica el por qué.",
  ]}
/>

<ConceptCard variant="key-idea">
**Desafío final:** Construye un pipeline completo: desde datos crudos hasta selección de modelo.
</ConceptCard>

<CodeEditor
  defaultValue={`import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

# Cargar datos
data = load_breast_cancer()
X, y = data.data, data.target

# Preprocesar
X = StandardScaler().fit_transform(X)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

# Comparar 3 modelos con validación cruzada
models = {
    'LogisticRegression': LogisticRegression(max_iter=5000),
    'RandomForest': RandomForestClassifier(n_estimators=100, random_state=42),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
}

for name, model in models.items():
    scores = cross_val_score(model, X_tr, y_tr, cv=5)
    model.fit(X_tr, y_tr)
    test_score = model.score(X_te, y_te)
    print(f"{name}: CV={scores.mean():.3f} (±{scores.std():.3f}), Test={test_score:.3f}")

# ¿Cuál elegirías y por qué?
print("\\nEl mejor modelo balancea accuracy, interpretabilidad y velocidad.")
`}
  height="400px"
/>

</RevealSequence>

</Section>
