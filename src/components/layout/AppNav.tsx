import Link from "next/link";

export type AppNavSection = "lookup" | "review";

const NAV_ITEMS: { href: string; section: AppNavSection; label: string }[] = [
  { href: "/journey", section: "lookup", label: "Vocab Journey" },
  { href: "/learn", section: "review", label: "Review" },
];

export function AppNav({ active }: { active: AppNavSection }) {
  return (
    <nav className="flex gap-1 rounded-xl bg-primary-50 p-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.section === active;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-primary text-foreground shadow-sm"
                : "text-primary-800 hover:text-primary-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
