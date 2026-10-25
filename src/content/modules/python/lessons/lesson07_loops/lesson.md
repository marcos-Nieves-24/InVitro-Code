
Module: 2
Lesson Number: 7
Lesson Title: Bucles
Estimated Duration: 60 minutos
Prerequisites: L6   Funciones
Learning Objectives:
  Usar bucles for para iterar sobre secuencias
  Usar bucles while para iteración condicional
  Usar range() para generar secuencias numéricas
  Controlar el flujo de bucles con break y continue
  Escribir bucles anidados para datos multidimensionales
Keywords: for, while, range, break, continue, bucle anidado, iteración
Difficulty: Beginner
Programming Concepts: Iteración, control de bucles, bucles anidados
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md


# Bucles

<Section number={1} title="¿Por qué Bucles?" eyebrow="INICIO">
<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Los bucles te permiten repetir operaciones de forma eficiente.",
    "En lugar de escribir el mismo código para cada elemento de un dataset, escribes un bucle que procesa todos los elementos automáticamente.",
    "En biotecnología, los bucles procesan miles de genes, secuencias de ADN o registros de pacientes.",
    "En SaaS, iteran sobre transacciones de usuarios, entradas de logs y cálculos de características.",
    "Sin bucles, el análisis de datos a escala sería imposible.",
  ]}
/>


<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "En la lección anterior aprendiste funciones   bloques de código reutilizables.",
    "Los bucles agregan repetición a tu kit de herramientas.",
    "Combinados con condicionales (próxima lección), los bucles te permiten construir pipelines complejos de procesamiento de datos.",
    "Después de esta lección, vas a entender mejor las listas (Lección 9) porque los bucles son la forma principal de procesar elementos de una lista.",
  ]}
/>
</RevealSequence>

</Section>

<Section number={2} title="Tipos de Bucles" eyebrow="CONCEPTO">
<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un laboratorio recibe 800 resultados de PCR cada mañana; procesarlos uno por uno en una hoja de cálculo es inviable.",
    "Un bucle `for` recorre toda la lista de muestras y aplica el mismo análisis a cada elemento sin repetir código.",
    "Predice: si recorres `range(2, 8, 2)`, ¿cuáles son los tres valores y por qué el último es 6?",
    "Ojo con el `while` sin actualización de condición: se convierte en un bucle infinito que bloquea el pipeline clínico.",
  ]}
/>

El bucle `for` itera sobre una secuencia (string, lista, tupla, etc.):

```python
for variable in sequence:
    pass  # código a repetir
```


`range()` genera secuencias de números:

```python
range(stop)       # 0, 1, 2, ..., stop 1
range(start, stop)  # start, start+1, ..., stop 1
range(start, stop, step)  # start, start+step, ...
```


El bucle `while` se repite mientras una condición sea True:

```python
while condition:
    pass  # código a repetir
```


- **break**: Sale del bucle inmediatamente
- **continue**: Salta el resto de la iteración actual, pasa a la siguiente


Bucles dentro de bucles   se usan para datos multidimensionales:

```python
for i in range(3):
    for j in range(3):
        print(i, j)
```


Los bucles de Python pueden tener una cláusula `else` que se ejecuta cuando el bucle termina normalmente (sin `break`):

```python
for x in range(5):
    print(x)
else:
    print("Bucle completado sin break")
```
</RevealSequence>

</Section>

<Section number={3} title="Visualización de Bucles" eyebrow="CONCEPTO">
<RevealSequence>

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
</RevealSequence>

</Section>

<Section number={4} title="Implementación en Python" eyebrow="IMPLEMENTACIÓN">
<RevealSequence>

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
# Bucles anidados   tabla de multiplicar
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} × {j} = {i * j:2d}", end="  ")
    print()
```
</RevealSequence>

</Section>

<Section number={5} title="Ejemplo de Biotecnología" eyebrow="APLICACIÓN">
<RevealSequence>

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

<ChoiceQuestion
  question="Tienes una lista de genes y recorres con `for gene in genes: if gene.startswith('BRCA'): process(gene); continue; log_skipped(gene)`. ¿Cuándo se ejecuta `log_skipped`?"
  moduleSlug="python"
  lessonSlug="lesson07_loops"
  blockId="choice python l07 dens 1"
  allowContinueOnIncorrect
  explanation="`continue` salta el resto de la iteración actual, así que `log_skipped` se ejecuta sólo cuando la condición del `if` es falsa."
  options={[
    { id: "a", label: "Sólo cuando el gen NO inicia con `BRCA`.", correct: true, feedback: "¡Correcto! `continue` evita ejecutar `log_skipped` en los BRCA." },
    { id: "b", label: "En cada iteración, sin excepción.", correct: false, feedback: "Si el gene es BRCA, `continue` salta `log_skipped`." },
    { id: "c", label: "Sólo para el primer gen de la lista.", correct: false, feedback: "No hay dependencia de la posición, sino del prefijo." },
    { id: "d", label: "`log_skipped` nunca se ejecuta.", correct: false, feedback: "Sí se ejecuta para los genes que no son BRCA." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={6} title="Ejemplo SaaS" eyebrow="APLICACIÓN">
<RevealSequence>

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
</RevealSequence>

</Section>

<Section number={7} title="Errores y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence>

1. **Bucles while infinitos**: Olvidarse de actualizar la variable de condición
2. **Modificar una lista mientras se itera**: Puede saltear elementos o causar errores. Itera sobre una copia
3. **Errores de off by one**: `range(n)` da de 0 a n 1, no de 1 a n
4. **Usar `range(len(lista))` en lugar de iterar directamente**: El estilo pitónico prefiere la iteración directa
5. **Olvidar los dos puntos y la indentación**: Sintaxis requerida para los bloques de bucle


- Prefiere bucles `for` sobre `while` cuando iteres sobre secuencias
- Usa `enumerate()` cuando necesites tanto el índice como el valor
- Usa `zip()` para iterar sobre múltiples secuencias en paralelo
- Mantén los cuerpos de los bucles cortos   extrae lógica compleja a funciones
- Usa nombres de variables de bucle descriptivos (no solo `i`, `j` para casos complejos)

```python
# Patrones pitónicos
for i, gene in enumerate(genes):
    print(f"{i}: {gene}")

