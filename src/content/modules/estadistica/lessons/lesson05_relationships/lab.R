# =========================================================================
# LAB 5: Relaciones entre variables
# -------------------------------------------------------------------------
# Calculamos covarianza y correlaciones de Pearson y Spearman, aplicamos
# una regresion OLS manual y analizamos el cuarteto de Anscombe.
# =========================================================================
# ══════════════════════════════════════════════════════════════════
# DATOS: Cargamos dataset real de diabetes (MASS)
# ══════════════════════════════════════════════════════════════════
if (!requireNamespace("MASS", quietly = TRUE)) {
  install.packages("MASS", repos = "https://repo.r-wasm.org")
}
data("diabetes", package = "MASS")


cat("═══════════════════════════════════════════════════════════════\n")

cat("  LAB 5: Relaciones entre variables\n")
cat("═══════════════════════════════════════════════════════════════\n\n")



# ══════════════════════════════════════════════════════════════════
# ESCENARIO 1: Base R
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 1: Base R ─────────────────────────────────────\n")

# Cuarteto de Anscombe
x_ans <- c(10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5)
anscombe <- list(
  c(8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68),
  c(9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74),
  c(7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73),
  c(6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89)
)

cat("Correlaciones de Pearson para cada grupo:\n")
for (i in 1:4) {
  r <- cor(x_ans, anscombe[[i]])
  cat(sprintf("Grupo %d: r = %.3f\n", i, r))
}

# Scatter de cada grupo con OLS
par(mfrow = c(2, 2))
for (i in 1:4) {
  ajuste <- lm(anscombe[[i]] ~ x_ans)
  plot(x_ans, anscombe[[i]], pch = 19, col = rgb(0.2, 0.4, 0.8, 0.7),
       xlab = "x", ylab = "y",
       main = sprintf("Grupo %d: y = %.2fx + %.2f",
                       i, coef(ajuste)[2], coef(ajuste)[1]))
  abline(ajuste, col = "red", lwd = 2)
}
par(mfrow = c(1, 1))

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 2: Tidyverse
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 2: Tidyverse ──────────────────────────────────\n")

library(dplyr)
library(ggplot2)

df_ans <- tibble(
  x = rep(x_ans, 4),
  y = unlist(anscombe),
  grupo = factor(rep(1:4, each = 11))
)

ggplot(df_ans, aes(x = x, y = y)) +
  geom_point(size = 2, alpha = 0.7) +
  geom_smooth(method = "lm", se = FALSE, color = "red") +
  facet_wrap(~grupo, scales = "free") +
  labs(title = "Cuarteto de Anscombe con recta OLS") +
  theme_minimal()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 3: tidymodels
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 3: tidymodels ─────────────────────────────────\n")

library(tidymodels)

dfd <- as_tibble(diabetes)

cat("Covarianza bmi-target:\n")
dfd %>% select(bmi, target) %>% cov() %>% print()

# ══════════════════════════════════════════════════════════════════
# ESCENARIO 4: Paquetes especializados
# ══════════════════════════════════════════════════════════════════
cat("\n── Escenario 4: Paquetes especializados ────────────────────\n")


cat("Pearson y Spearman para pares seleccionados:\n")
for (a in c("age", "bmi", "bp")) {
  r_p <- cor(dfd[[a]], dfd$target, method = "pearson")
  r_s <- cor(dfd[[a]], dfd$target, method = "spearman")
  cat(sprintf("  %s-target: Pearson=%.3f, Spearman=%.3f\n", a, r_p, r_s))
}

# Heatmap de correlacion
corr <- cor(dfd[, sapply(dfd, is.numeric)])
image(corr, main = "Matriz de correlacion de Pearson",
      col = hcl.colors(20, "RdBu"), axes = FALSE)
axis(1, at = 0:(ncol(corr)-1)/(ncol(corr)-1), labels = colnames(corr), las = 2, cex.axis = 0.7)
axis(2, at = 0:(ncol(corr)-1)/(ncol(corr)-1), labels = colnames(corr), cex.axis = 0.7)

cat("\n--- Resumen ---\n")
cat("Las 4 series de Anscombe tienen casi el mismo r, pero son muy distintas.\n")
cat("Pearson mide linealidad; Spearman mide monotonia; correlacion no es causalidad.\n")
