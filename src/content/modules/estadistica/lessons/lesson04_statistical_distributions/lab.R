# =========================================================================
# LAB 4: Distribuciones estadisticas
# -------------------------------------------------------------------------
# Trabajamos con distribuciones norm, t, chi2, expon y binomial:
# calculamos probabilidades, graficamos pdf/pmf teoricas y las comparamos
# con muestras empiricas.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 4: Distribuciones estadisticas\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

# Binomial
p_binom <- dbinom(20, size = 30, prob = 0.7)
cat(sprintf("P(exactamente 20 de 30) = %.4f\n", p_binom))

# Poisson
p_pois <- dpois(3, lambda = 5)
cat(sprintf("P(exactamente 3 muestras) = %.4f\n", p_pois))

# Normal
p_norm <- pnorm(140, mean = 100, sd = 15, lower.tail = FALSE)
cat(sprintf("P(glucosa > 140) = %.4f\n", p_norm))

# PDF normal estandar
x <- seq(-4, 4, length.out = 200)
plot(x, dnorm(x), type = "l", xlab = "x", ylab = "Densidad",
     main = "PDF de la distribucion normal estandar", lwd = 2, col = "#2563eb")

# Normal vs t de Student
plot(x, dnorm(x), type = "l", xlab = "x", ylab = "Densidad",
     main = "Normal estandar vs t de Student", lwd = 2, col = "#2563eb")
lines(x, dt(x, df = 4), col = "#ef4444", lwd = 2)
legend("topright", legend = c("Normal", "t(4)"), col = c("#2563eb", "#ef4444"), lwd = 2)

# Chi2
x2 <- seq(0, 20, length.out = 200)
plot(x2, dchisq(x2, df = 4), type = "l", xlab = "x", ylab = "Densidad",
     main = "PDF de la chi2 con 4 gl", lwd = 2, col = "#2563eb")

# Exponencial
muestras <- rexp(5000, rate = 0.5)
hist(muestras, breaks = 50, probability = TRUE,
     main = "Muestras exponenciales (rate=0.5)", col = "#60a5fa", border = "white")
curve(dexp(x, rate = 0.5), add = TRUE, col = "red", lwd = 2)

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df_norm <- tibble(x = x, densidad = dnorm(x), tipo = "Normal")
df_t <- tibble(x = x, densidad = dt(x, df = 4), tipo = "t(4)")

bind_rows(df_norm, df_t) %>%
  ggplot(aes(x = x, y = densidad, color = tipo)) +
  geom_line(linewidth = 1) +
  labs(title = "Densidades: Normal estandar vs t de Student",
       x = "x", y = "Densidad") +
  theme_minimal() +
  scale_color_manual(values = c("Normal" = "#2563eb", "t(4)" = "#ef4444"))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

# Cuantiles utiles
cat(sprintf("Cuantil 0.975 de la normal: %.3f\n", qnorm(0.975)))
cat(sprintf("Cuantil 0.975 de t(4): %.3f\n", qt(0.975, df = 4)))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

# Teorema central del limite
set.seed(42)
medias <- replicate(1000, mean(rexp(1000, rate = 0.5)))
cat(sprintf("\nMedia de las medias muestrales: %.3f (esperado 2.0)\n", mean(medias)))
hist(medias, breaks = 40, main = "Medias muestrales (TCL)",
     xlab = "Media", col = "#60a5fa", border = "white")

# PMF binomial teorica vs empirica
n <- 30; p <- 0.7
k <- 0:n
empirica <- table(rbinom(50000, size = n, prob = p)) / 50000

df_binom <- tibble(
  k = k,
  teorica = dbinom(k, size = n, prob = p),
  empirica = as.numeric(empirica[as.character(k)])
)

library(ggplot2)
ggplot(df_binom) +
  geom_col(aes(x = k, y = teorica, fill = "Teorica"), alpha = 0.7) +
  geom_point(aes(x = k, y = empirica, color = "Empirica"), size = 2) +
  geom_line(aes(x = k, y = empirica, color = "Empirica")) +
  labs(title = "PMF binomial: teorica vs empirica",
       x = "k", y = "Probabilidad") +
  theme_minimal()

cat("\n--- Resumen ---\n")
cat("Las distribuciones teoricas se verifican con muestras empiricas.\n")
cat("El TCL muestra que las medias muestrales se distribuyen normalmente.\n")
