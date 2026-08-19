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
      return "bg-primary text-white border-primary-hover";
    case "Top 3000":
      return "bg-primary-200 text-primary-800 border-primary-300";
    case "Top 5000":
      return "bg-primary-100 text-primary-800 border-primary-200";
    default:
      return "bg-primary-50 text-primary-800 border-primary-100";
  }
}
