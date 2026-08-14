# Quiz: Interpretación de modelos

## Opción múltiple (5 preguntas)

**Q1.** La importancia por permutación mide:

a) Con qué frecuencia aparece una feature en el modelo
b) La caída en el rendimiento del modelo cuando los valores de una feature se mezclan aleatoriamente
c) La correlación entre una feature y el target
d) El costo computacional de usar una feature

<details><summary>Respuesta</summary>b) La caída en el rendimiento del modelo cuando los valores de una feature se mezclan aleatoriamente. Una caída grande = feature importante.</details>

**Q2.** Un gráfico de dependencia parcial muestra:

a) La distribución de una feature
b) La predicción promedio del modelo en función de una feature, promediando las demás
c) La correlación entre dos features
d) El tiempo de entrenamiento vs. la cantidad de features

<details><summary>Respuesta</summary>b) La predicción promedio del modelo en función de una feature, manteniendo las demás constantes mediante promediado</details>

**Q3.** ¿Cuál de las siguientes es un método de interpretabilidad LOCAL?

a) Importancia por permutación
b) Gráfico de dependencia parcial
c) Valores SHAP
d) Importancia de características basada en impureza

<details><summary>Respuesta</summary>c) Los valores SHAP brindan explicaciones para predicciones individuales (local), mientras que los otros son métodos globales</details>

**Q4.** La importancia de características basada en impureza puede ser engañosa porque:

a) Es demasiado lenta de calcular
b) Favorece a las features de alta cardinalidad (features con muchos valores únicos)
c) Solo funciona para modelos lineales
d) Siempre da los mismos resultados que la importancia por permutación

<details><summary>Respuesta</summary>b) Favorece a las features de alta cardinalidad porque esas features generan más splits y acumulan más reducción de impureza</details>

**Q5.** Dos features están altamente correlacionadas (r = 0.95). ¿Cómo afecta esto a la importancia por permutación?

a) Ambas features mostrarán una importancia alta
b) Ambas features pueden mostrar una importancia baja porque el modelo puede sustituir una por la otra
c) Solo la primera feature mostrará importancia
d) La importancia por permutación maneja las correlaciones perfectamente

<details><summary>Respuesta</summary>b) Ambas features pueden mostrar una importancia baja porque cuando se mezcla una, el modelo sigue usando la contraparte correlacionada para hacer predicciones, así que el rendimiento cae poco</details>

## Respuesta corta (2 preguntas)

**Q6.** Explicá la diferencia entre interpretabilidad global y local. ¿Cuándo usarías cada una?

<details><summary>Respuesta</summary>La interpretabilidad global explica el comportamiento general del modelo: qué features importan más y cómo afectan a las predicciones en promedio (por ejemplo, importancia por permutación, PDP). La interpretabilidad local explica una sola predicción: por qué este paciente puntual fue clasificado como de alto riesgo (por ejemplo, SHAP, LIME). Usá métodos globales para entender y depurar el modelo; usá métodos locales cuando necesitás explicar decisiones individuales (por ejemplo, ¿por qué se rechazó este préstamo?).</details>

**Q7.** Un gráfico de dependencia parcial para "años de experiencia" en un modelo de predicción de salarios muestra una línea plana de 0 a 2 años, un aumento pronunciado de 2 a 15 años y una meseta después de los 15 años. Interpretá esto.

<details><summary>Respuesta</summary>El PDP muestra un efecto marginal no lineal: el salario es insensible a la experiencia en los primeros 2 años (trabajos de nivel inicial), aumenta rápidamente entre los 2 y los 15 años (progresión de carrera y acumulación de habilidades), y luego se estabiliza después de los 15 años (roles senior con rendimientos decrecientes ante más experiencia). Esto sugiere que la relación entre experiencia y salario es no lineal y no puede capturarse con un coeficiente lineal simple.</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribí una función `plot_pdp_features(model, X_val, feature_names, features_to_plot)` que cree una grilla de 2x3 de gráficos de dependencia parcial para 6 features usando `PartialDependenceDisplay.from_estimator`.

<details><summary>Respuesta</summary>

```python
import matplotlib.pyplot as plt
from sklearn.inspection import PartialDependenceDisplay

def plot_pdp_features(model, X_val, feature_names, features_to_plot):
    n_features = len(features_to_plot)
    n_rows = (n_features + 2) // 3
    fig, ax = plt.subplots(n_rows, 3, figsize=(15, 4 * n_rows))
    ax = ax.ravel()

    for i, feature in enumerate(features_to_plot):
        if i < len(ax):
            PartialDependenceDisplay.from_estimator(
                model, X_val, [feature],
                feature_names=feature_names,
                ax=ax[i], grid_resolution=20
            )
            ax[i].set_title(f'PDP: {feature}')

    for j in range(n_features, len(ax)):
        ax[j].set_visible(False)

    plt.tight_layout()
    plt.show()

from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import fetch_california_housing
housing = fetch_california_housing()
model = RandomForestRegressor(n_estimators=50).fit(housing.data, housing.target)
plot_pdp_features(model, housing.data, housing.feature_names, ['MedInc', 'HouseAge', 'AveRooms', 'AveOccup', 'Latitude', 'Longitude'])
```
</details>
