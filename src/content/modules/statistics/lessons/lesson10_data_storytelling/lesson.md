---
Module: 3
Lesson Number: 10
Lesson Title: Narración de Datos
Estimated Duration: 60 minutos
Prerequisites: Lecciones 1-6
Learning Objectives:
  - Estructurar una historia de datos con arco narrativo
  - Aplicar mejores prácticas de visualización para una comunicación efectiva
  - Diseñar dashboards informativos
  - Comunicar hallazgos estadísticos a audiencias no técnicas
  - Evitar errores comunes de visualización
Keywords: narración de datos, visualización, dashboard, comunicación, narrativa, periodismo de datos
Difficulty: Intermedio
Programming Concepts: matplotlib, plotly, seaborn, dashboards
Mathematical Concepts: Ninguno (orientado a la aplicación)
Machine Learning Concepts: comunicación de resultados, interpretación de modelos
Datasets Used: pingüinos, mpg, sintético
Notebook: 10_data_storytelling.ipynb
Assignment: data_storytelling_assignment.md
Quiz: data_storytelling_quiz.md
---

# Lección 10: Narración de Datos

## Motivación

El mejor análisis del mundo no vale nada si nadie lo entiende. La narración de datos es el arte de comunicar insights basados en datos de forma efectiva. En biotecnología, esto significa convencer a clínicos de adoptar un nuevo test diagnóstico. En SaaS, esto significa persuadir a product managers de priorizar funcionalidades basándose en datos de usuarios. Una historia de datos convincente combina narrativa, visualización y contexto para impulsar la toma de decisiones.

## Panorama General

Esta lección integradora combina todas las lecciones anteriores (estadística descriptiva, distribuciones, EDA, relaciones, PCA, clustering, evaluación de modelos). Aprenderás a comunicar los resultados de cualquier análisis de forma efectiva. Estas habilidades son directamente aplicables al proyecto final y a cualquier carrera en ciencia de datos.

## Teoría

### El Arco de la Historia de Datos

1. **Gancho**: ¿Por qué debería importarle a la audiencia?
2. **Contexto**: ¿Qué datos se recolectaron y cómo?
3. **Conflicto**: ¿Qué problema o pregunta impulsó el análisis?
4. **Análisis**: ¿Qué encontramos? (mostrá el insight clave, no cada detalle)
5. **Resolución**: ¿Qué significa esto? ¿Qué deberíamos hacer?

### Mejores Prácticas de Visualización

**Principios de Tufte**:
- **Proporción tinta-datos**: Maximizar la tinta dedicada a los datos, minimizar la tinta no-data
- **Factor de mentira**: El tamaño del efecto visual debería coincidir con el tamaño del efecto real
- **Chartjunk**: Evitar decoraciones innecesarias (efectos 3D, colores excesivos, cuadrículas pesadas)

**Principios de Cairo**:
- **Veraz**: Representar los datos con precisión sin distorsión
- **Funcional**: Fácil de leer y entender
- **Hermoso**: Estéticamente agradable (pero no a costa de la funcionalidad)
- **Revelador**: Muestra patrones no obvios en los datos crudos
- **Iluminador**: Enseña algo nuevo a la audiencia

### Elegir el Gráfico Correcto

| Objetivo | Tipo de Gráfico |
|---------|-----------------|
| Comparar categorías | Gráfico de barras |
| Mostrar tendencias en el tiempo | Gráfico de líneas |
| Distribución de una variable | Histograma, gráfico de densidad |
| Relación entre dos variables | Gráfico de dispersión |
| Composición de partes | Barras apiladas, gráfico circular (con moderación) |
| Datos geográficos | Mapa |
| Datos jerárquicos | Treemap |

### Mejores Prácticas de Color

- Usá paletas aptas para daltónicos (ej., viridis, colorblind-safe)
- Usá paletas secuenciales para datos ordenados
- Usá paletas divergentes para datos con un punto medio significativo
- Usá paletas cualitativas para datos categóricos (máx. ~8 categorías)
- Nunca uses combinaciones rojo-verde (el tipo de daltonismo más común)

