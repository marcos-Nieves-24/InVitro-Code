# Quiz: Operadores

## Opción múltiple (5 preguntas)

**Q1:** ¿Cuál es el resultado de `15 // 4`?
- A) 3.75
- B) 3
- C) 4
- D) 0

**Q2:** ¿Qué devuelve `15 % 4`?
- A) 3
- B) 4
- C) 0
- D) 1

**Q3:** ¿Qué operador verifica si dos valores son iguales?
- A) `=`
- B) `!=`
- C) `==`
- D) `:=`

**Q4:** ¿Cuál es el resultado de `not (True and False)`?
- A) True
- B) False
- C) None
- D) Error

**Q5:** Después de `x = 5; x *= 3`, ¿cuál es el valor de `x`?
- A) 5
- B) 3
- C) 15
- D) 8

## Respuesta corta (2 preguntas)

**Q6:** Explica la diferencia entre `/` y `//` en Python.

**Q7:** ¿Qué es la precedencia de operadores y por qué es importante?

## Pregunta de código

**Q8:** Escribe código que verifique si un número ingresado por el usuario está entre 0 y 100 (inclusive). Usa operadores de comparación y operadores lógicos. Imprime "In range" o "Out of range".

## Clave de respuestas

**Q1:** B) 3

**Q2:** A) 3

**Q3:** C) `==`

**Q4:** A) True

**Q5:** C) 15

**Q6:** `/` es la división de flotantes que siempre devuelve un flotante (por ejemplo, `9/4 = 2.25`). `//` es la división entera (división de piso) que devuelve el cociente entero, descartando el resto (por ejemplo, `9//4 = 2`).

**Q7:** La precedencia de operadores define el orden en el que se evalúan las operaciones en una expresión. Por ejemplo, en `3 + 4 * 2`, la multiplicación tiene mayor precedencia que la suma, así que el resultado es `11`, no `14`. Comprender la precedencia previene errores de cálculo.

**Q8:**
```python
num = float(input("Enter a number: "))
if 0 <= num <= 100:
    print("In range")
else:
    print("Out of range")
```
