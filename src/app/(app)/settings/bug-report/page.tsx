"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { displayFontClass } from "@/lib/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BugReportPage() {
  const router = useRouter();
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
      const data = (await response.json()) as { ok?: boolean; id?: string; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Submit failed");
      }
      setSuccessId(data.id ?? "sent");
      setMessage("");
      onPickImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title="Report a bug"
        leading={
          <button
            type="button"
            className="app-header__icon-btn"
            aria-label="Back"
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
            Tell us what went wrong. You can attach a screenshot to help us fix it faster.
          </p>

          <label className="settings-field">
            <span className="settings-field__label">What happened?</span>
            <textarea
              className="settings-field__textarea"
              rows={6}
              required
              minLength={5}
              maxLength={4000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Steps to reproduce, what you expected, and what you saw instead…"
            />
          </label>

          <div className="settings-field">
            <span className="settings-field__label">Screenshot (optional)</span>
            <input
              type="file"
              accept="image/*"
              className="settings-field__file"
              onChange={(event) => onPickImage(event.target.files?.[0] ?? null)}
            />
            {preview ? (
              <img src={preview} alt="Screenshot preview" className="settings-field__preview" />
            ) : null}
          </div>

          {error ? <p className="settings-page__error">{error}</p> : null}
          {successId ? (
            <p className="settings-page__success">
              Thank you! Your report was sent (ref {successId}).
            </p>
          ) : null}

          <button type="submit" className="btn-pill-primary w-full" disabled={submitting}>
            {submitting ? "Sending…" : "Submit report"}
          </button>

          <p className="settings-page__foot">
            <Link href="/discover" className="home-link-text">
              Back to Home
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
