---
Module: 3
Lesson Number: 3
Lesson Title: Fundamentos de Probabilidad
Estimated Duration: 90 minutos
Prerequisites: Lección 1 (Estadística Descriptiva)
Learning Objectives:
  - Enunciar los tres axiomas de Kolmogorov de la probabilidad
  - Calcular probabilidades condicionales usando el teorema de Bayes
  - Aplicar la ley de probabilidad total a problemas de partición
  - Distinguir entre variables aleatorias discretas y continuas
  - Resolver problemas de probabilidad con datos del mundo real
Keywords: probabilidad, axiomas de Kolmogorov, probabilidad condicional, teorema de Bayes, variables aleatorias, ley de probabilidad total
Difficulty: Intermedio
Programming Concepts: numpy, scipy.stats, matplotlib
Mathematical Concepts: axiomas de probabilidad, probabilidad condicional, regla de Bayes, esperanza, varianza
Machine Learning Concepts: pensamiento probabilístico, cuantificación de incertidumbre
Datasets Used: Datos sintéticos, datos de pruebas médicas
Notebook: 03_probability.ipynb
Assignment: probability_assignment.md
Quiz: probability_quiz.md
---

# Lección 3: Fundamentos de Probabilidad

## Motivación

Todo modelo de machine learning hace predicciones bajo incertidumbre. Un clasificador nunca sabe con 100% de certeza a qué clase pertenece un ejemplo. Un modelo de regresión nunca predice el valor exacto sin error. La probabilidad provee el lenguaje matemático para expresar y cuantificar esta incertidumbre. Sin probabilidad, no podés entender la confianza del modelo, interpretar valores p, ni evaluar métodos bayesianos.

En biotecnología, la probabilidad cuantifica la precisión de tests diagnósticos: "Si un paciente da positivo para una enfermedad, ¿cuál es la probabilidad de que realmente la tenga?" En SaaS, los modelos de probabilidad predicen la deserción de clientes: "¿Cuál es la probabilidad de que este usuario cancele su suscripción en los próximos 30 días?"

## Panorama General

Ya entendés estadística descriptiva (Lección 1) y distribuciones de datos (Lección 2). Ahora aprenderás la base matemática de la aleatoriedad y la incertidumbre. Esto te prepara directamente para la Lección 4 (Distribuciones Estadísticas), donde las variables aleatorias siguen leyes de probabilidad específicas, y para todas las lecciones de ML subsiguientes que se apoyan en el razonamiento probabilístico.

## Teoría

### Axiomas de Kolmogorov

Andrey Kolmogorov formalizó la probabilidad con tres axiomas.

**Axioma 1 (No negatividad)**: Para cualquier evento \(A\), \(P(A) \geq 0\).

**Axioma 2 (Normalización)**: La probabilidad del espacio muestral \(S\) es 1: \(P(S) = 1\).

**Axioma 3 (Aditividad)**: Para eventos mutuamente excluyentes \(A_1, A_2, \ldots\),

$$P\left(\bigcup_{i=1}^{\infty} A_i\right) = \sum_{i=1}^{\infty} P(A_i)$$

Intuición: Las probabilidades siempre están entre 0 y 1. Algo debe ocurrir (probabilidad total = 1). Si dos eventos no pueden ocurrir simultáneamente, la probabilidad de que ocurra uno u otro es la suma de sus probabilidades individuales.

### Probabilidad Condicional

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

Intuición: Si sabemos que el evento B ocurrió, restringimos nuestra atención a la porción de A que se superpone con B, renormalizada por la probabilidad de B.

### Ley de Probabilidad Total

Si los eventos \(B_1, B_2, \ldots, B_k\) particionan el espacio muestral:

$$P(A) = \sum_{i=1}^{k} P(A \mid B_i) \cdot P(B_i)$$

Intuición: Para encontrar la probabilidad total de A, considerá todas las formas en que A puede ocurrir, ponderadas por qué tan probable es cada escenario.

### Teorema de Bayes

$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$$

O usando la ley de probabilidad total:

$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{\sum_{i} P(B \mid A_i) \cdot P(A_i)}$$

Intuición: El teorema de Bayes actualiza nuestra creencia sobre A después de observar B. \(P(A)\) es la probabilidad a priori (lo que creíamos antes), y \(P(A \mid B)\) es la probabilidad a posteriori (lo que creemos después de ver la evidencia).

### Variables Aleatorias

Una variable aleatoria es una función que asigna un número real a cada resultado en el espacio muestral.

- **Discreta**: Toma valores contables (ej., cantidad de clientes que se dan de baja)
- **Continua**: Toma valores en un intervalo (ej., nivel de expresión génica)

