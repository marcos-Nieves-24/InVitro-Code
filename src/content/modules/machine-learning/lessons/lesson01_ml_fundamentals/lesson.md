---
Module: 4
Lesson Number: 1
Lesson Title: Fundamentos de ML
Estimated Duration: 75 minutos
Prerequisites: Módulo 3 (Estadística para Aprendizaje Automático)
Learning Objectives:
  - Explicar qué es el Aprendizaje Automático y cómo difiere de la programación tradicional
  - Definir características, etiquetas, entrenamiento y predicción
  - Distinguir entre aprendizaje supervisado y no supervisado
  - Diagnosticar sobreajuste y subajuste a partir de curvas de aprendizaje
  - Explicar la compensación sesgo-varianza con ejemplos
Keywords: aprendizaje supervisado, aprendizaje no supervisado, características, etiquetas, sobreajuste, subajuste, compensación sesgo-varianza, generalización
Difficulty: Principiante
Programming Concepts: train_test_split, model.fit, model.predict
Mathematical Concepts: varianza, sesgo, error cuadrático medio
Machine Learning Concepts: conjunto de entrenamiento, conjunto de prueba, generalización, sobreajuste, subajuste
Datasets Used: scikit-learn diabetes, sinusoidal sintético
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Fundamentos de ML

<Section number={1} title="De reglas programadas a reglas aprendidas" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un patólogo mira al microscopio una muestra de un paciente: miles de células, ningún manual escrito.",
    "¿Cómo decides cuáles son malignas sin una regla programada a mano?",
    "El Aprendizaje Automático descubre esos patrones directamente desde los datos.",
  ]}
/>

<ConceptCard variant="key-idea">
El ML aprende reglas a partir de ejemplos etiquetados, no de instrucciones explícitas; su objetivo es generalizar a casos nuevos.
</ConceptCard>

<ChoiceQuestion
  question="Si le mostráramos mil fotos de lunares benignos y malignos al programa, ¿qué esperas que aprenda?"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  blockId="choice-ml-l01-s1-1"
  allowContinueOnIncorrect
  explanation="El modelo no memoriza nombres: aprende patrones que distinguen las clases y luego generaliza a lunares nuevos."
  options={[
    { id: "a", label: "Patrones que distinguen malignos de benignos", correct: true, feedback: "¡Exacto! Eso es generalizar a partir de ejemplos." },
    { id: "b", label: "Una lista fija de nombres de archivos", correct: false, feedback: "Eso no predice en casos nuevos." },
    { id: "c", label: "La regla escrita por un médico", correct: false, feedback: "El ML no sigue reglas escritas; las aprende." },
    { id: "d", label: "Nada útil", correct: false, feedback: "Con ejemplos etiquetados sí puede aprender." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={2} title="¿Dónde estamos parados?" eyebrow="CONTEXTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Antes de este módulo describiste datos con estadística.",
    "Ahora ves cómo un algoritmo aprende de esos datos.",
    "Después seguirá regresión lineal, donde todo esto cobra vida.",
  ]}
/>

<ConceptCard variant="key-idea">
Antes de lanzarte a implementar algoritmos, necesitas entender los fundamentos: ¿qué significa que un modelo "aprenda"? ¿Cómo sabes si aprendió bien? ¿Por qué un modelo perfecto en entrenamiento puede fallar estrepitosamente en producción?
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="¿Qué es el Aprendizaje Automático?" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "¿Cáncer o infección? Algunas decisiones son números, otras son categorías.",
    "La programación tradicional te obliga a escribir cada regla a mano.",
    "El ML invierte el flujo: datos + respuestas → reglas aprendidas.",
    "Le damos ejemplos y la computadora descubre el patrón subyacente.",
  ]}
/>

{/* candidate-player: comparison-tradicional-vs-ml */}
<ConceptCard variant="key-idea">
**Programación tradicional vs Aprendizaje Automático**
- Enfoque: tradicional = reglas + datos; ML = datos + respuestas.
- Entrada: reglas + datos vs datos + respuestas.
- Salida: respuestas vs reglas.
- Ejemplo: if spam_words > 3: marcar_spam() vs mostrar 10.000 emails etiquetados y que el modelo descubra los patrones.
- Cuándo usarlo: problemas con reglas claras y estables vs problemas donde las reglas son difíciles de expresar o cambian con el tiempo.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Vocabulario que vas a usar todo el curso" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<ConceptCard variant="definition">
**Característica (X):** Una variable de entrada usada para hacer predicciones. Cantidad de habitaciones en una casa, nivel de expresión génica, días desde el último inicio de sesión. Todo lo que *mides* para predecir algo.
</ConceptCard>

