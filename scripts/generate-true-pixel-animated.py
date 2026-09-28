#!/usr/bin/env python3
"""
True pixel animation: sway en píxeles enteros del canvas low-res.
Para 160x90, 1 low-pixel = 4 screen pixels. Movimiento visible y pixel-perfect.
"""
from pathlib import Path
from PIL import Image

SRC_LOW = {
    "160x90": Path("assets/pixel-art/true-pixel/lab-160x90.png"),
    "128x72": Path("assets/pixel-art/true-pixel/lab-128x72.png"),
    "80x45": Path("assets/pixel-art/true-pixel/lab-80x45.png"),
}
OUT_DIR = Path("public/images/true-pixel")

def animate_one(label, low_path):
    base_low = Image.open(low_path).convert("RGBA")
    tw, th = base_low.size
    # Detect plant top region in low res (proporcional al anterior)
    # Para 160x90, top bbox aprox escalado: original 340-520 x 103-220 en 640x360 -> en low es /4
    scale = 640 / tw
    # Usamos bbox proporcional
    orig_top = (340, 103, 520, 220)
    low_top = tuple(int(c / scale) for c in orig_top)
    print(f"{label} low {tw}x{th} top bbox {low_top} scale {scale}x")

    frames_low = []
    # 4 frames: 0, +1, 0, -1 low-pixel (en low res es 1px, en display es scale px)
    configs = [(0, 0), (1, 0), (0, 0), (-1, 0)]
    for dx, dy in configs:
        f = base_low.copy()
        top = base_low.crop(low_top)
        # Crear frame con hueco: pegar top desplazado
        # Para true pixel, desplazamiento entero low-pixel = movimiento bloque visible
        new_x = low_top[0] + dx
        new_y = low_top[1] + dy
        f.paste(top, (new_x, new_y), top if top.mode=="RGBA" else None)
        frames_low.append(f)
        # Guardar low res frame
        f.save(OUT_DIR / f"anim-{label}-f{len(frames_low)-1}-low.png")

    # Upscale cada low frame con NEAREST a 640x360 y 1280x720
    for target_w, target_h in [(640,360), (1280,720)]:
        scale_x = target_w // tw
        up_frames = [f.resize((tw*scale_x, th*scale_x), Image.NEAREST) for f in frames_low]
        # GIF
        # Convertir a P con misma paleta para evitar flicker
        gif_frames = [f.convert("RGB").convert("P", palette=Image.ADAPTIVE, colors=32) for f in up_frames]
        first = gif_frames[0]
        unified = []
        for gf in gif_frames:
            q = gf.convert("RGB").quantize(colors=32, palette=first, dither=Image.NONE)
            unified.append(q)
        out_gif = OUT_DIR / f"anim-{label}-{target_w}x{target_h}.gif"
        unified[0].save(out_gif, save_all=True, append_images=unified[1:], duration=200, loop=0, disposal=2)
        print(f"Saved GIF {out_gif} {out_gif.stat().st_size} bytes")
        # APNG
        out_apng = OUT_DIR / f"anim-{label}-{target_w}x{target_h}.png"
        up_frames[0].save(out_apng, save_all=True, append_images=up_frames[1:], duration=200, loop=0)
        print(f"Saved APNG {out_apng} {out_apng.stat().st_size} bytes")
        # WebP
        out_webp = OUT_DIR / f"anim-{label}-{target_w}x{target_h}.webp"
        up_frames[0].save(out_webp, save_all=True, append_images=up_frames[1:], duration=200, loop=0, lossless=False, quality=90)
        print(f"Saved WebP {out_webp} {out_webp.stat().st_size} bytes")

    # Spritesheet low res para Pixelorama (importar como 4 frames)
    sheet_low = Image.new("RGBA", (tw*4, th), (0,0,0,0))
    for i, f in enumerate(frames_low):
        sheet_low.paste(f, (i*tw, 0))
    sheet_low.save(OUT_DIR / f"anim-{label}-spritesheet.png")
    print(f"Spritesheet low {label} {sheet_low.size}")

    # Spritesheet upscaled 640 para Pixelorama también
    sheet_640 = Image.new("RGBA", (640*4, 360), (0,0,0,0))
    for i, f in enumerate(frames_low):
        up = f.resize((640,360), Image.NEAREST)
        sheet_640.paste(up, (i*640, 0))
    sheet_640.save(OUT_DIR / f"anim-{label}-spritesheet-640.png")
    print(f"Spritesheet 640 {label} {sheet_640.size}")

def main():
    for label, path in SRC_LOW.items():
        if path.exists():
            animate_one(label, path)
        else:
            print(f"Missing {path}")

if __name__ == "__main__":
    main()
