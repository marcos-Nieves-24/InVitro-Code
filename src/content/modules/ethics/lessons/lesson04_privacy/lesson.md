---
Module: 5
Lesson Number: 4
Lesson Title: Privacidad y Protección de Datos
Estimated Duration: 60 minutos
Prerequisites: L1 (Introducción a la Ética en IA)
Learning Objectives:
  - Explicar los principios de privacidad de datos en el contexto de ML
  - Describir disposiciones clave del GDPR y HIPAA relevantes para IA
  - Comparar anonimización, seudonimización y privacidad diferencial
  - Implementar un mecanismo simple de privacidad diferencial
  - Evaluar riesgos de privacidad en sistemas de ML (inferencia de pertenencia, inversión de modelos)
Keywords: privacidad, GDPR, HIPAA, privacidad diferencial, anonimización, consentimiento, protección de datos
Difficulty: Intermediate
Programming Concepts: numpy, adición de ruido aleatorio
Mathematical Concepts: Mecanismo de Laplace, parámetro épsilon
Machine Learning Concepts: Datos de entrenamiento, parámetros del modelo
Datasets Used: Sintético
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Privacidad y Protección de Datos

## Objetivos de Aprendizaje

Al finalizar esta lección, los estudiantes podrán:

1. **Explicar** los principios centrales de privacidad de datos aplicados a sistemas de ML
2. **Describir** los requisitos clave del GDPR y HIPAA que afectan el desarrollo de IA
3. **Comparar** anonimización, seudonimización y privacidad diferencial
4. **Implementar** el mecanismo de Laplace para privacidad diferencial
5. **Evaluar** riesgos de privacidad incluyendo inferencia de pertenencia e inversión de modelos

## Motivación

En 2018, un estudio demostró que era posible extraer ejemplos individuales de entrenamiento de un modelo de lenguaje generativo entrenado con datos de texto privados (Carlini et al., 2018). El modelo había sido entrenado con correos electrónicos confidenciales. Al consultar el modelo, los investigadores pudieron reconstruir pasajes textuales exactos de los datos de entrenamiento.

Se suponía que el modelo no debía "recordar" registros individuales. Se suponía que debía aprender patrones generales. Pero las redes neuronales profundas pueden memorizar datos de entrenamiento — incluyendo información personal identificable, historias clínicas y comunicaciones privadas.

Esto no es un riesgo teórico. Los hospitales entrenan modelos de diagnóstico con datos de pacientes. Las empresas SaaS entrenan modelos de recomendación con datos de comportamiento de usuarios. Las instituciones financieras entrenan detección de fraude con historiales de transacciones. En todos los casos, los datos de entrenamiento contienen información sensible que debe protegerse.

La privacidad no se trata solo de mantener los datos seguros durante la recolección. Se trata de garantizar que los modelos de ML entrenados con esos datos no filtren información privada, incluso después del despliegue.

## Panorama General

| Lección Anterior | Lección Actual | Próxima Lección |
|---|---|---|
| L3: Transparencia (explicar modelos) | L4: Privacidad y Protección de Datos (proteger datos) | L5: Impacto Social de la IA (efectos sociales más amplios) |

## Teoría

### Principios de Privacidad de Datos

Los principios centrales de privacidad de datos, según lo reflejado en regulaciones mundiales:

1. **Licitud, equidad y transparencia:** Los datos deben recolectarse y procesarse de manera lícita, equitativa y transparente.
2. **Limitación de la finalidad:** Los datos solo deben recolectarse para fines específicos, explícitos y legítimos.
3. **Minimización de datos:** Solo recolectar los datos necesarios para la finalidad.
4. **Precisión:** Los datos deben ser precisos y mantenerse actualizados.
5. **Limitación del almacenamiento:** Los datos no deben conservarse más tiempo del necesario.
6. **Integridad y confidencialidad:** Los datos deben procesarse de forma segura.
7. **Responsabilidad:** El responsable del tratamiento de datos es responsable del cumplimiento.

Estos principios tienen implicaciones directas para el ML:

