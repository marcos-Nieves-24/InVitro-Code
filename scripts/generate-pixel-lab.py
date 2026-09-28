#!/usr/bin/env python3
"""
Pixeliza directamente el hero biotech 4K a 640x360 para InVitro-Code.
- Input: ~/Descargas/2026-09-27-16-30-00-biotech-pixel-hero-4k.png (3840x2160 RGBA)
- Output: 640x360 pixel art 32 colores + paleta Pixelorama + @2x + .pxo base
"""
import os
import json
import zipfile
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance

SRC = Path.home() / "Descargas/2026-09-27-16-30-00-biotech-pixel-hero-4k.png"
OUT_DIR = Path("assets/pixel-art")
PUBLIC_DIR = Path("public/images")
OUT_BASE = OUT_DIR / "lab-pixel-base.png"
OUT_PALETTE_JSON = OUT_DIR / "lab-palette.json"
OUT_PNG = PUBLIC_DIR / "lab-hero-pixel.png"
OUT_PNG_2X = PUBLIC_DIR / "lab-hero-pixel@2x.png"
OUT_PXO = OUT_DIR / "lab-hero.pxo"

TARGET = (640, 360)
COLORS = 32

def ensure_dirs():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

def load_source():
    im = Image.open(SRC)
    print(f"Source: {im.size} {im.mode} {im.format}")
    # Convert RGBA -> RGB for quantize but preserve alpha mask
    if im.mode == "RGBA":
        # keep alpha for later, but quantize RGB
        alpha = im.split()[3]
        rgb = Image.new("RGB", im.size, color="#0A1628")
        rgb.paste(im, mask=alpha)
        return rgb, alpha
    return im.convert("RGB"), None

def pixelize():
    rgb, alpha = load_source()
    # Downscale x6 exactly 3840->640 with NEAREST for hard pixels
    # First resize to target with NEAREST, then quantize
    small = rgb.resize(TARGET, Image.NEAREST)
    print(f"Downscaled to {small.size}")

    # Quantize to 32 colors with Floyd-Steinberg dither (preserves glow gradients)
    paletted = small.quantize(colors=COLORS, method=2, dither=Image.FLOYDSTEINBERG)
    print(f"Quantized to {len(paletted.getpalette())//3} palette entries, colors used: {len(paletted.getcolors())}")

    # Convert back to RGB for further processing / export
    base_rgb = paletted.convert("RGB")

    # Optional: slight contrast boost to rescue greens (validated vs original)
    # Keep subtle so we don't blow highlights
    enhancer = ImageEnhance.Contrast(base_rgb)
    base_rgb = enhancer.enhance(1.08)

    # Re-apply alpha if source had it (at target size)
    if alpha is not None:
        alpha_small = alpha.resize(TARGET, Image.NEAREST)
        base_rgba = base_rgb.convert("RGBA")
        base_rgba.putalpha(alpha_small)
        base_rgb_for_save = base_rgba
    else:
        base_rgb_for_save = base_rgb

    return paletted, base_rgb_for_save, base_rgb

def save_assets(paletted, base_rgba, base_rgb):
    # Save base 640x360
    base_rgba.save(OUT_BASE, "PNG")
    print(f"Saved {OUT_BASE} ({OUT_BASE.stat().st_size} bytes)")

    # Save public 1x (same as base)
    base_rgba.save(OUT_PNG, "PNG")
    print(f"Saved {OUT_PNG}")

    # Save @2x 1280x720 with NEAREST
    big = base_rgba.resize((TARGET[0]*2, TARGET[1]*2), Image.NEAREST)
    big.save(OUT_PNG_2X, "PNG")
    print(f"Saved {OUT_PNG_2X} {big.size}")

    # Save palette JSON for Pixelorama
    palette = paletted.getpalette()[:COLORS*3]
    colors = []
    for i in range(0, len(palette), 3):
        r, g, b = palette[i], palette[i+1], palette[i+2]
        # Skip trailing zeros from unused entries
        if i//3 >= len(paletted.getcolors()):
            # still export all 32 entries for completeness, but mark
            pass
        colors.append(f"#{r:02X}{g:02X}{b:02X}")
    # Deduplicate while preserving order
    seen = []
    for c in colors:
        if c not in seen:
            seen.append(c)
    # Pixelorama palettes are JSON with "colors" array (see DawnBringer 32.json)
    # Format: { "name": "...", "colors": [{ "color": "#RRGGBB" }, ...] } or simple list
    # We support both: write simple list + Pixelorama-compatible
    pal_data = {
        "name": "InVitro-Lab-32",
        "colors": [{"color": c} for c in seen],
        "comment": "Generated from 4K hero, 640x360, 32 colors, Floyd-Steinberg"
    }
    # Also write Pixelorama-compatible file in pixelorama_data format
    with open(OUT_PALETTE_JSON, "w") as f:
        json.dump(pal_data, f, indent=2)
    print(f"Saved palette {OUT_PALETTE_JSON} with {len(seen)} colors: {seen}")

    # Also copy palette to Pixelorama user palettes for direct import
    px_pal_dir = Path.home() / "Descargas/Pixelorama-Linux-64bit/pixelorama_data/Palettes"
    if px_pal_dir.exists():
        try:
            import shutil
            shutil.copy(OUT_PALETTE_JSON, px_pal_dir / "InVitro-Lab-32.json")
            print(f"Copied palette to {px_pal_dir}")
        except Exception as e:
            print(f"Could not copy palette to Pixelorama dir: {e}")

