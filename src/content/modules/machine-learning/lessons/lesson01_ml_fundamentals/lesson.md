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

<Section number={1} title="De reglas programadas a reglas aprendidas" eyebrow="INICIO">

<MascotMessage mood="celebrating">
¡Bienvenido al módulo de Machine Learning! Este es el punto de inflexión: aquí dejas de decirle a la computadora qué hacer y empiezas a enseñarle a descubrir patrones por sí misma.
</MascotMessage>

Todos los días usas Aprendizaje Automático sin darte cuenta: Netflix recomienda series, Gmail filtra spam, tu teléfono reconoce caras. Pero el cambio fundamental es este:

<ConceptCard variant="key-idea">
En la programación tradicional escribes **reglas explícitas**. En ML, la computadora **aprende las reglas** a partir de ejemplos. Es la diferencia entre darle una receta a alguien y mostrarle 1000 fotos de gatos hasta que pueda identificarlos solo.
</ConceptCard>

En biotecnología, el ML predice qué compuestos farmacológicos son efectivos. En SaaS, predice qué clientes se van a dar de baja. Esta lección construye el modelo mental que necesitas para cada algoritmo del curso.

</Section>

<Section number={2} title="¿Dónde estamos parados?" eyebrow="CONTEXTO">

**Anterior:** El Módulo 3 te enseñó a describir y visualizar datos con estadística.

**Esta lección:** Aprendes cómo los algoritmos *aprenden de los datos* y qué puede salir mal en el proceso.

**Siguiente:** Regresión lineal — tu primer algoritmo de ML real, donde todo esto cobra vida.

<ConceptCard variant="key-idea">
Antes de lanzarte a implementar algoritmos, necesitas entender los fundamentos: ¿qué significa que un modelo "aprenda"? ¿Cómo sabes si aprendió bien? ¿Por qué un modelo perfecto en entrenamiento puede fallar estrepitosamente en producción?
</ConceptCard>

</Section>

<Section number={3} title="¿Qué es el Aprendizaje Automático?" eyebrow="CONCEPTO">

El Aprendizaje Automático es un campo de la inteligencia artificial donde las computadoras aprenden patrones a partir de datos sin ser programadas explícitamente para cada escenario.

<ComparisonTable
  rows={[
    { feature: "Enfoque", left: "Programación Tradicional", right: "Aprendizaje Automático" },
    { feature: "Entrada", left: "Reglas + Datos", right: "Datos + Respuestas" },
    { feature: "Salida", left: "Respuestas", right: "Reglas" },
    { feature: "Ejemplo", left: "if spam_words > 3: marcar_spam()", right: "Mostrar 10.000 emails etiquetados → el modelo descubre qué patrones indican spam" },
    { feature: "Cuándo usarlo", left: "Problemas con reglas claras y estables", right: "Problemas donde las reglas son difíciles de expresar o cambian con el tiempo" },
  ]}
/>

Le damos ejemplos a la computadora, y ella descubre el patrón subyacente. Simple en teoría, pero el diablo está en los detalles.

</Section>

<Section number={4} title="Vocabulario que vas a usar todo el curso" eyebrow="CONCEPTO">

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

</Section>

<Section number={5} title="Supervisado vs No Supervisado" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Datos de entrenamiento", left: "Tienen etiquetas (sabemos la respuesta correcta)", right: "Sin etiquetas (solo tenemos las características)" },
    { feature: "Objetivo", left: "Predecir etiquetas para datos nuevos", right: "Encontrar estructura oculta en los datos" },
    { feature: "Ejemplos", left: "Regresión (predecir un número), Clasificación (predecir una categoría)", right: "Clustering (agrupar similares), PCA (reducir dimensiones)" },
    { feature: "Analogía", left: "Un profesor que corrige tus ejercicios", right: "Explorar una biblioteca sin catálogo y descubrir secciones por tu cuenta" },
    { feature: "En este módulo", left: "Lecciones 1-5 y 8", right: "Lecciones 6 y 7" },
  ]}
/>

</Section>

<Section number={6} title="Generalización: el verdadero objetivo" eyebrow="CONCEPTO">

<ConceptCard variant="key-idea">
La **generalización** es la capacidad del modelo de funcionar bien con datos *que nunca vio*. Este es el verdadero objetivo del ML — no memorizar los datos de entrenamiento, sino aprender patrones que se transfieran a situaciones nuevas.
</ConceptCard>

Si un modelo solo funciona con los datos que usaste para entrenarlo, no sirve. Es como un estudiante que se memoriza las respuestas del examen de práctica pero no entiende los conceptos.

<CalloutInfo>
La división train/test es la herramienta más básica para medir generalización: entrenas con una parte de los datos y evalúas con otra que el modelo nunca vio.
</CalloutInfo>

