# Quiz: Condicionales

## Opción múltiple (5 preguntas)

**Q1:** ¿Cuál es la salida de `if 0: print("yes") else: print("no")`?
- A) yes
- B) no
- C) Error
- D) Nothing

**Q2:** ¿Cuál de los siguientes valores es truthy?
- A) 0
- B) ""
- C) []
- D) "False"

**Q3:** ¿Qué hace `x = "Adult" if age >= 18 else "Minor"`?
- A) Asigna "Adult" si age ≥ 18, si no "Minor"
- B) Verifica si "Adult" es igual a age
- C) Produce un error de sintaxis
- D) Se asignan tanto A como B

**Q4:** ¿Cuál es la forma correcta de verificar si x es None?
- A) `if x == None`
- B) `if x is None`
- C) `if x = None`
- D) `if equals(x, None)`

**Q5:** ¿Qué palabra clave se usa para agregar una condición adicional después de `if`?
- A) `else if`
- B) `elif`
- C) `elseif`
- D) `elsif`

## Respuesta corta (2 preguntas)

**Q6:** Explicá la diferencia entre valores truthy y falsy en Python.

**Q7:** ¿Qué es una expresión condicional ternaria y cuándo la usarías?

## Pregunta de código

**Q8:** Escribí una función `grade_score(score)` que devuelva "Pass" si score ≥ 60 y "Fail" en caso contrario. Después reescribila como una lambda.

## Clave de respuestas

**Q1:** B) no

**Q2:** D) "False"

**Q3:** A) Asigna "Adult" si age ≥ 18, si no "Minor"

**Q4:** B) `if x is None`

**Q5:** B) `elif`

**Q6:** Los valores truthy se evalúan como True en un contexto booleano (por ejemplo, strings no vacíos, números distintos de cero, contenedores no vacíos). Los valores falsy se evalúan como False (por ejemplo, 0, "", [], None, False). Esto permite condiciones concisas como `if name:` en lugar de `if name != "":`.

**Q7:** Una expresión condicional ternaria es un if/else de una sola línea: `value_if_true if condition else value_if_false`. Usala para condiciones simples de una sola expresión donde mejore la legibilidad frente a un bloque if/else completo.

**Q8:**
```python
def grade_score(score):
    return "Pass" if score >= 60 else "Fail"

grade_lambda = lambda score: "Pass" if score >= 60 else "Fail"

print(grade_score(75))  # Pass
print(grade_lambda(45))  # Fail
```
