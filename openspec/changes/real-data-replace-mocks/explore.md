# SDD Explore: real-data-replace-mocks

## PROBLEMA

La plataforma InVitro-Code contiene mocks extensos que generan una experiencia falsa:
- **Dashboard**: "Proyecto Actual 68%", "Misión Actual +40 XP", "Logros Recientes" hardcodeados
- **Proyectos**: Métricas R²=0.782, MAE=0.42 inventadas, leaderboard falso, countdown fijo, botones no-op
- **Logros**: 100% mock, 6 categorías con logros fake, "38% Completado / 24 de 64"
- **Comunidad**: Investigadores fake, leaderboard inventado, "En línea: 1,248"
- **Laboratorios**: breadcrumb fijo "Nivel 1 · Novato · Misión 2"
- **Certify**: stub que SIEMPRE devuelve certified:true (E2B no integrado)
- **AppSidebar**: userName default "Investigador InVitro-Code" nunca se pasa el real

**Tablas Supabase que FALTAN**: achievements, notifications, model_metrics, leaderboard agregado, community_projects/feed.

---

## PREGUNTAS DE DISEÑO RESPONDIDAS

### 1. Certify real — E2B vs Pyodide server-side vs stub con flag

**Estado actual:**
- `src/app/api/certify/route.ts` es un stub que retorna `certified: true` siempre
- No hay SDK E2B instalado (`package.json` no contiene "e2b")
- No hay credenciales E2B en `.env.local.example`
- OutputPanel.tsx consume `/api/certify` y muestra "¡Certificado!" o "No pasaste"

**Opciones comparadas:**

| Opción | Pros | Cons | Esfuerzo |
|--------|------|------|----------|
| **A: E2B real** | Sandbox aislado, ejecución real de código Python, validación auténtica | Requiere cuenta E2B, SDK, credenciales, latencia de cold start (~2-5s), costo por sandbox | Alto |
| **B: Pyodide server-side (Node)** | Sin dependencia externa, ejecución en el mismo server, más rápido | Pyodide no está optimizado para server, requiere WASM en Node, complejidad de configuración | Medio |
| **C: Stub con flag + tests declarativos** | Simple, sin costo, funciona offline, permite testing de UI | No valida código real, usuario podría "certificarse" sin ejecutar nada | Bajo |

**Recomendación:** Combinación C + A gradual.
- **Fase 1 (este cambio)**: Mantener stub pero agregar `FEATURE_FLAG_CERTIFY=true/false` para controlar si certifica o no. Agregar tests declarativos del lab (validar output esperado en vez de ejecutar código).
- **Fase 2 (futuro)**: Integrar E2B real cuando el proyecto tenga traction y presupuesto.

**Justificación:** E2B es ideal pero agrega complejidad operativa innecesaria en MVP. El stub con flag permite que la UI funcione sin dar certificaciones falsas a usuarios reales (el flag puede estar en false en producción hasta que E2B esté listo).

---

### 2. Achievements — Modelo de datos y condiciones de desbloqueo

**Modelo propuesto para tabla `achievements`:**

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,          -- 'first-lesson', 'streak-7', 'xp-1000'
  title TEXT NOT NULL,                -- 'Primeros Pasos'
  description TEXT NOT NULL,          -- 'Completa tu primera lección'
  icon TEXT NOT NULL,                 -- 'GraduationCap' (lucide icon name)
  category TEXT NOT NULL,             -- 'novato', 'analista', 'investigador'
  xp_reward INTEGER DEFAULT 0,        -- 50 XP bonus al desbloquear
  condition_type TEXT NOT NULL,       -- 'lesson_complete', 'streak', 'xp_total', 'module_complete'
  condition_value INTEGER,            -- valor numérico para la condición
  unlocked_at TIMESTAMPTZ            -- NULL si no está desbloqueado
);
```

**Condiciones de desbloqueo realistas:**

| Condición | Tipo | Ejemplo |
|-----------|------|---------|
| Completar primera lección | `lesson_complete` | condition_value = 1 |
| Completar 10 lecciones | `lesson_complete` | condition_value = 10 |
| Streak de 7 días | `streak` | condition_value = 7 |
| Acumular 500 XP | `xp_total` | condition_value = 500 |
| Completar módulo entero | `module_complete` | condition_value = 5 (5 módulos) |

**Tabla de relación user-achievements:**

```sql
CREATE TABLE user_achievements (
  user_id TEXT NOT NULL,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);
