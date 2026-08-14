# Lab: Fundamentos de probabilidad

## Objetivo

Aplicá el teorema de Bayes y conceptos de probabilidad a problemas del mundo real mediante simulación.

## Duración

60 minutos

## Instrucciones

### Parte 1: Análisis de un test de diagnóstico (20 min)

Una empresa de biotecnología desarrolló un test para un biomarcador.
- Prevalencia: 3%
- Sensibilidad: 92% 
- Especificidad: 88%

1. Calculá P(enfermedad | positivo) usando el teorema de Bayes
2. Simulá 100,000 pacientes para verificar empíricamente
3. Calculá P(sin enfermedad | negativo) — el valor predictivo negativo
4. Graficá la probabilidad posterior como función de la prevalencia

### Parte 2: Filtro de spam (20 min)

Un filtro de spam tiene estas tasas:
- Falso positivo: 1% (marca correos legítimos como spam)
- Falso negativo: 0.5% (no detecta el spam)
- El 60% de todos los correos son spam

1. Si un correo se marca como spam, ¿cuál es la probabilidad de que realmente sea spam?
2. Si un correo pasa el filtro, ¿cuál es la probabilidad de que realmente sea spam?

### Parte 3: Exploración de variables aleatorias (20 min)

1. Definí una variable aleatoria X = suma de dos dados
2. Calculá su PMF teóricamente
3. Simulá 50,000 lanzamientos para verificar
4. Calculá E[X] y Var(X)

## Entregables

- Script de Python con todos los cálculos, las simulaciones y un gráfico
- Interpretaciones escritas para cada parte

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Cálculos de Bayes correctos | 3 |
| Verificación con simulación | 2 |
| Análisis del filtro de spam | 2 |
| Exploración de variables aleatorias | 3 |
Total: 10 puntos
