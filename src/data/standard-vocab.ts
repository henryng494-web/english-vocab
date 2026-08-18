import { PRIMARY_SENSES } from "@/data/primary-senses";
import {
  getPresetRank,
  getStaticWordDetail,
  type StaticWordDetail,
} from "@/data/preset-word-details";
import { hasQualityExamples } from "@/lib/example-fallback";
import { capitalizeFirst } from "@/lib/format-text";
import {
  buildDefinitionFromVietnameseMeaning,
  looksLikeEnglish,
} from "@/lib/translate-vi";

export type VocabExample = {
  en: string;
  vi: string;
};

/** Learner-facing standardized vocabulary card. */
export type StandardVocabEntry = {
  word: string;
  phonetic: string;
  pos: string;
  meaning: string;
  definition: string;
  examples: VocabExample[];
  searchKeyword: string;
};

type RawEntry = {
  pos: string;
  ipa: string;
  meaning: string;
  definition: string;
  examples: VocabExample[];
  keyword: string;
};

/**
 * Gemini-style curated dataset — primary sense only.
 * Numbers, colors, days, months, and high-risk ambiguous words live here
 * so they never fall through to slang/secondary dictionary senses.
 */
const CURATED: Record<string, RawEntry> = {
  one: {
    pos: "number",
    ipa: "/wʌn/",
    meaning: "Một",
    definition: "Số đếm một (1).",
    examples: [
      { en: "I have one brother.", vi: "Tôi có một người anh em." },
      { en: "One day we will visit Paris.", vi: "Một ngày nào đó chúng tôi sẽ thăm Paris." },
    ],
    keyword: "one",
  },
  two: {
    pos: "number",
    ipa: "/tuː/",
    meaning: "Hai",
    definition: "Số đếm hai (2).",
    examples: [
      { en: "She has two cats.", vi: "Cô ấy có hai con mèo." },
      { en: "We need two more chairs.", vi: "Chúng tôi cần thêm hai cái ghế." },
    ],
    keyword: "two",
  },
  three: {
    pos: "number",
    ipa: "/θriː/",
    meaning: "Ba",
    definition: "Số đếm ba (3).",
    examples: [
      { en: "There are three books on the table.", vi: "Có ba quyển sách trên bàn." },
      { en: "We waited three hours.", vi: "Chúng tôi đợi ba giờ." },
    ],
    keyword: "three",
  },
  four: {
    pos: "number",
    ipa: "/fɔːr/",
    meaning: "Bốn",
    definition: "Số đếm bốn (4).",
    examples: [
      { en: "Four people came to the meeting.", vi: "Bốn người đến buổi họp." },
      { en: "The table has four legs.", vi: "Cái bàn có bốn chân." },
    ],
    keyword: "four",
  },
  five: {
    pos: "number",
    ipa: "/faɪv/",
    meaning: "Năm",
    definition: "Số đếm năm (5).",
    examples: [
      { en: "The bus leaves in five minutes.", vi: "Xe buýt rời đi trong năm phút." },
      { en: "She bought five apples.", vi: "Cô ấy mua năm quả táo." },
    ],
    keyword: "five",
  },
  six: {
    pos: "number",
    ipa: "/sɪks/",
    meaning: "Sáu",
    definition: "Số đếm sáu (6).",
    examples: [
      { en: "Six students are absent today.", vi: "Sáu học sinh vắng mặt hôm nay." },
      { en: "Breakfast is at six o'clock.", vi: "Bữa sáng lúc sáu giờ." },
    ],
    keyword: "six",
  },
  seven: {
    pos: "number",
    ipa: "/ˈsevən/",
    meaning: "Bảy",
    definition: "Số đếm bảy (7).",
    examples: [
      { en: "There are seven days in a week.", vi: "Một tuần có bảy ngày." },
      { en: "He has seven books.", vi: "Anh ấy có bảy quyển sách." },
    ],
    keyword: "seven",
  },
  eight: {
    pos: "number",
    ipa: "/eɪt/",
    meaning: "Tám",
    definition: "Số đếm tám (8).",
    examples: [
      { en: "The shop opens at eight o'clock.", vi: "Cửa hàng mở lúc tám giờ." },
      { en: "We need eight chairs.", vi: "Chúng tôi cần tám cái ghế." },
    ],
    keyword: "eight",
  },
  nine: {
    pos: "number",
    ipa: "/naɪn/",
    meaning: "Chín",
    definition: "Số đếm chín (9).",
    examples: [
      { en: "She has nine pencils.", vi: "Cô ấy có chín cây bút chì." },
      { en: "The class starts at nine.", vi: "Lớp học bắt đầu lúc chín giờ." },
    ],
    keyword: "nine",
  },
  ten: {
    pos: "number",
    ipa: "/ten/",
    meaning: "Mười",
    definition: "Số đếm mười (10).",
    examples: [
      { en: "Ten years passed quickly.", vi: "Mười năm trôi qua rất nhanh." },
      { en: "I counted to ten.", vi: "Tôi đếm đến mười." },
    ],
    keyword: "ten",
  },
  eleven: {
    pos: "number",
    ipa: "/ɪˈlevən/",
    meaning: "Mười một",
    definition: "Số đếm mười một (11).",
    examples: [
      { en: "The meeting starts at eleven.", vi: "Cuộc họp bắt đầu lúc mười một giờ." },
      { en: "There are eleven players on a football team.", vi: "Một đội bóng đá có mười một cầu thủ." },
    ],
    keyword: "eleven",
  },
  twelve: {
    pos: "number",
    ipa: "/twelv/",
    meaning: "Mười hai",
    definition: "Số đếm mười hai (12).",
    examples: [
      { en: "There are twelve months in a year.", vi: "Một năm có mười hai tháng." },
      { en: "Lunch is at twelve.", vi: "Bữa trưa lúc mười hai giờ." },
    ],
    keyword: "twelve",
  },
  thirteen: {
    pos: "number",
    ipa: "/ˌθɜːrˈtiːn/",
    meaning: "Mười ba",
    definition: "Số đếm mười ba (13).",
    examples: [
      { en: "She is thirteen years old.", vi: "Cô ấy mười ba tuổi." },
      { en: "There are thirteen chairs in the room.", vi: "Trong phòng có mười ba cái ghế." },
    ],
    keyword: "thirteen",
  },
  fourteen: {
    pos: "number",
    ipa: "/ˌfɔːrˈtiːn/",
    meaning: "Mười bốn",
    definition: "Số đếm mười bốn (14).",
    examples: [
      { en: "Fourteen students passed the test.", vi: "Mười bốn học sinh đã vượt qua bài kiểm tra." },
      { en: "Valentine's Day is on February fourteen.", vi: "Ngày Valentine là ngày mười bốn tháng Hai." },
    ],
    keyword: "fourteen",
  },
  fifteen: {
    pos: "number",
    ipa: "/ˌfɪfˈtiːn/",
    meaning: "Mười lăm",
    definition: "Số đếm mười lăm (15).",
    examples: [
      { en: "We waited for fifteen minutes.", vi: "Chúng tôi đợi mười lăm phút." },
      { en: "He is fifteen years old.", vi: "Anh ấy mười lăm tuổi." },
    ],
    keyword: "fifteen",
  },
  sixteen: {
    pos: "number",
    ipa: "/ˌsɪkˈstiːn/",
    meaning: "Mười sáu",
    definition: "Số đếm mười sáu (16).",
    examples: [
      { en: "He learned to drive at sixteen.", vi: "Anh ấy học lái xe lúc mười sáu tuổi." },
      { en: "There are sixteen students in the class.", vi: "Lớp có mười sáu học sinh." },
    ],
    keyword: "sixteen",
  },
  seventeen: {
    pos: "number",
    ipa: "/ˌsevənˈtiːn/",
    meaning: "Mười bảy",
    definition: "Số đếm mười bảy (17).",
    examples: [
      { en: "Seventeen people attended the class.", vi: "Mười bảy người tham dự lớp học." },
      { en: "She turned seventeen last week.", vi: "Cô ấy vừa tròn mười bảy tuổi tuần trước." },
    ],
    keyword: "seventeen",
  },
  eighteen: {
    pos: "number",
    ipa: "/ˌeɪˈtiːn/",
    meaning: "Mười tám",
    definition: "Số đếm mười tám (18).",
    examples: [
      { en: "You can vote at eighteen in many countries.", vi: "Ở nhiều nước, bạn có thể bỏ phiếu lúc mười tám tuổi." },
      { en: "The concert starts at eighteen hundred hours.", vi: "Buổi hòa nhạc bắt đầu lúc mười tám giờ." },
    ],
    keyword: "eighteen",
  },
  nineteen: {
    pos: "number",
    ipa: "/ˌnaɪnˈtiːn/",
    meaning: "Mười chín",
    definition: "Số đếm mười chín (19).",
    examples: [
      { en: "She is nineteen years old.", vi: "Cô ấy mười chín tuổi." },
      { en: "The bus number is nineteen.", vi: "Số xe buýt là mười chín." },
    ],
    keyword: "nineteen",
  },
  twenty: {
    pos: "number",
    ipa: "/ˈtwenti/",
    meaning: "Hai mươi",
    definition: "Số đếm hai mươi (20).",
    examples: [
      { en: "She is twenty years old.", vi: "Cô ấy hai mươi tuổi." },
      { en: "About twenty people came.", vi: "Khoảng hai mươi người đã đến." },
    ],
    keyword: "twenty",
  },
  thirty: {
    pos: "number",
    ipa: "/ˈθɜːrti/",
    meaning: "Ba mươi",
    definition: "Số đếm ba mươi (30).",
    examples: [
      { en: "The journey takes thirty minutes.", vi: "Chuyến đi mất ba mươi phút." },
      { en: "He is thirty years old.", vi: "Anh ấy ba mươi tuổi." },
    ],
    keyword: "thirty",
  },
  forty: {
    pos: "number",
    ipa: "/ˈfɔːrti/",
    meaning: "Bốn mươi",
    definition: "Số đếm bốn mươi (40).",
    examples: [
      { en: "The class has forty students.", vi: "Lớp học có bốn mươi học sinh." },
      { en: "She ran for forty minutes.", vi: "Cô ấy chạy trong bốn mươi phút." },
    ],
    keyword: "forty",
  },
  fifty: {
    pos: "number",
    ipa: "/ˈfɪfti/",
    meaning: "Năm mươi",
    definition: "Số đếm năm mươi (50).",
    examples: [
      { en: "Fifty students joined the club.", vi: "Năm mươi học sinh tham gia câu lạc bộ." },
      { en: "The book has fifty pages.", vi: "Quyển sách có năm mươi trang." },
    ],
    keyword: "fifty",
  },
  hundred: {
    pos: "number",
    ipa: "/ˈhʌndrəd/",
    meaning: "Một trăm",
    definition: "Số đếm một trăm (100).",
    examples: [
      { en: "A hundred people were at the event.", vi: "Một trăm người có mặt tại sự kiện." },
      { en: "This bottle holds one hundred milliliters.", vi: "Chai này chứa một trăm mililit." },
    ],
    keyword: "hundred",
  },
  thousand: {
    pos: "number",
    ipa: "/ˈθaʊzənd/",
    meaning: "Một nghìn",
    definition: "Số đếm một nghìn (1.000).",
    examples: [
      { en: "Thousands of books are in the library.", vi: "Thư viện có hàng nghìn quyển sách." },
      { en: "The ticket costs one thousand dong.", vi: "Vé có giá một nghìn đồng." },
    ],
    keyword: "thousand",
  },
  red: {
    pos: "adjective",
    ipa: "/red/",
    meaning: "Màu đỏ",
    definition: "Có màu đỏ.",
    examples: [
      { en: "She wore a red dress.", vi: "Cô ấy mặc một chiếc váy đỏ." },
      { en: "The red car stopped quickly.", vi: "Chiếc xe đỏ dừng lại rất nhanh." },
    ],
    keyword: "red",
  },
  white: {
    pos: "adjective",
    ipa: "/waɪt/",
    meaning: "Màu trắng",
    definition: "Có màu trắng.",
    examples: [
      { en: "White clouds floated in the sky.", vi: "Những đám mây trắng trôi trên bầu trời." },
      { en: "He wore a white shirt.", vi: "Anh ấy mặc một chiếc áo trắng." },
    ],
    keyword: "white",
  },
  blue: {
    pos: "adjective",
    ipa: "/bluː/",
    meaning: "Màu xanh dương",
    definition: "Có màu xanh dương.",
    examples: [
      { en: "The sky is blue today.", vi: "Bầu trời hôm nay màu xanh dương." },
      { en: "She bought a blue bag.", vi: "Cô ấy mua một chiếc túi xanh dương." },
    ],
    keyword: "blue",
  },
  green: {
    pos: "adjective",
    ipa: "/ɡriːn/",
    meaning: "Màu xanh lá",
    definition: "Có màu xanh lá.",
    examples: [
      { en: "The grass is green in spring.", vi: "Cỏ xanh lá vào mùa xuân." },
      { en: "He planted a green tree.", vi: "Anh ấy trồng một cây xanh." },
    ],
    keyword: "green",
  },
  yellow: {
    pos: "adjective",
    ipa: "/ˈjeloʊ/",
    meaning: "Màu vàng",
    definition: "Có màu vàng.",
    examples: [
      { en: "The yellow flowers look beautiful.", vi: "Những bông hoa vàng trông rất đẹp." },
      { en: "A yellow bus stopped outside.", vi: "Một chiếc xe buýt vàng dừng bên ngoài." },
    ],
    keyword: "yellow",
  },
  black: {
    pos: "adjective",
    ipa: "/blæk/",
    meaning: "Màu đen",
    definition: "Có màu đen.",
    examples: [
      { en: "He bought a black jacket.", vi: "Anh ấy mua một chiếc áo khoác đen." },
      { en: "The cat is black.", vi: "Con mèo màu đen." },
    ],
    keyword: "black",
  },
  orange: {
    pos: "adjective",
    ipa: "/ˈɔːrɪndʒ/",
    meaning: "Màu cam",
    definition: "Có màu cam.",
    examples: [
      { en: "An orange sunset lit the sky.", vi: "Hoàng hôn màu cam chiếu sáng bầu trời." },
      { en: "She painted the wall orange.", vi: "Cô ấy sơn tường màu cam." },
    ],
    keyword: "orange",
  },
  brown: {
    pos: "adjective",
    ipa: "/braʊn/",
    meaning: "Màu nâu",
    definition: "Có màu nâu.",
    examples: [
      { en: "She has brown eyes.", vi: "Cô ấy có đôi mắt nâu." },
      { en: "The wooden table is brown.", vi: "Cái bàn gỗ màu nâu." },
    ],
    keyword: "brown",
  },
  pink: {
    pos: "adjective",
    ipa: "/pɪŋk/",
    meaning: "Màu hồng",
    definition: "Có màu hồng.",
    examples: [
      { en: "The pink shirt matches her bag.", vi: "Chiếc áo hồng hợp với túi của cô ấy." },
      { en: "Cherry blossoms are pink.", vi: "Hoa anh đào có màu hồng." },
    ],
    keyword: "pink",
  },
  purple: {
    pos: "adjective",
    ipa: "/ˈpɜːrpl/",
    meaning: "Màu tím",
    definition: "Có màu tím.",
    examples: [
      { en: "Purple grapes are sweet.", vi: "Nho tím rất ngọt." },
      { en: "She wore a purple scarf.", vi: "Cô ấy quàng khăn tím." },
    ],
    keyword: "purple",
  },
  gray: {
    pos: "adjective",
    ipa: "/ɡreɪ/",
    meaning: "Màu xám",
    definition: "Có màu xám.",
    examples: [
      { en: "Gray clouds covered the sky.", vi: "Mây xám che kín bầu trời." },
      { en: "He has a gray coat.", vi: "Anh ấy có một chiếc áo khoác xám." },
    ],
    keyword: "gray",
  },
  grey: {
    pos: "adjective",
    ipa: "/ɡreɪ/",
    meaning: "Màu xám",
    definition: "Có màu xám.",
    examples: [
      { en: "The grey building looks old.", vi: "Tòa nhà xám trông cũ kỹ." },
      { en: "A grey cat sat by the door.", vi: "Một con mèo xám ngồi bên cửa." },
    ],
    keyword: "grey",
  },
  color: {
    pos: "noun",
    ipa: "/ˈkʌlər/",
    meaning: "Màu sắc",
    definition: "Sắc thái của vật, như đỏ, xanh hay vàng.",
    examples: [
      { en: "What color is your car?", vi: "Xe của bạn màu gì?" },
      { en: "Bright colors cheer people up.", vi: "Màu sắc tươi sáng làm mọi người vui hơn." },
    ],
    keyword: "color",
  },
  hole: {
    pos: "noun",
    ipa: "/hoʊl/",
    meaning: "Lỗ, hố",
    definition: "Một chỗ trống trên bề mặt hoặc dưới đất.",
    examples: [
      {
        en: "There is a hole in my pocket.",
        vi: "Có một cái lỗ trong túi quần của tôi.",
      },
      {
        en: "Dig a hole in the garden.",
        vi: "Đào một cái hố trong vườn.",
      },
    ],
    keyword: "hole",
  },
  week: {
    pos: "noun",
    ipa: "/wiːk/",
    meaning: "Tuần",
    definition: "Khoảng thời gian bảy ngày.",
    examples: [
      { en: "I work five days a week.", vi: "Tôi làm việc năm ngày một tuần." },
      { en: "See you next week.", vi: "Hẹn gặp lại tuần sau." },
    ],
    keyword: "week",
  },
  month: {
    pos: "noun",
    ipa: "/mʌnθ/",
    meaning: "Tháng",
    definition: "Một trong mười hai phần của năm.",
    examples: [
      { en: "June is my favorite month.", vi: "Tháng Sáu là tháng yêu thích của tôi." },
      { en: "She visits her parents every month.", vi: "Cô ấy thăm bố mẹ mỗi tháng." },
    ],
    keyword: "month",
  },
  monday: {
    pos: "noun",
    ipa: "/ˈmʌndeɪ/",
    meaning: "Thứ Hai",
    definition: "Ngày thứ hai trong tuần, thường là ngày bắt đầu làm việc.",
    examples: [
      { en: "We start work on Monday.", vi: "Chúng tôi bắt đầu làm việc vào thứ Hai." },
      { en: "Monday is the first weekday.", vi: "Thứ Hai là ngày làm việc đầu tiên." },
    ],
    keyword: "monday",
  },
  tuesday: {
    pos: "noun",
    ipa: "/ˈtjuːzdeɪ/",
    meaning: "Thứ Ba",
    definition: "Ngày thứ ba trong tuần.",
    examples: [
      { en: "I have English class on Tuesday.", vi: "Tôi có lớp tiếng Anh vào thứ Ba." },
      { en: "See you on Tuesday.", vi: "Hẹn gặp bạn vào thứ Ba." },
    ],
    keyword: "tuesday",
  },
  wednesday: {
    pos: "noun",
    ipa: "/ˈwenzdeɪ/",
    meaning: "Thứ Tư",
    definition: "Ngày thứ tư trong tuần.",
    examples: [
      { en: "The market is busy on Wednesday.", vi: "Chợ đông vào thứ Tư." },
      { en: "Wednesday is in the middle of the week.", vi: "Thứ Tư nằm giữa tuần." },
    ],
    keyword: "wednesday",
  },
  thursday: {
    pos: "noun",
    ipa: "/ˈθɜːrzdeɪ/",
    meaning: "Thứ Năm",
    definition: "Ngày thứ năm trong tuần.",
    examples: [
      { en: "We play football on Thursday.", vi: "Chúng tôi đá bóng vào thứ Năm." },
      { en: "Thursday comes after Wednesday.", vi: "Thứ Năm đến sau thứ Tư." },
    ],
    keyword: "thursday",
  },
  friday: {
    pos: "noun",
    ipa: "/ˈfraɪdeɪ/",
    meaning: "Thứ Sáu",
    definition: "Ngày thứ sáu trong tuần, thường là ngày làm việc cuối.",
    examples: [
      { en: "Friday is my favorite day.", vi: "Thứ Sáu là ngày yêu thích của tôi." },
      { en: "We finish work early on Friday.", vi: "Chúng tôi tan làm sớm vào thứ Sáu." },
    ],
    keyword: "friday",
  },
  saturday: {
    pos: "noun",
    ipa: "/ˈsætərdeɪ/",
    meaning: "Thứ Bảy",
    definition: "Ngày thứ bảy trong tuần, thường là ngày nghỉ.",
    examples: [
      { en: "I sleep late on Saturday.", vi: "Tôi ngủ muộn vào thứ Bảy." },
      { en: "The park is crowded on Saturday.", vi: "Công viên đông vào thứ Bảy." },
    ],
    keyword: "saturday",
  },
  sunday: {
    pos: "noun",
    ipa: "/ˈsʌndeɪ/",
    meaning: "Chủ Nhật",
    definition: "Ngày cuối tuần, thường là ngày nghỉ.",
    examples: [
      { en: "They rest on Sunday.", vi: "Họ nghỉ ngơi vào Chủ Nhật." },
      { en: "Sunday lunch is with family.", vi: "Bữa trưa Chủ Nhật ăn cùng gia đình." },
    ],
    keyword: "sunday",
  },
  january: {
    pos: "noun",
    ipa: "/ˈdʒænjueri/",
    meaning: "Tháng Một",
    definition: "Tháng đầu tiên của năm.",
    examples: [
      { en: "January is often cold here.", vi: "Tháng Một ở đây thường lạnh." },
      { en: "School starts in January.", vi: "Trường học bắt đầu vào tháng Một." },
    ],
    keyword: "january",
  },
  february: {
    pos: "noun",
    ipa: "/ˈfebruˌeri/",
    meaning: "Tháng Hai",
    definition: "Tháng thứ hai của năm.",
    examples: [
      { en: "February is the shortest month.", vi: "Tháng Hai là tháng ngắn nhất." },
      { en: "Her birthday is in February.", vi: "Sinh nhật cô ấy vào tháng Hai." },
    ],
    keyword: "february",
  },
  march: {
    pos: "noun",
    ipa: "/mɑːrtʃ/",
    meaning: "Tháng Ba",
    definition: "Tháng thứ ba của năm.",
    examples: [
      { en: "Spring begins in March.", vi: "Mùa xuân bắt đầu vào tháng Ba." },
      { en: "We travel in March.", vi: "Chúng tôi đi du lịch vào tháng Ba." },
    ],
    keyword: "march",
  },
  april: {
    pos: "noun",
    ipa: "/ˈeɪprəl/",
    meaning: "Tháng Tư",
    definition: "Tháng thứ tư của năm.",
    examples: [
      { en: "It often rains in April.", vi: "Tháng Tư thường mưa." },
      { en: "The flowers bloom in April.", vi: "Hoa nở vào tháng Tư." },
    ],
    keyword: "april",
  },
  may: {
    pos: "noun",
    ipa: "/meɪ/",
    meaning: "Tháng Năm",
    definition: "Tháng thứ năm của năm.",
    examples: [
      { en: "May is a warm month.", vi: "Tháng Năm là tháng ấm." },
      { en: "We have a holiday in May.", vi: "Chúng tôi có kỳ nghỉ vào tháng Năm." },
    ],
    keyword: "may",
  },
  june: {
    pos: "noun",
    ipa: "/dʒuːn/",
    meaning: "Tháng Sáu",
    definition: "Tháng thứ sáu của năm.",
    examples: [
      { en: "School ends in June.", vi: "Năm học kết thúc vào tháng Sáu." },
      { en: "June days are long.", vi: "Ngày tháng Sáu rất dài." },
    ],
    keyword: "june",
  },
  july: {
    pos: "noun",
    ipa: "/dʒʊˈlaɪ/",
    meaning: "Tháng Bảy",
    definition: "Tháng thứ bảy của năm.",
    examples: [
      { en: "July is usually hot.", vi: "Tháng Bảy thường nóng." },
      { en: "They got married in July.", vi: "Họ kết hôn vào tháng Bảy." },
    ],
    keyword: "july",
  },
  august: {
    pos: "noun",
    ipa: "/ˈɔːɡəst/",
    meaning: "Tháng Tám",
    definition: "Tháng thứ tám của năm.",
    examples: [
      { en: "August is a summer month.", vi: "Tháng Tám là tháng mùa hè." },
      { en: "We go to the beach in August.", vi: "Chúng tôi ra biển vào tháng Tám." },
    ],
    keyword: "august",
  },
  september: {
    pos: "noun",
    ipa: "/sepˈtembər/",
    meaning: "Tháng Chín",
    definition: "Tháng thứ chín của năm.",
    examples: [
      { en: "School starts in September.", vi: "Trường học bắt đầu vào tháng Chín." },
      { en: "Leaves change color in September.", vi: "Lá đổi màu vào tháng Chín." },
    ],
    keyword: "september",
  },
  october: {
    pos: "noun",
    ipa: "/ɑːkˈtoʊbər/",
    meaning: "Tháng Mười",
    definition: "Tháng thứ mười của năm.",
    examples: [
      { en: "October nights are cool.", vi: "Đêm tháng Mười se lạnh." },
      { en: "Halloween is in October.", vi: "Halloween vào tháng Mười." },
    ],
    keyword: "october",
  },
  november: {
    pos: "noun",
    ipa: "/noʊˈvembər/",
    meaning: "Tháng Mười Một",
    definition: "Tháng thứ mười một của năm.",
    examples: [
      { en: "November is late autumn.", vi: "Tháng Mười Một là cuối thu." },
      { en: "It gets dark early in November.", vi: "Tháng Mười Một trời tối sớm." },
    ],
    keyword: "november",
  },
  december: {
    pos: "noun",
    ipa: "/dɪˈsembər/",
    meaning: "Tháng Mười Hai",
    definition: "Tháng cuối cùng của năm.",
    examples: [
      { en: "December brings the new year.", vi: "Tháng Mười Hai đưa tới năm mới." },
      { en: "We celebrate in December.", vi: "Chúng tôi ăn mừng vào tháng Mười Hai." },
    ],
    keyword: "december",
  },
};

