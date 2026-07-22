---
Module: 5
Lesson Number: 2
Lesson Title: Sesgo y Equidad
Estimated Duration: 75 minutos
Prerequisites: L1 (Introducción a la Ética en IA)
Learning Objectives:
  - Diferenciar entre sesgo de datos, sesgo algorítmico y sesgo social
  - Implementar métricas de equidad usando Python y sklearn
  - Detectar sesgo en un conjunto de datos usando análisis estadístico
  - Analizar el caso COMPAS de reincidencia y el caso de sesgo en reconocimiento facial
  - Aplicar estrategias de mitigación de sesgo a un conjunto de datos real
Keywords: sesgo, equidad, impacto dispar, igualdad de oportunidades, paridad demográfica, COMPAS, métricas de equidad
Difficulty: Intermediate
Programming Concepts: pandas, numpy, funciones de Python
Mathematical Concepts: Probabilidad condicional, matriz de confusión, disparidad estadística
Machine Learning Concepts: Clasificación, evaluación de modelos, selección de umbrales
Datasets Used: Conjunto sintético de préstamos, muestra COMPAS (ProPublica)
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Sesgo y Equidad

## Objetivos de Aprendizaje

Al finalizar esta lección, los estudiantes podrán:

1. **Diferenciar** tres tipos de sesgo: de datos, algorítmico y social
2. **Definir** criterios formales de equidad: paridad demográfica, igualdad de oportunidades, probabilidades igualadas
3. **Implementar** métricas de equidad en Python usando sklearn
4. **Analizar** el caso COMPAS de reincidencia e identificar fuentes de sesgo
5. **Aplicar** al menos una estrategia de mitigación de sesgo de preprocesamiento

## Motivación

En 2016, ProPublica publicó una investigación sobre COMPAS, un algoritmo comercial usado por tribunales de EE.UU. para predecir riesgo de reincidencia. El algoritmo asignaba puntajes de riesgo a los acusados. ProPublica encontró que:

- Los acusados negros tenían casi el doble de probabilidades que los acusados blancos de ser etiquetados como de alto riesgo sin haber reincidido (tasa de falsos positivos: 45% vs. 23%)
- Los acusados blancos eran más propensos a ser etiquetados como de bajo riesgo pero luego reincidían (tasa de falsos negativos: 48% vs. 28%)

El algoritmo estaba sistemáticamente sesgado. Se usaba para influir en decisiones de fianza, sentencia y libertad condicional que afectaban a millones de personas.

La empresa que construyó COMPAS, Northpointe (hoy Equivant), defendió el algoritmo. Argumentaron que era justo porque la *probabilidad de reincidencia* para cualquier puntaje dado era la misma entre grupos. Ambas partes tenían un argumento matemático. ¿Quién tenía razón?

La respuesta depende de qué definición de equidad uses. Y ese es el desafío central de la equidad algorítmica: **la equidad no es un concepto matemático único.** Es un valor social en disputa traducido a definiciones matemáticas en competencia.

Entender estas definiciones — y sus limitaciones — es esencial para cualquiera que construya o despliegue sistemas de ML que afectan la vida de las personas.

## Panorama General

| Lección Anterior | Lección Actual | Próxima Lección |
|---|---|---|
| L1: Introducción a la Ética (principios) | L2: Sesgo y Equidad (tipos, métricas, casos de estudio) | L3: Transparencia y Explicabilidad (XAI, SHAP, LIME) |

## Teoría

### Los Tres Tipos de Sesgo

#### 1. Sesgo de Datos

El sesgo de datos existe cuando los datos de entrenamiento no representan con precisión a la población a la que se aplicará el modelo.

Fuentes comunes:

- **Sesgo histórico:** Los datos reflejan prejuicios sociales existentes. Ejemplo: los datos históricos de contratación muestran menos mujeres contratadas para roles tecnológicos debido a discriminación pasada.
- **Sesgo de representación:** Ciertos grupos están subrepresentados en los datos. Ejemplo: conjuntos de datos médicos que contienen principalmente datos de hombres blancos.
- **Sesgo de medición:** Las características o etiquetas se miden de manera diferente entre grupos. Ejemplo: usar estado de salud autoinformado cuando diferentes grupos tienen diferente acceso a la atención médica.
- **Sesgo de etiqueta:** La variable objetivo en sí misma está sesgada. Ejemplo: usar registros de arrestos como etiquetas para "criminalidad" cuando la vigilancia policial está sesgada.

#### 2. Sesgo Algorítmico

El sesgo algorítmico surge de las decisiones de diseño en el modelo o el proceso de optimización.