<ConceptCard variant="definition">
**Etiqueta (y):** La variable de salida que queremos predecir. Precio de una casa, estado de enfermedad, probabilidad de abandono. Es lo que quieres *saber*.
</ConceptCard>

<ConceptCard variant="definition">
**Entrenamiento:** El proceso donde el modelo aprende patrones a partir de los datos ajustando sus parámetros internos. Es como estudiar para un examen.
</ConceptCard>

<ConceptCard variant="definition">
**Predicción:** Usar el modelo entrenado con datos nuevos que nunca vio. Es como rendir el examen.
</ConceptCard>

<CalloutInfo>
Regla de oro: el modelo solo puede aprender de los datos que ve durante el entrenamiento. Si tus datos de entrenamiento tienen sesgos, tu modelo también los tendrá. Garbage in, garbage out.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={5} title="Supervisado vs No Supervisado" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

{/* candidate-player: comparison-supervisado-vs-nosupervisado */}
<ConceptCard variant="key-idea">
**Aprendizaje supervisado vs no supervisado**
- Datos de entrenamiento: tienen etiquetas (sabemos la respuesta correcta) vs sin etiquetas (solo características).
- Objetivo: predecir etiquetas para datos nuevos vs encontrar estructura oculta.
- Ejemplos: regresión y clasificación vs clustering y PCA.
- Analogía: un profesor que corrige vs explorar una biblioteca sin catálogo.
- En este módulo: Lecciones 1-5 y 8 vs Lecciones 6 y 7.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="Generalización: el verdadero objetivo" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<ConceptCard variant="key-idea">
La **generalización** es la capacidad del modelo de funcionar bien con datos *que nunca vio*. Este es el verdadero objetivo del ML — no memorizar los datos de entrenamiento, sino aprender patrones que se transfieran a situaciones nuevas.
</ConceptCard>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Memorizar no es aprender: un modelo debe funcionar con datos nunca vistos.",
    "La división train/test es la prueba mínima de generalización.",
    "Si solo funciona con los datos de entrenamiento, no sirve en producción.",
  ]}
/>

<CalloutInfo>
La división train/test es la herramienta más básica para medir generalización: entrenas con una parte de los datos y evalúas con otra que el modelo nunca vio.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={7} title="Los dos enemigos: sobreajuste y subajuste" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

{/* candidate-player: comparison-sobreajuste-vs-subajuste */}
<ConceptCard variant="key-idea">
**Sobreajuste vs subajuste**
- Sobreajuste: el modelo memoriza entrenamiento, incluyendo ruido → train ≈100%, test mucho más bajo.
- Subajuste: el modelo es demasiado simple → train y test bajos.
- Causa típica: modelo complejo (sobreajuste) vs modelo simple o falta de features (subajuste).
- Analogía: memorizar cada palabra sin aplicar vs solo leer el título del capítulo.
</ConceptCard>

