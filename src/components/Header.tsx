"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/browse/fiction", label: "Browse" },
  { href: "/search?q=", label: "Search" },
  { href: "/library", label: "Library" },
  { href: "/upload", label: "Upload" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-charcoal/8 bg-cream/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight text-charcoal hover:text-burgundy transition-colors"
        >
          FEIO
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href.split("?")[0]);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  active
                    ? "bg-burgundy/10 text-burgundy font-medium"
                    : "text-muted hover:text-charcoal hover:bg-charcoal/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button className="sm:hidden p-2 text-muted hover:text-charcoal" aria-label="Menu">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
