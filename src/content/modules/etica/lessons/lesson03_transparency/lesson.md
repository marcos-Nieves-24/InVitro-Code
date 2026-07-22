---
Module: 5
Lesson Number: 3
Lesson Title: Transparencia y Explicabilidad
Estimated Duration: 60 minutos
Prerequisites: L1 (Introducción a la Ética en IA), Módulo 4 (ML)
Learning Objectives:
  - Diferenciar entre interpretabilidad y explicabilidad
  - Explicar el problema de la caja negra en ML
  - Describir SHAP y LIME como métodos de explicación de modelos
  - Implementar LIME para explicar la predicción de un clasificador
  - Evaluar las limitaciones de los métodos de explicación post-hoc
Keywords: transparencia, explicabilidad, interpretabilidad, XAI, SHAP, LIME, caja negra
Difficulty: Intermediate
Programming Concepts: Llamadas a funciones, uso de librerías, visualización
Mathematical Concepts: Importancia de características, aproximaciones locales
Machine Learning Concepts: Predicción de modelos, clasificación, importancia de características
Datasets Used: Iris o conjunto sintético
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Transparencia y Explicabilidad

## Objetivos de Aprendizaje

Al finalizar esta lección, los estudiantes podrán:

1. **Diferenciar** entre interpretabilidad y explicabilidad en el contexto de ML
2. **Explicar** el problema de la caja negra y por qué importa para decisiones de alto impacto
3. **Describir** cómo SHAP y LIME generan explicaciones para predicciones individuales
4. **Implementar** LIME para explicar la predicción de un clasificador Random Forest
5. **Evaluar** las limitaciones y riesgos de los métodos de explicación post-hoc

## Motivación

Imaginá que sos un médico usando un sistema de IA que recomienda si iniciar o no quimioterapia a un paciente. El modelo es una máquina de gradient boosting con 500 árboles. Dice: "Alto riesgo de mortalidad en 5 años. Recomendar quimioterapia."

El paciente pregunta: "¿Por qué?"

¿Qué decís? "Porque el modelo lo dijo" no es aceptable. El paciente merece saber qué factores impulsaron la predicción, si esos factores son relevantes para su caso específico y si el modelo podría estar equivocado.

Este es el **problema de la caja negra**. Muchos de nuestros modelos más potentes — redes neuronales profundas, gradient boosting, random forests — son muy precisos pero opacos. No explican naturalmente su razonamiento.

**IA Explicable (XAI)** es el campo que desarrolla métodos para abrir la caja negra. No es solo algo lindo de tener. Según la Ley de IA de la UE, las personas tienen derecho a una explicación de las decisiones tomadas por sistemas de IA. En salud, finanzas, justicia penal y contratación, la explicabilidad es un requisito legal y ético.

## Panorama General

| Lección Anterior | Lección Actual | Próxima Lección |
|---|---|---|
| L2: Sesgo y Equidad (detección de disparidades) | L3: Transparencia y Explicabilidad (explicar decisiones) | L4: Privacidad y Protección de Datos (proteger datos) |

## Teoría

### El Problema de la Caja Negra

Un **modelo de caja negra** es un modelo cuyo proceso interno de decisión no es directamente comprensible para los humanos. Las redes neuronales profundas con millones de parámetros, los ensambles de cientos de árboles y las SVM de kernel complejo son todas cajas negras.

El problema de la caja negra tiene tres dimensiones:

1. **Epistémica:** No podemos saber con certeza cómo el modelo llega a sus decisiones.
2. **Confianza:** Los usuarios no pueden confiar en lo que no entienden.
3. **Responsabilidad:** Si no podemos explicar una decisión, ¿quién es responsable por el daño?

### Interpretabilidad vs. Explicabilidad

Estos términos a menudo se usan indistintamente pero tienen significados distintos:

| Concepto | Definición | Ejemplo |
|----------|------------|---------|
| **Interpretabilidad** | El grado en que un humano puede entender el funcionamiento interno del modelo | Los coeficientes de una regresión lineal te dicen directamente cómo cada característica afecta la salida |
| **Explicabilidad** | El grado en que un humano puede entender por qué se hizo una predicción específica | LIME te dice que para esta denegación de préstamo en particular, el factor más importante fue el puntaje crediticio |

Un modelo interpretable (ej., regresión lineal, árbol de decisión pequeño) es inherentemente transparente. Un modelo explicable puede ser una caja negra que requiere métodos de explicación post-hoc para hacer comprensibles las predicciones individuales.

### Tipos de Explicabilidad

#### Explicaciones Globales
Explican el comportamiento completo del modelo. Ejemplo: ranking de importancia de características para un Random Forest.

#### Explicaciones Locales
Explican una predicción individual. Ejemplo: ¿por qué este paciente en particular fue clasificado como de alto riesgo?

#### Específicas del Modelo vs. Agnósticas del Modelo
- **Específicas del modelo:** Solo funcionan para ciertos tipos de modelo (ej., visualización de árboles de decisión)
- **Agnósticas del modelo:** Funcionan para cualquier modelo (ej., LIME, SHAP)

