# =========================================================================
# LAB 2: Distribucion de datos
# -------------------------------------------------------------------------
# Analizamos distribuciones sinteticas (normal, sesgada y bimodal) y
# columnas reales de diabetes con histogramas, boxplots y estadisticos
# de forma (skewness y curtosis).
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 2: Distribucion de datos\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

set.seed(42)
normal <- rnorm(2000, mean = 100, sd = 15)
sesgada <- rexp(2000, rate = 0.1)
bimodal <- c(rnorm(1000, 40, 8), rnorm(1000, 90, 8))

cat("Muestras generadas:", length(normal), length(sesgada), length(bimodal), "\n")

# Histogramas
par(mfrow = c(1, 3))
hist(normal, breaks = 40, main = "Distribucion Normal", col = "#60a5fa")
hist(sesgada, breaks = 40, main = "Distribucion Sesgada", col = "#f59e0b")
hist(bimodal, breaks = 40, main = "Distribucion Bimodal", col = "#10b981")
par(mfrow = c(1, 1))

# Boxplots comparativos
boxplot(list(Normal = normal, Sesgada = sesgada, Bimodal = bimodal),
        main = "Comparacion de distribuciones", col = c("#60a5fa", "#f59e0b", "#10b981"))

# Estadisticos de forma (skewness y kurtosis manual)
skewness_manual <- function(x) {
  n <- length(x)
  m <- mean(x)
  s <- sd(x)
  (1/n) * sum(((x - m) / s)^3)
}

kurtosis_manual <- function(x) {
  n <- length(x)
  m <- mean(x)
  s <- sd(x)
  (1/n) * sum(((x - m) / s)^4) - 3
}

for (nombre in c("Normal", "Sesgada", "Bimodal")) {
  datos <- get(tolower(nombre))
  cat(sprintf("%s: skew=%.3f, kurtosis=%.3f\n",
              nombre, skewness_manual(datos), kurtosis_manual(datos)))
}

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df <- tibble(
  valor = c(normal, sesgada, bimodal),
  distribucion = rep(c("Normal", "Sesgada", "Bimodal"), each = 2000)
)

ggplot(df, aes(x = valor, fill = distribucion)) +
  geom_histogram(bins = 40, alpha = 0.7, position = "identity") +
  facet_wrap(~distribucion, scales = "free") +
  labs(title = "Histogramas de las tres distribuciones",
       x = "Valor", y = "Frecuencia") +
  theme_minimal() +
  scale_fill_manual(values = c("Normal" = "#60a5fa", "Sesgada" = "#f59e0b", "Bimodal" = "#10b981"))

ggplot(df, aes(x = distribucion, y = valor, fill = distribucion)) +
  geom_boxplot(alpha = 0.7) +
  labs(title = "Boxplots comparativos") +
  theme_minimal() +
  scale_fill_manual(values = c("Normal" = "#60a5fa", "Sesgada" = "#f59e0b", "Bimodal" = "#10b981"))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

df_resume <- tibble(
  distribucion = c("Normal", "Sesgada", "Bimodal"),
  media = c(mean(normal), mean(sesgada), mean(bimodal)),
  mediana = c(median(normal), median(sesgada), median(bimodal)),
  std = c(sd(normal), sd(sesgada), sd(bimodal)),
  skewness = c(skewness_manual(normal), skewness_manual(sesgada), skewness_manual(bimodal))
)
cat("Resumen de distribuciones:\n")
print(df_resume)

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

data("diabetes", package = "MASS")

for (col in c("bmi", "bp")) {
  valores <- diabetes[[col]]
  cat(sprintf("\nColumna %s: skew=%.3f, kurtosis=%.3f\n",
              col, skewness_manual(valores), kurtosis_manual(valores)))
}

# Transformacion logaritmica
log_sesgada <- log1p(sesgada)
cat(sprintf("\nSesgo antes: %.3f -> despues de log1p: %.3f\n",
            skewness_manual(sesgada), skewness_manual(log_sesgada)))

par(mfrow = c(1, 2))
hist(sesgada, breaks = 40, main = "Sesgada original", col = "#f59e0b")
hist(log_sesgada, breaks = 40, main = "Sesgada tras log1p", col = "#10b981")
par(mfrow = c(1, 1))

cat("\n--- Resumen ---\n")
cat("El histograma y el boxplot revelan la forma de la distribucion.\n")
cat("skew y kurtosis cuantifican la asimetria; log1p reduce el sesgo positivo.\n")