Fuentes comunes:

- **Selección de características:** Incluir atributos protegidos (raza, género) o proxies (código postal, nombre).
- **Función objetivo:** Optimizar para la precisión general puede sacrificar el rendimiento en grupos minoritarios.
- **Arquitectura del modelo:** Algunos modelos pueden amplificar ciertos patrones en los datos.
- **Evaluación:** Usar métricas inapropiadas que ocultan disparidades a nivel de grupo.

#### 3. Sesgo Social

El sesgo social es el sesgo que existe en la sociedad en general y es reflejado o amplificado por los sistemas de IA.

- **Bucles de retroalimentación:** Un modelo sesgado toma decisiones que refuerzan el sesgo en datos futuros.
- **Amplificación:** Un sistema de IA entrenado con datos sesgados no solo replica el sesgo — puede amplificarlo.
- **Legitimación:** La gente confía en las decisiones algorítmicas como objetivas, otorgando a los sistemas sesgados un aura de autoridad.

### Definiciones de Equidad

Existen muchas definiciones de equidad en competencia. Las tres más usadas son:

#### Paridad Demográfica (Paridad Estadística)

Una predicción es justa si el resultado es independiente del atributo protegido:

$$P(\hat{Y} = 1 | A = 0) = P(\hat{Y} = 1 | A = 1)$$

donde $\hat{Y}$ es el resultado predicho y $A$ es el atributo protegido.

**Intuición:** Cada grupo debería recibir resultados positivos a la misma tasa.

**Limitación:** Si las tasas base difieren entre grupos (ej., diferentes tasas de reincidencia), la paridad demográfica puede requerir sacrificar precisión.

#### Igualdad de Oportunidades

Una predicción satisface igualdad de oportunidades si la tasa de verdaderos positivos es igual entre grupos:

$$P(\hat{Y} = 1 | Y = 1, A = 0) = P(\hat{Y} = 1 | Y = 1, A = 1)$$

**Intuición:** Cada grupo debería tener la misma probabilidad de ser correctamente identificado como positivo.

**Limitación:** No aborda las disparidades en falsos positivos.

#### Probabilidades Igualadas

Una predicción satisface probabilidades igualadas si tanto la tasa de verdaderos positivos como la tasa de falsos positivos son iguales entre grupos:

$$P(\hat{Y} = 1 | Y = y, A = 0) = P(\hat{Y} = 1 | Y = y, A = 1) \quad \text{para } y \in \{0, 1\}$$

**Intuición:** Los errores del modelo afectan a todos los grupos por igual.

**Limitación:** Más difícil de lograr en la práctica. Puede entrar en conflicto con otras definiciones de equidad.

#### El Teorema de Imposibilidad

Chouldechova (2017) y Kleinberg et al. (2016) demostraron que es imposible satisfacer simultáneamente los tres criterios de equidad a menos que las tasas base sean iguales entre grupos o el clasificador sea perfecto. Esto significa que **la equidad requiere compensaciones.**

### Flujo de Trabajo para Detección de Sesgo

1. **Auditoría del conjunto de datos:** Examinar composición demográfica, patrones de datos faltantes, distribución de etiquetas entre grupos.
2. **Auditoría del modelo:** Entrenar modelo, calcular métricas de equidad, comparar rendimiento entre grupos.
3. **Análisis de errores:** Analizar tasas de falsos positivos y falsos negativos por grupo.
4. **Mitigación:** Aplicar intervenciones de preprocesamiento, durante el procesamiento o postprocesamiento.

## Base Matemática

### Métricas de Equidad

Dado:
- $A$: atributo protegido (ej., raza, género)
- $Y$: etiqueta verdadera (1 = positivo, 0 = negativo)
- $\hat{Y}$: etiqueta predicha

| Métrica | Fórmula | Qué Mide |
|---------|---------|----------|
| Diferencia de paridad demográfica | $P(\hat{Y}=1\|A=0) - P(\hat{Y}=1\|A=1)$ | Tasa de predicciones positivas |
| Diferencia de igualdad de oportunidades | $TPR_{A=0} - TPR_{A=1}$ | Brecha en tasa de verdaderos positivos |
| Diferencia de probabilidades igualadas | $\max(\|TPR_0 - TPR_1\|, \|FPR_0 - FPR_1\|)$ | Máximo de brechas de TPR y FPR |
| Impacto dispar | $\frac{P(\hat{Y}=1\|A=1)}{P(\hat{Y}=1\|A=0)}$ | Razón de tasas de predicción positiva |

## Ejemplo Guiado

