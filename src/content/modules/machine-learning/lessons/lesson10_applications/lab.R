# =========================================================================
# LAB 10: Pipeline de extremo a extremo
# -------------------------------------------------------------------------
# Construimos un pipeline completo (escalado + modelo) sobre cancer de
# mama: entrenamiento, metricas, matriz de confusion y dashboard final.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 10: Pipeline de extremo a extremo\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

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

# Pipeline manual: escalado + logistic regression
medias <- colMeans(train[, 1:4])
sds <- apply(train[, 1:4], 2, sd)

train_scaled <- as.data.frame(scale(train[, 1:4], center = medias, scale = sds))
train_scaled$clase <- train$clase

test_scaled <- as.data.frame(scale(test[, 1:4], center = medias, scale = sds))
test_scaled$clase <- test$clase

modelo <- glm(clase ~ ., data = train_scaled, family = binomial)
pred_prob <- predict(modelo, newdata = test_scaled, type = "response")
pred_clase <- factor(ifelse(pred_prob > 0.5, "maligno", "benigno"), levels = c("benigno", "maligno"))

cat("PASO 1 - Pipeline manual entrenado\n")
tabla <- table(Real = test$clase, Predicho = pred_clase)
cat("Matriz de confusion:\n")
print(tabla)
exactitud <- sum(diag(tabla)) / sum(tabla)
cat(sprintf("Exactitud: %.3f\n", exactitud))

# Coeficientes
cat("\nPASO 2 - Coeficientes del modelo:\n")
print(sort(abs(coef(modelo)[-1]), decreasing = TRUE))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df %>%
  group_by(clase) %>%
  summarise(across(everything(), list(media = mean, sd = sd))) %>%
  print()

ggplot(df, aes(x = radio, y = area, color = clase)) +
  geom_point(alpha = 0.6) +
  labs(title = "Radio vs Area por clase") +
  theme_minimal() +
  scale_color_manual(values = c("benigno" = "#3b82f6", "maligno" = "#ef4444"))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

df_tm <- as_tibble(df)
split <- initial_split(df_tm, prop = 0.7)
train <- training(split)
test <- testing(split)

rec <- recipe(clase ~ ., data = train) %>%
  step_normalize(all_numeric_predictors())

log_spec <- logistic_reg() %>%
  set_engine("glm") %>%
  set_mode("classification")

wf <- workflow() %>%
  add_recipe(rec) %>%
  add_model(log_spec) %>%
  fit(data = train)

preds <- predict(wf, new_data = test) %>%
  bind_cols(test) %>%
  bind_cols(predict(wf, new_data = test, type = "prob"))

cat("Metricas tidymodels:\n")
preds %>% metrics(truth = clase, estimate = .pred_class) %>% print()
preds %>% conf_mat(truth = clase, estimate = .pred_class) %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

set.seed(42)
idx <- sample(1:nrow(df), floor(0.7 * nrow(df)))
train <- df[idx, ]
test <- df[-idx, ]

rf <- randomForest(clase ~ ., data = train, ntree = 100, importance = TRUE)
pred <- predict(rf, newdata = test)

cat("Random Forest - Matriz de confusion:\n")
print(table(Real = test$clase, Predicho = pred))
cat(sprintf("Exactitud: %.3f\n", sum(pred == test$clase) / nrow(test)))

# Dashboard final
par(mfrow = c(1, 3))

# Probabilidad predicha
prob_rf <- predict(rf, newdata = test, type = "prob")
hist(prob_rf[, 2], breaks = 25, main = "P(maligno)",
     xlab = "Probabilidad", col = "#60a5fa")

# Importancia
varImpPlot(rf, main = "Importancia", cex.main = 0.8)

# Scatter con prediccion
plot(test$radio, test$area, col = ifelse(pred == "benigno", "#3b82f6", "#ef4444"),
     pch = 19, xlab = "Radio", ylab = "Area", main = "Predicciones")
legend("topleft", legend = c("Benigno", "Maligno"),
       col = c("#3b82f6", "#ef4444"), pch = 19, cex = 0.8)

par(mfrow = c(1, 1))

cat("\n--- Resumen ---\n")
cat("Pipeline completo: escalado + modelo + evaluacion.\n")
cat("Random Forest logra alta exactitud con poco tuning.\n")
