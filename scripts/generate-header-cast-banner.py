#!/usr/bin/env python3
"""Compose the shared Jungle Jokers header cast banner — branch + all 4 mascots."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public/mascot/jungle-jokers"
OUT = ROOT / "public/mascot/header-scenes/cast-banner.png"

W, H = 800, 176
BRANCH_LIGHT = (217, 143, 78)
BRANCH_MID = (179, 103, 43)
BRANCH_DARK = (122, 67, 26)
LEAF = (132, 204, 22)
LEAF_DARK = (77, 124, 15)
WHITE_THRESHOLD = 248

CAST = (
    {"name": "monkey", "scale": 0.082, "cx": 88, "branch_y": 92, "contact": 0.5, "rotate": 4},
    {"name": "elephant", "scale": 0.078, "cx": 248, "branch_y": 90, "contact": 0.56, "rotate": 0},
    {"name": "crocodile", "scale": 0.092, "cx": 408, "branch_y": 98, "contact": 0.52, "rotate": 0},
    {"name": "tiger", "scale": 0.08, "cx": 568, "branch_y": 94, "contact": 0.78, "rotate": 0},
)


def load_mascot(name: str) -> Image.Image:
    img = Image.open(SOURCE_DIR / f"{name}.png").convert("RGBA")
    px = img.load()
    assert px is not None
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
                px[x, y] = (r, g, b, 0)
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def draw_branch(draw: ImageDraw.ImageDraw) -> None:
    top = [(0, 94), (120, 78), (260, 86), (400, 74), (540, 82), (680, 72), (800, 80)]
    bottom = [(800, 128), (680, 138), (540, 130), (400, 142), (260, 134), (120, 144), (0, 136)]
    draw.polygon(top + bottom[::-1], fill=BRANCH_MID)
    draw.line(top, fill=BRANCH_LIGHT, width=5, joint="curve")
    draw.line(bottom, fill=BRANCH_DARK, width=2, joint="curve")


def paste_leaf(canvas: Image.Image, cx: int, cy: int, angle: int) -> None:
    leaf = Image.new("RGBA", (28, 20), (0, 0, 0, 0))
    ld = ImageDraw.Draw(leaf)
    ld.polygon([(0, 10), (8, 0), (22, 0), (28, 10), (14, 14)], fill=LEAF, outline=LEAF_DARK)
    leaf = leaf.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    canvas.alpha_composite(leaf, (cx - leaf.width // 2, cy - leaf.height // 2))


def paste_mascot(canvas: Image.Image, mascot: Image.Image, cfg: dict) -> None:
    tw = max(1, int(mascot.width * cfg["scale"]))
    th = max(1, int(mascot.height * cfg["scale"]))
    scaled = mascot.resize((tw, th), Image.Resampling.LANCZOS)
    if cfg.get("rotate"):
        scaled = scaled.rotate(cfg["rotate"], expand=True, resample=Image.Resampling.BICUBIC)
    sw, sh = scaled.size
    x = cfg["cx"] - sw // 2
    y = cfg["branch_y"] - int(sh * cfg["contact"])
    canvas.alpha_composite(scaled, (x, y))


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_branch(ImageDraw.Draw(canvas))
    paste_leaf(canvas, 700, 64, -18)
    paste_leaf(canvas, 760, 60, 14)
    for cfg in CAST:
        paste_mascot(canvas, load_mascot(cfg["name"]), cfg)
    canvas.save(OUT, optimize=True)
    print(f"cast banner: {canvas.size} → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
