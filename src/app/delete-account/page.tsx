import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete your account | Xóa tài khoản – Jungle Jokers",
  description:
    "How to delete your Jungle Jokers account and learning data. Cách xóa tài khoản và dữ liệu học tập Jungle Jokers.",
};

const SUPPORT_EMAIL = "support@junglejokers.com";

function Section({
  lang,
  title,
  intro,
  inAppTitle,
  inAppSteps,
  emailTitle,
  emailBody,
  dataTitle,
  dataItems,
  note,
}: {
  lang: "en" | "vi";
  title: string;
  intro: string;
  inAppTitle: string;
  inAppSteps: string[];
  emailTitle: string;
  emailBody: string;
  dataTitle: string;
  dataItems: string[];
  note: string;
}) {
  return (
    <section lang={lang} className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-foreground/80">{intro}</p>

      <h3 className="text-lg font-semibold text-foreground">{inAppTitle}</h3>
      <ol className="list-decimal space-y-1 pl-6 text-foreground/80">
        {inAppSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h3 className="text-lg font-semibold text-foreground">{emailTitle}</h3>
      <p className="text-foreground/80">
        {emailBody}{" "}
        <a className="font-semibold text-[#7c3aed] underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
      </p>

      <h3 className="text-lg font-semibold text-foreground">{dataTitle}</h3>
      <ul className="list-disc space-y-1 pl-6 text-foreground/80">
        {dataItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-sm text-foreground/60">{note}</p>
    </section>
  );
}

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl space-y-10 bg-background px-5 py-10 text-base">
      <header className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#7c3aed]">Jungle Jokers</p>
        <h1 className="text-3xl font-extrabold text-foreground">
          Delete your account / Xóa tài khoản
        </h1>
      </header>

      <Section
        lang="en"
        title="English"
        intro="You can delete your Jungle Jokers account and all associated learning data at any time. Deletion is permanent and cannot be undone."
        inAppTitle="Option 1: Delete in the app"
        inAppSteps={[
          "Open the Jungle Jokers app.",
          "Go to the Account tab.",
          "Scroll to the bottom and tap the red “Delete account” button.",
          "Confirm in the pop-up. Your data is removed and you are signed out.",
        ]}
        emailTitle="Option 2: Request deletion by email"
        emailBody={`Send an email from the address linked to your account to`}
        dataTitle="What is deleted"
        dataItems={[
          "Your account and sign-in email address.",
          "Your learning progress (words learned, reviews, saved words).",
          "Your placement result and rank preferences.",
          "Local data stored on your device.",
        ]}
        note="Email requests are processed within 30 days. Active subscriptions are managed by the App Store or Google Play and must be cancelled there; deleting your account does not cancel them."
      />

      <Section
        lang="vi"
        title="Tiếng Việt"
        intro="Bạn có thể xóa tài khoản Jungle Jokers và toàn bộ dữ liệu học tập bất cứ lúc nào. Việc xóa là vĩnh viễn và không thể hoàn tác."
        inAppTitle="Cách 1: Xóa trực tiếp trong ứng dụng"
        inAppSteps={[
          "Mở ứng dụng Jungle Jokers.",
          "Vào tab Tài khoản.",
          "Kéo xuống cuối màn hình và bấm nút đỏ “Xóa tài khoản”.",
          "Xác nhận trong pop-up. Dữ liệu sẽ bị xóa và bạn được đăng xuất.",
        ]}
        emailTitle="Cách 2: Gửi email yêu cầu xóa"
        emailBody="Gửi email từ địa chỉ đã liên kết với tài khoản của bạn tới"
        dataTitle="Dữ liệu được xóa"
        dataItems={[
          "Tài khoản và địa chỉ email đăng nhập.",
          "Tiến trình học (từ đã học, lượt ôn tập, từ đã lưu).",
          "Kết quả bài kiểm tra đầu vào và Rank đã chọn.",
          "Dữ liệu lưu trên thiết bị của bạn.",
        ]}
        note="Yêu cầu qua email được xử lý trong vòng 30 ngày. Gói đăng ký do App Store hoặc Google Play quản lý, bạn cần tự hủy tại đó; xóa tài khoản không tự hủy gói."
      />
    </main>
  );
}
