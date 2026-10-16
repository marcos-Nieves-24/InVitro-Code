# Receipts — DPA y RNBD

> **Propósito:** Conservar prueba de aceptación de DPAs (art. 26) y radicado RNBD (Decreto 1074) con integridad verificable (Ley 527 art. 12).

## Qué va acá

| Archivo | Qué contiene | Cuándo se genera |
|---------|--------------|-----------------|
| `clerk-dpa-YYYY-MM-DD-vN.pdf` | PDF del DPA de Clerk Inc. descargado de `https://clerk.com/legal/dpa` tras aceptar | Al aceptar DPA Clerk |
| `supabase-dpa-YYYY-MM-DD-vN.pdf` | PDF del DPA de Supabase Inc. (`https://supabase.com/legal/dpa`) | Al aceptar DPA Supabase |
| `vercel-dpa-YYYY-MM-DD-vN.pdf` | PDF del DPA de Vercel Inc. (`https://vercel.com/legal/dpa`) | Al aceptar DPA Vercel |
| `rnbd-radicado-YYYY-MM-DD.pdf` | Constancia de inscripción RNBD descargada de `https://rnbd.sic.gov.co` | Al inscribir las 7 bases |

## Cómo verificar integridad

```bash
# Desde la raíz del repo:
sha256sum legal/receipts/*.pdf
# Copiar salida a la columna "Receipt hash" de `legal/dpa-register.md §1`
# y al dossier `docs/compliance/RNBD_DOSSIER.md`
```

## Reglas

- **No commitear PDFs con datos personales reales** si contienen NIT/firma escaneada — en ese caso guardar solo el hash y conservar el PDF fuera del repo (cifrado).
- **Versionar:** cada nueva aceptación genera `vN+1` (ver `legal/dpa-register.md §1`).
- **No inventar:** si el proveedor emite HTML/receipt en vez de PDF, guardar como `.html` o `.txt` y ajustar el nombre.
- `.gitignore` ignora `.env` pero **no** ignora `legal/receipts/` — los PDFs de DPA son prueba conservable.

## Estado actual (2026-10-16)

Pendiente de aceptación — este directorio se creó como parte de `PLAN_REMEDIACION.md Fase 5.1`.
Ver `legal/dpa-register.md §3` para pasos 1-5 y `docs/compliance/RNBD_DOSSIER.md` para el dossier listo para copiar al portal SIC.
