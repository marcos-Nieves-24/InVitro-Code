
Module: 3
Lesson Number: 9
Lesson Title: Evaluación de Modelos
Estimated Duration: 75 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  Dividir datos en conjuntos de entrenamiento y prueba usando train_test_split
  Implementar validación cruzada k fold
  Calcular e interpretar MAE, MSE, RMSE y R²
  Elegir métricas de evaluación adecuadas para problemas de regresión
  Diagnosticar sobreajuste usando validación cruzada
Keywords: división train test, validación cruzada, MAE, MSE, RMSE, R², sobreajuste, sklearn.metrics
Difficulty: Intermedio
Programming Concepts: sklearn.model_selection, sklearn.metrics, numpy, pandas
Mathematical Concepts: error absoluto medio, error cuadrático medio, raíz del error cuadrático medio, coeficiente de determinación
Machine Learning Concepts: evaluación de modelos, sobreajuste, generalización, validación cruzada
Datasets Used: diabetes, California housing
Notebook: 09_model_evaluation.ipynb
Assignment: model_evaluation_assignment.md
Quiz: model_evaluation_quiz.md


<Section number={1} title="Crear modelos es fácil. Evaluarlos, no." eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Cualquiera llama a .fit(), pero saber si el modelo aprendió algo útil es otra historia.",
    "La evaluación separa la magia de la ilusión en machine learning.",
    "Lo que importa no es el error en training, sino la performance en datos nuevos.",
    "Eso se llama generalización y es el corazón de la ciencia de datos.",
  ]}
/>

<MascotMessage mood="thinking">
Cualquiera puede llamar a `.fit()`. Lo difícil es saber si el modelo realmente aprendió algo útil o solo memorizó los datos de entrenamiento. La evaluación de modelos es dónde separamos la magia de la ilusión.
</MascotMessage>

En las lecciones anteriores construiste intuición estadística. Ahora la vas a aplicar para responder la pregunta más importante en ML: **¿este modelo es bueno?** No en training   en datos qué nunca vio. Eso se llama **generalización**.

</RevealSequence>

</Section>

<Section number={2} title="Train/Test Split: la regla de oro" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "La regla de oro es separar los datos antes de entrenar.",
    "El modelo nunca debe ver el test set durante el entrenamiento.",
    "Un 70 a 80 % para train y 20 a 30 % para test es el estándar.",
    "Evaluar en training es como corregirte el examen con las respuestas.",
  ]}
/>

