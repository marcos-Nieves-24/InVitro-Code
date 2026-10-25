# Quiz: Reducción de dimensionalidad (PCA)

## Opción múltiple (5 preguntas)

**1. PCA encuentra direcciones que maximizan:**

a) La correlación entre las variables
b) La varianza en los datos
c) La precisión de un clasificador
d) La cantidad de features

**2. La proporción de varianza explicada de un componente principal nos dice:**

a) Cuántos features usa
b) La proporción de la varianza total que captura
c) Cuán correlacionado está con el target
d) La cantidad de iteraciones necesarias

**3. ¿Por qué debemos estandarizar los datos antes de aplicar PCA?**

a) Para reducir el tiempo de cómputo
b) PCA es sensible a la escala; las variables con escalas más grandes dominarían
c) Para volver los datos categóricos
d) Para aumentar la cantidad de componentes

**4. El codo en un scree plot sugiere:**

a) La cantidad óptima de features a eliminar
b) La cantidad óptima de componentes principales a retener
c) La tasa de aprendizaje
d) El umbral de correlación

**5. Las cargas de PCA representan:**

a) Los valores predichos del modelo
b) La contribución de cada feature original a un PC
c) Los autovalores de la matriz de covarianza
d) Los residuos después de la transformación

## Respuesta corta (2 preguntas)

**6.** Explica por qué PCA se considera una técnica no supervisada.

**7.** Un dataset con 100 features se reduce a 3 PCs que explican el 85% de la varianza. Interpreta este resultado y discutí el trade-off.

## Pregunta de código (1 pregunta)

**8.** Escribe código en Python usando sklearn que:
- Cargue el dataset iris
- Estandarice los features
- Aplique PCA y conserve 2 componentes
- Imprima las proporciones de varianza explicada y la varianza acumulada

---

# Clave de respuestas

1. b) La varianza en los datos
2. b) La proporción de la varianza total que captura
3. b) PCA es sensible a la escala; las variables con escalas más grandes dominarían
4. b) La cantidad óptima de componentes principales a retener
5. b) La contribución de cada feature original a un PC

6. PCA no usa ninguna información de etiquetas. Encuentra patrones (direcciones de máxima varianza) únicamente a partir de la matriz de features X, sin referencia a una variable target y. Esto lo convierte en un método de aprendizaje no supervisado.

7. 3 PCs capturan el 85% de la variabilidad en 100 features: los datos tienen una estructura de baja dimensionalidad. Trade-off: perdemos el 15% de la información pero ganamos una representación mucho más simple, un cómputo más rápido y un menor riesgo de overfitting.

8. 
```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_iris
iris = load_iris()
X_scaled = StandardScaler().fit_transform(iris.data)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
print("Explained variance:", pca.explained_variance_ratio_)
print("Cumulative:", pca.explained_variance_ratio_.sum())
```
