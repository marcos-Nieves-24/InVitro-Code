# Triage `odd/tasks/*.md` — Fase 2

**Fecha:** 2026-10-12 · **Rama:** `feat/presentation-reemplazo-directo`
**Método:** lectura de encabezados/estado + `git log -1 --format=%ci -- <file>` para fecha de último commit + `git branch --merged main` para detectar ramas integradas. 40 archivos `.md` (este es uno). **Nada se borra — solo se clasifica.**

**Criterios:**
- `activo` — Fase 0/1/2, o trabajo en la línea de presentación (rama actual).
- `stale` — rama no mergeada y superada, o bloqueado sin actividad; requiere decisión.
- `archivar` — completado con commits (rama mergeada o tasks `[x]`) y sin trabajo pendiente.

| Task | Estado | Acción |
|---|---|---|
| harness-hygiene-fase0.md | activo (Fase 0 done, 2026-10-11) | mantener |
| harness-core-fase1.md | activo (Fase 1 done, 2026-10-11) | mantener |
| harness-workflow-fase2.md | activo (Fase 2 en curso) | mantener |
| presentation-reemplazo-directo.md | activo (rama actual; 21/21 tasks, follow-ups por slices) | mantener |
| expediciones-ux-audit.md | activo (rama actual, 2026-10-11) | mantener |
| expediciones-visual-learning-plan.md | activo (untracked, rama actual) | mantener |
| slices-speech-bubbles-y-contenido-plan.md | activo (rama actual, 2026-10-11) | mantener |
| diagnostico-visual-leccion.md | activo (untracked, 2026-10-12) | mantener |
| antigravity-frontend-agent.md | stale (bloqueado por quota `agy` 429 + restart opencode; sin actividad desde 2026-09-28) | revisar/cerrar |
| lab-heroes-restore.md | stale (tasks `[x]` pero rama `odd/lab-heroes-restore` NO mergeada; superado por rediseño de presentación) | decidir merge/descartar |
| proyectos-restore-exp-streak-jerarquia.md | stale (T1-T6 done pero rama `odd/proyectos-restore-exp-streak-jerarquia` NO mergeada) | decidir merge/descartar |
| consent-arquitectura.md | archivar (mergeada a main — PR #65) | archivar |
| lesson-progress-writer.md | archivar (mergeada a main — PR #67) | archivar |
| unificar-cards-arquitectura.md | archivar (mergeada a main — PR #63) | archivar |
| frontend-cleanup-artifacts.md | archivar (PR-C completo; rama `feat/frontend-cleanup-artifacts` mergeada) | archivar |
| legal-higiene.md | archivar (rama `feat/legal-higiene` mergeada; H-Acc/Storage/Cron documentados) | archivar |
| legal-seguridad-c.md | archivar (rama `feat/legal-seguridad-c` mergeada; C-C5/G-02/G-04/G-05 done) | archivar |
| legal-ip-d.md | archivar (rama `feat/legal-seguridad-c-clean` mergeada; D done 0441e3a/86153e5) | archivar |
| legal-retencion-e.md | archivar (rama `feat/legal-seguridad-c-clean` mergeada; retención v1 DEFINIDA) | archivar |
| legal-F11-generacion.md | archivar (rama `feat/legal-F11-generacion` mergeada; 6 entregables F11) | archivar |
| legal-auditoria-f1-f3-f6.md | archivar (rama `feat/legal-f1-f3-f6` mergeada; 4 docs entregados) | archivar |
| legal-auditoria-f4-f5-f7-f10.md | archivar (F4-F10 entregados; base de F11) | archivar |
| compliance-hibrido-consent-supresion.md | archivar (COMP-01..03 done; consent mergeado en main d5c6f6c) | archivar |
| retencion-freeze-automatico.md | archivar (PR-1; rama `feat/retencion-freeze-automatico` mergeada) | archivar |
| retencion-meta-diaria.md | archivar (PR-2; misma rama mergeada) | archivar |
| retencion-busqueda-bookmarks.md | archivar (PR-3; misma rama mergeada) | archivar |
| repo-branch-cleanup.md | archivar (Fase 0-6 done; "Estado Final ab3cdba" documentado) | archivar |
| dashboard-progreso-tweaks.md | archivar (T1-T3 done, commit c2ecd44) | archivar |
| dashboard-revamp-recharts.md | archivar (tasks `[x]`) | archivar |
| hero-fullbleed-title.md | archivar (T1/T2 done) | archivar |
| hero-lab-4k-console.md | archivar (status done: 4K + poster verificados) | archivar |
| lab-crecimiento-duplicados.md | archivar (T1-T3 done) | archivar |
| lab-journey-redesign.md | archivar (done 3996ae9; merge a23e104) | archivar |
| labs-bioreactor-gamificado.md | archivar (tasks `[x]`) | archivar |
| labs-hero-tweaks.md | archivar (done) | archivar |
| lab-workspace-top-actions.md | archivar (T1-T3 `[x]`) | archivar |
| proyectos-paridad-lab.md | archivar (T1/T2 completados) | archivar |
| ui-revamp-bioreactor-dashboard.md | archivar (done) | archivar |
| uiux-dashboard-redesign.md | archivar (T1-T6 `[x]`; superado por revamp/recharts) | archivar |
| unified-lab-proyectos-system.md | archivar (tasks `[x]` verificadas; confirmar si rama `odd/unified-lab-proyectos-system` se integró/descartó) | archivar |

## Resumen

- **activo:** 8 (harness fase 0/1/2 + clúster presentación).
- **stale:** 3 (requieren decisión de merge/descarte o cierre).
- **archivar:** 29 (completadas con commits; nunca borrar, solo marcar como cerradas).

## Notas

- No hay archivos >30 días sin update por fecha de commit (el más viejo es 2026-09-28, ~14 días). El criterio `stale` aquí se resolvió por **rama no mergeada + superada**, no por antigüedad.
- Los 29 `archivar` tienen evidencia de merge (`git branch --merged main`) o de tasks `[x]` + commits. Verificar dos veces antes de mover a un directorio de archivo.
