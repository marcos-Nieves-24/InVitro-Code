# =========================================================================
# LAB 4: Arboles de decision
# -------------------------------------------------------------------------
# Entrenamos un DecisionTreeClassifier sobre iris, imprimimos su estructura
# y analizamos la importancia de cada feature junto con el efecto de la
# profundidad.
# =========================================================================
# ══════════════════════════════════════════════════════════════════
# DATOS: Cargamos dataset real de iris (R base)
# ══════════════════════════════════════════════════════════════════
data("iris", package = "datasets")


cat("═══════════════════════════════════════════════════════════════\n")

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