**Función de Probabilidad (PMF)**: Para variables aleatorias discretas, \(p(x) = P(X = x)\)

**Función de Densidad (PDF)**: Para variables aleatorias continuas, \(P(a \leq X \leq b) = \int_a^b f(x) dx\)

**Función de Distribución Acumulada (CDF)**: \(F(x) = P(X \leq x)\)

**Valor Esperado**: \(E[X] = \sum_x x \cdot P(X=x)\) (discreto) o \(E[X] = \int x f(x) dx\) (continuo)

**Varianza**: \(\text{Var}(X) = E[(X - E[X])^2] = E[X^2] - E[X]^2\)

## Implementación en Python

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Simulando probabilidad condicional: test de enfermedad
# Prevalencia de la enfermedad: 1% de la población
# Sensibilidad del test (tasa de verdaderos positivos): 95%
# Especificidad del test (tasa de verdaderos negativos): 90%

# Probabilidad a priori
p_disease = 0.01
p_no_disease = 0.99

# Verosimilitud
p_pos_given_disease = 0.95
p_neg_given_no_disease = 0.90
p_pos_given_no_disease = 1 - p_neg_given_no_disease  # 0.10 (falso positivo)

# Usando el teorema de Bayes: P(enfermedad | positivo)
p_disease_given_pos = (p_pos_given_disease * p_disease) / (
    p_pos_given_disease * p_disease + p_pos_given_no_disease * p_no_disease
)

print(f"Probabilidad de tener la enfermedad dado un test positivo: {p_disease_given_pos:.3f}")
print(f"¡Solo {p_disease_given_pos*100:.1f}% — porque la enfermedad es rara!")

# Simular con muchos pacientes
np.random.seed(42)
n_patients = 100000
has_disease = np.random.random(n_patients) < p_disease
test_positive = np.where(
    has_disease,
    np.random.random(n_patients) < 0.95,  # verdadero positivo
    np.random.random(n_patients) < 0.10   # falso positivo
)

# Bayes empírico
actual_disease_given_pos = has_disease[test_positive].mean()
print(f"P empírica(enfermedad | positivo): {actual_disease_given_pos:.3f}")

# Variable aleatoria: valor esperado
# Considerá: el 20% de los usuarios se van cada mes. ¿Cantidad esperada de usuarios que se van de 100?
n_users = 100
p_churn = 0.20
expected_churn = n_users * p_churn
variance_churn = n_users * p_churn * (1 - p_churn)
print(f"\nUsuarios que se van esperados: {expected_churn}")
print(f"Varianza: {variance_churn:.2f}")
print(f"Desvío estándar: {np.sqrt(variance_churn):.2f}")
```

## Ejemplo Guiado

**Test de Diagnóstico Médico**

Una empresa biotecnológica desarrolla un test para un trastorno genético poco común.

- Prevalencia: 0.5% de la población
- Sensibilidad: 99% (detecta el 99% de los casos reales)
- Especificidad: 98% (identifica correctamente al 98% de las personas sanas)

**Pregunta**: Si un paciente da positivo, ¿cuál es la probabilidad de que realmente tenga el trastorno?

```python
prevalence = 0.005
sensitivity = 0.99
specificity = 0.98

p_pos_given_disease = sensitivity
p_pos_given_healthy = 1 - specificity

p_dis_given_pos = (p_pos_given_disease * prevalence) / (
    p_pos_given_disease * prevalence + p_pos_given_healthy * (1 - prevalence)
)

print(f"P(enfermedad | positivo) = {p_dis_given_pos:.3f} ({p_dis_given_pos*100:.1f}%)")
```

**Interpretación**: A pesar de tener 99% de sensibilidad y 98% de especificidad, un test positivo todavía significa solo un 20% de probabilidad de tener la enfermedad. Este resultado contraintuitivo surge porque la enfermedad es rara — la mayoría de los tests positivos son falsos positivos.

## Ejemplo de Biotecnología

Clasificación de variantes génicas. Supongamos que se encuentra una mutación en una secuencia de ADN. La mutación podría ser benigna (99.9% de las variantes) o patogénica (0.1%). Una herramienta bioinformática clasifica correctamente el 95% de las variantes patogénicas e incorrectamente marca el 2% de las variantes benignas como patogénicas.

```python
p_pathogenic = 0.001
p_benign = 0.999
p_detect_given_pathogenic = 0.95
p_detect_given_benign = 0.02