</Section>

<Section number={7} title="Los dos enemigos: sobreajuste y subajuste" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Qué es", left: "El modelo aprende los datos de entrenamiento **demasiado bien**, incluyendo el ruido", right: "El modelo es **demasiado simple** para capturar el patrón subyacente" },
    { feature: "Síntoma clave", left: "Precisión en entrenamiento ≈ 100%, precisión en prueba mucho más baja", right: "Tanto la precisión en entrenamiento como en prueba son bajas" },
    { feature: "Causa típica", left: "Modelo muy complejo con demasiados parámetros", right: "Modelo muy simple o falta de features relevantes" },
    { feature: "Analogía", left: "Un estudiante que se memoriza cada palabra del libro pero no puede aplicar los conceptos", right: "Un estudiante que solo leyó el título del capítulo y cree que ya sabe todo" },
  ]}
/>

<ReflectionCheck
  blockId="reflection-l01-overfit-underfit"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  prompt="Entrenas un modelo y obtienes precisión en entrenamiento = 99% y precisión en prueba = 65%. ¿Qué está pasando y qué harías para solucionarlo?"
  answer="Es un caso claro de sobreajuste: el modelo memorizó los datos de entrenamiento pero no generaliza. Tres cosas que probaría: (1) simplificar el modelo (reducir complejidad), (2) agregar más datos de entrenamiento si es posible, (3) aplicar regularización para penalizar la complejidad excesiva."
/>

</Section>

<Section number={8} title="La compensación sesgo-varianza" eyebrow="MATEMÁTICA">

El error esperado de un modelo se puede descomponer en tres partes:

$$\text{Error} = \text{Sesgo}^2 + \text{Varianza} + \text{Error irreducible}$$

<ConceptCard variant="definition">
**Sesgo:** Error por suposiciones demasiado simplificadoras. Sesgo alto → subajuste. Es como disparar consistentemente lejos del blanco.

**Varianza:** Error por sensibilidad a pequeñas fluctuaciones en los datos. Varianza alta → sobreajuste. Es como disparar por todos lados sin consistencia.

**Error irreducible:** Ruido inherente al problema que ningún modelo puede eliminar.
</ConceptCard>

<ConceptCard variant="key-idea">
**La compensación:** A medida que aumentas la complejidad del modelo, el sesgo baja (capturas más patrones) pero la varianza sube (empiezas a capturar ruido). El modelo óptimo encuentra el equilibrio. No existe un modelo perfecto para todo — existe el modelo adecuado para tu problema.
</ConceptCard>

</Section>

<Section number={9} title="Visualiza el sesgo y la varianza" eyebrow="INTERACTIVA">

Veamos la compensación sesgo-varianza en acción con un ejemplo que puedes ejecutar:

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

</Section>

<Section number={10} title="Tu primer pipeline de ML" eyebrow="CÓDIGO">

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

</Section>

<Section number={11} title="ML en biotecnología: expresión génica" eyebrow="APLICACIÓN">

<ConceptCard variant="key-idea">
En biotecnología, el ML conecta datos moleculares con resultados clínicos. Es el puente entre el laboratorio húmedo y la medicina personalizada.
</ConceptCard>

Imagina que tienes datos de expresión génica de 500 pacientes con cáncer y quieres predecir qué pacientes responderán a un fármaco específico:

- **Características (X):** Niveles de expresión de 1000 genes
- **Etiqueta (y):** Respondedor (1) o no respondedor (0)

El modelo aprende qué combinaciones de genes predicen la respuesta al tratamiento. Esto permite evitar quimioterapia innecesaria en pacientes que no se beneficiarían.

</Section>

<Section number={12} title="ML en SaaS: predicción de abandono" eyebrow="APLICACIÓN">

Una empresa SaaS quiere predecir qué usuarios cancelarán su suscripción el próximo mes:

- **Características:** frecuencia de inicio de sesión, tickets de soporte abiertos, días desde último login, tipo de plan, cantidad de features usadas
- **Etiqueta:** abandonó (1) o no (0)

El modelo aprende patrones como: *"usuarios que no inician sesión por >30 días Y abrieron >3 tickets de soporte = 85% probabilidad de abandono"*. Con esta información, el equipo de customer success interviene **antes** de que cancelen.

<ReflectionCheck
  blockId="reflection-l01-saas-churn"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  prompt="En el caso de SaaS, ¿por qué es importante predecir el abandono *antes* de que ocurra en lugar de simplemente registrar quién abandonó?"
  answer="Porque predecir antes permite actuar: puedes enviar un descuento, una sesión de onboarding personalizada, o contactar al usuario para resolver sus problemas. Si solo registras quién abandonó, ya es tarde — ese cliente se fue. La predicción temprana convierte un problema reactivo en uno proactivo."
