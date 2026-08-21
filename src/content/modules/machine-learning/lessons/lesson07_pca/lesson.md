---
Module: 4
Lesson Number: 7
Lesson Title: PCA
Estimated Duration: 75 minutos
Prerequisites: L1 (Fundamentos de ML), álgebra lineal básica
Learning Objectives:
  - Explicar cómo PCA reduce la dimensionalidad preservando la varianza
  - Calcular e interpretar componentes principales y varianza explicada
  - Aplicar PCA con scikit-learn para visualización 2D y preprocesamiento
  - Determinar el número óptimo de componentes usando la varianza explicada acumulada
Keywords: PCA, componentes principales, reducción de dimensionalidad, valores propios, varianza explicada, visualización
Difficulty: Intermedio
Programming Concepts: sklearn.decomposition.PCA
Mathematical Concepts: valores propios, vectores propios, matriz de covarianza, descomposición espectral
Machine Learning Concepts: reducción de dimensionalidad, compresión de features
Datasets Used: iris, breast cancer, California Housing
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Cuando tienes demasiadas dimensiones" eyebrow="INICIO">

<MascotMessage mood="thinking">
¿Mil features pero solo puedes graficar en 2D? PCA comprime la información en pocas dimensiones preservando lo más importante. Es la navaja suiza del preprocesamiento.
</MascotMessage>

En genómica tienes 20,000 genes pero solo 100 pacientes. En SaaS tienes cientos de métricas de comportamiento. Visualizar, modelar y entender datos de alta dimensionalidad es difícil. **PCA (Principal Component Analysis)** resuelve esto: encuentra las direcciones de máxima varianza en tus datos y proyecta todo a un espacio más chico.

<ConceptCard variant="key-idea">
PCA no selecciona features — crea **nuevas features** (componentes principales) que son combinaciones lineales de las originales. El primer componente captura la dirección de mayor varianza, el segundo la siguiente (ortogonal al primero), y así.
</ConceptCard>

</Section>

<Section number={2} title="¿Cómo funciona?" eyebrow="CONCEPTO">

1. **Estandariza los datos** (media 0, varianza 1 por feature)
2. **Calcula la matriz de covarianza** entre features
3. **Encuentra valores y vectores propios** de la matriz de covarianza
4. **Ordena los vectores propios** por valor propio (mayor → más varianza explicada)
5. **Proyecta** los datos al subespacio de los primeros K vectores propios

<CalloutInfo>
Los **valores propios** miden cuánta varianza captura cada componente. La suma de todos los valores propios es la varianza total. Dividir cada valor propio por la suma total te da el porcentaje de varianza explicada por ese componente.
</CalloutInfo>

<ConceptCard variant="definition">
**Varianza explicada acumulada:** Qué porcentaje de la información original retienes con K componentes. Si los primeros 3 componentes explican el 95% de la varianza, puedes reducir tus datos de 100 dimensiones a 3 perdiendo solo el 5% de la información.
</ConceptCard>

</Section>

<Section number={3} title="PCA en acción: de 4D a 2D" eyebrow="INTERACTIVA">

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler

iris = load_iris()
X = iris.data
y = iris.target

# Siempre estandarizar antes de PCA
X_scaled = StandardScaler().fit_transform(X)

pca = PCA()
X_pca = pca.fit_transform(X_scaled)

# Varianza explicada
print("Varianza explicada por componente:")
for i, ratio in enumerate(pca.explained_variance_ratio_):
    print(f"  PC{i+1}: {ratio:.3f} ({ratio*100:.1f}%)")
print(f"Total 2 PCs: {pca.explained_variance_ratio_[:2].sum():.3f}")

# Visualización 2D
plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', s=50)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.title('Iris dataset proyectado en 2D con PCA')
plt.colorbar(scatter, label='Especie')
plt.show()
```

<CalloutCheck>
Con solo 2 componentes capturas >95% de la varianza del Iris dataset. Pasaste de 4 dimensiones (sépalos y pétalos) a 2 que puedes graficar, y las especies siguen siendo separables. Eso es PCA en una frase: **comprimir sin perder lo esencial**.
</CalloutCheck>

</Section>

<Section number={4} title="¿Cuántos componentes necesitas?" eyebrow="CÓDIGO">

```python
# Varianza explicada acumulada
cumsum = np.cumsum(pca.explained_variance_ratio_)

