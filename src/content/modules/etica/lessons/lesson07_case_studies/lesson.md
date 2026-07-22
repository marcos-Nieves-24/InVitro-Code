---
Module: 5
Lesson Number: 7
Lesson Title: Casos de Estudio en Salud y SaaS
Estimated Duration: 75 minutos
Prerequisites: L1–L6
Learning Objectives:
  - Analizar sesgo real en algoritmos de salud usando principios éticos
  - Evaluar equidad en algoritmos de puntuación crediticia y préstamos
  - Diseñar analítica SaaS responsable con privacidad y transparencia
  - Aplicar técnicas de detección y mitigación de sesgo a conjuntos de datos reales
  - Sintetizar todos los conceptos del Módulo 5 en un análisis de caso integral
Keywords: casos de estudio, sesgo en salud, puntuación crediticia, IA responsable, equidad algorítmica, despliegue ético
Difficulty: Advanced
Programming Concepts: pandas, sklearn, análisis de datos
Mathematical Concepts: Métricas de equidad, disparidades estadísticas
Machine Learning Concepts: Clasificación, evaluación de modelos
Datasets Used: Conjuntos sintéticos de salud y crédito
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Casos de Estudio en Salud y SaaS

## Objetivos de Aprendizaje

Al finalizar esta lección, los estudiantes podrán:

1. **Analizar** el estudio de Obermeyer et al. (2019) sobre sesgo racial en un algoritmo de salud
2. **Evaluar** la equidad en puntuación crediticia usando múltiples definiciones de equidad
3. **Diseñar** un sistema SaaS de analítica responsable que incorpore privacidad, equidad y transparencia
4. **Aplicar** técnicas de detección de sesgo a conjuntos de datos sintéticos de salud y crédito
5. **Sintetizar** todos los conceptos del Módulo 5 en un análisis de caso integral

## Motivación

Esta lección reúne todo lo que aprendiste en el Módulo 5. Vamos a examinar dos dominios del mundo real donde las fallas éticas de IA han causado daño documentado: salud y servicios financieros. Estos no son ejercicios académicos. En 2019, Obermeyer et al. publicaron un estudio que mostraba que un algoritmo de salud usado por hospitales que atienden a más de 100 millones de pacientes estaba sistemáticamente sesgado contra pacientes negros. El algoritmo no usaba la raza explícitamente. Usaba costos de salud como proxy de necesidades de salud — y como los pacientes negros tenían menos acceso a atención médica (y por lo tanto costos más bajos), el algoritmo los etiquetaba como más saludables que pacientes blancos igualmente enfermos. El daño no fue malicioso. Fue estructural. Y fue totalmente prevenible con el análisis ético adecuado.

En el dominio SaaS, las plataformas de puntuación crediticia y préstamos impulsadas por IA toman decisiones automatizadas que afectan el acceso de millones de personas al crédito, la vivienda y las oportunidades financieras. Estos sistemas deben equilibrar la precisión predictiva con la equidad, la transparencia y el cumplimiento normativo.

Al finalizar esta lección, deberías poder realizar un análisis ético integral de cualquier sistema de ML que encuentres — identificando riesgos, proponiendo mitigaciones y evaluando compensaciones entre valores en competencia.

## Panorama General

| Lecciones Anteriores | Lección Actual | Siguiente |
|----------------------|----------------|-----------|
| L1–L6 (Principios, Sesgo, Explicabilidad, Privacidad, Impacto Social, Regulación) | L7: Casos de Estudio (síntesis y aplicación) | Fin del Módulo 5 |

## Teoría

### Caso de Estudio 1: Sesgo Racial en Algoritmos de Salud

#### Antecedentes

Obermeyer et al. (2019) estudiaron un algoritmo comercial usado por hospitales de EE.UU. para identificar pacientes de alto riesgo que se beneficiarían de programas de "gestión de cuidados de alto riesgo". Estos programas proporcionan recursos adicionales (seguimiento de enfermería, coordinación de cuidados) a pacientes con necesidades de salud complejas.

