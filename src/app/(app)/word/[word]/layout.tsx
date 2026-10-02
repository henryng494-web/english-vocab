/** Placeholder param so `output: "export"` (Capacitor build) can prerender the dynamic word route. */
export function generateStaticParams() {
  return process.env.MOBILE_BUILD === "1" ? [{ word: "_" }] : [];
}

export default function WordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
