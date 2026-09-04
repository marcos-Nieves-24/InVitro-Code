# =========================================================================
# LAB 9: Evaluacion de modelos de regresion
# -------------------------------------------------------------------------
# Entrenamos una regresion lineal sobre diabetes y evaluamos con MAE,
# MSE, RMSE y R2, validacion cruzada, analisis de residuos e
# importancia de features.
# =========================================================================
# ══════════════════════════════════════════════════════════════════
# DATOS: Cargamos dataset real de diabetes (MASS)
# ══════════════════════════════════════════════════════════════════
if (!requireNamespace("MASS", quietly = TRUE)) {
  install.packages("MASS", repos = "https://repo.r-wasm.org")
}
data("diabetes", package = "MASS")


cat("═══════════════════════════════════════════════════════════════\n")

cat("  LAB 9: Evaluacion de modelos de regresion\n")
cat("═══════════════════════════════════════════════════════════════\n\n")



# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

set.seed(42)
n <- nrow(diabetes)
idx <- sample(1:n, floor(0.8 * n))
train <- diabetes[idx, ]
test <- diabetes[-idx, ]

modelo <- lm(y ~ ., data = train)
y_pred <- predict(modelo, newdata = test)

mse <- mean((test$y - y_pred)^2)
rmse <- sqrt(mse)
mae <- mean(abs(test$y - y_pred))
r2 <- 1 - sum((test$y - y_pred)^2) / sum((test$y - mean(test$y))^2)

cat(sprintf("MAE: %.2f\n", mae))
cat(sprintf("MSE: %.2f\n", mse))
cat(sprintf("RMSE: %.2f\n", rmse))
cat(sprintf("R2: %.4f\n", r2))

# Scatter predicciones vs reales
plot(test$y, y_pred, pch = 19, col = rgb(0.2, 0.4, 0.8, 0.6),
     xlab = "Valor real", ylab = "Prediccion",
     main = "Predicciones vs valores reales")
abline(a = 0, b = 1, col = "red", lwd = 2, lty = 2)

# Validacion cruzada
cv5 <- numeric(5)
folds <- sample(rep(1:5, length.out = n))
for (f in 1:5) {
  train_cv <- diabetes[folds != f, ]
  test_cv <- diabetes[folds == f, ]
  mod_cv <- lm(y ~ ., data = train_cv)
  pred_cv <- predict(mod_cv, newdata = test_cv)
  cv5[f] <- 1 - sum((test_cv$y - pred_cv)^2) / sum((test_cv$y - mean(test_cv$y))^2)
}
cat(sprintf("\nCV 5 folds: R2 medio = %.4f +/- %.4f\n", mean(cv5), sd(cv5)))

# Residuos
residuos <- test$y - y_pred
cat(sprintf("\nResiduos: media = %.4f | desv = %.4f\n", mean(residuos), sd(residuos)))

par(mfrow = c(1, 2))
plot(y_pred, residuos, pch = 19, xlab = "Prediccion", ylab = "Residuo",
     main = "Residuos vs predicciones")
abline(h = 0, col = "red", lty = 2)
hist(residuos, breaks = 30, main = "Histograma de residuos", col = "#60a5fa")
par(mfrow = c(1, 1))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df <- diabetes %>% mutate(id = row_number())

set.seed(42)
train_ids <- df %>% slice_sample(prop = 0.8) %>% pull(id)
train <- df %>% filter(id %in% train_ids)
test <- df %>% filter(!id %in% train_ids)

mod <- lm(y ~ ., data = train %>% select(-id))
test <- test %>%
  mutate(prediccion = predict(mod, newdata = .),
         residuo = y - prediccion)

ggplot(test, aes(x = y, y = prediccion)) +
  geom_point(alpha = 0.6, color = "#2563eb") +
  geom_abline(intercept = 0, slope = 1, color = "red", linetype = "dashed") +
  labs(title = "Predicciones vs valores reales") +
  theme_minimal()

ggplot(test, aes(x = prediccion, y = residuo)) +
  geom_point(alpha = 0.6, color = "#2563eb") +
  geom_hline(yintercept = 0, color = "red", linetype = "dashed") +
  labs(title = "Residuos vs predicciones") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

df <- as_tibble(diabetes)

set.seed(42)
split <- initial_split(df, prop = 0.8)
train <- training(split)
test <- testing(split)

rec <- recipe(y ~ ., data = train) %>%
  step_normalize(all_numeric_predictors())

lm_spec <- linear_reg() %>% set_engine("lm")

wf <- workflow() %>%
  add_recipe(rec) %>%
  add_model(lm_spec) %>%
  fit(data = train)

preds <- predict(wf, new_data = test) %>% bind_cols(test)
cat("Metricas tidymodels:\n")
preds %>% metrics(truth = y, estimate = .pred) %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

set.seed(42)
idx <- sample(1:nrow(diabetes), floor(0.8 * nrow(diabetes)))
train <- diabetes[idx, ]
test <- diabetes[-idx, ]

rf <- randomForest(y ~ ., data = train, ntree = 100, importance = TRUE)
pred_rf <- predict(rf, newdata = test)

mse_rf <- mean((test$y - pred_rf)^2)
r2_rf <- 1 - sum((test$y - pred_rf)^2) / sum((test$y - mean(test$y))^2)
cat(sprintf("Random Forest - MSE: %.2f, R2: %.4f\n", mse_rf, r2_rf))
varImpPlot(rf, main = "Importancia de variables")

cat("\n--- Resumen ---\n")
cat("Regresion lineal evaluada con MAE, MSE, RMSE y R2.\n")
cat("Validacion cruzada confirma estabilidad del modelo.\n")
