# =========================================================================
# LAB 5: Bosque aleatorio
# -------------------------------------------------------------------------
# Comparamos un arbol individual contra un bosque aleatorio, analizamos la
# importancia de las features y evaluamos un escenario desbalanceado.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 5: Bosque aleatorio\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

library(rpart)
library(randomForest)

set.seed(42)
n <- 800
X1 <- rnorm(n)
X2 <- rnorm(n)
X3 <- rnorm(n)
X4 <- rnorm(n)
clase <- factor(ifelse(X1 + X2 + X3 > 0, "A", "B"))
df <- data.frame(X1, X2, X3, X4, clase)

idx <- sample(1:n, floor(0.75 * n))
train <- df[idx, ]
test <- df[-idx, ]

arbol <- rpart(clase ~ ., data = train, method = "class")
pred_arbol <- predict(arbol, newdata = test, type = "class")
acc_arbol <- sum(pred_arbol == test$clase) / nrow(test)

bosque <- randomForest(clase ~ ., data = train, ntree = 100)
pred_bosque <- predict(bosque, newdata = test)
acc_bosque <- sum(pred_bosque == test$clase) / nrow(test)

cat(sprintf("Arbol  - exactitud prueba: %.3f\n", acc_arbol))
cat(sprintf("Bosque - exactitud prueba: %.3f\n", acc_bosque))

# Importancia
varImpPlot(bosque, main = "Importancia de features (Random Forest)")

# Efecto del numero de arboles
n_arboles <- c(10, 50, 100, 200, 400)
scores <- numeric(length(n_arboles))
for (i in seq_along(n_arboles)) {
  rf <- randomForest(clase ~ ., data = train, ntree = n_arboles[i])
  pred <- predict(rf, newdata = test)
  scores[i] <- sum(pred == test$clase) / nrow(test)
}
plot(n_arboles, scores, type = "b", xlab = "n_estimators", ylab = "Exactitud prueba",
     main = "Exactitud segun numero de arboles", pch = 19)

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

set.seed(42)
df <- tibble(
  X1 = rnorm(800), X2 = rnorm(800), X3 = rnorm(800), X4 = rnorm(800),
  clase = factor(ifelse(X1 + X2 + X3 > 0, "A", "B"))
)

df %>%
  group_by(clase) %>%
  summarise(across(starts_with("X"), list(media = mean, sd = sd))) %>%
  print()

ggplot(df, aes(x = X1, y = X2, color = clase)) +
  geom_point(alpha = 0.5) +
  labs(title = "Distribucion de clases") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

set.seed(42)
df <- tibble(
  X1 = rnorm(800), X2 = rnorm(800), X3 = rnorm(800), X4 = rnorm(800),
  clase = factor(ifelse(X1 + X2 + X3 > 0, "A", "B"))
)

split <- initial_split(df, prop = 0.75)
train <- training(split)
test <- testing(split)

rf_spec <- rand_forest(trees = 100) %>%
  set_engine("randomForest") %>%
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

set.seed(42)
X_imb <- rbind(matrix(rnorm(950 * 4), ncol = 4),
               matrix(rnorm(50 * 4) + 2, ncol = 4))
y_imb <- factor(rep(c(0, 1), c(950, 50)))
df_imb <- data.frame(X_imb, clase = y_imb)

idx <- sample(1:nrow(df_imb), floor(0.75 * nrow(df_imb)))
rf_imb <- randomForest(clase ~ ., data = df_imb[idx, ], ntree = 100)
pred_imb <- predict(rf_imb, newdata = df_imb[-idx, ])

cat("Datos desbalanceados:\n")
cat(sprintf("Exactitud: %.3f\n",
            sum(pred_imb == df_imb$clase[-idx]) / sum(idx == FALSE)))
print(table(Real = df_imb$clase[-idx], Predicho = pred_imb))

cat("\n--- Resumen ---\n")
cat("El bosque promedia arboles y reduce sobreajuste.\n")
cat("En datos desbalanceados, la exactitud es enganosa: mirar F1/recall.\n")