function fromRaw(word: string, raw: RawEntry): StandardVocabEntry {
  return {
    word,
    phonetic: raw.ipa,
    pos: raw.pos,
    meaning: capitalizeFirst(raw.meaning),
    definition: capitalizeFirst(raw.definition),
    examples: raw.examples.slice(0, 2),
    searchKeyword: raw.keyword.trim().toLowerCase() || word,
  };
}

function simpleKeyword(word: string): string {
  const cleaned = word.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "");
  return cleaned || "vocabulary";
}

function fromPrimarySense(word: string): StandardVocabEntry | undefined {
  const sense = PRIMARY_SENSES[word];
  if (!sense) return undefined;
  return {
    word,
    phonetic: sense.ipa,
    pos: sense.pos,
    meaning: capitalizeFirst(sense.vietnamese),
    definition: capitalizeFirst(sense.definition),
    examples: (sense.examples ?? []).slice(0, 2).map((en) => ({ en, vi: "" })),
    searchKeyword: simpleKeyword(word),
  };
}

function fromStaticDetail(
  word: string,
  detail: StaticWordDetail,
): StandardVocabEntry {
  const meaning = capitalizeFirst(detail.vietnamese);
  const definition = looksLikeEnglish(detail.definition)
    ? capitalizeFirst(
        buildDefinitionFromVietnameseMeaning(detail.vietnamese, detail.pos) ||
          detail.vietnamese,
      )
    : capitalizeFirst(detail.definition);

  return {
    word,
    phonetic: detail.ipa,
    pos: detail.pos,
    meaning,
    definition,
    examples: detail.examples.slice(0, 2).map((en) => ({ en, vi: "" })),
    searchKeyword: simpleKeyword(word),
  };
}

export function getStandardVocab(word: string): StandardVocabEntry | undefined {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return undefined;

  const curated = CURATED[normalized];
  if (curated) return fromRaw(normalized, curated);

  const primary = fromPrimarySense(normalized);
  if (primary) return primary;

  const staticDetail = getStaticWordDetail(normalized);
  if (staticDetail) return fromStaticDetail(normalized, staticDetail);

  return undefined;
}

export function hasStandardVocab(word: string): boolean {
  return Boolean(getStandardVocab(word));
}

/** True when the card already has a primary meaning + 2 natural bilingual examples. */
export function hasQualityStandardVocab(word: string): boolean {
  const entry = getStandardVocab(word);
  if (!entry?.meaning?.trim()) return false;
  return hasQualityExamples(word, entry.examples);
}

export function getStandardSearchKeyword(word: string): string {
  return getStandardVocab(word)?.searchKeyword ?? simpleKeyword(word);
}

export function getStandardRank(word: string): number | undefined {
  return getPresetRank(word);
}
