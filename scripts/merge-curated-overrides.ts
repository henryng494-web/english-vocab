/** One-time helper — merge legacy hand-tuned phrases into curated-image-overrides.ts */
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

function parseTsExport(content: string): Record<string, string> {
  const m = content.match(/= \{([\s\S]*)\};/);
  if (!m) return {};
  const entries: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^\s+([a-z0-9'-]+):\s+"((?:\\.|[^"])*)"/);
    if (mm) entries[mm[1]] = mm[2].replace(/\\"/g, '"');
  }
  return entries;
}

const merged: Record<string, string> = {};
for (const f of [
  "src/data/curated-image-keywords-rank-101-300.ts",
  "src/data/curated-image-keywords-rank-301-500.ts",
]) {
  try {
    const content = execSync(`git show HEAD:${f}`, { encoding: "utf8" });
    Object.assign(merged, parseTsExport(content));
  } catch {
    /* skip */
  }
}

const legacyOverrides: Record<string, string> = {
  orange: "fresh orange fruit sliced on plate",
  pay: "person paying with credit card at counter",
  happen: "unexpected surprise moment outdoors",
  true: "green check mark correct answer",
  town: "small town main street shops",
  afraid: "person scared covering face hands",
  hurt: "bandage on injured knee closeup",
  heart: "red heart shape hands gesture love",
  young: "young couple smiling outdoors together",
  everyone: "diverse crowd of people together",
  chance: "rolling dice on game table luck",
  number: "numbers written on classroom chalkboard",
  change: "coins and cash money exchange",
  week: "weekly calendar planner on desk",
  point: "finger pointing at map location",
  police: "police officer uniform street patrol",
  fun: "friends laughing playing board game",
  wish: "person blowing dandelion seeds wish",
  game: "family playing board game table",
  party: "birthday party balloons and cake",
  cut: "kitchen knife cutting fresh vegetables",
  sleep: "person sleeping peacefully in bed",
  shot: "basketball player shooting hoop",
  trouble: "person worried looking at broken car",
  couple: "romantic couple holding hands park",
  marry: "wedding rings on hands ceremony",
  president: "presidential podium flags speech",
  hope: "person looking sunrise horizon hopeful",
  truth: "magnifying glass on document truth",
  school: "school building entrance students",
  face: "closeup smiling human face portrait",
  fact: "checked facts list on clipboard",
  street: "busy city street crosswalk people",
  country: "countryside green hills landscape flag",
  music: "person listening headphones enjoying music",
  child: "happy child playing with toys",
  send: "hand placing letter in mailbox",
  meet: "two people shaking hands meeting",
  record: "vinyl record spinning on turntable",
  explain: "teacher explaining lesson whiteboard",
  develop: "plant seedling growing in soil",
  report: "news reporter microphone live broadcast",
  support: "hands supporting stacked books together",
  produce: "farmer harvesting fresh vegetables basket",
  design: "architect drawing building blueprint desk",
  compare: "two products side by side comparison",
  consider: "person thinking chin hand decision",
  create: "artist hands creating pottery clay",
  provide: "hands giving food donation box",
  require: "required field form asterisk mark",
  increase: "graph arrow increasing upward chart",
  include: "open suitcase including clothes items",
  continue: "hiker continuing path through forest",
  expect: "person waiting looking at watch",
  remember: "person writing memories diary journal",
  accept: "handshake accepting job offer",
  appear: "sun appearing over mountain horizon",
  arrive: "train arriving at station platform",
  become: "caterpillar becoming butterfly transformation",
};

Object.assign(merged, legacyOverrides);

const lines = Object.entries(merged)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([word, phrase]) => `  ${word}: "${phrase.replace(/"/g, '\\"')}",`)
  .join("\n");

const content = `/**
 * Hand-tuned stock-photo overrides for high-traffic / ambiguous words.
 * Merged from legacy rank-band curation — checked before auto-generated phrases.
 */
export const CURATED_IMAGE_OVERRIDES: Readonly<Record<string, string>> = {
${lines}
};
`;

writeFileSync("src/data/curated-image-overrides.ts", content, "utf8");
console.log("Wrote overrides:", Object.keys(merged).length);
