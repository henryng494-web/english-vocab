import {
  MASCOT_CAST_VERSION,
  MASCOT_COLORS,
  type MascotExpression,
  type MascotSceneType,
} from "@/lib/mascot-cast";

const W = 600;
const H = 350;
const GROUND = 290;

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function eyes(
  cx: number,
  cy: number,
  expression: MascotExpression,
  r = 14,
): string {
  if (expression === "unamused" || expression === "tired") {
    return `
      <ellipse cx="${cx - 16}" cy="${cy}" rx="${r}" ry="${r * 0.55}" fill="#fff"/>
      <ellipse cx="${cx + 16}" cy="${cy}" rx="${r}" ry="${r * 0.55}" fill="#fff"/>
      <circle cx="${cx - 16}" cy="${cy + 2}" r="3" fill="#111"/>
      <circle cx="${cx + 16}" cy="${cy + 2}" r="3" fill="#111"/>
    `;
  }
  if (expression === "surprised") {
    return `
      <circle cx="${cx - 16}" cy="${cy}" r="${r}" fill="#fff"/>
      <circle cx="${cx + 16}" cy="${cy}" r="${r}" fill="#fff"/>
      <circle cx="${cx - 16}" cy="${cy}" r="4" fill="#111"/>
      <circle cx="${cx + 16}" cy="${cy}" r="4" fill="#111"/>
      <ellipse cx="${cx}" cy="${cy + 28}" rx="10" ry="14" fill="#111"/>
    `;
  }
  if (expression === "silly") {
    return `
      <circle cx="${cx - 16}" cy="${cy}" r="${r}" fill="#fff"/>
      <path d="M${cx + 4} ${cy - 6} Q${cx + 22} ${cy} ${cx + 4} ${cy + 6}" fill="none" stroke="#111" stroke-width="3"/>
      <circle cx="${cx - 16}" cy="${cy}" r="3" fill="#111"/>
      <ellipse cx="${cx + 30}" cy="${cy + 10}" rx="16" ry="10" fill="#F472B6"/>
    `;
  }
  return `
    <circle cx="${cx - 16}" cy="${cy}" r="${r}" fill="#fff"/>
    <circle cx="${cx + 16}" cy="${cy}" r="${r}" fill="#fff"/>
    <circle cx="${cx - 16}" cy="${cy}" r="3" fill="#111"/>
    <circle cx="${cx + 16}" cy="${cy}" r="3" fill="#111"/>
  `;
}

function drawCat(
  cx: number,
  ground: number,
  expression: MascotExpression = "unamused",
): string {
  const y = ground - 55;
  return `
    <g>
      <ellipse cx="${cx}" cy="${y + 38}" rx="42" ry="28" fill="${MASCOT_COLORS.catBody}"/>
      <path d="M${cx - 28} ${y - 8} L${cx - 18} ${y - 28} L${cx - 8} ${y - 8} Z" fill="${MASCOT_COLORS.catBody}"/>
      <path d="M${cx + 8} ${y - 8} L${cx + 18} ${y - 28} L${cx + 28} ${y - 8} Z" fill="${MASCOT_COLORS.catBody}"/>
      <circle cx="${cx}" cy="${y + 8}" r="24" fill="${MASCOT_COLORS.catBody}"/>
      ${eyes(cx, y + 4, expression, 11)}
      <path d="M${cx - 6} ${y + 18} Q${cx} ${y + 14} ${cx + 6} ${y + 18}" fill="none" stroke="#374151" stroke-width="2"/>
      <rect x="${cx - 20}" y="${y + 24}" width="40" height="8" rx="4" fill="${MASCOT_COLORS.catCollar}"/>
      <circle cx="${cx}" cy="${y + 32}" r="4" fill="#FDE68A"/>
      <path d="M${cx + 34} ${y + 40} Q${cx + 58} ${y + 20} ${cx + 48} ${y + 52}" fill="none" stroke="${MASCOT_COLORS.catBody}" stroke-width="10" stroke-linecap="round"/>
      <path d="M${cx - 34} ${y + 10} L${cx - 52} ${y + 12}" stroke="${MASCOT_COLORS.catStripe}" stroke-width="2"/>
      <path d="M${cx + 34} ${y + 10} L${cx + 52} ${y + 12}" stroke="${MASCOT_COLORS.catStripe}" stroke-width="2"/>
    </g>
  `;
}

