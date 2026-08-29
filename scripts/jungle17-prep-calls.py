#!/usr/bin/env python3
"""Prepare GenerateImage call specs for all pending jungle17 batches 011-019."""
import json
import os
import re
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(11, 20)

CAST_LABELS = {
    "monkey": "purple monkey",
    "elephant": "pink elephant circle head",
    "crocodile": "lime crocodile log body",
    "tiger": "orange tiger sphere",
}

SANITIZED = {}
BLOCKED_WORDS = re.compile(
    r"\b(nigga|pee|assault|virgin|slave|spit|revenge|trigger|vampire|liquor|"
    r"fuck|shit|asshole|bitch|cunt|rape|nazi|kill|murder|blood|gun|weapon|"
    r"champagne|wine|beer|drunk|naked|sex|porn|hell|damn|bastard|whore)\b",
    re.I,
)


def artifact_ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def extract_word(desc):
    m = re.search(r'Word "([^"]+)"', desc)
    return m.group(1) if m else "word"


def extract_cast(refs):
    return ", ".join(
        CAST_LABELS.get(os.path.basename(p).replace(".png", ""), "mascot") for p in refs
    )


def compact_desc(j, force=False):
    fn = j["filename"]
    if fn in SANITIZED:
        return SANITIZED[fn]
    word = j.get("word") or extract_word(j["description"])
    if force or BLOCKED_WORDS.search(word):
        cast = extract_cast(j["reference_image_paths"])
        return (
            f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast}. "
            f'Illustrate the English vocabulary word "{word}" with clear grounded props teaching its meaning. '
            f"Educational scene. Mascots max 55% frame height, centered. No text."
        )
    return j["description"]


def pending_jobs():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    j = json.loads(line)
                    if not artifact_ok(j["filename"]):
                        jobs.append(j)
    return jobs


def prepare(j):
    return {
        "word": j["word"],
        "description": compact_desc(j),
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
    }


def status():
    total = 0
    have = 0
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    total += 1
                    j = json.loads(line)
                    if artifact_ok(j["filename"]):
                        have += 1
    return {"total": total, "generated": have, "skipped": have, "pending": total - have}


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        print(json.dumps(status()))
    elif cmd == "export":
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 9999
        out = [prepare(j) for j in pending_jobs()[:n]]
        path = sys.argv[3] if len(sys.argv) > 3 else "/tmp/jungle17-pending-calls.json"
        with open(path, "w") as f:
            json.dump(out, f)
        print(json.dumps({"exported": len(out), "path": path}))
    elif cmd == "next":
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 2
        print(json.dumps([prepare(j) for j in pending_jobs()[:n]], ensure_ascii=False))
    else:
        sys.exit(1)
