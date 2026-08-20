# Assignment: Kit de análisis de secuencias

## Objetivos

- Escribir funciones bien estructuradas con docstrings
- Implementar funciones específicas del dominio para biotecnología
- Usar funciones lambda apropiadamente
- Demostrar comprensión del scope

## Instrucciones

Creá un módulo de Python `sequence_tools.py` con las siguientes funciones:

1. `gc_content(sequence)` — devuelve el porcentaje de GC
2. `reverse_complement(sequence)` — devuelve el complemento inverso del ADN
3. `transcribe(sequence)` — transcribe ADN a ARN (T → U)
4. `translate(sequence)` — traduce ADN a proteína (usando una tabla de codones provista). Para simplificar, traducí solo el primer marco de lectura.
5. `has_motif(sequence, motif)` — devuelve True si se encuentra el motivo
6. `filter_by_gc(sequences, min_gc, max_gc)` — usa una lambda para filtrar secuencias por el rango de contenido de GC

Incluí:
- Docstrings para todas las funciones (formato PEP 257)
- Type hints para todas las funciones
- Una demostración en el bloque `if __name__ == "__main__":`

