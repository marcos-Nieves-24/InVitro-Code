---
Module: 2
Lesson Number: 7
Lesson Title: Bucles
Estimated Duration: 60 minutos
Prerequisites: L6 — Funciones
Learning Objectives:
  - Usar bucles for para iterar sobre secuencias
  - Usar bucles while para iteración condicional
  - Usar range() para generar secuencias numéricas
  - Controlar el flujo de bucles con break y continue
  - Escribir bucles anidados para datos multidimensionales
Keywords: for, while, range, break, continue, bucle anidado, iteración
Difficulty: Beginner
Programming Concepts: Iteración, control de bucles, bucles anidados
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Bucles

## Motivación

Los bucles te permiten repetir operaciones de forma eficiente. En lugar de escribir el mismo código para cada elemento de un dataset, escribís un bucle que procesa todos los elementos automáticamente. En biotecnología, los bucles procesan miles de genes, secuencias de ADN o registros de pacientes. En SaaS, iteran sobre transacciones de usuarios, entradas de logs y cálculos de características. Sin bucles, el análisis de datos a escala sería imposible.

## Panorama General

En la lección anterior aprendiste funciones — bloques de código reutilizables. Los bucles agregan repetición a tu kit de herramientas. Combinados con condicionales (próxima lección), los bucles te permiten construir pipelines complejos de procesamiento de datos. Después de esta lección, vas a entender mejor las listas (Lección 9) porque los bucles son la forma principal de procesar elementos de una lista.

## Teoría

### El Bucle for

El bucle `for` itera sobre una secuencia (string, lista, tupla, etc.):

```python
for variable in sequence:
    pass  # código a repetir
```

### La Función range()

`range()` genera secuencias de números:

```python
range(stop)       # 0, 1, 2, ..., stop-1
range(start, stop)  # start, start+1, ..., stop-1
range(start, stop, step)  # start, start+step, ...
```

### El Bucle while

El bucle `while` se repite mientras una condición sea True:

```python
while condition:
    pass  # código a repetir
```

### Break y Continue

- **break**: Sale del bucle inmediatamente
- **continue**: Salta el resto de la iteración actual, pasa a la siguiente

### Bucles Anidados

Bucles dentro de bucles — se usan para datos multidimensionales:

```python
for i in range(3):
    for j in range(3):
        print(i, j)
```

### La Cláusula else en Bucles

Los bucles de Python pueden tener una cláusula `else` que se ejecuta cuando el bucle termina normalmente (sin `break`):

```python
for x in range(5):
    print(x)
else:
    print("Bucle completado sin break")
```

## Explicación Visual

```
Flujo del Bucle For:
┌─────────┐     ┌──────────────┐     ┌─────────┐
│ Inicio  │ ──→ │ ¿Más items?  │ ──→ │ Ejecutar│
│         │     │ en secuencia │     │ Bloque  │
└─────────┘     └──────┬───────┘     └────┬────┘
                       │ No               │ Sí
                       ↓                  ↓
                    ┌─────────┐          Siguiente
                    │  Fin    │            item
                    └─────────┘

Flujo del Bucle While:
┌─────────┐     ┌──────────┐     ┌─────────┐
│ Inicio  │ ──→ │¿Condición?│ ──→ │ Ejecutar│
│         │     │          │     │ Bloque  │
└─────────┘     └────┬─────┘     └────┬────┘
                     │ False          │ True
                     ↓                ↓
                  ┌─────────┐      Actualizar
                  │  Fin    │    condición
                  └─────────┘
```

## Implementación en Python

```python
# For loop con una lista
genes = ["BRCA1", "TP53", "EGFR", "MYC"]
for gene in genes:
    print(f"Analizando {gene}...")
```

```python
# Ejemplos de range
for i in range(5):
    print(i, end=" ")
# Salida: 0 1 2 3 4

for i in range(2, 8):
    print(i, end=" ")
# Salida: 2 3 4 5 6 7

for i in range(0, 10, 2):
    print(i, end=" ")
# Salida: 0 2 4 6 8
```

```python
# Bucle while
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1
```

```python
# Break y continue
for i in range(10):
    if i == 3:
        continue  # saltear el 3
    if i == 7:
        break     # parar en el 7
    print(i, end=" ")
# Salida: 0 1 2 4 5 6
```

```python
# Bucles anidados — tabla de multiplicar
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} × {j} = {i * j:2d}", end="  ")
    print()
```

## Ejemplo de Biotecnología

**Escenario**: Procesando una lista de secuencias de ADN para encontrar aquellas con alto contenido GC.