- **Limitación de la finalidad:** Un modelo entrenado para fines de diagnóstico no debería reutilizarse para evaluación de riesgos de seguros sin nuevo consentimiento.
- **Minimización de datos:** Recolectar cada característica posible "por si acaso" viola la minimización de datos.
- **Limitación del almacenamiento:** Los datos de entrenamiento deberían eliminarse cuando ya no sean necesarios.

### GDPR (Reglamento General de Protección de Datos)

El GDPR, vigente desde 2018 en la UE, es la regulación de protección de datos más influyente a nivel global. Disposiciones clave para IA:

| Artículo | Requisito | Implicación para ML |
|----------|-----------|---------------------|
| Art. 5 | Licitud, equidad, transparencia | Documentar el procesamiento de datos para ML |
| Art. 6 | Base legal para el procesamiento | Obtener consentimiento o base de interés legítimo |
| Art. 9 | Categorías especiales (salud, raza, etc.) | Prohibido salvo consentimiento explícito o interés público sustancial |
| Art. 15 | Derecho de acceso | Las personas pueden solicitar sus datos |
| Art. 17 | Derecho al olvido | Puede requerir reentrenar el modelo sin los datos de una persona |
| Art. 22 | Decisiones individuales automatizadas | Derecho a no estar sujeto a decisiones totalmente automatizadas con efectos legales |

### HIPAA (Ley de Portabilidad y Responsabilidad de Seguros de Salud)

HIPAA regula la información médica protegida (PHI) en EE.UU. Implicaciones clave para ML:

- **Desidentificación:** La PHI debe desidentificarse antes de su uso en investigación o ML.
- **Método de puerto seguro:** Eliminar 18 identificadores específicos (nombres, SSN, fechas, etc.).
- **Determinación de experto:** Un experto certifica que el riesgo de reidentificación es muy pequeño.
- **Acuerdos de asociados comerciales:** Las plataformas de ML en la nube deben firmar BAAs.

### Anonimización vs. Seudonimización

| Técnica | Definición | Riesgo de Reidentificación |
|---------|------------|---------------------------|
| **Anonimización** | Eliminar irreversiblemente la información identificatoria | Bajo (si se hace correctamente) |
| **Seudonimización** | Reemplazar identificadores con seudónimos | Más alto (puede revertirse con datos adicionales) |
| **Agregación** | Reportar estadísticas grupales en lugar de datos individuales | Bajo (pero puede filtrar información con grupos pequeños) |

**Punto crítico:** La anonimización verdadera es extremadamente difícil con datos de alta dimensionalidad. Un conjunto de datos con 15 atributos demográficos puede identificar de manera única al 99.96% de los residentes de EE.UU. (Sweeney, 2000). Simplemente eliminar nombres y SSNs es insuficiente.

### Privacidad Diferencial

La privacidad diferencial proporciona una garantía matemática de que la salida de un cómputo no revela si los datos de un individuo en particular estaban incluidos en el conjunto de datos.

**Intuición:** Si las predicciones de un modelo cambian muy poco cuando agregamos o eliminamos los datos de una persona, entonces no podemos inferir mucho sobre esa persona a partir del modelo.

**Definición formal:**

Un mecanismo aleatorizado $\mathcal{M}$ satisface $\epsilon$-privacidad diferencial si para cualquier par de conjuntos de datos $D$ y $D'$ que difieren en un registro, y para cualquier conjunto de resultados $S$:

