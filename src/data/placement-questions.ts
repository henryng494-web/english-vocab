export type PlacementLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type PlacementQuestion = {
  id: string;
  level: PlacementLevel;
  /** English clue describing the target word. */
  clue: string;
  answer: string;
  distractors: [string, string, string];
};

export type PlacementDifficulty = "easy" | "medium" | "hard";

/** Easy ≈ rank 1–2000, medium ≈ rank 2000–4000, hard ≈ rank 5000+. */
export const PLACEMENT_LEVEL_DIFFICULTY: Record<PlacementLevel, PlacementDifficulty> = {
  A1: "easy",
  A2: "easy",
  B1: "medium",
  B2: "medium",
  C1: "hard",
};

export const PLACEMENT_QUESTIONS_PER_DIFFICULTY: Record<PlacementDifficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 3,
};

export const PLACEMENT_QUESTION_BANK: readonly PlacementQuestion[] = [
  { id: "a1-cat", level: "A1", clue: "A small animal that says “meow” and often lives in homes.", answer: "cat", distractors: ["tree", "chair", "bread"] },
  { id: "a1-water", level: "A1", clue: "You drink this clear liquid every day.", answer: "water", distractors: ["paper", "shoe", "cloud"] },
  { id: "a1-breakfast", level: "A1", clue: "The meal you eat in the morning.", answer: "breakfast", distractors: ["dinner", "holiday", "airport"] },
  { id: "a2-library", level: "A2", clue: "A place where you can borrow books.", answer: "library", distractors: ["bakery", "station", "garden"] },
  { id: "a2-cheap", level: "A2", clue: "Not costing much money.", answer: "cheap", distractors: ["empty", "narrow", "quiet"] },
  { id: "b1-passport", level: "B1", clue: "An official document you show when you travel to another country.", answer: "passport", distractors: ["receipt", "diploma", "tablet"] },
  { id: "b1-improve", level: "B1", clue: "To make something better than it was before.", answer: "improve", distractors: ["delay", "avoid", "borrow"] },
  { id: "b1-neighbour", level: "B1", clue: "A person who lives in the house next to yours.", answer: "neighbour", distractors: ["stranger", "guest", "relative"] },
  { id: "b2-assume", level: "B2", clue: "To believe something is true without having proof.", answer: "assume", distractors: ["assure", "assess", "assist"] },
  { id: "b2-widespread", level: "B2", clue: "Found or happening in many places or among many people.", answer: "widespread", distractors: ["temporary", "reluctant", "ambiguous"] },
  { id: "c1-concise", level: "C1", clue: "Giving a lot of information in very few words.", answer: "concise", distractors: ["elaborate", "vague", "lenient"] },
  { id: "c1-ubiquitous", level: "C1", clue: "Seeming to be present everywhere at the same time.", answer: "ubiquitous", distractors: ["scarce", "obsolete", "fragile"] },
  { id: "c1-mitigate", level: "C1", clue: "To reduce the harmful effect of something.", answer: "mitigate", distractors: ["instigate", "contemplate", "fabricate"] },
  { id: "c1-alleviate", level: "C1", clue: "To make pain or a problem less severe.", answer: "alleviate", distractors: ["exacerbate", "procrastinate", "scrutinize"] },
];
