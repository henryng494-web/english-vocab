"use client";

import { keepNaturalExamples } from "@/lib/example-fallback";
import type { VocabExample } from "@/lib/parse-examples";

type VocabExampleListProps = {
  word: string;
  examples: VocabExample[];
  wordType?: string | null;
  meaning?: string | null;
  boxed?: boolean;
};

export function VocabExampleList({
  word,
  examples,
  boxed = false,
}: VocabExampleListProps) {
  const filled = keepNaturalExamples(word, examples);

  if (filled.length === 0) return null;

  return (
    <ul className="space-y-2">
      {filled.map((ex, i) => (
        <li
          key={`${word}-ex-${i}`}
          className={
            boxed
              ? "rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
              : "text-sm text-slate-600"
          }
        >
          <p className="italic">{ex.en}</p>
          {ex.vi ? (
            <p className="mt-0.5 italic text-slate-500">{ex.vi}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
