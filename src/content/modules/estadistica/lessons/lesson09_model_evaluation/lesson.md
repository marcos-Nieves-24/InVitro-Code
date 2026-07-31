---
Module: 3
Lesson Number: 9
Lesson Title: Evaluación de Modelos
Estimated Duration: 75 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  - Dividir datos en conjuntos de entrenamiento y prueba usando train_test_split
  - Implementar validación cruzada k-fold
  - Calcular e interpretar MAE, MSE, RMSE y R²
  - Elegir métricas de evaluación adecuadas para problemas de regresión
  - Diagnosticar sobreajuste usando validación cruzada
Keywords: división train-test, validación cruzada, MAE, MSE, RMSE, R², sobreajuste, sklearn.metrics
Difficulty: Intermedio
Programming Concepts: sklearn.model_selection, sklearn.metrics, numpy, pandas
Mathematical Concepts: error absoluto medio, error cuadrático medio, raíz del error cuadrático medio, coeficiente de determinación
Machine Learning Concepts: evaluación de modelos, sobreajuste, generalización, validación cruzada
Datasets Used: diabetes, California housing
Notebook: 09_model_evaluation.ipynb
Assignment: model_evaluation_assignment.md
Quiz: model_evaluation_quiz.md
---

<Section number={1} title="Crear modelos es fácil. Evaluarlos, no." eyebrow="INICIO">

<MascotMessage mood="curious">
Cualquiera puede llamar a `.fit()`. Lo difícil es saber si el modelo realmente aprendió algo útil o sólo memorizó los datos de entrenamiento. La evaluación de modelos es dónde separamos la magia de la ilusión.
</MascotMessage>

En las lecciones anteriores construiste intuición estadística. Ahora la vas a aplicar para responder la pregunta más importante en ML: **¿este modelo es bueno?** No en training — en datos qué nunca vio. Eso se llama **generalización**.

</Section>

<Section number={2} title="Train/Test Split: la regla de oro" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Train/Test Split**: dividir los datos en dos conjuntos — uno para entrenar (train, ~70-80%) y otro para evaluar (test, ~20-30%). El modelo NUNCA ve el test set durante el entrenamiento.

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```
</ConceptCard>

<ConceptCard variant="key-idea">
Evaluar en training es cómo corregirte tu propio examen con las respuestas adelante. El accuracy en training siempre es alto. Lo qué importa es el accuracy en test: los datos qué el modelo nunca vio.
</ConceptCard>

</Section>

<Section number={3} title="Validación Cruzada: más robusta" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**K-Fold Cross-Validation**: dividir los datos en k partes (folds). Entrenar k veces, cada vez usando k-1 folds para training y 1 fold distinto para validación. El resultado es el promedio de las k métricas.
</ConceptCard>

```python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"R² CV: {scores.mean():.3f} ± {scores.std():.3f}")
```

<ConceptCard variant="key-idea">
La validación cruzada te da un intervalo de confianza sobre la performance real de tu modelo. Si la desviación estándar es alta, tu modelo es inestable — pequeños cambios en los datos lo afectan mucho.
</ConceptCard>

</Section>

<Section number={4} title="Métricas de regresión" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**MAE** (Mean Absolute Error): $\frac{1}{n}\sum |y_i - \hat{y}_i|$ — error promedio en unidades originales. Robusto a outliers.

**MSE** (Mean Squared Error): $\frac{1}{n}\sum (y_i - \hat{y}_i)^2$ — penaliza errores grandes más fuerte.

**RMSE** (Root MSE): $\sqrt{\text{MSE}}$ — cómo MSE pero en unidades originales, interpretable.

**R²** (Coeficiente de determinación): proporción de varianza explicada. 1.0 = perfecto, 0 = siempre predice la media, negativo = peor qué la media.
</ConceptCard>

<ComparisonTable
  rows={[
    { feature: "Unidad", left: "Original (ej. dólares)", right: "Original (ej. dólares)" },
    { feature: "Outliers", left: "Robusto", right: "Muy sensible (penaliza fuerte)" },
    { feature: "Interpretación", left: "Error típico promedio", right: "Error típico (penalizando grandes)" },
    { feature: "Cuándo usar", left: "Errores uniformemente costosos", right: "Errores grandes son catastróficos" },
  ]}
/>

</Section>

<Section number={5} title="Overfitting: el enemigo #1" eyebrow="CONCEPTO">

<ConceptCard variant="warning">
**Overfitting (sobreajuste)**: El modelo memoriza el ruido del training set en vez de aprender patrones generalizables.

Síntomas:
- Accuracy training >> accuracy test
- Alta varianza entre folds de CV
- Modelo demasiado complejo para los datos disponibles
</ConceptCard>

<CalloutInfo>
**Antídoto**: validación cruzada, regularización, más datos, menos features, modelos más simples. Si tu modelo es perfecto en training pero malo en test, felicitaciones — descubriste overfitting. Simplificá.
</CalloutInfo>

</Section>

<Section number={6} title="Evaluación en código" eyebrow="INTERACTIVA">

```python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# Cargar datos
from sklearn.datasets import fetch_california_housing
X, y = fetch_california_housing(return_X_y=True)

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modelo
model = LinearRegression()
model.fit(X_train, y_train)

