# =========================================================================
# LAB 1: Fundamentos de ML - Regresion lineal y diagnostico del ajuste
# -------------------------------------------------------------------------
# Cargamos el dataset de diabetes, dividimos en entrenamiento y prueba,
# entrenamos una regresion lineal de referencia y evaluamos MSE y R2.
# =========================================================================
# ══════════════════════════════════════════════════════════════════
# DATOS: Cargamos dataset real de diabetes (MASS)
# ══════════════════════════════════════════════════════════════════
if (!requireNamespace("MASS", quietly = TRUE)) {
  install.packages("MASS", repos = "https://repo.r-wasm.org")
}
data("diabetes", package = "MASS")


cat("═══════════════════════════════════════════════════════════════\n")

cat("  LAB 1: Fundamentos de ML\n")
cat("═══════════════════════════════════════════════════════════════\n\n")



# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R (sin paquetes externos)
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

X <- as.matrix(diabetes[, 1:10])
y <- diabetes$y

set.seed(42)
n <- nrow(X)
idx_train <- sample(1:n, size = floor(0.8 * n))
X_train <- X[idx_train, ]
X_test <- X[-idx_train, ]
y_train <- y[idx_train]
y_test <- y[-idx_train]

cat("PASO 1 - Entrenamiento:", nrow(X_train), "muestras,",
    "Prueba:", nrow(X_test), "muestras\n")

modelo <- lm(y_train ~ X_train)
y_pred <- predict(modelo, newdata = as.data.frame(X_test))

mse_test <- mean((y_test - y_pred)^2)
r2_train <- summary(modelo)$r.squared
r2_test <- 1 - sum((y_test - y_pred)^2) / sum((y_test - mean(y_test))^2)

cat("PASO 2 - Metricas del modelo\n")
cat(sprintf("MSE prueba: %.2f\n", mse_test))
cat(sprintf("R2 entrenamiento: %.3f | R2 prueba: %.3f\n", r2_train, r2_test))

plot(y_test, y_pred,
     xlab = "Valor real", ylab = "Prediccion",
     main = "Predicciones vs valores reales (diabetes)",
     pch = 19, col = rgb(0.2, 0.4, 0.8, 0.6))
abline(a = 0, b = 1, col = "red", lty = 2, lwd = 2)
cat("PASO 3 - Los puntos se agrupan alrededor de la diagonal.\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse (dplyr + ggplot2)
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df <- diabetes %>% mutate(id = row_number())

set.seed(42)
train_ids <- df %>% slice_sample(prop = 0.8) %>% pull(id)
train <- df %>% filter(id %in% train_ids)
test <- df %>% filter(!id %in% train_ids)

modelo_lm <- lm(y ~ age + sex + bmi + bp + s1 + s2 + s3 + s4 + s5 + s6,
                data = train)

test <- test %>%
  mutate(prediccion = predict(modelo_lm, newdata = .))

metricas <- test %>%
  summarise(
    mse = mean((y - prediccion)^2),
    r2 = 1 - sum((y - prediccion)^2) / sum((y - mean(y))^2)
  )
cat("Metricas Tidyverse:\n")
print(metricas)

ggplot(test, aes(x = y, y = prediccion)) +
  geom_point(alpha = 0.6, color = "#2563eb") +
  geom_abline(intercept = 0, slope = 1, color = "red", linetype = "dashed") +
  labs(title = "Predicciones vs valores reales",
       x = "Valor real", y = "Prediccion") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels (framework moderno de ML)
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

lm_spec <- linear_reg() %>%
  set_engine("lm") %>%
  set_mode("regression")

lm_wf <- workflow() %>%
  add_recipe(rec) %>%
  add_model(lm_spec) %>%
  fit(data = train)

predicciones <- predict(lm_wf, new_data = test) %>%
  bind_cols(test)

metricas_tm <- predicciones %>%
  metrics(truth = y, estimate = .pred)
cat("Metricas tidymodels:\n")
print(metricas_tm)

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados (randomForest)
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

df <- as.data.frame(diabetes)

set.seed(42)
n <- nrow(df)
idx <- sample(1:n, floor(0.8 * n))
train <- df[idx, ]
test <- df[-idx, ]

rf_model <- randomForest(y ~ ., data = train, ntree = 100, importance = TRUE)
y_pred_rf <- predict(rf_model, newdata = test)

mse_rf <- mean((test$y - y_pred_rf)^2)
r2_rf <- 1 - sum((test$y - y_pred_rf)^2) / sum((test$y - mean(test$y))^2)

cat(sprintf("Random Forest - MSE: %.2f, R2: %.3f\n", mse_rf, r2_rf))
varImpPlot(rf_model, main = "Importancia de variables (Random Forest)")

cat("\n--- Resumen ---\n")
cat("Compara los 4 escenarios: Base R, Tidyverse, tidymodels y Random Forest.\n")
