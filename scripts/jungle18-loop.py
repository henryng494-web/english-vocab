#!/usr/bin/env python3
"""Emit next GenerateImage call JSON for jungle18 agent loops."""
import json, os, re, sys

ART = "/opt/cursor/artifacts/assets"
CAST = {
    "monkey": "purple monkey",
    "elephant": "pink elephant circle head",
    "crocodile": "lime crocodile log body",
    "tiger": "orange tiger sphere",
}
BLOCKED = re.compile(
    r"\b(nigga|pee|assault|virgin|slave|spit|revenge|trigger|vampire|liquor|fuck|shit|asshole|bitch|cunt|rape|nazi|kill|murder|blood|gun|weapon|champagne|wine|beer|drunk|naked|sex|porn|hell|damn|bastard|whore|torture|homicide|hostage|prick|strip|bum|skull|rifle|terrorist|cocaine|heroin|suicide|corpse|execution|cannibal|mutilat|genocide)\b",
    re.I,
)

def get_existing():
    try:
        if os.path.isdir(ART):
            return set(os.listdir(ART))
    except Exception:
        pass
    return set()

EXISTING = get_existing()

def ok(fn):
    return fn in EXISTING or f"{fn}.png" in EXISTING or f"{fn}.jpg" in EXISTING

def cast(refs):
    return ", ".join(CAST.get(os.path.basename(p).replace(".png", ""), "mascot") for p in refs)

def desc(j):
    w = j["word"]
    if BLOCKED.search(w):
        return f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast(j['reference_image_paths'])}. Illustrate the English vocabulary word \"{w}\" with clear grounded props teaching its meaning. Educational scene. Mascots max 55% frame height, centered. No text."
    return j["description"]

def main():
    if len(sys.argv) < 3:
        print("Usage: jungle18-loop.py <from_batch_int> <to_batch_int>", file=sys.stderr)
        sys.exit(1)
    b_from = int(sys.argv[1])
    b_to = int(sys.argv[2])
    
    pending = []
    for n in range(b_from, b_to + 1):
        batch_file = f"/tmp/jungle18-batches/batch-{n:03d}.jsonl"
        if not os.path.isfile(batch_file):
            continue
        for line in open(batch_file):
            if line.strip():
                j = json.loads(line)
                if not ok(j["filename"]):
                    pending.append(j)
                    
    if not pending:
        # None left
        sys.exit(0)
        
    j = pending[0]
    out = {
        "description": desc(j),
        "filename": j["filename"],
        "reference_image_paths": j.get("reference_image_paths", []),
        "aspect_ratio": j.get("aspect_ratio", "16:9"),
        "word": j["word"],
        "remaining_in_range": len(pending)
    }
    print(json.dumps(out, ensure_ascii=False))

if __name__ == "__main__":
    main()
