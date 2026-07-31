---
Module: 5
Lesson Number: 2
Lesson Title: Sesgo y Equidad
Estimated Duration: 75 minutos
Prerequisites: L1 (Introducción a la Ética en IA)
Learning Objectives:
  - Diferenciar tres tipos de sesgo: de datos, algorítmico y social
  - Definir criterios formales de equidad: paridad demográfica, igualdad de oportunidades, probabilidades igualadas
  - Implementar métricas de equidad en Python usando sklearn
  - Analizar el caso COMPAS de reincidencia e identificar fuentes de sesgo
  - Aplicar al menos una estrategia de mitigación de sesgo
Keywords: sesgo, equidad, paridad demográfica, igualdad de oportunidades, COMPAS, disparate impact
Difficulty: Intermedio
Programming Concepts: sklearn.metrics, fairness metrics, disparate impact ratio
Mathematical Concepts: probabilidad condicional, tasas de falsos positivos/negativos
Machine Learning Concepts: fairness-aware ML, métricas de equidad, mitigación de sesgo
Datasets Used: COMPAS recidivism, Adult Census Income
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Cuando el algoritmo es racista sin saberlo" eyebrow="INICIO">

<MascotMessage mood="neutral">
COMPAS, un algoritmo usado en cortes de EE.UU., etiquetaba a acusados negros como "alto riesgo" al doble de tasa que a blancos. La empresa dijo que era justo. Los investigadores dijeron que era sesgado. Ambos tenían razón matemática. Bienvenido a la equidad algorítmica.
</MascotMessage>

En 2016, ProPublica investigó COMPAS, un algoritmo que predecía reincidencia criminal. Resultados:

- **Falsos positivos en negros:** 45% (etiquetados como reincidentes sin serlo)
- **Falsos positivos en blancos:** 23%
- **Falsos negativos en blancos:** 48% (liberados como "bajo riesgo" pero reincidieron)

Northpointe, la empresa, se defendió: "para cualquier puntaje dado, la probabilidad real de reincidencia es igual entre grupos."

<ConceptCard variant="key-idea">
**Ambos tenían razón.** ProPublica usaba una definición de equidad (igualdad de falsos positivos entre grupos). Northpointe usaba otra (calibración: mismo puntaje = misma probabilidad real). La equidad no es un concepto matemático único — es un valor social en disputa traducido a matemática.
</ConceptCard>

</Section>

<Section number={2} title="Los tres tipos de sesgo" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**1. Sesgo de datos.** Los datos de entrenamiento no representan a la población real. Subtipos: histórico (datos reflejan prejuicios del pasado), representación (grupos subrepresentados), medición (features medidas distinto entre grupos), etiqueta (la variable objetivo ya está sesgada — ej. usar arrestos como proxy de criminalidad).
</ConceptCard>

<ConceptCard variant="definition">
**2. Sesgo algorítmico.** Surge de decisiones de diseño: selección de features (incluir proxies como código postal), función objetivo (optimizar accuracy sacrifica minorías), arquitectura del modelo (algunos amplifican sesgos).
</ConceptCard>

<ConceptCard variant="definition">
**3. Sesgo social.** La sociedad ya es desigual y el modelo lo refleja o amplifica. Bucles de retroalimentación: un modelo sesgado decide quién recibe préstamos → los datos futuros muestran que ciertos grupos "pagan menos" → el modelo refuerza el sesgo.
</ConceptCard>

<ReflectionCheck
  blockId="reflection-e02-feedback-loop"
  moduleSlug="etica"
  lessonSlug="lesson02_bias_fairness"
  prompt="Un banco usa ML para aprobar préstamos. El modelo aprende que ciertos códigos postales tienen más defaults. ¿Es esto sesgo de datos, algorítmico o social?"
  answer="Los tres. Es sesgo de datos porque los datos históricos reflejan discriminación pasada (redlining). Es sesgo algorítmico porque incluir código postal como feature captura raza por proxy. Es sesgo social porque, si el modelo niega préstamos en esas zonas, los residentes no pueden construir crédito → futuros datos confirmarán el sesgo → bucle de retroalimentación. El desafío no es identificar un tipo — es que están entrelazados."
/>

</Section>

<Section number={3} title="Tres definiciones de equidad (y por qué no podés tener las tres)" eyebrow="MATEMÁTICA">