<ConceptCard variant="definition">
**Train/Test Split**: dividir los datos en dos conjuntos   uno para entrenar (train, ~70 a 80%) y otro para evaluar (test, ~20 a 30%). El modelo NUNCA ve el test set durante el entrenamiento.

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```
</ConceptCard>

<ConceptCard variant="key idea">
Evaluar en training es cómo corregirte tu propio examen con las respuestas adelante. El accuracy en training siempre es alto. Lo qué importa es el accuracy en test: los datos qué el modelo nunca vio.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="Validación Cruzada: más robusta" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un solo split depende de qué ejemplos cayeron en test.",
    "K fold entrena k veces, rotando el fold de validación.",
    "El promedio de las k métricas da un mejor estimado del desempeño real.",
    "La desviación estándar te dice cuán estable es el modelo.",
  ]}
/>

<ConceptCard variant="definition">
**K Fold Cross Validation**: dividir los datos en k partes (folds). Entrenar k veces, cada vez usando k 1 folds para training y 1 fold distinto para validación. El resultado es el promedio de las k métricas.
</ConceptCard>

<EquationTour caption="Validación cruzada k fold: cada fold rota como conjunto de validación.">
  <EquationStep label="Particiones">
    $k$
    Número de folds en que se divide el dataset.
  </EquationStep>
  <EquationStep label="Entrenamiento">
    $k 1$ folds
    Datos usados para ajustar el modelo en cada vuelta.
  </EquationStep>
  <EquationStep label="Validación">
    $1$ fold
    Datos no vistos para medir el error real.
  </EquationStep>
  <EquationStep label="Promedio">
    $\frac{1}{k}\sum_{i=1}^{k} m_i$
    Promedio de las k métricas: estimado robusto del desempeño.
  </EquationStep>
</EquationTour>

```python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"R² CV: {scores.mean():.3f} ± {scores.std():.3f}")
```

<ConceptCard variant="key idea">
La validación cruzada te da un intervalo de confianza sobre la performance real de tu modelo. Si la desviación estándar es alta, tu modelo es inestable   pequeños cambios en los datos lo afectan mucho.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Métricas de regresión" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "MAE, MSE, RMSE y R² responden preguntas distintas del error.",
    "MAE es robusto a outliers y se interpreta en unidades originales.",
    "MSE penaliza los errores grandes por el cuadrado.",
    "RMSE devuelve el error a unidades originales; R² dice cuánto explica el modelo.",
  ]}
/>

<ConceptCard variant="definition">
**MAE** (Mean Absolute Error): $\frac{1}{n}\sum |y_i \hat{y}_i|$   error promedio en unidades originales. Robusto a outliers.

**MSE** (Mean Squared Error): $\frac{1}{n}\sum (y_i \hat{y}_i)^2$   penaliza errores grandes más fuerte.

**RMSE** (Root MSE): $\sqrt{\text{MSE}}$   cómo MSE pero en unidades originales, interpretable.

**R²** (Coeficiente de determinación): proporción de varianza explicada. 1.0 = perfecto, 0 = siempre predice la media, negativo = peor qué la media.
</ConceptCard>

<EquationTour caption="R²: cuánta varianza de y captura el modelo.">
  <EquationStep label="Error residual">
    $SS_{\text{res}} = \sum (y_i \hat{y}_i)^2$
    Suma de los errores al cuadrado del modelo.
  </EquationStep>
  <EquationStep label="Varianza total">
    $SS_{\text{tot}} = \sum (y_i \bar{y})^2$
    Suma de los errores al cuadrado de la media.
  </EquationStep>
  <EquationStep label="Cociente">
    $R^2 = 1 \frac{SS_{\text{res}}}{SS_{\text{tot}}}$
    1 si no hay error residual; 0 si el modelo apenas iguala a la media.
  </EquationStep>
  <EquationStep label="Interpretación">
    $R^2 \in (-\infty, 1]$
    Valores negativos indican modelo peor que predecir la media.
  </EquationStep>
</EquationTour>

<ConceptCard variant="key idea">
MAE vs RMSE:
- **Unidad**: ambas en unidades originales (ej. dólares)
- **Outliers**: MAE robusto; RMSE muy sensible (penaliza fuerte)
- **Interpretación**: MAE error típico promedio; RMSE error típico penalizando grandes
- **Cuándo usar**: MAE si todos los errores son igualmente costosos; RMSE si los errores grandes son catastróficos
</ConceptCard>

</RevealSequence>

</Section>

<Section number={5} title="Overfitting: el enemigo #1" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El sobreajuste ocurre cuando el modelo memoriza el ruido del training.",
    "Se detecta cuando el accuracy de training es mucho mayor que el de test.",
    "Alta varianza entre folds de CV es otro síntoma claro.",
    "El antídoto: más datos, menos features, modelos más simples, regularización.",
  ]}
/>

<ConceptCard variant="warning">
**Overfitting (sobreajuste)**: El modelo memoriza el ruido del training set en vez de aprender patrones generalizables.

Síntomas:
- Accuracy training >> accuracy test
- Alta varianza entre folds de CV
- Modelo demasiado complejo para los datos disponibles
</ConceptCard>

<CalloutInfo>
**Antídoto**: validación cruzada, regularización, más datos, menos features, modelos más simples. Si tu modelo es perfecto en training pero malo en test, felicitaciones   descubriste overfitting. Simplifica.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={6} title="Evaluación en código" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El flujo completo: split, ajuste, predicción y métricas sobre el test.",
    "Luego validación cruzada repite el experimento varias veces.",
    "Esto te da media y desviación del desempeño real del modelo.",
    "Los números por sí solos no deciden: se comparan con un baseline.",
  ]}
/>

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

<ChoiceQuestion
  question="R² = 0.60 en el test set. ¿Es bueno o malo? ¿Qué significa exactamente?"
  moduleSlug="estadistica"
  lessonSlug="lesson09_model_evaluation"
  blockId="reflection l09 interpret r2"
  allowContinueOnIncorrect
  explanation="Explica el 60 % de la varianza de la variable objetivo; el juicio depende del campo (sociales vs física) y exige comparación con un baseline (predecir la media o un modelo más simple)."
  options={[
    { id: "a", label: "Es siempre excelente, sin importar la disciplina ni el baseline", correct: false, feedback: "No: en física 0.60 sería inaceptable; el contexto define el estándar." },
    { id: "b", label: "Explica el 60 % de la varianza y solo tiene sentido comparándolo con un baseline según el contexto", correct: true, feedback: "¡Correcto! R² es relativo al campo y al modelo base." },
    { id: "c", label: "Es inaceptable en cualquier ciencia o aplicación práctica", correct: false, feedback: "No: en ciencias sociales 0.60 puede ser excelente." },
    { id: "d", label: "Un R² del 60 % garantiza rentabilidad si se usa para decidir", correct: false, feedback: "En finanzas depende de si ganas plata; la métrica sola no garantiza beneficio." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={7} title="Checkpoint" eyebrow="EVALUACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El checkpoint aclara dos trampas comunes de evaluación.",
    "Evaluar en training mide memoria, no aprendizaje.",
    "La elección entre MAE y RMSE depende del costo de los errores.",
    "No es tamaño de dataset ni disponibilidad de scikit learn.",
  ]}
/>

<ChoiceQuestion
  question="¿Por qué no evaluamos en el training set?"
  moduleSlug="estadistica"
  lessonSlug="lesson09_model_evaluation"
  blockId="choice estadistica l09 rev 1"
  allowContinueOnIncorrect
  explanation="El modelo ya vio esos datos y puede memorizarlos: el accuracy en training mide memoria, no aprendizaje. Sólo el test set (datos no vistos) mide la generalización que importa en producción."
  options={[
    { id: "a", label: "Porque el modelo ya vio esos datos (puede memorizarlos) y sólo el test set mide generalización", correct: true, feedback: "¡Exacto! El test set es el único que estima desempeño en producción." },
    { id: "b", label: "Porque el training set es siempre demasiado pequeño para evaluar", correct: false, feedback: "El tamaño no es la razón; el problema es que el modelo ya memorizó esos datos." },
    { id: "c", label: "Porque scikit learn no permite evaluar sobre el training set", correct: false, feedback: "Sí permite, pero el resultado no refleja generalización." },
    { id: "d", label: "Porque las etiquetas del training set siempre tienen errores", correct: false, feedback: "No necesariamente; el problema es memorización, no calidad de etiquetas." },
  ]}
/>

<ChoiceQuestion
  question="¿MAE o RMSE? ¿Cuándo elegir cuál?"
  moduleSlug="estadistica"
  lessonSlug="lesson09_model_evaluation"
  blockId="choice estadistica l09 rev 2"
  allowContinueOnIncorrect
  explanation="MAE si todos los errores son igualmente costosos (ej. predecir temperatura); RMSE si los errores grandes son particularmente graves y querés penalizarlos más (ej. dosis de medicamento)."
  options={[
    { id: "a", label: "MAE si todos los errores costan igual; RMSE si los errores grandes son graves (penalización cuadrática)", correct: true, feedback: "¡Exacto! RMSE castiga más los errores grandes por el cuadrado." },
    { id: "b", label: "Siempre RMSE porque es la métrica más precisa", correct: false, feedback: "RMSE amplifica outliers; si todos los errores valen igual, MAE es más honesta." },
    { id: "c", label: "Siempre MAE porque es más robusta", correct: false, feedback: "Si un error grande es crítico (dosis), conviene RMSE para castigarlo." },
    { id: "d", label: "Elegir por el tamaño del dataset: MAE para datos grandes", correct: false, feedback: "La elección depende del costo de cada error, no del tamaño del dataset." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={8} title="Términos clave" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Consolidamos el vocabulario de evaluación de modelos.",
    "Train/test, validación cruzada, MAE, RMSE, R² y overfitting.",
    "Generalización es el único métrica que importa en producción.",
    "Esto distingue a un científico de datos senior.",
  ]}
/>

<ConceptCard variant="key idea">
Términos clave:
- **Train/Test Split**: Dividir datos: 70 a 80% train, 20 a 30% test
- **Validación Cruzada**: k fold: entrenar k veces, promediar métricas
- **MAE**: Error absoluto medio   robusto a outliers
- **MSE**: Error cuadrático medio   penaliza errores grandes
- **RMSE**: Raíz del MSE   en unidades originales, interpretable
- **R²**: Proporción de varianza explicada (1 = perfecto)
- **Overfitting**: El modelo memoriza training, falla en test
- **Generalización**: Performance en datos no vistos   lo que importa
</ConceptCard>

</RevealSequence>

</Section>

<Section number={9} title="Para la última lección" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Ya sabes evaluar modelos: split, CV, métricas y overfitting.",
    "Ese es el toolkit que separa modelos buenos de malos.",
    "La última lección cierra el módulo comunicando resultados.",
    "Porque el mejor análisis no sirve si nadie lo entiende.",
  ]}
/>

<MascotMessage mood="celebrating">
Ya sabes evaluar modelos. Train/test split, validación cruzada, MAE, RMSE y R²: tienes el toolkit completo para separar modelos buenos de malos. Esto es lo que distingue a un científico de datos senior.
</MascotMessage>

**En la Lección 10** cerramos el módulo con **Narración de Datos**: cómo comunicar tus hallazgos. Porque de nada sirve el mejor análisis si no puedes explicarlo. Vas a aprender a contar historias con datos qué convenzan a cualquier audiencia.

</RevealSequence>

</Section>
