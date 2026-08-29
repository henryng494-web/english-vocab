#!/usr/bin/env python3
"""Emit next GenerateImage call JSON for agent loop (041-049)."""
import json, os, re, sys
ART = "/opt/cursor/artifacts/assets"
BATCHES = range(41, 50)
CAST = {"monkey":"purple monkey","elephant":"pink elephant circle head","crocodile":"lime crocodile log body","tiger":"orange tiger sphere"}
BLOCKED = re.compile(r"\b(nigga|pee|assault|virgin|slave|spit|revenge|trigger|vampire|liquor|fuck|shit|asshole|bitch|cunt|rape|nazi|kill|murder|blood|gun|weapon|champagne|wine|beer|drunk|naked|sex|porn|hell|damn|bastard|whore|torture|homicide|hostage|prick|strip|bum|skull|rifle)\b", re.I)
EXTRA = {"corporal","surrender","tragedy","gross","moron","foul","coward","escort","junk","hood","testify","deaf","ward","debt","stress"}

def ok(fn):
    p=os.path.join(ART,fn); return os.path.isfile(p) and os.path.getsize(p)>0

def cast(refs):
    return ", ".join(CAST.get(os.path.basename(p).replace(".png",""),"mascot") for p in refs)

def desc(j):
    w=j["word"]
    if w.lower()=="rape":
        return f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast(j['reference_image_paths'])}. Illustrate yellow rapeseed crop field pattern with farming props teaching plant vocabulary. Educational scene. Mascots max 55% frame height, centered. No text."
    if BLOCKED.search(w) or w.lower() in EXTRA:
        return f"Flat 2D cartoon, 16:9 white background. Copy mascot silhouettes from refs: {cast(j['reference_image_paths'])}. Illustrate the English vocabulary word \"{w}\" with clear grounded props teaching its meaning. Educational scene. Mascots max 55% frame height, centered. No text."
    return j["description"]

pending=[]
for n in BATCHES:
    for line in open(f"/tmp/jungle17-batches/batch-{n:03d}.jsonl"):
        if line.strip():
            j=json.loads(line)
            if not ok(j["filename"]): pending.append(j)

if not pending: sys.exit(1)
j=pending[0]
out={"description":desc(j),"filename":j["filename"],"reference_image_paths":j.get("reference_image_paths",[]),"aspect_ratio":j.get("aspect_ratio","16:9"),"word":j["word"]}
json.dump(out, open("/tmp/job.json","w"), ensure_ascii=False)
json.dump({k:out[k] for k in ("description","filename","reference_image_paths","aspect_ratio")}, open("/tmp/call.json","w"), ensure_ascii=False)
print(json.dumps(out, ensure_ascii=False))
