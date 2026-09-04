# =========================================================================
# LAB 7: Reduccion de dimensionalidad con PCA
# -------------------------------------------------------------------------
# Aplicamos PCA al dataset iris: varianza explicada, proyeccion 2D y
# analisis de las cargas de los componentes.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 7: Reduccion de dimensionalidad con PCA\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

data("iris", package = "datasets")
X <- iris[, 1:4]
y <- iris$Species

X_std <- scale(X)
cat("Datos estandarizados:", dim(X_std), "\n")
cat("Media por feature (aprox 0):", round(colMeans(X_std), 3), "\n")
cat("Desvio por feature (aprox 1):", round(apply(X_std, 2, sd), 3), "\n")

pca <- prcomp(X_std)
cat("\nVarianza explicada por componente:\n")
print(round(pca$sdev^2 / sum(pca$sdev^2), 4))
cat("Varianza acumulada:", round(cumsum(pca$sdev^2 / sum(pca$sdev^2)), 4), "\n")

# Scree plot
varianza <- pca$sdev^2 / sum(pca$sdev^2)
acumulada <- cumsum(varianza)
barplot(varianza, names.arg = paste0("PC", 1:4),
        main = "Varianza explicada por componente", col = "#60a5fa")
lines(acumulada, type = "b", pch = 19, col = "red")

# Proyeccion 2D
plot(pca$x[, 1], pca$x[, 2], col = as.integer(y), pch = 19,
     xlab = "PC1", ylab = "PC2", main = "Proyeccion PCA 2D del iris")
legend("topright", legend = levels(y), col = 1:3, pch = 19)

# Cargas
cargas <- pca$rotation
cat("\nCargas de PC1 y PC2:\n")
print(round(cargas[, 1:2], 3))
cat("\nFeature con mayor carga en PC1:",
    rownames(cargas)[which.max(abs(cargas[, 1]))], "\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df_pca <- tibble(
  PC1 = pca$x[, 1], PC2 = pca$x[, 2], especie = y
)

ggplot(df_pca, aes(x = PC1, y = PC2, color = especie)) +
  geom_point(size = 2, alpha = 0.7) +
  labs(title = "Proyeccion PCA 2D del dataset iris") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

df_iris <- as_tibble(iris)

rec <- recipe(Species ~ ., data = df_iris) %>%
  step_normalize(all_numeric_predictors()) %>%
  step_pca(all_numeric_predictors(), num_comp = 2, prefix = "PC")

pca_prep <- prep(rec)
pca_data <- bake(pca_prep, new_data = NULL)
cat("Componentes PCA con recipes:\n")
print(head(pca_data))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

# PCA + Random Forest
X_reducido <- pca$x[, 1:2]
df_rf <- data.frame(X_reducido, Species = y)
rf <- randomForest(Species ~ ., data = df_rf, ntree = 100)
cat(sprintf("Random Forest con 2 PCs - OOB error: %.3f\n", rf$err.rate[100, 1]))

cat("\n--- Resumen ---\n")
cat("Los primeros 2 PCs explican la mayor parte de la varianza.\n")
cat("PC1 separa la especie setosa del resto.\n")