<ChoiceQuestion
  question="Entrenas un modelo y obtienes precisión en entrenamiento = 99% y precisión en prueba = 65%. ¿Qué está pasando y qué harías para solucionarlo?"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  blockId="reflection-l01-overfit-underfit"
  allowContinueOnIncorrect
  explanation="Es sobreajuste (train 99% vs test 65%): el modelo memorizó entrenamiento y no generaliza. Probar: (1) simplificar (reducir complejidad), (2) más datos de entrenamiento, (3) regularización."
  options={[
    { id: "a", label: "Hay sobreajuste: simplificar el modelo, agregar datos y regularizar", correct: true, feedback: "¡Correcto! El gap train/test revela sobreajuste, no generalización." },
    { id: "b", label: "Hay subajuste: conviene aumentar la complejidad", correct: false, feedback: "Falso: train 99% descarta subajuste; el problema es generalización." },
    { id: "c", label: "El 99% de train garantiza buen modelo; sólo recalcular la métrica", correct: false, feedback: "Falso: accuracy de train alta no implica buen rendimiento en datos nuevos." },
    { id: "d", label: "Falta más entrenamiento con los mismos datos para mejorar test", correct: false, feedback: "Falso: más épocas empeoran la memorización del ruido." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={8} title="La compensación sesgo-varianza" eyebrow="MATEMÁTICA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El error esperado se descompone en tres fuentes.",
    "Sesgo alto genera subajuste; varianza alta genera sobreajuste.",
    "El error irreducible es el ruido del problema.",
  ]}
/>

$$\text{Error} = \text{Sesgo}^2 + \text{Varianza} + \text{Error irreducible}$$

<ConceptCard variant="definition">
**Sesgo:** Error por suposiciones demasiado simplificadoras. Sesgo alto → subajuste. Es como disparar consistentemente lejos del blanco.

**Varianza:** Error por sensibilidad a pequeñas fluctuaciones en los datos. Varianza alta → sobreajuste. Es como disparar por todos lados sin consistencia.

**Error irreducible:** Ruido inherente al problema que ningún modelo puede eliminar.
</ConceptCard>

<ConceptCard variant="key-idea">
**La compensación:** A medida que aumentas la complejidad del modelo, el sesgo baja (capturas más patrones) pero la varianza sube (empiezas a capturar ruido). El modelo óptimo encuentra el equilibrio. No existe un modelo perfecto para todo — existe el modelo adecuado para tu problema.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={9} title="Visualiza el sesgo y la varianza" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Verás la compensación sesgo-varianza en acción.",
    "Grado 1 subajusta, grado 4 ajusta bien, grado 15 sobreajusta.",
    "Ejecuta el código en tu notebook y compara los tres paneles.",
  ]}
/>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

np.random.seed(42)
X = np.linspace(0, 1, 20).reshape(-1, 1)
y = np.sin(2 * np.pi * X).ravel() + np.random.normal(0, 0.2, 20)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

degrees = [1, 4, 15]
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

for i, deg in enumerate(degrees):
    poly = PolynomialFeatures(degree=deg)
    X_poly_train = poly.fit_transform(X_train)
    X_poly_test = poly.transform(X_test)

    model = LinearRegression()
    model.fit(X_poly_train, y_train)

    y_train_pred = model.predict(X_poly_train)
    y_test_pred = model.predict(X_poly_test)

    X_plot = np.linspace(0, 1, 200).reshape(-1, 1)
    y_plot = model.predict(poly.transform(X_plot))

    axes[i].scatter(X_train, y_train, label='Train', alpha=0.6)
    axes[i].scatter(X_test, y_test, label='Test', alpha=0.6)
    axes[i].plot(X_plot, y_plot, 'r-', label='Model', linewidth=2)
    axes[i].set_title(f'Grado {deg}')
    axes[i].legend()
    axes[i].set_ylim(-1.5, 1.5)

    train_mse = mean_squared_error(y_train, y_train_pred)
    test_mse = mean_squared_error(y_test, y_test_pred)
    print(f"Grado {deg}: Train MSE = {train_mse:.4f}, Test MSE = {test_mse:.4f}")

plt.tight_layout()
plt.show()
```

<CalloutInfo>
Ejecuta este código en tu notebook. Vas a ver tres paneles:
- **Grado 1 (subajuste):** Una línea recta que ni siquiera pasa cerca de los puntos. Sesgo altísimo.
- **Grado 4 (buen ajuste):** La curva sigue la tendencia de los datos sin perseguir cada punto. Equilibrio justo.
- **Grado 15 (sobreajuste):** La curva zigzaguea para tocar cada punto de entrenamiento. En datos nuevos sería un desastre.
</CalloutInfo>

<Overfitting caption="Cambiá el grado del polinomio y mirá el error en train vs test: el sobreajuste se ve en la brecha." />

<Overfitting caption="Cambiá el grado del polinomio y mirá el error en train vs test: el sobreajuste se ve en la brecha." />

</RevealSequence>

</Section>

<Section number={10} title="Tu primer pipeline de ML" eyebrow="CÓDIGO">

<RevealSequence mode="appear">

<ConceptCard variant="key-idea">
El pipeline mínimo de ML tiene tres pasos: dividir los datos, entrenar el modelo, y evaluar con datos que el modelo nunca vio. Esto se repite en absolutamente todos los algoritmos del curso.
</ConceptCard>

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import load_diabetes

data = load_diabetes()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

# Paso 1: Dividir (NUNCA entrenes con todos los datos)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Paso 2: Entrenar
model = LinearRegression()
model.fit(X_train, y_train)

# Paso 3: Evaluar con datos NO VISTOS
y_pred = model.predict(X_test)

print(f"Train R²: {model.score(X_train, y_train):.3f}")
print(f"Test R²:  {model.score(X_test, y_test):.3f}")
print(f"Test MSE: {mean_squared_error(y_test, y_pred):.1f}")

# El modelo explica ~45% de la varianza en la progresión de la enfermedad
```

