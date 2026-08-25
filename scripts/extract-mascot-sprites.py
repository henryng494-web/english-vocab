#!/usr/bin/env python3
"""Extract transparent mascot sprites from the approved cast lineup PNG."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/mascot/cast-lineup.png"
OUT_DIR = ROOT / "public/mascot/cast"

# Crop boxes tuned to cast-v3-final-with-exact-cow.png (1536×1024)
CROPS: dict[str, tuple[int, int, int, int]] = {
    "cat": (15, 35, 305, 905),
    "cow": (355, 0, 255, 1000),
    "dog": (695, 25, 310, 930),
    "pig": (1055, 95, 470, 860),
}


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    img = Image.open(SOURCE).convert("RGBA")
    px = img.load()
    assert px is not None
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if r > 248 and g > 248 and b > 248:
                px[x, y] = (r, g, b, 0)

    for name, (x, y, w, h) in CROPS.items():
        crop = img.crop((x, y, x + w, y + h))
        bbox = crop.getbbox()
        if bbox:
            crop = crop.crop(bbox)
        out = OUT_DIR / f"{name}.png"
        crop.save(out)
        print(f"{name}: {crop.size[0]}×{crop.size[1]} → {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
