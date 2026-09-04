# =========================================================================
# LAB 9: Interpretacion de modelos
# -------------------------------------------------------------------------
# Entrenamos un bosque aleatorio y comparamos la importancia por impureza
# con la importancia por permutacion.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 9: Interpretacion de modelos\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

library(randomForest)

set.seed(42)
n <- 300
radio <- c(rnorm(200, 14, 3), rnorm(100, 25, 5))
textura <- c(rnorm(200, 19, 3), rnorm(100, 25, 4))
perimetro <- radio * 2 * pi + rnorm(300, 0, 5)
area <- pi * radio^2 + rnorm(300, 0, 50)
clase <- factor(rep(c("benigno", "maligno"), c(200, 100)))

df <- data.frame(radio, textura, perimetro, area, clase)
idx <- sample(1:n, floor(0.7 * n))
train <- df[idx, ]
test <- df[-idx, ]

rf <- randomForest(clase ~ ., data = train, ntree = 100, importance = TRUE)
pred <- predict(rf, newdata = test)
exactitud <- sum(pred == test$clase) / nrow(test)
cat(sprintf("PASO 1 - Exactitud en prueba: %.3f\n", exactitud))

# Importancia por impureza (MeanDecreaseGini)
imp_gini <- importance(rf, type = 1)
cat("\nPASO 2 - Importancia por impureza:\n")
print(sort(imp_gini[, 1], decreasing = TRUE))

# Importancia por permutacion (MeanDecreaseAccuracy)
imp_perm <- importance(rf, type = 2)
cat("\nPASO 3 - Importancia por permutacion:\n")
print(sort(imp_perm[, 1], decreasing = TRUE))

# Comparacion visual
par(mfrow = c(1, 2))
barplot(imp_gini[, 1], main = "Impureza (Gini)", col = "#60a5fa", las = 2)
barplot(imp_perm[, 1], main = "Permutacion", col = "#f59e0b", las = 2)
par(mfrow = c(1, 1))

# Dependencia parcial manual
mejor <- names(which.max(imp_perm[, 1]))
grid <- seq(min(df[[mejor]]), max(df[[mejor]]), length.out = 50)
base <- colMeans(df[, 1:4])
pred_pdp <- numeric(50)
for (i in seq_along(grid)) {
  nueva <- data.frame(t(base))
  nueva[[mejor]] <- grid[i]
  pred_pdp[i] <- predict(rf, newdata = nueva, type = "prob")[1, 2]
}
plot(grid, pred_pdp, type = "l", xlab = mejor, ylab = "P(maligno)",
     main = paste("Dependencia parcial de", mejor), lwd = 2)

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df_imp <- tibble(
  Feature = rownames(imp_gini),
  Gini = imp_gini[, 1],
  Permutacion = imp_perm[, 1]
) %>%
  arrange(desc(Gini))

df_imp %>%
  tidyr::pivot_longer(cols = c(Gini, Permutacion), names_to = "Tipo", values_to = "Importancia") %>%
  ggplot(aes(x = reorder(Feature, Importancia), y = Importancia, fill = Tipo)) +
  geom_col(position = "dodge") +
  coord_flip() +
  labs(title = "Importancia de features: Gini vs Permutacion",
       x = "Feature", y = "Importancia") +
  theme_minimal() +
  scale_fill_manual(values = c("Gini" = "#60a5fa", "Permutacion" = "#f59e0b"))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

df_tm <- tibble(
  radio = radio, textura = textura, perimetro = perimetro, area = area,
  clase = clase
)

split <- initial_split(df_tm, prop = 0.7)
train <- training(split)
test <- testing(split)

rf_spec <- rand_forest(trees = 100) %>%
  set_engine("randomForest", importance = TRUE) %>%
  set_mode("classification")

rf_wf <- workflow() %>%
  add_model(rf_spec) %>%
  add_formula(clase ~ .) %>%
  fit(data = train)

preds <- predict(rf_wf, new_data = test) %>% bind_cols(test)
cat("Metricas tidymodels:\n")
preds %>% metrics(truth = clase, estimate = .pred_class) %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

# Permutacion manual (mas control)
set.seed(42)
rf <- randomForest(clase ~ ., data = train, ntree = 100, importance = TRUE)
acc_base <- sum(predict(rf, newdata = test) == test$clase) / nrow(test)

cat("Importancia por permutacion (manual):\n")
perm_imp <- numeric(4)
names(perm_imp) <- names(df)[1:4]
for (j in 1:4) {
  test_perm <- test
  test_perm[, j] <- sample(test_perm[, j])
  acc_perm <- sum(predict(rf, newdata = test_perm) == test$clase) / nrow(test)
  perm_imp[j] <- acc_base - acc_perm
}
print(sort(perm_imp, decreasing = TRUE))

cat("\n--- Resumen ---\n")
cat("La importancia por permutacion es mas honesta que la de Gini.\n")
cat("La dependencia parcial muestra el efecto marginal de cada feature.\n")
