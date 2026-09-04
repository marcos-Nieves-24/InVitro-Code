# =========================================================================
# LAB 2: Regresion lineal simple y multiple
# -------------------------------------------------------------------------
# Ajustamos una regresion lineal sobre diabetes: primero con una sola
# feature y luego con dos. Interpretamos coeficientes e intercepto.
# =========================================================================
# ══════════════════════════════════════════════════════════════════
# DATOS: Cargamos dataset real de diabetes (MASS)
# ══════════════════════════════════════════════════════════════════
if (!requireNamespace("MASS", quietly = TRUE)) {
  install.packages("MASS", repos = "https://repo.r-wasm.org")
}
data("diabetes", package = "MASS")


cat("═══════════════════════════════════════════════════════════════\n")

cat("  LAB 2: Regresion lineal simple y multiple\n")
cat("═══════════════════════════════════════════════════════════════\n\n")



# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")
X <- diabetes[, 3]
y <- diabetes$y

set.seed(42)
idx <- sample(1:length(y), floor(0.8 * length(y)))
X_train <- X[idx]; X_test <- X[-idx]
y_train <- y[idx]; y_test <- y[-idx]

modelo1 <- lm(y_train ~ X_train)
cat("PASO 1 - Regresion simple\n")
cat(sprintf("Coeficiente: %.3f | Intercepto: %.2f\n",
            coef(modelo1)[2], coef(modelo1)[1]))

y_pred1 <- predict(modelo1, newdata = data.frame(X_test = X_test))
r2_simple <- 1 - sum((y_test - y_pred1)^2) / sum((y_test - mean(y_test))^2)
cat(sprintf("R2 prueba: %.3f\n", r2_simple))

plot(X_test, y_test, pch = 19, col = rgb(0.2, 0.4, 0.8, 0.6),
     xlab = "Colesterol (estandarizado)", ylab = "Progresion",
     main = "Regresion simple con recta OLS")
abline(modelo1, col = "red", lwd = 2)

X2 <- diabetes[, c(3, 6)]
X2_train <- X2[idx, ]; X2_test <- X2[-idx, ]
modelo2 <- lm(y_train ~ X2_train)
y_pred2 <- predict(modelo2, newdata = as.data.frame(X2_test))

mse_multi <- mean((y_test - y_pred2)^2)
r2_multi <- 1 - sum((y_test - y_pred2)^2) / sum((y_test - mean(y_test))^2)

cat("PASO 3 - Regresion multiple\n")
cat(sprintf("MSE prueba: %.2f | R2 prueba: %.3f\n", mse_multi, r2_multi))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df <- diabetes %>% mutate(id = row_number())

set.seed(42)
train_ids <- df %>% slice_sample(prop = 0.8) %>% pull(id)

train_s <- df %>% filter(id %in% train_ids)
test_s <- df %>% filter(!id %in% train_ids)

mod_simple <- lm(y ~ bmi, data = train_s)
test_s <- test_s %>% mutate(pred = predict(mod_simple, newdata = .))

ggplot(test_s, aes(x = bmi, y = y)) +
  geom_point(alpha = 0.6, color = "#2563eb") +
  geom_smooth(method = "lm", se = FALSE, color = "red") +
  labs(title = "Regresion simple: BMI vs Progresion",
       x = "BMI", y = "Progresion") +
  theme_minimal()

mod_multi <- lm(y ~ bmi + s5, data = train_s)
test_s <- test_s %>% mutate(pred_multi = predict(mod_multi, newdata = .))

metricas <- test_s %>%
  summarise(mse = mean((y - pred_multi)^2),
            r2 = 1 - sum((y - pred_multi)^2) / sum((y - mean(y))^2))
cat("Regresion multiple (Tidyverse):\n")
print(metricas)

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

rec_simple <- recipe(y ~ bmi, data = train)
lm_spec <- linear_reg() %>% set_engine("lm")

wf_simple <- workflow() %>%
  add_recipe(rec_simple) %>%
  add_model(lm_spec) %>%
  fit(data = train)

pred_simple <- predict(wf_simple, new_data = test) %>% bind_cols(test)
cat("Regresion simple (tidymodels):\n")
pred_simple %>% metrics(truth = y, estimate = .pred) %>% print()

rec_multi <- recipe(y ~ bmi + s5, data = train)
wf_multi <- workflow() %>%
  add_recipe(rec_multi) %>%
  add_model(lm_spec) %>%
  fit(data = train)

pred_multi <- predict(wf_multi, new_data = test) %>% bind_cols(test)
cat("\nRegresion multiple (tidymodels):\n")
pred_multi %>% metrics(truth = y, estimate = .pred) %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

df <- as.data.frame(diabetes)

set.seed(42)
n <- nrow(df)
idx <- sample(1:n, floor(0.8 * n))

rf_reg <- randomForest(y ~ ., data = df[idx, ], ntree = 100)
y_pred_rf <- predict(rf_reg, newdata = df[-idx, ])

mse_rf <- mean((df$y[-idx] - y_pred_rf)^2)
r2_rf <- 1 - sum((df$y[-idx] - y_pred_rf)^2) / sum((df$y[-idx] - mean(df$y[-idx]))^2)
cat(sprintf("Random Forest - MSE: %.2f, R2: %.3f\n", mse_rf, r2_rf))

cat("\n--- Resumen ---\n")
cat("Regresion simple vs multiple: mas features no siempre mejora.\n")