/>

</Section>

<Section number={13} title="Los 4 errores que todo principiante comete" eyebrow="PELIGROS">

<CalloutInfo>
1. **Entrenar con todos los datos y después dividir.** Haces trampa sin darte cuenta: el modelo ya "vio" los datos de prueba durante el preprocesamiento. Siempre divide primero.

2. **Usar el conjunto de prueba para ajustar hiperparámetros.** El conjunto de prueba es sagrado — solo se toca una vez al final. Para ajustar parámetros usa validación cruzada sobre el conjunto de entrenamiento.

3. **Asumir que precisión de entrenamiento alta = buen modelo.** Si tu modelo tiene 99% en train y 65% en test, no es bueno — está sobreajustado. La métrica que importa es la de test.

4. **Confundir correlación con causalidad.** Que las ventas de helado y los ahogamientos aumenten juntos no significa que el helado cause ahogamientos. El ML encuentra patrones, no causas. La interpretación causal requiere expertise de dominio.
</CalloutInfo>

</Section>

<Section number={14} title="Buenas prácticas desde el día 1" eyebrow="BUENAS PRÁCTICAS">

<CalloutCheck>
Siempre divide los datos **antes** de cualquier preprocesamiento. Es la regla #1.

Mantén un conjunto de prueba completamente oculto hasta la evaluación final. No lo mires, no lo toques, no lo uses para decidir nada.

Usa validación cruzada para estimaciones de rendimiento confiables. Un solo split train/test puede engañarte.

Empieza con modelos simples antes de probar arquitecturas complejas. Si una regresión lineal resuelve el problema, no necesitas una red neuronal.

Grafica curvas de aprendizaje para diagnosticar si necesitas más datos o un modelo más complejo. Los números sin visualización mienten.
</CalloutCheck>

</Section>

<Section number={15} title="Resumen y glosario" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
El ML aprende patrones a partir de datos en lugar de seguir reglas explícitas. Las características (X) son entradas; las etiquetas (y) son salidas. El objetivo no es memorizar — es **generalizar** a datos nunca vistos. El sobreajuste y el subajuste son los dos enemigos, y la compensación sesgo-varianza explica por qué no existe un modelo perfecto universal.
</ConceptCard>

<InteractiveTable
  columns={[
    { key: "term", label: "Término" },
    { key: "def", label: "Definición" },
  ]}
  rows={[
    { term: "Característica", def: "Variable de entrada usada para la predicción" },
    { term: "Etiqueta", def: "Variable de salida a predecir" },
    { term: "Entrenamiento", def: "Proceso de ajustar un modelo a los datos" },
    { term: "Predicción", def: "Salida del modelo con datos nuevos" },
    { term: "Generalización", def: "Rendimiento en datos no vistos" },
    { term: "Sobreajuste", def: "El modelo memoriza ruido del entrenamiento" },
    { term: "Subajuste", def: "Modelo demasiado simple para el patrón" },
    { term: "Sesgo", def: "Error por suposiciones simplificadoras" },
    { term: "Varianza", def: "Error por sensibilidad a fluctuaciones en los datos" },
  ]}
/>

</Section>

<Section number={16} title="Ejercicios y desafío" eyebrow="EJERCICIOS">

<ReflectionCheck
  blockId="reflection-l01-trad-vs-ml"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  prompt="Nivel 1 — Explica con tus palabras la diferencia entre la programación tradicional y el Aprendizaje Automático. ¿En qué situaciones usarías cada una?"
  answer="En programación tradicional escribo reglas explícitas (if temperatura > 38: alerta_fiebre()). En ML le doy ejemplos etiquetados al algoritmo y él descubre las reglas. Usaría programación tradicional para problemas con reglas claras y estables (cálculo de impuestos, validación de formularios). Usaría ML cuando las reglas son difíciles de expresar (reconocimiento de imágenes, predicción de abandono de clientes, diagnóstico médico)."
/>

<ReflectionCheck
  blockId="reflection-l01-overfit-diagnosis"
  moduleSlug="machine-learning"
  lessonSlug="lesson01_ml_fundamentals"
  prompt="Nivel 3 — Entrenas un modelo y obtienes precisión en entrenamiento = 99% y precisión en prueba = 65%. ¿Qué está pasando probablemente? ¿Qué tres cosas probarías para solucionarlo?"
  answer="Es sobreajuste: el modelo memorizó los datos de entrenamiento pero no generaliza. Soluciones: (1) Simplificar el modelo — reducir complejidad, menos features, regularización. (2) Conseguir más datos de entrenamiento si es posible. (3) Usar validación cruzada para detectar el sobreajuste más temprano y parar el entrenamiento antes (early stopping)."
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

</Section>
