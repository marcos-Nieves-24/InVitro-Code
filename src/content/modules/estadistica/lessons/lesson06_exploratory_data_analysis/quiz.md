# Quiz: Análisis exploratorio de datos

## Opción múltiple (5 preguntas)

**1. ¿Qué significa MCAR en el análisis de datos faltantes?**

a) Missing Completely At Random
b) Missing Correlated And Random
c) Measured Correctly At Random
d) Mostly Categorical And Rare

**2. ¿Qué método NO se usa típicamente para la detección de valores atípicos?**

a) Método IQR
b) Método del puntaje Z
c) Imputación por la media
d) Isolation Forest

**3. Según la regla del IQR, un punto es un valor atípico si:**

a) Está por debajo del Q1 o por encima del Q3
b) Está por debajo de Q1 - 1.5×IQR o por encima de Q3 + 1.5×IQR
c) Está a más de 2 desviaciones estándar de la media
d) Está por debajo del percentil 10

**4. ¿Cuál es el primer paso en el flujo de trabajo del EDA?**

a) Detección de valores atípicos
b) Vista general de los datos (forma, columnas, tipos)
c) Análisis de correlación
d) Construcción del modelo

**5. ¿Qué tipo de datos faltantes es más problemático?**

a) MCAR
b) MAR
c) MNAR
d) Todos son igualmente problemáticos

## Respuesta corta (2 preguntas)

**6.** Explica la diferencia entre los datos faltantes MAR y MNAR. Da un ejemplo de cada uno en un ensayo clínico.

**7.** ¿Por qué deberías mantener los datos originales intactos durante el EDA y trabajar sobre copias?

## Pregunta de código (1 pregunta)

**8.** Escribe código en Python que cargue el dataset `titanic` de seaborn y:
- Imprima el porcentaje de valores faltantes por columna
- Cree un heatmap de los valores faltantes
- Impute los valores faltantes de `age` con la mediana

---

# Clave de respuestas

1. a) Missing Completely At Random
2. c) Imputación por la media
3. b) Por debajo de Q1 - 1.5×IQR o por encima de Q3 + 1.5×IQR
4. b) Vista general de los datos (forma, columnas, tipos)
5. c) MNAR

6. MAR: los datos faltantes dependen de datos observados (por ejemplo, los pacientes mayores tienen más probabilidades de saltarse un análisis de sangre). MNAR: los datos faltantes dependen de datos no observados (por ejemplo, los pacientes con niveles de dolor muy altos no informan su puntaje de dolor). MNAR es más problemático porque el mecanismo de falta no puede verificarse a partir de los datos observados.

7. El EDA a menudo implica prueba y error. Mantener los datos originales te permite revertir cambios, comparar resultados y garantiza la reproducibilidad. Las decisiones de limpieza de datos deben documentarse y aplicarse de forma sistemática, y no directamente sobre los datos originales.

8. 
```python
import seaborn as sns
import matplotlib.pyplot as plt
titanic = sns.load_dataset('titanic')
print(titanic.isnull().sum() / len(titanic) * 100)
plt.figure(figsize=(8, 4))
sns.heatmap(titanic.isnull(), cbar=False, yticklabels=False)
plt.show()
titanic['age'].fillna(titanic['age'].median(), inplace=True)
```
