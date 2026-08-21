# Quiz: Bias y equidad

## Opción múltiple (5 preguntas)

**Q1.** ¿Qué tipo de bias surge cuando los datos de entrenamiento no representan con precisión la población a la que se aplicará el modelo?

A. Bias algorítmico
B. Bias social
C. Bias de datos
D. Sesgo de confirmación

**Q2.** Un modelo predice el pago de préstamos. La tasa de aprobación es 60% para el Grupo A y 40% para el Grupo B. ¿Qué definición de equidad se viola?

A. Igualdad de oportunidades
B. Paridad demográfica
C. Probabilidades igualadas
D. Equidad individual

**Q3.** El "teorema de imposibilidad" en la equidad algorítmica establece que:

A. Los sistemas de IA equitativos son matemáticamente imposibles
B. Múltiples definiciones de equidad no pueden satisfacerse simultáneamente a menos que las tasas base sean iguales o el clasificador sea perfecto
C. El bias nunca puede eliminarse por completo de ningún modelo de machine learning
D. Las métricas de equidad no están bien definidas matemáticamente

**Q4.** En el caso de reincidencia de COMPAS, ProPublica encontró que:

A. El algoritmo estaba perfectamente calibrado entre grupos raciales
B. Los acusados negros tenían tasas de falsos positivos más altas que los acusados blancos
C. El algoritmo fue declarado inconstitucional por la Corte Suprema
D. El algoritmo era más preciso que los jueces humanos para todos los grupos

**Q5.** "Equidad mediante ignorancia" (fairness through unawareness) se refiere a:

A. Eliminar los atributos protegidos del modelo
B. No decirles a los usuarios cómo funciona el modelo
C. Usar aprendizaje no supervisado para evitar el bias
D. Seleccionar features a ciegas sin conocimiento del dominio

## Respuesta corta (2 preguntas)

**Q6.** Explica cómo una feature como "código postal" puede actuar como proxy de la raza incluso cuando la raza se elimina del modelo. ¿Qué implica esto sobre la "equidad mediante ignorancia"?

**Q7.** ¿Qué es la interseccionalidad en el contexto del bias algorítmico? Proporciona un ejemplo donde el bias podría no ser visible al analizar grupos según un solo atributo.

## Pregunta de código (1 pregunta)

**Q8.** Escribe una función de Python `compute_equalized_odds(y_true, y_pred, protected_attr)` que:
- Reciba tres arrays: etiquetas reales, etiquetas predichas y un atributo protegido binario
- Devuelva un diccionario con la tasa de verdaderos positivos (TPR) y la tasa de falsos positivos (FPR) para cada grupo
- También devuelva la diferencia absoluta en TPR y FPR entre los dos grupos

Puedes usar `sklearn.metrics.confusion_matrix`.

---

## Clave de respuestas

**Q1.** C — Bias de datos (también llamado bias de representación o de muestra).

**Q2.** B — La paridad demográfica exige tasas iguales de predicciones positivas entre grupos. La tasa de aprobación difiere entre grupos.

**Q3.** B — Múltiples definiciones de equidad (p. ej., paridad demográfica y probabilidades igualadas) no pueden satisfacerse simultáneamente a menos que las tasas base sean iguales o el clasificador sea perfecto.

**Q4.** B — Los acusados negros tenían tasas de falsos positivos más altas (marcados como alto riesgo pero no reincidieron) en comparación con los acusados blancos.

**Q5.** A — Eliminar los atributos protegidos del modelo, bajo el (incorrecto) supuesto de que esto elimina el bias.

**Q6.** El código postal se correlaciona fuertemente con la raza debido a la discriminación histórica en la vivienda y la segregación (redlining). Cuando se elimina la raza, un modelo aún puede discriminar usando el código postal como proxy. Esto significa que la equidad mediante ignorancia es insuficiente — los modelos deben probarse para detectar impacto dispar incluso cuando los atributos protegidos se excluyen.

**Q7.** La interseccionalidad reconoce que las personas tienen múltiples identidades (raza, género, clase, etc.) y que el bias en la intersección puede diferir del bias a lo largo de cualquier dimensión individual. Por ejemplo, un sistema de reconocimiento facial podría tener tasas de error similares para hombres negros y mujeres blancas en general, pero tasas de error mucho más altas para mujeres negras específicamente. Analizar solo la raza o solo el género perdería esta disparidad compuesta.

**Q8.** Solución de ejemplo:

```python
def compute_equalized_odds(y_true, y_pred, protected_attr):
    results = {}
    groups = np.unique(protected_attr)
    for g in groups:
        mask = protected_attr == g
        yt = y_true[mask]
        yp = y_pred[mask]
        tn, fp, fn, tp = confusion_matrix(yt, yp).ravel()
        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        results[f'group_{g}'] = {'TPR': tpr, 'FPR': fpr}
    tpr_diff = abs(results['group_0']['TPR'] - results['group_1']['TPR'])
    fpr_diff = abs(results['group_0']['FPR'] - results['group_1']['FPR'])
    results['TPR_difference'] = tpr_diff
    results['FPR_difference'] = fpr_diff
    return results
```