```

**Seed:** Insertar 15-20 achievements iniciales via SQL migration.
**Endpoint:** GET `/api/achievements` retorna lista con estado del usuario.

---

### 3. Leaderboard — Ranking global real

**Fuente de datos real:**
```sql
SELECT 
  p.id,
  p.username,
  COALESCE(SUM(pr.xp_earned), 0) + COALESCE(SUM(rc.xp_earned), 0) as total_xp
FROM profiles p
LEFT JOIN progress pr ON p.id = pr.user_id
LEFT JOIN reflection_completions rc ON p.id = rc.user_id
GROUP BY p.id, p.username
ORDER BY total_xp DESC
LIMIT 50;
```

**Implementación:** 
- **Opción A (recomendada):** Vista materializada `leaderboard_view` que se actualiza con trigger o cron
- **Opción B:** Query en tiempo real en el endpoint (más simple pero menos performante)

**Endpoint:** GET `/api/leaderboard` retorna top 50 usuarios con XP total, nivel, y posición del usuario actual.

**Tradeoff:** Vista materializada es más performante pero requiere trigger de actualización. Para MVP con pocos usuarios (<100), query en tiempo real es suficiente.

---

### 4. Proyecto/Misión actual (dashboard)

**Datos reales disponibles hoy:**
- `progress` table → lecciones completadas por módulo
- `getModulesInfo()` → lista de módulos con total de lecciones
- `getResumeHref()` → href de la siguiente lección a completar
- `calcXpForLesson()` → XP que vale cada lección

**Lo que falta (mock):**
- "Proyecto Actual 68%" → podría calcularse como `(lecciones_completadas_modulo_actual / total_lecciones_modulo) * 100`
- "Misión Actual +40 XP" → `calcXpForLesson(currentModule, nextLesson)`
- "Logros Recientes" → requiere tabla `user_achievements`

**Implementación:** 
- Ya existe lógica parcial en dashboard/page.tsx (líneas 75-88)
- Extender para mostrar módulo actual con progreso real
- Agregar query para obtener última lección completada

---

### 5. Métricas de modelo (proyectos + laboratorios)

**Estado actual:** R²=0.782, MAE=0.42 hardcodeados en METRICS array.

**Opciones:**

| Opción | Pros | Cons |
|--------|------|------|
| **Ocultar métricas hasta E2B** | Sin datos falsos, honestidad | UX incompleta |
| **Derivar de último run** | Datos reales si existen | Requiere tabla model_metrics |
| **Mock con label "Demo"** | UX completa, transparente | Sigue siendo mock |

**Recomendación:** Ocultar métricas hasta que haya ejecución real. Mostrar "Ejecutá tu modelo para ver métricas" como placeholder. Esto es más honesto que mostrar datos falsos.

**Tabla `model_metrics` (para futuro):**
```sql
CREATE TABLE model_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  r2_score DECIMAL(5,3),
  mae DECIMAL(5,3),
  samples INTEGER,
  epochs_completed INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 6. Comunidad — Datos reales posibles hoy

**Datos reales disponibles:**
- `profiles` table → usernames
- `progress` + `reflection_completions` → XP total por usuario
- `streaks` → racha actual por usuario

**Lo que SÍ se puede hacer hoy:**
- Leaderboard real (ranking de usuarios por XP)
- "Investigadores activos" → usuarios con streak > 0
- Proyectos del usuario → módulos en progreso

