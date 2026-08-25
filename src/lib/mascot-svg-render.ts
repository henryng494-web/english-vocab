import {
  MASCOT_CAST_VERSION,
  MASCOT_COLORS,
  type MascotCharacter,
  type MascotSceneType,
} from "@/lib/mascot-cast";
import {
  MASCOT_CAST_LINEUP_HEIGHT,
  MASCOT_CAST_LINEUP_WIDTH,
  MASCOT_SPRITES,
} from "@/lib/mascot-sprites";

const W = 600;
const H = 350;
const GROUND = 292;

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let spriteClipCounter = 0;

function drawSprite(
  character: MascotCharacter,
  cx: number,
  ground: number,
  scale: number,
  lineupHref: string,
): string {
  const sp = MASCOT_SPRITES[character];
  const displayH = sp.imgH * scale;
  const displayW = sp.imgW * scale;
  const x = cx - displayW / 2;
  const y = ground - sp.footY * scale;
  const clipId = `mascot-${character}-${spriteClipCounter++}`;

  return `
    <defs>
      <clipPath id="${clipId}">
        <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${displayW.toFixed(1)}" height="${displayH.toFixed(1)}"/>
      </clipPath>
    </defs>
    <image
      href="${lineupHref}"
      x="${(x - sp.imgX * scale).toFixed(1)}"
      y="${(y - sp.imgY * scale).toFixed(1)}"
      width="${(MASCOT_CAST_LINEUP_WIDTH * scale).toFixed(1)}"
      height="${(MASCOT_CAST_LINEUP_HEIGHT * scale).toFixed(1)}"
      clip-path="url(#${clipId})"
      preserveAspectRatio="xMidYMid meet"
    />
  `;
}

function background(): string {
  return `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="${MASCOT_COLORS.skyTop}"/>
        <stop offset="100%" stop-color="${MASCOT_COLORS.skyBottom}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="${MASCOT_COLORS.ground}"/>
  `;
}

function wordSceneOverride(
  word: string,
  scene: MascotSceneType,
): MascotSceneType {
  const w = word.trim().toLowerCase();
  if (w === "happy") return "happy_group";
  if (w === "broken" || w === "break") return "broken_thing";
  if (w === "important") return "important_badge";
  if (w === "fighting" || w === "fight") return "angry_cat";
  if (w === "lazy") return "lazy_cat";
  if (w === "sad") return "sad_pig";
  if (w === "tired") return "tired_pig";
  if (w === "surprised" || w === "surprise") return "surprised_dog";
  return scene;
}

function propsForScene(scene: MascotSceneType): string {
  switch (scene) {
    case "happy_group":
      return `
        ${[0, 1, 2, 3, 4].map((i) => `<polygon points="${120 + i * 90},${60 + (i % 2) * 20} ${128 + i * 90},${44 + (i % 2) * 20} ${136 + i * 90},${60 + (i % 2) * 20}" fill="#FACC15"/>`).join("")}
        <circle cx="500" cy="70" r="8" fill="#F472B6"/><circle cx="520" cy="90" r="6" fill="#60A5FA"/>
      `;
    case "broken_thing":
      return `
        <rect x="250" y="170" width="100" height="70" rx="8" fill="#E5E7EB" stroke="#6B7280" stroke-width="3"/>
        <path d="M290 175 L320 235 M320 175 L290 235" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/>
      `;
    case "important_badge":
      return `
        <polygon points="300,75 318,115 360,120 328,145 338,185 300,165 262,185 272,145 240,120 282,115" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/>
        <text x="300" y="138" text-anchor="middle" font-size="22" font-weight="700" fill="#92400E">!</text>
      `;
    case "rain":
      return Array.from({ length: 14 }, (_, i) =>
        `<line x1="${40 + i * 40}" y1="50" x2="${34 + i * 40}" y2="85" stroke="#2563EB" stroke-width="3"/>`,
      ).join("");
    case "eat":
      return `<circle cx="300" cy="175" r="30" fill="#EF4444"/><rect x="286" y="152" width="28" height="10" fill="#16A34A"/>`;
    case "time":
      return `<circle cx="300" cy="120" r="38" fill="#fff" stroke="#111" stroke-width="3"/><line x1="300" y1="120" x2="300" y2="95" stroke="#111" stroke-width="3"/><line x1="300" y1="120" x2="320" y2="120" stroke="#111" stroke-width="3"/>`;
    case "home":
      return `<polygon points="300,95 245,145 355,145" fill="#DC2626"/><rect x="262" y="145" width="76" height="52" fill="#FDE68A"/>`;
    case "learn":
      return `<rect x="255" y="130" width="90" height="65" rx="5" fill="#2563EB"/><rect x="268" y="142" width="64" height="8" fill="#fff"/>`;
    case "work":
      return `<rect x="245" y="155" width="110" height="14" fill="#78350F"/><rect x="268" y="120" width="64" height="36" rx="4" fill="#374151"/>`;
    case "money":
      return `<circle cx="285" cy="170" r="20" fill="#FACC15"/><circle cx="320" cy="182" r="20" fill="#FACC15"/>`;
    case "between":
      return `<path d="M185 175 H415" stroke="#14B8A6" stroke-width="5"/><polygon points="415,175 405,168 405,182" fill="#14B8A6"/><polygon points="185,175 195,168 195,182" fill="#14B8A6"/>`;
    case "under":
      return `<ellipse cx="300" cy="165" rx="130" ry="45" fill="#16A34A"/>`;
    case "above":
      return `<rect x="215" y="205" width="170" height="22" rx="6" fill="#78350F"/>`;
    case "in_box":
      return `<rect x="235" y="175" width="130" height="85" rx="8" fill="#D97706"/>`;
    case "on_top":
      return `<rect x="225" y="210" width="150" height="22" rx="5" fill="#78350F"/>`;
    case "give":
      return `<circle cx="310" cy="205" r="18" fill="#EF4444"/>`;
    default:
      return "";
  }
}