El algoritmo predecía qué pacientes generarían altos costos de salud. El supuesto subyacente: los pacientes que generarán altos costos son aquellos con altas necesidades de salud, por lo que apuntar al costo equivale a apuntar a la necesidad.

#### El Hallazgo

El algoritmo subestimaba sistemáticamente las necesidades de salud de los pacientes negros. Para cualquier puntaje de riesgo dado, los pacientes negros estaban más enfermos que los pacientes blancos. El algoritmo etiquetaba falsamente a los pacientes negros como más saludables que pacientes blancos igualmente enfermos.

**El mecanismo:** El algoritmo usaba costos de salud como proxy de necesidades de salud. Debido a barreras sistémicas (acceso a la atención, cobertura de seguro, confianza en el sistema de salud), los pacientes negros con el mismo nivel de necesidad de salud generan costos de salud más bajos que los pacientes blancos. El algoritmo aprendió que "costo bajo = saludable", lo cual era incorrecto para pacientes negros.

#### Magnitud

El sesgo redujo en más de la mitad la cantidad de pacientes negros identificados para cuidados adicionales. Si el algoritmo no estuviera sesgado, la cantidad de pacientes negros derivados para cuidados adicionales se habría aproximadamente duplicado.

#### Causas Raíz

1. **Problema del proxy:** El costo es un proxy sesgado de la necesidad cuando el acceso a la atención varía según la raza.
2. **Sesgo de etiqueta:** La etiqueta de entrenamiento (costo) no mide lo que realmente nos importa (necesidad).
3. **Sesgo histórico/sistémico:** Los datos reflejan el racismo estructural en el acceso a la salud.
4. **Falta de auditoría de equidad:** El algoritmo se desplegó sin probar disparidades demográficas.

#### Solución

Obermeyer et al. mostraron que reentrenar el algoritmo para predecir "cantidad de enfermedades crónicas" (una medida más directa de la necesidad de salud) en lugar del costo eliminó el 84% del sesgo.

#### Análisis Ético

| Principio | Aplicación |
|-----------|------------|
| Beneficencia | El algoritmo buscaba mejorar resultados de salud, pero falló para pacientes negros |
| No maleficencia | Causó daño al negar recursos a quienes más los necesitaban |
| Justicia | Distribuyó recursos de salud de manera inequitativa por raza |
| Autonomía | Los pacientes no sabían que se usaba un algoritmo para asignar cuidados |
| Explicabilidad | El problema del proxy no era transparente para los usuarios |

### Caso de Estudio 2: Equidad en Puntuación Crediticia

#### Antecedentes

Los algoritmos de puntuación crediticia predicen la probabilidad de que un prestatario incumpla un préstamo. Estos puntajes determinan el acceso al crédito, hipotecas y, a veces, el empleo y la vivienda. El sistema de puntuación más usado es FICO, pero muchas empresas fintech usan modelos de ML para una evaluación de riesgo más granular.

#### El Desafío

La puntuación crediticia enfrenta desafíos fundamentales de equidad:

1. **Discriminación histórica:** Los datos de entrenamiento de préstamos pasados reflejan discriminación histórica (redlining, direccionamiento). El modelo aprende a replicar estos patrones.
2. **Características proxy:** Características como código postal, nivel educativo e incluso historial de transacciones pueden ser proxy de raza y estatus socioeconómico.
3. **Diferencias en tasas base:** Diferentes grupos tienen diferentes tasas históricas de incumplimiento debido a la desigualdad económica sistémica. Igualar resultados (paridad demográfica) puede entrar en conflicto con la precisión predictiva.
4. **Requisitos regulatorios:** La Ley de Igualdad de Oportunidades Crediticias (ECOA) prohíbe la discriminación por raza, color, religión, origen nacional, sexo, estado civil, edad o ingresos por asistencia pública.

#### Análisis de Equidad

