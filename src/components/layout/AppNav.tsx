import Link from "next/link";

const NAV_ITEMS = [
  { href: "/learn", label: "Học từ" },
  { href: "/discover", label: "Knowledge Map" },
];

export function AppNav({ active }: { active: "learn" | "discover" }) {
  return (
    <nav className="flex gap-1 rounded-xl bg-neutral-100 p-1">
      {NAV_ITEMS.map((item) => {
        const isActive =
          active === "learn"
            ? item.href === "/learn"
            : item.href === "/discover";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-white text-primary shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
