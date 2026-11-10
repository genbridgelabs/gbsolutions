import Link from "next/link";

const tabs = [
  { href: "/admin", label: "Form submissions" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/journal", label: "Video journal" },
];

export default function AdminTabs({ active }) {
  return (
    <nav
      aria-label="Studio desk sections"
      className="border-y border-line bg-paper/60"
    >
      <div className="mx-auto flex max-w-[84rem] gap-1 overflow-x-auto px-5 sm:px-8">
        {tabs.map((tab) => {
          const isActive = tab.href === active;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative shrink-0 px-3 py-3.5 text-[0.8rem] transition-colors duration-300 ${
                isActive ? "text-ink" : "text-quiet hover:text-ink"
              }`}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 bottom-0 h-px origin-left bg-brass transition-transform duration-300 ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
