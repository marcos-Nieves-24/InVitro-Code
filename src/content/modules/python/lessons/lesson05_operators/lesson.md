---
Module: 2
Lesson Number: 5
Lesson Title: Operadores
Estimated Duration: 45 minutos
Prerequisites: L4 — Tipos de Datos
Learning Objectives:
  - Usar operadores aritméticos para cómputos numéricos
  - Usar operadores de comparación para comparar valores
  - Usar operadores lógicos para combinar expresiones booleanas
  - Usar operadores de asignación para actualizar variables
  - Entender la precedencia de operadores
Keywords: aritmética, comparación, lógica, asignación, precedencia de operadores
Difficulty: Beginner
Programming Concepts: Operadores, expresiones, precedencia de operadores
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Operadores

## Motivación

Los operadores son las herramientas que te permiten computar, comparar y combinar valores. Cada programa — desde una calculadora simple hasta un modelo de machine learning — depende de operadores. En biotecnología usás operadores para calcular concentraciones de fármacos, comparar niveles de expresión génica y determinar significancia. En SaaS los usás para calcular ingresos, comparar métricas de engagement de usuarios y evaluar reglas de negocio.

## Panorama General

En la lección anterior aprendiste sobre los tipos de datos que pueden tener los valores. Ahora vas a aprender cómo realizar operaciones sobre esos valores. Los operadores se basan en tu comprensión de los tipos porque diferentes tipos soportan diferentes operadores. Esto te prepara para las próximas lecciones sobre funciones y flujo de control, donde los operadores se usan en condiciones y cómputos.

## Teoría

### Operadores Aritméticos

Los operadores aritméticos realizan operaciones matemáticas sobre tipos numéricos (int, float).

| Operador | Nombre | Ejemplo | Resultado |
|----------|--------|---------|----------|
| `+` | Suma | `5 + 3` | `8` |
| `-` | Resta | `5 - 3` | `2` |
| `*` | Multiplicación | `5 * 3` | `15` |
| `/` | División float | `5 / 3` | `1.666...` |
| `//` | División entera | `5 // 3` | `1` |
| `%` | Módulo (resto) | `5 % 3` | `2` |
| `**` | Exponenciación | `5 ** 3` | `125` |

### Operadores de Comparación

Los operadores de comparación comparan dos valores y devuelven un booleano.

| Operador | Significado | Ejemplo | Resultado |
|----------|------------|---------|----------|
| `==` | Igual a | `5 == 3` | `False` |
| `!=` | Distinto de | `5 != 3` | `True` |
| `<` | Menor que | `5 < 3` | `False` |
| `>` | Mayor que | `5 > 3` | `True` |
| `<=` | Menor o igual | `5 <= 5` | `True` |
| `>=` | Mayor o igual | `5 >= 3` | `True` |

### Operadores Lógicos

Los operadores lógicos combinan expresiones booleanas.

| Operador | Descripción | Ejemplo | Resultado |
|----------|-------------|---------|----------|
| `and` | True si ambos son True | `True and False` | `False` |
| `or` | True si al menos uno es True | `True or False` | `True` |
| `not` | Invierte el booleano | `not True` | `False` |

### Operadores de Asignación

Los operadores de asignación actualizan variables con un cómputo.

| Operador | Ejemplo | Equivalente a |
|----------|---------|---------------|
| `=` | `x = 5` | `x = 5` |
| `+=` | `x += 3` | `x = x + 3` |
| `-=` | `x -= 3` | `x = x - 3` |
| `*=` | `x *= 3` | `x = x * 3` |
| `/=` | `x /= 3` | `x = x / 3` |
| `//=` | `x //= 3` | `x = x // 3` |
| `%=` | `x %= 3` | `x = x % 3` |
| `**=` | `x **= 3` | `x = x ** 3` |

### Precedencia de Operadores

Python sigue la precedencia matemática estándar (PEMDAS):

1. Paréntesis `()`
2. Exponenciación `**`
3. `+`, `-` unarios
4. Multiplicación `*`, División `/`, División entera `//`, Módulo `%`
5. Suma `+`, Resta `-`
6. Comparación `<`, `<=`, `>`, `>=`, `==`, `!=`
7. `not`
8. `and`
9. `or`

## Explicación Visual

```
Precedencia de Operadores (de mayor a menor)

  ()   →   **   →   *,/,//,%   →   +,-   →   ==,!=,<,>   →   not   →   and   →   or

Ejemplo:   5 + 3 * 2 ** 2
           = 5 + 3 * 4       (exponenciación primero)
           = 5 + 12           (multiplicación después)
           = 17               (suma al final)
```

## Implementación en Python

```python
# Operadores aritméticos
a, b = 10, 3
print(f"a = {a}, b = {b}")
print(f"Suma: {a} + {b} = {a + b}")
print(f"Resta: {a} - {b} = {a - b}")
print(f"Multiplicación: {a} * {b} = {a * b}")
print(f"División float: {a} / {b} = {a / b}")
print(f"División entera: {a} // {b} = {a // b}")
print(f"Módulo: {a} % {b} = {a % b}")
print(f"Exponenciación: {a} ** {b} = {a ** b}")
```

