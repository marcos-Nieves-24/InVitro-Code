# Quiz: ¿Cómo aprende la IA?
## Multiple Choice (5 questions)

**1. ¿Qué es una frontera de decisión?**
a) El límite ético de lo que la IA puede decidir
b) La línea (o superficie) que separa diferentes clases en el espacio de características
c) El momento en que el algoritmo deja de aprender
d) La máxima precisión que puede alcanzar un modelo

**2. En KNN, ¿qué significa que k sea muy grande (ej. k=20)?**
a) El modelo clasifica más rápido
b) La frontera se vuelve más suave, pero puede perder patrones locales
c) El modelo necesita más memoria
d) El accuracy siempre mejora

**3. ¿Cuál es la diferencia entre clasificación y regresión?**
a) Clasificación es más precisa que regresión
b) Clasificación predice categorías discretas; regresión predice valores continuos
c) No hay diferencia, son sinónimos
d) Regresión solo funciona con datos biológicos

**4. ¿Qué diferencia al subajuste (underfitting) del sobreajuste (overfitting)?**
a) En subajuste ambos errores son altos; en sobreajuste el error train es bajo pero el test es alto
b) En subajuste el error train es bajo; en sobreajuste ambos errores son altos
c) Son lo mismo visto desde distintos ángulos
d) El subajuste solo ocurre con KNN, el sobreajuste solo con regresión

**5. ¿Por qué el sobreajuste (overfitting) es problemático?**
a) Porque el modelo tarda mucho en entrenar
b) Porque el modelo funciona bien en datos de entrenamiento pero mal en datos nuevos
c) Porque usa demasiada memoria RAM
d) Porque solo funciona con redes neuronales

---
## Answer Key

1. **b)** La frontera separa clases. En 2D es una línea; en 3D es un plano; en más dimensiones es un hiperplano.
2. **b)** k grande suaviza la frontera pero puede perder detalle local. Es un balance.
3. **b)** Clasificación → categorías (Aspergillus/Penicillium). Regresión → números continuos (concentración, peso, temperatura).
4. **a)** Subajuste: el modelo es demasiado simple (ambos errores altos). Sobreajuste: el modelo es demasiado complejo (train bajo, test alto).
5. **b)** El modelo memoriza los datos de entrenamiento y no generaliza. Es el problema más común en ML.
