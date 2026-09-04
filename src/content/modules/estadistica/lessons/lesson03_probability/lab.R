# =========================================================================
# LAB 3: Fundamentos de probabilidad
# -------------------------------------------------------------------------
# Simulamos monedas, dados, el problema de Monty Hall y la ley de los
# grandes numeros; verificamos Bayes y la binomial.
# =========================================================================

cat("═══════════════════════════════════════════════════════════════\n")
cat("  LAB 3: Fundamentos de probabilidad\n")
cat("═══════════════════════════════════════════════════════════════\n\n")

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

set.seed(7)
n <- 100000
monedas <- sample(c("cara", "cruz"), size = n, replace = TRUE, prob = c(0.5, 0.5))
freq_cara <- mean(monedas == "cara")
cat(sprintf("Frecuencia de cara en %d lanzamientos: %.4f (esperado 0.5)\n", n, freq_cara))

# Ley de los grandes numeros
acumulado <- cumsum(monedas == "cara") / 1:n
plot(1:n, acumulado, type = "l", xlab = "Lanzamientos", ylab = "Frecuencia acumulada",
     main = "Ley de los grandes numeros", col = "#2563eb", lwd = 2)
abline(h = 0.5, col = "red", lty = 2, lwd = 2)

# Suma de dos dados
sumas <- 2:12
pmf_teorica <- pmin(sumas - 1, 13 - sumas) / 36

d1 <- sample(1:6, 50000, replace = TRUE)
d2 <- sample(1:6, 50000, replace = TRUE)
suma_obs <- d1 + d2
freq_obs <- table(suma_obs) / 50000

cat(sprintf("\nE[X] empirica: %.3f (teorica: 7)\n", mean(suma_obs)))
cat(sprintf("Var(X) empirica: %.3f (teorica: %.3f)\n", var(suma_obs), 35/6))

barplot(rbind(pmf_teorica, as.numeric(freq_obs[as.character(sumas)])),
        names.arg = sumas, beside = TRUE, legend = c("Teorica", "Empirica"),
        col = c("#2563eb", "#f59e0b"),
        main = "PMF teorica vs empirica de la suma de dos dados")

# Monty Hall
jugar_monty <- function(cambiar, n_sim = 20000) {
  ganadas <- 0
  for (i in 1:n_sim) {
    premio <- sample(0:2, 1)
    eleccion <- sample(0:2, 1)
    puertas <- 0:2
    abierta <- setdiff(puertas, c(premio, eleccion))[1]
    if (cambiar) {
      final <- setdiff(puertas, c(eleccion, abierta))[1]
    } else {
      final <- eleccion
    }
    ganadas <- ganadas + (final == premio)
  }
  ganadas / n_sim
}

cat(sprintf("\nMonty Hall sin cambiar:  %.4f\n", jugar_monty(FALSE)))
cat(sprintf("Monty Hall cambiando:    %.4f\n", jugar_monty(TRUE)))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df_dados <- tibble(
  suma = sumas,
  teorica = pmf_teorica,
  empirica = as.numeric(freq_obs[as.character(sumas)])
)

ggplot(df_dados) +
  geom_col(aes(x = suma, y = teorica, fill = "Teorica"), alpha = 0.7) +
  geom_point(aes(x = suma, y = empirica, color = "Empirica"), size = 3) +
  geom_line(aes(x = suma, y = empirica, color = "Empirica"), linewidth = 1) +
  labs(title = "PMF teorica vs empirica de la suma de dos dados",
       x = "Suma", y = "Probabilidad") +
  theme_minimal() +
  scale_fill_manual(values = c("Teorica" = "#2563eb")) +
  scale_color_manual(values = c("Empirica" = "#f59e0b"))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

# Teorema de Bayes verificado por simulacion
set.seed(42)
n <- 100000
prevalencia <- 0.03
sensibilidad <- 0.92
especificidad <- 0.88

enfermos <- runif(n) < prevalencia
positivo <- ifelse(enfermos,
                   runif(n) < sensibilidad,
                   runif(n) < (1 - especificidad))

cat(sprintf("P(positivo) = %.4f\n", mean(positivo)))
cat(sprintf("P(enfermedad | positivo) = %.4f\n", mean(enfermos[positivo])))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")

# Distribucion binomial
exitos <- rbinom(100000, size = 30, prob = 0.7)
cat(sprintf("\nP(X=20) empirica: %.4f\n", mean(exitos == 20)))
hist(exitos, breaks = 31, main = "Distribucion binomial(n=30, p=0.7)",
     xlab = "Exitos", col = "#60a5fa", border = "white")

cat("\n--- Resumen ---\n")
cat("La simulacion verifica las probabilidades teoricas (LLN, dados, Bayes).\n")
cat("En Monty Hall conviene cambiar de puerta: gana en 2/3 de las veces.\n")