p_pathogenic_given_detect = (p_detect_given_pathogenic * p_pathogenic) / (
    p_detect_given_pathogenic * p_pathogenic + p_detect_given_benign * p_benign
)
print(f"P(patogénica | detectada) = {p_pathogenic_given_detect:.3f}")
```

## Ejemplo SaaS

Predicción de deserción de clientes. Una empresa SaaS tiene datos que muestran:
- El 10% de los clientes se dan de baja cada mes (probabilidad a priori)
- El modelo predice la deserción con 80% de precisión para los clientes que se dan de baja
- El modelo predice falsamente la deserción para el 15% de los clientes que se quedan

```python
p_churn = 0.10
p_stay = 0.90
p_pred_churn_given_churn = 0.80
p_pred_churn_given_stay = 0.15

p_churn_given_pred = (p_pred_churn_given_churn * p_churn) / (
    p_pred_churn_given_churn * p_churn + p_pred_churn_given_stay * p_stay
)
print(f"P(deserción | predicho deserción) = {p_churn_given_pred:.3f}")
```

## Errores Comunes

1. **Confundir P(A|B) con P(B|A)**: La probabilidad de tener una enfermedad dado un test positivo no es lo mismo que la probabilidad de un test positivo dado que se tiene la enfermedad. Esto se llama la "falacia del fiscal."
2. **Ignorar la tasa base**: El teorema de Bayes muestra que los eventos raros siguen siendo raros incluso después de evidencia positiva (la falacia de la tasa base).
3. **Asumir independencia**: Los eventos raramente son independientes en datos reales. Siempre verificá antes de multiplicar probabilidades.
4. **Malinterpretar los valores p**: Un valor p NO es la probabilidad de que la hipótesis nula sea verdadera.

## Mejores Prácticas

- Escribí siempre la probabilidad a priori antes de actualizar con evidencia
- Usá simulación para verificar cálculos de probabilidad
- Visualizá distribuciones de probabilidad cuando sea posible
- Recordá que la probabilidad cuantifica la incertidumbre; no la elimina

## Resumen

- Axiomas de Kolmogorov: no negatividad, normalización, aditividad
- Probabilidad condicional: P(A|B) = P(A∩B) / P(B)
- Ley de probabilidad total: P(A) = Σ P(A|B_i) · P(B_i)
- Teorema de Bayes: actualiza creencias a priori con evidencia
- Variables aleatorias: funciones del espacio muestral a los números reales
- Valor esperado: promedio a largo plazo de una variable aleatoria

## Términos Clave

| Término | Definición |
|---------|------------|
| Espacio Muestral | Conjunto de todos los resultados posibles |
| Evento | Subconjunto del espacio muestral |
| Probabilidad Condicional | Probabilidad de A dado que B ocurrió |
| Teorema de Bayes | Fórmula para actualizar probabilidades dada evidencia |
| Probabilidad a Priori | Probabilidad inicial antes de nueva evidencia |
| Probabilidad a Posteriori | Probabilidad actualizada después de la evidencia |
| Variable Aleatoria | Variable cuyo valor está determinado por un proceso aleatorio |
| Valor Esperado | Promedio a largo plazo de una variable aleatoria |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. Se lanza un dado justo. ¿Cuál es la probabilidad de sacar un 3? ¿Cuál es la probabilidad de sacar un número par?
2. Enunciá y explicá cada uno de los tres axiomas de Kolmogorov con tus propias palabras.

**Nivel 2: Implementación**

3. Escribí una simulación en Python que lance dos dados 10.000 veces y calcule la probabilidad empírica de que la suma sea 7. Compará con la probabilidad teórica.
4. Un filtro de spam tiene una tasa de falsos positivos del 2% y una tasa de falsos negativos del 1%. El 40% de todos los correos son spam. Usá el teorema de Bayes para encontrar la probabilidad de que un correo sea spam dado que el filtro lo marcó.

**Nivel 3: Pensamiento Crítico**

5. En estudios de asociación genómica (GWAS), se realizan millones de tests estadísticos simultáneamente. Explicá cómo la ley de probabilidad total y el teorema de Bayes se relacionan con métodos de corrección por tests múltiples como la corrección de Bonferroni.
6. ¿Por qué es esencial entender la probabilidad condicional para interpretar las salidas de modelos de machine learning como puntajes de confianza o probabilidades predichas?

## Desafío de Programación

Escribí un script en Python que:
1. Simule un test de diagnóstico para una enfermedad con prevalencia, sensibilidad y especificidad configurables
2. Para cada una de 10 tasas de prevalencia diferentes (de 0.001 a 0.5), calcule la probabilidad a posteriori P(enfermedad|positivo)
3. Trace una curva de prevalencia vs probabilidad a posteriori
4. Incluya una línea horizontal en y=0.5 para mostrar dónde el test se vuelve informativo (P(enfermedad|positivo) > 0.5)
