#!/usr/bin/env python3
"""Queue + compact/sanitized prompts for jungle17 batches 050-059."""
import json
import os
import re
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(50, 60)

CAST_LABELS = {
    "monkey": "purple monkey",
    "elephant": "pink elephant circle head",
    "crocodile": "lime crocodile log body",
    "tiger": "orange tiger sphere",
}

BLOCKED_WORDS = re.compile(
    r"\b(nigga|pee|assault|virgin|slave|spit|revenge|trigger|vampire|liquor|"
    r"fuck|shit|asshole|bitch|cunt|rape|nazi|kill|murder|blood|gun|weapon|"
    r"champagne|wine|beer|drunk|naked|sex|porn|hell|damn|bastard|whore)\b",
    re.I,
)


def artifact_ok(fn: str) -> bool:
    path = os.path.join(ART, fn)
    return os.path.isfile(path) and os.path.getsize(path) > 0


def extract_cast(refs):
    cast = []
    for p in refs:
        name = os.path.basename(p).replace(".png", "")
        cast.append(CAST_LABELS.get(name, name))
    return ", ".join(cast)


def compact_desc(j, force_sanitize=False):
    if force_sanitize or BLOCKED_WORDS.search(j.get("word", "")):
        word = j.get("word", "word")
        cast = extract_cast(j["reference_image_paths"])
        return (
            f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast}. "
            f'Illustrate the English vocabulary word "{word}" with clear grounded props teaching its meaning. '
            f"Educational scene. Mascots max 55% frame height, centered. No text."
        )
    return j["description"]


def pending():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    j = json.loads(line)
                    if not artifact_ok(j["filename"]):
                        jobs.append(j)
    return jobs


def prepare_call(j, sanitize=False):
    return {
        "description": compact_desc(j, force_sanitize=sanitize),
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
        "word": j["word"],
    }


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        jobs = pending()
        print(json.dumps({"pending": len(jobs)}))
    elif cmd == "next":
        sanitize = "--sanitize" in sys.argv
        jobs = pending()
        if not jobs:
            sys.exit(1)
        print(json.dumps(prepare_call(jobs[0], sanitize=sanitize), ensure_ascii=False))
    else:
        sys.exit(1)