def create_pxo(base_rgba, base_rgb):
    """Create a minimal .pxo with 3 layers: Base, FX_Glow (Add 40%), FX_Sharpen."""
    # FX_Glow: blurred highlights (extract bright cyan/green areas)
    # Simple glow: blur base and keep only bright pixels
    glow = base_rgb.filter(ImageFilter.GaussianBlur(radius=1.5))
    # Boost brightness for glow
    glow = ImageEnhance.Brightness(glow).enhance(1.25)
    glow_rgba = glow.convert("RGBA")
    # Make dark areas transparent to simulate Add blend
    # Threshold: keep pixels where luminance > 80
    px = glow_rgba.load()
    for y in range(TARGET[1]):
        for x in range(TARGET[0]):
            r, g, b, a = px[x, y]
            lum = 0.2126*r + 0.7152*g + 0.0722*b
            if lum < 70:
                px[x, y] = (r, g, b, 0)
            else:
                # semi-transparent glow
                alpha = int(min(110, (lum - 70) * 1.2))
                px[x, y] = (r, g, b, alpha)

    # FX_Sharpen: slight unsharp mask
    sharp = base_rgb.filter(ImageFilter.UnsharpMask(radius=1, percent=80, threshold=2))

    # Prepare temp dir for pxo contents
    import tempfile, json as js
    tmp = Path(tempfile.mkdtemp())
    # Pixelorama .pxo is a ZIP; minimal we can do is store layers as PNGs + project.json
    # For compatibility we store: project.json + layers as separate PNGs
    # Pixelorama will also accept a plain ZIP with images, but we try to mimic its format
    base_path = tmp / "base.png"
    glow_path = tmp / "glow.png"
    sharp_path = tmp / "sharp.png"
    base_rgba.save(base_path, "PNG")
    glow_rgba.save(glow_path, "PNG")
    sharp.convert("RGBA").save(sharp_path, "PNG")

    project = {
        "name": "lab-hero",
        "size": {"x": TARGET[0], "y": TARGET[1]},
        "layers": [
            {"name": "Base_Pixelated", "visible": True, "locked": False, "opacity": 1.0, "blend_mode": 0},
            {"name": "FX_Glow_Add_40", "visible": True, "locked": False, "opacity": 0.4, "blend_mode": 1},
            {"name": "FX_Sharpen", "visible": False, "locked": False, "opacity": 1.0, "blend_mode": 0},
        ],
        "comment": "Generated by generate-pixel-lab.py. Open in Pixelorama: layers are base.png/glow.png/sharp.png"
    }
    with open(tmp / "project.json", "w") as f:
        js.dump(project, f, indent=2)
    with open(tmp / "README.txt", "w") as f:
        f.write("Open base.png/glow.png/sharp.png as layers in Pixelorama if auto-import fails.\n")

    # Create .pxo (which is a ZIP)
    with zipfile.ZipFile(OUT_PXO, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(base_path, "base.png")
        z.write(glow_path, "glow.png")
        z.write(sharp_path, "sharp.png")
        z.write(tmp / "project.json", "project.json")
        z.write(tmp / "README.txt", "README.txt")
    print(f"Saved {OUT_PXO} ({OUT_PXO.stat().st_size} bytes) with 3 layers")

def main():
    ensure_dirs()
    paletted, base_rgba, base_rgb = pixelize()
    save_assets(paletted, base_rgba, base_rgb)
    create_pxo(base_rgba, base_rgb)
    print("Done. Verify: open assets/pixel-art/lab-hero.pxo in Pixelorama or use base PNGs directly.")

if __name__ == "__main__":
    main()