<ComparisonTable
  rows={[
    { feature: "Paridad demográfica", left: "Cada grupo debe recibir resultados positivos en la misma proporción. P(ŷ=1|A=0) = P(ŷ=1|A=1). Problema: si un grupo tiene tasa base más alta, forzar paridad requiere bajar estándares artificialmente." },
    { feature: "Igualdad de oportunidades", left: "Misma tasa de verdaderos positivos entre grupos. De los que realmente son positivos, el modelo acierta igual en ambos grupos. P(ŷ=1|Y=1,A=0) = P(ŷ=1|Y=1,A=1)." },
    { feature: "Probabilidades igualadas", left: "Igualdad de oportunidades + misma tasa de falsos positivos. Más estricto — el modelo debe tener el mismo rendimiento en ambos grupos tanto para positivos como negativos." },
  ]}
/>

<ConceptCard variant="key-idea">
**Teorema de imposibilidad:** No podés tener simultáneamente calibración (mismo puntaje = misma probabilidad real) Y paridad demográfica, a menos que las tasas base sean iguales entre grupos o el modelo sea perfecto. La equidad implica elegir qué definición priorizar. No hay atajo matemático.
</ConceptCard>

</Section>

<Section number={4} title="Midiendo la inequidad en código" eyebrow="CÓDIGO">

```python
import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix

# Simulamos un modelo sesgado
np.random.seed(42)
n = 1000
group = np.random.binomial(1, 0.3, n)  # 0=mayoría, 1=minoría
y_true = np.random.binomial(1, 0.5, n)
# El modelo es menos preciso para el grupo minoritario
y_pred = np.where(group == 0,
    y_true,  # perfecto para mayoría
    np.random.binomial(1, 0.3, n))  # ruidoso para minoría

def fairness_metrics(y_true, y_pred, group):
    for g, name in [(0, 'Mayoría'), (1, 'Minoría')]:
        mask = group == g
        tn, fp, fn, tp = confusion_matrix(
            y_true[mask], y_pred[mask]).ravel()
        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        print(f"{name}: TPR={tpr:.3f}, FPR={fpr:.3f}")

fairness_metrics(y_true, y_pred, group)

# Disparate impact: ratio de selección minoría/mayoría
sel_maj = y_pred[group == 0].mean()
sel_min = y_pred[group == 1].mean()
di = sel_min / sel_maj
print(f"\nDisparate Impact: {di:.3f}")
print(f"{'CUMPLE' if di >= 0.8 else 'NO CUMPLE'} la regla del 80%")
```

<CalloutInfo>
La **regla del 80%** (o disparate impact): la tasa de selección del grupo minoritario debe ser al menos el 80% de la del grupo mayoritario. Es un estándar legal en EE.UU. para discriminación laboral, adoptado como mínimo de equidad en ML.
</CalloutInfo>

</Section>

<Section number={5} title="Estrategias de mitigación" eyebrow="HERRAMIENTA">

<ComparisonTable
  rows={[
    { feature: "Pre-procesamiento", left: "Modificar los datos de entrenamiento para eliminar sesgo antes de entrenar. Reesampleo para balancear grupos, eliminación de proxies, generación de datos sintéticos." },
    { feature: "In-procesamiento", left: "Agregar restricciones de equidad a la función de pérdida durante el entrenamiento. Penalizar disparidades entre grupos." },
    { feature: "Post-procesamiento", left: "Ajustar las predicciones del modelo entrenado para cumplir criterios de equidad. Cambiar umbrales de decisión por grupo." },
  ]}
/>

<CalloutCheck>
Regla práctica: empezá siempre por auditar tus datos. La mayoría del sesgo viene de los datos, no del algoritmo. Si tus datos de entrenamiento no representan a la población que vas a afectar, ningún truco algorítmico te salva.
</CalloutCheck>

</Section>

<Section number={6} title="Resumen" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
El sesgo tiene tres fuentes entrelazadas: datos, algoritmo y sociedad. Existen múltiples definiciones de equidad matemática y no podés satisfacerlas todas a la vez. Elegir cuál priorizar es una decisión ética, no técnica. Medí disparidades por grupo, no solo accuracy general. La regla del 80% es tu mínimo.
</ConceptCard>

</Section>
