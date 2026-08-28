export type LearningStatus = "new" | "learning" | "need_review" | "mastered";

export type WordBank = {
  id: string;
  word: string;
  rank: number;
};

export type WordDetail = {
  id: string;
  word: string;
  phonetic: string;
  word_type: string;
  vietnamese_meaning: string;
  english_definition: string;
  examples: string;
  collocations: string | null;
  image_url: string | null;
};

export type UserLearning = {
  id: string;
  word: string;
  user_id: string | null;
  status: LearningStatus;
  last_reviewed_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      word_bank: {
        Row: WordBank;
        Insert: {
          id?: string;
          word: string;
          rank: number;
        };
        Update: Partial<WordBank>;
        Relationships: [];
      };
      word_details: {
        Row: WordDetail;
        Insert: {
          id?: string;
          word: string;
          phonetic: string;
          word_type: string;
          vietnamese_meaning: string;
          english_definition: string;
          examples: string;
          collocations?: string | null;
          image_url?: string | null;
        };
        Update: Partial<WordDetail>;
        Relationships: [];
      };
      user_learning: {
        Row: UserLearning;
        Insert: {
          id?: string;
          word: string;
          user_id?: string | null;
          status: LearningStatus;
          last_reviewed_at?: string | null;
        };
        Update: Partial<UserLearning>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type WordFamilyMember = {
  word: string;
  pos: string;
  vi: string;
};

export type VocabWord = WordDetail & {
  rank: number;
  importance_tier: string;
  learning_status: LearningStatus;
  last_reviewed_at: string | null;
  search_keyword?: string | null;
  word_family?: WordFamilyMember[];
  family_head?: string;
  register?: import("@/lib/word-meanings").WordRegister | null;
};