function drawCow(
  cx: number,
  ground: number,
  expression: MascotExpression = "silly",
): string {
  const top = ground - 200;
  const h = 200;
  return `
    <g>
      <rect x="${cx - 18}" y="${top}" width="36" height="${h}" rx="18" fill="${MASCOT_COLORS.cowBody}"/>
      <ellipse cx="${cx + 8}" cy="${top + 28}" rx="11" ry="9" fill="${MASCOT_COLORS.cowPatch}"/>
      <path d="M${cx - 10} ${top - 4} L${cx - 6} ${top - 16} L${cx - 2} ${top - 4} Z" fill="${MASCOT_COLORS.cowHorn}"/>
      <path d="M${cx + 2} ${top - 4} L${cx + 6} ${top - 16} L${cx + 10} ${top - 4} Z" fill="${MASCOT_COLORS.cowHorn}"/>
      <ellipse cx="${cx}" cy="${top + 52}" rx="20" ry="16" fill="#BFDBFE"/>
      <circle cx="${cx - 8}" cy="${top + 48}" r="2" fill="${MASCOT_COLORS.cowPatch}"/>
      <circle cx="${cx + 8}" cy="${top + 48}" r="2" fill="${MASCOT_COLORS.cowPatch}"/>
      ${eyes(cx, top + 36, expression, 10)}
      <rect x="${cx - 22}" y="${top + 68}" width="8" height="${h - 78}" rx="3" fill="${MASCOT_COLORS.cowBody}"/>
      <rect x="${cx + 14}" y="${top + 68}" width="8" height="${h - 78}" rx="3" fill="${MASCOT_COLORS.cowBody}"/>
      <rect x="${cx - 26}" y="${ground - 14}" width="12" height="14" rx="3" fill="${MASCOT_COLORS.cowHoof}"/>
      <rect x="${cx + 14}" y="${ground - 14}" width="12" height="14" rx="3" fill="${MASCOT_COLORS.cowHoof}"/>
      <path d="M${cx + 18} ${top + 120} Q${cx + 30} ${top + 130} ${cx + 18} ${top + 140}" fill="none" stroke="${MASCOT_COLORS.cowBody}" stroke-width="4"/>
    </g>
  `;
}

function drawDog(
  cx: number,
  ground: number,
  expression: MascotExpression = "surprised",
): string {
  const y = ground - 70;
  return `
    <g>
      <ellipse cx="${cx}" cy="${y + 42}" rx="38" ry="30" fill="${MASCOT_COLORS.dogBody}"/>
      <ellipse cx="${cx - 22}" cy="${y - 6}" rx="14" ry="28" fill="${MASCOT_COLORS.dogEar}"/>
      <ellipse cx="${cx + 22}" cy="${y - 6}" rx="14" ry="28" fill="${MASCOT_COLORS.dogEar}"/>
      <circle cx="${cx}" cy="${y + 8}" r="26" fill="${MASCOT_COLORS.dogBody}"/>
      ${eyes(cx, y + 6, expression, 12)}
      <ellipse cx="${cx}" cy="${y + 20}" rx="8" ry="6" fill="#111"/>
      <rect x="${cx - 22}" y="${y + 26}" width="44" height="8" rx="4" fill="${MASCOT_COLORS.dogCollar}"/>
      <circle cx="${cx}" cy="${y + 34}" r="4" fill="#FDE68A"/>
      <path d="M${cx + 30} ${y + 38} Q${cx + 44} ${y + 18} ${cx + 36} ${y + 8}" fill="none" stroke="${MASCOT_COLORS.dogBody}" stroke-width="8" stroke-linecap="round"/>
    </g>
  `;
}

