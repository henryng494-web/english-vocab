export type AppLocale = "vi" | "en";

export const APP_LOCALES: readonly AppLocale[] = ["vi", "en"] as const;

export const DEFAULT_APP_LOCALE: AppLocale = "vi";

export type MessageKey = keyof typeof messages.vi;

type MessageTree = Record<string, string>;

export const messages: Record<AppLocale, MessageTree> = {
  vi: {
    "tab.home": "Trang chủ",
    "tab.journey": "Hành trình",
    "tab.review": "Ôn tập",
    "tab.library": "Thư viện",
    "tab.dueAria": "{count} từ cần ôn hôm nay",

    "menu.title": "Menu",
    "menu.close": "Đóng",
    "menu.language": "Ngôn ngữ app",
    "menu.languageHint": "Chọn ngôn ngữ giao diện (nghĩa từ vựng vẫn hiển thị tiếng Việt).",
    "menu.langVi": "Tiếng Việt",
    "menu.langEn": "English",
    "menu.learning": "Học tập",
    "menu.autoSpeak": "Tự động phát âm",
    "menu.autoSpeakDesc": "Đọc mỗi từ mới khi xuất hiện",
    "menu.dailyGoal": "Mục tiêu học mỗi ngày",
    "menu.dailyGoalHint": "Bạn muốn học bao lâu mỗi ngày?",
    "menu.goal10": "10 phút",
    "menu.goal20": "20 phút",
    "menu.goal30": "30 phút",
    "menu.goal60": "1 giờ",
    "menu.goal90": "1,5 giờ",
    "menu.goal120": "2 giờ",
    "menu.reminder": "Nhắc học",
    "menu.reminderDesc": "Thông báo trình duyệt vào giờ bạn chọn",
    "menu.reminderTime": "Giờ nhắc",
    "menu.account": "Tài khoản",
    "menu.accountLink": "Tài khoản & đăng nhập",
    "menu.support": "Hỗ trợ",
    "menu.bugReport": "Báo lỗi",
    "menu.about": "Giới thiệu",
    "menu.privacy": "Chính sách bảo mật",
    "menu.terms": "Điều khoản sử dụng",

    "home.title": "Trang chủ",
    "home.searchAria": "Tìm từ",
    "home.today": "Hôm nay",
    "home.todayDueGoal": "{due} từ cần ôn · còn {minutes} phút đến mục tiêu",
    "home.todayGoalLeft": "Còn {minutes} phút đến mục tiêu · {learned} từ mới hôm nay",
    "home.todayGoalDone": "Đã đạt mục tiêu · {learned} từ mới hôm nay",
    "home.minutesProgress": "{current} / {goal} phút",
    "home.startReview": "Bắt đầu ôn tập",
    "home.startLearn": "Bắt đầu học mới",
    "home.doneToday": "Hoàn thành hôm nay",
    "home.flows": "Luồng học",
    "home.flowNew": "Học mới",
    "home.flowNewLeft": "{count} từ còn lại",
    "home.flowReview": "Ôn tập",
    "home.flowReviewDue": "{count} từ đến hạn",
    "home.flowReviewNone": "Không có từ đến hạn",
    "home.flowReviewDetail": "Quiz từ · nghĩa · nhớ lại",
    "home.flowLibrary": "Thư viện",
    "home.flowLibraryKnown": "{count} đã biết",
    "home.flowLibraryReview": "{count} đang ôn",
    "home.progress": "Tiến độ",
    "home.known": "Đã biết",
    "home.reviewing": "Đang ôn",
    "home.streak": "Streak",
    "home.streakDays": "{count} ngày",

    "journey.title": "Hành trình",
    "journey.backHome": "Về trang chủ",
    "journey.selectBand": "Chọn cấp từ",
    "journey.hiddenWords": "{count} từ đã biết hoặc đang ôn trong cấp {band}",
    "journey.learnThis": "Học từ này",
    "journey.alreadyKnow": "Đã biết rồi",
    "journey.allFinished":
      "Bạn đã hoàn thành mọi cấp từ. Từ đã học hoặc đánh dấu đã biết sẽ không hiện lại ở đây.",
    "journey.rangeFinished": "Bạn đã xong cấp này. Đang chuyển sang cấp gần nhất còn từ mới…",
    "journey.backHomeBtn": "Về trang chủ",

    "review.title": "Ôn tập",
    "review.sessionTitle": "Ôn tập {current}/{total}",
    "review.notYet": "Chưa ôn lần nào",
    "review.onceSoFar": "Đã ôn 1 lần",
    "review.timesSoFar": "Đã ôn {count} lần",
    "review.reviewIn1Day": "Ôn lại sau 1 ngày",
    "review.reviewInDays": "Ôn lại sau {days} ngày",
    "review.alreadyKnow": "Đã biết rồi",
    "review.chooseInterval": "Chọn lịch ôn",
    "review.notSure": "Không chắc?",
    "review.lookUp": "Xem lại",
    "review.iRemember": "Nhớ rồi",
    "review.recallPrompt": "Bạn còn nhớ từ này không?",
    "review.chooseMatching": "Chọn từ đúng.",
    "review.allCaughtUp": "Bạn đã ôn xong!",
    "review.noWordsDue": "Không có từ đến hạn",
    "review.comeBackLater":
      "Quay lại khi đến lịch ôn tiếp theo, hoặc thêm từ mới.",
    "review.learnOnHome":
      "Học từ trên Trang chủ hoặc thêm từ bên dưới để bắt đầu ôn.",
    "review.addWordPlaceholder": "Thêm từ mới…",
    "review.add": "Thêm",

    "library.knownTitle": "Thư viện · Đã biết",
    "library.reviewTitle": "Thư viện · Đang ôn",
    "library.knownEmpty": "Chưa có từ nào được đánh dấu đã biết",
    "library.knownHint": 'Nhấn "Đã biết rồi" trên Hành trình khi bạn thuộc từ đó.',
    "library.reviewEmpty": "Chưa có từ đang ôn",
    "library.reviewHint": 'Nhấn "Học từ này" trên Hành trình để thêm từ vào lịch ôn.',
    "library.filterKnown": "Đã biết",
    "library.filterReview": "Đang ôn",
    "library.filterAria": "Lọc thư viện",
    "library.sortRank": "Theo rank",
    "library.sortRecent": "Mới thêm",
    "library.sortAria": "Sắp xếp từ",
    "library.wordCount": "{count} từ",

    "status.known": "Đã biết",
    "status.new": "Mới",
    "status.learning": "Đang học",
    "status.due": "Đến hạn",

    "register.informal": "Không trang trọng",
    "register.neutral": "Trung tính",
    "register.formal": "Trang trọng",

    "pos.noun": "Danh từ",
    "pos.verb": "Động từ",
    "pos.adjective": "Tính từ",
    "pos.adverb": "Trạng từ",
    "pos.preposition": "Giới từ",
    "pos.pronoun": "Đại từ",
    "pos.conjunction": "Liên từ",
    "pos.interjection": "Thán từ",
    "pos.article": "Mạo từ",
    "pos.number": "Số từ",
    "pos.determiner": "Hạn định từ",

    "speak.pronounce": "Phát âm",
    "speak.aria": "Phát âm",

    "account.title": "Tài khoản",
    "account.backHome": "Về trang chủ",
    "account.signIn": "Đăng nhập",
    "account.signInDesc": "Lưu tiến độ học lên Supabase khi bạn đã đăng nhập.",
    "account.signInBtn": "Đến trang đăng nhập",

    "onboarding.aria": "Giới thiệu app",
    "onboarding.welcomeTitle": "Chào bạn đến với Jungle Jokers!",
    "onboarding.welcomeDesc":
      "App giúp bạn học từ tiếng Anh thông dụng nhất — có hình minh hoạ, ví dụ và lịch ôn tập. Mình sẽ bắt đầu từ những từ gặp hàng ngày, phù hợp cho người mới.",
    "onboarding.next": "Tiếp theo",
    "onboarding.back": "Quay lại",
    "onboarding.dailyGoal": "Mục tiêu học mỗi ngày",
    "onboarding.dailyGoalDesc":
      "Chọn thời gian bạn muốn dành cho tiếng Anh mỗi ngày — có thể đổi sau trong Menu.",
    "onboarding.howTitle": "Cách học trên Hành trình",
    "onboarding.learnThis": "Học từ này",
    "onboarding.learnThisDesc":
      "Thêm từ vào danh sách Đang ôn — app sẽ nhắc bạn ôn theo lịch.",
    "onboarding.alreadyKnow": "Đã biết rồi",
    "onboarding.alreadyKnowDesc":
      "Bỏ qua từ bạn đã thuộc — lưu vào Đã biết, không cần ôn lại.",
    "onboarding.bandHint":
      "Thấy quá dễ hoặc quá khó? Vào Hành trình và đổi nhóm từ ở góc phải trên.",
    "onboarding.start": "Bắt đầu học",
  },
  en: {
    "tab.home": "Home",
    "tab.journey": "Journey",
    "tab.review": "Review",
    "tab.library": "Library",
    "tab.dueAria": "{count} words due today",

    "menu.title": "Menu",
    "menu.close": "Close",
    "menu.language": "App language",
    "menu.languageHint": "Choose interface language (word meanings stay in Vietnamese).",
    "menu.langVi": "Tiếng Việt",
    "menu.langEn": "English",
    "menu.learning": "Learning",
    "menu.autoSpeak": "Auto-pronounce",
    "menu.autoSpeakDesc": "Speak each new word automatically",
    "menu.dailyGoal": "Daily study goal",
    "menu.dailyGoalHint": "How long do you want to study each day?",
    "menu.goal10": "10 min",
    "menu.goal20": "20 min",
    "menu.goal30": "30 min",
    "menu.goal60": "1 hour",
    "menu.goal90": "1.5 hours",
    "menu.goal120": "2 hours",
    "menu.reminder": "Study reminder",
    "menu.reminderDesc": "Browser notification at your chosen time",
    "menu.reminderTime": "Reminder time",
    "menu.account": "Account",
    "menu.accountLink": "Account & sign in",
    "menu.support": "Support",
    "menu.bugReport": "Report a bug",
    "menu.about": "About",
    "menu.privacy": "Privacy policy",
    "menu.terms": "Terms of service",

    "home.title": "Home",
    "home.searchAria": "Search words",
    "home.today": "Today",
    "home.todayDueGoal": "{due} words due · {minutes} min left to goal",
    "home.todayGoalLeft": "{minutes} min left to goal · {learned} new words today",
    "home.todayGoalDone": "Goal reached · {learned} new words today",
    "home.minutesProgress": "{current} / {goal} min",
    "home.startReview": "Start review",
    "home.startLearn": "Learn new words",
    "home.doneToday": "All done for today",
    "home.flows": "Study flows",
    "home.flowNew": "New words",
    "home.flowNewLeft": "{count} words left",
    "home.flowReview": "Review",
    "home.flowReviewDue": "{count} words due",
    "home.flowReviewNone": "No words due",
    "home.flowReviewDetail": "Word · sense · recall quiz",
    "home.flowLibrary": "Library",
    "home.flowLibraryKnown": "{count} known",
    "home.flowLibraryReview": "{count} in review",
    "home.progress": "Progress",
    "home.known": "Known",
    "home.reviewing": "In review",
    "home.streak": "Streak",
    "home.streakDays": "{count} days",

    "journey.title": "Journey",
    "journey.backHome": "Back to home",
    "journey.selectBand": "Select word range",
    "journey.hiddenWords": "{count} known or in review in rank {band}",
    "journey.learnThis": "Learn this",
    "journey.alreadyKnow": "Already know",
    "journey.allFinished":
      "You've finished every rank. Words you learned or marked as known no longer appear here.",
    "journey.rangeFinished":
      "You've finished this range. Jumping to the nearest rank with new words…",
    "journey.backHomeBtn": "Back to home",

    "review.title": "Review",
    "review.sessionTitle": "Review {current}/{total}",
    "review.notYet": "Not yet",
    "review.onceSoFar": "Once so far",
    "review.timesSoFar": "{count} times so far",
    "review.reviewIn1Day": "Review in 1 day",
    "review.reviewInDays": "Review in {days} days",
    "review.alreadyKnow": "Already know",
    "review.chooseInterval": "Choose review interval",
    "review.notSure": "Not sure?",
    "review.lookUp": "Look up",
    "review.iRemember": "I remember",
    "review.recallPrompt": "Do you remember this word?",
    "review.chooseMatching": "Choose the matching word.",
    "review.allCaughtUp": "You're all caught up!",
    "review.noWordsDue": "No words due",
    "review.comeBackLater":
      "Come back when the next review interval is due, or add a new word.",
    "review.learnOnHome": "Learn words on Home or add one below to start reviewing.",
    "review.addWordPlaceholder": "Add a new word…",
    "review.add": "Add",

    "library.knownTitle": "Library · Known",
    "library.reviewTitle": "Library · In review",
    "library.knownEmpty": "No words marked as known yet",
    "library.knownHint": 'Tap "Already know" on Journey when a word is familiar.',
    "library.reviewEmpty": "No words in review yet",
    "library.reviewHint": 'Tap "Learn this" on Journey to add words to your review queue.',
    "library.filterKnown": "Known",
    "library.filterReview": "In review",
    "library.filterAria": "Filter library",
    "library.sortRank": "Rank",
    "library.sortRecent": "Recently added",
    "library.sortAria": "Sort words",
    "library.wordCount": "{count} words",

    "status.known": "Known",
    "status.new": "New",
    "status.learning": "Learning",
    "status.due": "Due",

    "register.informal": "Informal",
    "register.neutral": "Neutral",
    "register.formal": "Formal",

    "pos.noun": "Noun",
    "pos.verb": "Verb",
    "pos.adjective": "Adjective",
    "pos.adverb": "Adverb",
    "pos.preposition": "Preposition",
    "pos.pronoun": "Pronoun",
    "pos.conjunction": "Conjunction",
    "pos.interjection": "Interjection",
    "pos.article": "Article",
    "pos.number": "Number",
    "pos.determiner": "Determiner",

    "speak.pronounce": "Pronounce",
    "speak.aria": "Pronounce",

    "account.title": "Account",
    "account.backHome": "Back to home",
    "account.signIn": "Sign in",
    "account.signInDesc": "Save learning progress to Supabase when you are signed in.",
    "account.signInBtn": "Go to sign in",

    "onboarding.aria": "App introduction",
    "onboarding.welcomeTitle": "Welcome to Jungle Jokers!",
    "onboarding.welcomeDesc":
      "Learn the most useful English words with pictures, examples, and spaced review. We start with everyday words — great if you're new or getting back into it.",
    "onboarding.next": "Next",
    "onboarding.back": "Back",
    "onboarding.dailyGoal": "Daily study goal",
    "onboarding.dailyGoalDesc":
      "Pick how long you want to study each day — you can change this later in Menu.",
    "onboarding.howTitle": "How Journey works",
    "onboarding.learnThis": "Learn this",
    "onboarding.learnThisDesc":
      "Adds the word to In review — the app will remind you on a schedule.",
    "onboarding.alreadyKnow": "Already know",
    "onboarding.alreadyKnowDesc":
      "Skip words you already know — saved under Known, no review needed.",
    "onboarding.bandHint":
      "Too easy or too hard? Open Journey and change the word group from the top-right menu.",
    "onboarding.start": "Start learning",
  },
};

export function isAppLocale(value: unknown): value is AppLocale {
  return value === "vi" || value === "en";
}

export function translate(
  locale: AppLocale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const template = messages[locale][key] ?? messages.en[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name];
    return value === undefined ? `{${name}}` : String(value);
  });
}

export function dailyGoalMessageKey(minutes: number): MessageKey | null {
  const map: Record<number, MessageKey> = {
    10: "menu.goal10",
    20: "menu.goal20",
    30: "menu.goal30",
    60: "menu.goal60",
    90: "menu.goal90",
    120: "menu.goal120",
  };
  return map[minutes] ?? null;
}
