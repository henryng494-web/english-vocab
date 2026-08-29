#!/usr/bin/env python3
"""Prepare/status GenerateImage batches for jungle17 batches 041-049."""
import json
import os
import re
import sys

ART = "/opt/cursor/artifacts/assets"
CALLS_DIR = "/tmp/jungle17-calls-041-049"
BATCHES = range(41, 50)

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


def artifact_ok(filename: str) -> bool:
    path = os.path.join(ART, filename)
    return os.path.isfile(path) and os.path.getsize(path) > 0


def compact_desc(j):
    if BLOCKED_WORDS.search(j.get("word", "")):
        word = j.get("word", "word")
        cast = ", ".join(
            CAST_LABELS.get(os.path.basename(p).replace(".png", ""), "mascot")
            for p in j["reference_image_paths"]
        )
        return (
            f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast}. "
            f'Illustrate the English vocabulary word "{word}" with clear grounded props teaching its meaning. '
            f"Educational scene. Mascots max 55% frame height, centered. No text."
        )
    return j["description"]


def get_all_jobs():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for i, line in enumerate(f):
                if not line.strip():
                    continue
                job = json.loads(line)
                fn = job["filename"]
                jobs.append(
                    {
                        "batch": n,
                        "idx": i,
                        "word": job["word"],
                        "filename": fn,
                        "description": compact_desc(job),
                        "reference_image_paths": job.get("reference_image_paths", []),
                        "aspect_ratio": job.get("aspect_ratio", "16:9"),
                        "exists": artifact_ok(fn),
                    }
                )
    return jobs


def status():
    jobs = get_all_jobs()
    skipped = [j for j in jobs if j["exists"]]
    pending = [j for j in jobs if not j["exists"]]
    return {
        "total": len(jobs),
        "skipped": len(skipped),
        "generated": len(skipped),
        "failed": 0,
        "pending": len(pending),
        "pending_words": [j["word"] for j in pending],
    }


def prepare(limit=9999):
    pending = [j for j in get_all_jobs() if not j["exists"]]
    os.makedirs(CALLS_DIR, exist_ok=True)
    for old in os.listdir(CALLS_DIR):
        os.remove(os.path.join(CALLS_DIR, old))
    for i, j in enumerate(pending[:limit]):
        out = {
            k: j[k]
            for k in ("description", "filename", "reference_image_paths", "aspect_ratio", "word")
        }
        with open(f"{CALLS_DIR}/{i:04d}-{j['word']}.json", "w") as f:
            json.dump(out, f)
    return len(pending[:limit])


def next_call():
    pending = [j for j in get_all_jobs() if not j["exists"]]
    if not pending:
        sys.exit(1)
    j = pending[0]
    print(
        json.dumps(
            {
                k: j[k]
                for k in ("description", "filename", "reference_image_paths", "aspect_ratio", "word")
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        print(json.dumps(status()))
    elif cmd == "prepare":
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 9999
        print(json.dumps({"prepared": prepare(n), "dir": CALLS_DIR}))
    elif cmd == "next":
        next_call()
    else:
        sys.exit(1)
