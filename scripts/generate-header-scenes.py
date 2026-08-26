#!/usr/bin/env python3
"""Compose pre-baked header scene PNGs — branch + mascot interaction per character."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public/mascot/jungle-jokers"
OUT_DIR = ROOT / "public/mascot/header-scenes"
VERSION = "v1"

# 2× mobile strip (display ~400×80)
W, H = 800, 160

BRANCH_LIGHT = (217, 143, 78)
BRANCH_MID = (179, 103, 43)
BRANCH_DARK = (122, 67, 26)
LEAF = (132, 204, 22)
LEAF_DARK = (77, 124, 15)

WHITE_THRESHOLD = 248


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
    """Flat cartoon branch — one filled ribbon, full width."""
    top = [
        (0, 86),
        (100, 72),
        (220, 80),
        (360, 68),
        (500, 76),
        (640, 66),
        (800, 74),
    ]
    bottom = [
        (800, 118),
        (640, 128),
        (500, 120),
        (360, 132),
        (220, 124),
        (100, 134),
        (0, 126),
    ]
    draw.polygon(top + bottom[::-1], fill=BRANCH_MID)
    draw.line(top, fill=BRANCH_LIGHT, width=5, joint="curve")
    draw.line(bottom, fill=BRANCH_DARK, width=2, joint="curve")


def paste_leaf(canvas: Image.Image, cx: int, cy: int, angle: int) -> None:
    leaf = Image.new("RGBA", (28, 20), (0, 0, 0, 0))
    ld = ImageDraw.Draw(leaf)
    ld.polygon([(0, 10), (8, 0), (22, 0), (28, 10), (14, 14)], fill=LEAF, outline=LEAF_DARK)
    leaf = leaf.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    canvas.alpha_composite(leaf, (cx - leaf.width // 2, cy - leaf.height // 2))


def paste_mascot(
    canvas: Image.Image,
    mascot: Image.Image,
    *,
    scale: float,
    cx: int,
    branch_y: int,
    contact_frac: float,
    rotate: float = 0,
) -> None:
    mw, mh = mascot.size
    tw = max(1, int(mw * scale))
    th = max(1, int(mh * scale))
    scaled = mascot.resize((tw, th), Image.Resampling.LANCZOS)
    if rotate:
        scaled = scaled.rotate(rotate, expand=True, resample=Image.Resampling.BICUBIC)
    sw, sh = scaled.size
    contact_y = int(sh * contact_frac)
    x = cx - sw // 2
    y = branch_y - contact_y
    canvas.alpha_composite(scaled, (x, y))


def build_scene(name: str, cfg: dict) -> Image.Image:
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw_branch(draw)
    for leaf in cfg.get("leaves", []):
        paste_leaf(canvas, *leaf)
    mascot = load_mascot(name)
    paste_mascot(
        canvas,
        mascot,
        scale=cfg["scale"],
        cx=cfg["cx"],
        branch_y=cfg["branch_y"],
        contact_frac=cfg["contact"],
        rotate=cfg.get("rotate", 0),
    )
    return canvas


SCENE_CONFIG = {
    "monkey": {"scale": 0.115, "cx": 98, "branch_y": 88, "contact": 0.5, "rotate": 5},
    "elephant": {"scale": 0.105, "cx": 94, "branch_y": 86, "contact": 0.56, "rotate": 0},
    "crocodile": {
        "scale": 0.125,
        "cx": 128,
        "branch_y": 94,
        "contact": 0.52,
        "rotate": 0,
        "leaves": [(560, 58, -22), (720, 54, 18)],
    },
    "tiger": {"scale": 0.108, "cx": 92, "branch_y": 90, "contact": 0.78, "rotate": 0},
}

for key in ("monkey", "elephant", "tiger"):
    SCENE_CONFIG[key].setdefault("leaves", [(560, 58, -22), (720, 54, 18)])


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, cfg in SCENE_CONFIG.items():
        scene = build_scene(name, cfg)
        out = OUT_DIR / f"{name}.png"
        scene.save(out, optimize=True)
        print(f"{name}: {scene.size} → {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
