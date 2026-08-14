# Quiz: Tipos de datos

## Opción múltiple (5 preguntas)

**Q1:** ¿Cuál es el tipo de `3.0` en Python?
- A) int
- B) float
- C) str
- D) bool

**Q2:** ¿Qué devuelve `int(7.9)`?
- A) 8
- B) 7
- C) 7.9
- D) Error

**Q3:** ¿Cuál de los siguientes se convierte a False con `bool()`?
- A) 1
- B) "False"
- C) 0
- D) -1

**Q4:** ¿Qué tipo devuelve siempre `input()`?
- A) int
- B) float
- C) str
- D) Depende de lo que escriba el usuario

**Q5:** ¿Qué excepción se lanza cuando intentás `"Hello" + 5`?
- A) ValueError
- B) NameError
- C) TypeError
- D) SyntaxError

## Respuesta corta (2 preguntas)

**Q6:** Explicá la diferencia entre `/` y `//` en Python.

**Q7:** ¿Qué significa inmutable, y cuáles de los tipos primitivos son inmutables?

## Pregunta de código

**Q8:** Escribí código que:
1. Cree un string `"42"`
2. Lo convierta a un entero y luego a un flotante
3. Le sume 10.5 al flotante
4. Convierta el resultado de nuevo a string
5. Imprima el string final

## Clave de respuestas

**Q1:** B) float

**Q2:** B) 7

**Q3:** C) 0

**Q4:** C) str

**Q5:** C) TypeError

**Q6:** `/` realiza división de flotantes y siempre devuelve un flotante (por ejemplo, `5 / 2 = 2.5`). `//` realiza división entera (división de piso) y devuelve el cociente entero (por ejemplo, `5 // 2 = 2`).

**Q7:** Inmutable significa que el valor no puede cambiar después de su creación. Todos los tipos primitivos (int, float, str, bool) son inmutables. Cualquier operación que parezca modificarlos en realidad crea un valor nuevo.

**Q8:**
```python
s = "42"
n = int(s)
f = float(n)
result = f + 10.5
result_str = str(result)
print(result_str)
```
