import type { LearnerContentSlice } from "@/lib/learner-content/types";

/**
 * Curated Spanish learner store (mirrors `standard-vocab` for Vietnamese).
 * Add entries here for gold-standard ES cards; the rest hydrate via discover API + session cache.
 */
export const SPANISH_LEARNER_OVERRIDES: Record<
  string,
  LearnerContentSlice & { english_definition?: string }
> = {
  hole: {
    phonetic: "/həʊl/",
    word_type: "noun",
    vietnamese_meaning: "Agujero · Cavidad",
    english_definition: "An opening or hollow space in a surface.",
    examples:
      "There is a hole in my sock.\n---\nHay un agujero en mi calcetín.\n---\nThe rabbit dug a hole in the garden.\n---\nEl conejo cavó un agujero en el jardín.",
    search_keyword: "hole opening",
  },
  elegant: {
    phonetic: "/ˈel.ə.ɡənt/",
    word_type: "adjective",
    vietnamese_meaning: "Elegante · Refinado",
    english_definition: "Graceful and stylish in appearance or manner.",
    examples:
      "She wore an elegant black dress to the party.\n---\nLlevaba un elegante vestido negro a la fiesta.",
    search_keyword: "elegant dress",
  },
  anything: {
    phonetic: "/ˈeni.θɪŋ/",
    word_type: "pronoun",
    vietnamese_meaning: "Cualquier cosa · Algo",
    english_definition: "Any thing or things of any kind.",
    examples:
      "Do you have anything to eat in the refrigerator?\n---\n¿Tienes algo de comer en el refrigerador?",
    search_keyword: "anything",
  },
};
