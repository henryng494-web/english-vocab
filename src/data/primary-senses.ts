/**
 * Curated primary senses — overrides slang/secondary API definitions.
 * Numbers, colors, days, months use the most common learner-facing meaning first.
 */
export type PrimarySense = {
  pos: string;
  ipa: string;
  vietnamese: string;
  definition: string;
  examples?: string[];
};

export const PRIMARY_SENSES: Record<string, PrimarySense> = {
  one: {
    pos: "number",
    ipa: "/wʌn/",
    vietnamese: "Một",
    definition: "Số một (1).",
    examples: ["I have one brother.", "One day we will visit Paris."],
  },
  two: {
    pos: "number",
    ipa: "/tuː/",
    vietnamese: "Hai",
    definition: "Số hai (2).",
    examples: ["She has two cats.", "We need two more chairs."],
  },
  three: {
    pos: "number",
    ipa: "/triː/",
    vietnamese: "Ba",
    definition: "Số ba (3).",
    examples: ["There are three books on the table."],
  },
  four: {
    pos: "number",
    ipa: "/fɔːr/",
    vietnamese: "Bốn",
    definition: "Số bốn (4).",
    examples: ["Four people came to the meeting."],
  },
  five: {
    pos: "number",
    ipa: "/faɪv/",
    vietnamese: "Năm",
    definition: "Số năm (5).",
    examples: ["The bus leaves in five minutes."],
  },
  six: {
    pos: "number",
    ipa: "/sɪks/",
    vietnamese: "Sáu",
    definition: "Số sáu (6).",
    examples: ["Six students are absent today."],
  },
  seven: {
    pos: "number",
    ipa: "/ˈsevən/",
    vietnamese: "Bảy",
    definition: "Số bảy (7).",
    examples: ["We work seven days a week."],
  },
  eight: {
    pos: "number",
    ipa: "/eɪt/",
    vietnamese: "Tám",
    definition: "Số tám (8).",
    examples: ["The shop opens at eight o'clock."],
  },
  nine: {
    pos: "number",
    ipa: "/naɪn/",
    vietnamese: "Chín",
    definition: "Số chín (9).",
    examples: ["Nine out of ten people agreed."],
  },
  ten: {
    pos: "number",
    ipa: "/ten/",
    vietnamese: "Mười",
    definition: "Số mười (10).",
    examples: ["Ten years passed quickly."],
  },
  eleven: {
    pos: "number",
    ipa: "/ɪˈlevən/",
    vietnamese: "Mười một",
    definition: "Số mười một (11).",
    examples: ["The meeting starts at eleven."],
  },
  twelve: {
    pos: "number",
    ipa: "/twelv/",
    vietnamese: "Mười hai",
    definition: "Số mười hai (12).",
    examples: ["There are twelve months in a year."],
  },
  thirteen: {
    pos: "number",
    ipa: "/ˈθɜːrtiːn/",
    vietnamese: "Mười ba",
    definition: "Số mười ba (13).",
    examples: ["She is thirteen years old."],
  },
  fourteen: {
    pos: "number",
    ipa: "/ˈfɔːrtiːn/",
    vietnamese: "Mười bốn",
    definition: "Số mười bốn (14).",
    examples: ["Fourteen students passed the test."],
  },
  fifteen: {
    pos: "number",
    ipa: "/ˈfɪftiːn/",
    vietnamese: "Mười lăm",
    definition: "Số mười lăm (15).",
    examples: ["We waited for fifteen minutes."],
  },
  sixteen: {
    pos: "number",
    ipa: "/ˈsɪkstiːn/",
    vietnamese: "Mười sáu",
    definition: "Số mười sáu (16).",
    examples: ["He learned to drive at sixteen."],
  },
  seventeen: {
    pos: "number",
    ipa: "/ˈsevəntiːn/",
    vietnamese: "Mười bảy",
    definition: "Số mười bảy (17).",
    examples: ["Seventeen people attended the class."],
  },
  eighteen: {
    pos: "number",
    ipa: "/ˈeɪtiːn/",
    vietnamese: "Mười tám",
    definition: "Số mười tám (18).",
    examples: ["You can vote at eighteen in many countries."],
  },
  nineteen: {
    pos: "number",
    ipa: "/ˈnaɪntiːn/",
    vietnamese: "Mười chín",
    definition: "Số mười chín (19).",
    examples: ["Nineteen is a prime number."],
  },
  twenty: {
    pos: "number",
    ipa: "/ˈtwenti/",
    vietnamese: "Hai mươi",
    definition: "Số hai mươi (20).",
    examples: ["She is twenty years old.", "About twenty people came."],
  },
  thirty: {
    pos: "number",
    ipa: "/ˈθɜːrti/",
    vietnamese: "Ba mươi",
    definition: "Số ba mươi (30).",
    examples: ["The journey takes thirty minutes."],
  },
  forty: {
    pos: "number",
    ipa: "/ˈfɔːrti/",
    vietnamese: "Bốn mươi",
    definition: "Số bốn mươi (40).",
    examples: ["He ran forty kilometers last month."],
  },
  fifty: {
    pos: "number",
    ipa: "/ˈfɪfti/",
    vietnamese: "Năm mươi",
    definition: "Số năm mươi (50).",
    examples: ["Fifty students joined the club."],
  },
  hundred: {
    pos: "number",
    ipa: "/ˈhʌndrəd/",
    vietnamese: "Một trăm",
    definition: "Số một trăm (100).",
    examples: ["A hundred people were at the event."],
  },
  thousand: {
    pos: "number",
    ipa: "/ˈθaʊzənd/",
    vietnamese: "Một nghìn",
    definition: "Số một nghìn (1,000).",
    examples: ["Thousands of books are in the library."],
  },
  red: {
    pos: "adjective",
    ipa: "/red/",
    vietnamese: "Màu đỏ",
    definition: "Có màu đỏ.",
    examples: ["She wore a red dress.", "The red car stopped quickly."],
  },
  blue: {
    pos: "adjective",
    ipa: "/bluː/",
    vietnamese: "Màu xanh dương",
    definition: "Có màu xanh dương.",
    examples: ["The sky is blue today."],
  },
  green: {
    pos: "adjective",
    ipa: "/ɡriːn/",
    vietnamese: "Màu xanh lá",
    definition: "Có màu xanh lá.",
    examples: ["The grass is green in spring."],
  },
  yellow: {
    pos: "adjective",
    ipa: "/ˈjeloʊ/",
    vietnamese: "Màu vàng",
    definition: "Có màu vàng.",
    examples: ["The yellow flowers look beautiful."],
  },
  black: {
    pos: "adjective",
    ipa: "/blæk/",
    vietnamese: "Màu đen",
    definition: "Có màu đen.",
    examples: ["He bought a black jacket."],
  },
  white: {
    pos: "adjective",
    ipa: "/waɪt/",
    vietnamese: "Màu trắng",
    definition: "Có màu trắng.",
    examples: ["White clouds floated in the sky."],
  },
  orange: {
    pos: "adjective",
    ipa: "/ˈɔːrɪndʒ/",
    vietnamese: "Màu cam",
    definition: "Có màu cam.",
    examples: ["An orange sunset lit the horizon."],
  },
  brown: {
    pos: "adjective",
    ipa: "/braʊn/",
    vietnamese: "Màu nâu",
    definition: "Có màu nâu.",
    examples: ["She has brown eyes."],
  },
  pink: {
    pos: "adjective",
    ipa: "/pɪŋk/",
    vietnamese: "Màu hồng",
    definition: "Có màu hồng.",
    examples: ["The pink shirt matches her bag."],
  },
  purple: {
    pos: "adjective",
    ipa: "/ˈpɜːrpl/",
    vietnamese: "Màu tím",
    definition: "Có màu tím.",
    examples: ["Purple grapes are sweet."],
  },
  gray: {
    pos: "adjective",
    ipa: "/ɡreɪ/",
    vietnamese: "Màu xám",
    definition: "Có màu xám.",
    examples: ["Gray clouds covered the sky."],
  },
  grey: {
    pos: "adjective",
    ipa: "/ɡreɪ/",
    vietnamese: "Màu xám",
    definition: "Có màu xám.",
    examples: ["The grey building looks old."],
  },
  monday: {
    pos: "noun",
    ipa: "/ˈmʌndeɪ/",
    vietnamese: "Thứ Hai",
    definition: "Ngày thứ hai trong tuần.",
    examples: ["We start work on Monday."],
  },
  sunday: {
    pos: "noun",
    ipa: "/ˈsʌndeɪ/",
    vietnamese: "Chủ Nhật",
    definition: "Ngày cuối tuần, thường là ngày nghỉ.",
    examples: ["They rest on Sunday."],
  },
  january: {
    pos: "noun",
    ipa: "/ˈdʒænjueri/",
    vietnamese: "Tháng Một",
    definition: "Tháng đầu tiên của năm.",
    examples: ["January is often cold here."],
  },
  color: {
    pos: "noun",
    ipa: "/ˈkʌlər/",
    vietnamese: "Màu sắc",
    definition: "Sắc thái màu của vật (đỏ, xanh, vàng...).",
    examples: ["What color is your car?", "Bright colors cheer people up."],
  },
};

export function getPrimarySense(word: string): PrimarySense | undefined {
  const normalized = word.trim().toLowerCase();
  if (!Object.hasOwn(PRIMARY_SENSES, normalized)) return undefined;
  return PRIMARY_SENSES[normalized];
}
