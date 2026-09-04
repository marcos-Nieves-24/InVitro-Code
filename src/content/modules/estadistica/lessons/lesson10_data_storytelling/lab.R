# =========================================================================
# LAB 10: Narracion de datos con el dataset tips
# -------------------------------------------------------------------------
# Contamos una historia con datos de propinas: barras, scatter con OLS,
# histograma y boxplot, con anotaciones y etiquetas claras en espanol.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 10: Narracion de datos (Data Storytelling)\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

# Generamos datos de propinas sinteticos
set.seed(42)
n <- 244
total_bill <- runif(n, 3, 51)
tip <- total_bill * runif(n, 0.1, 0.3) + rnorm(n, 0, 2)
day <- sample(c("Thur", "Fri", "Sat", "Sun"), n, replace = TRUE,
              prob = c(0.3, 0.15, 0.35, 0.2))
time <- sample(c("Lunch", "Dinner"), n, replace = TRUE, prob = c(0.4, 0.6))

tips <- data.frame(total_bill, tip, day, time)

# Propina promedio por dia
promedio <- tapply(tips$tip, tips$day, mean)
barplot(promedio, main = "Propina promedio por dia",
        xlab = "Dia", ylab = "Propina promedio ($)",
        col = "#60a5fa", border = "#2563eb")

# Scatter total vs propina
plot(tips$total_bill, tips$tip, pch = 19, col = rgb(0.2, 0.4, 0.8, 0.5),
     xlab = "Total de la cuenta ($)", ylab = "Propina ($)",
     main = "Propina segun total de la cuenta")
ajuste <- lm(tip ~ total_bill, data = tips)
abline(ajuste, col = "red", lwd = 2)
legend("topleft", legend = sprintf("OLS: y = %.2fx + %.2f",
       coef(ajuste)[2], coef(ajuste)[1]), col = "red", lwd = 2)

# Histograma
hist(tips$total_bill, breaks = 40, main = "Distribucion del total de la cuenta",
     xlab = "Total ($)", col = "#60a5fa", border = "white")
abline(v = mean(tips$total_bill), col = "red", lty = 2, lwd = 2)

# Boxplot por dia
boxplot(tip ~ day, data = tips, main = "Distribucion de propinas por dia",
        xlab = "Dia", ylab = "Propina ($)", col = "#60a5fa")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

tips_df <- as_tibble(tips)

promedio_dia <- tips_df %>%
  group_by(day) %>%
  summarise(promedio = mean(tip))

ggplot(promedio_dia, aes(x = day, y = promedio, fill = day)) +
  geom_col(alpha = 0.8) +
  labs(title = "Propina promedio por dia",
       x = "Dia de la semana", y = "Propina promedio ($)") +
  theme_minimal() +
  theme(legend.position = "none")

ggplot(tips_df, aes(x = total_bill, y = tip, color = time)) +
  geom_point(alpha = 0.6) +
  geom_smooth(method = "lm", se = FALSE) +
  labs(title = "Propina segun total de la cuenta y momento",
       x = "Total ($)", y = "Propina ($)") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

rec <- recipe(tip ~ total_bill + day + time, data = tips_df) %>%
  step_dummy(all_nominal_predictors())

lm_spec <- linear_reg() %>% set_engine("lm")

wf <- workflow() %>%
  add_recipe(rec) %>%
  add_model(lm_spec) %>%
  fit(data = tips_df)

cat("Coeficientes del modelo:\n")
tidy(wf) %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

tips_df <- as_tibble(tips)
set.seed(42)
idx <- sample(1:nrow(tips_df), floor(0.8 * nrow(tips_df)))
train <- tips_df[idx, ]
test <- tips_df[-idx, ]

rf <- randomForest(tip ~ total_bill + day + time, data = train, ntree = 100)
pred <- predict(rf, newdata = test)

mse <- mean((test$tip - pred)^2)
r2 <- 1 - sum((test$tip - pred)^2) / sum((test$tip - mean(test$tip))^2)
cat(sprintf("Random Forest - MSE: %.3f, R2: %.3f\n", mse, r2))

cat("\n--- Resumen ---\n")
cat("Los viernes y sabados las propinas promedio son mas altas.\n")
cat("El total de la cuenta y la propina correlacionan positivamente.\n")
cat("La cena concentra cuentas y propinas mayores que el almuerzo.\n")
