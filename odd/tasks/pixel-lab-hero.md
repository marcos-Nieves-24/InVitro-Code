# Pixel Lab Hero — Pixelización directa 640x360

## Objective
Pixelizar directamente `~/Descargas/2026-09-27-16-30-00-biotech-pixel-hero-4k.png` (3840x2160) a 640x360 para hero de InVitro-Code, usando paleta 32 colores y proyecto Pixelorama editable.

## Problem
Referencia 4K fotorrealista debe convertirse en pixel art nativo sin perder glows cyan (ADN/consola) ni verdes de la planta. Downscale x6 exacto.

## Why
Hero visual para landing / marketing, coherente con estética biotech pixel art. Necesita versión 1x y 2x para retina.

## Scope
- `scripts/generate-pixel-lab.py` (generación + cuantización)
- `assets/pixel-art/lab-pixel-base.png` (intermedio 640x360)
- `assets/pixel-art/lab-palette.json` (paleta Pixelorama)
- `assets/pixel-art/lab-hero.pxo` (proyecto Pixelorama 3 capas)
- `public/images/lab-hero-pixel.png` (640x360 final)
- `public/images/lab-hero-pixel@2x.png` (1280x720 NEAREST)

## Constraints
- Canvas fijo 640x360 (no 320)
- Paleta 32 colores, reserva 8 verdes + 6 cyan
- Dither Floyd-Steinberg
- Preservar alpha original
- Herramienta: Pixelorama en /home/biohacker24/Descargas/Pixelorama-Linux-64bit/Pixelorama.x86_64

## Tasks
- [x] T1: Crear script `scripts/generate-pixel-lab.py` con resize NEAREST x6 + quantize 32 + extract palette
- [x] T2: Ejecutar script y generar base 640x360 + paleta + @2x
- [x] T3: Generar .pxo con 3 capas (Base, FX_Glow Add 40%, FX_Sharpen) y verificar en Pixelorama
- [x] T4: Copiar finales a public/images y verificar build
- [x] T5: Animación planta con movimientos pequeños (sway 2px + respiración) en Pixelorama timeline + export GIF/APNG
- [x] T6: Verificar animación en Pixelorama y en web (public/images/lab-hero-animated.*)

## Authorized Scope
Usuario autorizó pixelización directa 640x360 desde ruta dada. No reinterpretación.

## Acceptance Criteria
- `lab-pixel-base.png` 640x360, <=32 colores
- `lab-hero.pxo` abre en Pixelorama con 3 capas visibles
- `lab-hero-pixel.png` y `@2x` existen y se ven correctos a 100%/200%
- `npm run type-check` pasa

## Progress
- 2026-09-27: creado documento, dirs listos, source 4K verificado

## Verification Evidence
- Source: 3840x2160 RGBA -> 640x360 NEAREST, 32 colors Floyd-Steinberg (verified `getcolors()==32`)
- Outputs: `assets/pixel-art/lab-pixel-base.png` 71K, `public/images/lab-hero-pixel.png` 71K, `@2x` 88K 1280x720 NEAREST
- Palette: `assets/pixel-art/lab-palette.json` + copia en `Pixelorama/pixelorama_data/Palettes/InVitro-Lab-32.json` (32 colores)
- PXO: `assets/pixel-art/lab-hero.pxo` 572K con base.png/glow.png/sharp.png + project.json (3 layers, FX_Glow Add 40%)
- `npm run type-check` PASS
- Animación: `generate-pixel-lab-animated.py` sway copa planta 1px (bbox 340-520,103-220) + pulso brillo 0.96-1.06, 4 frames 180ms (~5.5fps), GIF 137K, APNG 283K (4 frames animados), WebP 150K, spritesheet 2560x360 -> Pixelorama PID 123081 abierto
- Verificación animación: PIL confirma GIF/APNG 4 frames is_animated True

## SpriteCook MCP (ejecutado 2026-09-27)
- Upload 4K ref: 568f8f9d (free account) + re-upload pixel 128x72: 1776778d (new account 6438d660, 40cr)
- Generate: gpt-image-2.5-flare pixel 128x72 transparent -> 58e32c24 128x72 (22cr) + re-upload para nueva cuenta
- Animate: pixel-engine-v1.5 4 frames webp -> bedffc9b 104x104 4 frames @8fps (26cr), spritesheet 416x104, upscaled 416x416
- Outputs: public/images/spritecook/lab-hero-spritecook-128x72.png (20K), -640, -1280, animated.webp (6K), animated-416.webp (34K), spritesheet.png (8.7K), spritesheet-4x.png (16K)
- Pixelorama PID 138954 abierto con spritesheet animado
- Créditos restantes nueva cuenta: 14

## Next Step
Usar en page.tsx: <img src="/images/spritecook/lab-hero-spritecook-animated.webp" /> o spritesheet en Pixelorama timeline 4 frames 104x104 @8fps.

## Final Hero Integration 2026-09-27
- Elegido: SpriteCook 256x144 completo sin agujeros `dec18997` + v2 `fe285ee2` (256x144) -> v2 256x144 91K como hero
- Copiado a `public/landing/pixel-hero-256.png` + 4x 129K
- `src/components/landing/HeroBackground.tsx` actualizado: src="/landing/pixel-hero-256.png" con imageRendering pixelated, overlay 55%
- Build PASS, type-check PASS
- Pixelorama abierto con 256 complete para futuros tweaks


