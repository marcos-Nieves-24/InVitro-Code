# Assignment 10: Aplicaciones — Integración final

## Objetivos

- Construí una aplicación de ML completa de extremo a extremo
- Elegí modelos y métricas apropiados para el contexto de negocio
- Interpretá y comunicá los resultados
- Escribí un informe profesional de data science

## Escenario

**Elegí UNA de las siguientes dos opciones y completá todas las tareas.**

### Opción A: Biotecnología — Predicción de rendimiento de cultivo celular

Una empresa biotecnológica produce anticuerpos monoclonales. Tenés datos de proceso de 800 lotes. Predecí el **titer (g/L)** final e identificá qué parámetros de proceso afectan más al rendimiento.

```python
np.random.seed(42)
n = 800
biotech = pd.DataFrame({
    'temperature': np.random.normal(36.5, 1.5, n),
    'ph': np.random.normal(7.0, 0.2, n),
    'dissolved_o2': np.random.normal(50, 8, n),
    'seeding_density': np.random.normal(0.5, 0.1, n),
    'glutamine_mM': np.random.normal(4, 1, n),
    'culture_days': np.random.uniform(10, 16, n),
    'reactor_type': np.random.choice(['STR', 'WAVE', 'PERFUSION'], n),
})

titer = (
    2.5
    - 0.3 * np.abs(biotech['temperature'] - 36.5)
    - 2.0 * np.abs(biotech['ph'] - 7.0)
    + 0.5 * biotech['seeding_density']
    + 0.1 * biotech['glutamine_mM']
    + 0.05 * biotech['culture_days']
    + np.random.normal(0, 0.3, n)
)
biotech['titer'] = titer.clip(0)
```

### Opción B: SaaS — Customer Health Scoring

Una empresa SaaS quiere un **customer health score** (0-100) que prediga el riesgo de churn. Tenés datos de uso de 2000 cuentas.

```python
np.random.seed(42)
n = 2000
saas = pd.DataFrame({
    'active_users': np.random.poisson(50, n),
    'monthly_usage_hours': np.random.exponential(200, n),
    'support_tickets_30d': np.random.poisson(3, n),
    'feature_adoption_pct': np.random.uniform(0, 100, n),
    'days_since_last_login': np.random.exponential(10, n),
    'plan_tier': np.random.choice(['basic', 'pro', 'enterprise'], n, p=[0.5, 0.3, 0.2]),
    'integration_count': np.random.poisson(5, n),
})

health = (
    70
    + 0.2 * saas['active_users']
    + 0.05 * saas['monthly_usage_hours']
    - 2 * saas['support_tickets_30d']
    + 0.2 * saas['feature_adoption_pct']
    - 1.5 * saas['days_since_last_login']
    + np.random.normal(0, 5, n)
)
saas['health_score'] = health.clip(0, 100)
saas['churned_3m'] = (saas['health_score'] < 30).astype(int)
```

## Instrucciones (aplican a ambas opciones)

1. **EDA:** Explorá los datos (distribuciones, correlaciones, valores faltantes)
2. **Preprocesamiento:** Escalá las features numéricas, codificá las categóricas, dividí
3. **Modelado:** Compará al menos 3 modelos con validación cruzada
4. **Ajuste:** GridSearchCV para el mejor modelo
5. **Interpretación:** Importancia de características, PDP de las top features
6. **Recomendación de negocio:** Escribí un informe (máx. 500 palabras)

## Entregables

- Notebook con el análisis completo
- Tabla de comparación de modelos
- Gráfico de importancia de características
- PDP de las top 2 features
- Informe de negocio (máx. 500 palabras):
  - Hallazgos clave
  - Rendimiento del modelo y limitaciones
  - Recomendaciones accionables
  - Próximos pasos

## Rúbrica

| Criterio | Excelente (4) | Bueno (3) | Adecuado (2) | Deficiente (1) |
|----------|--------------|----------|-------------|----------------|
| EDA | Exhaustivo, con visualizaciones | Bueno | Básico | Faltante |
| Preprocesamiento | Scaling + encoding + split correctos | Completo | Parcial | Faltante |
| Comparación de modelos | 3+ modelos, CV, tabla comparativa | 2 modelos | 1 modelo | Faltante |
| Ajuste de hiperparámetros | GridSearchCV con justificación | GridSearch | Manual | Faltante |
| Interpretación | Importancia + PDP + insight | Un método | Básica | Faltante |
| Informe de negocio | Profesional, accionable | Claro | Básico | Faltante |
| Calidad del código | Limpio, reproducible | Legible | Desordenado | No corre |

## Tiempo estimado: 3 horas
