/** Map card glosses to concrete stock-photo queries when the English headword alone fails. */

export type MeaningImageContext = {
  meaning?: string | null;
  englishDefinition?: string | null;
  pos?: string | null;
};

type PatternRule = {
  pattern: RegExp;
  query: string;
};

const MEANING_RULES: PatternRule[] = [
  {
    pattern: /tên lửa|rocket|missile|warhead|launch/i,
    query: "rocket missile launch smoke sky military",
  },
  {
    pattern: /phát ban|skin rash|itchy rash|red rash|dermatitis|hives/i,
    query: "skin rash red irritation arm closeup medical",
  },
  {
    pattern: /ô nhục|hổ thẹn|disgrace|humiliat|ashamed|shameful|embarrass/i,
    query: "person ashamed embarrassed covering face hands",
  },
  {
    pattern: /đầm lầy|swamp|marsh|wetland|bog/i,
    query: "swamp wetland marsh trees water mist",
  },
  {
    pattern: /kỳ lạ|kỳ quái|strange|weird|bizarre|odd/i,
    query: "strange surreal unusual object curious scene",
  },
  {
    pattern: /bệnh tật|disease|illness|sick/i,
    query: "person sick resting bed thermometer care",
  },
  {
    pattern: /vũ khí|weapon|gun|rifle|sword/i,
    query: "weapon military equipment neutral display",
  },
  {
    pattern: /chiến tranh|warfare|battlefield|combat/i,
    query: "anti war peace dove symbol white bird",
  },
  {
    pattern: /nghèo|poverty|homeless/i,
    query: "poverty help charity food donation community",
  },
  {
    pattern: /giàu|wealth|rich|luxury/i,
    query: "luxury lifestyle elegant success celebration",
  },
  {
    pattern: /tù|prison|jail|inmate/i,
    query: "prison bars justice courthouse law",
  },
  {
    pattern: /tội phạm|crime|criminal|robbery|theft/i,
    query: "police crime investigation evidence tape",
  },
  {
    pattern: /tự do|freedom|liberty/i,
    query: "freedom bird flying open sky clouds",
  },
  {
    pattern: /cô đơn|lonely|loneliness|alone sad/i,
    query: "lonely person sitting alone window rainy day",
  },
  {
    pattern: /hy vọng|hope|hopeful/i,
    query: "hope sunrise horizon new beginning light",
  },
  {
    pattern: /nỗi sợ|fear|afraid|scared|terrified/i,
    query: "person scared worried anxious expression closeup",
  },
  {
    pattern: /tức giận|anger|angry|furious|rage/i,
    query: "angry person frustrated expression closeup",
  },
  {
    pattern: /hạnh phúc|happiness|joyful|delighted/i,
    query: "happy person smiling genuine joy outdoors",
  },
  {
    pattern: /buồn|sadness|sorrow|grief|mourn/i,
    query: "sad person tears emotional portrait closeup",
  },
  {
    pattern: /bí mật|secret|confidential|hidden/i,
    query: "secret whisper friends confidential conversation",
  },
  {
    pattern: /lời hứa|promise|pledge|vow/i,
    query: "handshake promise agreement trust commitment",
  },
  {
    pattern: /thành công|success|achievement|accomplish/i,
    query: "success celebration trophy achievement happy",
  },
  {
    pattern: /thất bại|failure|fail|defeat/i,
    query: "disappointed person setback learning moment desk",
  },
  {
    pattern: /cơ hội|opportunity|chance luck/i,
    query: "open door bright light opportunity path forward",
  },
  {
    pattern: /nguy hiểm|danger|dangerous|hazard/i,
    query: "warning sign caution danger safety alert",
  },
  {
    pattern: /an toàn|safety|safe|secure/i,
    query: "safety helmet protection secure workplace gear",
  },
];

function contextBlob(context: MeaningImageContext): string {
  return [context.meaning, context.englishDefinition].filter(Boolean).join(" ");
}

export function resolveMeaningImageKeyword(
  context: MeaningImageContext,
): string | null {
  const text = contextBlob(context);
  if (!text.trim()) return null;

  for (const rule of MEANING_RULES) {
    if (rule.pattern.test(text)) return rule.query;
  }
  return null;
}
