"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { JungleCastPill } from "@/components/mascot/JungleMascot";
import { displayFontClass } from "@/lib/fonts";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="app-screen app-screen--home">
      <AppHeader
        title="About us"
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
        <article className="settings-page px-4 pb-8">
          <div className="home-card border-primary-200 bg-card">
            <JungleCastPill size={28} />
            <h2 className={`home-section-title mt-3 ${displayFontClass}`}>Jungle Jokers</h2>
            <p className="home-body-text mt-2">
              Jungle Jokers is a playful English vocabulary app for Vietnamese learners.
              Four mascot friends — Monkey, Elephant, Crocodile, and Tiger — help you
              remember words with visual stories, spaced review, and daily goals.
            </p>
            <p className="home-body-text mt-3">
              Học từ vựng tiếng Anh mỗi ngày cùng bộ tứ Jungle Jokers: hình ảnh minh họa,
              phát âm tự nhiên, và lịch ôn tập thông minh.
            </p>
          </div>

          <section className="home-card mt-4 border-primary-200 bg-card">
            <h3 className="home-card-title">Our mission</h3>
            <p className="home-body-text mt-2">
              Make high-frequency English words stick through clear meaning, memorable
              images, and short daily sessions you can actually keep.
            </p>
          </section>

          <section className="home-card mt-4 border-primary-200 bg-card">
            <h3 className="home-card-title">Contact</h3>
            <p className="home-body-text mt-2">
              Questions or partnership ideas? Use <strong>Report a bug</strong> in the menu
              and we&apos;ll get back to you.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
