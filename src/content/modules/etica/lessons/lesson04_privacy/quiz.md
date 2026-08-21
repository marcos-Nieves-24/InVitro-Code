# Quiz: Privacidad y protección de datos

## Opción múltiple (5 preguntas)

**Q1.** ¿Qué artículo del GDPR otorga a las personas el derecho a no ser objeto de decisiones basadas únicamente en el procesamiento automatizado?

A. Artículo 5
B. Artículo 17
C. Artículo 22
D. Artículo 32

**Q2.** En privacidad diferencial, un valor de epsilon más pequeño significa:

A. Garantías de privacidad más fuertes (más ruido agregado)
B. Garantías de privacidad más débiles (menos ruido agregado)
C. Mayor precisión de la salida
D. Cómputo más rápido

**Q3.** Un dataset tiene 500 columnas de datos demográficos, de comportamiento y médicos. Se eliminaron nombres y números de seguro social. Esto se describe mejor como:

A. Datos anónimos
B. Datos seudonimizados
C. Datos de-identificados (pero el riesgo de re-identificación puede permanecer)
D. Totalmente protegido bajo el GDPR

**Q4.** Un dataset k-anónimo con k=5 significa:

A. Cada registro es indistinguible de al menos otros 4 registros en los cuasi-identificadores
B. Cada registro aparece exactamente 5 veces en el dataset
C. El dataset contiene solo el 5% de los registros originales
D. Solo se retienen 5 atributos

**Q5.** ¿Cuál de los siguientes NO es un requisito bajo HIPAA para usar información de salud protegida en machine learning?

A. Eliminar los 18 identificadores específicos (método de puerto seguro)
B. Obtener un acuerdo de socio comercial con los proveedores de nube
C. Publicar el modelo entrenado como código abierto
D. Determinación de expertos de que el riesgo de re-identificación es pequeño

## Respuesta corta (2 preguntas)

**Q6.** ¿Qué es un ataque de inferencia de membresía? ¿Cómo ayuda la privacidad diferencial a defenderse de él?

**Q7.** Explica el principio de "minimización de datos". Da un ejemplo de cómo un proyecto de machine learning podría violar este principio y cómo solucionarlo.

## Pregunta de código (1 pregunta)

**Q8.** Escribe una función de Python `differentially_private_histogram(data, bins, epsilon)` que:
- Reciba un array de valores, los bordes de los bins y un presupuesto de privacidad epsilon
- Calcule el histograma verdadero (conteos por bin)
- Agregue ruido de Laplace a cada conteo de bin con sensibilidad = 1 (agregar/eliminar una persona cambia el conteo de un bin en como máximo 1)
- Devuelva los conteos con ruido (recortados para que sean no negativos)

---

## Clave de respuestas

**Q1.** C — Artículo 22: toma de decisiones individual automatizada, incluida la elaboración de perfiles.

**Q2.** A — Epsilon más pequeño = privacidad más fuerte = más ruido = menor precisión.

**Q3.** C — Sin una anonimización adecuada (p. ej., generalizar cuasi-identificadores, aplicar privacidad diferencial), los datos aún pueden ser re-identificables.

**Q4.** A — Cada registro es indistinguible de al menos k-1 otros en los atributos cuasi-identificadores.

**Q5.** C — HIPAA no exige publicar los modelos como código abierto. De hecho, garantizar que la PHI no se filtre en los parámetros del modelo es una preocupación clave.

**Q6.** Un ataque de inferencia de membresía intenta determinar si los datos de un individuo específico se incluyeron en el conjunto de entrenamiento de un modelo. Los atacantes explotan el hecho de que los modelos suelen mostrar mayor confianza en los ejemplos de entrenamiento que en ejemplos no vistos. La privacidad diferencial se defiende de esto acotando la influencia que cualquier registro individual puede tener en la salida del modelo — si el comportamiento del modelo cambia muy poco cuando se agrega o elimina un registro, un atacante no puede inferir la membresía de forma confiable.

**Q7.** La minimización de datos significa recolectar solo los datos necesarios para el propósito declarado. Un proyecto de machine learning podría violar esto recolectando todas las features posibles (p. ej., recolectar datos genéticos cuando solo se necesitan edad e IMC para la tarea de predicción). Para solucionarlo: realiza una evaluación de impacto sobre la privacidad, identifica el conjunto mínimo de features necesario y recolecta solo esas features.

**Q8.** Solución de ejemplo:

```python
def differentially_private_histogram(data, bins, epsilon):
    true_counts, _ = np.histogram(data, bins=bins)
    sensitivity = 1.0
    noise = np.random.laplace(0, sensitivity / epsilon, size=len(true_counts))
    noisy_counts = true_counts + noise
    noisy_counts = np.maximum(noisy_counts, 0)  # Clip to non-negative
    return noisy_counts
```
