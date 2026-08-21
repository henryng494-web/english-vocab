export type WordRange = {
  id: string;
  label: string;
  compactLabel: string;
  min: number;
  max: number;
};

/** Discover band definitions — keep this file free of heavy frequency data. */
export const WORD_RANGES: WordRange[] = [
  { id: "1-100", label: "Rank 1 - 100", compactLabel: "1–100", min: 1, max: 100 },
  { id: "101-200", label: "Rank 101 - 200", compactLabel: "101–200", min: 101, max: 200 },
  { id: "201-300", label: "Rank 201 - 300", compactLabel: "201–300", min: 201, max: 300 },
  { id: "301-500", label: "Rank 301 - 500", compactLabel: "301–500", min: 301, max: 500 },
  { id: "501-1000", label: "Rank 501 - 1000", compactLabel: "501–1k", min: 501, max: 1000 },
  { id: "1001-3000", label: "Rank 1001 - 3000", compactLabel: "1k–3k", min: 1001, max: 3000 },
  { id: "3001-5000", label: "Rank 3001 - 5000", compactLabel: "3k–5k", min: 3001, max: 5000 },
  {
    id: "5001-plus",
    label: "Rank 5001+",
    compactLabel: "5001+",
    min: 5001,
    max: Number.MAX_SAFE_INTEGER,
  },
];
