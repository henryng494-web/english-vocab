"use client";

import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import {
  getOfferings,
  isNativePlatform,
  purchasePackage,
  restorePurchases,
  type PlanPackage,
  type ProStatus,
} from "@/lib/revenuecat";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PaywallContentProps = {
  onClose: () => void;
  onProChange?: (status: ProStatus) => void;
  /** Close immediately when no plans can be shown (e.g. web without mock mode). */
  closeIfUnavailable?: boolean;
};

const BENEFITS = ["paywall.benefit1", "paywall.benefit2", "paywall.benefit3", "paywall.benefit4"] as const;

const BRAND = "#7c3aed";

function pickPlans(packages: PlanPackage[]) {
  const lifetime =
    packages.find((p) => p.packageType === "LIFETIME" || p.identifier === "$rc_lifetime") ?? null;
  const rest = packages.filter((p) => p !== lifetime);
  const { annual, monthly } = pickRecurring(rest);
  return { annual, monthly, lifetime };
}

function pickRecurring(packages: PlanPackage[]) {
  const annual =
    packages.find((p) => p.packageType === "ANNUAL" || p.identifier === "$rc_annual") ?? null;
  const monthly =
    packages.find((p) => p.packageType === "MONTHLY" || p.identifier === "$rc_monthly") ?? null;
  if (annual || monthly) return { annual, monthly };
  return { annual: packages[1] ?? null, monthly: packages[0] ?? null };
}

