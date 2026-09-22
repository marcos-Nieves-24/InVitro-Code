# Labs Module Favicons

Optimized SVG favicons for the Labs Bioreactor Gamificado feature. Each icon represents a learning module and uses `currentColor` for tinting via CSS.

## Module mapping

| Module | File | Slug | Order | Original source |
| --- | --- | --- | --- | --- |
| IA (Inteligencia Artificial) | `ia.svg` | `ia` | 1 | `favicon-modulo-1-sin-fondo.svg` |
| Python | `python.svg` | `python` | 2 | `favicon-modulo-2-sin-fondo.svg` |
| Estadistica | `estadistica.svg` | `estadistica` | 3 | `favicon-modulo-3-sin-fondo.svg` |
| Machine Learning | `ml.svg` | `machine-learning` | 4 | `favicon-modulo-4-sin-fondo.svg` |

## Optimization details

- **Original size**: 47-55KB each (with C2PA metadata)
- **Optimized size**: 6-12KB each
- **Techniques**: Stripped C2PA manifest metadata, removed fixed width/height, converted hardcoded fills (`#0F161F`, `#080808`) to `currentColor`, rounded coordinates to 1 decimal, minified path data
- **Preserved**: `viewBox="0 0 1254 1254"`, all path geometry

## Usage

```tsx
// Tint with CSS custom property
<img src="/labs/modules/ia.svg" className="text-blue-500" />

// Or use in component with theme color
<ModuleIcon module="python" className="w-12 h-12 text-emerald-400" />
```

## Source files

Original SVGs are in `~/proyectos/material-visual-invitro-code/favicon/modulos/`. Do not modify those — they are the source of truth.
