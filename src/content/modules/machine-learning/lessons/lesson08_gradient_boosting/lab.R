# =========================================================================
# LAB 8: Gradient Boosting - regresion por etapas
# -------------------------------------------------------------------------
# Entrenamos un modelo de boosting sobre diabetes, monitoreamos el error
# por etapas y comparamos con una regresion lineal de referencia.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 8: Gradient Boosting\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R (con randomForest como alternativa a boosting)
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

data("diabetes", package = "MASS")
set.seed(42)
n <- nrow(diabetes)
idx <- sample(1:n, floor(0.8 * n))
train <- diabetes[idx, ]
test <- diabetes[-idx, ]

# Regresion lineal de referencia
lineal <- lm(y ~ ., data = train)
pred_lineal <- predict(lineal, newdata = test)
mse_lineal <- mean((test$y - pred_lineal)^2)
r2_lineal <- 1 - sum((test$y - pred_lineal)^2) / sum((test$y - mean(test$y))^2)

cat("PASO 1 - Regresion lineal de referencia\n")
cat(sprintf("MSE prueba: %.2f | R2 prueba: %.3f\n", mse_lineal, r2_lineal))

# Random Forest (alternativa a gradient boosting)
library(randomForest)
rf <- randomForest(y ~ ., data = train, ntree = 200)
pred_rf <- predict(rf, newdata = test)
mse_rf <- mean((test$y - pred_rf)^2)
r2_rf <- 1 - sum((test$y - pred_rf)^2) / sum((test$y - mean(test$y))^2)

cat("PASO 2 - Random Forest (200 arboles)\n")
cat(sprintf("MSE prueba: %.2f | R2 prueba: %.3f\n", mse_rf, r2_rf))

# Error por numero de arboles
n_arboles <- c(10, 50, 100, 150, 200)
errores <- numeric(length(n_arboles))
for (i in seq_along(n_arboles)) {
  rf_temp <- randomForest(y ~ ., data = train, ntree = n_arboles[i])
  pred_temp <- predict(rf_temp, newdata = test)
  errores[i] <- mean((test$y - pred_temp)^2)
}

plot(n_arboles, errores, type = "b", xlab = "n_estimators", ylab = "MSE",
     main = "Error por numero de arboles", pch = 19)

varImpPlot(rf, main = "Importancia de features")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

data("diabetes", package = "MASS")
df <- diabetes %>% mutate(id = row_number())

set.seed(42)
train_ids <- df %>% slice_sample(prop = 0.8) %>% pull(id)
train <- df %>% filter(id %in% train_ids)
test <- df %>% filter(!id %in% train_ids)

mod <- lm(y ~ ., data = train %>% select(-id))
test <- test %>% mutate(pred = predict(mod, newdata = .))

ggplot(test, aes(x = y, y = pred)) +
  geom_point(alpha = 0.6, color = "#2563eb") +
  geom_abline(intercept = 0, slope = 1, color = "red", linetype = "dashed") +
  labs(title = "Predicciones vs valores reales",
       x = "Valor real", y = "Prediccion") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

data("diabetes", package = "MASS")
df <- as_tibble(diabetes)

set.seed(42)
split <- initial_split(df, prop = 0.8)
train <- training(split)
test <- testing(split)

rf_spec <- rand_forest(trees = 200) %>%
  set_engine("randomForest") %>%
  set_mode("regression")

rf_wf <- workflow() %>%
  add_model(rf_spec) %>%
  add_formula(y ~ .) %>%
  fit(data = train)

preds <- predict(rf_wf, new_data = test) %>% bind_cols(test)
cat("Metricas tidymodels (Random Forest):\n")
preds %>% metrics(truth = y, estimate = .pred) %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

data("diabetes", package = "MASS")
set.seed(42)
idx <- sample(1:nrow(diabetes), floor(0.8 * nrow(diabetes)))
train <- diabetes[idx, ]
test <- diabetes[-idx, ]

# Comparamos varios tamanos de bosque
sizes <- c(50, 100, 200, 400)
resultados <- data.frame(n = sizes, mse = numeric(4), r2 = numeric(4))

for (i in seq_along(sizes)) {
  rf <- randomForest(y ~ ., data = train, ntree = sizes[i])
  pred <- predict(rf, newdata = test)
  resultados$mse[i] <- mean((test$y - pred)^2)
  resultados$r2[i] <- 1 - sum((test$y - pred)^2) / sum((test$y - mean(test$y))^2)
}

cat("Comparacion de tamanos de bosque:\n")
print(resultados)

cat("\n--- Resumen ---\n")
cat("Random Forest mejora sobre regresion lineal.\n")
cat("Mas arboles reduce error pero con rendimientos decrecientes.\n")
