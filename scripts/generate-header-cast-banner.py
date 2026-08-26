#!/usr/bin/env python3
"""Compose the shared Jungle Jokers header cast banner — branch + all 4 mascots."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public/mascot/jungle-jokers"
OUT = ROOT / "public/mascot/header-scenes/cast-banner.png"

# Render 3× then downscale for smooth edges (display 800×140)
OUT_W, OUT_H = 800, 140
SCALE = 3
W, H = OUT_W * SCALE, OUT_H * SCALE

BRANCH_LIGHT = (217, 143, 78)
BRANCH_MID = (179, 103, 43)
BRANCH_DARK = (122, 67, 26)
LEAF = (132, 204, 22)
LEAF_DARK = (77, 124, 15)
WHITE_THRESHOLD = 248

CAST = (
    {"name": "monkey", "scale": 0.082, "cx": 88, "branch_y": 78, "contact": 0.5, "rotate": 4},
    {"name": "elephant", "scale": 0.078, "cx": 248, "branch_y": 76, "contact": 0.56, "rotate": 0},
    {"name": "crocodile", "scale": 0.092, "cx": 408, "branch_y": 82, "contact": 0.52, "rotate": 0},
    {"name": "tiger", "scale": 0.08, "cx": 568, "branch_y": 80, "contact": 0.78, "rotate": 0},
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


def pt(x: float, y: float) -> tuple[int, int]:
    return (int(x * SCALE), int(y * SCALE))


def draw_branch(draw: ImageDraw.ImageDraw) -> None:
    """Single filled ribbon — no extra stroke lines (avoids double/jagged edges)."""
    top = [pt(0, 78), pt(120, 66), pt(260, 72), pt(400, 62), pt(540, 68), pt(680, 60), pt(800, 66)]
    bottom = [pt(800, 102), pt(680, 110), pt(540, 104), pt(400, 114), pt(260, 108), pt(120, 116), pt(0, 110)]
    draw.polygon(top + bottom[::-1], fill=BRANCH_MID)
    # Soft top sheen (inset strip, not a separate outline path)
    sheen = [(top[0][0], top[0][1] + SCALE), *top, (top[-1][0], top[-1][1] + SCALE)]
    draw.line(sheen, fill=BRANCH_LIGHT, width=SCALE * 3, joint="curve")


def paste_leaf(canvas: Image.Image, cx: int, cy: int, angle: int) -> None:
    leaf = Image.new("RGBA", (28 * SCALE, 20 * SCALE), (0, 0, 0, 0))
    ld = ImageDraw.Draw(leaf)
    s = SCALE
    ld.polygon([(0, 10 * s), (8 * s, 0), (22 * s, 0), (28 * s, 10 * s), (14 * s, 14 * s)], fill=LEAF, outline=LEAF_DARK)
    leaf = leaf.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    canvas.alpha_composite(leaf, (cx * SCALE - leaf.width // 2, cy * SCALE - leaf.height // 2))


def paste_mascot(canvas: Image.Image, mascot: Image.Image, cfg: dict) -> None:
    tw = max(1, int(mascot.width * cfg["scale"] * SCALE))
    th = max(1, int(mascot.height * cfg["scale"] * SCALE))
    scaled = mascot.resize((tw, th), Image.Resampling.LANCZOS)
    if cfg.get("rotate"):
        scaled = scaled.rotate(cfg["rotate"], expand=True, resample=Image.Resampling.BICUBIC)
    sw, sh = scaled.size
    x = cfg["cx"] * SCALE - sw // 2
    y = cfg["branch_y"] * SCALE - int(sh * cfg["contact"])
    canvas.alpha_composite(scaled, (x, y))


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_branch(ImageDraw.Draw(canvas))
    paste_leaf(canvas, 700, 52, -18)
    paste_leaf(canvas, 760, 48, 14)
    for cfg in CAST:
        paste_mascot(canvas, load_mascot(cfg["name"]), cfg)
    canvas = canvas.resize((OUT_W, OUT_H), Image.Resampling.LANCZOS)
    canvas.save(OUT, optimize=True)
    print(f"cast banner: {canvas.size} → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