### Detección de Sesgo en un Conjunto Sintético de Préstamos

Vamos a generar un conjunto de datos sintético que representa solicitudes de préstamo con un atributo protegido (raza) y analizar sesgo.

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report

np.random.seed(42)
n = 2000

race = np.random.choice(['white', 'non_white'], size=n, p=[0.7, 0.3])
income = np.where(race == 'white',
                  np.random.normal(70, 20, n),
                  np.random.normal(50, 15, n))
credit_score = np.where(race == 'white',
                        np.random.normal(700, 50, n),
                        np.random.normal(650, 60, n))
repayment = np.where(race == 'white',
                     np.random.binomial(1, 0.85, n),
                     np.random.binomial(1, 0.75, n))

df = pd.DataFrame({
    'race': race,
    'income': income,
    'credit_score': credit_score,
    'loan_amount': np.random.uniform(1000, 50000, n),
    'repayment': repayment
})

X = pd.get_dummies(df[['income', 'credit_score', 'loan_amount']], drop_first=True)
y = df['repayment']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Analyze by race
test_df = df.iloc[X_test.index].copy()
test_df['predicted'] = y_pred

for group in ['white', 'non_white']:
    subset = test_df[test_df['race'] == group]
    tn, fp, fn, tp = confusion_matrix(subset['repayment'], subset['predicted']).ravel()
    tpr = tp / (tp + fn)
    fpr = fp / (fp + tn)
    approval_rate = subset['predicted'].mean()
    print(f"{group}: TPR={tpr:.3f}, FPR={fpr:.3f}, Approval Rate={approval_rate:.3f}")
