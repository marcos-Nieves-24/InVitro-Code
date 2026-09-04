# =========================================================================
# LAB 8: Clustering con K-Means
# -------------------------------------------------------------------------
# Buscamos el k optimo con inercia y silhouette sobre blobs sinteticos y
# luego agrupamos el dataset iris, comparando con las especies reales.
# =========================================================================
# ══════════════════════════════════════════════════════════════════
# DATOS: Cargamos dataset real de iris (R base)
# ══════════════════════════════════════════════════════════════════
data("iris", package = "datasets")


cat("═══════════════════════════════════════════════════════════════\n")


par(mfrow = c(1, 2))
plot(ks, inercia, type = "b", xlab = "k", ylab = "Inercia",
     main = "Curva del codo", pch = 19)
plot(ks, sil, type = "b", xlab = "k", ylab = "Silhouette",
     main = "Silhouette score vs k", pch = 19)
par(mfrow = c(1, 1))

k_optimo <- ks[which.max(sil)]
km_final <- kmeans(X, centers = k_optimo, nstart = 10)
plot(X, col = km_final$cluster, pch = 19,
     main = paste("Clusters K-Means (k=", k_optimo, ")", sep = ""))
points(km_final$centers, col = 1:k_optimo, pch = 4, cex = 2, lwd = 2)

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df_blobs <- tibble(x1 = X[, 1], x2 = X[, 2], cluster = factor(km_final$cluster))

ggplot(df_blobs, aes(x = x1, y = x2, color = cluster)) +
  geom_point(alpha = 0.6) +
  stat_ellipse(level = 0.95, linewidth = 1) +
  labs(title = "Clusters de K-Means con elipses de confianza") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

iris_scaled <- iris %>%
  select(where(is.numeric)) %>%
  scale() %>%
  as_tibble()

# K-Means con 3 clusters
set.seed(42)
km_iris <- kmeans(iris_scaled, centers = 3, nstart = 10)
sil_iris <- mean(silhouette(km_iris$cluster, dist(iris_scaled))[, 3])
cat(sprintf("Silhouette sobre iris (k=3): %.3f\n", sil_iris))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(cluster)

# Tabla de contingencia
tabla <- table(Especie = iris$Species, Cluster = km_iris$cluster)
cat("Tabla de contingencia (clusters vs especies):\n")
print(tabla)

# Proyeccion PCA
pca <- prcomp(iris_scaled)
plot(pca$x[, 1], pca$x[, 2], col = km_iris$cluster, pch = 19,
     xlab = "PC1", ylab = "PC2", main = "Clusters de iris proyectados con PCA")
legend("topright", legend = paste("Cluster", 1:3), col = 1:3, pch = 19)

cat("\n--- Resumen ---\n")
cat("El codo y el silhouette sugieren un k optimo cercano a 5 para los blobs.\n")
cat("En iris, K-Means separa setosa claramente.\n")
