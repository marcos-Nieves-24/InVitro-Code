# =========================================================================
# LAB 7: PCA - reduccion de dimensionalidad
# -------------------------------------------------------------------------
# Estandarizamos el dataset de cancer de mama, aplicamos PCA y analizamos
# la varianza explicada, la proyeccion 2D y las cargas de los componentes.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 7: PCA - reduccion de dimensionalidad\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

# Generamos datos similares a breast cancer
set.seed(42)
n <- 300
radio_benigno <- rnorm(200, mean = 14, sd = 3)
textura_benigno <- rnorm(200, mean = 19, sd = 3)
perimetro_benigno <- radio_benigno * 2 * pi + rnorm(200, 0, 5)
area_benigno <- pi * radio_benigno^2 + rnorm(200, 0, 50)

radio_maligno <- rnorm(100, mean = 25, sd = 5)
textura_maligno <- rnorm(100, mean = 25, sd = 4)
perimetro_maligno <- radio_maligno * 2 * pi + rnorm(100, 0, 8)
area_maligno <- pi * radio_maligno^2 + rnorm(100, 0, 100)

X <- rbind(
  cbind(radio_benigno, textura_benigno, perimetro_benigno, area_benigno),
  cbind(radio_maligno, textura_maligno, perimetro_maligno, area_maligno)
)
y <- factor(rep(c("benigno", "maligno"), c(200, 100)))
nombres <- c("radio", "textura", "perimetro", "area")

X_std <- scale(X)
pca <- prcomp(X_std)
cat("Varianza explicada por componente:\n")
print(round(pca$sdev^2 / sum(pca$sdev^2), 3))

# Scree plot
varianza <- pca$sdev^2 / sum(pca$sdev^2)
acumulada <- cumsum(varianza)
barplot(varianza, names.arg = paste0("PC", 1:4),
        main = "Varianza explicada por componente", col = "#60a5fa")
lines(acumulada * max(varianza), type = "b", pch = 19, col = "red")

# Proyeccion 2D
plot(pca$x[, 1], pca$x[, 2], col = ifelse(y == "benigno", "#3b82f6", "#ef4444"),
     pch = 19, xlab = "PC1", ylab = "PC2",
     main = "Proyeccion PCA 2D")
legend("topright", legend = c("Benigno", "Maligno"),
       col = c("#3b82f6", "#ef4444"), pch = 19)

# Cargas
cargas <- pca$rotation
cat("\nTop 3 cargas de PC1:\n")
orden <- order(abs(cargas[, 1]), decreasing = TRUE)[1:3]
for (i in orden) {
  cat(sprintf("  %s: %.3f\n", nombres[i], cargas[i, 1]))
}

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df <- tibble(
  PC1 = pca$x[, 1], PC2 = pca$x[, 2], clase = y
)

ggplot(df, aes(x = PC1, y = PC2, color = clase)) +
  geom_point(alpha = 0.6) +
  labs(title = "Proyeccion PCA 2D") +
  theme_minimal() +
  scale_color_manual(values = c("benigno" = "#3b82f6", "maligno" = "#ef4444"))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

df_pca <- tibble(
  radio = X[, 1], textura = X[, 2], perimetro = X[, 3], area = X[, 4],
  clase = y
)

rec <- recipe(clase ~ ., data = df_pca) %>%
  step_normalize(all_numeric_predictors()) %>%
  step_pca(all_numeric_predictors(), num_comp = 2)

pca_prep <- prep(rec)
pca_data <- bake(pca_prep, new_data = NULL)
cat("Componentes PCA calculados con recipes:\n")
head(pca_data)

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

# Usamos PCA para reducir dimensionalidad antes de Random Forest
pca_full <- prcomp(X_std)
X_reducido <- pca_full$x[, 1:2]

df_rf <- data.frame(X_reducido, clase = y)
rf <- randomForest(clase ~ ., data = df_rf, ntree = 100)
cat(sprintf("Random Forest con 2 PCs - OOB error: %.3f\n", rf$err.rate[100, 1]))

cat("\n--- Resumen ---\n")
cat("Los primeros 2 PCs separan claramente benigno de maligno.\n")
cat("PCA reduce 4 features a 2 manteniendo la informacion relevante.\n")
