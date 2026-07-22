---
Module: 2
Lesson Number: 8
Lesson Title: Condicionales
Estimated Duration: 45 minutos
Prerequisites: L6 — Funciones
Learning Objectives:
  - Escribir sentencias condicionales if/elif/else
  - Evaluar expresiones booleanas con operadores de comparación y lógicos
  - Usar valores truthy y falsy en condiciones
  - Escribir sentencias condicionales anidadas
  - Usar expresiones condicionales (operador ternario)
Keywords: if, elif, else, booleano, truthy, falsy, condicional, ternario
Difficulty: Beginner
Programming Concepts: Flujo de control, lógica booleana, expresiones condicionales
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Condicionales

## Motivación

Los condicionales permiten que los programas tomen decisiones. Sin ellos, el código se ejecutaría de la misma manera siempre. Con condicionales, tu programa puede reaccionar de forma diferente según los valores de los datos, la entrada del usuario o los resultados calculados. En biotecnología, los condicionales determinan diagnósticos basados en resultados de laboratorio, clasifican mutaciones genéticas y disparan alertas por valores anormales. En SaaS, controlan niveles de acceso, calculan descuentos y segmentan clientes.

## Panorama General

En la lección anterior aprendiste bucles (repetición). Ahora aprendés condicionales (toma de decisiones). Estas dos estructuras de control — bucles y condicionales — forman la columna vertebral de todos los programas no triviales. Junto con funciones y operadores, ahora tenés todo lo necesario para escribir lógica de procesamiento de datos sofisticada.

## Teoría

### La Sentencia if

El condicional más simple ejecuta código solo cuando una condición es True:

```python
if condition:
    pass  # código a ejecutar si la condición es True
```

### if/else

```python
if condition:
    pass  # código si True
else:
    pass  # código si False
```

### if/elif/else

Encadená múltiples condiciones:

```python
if condition1:
    pass  # condition1 es True
elif condition2:
    pass  # condition1 es False, condition2 es True
elif condition3:
    pass  # condition1 y condition2 son False, condition3 es True
else:
    pass  # todas las condiciones son False
```

### Truthy y Falsy

En Python, los valores pueden ser "truthy" o "falsy" cuando se usan en una condición:

**Valores falsy** (evalúan a False):
- `None`
- `False`
- `0`, `0.0`, `0j`
- Secuencias vacías: `""`, `[]`, `()`, `{}`, `set()`
- Objetos personalizados que devuelven `False` de `__bool__`

**Todo lo demás es truthy.**

### Condicionales Anidados

Condicionales dentro de condicionales:

```python
if condition1:
    if condition2:
        pass  # ambas True
    else:
        pass  # condition1 True, condition2 False
else:
    pass  # condition1 False
```

### Ternario (Expresión Condicional)

Condicional en una línea:

```python
value = true_value if condition else false_value
```

### Sentencia Match (Python 3.10+)

Pattern matching estructural (similar a switch/case):

```python
match value:
    case 1:
        pass  # manejar caso 1
    case 2:
        pass  # manejar caso 2
    case _:
        pass  # caso por defecto
```

## Explicación Visual

```
Flujo if/elif/else:

         ┌───────────┐
         │ Inicio    │
         └─────┬─────┘
               │
         ┌─────▼──────┐  True  ┌──────────────────┐
         │ condition1 ├───────→│ bloque código 1  │
         └─────┬──────┘       └────────┬─────────┘
               │ False                 │
         ┌─────▼──────┐  True  ┌──────────────────┐
         │ condition2 ├───────→│ bloque código 2  │
         └─────┬──────┘       └────────┬─────────┘
               │ False                 │
         ┌─────▼──────┐               │
         │ else       │               │
         │ (default)  │               │
         └─────┬──────┘               │
               │                      │
               └──────┬───────────────┘
                      │
                ┌─────▼─────┐
                │   Fin     │
                └───────────┘
```

