# Assignment: Calculadora científica

## Objetivos

- Implementar correctamente las operaciones aritméticas
- Usar operadores de comparación y lógicos
- Aplicar operadores de asignación
- Manejar correctamente la precedencia de operadores

## Instrucciones

Crea un script de Python `lab_calculator.py` que implemente una calculadora de laboratorio simple:

1. **Cálculo de dilución de soluciones**: Pide la concentración del stock (M), la concentración deseada (M) y el volumen deseado (mL). Calcula: `volume_stock = (desired_conc * desired_volume) / stock_conc`, y luego volume_water = desired_volume - volume_stock.

2. **Cálculo de pH**: Dada la concentración de iones de hidrógeno [H⁺], calcula pH = -log10([H⁺]). Usa `math.log10` para el logaritmo: `pH = -math.log10(h_concentration)` (import math).

3. **Clasificación**: Según el valor del pH: ácido (< 7), neutro (== 7), base (> 7).

4. **Cálculo estadístico**: Dados 5 números, calcula la media, la varianza y la desviación estándar usando operadores (sin librerías estadísticas).

5. **Verificación de presupuesto**: Dado un costo total y un presupuesto, determina si la compra está dentro del presupuesto. Aplica un operador de asignación.

