#!/usr/bin/env python3
"""Export pending jungle17 011-019 jobs as individual call JSON files."""
import json
import os
import re
import sys

ART = "/opt/cursor/artifacts/assets"
BATCHES = range(11, 20)
OUT = "/tmp/jungle17-calls-011-019"

CAST = {"monkey": "purple monkey", "elephant": "pink elephant circle head",
        "crocodile": "lime crocodile log body", "tiger": "orange tiger sphere"}
BLOCKED = re.compile(
    r"\b(champagne|wine|beer|drunk|naked|sex|porn|hell|damn|bastard|whore|"
    r"nigga|pee|assault|virgin|slave|spit|revenge|trigger|vampire|liquor|"
    r"fuck|shit|asshole|bitch|cunt|rape|nazi|kill|murder|blood|gun|weapon|demon)\b", re.I)


def ok(fn):
    p = os.path.join(ART, fn)
    return os.path.isfile(p) and os.path.getsize(p) > 0


def cast(refs):
    return ", ".join(CAST.get(os.path.basename(p).replace(".png", ""), "mascot") for p in refs)


def sanitize(j):
    w = j["word"]
    return (
        f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast(j['reference_image_paths'])}. "
        f'Illustrate the English vocabulary word "{w}" with clear grounded props teaching its meaning. '
        f"Educational scene. Mascots max 55% frame height, centered. No text."
    )


def pending():
    jobs = []
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    j = json.loads(line)
                    if not ok(j["filename"]):
                        jobs.append(j)
    return jobs


def export(limit=9999):
    os.makedirs(OUT, exist_ok=True)
    jobs = pending()[:limit]
    for i, j in enumerate(jobs):
        desc = j["description"]
        if BLOCKED.search(j["word"]):
            desc = sanitize(j)
        path = f"{OUT}/{i:04d}-{j['word']}.json"
        with open(path, "w") as f:
            json.dump({
                "word": j["word"],
                "description": desc,
                "filename": j["filename"],
                "reference_image_paths": j.get("reference_image_paths", []),
                "aspect_ratio": j.get("aspect_ratio", "16:9"),
            }, f)
    print(json.dumps({"exported": len(jobs), "dir": OUT}))


def status():
    total = have = 0
    for n in BATCHES:
        with open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl") as f:
            for line in f:
                if line.strip():
                    total += 1
                    if ok(json.loads(line)["filename"]):
                        have += 1
    print(json.dumps({"total": total, "generated": have, "skipped": have, "pending": total - have}))


if __name__ == "__main__":
    if sys.argv[1] == "export":
        export(int(sys.argv[2]) if len(sys.argv) > 2 else 9999)
    elif sys.argv[1] == "status":
        status()
    elif sys.argv[1] == "list":
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        files = sorted(os.listdir(OUT))[:n]
        for fn in files:
            j = json.load(open(f"{OUT}/{fn}"))
            print(j["word"], ok(j["filename"]))
