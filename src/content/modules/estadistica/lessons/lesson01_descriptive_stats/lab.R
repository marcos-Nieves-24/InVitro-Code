# =========================================================================
# LAB 1: Estadistica descriptiva con el dataset de diabetes
# -------------------------------------------------------------------------
# Calculamos medidas de tendencia central y dispersion, detectamos valores
# atipicos con la regla del RIQ y construimos una funcion summarize().
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 1: Estadistica descriptiva\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

data("diabetes", package = "MASS")
df <- diabetes

cat("Resumen descriptivo:\n")
print(summary(df))

cat("\nVarianza:\n")
print(apply(df, 2, var))

cat("\nDesvio estandar:\n")
print(apply(df, 2, sd))

# Deteccion de valores atipicos con RIQ
col <- "bmi"
q1 <- quantile(df[, col], 0.25)
q3 <- quantile(df[, col], 0.75)
iqr <- q3 - q1
lim_inf <- q1 - 1.5 * iqr
lim_sup <- q3 + 1.5 * iqr
atipicos <- sum(df[, col] < lim_inf | df[, col] > lim_sup)

cat(sprintf("\nQ1=%.3f, Q3=%.3f, RIQ=%.3f\n", q1, q3, iqr))
cat(sprintf("Valores atipicos en bmi: %d\n", atipicos))

boxplot(df[, col], main = "Boxplot del BMI", ylab = "BMI",
        col = "#60a5fa", border = "#2563eb")

hist(df[, col], breaks = 30, main = "Distribucion del BMI",
     xlab = "BMI", col = "#60a5fa", border = "white")
abline(v = mean(df[, col]), col = "red", lty = 2, lwd = 2)
abline(v = median(df[, col]), col = "green3", lty = 3, lwd = 2)
legend("topright", legend = c("Media", "Mediana"),
       col = c("red", "green3"), lty = 2:3, lwd = 2)

# Funcion summarize
summarize_r <- function(df) {
  registros <- list()
  for (c in names(df)[sapply(df, is.numeric)]) {
    q1 <- quantile(df[[c]], 0.25)
    q3 <- quantile(df[[c]], 0.75)
    iqr <- q3 - q1
    registros[[c]] <- data.frame(
      columna = c, media = mean(df[[c]]), mediana = median(df[[c]]),
      std = sd(df[[c]]), min = min(df[[c]]), max = max(df[[c]]),
      q1 = q1, q3 = q3, riq = iqr,
      atipicos = sum(df[[c]] < q1 - 1.5 * iqr | df[[c]] > q3 + 1.5 * iqr)
    )
  }
  do.call(rbind, registros)
}

cat("\nInforme resumido por columna:\n")
print(summarize_r(df))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

data("diabetes", package = "MASS")
df <- as_tibble(diabetes)

resumen <- df %>%
  summarise(across(everything(), list(
    media = ~mean(.), mediana = ~median(.), std = ~sd(.),
    min = ~min(.), max = ~max(.)
  )))
cat("Resumen Tidyverse:\n")
print(resumen)

df %>%
  ggplot(aes(y = bmi)) +
  geom_boxplot(fill = "#60a5fa", alpha = 0.7) +
  labs(title = "Boxplot del BMI", y = "BMI") +
  theme_minimal()

df %>%
  ggplot(aes(x = bmi)) +
  geom_histogram(bins = 30, fill = "#60a5fa", alpha = 0.7, color = "white") +
  geom_vline(aes(xintercept = mean(bmi)), color = "red", linetype = "dashed") +
  geom_vline(aes(xintercept = median(bmi)), color = "green3", linetype = "dotted") +
  labs(title = "Distribucion del BMI", x = "BMI", y = "Frecuencia") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

data("diabetes", package = "MASS")
df <- as_tibble(diabetes)

rec <- recipe(~ ., data = df) %>%
  step_center(all_numeric()) %>%
  step_scale(all_numeric())

rec_prep <- prep(rec)
df_scaled <- bake(rec_prep, new_data = NULL)
cat("Datos estandarizados (primeras filas):\n")
print(head(df_scaled))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

data("diabetes", package = "MASS")
df <- as.data.frame(diabetes)

rf <- randomForest(y ~ ., data = df, ntree = 100, importance = TRUE)
cat("Importancia de variables (Random Forest):\n")
print(importance(rf))
varImpPlot(rf, main = "Importancia de variables")

cat("\n--- Resumen ---\n")
cat("La regla del RIQ detecta valores atipicos por columna.\n")
cat("El boxplot y el histograma muestran forma y dispersion de los datos.\n")
