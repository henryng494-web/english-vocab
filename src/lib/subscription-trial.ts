export type TrialDuration = { unit: "day" | "week" | "month" | "year"; count: number };

/** RevenueCat eligibility 2 means eligible; unknown/error must never advertise a trial. */
export function eligibleFreeTrial(
  intro: { price: number; periodUnit?: string; periodNumberOfUnits?: number; cycles?: number } | null | undefined,
  eligibility: number | undefined,
): TrialDuration | undefined {
  if (intro?.price !== 0 || eligibility !== 2) return undefined;
  const unit = intro.periodUnit?.toLowerCase();
  const count = (intro.periodNumberOfUnits ?? 0) * (intro.cycles ?? 1);
  if (!Number.isSafeInteger(count) || count <= 0) return undefined;
  if (unit !== "day" && unit !== "week" && unit !== "month" && unit !== "year") return undefined;
  return { unit, count };
}