plt.figure(figsize=(8, 5))
plt.bar(range(1, len(cumsum)+1), pca.explained_variance_ratio_, alpha=0.7, label='Individual')
plt.step(range(1, len(cumsum)+1), cumsum, where='mid', color='red', linewidth=2, label='Acumulada')
plt.axhline(y=0.95, color='gray', linestyle='--', label='95% umbral')
plt.xlabel('Componentes principales')
plt.ylabel('Varianza explicada')
plt.legend()
plt.title('¿Cuántos componentes necesito?')
plt.show()
```

<ReflectionCheck
  blockId="reflection-l07-pca-components"
  moduleSlug="machine-learning"
  lessonSlug="lesson07_pca"
  prompt="¿Por qué es importante estandarizar los datos antes de aplicar PCA? ¿Qué pasaría si no lo haces?"
  answer="PCA es sensible a la escala. Si una feature va de 0 a 1000 y otra de 0 a 1, la primera domina la matriz de covarianza y el primer componente principal será básicamente esa feature. Estandarizar (restar media, dividir por desvío) pone todas las features en igualdad de condiciones y deja que PCA descubra las verdaderas direcciones de varianza."
/>

</Section>

<Section number={5} title="Aplicaciones" eyebrow="APLICACIÓN">

<ConceptCard variant="key-idea">
**Biotecnología — Genómica:** Reduces 20,000 genes a 50 componentes principales que capturan el 90% de la varianza. Con 50 features en vez de 20,000, cualquier modelo (regresión, random forest) entrena en segundos en vez de horas.

**SaaS — Visualización de usuarios:** Proyectas cientos de métricas de comportamiento a 2D y ves clústeres naturales de usuarios: "power users", "en riesgo", "casuales". Sin PCA, estas estructuras serían invisibles.

**Preprocesamiento:** Antes de aplicar K-Means o cualquier modelo, PCA elimina ruido y features redundantes, acelerando el entrenamiento y mejorando la generalización.
</ConceptCard>

</Section>

<Section number={6} title="Resumen y glosario" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
PCA reduce dimensionalidad creando nuevas features (componentes principales) que son combinaciones lineales de las originales, ordenadas por varianza explicada. Estandarizar es obligatorio. La varianza explicada acumulada te dice cuántos componentes retener. Esencial para visualización, compresión y preprocesamiento.
</ConceptCard>

<InteractiveTable
  columns={[{ key: "term", label: "Término" }, { key: "def", label: "Definición" }]}
  rows={[
    { term: "Componente principal", def: "Nueva feature = combinación lineal de las originales, ortogonal a las demás" },
    { term: "Valor propio", def: "Cantidad de varianza capturada por un componente" },
    { term: "Varianza explicada", def: "Porcentaje de la varianza total que captura un componente" },
    { term: "Varianza acumulada", def: "Suma de varianzas explicadas por los primeros K componentes" },
  ]}
/>

</Section>

<Section number={7} title="Ejercicios" eyebrow="EJERCICIOS">

<ConceptCard variant="key-idea">
**Desafío:** Aplica PCA a breast cancer y compara rendimiento con features originales.
</ConceptCard>

<CodeEditor
  defaultValue={`import numpy as np
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
import time

data = load_breast_cancer()
X, y = data.data, data.target
X = StandardScaler().fit_transform(X)

# ¿Cuántos componentes para 95% de varianza?
pca = PCA().fit(X)
cumsum = np.cumsum(pca.explained_variance_ratio_)
n_components = np.argmax(cumsum >= 0.95) + 1
print(f"Componentes para 95% varianza: {n_components} (de {X.shape[1]})")

# Comparar: features originales vs PCA
for name, X_data in [("Original", X), ("PCA", PCA(n_components=n_components).fit_transform(X))]:
    X_tr, X_te, y_tr, y_te = train_test_split(X_data, y, test_size=0.2, random_state=42)
    start = time.time()
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_tr, y_tr)
    elapsed = time.time() - start
    print(f"{name}: accuracy={rf.score(X_te, y_te):.3f}, tiempo={elapsed:.3f}s")
`}
  height="380px"
/>

</Section>
