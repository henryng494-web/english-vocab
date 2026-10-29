"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { InstallAppHint } from "@/components/layout/InstallAppHint";
import { JungleMascot, JungleCastPill } from "@/components/mascot/JungleMascot";
import { useAuthSession } from "@/context/AuthSessionContext";
import { usePaywall } from "@/context/PaywallContext";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import { LAYOUT_VERSION } from "@/lib/layout-version";
import { deleteAccountAndData } from "@/lib/delete-account";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { readLearnerDisplayName } from "@/lib/user-display-name";
import { saveLearnerNickname } from "@/lib/learner-nickname";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { t } = useI18n();
  const { isPro, openPaywall } = usePaywall();
  const { ready: authReady, isSignedIn, displayName, email, signOut } = useAuthSession();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [nicknameSaving, setNicknameSaving] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);

  useEffect(() => {
    setNicknameDraft(readLearnerDisplayName());
  }, [displayName]);

  const supabaseOn = isSupabaseConfigured();
  const profileLine =
    displayName.trim() || email?.trim() || (authReady ? t("account.signedInGeneric") : "…");

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

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  async function handleSaveNickname() {
    setNicknameSaving(true);
    setNicknameMessage(null);
    try {
      const saved = await saveLearnerNickname(nicknameDraft);
      if (!saved) {
        setNicknameMessage(t("nickname.required"));
        return;
      }
      setNicknameMessage(t("account.nicknameSaved"));
    } finally {
      setNicknameSaving(false);
    }
  }

  return (
    <div className="app-screen app-screen--home">
      <AppHeader title={t("account.title")} />

      <div className="page-scroll">
        <div className="space-y-6 px-4 pb-6">
          <section className="home-card flex items-center gap-4 border-pink-200 bg-pink-50/40">
            <JungleMascot character="elephant" size={68} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`home-section-title ${displayFontClass}`}>Jungle Jokers</h2>
                {isPro ? (
                  <span className="rounded-full bg-[#7c3aed]/15 px-2 py-0.5 text-[10px] font-bold uppercase text-[#7c3aed]">
                    Pro
                  </span>
                ) : null}
              </div>
              <p className="home-body-text text-pink-700">{t("account.tagline")}</p>
              <div className="mt-2">
                <JungleCastPill size={24} />
              </div>
            </div>
          </section>

          <section className="home-card border-violet-200 bg-card">
            <h2 className={`home-section-title ${displayFontClass}`}>{t("account.nicknameTitle")}</h2>
            <p className="home-body-text mt-1">{t("account.nicknameDesc")}</p>
            <label className="sr-only" htmlFor="account-nickname">
              {t("nickname.fieldLabel")}
            </label>
            <input
              id="account-nickname"
              type="text"
              maxLength={32}
              value={nicknameDraft}
              onChange={(event) => setNicknameDraft(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-foreground/15 bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-[#7c3aed]"
            />
            {nicknameMessage ? (
              <p className="mt-2 text-sm text-foreground/70">{nicknameMessage}</p>
            ) : null}
            <button
              type="button"
              disabled={nicknameSaving}
              onClick={() => void handleSaveNickname()}
              className="btn-pill-primary mt-4 flex w-full justify-center py-3.5 disabled:opacity-60"
            >
              {nicknameSaving ? t("nickname.saving") : t("account.nicknameSave")}
            </button>
          </section>

          {supabaseOn && isSignedIn ? (
            <section className="home-card border-slate-200 bg-card">
              <h2 className={`home-section-title ${displayFontClass}`}>{t("account.manageTitle")}</h2>
              <p className="home-body-text mt-1">{t("account.signedInAs", { name: profileLine })}</p>
              {email && displayName.trim() && email !== displayName ? (
                <p className="home-body-text mt-1 text-foreground/60">{email}</p>
              ) : null}
              <button
                type="button"
                disabled={signingOut}
                onClick={() => void handleSignOut()}
                className="mt-4 flex w-full justify-center rounded-full border border-foreground/15 bg-surface px-5 py-3.5 font-semibold text-foreground disabled:opacity-60"
              >
                {signingOut ? t("account.signingOut") : t("account.signOut")}
              </button>
            </section>
          ) : null}

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

          {supabaseOn && !isSignedIn ? (
            <section className="home-card border-primary-200 bg-card">
              <h2 className={`home-section-title ${displayFontClass}`}>{t("account.signIn")}</h2>
              <p className="home-body-text mt-1">{t("account.signInDesc")}</p>
              <Link
                href="/auth/login?next=/account"
                className="btn-pill-primary mt-4 flex w-full justify-center px-5 py-3.5"
              >
                {t("account.signInBtn")}
              </Link>
            </section>
          ) : null}

          {supabaseOn && isSignedIn ? (
            <div className="account-delete-footer">
              <button
                type="button"
                className="account-delete-link"
                onClick={() => {
                  setDeleteError(false);
                  setConfirmOpen(true);
                }}
              >
                {t("account.deleteBtn")}
              </button>
            </div>
          ) : null}

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
