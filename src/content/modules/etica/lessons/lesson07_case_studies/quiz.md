# Quiz: Casos de Estudio en Salud y SaaS

## Opción múltiple (5 preguntas)

**P1.** En el estudio sobre algoritmos de atención médica de Obermeyer et al. (2019), ¿cuál fue la causa raíz del sesgo racial?

A. El algoritmo usaba explícitamente la raza como característica
B. El algoritmo usaba los costos de salud como proxy de las necesidades de salud, y los costos son más bajos para pacientes negros debido al acceso desigual a la atención
C. Los datos de entrenamiento incluían muy pocos pacientes negros
D. El algoritmo se entrenó con etiquetas sesgadas proporcionadas por médicos

**P2.** ¿Qué porcentaje del sesgo se eliminó cuando Obermeyer et al. reentrenaron el algoritmo para predecir la cantidad de condiciones crónicas en lugar del costo?

A. 25%
B. 50%
C. 84%
D. 100%

**P3.** Según la Equal Credit Opportunity Act (ECOA), los prestamistas deben:

A. Aprobar a todos los solicitantes independientemente del historial crediticio
B. Proporcionar razones específicas para decisiones crediticias adversas (aviso de acción adversa)
C. Usar solo ingresos y score crediticio en las decisiones de préstamo
D. Lograr paridad demográfica en las tasas de aprobación

**P4.** En el contexto del caso de estudio del algoritmo de atención médica, el "proxy problem" se refiere a:

A. Usar variables ocultas que no pueden medirse directamente
B. Usar una variable (costo) que se correlaciona con el objetivo (necesidad) pero tiene sesgo a nivel de grupo
C. Usar datos de pacientes sin consentimiento
D. Delegar decisiones médicas a un algoritmo

**P5.** ¿Qué métrica de fairness es más directamente relevante para el caso del algoritmo de atención médica (identificación igual de pacientes de alta necesidad entre grupos)?

A. Paridad demográfica
B. Igualdad de oportunidades (TPR igual)
C. Fairness individual
D. Razón de impacto dispar

## Respuesta corta (2 preguntas)

**P6.** Explicá cómo el algoritmo de Obermeyer causó daño a pesar de estar bien intencionado. ¿Qué principio ético (de la Lección 1) se vio violado principalmente?

**P7.** Una empresa SaaS construye un modelo de predicción de churn y planea ofrecer descuentos de retención solo a los clientes predichos como de alto churn. Discutí al menos dos preocupaciones éticas con este enfoque.

## Pregunta de código (1 pregunta)

**P8.** Escribí una función de Python `audit_healthcare_algorithm(y_true, y_pred, protected_attr, group_names=None)` que:
- Reciba etiquetas reales, etiquetas predichas y un atributo protegido
- Devuelva un diccionario con: precisión general, TPR por grupo, FPR por grupo, diferencia de TPR, diferencia de FPR
- Use la confusion_matrix de sklearn

---

## Clave de respuestas

**P1.** B — El algoritmo usaba el costo como proxy de la necesidad. Debido al acceso desigual a la atención, los pacientes negros con las mismas necesidades de salud tenían costos más bajos, por lo que el algoritmo subestimaba sistemáticamente sus necesidades.

**P2.** C — El 84% del sesgo se eliminó usando la cantidad de condiciones crónicas en lugar del costo.

**P3.** B — La ECOA exige que los prestamistas proporcionen razones específicas para las acciones adversas (aviso de acción adversa).

**P4.** B — El proxy problem es usar una variable proxy que se correlaciona con el objetivo pero tiene sesgo a nivel de grupo.

**P5.** B — La igualdad de oportunidades (TPR igual) es la más relevante: el algoritmo debería identificar pacientes de alta necesidad a tasas iguales entre grupos.

**P6.** El algoritmo usaba el costo como proxy de la necesidad de salud. Debido a que los pacientes negros tienen históricamente menor acceso a la atención médica (racismo sistémico, disparidades de seguro), sus costos son más bajos incluso cuando tienen las mismas necesidades de salud. El algoritmo aprendió que costo bajo = sano, lo cual era incorrecto para pacientes negros. Esto violó principalmente el principio de **justicia** — distribuyendo los recursos de atención médica de manera inequitativa — y la **no maleficencia** al causar daño real.

**P7.** (1) Transparencia: los clientes pueden no saber que su comportamiento se está modelando para el targeting de retención. (2) Fairness: los clientes empresariales (altos ingresos, menor riesgo de churn) reciben menos descuentos que las pequeñas empresas (menores ingresos, mayor riesgo de churn), lo que puede verse como un castigo a los clientes más pequeños o como una asignación justa de recursos según la perspectiva. (3) Manipulación: los descuentos personalizados basados en el comportamiento predicho pueden cruzar la línea hacia prácticas manipuladoras. (4) Privacidad: la predicción de churn requiere recolectar datos detallados de uso.

**P8.** Solución de ejemplo:

```python
def audit_healthcare_algorithm(y_true, y_pred, protected_attr, group_names=None):
    from sklearn.metrics import confusion_matrix
    import numpy as np

    groups = np.unique(protected_attr)
    results = {'overall_accuracy': (y_pred == y_true).mean()}

    for g in groups:
        mask = protected_attr == g
        yt = y_true[mask]
        yp = y_pred[mask]
        tn, fp, fn, tp = confusion_matrix(yt, yp).ravel()
        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        name = group_names[g] if group_names else f'group_{g}'
        results[f'TPR_{name}'] = tpr
        results[f'FPR_{name}'] = fpr

    groups_list = np.unique(protected_attr)
    g0_name = group_names[groups_list[0]] if group_names else f'group_{groups_list[0]}'
    g1_name = group_names[groups_list[1]] if group_names else f'group_{groups_list[1]}'
    results['TPR_difference'] = abs(results[f'TPR_{g0_name}'] - results[f'TPR_{g1_name}'])
    results['FPR_difference'] = abs(results[f'FPR_{g0_name}'] - results[f'FPR_{g1_name}'])

    return results
```
