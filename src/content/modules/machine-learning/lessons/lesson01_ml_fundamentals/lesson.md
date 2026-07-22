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

## Motivación

Todos los días usás Aprendizaje Automático: Netflix recomienda series, Gmail filtra spam, tu teléfono reconoce caras. Pero ¿cómo funciona? En la programación tradicional, escribís reglas. En ML, la computadora aprende reglas a partir de datos. Este cambio —de reglas programadas a reglas aprendidas— es la idea más importante del software moderno. En biotecnología, el ML predice qué compuestos farmacológicos son efectivos. En SaaS, el ML predice qué clientes se van a dar de baja. Esta lección construye el modelo mental que necesitás para cada algoritmo del curso.

## Panorama general

**Anterior:** El Módulo 3 te enseñó a describir y visualizar datos. **Esta lección:** Aprendés cómo los algoritmos *aprenden de los datos*. **Siguiente:** Regresión lineal — tu primer algoritmo de ML real.

## Teoría

### ¿Qué es el Aprendizaje Automático?

El Aprendizaje Automático es un campo de la inteligencia artificial donde las computadoras aprenden patrones a partir de datos sin ser programadas explícitamente para cada escenario.

**Programación tradicional:**
```
Reglas + Datos → Respuestas
```

**Aprendizaje Automático:**
```
Datos + Respuestas → Reglas
```

Le damos ejemplos a la computadora, y ella descubre el patrón subyacente.

### Vocabulario clave

**Característica (X):** Una variable de entrada usada para hacer predicciones.
- Ejemplo: cantidad de habitaciones en una casa, nivel de expresión génica, días desde el último inicio de sesión.

**Etiqueta (y):** La variable de salida que queremos predecir.
- Ejemplo: precio de una casa, estado de enfermedad, probabilidad de abandono.

**Entrenamiento:** El proceso donde el modelo aprende patrones a partir de los datos.

**Predicción:** Usar el modelo entrenado con datos nuevos.

### Aprendizaje Supervisado vs. No Supervisado

| Aspecto | Supervisado | No Supervisado |
|---------|-------------|----------------|
| Datos | Tiene etiquetas | Sin etiquetas |
| Objetivo | Predecir etiquetas | Encontrar estructura |
| Ejemplos | Regresión, Clasificación | Clustering, PCA |

### Generalización

La capacidad de un modelo de funcionar bien con datos *no vistos*. Este es el verdadero objetivo del ML —no memorizar datos de entrenamiento, sino aprender patrones que generalicen.

### Sobreajuste

El modelo aprende los datos de entrenamiento *demasiado bien*, incluyendo el ruido. Funciona excelente en los datos de entrenamiento pero mal con datos nuevos.

**Síntomas:**
- Precisión en entrenamiento cercana al 100%, precisión en prueba mucho más baja
- Modelo muy complejo con muchos parámetros

### Subajuste

El modelo es demasiado simple para capturar el patrón subyacente. Funciona mal tanto en datos de entrenamiento como de prueba.

**Síntomas:**
- Tanto la precisión en entrenamiento como en prueba son bajas
- El modelo es demasiado simple

## Fundamento matemático: Compensación sesgo-varianza

El error esperado de prueba de un modelo se puede descomponer en tres partes:

$$\text{Error} = \text{Sesgo}^2 + \text{Varianza} + \text{Error irreducible}$$

**Sesgo:** Error proveniente de suposiciones incorrectas. Sesgo alto → subajuste.
**Varianza:** Error por sensibilidad a pequeñas fluctuaciones en los datos de entrenamiento. Varianza alta → sobreajuste.
**Error irreducible:** Ruido inherente al problema.

**Intuición:** Pensá en tiro con arco.
- Sesgo alto: los disparos están lejos del centro (error sistemático).
- Varianza alta: los disparos están dispersos (inconsistencia).

**La compensación:** A medida que la complejidad del modelo aumenta, el sesgo disminuye pero la varianza aumenta. El modelo óptimo equilibra ambos.

## Explicación visual

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
    axes[i].set_title(f'Degree {deg}')
    axes[i].legend()
    axes[i].set_ylim(-1.5, 1.5)

    train_mse = mean_squared_error(y_train, y_train_pred)
    test_mse = mean_squared_error(y_test, y_test_pred)
    print(f"Degree {deg}: Train MSE = {train_mse:.4f}, Test MSE = {test_mse:.4f}")

plt.tight_layout()
plt.savefig('figures/bias_variance_demo.png', dpi=150)
plt.show()
```

**Interpretación:**
- Grado 1 (subajuste): Línea simple, sesgo alto, ambos errores altos.
- Grado 4 (buen ajuste): Captura el patrón, ambos errores bajos.
- Grado 15 (sobreajuste): Ondulado, perfecto en entrenamiento pero falla en prueba.

## Implementación en Python

### División Train/Test

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

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print(f"Train R²: {model.score(X_train, y_train):.3f}")
print(f"Test R²: {model.score(X_test, y_test):.3f}")
print(f"Test MSE: {mean_squared_error(y_test, y_pred):.1f}")
```

