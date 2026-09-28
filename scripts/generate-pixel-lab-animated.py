#!/usr/bin/env python3
"""
Animación sutil de la planta para el hero pixelado.
- Input: public/images/lab-hero-pixel.png (640x360, 32 colores)
- Técnica: desplaza solo la región de la planta (bbox 321-558, 103-306) con sway 1-2px
  y leve pulso de brillo en hojas, sin tocar fondo/ADN/consola.
- Output: GIF + APNG + frames para Pixelorama timeline
  4 frames loop suave: 0, +1, 0, -1 px (8fps sugerido)
"""

from pathlib import Path
from PIL import Image, ImageEnhance

SRC = Path("public/images/lab-hero-pixel.png")
OUT_DIR = Path("assets/pixel-art/frames")
OUT_GIF = Path("public/images/lab-hero-animated.gif")
OUT_APNG = Path("public/images/lab-hero-animated.png")
OUT_WEBM = Path("public/images/lab-hero-animated.webp")

# Bbox detectado: 321-558, 103-306 (planta + Petri)
PLANT_BBOX = (321, 103, 558, 306)
# Para sway, movemos solo el tallo/hojas altas (y < 220), no toda la base de tierra
# Dividimos en 2: hojas superiores (103-220) y base terrario (220-306)
TOP_BBOX = (340, 103, 520, 220)
BASE_BBOX = (321, 220, 558, 306)

def sway_frame(base: Image.Image, dx: int, brightness: float) -> Image.Image:
    """Desplaza suavemente la copa de la planta dx px y ajusta brillo."""
    frame = base.copy()
    # Extraer copa
    top = base.crop(TOP_BBOX)
    # Crear canvas transparente para la copa desplazada
    # Pegamos con offset dx, rellenando hueco con fondo original
    # Para no dejar hueco negro, primero clonamos fondo y luego pegamos copa movida
    # Hueco se rellena con vecino (inpaint simple: clona borde)
    # 1. Crear frame base sin copa (rellena con color fondo promedio cercano)
    # Usa el fondo original estirando 1px
    frame_top_area = frame.crop(TOP_BBOX)
    # Limpiar área top
    # Rellenar con base circundante: usamos copia desplazada levemente para tapar hueco
    # Simplemente pegamos la copa movida encima; el hueco queda con fondo anterior que ya es plausible
    # porque el fondo es oscuro y la copa es pequeña.

    # Ajustar brillo de la copa para pulso
    if brightness != 1.0:
        top = ImageEnhance.Brightness(top).enhance(brightness)
        top = ImageEnhance.Color(top).enhance(1.05 if brightness > 1 else 0.95)

    # Calcular nueva posición con dx
    new_x = TOP_BBOX[0] + dx
    new_y = TOP_BBOX[1]
    # Pegar copa desplazada (usa alpha si existe)
    if top.mode == "RGBA":
        frame.paste(top, (new_x, new_y), top)
    else:
        # Sin alpha, pegar con máscara verde (solo hojas)
        # Crear máscara de hojas: verdes brillantes
        mask = Image.new("L", top.size, 0)
        for y in range(top.size[1]):
            for x in range(top.size[0]):
                r,g,b = top.getpixel((x,y))[:3]
                if g > 110 and g > r+15 and g > b:
                    mask.putpixel((x,y), 255)
        frame.paste(top, (new_x, new_y), mask)
    return frame

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    base = Image.open(SRC).convert("RGBA")
    print(f"Base {base.size} {base.mode}")

    # 4 frames suaves, loop ping-pong: 0, +1.5, 0, -1.5
    # Usamos dx enteros para mantener pixel perfect, pero alternamos 1 y 2 para variedad
    configs = [
        (0, 1.00, "f0"),
        (1, 1.06, "f1"),
        (0, 1.00, "f2"),
        (-1, 0.96, "f3"),
        (1, 1.04, "f4"),  # extra para loop más orgánico, luego recortamos a 4 si hace falta
    ]
    # Nos quedamos con 4 para GIF compacto, elegimos 0,1,0,-1
    configs = [configs[0], configs[1], configs[2], configs[3]]

    frames = []
    for dx, bright, name in configs:
        f = sway_frame(base, dx, bright)
        # Cuantizar a 32 colores manteniendo paleta base para evitar parpadeo de colores
        # Usamos paleta de la base para consistencia
        # Extraemos paleta de base y aplicamos a cada frame
        paletted = f.quantize(colors=32, method=2, dither=Image.NONE)
        # Convertir a RGBA para GIF/APNG con transparencia preservada no necesaria (fondo opaco)
        fr = paletted.convert("RGBA")
        frames.append(fr)
        out_path = OUT_DIR / f"{name}.png"
        fr.save(out_path, "PNG")
        print(f"Saved {out_path} dx={dx} bright={bright}")

    # Export GIF loop (8 fps = 125ms)
    # GIF necesita paleta; convertimos primer frame a P con paleta y resto con misma paleta
    # Más simple: guardar con PIL GIF con duración
    # GIF: convertir a P con paleta adaptativa, luego unificar paleta con el primero
    gif_frames = [f.convert("RGB").convert("P", palette=Image.ADAPTIVE, colors=32) for f in frames]
    first = gif_frames[0]
    # Re-cuantizar todos usando paleta de la primera para evitar flicker: convertir a RGB y cuantizar con palette
    unified = []
    for gf in gif_frames:
        rgb = gf.convert("RGB")
        q = rgb.quantize(colors=32, palette=first, dither=Image.NONE)
        unified.append(q)
    gif_frames = unified
    first = gif_frames[0]

    first.save(
        OUT_GIF, save_all=True, append_images=gif_frames[1:],
        duration=180, loop=0, optimize=False, disposal=2
    )
    print(f"Saved GIF {OUT_GIF} ({OUT_GIF.stat().st_size} bytes) {len(frames)} frames")

    # Export APNG (PNG animado, mejor calidad, soportado en Chrome/Firefox)
    # PIL soporta APNG desde 9.1
    try:
        frames[0].save(OUT_APNG, save_all=True, append_images=frames[1:], duration=180, loop=0)
        print(f"Saved APNG {OUT_APNG} ({OUT_APNG.stat().st_size} bytes)")
    except Exception as e:
        print(f"APNG failed: {e}")
        # Fallback: copiar GIF como PNG animado
        import shutil
        shutil.copy(OUT_GIF, OUT_APNG)

    # También export WebP animado (más liviano para web)
    try:
        frames[0].save(OUT_WEBM, save_all=True, append_images=frames[1:], duration=180, loop=0, lossless=False, quality=85, method=4)
        print(f"Saved WebP {OUT_WEBM} ({OUT_WEBM.stat().st_size} bytes)")
    except Exception as e:
        print(f"WebP failed: {e}")

    # Para Pixelorama: crear spritesheet horizontal para importar como frames
    sheet = Image.new("RGBA", (base.size[0]*len(frames), base.size[1]), (0,0,0,0))
    for i, f in enumerate(frames):
        sheet.paste(f, (i*base.size[0], 0))
    sheet_path = OUT_DIR / "spritesheet.png"
    sheet.save(sheet_path, "PNG")
    print(f"Saved spritesheet {sheet_path} {sheet.size} -> Importar en Pixelorama: Importar > Spritesheet 4 frames 640x360")

    print("Listo. Duración 180ms por frame (~5.5fps) suave y sutil, ideal para hero sin marear.")

if __name__ == "__main__":
    main()
