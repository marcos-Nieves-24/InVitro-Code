#!/usr/bin/env python3
"""
PIXEL ART DE VERDAD - no cuantizado 640x360.
Downscale a resolución baja con píxeles visibles, luego upscale con NEAREST.
"""
from pathlib import Path
from PIL import Image

SRC = Path.home() / "Descargas/2026-09-27-16-30-00-biotech-pixel-hero-4k.png"
OUT_DIR = Path("assets/pixel-art/true-pixel")
OUT_PUBLIC = Path("public/images/true-pixel")

TARGETS = [
    (160, 90, "160x90"),
    (128, 72, "128x72"),
    (80, 45, "80x45"),
]

COLORS = 32

def process_one(tw, th, label):
    src = Image.open(SRC).convert("RGB")
    # 1. Downscale a resolución PIXEL con NEAREST (píxel duro, sin antialias)
    low = src.resize((tw, th), Image.NEAREST)
    # 2. Cuantizar a 32 colores SIN dither (bloques planos, no degradados suaves)
    # Dither NONE = pixel art auténtico, Floyd = trampa para disimular falta de resolución
    paletted = low.quantize(colors=COLORS, method=2, dither=Image.NONE)
    low_rgb = paletted.convert("RGB")

    # Guardar low res nativo
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_PUBLIC.mkdir(parents=True, exist_ok=True)
    low_rgb.save(OUT_DIR / f"lab-{label}.png", "PNG")
    paletted.save(OUT_DIR / f"lab-{label}-paletted.png", "PNG")

    # 3. Upscale con NEAREST a tamaños display (pixel block visible)
    for scale, suffix in [(4, "640" if tw==160 else f"x{640//tw}"), (8, "1280" if tw==160 else f"x{1280//tw}")]:
        if tw == 160:
            target_w, target_h = (640, 360) if scale==4 else (1280, 720)
        elif tw == 128:
            target_w, target_h = (640, 360) if scale==5 else (1280, 720)
            scale = 5 if suffix=="x5" else 10
        else:
            target_w, target_h = (640, 360) if scale==8 else (1280, 720)
        # Calcular escala exacta
        scale_x = target_w // tw
        up = low_rgb.resize((tw*scale_x, th*scale_x), Image.NEAREST)
        # Si no es 640 exacto, pad o crop? Para 128 son 640 exacto (128*5), 80*8=640 exacto
        up.save(OUT_PUBLIC / f"lab-{label}-{target_w}x{target_h}.png", "PNG")
        print(f"{label} -> {target_w}x{target_h} ({scale_x}x) {OUT_PUBLIC / f'lab-{label}-{target_w}x{target_h}.png'}")

    # También guardar versión 1:1 para Pixelorama (el canvas real es low res)
    # En Pixelorama abrís 160x90 y ves píxeles 1:1, luego exportas x4/x8
    print(f"{label} low {tw}x{th} colors={len(paletted.getcolors())} saved")

def main():
    for tw, th, label in TARGETS:
        process_one(tw, th, label)
    # Crear comparación HTML rápida
    html = "<html><body style='background:#0A1628;color:#B3F0FF;font-family:monospace;padding:20px'><h1>True Pixel Comparison</h1>"
    for tw, th, label in TARGETS:
        html += f"<h2>{label} (canvas real) -> upscaled NEAREST</h2>"
        for fname in [f"lab-{label}-640x360.png", f"lab-{label}-1280x720.png"]:
            html += f"<p>{fname}</p><img src='true-pixel/{fname}' style='image-rendering:pixelated;border:1px solid #244E6D;max-width:640px'>"
    html += "</body></html>"
    (OUT_PUBLIC / "compare.html").write_text(html)
    print("Compare at public/images/true-pixel/compare.html")

if __name__ == "__main__":
    main()
