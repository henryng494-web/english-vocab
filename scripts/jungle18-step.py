#!/usr/bin/env python3
"""Export next N pending jobs into individual JSON files in /tmp/jungle18-work/"""
import json, os, re, sys, shutil

ART = "/opt/cursor/artifacts/assets"
WORK = "/tmp/jungle18-work"
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

EXISTING = set(os.listdir(ART)) if os.path.isdir(ART) else set()

def ok(fn):
    return fn in EXISTING

def cast(refs):
    return ", ".join(CAST.get(os.path.basename(p).replace(".png", ""), "mascot") for p in refs)

def desc(j):
    w = j["word"]
    if BLOCKED.search(w):
        return f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast(j['reference_image_paths'])}. Illustrate the English vocabulary word \"{w}\" with clear grounded props teaching its meaning. Educational scene. Mascots max 55% frame height, centered. No text."
    return j["description"]

def main():
    if len(sys.argv) < 3:
        print("Usage: jungle18-step.py <from_batch_int> <to_batch_int> [count]", file=sys.stderr)
        sys.exit(1)
    b_from = int(sys.argv[1])
    b_to = int(sys.argv[2])
    count = int(sys.argv[3]) if len(sys.argv) > 3 else 5
    
    if os.path.exists(WORK):
        shutil.rmtree(WORK)
    os.makedirs(WORK, exist_ok=True)
    
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
                    
    batch = pending[:count]
    print(f"Pending: {len(pending)}, preparing {len(batch)} jobs in {WORK}")
    
    manifest = []
    for idx, j in enumerate(batch):
        out = {
            "description": desc(j),
            "filename": j["filename"],
            "reference_image_paths": j.get("reference_image_paths", []),
            "aspect_ratio": j.get("aspect_ratio", "16:9"),
            "word": j["word"],
        }
        file_path = f"{WORK}/job-{idx}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
        manifest.append(file_path)
        
    print(json.dumps(manifest))

if __name__ == "__main__":
    main()