function drawPig(
  cx: number,
  ground: number,
  expression: MascotExpression = "tired",
): string {
  const r = 52;
  const cy = ground - r;
  const sweat =
    expression === "tired"
      ? `<ellipse cx="${cx + 38}" cy="${cy - 30}" rx="6" ry="10" fill="#60A5FA"/>`
      : "";
  const mouth =
    expression === "tired"
      ? `<ellipse cx="${cx}" cy="${cy + 18}" rx="14" ry="10" fill="#BE185D"/>`
      : `<path d="M${cx - 8} ${cy + 16} Q${cx} ${cy + 22} ${cx + 8} ${cy + 16}" fill="none" stroke="#BE185D" stroke-width="2"/>`;
  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${MASCOT_COLORS.pigBody}"/>
      <ellipse cx="${cx}" cy="${cy + 8}" rx="22" ry="16" fill="${MASCOT_COLORS.pigSnout}"/>
      <circle cx="${cx - 7}" cy="${cy + 8}" r="3" fill="#831843"/>
      <circle cx="${cx + 7}" cy="${cy + 8}" r="3" fill="#831843"/>
      ${eyes(cx, cy - 10, expression, 10)}
      ${mouth}
      ${sweat}
      <ellipse cx="${cx - 30}" cy="${cy - 40}" rx="10" ry="8" fill="${MASCOT_COLORS.pigBody}"/>
      <ellipse cx="${cx + 30}" cy="${cy - 40}" rx="10" ry="8" fill="${MASCOT_COLORS.pigBody}"/>
      <path d="M${cx + 44} ${cy} Q${cx + 58} ${cy - 8} ${cx + 52} ${cy + 8}" fill="none" stroke="${MASCOT_COLORS.pigBody}" stroke-width="6"/>
      <rect x="${cx - 16}" y="${ground - 12}" width="10" height="12" rx="3" fill="${MASCOT_COLORS.pigSnout}"/>
      <rect x="${cx + 6}" y="${ground - 12}" width="10" height="12" rx="3" fill="${MASCOT_COLORS.pigSnout}"/>
    </g>
  `;
}

function background(): string {
  return `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${MASCOT_COLORS.skyTop}"/>
        <stop offset="100%" stop-color="${MASCOT_COLORS.skyBottom}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="${MASCOT_COLORS.ground}"/>
  `;
}

function propIcon(scene: MascotSceneType): string {
  switch (scene) {
    case "eat":
      return `<circle cx="300" cy="180" r="28" fill="#EF4444"/><rect x="286" y="160" width="28" height="8" fill="#16A34A"/>`;
    case "time":
      return `<circle cx="300" cy="120" r="36" fill="#fff" stroke="#111" stroke-width="3"/><line x1="300" y1="120" x2="300" y2="98" stroke="#111" stroke-width="3"/><line x1="300" y1="120" x2="318" y2="120" stroke="#111" stroke-width="3"/>`;
    case "money":
      return `<circle cx="290" cy="170" r="18" fill="#FACC15"/><circle cx="320" cy="180" r="18" fill="#FACC15"/><text x="290" y="175" text-anchor="middle" font-size="14" fill="#92400E">$</text>`;
    case "home":
      return `<polygon points="300,90 250,140 350,140" fill="#DC2626"/><rect x="265" y="140" width="70" height="55" fill="#FDE68A"/>`;
    case "learn":
      return `<rect x="260" y="130" width="80" height="60" rx="4" fill="#2563EB"/><rect x="270" y="140" width="60" height="8" fill="#fff"/><rect x="270" y="155" width="50" height="6" fill="#BFDBFE"/>`;
    case "work":
      return `<rect x="250" y="150" width="100" height="12" fill="#78350F"/><rect x="270" y="120" width="60" height="32" rx="3" fill="#374151"/>`;
    case "rain":
      return Array.from({ length: 12 }, (_, i) => {
        const x = 80 + i * 42;
        return `<line x1="${x}" y1="40" x2="${x - 6}" y2="70" stroke="#2563EB" stroke-width="3"/>`;
      }).join("");
    case "cold":
      return `<circle cx="300" cy="80" r="8" fill="#fff"/><path d="M300 55 L300 105 M285 70 L315 70 M290 60 L310 80 M290 80 L310 60" stroke="#fff" stroke-width="3"/>`;
    case "hot":
      return `<circle cx="300" cy="80" r="28" fill="#FBBF24"/><g stroke="#F97316" stroke-width="3">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x1 = 300 + Math.cos(rad) * 34;
        const y1 = 80 + Math.sin(rad) * 34;
        const x2 = 300 + Math.cos(rad) * 44;
        const y2 = 80 + Math.sin(rad) * 44;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      }).join("")}</g>`;
    default:
      return "";
  }
}

function sceneContent(scene: MascotSceneType): string {
  switch (scene) {
    case "lazy_cat":
      return `${drawCat(300, GROUND, "unamused")}<rect x="220" y="230" width="160" height="24" rx="8" fill="#14B8A6" opacity="0.5"/><circle cx="120" cy="100" r="24" fill="#FDE68A"/>`;
    case "surprised_dog":
      return `${drawDog(300, GROUND, "surprised")}<rect x="360" y="200" width="60" height="50" rx="6" fill="#A855F7"/><path d="M390 180 L390 200" stroke="#111" stroke-width="3"/>`;
    case "tired_pig":
    case "sad_pig":
      return `${drawPig(300, GROUND, "tired")}<rect x="380" y="220" width="36" height="48" rx="4" fill="#78350F"/>`;
    case "silly_cow":
      return drawCow(300, GROUND, "silly");
    case "tall_contrast":
    case "big_small":
      return `${drawCow(180, GROUND, "silly")}${drawPig(430, GROUND, "tired")}<line x1="520" y1="60" x2="520" y2="260" stroke="#fff" stroke-width="3" stroke-dasharray="8 6"/>`;
    case "between":
      return `${drawCow(140, GROUND, "silly")}${drawCat(300, GROUND, "unamused")}${drawDog(460, GROUND, "surprised")}<path d="M200 180 H400" stroke="#14B8A6" stroke-width="4" marker-end="url(#arrow)"/>`;
    case "under":
      return `<ellipse cx="300" cy="170" rx="120" ry="40" fill="#16A34A"/>${drawCat(300, GROUND + 20, "unamused")}${drawPig(420, GROUND, "tired")}`;
    case "above":
      return `<rect x="220" y="200" width="160" height="24" rx="6" fill="#78350F"/>${drawCow(300, 210, "silly")}${drawPig(430, GROUND, "tired")}`;
    case "in_box":
      return `<rect x="240" y="180" width="120" height="80" rx="6" fill="#D97706"/>${drawCat(300, GROUND, "unamused")}`;
    case "on_top":
      return `<rect x="230" y="210" width="140" height="20" rx="4" fill="#78350F"/>${drawCat(300, 210, "unamused")}`;
    case "rain":
      return `${propIcon("rain")}${drawCow(160, GROUND, "silly")}${drawCat(300, GROUND, "unamused")}${drawDog(440, GROUND, "surprised")}`;
    case "cold":
      return `${propIcon("cold")}${drawCat(200, GROUND, "unamused")}${drawCow(340, GROUND, "silly")}${drawPig(470, GROUND, "tired")}`;
    case "hot":
      return `${propIcon("hot")}${drawPig(300, GROUND, "tired")}`;
    case "eat":
      return `${propIcon("eat")}${drawCat(180, GROUND, "unamused")}${drawPig(420, GROUND, "tired")}`;
    case "run":
      return `${drawDog(280, GROUND, "surprised")}${drawCat(420, GROUND, "unamused")}<path d="M120 260 H220" stroke="#fff" stroke-width="3" stroke-dasharray="10 8"/>`;
    case "sleep":
      return `${drawCat(300, GROUND, "unamused")}<text x="420" y="100" font-size="28" fill="#fff">Zzz</text>`;
    case "give":
      return `${drawCat(220, GROUND, "unamused")}${drawDog(400, GROUND, "surprised")}<circle cx="310" cy="210" r="16" fill="#EF4444"/>`;
    case "help":
      return `${drawDog(260, GROUND, "surprised")}${drawPig(400, GROUND, "tired")}<rect x="300" y="200" width="40" height="8" rx="2" fill="#78350F"/>`;
    case "happy_group":
      return `${drawCat(160, GROUND, "unamused")}${drawCow(280, GROUND, "silly")}${drawDog(400, GROUND, "surprised")}${drawPig(500, GROUND, "tired")}`;
    case "angry_cat":
      return `${drawCat(300, GROUND, "unamused")}<path d="M250 120 Q300 90 350 120" fill="none" stroke="#EF4444" stroke-width="4"/>`;
    case "work":
    case "learn":
    case "home":
    case "time":
    case "money":
      return `${propIcon(scene)}${drawCat(160, GROUND, "unamused")}${drawDog(440, GROUND, "surprised")}`;
    default:
      return `${drawCat(220, GROUND, "unamused")}${drawDog(380, GROUND, "surprised")}`;
  }
}

export function renderMascotSceneSvg(
  scene: MascotSceneType,
  word: string,
  pos?: string | null,
): string {
  const safeWord = esc(word.trim().toLowerCase() || "word");
  const safePos = esc((pos?.trim().toUpperCase() || "VOCABULARY").slice(0, 16));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- ${MASCOT_CAST_VERSION} word=${safeWord} scene=${scene} -->
  ${background()}
  <rect x="20" y="18" width="110" height="26" rx="13" fill="#1D4ED8" opacity="0.9"/>
  <text x="75" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#fff">${safePos}</text>
  ${sceneContent(scene)}
</svg>`;
}

export function mascotSvgToDataUrl(svg: string): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}
