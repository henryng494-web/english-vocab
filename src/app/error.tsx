"use client";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
        textAlign: "center",
      }}
    >
      <p>Đã có lỗi xảy ra. Vui lòng thử lại.</p>
      <button type="button" onClick={reset}>
        Thử lại
      </button>
    </div>
  );
}
