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

<MascotMessage mood="celebrating">
¡Llegaste a la lección final! Nueve algoritmos después, es hora de integrar todo en pipelines reales. Esto es lo que hace un ML Engineer en producción: tomar datos crudos, preprocesarlos, seleccionar el modelo correcto, y comunicar resultados.
</MascotMessage>

No aprendiste algoritmos en el vacío — aprendiste herramientas. Esta lección te muestra cómo combinarlas en flujos de trabajo reales que resuelven problemas de negocio y de ciencia.

<ConceptCard variant="key-idea">
Un pipeline de ML completo tiene 5 etapas: (1) entender el problema y los datos, (2) preprocesar y limpiar, (3) seleccionar y entrenar modelos, (4) evaluar con las métricas correctas, (5) comunicar resultados. Los algoritmos son solo la etapa 3.
</ConceptCard>

</Section>

<Section number={2} title="Caso 1: Calidad en biomanufactura" eyebrow="APLICACIÓN">

Una empresa produce proteínas terapéuticas. Cada lote mide: temperatura del biorreactor, pH, concentración de nutrientes, tiempo de fermentación, velocidad de agitación. El objetivo: **predecir el puntaje de calidad** (0-100) para decidir si un lote se aprueba o se descarta.

**Pipeline:**
- Features numéricas → `StandardScaler`
- Modelos a comparar: `LinearRegression`, `RandomForestRegressor`, `GradientBoostingRegressor`
- Métrica: RMSE (necesitas saber cuánto te equivocas en la escala de calidad)
- Hiperparámetros: `GridSearchCV` para encontrar la mejor combinación

<CalloutCheck>
En manufactura real, cada lote descartado cuesta miles de dólares. Un modelo con RMSE de 3 puntos en una escala de 0-100 puede ahorrar millones al año evitando descartar lotes buenos o aprobar lotes malos. La métrica de negocio no es RMSE — es plata ahorrada.
</CalloutCheck>

</Section>

<Section number={3} title="Caso 2: Segmentación de clientes SaaS" eyebrow="APLICACIÓN">

Una empresa SaaS tiene datos de 5000 clientes: frecuencia de uso, features utilizadas, tickets de soporte, MRR, antigüedad. Quiere **segmentarlos en grupos accionables** y predecir abandono.

**Pipeline:**
- PCA para reducir 15 métricas de comportamiento a 3 componentes
- K-Means sobre las componentes para descubrir segmentos naturales
- Random Forest para clasificar riesgo de abandono dentro de cada segmento
- Interpretación con SHAP para entender qué distingue a cada segmento

<ReflectionCheck
  blockId="reflection-l10-metrics-business"
  moduleSlug="machine-learning"
  lessonSlug="lesson10_applications"
  prompt="El modelo de abandono tiene 85% de accuracy. El CEO quiere saber: '¿cuánta plata nos ahorra esto?' ¿Cómo traducirías accuracy a impacto de negocio?"
  answer="Convierte las predicciones en acciones y las acciones en dinero. Ejemplo: si el modelo identifica 100 clientes en riesgo y contactas a 50, asumiendo que retienes al 40% de los contactados (20 clientes), y cada cliente vale $500/mes → ahorraste $10,000/mes. La accuracy es irrelevante para el CEO — lo que importa es: ¿cuántos abandonos previenes y cuánto vale cada uno?"
/>

</Section>

<Section number={4} title="El arte de elegir el modelo correcto" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "¿Interpretabilidad crítica?", left: "Regresión lineal, Árbol de decisión, Regresión logística", right: "Random Forest, Gradient Boosting, XGBoost" },
    { feature: "¿Datos pequeños (<1000 filas)?", left: "Regresión lineal/logística, Árboles shallow", right: "Cualquiera con regularización" },
    { feature: "¿Muchas features (>100)?", left: "PCA + modelo lineal, Random Forest", right: "Red neuronal (si tienes MUCHOS datos)" },
    { feature: "¿Necesitas producir ya?", left: "Random Forest con defaults", right: "Gradient Boosting con GridSearch" },
  ]}
/>

<CalloutInfo>
La pregunta más importante no es "¿qué modelo es mejor?" sino "¿qué modelo resuelve el problema de negocio con los datos que tengo?" Un modelo simple bien implementado le gana a uno complejo mal ajustado. Siempre.
</CalloutInfo>

</Section>

<Section number={5} title="Lo que sigue" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
Completaste el módulo de Machine Learning. Sabes predecir números (regresión), clasificar categorías (clasificación), agrupar sin etiquetas (clustering), reducir dimensiones (PCA), y construir ensembles (Random Forest, Gradient Boosting). Lo que sigue es practicar con datos reales. El ML se aprende haciendo.
</ConceptCard>

<CalloutCheck>
**Próximo paso:** Proyecto final donde apliques estos pipelines a un dataset de tu interés — biotecnología, SaaS, o lo que te apasione. Elige el problema, los datos, el modelo, y cuenta la historia. Eso es lo que hace un Data Scientist de verdad.
</CalloutCheck>

</Section>

<Section number={6} title="Ejercicio final" eyebrow="EJERCICIOS">

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

</Section>