### Diseño de Dashboards

- **Jerarquía**: Información más importante en la parte superior izquierda
- **Consistencia**: Mismo esquema de colores, fuente y diseño en todo el dashboard
- **Interactividad**: Permitir a los usuarios filtrar y explorar (en dashboards web)
- **Contexto**: Incluir benchmarks, objetivos y comparaciones históricas

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

plt.style.use('default')

# Visualización MALA
plt.figure(figsize=(8, 4))
x = np.arange(5)
y = [10, 12, 8, 15, 9]
plt.bar(x, y, color=['red', 'green', 'blue', 'yellow', 'purple'])
plt.title('MALA: Demasiados Colores, Sin Etiquetas, Chartjunk')
plt.show()

# Visualización BUENA
plt.figure(figsize=(8, 4))
bars = plt.bar(['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], y, color='steelblue')
plt.title('Tráfico del Sitio Web por Día')
plt.ylabel('Visitantes (miles)')
for bar, val in zip(bars, y):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
             str(val), ha='center')
plt.tight_layout()
plt.show()

# Visualización con narrativa: masa corporal de pingüinos por especie
penguins = sns.load_dataset('penguins').dropna()

plt.figure(figsize=(10, 6))
species_colors = {'Adelie': '#3498db', 'Chinstrap': '#e74c3c', 'Gentoo': '#2ecc71'}
for species, color in species_colors.items():
    subset = penguins[penguins['species'] == species]
    plt.scatter(subset['flipper_length_mm'], subset['body_mass_g'],
                c=color, label=species, alpha=0.7, s=50)
plt.xlabel('Longitud de la Aleta (mm)')
plt.ylabel('Masa Corporal (g)')
plt.title('Tamaño de Pingüinos: Cómo se Relaciona la Longitud de la Aleta con la Masa Corporal')
plt.legend(title='Especie')
plt.tight_layout()
plt.show()
```

## Ejemplo Guiado

Contar una historia de datos completa: análisis de deserción de clientes.

```python
np.random.seed(42)
n_customers = 500
churn_data = pd.DataFrame({
    'tenure_months': np.random.exponential(12, n_customers),
    'monthly_charges': np.random.uniform(20, 100, n_customers),
    'contract_type': np.random.choice(['Mes a mes', '1 año', '2 años'],
                                      n_customers, p=[0.6, 0.3, 0.1]),
    'churned': np.random.choice([0, 1], n_customers, p=[0.7, 0.3])
})

# 1. Gancho: "El 30% de nuestros clientes se van cada año. Son $2M en ingresos perdidos."
churn_rate = churn_data['churned'].mean()
print(f"TASA DE DESERCIÓN: {churn_rate:.0%}")

# 2. Contexto: Datos de 500 clientes en 12 meses

# 3. Conflicto: ¿Qué factores impulsan la deserción?
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Antigüedad
axes[0].hist(churn_data[churn_data['churned']==0]['tenure_months'],
             bins=20, alpha=0.7, label='Se quedaron', color='steelblue')
axes[0].hist(churn_data[churn_data['churned']==1]['tenure_months'],
             bins=20, alpha=0.7, label='Se fueron', color='coral')
axes[0].set_xlabel('Antigüedad (meses)')
axes[0].set_ylabel('Cantidad')
axes[0].set_title('Deserción por Antigüedad')
axes[0].legend()

# Cargos mensuales
axes[1].boxplot([churn_data[churn_data['churned']==0]['monthly_charges'],
                 churn_data[churn_data['churned']==1]['monthly_charges']],
                labels=['Se quedaron', 'Se fueron'])
axes[1].set_title('Deserción por Cargos Mensuales')

# Tipo de contrato
contract_churn = churn_data.groupby('contract_type')['churned'].mean()
axes[2].bar(contract_churn.index, contract_churn.values, color=['coral', 'steelblue', 'seagreen'])
axes[2].set_title('Tasa de Deserción por Tipo de Contrato')
axes[2].set_ylabel('Tasa de Deserción')

plt.tight_layout()
plt.show()

# 4. Resolución: Hallazgos
print("HALLAZGOS CLAVE:")
print("1. Los clientes que se van tienen menor antigüedad (mediana 6 vs 14 meses)")
print("2. Los cargos mensuales más altos se correlacionan con mayor deserción")
print("3. Los contratos mes a mes tienen 3x más deserción que los contratos de 2 años")
print("\nRECOMENDACIÓN:")
print("Ofrecer contratos anuales con descuento a nuevos clientes después de 3 meses")
```

## Ejemplo de Biotecnología

Comunicar resultados de un ensayo farmacológico a clínicos.

```python
# Datos simulados de ensayo clínico
np.random.seed(42)
n_patients = 200
trial_data = pd.DataFrame({
    'group': ['placebo'] * 100 + ['treatment'] * 100,
    'biomarker_change': np.concatenate([
        np.random.normal(-2, 5, 100),   # placebo
        np.random.normal(8, 5, 100)     # treatment / tratamiento
    ])
})

plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
sns.boxplot(x='group', y='biomarker_change', data=trial_data, palette=['#95a5a6', '#3498db'])
plt.title('Cambio del Biomarcador por Grupo de Tratamiento')
plt.ylabel('Cambio en el Biomarcador (unidades)')

plt.subplot(1, 2, 2)
sns.histplot(data=trial_data, x='biomarker_change', hue='group', kde=True, alpha=0.5)
plt.title('Distribución de los Cambios del Biomarcador')
plt.xlabel('Cambio en el Biomarcador (unidades)')

plt.tight_layout()
plt.show()

# Resumen estadístico para clínicos
placebo_mean = trial_data[trial_data['group']=='placebo']['biomarker_change'].mean()
treat_mean = trial_data[trial_data['group']=='treatment']['biomarker_change'].mean()
effect = treat_mean - placebo_mean

print(f"Grupo placebo: {placebo_mean:.1f} ± {trial_data[trial_data['group']=='placebo']['biomarker_change'].std():.1f}")
print(f"Grupo tratamiento: {treat_mean:.1f} ± {trial_data[trial_data['group']=='treatment']['biomarker_change'].std():.1f}")
print(f"Efecto del tratamiento: {effect:.1f} unidades de mejora")
```

## Ejemplo SaaS

Dashboard ejecutivo para un producto SaaS.

```python
# Datos simulados de dashboard
months = pd.date_range('2024-01-01', periods=12, freq='M')
dashboard_data = pd.DataFrame({
    'month': months,
    'mrr': np.random.normal(50000, 3000, 12).cumsum() + 100000,
    'new_customers': np.random.poisson(50, 12),
    'churn_rate': np.random.beta(2, 20, 12),
    'nps_score': np.random.normal(45, 5, 12)
})

fig, axes = plt.subplots(2, 2, figsize=(14, 8))

# Ingresos Recurrentes Mensuales
axes[0, 0].plot(dashboard_data['month'], dashboard_data['mrr'], 'b-o', linewidth=2)
axes[0, 0].set_title('Ingresos Recurrentes Mensuales (MRR)')
axes[0, 0].set_ylabel('$')

# Nuevos Clientes
axes[0, 1].bar(dashboard_data['month'], dashboard_data['new_customers'], color='steelblue')
axes[0, 1].set_title('Nuevos Clientes')

# Tasa de Deserción
axes[1, 0].plot(dashboard_data['month'], dashboard_data['churn_rate'] * 100, 'r-o', linewidth=2)
axes[1, 0].set_title('Tasa de Deserción (%)')
axes[1, 0].set_ylabel('%')

# Net Promoter Score
axes[1, 1].plot(dashboard_data['month'], dashboard_data['nps_score'], 'g-o', linewidth=2)
axes[1, 1].set_title('Net Promoter Score')
axes[1, 1].set_ylabel('NPS')
axes[1, 1].axhline(0, color='gray', linestyle='--')

plt.tight_layout()
plt.show()
```

## Errores Comunes

1. **Gráficos 3D**: Casi siempre distorsionan la percepción. Evitalos.
2. **Gráficos circulares con demasiadas porciones**: Limitá a 3-5 categorías.
3. **Eje y truncado**: Puede exagerar diferencias; empezá siempre en 0 para gráficos de barras.
4. **Usar el tipo de gráfico incorrecto**: Ej., gráfico de líneas para datos categóricos.
5. **Seleccionar datos a conveniencia**: Presentar solo datos que apoyan tu narrativa.
6. **Ignorar a tu audiencia**: Detalles técnicos para ejecutivos, resúmenes de alto nivel para científicos.

## Mejores Prácticas

- Empezá con la conclusión, luego mostrá evidencia
- Un gráfico = un mensaje
- Etiquetá los ejes claramente; usá unidades
- Usá anotaciones para resaltar hallazgos clave
- Mantené la simplicidad; eliminá todo lo que no agregue valor
- Contá una historia: gancho → contexto → conflicto → análisis → resolución

## Resumen

- Narración de datos = narrativa + visualización + contexto
- Elegí el gráfico correcto para tus datos y mensaje
- Seguí los principios de Tufte: maximizar la proporción tinta-datos
- Usá el color de forma intencional y accesible
- Diseñá dashboards con jerarquía y consistencia
- Conocé a tu audiencia y adaptá tu mensaje

## Términos Clave

| Término | Definición |
|---------|------------|
| Narración de Datos | Comunicar insights a través de narrativa y visualizaciones |
| Proporción Tinta-Datos | Proporción de tinta dedicada a datos vs decoración |
| Chartjunk | Elementos visuales innecesarios que distraen de los datos |
| Factor de Mentira | Relación entre el tamaño del efecto visual y el tamaño del efecto real |
| Dashboard | Pantalla visual de métricas clave de un vistazo |
| NPS | Net Promoter Score — métrica de lealtad del cliente |
| MRR | Ingresos Recurrentes Mensuales |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. ¿Qué es la proporción tinta-datos y por qué es importante?
2. Mencioná tres errores de visualización que pueden engañar a la audiencia.

**Nivel 2: Implementación**

3. Tomá la visualización "mala" de esta lección y mejorala usando mejores prácticas. Explicá tus cambios.
4. Creá un gráfico de dispersión que cuente una historia sobre el dataset de pingüinos. Incluí anotaciones, colores apropiados y un título claro.

**Nivel 3: Pensamiento Crítico**

5. Un científico de datos de una empresa farmacéutica crea una visualización que muestra que los pacientes con el Fármaco A tuvieron un 20% mejores resultados que con el Fármaco B. Cuando examinás los datos crudos, notás que el grupo del Fármaco A era en promedio 10 años más joven. ¿Cómo cambia esto la historia? ¿Cómo debería actualizarse la visualización?
6. Criticá una visualización de datos de un artículo periodístico o científico. ¿Qué funciona bien? ¿Qué se podría mejorar? Enfocate en la proporción tinta-datos, la elección del gráfico, el uso del color y la claridad.

## Desafío de Programación

Escribí un script en Python que:
1. Genere un dataset sintético sobre una startup SaaS ficticia (registros diarios, ingresos, deserción, tickets de soporte en 6 meses)
2. Cree un dashboard con 4 visualizaciones en una cuadrícula de 2×2
3. Incluya: un gráfico de líneas de ingresos en el tiempo, un gráfico de barras de registros por semana, un histograma de tiempos de resolución de tickets de soporte y un gráfico de dispersión de deserción vs uso
4. Use una paleta de colores consistente y etiquetas claras
5. Agregue un título y texto de resumen que cuente la historia: "Nuestra startup creció los ingresos un 150% en 6 meses, pero los tickets de soporte están aumentando rápidamente"
