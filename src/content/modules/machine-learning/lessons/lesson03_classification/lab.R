# =========================================================================
# LAB 3: Clasificacion con regresion logistica
# -------------------------------------------------------------------------
# Entrenamos una regresion logistica sobre datos sinteticos, visualizamos
# el limite de decision, evaluamos con matriz de confusion y curva ROC.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 3: Clasificacion con regresion logistica\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

set.seed(42)
n <- 300
x1 <- rnorm(n, mean = c(rep(-1, 150), rep(1, 150)))
x2 <- rnorm(n, mean = c(rep(-1, 150), rep(1, 150)))
y <- rep(0:1, each = 150)
datos <- data.frame(x1 = x1, x2 = x2, clase = factor(y))

modelo <- glm(clase ~ x1 + x2, data = datos, family = binomial)
cat("PASO 1 - Regresion logistica entrenada\n")

grid <- expand.grid(x1 = seq(min(x1) - 1, max(x1) + 1, length.out = 100),
                    x2 = seq(min(x2) - 1, max(x2) + 1, length.out = 100))
grid$prob <- predict(modelo, newdata = grid, type = "response")

plot(grid$x1, grid$x2, col = ifelse(grid$prob > 0.5, "#ef4444", "#3b82f6"),
     pch = 20, cex = 0.5, xlab = "Feature 1", ylab = "Feature 2",
     main = "Limite de decision")
points(x1, x2, col = ifelse(y == 0, "#3b82f6", "#ef4444"), pch = 19, cex = 1.2)

pred_clase <- ifelse(predict(modelo, type = "response") > 0.5, 1, 0)
tabla <- table(Real = y, Predicho = pred_clase)
cat("Matriz de confusion:\n")
print(tabla)
cat(sprintf("Exactitud: %.3f\n", sum(diag(tabla)) / sum(tabla)))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

set.seed(42)
df_cancer <- tibble(
  radio = c(rnorm(250, 15, 3), rnorm(250, 25, 5)),
  textura = c(rnorm(250, 20, 3), rnorm(250, 25, 4)),
  clase = factor(rep(c("benigno", "maligno"), each = 250))
)

ggplot(df_cancer, aes(x = radio, y = textura, color = clase)) +
  geom_point(alpha = 0.6) +
  labs(title = "Distribucion de clases",
       x = "Radio medio", y = "Textura media") +
  theme_minimal() +
  scale_color_manual(values = c("benigno" = "#3b82f6", "maligno" = "#ef4444"))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

set.seed(42)
df <- tibble(
  radio = c(rnorm(250, 15, 3), rnorm(250, 25, 5)),
  textura = c(rnorm(250, 20, 3), rnorm(250, 25, 4)),
  clase = factor(rep(c("benigno", "maligno"), each = 250))
)

split <- initial_split(df, prop = 0.75)
train <- training(split)
test <- testing(split)

rec <- recipe(clase ~ ., data = train) %>%
  step_normalize(all_numeric_predictors())

log_spec <- logistic_reg() %>%
  set_engine("glm") %>%
  set_mode("classification")

log_wf <- workflow() %>%
  add_recipe(rec) %>%
  add_model(log_spec) %>%
  fit(data = train)

preds <- predict(log_wf, new_data = test) %>%
  bind_cols(test) %>%
  bind_cols(predict(log_wf, new_data = test, type = "prob"))

cat("Metricas tidymodels:\n")
preds %>% metrics(truth = clase, estimate = .pred_class) %>% print()
preds %>% conf_mat(truth = clase, estimate = .pred_class) %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados (rpart + e1071)
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(rpart)
library(e1071)

set.seed(42)
df <- data.frame(
  radio = c(rnorm(250, 15, 3), rnorm(250, 25, 5)),
  textura = c(rnorm(250, 20, 3), rnorm(250, 25, 4)),
  clase = factor(rep(c("benigno", "maligno"), each = 250))
)

idx <- sample(1:nrow(df), floor(0.75 * nrow(df)))
train <- df[idx, ]
test <- df[-idx, ]

arbol <- rpart(clase ~ ., data = train, method = "class")
pred_arbol <- predict(arbol, newdata = test, type = "class")
cat("Arbol de decision - Matriz de confusion:\n")
print(table(Real = test$clase, Predicho = pred_arbol))

svm_model <- svm(clase ~ ., data = train, kernel = "radial")
pred_svm <- predict(svm_model, newdata = test)
cat("\nSVM - Matriz de confusion:\n")
print(table(Real = test$clase, Predicho = pred_svm))

cat("\n--- Resumen ---\n")
cat("Regresion logistica, arbol de decision y SVM resuelven clasificacion.\n")
