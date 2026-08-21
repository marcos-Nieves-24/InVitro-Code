# Quiz: Bucles

## Opción múltiple (5 preguntas)

**Q1:** ¿Qué genera `for i in range(3): print(i)`?
- A) 1 2 3
- B) 0 1 2
- C) 0 1 2 3
- D) 1 2

**Q2:** ¿Qué palabra clave sale de un bucle inmediatamente?
- A) exit
- B) stop
- C) break
- D) return

**Q3:** ¿Qué genera `range(2, 8, 3)`?
- A) 2, 3, 4, 5, 6, 7
- B) 2, 5
- C) 2, 5, 8
- D) 2, 5

**Q4:** ¿Qué pasa cuando la condición de un bucle `while` nunca se vuelve False?
- A) Python detiene el programa
- B) Ocurre un bucle infinito
- C) El bucle se ejecuta una vez
- D) Python falla

**Q5:** ¿Qué función proporciona tanto el índice como el valor durante la iteración?
- A) `index()`
- B) `enumerate()`
- C) `zip()`
- D) `range()`

## Respuesta corta (2 preguntas)

**Q6:** Explica la diferencia entre `break` y `continue`.

**Q7:** ¿Cuál es el propósito de la cláusula `else` en un bucle?

## Pregunta de código

**Q8:** Escribe un bucle for que sume todos los números pares del 1 al 50 e imprima el resultado. Usa `continue` para saltar los números impares.

## Clave de respuestas

**Q1:** B) 0 1 2

**Q2:** C) break

**Q3:** D) 2, 5

**Q4:** B) Ocurre un bucle infinito

**Q5:** B) `enumerate()`

**Q6:** `break` sale inmediatamente de todo el bucle. `continue` saltea el resto de la iteración actual y pasa a la siguiente iteración del bucle.

**Q7:** La cláusula `else` se ejecuta cuando el bucle termina normalmente (es decir, cuando la condición se vuelve False en un while, o cuando la secuencia se agota en un for). NO se ejecuta si el bucle fue terminado por `break`.

**Q8:**
```python
total = 0
for i in range(1, 51):
    if i % 2 != 0:
        continue
    total += i
print(f"Sum of even numbers from 1 to 50: {total}")
```
