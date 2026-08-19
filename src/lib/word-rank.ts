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
      return "bg-white text-black border-neutral-300";
    case "Top 3000":
      return "bg-neutral-300 text-black border-neutral-400";
    case "Top 5000":
      return "bg-neutral-600 text-white border-neutral-500";
    default:
      return "bg-neutral-800 text-neutral-300 border-neutral-700";
  }
}