## Implementación en Python

```python
# if básico
temperature = 38.5
if temperature > 37.5:
    print("El paciente tiene fiebre")

# if/else
if temperature > 37.5:
    print("Tiene fiebre")
else:
    print("Temperatura normal")
```

```python
# if/elif/else
bmi = 26.3
if bmi < 18.5:
    category = "Bajo peso"
elif bmi < 25:
    category = "Normal"
elif bmi < 30:
    category = "Sobrepeso"
else:
    category = "Obeso"
print(f"IMC: {bmi:.1f} - {category}")
```

```python
# Truthy/falsy
name = ""
if name:
    print(f"Hola, {name}")
else:
    print("El nombre está vacío")

# Verificación de None
result = None
if result is None:
    print("No hay resultado disponible")
```

```python
# Ternario (expresión condicional)
age = 20
status = "Adulto" if age >= 18 else "Menor"
print(status)
```

```python
# Sentencia match (Python 3.10+)
def describe_mutation(mutation_type):
    match mutation_type:
        case "missense":
            return "Cambio de un solo aminoácido"
        case "nonsense":
            return "Codón de parada prematuro"
        case "frameshift":
            return "Corrimiento del marco de lectura"
        case "silent":
            return "Sin cambio de aminoácido"
        case _:
            return "Tipo de mutación desconocido"

print(describe_mutation("missense"))
```

## Ejemplo de Biotecnología

**Escenario**: Sistema de apoyo a decisiones clínicas para diagnóstico de pacientes.

```python
def assess_patient(systolic_bp, diastolic_bp, heart_rate, glucose):
    """
    Assess patient status based on vital signs.
    
    Returns a tuple of (status, recommendations).
    """
    # Clasificación de presión arterial
    if systolic_bp < 120 and diastolic_bp < 80:
        bp_status = "Normal"
    elif systolic_bp < 130 and diastolic_bp < 80:
        bp_status = "Elevada"
    elif systolic_bp < 140 or diastolic_bp < 90:
        bp_status = "Hipertensión Estadio 1"
    else:
        bp_status = "Hipertensión Estadio 2"
    
    # Evaluación de frecuencia cardíaca
    if heart_rate < 60:
        hr_status = "Bradicardia"
    elif heart_rate <= 100:
        hr_status = "Normal"
    else:
        hr_status = "Taquicardia"
    
    # Evaluación de glucosa
    if glucose < 70:
        glucose_status = "Hipoglucemia"
    elif glucose <= 126:
        glucose_status = "Normal"
    else:
        glucose_status = "Hiperglucemia"
    
    # Alerta general
    is_emergency = (
        bp_status == "Hipertensión Estadio 2"
        or hr_status in ("Bradicardia", "Taquicardia")
        or glucose_status in ("Hipoglucemia", "Hiperglucemia")
    )
    
    return bp_status, hr_status, glucose_status, is_emergency

# Prueba
result = assess_patient(145, 95, 110, 140)
bp, hr, glu, emergency = result
print(f"PA: {bp}")
print(f"FC: {hr}")
print(f"Glucosa: {glu}")
print(f"Emergencia: {emergency}")
```

## Ejemplo SaaS

**Escenario**: Asignación de nivel de cliente y cálculo de descuento.

```python
def calculate_discount(customer_tier, annual_spend, years_active):
    """
    Calculate discount percentage based on customer profile.
    """
    # Determinar descuento según el nivel
    if customer_tier == "enterprise":
        base_discount = 0.20
    elif customer_tier == "professional":
        base_discount = 0.10
    elif customer_tier == "starter":
        base_discount = 0.05
    else:
        base_discount = 0.00
    
    # Bono por lealtad
    if years_active >= 3:
        loyalty_bonus = 0.05
    elif years_active >= 1:
        loyalty_bonus = 0.02
    else:
        loyalty_bonus = 0.00
    
    # Bono por volumen
    if annual_spend > 50000:
        volume_bonus = 0.10
    elif annual_spend > 10000:
        volume_bonus = 0.05
    else:
        volume_bonus = 0.00
    
    total_discount = min(base_discount + loyalty_bonus + volume_bonus, 0.30)
    return total_discount

# Uso
discount = calculate_discount("professional", 25000, 4)
print(f"Descuento: {discount:.0%}")
```