```python
# Operadores de comparación
x, y = 5, 8
print(f"{x} == {y}: {x == y}")
print(f"{x} != {y}: {x != y}")
print(f"{x} < {y}: {x < y}")
print(f"{x} > {y}: {x > y}")
print(f"{x} <= {y}: {x <= y}")
print(f"{x} >= {y}: {x >= y}")
```

```python
# Operadores lógicos
has_glucose = True
has_insulin = False

print(has_glucose and has_insulin)  # False
print(has_glucose or has_insulin)   # True
print(not has_glucose)              # False
```

```python
# Operadores de asignación
count = 0
count += 5   # count = 5
count *= 2   # count = 10
count -= 3   # count = 7
count //= 2  # count = 3
print(f"Final count: {count}")
```

## Ejemplo de Biotecnología

**Escenario**: Analizando datos de dosis-respuesta de fármacos.

```python
# Cálculo de dosis-respuesta de fármaco
dose_mg = 50
weight_kg = 70
half_life_hours = 6
time_hours = 24

# Calcular concentración después de n vidas medias
concentration = dose_mg / weight_kg * (0.5) ** (time_hours / half_life_hours)

# Verificar si la concentración está en rango terapéutico
therapeutic_min = 0.1
therapeutic_max = 1.0
in_range = therapeutic_min <= concentration <= therapeutic_max

print(f"Dosis: {dose_mg} mg")
print(f"Peso del paciente: {weight_kg} kg")
print(f"Concentración después de {time_hours}h: {concentration:.3f} mg/kg")
print(f"En rango terapéutico: {in_range}")
```

## Ejemplo SaaS

**Escenario**: Evaluando riesgo de churn de clientes.

```python
# Evaluación de riesgo de churn
days_since_login = 45
support_tickets = 3
subscription_tier = "basic"  # basic, premium, enterprise
monthly_spend = 29.99

# Factores de riesgo de churn
low_engagement = days_since_login > 30
multiple_issues = support_tickets >= 3
is_basic_tier = subscription_tier == "basic"
high_churn_risk = (low_engagement or multiple_issues) and is_basic_tier

print(f"Bajo engagement: {low_engagement}")
print(f"Múltiples problemas: {multiple_issues}")
print(f"Plan basic: {is_basic_tier}")
print(f"Alto riesgo de churn: {high_churn_risk}")
```

## Errores Comunes

1. **Usar `=` en lugar de `==` para comparar**: `if x = 5:` es asignación, no comparación
2. **División entera cuando se necesita float**: `5/2 = 2.5` (Python 3), pero `5//2 = 2`
3. **Encadenar comparaciones incorrectamente**: Python permite `a < b < c`, que es `a < b and b < c`
4. **Confundir precedencia de operadores**: `3 + 4 * 2 = 11`, no `14`
5. **Módulo con números negativos**: `-5 % 3 = 1` (no -2)

## Buenas Prácticas

- Usá paréntesis para hacer explícita la precedencia
- Usá `+=` y operadores similares para código más limpio
- Usá `==` con cuidado para comparar floats; usá `abs(a-b) < epsilon`
- Aprovechá las comparaciones encadenadas de Python: `0 <= x <= 100`
- Usá `not` con moderación — reformulá las condiciones para que sean legibles

## Resumen

- Aritméticos: `+`, `-`, `*`, `/`, `//`, `%`, `**`
- Comparación: `==`, `!=`, `<`, `>`, `<=`, `>=` (devuelven bool)
- Lógicos: `and`, `or`, `not`
- Asignación: `=`, `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=`
- Precedencia: `()` → `**` → `*,/` → `+,-` → comparaciones → `not` → `and` → `or`
- Usá paréntesis para mayor claridad

## Términos Clave

- **Operador**: Símbolo que realiza una operación sobre operandos
- **Operando**: Valor sobre el que actúa un operador
- **Expresión**: Combinación de operadores y operandos que se evalúa a un valor
- **Precedencia**: Reglas que determinan el orden de evaluación
- **Módulo**: Resto después de una división
- **Evaluación de cortocircuito**: `and`/`or` dejan de evaluar cuando el resultado está determinado

## Ejercicios

### Nivel 1: Básico

1. ¿Cuál es el resultado de `15 // 4` y `15 % 4`?
2. ¿Cuál es el valor de `3 + 4 * 2 ** 3`?
3. ¿A qué evalúa `not (True and False)`?

### Nivel 2: Implementación

4. Escribí código que verifique si un número es par (usá `%`) e imprima "par" o "impar".
5. Escribí una calculadora de IMC: peso (kg) / altura² (m). Clasificá como bajo peso (< 18.5), normal (18.5-24.9), sobrepeso (25-29.9), obeso (≥ 30).

### Nivel 3: Pensamiento Crítico

6. ¿Por qué `0.1 + 0.2 == 0.3` devuelve False? ¿Cómo compararías resultados de coma flotante de forma segura?
7. Evaluación de cortocircuito: ¿Qué imprime `False and print("hola")`? ¿Por qué?

## Desafío de Código

Escribí un programa que:
1. Pregunte la cantidad de muestras de ADN, el costo por muestra y el presupuesto disponible
2. Calcule el costo total y si está dentro del presupuesto
3. Aplique un descuento del 15% si la cantidad de muestras > 100
4. Calcule el presupuesto restante después de la compra
5. Use al menos un operador de cada categoría (aritmético, comparación, lógico, asignación)
6. Imprima un resumen formateado de todos los cálculos