| Definición de Equidad | Aplicación a Puntuación Crediticia |
|-----------------------|-----------------------------------|
| Paridad demográfica | Tasas de aprobación iguales entre grupos. Puede entrar en conflicto con diferencias en tasas base. |
| Igualdad de oportunidades | TPR igual: solicitantes calificados igualmente propensos a ser aprobados independientemente del grupo. |
| Probabilidades igualadas | TPR y FPR iguales: los errores afectan a todos los grupos por igual. |
| Impacto dispar | La razón de tasas de aprobación entre grupos debe superar 0.8 (regla de 4/5 de la EEOC). |

#### Diseño de Puntuación Crediticia Responsable

1. **Selección de características:** Evitar proxies de atributos protegidos.
2. **Notificación de acción adversa:** Proporcionar razones específicas para la denegación (requisito ECOA).
3. **Monitoreo regular de equidad:** Auditar tasas de aprobación, TPR, FPR por grupo demográfico.
4. **Precaución con datos alternativos:** Usar datos alternativos (redes sociales, pagos de servicios) puede introducir nuevas fuentes de sesgo.
5. **Revisión humana:** Permitir anulación manual para casos límite.

### Caso de Estudio 3: Analítica SaaS Ética

#### Antecedentes

Las plataformas SaaS recolectan grandes cantidades de datos de comportamiento de usuarios: clics, tiempo de uso, uso de funciones, compras, interacciones de soporte. La analítica impulsada por IA extrae información para ayudar a las empresas a mejorar productos, reducir la pérdida de clientes y aumentar ingresos.

#### Desafíos Éticos

1. **Privacidad:** Los usuarios pueden no saber que su comportamiento se analiza a este nivel de detalle.
2. **Consentimiento:** ¿Es suficiente el consentimiento implícito (usar el producto) para analítica predictiva?
3. **Transparencia:** ¿Debería informarse a los usuarios que un modelo predice su probabilidad de cancelación?
4. **Manipulación:** Las recomendaciones personalizadas pueden cruzar la línea hacia la manipulación.
5. **Equidad:** Si una plataforma SaaS optimiza para clientes de altos ingresos, los clientes más pequeños pueden recibir peor servicio.
6. **Retención de datos:** ¿Por cuánto tiempo deberían conservarse los datos de comportamiento?

#### Principios de Diseño para Analítica SaaS Responsable

1. **Privacidad desde el diseño:** Agregar datos cuando sea posible; anonimizar o seudonimizar.
2. **Transparencia:** Publicar una descripción clara de qué datos se recolectan y cómo se usan.
3. **Control del usuario:** Permitir que los usuarios opten por no participar en analítica de comportamiento (sin perder funcionalidad central).
4. **Auditoría de equidad:** Monitorear si el sistema de analítica trata a todos los segmentos de clientes de manera equitativa.
5. **Mitigación de sesgo:** Verificar sesgo algorítmico en modelos predictivos (predicción de cancelación, venta adicional).
6. **Minimización de datos:** Solo recolectar datos necesarios para el propósito declarado.

## Ejemplo Guiado

### Analizar Sesgo en un Conjunto Sintético de Crédito

Generamos un conjunto de datos sintético de crédito con información demográfica y analizamos equidad.

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import confusion_matrix

# Generate synthetic credit data
np.random.seed(42)
n = 10000

age = np.random.normal(45, 12, n)
income = np.where(np.random.random(n) > 0.2,
                  np.random.normal(65, 30, n),
                  np.random.normal(40, 15, n))
credit_history = np.random.normal(5, 2, n)
loan_amount = np.random.uniform(1000, 50000, n)

# Protected attribute: race (0 = majority, 1 = minority)
race = np.random.choice([0, 1], size=n, p=[0.7, 0.3])

# Target: default (slightly higher default rate for minority group)
# due to systemic factors, not inherent difference
default_prob = 0.1 + 0.3 * (credit_history < 3).astype(float) + \
               0.05 * race  # small structural difference