### LIME (Explicaciones Locales Agnósticas del Modelo Interpretables)

LIME (Ribeiro et al., 2016) explica predicciones individuales ajustando un modelo simple e interpretable localmente alrededor de la predicción.

**Intuición:** Incluso si un modelo complejo tiene un límite de decisión global complicado, localmente (cerca de un punto específico), el límite puede aproximarse con un modelo lineal simple.

**Cómo funciona:**
1. Tomar la instancia a explicar
2. Perturbar la instancia (crear instancias similares con cambios aleatorios)
3. Obtener predicciones del modelo caja negra para las instancias perturbadas
4. Ajustar un modelo lineal ponderado (u otro modelo interpretable) a los datos perturbados
5. Los coeficientes del modelo lineal explican qué características fueron más importantes para esta predicción

**Fórmula:**
$$\xi(x) = \arg\min_{g \in G} \mathcal{L}(f, g, \pi_x) + \Omega(g)$$

donde:
- $f$ es el modelo caja negra
- $g$ es el modelo interpretable (ej., modelo lineal)
- $\pi_x$ es la medida de proximidad alrededor de la instancia $x$
- $\mathcal{L}$ mide qué tan bien $g$ aproxima $f$ localmente
- $\Omega(g)$ mide la complejidad de $g$

### SHAP (Explicaciones Aditivas de Shapley)

SHAP (Lundberg & Lee, 2017) explica predicciones usando valores Shapley de la teoría de juegos cooperativos.

**Intuición:** Imaginá que las características son "jugadores" en un juego, y la predicción es el "pago". SHAP calcula la contribución de cada característica a la predicción promediando sobre todos los subconjuntos posibles de características.

**Propiedades clave:**
- **Eficiencia:** La suma de los valores Shapley equivale a la predicción menos la predicción promedio
- **Simetría:** Dos características con contribuciones idénticas reciben el mismo valor
- **Dummy:** Las características sin contribución reciben cero
- **Aditividad:** Los valores Shapley pueden sumarse entre características

Los valores SHAP unifican varios métodos de explicación existentes y proporcionan explicaciones consistentes y localmente precisas.

### Compensaciones en Explicabilidad

| Método | Fortalezas | Limitaciones |
|--------|------------|--------------|
| Importancia de características (global) | Simple, rápida | Solo global, sin explicaciones locales |
| LIME | Local, agnóstico del modelo | Inestable (diferentes explicaciones para instancias similares), sensible a parámetros de perturbación |
| SHAP | Fundamento teórico, consistente | Costoso computacionalmente para modelos grandes |
| Árboles de decisión son inherentemente interpretables | No necesita explicación | Poder predictivo limitado para problemas complejos |

## Ejemplo Guiado

### Explicar una Denegación de Préstamo con LIME

Entrenamos un Random Forest con datos de préstamos y usamos LIME para explicar por qué se denegó a un solicitante específico.

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
# LIME installation: pip install lime
import lime
import lime.lime_tabular

# Generate loan data
np.random.seed(42)
n = 500
income = np.random.normal(60, 25, n)
credit_score = np.random.normal(680, 60, n)
loan_amount = np.random.uniform(1000, 50000, n)
years_employed = np.random.uniform(0, 30, n)
default = (credit_score < 650).astype(int) * 0.6 + \
          (income < 40).astype(int) * 0.3

X = pd.DataFrame({
    'income': income,
    'credit_score': credit_score,
    'loan_amount': loan_amount,
    'years_employed': years_employed
})
y = (default > 0.5).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# LIME explanation
explainer = lime.lime_tabular.LimeTabularExplainer(
    X_train.values,
    feature_names=X.columns,
    class_names=['approved', 'denied'],
    mode='classification'
)

