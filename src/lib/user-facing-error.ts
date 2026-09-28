export function isRlsOrPermissionError(message: string): boolean {
  return /row-level security|permission denied|violates row-level security/i.test(
    message,
  );
}

/** Hide RLS/permission noise from purple error banners; log on server/console only. */
export function sanitizeUserFacingError(
  error: unknown,
  fallback = "Something went wrong",
): string | null {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : fallback;
  if (!message?.trim()) return fallback;
  if (isRlsOrPermissionError(message)) {
    console.warn("[ui] suppressed database policy error:", message);
    return null;
  }
  return message;
}
