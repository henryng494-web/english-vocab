#!/usr/bin/env python3
"""Build truly transparent, trimmed mascot PNGs for in-app header/display."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public/mascot/jungle-jokers"
OUT_DIR = ROOT / "public/mascot/jungle-jokers/header"
CHARACTERS = ("monkey", "elephant", "crocodile", "tiger")
WHITE_THRESHOLD = 248


def remove_white_background(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    px = rgba.load()
    assert px is not None
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
                px[x, y] = (r, g, b, 0)
    return rgba


def trim_to_content(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    return img.crop(bbox)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name in CHARACTERS:
        src = SOURCE_DIR / f"{name}.png"
        if not src.exists():
            raise FileNotFoundError(src)
        img = Image.open(src)
        transparent = remove_white_background(img)
        trimmed = trim_to_content(transparent)
        out = OUT_DIR / f"{name}.png"
        trimmed.save(out, optimize=True)
        print(f"{name}: {trimmed.size[0]}×{trimmed.size[1]} → {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
