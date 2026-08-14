# Assignment: Calculadora científica

## Objetivos

- Implementar correctamente las operaciones aritméticas
- Usar operadores de comparación y lógicos
- Aplicar operadores de asignación
- Manejar correctamente la precedencia de operadores

## Instrucciones

Creá un script de Python `lab_calculator.py` que implemente una calculadora de laboratorio simple:

1. **Cálculo de dilución de soluciones**: Pedí la concentración del stock (M), la concentración deseada (M) y el volumen deseado (mL). Calculá: `volume_stock = (desired_conc * desired_volume) / stock_conc`, y luego volume_water = desired_volume - volume_stock.

2. **Cálculo de pH**: Dada la concentración de iones de hidrógeno [H⁺], calculá pH = -log10([H⁺]). Usá `math.log10` para el logaritmo: `pH = -math.log10(h_concentration)` (import math).

3. **Clasificación**: Según el valor del pH: ácido (< 7), neutro (== 7), base (> 7).

4. **Cálculo estadístico**: Dados 5 números, calculá la media, la varianza y la desviación estándar usando operadores (sin librerías estadísticas).

5. **Verificación de presupuesto**: Dado un costo total y un presupuesto, determiná si la compra está dentro del presupuesto. Aplicá un operador de asignación.

## Entregables

- `lab_calculator.py` con todas las funciones
- Salida documentada que muestre cada cálculo

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Necesita mejorar (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Aritmética | Todos los cálculos correctos | Errores menores | Errores mayores |
| Operadores | Usa todos los tipos de operadores apropiadamente | Usa la mayoría de los tipos | Usa pocos tipos |
| Lógica | Ramificación correcta con operadores lógicos | Mayormente correcta | Errores de lógica |
| Calidad del código | Bien comentado, PEP 8 | Adecuada | Mala |
| Salida | Resultados formateados y claros | Aceptable | Difícil de leer |

## Tiempo estimado

60 minutos
