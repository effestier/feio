"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/scriptures", label: "Scriptures" },
  { href: "/teachings", label: "Teachings" },
  { href: "/concepts", label: "Concepts" },
  { href: "/browse/fiction", label: "Library" },
];

const moreLinks = [
  { href: "/heritage", label: "Heritage Sites", icon: "🏛" },
  { href: "/festivals", label: "Festivals", icon: "🪔" },
  { href: "/meditate", label: "Meditate", icon: "🧘" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isMoreActive = moreLinks.some((l) => pathname.startsWith(l.href));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  return (
    <>
      <header className="border-b border-gold/10 bg-cream/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight text-gold hover:text-burgundy-light transition-colors"
          >
            FEIO
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {mainLinks.map(({ href, label }) => {
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
                      ? "bg-gold/15 text-gold font-medium"
                      : "text-muted hover:text-charcoal hover:bg-charcoal/5"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                  isMoreActive
                    ? "bg-gold/15 text-gold font-medium"
                    : "text-muted hover:text-charcoal hover:bg-charcoal/5"
                }`}
              >
                Explore
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-paper border border-gold/15 rounded-xl shadow-xl overflow-hidden z-50">
                  {moreLinks.map(({ href, label, icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          active
                            ? "bg-gold/10 text-gold"
                            : "text-muted hover:bg-charcoal/5 hover:text-charcoal"
                        }`}
                      >
                        <span className="text-base">{icon}</span>
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 text-muted hover:text-charcoal"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 right-0 w-64 h-full bg-cream border-l border-gold/10 p-6">
            <nav className="flex flex-col gap-1 mt-4">
              {[...mainLinks, ...moreLinks.map((l) => ({ href: l.href, label: `${l.icon} ${l.label}` }))].map(
                ({ href, label }) => {
                  const active =
                    href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(href.split("?")[0]);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-2.5 text-sm rounded-lg transition-colors ${
                        active
                          ? "bg-gold/15 text-gold font-medium"
                          : "text-muted hover:text-charcoal hover:bg-charcoal/5"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                }
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
