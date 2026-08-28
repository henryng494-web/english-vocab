#!/usr/bin/env python3
"""Print GenerateImage args JSON for next pending job (090-099), sanitized."""
import json
import os
import re
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(90, 100)
CAST = {
    "monkey": "purple monkey",
    "elephant": "pink elephant circle head",
    "crocodile": "lime crocodile log body",
    "tiger": "orange tiger sphere",
}
BLOCKED = re.compile(
    r"\b(nigga|pee|assault|virgin|slave|spit|revenge|trigger|vampire|liquor|fuck|shit|asshole|bitch|cunt|rape|nazi|kill|murder|blood|gun|weapon|champagne|wine|beer|drunk|naked|sex|porn|hell|damn|bastard|whore|torture|homicide|hostage|prick|strip|bum|skull|rifle)\b",
    re.I,
)
EXTRA = {
    "corporal", "surrender", "tragedy", "gross", "moron", "foul", "coward",
    "escort", "junk", "hood", "testify", "deaf", "ward", "debt", "stress",
}


def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def cast(refs):
    return ", ".join(
        CAST.get(os.path.basename(p).replace(".png", ""), "mascot") for p in refs
    )


def desc(j):
    w = j["word"]
    if w.lower() == "rape":
        return (
            f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast(j['reference_image_paths'])}. "
            "Illustrate yellow rapeseed crop field pattern with farming props teaching plant vocabulary. "
            "Educational scene. Mascots max 55% frame height, centered. No text."
        )
    if BLOCKED.search(w) or w.lower() in EXTRA:
        return (
            f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast(j['reference_image_paths'])}. "
            f'Illustrate the English vocabulary word "{w}" with clear grounded props teaching its meaning. '
            "Educational scene. Mascots max 55% frame height, centered. No text."
        )
    return j["description"]


def pending_jobs():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    j = json.loads(line)
                    if not ok(j["filename"]):
                        jobs.append(j)
    return jobs


if __name__ == "__main__":
    pending = pending_jobs()
    if not pending:
        print("null")
        sys.exit(0)
    j = pending[0]
    out = {
        "description": desc(j),
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
        "word": j["word"],
    }
    print(json.dumps(out, ensure_ascii=False))