for gene, expression in zip(genes, expressions):
    print(f"{gene}: {expression}")
```
</RevealSequence>

</Section>

<Section number={8} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence>

<ConceptCard variant="key idea">
Los bucles automatizan la repetición: `for` recorre secuencias (`range`, listas, strings) y `while` repite mientras su condición sea True; `break`, `continue` y la cláusula `else` afinan el flujo sin perder legibilidad.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "for", label: "for", detail: "Itera sobre secuencias (listas, strings, ranges)." },
    { id: "while", label: "while", detail: "Se repite mientras una condición sea True." },
    { id: "range", label: "range", detail: "`range(start, stop, step)` genera secuencias numéricas." },
    { id: "break continue", label: "break / continue", detail: "`break` sale del bucle; `continue` salta a la siguiente iteración." },
    { id: "anidados", label: "Bucles anidados", detail: "Manejan datos multidimensionales." },
    { id: "else", label: "Cláusula else", detail: "Se ejecuta si el bucle termina sin `break`." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "iteracion", label: "Iteración", detail: "Una ejecución del cuerpo del bucle." },
    { id: "iterable", label: "Iterable", detail: "Objeto sobre el que se puede iterar (lista, str, range, etc.)." },
    { id: "var bucle", label: "Variable de bucle", detail: "Variable que toma cada valor de la secuencia." },
    { id: "bucle infinito", label: "Bucle infinito", detail: "Bucle que nunca termina." },
    { id: "bucle anidado", label: "Bucle anidado", detail: "Bucle dentro de otro bucle." },
    { id: "enumerate", label: "enumerate()", detail: "Función incorporada que produce pares (índice, valor)." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué imprime este código: for i in range(2, 8, 2): print(i)?"
  moduleSlug="python"
  lessonSlug="lesson07_loops"
  blockId="choice python l07 resumen 1"
  allowContinueOnIncorrect
  explanation="range(2, 8, 2) genera 2, 4, 6 (el límite superior 8 se excluye)."
  options={[
    { id: "a", label: "2, 4, 6", correct: true, feedback: "¡Exacto! start=2, stop=8, step=2; 8 se excluye." },
    { id: "b", label: "2, 4, 6, 8", correct: false, feedback: "El valor final (8) no se incluye: stop es exclusivo." },
    { id: "c", label: "0, 2, 4, 6", correct: false, feedback: "start es 2, no 0." },
    { id: "d", label: "2, 3, 4, 5, 6, 7", correct: false, feedback: "step es 2, no 1." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Bucles dominados! Ya podés recorrer, filtrar y acumular   las condicionales del próximo bloque deciden qué hacer en cada vuelta.
</MascotMessage>

</RevealSequence>
</Section>

<Section number={9} title="Ejercicios y Desafío" eyebrow="EVALUACIÓN">
<RevealSequence>


1. ¿Cuál es la salida de `for i in range(3): print(i)`?
2. ¿Cuál es la diferencia entre `break` y `continue`?
3. ¿Qué pasa si la condición en un bucle `while` nunca se vuelve False?


4. Escribe un bucle for que calcule la suma de los números del 1 al 100.
5. Escribe un bucle while que imprima la secuencia de Fibonacci hasta 100 (cada número es la suma de los dos anteriores: 0, 1, 1, 2, 3, 5, 8...).


6. Compara los bucles `for` y `while`. ¿Cuándo elegirías uno sobre el otro?
7. ¿Por qué modificar una lista mientras se itera sobre ella es problemático? Muestra un ejemplo y el enfoque correcto.


Escribe un programa que implemente la **Criba de Eratóstenes** para encontrar todos los números primos hasta un límite `n`:
1. Crea una lista de booleanos de 0 a n, inicialmente todos True
2. Para cada número del 2 a sqrt(n), marca los múltiplos como False
3. Los índices que quedan True son números primos
4. Usa bucles anidados y `break`/`continue` apropiadamente
5. Imprime todos los primos encontrados
</RevealSequence>

</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

<RevealSequence>

<ChoiceQuestion
  question="¿Qué bucle se usa para iterar sobre una secuencia en Python?"
  moduleSlug="python"
  lessonSlug="lesson07_loops"
  blockId="choice python l07 conceptos 1"
  allowContinueOnIncorrect
  explanation="El for pertenece a iterables; while se basa en una condición."
  options={[
    { id: "a", label: "for", correct: true, feedback: "¡Correcto!" },
    { id: "b", label: "while (siempre)", correct: false, feedback: "while se guía por condición." },
    { id: "c", label: "loop", correct: false, feedback: "No existe como keyword." },
    { id: "d", label: "repeat", correct: false, feedback: "No es keyword estándar." },
  ]}
/>

</RevealSequence>

</Section>
