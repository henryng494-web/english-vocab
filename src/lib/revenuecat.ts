import { Capacitor } from "@capacitor/core";
import type { StoredPlacement } from "@/lib/placement";

/**
 * RevenueCat wrapper. Native (Capacitor iOS/Android) uses the real SDK; the web build runs in a
 * safe no-op mode (or sample offerings when NEXT_PUBLIC_REVENUECAT_MOCK=1) and never loads the plugin.
 */

type PurchasesModule = typeof import("@revenuecat/purchases-capacitor");

export const PRO_ENTITLEMENT_ID =
  process.env.NEXT_PUBLIC_REVENUECAT_ENTITLEMENT?.trim() || "pro";

const MOCK_MODE = process.env.NEXT_PUBLIC_REVENUECAT_MOCK === "1";

export type PlanPackage = {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  packageType: string;
  /** Opaque handle passed back to `purchasePackage`. */
  raw: unknown;
};

export type ProStatus = {
  isPro: boolean;
  expiresAt: string | null;
  willRenew: boolean;
};

const FREE_STATUS: ProStatus = { isPro: false, expiresAt: null, willRenew: false };

let sdkPromise: Promise<PurchasesModule | null> | null = null;
let configured = false;
let currentUserId: string | null = null;

export function isNativePlatform(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

function apiKeyForPlatform(): string | null {
  const platform = Capacitor.getPlatform();
  const specific =
    platform === "ios"
      ? process.env.NEXT_PUBLIC_REVENUECAT_API_KEY_IOS
      : platform === "android"
        ? process.env.NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID
        : undefined;
  const key = (specific || process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || "").trim();
  return key || null;
}

function loadSdk(): Promise<PurchasesModule | null> {
  if (!isNativePlatform()) return Promise.resolve(null);
  sdkPromise ??= import("@revenuecat/purchases-capacitor").catch(() => null);
  return sdkPromise;
}

export function isRevenueCatAvailable(): boolean {
  return isNativePlatform() && Boolean(apiKeyForPlatform());
}

/** Idempotent. Resolves true when the native SDK is configured. */
export async function initRevenueCat(appUserId?: string | null): Promise<boolean> {
  if (configured) return true;
  const apiKey = apiKeyForPlatform();
  if (!apiKey) return false;
  const sdk = await loadSdk();
  if (!sdk) return false;
  try {
    await sdk.Purchases.configure({
      apiKey,
      ...(appUserId ? { appUserID: appUserId } : {}),
    });
    configured = true;
    currentUserId = appUserId ?? null;
    return true;
  } catch {
    return false;
  }
}

/** Links the Supabase user id to RevenueCat so entitlements follow the account across devices. */
export async function logInRevenueCat(userId: string): Promise<void> {
  if (!userId) return;
  if (!(await initRevenueCat(userId))) return;
  if (currentUserId === userId) return;
  const sdk = await loadSdk();
  if (!sdk) return;
  try {
    await sdk.Purchases.logIn({ appUserID: userId });
    currentUserId = userId;
  } catch {
    /* network/offline: retried on next auth event */
  }
}

export async function logOutRevenueCat(): Promise<void> {
  if (!configured || currentUserId === null) return;
  const sdk = await loadSdk();
  if (!sdk) return;
  try {
    await sdk.Purchases.logOut();
  } catch {
    /* already anonymous */
  } finally {
    currentUserId = null;
  }
}

/** Stores placement-test results as RevenueCat subscriber attributes. */
export async function syncPlacementAttributes(
  placement: Pick<StoredPlacement, "tier" | "rangeId" | "level" | "source">,
): Promise<void> {
  if (!(await initRevenueCat())) return;
  const sdk = await loadSdk();
  if (!sdk) return;
  try {
    await sdk.Purchases.setAttributes({
      placement_tier: placement.tier,
      placement_range: placement.rangeId,
      placement_level: placement.level,
      placement_source: placement.source,
    });
  } catch {
    /* attributes are re-synced on next launch */
  }
}

function toStatus(
  info: { entitlements: { active: Record<string, { expirationDate?: string | null; willRenew?: boolean }> } },
): ProStatus {
  const entitlement = info.entitlements.active[PRO_ENTITLEMENT_ID];
  if (!entitlement) return FREE_STATUS;
  return {
    isPro: true,
    expiresAt: entitlement.expirationDate ?? null,
    willRenew: entitlement.willRenew === true,
  };
}

export async function getProStatus(): Promise<ProStatus> {
  if (!(await initRevenueCat())) return FREE_STATUS;
  const sdk = await loadSdk();
  if (!sdk) return FREE_STATUS;
  try {
    const { customerInfo } = await sdk.Purchases.getCustomerInfo();
    return toStatus(customerInfo);
  } catch {
    return FREE_STATUS;
  }
}

export async function isPro(): Promise<boolean> {
  return (await getProStatus()).isPro;
}

const MOCK_PACKAGES: PlanPackage[] = [
  { identifier: "$rc_monthly", title: "Monthly", description: "Billed every month", priceString: "$4.99", packageType: "MONTHLY", raw: null },
  { identifier: "$rc_annual", title: "Annual", description: "Best value", priceString: "$29.99", packageType: "ANNUAL", raw: null },
];

/** Packages of the current offering; empty on web unless mock mode is on. */
export async function getOfferings(): Promise<PlanPackage[]> {
  if (!isNativePlatform()) return MOCK_MODE ? MOCK_PACKAGES : [];
  if (!(await initRevenueCat())) return [];
  const sdk = await loadSdk();
  if (!sdk) return [];
  try {
    const offerings = await sdk.Purchases.getOfferings();
    return (offerings.current?.availablePackages ?? []).map((pkg) => ({
      identifier: pkg.identifier,
      title: pkg.product.title,
      description: pkg.product.description,
      priceString: pkg.product.priceString,
      packageType: String(pkg.packageType),
      raw: pkg,
    }));
  } catch {
    return [];
  }
}

export type PurchaseResult =
  | { ok: true; status: ProStatus }
  | { ok: false; cancelled: boolean; error?: string };

export async function purchasePackage(plan: PlanPackage): Promise<PurchaseResult> {
  const sdk = await loadSdk();
  if (!sdk || !configured || !plan.raw) {
    return { ok: false, cancelled: false, error: "unavailable" };
  }
  try {
    const { customerInfo } = await sdk.Purchases.purchasePackage({
      aPackage: plan.raw as Parameters<typeof sdk.Purchases.purchasePackage>[0]["aPackage"],
    });
    return { ok: true, status: toStatus(customerInfo) };
  } catch (error) {
    const err = error as { userCancelled?: boolean; message?: string };
    return { ok: false, cancelled: err.userCancelled === true, error: err.message };
  }
}

export async function restorePurchases(): Promise<ProStatus> {
  const sdk = await loadSdk();
  if (!sdk || !configured) return FREE_STATUS;
  try {
    const { customerInfo } = await sdk.Purchases.restorePurchases();
    return toStatus(customerInfo);
  } catch {
    return FREE_STATUS;
  }
}
