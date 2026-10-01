import Link from "next/link";

type Platform = "x" | "instagram" | "tiktok" | "reddit";

export default function PlatformSwitcher({ activePlatform }: { activePlatform: Platform }) {
  const platforms = [
    { label: "X / Twitter", href: "/", platform: "x" },
    { label: "Instagram", href: "/instagram", platform: "instagram" },
    { label: "TikTok", href: "/tiktok", platform: "tiktok" },
    { label: "Reddit", href: "/reddit", platform: "reddit" },
  ];

  return (
    <nav aria-label="Choose checker" className="mt-7 inline-flex flex-wrap justify-center gap-1 rounded-full border border-stone-300 bg-white p-1">
      {platforms.map((item) => {
        const isActive = item.platform === activePlatform;
        return (
          <Link
            key={item.label}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-amber-50 hover:text-stone-900"}`}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}