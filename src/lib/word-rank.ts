export type ImportanceTier = "Top 1000" | "Top 3000" | "Top 5000" | "Beyond 5000";

export function getImportanceTier(rank: number): ImportanceTier {
  if (rank <= 1000) return "Top 1000";
  if (rank <= 3000) return "Top 3000";
  if (rank <= 5000) return "Top 5000";
  return "Beyond 5000";
}

export function getTierSortValue(tier: ImportanceTier): number {
  switch (tier) {
    case "Top 1000":
      return 1;
    case "Top 3000":
      return 2;
    case "Top 5000":
      return 3;
    default:
      return 4;
  }
}

export function tierBadgeColor(tier: ImportanceTier): string {
  switch (tier) {
    case "Top 1000":
      return "bg-neutral-900 text-white border-neutral-700";
    case "Top 3000":
      return "bg-neutral-700 text-white border-neutral-600";
    case "Top 5000":
      return "bg-neutral-300 text-neutral-900 border-neutral-400";
    default:
      return "bg-neutral-100 text-neutral-600 border-neutral-200";
  }
}
