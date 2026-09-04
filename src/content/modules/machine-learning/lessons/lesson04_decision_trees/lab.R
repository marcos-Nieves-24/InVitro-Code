# =========================================================================
# LAB 4: Arboles de decision
# -------------------------------------------------------------------------
# Entrenamos un DecisionTreeClassifier sobre iris, imprimimos su estructura
# y analizamos la importancia de cada feature junto con el efecto de la
# profundidad.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 4: Arboles de decision\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

data("iris", package = "datasets")
set.seed(42)
n <- nrow(iris)
idx <- sample(1:n, floor(0.7 * n))
train <- iris[idx, ]
test <- iris[-idx, ]

# Usamos rpart (disponible en webR)
library(rpart)

arbol <- rpart(Species ~ ., data = train, method = "class",
               control = rpart.control(maxdepth = 3))
pred <- predict(arbol, newdata = test, type = "class")
exactitud <- sum(pred == test$Species) / nrow(test)
cat(sprintf("PASO 1 - Exactitud en prueba: %.3f\n", exactitud))

cat("PASO 2 - Estructura del arbol:\n")
print(arbol)

# Importancia de variables
importancias <- arbol$variable.importance
barplot(importancias, main = "Importancia de features",
        col = "#60a5fa", las = 2)

# Profundidad y sobreajuste
profundidades <- 1:10
acc_train <- numeric(10)
acc_test <- numeric(10)
for (p in profundidades) {
  arbol_p <- rpart(Species ~ ., data = train, method = "class",
                   control = rpart.control(maxdepth = p))
  acc_train[p] <- sum(predict(arbol_p, newdata = train, type = "class") == train$Species) / nrow(train)
  acc_test[p] <- sum(predict(arbol_p, newdata = test, type = "class") == test$Species) / nrow(test)
}
plot(profundidades, acc_test, type = "b", xlab = "Profundidad", ylab = "Exactitud",
     main = "Exactitud segun profundidad", ylim = c(0.5, 1), pch = 19)
lines(profundidades, acc_train, type = "b", col = "blue", pch = 17)
legend("bottomright", legend = c("Entrenamiento", "Prueba"),
       col = c("blue", "black"), pch = c(17, 19))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

data("iris", package = "datasets")
df <- as_tibble(iris)

df %>%
  group_by(Species) %>%
  summarise(across(where(is.numeric), list(media = mean, sd = sd))) %>%
  print()

ggplot(df, aes(x = Sepal.Length, y = Sepal.Width, color = Species)) +
  geom_point(alpha = 0.7) +
  labs(title = "Iris: Sepal Length vs Sepal Width",
       x = "Sepal Length", y = "Sepal Width") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

data("iris", package = "datasets")
df <- as_tibble(iris)

set.seed(42)
split <- initial_split(df, prop = 0.7)
train <- training(split)
test <- testing(split)

rec <- recipe(Species ~ ., data = train) %>%
  step_normalize(all_numeric_predictors())

dt_spec <- decision_tree(tree_depth = 3) %>%
  set_engine("rpart") %>%
  set_mode("classification")

dt_wf <- workflow() %>%
  add_recipe(rec) %>%
  add_model(dt_spec) %>%
  fit(data = train)

preds <- predict(dt_wf, new_data = test) %>% bind_cols(test)
cat("Metricas tidymodels:\n")
preds %>% metrics(truth = Species, estimate = .pred_class) %>% print()
preds %>% conf_mat(truth = Species, estimate = .pred_class) %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados (rpart + randomForest)
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(rpart)
library(randomForest)

data("iris", package = "datasets")
set.seed(42)
idx <- sample(1:nrow(iris), floor(0.7 * nrow(iris)))
train <- iris[idx, ]
test <- iris[-idx, ]

arbol <- rpart(Species ~ ., data = train, method = "class")
pred_arbol <- predict(arbol, newdata = test, type = "class")
cat("Arbol de decision - Exactitud:",
    sum(pred_arbol == test$Species) / nrow(test), "\n")

rf <- randomForest(Species ~ ., data = train, ntree = 100, importance = TRUE)
pred_rf <- predict(rf, newdata = test)
cat("Random Forest - Exactitud:",
    sum(pred_rf == test$Species) / nrow(test), "\n")
varImpPlot(rf, main = "Importancia de variables (Random Forest)")

cat("\n--- Resumen ---\n")
cat("Arboles interpretables pero propensos a sobreajuste.\n")
cat("Random Forest reduce la varianza promediando muchos arboles.\n")