<CalloutCheck>
Si el R² de entrenamiento es mucho mayor que el de prueba, tu modelo está sobreajustando. Si ambos son bajos, está subajustando. El gap entre train y test es tu primer indicador de salud del modelo.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={11} title="ML en biotecnología: expresión génica" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

<ConceptCard variant="key-idea">
En biotecnología, el ML conecta datos moleculares con resultados clínicos. Es el puente entre el laboratorio húmedo y la medicina personalizada.
</ConceptCard>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Imagina datos de expresión génica de pacientes con cáncer.",
    "Quieres predecir qué pacientes responderán a un fármaco.",
    "El modelo aprende qué combinaciones de genes predicen la respuesta.",
    "Así evitas quimioterapia innecesaria en no respondedores.",
  ]}
/>

<ConceptCard variant="key-idea">
**Caso biotecnología: expresión génica**
- Características (X): niveles de expresión de 1000 genes.
- Etiqueta (y): respondedor (1) o no respondedor (0).
</ConceptCard>

</RevealSequence>

</Section>

<Section number={12} title="ML en SaaS: predicción de abandono" eyebrow="APLICACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Una empresa SaaS quiere predecir quiénes cancelarán el próximo mes.",
    "Las features son comportamientos de uso del producto.",
    "Intervenir antes es el valor real del modelo.",
  ]}
/>

<ConceptCard variant="key-idea">
**Caso SaaS: predicción de abandono**
- Características: frecuencia de inicio de sesión, tickets de soporte abiertos, días desde último login, tipo de plan, cantidad de features usadas.
- Etiqueta: abandonó (1) o no (0).
- El modelo aprende patrones como: "usuarios que no inician sesión por >30 días Y abrieron >3 tickets = 85% probabilidad de abandono".
</ConceptCard>

