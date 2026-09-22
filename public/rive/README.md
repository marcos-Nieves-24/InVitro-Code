# Rive Assets

Placeholder directory for Rive animation files used in the Labs Bioreactor Gamificado feature.

## bioreactor.riv

Currently a text placeholder. Replace with the actual `.riv` file exported from Rive Studio.

### Expected export settings

- **Artboard**: 1254x1254
- **State machine**: `BioreactorBubbles`
- **Inputs**:
  - `bubbleSpeed` (number) — controls bubble ascent rate
  - `isActive` (boolean) — toggles animation on/off
- **Theme**: Use `currentColor`-compatible fills for dark mode support
- **Format**: Rive binary (.riv), not JSON

### How to replace

1. Open the `.rev` file in Rive Studio
2. Export as `.riv` (File > Export)
3. Replace `public/rive/bioreactor.riv` with the exported file
4. Remove this README note once the real file is in place
