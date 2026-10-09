export type PlacementLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type PlacementQuestion = {
  id: string;
  level: PlacementLevel;
  /** English clue describing the target word. */
  clue: string;
  answer: string;
  distractors: [string, string, string];
};

export const PLACEMENT_LEVEL_WEIGHT: Record<PlacementLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
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
  { id: "c1-alleviate", level: "C1", clue: "To make pain or a problem less severe.", answer: "alleviate", distractors: ["exacerbate", "procrastinate", "scrutinize"] },
];

export const PLACEMENT_QUESTIONS_PER_LEVEL: Record<PlacementLevel, number> = {
  A1: 2,
  A2: 2,
  B1: 2,
  B2: 2,
  C1: 2,
};
