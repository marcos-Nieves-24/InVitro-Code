# Quiz: Fundamentos de probabilidad

## Opción múltiple (5 preguntas)

**1. ¿Cuál de los axiomas de Kolmogorov establece que la probabilidad de todo el espacio muestral es 1?**

a) No negatividad
b) Normalización
c) Aditividad
d) Complementariedad

**2. P(A|B) = P(A∩B) / P(B) es la fórmula de:**

a) Teorema de Bayes
b) Probabilidad condicional
c) Ley de probabilidad total
d) Probabilidad conjunta

**3. El teorema de Bayes nos permite:**

a) Calcular la probabilidad de A sin ningún dato
b) Actualizar las creencias sobre A después de observar la evidencia B
c) Demostrar que A causa B
d) Calcular la varianza de una variable aleatoria

**4. El valor esperado de una variable aleatoria es:**

a) El valor más probable
b) El valor promedio a largo plazo
c) Siempre igual a la mediana
d) La raíz cuadrada de la varianza

**5. Si los eventos A y B son mutuamente excluyentes:**

a) P(A∩B) = P(A) × P(B)
b) P(A∪B) = P(A) + P(B)
c) P(A|B) = P(A)
d) P(A) + P(B) = 1

## Respuesta corta (2 preguntas)

**6.** Un test para una enfermedad rara (prevalencia 0.1%) tiene 99% de sensibilidad y 95% de especificidad. Si un paciente da positivo, ¿cuál es la probabilidad de que realmente tenga la enfermedad? Muestra el cálculo.

**7.** Explica la "falacia de la tasa base" y da un ejemplo de biotecnología.

## Pregunta de código (1 pregunta)

**8.** Escribe código en Python usando numpy para simular 50,000 pacientes donde:
- La prevalencia de la enfermedad es del 2%
- La sensibilidad del test es del 90%
- La especificidad del test es del 85%

Calcula la probabilidad empírica de que un paciente tenga la enfermedad dado un test positivo.

---

# Clave de respuestas

1. b) Normalización
2. b) Probabilidad condicional
3. b) Actualizar las creencias sobre A después de observar la evidencia B
4. b) El valor promedio a largo plazo
5. b) P(A∪B) = P(A) + P(B)

6. P(enfermedad|positivo) = (0.99 × 0.001) / (0.99 × 0.001 + 0.05 × 0.999) = 0.00099 / 0.05094 = 0.0194 (1.94%)

7. La falacia de la tasa base ocurre cuando la gente ignora la tasa base (prevalencia) y sobreestima la probabilidad de un evento raro después de una evidencia positiva. En biotecnología: si una enfermedad afecta a 1 de cada 10,000 personas y un test tiene 99% de precisión, muchos médicos creen erróneamente que un test positivo significa 99% de probabilidad de enfermedad, cuando en realidad es mucho menor.

8. 
```python
import numpy as np
n = 50000
has_dis = np.random.random(n) < 0.02
pos_test = np.where(has_dis, np.random.random(n) < 0.90, np.random.random(n) < 0.15)
p = has_dis[pos_test].mean()
print(f"P(disease|positive) = {p:.4f}")
```
