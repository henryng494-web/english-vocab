"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { InstallAppHint } from "@/components/layout/InstallAppHint";
import { JungleMascot, JungleCastPill } from "@/components/mascot/JungleMascot";
import { usePaywall } from "@/context/PaywallContext";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import { LAYOUT_VERSION } from "@/lib/layout-version";
import { deleteAccountAndData } from "@/lib/delete-account";
import Link from "next/link";
import { useState } from "react";

export default function AccountPage() {
  const { t } = useI18n();
  const { isPro, openPaywall } = usePaywall();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError(false);
    try {
      await deleteAccountAndData();
    } catch {
      setDeleting(false);
      setDeleteError(true);
    }
  }

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title={t("account.title")}
        leading={
          <Link href="/discover" className="app-header__icon-btn" aria-label={t("account.backHome")}>
            ←
          </Link>
        }
      />

      <div className="page-scroll">
        <div className="space-y-6 px-4 pb-6">
          <section className="home-card flex items-center gap-4 border-pink-200 bg-pink-50/40">
            <JungleMascot character="elephant" size={68} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`home-section-title ${displayFontClass}`}>Jungle Jokers</h2>
              </div>
              <p className="home-body-text text-pink-700">{t("account.tagline")}</p>
              <div className="mt-2">
                <JungleCastPill size={24} />
              </div>
            </div>
          </section>

          <section className="home-card border-accent-200 bg-card">
            <h2 className={`home-section-title ${displayFontClass}`}>{t("paywall.accountTitle")}</h2>
            <p className="home-body-text mt-1">
              {isPro ? t("paywall.proActive") : t("paywall.accountDesc")}
            </p>
            {isPro ? null : (
              <button
                type="button"
                onClick={openPaywall}
                className="mt-4 flex w-full justify-center rounded-full bg-[#7c3aed] px-5 py-3.5 font-bold text-white"
              >
                {t("paywall.upgradeBtn")}
              </button>
            )}
          </section>

          <InstallAppHint />

          <section className="home-card border-primary-200 bg-card">
            <h2 className={`home-section-title ${displayFontClass}`}>{t("account.signIn")}</h2>
            <p className="home-body-text mt-1">{t("account.signInDesc")}</p>
            <Link
              href="/auth/login"
              className="btn-pill-primary mt-4 flex w-full justify-center px-5 py-3.5"
            >
              {t("account.signInBtn")}
            </Link>
          </section>

          <button
            type="button"
            onClick={() => {
              setDeleteError(false);
              setConfirmOpen(true);
            }}
            className="flex w-full justify-center rounded-full bg-red-600 px-5 py-3.5 font-bold text-white"
          >
            {t("account.deleteBtn")}
          </button>

          {process.env.NODE_ENV !== "production" && (
            <p className="pt-4 text-center text-[10px] text-foreground/30">
              Layout {LAYOUT_VERSION}
            </p>
          )}
        </div>
      </div>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[1090] flex items-center justify-center bg-slate-900/45 px-6"
          role="presentation"
          onClick={() => (deleting ? undefined : setConfirmOpen(false))}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-surface p-5 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-sm text-foreground/80">{t("account.deleteConfirm")}</p>
            {deleteError ? (
              <p className="mt-3 text-sm text-red-600">{t("account.deleteFailed")}</p>
            ) : null}
            <button
              type="button"
              disabled={deleting}
              onClick={() => void confirmDelete()}
              className="mt-4 flex w-full justify-center rounded-full bg-red-600 py-3 font-bold text-white disabled:opacity-60"
            >
              {deleting ? t("account.deleting") : t("account.deleteConfirmBtn")}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => setConfirmOpen(false)}
              className="mt-2 w-full py-2 text-sm text-foreground/60"
            >
              {t("account.deleteCancel")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