default = np.random.binomial(1, np.clip(default_prob, 0.05, 0.5))

# Train model (without race)
X = pd.DataFrame({'age': age, 'income': income,
                  'credit_history': credit_history,
                  'loan_amount': loan_amount})
y = default

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
model = GradientBoostingClassifier(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

## Ejemplo de Biotecnología

### Auditoría de Algoritmo de Diagnóstico Sintético

Un algoritmo de diagnóstico predice riesgo de enfermedad a partir de biomarcadores. Los datos de entrenamiento son 75% de la Población A y 25% de la Población B. El algoritmo alcanza 92% de precisión en la Población A pero 78% en la Población B.

**Detección de sesgo:**
- Sesgo de representación: Población B subrepresentada
- Brecha de rendimiento del modelo: 14 puntos porcentuales de diferencia en precisión
- Métricas de equidad: calcular TPR, FPR, PPV, NPV por población

**Mitigación:**
1. Recolectar más datos de la Población B
2. Muestreo estratificado durante el entrenamiento
3. Umbrales específicos por grupo para igualar TPR o FPR
4. Monitoreo regular post-despliegue

**Principios éticos:**
- Justicia: el rendimiento desigual viola la justicia distributiva
- No maleficencia: el diagnóstico erróneo en la Población B causa daño
- Explicabilidad: deben documentarse las disparidades de rendimiento

## Ejemplo SaaS

### Predicción Ética de Cancelación

Una empresa SaaS construye un modelo de predicción de cancelación para identificar clientes con probabilidad de darse de baja. El modelo identifica dos segmentos:

- **Pequeñas empresas** (menores ingresos): Mayor probabilidad de cancelación porque tienen menos usuarios y menor participación
- **Clientes empresariales** (mayores ingresos): Menor probabilidad de cancelación

La empresa planea ofrecer descuentos de retención solo al segmento de alta cancelación. Pero esto recompensa desproporcionadamente a las pequeñas empresas (que necesitan el descuento) mientras que los clientes empresariales (con más poder de negociación) no reciben ninguna oferta.

**Análisis ético:**
- ¿Deberían distribuirse los recursos de retención según el valor del cliente o la necesidad del cliente?
- ¿Es justo optimizar el gasto en retención para el máximo ROI si esto desprioriza a clientes más pequeños?
- ¿Qué obligaciones de transparencia tiene la empresa con los clientes cuyos datos se utilizan?

**Enfoque responsable:**
1. Retención neutral por segmento: asignar recursos proporcionales al riesgo de cancelación, no al valor del cliente
2. Transparencia: divulgar la recolección de datos y el uso del modelo en los términos de servicio
3. Exclusión voluntaria: permitir que los clientes excluyan sus datos del modelo de cancelación
4. Auditoría: monitorear si el modelo perjudica a algún segmento de clientes

## Errores Comunes

1. **Asumir que un modelo bien intencionado no causa daño.** El algoritmo de Obermeyer no era malicioso; causó daño a través de un defecto de diseño.
2. **Ignorar el problema del proxy.** Las características que se correlacionan con el objetivo pueden seguir estando sesgadas.
3. **Probar equidad solo en métricas generales.** Hay que probar en todos los subgrupos demográficos.
4. **Asumir que una definición de equidad sirve para todos los contextos.** La puntuación crediticia y la salud necesitan diferentes criterios de equidad.
5. **Olvidar que la equidad no es la única preocupación ética.** La privacidad, la transparencia y la responsabilidad también importan.

## Mejores Prácticas

1. **Siempre probar los modelos en subgrupos demográficos antes del despliegue.**
2. **Elegir métricas de equidad que coincidan con el contexto del dominio.**
3. **Documentar las decisiones de selección de características y su fundamento ético.**
4. **Planificar un monitoreo continuo — la equidad no es una verificación única.**
5. **Involucrar a expertos del dominio y comunidades afectadas en el diseño del sistema.**
6. **Incorporar transparencia desde el principio.**

## Resumen

- Obermeyer et al. (2019): algoritmo de salud usó costo como proxy de necesidad, causando sesgo racial.
- La puntuación crediticia requiere selección cuidadosa de características, monitoreo de equidad y cumplimiento normativo.
- La analítica SaaS responsable equilibra el valor comercial con la privacidad del usuario y la equidad.
- El sesgo puede detectarse mediante análisis de rendimiento por subgrupo y métricas de equidad.
- La mitigación requiere cambios en los datos, el modelo o la estrategia de despliegue.
- No existe una única solución correcta — cada caso requiere razonamiento ético específico del contexto.

## Términos Clave

| Término | Definición |
|---------|------------|
| Problema del proxy | Usar una variable que se correlaciona con el objetivo pero está sesgada entre grupos |
| Sesgo de etiqueta | Sesgo en la variable objetivo utilizada para el entrenamiento |
| Gestión de cuidados de alto riesgo | Programa de salud que proporciona recursos adicionales a pacientes de alta necesidad |
| Notificación de acción adversa | Requisito legal de explicar las razones de denegación de crédito |
| ECOA | Ley de Igualdad de Oportunidades Crediticias — prohíbe la discriminación crediticia |
| Predicción de cancelación | Modelo que predice qué clientes cancelarán un servicio |
| Privacidad desde el diseño | Incorporar protecciones de privacidad en la arquitectura del sistema desde el principio |

## Ejercicios

### Nivel 1: Comprensión Básica

1. En el algoritmo de salud de Obermeyer, ¿cuál era la variable proxy? ¿Por qué estaba sesgada?
2. Enumerá tres principios éticos de la Lección 1 y explicá cómo se aplican a la puntuación crediticia.

### Nivel 2: Implementación

3. Usando el conjunto de datos sintético de crédito del ejemplo guiado, calculá la diferencia de paridad demográfica y la diferencia de igualdad de oportunidades. ¿El modelo presenta sesgo?
4. Reentrená el modelo sin las características problemáticas. ¿Mejoran las métricas de equidad? ¿A qué costo en precisión?

### Nivel 3: Pensamiento Crítico

5. Una empresa SaaS usa IA para predecir cancelación de clientes y ofrece descuentos de retención a los clientes de mayor riesgo. Esto lleva a que los clientes empresariales reciban menos descuentos que las pequeñas empresas. ¿Es esto ético? Defendé tu posición.
6. Diseñá un proceso de revisión de IA responsable para una empresa que construye sistemas de puntuación crediticia con IA. ¿Qué etapas debería tener la revisión? ¿Quién debería estar en el comité de revisión? ¿Qué criterios deberían usar para aprobar o rechazar un modelo?
7. El algoritmo de Obermeyer podía corregirse cambiando la variable objetivo de costo a cantidad de enfermedades crónicas. ¿Existen casos donde ninguna variable objetivo sea imparcial? ¿Qué deberían hacer los desarrolladores en ese caso?

## Desafío de Programación

Usando el conjunto de datos sintético de salud del notebook:
1. Entrená un modelo para predecir necesidad de salud
2. Usá el costo como proxy de necesidad (como en el caso real)
3. Medí el sesgo entre dos grupos demográficos
4. Reentrená el modelo usando una variable objetivo diferente
5. Compará las métricas de equidad antes y después
6. Visualizá la mejora

## Referencias

Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. *Science*, 366(6464), 447–453. https://doi.org/10.1126/science.aax2342

Angwin, J., Larson, J., Mattu, S., & Kirchner, L. (2016). Machine bias. *ProPublica*. https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing

Benjamin, R. (2019). *Race after technology: Abolitionist tools for the new Jim Code*. Polity Press.

O'Neil, C. (2016). *Weapons of math destruction: How big data increases inequality and threatens democracy*. Crown Publishing Group.

Noble, S. U. (2018). *Algorithms of oppression: How search engines reinforce racism*. New York University Press.