**Lo que NO se puede hacer sin nuevas tablas:**
- "Featured Projects" como NeuralSync Engine (no existen proyectos colaborativos)
- Feed de actividad / posts
- Sistema de follow / suscripciones

**Recomendación:** MVP de comunidad con:
1. Leaderboard real (ya cubierto en punto 3)
2. "Investigadores activos" = top 10 usuarios con streak > 0
3. Quitar "Featured Projects" hasta que haya sistema de proyectos colaborativos
4. Quitar "Sincronizar Feed" (no-op)

---

### 7. Scope — Límite de corte del cambio

**FASE 1 (ESTE CAMBIO) — MVP real data:**
- ✅ Dashboard: reemplazar "Proyecto Actual 68%" y "Misión Actual +40 XP" con datos reales de progress
- ✅ AppSidebar: pasar userName real desde Clerk en todas las páginas
- ✅ Leaderboard: crear endpoint `/api/leaderboard` con ranking real
- ✅ Comunidad: mostrar leaderboard real + investigadores activos (streak > 0)
- ✅ Certify: agregar feature flag para controlar si certifica o no
- ✅ Logros: crear tabla `achievements` + `user_achievements` + endpoint básico
- ✅ Quitar todos los fallbacks "dev-user" — usar userId real o redirect a sign-in

**FASE 2 (FUTURO) — Enhancements:**
- ⏳ Integración E2B real para certify
- ⏳ Tabla `model_metrics` para métricas de modelo reales
- ⏳ Sistema de proyectos colaborativos para "Featured Projects"
- ⏳ Notificaciones reales (tabla `notifications`)
- ⏳ Feed de actividad / posts para comunidad

---

## RECOMENDACIÓN GENERAL

**Enfoque incremental:**
1. Primero: aprovechar tablas existentes (progress, streaks, reflection_completions, profiles) para llenar dashboard con datos reales
2. Segundo: crear tabla achievements + leaderboard endpoint
3. Tercero: feature flag para certify
4. Quitar TODO lo que sea mock sin dato real subyacente

**Prioridad: honestidad > completitud.** Es mejor mostrar "No hay datos disponibles" que datos falsos.

---

## RIESGOS

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Usuarios existentes sin datos reales (solo progreso falso de dev) | Alta | Seed de datos demo o migración de datos mock actuales |
| Leaderboard con 0 usuarios reales | Media | Agregar datos seed o mostrar "Sé el primero en aparecer" |
| Achievements que nunca se desbloquean sin contenido completo | Media | Seed de achievements fáciles (primera lección, primer login) |
| Certify stub sigue retornando true a pesar del flag | Baja | Documentar claramente el comportamiento del flag |
| Performance de leaderboard query con muchos usuarios | Baja | Vista materializada si >100 usuarios activos |

---

## FUENTES

- `src/app/api/certify/route.ts` — stub E2B (líneas 24-41)
- `src/components/editor/OutputPanel.tsx` — consumo de certify (líneas 30-62)
- `src/app/(dashboard)/dashboard/page.tsx` — mocks de proyecto/misión actual (líneas 220-299)
- `src/app/(dashboard)/proyectos/page.tsx` — METRICS hardcodeados (líneas 26-31), leaderboard fake (33-37)
- `src/app/(dashboard)/logros/page.tsx` — CATEGORIES 100% mock (líneas 20-80)
- `src/app/(dashboard)/comunidad/page.tsx` — FEATURED_PROJECTS/RESEARCHERS/LEADERBOARD fake (17-58)
- `src/components/layout/AppSidebar.tsx` — userName default (líneas 43-46)
- `src/lib/gamification/utils.ts` — calcXpForLesson, calcLevel (existentes)
- `supabase-migration.sql` — tablas actuales: profiles, progress, streaks, reflection_completions (1-118)
- `.env.local.example` — sin credenciales E2B (1-9)
- `package.json` — sin SDK E2B instalado