# Explain a specific prediction
instance = X_test.iloc[0].values.reshape(1, -1)
exp = explainer.explain_instance(
    instance[0],
    model.predict_proba,
    num_features=4
)
exp.show_in_notebook(show_table=True)
print("Explanation as list:", exp.as_list())
```

## Ejemplo de Biotecnología

### Explicar una Predicción de Estructura de Proteínas

Un modelo de deep learning predice el plegamiento de proteínas. El modelo es una caja negra. Usando SHAP, los investigadores pueden identificar qué posiciones de aminoácidos son más influyentes en la predicción. Esto proporciona información biológica sobre qué residuos impulsan la estabilidad estructural.

**Por qué la explicabilidad importa en bioinformática:**
- Validar que el modelo está usando características biológicamente significativas
- Generar hipótesis para pruebas experimentales
- Generar confianza en predicciones computacionales
- Cumplir con requisitos regulatorios para modelos de diagnóstico

## Ejemplo SaaS

### Puntuación Crediticia Explicable

Una plataforma SaaS fintech usa Gradient Boosting para puntuar solicitantes de préstamos. Los reguladores exigen explicabilidad. La plataforma integra SHAP para proporcionar:

- **Explicación orientada al cliente:** "Su solicitud fue rechazada principalmente debido a su relación deuda-ingreso y pagos atrasados recientes."
- **Explicación para el auditor del modelo:** Ranking de importancia de características, gráficos de dependencia parcial, gráfico resumen SHAP.
- **Documentación de cumplimiento:** Informe de explicación global para revisión regulatoria.

## Errores Comunes

1. **Equiparar interpretabilidad con simplicidad.** Un árbol de decisión con 200 nodos no es realmente interpretable.
2. **Confiar en las explicaciones de LIME/SHAP como verdad absoluta.** Las explicaciones post-hoc aproximan el modelo; pueden estar equivocadas.
3. **Ignorar la inestabilidad de las explicaciones.** Diferentes ejecuciones de LIME sobre la misma instancia pueden producir explicaciones diferentes.
4. **Confiar excesivamente en la importancia global de características.** La importancia global enmascara el comportamiento local.
5. **Asumir que las explicaciones resuelven todos los problemas de confianza.** Una explicación puede ser correcta pero aún así ocultar un comportamiento dañino del modelo.

## Mejores Prácticas

1. **Preferir modelos inherentemente interpretables** cuando la precisión es comparable.
2. **Usar múltiples métodos de explicación** y verificar consistencia.
3. **Validar explicaciones con expertos del dominio.** Una explicación que sorprende a un médico puede indicar un error del modelo.
4. **Documentar las limitaciones de las explicaciones.** Los usuarios deberían saber cuándo una explicación podría no ser confiable.
5. **Diseñar explicaciones para la audiencia.** Un paciente, un médico y un regulador necesitan diferentes niveles de detalle.

## Resumen

- Los modelos de caja negra logran alta precisión pero son opacos.
- La interpretabilidad se trata de entender el modelo; la explicabilidad se trata de explicar predicciones individuales.
- LIME explica predicciones ajustando modelos lineales locales.
- SHAP explica predicciones usando valores Shapley de teoría de juegos.
- Las explicaciones post-hoc son aproximaciones con limitaciones conocidas.
- En dominios de alto impacto (salud, finanzas), la explicabilidad es un requisito ético y legal.

## Términos Clave

| Término | Definición |
|---------|------------|
| Modelo de caja negra | Un modelo cuyo proceso interno de decisión no es directamente comprensible para los humanos |
| Interpretabilidad | El grado en que los humanos pueden entender el funcionamiento interno de un modelo |
| Explicabilidad | El grado en que los humanos pueden entender por qué se hizo una predicción específica |
| Explicación post-hoc | Una explicación generada después de una predicción, sin modificar el modelo |
| LIME | Explicaciones Locales Agnósticas del Modelo Interpretables |
| SHAP | Explicaciones Aditivas de Shapley |
| Agnóstico del modelo | Un método de explicación que funciona con cualquier modelo de ML |
| Explicación global | Una explicación del comportamiento general del modelo |
| Explicación local | Una explicación de una predicción individual |

## Ejercicios

### Nivel 1: Comprensión Básica

1. ¿Qué es el problema de la caja negra? Dá tres dominios donde es particularmente preocupante.
2. Explicá la diferencia entre interpretabilidad y explicabilidad. Dá un ejemplo de cada una.

### Nivel 2: Implementación

3. Usando el conjunto de datos de préstamos del ejemplo guiado, usá LIME para explicar una solicitud denegada. Compará la explicación con una solicitud aprobada. ¿Qué características difieren?
4. Entrená un modelo de regresión lineal con los mismos datos y compará la explicación de LIME para la misma instancia. ¿Sigue siendo útil LIME para un modelo inherentemente interpretable?

### Nivel 3: Pensamiento Crítico

5. Un investigador usa SHAP para explicar un modelo de diagnóstico. La explicación muestra que el modelo depende en gran medida de una característica que el investigador sabe que es biológicamente irrelevante. Sin embargo, el modelo tiene 97% de precisión. ¿Qué podría estar pasando? ¿Qué debería hacer el investigador?
6. Algunos críticos argumentan que las explicaciones post-hoc pueden ser engañosas porque aproximan el modelo en lugar de revelar su lógica verdadera. ¿Estás de acuerdo? ¿Bajo qué circunstancias podría una explicación ser peor que ninguna explicación?

## Desafío de Programación

Usá LIME o SHAP para explicar un modelo de gradient boosting entrenado con un conjunto de datos de tu elección. Creá un gráfico resumen que muestre las principales características. Escribí una breve interpretación de lo que aprendió el modelo, e identificá al menos una preocupación potencial sobre el comportamiento del modelo basada en las explicaciones.

## Referencias

Lundberg, S. M., & Lee, S.-I. (2017). A unified approach to interpreting model predictions. *Advances in Neural Information Processing Systems*, 30, 4765–4774.

Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why should I trust you?": Explaining the predictions of any classifier. *Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining*, 1135–1144. https://doi.org/10.1145/2939672.2939778

Russell, S., & Norvig, P. (2020). *Artificial intelligence: A modern approach* (4th ed.). Pearson. (Capítulo sobre Explicabilidad)