```

**Interpretación:** El grupo no blanco probablemente tiene una FPR más alta y una tasa de aprobación más baja, lo que indica sesgo.

## Ejemplo de Biotecnología

### Sesgo en un Modelo de Diagnóstico

Un modelo de diagnóstico para cáncer de piel se entrena con un conjunto de datos donde el 90% de las imágenes son de piel clara. Cuando se evalúa en imágenes de piel oscura, la precisión cae del 95% al 70%.

**Tipos de sesgo involucrados:**
- Sesgo de representación (piel oscura subrepresentada)
- Sesgo de medición (las condiciones de captura de imagen pueden diferir)
- Sesgo histórico (la investigación médica se ha centrado históricamente en piel clara)

**Análisis de equidad:**
- Paridad demográfica: para una clase positiva de "requiere biopsia", la tasa debería ser consistente
- Igualdad de oportunidades: la sensibilidad debería ser igual entre tipos de piel
- Probabilidades igualadas: tanto la sensibilidad como la especificidad deberían ser iguales entre tipos de piel

## Ejemplo SaaS

### Contratación Algorítmica

Una plataforma SaaS de reclutamiento ofrece una herramienta de selección con IA. El modelo se entrena con contrataciones exitosas de los últimos 5 años en empresas cliente. El modelo aprende a penalizar a candidatos con espacios en su currículum, lo que afecta desproporcionadamente a mujeres que tomaron licencia parental.

**Mitigación de equidad:**
1. Eliminar o transformar características que son proxies de atributos protegidos
2. Exigir igualdad de oportunidades: los k mejores candidatos deberían tener TPR igual entre géneros
3. Auditoría regular del rendimiento del modelo desplegado por grupo demográfico
4. Informes de transparencia para clientes sobre la demografía del modelo

## Errores Comunes

1. **Asumir equidad por desconocimiento.** Simplemente eliminar el atributo protegido del modelo no elimina el sesgo porque otras características (código postal, educación) pueden actuar como proxies.
2. **Ignorar la interseccionalidad.** El sesgo puede concentrarse en la intersección de múltiples atributos (ej., mujeres de color) en lugar de dimensiones únicas.
3. **Optimizar para una métrica de equidad ignorando otras.** No existe una única definición de equidad universalmente correcta.
4. **Confundir equidad grupal con equidad individual.** Dos individuos similares deberían recibir predicciones similares (equidad individual), lo cual difiere de la paridad a nivel grupal.
5. **Asumir que la equidad es una solución única.** El sesgo puede aparecer o cambiar con el tiempo a medida que las distribuciones de datos se modifican.

## Mejores Prácticas

1. **Auditá tus datos antes de entrenar.** Examiná la composición demográfica, el balance de etiquetas y las distribuciones de características entre grupos.
2. **Probá múltiples métricas de equidad.** Ninguna métrica única captura todo.
3. **Documentá las decisiones de equidad.** Explicá qué definición(es) elegiste y por qué.
4. **Involucrá a expertos del dominio.** Entender por qué existe el sesgo requiere conocimiento del dominio.
5. **Planificá un monitoreo continuo.** La equidad no es una verificación única.

## Resumen

- Tres tipos de sesgo: de datos, algorítmico, social
- Definiciones clave de equidad: paridad demográfica, igualdad de oportunidades, probabilidades igualadas
- Las métricas de equidad compiten y a veces son incompatibles (teorema de imposibilidad)
- La detección de sesgo requiere auditar datos, modelo y errores por grupo
- Existen estrategias de mitigación en cada etapa del pipeline de ML
- Eliminar atributos protegidos es insuficiente (problema del proxy)

## Términos Clave

| Término | Definición |
|---------|------------|
| Sesgo de datos | Sesgo originado en los datos de entrenamiento (representación, medición, histórico) |
| Sesgo algorítmico | Sesgo introducido por decisiones de diseño del modelo (características, objetivo, evaluación) |
| Sesgo social | Sesgo que existe en la sociedad y es reflejado/amplificado por la IA |
| Paridad demográfica | Tasa igual de predicciones positivas entre grupos |
| Igualdad de oportunidades | Tasa igual de verdaderos positivos entre grupos |
| Probabilidades igualadas | TPR y FPR iguales entre grupos |
| Impacto dispar | Cuando una política o práctica afecta desproporcionadamente a un grupo protegido |
| Teorema de imposibilidad | Prueba de que múltiples definiciones de equidad no pueden satisfacerse simultáneamente |
| Proxy | Una característica no protegida que se correlaciona con un atributo protegido |
| Interseccionalidad | El efecto compuesto de múltiples atributos protegidos |

## Ejercicios

### Nivel 1: Comprensión Básica

1. Definí los tres tipos de sesgo en IA. Dá un ejemplo concreto de cada uno.
2. ¿Cuál es la diferencia entre paridad demográfica e igualdad de oportunidades? ¿Cuál usarías para un modelo de aprobación de crédito? ¿Por qué?

### Nivel 2: Implementación

3. Usando el conjunto de datos sintético de préstamos del ejemplo guiado, calculá la razón de impacto dispar para las predicciones del modelo. El impacto dispar se define como la razón de tasas de predicción positiva entre el grupo protegido y el grupo de referencia.
4. Entrená un clasificador Random Forest con los mismos datos y compará las métricas de equidad. ¿La clase del modelo afecta la equidad?

### Nivel 3: Pensamiento Crítico

5. Imaginá que estás construyendo un modelo para predecir qué pacientes necesitan atención de seguimiento. La tasa base de la condición es 2 veces mayor en un grupo demográfico. Discutí si la paridad demográfica es un criterio de equidad apropiado para este escenario. ¿Qué recomendarías en su lugar?
6. Leé el análisis de COMPAS de ProPublica y la respuesta de Northpointe. Ambos usaron estadísticas rigurosas pero llegaron a conclusiones opuestas. Explicá cómo ambos podrían estar "correctos" usando diferentes definiciones de equidad.

## Desafío de Programación

Generá un conjunto de datos sintético con dos grupos demográficos donde un grupo tenga una tasa base más alta de la clase positiva. Entrená un clasificador. Calculá paridad demográfica, igualdad de oportunidades y probabilidades igualadas. Implementá una técnica simple de reponderación de preprocesamiento (asignar pesos de muestra más altos a grupos subrepresentados) y compará las métricas de equidad antes y después.

## Referencias

Angwin, J., Larson, J., Mattu, S., & Kirchner, L. (2016). Machine bias. *ProPublica*. https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing

Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. *Proceedings of the 1st Conference on Fairness, Accountability and Transparency*, 81, 77–91.

Chouldechova, A. (2017). Fair prediction with disparate impact: A study of bias in recidivism prediction instruments. *Big Data*, 5(2), 153–163. https://doi.org/10.1089/big.2016.0047

Dwork, C., Hardt, M., Pitassi, T., Reingold, O., & Zemel, R. (2012). Fairness through awareness. *Proceedings of the 3rd Innovations in Theoretical Computer Science Conference*, 214–226. https://doi.org/10.1145/2090236.2090255

Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. *Advances in Neural Information Processing Systems*, 29, 3315–3323.

Mehrabi, N., Morstatter, F., Saxena, N., Lerman, K., & Galstyan, A. (2021). A survey on bias and fairness in machine learning. *ACM Computing Surveys*, 54(6), 1–35. https://doi.org/10.1145/3457607

Noble, S. U. (2018). *Algorithms of oppression: How search engines reinforce racism*. New York University Press.