## Errores Comunes

1. **Usar `=` en lugar de `==`**: `if x = 5:` asigna 5 a x y siempre es True
2. **Olvidar los dos puntos**: `if x > 5` sin `:` lanza SyntaxError
3. **Errores de indentación**: Indentación inconsistente rompe los condicionales
4. **Comparar None con `==`**: Usá `is None` en lugar de `== None`
5. **Verificar booleanos con `== True`**: Es redundante — usá `if condition:`
6. **Anidamiento profundo**: Más de 3 niveles de anidamiento sugiere refactorización

## Buenas Prácticas

- Usá `elif` en lugar de `if` anidados para condiciones mutuamente excluyentes
- Mantené las condiciones simples — extraé lógica compleja a variables booleanas
- Usá verificaciones truthy/falsy de forma natural: `if items:` en lugar de `if len(items) > 0:`
- Evitá anidamiento profundo (máx. 3 niveles)
- Usá cláusulas de guarda (returns tempranos) para reducir el anidamiento
- Usá `in` para comparaciones múltiples: `if x in (1, 2, 3):`

## Resumen

- `if` ejecuta código cuando una condición es True
- `elif` verifica condiciones adicionales
- `else` maneja el caso por defecto
- Los valores son truthy (True) o falsy (False, None, 0, secuencias vacías)
- Ternario: `x if condition else y`
- Sentencia match (3.10+) para pattern matching
- Evitá anidamiento profundo; usá cláusulas de guarda

## Términos Clave

- **Condicional**: Sentencia que ejecuta código basada en una condición
- **Expresión booleana**: Expresión que evalúa a True o False
- **Truthy**: Valor que evalúa a True en un contexto booleano
- **Falsy**: Valor que evalúa a False en un contexto booleano
- **Operador ternario**: Expresión condicional para if/else en línea
- **Cláusula de guarda**: Return temprano para evitar anidamiento
- **Sentencia match**: Pattern matching estructural de Python 3.10+

## Ejercicios

### Nivel 1: Básico

1. ¿Cuál es la salida de `if 0: print("sí") else: print("no")`?
2. ¿Cuál es la diferencia entre `=` y `==`?
3. ¿Qué valores se consideran falsy en Python?

### Nivel 2: Implementación

4. Escribí una función que reciba una temperatura en Celsius y devuelva "Frío" (< 15), "Templado" (15-25), "Calor" (> 25).
5. Escribí una función que reciba un año y devuelva si es bisiesto (divisible por 400, o divisible por 4 pero no por 100).

### Nivel 3: Pensamiento Crítico

6. ¿Por qué `if x == True:` se considera mal estilo? ¿Cuál es la alternativa pitónica?
7. Compará y contrastá las cadenas if/elif/else con las sentencias match. ¿Cuándo usarías cada una?

## Desafío de Código

Escribí un sistema de **puntaje crediticio** que:
1. Reciba ingresos, antigüedad crediticia (años), deuda pendiente y cantidad de pagos atrasados
2. Calcule un puntaje crediticio (0-100) usando una fórmula ponderada
3. Asigne una calificación: Excelente (≥ 80), Buena (60-79), Regular (40-59), Mala (< 40)
4. Aplique modificadores: si deuda > ingresos → -20 puntos; si pagos atrasados > 3 → -15 puntos; si antigüedad crediticia > 10 años → +10 puntos
5. Use `match` para la asignación de calificación
6. Imprima el puntaje final, la calificación y el estado de aprobación (Excelente/Buena → Aprobado, sino → Revisión Requerida)
