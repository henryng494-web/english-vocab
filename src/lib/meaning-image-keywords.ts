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

/** High-confidence queries for headwords that stock search mishandles. */
const WORD_HEADWORD_RULES: Record<string, string> = {
  martyr: "memorial candle remembrance sacrifice honor quiet",
  obstacle: "road barrier fallen tree blocked path obstacle",
  lug: "person carrying heavy boxes luggage moving",
  descent: "walking down mountain trail hikers",
  preacher: "preacher speaking church pulpit congregation",
  technician: "technician repairing computer",
  holdup: "traffic jam highway delay cars",
  debut: "theater stage performance spotlight debut",
  dunk: "cookies dunk milk glass dipping",
};

const MEANING_RULES: PatternRule[] = [
  {
    pattern: /vụ cướp|cướp ngân hàng|bank robbery|robbery holdup/i,
    query: "bank robbery police holdup scene",
  },
  {
    pattern: /trì hoãn|ùn tắc|holdup|traffic delay|delay/i,
    query: "traffic jam highway delay cars",
  },
  {
    pattern: /ra mắt|trình diễn lần đầu|debut|premiere|first performance/i,
    query: "theater stage performance spotlight debut",
  },
  {
    pattern: /nhúng|chấm|dunk.*milk|dip.*cookie|dipping food/i,
    query: "cookies dunk milk glass dipping",
  },
  {
    pattern: /kỹ thuật viên|technician|repair technician|service technician/i,
    query: "technician repairing computer",
  },
  {
    pattern: /đi xuống|hạ xuống|descent|going down|downward/i,
    query: "walking down mountain trail hikers",
  },
  {
    pattern: /tử vì đạo|hy sinh|martyr|sacrifice for faith/i,
    query: "memorial candle remembrance sacrifice honor quiet",
  },
  {
    pattern: /vật cản|chướng ngại|obstacle|barrier blocking/i,
    query: "road barrier fallen tree blocked path obstacle",
  },
  {
    pattern: /kéo|vác|khuân vác|lug heavy|carry heavy/i,
    query: "person carrying heavy boxes luggage moving",
  },
  {
    pattern: /phẫu thuật|surgical|surgeon|operating room|surgery medical/i,
    query: "surgeon operating room surgery medical team",
  },
  {
    pattern: /tồi tệ|khủng khiếp|dreadful|awful|terrible|horrible|atrocious/i,
    query: "stormy dark sky disaster damage terrible weather",
  },
  {
    pattern: /mục sư|preacher|pastor|sermon|pulpit|minister/i,
    query: "preacher speaking church pulpit congregation",
  },
  {
    pattern: /gác mái|sàn thượng|attic|loft storage/i,
    query: "dusty wooden attic interior storage boxes",
  },
  {
    pattern: /phúc lợi|trợ cấp|welfare|social support/i,
    query: "social worker helping community food support",
  },
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
  {
    pattern: /khó hiểu|mơ hồ|obscure|unclear|vague|ambiguous|indistinct/i,
    query: "person confused thinking fog mystery concept",
  },
  {
    pattern: /bệnh hoạn|morbid|macabre|morbidity|ghastly/i,
    query: "dark moody atmospheric gothic scene",
  },
  {
    pattern: /tiêu đề|headline|heading|news title|banner title/i,
    query: "newspaper headline bold text closeup",
  },
  {
    pattern: /đủ|đầy đủ|adequate|sufficient|enough for|good enough/i,
    query: "enough food supplies containers stacked adequate kitchen",
  },
  {
    pattern: /tận tụy|hết lòng|devoted|dedicated|loyal|faithful/i,
    query: "loyal dog owner bonding devoted care affection",
  },
  {
    pattern: /nhợt nhạc|tái|pale|wan|pallid|ashen/i,
    query: "pale person face sick tired closeup portrait",
  },
  {
    pattern: /chết|perish|die|death|fatal|mortality/i,
    query: "memorial candle quiet remembrance scene",
  },
  {
    pattern: /không trung thực|dishonest|deceit|deceptive|liar/i,
    query: "person lying deceptive guilty expression closeup",
  },
];

function contextBlob(context: MeaningImageContext): string {
  return [context.meaning, context.englishDefinition].filter(Boolean).join(" ");
}

export function resolveWordHeadwordImageKeyword(word: string): string | null {
  const normalized = word.trim().toLowerCase().replace(/[^a-z0-9'-]/g, "");
  if (!normalized) return null;
  return WORD_HEADWORD_RULES[normalized] ?? null;
}

export function resolveMeaningImageKeyword(
  context: MeaningImageContext,
  word?: string | null,
): string | null {
  const headwordRule = word ? resolveWordHeadwordImageKeyword(word) : null;
  if (headwordRule) return headwordRule;

  const text = contextBlob(context);
  if (!text.trim()) return null;

  for (const rule of MEANING_RULES) {
    if (rule.pattern.test(text)) return rule.query;
  }
  return null;
}