## Ejemplo guiado: Predicción de progresión de enfermedad

**Problema:** Predecir la progresión de diabetes después de un año.

**Conjunto de datos:** scikit-learn diabetes (442 pacientes, 10 características).

```python
from sklearn.datasets import load_diabetes

data = load_diabetes()
print(f"Features: {data.feature_names}")
print(f"Samples: {data.data.shape[0]}")
print(f"Features per sample: {data.data.shape[1]}")
```

**Análisis:** Dividimos los datos, entrenamos un modelo lineal y evaluamos.

**Interpretación:** El modelo explica ~45% de la varianza en la progresión de la enfermedad (R² ≈ 0.45).

## Ejemplo en biotecnología: Expresión génica → Respuesta a fármacos

Imaginá que tenés datos de expresión génica de 500 pacientes con cáncer y querés predecir qué pacientes responden a un fármaco específico.

- **Características (X):** Niveles de expresión de 1000 genes
- **Etiqueta (y):** Respondedor (1) o no respondedor (0)

Un modelo entrenado con estos datos puede identificar firmas de expresión predictivas de la respuesta al fármaco.

## Ejemplo en SaaS: Predicción de abandono de usuarios

Una empresa SaaS quiere predecir qué usuarios cancelarán su suscripción.

- **Características:** frecuencia de inicio de sesión, tickets de soporte, días desde el último inicio de sesión, tipo de plan
- **Etiqueta:** abandonó (1) o no (0)

El modelo aprende patrones: los usuarios que no inician sesión por más de 30 días y han abierto tickets de soporte son de alto riesgo.

## Errores comunes

1. **Entrenar con todos los datos antes de dividir** — causa fuga de datos, sobreestima el rendimiento.
2. **Usar el conjunto de prueba para ajustar hiperparámetros** — trata al conjunto de prueba como si fuera de entrenamiento.
3. **Asumir que una alta precisión en entrenamiento significa un buen modelo** — podría ser sobreajuste.
4. **Confundir correlación con causalidad** — el ML encuentra patrones, no causas.

## Buenas prácticas

- Siempre dividí los datos *antes* de cualquier preprocesamiento
- Mantené un conjunto de prueba completamente oculto hasta la evaluación final
- Usá validación cruzada para estimaciones de rendimiento confiables
- Empezá con modelos simples antes de probar complejos
- Graficá curvas de aprendizaje para diagnosticar sesgo/varianza

## Resumen

- El ML aprende patrones a partir de datos en lugar de seguir reglas explícitas
- Las características (X) son entradas; las etiquetas (y) son salidas
- El entrenamiento ajusta el modelo; la predicción lo aplica a datos nuevos
- La generalización es la capacidad de funcionar bien con datos no vistos
- Sobreajuste: modelo demasiado complejo, memoriza ruido
- Subajuste: modelo demasiado simple, pierde patrones
- Compensación sesgo-varianza: el modelo óptimo equilibra error sistemático y sensibilidad
- La división train/test es esencial para una evaluación honesta

## Términos clave

| Término | Definición |
|---------|------------|
| Característica | Variable de entrada usada para la predicción |
| Etiqueta | Variable de salida a predecir |
| Entrenamiento | Proceso de ajustar un modelo a los datos |
| Predicción | Salida del modelo con datos nuevos |
| Generalización | Rendimiento en datos no vistos |
| Sobreajuste | El modelo memoriza ruido del entrenamiento |
| Subajuste | Modelo demasiado simple para el patrón |
| Sesgo | Error por suposiciones simplificadoras |
| Varianza | Error por sensibilidad a fluctuaciones en los datos |

## Ejercicios

**Nivel 1 — Básico:** Explicá con tus palabras la diferencia entre la programación tradicional y el Aprendizaje Automático.

**Nivel 2 — Implementación:** Cargá el dataset load_diabetes, creá una división train/test, entrená un LinearRegression, y calculá tanto el R² de entrenamiento como el de prueba. Aumentá la complejidad del modelo usando PolynomialFeatures y observá la compensación sesgo-varianza.

**Nivel 3 — Pensamiento crítico:** Entrenás un modelo y obtenés precisión en entrenamiento = 99% y precisión en prueba = 65%. ¿Qué está pasando probablemente? ¿Qué tres cosas probarías para solucionarlo?

## Desafío de programación

Escribí una función `diagnose_fit(model, X_train, X_test, y_train, y_test)` que:
1. Calcule los puntajes de entrenamiento y prueba
2. Imprima si el modelo está sobreajustado, subajustado o bien equilibrado
3. Devuelva un string con el diagnóstico

Usá un umbral: si train_score - test_score > 0.15, marcá como sobreajuste.
