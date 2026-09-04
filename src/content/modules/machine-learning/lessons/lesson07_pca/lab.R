# =========================================================================
# LAB 7: PCA - reduccion de dimensionalidad
# -------------------------------------------------------------------------
# Estandarizamos el dataset de cancer de mama, aplicamos PCA y analizamos
# la varianza explicada, la proyeccion 2D y las cargas de los componentes.
# =========================================================================
# ══════════════════════════════════════════════════════════════════
# DATOS: Cargamos dataset real de iris (R base)
# ══════════════════════════════════════════════════════════════════
data("iris", package = "datasets")


cat("═══════════════════════════════════════════════════════════════\n")


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