$$P(\mathcal{M}(D) \in S) \leq e^\epsilon \cdot P(\mathcal{M}(D') \in S)$$

donde $\epsilon$ (épsilon) es el presupuesto de privacidad. Un $\epsilon$ más pequeño significa mayor privacidad.

#### El Mecanismo de Laplace

El mecanismo más simple para lograr privacidad diferencial: agregar ruido extraído de una distribución de Laplace a la salida.

$$\mathcal{M}(x) = f(x) + \text{Lap}\left(\frac{\Delta f}{\epsilon}\right)$$

donde $\Delta f$ es la sensibilidad de la función $f$ (el cambio máximo en $f$ cuando se modifica un registro).

#### Presupuesto de Privacidad

- $\epsilon = 0.01$: Privacidad muy fuerte (ruido alto)
- $\epsilon = 1$: Privacidad moderada
- $\epsilon = 10$: Privacidad débil (ruido bajo)
- Múltiples consultas consumen el presupuesto de forma acumulativa

### Ataques de Privacidad a Modelos de ML

| Ataque | Objetivo | Método |
|--------|----------|--------|
| **Inferencia de pertenencia** | Determinar si un registro específico estaba en los datos de entrenamiento | Comparar la confianza del modelo en datos conocidos vs. no vistos |
| **Inversión de modelo** | Reconstruir características de datos de entrenamiento a partir del modelo | Optimizar entrada para maximizar la confianza de clase |
| **Inferencia de atributos** | Inferir atributos sensibles a partir de predicciones del modelo | Usar salidas del modelo para predecir atributos desconocidos |

## Ejemplo Guiado

### Implementar Privacidad Diferencial con el Mecanismo de Laplace

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Real data: ages of 1000 patients
real_ages = np.random.normal(50, 15, 1000)
real_mean = np.mean(real_ages)
print(f"True mean age: {real_mean:.2f}")

# Differential privacy via Laplace mechanism
def laplace_mechanism(true_value, sensitivity, epsilon):
    noise = np.random.laplace(0, sensitivity / epsilon)
    return true_value + noise

epsilon_values = [0.01, 0.1, 1, 10]
for eps in epsilon_values:
    private_mean = laplace_mechanism(real_mean, sensitivity=1, epsilon=eps)
    print(f"epsilon={eps:.2f}: private mean = {private_mean:.2f} (error={abs(private_mean-real_mean):.2f})")
```

## Ejemplo de Biotecnología

### Privacidad en Datos Genómicos

Los datos genómicos son el identificador personal definitivo — no pueden cambiarse, e identifican no solo al individuo sino también a sus familiares. Compartir datos genómicos para investigación en ML requiere una protección de privacidad extrema.

**Privacidad diferencial para GWAS:** Los estudios de asociación del genoma completo (GWAS) pueden filtrar información sobre participantes individuales. Aplicar privacidad diferencial a las estadísticas resumidas (ej., frecuencias alélicas) evita que atacantes determinen si una persona específica estaba en el estudio.

**Desafío:** La privacidad diferencial agrega ruido. Para señales genómicas, el ruido puede oscurecer asociaciones biológicas reales. Los investigadores deben equilibrar cuidadosamente privacidad y utilidad.

## Ejemplo SaaS

### Analítica con Preservación de Privacidad

Una plataforma SaaS de analítica recolecta datos de comportamiento de usuarios para proporcionar información sobre productos. Para proteger la privacidad del usuario manteniendo la utilidad:

1. **Agregación:** Reportar métricas a nivel de cohorte, no individual.
2. **k-anonimato:** Asegurar que cada grupo reportado tenga al menos k usuarios.
3. **Privacidad diferencial:** Agregar ruido calibrado a las métricas del panel.
4. **Retención de datos:** Eliminar automáticamente los eventos sin procesar después de 90 días.

El GDPR exige que los datos de usuarios de la UE se procesen de manera lícita. La plataforma debe proporcionar:
- Aviso de privacidad claro
- Mecanismo de exclusión voluntaria
- Capacidades de exportación y eliminación de datos
- Acuerdo de Procesamiento de Datos (DPA) con los clientes

## Errores Comunes

1. **Anonimizar no es solo eliminar nombres.** Los datos de alta dimensionalidad pueden reidentificarse con información auxiliar.
2. **La privacidad diferencial no es una bala de plata.** No previene todos los ataques de privacidad; acota la fuga de información.
3. **El consentimiento no es un evento único.** El GDPR requiere consentimiento granular y revocable para cada finalidad de procesamiento.
4. **La privacidad no es seguridad.** El cifrado protege los datos durante el transporte/almacenamiento pero no evita que el modelo filtre información.
5. **Ignorar la privacidad durante el despliegue del modelo.** Los riesgos de privacidad existen después del despliegue (ataques de inferencia de pertenencia en APIs).

## Mejores Prácticas

1. **Minimizar la recolección de datos.** Solo recolectar las características que necesitás.
2. **Usar privacidad diferencial** para publicar parámetros de modelos o estadísticas resumidas.
3. **Implementar controles de acceso** y registro de auditoría para los datos de entrenamiento.
4. **Realizar evaluaciones de impacto de privacidad** antes de entrenar modelos con datos sensibles.
5. **Planificar la eliminación de datos.** Si un usuario solicita el borrado, ¿podés reentrenar sin sus datos?

## Resumen

- La privacidad de datos se rige por principios de licitud, minimización y responsabilidad.
- El GDPR proporciona un marco integral con implicaciones específicas para ML.
- HIPAA regula los datos de salud; se requiere desidentificación antes de usar en ML.
- La anonimización es difícil; la privacidad diferencial proporciona garantías formales.
- Los ataques de privacidad (inferencia de pertenencia, inversión de modelo) apuntan a modelos entrenados.
- La privacidad debe considerarse a lo largo de todo el ciclo de vida del ML.

## Términos Clave

| Término | Definición |
|---------|------------|
| GDPR | Reglamento General de Protección de Datos (UE) — ley integral de protección de datos |
| HIPAA | Ley de Portabilidad y Responsabilidad de Seguros de Salud (EE.UU.) — protección de datos de salud |
| Anonimización | Eliminación irreversible de información identificatoria de los datos |
| Seudonimización | Reemplazo de identificadores con seudónimos |
| Privacidad diferencial | Marco matemático que garantiza que las salidas del algoritmo no revelen datos individuales |
| Épsilon (presupuesto de privacidad) | Parámetro que controla la fortaleza de la privacidad diferencial |
| Mecanismo de Laplace | Método para lograr privacidad diferencial agregando ruido Laplace |
| Inferencia de pertenencia | Ataque para determinar si un registro específico estaba en los datos de entrenamiento |
| Inversión de modelo | Ataque para reconstruir datos de entrenamiento a partir de parámetros del modelo |
| k-anonimato | Propiedad por la cual cada registro es indistinguible de al menos k-1 otros |

## Ejercicios

### Nivel 1: Comprensión Básica

1. Enumerá los siete principios de privacidad de datos. ¿Cuáles tres son más relevantes para ML? ¿Por qué?
2. ¿Cuál es la diferencia entre anonimización y seudonimización? Dá un ejemplo de cada una.

### Nivel 2: Implementación

3. Implementá el mecanismo de Laplace para publicar la mediana de un conjunto de datos. Compará el ruido necesario para la mediana vs. la media (la mediana tiene menor sensibilidad).
4. Simulá un ataque de inferencia de pertenencia: entrená dos modelos (uno con y otro sin un registro específico), calculá la confianza del modelo en ese registro y mostrá la diferencia.

### Nivel 3: Pensamiento Crítico

5. Un hospital quiere compartir datos de pacientes para investigación en ML. Eliminan nombres, SSNs y fechas. ¿Es esto suficiente? ¿Qué otros riesgos de reidentificación existen?
6. El "derecho al olvido" (GDPR Art. 17) entra en conflicto con modelos de ML que ya han aprendido de los datos de una persona. ¿Es suficiente eliminar los datos sin procesar? Si no, ¿qué debería pasar con el modelo? Discutí los desafíos prácticos.

## Desafío de Programación

Implementá una función de publicación de media con privacidad diferencial. Escribí un script que:
1. Genere un conjunto de datos sintético de salarios
2. Calcule la media verdadera
3. Aplique el mecanismo de Laplace con epsilon = [0.1, 0.5, 1, 5]
4. Ejecute 1000 pruebas por cada epsilon
5. Grafique la distribución de medias privadas vs. la media verdadera
6. Reporte el error absoluto medio para cada epsilon
7. También grafique la curva de compensación privacidad-utilidad

## Referencias

Dwork, C., & Roth, A. (2014). The algorithmic foundations of differential privacy. *Foundations and Trends in Theoretical Computer Science*, 9(3–4), 211–407. https://doi.org/10.1561/0400000042

European Parliament. (2016). General Data Protection Regulation (Regulation (EU) 2016/679). https://eur-lex.europa.eu/eli/reg/2016/679/oj

Sweeney, L. (2000). Simple demographics often identify people uniquely. *Health (San Francisco)*, 671, 1–34.

O'Neil, C. (2016). *Weapons of math destruction: How big data increases inequality and threatens democracy*. Crown Publishing Group.