<ChoiceQuestion
  question="En el caso de SaaS, ¿por qué es importante predecir el abandono *antes* de que ocurra en lugar de simplemente registrar quién abandonó?"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  blockId="reflection-l01-saas-churn"
  allowContinueOnIncorrect
  explanation="Predecir antes permite actuar (descuento, onboarding personalizado, contacto), convirtiendo un problema reactivo en proactivo. Si sólo registras quién abandonó, ya es tarde, ese cliente se fue."
  options={[
    { id: "a", label: "Porque permite actuar a tiempo y convertirlo en proactivo", correct: true, feedback: "¡Correcto! La predicción temprana habilita intervención real." },
    { id: "b", label: "Porque registrar quién abandonó alcanza para el reporting", correct: false, feedback: "Falso: eso ya no permite recuperar al cliente." },
    { id: "c", label: "Porque esperar al abandono evita contactos innecesarios", correct: false, feedback: "Falso: perder al cliente cuesta más que contactarlo antes." },
    { id: "d", label: "La predicción sólo sirve para reportes históricos", correct: false, feedback: "Falso: su valor está en habilitar acciones preventivas." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={13} title="Los 4 errores que todo principiante comete" eyebrow="PELIGROS">

<RevealSequence mode="appear">

<CalloutInfo>
1. **Entrenar con todos los datos y después dividir.** Haces trampa sin darte cuenta: el modelo ya "vio" los datos de prueba durante el preprocesamiento. Siempre divide primero.

2. **Usar el conjunto de prueba para ajustar hiperparámetros.** El conjunto de prueba es sagrado — solo se toca una vez al final. Para ajustar parámetros usa validación cruzada sobre el conjunto de entrenamiento.

3. **Asumir que precisión de entrenamiento alta = buen modelo.** Si tu modelo tiene 99% en train y 65% en test, no es bueno — está sobreajustado. La métrica que importa es la de test.

4. **Confundir correlación con causalidad.** Que las ventas de helado y los ahogamientos aumenten juntos no significa que el helado cause ahogamientos. El ML encuentra patrones, no causas. La interpretación causal requiere expertise de dominio.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={14} title="Buenas prácticas desde el día 1" eyebrow="BUENAS PRÁCTICAS">

<RevealSequence mode="appear">

<CalloutCheck>
Siempre divide los datos **antes** de cualquier preprocesamiento. Es la regla #1.

Mantén un conjunto de prueba completamente oculto hasta la evaluación final. No lo mires, no lo toques, no lo uses para decidir nada.

Usa validación cruzada para estimaciones de rendimiento confiables. Un solo split train/test puede engañarte.

Empieza con modelos simples antes de probar arquitecturas complejas. Si una regresión lineal resuelve el problema, no necesitas una red neuronal.

Grafica curvas de aprendizaje para diagnosticar si necesitas más datos o un modelo más complejo. Los números sin visualización mienten.
</CalloutCheck>

</RevealSequence>

</Section>

<Section number={15} title="Resumen y glosario" eyebrow="RESUMEN">

<RevealSequence mode="appear">

<ConceptCard variant="key-idea">
El ML aprende patrones a partir de datos en lugar de seguir reglas explícitas. Las características (X) son entradas; las etiquetas (y) son salidas. El objetivo no es memorizar — es **generalizar** a datos nunca vistos. El sobreajuste y el subajuste son los dos enemigos, y la compensación sesgo-varianza explica por qué no existe un modelo perfecto universal.
</ConceptCard>

{/* candidate-player: interactive-table-glosario-fundamentos */}
<ConceptCard variant="key-idea">
**Glosario**
- Característica: variable de entrada usada para la predicción.
- Etiqueta: variable de salida a predecir.
- Entrenamiento: proceso de ajustar un modelo a los datos.
- Predicción: salida del modelo con datos nuevos.
- Generalización: rendimiento en datos no vistos.
- Sobreajuste: el modelo memoriza ruido del entrenamiento.
- Subajuste: modelo demasiado simple para el patrón.
- Sesgo: error por suposiciones simplificadoras.
- Varianza: error por sensibilidad a fluctuaciones en los datos.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "aprendizaje-supervisado", label: "Aprendizaje supervisado", detail: "Aprende de datos etiquetados para predecir etiquetas nuevas." },
    { id: "aprendizaje-no-supervisado", label: "Aprendizaje no supervisado", detail: "Descubre estructura oculta sin etiquetas." },
    { id: "caracteristica", label: "Característica (X)", detail: "Variable de entrada que el modelo usa para predecir." },
    { id: "etiqueta", label: "Etiqueta (y)", detail: "Variable de salida que queremos predecir." },
    { id: "generalizacion", label: "Generalización", detail: "Desempeño del modelo en datos que nunca vio." },
    { id: "sobreajuste-subajuste", label: "Sobreajuste y subajuste", detail: "Memorizar ruido vs modelo demasiado simple." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "gloss-caracteristica", label: "Característica", detail: "Variable de entrada usada para la predicción." },
    { id: "gloss-etiqueta", label: "Etiqueta", detail: "Variable de salida a predecir." },
    { id: "gloss-entrenamiento", label: "Entrenamiento", detail: "Proceso de ajustar un modelo a los datos." },
    { id: "gloss-prediccion", label: "Predicción", detail: "Salida del modelo con datos nuevos." },
    { id: "gloss-generalizacion", label: "Generalización", detail: "Rendimiento en datos no vistos." },
    { id: "gloss-sobreajuste", label: "Sobreajuste", detail: "El modelo memoriza ruido del entrenamiento." },
    { id: "gloss-subajuste", label: "Subajuste", detail: "Modelo demasiado simple para el patrón." },
  ]}
/>

