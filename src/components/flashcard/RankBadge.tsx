import {
  getImportanceTier,
  tierBadgeColor,
  type ImportanceTier,
} from "@/lib/word-rank";

export function RankBadge({ rank }: { rank: number }) {
  const tier = getImportanceTier(rank) as ImportanceTier;
  const color = tierBadgeColor(tier);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${color}`}
    >
      <span aria-hidden>⭐</span>
      {tier}
    </span>
  );
}