export function PaywallContent({ onClose, onProChange, closeIfUnavailable }: PaywallContentProps) {
  const { t } = useI18n();
  const [packages, setPackages] = useState<PlanPackage[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getOfferings().then((list) => {
      if (cancelled) return;
      setPackages(list);
      const { annual, monthly, lifetime } = pickPlans(list);
      setSelectedId((annual ?? monthly ?? lifetime)?.identifier ?? null);
      if (list.length === 0 && closeIfUnavailable) onClose();
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { annual, monthly, lifetime } = useMemo(() => pickPlans(packages ?? []), [packages]);
  const selected = [annual, monthly, lifetime].find((plan) => plan?.identifier === selectedId) ?? null;

  const savePercent = useMemo(() => {
    if (!annual || !monthly || monthly.price <= 0) return 0;
    const percent = Math.round((1 - annual.price / (monthly.price * 12)) * 100);
    return percent >= 5 ? percent : 0;
  }, [annual, monthly]);

  async function handlePurchase() {
    if (!selected || busy) return;
    setBusy(true);
    setMessage(null);
    const result = await purchasePackage(selected);
    setBusy(false);
    if (result.ok) {
      onProChange?.(result.status);
      onClose();
      return;
    }
    if (result.cancelled) return;
    setMessage({
      kind: "error",
      text: isNativePlatform() ? t("paywall.error") : t("paywall.webOnly"),
    });
  }

  async function handleRestore() {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const status = await restorePurchases();
    setBusy(false);
    if (status.isPro) {
      onProChange?.(status);
      setMessage({ kind: "success", text: t("paywall.restored") });
      onClose();
    } else {
      setMessage({
        kind: "error",
        text: isNativePlatform() ? t("paywall.restoreNone") : t("paywall.webOnly"),
      });
    }
  }

  function planCard(plan: PlanPackage, kind: "annual" | "monthly" | "lifetime") {
    const active = plan.identifier === selectedId;
    return (
      <button
        key={plan.identifier}
        type="button"
        role="radio"
        aria-checked={active}
        onClick={() => setSelectedId(plan.identifier)}
        style={active ? { borderColor: BRAND, backgroundColor: `${BRAND}14` } : undefined}
        className={`relative w-full rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
          active ? "" : "border-primary-200 bg-surface"
        }`}
      >
        {kind !== "monthly" ? (
          <span
            className="absolute -top-2.5 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
            style={{ backgroundColor: BRAND }}
          >
            {kind === "annual"
              ? savePercent > 0
                ? `${t("paywall.popular")} · ${t("paywall.save", { percent: savePercent })}`
                : t("paywall.popular")
              : t("paywall.lifetimeBadge")}
          </span>
        ) : null}
        <span className="flex items-center gap-3">
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold text-white"
            style={{
              borderColor: active ? BRAND : "#cbd5e1",
              backgroundColor: active ? BRAND : "transparent",
            }}
            aria-hidden
          >
            {active ? "✓" : ""}
          </span>
          <span className="flex-1 font-bold text-foreground">
            {kind === "annual"
              ? t("paywall.planAnnual")
              : kind === "monthly"
                ? t("paywall.planMonthly")
                : t("paywall.planLifetime")}
          </span>
          <span className="text-sm font-semibold text-foreground/80">
            {kind === "annual"
              ? t("paywall.perYear", { price: plan.priceString })
              : kind === "monthly"
                ? t("paywall.perMonth", { price: plan.priceString })
                : t("paywall.oneTime", { price: plan.priceString })}
          </span>
        </span>
      </button>
    );
  }

  const loading = packages === null;
  const empty = packages !== null && packages.length === 0;
  const ctaLabel = selected?.hasFreeTrial ? t("paywall.ctaTrial") : t("paywall.ctaUpgrade");

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 pb-6 pt-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("paywall.close")}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-foreground"
        >
          ✕
        </button>
      </div>

      <div className="mt-1 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/mascot-croc.png" alt="" aria-hidden className="mx-auto h-16 w-auto" />
        <h1 className={`mt-2 text-2xl font-bold text-foreground ${displayFontClass}`}>
          {t("paywall.title")}
        </h1>
        <p className="mt-1 text-sm text-foreground/65">{t("paywall.subtitle")}</p>
      </div>

      <ul className="mt-5 space-y-2.5">
        {BENEFITS.map((key) => (
          <li key={key} className="flex items-start gap-3 text-sm font-medium text-foreground">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: BRAND }}
              aria-hidden
            >
              ✓
            </span>
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-3" role="radiogroup" aria-label={t("paywall.title")}>
        {loading ? <p className="text-center text-sm text-foreground/60">{t("paywall.loading")}</p> : null}
        {empty ? (
          <p className="text-center text-sm text-foreground/60">
            {isNativePlatform() ? t("paywall.unavailable") : t("paywall.webOnly")}
          </p>
        ) : null}
        {annual ? planCard(annual, "annual") : null}
        {monthly ? planCard(monthly, "monthly") : null}
        {lifetime ? planCard(lifetime, "lifetime") : null}
      </div>

      {message ? (
        <p
          role={message.kind === "error" ? "alert" : "status"}
          className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
            message.kind === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handlePurchase}
        disabled={!selected || busy}
        aria-busy={busy}
        style={{ backgroundColor: BRAND }}
        className="mt-5 flex w-full items-center justify-center rounded-full py-3.5 text-base font-bold text-white shadow-sm disabled:opacity-60"
      >
        {busy ? "…" : ctaLabel}
      </button>
      <p className="mt-2 text-center text-xs text-foreground/55">
        {selected?.packageType === "LIFETIME" ? t("paywall.lifetimeNote") : t("paywall.cancelAnytime")}
      </p>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <button type="button" onClick={handleRestore} disabled={busy} style={{ color: BRAND }}
          className="font-semibold hover:underline disabled:opacity-60">
          {t("paywall.restore")}
        </button>
        <button type="button" onClick={onClose} className="text-foreground/60 hover:text-foreground">
          {t("paywall.later")}
        </button>
        <p className="mt-1 flex gap-3 text-xs text-foreground/50">
          <Link href="/terms" className="underline" onClick={onClose}>{t("menu.terms")}</Link>
          <Link href="/privacy" className="underline" onClick={onClose}>{t("menu.privacy")}</Link>
        </p>
      </div>
    </div>
  );
}