function sceneContent(
  scene: MascotSceneType,
  word: string,
  lineupHref: string,
): string {
  spriteClipCounter = 0;
  const resolved = wordSceneOverride(word, scene);
  const props = propsForScene(resolved);
  const s = (character: MascotCharacter, cx: number, ground: number, scale: number) =>
    drawSprite(character, cx, ground, scale, lineupHref);

  switch (resolved) {
    case "lazy_cat":
      return `${props}${s("cat", 300, GROUND, 0.34)}<rect x="210" y="228" width="180" height="28" rx="10" fill="#14B8A6" opacity="0.45"/>`;
    case "surprised_dog":
      return `${props}${s("dog", 300, GROUND, 0.34)}`;
    case "tired_pig":
    case "sad_pig":
      return `${props}${s("pig", 300, GROUND, 0.36)}`;
    case "silly_cow":
      return `${props}${s("cow", 300, GROUND, 0.28)}`;
    case "tall_contrast":
    case "big_small":
      return `${props}${s("cow", 175, GROUND, 0.26)}${s("pig", 435, GROUND, 0.28)}<line x1="530" y1="55" x2="530" y2="265" stroke="#fff" stroke-width="3" stroke-dasharray="8 6"/>`;
    case "between":
      return `${props}${s("cow", 135, GROUND, 0.22)}${s("cat", 300, GROUND, 0.3)}${s("dog", 465, GROUND, 0.3)}`;
    case "under":
      return `${props}${s("cat", 290, GROUND + 15, 0.28)}${s("pig", 430, GROUND, 0.26)}`;
    case "above":
      return `${props}${s("cow", 300, 208, 0.22)}${s("pig", 440, GROUND, 0.24)}`;
    case "in_box":
      return `${props}${s("cat", 300, GROUND, 0.3)}`;
    case "on_top":
      return `${props}${s("cat", 300, 208, 0.28)}`;
    case "rain":
      return `${props}${s("cow", 155, GROUND, 0.22)}${s("cat", 300, GROUND, 0.28)}${s("dog", 445, GROUND, 0.28)}`;
    case "cold":
      return `${s("cat", 195, GROUND, 0.28)}${s("cow", 330, GROUND, 0.22)}${s("pig", 475, GROUND, 0.24)}`;
    case "hot":
      return `${s("pig", 300, GROUND, 0.34)}<circle cx="300" cy="85" r="30" fill="#FBBF24"/>`;
    case "eat":
      return `${props}${s("cat", 175, GROUND, 0.28)}${s("pig", 425, GROUND, 0.3)}`;
    case "run":
      return `${props}${s("dog", 285, GROUND, 0.32)}${s("cat", 430, GROUND, 0.28)}`;
    case "sleep":
      return `${s("cat", 300, GROUND, 0.34)}<text x="420" y="95" font-size="32" fill="#fff" font-weight="700">Zzz</text>`;
    case "give":
      return `${props}${s("cat", 225, GROUND, 0.28)}${s("dog", 405, GROUND, 0.3)}`;
    case "help":
      return `${s("dog", 265, GROUND, 0.28)}${s("pig", 405, GROUND, 0.28)}`;
    case "happy_group":
      return `${props}${s("cat", 150, GROUND, 0.26)}${s("cow", 265, GROUND, 0.22)}${s("dog", 385, GROUND, 0.26)}${s("pig", 495, GROUND, 0.24)}`;
    case "broken_thing":
      return `${props}${s("cat", 200, GROUND, 0.28)}${s("dog", 400, GROUND, 0.3)}`;
    case "important_badge":
      return `${props}${s("cat", 210, GROUND, 0.28)}${s("dog", 390, GROUND, 0.3)}`;
    case "angry_cat":
      return `${s("cat", 300, GROUND, 0.34)}<path d="M245 115 Q300 85 355 115" fill="none" stroke="#EF4444" stroke-width="5"/>`;
    case "work":
    case "learn":
    case "home":
    case "time":
    case "money":
      return `${props}${s("cat", 165, GROUND, 0.28)}${s("dog", 435, GROUND, 0.28)}`;
    default:
      return `${props}${s("cat", 225, GROUND, 0.3)}${s("dog", 375, GROUND, 0.3)}`;
  }
}

export function renderMascotSceneSvg(
  scene: MascotSceneType,
  word: string,
  pos?: string | null,
  lineupHref?: string,
): string {
  const safeWord = esc(word.trim().toLowerCase() || "word");
  const safePos = esc((pos?.trim().toUpperCase() || "VOCABULARY").slice(0, 16));
  const resolvedScene = wordSceneOverride(word, scene);
  const href = lineupHref?.trim() || "";
  if (!href) {
    throw new Error("renderMascotSceneSvg requires an embedded cast lineup href");
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- ${MASCOT_CAST_VERSION} word=${safeWord} scene=${resolvedScene} -->
  ${background()}
  <rect x="18" y="16" width="118" height="28" rx="14" fill="#1D4ED8"/>
  <text x="77" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#fff">${safePos}</text>
  ${sceneContent(scene, word, href)}
</svg>`;
}

export function mascotSvgToDataUrl(svg: string): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}
