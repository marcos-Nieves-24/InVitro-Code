# Quiz: Tuplas

## Opción múltiple (5 preguntas)

**Q1:** ¿Cómo creas una tupla con un solo elemento?
- A) `t = (5)`
- B) `t = (5,)`
- C) `t = tuple(5)`
- D) `t = [5]`

**Q2:** ¿Qué pasa si intentas modificar un elemento de una tupla?
- A) El elemento cambia silenciosamente
- B) Python lanza un TypeError
- C) Se crea una tupla nueva
- D) El programa se bloquea

**Q3:** ¿Cuál es el resultado de `a, b, *rest = (1, 2, 3, 4, 5)`?
- A) a=1, b=2, rest=[3, 4, 5]
- B) a=1, b=2, rest=(3, 4, 5)
- C) a=1, b=2, rest=3
- D) Error

**Q4:** ¿Cuál de los siguientes se puede usar como clave de diccionario?
- A) Lista
- B) Tupla
- C) Ambos
- D) Ninguno

**Q5:** ¿Cuántos métodos tiene una tupla?
- A) 0
- B) 2
- C) 5
- D) 10

## Respuesta corta (2 preguntas)

**Q6:** Explica la diferencia entre una tupla y una lista.

**Q7:** ¿Qué es el desempaquetado de tuplas y por qué es útil?

## Pregunta de código

**Q8:** Escribe una función `swap(a, b)` que devuelva una tupla con los valores intercambiados. Después demuéstrala con `x=5, y=10`.

## Clave de respuestas

**Q1:** B) `t = (5,)`

**Q2:** B) Python lanza un TypeError

**Q3:** A) a=1, b=2, rest=[3, 4, 5]

**Q4:** B) Tupla

**Q5:** B) 2 (count e index)

**Q6:** La diferencia principal es la mutabilidad: las listas se pueden modificar (agregar, eliminar o cambiar elementos), mientras que las tuplas no. Las tuplas además son hashables (pueden ser claves de diccionario), ligeramente más rápidas y usan menos memoria. Las listas tienen muchos más métodos (append, insert, remove, sort, etc.) que las tuplas (solo count e index).

**Q7:** El desempaquetado de tuplas asigna cada elemento de una tupla a una variable separada en una sola línea: `x, y = (3, 4)`. Es útil para extraer limpiamente múltiples valores de retorno de funciones, para intercambiar variables sin una variable temporal y para desestructurar datos estructurados.

**Q8:**
```python
def swap(a, b):
    return b, a

x, y = 5, 10
print(f"Before: x={x}, y={y}")
x, y = swap(x, y)
print(f"After: x={x}, y={y}")
```
