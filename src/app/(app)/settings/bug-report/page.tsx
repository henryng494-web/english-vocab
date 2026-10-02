"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { useI18n } from "@/hooks/use-i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function BugReportPage() {
  const router = useRouter();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  function onPickImage(file: File | null) {
    setImage(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const form = new FormData();
      form.set("message", message.trim());
      form.set("pageUrl", typeof window !== "undefined" ? window.location.href : "");
      if (image) form.set("image", image);

      const response = await fetch("/api/feedback", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as { ok?: boolean; id?: string };
      if (!response.ok || !data.ok) {
        throw new Error("submit_failed");
      }
      setSuccessId(data.id ?? "sent");
      setMessage("");
      onPickImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError(t("reportBug.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title={t("reportBug.title")}
        leading={
          <button
            type="button"
            className="app-header__icon-btn"
            aria-label={t("reportBug.back")}
            onClick={() => router.back()}
          >
            ←
          </button>
        }
        trailing={<AppMenuButton />}
      />

      <div className="page-scroll">
        <form className="settings-page px-4 pb-8" onSubmit={onSubmit}>
          <p className="settings-page__lead">
            {t("reportBug.description")}
          </p>

          <label className="settings-field">
            <span className="settings-field__label">{t("reportBug.whatHappened")}</span>
            <textarea
              className="settings-field__textarea"
              rows={6}
              required
              minLength={5}
              maxLength={4000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t("reportBug.placeholder")}
            />
          </label>

          <div className="settings-field">
            <span className="settings-field__label">{t("reportBug.screenshot")}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              aria-label={t("reportBug.screenshot")}
              onChange={(event) => onPickImage(event.target.files?.[0] ?? null)}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-primary-200 bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-primary-50"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("reportBug.chooseFile")}
              </button>
              <span className="min-w-0 flex-1 truncate text-sm text-foreground/60">
                {image ? image.name : t("reportBug.noFile")}
              </span>
            </div>
            {preview ? (
              <img src={preview} alt={t("reportBug.previewAlt")} className="settings-field__preview" />
            ) : null}
          </div>

          {error ? <p className="settings-page__error">{error}</p> : null}
          {successId ? (
            <p className="settings-page__success">
              {t("reportBug.success", { id: successId })}
            </p>
          ) : null}

          <button type="submit" className="btn-pill-primary w-full" disabled={submitting}>
            {submitting ? t("reportBug.sending") : t("reportBug.submit")}
          </button>

          <p className="settings-page__foot">
            <Link href="/discover" className="home-link-text">
              {t("reportBug.backToHome")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
