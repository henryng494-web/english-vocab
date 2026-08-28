#!/usr/bin/env python3
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

def ok(fn):
    p = os.path.join(ART, fn)
    return (os.path.isfile(p) and os.path.getsize(p) > 0) or \
           (os.path.isfile(p + ".png") and os.path.getsize(p + ".png") > 0) or \
           (os.path.isfile(p + ".jpg") and os.path.getsize(p + ".jpg") > 0)



def cast(refs):
    return ", ".join(CAST.get(os.path.basename(p).replace(".png", ""), "mascot") for p in refs)

def desc(j):
    w = j["word"]
    if BLOCKED.search(w):
        return f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast(j['reference_image_paths'])}. Illustrate the English vocabulary word \"{w}\" with clear grounded props teaching its meaning. Educational scene. Mascots max 55% frame height, centered. No text."
    return j["description"]

def main():
    b_from = int(sys.argv[1])
    b_to = int(sys.argv[2])
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    
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
                    
    results = []
    for j in pending[:limit]:
        results.append({
            "description": desc(j),
            "filename": j["filename"],
            "reference_image_paths": j.get("reference_image_paths", []),
            "aspect_ratio": j.get("aspect_ratio", "16:9"),
            "word": j["word"],
        })
    print(json.dumps(results, ensure_ascii=False))

if __name__ == "__main__":
    main()
