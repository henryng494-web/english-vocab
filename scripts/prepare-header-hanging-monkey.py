#!/usr/bin/env python3
"""Process GenerateImage header monkey artifact into transparent header PNGs."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ARTIFACT = Path("/opt/cursor/artifacts/assets/jungle12-header-monkey-hanging")
OUT_DIR = ROOT / "public/mascot/jungle-jokers"
WHITE_THRESHOLD = 245
HEADER_HEIGHT = 256


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


def trim_with_padding(img: Image.Image, pad: int = 8) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    w, h = img.size
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(w, x1 + pad), min(h, y1 + pad)
    return img.crop((x0, y0, x1, y1))


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else ARTIFACT
    if not src.exists():
        raise FileNotFoundError(f"Artifact not found: {src}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    trimmed = trim_with_padding(remove_white_background(Image.open(src)))
    full_out = OUT_DIR / "header-hanging-monkey.png"
    trimmed.save(full_out, optimize=True)

    scale = HEADER_HEIGHT / trimmed.height
    small = trimmed.resize(
        (max(1, int(trimmed.width * scale)), HEADER_HEIGHT),
        Image.Resampling.LANCZOS,
    )
    small_out = OUT_DIR / "header-hanging-monkey-sm.png"
    small.save(small_out, optimize=True)
    print(f"{full_out.relative_to(ROOT)} {trimmed.size}")
    print(f"{small_out.relative_to(ROOT)} {small.size}")


if __name__ == "__main__":
    main()
