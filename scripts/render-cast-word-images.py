#!/usr/bin/env python3
"""Pre-render cast mascot word scenes to public/word-images/{word}.jpg (fox-trial style)."""

from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "word-images"
CAST = ROOT / "public" / "mascot" / "cast"
MANIFEST = ROOT / "src" / "data" / "mascot-scene-manifest-top1000.ts"

W, H = 600, 350
GROUND = 292
SKY_TOP = (96, 165, 250)
SKY_BOTTOM = (251, 146, 60)
GROUND_COLOR = (253, 186, 116)

SPRITE_SCALE = {
    "cat": 0.34,
    "cow": 0.28,
    "dog": 0.34,
    "pig": 0.30,
}


def load_manifest() -> dict[str, str]:
    text = MANIFEST.read_text(encoding="utf-8")
    pairs = re.findall(r'"([a-z]+)":\s*"([a-z_]+)"', text)
    return dict(pairs)


def gradient_bg() -> Image.Image:
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / max(H - 1, 1)
        color = tuple(
            int(SKY_TOP[i] + t * (SKY_BOTTOM[i] - SKY_TOP[i])) for i in range(3)
        )
        draw.line([(0, y), (W, y)], fill=color)
    draw.rectangle([0, GROUND, W, H], fill=GROUND_COLOR)
    return img


def paste_sprite(
    base: Image.Image,
    character: str,
    cx: int,
    ground: int,
    scale: float,
) -> None:
    path = CAST / f"{character}.png"
    if not path.exists():
        return
    sprite = Image.open(path).convert("RGBA")
    nw = max(1, int(sprite.width * scale))
    nh = max(1, int(sprite.height * scale))
    sprite = sprite.resize((nw, nh), Image.Resampling.LANCZOS)
    x = cx - nw // 2
    y = ground - nh
    base.paste(sprite, (x, y), sprite)


def draw_props(draw: ImageDraw.ImageDraw, scene: str) -> None:
    if scene == "on_top":
        draw.rounded_rectangle([225, 210, 375, 232], radius=5, fill=(120, 53, 15))
    elif scene == "in_box":
        draw.rounded_rectangle([235, 175, 365, 260], radius=8, fill=(217, 119, 6))
    elif scene == "give":
        draw.ellipse([292, 187, 328, 223], fill=(239, 68, 68))
    elif scene == "time":
        draw.ellipse([262, 82, 338, 158], outline=(17, 24, 39), width=3)
        draw.line([300, 120, 300, 95], fill=(17, 24, 39), width=3)
        draw.line([300, 120, 320, 120], fill=(17, 24, 39), width=3)
    elif scene == "happy_group":
        for i in range(5):
            x = 120 + i * 90
            y = 60 + (i % 2) * 20
            draw.polygon([(x, y), (x + 8, y - 16), (x + 16, y)], fill=(250, 204, 21))
    elif scene == "between":
        draw.line([185, 175, 415, 175], fill=(20, 184, 166), width=5)
    elif scene == "home":
        draw.polygon([(300, 95), (245, 145), (355, 145)], fill=(220, 38, 38))
        draw.rectangle([262, 145, 338, 197], fill=(253, 230, 138))
    elif scene == "learn":
        draw.rounded_rectangle([255, 130, 345, 195], radius=5, fill=(37, 99, 235))
    elif scene == "work":
        draw.rectangle([245, 155, 355, 169], fill=(120, 53, 15))
        draw.rounded_rectangle([268, 120, 332, 156], radius=4, fill=(55, 65, 81))
    elif scene == "run":
        pass
    elif scene == "tall_contrast":
        draw.line([530, 55, 530, 265], fill=(255, 255, 255), width=3)
    elif scene == "above":
        draw.rounded_rectangle([215, 205, 385, 227], radius=6, fill=(120, 53, 15))
    elif scene == "lazy_cat":
        draw.rounded_rectangle([210, 228, 390, 256], radius=10, fill=(20, 184, 166))


def render_scene(scene: str) -> Image.Image:
    base = gradient_bg().convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw_props(draw, scene)
    base = Image.alpha_composite(base, overlay)

    s = paste_sprite
    sc = SPRITE_SCALE

    if scene == "lazy_cat":
        s(base, "cat", 300, GROUND, sc["cat"] + 0.04)
    elif scene == "surprised_dog":
        s(base, "dog", 300, GROUND, sc["dog"] + 0.08)
    elif scene in ("tired_pig", "sad_pig"):
        s(base, "pig", 300, GROUND, sc["pig"] + 0.06)
    elif scene == "silly_cow":
        s(base, "cow", 300, GROUND, sc["cow"])
    elif scene in ("tall_contrast", "big_small"):
        s(base, "cow", 175, GROUND, sc["cow"] - 0.02)
        s(base, "pig", 435, GROUND, sc["pig"] - 0.02)
    elif scene == "between":
        s(base, "cow", 135, GROUND, sc["cow"] - 0.04)
        s(base, "cat", 300, GROUND, sc["cat"])
        s(base, "dog", 465, GROUND, sc["dog"])
    elif scene == "on_top":
        s(base, "cat", 300, 208, sc["cat"])
    elif scene == "in_box":
        s(base, "cat", 300, GROUND, sc["cat"])
    elif scene == "give":
        s(base, "cat", 225, GROUND, sc["cat"] - 0.02)
        s(base, "dog", 405, GROUND, sc["dog"])
    elif scene == "help":
        s(base, "dog", 265, GROUND, sc["dog"])
        s(base, "pig", 405, GROUND, sc["pig"])
    elif scene == "happy_group":
        s(base, "cat", 150, GROUND, sc["cat"] - 0.04)
        s(base, "cow", 265, GROUND, sc["cow"] - 0.04)
        s(base, "dog", 385, GROUND, sc["dog"] - 0.04)
        s(base, "pig", 495, GROUND, sc["pig"] - 0.04)
    elif scene == "run":
        s(base, "dog", 285, GROUND, sc["dog"] + 0.04)
        s(base, "cat", 430, GROUND, sc["cat"] - 0.02)
    elif scene == "home":
        s(base, "cat", 165, GROUND, sc["cat"] - 0.02)
        s(base, "dog", 435, GROUND, sc["dog"] - 0.02)
    elif scene == "learn":
        s(base, "cat", 165, GROUND, sc["cat"] - 0.02)
        s(base, "dog", 435, GROUND, sc["dog"] - 0.02)
    elif scene == "work":
        s(base, "cat", 165, GROUND, sc["cat"] - 0.02)
        s(base, "dog", 435, GROUND, sc["dog"] - 0.02)
    elif scene == "time":
        s(base, "cat", 165, GROUND, sc["cat"] - 0.02)
        s(base, "dog", 435, GROUND, sc["dog"] - 0.02)
    elif scene == "above":
        s(base, "cow", 300, 208, sc["cow"] - 0.04)
        s(base, "pig", 440, GROUND, sc["pig"] - 0.04)
    else:
        s(base, "cat", 210, GROUND, sc["cat"])
        s(base, "dog", 390, GROUND, sc["dog"])

    return base.convert("RGB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = load_manifest()
    words = sorted(manifest.keys())
    print(f"Rendering {len(words)} cast word images → {OUT}")
    for word in words:
        scene = manifest.get(word, "default_duo")
        img = render_scene(scene)
        out = OUT / f"{word}.jpg"
        img.save(out, "JPEG", quality=88, optimize=True)
        print(f"  {word} ({scene}) → {out.name}")
    meta = OUT / "cast-manifest.json"
    meta.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print("Done.")


if __name__ == "__main__":
    main()