```python
sequences = [
    "ATCGATCGATCG",
    "GGGGCCCCCAAAA",
    "ATATATATATAT",
    "CGCGCGCGCGCG",
    "AAAAAATTTTTT"
]

high_gc = []
for seq in sequences:
    gc = (seq.count("G") + seq.count("C")) / len(seq) * 100
    if gc > 50:
        high_gc.append(seq)
        print(f"Alto GC: {seq} ({gc:.1f}%)")

print(f"\nEncontradas {len(high_gc)} secuencias con alto GC")
```

```python
# Usando break para encontrar una secuencia objetivo
target = "CGCGCGCGCGCG"
for i, seq in enumerate(sequences):
    if seq == target:
        print(f"Objetivo {target} encontrado en índice {i}")
        break
else:
    print(f"Objetivo {target} no encontrado")
```

## Ejemplo SaaS

**Escenario**: Procesando datos mensuales de transacciones para análisis de churn.

```python
# Actividad de usuarios simulada mensualmente
monthly_activity = [
    {"month": "Ene", "active_users": 1200, "churned": 45},
    {"month": "Feb", "active_users": 1250, "churned": 38},
    {"month": "Mar", "active_users": 1300, "churned": 52},
    {"month": "Abr", "active_users": 1280, "churned": 41},
    {"month": "May", "active_users": 1350, "churned": 35},
]

total_churned = 0
for month in monthly_activity:
    churn_pct = (month["churned"] / month["active_users"]) * 100
    print(f"{month['month']}: {churn_pct:.1f}% churn")
    total_churned += month["churned"]

print(f"\nTotal churned: {total_churned}")
print(f"Churn mensual promedio: {total_churned / len(monthly_activity):.0f}")
```

## Errores Comunes

1. **Bucles while infinitos**: Olvidarse de actualizar la variable de condición
2. **Modificar una lista mientras se itera**: Puede saltear elementos o causar errores. Iterá sobre una copia
3. **Errores de off-by-one**: `range(n)` da de 0 a n-1, no de 1 a n
4. **Usar `range(len(lista))` en lugar de iterar directamente**: El estilo pitónico prefiere la iteración directa
5. **Olvidar los dos puntos y la indentación**: Sintaxis requerida para los bloques de bucle

## Buenas Prácticas

- Preferí bucles `for` sobre `while` cuando iteres sobre secuencias
- Usá `enumerate()` cuando necesites tanto el índice como el valor
- Usá `zip()` para iterar sobre múltiples secuencias en paralelo
- Mantené los cuerpos de los bucles cortos — extraé lógica compleja a funciones
- Usá nombres de variables de bucle descriptivos (no solo `i`, `j` para casos complejos)

```python
# Patrones pitónicos
for i, gene in enumerate(genes):
    print(f"{i}: {gene}")

for gene, expression in zip(genes, expressions):
    print(f"{gene}: {expression}")
```

## Resumen

- Los bucles `for` iteran sobre secuencias (listas, strings, ranges)
- Los bucles `while` se repiten mientras una condición sea True
- `range(start, stop, step)` genera secuencias numéricas
- `break` sale del bucle; `continue` salta a la siguiente iteración
- Los bucles anidados manejan datos multidimensionales
- Los bucles pueden tener cláusulas `else` que se ejecutan al completarse normalmente

## Términos Clave

- **Iteración**: Una ejecución del cuerpo del bucle
- **Iterable**: Objeto sobre el que se puede iterar (lista, str, range, etc.)
- **Variable de bucle**: Variable que toma cada valor de la secuencia
- **Bucle infinito**: Bucle que nunca termina
- **Bucle anidado**: Bucle dentro de otro bucle
- **enumerate()**: Función incorporada que produce pares (índice, valor)

## Ejercicios

### Nivel 1: Básico

1. ¿Cuál es la salida de `for i in range(3): print(i)`?
2. ¿Cuál es la diferencia entre `break` y `continue`?
3. ¿Qué pasa si la condición en un bucle `while` nunca se vuelve False?

### Nivel 2: Implementación

4. Escribí un bucle for que calcule la suma de los números del 1 al 100.
5. Escribí un bucle while que imprima la secuencia de Fibonacci hasta 100 (cada número es la suma de los dos anteriores: 0, 1, 1, 2, 3, 5, 8...).

### Nivel 3: Pensamiento Crítico

6. Compará los bucles `for` y `while`. ¿Cuándo elegirías uno sobre el otro?
7. ¿Por qué modificar una lista mientras se itera sobre ella es problemático? Mostrá un ejemplo y el enfoque correcto.

## Desafío de Código

Escribí un programa que implemente la **Criba de Eratóstenes** para encontrar todos los números primos hasta un límite `n`:
1. Creá una lista de booleanos de 0 a n, inicialmente todos True
2. Para cada número del 2 a sqrt(n), marcá los múltiplos como False
3. Los índices que quedan True son números primos
4. Usá bucles anidados y `break`/`continue` apropiadamente
5. Imprimí todos los primos encontrados
