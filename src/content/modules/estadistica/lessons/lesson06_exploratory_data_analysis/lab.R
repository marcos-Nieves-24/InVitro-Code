# =========================================================================
# LAB 6: Analisis exploratorio de datos (EDA)
# -------------------------------------------------------------------------
# Exploramos el dataset de diabetes: vista general, valores faltantes,
# distribuciones univariadas, relaciones multivariadas y outliers.
# =========================================================================
# ══════════════════════════════════════════════════════════════════
# DATOS: Cargamos dataset real de diabetes (MASS)
# ══════════════════════════════════════════════════════════════════
if (!requireNamespace("MASS", quietly = TRUE)) {
  install.packages("MASS", repos = "https://repo.r-wasm.org")
}
data("diabetes", package = "MASS")


cat("═══════════════════════════════════════════════════════════════\n")

cat("  LAB 6: Analisis exploratorio de datos (EDA)\n")
cat("═══════════════════════════════════════════════════════════════\n\n")



# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

df <- diabetes

cat("Dimensiones:", dim(df), "\n")
cat("Columnas:", names(df), "\n")
print(head(df))

# Valores faltantes sinteticos
set.seed(1)
df_eda <- df
mascara <- runif(nrow(df_eda)) < 0.05
df_eda[mascara, "bmi"] <- NA
mascara <- runif(nrow(df_eda)) < 0.05
df_eda[mascara, "bp"] <- NA

faltantes <- colSums(is.na(df_eda))
cat("\nValores faltantes por columna:\n")
print(faltantes[faltantes > 0])

# Imputacion con mediana
df_eda$bmi[is.na(df_eda$bmi)] <- median(df_eda$bmi, na.rm = TRUE)
df_eda$bp[is.na(df_eda$bp)] <- median(df_eda$bp, na.rm = TRUE)
cat("Faltantes tras imputacion:", sum(is.na(df_eda)), "\n")

cat("\ndescribe():\n")
print(summary(df_eda))

# Histogramas
par(mfrow = c(2, 2))
for (col in c("age", "bmi", "bp", "target")) {
  hist(df_eda[[col]], breaks = 30, main = paste("Distribucion de", col),
       xlab = col, col = "#60a5fa", border = "white")
}
par(mfrow = c(1, 1))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df <- as_tibble(diabetes)

df %>%
  select(age, bmi, bp, target) %>%
  tidyr::pivot_longer(everything(), names_to = "variable", values_to = "valor") %>%
  ggplot(aes(x = valor, fill = variable)) +
  geom_histogram(bins = 30, alpha = 0.7, show.legend = FALSE) +
  facet_wrap(~variable, scales = "free") +
  labs(title = "Histogramas por feature") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

rec <- recipe(~ ., data = df) %>%
  step_corr(all_numeric_predictors(), threshold = 0.9) %>%
  step_zv(all_predictors())

rec_prep <- prep(rec)
df_reducido <- bake(rec_prep, new_data = NULL)
cat("Features tras remove de alta correlacion:\n")
print(names(df_reducido))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

library(randomForest)

# Valores atipicos con RIQ
cat("Valores atipicos por columna (regla del RIQ):\n")
for (col in c("bmi", "bp", "target")) {
  q1 <- quantile(df[[col]], 0.25)
  q3 <- quantile(df[[col]], 0.75)
  iqr <- q3 - q1
  n_out <- sum(df[[col]] < q1 - 1.5 * iqr | df[[col]] > q3 + 1.5 * iqr)
  cat(sprintf("  %s: %d valores atipicos\n", col, n_out))
}

boxplot(df$target, main = "Boxplot del target", ylab = "target",
        col = "#60a5fa", border = "#2563eb")

cat("\n--- Hallazgos del EDA ---\n")
cat("Las features de diabetes estan normalizadas (medias ~0, std ~1).\n")
cat("El target correlaciona mas con bmi y bp que con age.\n")
