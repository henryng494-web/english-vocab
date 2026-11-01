import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support | Hỗ trợ — Jungle Jokers",
  description: "Help with Jungle Jokers sign-in, Pro purchases, restoring access and account deletion.",
};

export default function SupportPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl space-y-8 bg-background px-5 py-10 text-foreground">
      <header className="space-y-3">
        <p className="font-semibold text-[#7c3aed]">Jungle Jokers</p>
        <h1 className="text-3xl font-bold">Support / Hỗ trợ</h1>
        <p>No sign-in is needed to read this page. / Không cần đăng nhập để xem trang này.</p>
        <a className="font-semibold text-[#7c3aed] underline" href="mailto:support@junglejokers.com">support@junglejokers.com</a>
      </header>
      <section lang="en" className="space-y-4">
        <h2 className="text-xl font-bold">Help with your app</h2>
        <h3 className="font-semibold">Sign-in</h3>
        <p>Use the email address linked to your Jungle Jokers account. Check your inbox and spam folder for confirmation or password reset emails. Use Forgot password on the sign-in screen if needed.</p>
        <h3 className="font-semibold">Purchased Pro but access is missing?</h3>
        <p>Sign in to the Jungle Jokers account used for your purchase, using the same Apple ID for App Store purchases. Open the Pro upgrade screen and tap Restore purchases. An internet connection is required. If access is still missing, contact us with your app build number and an explanation of the issue. Never send your password or full payment card details.</p>
        <h3 className="font-semibold">Manage or cancel a subscription</h3>
        <p>On iPhone or iPad, open Settings → your name → Subscriptions → Jungle Jokers. Monthly and yearly plans renew automatically until cancelled; lifetime access is a one-time purchase. Deleting the app or your Jungle Jokers account does not cancel an Apple subscription.</p>
        <h3 className="font-semibold">Report a problem</h3>
        <p>Email us the app version/build, your device and iOS version, the steps that caused the problem, and any error message. A screenshot is optional; remove private information before sending it.</p>
        <h3 className="font-semibold">Learning data</h3>
        <p>Some settings and review scheduling are stored on your device. Do not assume that reinstalling the app or switching devices will restore every local setting or review schedule.</p>
      </section>
      <section lang="vi" className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-bold">Hướng dẫn hỗ trợ</h2>
        <h3 className="font-semibold">Đăng nhập</h3>
        <p>Dùng email đã đăng ký Jungle Jokers. Kiểm tra cả hộp thư rác để tìm email xác nhận hoặc đặt lại mật khẩu. Nếu quên mật khẩu, chọn Quên mật khẩu ở màn hình đăng nhập.</p>
        <h3 className="font-semibold">Đã mua nhưng chưa có Pro?</h3>
        <p>Đăng nhập đúng tài khoản Jungle Jokers và dùng Apple ID đã mua gói. Mở màn hình nâng cấp Pro rồi chọn Khôi phục giao dịch khi có kết nối mạng. Nếu vẫn chưa có quyền truy cập, gửi email kèm số build và mô tả lỗi. Không gửi mật khẩu hoặc thông tin thẻ thanh toán đầy đủ.</p>
        <h3 className="font-semibold">Quản lý hoặc hủy gói</h3>
        <p>Vào Cài đặt iPhone/iPad → tên của bạn → Đăng ký → Jungle Jokers. Gói tháng/năm tự gia hạn cho đến khi hủy; gói trọn đời thanh toán một lần. Xóa app hoặc tài khoản Jungle Jokers không tự hủy thuê bao Apple.</p>
        <h3 className="font-semibold">Báo lỗi và dữ liệu học</h3>
        <p>Gửi phiên bản/build app, thiết bị, phiên bản iOS, các bước tái hiện và thông báo lỗi. Có thể đính kèm ảnh đã che thông tin riêng tư. Một số cài đặt và lịch ôn được lưu trên thiết bị; không mặc định rằng cài lại app hoặc đổi máy sẽ khôi phục toàn bộ dữ liệu cục bộ.</p>
      </section>
      <nav aria-label="Support links" className="flex flex-wrap gap-4 border-t pt-6 text-[#7c3aed] underline">
        <Link href="/privacy">Privacy / Bảo mật</Link>
        <Link href="/terms">Terms / Điều khoản</Link>
        <Link href="/delete-account">Delete account / Xóa tài khoản</Link>
      </nav>
    </main>
  );
}