<ChoiceQuestion
  question="A medida que aumentas la complejidad de un modelo, ¿qué ocurre con el sesgo y la varianza?"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  blockId="choice-ml-l01-resumen-1"
  allowContinueOnIncorrect
  explanation="La compensación sesgo-varianza dice que al aumentar la complejidad el sesgo baja (capturas más patrones) pero la varianza sube (empiezas a capturar ruido). El modelo óptimo encuentra el equilibrio para el problema."
  options={[
    { id: "a", label: "El sesgo baja y la varianza sube", correct: true, feedback: "¡Correcto! Esa es la compensación: menos sesgo, más varianza." },
    { id: "b", label: "El sesgo sube y la varianza baja", correct: false, feedback: "Falso: es el efecto opuesto al aumentar la complejidad." },
    { id: "c", label: "Ambos bajan a la vez", correct: false, feedback: "Falso: no se pueden reducir los dos simultáneamente aumentando complejidad." },
    { id: "d", label: "Ambos suben a la vez", correct: false, feedback: "Falso: la complejidad reduce el sesgo a costa de aumentar la varianza." },
  ]}
/>

<MascotMessage mood="celebrating">
Dominaste los fundamentos del aprendizaje automático. Ahora cualquier modelo es, para ti, un problema de generalización.
</MascotMessage>

</RevealSequence>

</Section>

<Section number={16} title="Ejercicios y desafío" eyebrow="EJERCICIOS">

<RevealSequence mode="appear">

<ChoiceQuestion
  question="Nivel 1 — Explica con tus palabras la diferencia entre la programación tradicional y el Aprendizaje Automático. ¿En qué situaciones usarías cada una?"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  blockId="reflection-l01-trad-vs-ml"
  allowContinueOnIncorrect
  explanation="Programación tradicional = escribo reglas explícitas; ML = le doy ejemplos etiquetados y aprende las reglas. Tradicional para reglas claras y estables; ML para reglas difíciles de expresar (imágenes, abandono, diagnóstico)."
  options={[
    { id: "a", label: "Trad = reglas explícitas para problemas claros; ML aprende reglas de ejemplos para problemas difíciles", correct: true, feedback: "¡Correcto! Esa es la diferencia clave entre enfoques." },
    { id: "b", label: "ML reemplaza por completo la programación tradicional", correct: false, feedback: "Falso: son complementarias, no sustitutivas." },
    { id: "c", label: "La programación tradicional es siempre menos precisa", correct: false, feedback: "Falso: con reglas claras es exacta y predecible." },
    { id: "d", label: "Todo problema se resuelve mejor con ML por su automatización", correct: false, feedback: "Falso: ML brilla donde las reglas son difíciles de expresar." },
  ]}
/>

<ChoiceQuestion
  question="Nivel 3 — Entrenas un modelo y obtienes precisión en entrenamiento = 99% y precisión en prueba = 65%. ¿Qué está pasando probablemente? ¿Qué tres cosas probarías para solucionarlo?"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  blockId="reflection-l01-overfit-diagnosis"
  allowContinueOnIncorrect
  explanation="Es sobreajuste (train 99%, test 65%): memorizó entrenamiento y no generaliza. Soluciones: (1) simplificar el modelo (menos complejidad/features, regularización), (2) más datos de entrenamiento, (3) validación cruzada y early stopping."
  options={[
    { id: "a", label: "Sobreajuste: simplificar, más datos y validación cruzada/early stopping", correct: true, feedback: "¡Correcto! El gap 99/65 denota sobreajuste, no subajuste." },
    { id: "b", label: "Subajuste: conviene aumentar complejidad y features", correct: false, feedback: "Falso: train 99% no es síntoma de modelo demasiado simple." },
    { id: "c", label: "El 99% de train garantiza generalización; revisar sólo el dataset", correct: false, feedback: "Falso: la métrica que importa es la de prueba, no la de train." },
    { id: "d", label: "Entrenar más épocas con los mismos datos resuelve el gap", correct: false, feedback: "Falso: más épocas profundizan la memorización del ruido." },
  ]}
/>

<ConceptCard variant="key-idea">
**Desafío de programación:** Escribe una función `diagnose_fit` que detecte sobreajuste. Ejecuta tu código con Shift+Enter.
</ConceptCard>

<CodeEditor
  defaultValue={`from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_diabetes
import numpy as np

def diagnose_fit(model, X_train, X_test, y_train, y_test):
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    gap = train_score - test_score
    
    if gap > 0.15:
        return "SOBREAJUSTE"
    elif train_score < 0.5 and test_score < 0.5:
        return "SUBAJUSTE"
    else:
        return "BIEN EQUILIBRADO"

# Prueba tu función
data = load_diabetes()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
print(diagnose_fit(model, X_train, X_test, y_train, y_test))
`}
  height="350px"
/>

</RevealSequence>

</Section>