# Predicciones
y_pred = model.predict(X_test)

# Métricas
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"MAE:  {mae:.3f}")
print(f"RMSE: {rmse:.3f}")
print(f"R²:   {r2:.3f}")

# Validación cruzada
cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"R² CV: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
```

<ReflectionCheck
  blockId="reflection-l09-interpret-r2"
  moduleSlug="estadistica"
  lessonSlug="lesson09_model_evaluation"
  prompt="R² = 0.60 en el test set. ¿Es bueno o malo? ¿Qué significa exactamente?"
  answer="Significa qué el modelo explica el 60% de la varianza de la variable objetivo. No es ni bueno ni malo en abstracto — depende del contexto. En ciencias sociales, R²=0.60 puede ser excelente. En física, sería inaceptable. En finanzas, depende de si ganás plata con ese 60%. Lo importante es comparar con un baseline: ¿cuál es el R² de predecir siempre la media? ¿Y de un modelo más simple? R² sólo no te dice nada sin contexto."
/>

</Section>

<Section number={7} title="Checkpoint" eyebrow="EVALUACIÓN">

<AnswerReveal summary="Ver respuestas">
<p><strong>¿Por qué no evaluamos en el training set?</strong> Porque el modelo ya "vio" esos datos — los puede memorizar. Accuracy en training mide memoria, no aprendizaje. Sólo el test set (datos no vistos) mide generalización, qué es lo qué realmente nos importa en producción.</p>
<p><strong>¿MAE o RMSE? ¿Cuándo elegir cuál?</strong> MAE si todos los errores son igualmente costosos (ej. predecir temperatura). RMSE si los errores grandes son particularmente graves y querés penalizarlos más (ej. predecir dosis de medicamento — un error de 10× puede matar).</p>
</AnswerReveal>

</Section>

<Section number={8} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["Train/Test Split", "Dividir datos: 70-80% train, 20-30% test"],
    ["Validación Cruzada", "k-fold: entrenar k veces, promediar métricas"],
    ["MAE", "Error absoluto medio — robusto a outliers"],
    ["MSE", "Error cuadrático medio — penaliza errores grandes"],
    ["RMSE", "Raíz del MSE — en unidades originales, interpretable"],
    ["R²", "Proporción de varianza explicada (1 = perfecto)"],
    ["Overfitting", "El modelo memoriza training, falla en test"],
    ["Generalización", "Performance en datos no vistos — lo qué importa"],
  ]}
  searchable={true}
  caption="Términos clave de evaluación de modelos"
/>

</Section>

<Section number={9} title="Para la última lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
¡Sabés evaluar modelos! Train/test split, validación cruzada, MAE, RMSE, R² — tenés el toolkit completo para separar modelos buenos de malos. Esto es lo qué hace un científico de datos senior.
</MascotMessage>

**En la Lección 10** cerramos el módulo con **Narración de Datos**: cómo comunicar tus hallazgos. Porque de nada sirve el mejor análisis si no podés explicarlo. Vas a aprender a contar historias con datos qué convenzan a cualquier audiencia.

</Section>
