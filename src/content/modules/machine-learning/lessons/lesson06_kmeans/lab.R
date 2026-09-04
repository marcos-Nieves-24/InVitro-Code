# =========================================================================
# LAB 6: Agrupamiento K-Means
# -------------------------------------------------------------------------
# Buscamos la K optima con inercia y silueta, visualizamos los clusters
# con sus centroides y agrupamos iris escalado con una tabla cruzada.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 6: Agrupamiento K-Means\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

library(cluster)

set.seed(42)
n <- 400
X <- rbind(
  matrix(rnorm(n/5 * 2, mean = c(2, 2)), ncol = 2),
  matrix(rnorm(n/5 * 2, mean = c(-2, 2)), ncol = 2),
  matrix(rnorm(n/5 * 2, mean = c(0, -2)), ncol = 2),
  matrix(rnorm(n/5 * 2, mean = c(2, -2)), ncol = 2),
  matrix(rnorm(n/5 * 2, mean = c(-2, -2)), ncol = 2)
)

Ks <- 2:10
inercia <- numeric(length(Ks))
silueta <- numeric(length(Ks))
for (i in seq_along(Ks)) {
  km <- kmeans(X, centers = Ks[i], nstart = 10)
  inercia[i] <- km$tot.withinss
  silueta[i] <- mean(silhouette(km$cluster, dist(X))[, 3])
}

cat("K optima segun silueta:", Ks[which.max(silueta)], "\n")

par(mfrow = c(1, 2))
plot(Ks, inercia, type = "b", xlab = "K", ylab = "Inercia",
     main = "Metodo del codo", pch = 19)
plot(Ks, silueta, type = "b", xlab = "K", ylab = "Silhouette",
     main = "Silhouette segun K", pch = 19)
par(mfrow = c(1, 1))

km_final <- kmeans(X, centers = 5, nstart = 10)
plot(X, col = km_final$cluster, pch = 19,
     xlab = "Feature 1", ylab = "Feature 2",
     main = "Clusters K-Means (K=5)")
points(km_final$centers, col = 1:5, pch = 4, cex = 2, lwd = 2)

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

set.seed(42)
df <- tibble(
  x1 = c(rnorm(80, 2), rnorm(80, -2), rnorm(80, 0),
         rnorm(80, 2), rnorm(80, -2)),
  x2 = c(rnorm(80, 2), rnorm(80, 2), rnorm(80, -2),
         rnorm(80, -2), rnorm(80, -2))
)

ggplot(df, aes(x = x1, y = x2)) +
  geom_point(alpha = 0.6) +
  labs(title = "Datos sinteticos con 5 grupos") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

set.seed(42)
iris_scaled <- iris %>%
  select(where(is.numeric)) %>%
  scale() %>%
  as_tibble()

kmeans_spec <- kmeans(num_clusters = 3) %>%
  set_engine("skmeans") %>%
  set_mode("clustering")

# Usamos.cluster directamente ya que tidymodels kmeans es limitado
km_iris <- kmeans(iris_scaled, centers = 3, nstart = 10)
cat("Clusters encontrados:", length(unique(km_iris$cluster)), "\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(cluster)

data("iris", package = "datasets")
X_iris <- scale(iris[, 1:4])

km_iris <- kmeans(X_iris, centers = 3, nstart = 10)
sil <- silhouette(km_iris$cluster, dist(X_iris))
cat(sprintf("Silhouette promedio: %.3f\n", mean(sil[, 3])))

# Tabla cruzada
tabla <- table(Especie = iris$Species, Cluster = km_iris$cluster)
cat("Tabla cruzada (especie vs cluster):\n")
print(tabla)

# Proyeccion PCA
pca <- prcomp(X_iris)
plot(pca$x[, 1], pca$x[, 2], col = km_iris$cluster, pch = 19,
     xlab = "PC1", ylab = "PC2", main = "Clusters de iris en PCA")
points(pca$centers[, 1], pca$centers[, 2], col = 1:3, pch = 4, cex = 2, lwd = 2)

cat("\n--- Resumen ---\n")
cat("K-Means separa setosa claramente y distingue casi del todo al resto.\n")
cat("La silueta indica la cohesion entre clusters.\n")
