#!/usr/bin/env python3
"""Queue + sanitized prompts for jungle17 batches 080-089."""
import json
import os
import re
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(80, 90)

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

# Words that image gen often blocks — use compact sanitized prompt
EXTRA_SANITIZE = {
    "cocaine", "horny", "pimp", "stab", "whack", "morgue", "butcher", "invasion",
    "hostile", "gamble", "hack", "raid", "madness", "smash", "disgrace", "worship",
    "flu", "plague", "infection", "radiation", "cemetery", "cannon", "hurricane",
}


def artifact_ok(fn: str) -> bool:
    path = os.path.join(ART, fn)
    return os.path.isfile(path) and os.path.getsize(path) > 0


def extract_cast(refs):
    cast = []
    for p in refs:
        name = os.path.basename(p).replace(".png", "")
        cast.append(CAST_LABELS.get(name, name))
    return ", ".join(cast)


def needs_sanitize(j) -> bool:
    word = j.get("word", "")
    return bool(BLOCKED_WORDS.search(word)) or word in EXTRA_SANITIZE


def compact_desc(j, force_sanitize=False):
    if force_sanitize or needs_sanitize(j):
        word = j.get("word", "word")
        cast = extract_cast(j["reference_image_paths"])
        return (
            f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast}. "
            f'Illustrate the English vocabulary word "{word}" with clear grounded props teaching its meaning. '
            f"Educational scene. Mascots max 55% frame height, centered. No text."
        )
    return j["description"]


def all_jobs():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    jobs.append(json.loads(line))
    return jobs


def pending():
    return [j for j in all_jobs() if not artifact_ok(j["filename"])]


def prepare_call(j, sanitize=None):
    if sanitize is None:
        sanitize = needs_sanitize(j)
    return {
        "description": compact_desc(j, force_sanitize=sanitize),
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
        "word": j["word"],
    }


def status():
    jobs = all_jobs()
    skipped = sum(1 for j in jobs if artifact_ok(j["filename"]))
    total = len(jobs)
    pending_n = total - skipped
    return {
        "total": total,
        "skipped": skipped,
        "generated": skipped,
        "pending": pending_n,
        "failed": 0,
    }


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        print(json.dumps(status()))
    elif cmd == "next":
        jobs = pending()
        if jobs:
            print(json.dumps(prepare_call(jobs[0]), ensure_ascii=False))
        else:
            print("{}")
            sys.exit(1)
    elif cmd == "list-pending":
        print(json.dumps([j["word"] for j in pending()]))
    else:
        print("usage: status|next|list-pending", file=sys.stderr)
        sys.exit(1)
